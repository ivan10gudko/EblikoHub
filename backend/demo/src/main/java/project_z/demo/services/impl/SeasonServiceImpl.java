package project_z.demo.services.impl;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import project_z.demo.JavaUtil.BeanUtilsHelper;
import project_z.demo.entity.SeasonEntity;
import project_z.demo.repositories.SeasonRepository;
import project_z.demo.services.SeasonService;

@Service
public class SeasonServiceImpl implements SeasonService {

    @Autowired
    private SeasonRepository seasonRepository;
    @Autowired
    private BeanUtilsHelper beanUtilsHelper;
    @Override
    public SeasonEntity save(SeasonEntity seasonEntity){
        return seasonRepository.save(seasonEntity);
    }
    @Override
    public List<SeasonEntity> findAll(Long titleId){
       return StreamSupport.stream(seasonRepository.findAll().spliterator(), false).collect(Collectors.toList());
    }
    @Override 
    public boolean isExists(long titleId){
        return seasonRepository.existsById(titleId);
    }
    @Override
    public Optional<SeasonEntity> findById(long seasonId){
        return seasonRepository.findById(seasonId);
    }
    @Override
    public SeasonEntity partialUpdate(long seasonId, SeasonEntity source) {
    return seasonRepository.findById(seasonId)
        .map(target -> {
            beanUtilsHelper.copyNonNullProperties(source, target);
            return seasonRepository.save(target);
        })
        .orElseThrow(() -> new RuntimeException("Season not found"));
    }
    @Override
    public void deleteById(long seasonId){
        seasonRepository.deleteById(seasonId);
    }
}
