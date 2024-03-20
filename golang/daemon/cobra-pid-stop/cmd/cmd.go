package cmd

import (
	"fmt"
	"github.com/seungyeop-lee/poc/golang/deamon/cobra-pid-stop/internal"
	"github.com/spf13/cobra"
	"os"
)

var rootCmd = &cobra.Command{
	Use: "pid-stop-deamon",
}

var startCmd = &cobra.Command{
	Use: "start",
	Run: func(cmd *cobra.Command, args []string) {
		internal.Start()
	},
}

var stopCmd = &cobra.Command{
	Use: "stop",
	Run: func(cmd *cobra.Command, args []string) {
		internal.Stop()
	},
}

func init() {
	rootCmd.PersistentFlags()
	rootCmd.AddCommand(startCmd)
	rootCmd.AddCommand(stopCmd)
}

func Execute() {
	if err := rootCmd.Execute(); err != nil {
		fmt.Println(err)
		os.Exit(1)
	}
}
