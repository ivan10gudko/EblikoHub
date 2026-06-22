package project_z.demo.controllers;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;
import project_z.demo.dto.UserBadgesDtos.UserBadgesDetailsDto;
import project_z.demo.enums.UserAboutType;
import project_z.demo.services.UserBadgesService;

@RestController
@RequestMapping("/api/v1/badges")
@RequiredArgsConstructor
public class UserBadgesController {

    private final UserBadgesService userBadgesService;

    @GetMapping(path ="/type")
    public ResponseEntity<List<UserBadgesDetailsDto>> getUsersByBadgeType(
            @RequestParam UserAboutType type) {
        
        List<UserBadgesDetailsDto> badges = userBadgesService.findUsersByBadgeType(type);
        return ResponseEntity.ok(badges);
    }

    @GetMapping
    public ResponseEntity<List<UserBadgesDetailsDto>> getUsersByBadgeType() {
        
        List<UserBadgesDetailsDto> badges = userBadgesService.findAll();
        return ResponseEntity.ok(badges);
    }
}