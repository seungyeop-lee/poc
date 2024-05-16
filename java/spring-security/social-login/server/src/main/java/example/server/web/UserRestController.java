package example.server.web;

import example.server.config.auth.model.MyOAuth2User;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/user")
@RequiredArgsConstructor
public class UserRestController {

    @GetMapping("/my")
    public String myInfo() {
        MyOAuth2User oAuth2User = (MyOAuth2User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return oAuth2User.toString();
    }
}
