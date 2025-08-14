package ish.user.repository.security;

import ish.user.model.User;
import ish.user.model.security.TokenType;
import ish.user.model.security.UserToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserTokenRepository extends JpaRepository<UserToken, Long> {

    Optional<UserToken> findByToken(String token);

    Optional<UserToken>findByTokenAndTypeAndActive(String token, TokenType type, boolean active);

    void deleteByToken(String token);

    void deleteAllByUser(User user);
}
