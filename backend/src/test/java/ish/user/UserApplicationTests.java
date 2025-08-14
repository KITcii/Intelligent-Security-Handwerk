package ish.user;

import ish.user.controller.UserController;
import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.TestPropertySource;

@TestPropertySource(properties = "spring.flyway.enabled=false")
@SpringBootTest
public class UserApplicationTests {

    @Autowired
    private UserController controller;

    @Test
    void testContextLoads() {
        Assertions.assertThat(controller).isNotNull();
    }
}
