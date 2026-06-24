package project_z.demo.common.Exceptions;

import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.dao.DataAccessException;

import project_z.demo.common.Exceptions.RoomMembersExceptions.RoomMembersConflictException;

@RestControllerAdvice
public class GlobalExceptionHandler {

    private static final Logger log = LoggerFactory.getLogger(GlobalExceptionHandler.class);


    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<Map<String, Object>> handleNotFound(ResourceNotFoundException ex) {
        return buildErrorResponse(ex.getMessage(), HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(TitleWithThatMalIdAlreadyExistsException.class)
    public ResponseEntity<Map<String, Object>> handleAlreadyExists(TitleWithThatMalIdAlreadyExistsException ex) {
        return buildErrorResponse(ex.getMessage(), HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(FriendshipConflictException.class)
    public ResponseEntity<Map<String, Object>> handleFriendshipConflict(FriendshipConflictException ex) {
        return buildErrorResponse(ex.getMessage(), HttpStatus.CONFLICT);
    }

    @ExceptionHandler(RoomMembersConflictException.class)
    public ResponseEntity<Map<String, Object>> handleRoomMembersConflict(RoomMembersConflictException ex) {
        return buildErrorResponse(ex.getMessage(), HttpStatus.CONFLICT);
    }

    @ExceptionHandler(SelfFriendRequestException.class)
    public ResponseEntity<Map<String, Object>> handleSelfFriendRequest(SelfFriendRequestException ex) {
        return buildErrorResponse(ex.getMessage(), HttpStatus.BAD_REQUEST);
    }
    
    @ExceptionHandler(AccessDeniedException.class)
    public  ResponseEntity<Map<String, Object>> handleAccessDenied(AccessDeniedException ex){
        return buildErrorResponse(ex.getMessage(), HttpStatus.FORBIDDEN);
    }

    @ExceptionHandler(HttpClientErrorException.class)
    public ResponseEntity<Map<String, Object>> handleHttpClientError(HttpClientErrorException ex) {
        if (ex.getStatusCode().value() == 402) {
            return buildErrorResponse("AI translation Service: Limit exhausted", HttpStatus.PAYMENT_REQUIRED);
        }
        if (ex.getStatusCode().value() == 429) {
            return buildErrorResponse("AI Translation Service: Daily quota or balance exhausted.", HttpStatus.TOO_MANY_REQUESTS);
        }
        return buildErrorResponse(ex.getMessage(), HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(DataAccessException.class)
    public ResponseEntity<Map<String, Object>> handleDatabaseException(DataAccessException ex) {
        log.error("Database error occurred: ", ex);
        return buildErrorResponse("Database error occurred", HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, Object>> handleGlobalException(Exception ex) {
        log.error("Unhandled exception occurred: ", ex);
        return buildErrorResponse("Internal Server Error: " + ex.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
    }


    private ResponseEntity<Map<String, Object>> buildErrorResponse(String message, HttpStatus status) {
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("timestamp", LocalDateTime.now());
        body.put("message", message);
        body.put("status", status.value());

        return new ResponseEntity<>(body, status);
    }
}