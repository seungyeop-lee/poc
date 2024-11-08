package main

import (
	"bytes"
	"encoding/base64"
	"gocv.io/x/gocv"
	"image/png"
	"log"
	"os"
)

func main() {
	img := gocv.IMRead("../data/cat.jpg", gocv.IMReadColor)
	if img.Empty() {
		panic("cannot img image")
	}

	// Convert the image to PNG in memory
	image, err := img.ToImage()
	if err != nil {
		panic(err)
	}
	buf := new(bytes.Buffer)
	if err := png.Encode(buf, image); err != nil {
		log.Fatalf("Error encoding image to JPG: %v", err)
	}

	// Convert the PNG image bytes to base64
	base64Encoded := base64.StdEncoding.EncodeToString(buf.Bytes())

	err = os.WriteFile("../data/png-data.txt", []byte(base64Encoded), 0644)
	if err != nil {
		panic(err)
	}
}
