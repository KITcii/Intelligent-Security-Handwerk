package ish.user.service.security;

import ish.user.model.User;
import ish.user.model.security.TokenType;
import ish.user.model.security.UserToken;
import ish.user.repository.security.UserTokenRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

@Service
public class UserTokenService {

    private UserTokenRepository userTokenRepository;

    @Autowired
    public UserTokenService(UserTokenRepository userTokenRepository) {
        this.userTokenRepository = userTokenRepository;
    }

    public UserToken createVerificationToken(User user) {
        return createToken(user, TokenType.VERIFICATION, 24); // 24 hours expiry
    }

    public UserToken createPasswordResetToken(User user) {
        return createToken(user, TokenType.PASSWORD_RESET, 1); // 1 hour expiry
    }

    public UserToken createToken(User user, TokenType type, int hoursToExpire) {
        String token = UUID.randomUUID().toString();
        return createToken(user, token, type, hoursToExpire);
    }

    private UserToken createToken(User user, String token, TokenType type, int hoursToExpire) {
        UserToken userToken = new UserToken();
        userToken.setToken(token);
        userToken.setUser(user);
        userToken.setIssuedAt(LocalDateTime.now());
        userToken.setExpiryDate(LocalDateTime.now().plusHours(hoursToExpire));
        userToken.setType(type);
        userToken.setActive(true);

        return userTokenRepository.save(userToken);
    }

    public Optional<UserToken> findToken(String token, TokenType type) {
        return userTokenRepository.findByTokenAndTypeAndActive(token, type, true);
    }

    public boolean validateToken(Optional<UserToken> token) {
        return token
                .map(t -> t.getExpiryDate().isAfter(LocalDateTime.now()))
                .orElse(false);
    }

    public UserToken deactivateToken(UserToken token) {
        token.setActive(false);
        return userTokenRepository.save(token);
    }

    public boolean validateToken(String token, TokenType type) {
        return userTokenRepository.findByTokenAndTypeAndActive(token, type, true)
                .map(t -> t.getExpiryDate().isAfter(LocalDateTime.now()))
                .orElse(false);
    }
}
