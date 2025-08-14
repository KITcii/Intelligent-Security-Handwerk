package ish.user.repository;

import ish.user.model.User;
import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;

@DataJpaTest
class UserRepositoryTest {

    @Autowired
    private UserRepository repository;

    @Test
    public void whenImportedThenFindsById() {
        List<User> users = repository.findAllById(Arrays.asList(1L, 2L, 3L));
        Assertions.assertThat(users).size().isEqualTo(3);

        users = repository.findAllById(Arrays.asList(1L, 3L));
        Assertions.assertThat(users).size().isEqualTo(2);
    }

    @Test
    public void whenImportedThenFindsByMail() {
        Optional<User> user = repository.findByMail("norm.eugene@macdonald.com").stream().findFirst();
        Assertions.assertThat(user).isNotEmpty();
        Assertions.assertThat(user.get().getFirstName()).isEqualTo("Norman");
        Assertions.assertThat(user.get().getLastName()).isEqualTo("MacDonald");

        user = repository.findByMail("mr.warmth@rickles.com").stream().findFirst();
        Assertions.assertThat(user).isNotEmpty();
        Assertions.assertThat(user.get().getFirstName()).isEqualTo("Don");
        Assertions.assertThat(user.get().getLastName()).isEqualTo("Rickles");

        user = repository.findByMail("rodney@dangerfield.com").stream().findFirst();
        Assertions.assertThat(user).isNotEmpty();
        Assertions.assertThat(user.get().getFirstName()).isEqualTo("Rodney");
        Assertions.assertThat(user.get().getLastName()).isEqualTo("Dangerfield");
    }
    
    @Test
    public void whenSavedThenFindsByMail() {
        repository.save(new User("john.doe@example.com", "John", "Doe"));
        assertThat(repository.findByMail("john.doe@example.com")).isNotNull();
    }

}