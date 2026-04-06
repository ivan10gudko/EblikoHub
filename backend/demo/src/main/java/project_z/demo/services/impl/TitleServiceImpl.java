package project_z.demo.services.impl;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import jakarta.transaction.Transactional;
import project_z.demo.JavaUtil.BeanUtilsHelper;
import project_z.demo.JavaUtil.PagingHelper;
import project_z.demo.JavaUtil.PatchHelper;
import project_z.demo.Mappers.impl.PatchMappers.TitlePatchMapper;
import project_z.demo.common.Exceptions.ResourceNotFoundException;
import project_z.demo.common.QueryParameters.TitleQueryParameters;
import project_z.demo.dto.TitleDtos.TitlePatchUpdateDto;
import project_z.demo.entity.SeasonEntity;
import project_z.demo.entity.TitleEntity;
import project_z.demo.entity.UserEntity;
import project_z.demo.enums.TitleStatus;
import project_z.demo.repositories.Specifications.TitleSpecifications;
import project_z.demo.repositories.TitleRepository;
import project_z.demo.repositories.UserRepository;
import project_z.demo.security.JwtService;
import project_z.demo.services.SeasonService;
import project_z.demo.services.TitleService;

@Service
public class TitleServiceImpl implements TitleService {

    private final TitleSeachServiceImpl titleSeachServiceImpl;

    private final SeasonService seasonService;
    private PatchHelper patchHelper;
    @Autowired
    private BeanUtilsHelper beanUtilsHelper;
    @Autowired
    private TitleRepository titleRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private JwtService jwtService;
    TitleServiceImpl(SeasonService seasonService, TitleSeachServiceImpl titleSeachServiceImpl, PatchHelper patchHelper) {
        this.seasonService = seasonService;
        this.titleSeachServiceImpl = titleSeachServiceImpl;
        this.patchHelper = patchHelper;
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
public Page<TitleEntity> findAllByUserId(TitleQueryParameters params, UUID userId){
   Specification<TitleEntity> spec = Specification
            .where(TitleSpecifications.belongsToUser(userId))
            .and(TitleSpecifications.hasStatus(params.getStatus())
            .and(TitleSpecifications.hasName(params.getSearch())));

    if ("rating".equals(params.getSortBy())) {
        spec = spec.and(TitleSpecifications.sortByRating(params.getOrder()));
    }

    Pageable pageable = PagingHelper.toPageable(params);

    if ("rating".equals(params.getSortBy())) {
        pageable = PageRequest.of(pageable.getPageNumber(), pageable.getPageSize());
    }

    return titleRepository.findAll(spec, pageable);
}

@Override
public boolean isExists(Long titleId){
    return titleRepository.existsById(titleId);
}
@Override
public TitleEntity partialUpdate(Long titleId, TitlePatchUpdateDto source) {
    System.out.println("Source apiTitleId: " + source.getApiTitleId());
    return titleRepository.findById(titleId)
        .map(target -> {
            patchHelper.updateIfPresent(source.getApiTitleId(),target::setApiTitleId);
            patchHelper.updateIfPresent(source.getTitleName(),target::setTitleName);
            patchHelper.updateIfPresent(source.getStatus(),target::setStatus);
            patchHelper.updateIfPresent(source.getRating(),target::setRating);
            patchHelper.updateIfPresent(source.getCustomOrder(), target::setCustomOrder);
            return titleRepository.save(target);
        })
        .orElseThrow(() -> new RuntimeException("Title not found"));
}
@Override
@Transactional
public void titlePositionUpdate(Double newPosition, Long titleId){
    TitleEntity titleEntity = titleRepository.findById(titleId).orElseThrow(
    () -> new ResourceNotFoundException("title not found"));
    titleEntity.setCustomOrder(newPosition);
    titleRepository.save(titleEntity);
}
@Override
public void deleteById(Long Id){
    titleRepository.deleteById(Id);
}
@Override
public List<TitleEntity> addTitle(TitleEntity titleEntity, String token){
    UUID userId = jwtService.extractUsername(token);
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
    List<TitleEntity> response = userEntity.getTitleList().stream().filter(title -> title.getStatus() == TitleStatus.WATCHED).toList();
    return response;
}
@Override
public List<TitleEntity> getWatchList(UUID userId){
    UserEntity userEntity = userRepository.findById(userId).orElseThrow(
    () -> new RuntimeException("user not found"));
    List<TitleEntity> response = userEntity.getTitleList().stream().filter(title -> title.getStatus() == TitleStatus.PLANNED).toList();
    return response;
    
}
@Override
public TitleEntity addSeason(SeasonEntity seasonEntity, TitleEntity titleEntity){
    seasonEntity.setTitle(titleEntity);
    seasonService.save(seasonEntity);
    return titleEntity;
}
@Override
public TitleEntity findUserTitleByMalId(Long titleMalId, String token){
    UUID userId = jwtService.extractUsername(token);
    TitleEntity response = titleRepository.findByApiTitleIdAndUserId(titleMalId,userId).orElseThrow(
    () -> new ResourceNotFoundException("Title not found")
    );
    return response;
}
@Override
public List<TitleEntity> findAllByMalIdInUserRooms(Long titleMalId, String token){
    UUID userId = jwtService.extractUsername(token);
    return titleRepository.findAllByApiTitleIdInUserRooms(titleMalId,userId);
}

}