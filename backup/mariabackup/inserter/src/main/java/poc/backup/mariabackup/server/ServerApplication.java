package poc.backup.mariabackup.server;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.stereotype.Component;

import java.util.Arrays;

@Slf4j
@SpringBootApplication
public class ServerApplication {

    public static void main(String[] args) {
        SpringApplication.run(ServerApplication.class, args);
    }

    @Component
    @RequiredArgsConstructor
    public class Runner implements CommandLineRunner {

        private final UserRepository repo;

        @Override
        public void run(String... args) {
            log.info("args: {}", Arrays.asList(args));
            if (args.length == 0) {
                return;
            }

            String action = args[0];
            switch (action) {
                case "insert":
                    String suffix = args[1];
                    log.info("action: {}, suffix: {}", action, suffix);
                    insert(suffix);
                    break;
                case "truncate":
                    log.info("action: {}", action);
                    truncate();
                    break;
            }
        }

        private void insert(String suffix) {
            User user = User.of(
                    "이름" + suffix,
                    String.format("email%s@test.com", suffix)
            );
            repo.save(user);
        }

        private void truncate() {
            repo.deleteAllInBatch();
        }
    }
}
