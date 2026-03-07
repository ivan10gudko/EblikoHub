package project_z.demo.dto.TitleDtos;
import java.util.Map;

import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Getter
public class TitleRoomUpdateDto {
    @Id
    private Long titleId;
    private Long titleMalId;   
    private String action;     
    private Object newValue;   // string or float
    private String sender;

}
