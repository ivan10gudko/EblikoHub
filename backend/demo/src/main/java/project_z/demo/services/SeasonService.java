package project_z.demo.services;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import project_z.demo.dto.SeasonDtos.SeasonDto;
import project_z.demo.dto.SeasonDtos.SeasonPatchUpdateDto;
import project_z.demo.entity.SeasonEntity;

@Service
public interface SeasonService {
    SeasonEntity save(SeasonEntity seasonEntity); 
    List<SeasonDto> findAll(Long titleId);
    boolean isExists(long Id);
    Optional<SeasonEntity> findById(long seasonId);
    SeasonEntity partialUpdate(Long seasonId, SeasonPatchUpdateDto source);
    void deleteById(long seasonId);
    List<SeasonDto> batchUpdate (Long titleId, List<SeasonDto> dtos);
}
