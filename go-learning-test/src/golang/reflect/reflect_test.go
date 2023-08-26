package reflect

import (
	"fmt"
	"reflect"
	"testing"
)

type A struct {
	F1 int    `json:"f_1"`
	F2 string `json:"f_2"`
}

type B struct {
	A
	F3 uint `json:"f_3"`
}

var structA = A{
	F1: 1,
	F2: "2",
}

var structB = B{
	F3: 3,
}

func TestA(t *testing.T) {
	metaData(&structB)
}

func metaData(anything interface{}) {

	target := reflect.ValueOf(anything)
	elements := target.Elem()

	fmt.Printf("Type: %s\n", target.Type()) // 구조체 타입명

	for i := 0; i < elements.NumField(); i++ {
		//mValue := elements.Field(i)
		mType := elements.Type().Field(i)
		tag := mType.Tag

		fmt.Printf("%10s %10s ==> unknown, json: %10s\n",
			mType.Name,         // 이름
			mType.Type,         // 타입
			//mValue.Interface().(A), // 값
			tag.Get("json")) // json 태그
	}
}
