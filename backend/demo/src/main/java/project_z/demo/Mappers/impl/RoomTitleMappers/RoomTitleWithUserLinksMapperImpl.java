package project_z.demo.Mappers.impl.RoomTitleMappers;

import org.springframework.stereotype.Component;

import lombok.RequiredArgsConstructor;
import project_z.demo.Mappers.Mapper;
import project_z.demo.Mappers.impl.RoomTitleLinkMappers.RoomTitleLinkShortMapperImpl;
import project_z.demo.dto.RoomTitleDtos.RoomTitleWithUserLinksDto;
import project_z.demo.dto.RoomTitleLinkDtos.RoomTitleLinkShortDto;
import project_z.demo.entity.RoomTitleEntity;
import project_z.demo.entity.RoomTitleLinkEntity;

@Component
@RequiredArgsConstructor
public class RoomTitleWithUserLinksMapperImpl implements Mapper<RoomTitleEntity, RoomTitleWithUserLinksDto>  {


    @Override
    public RoomTitleWithUserLinksDto mapTo(RoomTitleEntity entity){
        return new RoomTitleWithUserLinksDto().builder()
        .id(entity.getId())
        .titleName(entity.getTitleName())
        .imageUrl(entity.getImageUrl())
        .titleType(entity.getTitleType())
        .apiTitleId(entity.getApiTitleId())
        .addedByUserId(entity.getAddedByUserId())
        .createdAt(entity.getCreatedAt()).build();
    }
    @Override
    public RoomTitleEntity mapFrom(RoomTitleWithUserLinksDto dto){
        throw new UnsupportedOperationException("this mapping is not implemented");
    }
}
    //  private UUID id;

    // private String titleName;

    // private String imageUrl;
    
    // private TitleType titleType;

    // private Long apiTitleId;

    // private UUID addedByUserId;

    // private List<RoomTitleLinkShortDto> links;

    // private LocalDateTime createdAt;