package ish.user.service.security;

import ish.user.repository.security.JwtTokenRepository;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;

import java.time.LocalDateTime;
import java.util.concurrent.TimeUnit;

@Service
public class TokenCleanupService {

    private JwtTokenRepository jwtTokenRepository;

    @Autowired
    public TokenCleanupService(JwtTokenRepository jwtTokenRepository) {
        this.jwtTokenRepository = jwtTokenRepository;
    }

    @Scheduled(fixedRate = 24, timeUnit = TimeUnit.HOURS)
    public void cleanupExpiredTokens() {
        jwtTokenRepository.findAll().forEach(token -> {
            if (token.getExpiryDate().isBefore(LocalDateTime.now())) {
                jwtTokenRepository.delete(token);
            }
        });
    }
}