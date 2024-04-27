package poc.backup.mariabackup.stability.server.user;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Entity
@NoArgsConstructor
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    private String email;

    @ManyToOne(fetch = FetchType.LAZY)
    private Group group;

    public static User of(String name, String email, Group group) {
        User user = new User();
        user.name = name;
        user.email = email;
        group.addUser(user);
        user.group = group;
        return user;
    }
}
