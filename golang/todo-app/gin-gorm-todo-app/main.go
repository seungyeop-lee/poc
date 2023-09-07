package main

import (
	"fmt"
	_ "github.com/go-sql-driver/mysql"
	"github.com/jinzhu/gorm"
	"log"
	"os"
	"todo-app/gin-gorm-todo-app/Config"
	"todo-app/gin-gorm-todo-app/Models"
	"todo-app/gin-gorm-todo-app/Routes"
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
	log.Fatal(Routes.SetupRouter().Run(":8080"))
}
