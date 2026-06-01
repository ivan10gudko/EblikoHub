package project_z.demo.services;

import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;

import project_z.demo.dto.FriendshipDtos.FriendshipDetailsDto;
import project_z.demo.dto.FriendshipDtos.FriendshipPartialUpdateDto;
import project_z.demo.entity.FriendshipEntity;
import project_z.demo.entity.UserEntity;

@Service
public interface FriendshipService {
    FriendshipDetailsDto save(FriendshipEntity user);
    FriendshipDetailsDto findOne(UUID id);
    List<UserEntity> findFriendsByUserId(UUID userId);
    FriendshipDetailsDto partialUpdate(UUID id, FriendshipPartialUpdateDto updateDto);
    void deleteFriendById(UUID id);
    void sendFriendRequest(UUID senderId, UUID receiverId);
    void acceptFriendRequest(UUID receiverId, UUID senderId);
    void rejectFriendRequest(UUID receiverId, UUID senderId);
}
