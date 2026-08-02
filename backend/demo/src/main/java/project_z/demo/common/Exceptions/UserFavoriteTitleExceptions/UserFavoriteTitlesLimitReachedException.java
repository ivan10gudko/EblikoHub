package project_z.demo.common.Exceptions.UserFavoriteTitleExceptions;

public class UserFavoriteTitlesLimitReachedException extends RuntimeException{
    public UserFavoriteTitlesLimitReachedException(String message) {
        super(message);
    }
}
