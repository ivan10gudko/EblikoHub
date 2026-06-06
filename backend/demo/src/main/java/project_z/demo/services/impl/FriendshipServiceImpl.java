package project_z.demo.services.impl;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lombok.RequiredArgsConstructor;
import project_z.demo.JavaUtil.PatchHelper;
import project_z.demo.Mappers.Mapper;
import project_z.demo.common.Exceptions.FriendshipConflictException;
import project_z.demo.common.Exceptions.ResourceNotFoundException;
import project_z.demo.common.Exceptions.SelfFriendRequestException;
import project_z.demo.dto.FriendshipDtos.FriendRequestDto;
import project_z.demo.dto.FriendshipDtos.FriendshipCountsDto;
import project_z.demo.dto.FriendshipDtos.FriendshipDetailsDto;
import project_z.demo.dto.FriendshipDtos.FriendshipPartialUpdateDto;
import project_z.demo.dto.UserDtos.UserDto;
import project_z.demo.entity.FriendshipEntity;
import project_z.demo.entity.UserEntity;
import project_z.demo.enums.FriendshipStatus;
import project_z.demo.repositories.FriendshipRepository;
import project_z.demo.repositories.UserRepository;
import project_z.demo.services.FriendshipService;

@Service
@RequiredArgsConstructor
public class FriendshipServiceImpl implements FriendshipService {

    private final PatchHelper patchHelper;
    private final FriendshipRepository friendshipRepository;
    private final UserRepository userRepository;
    private final Mapper<FriendshipEntity, FriendshipDetailsDto> friendshipMapper;
    private final Mapper<UserEntity, UserDto> userMapper;

