package project_z.demo.common.Exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.BAD_REQUEST)
public class TitleWithThatMalIdAlreadyExistsException extends RuntimeException{
    public TitleWithThatMalIdAlreadyExistsException(String message){
        super(message);
    }
}
