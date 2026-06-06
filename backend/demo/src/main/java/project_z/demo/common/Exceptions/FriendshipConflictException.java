package project_z.demo.common.Exceptions;

public class FriendshipConflictException extends IllegalStateException {
    public FriendshipConflictException(String message) {
        super(message);
    }
}