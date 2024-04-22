FROM golang:1.21.3 as build
WORKDIR /helloworld
# Copy dependencies list
COPY go.mod go.sum ./
RUN go mod download
# Build with optional lambda.norpc tag
COPY cbGo.html main.go .
RUN go build -tags lambda.norpc -o main main.go
# Copy artifacts to a clean image
FROM public.ecr.aws/lambda/provided:al2023
RUN dnf upgrade -y && dnf install -y unzip fontconfig gtk3-devel nss-devel nspr-devel atk-devel cups libdrm libxkbcommon libXcomposite libXdamage libXfixes libXrandr mesa-libgbm cairo-devel pango-devel glib2-devel alsa-lib
RUN mkdir -p /var/task/.cache/rod/browser/chromium-1278087 && curl -SLo /tmp/chrome-linux.zip https://storage.googleapis.com/chromium-browser-snapshots/Linux_x64/1278087/chrome-linux.zip && unzip /tmp/chrome-linux.zip -d /var/task/.cache/rod/browser/chromium-1278087/ && mv /var/task/.cache/rod/browser/chromium-1278087/chrome-linux/* /var/task/.cache/rod/browser/chromium-1278087/
COPY --from=build /helloworld/main /var/task/main
ENTRYPOINT [ "/var/task/main" ]
