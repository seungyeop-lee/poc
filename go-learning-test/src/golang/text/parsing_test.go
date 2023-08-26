package text

import (
	"fmt"
	"gopkg.in/yaml.v2"
	"os"
	"testing"
)

func TestFromYamlFile(t *testing.T) {
	codesFile, err := os.Open("code.yaml")
	if err != nil {
		panic(err)
	}

	var codes map[string]map[string]string
	err = yaml.NewDecoder(codesFile).Decode(&codes)
	if err != nil {
		panic(err)
	}

	fmt.Println(codes)
	fmt.Println(codes["success"]["retrieved"])
}