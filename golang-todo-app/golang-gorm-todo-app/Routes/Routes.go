package Routes

import (
	"github.com/gorilla/mux"
	"todo-app/golang-gorm-todo-app/Controllers"
)

func SetupRouter() *mux.Router{
	r := mux.NewRouter()

	r.HandleFunc("/v1/todo", Controllers.GetTodos).Methods("GET")
	r.HandleFunc("/v1/todo", Controllers.CreateATodo).Methods("POST")
	r.HandleFunc("/v1/todo/{id}", Controllers.GetATodo).Methods("GET")
	r.HandleFunc("/v1/todo/{id}", Controllers.UpdateATodo).Methods("PUT")
	r.HandleFunc("/v1/todo/{id}", Controllers.DeleteATodo).Methods("DELETE")

	return r
}
