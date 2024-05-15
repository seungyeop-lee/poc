package example.server.model;

import jakarta.persistence.*;
import lombok.Getter;

import java.util.UUID;

@Getter
@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String uid;

    private String provider;

    private String providerUserId;

    private String name;

    private String email;

    public static User forNewOf(
            String provider,
            String providerUserId,
            String name,
            String email
    ) {
        User user = new User();
        user.uid = UUID.randomUUID().toString();
        user.provider = provider;
        user.providerUserId = providerUserId;
        user.name = name;
        user.email = email;
        return user;
    }
}
