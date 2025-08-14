package ish.user.config;

import ish.user.repository.UserRepository;
import ish.user.security.UserDetailsServiceImpl;
import ish.user.util.JwtUtil;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;

@TestConfiguration
public class TestSecurityConfiguration {

    @Bean
    public UserDetailsServiceImpl userDetailsServiceImpl(UserRepository userRepository) {
        return new UserDetailsServiceImpl(userRepository);
    }

    @Bean
    public JwtUtil jwtUtil() {
        return new JwtUtil();
    }
}
