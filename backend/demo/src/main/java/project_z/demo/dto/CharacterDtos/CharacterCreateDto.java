package project_z.demo.dto.CharacterDtos;

import jdk.jshell.Snippet;
import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CharacterCreateDto {
    private String name;
    private String imageUrl;
    private Integer apiId;
}
