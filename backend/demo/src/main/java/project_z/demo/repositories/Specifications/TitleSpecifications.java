package project_z.demo.repositories.Specifications;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.domain.Specification;

import jakarta.persistence.criteria.Expression;
import jakarta.persistence.criteria.JoinType;
import jakarta.persistence.criteria.MapJoin;
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
            MapJoin<TitleEntity, String, Float> ratings = root.joinMap("rating", JoinType.LEFT);

            query.groupBy(root.get("id"));

            Expression<Float> overallValue = cb.max(
                    cb.selectCase()
                            .when(cb.equal(ratings.key(), "overall"), ratings.value())
                            .otherwise(-1f) 
                            .as(Float.class));

            if ("desc".equalsIgnoreCase(order)) {
                query.orderBy(
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
                        cb.desc(hasRating),   
                        cb.asc(overallValue), 
                        cb.asc(root.get("titleName")),
                        cb.asc(root.get("id")));
            }

            return null;
        };
}}