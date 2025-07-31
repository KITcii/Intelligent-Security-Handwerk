package ish.user.security.filter;

import ish.user.model.security.JwtToken;
import ish.user.repository.security.JwtTokenRepository;
import ish.user.security.UserDetailsServiceImpl;
import ish.user.util.JwtUtil;
import lombok.extern.apachecommons.CommonsLog;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Optional;

@Component
@CommonsLog
public class AuthTokenFilter extends OncePerRequestFilter {
    private JwtUtil jwtUtil;

    private UserDetailsServiceImpl userDetailsService;

    private JwtTokenRepository jwtTokenRepository;

    public AuthTokenFilter(JwtUtil jwtUtil, UserDetailsServiceImpl userDetailsService, JwtTokenRepository jwtTokenRepository) {
        this.jwtUtil = jwtUtil;
        this.userDetailsService = userDetailsService;
        this.jwtTokenRepository = jwtTokenRepository;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        try {
            String jwt = parseJwt(request);

            if (jwt != null && jwtUtil.validateJwtToken(jwt)) {
                Optional<JwtToken> optionalToken = jwtTokenRepository.findByToken(jwt);

                if (optionalToken.isPresent() && optionalToken.get().isActive()) {
                    String userId = jwtUtil.getUserIdFromToken(jwt);
                    UserDetails userDetails = userDetailsService.loadUserByUsername(userId);

                    UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
                    authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    SecurityContextHolder.getContext().setAuthentication(authentication);
                }
            }
        } catch (Exception e) {
            log.error("Cannot set user authentication: " + e.getMessage(), e);
        }

        filterChain.doFilter(request, response);
    }

    private String parseJwt(HttpServletRequest request) {
        String headerAuth = request.getHeader("Authorization");

        if (StringUtils.hasText(headerAuth) && headerAuth.startsWith("Bearer ")) {
            return headerAuth.substring(7);
        }
        return null;
    }
}
