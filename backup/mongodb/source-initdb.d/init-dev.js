// dev database 생성
db = db.getSiblingDB("dev");

// user collection 생성
db.createCollection("user");

// user collection에 테스트 데이터 5개 추가
db.user.insertMany([
  { name: "Alice1", age: 30, email: "alice@example.com" },
  { name: "Bob1", age: 25, email: "bob@example.com" },
  { name: "Charlie1", age: 35, email: "charlie@example.com" },
  { name: "David1", age: 28, email: "david@example.com" },
  { name: "Eve1", age: 22, email: "eve@example.com" }
]);
