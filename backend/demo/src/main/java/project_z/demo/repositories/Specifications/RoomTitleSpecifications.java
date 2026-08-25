package project_z.demo.repositories.Specifications;

import java.util.UUID;

import org.springframework.data.jpa.domain.Specification;

import jakarta.persistence.criteria.Root;
import jakarta.persistence.criteria.Subquery;
import project_z.demo.entity.RoomTitleEntity;
import project_z.demo.entity.RoomTitleLinkEntity;

public class RoomTitleSpecifications {
    public static Specification<RoomTitleEntity> hasRoomId(Long roomId) {
        return (root, query, cb) -> cb.equal(root.get("room").get("id"), roomId);
    }

    public static Specification<RoomTitleEntity> hasTitleNameLike(String search) {
        return (root, query, cb) -> {
            if (search == null || search.isBlank())
                return null;
            return cb.like(cb.lower(root.get("titleName")), "%" + search.toLowerCase() + "%");
        };
    }

    public static Specification<RoomTitleEntity> notLinkedByUser(Long roomId, UUID userId) {
        return (root, query, cb) -> {
            Subquery<UUID> subquery = query.subquery(UUID.class);
            Root<RoomTitleLinkEntity> link = subquery.from(RoomTitleLinkEntity.class);

            subquery.select(link.get("roomTitle").get("id"));
            subquery.where(cb.and(
                    cb.equal(link.get("roomTitle").get("room").get("id"), roomId),
                    cb.equal(link.get("userTitleRecord").get("user").get("userId"), userId)));

            return cb.not(root.get("id").in(subquery));
        };
    }
}