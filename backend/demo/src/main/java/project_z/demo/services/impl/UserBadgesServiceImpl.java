package project_z.demo.services.impl;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lombok.RequiredArgsConstructor;
import project_z.demo.Mappers.Mapper;
import project_z.demo.dto.UserBadgesDtos.UserBadgesDetailsDto;
import project_z.demo.entity.UserBadgesEntity;
import project_z.demo.enums.UserAboutType;
import project_z.demo.repositories.UserBadgesRepository;
import project_z.demo.services.UserBadgesService;


@Service
@RequiredArgsConstructor
public class UserBadgesServiceImpl implements UserBadgesService{

    private final UserBadgesRepository userBadgesRepository;
    private final Mapper<UserBadgesEntity, UserBadgesDetailsDto> userBadgesMapper;

    @Override
    @Transactional(readOnly = true)
    public List<UserBadgesDetailsDto> findUsersByBadgeType(UserAboutType type) {
        return userBadgesRepository.findByType(type)
                .stream()
                .map(userBadgesMapper::mapTo)
                .collect(Collectors.toList());
    }
}
