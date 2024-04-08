package poc.backup.mariabackup.stability.server.user;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @PostMapping("/group")
    public ResponseEntity<Group> createGroup(@RequestBody Map<String, String> body) {
        String groupName = body.get("name");
        Group group = userService.createGroup(groupName);
        return ResponseEntity.ok(group);
    }

    @PostMapping("/user")
    public ResponseEntity<User> createUser(@RequestBody Map<String, String> body) {
        String userName = body.get("name");
        String userEmail = body.get("email");
        Long groupId = Long.parseLong(body.get("groupId"));
        User user = userService.createUser(userName, userEmail, groupId);
        return ResponseEntity.ok(user);
    }
}
