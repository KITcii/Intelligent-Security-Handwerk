package ish.user.controller.util;

import ish.user.model.User;
import ish.user.model.security.JwtToken;
import ish.user.repository.security.JwtTokenRepository;
import jakarta.servlet.http.HttpServletRequest;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
@AllArgsConstructor
public class UserExtractor {

    private final JwtTokenRepository jwtTokenRepository;

    private Optional<String> extractJwtFromRequest(HttpServletRequest request) {
        String jwt = request.getHeader("Authorization");
        if (jwt == null || !jwt.startsWith("Bearer ")) {
            return Optional.empty();
        }
        return Optional.of(jwt.substring(7));
    }

    public Optional<User> fromSession(HttpServletRequest request) {
        return extractJwtFromRequest(request)
                .flatMap(jwtTokenRepository::findByToken)
                .map(JwtToken::getUser);
    }
}
