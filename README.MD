# Todo-List ([출처](https://github.com/ektagarg/gin-gorm-todo-app))

- `golang-gorm-todo-app`: `net/http`패키지를 이용 
- `gin-gorm-todo-app`: `gin`프레임워크를 이용
- 아래의 파일만 코드가 상이 함
  - `main.go`
  - `Routes/Routes.go`
  - `Controllers/Todo.go`
  
## DB Setup

1. Go to Config/Database.go
2. Update DBName, User, Password and Host, Port according to your database configuration

## API list

* `GET` : Get all todos
* `POST` : Create a todo
* `GET` : Get a todo
* `PUT` : Update a todo
* `DELETE` : Delete a todo

## Post Params

```json
{
	"name": "Groceries shopping",
	"description": "Biscuits, Tea, Milk, Soap, Powder",
}
```
