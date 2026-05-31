package project_z.demo.services.impl;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
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

import jakarta.transaction.Transactional;
import project_z.demo.JavaUtil.BeanUtilsHelper;
import project_z.demo.JavaUtil.PagingHelper;
import project_z.demo.JavaUtil.PatchHelper;
import project_z.demo.Mappers.Mapper;
import project_z.demo.common.Exceptions.ResourceNotFoundException;
import project_z.demo.common.Exceptions.TitleWithThatMalIdAlreadyExistsException;
import project_z.demo.common.QueryParameters.TitleQueryParameters;
import project_z.demo.dto.TitleDtos.SameCriteriaRatingResponse;
import project_z.demo.dto.TitleDtos.TargetTitleContext;
import project_z.demo.dto.TitleDtos.TitleBatchCreateDto;
import project_z.demo.dto.TitleDtos.TitleDto;
import project_z.demo.dto.TitleDtos.TitlePatchUpdateDto;
import project_z.demo.dto.TitleDtos.TitleShortDto;
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
import org.springframework.data.domain.Sort;

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
                .and(TitleSpecifications.hasStatus(params.getStatus()))
                .and(TitleSpecifications.hasName(params.getSearch()))
                .and(TitleSpecifications.hasTitleTypes(params.getTypes()));

        Pageable pageable = PagingHelper.toPageable(params);
        Pageable finalPageable;

        if ("rating".equals(params.getSortBy())) {
            spec = spec.and(TitleSpecifications.sortByRating(params.getOrder()));

            finalPageable = PageRequest.of(pageable.getPageNumber(), pageable.getPageSize(), Sort.unsorted());
        } else {

            Sort finalSort = Sort.by(Sort.Direction.DESC, "isPinned").and(pageable.getSort());
            finalPageable = PageRequest.of(pageable.getPageNumber(), pageable.getPageSize(), finalSort);
        }

        return titleRepository.findAll(spec, finalPageable);
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
                    patchHelper.updateIfPresent(source.getTitleType(), target::setTitleType);
                    patchHelper.updateIfPresent(source.getRating(), target::setRating);
                    patchHelper.updateIfPresent(source.getCustomOrder(), target::setCustomOrder);
                    patchHelper.updateIfPresent(source.getImageUrl(), target::setImageUrl);
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

        List<TitleShortDto> titles = TitleShortDto.fromRows(rows);
        Float ratingSum = 0.0f;
        for (TitleShortDto title : titles) {
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
    public void unpin(UUID userId){
        titleRepository.unpinAllTitlesForUser(userId);
    }
}