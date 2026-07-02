package project_z.demo.repositories.Specifications;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.domain.Specification;

import jakarta.persistence.criteria.Join;
import project_z.demo.entity.RoomTitleEntity;
import project_z.demo.entity.RoomTitleLinkEntity;
import project_z.demo.entity.TitleEntity;

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
}