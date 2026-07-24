package project_z.demo.entity.wheelEntitys;

import java.io.Serializable;
import java.util.UUID;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class WheelCurrentTitleId implements Serializable {

    private UUID wheelSettings;
    private Long title;
}
