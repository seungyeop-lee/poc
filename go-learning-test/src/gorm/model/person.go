package model

type Person struct {
	ID   uint   `gorm:"column:id;primary_key" json:"id"`
	Name string `gorm:"column:name" json:"name"`
}

func (p *Person) TableName() string {
	return "person"
}