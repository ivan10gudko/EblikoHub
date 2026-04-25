package project_z.demo.services.impl;

import java.util.List;
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
import project_z.demo.Mappers.Mapper;
import project_z.demo.common.Exceptions.ResourceNotFoundException;
import project_z.demo.common.Exceptions.TitleWithThatMalIdAlreadyExistsException;
import project_z.demo.common.QueryParameters.TitleQueryParameters;
import project_z.demo.dto.TitleDtos.TitleBatchCreateDto;
import project_z.demo.dto.TitleDtos.TitleDto;
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
    private final PatchHelper patchHelper;

    @Autowired
    private BeanUtilsHelper beanUtilsHelper;
    @Autowired
    private TitleRepository titleRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private JwtService jwtService;
    @Autowired
    private Mapper<TitleEntity, TitleDto> titleMapper;

    TitleServiceImpl(SeasonService seasonService, TitleSeachServiceImpl titleSeachServiceImpl,
            PatchHelper patchHelper) {
        this.seasonService = seasonService;
        this.titleSeachServiceImpl = titleSeachServiceImpl;
        this.patchHelper = patchHelper;
    }

    @Override
    public TitleEntity createTitle(TitleEntity title) {
        return titleRepository.save(title);
    }

    @Override
    @Transactional
    public void batchCreateTitle(TitleBatchCreateDto titleDtos, String token) {
        UUID userId = jwtService.extractUsername(token);
        UserEntity user = userRepository.findById(userId).orElseThrow(
                () -> new ResourceNotFoundException("User not found"));

        List<TitleEntity> titles = titleDtos.getTitles().stream()
                .map(titleMapper::mapFrom)
                .peek(title -> title.setUser(user))
                .collect(Collectors.toList());

        titleRepository.saveAll(titles);
    }

    @Override
    public List<TitleEntity> findAll() {
        return StreamSupport.stream(
                titleRepository.findAll().spliterator(),
                false)
                .collect(Collectors.toList());
    }

    @Override
    public Optional<TitleEntity> findOne(Long titleId) {
        return titleRepository.findById(titleId);
    }

    @Override
    public Page<TitleEntity> findAllByUserId(TitleQueryParameters params, UUID userId) {
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
    public boolean isExists(Long titleId) {
        return titleRepository.existsById(titleId);
    }

    @Override
    @Transactional
    public TitleEntity partialUpdate(Long titleId, TitlePatchUpdateDto source) {
        return titleRepository.findById(titleId)
                .map(target -> {
                    patchHelper.updateIfPresent(source.getApiTitleId(), target::setApiTitleId);
                    patchHelper.updateIfPresent(source.getTitleName(), target::setTitleName);
                    patchHelper.updateIfPresent(source.getStatus(), target::setStatus);
                    patchHelper.updateIfPresent(source.getRating(), target::setRating);
                    patchHelper.updateIfPresent(source.getCustomOrder(), target::setCustomOrder);
                    return titleRepository.save(target);
                })
                .orElseThrow(() -> new ResourceNotFoundException("Title not found"));
    }

    @Override
    @Transactional
    public void titlePositionUpdate(Double newPosition, Long titleId) {
        TitleEntity titleEntity = titleRepository.findById(titleId).orElseThrow(
                () -> new ResourceNotFoundException("title not found"));
        titleEntity.setCustomOrder(newPosition);
        titleRepository.save(titleEntity);
    }

    @Override
    public void deleteById(Long id) {
        titleRepository.deleteById(id);
    }

    @Override
    @Transactional
    public TitleEntity addTitle(TitleEntity titleEntity, String token) {
        UUID userId = jwtService.extractUsername(token);
        UserEntity userEntity = userRepository.findById(userId).orElseThrow(
                () -> new ResourceNotFoundException("user not found"));

        titleRepository.findByApiTitleIdAndUserId(titleEntity.getApiTitleId(), userId)
                .ifPresent(existingTitle -> {
                    throw new TitleWithThatMalIdAlreadyExistsException(
                            "This title already exists in your list");
                });

        titleEntity.setUser(userEntity);
        return titleRepository.save(titleEntity);
    }

    @Override
    public List<TitleEntity> getWatchedList(UUID userId) {
        UserEntity userEntity = userRepository.findById(userId).orElseThrow(
                () -> new ResourceNotFoundException("user not found"));
        return userEntity.getTitleList().stream()
                .filter(title -> title.getStatus() == TitleStatus.WATCHED)
                .toList();
    }

    @Override
    public List<TitleEntity> getWatchList(UUID userId) {
        UserEntity userEntity = userRepository.findById(userId).orElseThrow(
                () -> new ResourceNotFoundException("user not found"));
        return userEntity.getTitleList().stream()
                .filter(title -> title.getStatus() == TitleStatus.PLANNED)
                .toList();
    }

    @Override
    @Transactional
    public TitleEntity addSeason(SeasonEntity seasonEntity, TitleEntity titleEntity) {
        seasonEntity.setTitle(titleEntity);
        seasonService.save(seasonEntity);
        return titleEntity;
    }

    @Override
    public TitleEntity findUserTitleByMalId(Integer titleMalId, String token) {
        UUID userId = jwtService.extractUsername(token);
        return titleRepository.findByApiTitleIdAndUserId(titleMalId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Title not found"));
    }

    @Override
    public List<TitleEntity> findAllByMalIdInUserRooms(Integer titleMalId, String token) {
        UUID userId = jwtService.extractUsername(token);
        return titleRepository.findAllByApiTitleIdInUserRooms(titleMalId, userId);
    }

    @Override
    public void reindexCustomOrder(UUID userId) {
        titleRepository.reindexNative(userId);
    }
}