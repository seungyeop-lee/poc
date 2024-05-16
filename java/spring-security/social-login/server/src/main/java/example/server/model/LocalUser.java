package example.server.model;

import jakarta.persistence.*;
import lombok.Getter;

@Getter
@Entity
@Table(name = "local_user")
public class LocalUser {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String password;

    @OneToOne(optional = false)
    @JoinColumn(name = "user_id")
    private User user;

    public static LocalUser forNewOf(
            String password,
            User user
    ) {
        LocalUser localUser = new LocalUser();
        localUser.password = password;
        localUser.user = user;
        return localUser;
    }
}
