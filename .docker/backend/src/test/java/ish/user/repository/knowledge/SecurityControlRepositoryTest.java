package ish.user.repository.knowledge;

import ish.user.model.knowledge.ControlGuideline;
import ish.user.model.knowledge.SecurityControl;
import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.test.context.jdbc.Sql;

import java.util.List;
import java.util.Optional;

@DataJpaTest
@Sql(scripts = "/control.sql")
public class SecurityControlRepositoryTest {

    @Autowired
    private SecurityControlRepository repository;

    @Test
    void testFindRootControl() {
        List<SecurityControl> controls = repository.findRootControls();

        Assertions.assertThat(controls).isNotEmpty();
        Assertions.assertThat(controls).size().isEqualTo(1);

        List<SecurityControl> children = controls.get(0).getChildren();
        Assertions.assertThat(children).size().isEqualTo(3);
        Assertions.assertThat(children).anyMatch(control -> control.getName().equals("Software"));
    }

    @Test
    void testFindById() {
        Optional<SecurityControl> control = repository.findById(14L);

        Assertions.assertThat(control).isNotEmpty();
    }

    @Test
    void testFindByIdWithGuideline() {
        Optional<SecurityControl> control = repository.findById(14L);

        Assertions.assertThat(control).isNotEmpty();
        Assertions.assertThat(control).map(SecurityControl::getGuidelines).isNotEmpty();

        List<ControlGuideline> guidelines = control.map(SecurityControl::getGuidelines).get();
        Assertions.assertThat(guidelines).size().isEqualTo(6);
        Assertions.assertThat(guidelines).anyMatch(g -> g.getDescription().contains("Institutionsleitung"));
    }

    @Test
    void testFindByIdWithGuidelineOrder() {
        Optional<SecurityControl> control = repository.findById(14L);

        Assertions.assertThat(control).isNotEmpty();
        Assertions.assertThat(control).map(SecurityControl::getGuidelines).isNotEmpty();

        List<ControlGuideline> guidelines = control.map(SecurityControl::getGuidelines).get();
        List<Integer> positions = guidelines.stream().map(ControlGuideline::getPosition).toList();
        Assertions.assertThat(positions).isSorted();
    }
}