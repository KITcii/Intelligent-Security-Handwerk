package ish.user.repository.security;

import ish.user.model.User;
import ish.user.model.security.JwtToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface JwtTokenRepository extends JpaRepository<JwtToken, Long> {

    Optional<JwtToken> findByToken(String token);

    void deleteByToken(String token);

    void deleteAllByUser(User user);
}