package project_z.demo.services;

import java.util.List;

import org.springframework.stereotype.Service;

import project_z.demo.dto.UserBadgesDtos.UserBadgesDetailsDto;
import project_z.demo.enums.UserAboutType;

@Service
public interface UserBadgesService {
    List<UserBadgesDetailsDto> findUsersByBadgeType(UserAboutType type);
    List<UserBadgesDetailsDto> findAll();
}
