package common

type PayloadMessage struct {
	Name        string `json:"name"`
	CurrentTime int64  `json:"currentTime"`
	Enable      bool   `json:"enable"`
	Data        []byte `json:"data"`
}
