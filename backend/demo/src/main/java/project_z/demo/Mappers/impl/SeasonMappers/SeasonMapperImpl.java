package project_z.demo.Mappers.impl.SeasonMappers;

import jakarta.annotation.PostConstruct;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import project_z.demo.Mappers.Mapper;
import project_z.demo.dto.SeasonDtos.SeasonDto;
import project_z.demo.entity.SeasonEntity;
import project_z.demo.entity.SeasonRatingEntity;

import java.util.Map;
import java.util.stream.Collectors;

@Component
public class SeasonMapperImpl implements Mapper<SeasonEntity, SeasonDto> {

    @Autowired
    private ModelMapper modelMapper;

    @PostConstruct
    public void configureMapper() {
        modelMapper.typeMap(SeasonEntity.class, SeasonDto.class).addMappings(mapper -> {
            mapper.skip(SeasonDto::setRating);
        }).setPostConverter(context -> {
            SeasonEntity source = context.getSource();
            SeasonDto destination = context.getDestination();

            if (source.getRatings() != null) {
                Map<String, Float> ratingMap = source.getRatings().stream()
                        .collect(Collectors.toMap(SeasonRatingEntity::getName, SeasonRatingEntity::getValue, (v1, v2) -> v2));
                destination.setRating(ratingMap);
            }
            return destination;
        });

        modelMapper.typeMap(SeasonDto.class, SeasonEntity.class).addMappings(mapper -> {
            mapper.skip(SeasonEntity::setRatings);
        });
    }

    @Override
    public SeasonDto mapTo(SeasonEntity seasonEntity) {
        return modelMapper.map(seasonEntity, SeasonDto.class);
    }

    @Override
    public SeasonEntity mapFrom(SeasonDto seasonDto) {
        return modelMapper.map(seasonDto, SeasonEntity.class);
    }
}