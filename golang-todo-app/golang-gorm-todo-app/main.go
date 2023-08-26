package main

import (
	"fmt"
	_ "github.com/go-sql-driver/mysql"
	"github.com/jinzhu/gorm"
	"log"
	"net/http"
	"os"
	"todo-app/golang-gorm-todo-app/Config"
	"todo-app/golang-gorm-todo-app/Models"
	"todo-app/golang-gorm-todo-app/Routes"
)

var err error

func main() {

	Config.DB, err = gorm.Open("mysql", Config.DbURL(Config.BuildDBConfig()))
	defer Config.DB.Close()
	if err != nil {
		fmt.Println("status: ", err)
		os.Exit(1)
	}

	Config.DB.AutoMigrate(&Models.Todo{})

	// running
	r := Routes.SetupRouter()
	log.Fatal(http.ListenAndServe(":8080", r))
}
