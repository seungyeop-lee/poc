package _interface

import (
	"testing"
)

type interfaceA interface {
	get() string
}
type structA struct{}

func (s structA) get() string {
	return "saved string"
}

type structB struct{}

func (s *structB) get() string {
	return "saved string"
}

func TestWhatReturnAfterDefineInterface(t *testing.T) {
	s1 := structA{}
	s2 := structA{}
	var s1c = s1
	var i1 interfaceA = s1
	var i1c = i1

	println(&s1)
	println(&s1c)
	println(i1)
	println(i1c)

	i1 = s2
	println(i1)

	//var a2 interfaceA = &structA{}
	//var b1 interfaceA = structB{}	//error
	//var b2 interfaceA = &structB{}
}
