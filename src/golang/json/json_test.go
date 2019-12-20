package json

import (
	"encoding/json"
	"github.com/stretchr/testify/assert"
	"testing"
)

type TestStruct struct {
	PublicVal string `json:"public_val"`
	privateVal string `json:"private_val"`
}

func TestMarshalHavingPrivateValue(t *testing.T) {
	s := TestStruct{
		PublicVal:  "public",
		privateVal: "private",
	}

	sJson, err := json.Marshal(s)
	if err != nil {
		t.Fatal(err)
	}

	assert.EqualValues(t, `{"public_val":"public"}`, string(sJson), "Marshal only public value")
}

func TestUnmarshalHavingPrivateValue(t *testing.T) {
	var s TestStruct
	sJson := `
	{
		"public_val": "public",
		"private_val": "private"
	}
	`

	err := json.Unmarshal([]byte(sJson), &s)
	if err != nil {
		t.Fatal(err)
	}
	assert.EqualValues(t, "public", s.PublicVal, "Unmarshal only public value")
	assert.EqualValues(t, "", s.privateVal, "Unmarshal not private value")
}