package example.server.app.user;

import example.server.model.LocalUser;
import example.server.model.SocialUser;
import example.server.model.User;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@Transactional
@RequiredArgsConstructor
public class UserService {

    private final UserRepository repository;
    private final SocialUserRepository socialUserRepository;
    private final LocalUserRepository localUserRepository;
    private final PasswordEncoder passwordEncoder;

    public Optional<SocialUser> findByProvider(String provider, String providerUserId) {
        return socialUserRepository.findByProviderAndProviderUserId(provider, providerUserId);
    }

    public SocialUser joinBySocialUser(CreateCommand command) {
        User user = repository.findByEmail(command.email())
                .orElseGet(() -> {
                    User newUser = User.forNewOf(command.email(), command.name());
                    return repository.save(newUser);
                });

        SocialUser socialUser = SocialUser.forNewOf(
                command.provider(),
                command.providerUserId(),
                user
        );
        SocialUser savedSocialUser = socialUserRepository.save(socialUser);
        user.addSocialUser(savedSocialUser);

        return socialUser;
    }

    public LocalUser joinByLocalUser(String email, String password) {
        repository.findByEmail(email).ifPresent(user -> {
            throw new IllegalArgumentException("User already exists");
        });

        User newUser = User.forNewOf(email, email);
        User savedUser = repository.save(newUser);

        LocalUser localUser = LocalUser.forNewOf(passwordEncoder.encode(password), savedUser);
        LocalUser savedLocalUser = localUserRepository.save(localUser);
        savedUser.setLocalUser(savedLocalUser);

        return savedLocalUser;
    }

    public record CreateCommand(
            String provider,
            String providerUserId,
            String name,
            String email
    ) {
    }
}
