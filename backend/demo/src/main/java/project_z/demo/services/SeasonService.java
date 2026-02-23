package project_z.demo.services;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import project_z.demo.entity.SeasonEntity;

@Service
public interface SeasonService {
    SeasonEntity save(SeasonEntity seasonEntity); 
    List<SeasonEntity> findAll(Long titleId);
    boolean isExists(long Id);
    Optional<SeasonEntity> findById(long seasonId);
    SeasonEntity partialUpdate(long seasonId, SeasonEntity source);
    void deleteById(long seasonId);
}
