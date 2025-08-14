package ish.user.service.knowledge;

import ish.user.dto.knowledge.ControlSearchCriteria;
import ish.user.model.knowledge.SecurityControl;
import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.core.io.ClassPathResource;
import org.springframework.jdbc.core.JdbcTemplate;

import java.io.IOException;
import java.nio.file.Files;
import java.util.List;

@SpringBootTest
// Spring Framework 6.1 supports BEFORE_TEST_CLASS as execution phase
//@Sql(scripts = {"/control.sql"}, executionPhase = Sql.ExecutionPhase.BEFORE_TEST_CLASS)
class SecurityControlServiceTest {

    @Autowired
    private SecurityControlService controlService;

    @BeforeAll
    static void loadTestData(@Autowired JdbcTemplate jdbcTemplate) throws IOException {
        String controlSql = Files.readString(new ClassPathResource("control.sql").getFile().toPath());
        jdbcTemplate.execute(controlSql);
    }

    @Test
    void testContextLoads() {
        Assertions.assertThat(controlService).isNotNull();
    }

    @Test
    void findByCriteriaWithName() {
        String name = "e-mail";
        ControlSearchCriteria searchCriteria = ControlSearchCriteria.builder()
                .nameLike(name)
                .build();
        List<SecurityControl> controls = controlService.findByCriteria(searchCriteria);

        Assertions.assertThat(controls).isNotEmpty();
        Assertions.assertThat(controls).allMatch(control -> control.getName().toLowerCase().contains(name));
    }

    @Test
    void findByCriteriaWithGuidelineDescription() {
        String description = "institutionsleitung";
        ControlSearchCriteria searchCriteria = ControlSearchCriteria.builder()
                .guidelineDescriptionLike(description)
                .build();
        List<SecurityControl> controls = controlService.findByCriteria(searchCriteria);

        Assertions.assertThat(controls).isNotEmpty();
        Assertions.assertThat(controls).anyMatch(control -> control.getId() == 14);
        Assertions.assertThat(controls).allMatch(control -> control.getGuidelines().stream().anyMatch(g -> g.getDescription().toLowerCase().contains(description)));
    }
}