package gorm

import (
	"github.com/jinzhu/gorm"
	_ "github.com/jinzhu/gorm/dialects/sqlite"
	"github.com/stretchr/testify/assert"
	"os"
	"testing"
)

type Product struct {
	gorm.Model
	Code  string
	Price uint
}
type Unknown struct {
	gorm.Model
	uCode  string
	uPrice uint
}

var db *gorm.DB

func TestMain(m *testing.M) {
	db = setUpDB()
	defer db.Close()
	os.Exit(m.Run())
}

func setUpDB() *gorm.DB {
	db, err := gorm.Open("sqlite3", "test.db")
	if err != nil {
		panic("failed to connect database")
	}
	return db
}

func setUp() {
	db.AutoMigrate(&Product{})
}

func tearDown() {
	db.DropTable(&Product{})
}

func TestCreate(t *testing.T) {
	setUp()
	defer tearDown()

	err := db.Create(&Product{Code: "L1212", Price: 1000}).Error
	if err != nil {
		assert.FailNow(t, err.Error())
	}

}

func TestCreateFail(t *testing.T) {
	setUp()
	defer tearDown()

	err := db.Create(&Unknown{uCode: "L1212", uPrice: 1000}).Error
	if assert.Error(t, err) {
		assert.EqualError(t, err, "no such table: unknowns")
	}
}

func TestRead(t *testing.T) {
	setUp()
	defer tearDown()

	db.Create(&Product{Code: "L1212", Price: 1000})
	db.Create(&Product{Code: "O3434", Price: 2000})
	db.Create(&Product{Code: "Z5656", Price: 3000})

	var product1 Product
	//SELECT * FROM product WHERE id = 23 LIMIT 1;
	db.First(&product1, 1)
	assert.Equal(t, "L1212", product1.Code, "Same Code")
	assert.Equal(t, uint(1000), product1.Price, "Same Price")

	var product2 Product
	//SELECT * FROM product WHERE code = 'O3434' LIMIT 1;
	db.First(&product2, "code = ?", "O3434")
	assert.Equal(t, "O3434", product2.Code, "Same Code")
	assert.Equal(t, uint(2000), product2.Price, "Same Price")

	var product3 Product
	//SELECT * FROM product ORDER BY id DESC LIMIT 1;
	db.Last(&product3)
	assert.Equal(t, "Z5656", product3.Code, "Same Code")
	assert.Equal(t, uint(3000), product3.Price, "Same Price")

}

func TestReadStructCannotOverride(t *testing.T) {
	setUp()
	defer tearDown()

	db.Create(&Product{Code: "L1212", Price: 1000})
	db.Create(&Product{Code: "O3434", Price: 2000})

	var product Product
	db.First(&product, 1)
	db.First(&product, 2)
	assert.Equal(t, "L1212", product.Code, "code of id1")
	assert.Equal(t, uint(1000), product.Price, "price of id1")
}

func TestReadFail(t *testing.T) {
	setUp()
	defer tearDown()

	var product Product
	err := db.First(&product, 1).Error
	if assert.Error(t, err) {
		assert.EqualError(t, err, "record not found")
	}
}

func TestReadAll(t *testing.T) {
	setUp()
	defer tearDown()

	db.Create(&Product{Code: "L1212", Price: 1000})
	db.Create(&Product{Code: "O3434", Price: 2000})
	db.Create(&Product{Code: "Z5656", Price: 3000})

	var product []Product
	//SELECT * FROM product
	db.Find(&product)
	assert.Equal(t, 3, len(product))

	var product2 []Product
	//SELECT * FROM product WHERE price > 1500;
	db.Find(&product2, "price > ?", 1500)
	assert.Equal(t, 2, len(product2))
}

func TestUpdate(t *testing.T) {
	setUp()
	defer tearDown()

	db.Create(&Product{Code: "L1212", Price: 1000})

	var before Product
	db.First(&before)
	assert.Equal(t, uint(1000), before.Price)

	db.Model(&before).Update("Price", 2000)

	var after Product
	db.First(&after)
	assert.Equal(t, uint(2000), after.Price)
}

func TestDelete(t *testing.T) {
	setUp()
	defer tearDown()

	db.Create(&Product{Code: "L1212", Price: 1000})
	db.Create(&Product{Code: "O3434", Price: 2000})

	var before []Product
	db.Find(&before)
	assert.Equal(t, 2, len(before))

	db.Delete(&before[0])

	var after []Product
	db.Find(&after)
	assert.Equal(t, 1, len(after))
}
