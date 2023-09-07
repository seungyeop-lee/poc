package imaging

import (
	"github.com/disintegration/imaging"
	"testing"
)

const (
	ImageFileName = "branches.png"
)

func TestImagingLibUse(t *testing.T) {
	src, err := imaging.Open(ImageFileName)
	if err != nil {
		panic(err)
	}
	dstImage := imaging.Thumbnail(src, 400, 400, imaging.Lanczos)
	imaging.Save(dstImage, "thumbnail.png")
}