    @Override
    @Transactional
    public FriendshipDetailsDto save(FriendshipEntity friendship) {
        FriendshipEntity saved = friendshipRepository.save(friendship);
        return friendshipMapper.mapTo(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public FriendshipDetailsDto findOne(UUID id) {
        FriendshipEntity friendship = friendshipRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Friendship record not found with id: " + id));
        return friendshipMapper.mapTo(friendship);
    }

    @Override
    @Transactional(readOnly = true)
    public List<UserEntity> findFriendsByUserId(UUID userId) {
        Sort sortByName = Sort.by(Sort.Direction.ASC, "name");
        return friendshipRepository.findFriendsByUserId(userId, sortByName);
    }


    @Override
    @Transactional(readOnly = true)
    public List<FriendRequestDto> findPendingFriendRequestsByUserId(UUID userId) {
        List<FriendshipEntity> friends = friendshipRepository.findByReceiverUserIdAndStatus(userId,
                FriendshipStatus.PENDING);

        return friends.stream().map(item -> {
            UserEntity sender = item.getSender();
            UserDto senderDto = userMapper.mapTo(sender);
            
            return new FriendRequestDto(item.getFriendshipId(), senderDto);
        }).collect(Collectors.toList());
    }


    @Override
    @Transactional(readOnly = true)
    public List<FriendRequestDto> findSentFriendRequestsByUserId(UUID userId) {
        List<FriendshipEntity> sentFriendships = friendshipRepository.findBySenderUserIdAndStatus(userId,
                FriendshipStatus.PENDING);

        return sentFriendships.stream().map(friendship -> {
            UserEntity receiver = friendship.getReceiver();
            UserDto receiverDto = userMapper.mapTo(receiver);
            
            return new FriendRequestDto(friendship.getFriendshipId(), receiverDto);
        }).collect(Collectors.toList());
    }

    @Override
    @Transactional
    public FriendshipDetailsDto partialUpdate(UUID id, FriendshipPartialUpdateDto updateDto) {
        FriendshipEntity friendshipEntity = friendshipRepository.findById(id)
                .map(target -> {
                    patchHelper.updateIfPresent(updateDto.getStatus(), target::setStatus);
                    return friendshipRepository.save(target);
                })
                .orElseThrow(() -> new ResourceNotFoundException("Friendship record not found with id: " + id));
        return friendshipMapper.mapTo(friendshipEntity);
    }

    @Override
    @Transactional
    public void deleteFriendById(UUID id) {
        if (!friendshipRepository.existsById(id)) {
            throw new ResourceNotFoundException("Friendship record not found with id: " + id);
        }
        friendshipRepository.deleteById(id);
    }

    @Override
    @Transactional
    public void sendFriendRequest(UUID senderId, UUID receiverId) {
        if (senderId.equals(receiverId)) {
            throw new SelfFriendRequestException("You cannot send a friend request to yourself.");
        }

        Optional<FriendshipEntity> existingFriendship = friendshipRepository
                .findBySenderUserIdAndReceiverUserId(senderId, receiverId)
                .or(() -> friendshipRepository.findBySenderUserIdAndReceiverUserId(receiverId, senderId));

        if (existingFriendship.isPresent()) {
            FriendshipEntity friendship = existingFriendship.get();

            if (friendship.getStatus() == FriendshipStatus.ACCEPTED) {
                throw new FriendshipConflictException("You are already friends.");
            }

            if (friendship.getStatus() == FriendshipStatus.PENDING) {
                throw new FriendshipConflictException("Friend request has already been sent and is pending.");
            }

            if (friendship.getStatus() == FriendshipStatus.REJECTED) {
                if (friendship.getReceiver().getUserId().equals(senderId)) {
                    friendship.setSender(userRepository.findById(senderId).orElseThrow());
                    friendship.setReceiver(userRepository.findById(receiverId).orElseThrow());
                    friendship.setStatus(FriendshipStatus.PENDING);
                    friendshipRepository.save(friendship);
                    return;
                } else {
                    throw new FriendshipConflictException("Your previous friend request was rejected by this user.");
                }
            }
        }

        UserEntity sender = userRepository.findById(senderId)
                .orElseThrow(() -> new ResourceNotFoundException("Sender not found."));
        UserEntity receiver = userRepository.findById(receiverId)
                .orElseThrow(() -> new ResourceNotFoundException("Receiver not found."));

        FriendshipEntity newFriendship = new FriendshipEntity();
        newFriendship.setSender(sender);
        newFriendship.setReceiver(receiver);
        newFriendship.setStatus(FriendshipStatus.PENDING);
        friendshipRepository.save(newFriendship);
    }

    @Override
    @Transactional
    public void acceptFriendRequest(UUID receiverId, UUID senderId) {
        FriendshipEntity friendship = friendshipRepository
                .findBySenderUserIdAndReceiverUserIdAndStatus(senderId, receiverId, FriendshipStatus.PENDING)
                .orElseThrow(
                        () -> new ResourceNotFoundException("Friend request not found or has already been processed."));

        friendship.setStatus(FriendshipStatus.ACCEPTED);
        friendshipRepository.save(friendship);
    }

    @Override
    @Transactional
    public void rejectFriendRequest(UUID receiverId, UUID senderId) {
        FriendshipEntity friendship = friendshipRepository
                .findBySenderUserIdAndReceiverUserIdAndStatus(senderId, receiverId, FriendshipStatus.PENDING)
                .orElseThrow(() -> new FriendshipConflictException(
                        "Friend request not found or has already been processed."));

        friendship.setStatus(FriendshipStatus.REJECTED);
        friendshipRepository.save(friendship);
    }

    @Override
@Transactional(readOnly = true)
public FriendshipCountsDto getUserFriendshipStats(UUID userId) {
    
    long friendsCount = friendshipRepository.countBySenderUserIdAndStatusOrReceiverUserIdAndStatus(
            userId, FriendshipStatus.ACCEPTED, userId, FriendshipStatus.ACCEPTED
    );

    long pendingCount = friendshipRepository.countByReceiverUserIdAndStatus(userId, FriendshipStatus.PENDING);

    long sentCount = friendshipRepository.countBySenderUserIdAndStatus(userId, FriendshipStatus.PENDING);

    return new FriendshipCountsDto(friendsCount, pendingCount, sentCount);
}
}