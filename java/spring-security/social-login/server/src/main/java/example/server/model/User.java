package example.server.model;

import jakarta.persistence.*;
import lombok.Getter;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Getter
@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String uid;

    private String email;

    private String name;

    @OneToMany(mappedBy = "user", fetch = FetchType.LAZY)
    private List<SocialUser> socialUsers = new ArrayList<>();

    @OneToOne(mappedBy = "user")
    private LocalUser localUser;

    public static User forNewOf(
            String email,
            String name
    ) {
        User user = new User();
        user.uid = UUID.randomUUID().toString();
        user.email = email;
        user.name = name;
        return user;
    }

    public void addSocialUser(SocialUser socialUser) {
        socialUsers.add(socialUser);
    }

    public void setLocalUser(LocalUser localUser) {
        this.localUser = localUser;
    }

    // 로컬 회원가입 시 이름이 이메일로 지정되므로, 소셜로그인 시 이름 변경
    public void updateName(String name) {
        if (this.email.equals(this.name)) {
            this.name = name;
        }
    }
}
