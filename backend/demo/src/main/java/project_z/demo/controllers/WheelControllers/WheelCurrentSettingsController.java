package project_z.demo.controllers.WheelControllers;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;
import project_z.demo.dto.WheelCurrentSettingsDtos.WheelCurrentSettingsCreateDto;
import project_z.demo.dto.WheelCurrentSettingsDtos.WheelCurrentSettingsDetailsDto;
import project_z.demo.dto.WheelCurrentSettingsDtos.WheelCurrentSettingsPatchDto;
import project_z.demo.security.SecurityService;
import project_z.demo.services.WheelServices.WheelCurrentSettingsService;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/wheel/settings")
@RequiredArgsConstructor
public class WheelCurrentSettingsController {
    
    private final WheelCurrentSettingsService settingsService;
    private final SecurityService securityService;

    @GetMapping // TODO sort mb
    public ResponseEntity<WheelCurrentSettingsDetailsDto> getSettings() {
        UUID userId = securityService.getCurrentUserId();
        return ResponseEntity.ok(settingsService.getSettings(userId));
    }

    @PostMapping
    public ResponseEntity<WheelCurrentSettingsDetailsDto> createSettings(
            @RequestBody WheelCurrentSettingsCreateDto dto) {
        UUID userId = securityService.getCurrentUserId();
        return new ResponseEntity<>(settingsService.createSettings(userId, dto), HttpStatus.CREATED);
    }

    @PatchMapping
    public ResponseEntity<WheelCurrentSettingsDetailsDto> partialUpdate(
            @RequestBody WheelCurrentSettingsPatchDto patchDto) {
        UUID userId = securityService.getCurrentUserId();
        return ResponseEntity.ok(settingsService.partialUpdate(userId, patchDto));
    }
}