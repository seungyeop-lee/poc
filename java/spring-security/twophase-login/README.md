# 간단 2단계 로그인 PoC

- FrontServer가 BackServer에 인증 관련 된 로직을 위임하는 간단한 예제코드 작성
- Spring Security에서 인증 관련 부분을 어떻게 다른 서버로 위임 할 것인가를 고민하고 구현한 PoC

## 실습 방법

### 공통 실습 방법

1. login-back 어플리케이션 실행
2. login-front 어플리케이션 실행
3. http://localhost:8001/main 으로 접속
4. 로그인 창이 나오면 아무 id나 입력 후 로그인 버튼 클릭

### 로그인 성공 시나리오

공통 실습 방법 수행 후

1. 로그에 나온 uuid를 넣어서 testhttp/test.http 파일의 요청을 보낸다.
2. status code 200이 반환됨을 확인한다.
3. 로그인 창에 '로그인 확인' 버튼을 클릭한다.
4. main 화면으로 이동 함을 확인한다.

### 로그인 실패 시나리오

공통 실습 방법 수행 후

1. 로그인 창에 '로그인 확인' 버튼을 클릭한다.
2. login fail 화면으로 이동 함을 확인한다.

### 로그아웃 방법

- http://localhost:8001/member/logout 으로 접속하면 로그아웃 됨
