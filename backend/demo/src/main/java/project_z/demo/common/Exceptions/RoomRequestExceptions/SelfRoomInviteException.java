package project_z.demo.common.Exceptions.RoomRequestExceptions;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.CONFLICT)
public class SelfRoomInviteException extends RuntimeException{

    public SelfRoomInviteException(String message) {
        super(message);
    }
}
