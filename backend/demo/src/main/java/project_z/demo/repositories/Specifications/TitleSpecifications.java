package project_z.demo.repositories.Specifications;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.domain.Specification;

import jakarta.persistence.criteria.Expression;
import jakarta.persistence.criteria.JoinType;
import jakarta.persistence.criteria.MapJoin;
import jakarta.persistence.criteria.Order;
import jakarta.persistence.criteria.Root;
import jakarta.persistence.criteria.Subquery;
import project_z.demo.entity.RoomTitleLinkEntity;
import project_z.demo.entity.TitleEntity;
import project_z.demo.enums.TitleStatus;
import project_z.demo.enums.TitleType;

public class TitleSpecifications {
    public static Specification<TitleEntity> belongsToUser(UUID userId) {
        return (root, query, cb) -> cb.equal(root.get("user").get("userId"), userId);
    }

    public static Specification<TitleEntity> hasStatus(TitleStatus status) {
        return (root, query, cb) -> (status == null) ? null : cb.equal(root.get("status"), status);
    }

    public static Specification<TitleEntity> hasName(String titleName) {
        return (root, query, cb) -> (titleName == null || titleName.equals("")) ? null
                : cb.like(
                        cb.lower(root.get("titleName")), "%" + titleName.toLowerCase() + "%");
    }

    public static Specification<TitleEntity> hasTitleTypes(List<TitleType> types) {
        return (root, query, cb) -> {
            if (types == null || types.isEmpty()) {
                return null;
            }
            return root.get("titleType").in(types);
        };
    }

    public static Specification<TitleEntity> sortByRating(String order) {
        return (root, query, cb) -> {
            if (query.getResultType() == Long.class || query.getResultType() == long.class) {
                return null;
            }
            MapJoin<TitleEntity, String, Float> ratings = root.joinMap("rating", JoinType.LEFT);

            query.groupBy(root.get("id"));

            Expression<Float> overallValue = cb.max(
                    cb.selectCase()
                            .when(cb.equal(ratings.key(), "overall"), ratings.value())
                            .otherwise(-1f)
                            .as(Float.class));

            Order pinnedOrder = cb.desc(root.get("isPinned"));

            if ("desc".equalsIgnoreCase(order)) {

                query.orderBy(
                        pinnedOrder,
                        cb.desc(overallValue),
                        cb.asc(root.get("titleName")),
                        cb.asc(root.get("id")));
            } else {
                Expression<Integer> hasRating = cb.max(
                        cb.<Integer>selectCase()
                                .when(cb.equal(ratings.key(), "overall"), 1)
                                .otherwise(0)
                                .as(Integer.class));

                query.orderBy(
                        pinnedOrder,
                        cb.desc(hasRating),
                        cb.asc(overallValue),
                        cb.asc(root.get("titleName")),
                        cb.asc(root.get("id")));
            }

            return null;
        };
    }

    public static Specification<TitleEntity> sortByAvgRating(String order) {
        return (root, query, cb) -> {
            if (query.getResultType() == Long.class || query.getResultType() == long.class) {
                return null;
            }

            jakarta.persistence.criteria.Subquery<Double> subquery = query.subquery(Double.class);
            jakarta.persistence.criteria.Root<TitleEntity> subRoot = subquery.correlate(root);
            MapJoin<TitleEntity, String, Float> ratings = subRoot.joinMap("rating", JoinType.LEFT);

            subquery.select(cb.avg(ratings.value()))
                    .where(cb.notEqual(ratings.key(), "overall"));

            jakarta.persistence.criteria.Order pinnedOrder = cb.desc(root.get("isPinned"));

            if ("desc".equalsIgnoreCase(order)) {
                jakarta.persistence.criteria.Expression<Double> avgWithCoalesce = cb.coalesce(subquery, -1.0);

                query.orderBy(
                        pinnedOrder,
                        cb.desc(avgWithCoalesce),
                        cb.asc(root.get("titleName")),
                        cb.asc(root.get("titleId")));
            } else {
                jakarta.persistence.criteria.Expression<Double> avgWithCoalesce = cb.coalesce(subquery, 99.0);

                query.orderBy(
                        pinnedOrder,
                        cb.asc(avgWithCoalesce),
                        cb.asc(root.get("titleName")),
                        cb.asc(root.get("titleId")));
            }

            return null;
        };
    }

    public static Specification<TitleEntity> notLinkedToRoom(Long roomId, UUID userId) {
        return (root, query, cb) -> {
            // Ми хочемо вибрати тайтли поточного користувача
            // які НЕ знаходяться в таблиці лінків для КОНКРЕТНОГО roomId

            Subquery<Long> subquery = query.subquery(Long.class);
            Root<RoomTitleLinkEntity> link = subquery.from(RoomTitleLinkEntity.class);

            // Вибираємо ID тайтла (який лежить у полі userTitleRecord)
            subquery.select(link.get("userTitleRecord").get("titleId"));

            // ВАЖЛИВО: Join тільки до roomTitle, щоб дістати room_id
            // НЕ джойнимося до Titles або Users всередині підзапиту, якщо це можливо
            subquery.where(cb.and(
                    cb.equal(link.get("roomTitle").get("room").get("id"), roomId),
                    cb.equal(link.get("userTitleRecord").get("user").get("userId"), userId)));

            return cb.not(root.get("titleId").in(subquery));
        };
    }
}