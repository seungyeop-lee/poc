// prod database 생성
db = db.getSiblingDB("prod");

// user collection 생성
db.createCollection("user");

// user collection에 테스트 데이터 5개 추가
db.user.insertMany([
  { name: "Alice2", age: 30, email: "alice@example.com" },
  { name: "Bob2", age: 25, email: "bob@example.com" },
  { name: "Charlie2", age: 35, email: "charlie@example.com" },
  { name: "David2", age: 28, email: "david@example.com" },
  { name: "Eve2", age: 22, email: "eve@example.com" }
]);
