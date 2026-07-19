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
import project_z.demo.dto.WheelPresetTitleDtos.WheelPresetTitleCreateDto;
import project_z.demo.services.WheelServices.WheelPresetTitleService;

@RestController
@RequestMapping("/api/v1/wheel/presets/{presetId}/titles")
@RequiredArgsConstructor
public class WheelPresetTitleController {

    private final WheelPresetTitleService presetTitleService;

    @PostMapping
    @PreAuthorize("@securityService.isPresetOwner(#presetId) && @securityService.isTitleOwner(#dto.titleId())")
    public ResponseEntity<Void> addTitleToPreset(
            @PathVariable UUID presetId,
            @RequestBody WheelPresetTitleCreateDto dto) {
        
        presetTitleService.addTitleToPreset(presetId, dto);
        return new ResponseEntity<>(HttpStatus.CREATED);
    }

    @DeleteMapping("/{titleId}")
    @PreAuthorize("@securityService.isPresetOwner(#presetId)")
    public ResponseEntity<Void> removeTitleFromPreset(
            @PathVariable UUID presetId,
            @PathVariable Long titleId) {
        
        presetTitleService.removeTitleFromPreset(presetId, titleId);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}