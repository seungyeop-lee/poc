package Controllers

import (
	"encoding/json"
	"fmt"
	"github.com/gorilla/mux"
	"net/http"

	"todo-app/golang-gorm-todo-app/Models"
)

func GetTodos(w http.ResponseWriter, r *http.Request) {
	var todo []Models.Todo
	err := Models.GetAllTodos(&todo)
	if err != nil {
		w.WriteHeader(http.StatusNotFound)
	} else {
		// 헤더는 제일 먼저 set 해 주어야 적용된다.
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		json.NewEncoder(w).Encode(todo)
	}
}

func CreateATodo(w http.ResponseWriter, r *http.Request) {
	var todo Models.Todo
	if err := json.NewDecoder(r.Body).Decode(&todo); err != nil {
		w.WriteHeader(http.StatusNotFound)
		return
	}
	err := Models.CreateATodo(&todo)
	if err != nil {
		w.WriteHeader(http.StatusNotFound)
	} else {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		json.NewEncoder(w).Encode(todo)
	}
}

func GetATodo(w http.ResponseWriter, r *http.Request) {
	id := mux.Vars(r)["id"]
	var todo Models.Todo
	err := Models.GetATodo(&todo, id)
	if err != nil {
		w.WriteHeader(http.StatusNotFound)
	} else {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		json.NewEncoder(w).Encode(todo)
	}
}

func UpdateATodo(w http.ResponseWriter, r *http.Request) {
	var todo Models.Todo
	id := mux.Vars(r)["id"]
	err := Models.GetATodo(&todo, id)
	if err != nil {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusNotFound)
		json.NewEncoder(w).Encode(todo)
	}
	if err := json.NewDecoder(r.Body).Decode(&todo); err != nil {
		w.WriteHeader(http.StatusNotFound)
		return
	}
	err = Models.UpdateATodo(&todo, id)
	if err != nil {
		w.WriteHeader(http.StatusNotFound)
	} else {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		json.NewEncoder(w).Encode(todo)
	}
}

func DeleteATodo(w http.ResponseWriter, r *http.Request) {
	var todo Models.Todo
	id := mux.Vars(r)["id"]
	err := Models.DeleteATodo(&todo, id)
	if err != nil {
		w.WriteHeader(http.StatusNotFound)
	} else {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		fmt.Fprint(w, `{"id:` + id + `"` + `:"deleted"}`)
	}
}
