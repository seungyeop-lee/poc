package s3

import (
	"fmt"
	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/awserr"
	"github.com/aws/aws-sdk-go/aws/credentials"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/s3"
	"github.com/aws/aws-sdk-go/service/s3/s3manager"
	"os"
	"testing"
)

const (
	AccessKeyId     = ""
	SecretAccessKey = ""
	InputFileName   = "input.txt"
	OutputFileName  = "output.txt"
	BucketName      = "lsy-test-seoul"
)

func TestUpdateFile(t *testing.T) {
	sess := createSession()

	file, err := os.Open(InputFileName)
	defer file.Close()
	if err != nil {
		panic(err)
	}

	uploader := s3manager.NewUploader(sess)
	uploadOutput, err := uploader.Upload(&s3manager.UploadInput{
		Bucket: aws.String(BucketName),
		Key:    aws.String(InputFileName),
		Body:   file,
	})
	if err != nil {
		panic(err)
	}
	fmt.Println(uploadOutput)
}

func TestDownloadFile(t *testing.T) {
	sess := createSession()

	file, err := os.Create(OutputFileName)
	defer file.Close()
	if err != nil {
		panic(err)
	}

	downloader := s3manager.NewDownloader(sess)
	n, err := downloader.Download(file, &s3.GetObjectInput{
		Bucket: aws.String(BucketName),
		Key:    aws.String(InputFileName),
	})
	if err != nil {
		panic(err)
	}
	fmt.Println(n)
}

func TestGetItemList(t *testing.T) {
	sess := createSession()
	svc := s3.New(sess)
	input := &s3.ListObjectsV2Input{
		Bucket: aws.String(BucketName),
	}

	result, err := svc.ListObjectsV2(input)
	if err != nil {
		if aerr, ok := err.(awserr.Error); ok {
			switch aerr.Code() {
			case s3.ErrCodeNoSuchBucket:
				fmt.Println(s3.ErrCodeNoSuchBucket, aerr.Error())
			default:
				fmt.Println(aerr.Error())
			}
		} else {
			fmt.Println(err.Error())
		}
	}

	for _, v := range result.Contents {
		fmt.Println(v.String())
	}
}

func createSession() *session.Session {
	sess, err := session.NewSession(&aws.Config{
		Region:      aws.String("ap-northeast-2"),
		Credentials: credentials.NewStaticCredentials(AccessKeyId, SecretAccessKey, ""),
	})

	if err != nil {
		panic(err)
	}
	return sess
}
