package project_z.demo.repositories.Specifications;
import java.util.UUID;

import org.springframework.data.jpa.domain.Specification;

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

}