package main

import (
	"bytes"
	"encoding/json"
	"net/http"

	"github.com/labstack/echo/v4"
)

const AiServiceUrl = "http://aiservice:8081"
const VocabularyServiceUrl = "http://vocabularyservice:8082"

func main() {
	e := echo.New()
	e.GET("/health", func(c echo.Context) error {
		return c.JSON(200, map[string]string{
			"name":   "api",
			"status": "UP",
		})
	})
	e.POST("/term/auto", func(c echo.Context) error {
		term, err := getTerm(c)
		if err != nil {
			return err
		}

		meaning, err := getMeaning(term)
		if err != nil {
			return err
		}

		id, err := saveTerm(term, meaning)
		if err != nil {
			return err
		}

		return c.JSON(
			200,
			TermAutoResponse{Id: id, Term: term, Meaning: meaning},
		)
	})
	e.Logger.Fatal(e.Start(":8080"))
}

func getTerm(c echo.Context) (string, error) {
	var req TermAutoRequest
	if err := c.Bind(&req); err != nil {
		return "", err
	}
	return req.Term, nil
}

func getMeaning(term string) (string, error) {
	reqStruct := AiServiceTermCreateRequest{Term: term}
	reqJson, err := json.Marshal(reqStruct)
	if err != nil {
		return "", err
	}

	aiRes, err := http.Post(AiServiceUrl+"/term/create", "application/json", bytes.NewBuffer(reqJson))
	if err != nil {
		return "", err
	}
	defer aiRes.Body.Close()

	var resStruct AiServiceTermCreateResponse
	if err := json.NewDecoder(aiRes.Body).Decode(&resStruct); err != nil {
		return "", err
	}
	return resStruct.Meaning, nil
}

func saveTerm(term string, meaning string) (int, error) {
	reqStruct := VocabularyServiceTermCreateRequest{Term: term, Meaning: meaning}
	reqJson, err := json.Marshal(reqStruct)
	if err != nil {
		return 0, err
	}

	vocabularyRes, err := http.Post(VocabularyServiceUrl+"/term", "application/json", bytes.NewBuffer(reqJson))
	if err != nil {
		return 0, err
	}
	defer vocabularyRes.Body.Close()

	var resStruct VocabularyServiceTermCreateResponse
	if err := json.NewDecoder(vocabularyRes.Body).Decode(&resStruct); err != nil {
		return 0, err
	}
	return resStruct.Id, nil
}

type TermAutoRequest struct {
	Term string `json:"term"`
}

type TermAutoResponse struct {
	Id      int    `json:"id"`
	Term    string `json:"term"`
	Meaning string `json:"meaning"`
}

type AiServiceTermCreateRequest struct {
	Term string `json:"term"`
}

type AiServiceTermCreateResponse struct {
	Term    string `json:"term"`
	Meaning string `json:"meaning"`
}

type VocabularyServiceTermCreateRequest struct {
	Term    string `json:"term"`
	Meaning string `json:"meaning"`
}

type VocabularyServiceTermCreateResponse struct {
	Id int `json:"id"`
}
