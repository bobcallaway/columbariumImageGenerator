package main

import (
	"bytes"
	"context"
	_ "embed"
	"encoding/base64"
	"encoding/json"
	"fmt"
	"html/template"
	"log"
	"os"
	"path/filepath"

	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"
	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/s3/s3manager"
	"github.com/go-rod/rod"
	"github.com/go-rod/rod/lib/launcher"
)

//go:embed cbGo.html
var cbTemplateInput string
var svgTemplate *template.Template
var uploader *s3manager.Uploader

type Niche struct {
	Name      string      `json:"name"`
	Available bool        `json:"available"`
	Header    bool        `json:"header"`
	Wall      json.Number `json:"wall"`
	Row       json.Number `json:"row"`
	Column    json.Number `json:"column"`
}

type WallEvent struct {
	WallNumber json.Number `json:"wallNumber"`
	Niches     []Niche     `json:"niches"`
}

func init() {
	var err error
	svgTemplate, err = template.New("svg").Parse(cbTemplateInput)
	if err != nil {
		panic(err)
	}

	sess := session.Must(session.NewSession())
	uploader = s3manager.NewUploader(sess)
}

func HandleRequest(ctx context.Context, request events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {

	var wallEvent WallEvent
	_ = json.Unmarshal([]byte(request.Body), &wallEvent)

	var eventJSON map[string]interface{}
	log.Println(string(request.Body))
	_ = json.Unmarshal([]byte(request.Body), &eventJSON)

	result := bytes.Buffer{}
	if err := svgTemplate.Execute(&result, eventJSON); err != nil {
		return events.APIGatewayProxyResponse{StatusCode: 500}, fmt.Errorf("error processing template: %w", err)
	}

	// write to temp file
	tempFile, err := os.CreateTemp(os.TempDir(), "svg*.html")
	if err != nil {
		return events.APIGatewayProxyResponse{StatusCode: 500}, fmt.Errorf("couldn't create tempFile: %w", err)
	}

	if err := os.WriteFile(tempFile.Name(), result.Bytes(), 0666); err != nil {
		return events.APIGatewayProxyResponse{StatusCode: 500}, fmt.Errorf("couldn't write tempFile: %w", err)
	}
	log.Println(result.String())

	// convert SVG to image
	l := launcher.New().Bin("/var/task/.cache/rod/browser/chromium-1278087/chrome").NoSandbox(true).UserDataDir("/tmp").Logger(os.Stderr).Set("disable-dev-shm-usage").
		Set("allow-running-insecure-content").
		Set("autoplay-policy", "user-gesture-required").
		Set("disable-component-update").
		Set("disable-domain-reliability").
		Set("disable-features", "AudioServiceOutOfProcess", "IsolateOrigins", "site-per-process").
		Set("disable-print-preview").
		Set("disable-setuid-sandbox").
		Set("disable-site-isolation-trials").
		Set("disable-speech-api").
		Set("disable-web-security").
		Set("hide-scrollbars").
		Set("ignore-gpu-blocklist").
		Set("mute-audio").
		Set("no-default-browser-check").
		Set("no-pings").
		Set("no-zygote").
		Set("single-process")
	defer l.Cleanup()
	defer l.Kill()
	browser := rod.New().ControlURL(l.MustLaunch()).MustConnect()
	defer browser.MustClose()

	// capture screenshot of an element
	page := browser.MustPage("file://" + tempFile.Name()).MustWaitStable()
	png := page.MustElement("#wall").MustScreenshot(filepath.Join(os.TempDir(), "wall.png"))

	// upload to S3 bucket
	_, err = uploader.Upload(&s3manager.UploadInput{
		Bucket: aws.String("columbariumimage"),
		Key:    aws.String("wallImages/wall" + wallEvent.WallNumber.String() + ".png"),
		Body:   bytes.NewReader(png),
	})
	if err != nil {
		return events.APIGatewayProxyResponse{StatusCode: 500}, fmt.Errorf("failed to upload file, %v", err)
	}

	type output struct {
		Image string `json:"image"`
	}
	jsonResult := output{base64.StdEncoding.EncodeToString(png)}
	jsonResultBytes, _ := json.Marshal(&jsonResult)
	return events.APIGatewayProxyResponse{
		StatusCode: 200,
		Body:       string(jsonResultBytes),
	}, nil
}

func main() {
	lambda.Start(HandleRequest)
}
