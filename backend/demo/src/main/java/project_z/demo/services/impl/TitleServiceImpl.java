package project_z.demo.services.impl;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import project_z.demo.JavaUtil.BeanUtilsHelper;
import project_z.demo.entity.SeasonEntity;
import project_z.demo.entity.TitleEntity;
import project_z.demo.entity.UserEntity;
import project_z.demo.repositories.TitleRepository;
import project_z.demo.repositories.UserRepository;
import project_z.demo.services.SeasonService;
import project_z.demo.services.TitleService;

@Service
public class TitleServiceImpl implements TitleService {

    private final SeasonService seasonService;
    @Autowired
    private BeanUtilsHelper beanUtilsHelper;
    @Autowired
    private TitleRepository titleRepository;
    @Autowired
    private UserRepository userRepository;

    TitleServiceImpl(SeasonService seasonService) {
        this.seasonService = seasonService;
    }
@Override
public TitleEntity createTitle(TitleEntity title){
    return titleRepository.save(title);
}
@Override
public List<TitleEntity> findAll(){
   return  StreamSupport.stream( 
        titleRepository.findAll().spliterator(),
        false)
        .collect(Collectors.toList());
}
@Override
public Optional<TitleEntity> findOne(Long titleId){
    return titleRepository.findById(titleId);
}

@Override
public boolean isExists(Long titleId){
    return titleRepository.existsById(titleId);
}
@Override
public TitleEntity partialUpdate(Long titleId, TitleEntity source) {
    return titleRepository.findById(titleId)
        .map(target -> {
            beanUtilsHelper.copyNonNullProperties(source, target);
            return titleRepository.save(target);
        })
        .orElseThrow(() -> new RuntimeException("User not found"));
}
@Override
public void deleteById(Long Id){
    titleRepository.deleteById(Id);
}
@Override
public List<TitleEntity> addTitle(TitleEntity titleEntity, UUID userId){
    UserEntity userEntity = userRepository.findById(userId).orElseThrow(
        () -> new RuntimeException("user not found"));
        titleEntity.setUser(userEntity);
        userEntity.getTitleList().add(titleEntity);
        userRepository.save(userEntity);
        return userEntity.getTitleList();
}
@Override
public List<TitleEntity> getWatchedList(UUID userId){
    UserEntity userEntity = userRepository.findById(userId).orElseThrow(
    () -> new RuntimeException("user not found"));
    List<TitleEntity> response = userEntity.getTitleList().stream().filter(title -> title.getStatus() == TitleEntity.titleStatus.WATCHED).toList();
    return response;
}
@Override
public List<TitleEntity> getWatchList(UUID userId){
    UserEntity userEntity = userRepository.findById(userId).orElseThrow(
    () -> new RuntimeException("user not found"));
    List<TitleEntity> response = userEntity.getTitleList().stream().filter(title -> title.getStatus() == TitleEntity.titleStatus.PLANNED).toList();
    return response;
    
}
@Override
public TitleEntity addSeason(SeasonEntity seasonEntity, TitleEntity titleEntity){
    seasonEntity.setTitle(titleEntity);
    seasonService.save(seasonEntity);
    return titleEntity;
}
}