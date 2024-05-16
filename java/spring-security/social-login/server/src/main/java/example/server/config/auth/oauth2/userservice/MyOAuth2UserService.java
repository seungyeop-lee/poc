package example.server.config.auth.oauth2.userservice;

import example.server.app.user.UserService;
import example.server.config.auth.model.MyOAuth2User;
import example.server.model.SocialUser;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@Transactional
@RequiredArgsConstructor
public class MyOAuth2UserService extends DefaultOAuth2UserService {

    private final UserService userService;

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        OAuth2User oAuth2User = super.loadUser(userRequest);
        log.info("OAuth2User: {}", oAuth2User);

        String registrationId = userRequest.getClientRegistration().getRegistrationId();
        OAuth2Response oAuth2Response = toOAuth2Response(registrationId, oAuth2User);
        if (oAuth2Response == null) {
            log.info("Unsupported registrationId: {}", registrationId);
            return null;
        }

        return userService.findByProvider(oAuth2Response.getProvider(), oAuth2Response.getProviderId())
                .map(MyOAuth2User::from)
                .orElseGet(() -> createNewUser(oAuth2Response));
    }

    private static OAuth2Response toOAuth2Response(String registrationId, OAuth2User oAuth2User) {
        return switch (registrationId) {
            case "google" -> new OAuth2GoogleResponse(oAuth2User.getAttributes());
            case "naver" -> new OAuth2NaverResponse(oAuth2User.getAttributes());
            default -> null;
        };
    }

    private MyOAuth2User createNewUser(OAuth2Response oAuth2Response) {
        SocialUser saved = userService.joinBySocialUser(
                new UserService.CreateCommand(
                        oAuth2Response.getProvider(),
                        oAuth2Response.getProviderId(),
                        oAuth2Response.getName(),
                        oAuth2Response.getEmail()
                )
        );
        return MyOAuth2User.from(saved);
    }
}
