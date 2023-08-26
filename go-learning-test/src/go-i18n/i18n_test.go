package go_i18n

import (
	"encoding/json"
	"fmt"
	"github.com/nicksnyder/go-i18n/v2/i18n"
	"golang.org/x/text/language"
	"gopkg.in/yaml.v2"
	"testing"
)

func TestBasic(t *testing.T) {
	bundle := i18n.NewBundle(language.English)
	loc := i18n.NewLocalizer(bundle, language.English.String())
	messages := &i18n.Message{
		ID:    "Emails",
		Hash:  "The number of unread emails a user has",
		One:   "{{.Name}} has {{.Count}} email.",
		Other: "{{.Name}} has {{.Count}} emails.",
	}

	messagesCount := 2
	translation := loc.MustLocalize(&i18n.LocalizeConfig{
		DefaultMessage: messages,
		TemplateData: map[string]interface{}{
			"Name":  "Theo",
			"Count": messagesCount,
		},
		PluralCount: messagesCount,
	})
	fmt.Println(translation)	//Theo has 2 emails.
}

func TestBasic2(t *testing.T) {
	bundle := i18n.NewBundle(language.English)
	loc := i18n.NewLocalizer(bundle, language.English.String())
	messages := &i18n.Message{
		ID: "Notifications",
		Description: "The number of unread notifications a user has",
		One: "<<.Name>> has <<.Count>> notification.",
		Other: "<<.Name>> has <<.Count>> notifications.",
		LeftDelim: "<<",
		RightDelim: ">>",
	}

	notificationsCount := 1
	translation := loc.MustLocalize(&i18n.LocalizeConfig{
		DefaultMessage: messages,
		TemplateData: map[string]interface{}{
			"Name": "Theo",
			"Count": notificationsCount,
		},
		PluralCount: notificationsCount,
	})

	fmt.Println(translation)	//Theo has 1 notification.
}

func TestFromJsonFile(t *testing.T) {
	bundle := i18n.NewBundle(language.English)
	loc := i18n.NewLocalizer(bundle, language.English.String())

	// Unmarshaling from files
	bundle.RegisterUnmarshalFunc("json", json.Unmarshal)
	bundle.MustLoadMessageFile("en.json")
	bundle.MustLoadMessageFile("el.json")

	loc = i18n.NewLocalizer(bundle, "el")
	messagesCount := 10
	translation := loc.MustLocalize(&i18n.LocalizeConfig{
		MessageID: "messages",
		TemplateData: map[string]interface{}{
			"Name": "Alex",
			"Count": messagesCount,
		},
		PluralCount: messagesCount,
	})

	fmt.Println(translation)
}

func TestFromYamlFile(t *testing.T) {
	bundle := i18n.NewBundle(language.Japanese)

	bundle.RegisterUnmarshalFunc("yaml", yaml.Unmarshal)
	//bundle.MustLoadMessageFile("en.yaml")
	bundle.MustLoadMessageFile("ko.yaml")
	bundle.MustLoadMessageFile("ja.yaml")


	loc := i18n.NewLocalizer(bundle)
	translation, err := loc.Localize(&i18n.LocalizeConfig{MessageID:"success.retrieved"})
	if err != nil {
		fmt.Println(err)
	}
	fmt.Println(translation)

	loc = i18n.NewLocalizer(bundle, language.Korean.String())
	translation, err = loc.Localize(&i18n.LocalizeConfig{MessageID:"success.retrieved"})
	if err != nil {
		fmt.Println(err)
	}
	fmt.Println(translation)
}