package project_z.demo.common.Exceptions.UserFavoriteCharacterExceptions;

public class UserFavoriteCharactersLimitReachedException extends RuntimeException {
    public UserFavoriteCharactersLimitReachedException(String message) {
        super(message);
    }
}
