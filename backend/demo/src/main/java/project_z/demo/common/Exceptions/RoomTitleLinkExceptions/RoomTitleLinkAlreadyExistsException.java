package project_z.demo.common.Exceptions.RoomTitleLinkExceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.CONFLICT)
public class RoomTitleLinkAlreadyExistsException extends IllegalStateException {
    public RoomTitleLinkAlreadyExistsException(String message) {
        super(message);
    }
}