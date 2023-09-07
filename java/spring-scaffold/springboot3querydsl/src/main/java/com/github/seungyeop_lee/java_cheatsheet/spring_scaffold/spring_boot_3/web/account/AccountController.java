package com.github.seungyeop_lee.java_cheatsheet.spring_scaffold.spring_boot_3.web.account;

import com.github.seungyeop_lee.java_cheatsheet.spring_scaffold.spring_boot_3.application.account.domain.Account;
import com.github.seungyeop_lee.java_cheatsheet.spring_scaffold.spring_boot_3.application.account.domain.AccountRepository;
import com.github.seungyeop_lee.java_cheatsheet.spring_scaffold.spring_boot_3.application.account.metadata.AccountMetadata;
import lombok.RequiredArgsConstructor;
import lombok.extern.java.Log;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.OffsetDateTime;
import java.util.List;

import static org.springframework.data.domain.Sort.Direction;

@RestController
@RequiredArgsConstructor
@Log
public class AccountController {

    private final AccountRepository repository;

    @GetMapping(path = AccountMetadata.path + "/list")
    public Page<Account> findAll(
            @PageableDefault(size = Integer.MAX_VALUE, sort = "id", direction = Direction.DESC) Pageable page) {
        return repository.findAll(page);
    }

    @GetMapping(path = AccountMetadata.path + "/search")
    public Page<Account> search(
            @RequestParam(required = false, name = "id") List<Long> idList,
            @RequestParam(required = false, name = "loginId") List<String> loginIdList,
            @RequestParam(required = false, name = "name") List<String> nameList,
            @RequestParam(required = false, name = "age") List<Long> ageList,
            @RequestParam(required = false, name = "email") List<String> emailList,
            @RequestParam(required = false, name = "gender") List<String> genderList,
            @RequestParam(required = false, name = "interest") List<String> interestList,
            @RequestParam(required = false, name = "joinPath") List<String> joinPathList,
            @RequestParam(required = false, name = "isLock") Boolean isLock,
            @RequestParam(required = false, name = "birthdayFrom") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) OffsetDateTime birthdayFrom,
            @RequestParam(required = false, name = "birthdayTo") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) OffsetDateTime birthdayTo,
            @PageableDefault(sort = "id", direction = Direction.DESC) Pageable page
    ) {
        Page<Account> result = repository.findAll(
                new AccountBooleanExpressionBuilder()
                        .id(idList)
                        .loginId(loginIdList)
                        .name(nameList)
                        .age(ageList)
                        .email(emailList)
                        .gender(genderList)
                        .interest(interestList)
                        .joinPath(joinPathList)
                        .isLock(isLock)
                        .birthday(birthdayFrom, birthdayTo)
                        .build(),
                page
        );
        return result;
    }
}
