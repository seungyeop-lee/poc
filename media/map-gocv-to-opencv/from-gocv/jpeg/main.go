package main

import (
	"bytes"
	"encoding/base64"
	"gocv.io/x/gocv"
	"image/jpeg"
	"log"
	"os"
)

func main() {
	img := gocv.IMRead("../data/cat.jpg", gocv.IMReadColor)
	if img.Empty() {
		panic("cannot img image")
	}

	// Convert the image to JPG in memory
	image, err := img.ToImage()
	if err != nil {
		panic(err)
	}
	buf := new(bytes.Buffer)
	if err := jpeg.Encode(buf, image, nil); err != nil {
		log.Fatalf("Error encoding image to JPG: %v", err)
	}

	// Convert the JPG image bytes to base64
	base64Encoded := base64.StdEncoding.EncodeToString(buf.Bytes())

	err = os.WriteFile("../data/jpeg-data.txt", []byte(base64Encoded), 0644)
	if err != nil {
		panic(err)
	}
}
