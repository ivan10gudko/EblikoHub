package project_z.demo.dto.FriendshipDtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class FriendshipCountsDto {
    private long friendsCount;
    private long pendingCount;
    private long sentCount;
    
}
