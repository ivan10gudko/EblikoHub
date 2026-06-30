package project_z.demo.services.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.EnumMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collector;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import project_z.demo.JavaUtil.BeanUtilsHelper;
import project_z.demo.JavaUtil.PagingHelper;
import project_z.demo.JavaUtil.PatchHelper;
import project_z.demo.Mappers.Mapper;
import project_z.demo.Mappers.impl.TitleMappers.TitleStatsMapper;
import project_z.demo.common.Exceptions.ResourceNotFoundException;
import project_z.demo.common.Exceptions.TitleWithThatMalIdAlreadyExistsException;
import project_z.demo.common.QueryParameters.TitleQueryParameters;
import project_z.demo.dto.TitleDtos.SameCriteriaRatingResponse;
import project_z.demo.dto.TitleDtos.TargetTitleContext;
import project_z.demo.dto.TitleDtos.TitleBatchCreateDto;
import project_z.demo.dto.TitleDtos.TitleDto;
import project_z.demo.dto.TitleDtos.TitlePatchUpdateDto;
import project_z.demo.dto.TitleDtos.TitleSameCriteriaDto;
import project_z.demo.dto.TitleDtos.TitleStatsDto;
import project_z.demo.entity.SeasonEntity;
import project_z.demo.entity.TitleEntity;
import project_z.demo.entity.UserEntity;
import project_z.demo.enums.TitleStatus;
import project_z.demo.enums.TitleType;
import project_z.demo.repositories.Specifications.TitleSpecifications;
import project_z.demo.repositories.TitleRepository;
import project_z.demo.repositories.UserRepository;
import project_z.demo.security.JwtService;
import project_z.demo.services.SeasonService;
import project_z.demo.services.TitleService;
import org.springframework.data.domain.Sort;

@Service
public class TitleServiceImpl implements TitleService {

    private final TitleSeachServiceImpl titleSeachServiceImpl;
    private final SeasonService seasonService;
    private final PatchHelper patchHelper;
    private final TitleStatsMapper titleStatsMapper;
    @PersistenceContext
    private EntityManager entityManager;

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
            PatchHelper patchHelper, TitleStatsMapper titleStatsMapper) {
        this.seasonService = seasonService;
        this.titleSeachServiceImpl = titleSeachServiceImpl;
        this.patchHelper = patchHelper;
        this.titleStatsMapper = titleStatsMapper;
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
    public Page<TitleDto> findAllByUserId(TitleQueryParameters params, UUID userId) {
        Pageable pageable = PagingHelper.toPageable(params);

        Specification<TitleEntity> spec = Specification
                .where(TitleSpecifications.belongsToUser(userId))
                .and(TitleSpecifications.hasStatus(params.getStatus()))
                .and(TitleSpecifications.hasName(params.getSearch()))
                .and(TitleSpecifications.hasTitleTypes(params.getTypes()));

        Pageable finalPageable;
        boolean isAvgSort = "avgRating".equals(params.getSortBy());

        if (isAvgSort) {
            spec = spec.and(TitleSpecifications.sortByAvgRating(params.getOrder()));
            finalPageable = PageRequest.of(pageable.getPageNumber(), pageable.getPageSize(), Sort.unsorted());
        } else if ("rating".equals(params.getSortBy())) {
            spec = spec.and(TitleSpecifications.sortByRating(params.getOrder()));
            finalPageable = PageRequest.of(pageable.getPageNumber(), pageable.getPageSize(), Sort.unsorted());
        } else {
            Sort finalSort = Sort.by(Sort.Direction.DESC, "isPinned").and(pageable.getSort());
            finalPageable = PageRequest.of(pageable.getPageNumber(), pageable.getPageSize(), finalSort);
        }

        Page<TitleEntity> titlesPage = titleRepository.findAll(spec, finalPageable);

        return titlesPage.map(title -> {
            TitleDto dto = titleMapper.mapTo(title);

            if (isAvgSort) {
                Double avg = title.getAvgRating();
                dto.setAvgRating(avg != null ? avg : 0.0);
            }

            return dto;
        });
    }

    @Override
    public boolean isExists(Long titleId) {
        return titleRepository.existsById(titleId);
    }

    @Override
    @Transactional
    public TitleEntity partialUpdate(Long titleId, TitlePatchUpdateDto source) {
        TitleEntity titleEntity = titleRepository.findById(titleId)
                .orElseThrow(() -> new ResourceNotFoundException("Title not found"));

        patchHelper.updateIfPresent(source.getApiTitleId(), titleEntity::setApiTitleId);
        patchHelper.updateIfPresent(source.getTitleName(), titleEntity::setTitleName);
        patchHelper.updateIfPresent(source.getStatus(), titleEntity::setStatus);
        patchHelper.updateIfPresent(source.getTitleType(), titleEntity::setTitleType);
        patchHelper.updateIfPresent(source.getRating(), titleEntity::setRating);
        patchHelper.updateIfPresent(source.getCustomOrder(), titleEntity::setCustomOrder);
        patchHelper.updateIfPresent(source.getImageUrl(), titleEntity::setImageUrl);

        titleRepository.saveAndFlush(titleEntity);
        entityManager.refresh(titleEntity);
        
        return titleEntity;
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

    @Override
    public SameCriteriaRatingResponse getNeighborsRating(Long titleId, String category, Float currentRating) {
        TitleEntity currentTitle = titleRepository.findById(titleId)
                .orElseThrow(() -> new ResourceNotFoundException("Title not found"));
        TargetTitleContext context = new TargetTitleContext(
                titleId,
                category,
                currentRating,
                currentTitle.getTitleType().toString(),
                currentTitle.getUser().getUserId());

        List<Object[]> rows = titleRepository.findAllTitlesInLeaderboard(context);

        List<TitleSameCriteriaDto> titles = TitleSameCriteriaDto.fromRows(rows);
        Float ratingSum = 0.0f;
        for (TitleSameCriteriaDto title : titles) {
            ratingSum += title.getRatingValue();

        }
        Float avg = titles.isEmpty() ? 0.0f : (ratingSum / titles.size());

        return new SameCriteriaRatingResponse(
                titles,
                avg);
    }

    @Override
    @Transactional
    public TitleDto pinTitle(Long titleId, UUID userId) {

        titleRepository.unpinAllTitlesForUser(userId);

        TitleEntity title = titleRepository.findById(titleId)
                .orElseThrow(() -> new ResourceNotFoundException("Title not found with id: " + titleId));

        title.setPinned(true);
        TitleEntity savedTitle = titleRepository.save(title);

        return titleMapper.mapTo(savedTitle);
    }

    @Override
    public void unpin(UUID userId) {
        titleRepository.unpinAllTitlesForUser(userId);
    }

    @Override
    @Transactional(readOnly = true)
    public TitleStatsDto getUserTitlesStats(UUID userId) {
        Map<TitleStatus, Long> statusCount = Arrays.stream(TitleStatus.values())
                .collect(Collectors.toMap(s -> s, s -> 0L, (a, b) -> a, () -> new EnumMap<>(TitleStatus.class)));

        Map<TitleType, Long> typeCount = Arrays.stream(TitleType.values())
                .collect(Collectors.toMap(t -> t, t -> 0L, (a, b) -> a, () -> new EnumMap<>(TitleType.class)));

        titleRepository.countByStatus(userId).forEach(obj -> statusCount.put((TitleStatus) obj[0], (Long) obj[1]));

        titleRepository.countByType(userId).forEach(obj -> typeCount.put((TitleType) obj[0], (Long) obj[1]));

        return titleStatsMapper.mapToDto(statusCount, typeCount);
    }
}