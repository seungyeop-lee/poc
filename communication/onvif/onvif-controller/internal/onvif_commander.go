package internal

import (
	"context"
	"errors"
	"fmt"
	"io"
	"net/http"
	"net/url"
	"time"

	"github.com/use-go/onvif"
	"github.com/use-go/onvif/media"
	"github.com/use-go/onvif/ptz"
	smedia "github.com/use-go/onvif/sdk/media"
	sptz "github.com/use-go/onvif/sdk/ptz"
	xonvif "github.com/use-go/onvif/xsd/onvif"
)

type OnvifCommander struct {
	d        *onvif.Device
	addr     string
	username string
	password string

	ctx context.Context
}

func NewOnvifCommander(config *Config) *OnvifCommander {
	return &OnvifCommander{
		addr:     config.Addr,
		username: config.Username,
		password: config.Password,
		ctx:      context.Background(),
	}
}

func (c *OnvifCommander) Init() error {
	d, err := onvif.NewDevice(
		onvif.DeviceParams{
			Xaddr:    c.addr,
			Username: c.username,
			Password: c.password,
		},
	)
	if err != nil {
		return err
	}

	c.d = d

	return nil
}

func (c *OnvifCommander) GetProfiles() ([]xonvif.Profile, error) {
	profiles, err := smedia.Call_GetProfiles(c.ctx, c.d, media.GetProfiles{})
	if err != nil {
		return nil, err
	}
	return profiles.Profiles, nil
}

func (c *OnvifCommander) GetStreams() (map[string]string, error) {
	profiles, err := c.GetProfiles()
	if err != nil {
		return nil, err
	}

	result := map[string]string{}
	for _, p := range profiles {
		uri, err := c.GetStream(p.Token)
		if err != nil {
			return nil, err
		}
		result[string(p.Token)] = uri
	}
	return result, nil
}

func (c *OnvifCommander) GetStream(profileToken xonvif.ReferenceToken) (string, error) {
	reqStream := media.GetStreamUri{
		StreamSetup: xonvif.StreamSetup{
			Stream: "RTP_unicast",
			Transport: xonvif.Transport{
				Protocol: "TCP",
			},
		},
		ProfileToken: profileToken,
	}

	rStream, err := smedia.Call_GetStreamUri(c.ctx, c.d, reqStream)
	if err != nil {
		return "", err
	}

	uri := string(rStream.MediaUri.Uri)

	return uri, nil
}

func (c *OnvifCommander) GetSnapshot(profileToken string) ([]byte, error) {
	req := media.GetSnapshotUri{ProfileToken: xonvif.ReferenceToken(profileToken)}
	r, err := smedia.Call_GetSnapshotUri(c.ctx, c.d, req)
	if err != nil {
		return nil, err
	}

	var uri = string(r.MediaUri.Uri)
	if uri == "" {
		return nil, errors.New("no snapshot URI")
	}

	urlURI, err := url.Parse(uri)
	if err != nil {
		return nil, err
	}

	httpReq := &http.Request{
		Method: http.MethodGet,
		URL:    urlURI,
		Header: http.Header{},
	}
	httpReq.SetBasicAuth(c.username, c.password)

	client := http.Client{}
	respHTTP, err := client.Do(httpReq)
	if err != nil {
		return nil, err
	}
	defer respHTTP.Body.Close()

	frame, err := io.ReadAll(respHTTP.Body)
	if err != nil {
		return nil, err
	}

	return frame, nil
}

func (c *OnvifCommander) DoControl(profile string, direction string, speed float64) error {
	normalizedSpeed := speed / 100 // Convert speed to 0-1 range

	var x, y, zoom float64
	switch direction {
	case "moveup":
		y = normalizedSpeed
	case "movedown":
		y = -normalizedSpeed
	case "moveleft":
		x = -normalizedSpeed
	case "moveright":
		x = normalizedSpeed
	case "zoomin":
		zoom = normalizedSpeed
	case "zoomout":
		zoom = -normalizedSpeed
	default:
		return fmt.Errorf("unsupported direction: %s", direction)
	}

	req := ptz.ContinuousMove{
		ProfileToken: xonvif.ReferenceToken(profile),
		Velocity: xonvif.PTZSpeed{
			PanTilt: xonvif.Vector2D{
				X: x,
				Y: y,
			},
			Zoom: xonvif.Vector1D{
				X: zoom,
			},
		},
	}

	_, err := sptz.Call_ContinuousMove(c.ctx, c.d, req)
	if err != nil {
		return fmt.Errorf("failed to execute continuous move: %v", err)
	}

	// Stop movement after a short delay
	time.Sleep(500 * time.Millisecond)
	stopReq := ptz.Stop{
		ProfileToken: xonvif.ReferenceToken(profile),
		PanTilt:      true,
		Zoom:         true,
	}

	_, err = sptz.Call_Stop(c.ctx, c.d, stopReq)
	if err != nil {
		return fmt.Errorf("failed to stop movement: %v", err)
	}

	return nil
}
