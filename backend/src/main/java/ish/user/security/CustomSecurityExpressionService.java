package ish.user.security;

import ish.user.model.User;
import ish.user.repository.UserRepository;
import lombok.extern.apachecommons.CommonsLog;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.Objects;
import java.util.Optional;

@Service("securitySrvUsr")
@CommonsLog
public class CustomSecurityExpressionService {

    @Autowired
    private UserRepository userRepository;

    public boolean isSelf(Long id){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String name = authentication.getName();
        return Objects.equals(Objects.toString(id), name);
    }

}
