package project_z.demo.repositories.Specifications;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.domain.Specification;

import jakarta.persistence.criteria.Expression;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.JoinType;
import jakarta.persistence.criteria.Order;
import jakarta.persistence.criteria.Root;
import jakarta.persistence.criteria.Subquery;
import project_z.demo.entity.RoomTitleLinkEntity;
import project_z.demo.entity.TitleEntity;
import project_z.demo.entity.TitleRatingEntity;
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

            Join<TitleEntity, TitleRatingEntity> ratings = root.join("ratings", JoinType.LEFT);

            query.groupBy(root.get("titleId"));

            Expression<Float> overallValue = cb.max(
                    cb.selectCase()
                            .when(cb.equal(ratings.get("name"), "overall"), ratings.get("value"))
                            .otherwise(-1f)
                            .as(Float.class));

            Order pinnedOrder = cb.desc(root.get("isPinned"));

            if ("desc".equalsIgnoreCase(order)) {
                query.orderBy(
                        pinnedOrder,
                        cb.desc(overallValue),
                        cb.asc(root.get("titleName")),
                        cb.asc(root.get("titleId")));
            } else {
                Expression<Integer> hasRating = cb.max(
                        cb.<Integer>selectCase()
                                .when(cb.equal(ratings.get("name"), "overall"), 1)
                                .otherwise(0)
                                .as(Integer.class));

                query.orderBy(
                        pinnedOrder,
                        cb.desc(hasRating),
                        cb.asc(overallValue),
                        cb.asc(root.get("titleName")),
                        cb.asc(root.get("titleId")));
            }

            return null;
        };
    }

    public static Specification<TitleEntity> sortByAvgRating(String order) {
        return (root, query, cb) -> {
            if (query.getResultType() == Long.class || query.getResultType() == long.class) {
                return null;
            }

            Subquery<Double> subquery = query.subquery(Double.class);
            Root<TitleEntity> subRoot = subquery.correlate(root);

            Join<TitleEntity, TitleRatingEntity> ratings = subRoot.join("ratings", JoinType.LEFT);

            subquery.select(cb.avg(ratings.get("value")))
                    .where(cb.notEqual(ratings.get("name"), "overall"));

            Order pinnedOrder = cb.desc(root.get("isPinned"));

            if ("desc".equalsIgnoreCase(order)) {
                Expression<Double> avgWithCoalesce = cb.coalesce(subquery, -1.0);

                query.orderBy(
                        pinnedOrder,
                        cb.desc(avgWithCoalesce),
                        cb.asc(root.get("titleName")),
                        cb.asc(root.get("titleId")));
            } else {
                Expression<Double> avgWithCoalesce = cb.coalesce(subquery, 99.0);

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
            Subquery<Long> subquery = query.subquery(Long.class);
            Root<RoomTitleLinkEntity> link = subquery.from(RoomTitleLinkEntity.class);

            subquery.select(link.get("userTitleRecord").get("titleId"));

            subquery.where(cb.and(
                    cb.equal(link.get("roomTitle").get("room").get("id"), roomId),
                    cb.equal(link.get("userTitleRecord").get("user").get("userId"), userId)));

            return cb.not(root.get("titleId").in(subquery));
        };
    }
}