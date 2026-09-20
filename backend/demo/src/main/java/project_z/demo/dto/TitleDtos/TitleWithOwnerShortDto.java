package project_z.demo.dto.TitleDtos;

import lombok.Getter;
import lombok.Setter;
import project_z.demo.dto.UserDtos.UserShortDto;
@Getter
@Setter 
public class TitleWithOwnerShortDto {
    private TitleShortDto title;
    private UserShortDto owner;
}
