package main

import (
	"encoding/json"
	"fmt"
	"os"
	"path/filepath"
	"strconv"

	"github.com/spf13/cobra"

	"onvif-controller/internal"
)

func main() {
	Execute()
}

var (
	executeFileName string
)

func Execute() {
	executeFileName = filepath.Base(os.Args[0])
	rootCmd.Use = executeFileName

	rootCmd.PersistentFlags().StringP("config-path", "c", "config.yml", "set config path")

	snapshotCmd.Flags().StringP("profile", "p", "Profile_1", "set profile")
	snapshotCmd.Flags().StringP("output", "o", "snapshot.jpg", "set output file")

	controlCmd.Flags().StringP("profile", "p", "Profile_1", "set profile")

	rootCmd.AddCommand(profilesCmd, profileNamesCmd, streamsCmd, snapshotCmd, controlCmd)

	if err := rootCmd.Execute(); err != nil {
		os.Exit(1)
	}
}

var rootCmd = &cobra.Command{
	RunE: func(cmd *cobra.Command, args []string) error {
		return cmd.Help()
	},
}

var profilesCmd = &cobra.Command{
	Use:   "profiles",
	Short: "Get profiles",
	RunE: func(cmd *cobra.Command, args []string) error {
		commander, err := buildCommander(cmd)
		if err != nil {
			return err
		}

		if err := commander.Init(); err != nil {
			return err
		}

		profiles, err := commander.GetProfiles()
		if err != nil {
			return err
		}

		profilesJSON, err := json.MarshalIndent(profiles, "", "  ")
		if err != nil {
			return err
		}

		fmt.Println(string(profilesJSON))

		return nil
	},
}

var profileNamesCmd = &cobra.Command{
	Use:   "profileTokens",
	Short: "Get profile tokens",
	RunE: func(cmd *cobra.Command, args []string) error {
		commander, err := buildCommander(cmd)
		if err != nil {
			return err
		}

		if err := commander.Init(); err != nil {
			return err
		}

		profiles, err := commander.GetProfiles()
		if err != nil {
			return err
		}

		var result []string
		for _, p := range profiles {
			result = append(result, string(p.Token))
		}

		profilesJSON, err := json.MarshalIndent(result, "", "  ")
		if err != nil {
			return err
		}

		fmt.Println(string(profilesJSON))

		return nil
	},
}

var streamsCmd = &cobra.Command{
	Use:   "streams",
	Short: "Get streams",
	RunE: func(cmd *cobra.Command, args []string) error {
		commander, err := buildCommander(cmd)
		if err != nil {
			return err
		}

		if err := commander.Init(); err != nil {
			return err
		}

		streams, err := commander.GetStreams()
		if err != nil {
			return err
		}

		jsonByte, err := json.MarshalIndent(streams, "", "  ")
		if err != nil {
			return err
		}

		fmt.Println(string(jsonByte))

		return nil
	},
}

var snapshotCmd = &cobra.Command{
	Use:   "snapshot",
	Short: "Get snapshot",
	RunE: func(cmd *cobra.Command, args []string) error {
		profile, err := cmd.Flags().GetString("profile")
		if err != nil {
			return err
		}

		output, err := cmd.Flags().GetString("output")
		if err != nil {
			return err
		}

		commander, err := buildCommander(cmd)
		if err != nil {
			return err
		}

		if err := commander.Init(); err != nil {
			return err
		}

		snapshot, err := commander.GetSnapshot(profile)
		if err != nil {
			return err
		}

		err = os.WriteFile(output, snapshot, 0644)
		if err != nil {
			return err
		}

		return nil
	},
}

var controlCmd = &cobra.Command{
	Use:   "control [direction] [speed]",
	Short: "Control camera movement (direction: moveup, movedown, moveleft, moveright, zoomin, zoomout)",
	Args:  cobra.ExactArgs(2),
	RunE: func(cmd *cobra.Command, args []string) error {
		profile, err := cmd.Flags().GetString("profile")
		if err != nil {
			return err
		}

		direction := args[0]
		speed := args[1]

		// Validate direction
		validDirections := map[string]bool{
			"moveup":    true,
			"movedown":  true,
			"moveleft":  true,
			"moveright": true,
			"zoomin":    true,
			"zoomout":   true,
		}
		if !validDirections[direction] {
			return fmt.Errorf("invalid direction. Use: moveup, movedown, moveleft, moveright, zoomin, zoomout")
		}

		// Parse and validate speed
		speedFloat, err := strconv.ParseFloat(speed, 64)
		if err != nil {
			return fmt.Errorf("invalid speed value: %v", err)
		}
		if speedFloat < 1 || speedFloat > 100 {
			return fmt.Errorf("speed must be between 1 and 100")
		}

		commander, err := buildCommander(cmd)
		if err != nil {
			return err
		}

		if err := commander.Init(); err != nil {
			return err
		}

		if err := commander.DoControl(profile, direction, speedFloat); err != nil {
			return err
		}

		return nil
	},
}

func buildCommander(cmd *cobra.Command) (*internal.OnvifCommander, error) {
	configFile, err := getConfigFile(cmd)
	if err != nil {
		return nil, err
	}

	config, err := internal.NewConfig(configFile)
	if err != nil {
		return nil, err
	}

	return internal.NewOnvifCommander(config), nil
}

func getConfigFile(cmd *cobra.Command) ([]byte, error) {
	configPath, err := cmd.Flags().GetString("config-path")
	if err != nil {
		return nil, err
	}

	configFile, err := os.ReadFile(configPath)
	if err != nil {
		return nil, err
	}

	return configFile, nil
}
