# server-app

Prerequisites:

- [Vercel CLI](https://vercel.com/docs/cli) installed globally

To develop locally:

```
npm install
vc dev
```

```
open http://localhost:3000
```

To build locally:

```
npm install
vc build
```

To deploy:

```
npm install
vc deploy
```

## 주의사항

- drizzle-kit push를 supabase cloud에 할 경우, port를 5432로 사용 할 것
  - ref: https://github.com/drizzle-team/drizzle-orm/issues/2590
- drizzle-kit generate, migrate 등을 사용 할 때, schema를 여러 파일에 분산 할 경우, 명령어 앞에 `NODE_OPTIONS='--import tsx'`를 붙일 것
  - ex) `NODE_OPTIONS='--import tsx' npx drizzle-kit generate`
  - ref: https://github.com/drizzle-team/drizzle-orm/issues/2705
- vercel dev에서 사용하는 TS는 4버전대를 사용, zod v4는 TS를 5버전대 사용. 이로인해 개발서버에서 계속 에러가 발생
  - yarn의 resolutions를 이용하여 typescript 버전을 5버전대로 강제 고정
