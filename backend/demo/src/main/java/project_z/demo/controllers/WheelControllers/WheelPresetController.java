package project_z.demo.controllers.WheelControllers;

import java.util.List;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;
import project_z.demo.dto.WheelPresetDtos.WheelPresetCreateDto;
import project_z.demo.dto.WheelPresetDtos.WheelPresetDetailsDto;
import project_z.demo.dto.WheelPresetDtos.WheelPresetPatchDto;
import project_z.demo.security.SecurityService;
import project_z.demo.services.WheelServices.WheelPresetService;

@RestController
@RequestMapping("/api/v1/wheel/presets")
@RequiredArgsConstructor
public class WheelPresetController {

    private final WheelPresetService presetService;
    private final SecurityService securityService;

    @GetMapping
    public ResponseEntity<List<WheelPresetDetailsDto>> getUserPresets() {
        UUID userId = securityService.getCurrentUserId();
        return ResponseEntity.ok(presetService.getUserPresets(userId));
    }

    @GetMapping("/{presetId}")
    public ResponseEntity<WheelPresetDetailsDto> getPreset(@PathVariable UUID presetId) {
        return ResponseEntity.ok(presetService.getPreset(presetId));
    }

    @PostMapping
    public ResponseEntity<WheelPresetDetailsDto> createPreset(@RequestBody WheelPresetCreateDto dto) {
        UUID userId = securityService.getCurrentUserId();
        return new ResponseEntity<>(presetService.createPreset(userId, dto), HttpStatus.CREATED);
    }

    @PatchMapping("/{presetId}")
    @PreAuthorize("@securityService.isPresetOwner(#presetId)")
    public ResponseEntity<WheelPresetDetailsDto> updatePreset(
            @PathVariable UUID presetId,
            @RequestBody WheelPresetPatchDto patchDto) {
        return ResponseEntity.ok(presetService.updatePreset(presetId, patchDto));
    }

    @DeleteMapping("/{presetId}")
    @PreAuthorize("@securityService.isPresetOwner(#presetId)")
    public ResponseEntity<Void> deletePreset(@PathVariable UUID presetId) {
        presetService.deletePreset(presetId);
        return new ResponseEntity<>(HttpStatus.OK);
    }
}