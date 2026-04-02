package project_z.demo.Mappers;

public interface  Mapper<A,B> {
 
B mapTo(A a );
A mapFrom (B b );
default void updateEntity(B dto, A entity) {
        // За замовчуванням нічого не робимо
    }
}
