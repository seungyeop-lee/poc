# Traefik reload config

## dynamic config

- volume mount를 할 경우, 파일당 mount를 할 경우, 변경에 대한 signal이 컨테이너에 제대로 전달되지 않은경우가 있음
- 그러므로 volume mount는 폴더로 할 것!

## static config

- traefik 실행 시, 적용됨으로 수정 후 컨테이너 restart를 수행
