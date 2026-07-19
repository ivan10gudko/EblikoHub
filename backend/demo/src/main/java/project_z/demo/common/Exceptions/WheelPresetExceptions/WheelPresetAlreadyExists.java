package project_z.demo.common.Exceptions.WheelPresetExceptions;

public class WheelPresetAlreadyExists extends IllegalStateException {
    public WheelPresetAlreadyExists(String message) {
        super(message);
    }
}
