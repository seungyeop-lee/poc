package main

import (
	"bytes"
	"encoding/base64"
	"encoding/json"
	"os"

	"github.com/pierrec/lz4/v4"
	"gocv.io/x/gocv"
)

func main() {
	img := gocv.IMRead("../data/cat.jpg", gocv.IMReadColor)
	if img.Empty() {
		panic("cannot img image")
	}

	rows := img.Rows()
	cols := img.Cols()
	t := img.Type()
	data := img.ToBytes()

	compressedData, err := compress(data)
	if err != nil {
		panic(err)
	}
	// Convert compressed data to base64 string
	base64Data := base64.StdEncoding.EncodeToString(compressedData)

	// json 형식으로 변환
	jsonByte, err := json.MarshalIndent(map[string]interface{}{
		"rows": rows,
		"cols": cols,
		"type": t,
		"data": base64Data,
	}, "", "  ")
	if err != nil {
		panic(err)
	}

	// Save as JSON file
	err = os.WriteFile("../data/raw-data.json", jsonByte, 0644)
	if err != nil {
		panic(err)
	}
}

func compress(data []byte) ([]byte, error) {
	option := lz4.CompressionLevelOption(lz4.Level3)

	// Compress data using LZ4
	var buf bytes.Buffer
	writer := lz4.NewWriter(&buf)
	if err := writer.Apply(option); err != nil {
		return nil, err
	}

	if _, err := writer.Write(data); err != nil {
		return nil, err
	}
	if err := writer.Close(); err != nil {
		return nil, err
	}

	compressedData := buf.Bytes()
	return compressedData, nil
}
