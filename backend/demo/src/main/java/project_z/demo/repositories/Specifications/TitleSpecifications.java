package project_z.demo.repositories.Specifications;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.domain.Specification;

import jakarta.persistence.criteria.Expression;
import jakarta.persistence.criteria.JoinType;
import jakarta.persistence.criteria.MapJoin;
import jakarta.persistence.criteria.Order;
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
            // Захист від COUNT-запиту пагінації.
            if (query.getResultType() == Long.class || query.getResultType() == long.class) {
                return null;
            }

            // 1. Створюємо Correlated Subquery до таблиці рейтингів
            jakarta.persistence.criteria.Subquery<Double> subquery = query.subquery(Double.class);
            jakarta.persistence.criteria.Root<TitleEntity> subRoot = subquery.correlate(root);
            MapJoin<TitleEntity, String, Float> ratings = subRoot.joinMap("rating", JoinType.LEFT);

            subquery.select(cb.avg(ratings.value()))
                    .where(cb.notEqual(ratings.key(), "overall"));

            // 2. Дефолтний пріоритет для закріплених
            jakarta.persistence.criteria.Order pinnedOrder = cb.desc(root.get("isPinned"));

            // 3. Обходимо відсутність .nullsLast() через cb.coalesce на рівні бази даних
            if ("desc".equalsIgnoreCase(order)) {
                // Якщо NULL (немає оцінок) -> даємо -1.0, щоб вони впали вниз списку DESC
                jakarta.persistence.criteria.Expression<Double> avgWithCoalesce = cb.coalesce(subquery, -1.0);

                query.orderBy(
                        pinnedOrder,
                        cb.desc(avgWithCoalesce),
                        cb.asc(root.get("titleName")),
                        cb.asc(root.get("titleId")) // Виправив на titleId з твоєї сутності
                );
            } else {
                // Якщо NULL (немає оцінок) -> даємо 99.0, щоб вони впали вниз списку ASC
                jakarta.persistence.criteria.Expression<Double> avgWithCoalesce = cb.coalesce(subquery, 99.0);

                query.orderBy(
                        pinnedOrder,
                        cb.asc(avgWithCoalesce),
                        cb.asc(root.get("titleName")),
                        cb.asc(root.get("titleId")) // Виправив на titleId з твоєї сутності
                );
            }

            return null;
        };
    }
}