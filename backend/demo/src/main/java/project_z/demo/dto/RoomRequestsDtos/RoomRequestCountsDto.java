package project_z.demo.dto.RoomRequestsDtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RoomRequestCountsDto {
    private long incomingCount;
    private long outgoingCount;
}