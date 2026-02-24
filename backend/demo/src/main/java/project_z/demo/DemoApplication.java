package project_z.demo;

import java.util.TimeZone;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

import io.github.cdimascio.dotenv.Dotenv;

@EnableJpaAuditing
@SpringBootApplication
@EnableJpaRepositories("project_z.demo.repositories")
public class DemoApplication {
	public static void main(String[] args) {
		Dotenv dotenv = Dotenv.configure()
                .ignoreIfMissing()
                .load();

        dotenv.entries().forEach(entry -> {
            System.setProperty(entry.getKey(), entry.getValue());
        });

		TimeZone.setDefault(TimeZone.getTimeZone("UTC"));
		SpringApplication.run(DemoApplication.class, args);
	}

}
