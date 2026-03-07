package project_z.demo.repositories.Specifications;
import java.util.UUID;

import org.springframework.data.jpa.domain.Specification;

import project_z.demo.entity.TitleEntity;

public class TitleSpecifications {
    public static Specification<TitleEntity> belongsToUser(UUID userId) {
        return (root, query, cb) -> cb.equal(root.get("user").get("userId"), userId);
    }

    public static Specification<TitleEntity> hasStatus(TitleEntity.titleStatus status) {
        return (root, query, cb) -> (status == null) ? null : cb.equal(root.get("status"), status);
    }
}