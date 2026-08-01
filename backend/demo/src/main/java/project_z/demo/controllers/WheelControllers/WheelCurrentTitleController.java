package project_z.demo.controllers.WheelControllers;

import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;
import project_z.demo.dto.WheelCurrentSettingsTitleDtos.WheelCurrentSettingsTitleCreateDto;
import project_z.demo.security.SecurityService;
import project_z.demo.services.WheelServices.WheelCurrentSettingsTitleService;

import java.util.List;

@RestController
@RequestMapping("/api/v1/wheel/settings/titles")
@RequiredArgsConstructor
public class WheelCurrentTitleController {

    private final WheelCurrentSettingsTitleService titleService;
    private final SecurityService securityService;

    @PostMapping
    public ResponseEntity<Void> addTitles(
            @RequestBody List<WheelCurrentSettingsTitleCreateDto> dtos) {
        UUID userId = securityService.getCurrentUserId();
        titleService.addTitlesToWheel(userId, dtos);
        return new ResponseEntity<>(HttpStatus.CREATED);
    }

    @DeleteMapping
    public ResponseEntity<Void> removeTitles(
            @RequestBody List<Long> titleIds) {
        UUID userId = securityService.getCurrentUserId();
        titleService.removeTitlesFromWheel(userId, titleIds);
        return new ResponseEntity<>(HttpStatus.OK);
    }
}
