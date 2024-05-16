package example.server.app.user;

import example.server.model.User;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@Transactional
@RequiredArgsConstructor
public class UserService {

    private final UserRepository repository;

    public Optional<User> findByProvider(String provider, String providerUserId) {
        return repository.findByProviderAndProviderUserId(provider, providerUserId);
    }

    public User create(CreateCommand command) {
        return repository.save(User.forNewOf(
                command.provider(),
                command.providerUserId(),
                command.name(),
                command.email()
        ));
    }

    public record CreateCommand(
            String provider,
            String providerUserId,
            String name,
            String email
    ) {
    }
}
