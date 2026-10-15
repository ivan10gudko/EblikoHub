package project_z.demo.common.Exceptions.RoomTitleExceptions;

public class RoomTitleAlreadyExistsException extends RuntimeException {
    public RoomTitleAlreadyExistsException(String message) {
        super(message);
    }
}