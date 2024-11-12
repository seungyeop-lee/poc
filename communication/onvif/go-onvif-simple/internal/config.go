package internal

import "github.com/goccy/go-yaml"

type Config struct {
	Addr     string `yaml:"addr"`
	Username string `yaml:"username"`
	Password string `yaml:"password"`
}

func NewConfig(configFile []byte) (*Config, error) {
	c := Config{}
	if err := yaml.Unmarshal(configFile, &c); err != nil {
		return nil, err
	}
	return &c, nil
}
