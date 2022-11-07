package com.github.seungyeop_lee.java_cheatsheet.spring_scaffold.spring_boot_3.web.account;

import com.querydsl.core.types.dsl.BooleanExpression;
import com.querydsl.core.types.dsl.Expressions;

import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.List;

import static com.github.seungyeop_lee.java_cheatsheet.spring_scaffold.spring_boot_3.application.account.domain.QAccount.account;

public class AccountBooleanExpressionBuilder {
    private final List<BooleanExpression> beList;

    public AccountBooleanExpressionBuilder() {
        this.beList = new ArrayList<>();
    }

    public AccountBooleanExpressionBuilder id(List<Long> idList) {
        if (idList == null || idList.isEmpty()) {
            return this;
        }

        beList.add(account.id.in(idList));

        return this;
    }

    public AccountBooleanExpressionBuilder loginId(List<String> loginIdList) {
        if (loginIdList == null || loginIdList.isEmpty()) {
            return this;
        }

        if (loginIdList.size() == 1) {
            beList.add(account.loginId.contains(loginIdList.get(0)));
        } else {
            beList.add(account.loginId.in(loginIdList));
        }

        return this;
    }

    public AccountBooleanExpressionBuilder name(List<String> nameList) {
        if (nameList == null || nameList.isEmpty()) {
            return this;
        }

        if (nameList.size() == 1) {
            beList.add(account.name.contains(nameList.get(0)));
        } else {
            beList.add(account.name.in(nameList));
        }

        return this;
    }

    public AccountBooleanExpressionBuilder age(List<Long> ageList) {
        if (ageList == null || ageList.isEmpty()) {
            return this;
        }

        beList.add(account.age.in(ageList));

        return this;
    }

    public AccountBooleanExpressionBuilder email(List<String> emailList) {
        if (emailList == null || emailList.isEmpty()) {
            return this;
        }

        if (emailList.size() == 1) {
            beList.add(account.email.contains(emailList.get(0)));
        } else {
            beList.add(account.email.in(emailList));
        }

        return this;
    }

    public AccountBooleanExpressionBuilder gender(List<String> genderList) {
        if (genderList == null || genderList.isEmpty()) {
            return this;
        }

        beList.add(account.gender.in(genderList));

        return this;
    }

    public AccountBooleanExpressionBuilder interest(List<String> interestList) {
        if (interestList == null || interestList.isEmpty()) {
            return this;
        }

        interestList
                .stream()
                .map(account.interest::contains)
                .reduce(BooleanExpression::or)
                .ifPresent(beList::add);

        return this;
    }

    public AccountBooleanExpressionBuilder joinPath(List<String> joinPathList) {
        if (joinPathList == null) {
            return this;
        }

        if (joinPathList.isEmpty()) {
            beList.add(account.joinPath.isEmpty());
        } else {
            beList.add(account.joinPath.in(joinPathList));
        }

        return this;
    }

    public AccountBooleanExpressionBuilder isLock(Boolean isLock) {
        if (isLock == null) {
            return this;
        }

        beList.add(account.isLock.eq(isLock));

        return this;
    }

    public AccountBooleanExpressionBuilder birthday(OffsetDateTime birthdayFrom, OffsetDateTime birthdayTo) {
        if (birthdayFrom == null && birthdayTo == null) {
            return this;
        }

        beList.add(account.birthday.between(birthdayFrom, birthdayTo));

        return this;
    }

    public BooleanExpression build() {
        return beList
                .stream()
                .reduce(
                        Expressions.asBoolean(true).isTrue(),
                        BooleanExpression::and
                );
    }
}
