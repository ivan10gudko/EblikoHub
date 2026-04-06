package project_z.demo.repositories.Specifications;
import java.util.UUID;

import org.springframework.data.jpa.domain.Specification;

import jakarta.persistence.criteria.Expression;
import jakarta.persistence.criteria.JoinType;
import jakarta.persistence.criteria.MapJoin;
import project_z.demo.entity.TitleEntity;
import project_z.demo.enums.TitleStatus;

public class TitleSpecifications {
    public static Specification<TitleEntity> belongsToUser(UUID userId) {
        return (root, query, cb) -> cb.equal(root.get("user").get("userId"), userId);
    }

    public static Specification<TitleEntity> hasStatus(TitleStatus status) {
        return (root, query, cb) -> (status == null) ? null : cb.equal(root.get("status"), status);
    }
    public static Specification<TitleEntity> hasName(String titleName){
        return(root, query,cb) -> (titleName == null || titleName.equals("")) ? null :cb.like(
            cb.lower(root.get("titleName")), "%" + titleName.toLowerCase() + "%");
    }
    public static Specification<TitleEntity> sortByRating(String order){
        return (root, query, cb) -> {
        MapJoin<TitleEntity, String, Float> ratings = root.joinMap("rating", JoinType.LEFT);
        
        query.groupBy(root.get("id"));

        Expression<Float> overallValue = cb.max(
            cb.selectCase()
                .when(cb.equal(ratings.key(), "overall"), ratings.value())
                .otherwise(0f)
                .as(Float.class)
        );

        if ("desc".equalsIgnoreCase(order)) {
            query.orderBy(cb.desc(overallValue));
        } else {
            query.orderBy(cb.asc(overallValue));
        }
        
        return null;
    };
}

}