package poc.backup.mariabackup.stability.server.user;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import static java.lang.Thread.sleep;

@Service
@Transactional
@RequiredArgsConstructor
public class UserService {

    private final GroupRepository groupRepo;
    private final UserRepository userRepo;

    public Group createGroup(String groupName) {
        return groupRepo.save(Group.of(groupName));
    }

    public User createUser(String userName, String userEmail, Long groupId) {
        Group group = groupRepo.findById(groupId).orElseThrow();
        try {
            sleep(100);
        } catch (InterruptedException e) {
            throw new RuntimeException(e);
        }
        User user = User.of(userName, userEmail, group);
        return userRepo.save(user);
    }
}
