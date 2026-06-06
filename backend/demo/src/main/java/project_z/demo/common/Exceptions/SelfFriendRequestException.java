package project_z.demo.common.Exceptions;

public class SelfFriendRequestException extends IllegalArgumentException {
    public SelfFriendRequestException(String message) {
        super(message);
    }
}