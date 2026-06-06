package project_z.demo.repositories.Specifications;

import java.util.UUID;

import org.springframework.data.jpa.domain.Specification;

import project_z.demo.entity.RoomEntity;



public class RoomSpecifications {

    public static Specification<RoomEntity> hasMember(UUID userId) {
        return (root, query, criteriaBuilder) -> {
            if (userId == null) return null;

            return criteriaBuilder.equal(root.join("members").get("userId"), userId);
        };
    }
}