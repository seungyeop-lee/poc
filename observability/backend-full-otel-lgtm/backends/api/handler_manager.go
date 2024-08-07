package main

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/labstack/echo/v4"
	"go.opentelemetry.io/contrib/bridges/otelslog"
	"go.opentelemetry.io/contrib/instrumentation/net/http/otelhttp"
	"go.opentelemetry.io/otel"
)

const AiServiceUrl = "http://aiservice:8081"
const VocabularyServiceUrl = "http://vocabularyservice:8082"

const name = ""

var (
	meter  = otel.Meter(name)
	logger = otelslog.NewLogger(name)
)

type HandlerManager struct {
	e *echo.Echo
}

func (h HandlerManager) Register(e *echo.Echo) {
	e.GET("/health", func(c echo.Context) error {
		return c.JSON(200, map[string]string{
			"name":   "api",
			"status": "UP",
		})
	})
	e.POST("/term/auto", func(c echo.Context) error {
		ctx := c.Request().Context()

		term, err := getTerm(c)
		if err != nil {
			return err
		}
		logger.InfoContext(
			ctx,
			fmt.Sprintf("Request Term: %s", term),
		)

		meaning, err := getMeaning(ctx, term)
		if err != nil {
			return err
		}

		id, err := saveTerm(ctx, term, meaning)
		if err != nil {
			return err
		}

		response := TermAutoResponse{Id: id, Term: term, Meaning: meaning}
		logger.InfoContext(
			ctx,
			fmt.Sprintf("Response: %+v", response),
		)

		return c.JSON(
			200,
			response,
		)
	})
}

func getTerm(c echo.Context) (string, error) {
	var req TermAutoRequest
	if err := c.Bind(&req); err != nil {
		return "", err
	}
	return req.Term, nil
}

func getMeaning(ctx context.Context, term string) (string, error) {
	reqStruct := AiServiceTermCreateRequest{Term: term}
	reqJson, err := json.Marshal(reqStruct)
	if err != nil {
		return "", err
	}

	req, err := http.NewRequestWithContext(ctx, "POST", AiServiceUrl+"/term/create", bytes.NewBuffer(reqJson))
	if err != nil {
		return "", err
	}
	req.Header.Set("Content-Type", "application/json")

	res, err := callHttp(req)
	if err != nil {
		return "", err
	}
	defer res.Body.Close()

	var resStruct AiServiceTermCreateResponse
	if err := json.NewDecoder(res.Body).Decode(&resStruct); err != nil {
		return "", err
	}
	return resStruct.Meaning, nil
}

func saveTerm(ctx context.Context, term string, meaning string) (int, error) {
	reqStruct := VocabularyServiceTermCreateRequest{Term: term, Meaning: meaning}
	reqJson, err := json.Marshal(reqStruct)
	if err != nil {
		return 0, err
	}

	req, err := http.NewRequestWithContext(ctx, "POST", VocabularyServiceUrl+"/term", bytes.NewBuffer(reqJson))
	if err != nil {
		return 0, err
	}
	req.Header.Set("Content-Type", "application/json")

	res, err := callHttp(req)
	if err != nil {
		return 0, err
	}
	defer res.Body.Close()

	var resStruct VocabularyServiceTermCreateResponse
	if err := json.NewDecoder(res.Body).Decode(&resStruct); err != nil {
		return 0, err
	}
	return resStruct.Id, nil
}

func callHttp(req *http.Request) (*http.Response, error) {
	c := http.Client{
		Transport: otelhttp.NewTransport(http.DefaultTransport),
	}
	return c.Do(req)
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
