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
