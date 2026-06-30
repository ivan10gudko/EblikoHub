package project_z.demo.repositories.Specifications.views;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.domain.Specification;

import jakarta.persistence.criteria.Root;
import jakarta.persistence.criteria.Subquery;
import project_z.demo.entity.RoomTitleLinkEntity;
import project_z.demo.entity.views.RoomTitleStatsView;
import project_z.demo.enums.TitleStatus;
import project_z.demo.enums.TitleType;

public class RoomTitleStatsSpecifications {

    public static Specification<RoomTitleStatsView> hasRoomId(Long roomId) {
        return (root, query, cb) -> cb.equal(root.get("roomId"), roomId);
    }

    public static Specification<RoomTitleStatsView> hasStatus(String status) {
        if (status == null)
            return null;
        return (root, query, cb) -> {
            Subquery<Long> subquery = query.subquery(Long.class);
            Root<RoomTitleLinkEntity> subRoot = subquery.from(RoomTitleLinkEntity.class);
            subquery.select(subRoot.get("roomTitle").get("id"))
                    .where(cb.and(
                            cb.equal(subRoot.get("roomTitle").get("id"), root.get("id")),
                            cb.equal(subRoot.get("userTitleRecord").get("status"), status)));
            return cb.exists(subquery);
        };
    }

    public static Specification<RoomTitleStatsView> hasUserTypes(List<TitleType> types,UUID currentUserId) {
        if (types == null || types.isEmpty())
            return null;

        return (root, query, cb) -> {
            Subquery<UUID> subquery = query.subquery(UUID.class);
            Root<RoomTitleLinkEntity> subRoot = subquery.from(RoomTitleLinkEntity.class);

            subquery.select(subRoot.get("roomTitle").get("id"))
                    .where(cb.and(
                            cb.equal(subRoot.get("userTitleRecord").get("user").get("userId"), currentUserId),
                            subRoot.get("userTitleRecord").get("titleType").in(types)));

            return cb.in(root.get("id")).value(subquery);
        };
    }
}