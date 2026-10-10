package project_z.demo.common.Exceptions.RoomBanExceptions;

public class RoomSelfBanException extends IllegalStateException {
    public RoomSelfBanException(String message) {
        super(message);
    }
}
