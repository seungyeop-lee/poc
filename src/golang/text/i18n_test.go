package text

import (
	"golang.org/x/text/language"
	"golang.org/x/text/message"
	"testing"
)

func Test_i18n_basic(t *testing.T) {
	message.SetString(language.Korean, "%s went to %s\n", "%s는 %s에 갔었다.")
	p := message.NewPrinter(language.Korean)
	p.Printf("There are %v flowers in out garden.\n", 1500)
	p.Printf("%s went to %s\n", "kim", "seoul")
}