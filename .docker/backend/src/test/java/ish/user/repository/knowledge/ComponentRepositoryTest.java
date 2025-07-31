package ish.user.repository.knowledge;

import ish.user.model.knowledge.Component;
import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.test.context.jdbc.Sql;

import java.util.List;
import java.util.Optional;

@DataJpaTest
@Sql(scripts = "/component.sql")
class ComponentRepositoryTest {

    @Autowired
    private ComponentRepository repository;

    @Test
    void testFindRootComponents() {
        List<Component> components = repository.findRootComponents();

        Assertions.assertThat(components).isNotEmpty();
        Assertions.assertThat(components).size().isEqualTo(1);

        List<Component> children = components.get(0).getChildren();
        Assertions.assertThat(children).size().isEqualTo(3);
        Assertions.assertThat(children).anyMatch(control -> control.getName().equals("Software"));
    }

    @Test
    void testFindById() {
        Optional<Component> component = repository.findById(25L);

        Assertions.assertThat(component).isNotEmpty();
        Assertions.assertThat(component).hasValueSatisfying(c ->
                Assertions.assertThat(c.getName()).isEqualTo("Hardware")
        );
    }

}