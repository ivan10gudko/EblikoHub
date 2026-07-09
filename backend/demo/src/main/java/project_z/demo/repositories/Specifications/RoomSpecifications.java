package project_z.demo.repositories.Specifications;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.domain.Specification;

import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.Order;
import jakarta.persistence.criteria.Root;
import jakarta.persistence.criteria.Subquery;
import project_z.demo.entity.RoomEntity;
import project_z.demo.entity.RoomMemberEntity;
import project_z.demo.entity.RoomTitleEntity;
import project_z.demo.entity.RoomTitleLinkEntity;
import project_z.demo.entity.TitleEntity;

public class RoomSpecifications {

    public static Specification<RoomEntity> hasMember(UUID userId) {
        return (root, query, criteriaBuilder) -> {
            if (userId == null)
                return null;

            Subquery<Long> subquery = query.subquery(Long.class);
            Root<RoomMemberEntity> memberRoot = subquery.from(RoomMemberEntity.class);

            subquery.select(memberRoot.get("room").get("roomId"))
                    .where(criteriaBuilder.and(
                            criteriaBuilder.equal(memberRoot.get("user").get("userId"), userId)));

            return root.get("roomId").in(subquery);
        };
    }

    public static Specification<RoomEntity> hasNameLike(String search) {
        return (root, query, cb) -> {
            if (search == null || search.isBlank())
                return cb.conjunction();
            return cb.like(cb.lower(root.get("roomName")), "%" + search.toLowerCase() + "%");
        };
    }

    public static Specification<RoomEntity> sortByMemberCount(String order) {
        return (root, query, cb) -> {
            if (Long.class.equals(query.getResultType())) {
                return cb.conjunction();
            }

            Subquery<Long> subquery = query.subquery(Long.class);
            Root<RoomMemberEntity> m = subquery.from(RoomMemberEntity.class);
            subquery.select(cb.count(m))
                    .where(cb.equal(m.get("room").get("roomId"), root.get("roomId")));

            Order countOrder = order.equalsIgnoreCase("asc") ? cb.asc(subquery) : cb.desc(subquery);
            Order idOrder = cb.desc(root.get("roomId"));

            query.orderBy(countOrder, idOrder);

            return null;
        };
    }

    public static Specification<RoomEntity> sortByPinnedThenUser(UUID userId, String sortBy, String order) {
        return (root, query, cb) -> {
            if (Long.class.equals(query.getResultType())) {
                return cb.conjunction();
            }

            Subquery<Integer> pinnedSub = query.subquery(Integer.class);
            Root<RoomMemberEntity> pm = pinnedSub.from(RoomMemberEntity.class);
            pinnedSub.select(
                    cb.<Integer>selectCase()
                            .when(cb.isTrue(pm.get("isPinned")), 1)
                            .otherwise(0))
                    .where(
                            cb.equal(pm.get("room").get("roomId"), root.get("roomId")),
                            cb.equal(pm.get("user").get("userId"), userId));

            Order pinnedOrder = cb.desc(pinnedSub);

            Order secondaryOrder;
            if ("memberCount".equalsIgnoreCase(sortBy) || "membersCount".equalsIgnoreCase(sortBy)) {
                Subquery<Long> countSub = query.subquery(Long.class);
                Root<RoomMemberEntity> cm = countSub.from(RoomMemberEntity.class);

                countSub.select(cb.count(cm.get("id")))
                        .where(cb.equal(cm.get("room").get("roomId"), root.get("roomId")));
                secondaryOrder = "asc".equalsIgnoreCase(order) ? cb.asc(countSub) : cb.desc(countSub);
            } else {
                String property = "roomName".equalsIgnoreCase(sortBy) ? "roomName" : "createdAt";
                secondaryOrder = "asc".equalsIgnoreCase(order)
                        ? cb.asc(root.get(property))
                        : cb.desc(root.get(property));
            }

            query.orderBy(pinnedOrder, secondaryOrder);

            return null;
        };
    }

    public static Specification<RoomTitleEntity> hasRoomId(Long roomId) {
        return (root, query, cb) -> cb.equal(root.get("roomId"), roomId);
    }

    public static Specification<RoomTitleEntity> hasStatusForMembers(List<UUID> memberIds, String status) {
        if (status == null)
            return null;
        return (root, query, cb) -> {
            Join<RoomTitleEntity, RoomTitleLinkEntity> linkJoin = root.join("links");
            Join<RoomTitleLinkEntity, TitleEntity> titleJoin = linkJoin.join("title");
            return cb.and(
                    titleJoin.get("user").get("id").in(memberIds),
                    cb.equal(titleJoin.get("status"), status));
        };
    }
}