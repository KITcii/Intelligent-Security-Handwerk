package ish.user.config;

import ish.user.security.AuthEntryPointJwt;
import ish.user.security.UserDetailsServiceImpl;
import ish.user.security.filter.AuthTokenFilter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.security.servlet.PathRequest;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.annotation.web.configurers.HeadersConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.servlet.util.matcher.MvcRequestMatcher;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity(prePostEnabled = true)
public class SecurityConfiguration {
    private UserDetailsServiceImpl userDetailsService;
    private AuthEntryPointJwt authEntryPointJwt;
    private AuthTokenFilter authTokenFilter;
    private MvcRequestMatcher.Builder mvc;

    @Value("${spring.h2.console.enabled:#{false}}")
    private boolean h2ConsoleEnabled;

    public SecurityConfiguration(UserDetailsServiceImpl userDetailsService, AuthEntryPointJwt authEntryPointJwt, AuthTokenFilter authTokenFilter, MvcRequestMatcher.Builder mvc) {
        this.userDetailsService = userDetailsService;
        this.authEntryPointJwt = authEntryPointJwt;
        this.authTokenFilter = authTokenFilter;
        this.mvc = mvc;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration) throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }

    @Bean
    @Primary
    public AuthenticationManagerBuilder configureAuthenticationManagerBuilder(AuthenticationManagerBuilder authenticationManagerBuilder) throws Exception {
        authenticationManagerBuilder.userDetailsService(userDetailsService).passwordEncoder(passwordEncoder());
        return authenticationManagerBuilder;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .cors(AbstractHttpConfigurer::disable)
                .csrf(csrf -> {
                    if (h2ConsoleEnabled) {
                        csrf.ignoringRequestMatchers(PathRequest.toH2Console()).disable();
                    } else {
                        csrf.disable();
                    }
                })
                .exceptionHandling(exceptionHandling -> exceptionHandling.authenticationEntryPoint(authEntryPointJwt))
                .sessionManagement(sessionManagement -> sessionManagement.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(authorizeHttpRequests -> {
                    authorizeHttpRequests
                            .requestMatchers(mvc.pattern("/api/v1.0/auth/**")).permitAll()
                            .requestMatchers(mvc.pattern("/api/v1.0/locations/**")).permitAll()
                            .requestMatchers(mvc.pattern("/api/v1.0/professions/**")).permitAll()
                            .requestMatchers(mvc.pattern("/api/v1.0/users/api-docs/**")).permitAll()
                            .requestMatchers(mvc.pattern("/api/v1.0/users/swagger-ui/**")).permitAll()
                            .requestMatchers(mvc.pattern("/api/v1.0/users/register")).permitAll()
                            .requestMatchers(mvc.pattern("/api/v1.0/users/**")).authenticated()
                            .requestMatchers(mvc.pattern("/api/v1.0/companies/**")).authenticated()
                            .requestMatchers(mvc.pattern("/api/v1.0/support/**")).authenticated()
                            .requestMatchers(mvc.pattern("/api/v1.0/knowledge/**")).authenticated()
                            .requestMatchers(mvc.pattern("/api/v1.0/component-asset/**")).authenticated()
                            .requestMatchers(mvc.pattern("/api/v1.0/control-asset/**")).authenticated()
                            .requestMatchers(mvc.pattern("/api/v1.0/assessment/**")).authenticated()
                            .requestMatchers(mvc.pattern("/favicon.ico")).permitAll()
                            .requestMatchers(mvc.pattern("/error")).permitAll();

                    // Conditionally allow H2 Console access
                    if (h2ConsoleEnabled)
                        authorizeHttpRequests.requestMatchers(PathRequest.toH2Console()).permitAll();

                    authorizeHttpRequests.anyRequest().authenticated();
                })
                .headers(headers -> headers.frameOptions(HeadersConfigurer.FrameOptionsConfig::disable));

        http.addFilterBefore(authTokenFilter, UsernamePasswordAuthenticationFilter.class);
        return http.build();
    }

}