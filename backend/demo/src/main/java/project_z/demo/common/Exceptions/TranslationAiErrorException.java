package project_z.demo.common.Exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
public class TranslationAiErrorException extends RuntimeException{
    public TranslationAiErrorException(String message){
        super(message);
    }
}
