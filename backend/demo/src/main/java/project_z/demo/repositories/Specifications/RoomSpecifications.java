package project_z.demo.repositories.Specifications;

import java.util.UUID;

import org.springframework.data.jpa.domain.Specification;

import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.JoinType;
import project_z.demo.entity.RoomEntity;
import project_z.demo.entity.UserEntity;

public class RoomSpecifications {

    public static Specification<RoomEntity> sortByMembersCount(String order) {

        return (root, query, criteriaBuilder) -> {

            Join<RoomEntity, UserEntity> membersJoin = root.join("members", JoinType.LEFT);

            query.groupBy(root.get("roomId"));

            if ("desc".equalsIgnoreCase(order)) {
                query.orderBy(criteriaBuilder.desc(criteriaBuilder.count(membersJoin)));
            } else {
                query.orderBy(criteriaBuilder.asc(criteriaBuilder.count(membersJoin)));
            }

            return null;
        };
    }

    public static Specification<RoomEntity> hasMember(UUID userId) {
        return (root, query, criteriaBuilder) -> {
            if (userId == null)
                return null;
            return criteriaBuilder.equal(root.join("members").get("userId"), userId);
        };
    }
}
