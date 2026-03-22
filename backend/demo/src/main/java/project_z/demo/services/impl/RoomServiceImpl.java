package project_z.demo.services.impl;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import project_z.demo.JavaUtil.BeanUtilsHelper;
import project_z.demo.Mappers.Mapper;
import project_z.demo.dto.RoomDtos.RoomCreateDto;
import project_z.demo.dto.RoomDtos.RoomDto;
import project_z.demo.entity.RoomEntity;
import project_z.demo.entity.UserEntity;
import project_z.demo.repositories.RoomRepository;
import project_z.demo.repositories.UserRepository;
import project_z.demo.security.JwtService;
import project_z.demo.services.RoomService;

@Service
public class RoomServiceImpl implements RoomService {

    @Autowired
    private RoomRepository roomRepository;
    @Autowired
    private BeanUtilsHelper beanUtilsHelper;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private JwtService jwtService;
    @Autowired
    private Mapper<RoomEntity,RoomDto> roomMapper;
    @Override
    public RoomEntity save(RoomEntity roomEntity){
        return roomRepository.save(roomEntity);
    }
    @Override
    public List<RoomEntity> getRoomsByUserId(UUID userId) {
        return roomRepository.findAllByMembers_UserId(userId);
    }
    @Override
    public List<RoomEntity> findAll(){
        return  StreamSupport.stream( 
        roomRepository.findAll().spliterator(),
        false)
        .collect(Collectors.toList());
    }
    @Override
    public RoomEntity partialUpdate(Long id, RoomEntity source) {
    return roomRepository.findById(id)
        .map(target -> {
            beanUtilsHelper.copyNonNullProperties(source, target);
            return roomRepository.save(target);
        })
        .orElseThrow(() -> new RuntimeException("User not found"));
    }
    @Override
    public boolean isExists(Long id){
        return roomRepository.existsById(id);
    }
    @Override
    public Optional<RoomEntity> findOne(Long id){
        return roomRepository.findById(id);
    }
    @Override
    public void deleteById(Long Id){
        roomRepository.deleteById(Id);
    }
    @Override
    @Transactional
    public RoomEntity addMembersToRoom(Long roomId, List<UUID> userIds){
        RoomEntity roomEntity = roomRepository.findById(roomId).orElseThrow(
            ()-> new RuntimeException("Room not found")
        );
        List<UserEntity> users = StreamSupport
        .stream(userRepository.findAllById(userIds).spliterator(), false)
        .collect(Collectors.toList());
        List<UserEntity> newUsers = users
        .stream().filter(u-> !roomEntity.getMembers().contains(u))
        .collect(Collectors.toList());
        roomEntity.getMembers().addAll(newUsers);
        return roomRepository.save(roomEntity);
    }
   
    @Override
    public void deleteMembers(Long roomId, List<UUID> userIds){
        RoomEntity roomEntity = roomRepository.findById(roomId).orElseThrow(
            ()-> new RuntimeException("Room not found")
        );
        
        roomEntity.getMembers().removeIf(user -> userIds.contains(user.getUserId()));
        roomRepository.save(roomEntity);
    }

    @Override
    public RoomDto createRoom(String token, RoomCreateDto dto){
        UUID ownerId = jwtService.extractUsername(token);
        UserEntity owner = userRepository.findById(ownerId)
        .orElseThrow(() -> new EntityNotFoundException ("Owner not found"));
        List<UserEntity> members = new ArrayList<>();
    if (dto.getMembers() != null && !dto.getMembers().isEmpty()) {
        Iterable<UserEntity> membersIterable = userRepository.findAllById(dto.getMembers());
        members = StreamSupport.stream(membersIterable.spliterator(),false)
                                                .collect(Collectors.toList());
    }

    RoomEntity roomEntity = RoomEntity.builder()
            .roomName(dto.getRoomName())
            .owner(owner)
            .members(members)
            .build();

    RoomEntity savedRoom = roomRepository.save(roomEntity);
    return roomMapper.mapTo(savedRoom);
    }
}
