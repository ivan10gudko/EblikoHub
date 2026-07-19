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

@RestController
@RequestMapping("/api/v1/wheel/settings/titles")
@RequiredArgsConstructor
public class WheelCurrentTitleController {

    private final WheelCurrentSettingsTitleService titleService;
    private final SecurityService securityService;

    @PostMapping
    @PreAuthorize("@securityService.isTitleOwner(#dto.titleId())")
    public ResponseEntity<Void> addTitle(@RequestBody WheelCurrentSettingsTitleCreateDto dto) {
        UUID userId = securityService.getCurrentUserId();
        titleService.addTitleToWheel(userId, dto);
        return new ResponseEntity<>(HttpStatus.CREATED);
    }

    @DeleteMapping("/{titleId}")
    @PreAuthorize("@securityService.isTitleOwner(#dto.titleId())")
    public ResponseEntity<Void> removeTitle(@PathVariable Long titleId) {
        UUID userId = securityService.getCurrentUserId();
        titleService.removeTitleFromWheel(userId, titleId);
        return new ResponseEntity<>(HttpStatus.OK);
    }
}
