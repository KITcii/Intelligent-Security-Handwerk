package ish.user.model.security;

import ish.user.model.User;
import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.time.LocalDateTime;
import java.util.StringJoiner;

@Entity
@Data
public class UserToken {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String token;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id", nullable = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    private User user;

    @Column(nullable = false)
    private LocalDateTime issuedAt;

    @Column(nullable = false)
    private LocalDateTime expiryDate;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TokenType type;

    @Column(nullable = false)
    private boolean active;

    @Override
    public String toString() {
        return new StringJoiner(", ", UserToken.class.getSimpleName() + "[", "]")
                .add("token='" + token + "'")
                .add("issuedAt=" + issuedAt)
                .add("expiryDate=" + expiryDate)
                .add("type=" + type)
                .add("active=" + active)
                .toString();
    }
}
