/*package project_z.demo.repositories;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import project_z.demo.TestDataUtil;
import project_z.demo.entity.UserEntity;
@SpringBootTest
@ExtendWith(SpringExtension.class)
@DirtiesContext(classMode=DirtiesContext.ClassMode.AFTER_EACH_TEST_METHOD)
public class UserRepositoryIntegrationTests {
    @Autowired
    private UserRepository underTest;
    
    
@Test
public void testThatCreateNewUser(){
    UserEntity user = TestDataUtil.createTestUserA();
    underTest.save(user);
    Optional<UserEntity> result = underTest.findById(user.getId());
    assertThat(result).isPresent();
    assertThat (result.get())
    .usingRecursiveComparison()
    .ignoringFields("id" ,"friendsList")
    .isEqualTo(user);
    
}
@Test 
public void testThatUpdateUser(){
    UserEntity user = TestDataUtil.createTestUserA();
    underTest.save(user);
    user.setName("UPDATED");
    underTest.save(user);
    Optional <UserEntity> result = underTest.findById(user.getId());
    assertThat(result).isPresent();
    assertThat(result.get()).usingRecursiveComparison()
    .ignoringFields("id" ,"friendsList")
    .isEqualTo(user);
}

}

*/