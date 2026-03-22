/*package project_z.demo.repositories;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import jakarta.transaction.Transactional;
import project_z.demo.TestDataUtil;
import project_z.demo.entity.TitleEntity;
import project_z.demo.entity.UserEntity;
@SpringBootTest
@ExtendWith(SpringExtension.class)
@DirtiesContext(classMode=DirtiesContext.ClassMode.AFTER_EACH_TEST_METHOD)

public class TitleRepositoryIntegrationTests {
     @Autowired
    private TitleRepository underTest;
    @Autowired
    private UserRepository userRepository;

    

  @Test
  @Transactional
public void testThatCreateNewTitle(){
    UserEntity user = TestDataUtil.createTestUserA();
      userRepository.save(user);
    TitleEntity title = TestDataUtil.createTestTitleA(user);
    underTest.save(title);
    Optional <TitleEntity> result = underTest.findById(title.getTitleId());
    assertThat(result).isPresent();
    assertThat(result.get())
    .usingRecursiveComparison()
    .ignoringFields("id")
    .isEqualTo(title);
  

}
@Test
@Transactional
public void testThatUpdateTitle(){
    UserEntity user = TestDataUtil.createTestUserA();
      userRepository.save(user);
    TitleEntity title = TestDataUtil.createTestTitleA(user);
    underTest.save(title);
    title.setTitleName("UPDATED");
    underTest.save(title);
    Optional <TitleEntity> result = underTest.findById(title.getTitleId());
    assertThat(result).isPresent();
    assertThat(result.get())
    .usingRecursiveComparison()
    .ignoringFields("id")
    .isEqualTo(title);
}
@Test
@Transactional
public void testThatDeleteTitle(){
    UserEntity user = TestDataUtil.createTestUserA();
    userRepository.save(user);
    TitleEntity title = TestDataUtil.createTestTitleA(user);
    underTest.save(title);
    underTest.deleteById(title.getTitleId());
    Optional <TitleEntity> result = underTest.findById(title.getTitleId());
    assertThat(result).isEmpty();
}
}



*/