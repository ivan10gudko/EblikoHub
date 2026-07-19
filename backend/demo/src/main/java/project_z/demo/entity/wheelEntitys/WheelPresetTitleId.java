package project_z.demo.entity.wheelEntitys;

import java.io.Serializable;
import java.util.UUID;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class WheelPresetTitleId implements Serializable {

    private UUID presetId;
    private Long titleId;
}
