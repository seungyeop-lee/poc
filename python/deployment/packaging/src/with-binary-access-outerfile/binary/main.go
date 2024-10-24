package main

import (
	"database/sql"
	"fmt"
	"log"

	_ "github.com/glebarez/go-sqlite"
)

func main() {
	// connect
	db, err := sql.Open("sqlite", "./test.db")
	if err != nil {
		log.Fatal(err)
	}

	var version string

	// get SQLite version
	r := db.QueryRow("select sqlite_version()")
	_ = r.Scan(&version)
	fmt.Println("SQLite version:", version)
}
