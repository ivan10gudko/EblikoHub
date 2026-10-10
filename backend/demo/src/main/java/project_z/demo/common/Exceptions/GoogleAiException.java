package project_z.demo.common.Exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
public class GoogleAiException extends RuntimeException {
    public GoogleAiException(String message) {
        super(message);
    }
    public GoogleAiException(String message, Throwable cause) {
        super(message, cause);
    }
}
