package project_z.demo.common.Exceptions.RoomMembersExceptions;

public class RoomMembersConflictException extends IllegalStateException {
    public RoomMembersConflictException(String message) {
        super(message);
    }
}
