package project_z.demo.JavaUtil;

import java.util.function.Consumer;

import org.openapitools.jackson.nullable.JsonNullable;
import org.springframework.stereotype.Component;

@Component
public class PatchHelper {
    public <T> void updateIfPresent(JsonNullable<T> nullable, Consumer<T> attribute){
        if(nullable.isPresent()){
            attribute.accept(nullable.get());
        }
    }
}
