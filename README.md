docker build --platform linux/amd64 -t docker-image:test .
docker run --platform linux/amd64 -d -v ~/.aws-lambda-rie:/aws-lambda -p 9000:8080     --entrypoint /aws-lambda/aws-lambda-rie     docker-image:test         /usr/local/bin/npx aws-lambda-ric server.handler

curl "http://localhost:9000/2015-03-31/functions/function/invocations" -d '{"wallNumber":1,"niches":[{"name":"A1","available":false,"header":false,"wall":1,"row":1,"column":1},{"name":"A2","available":false,"header":false,"wall":1,"row":2,"column":1},{"name":"A3","available":true,"header":false,"wall":1,"row":3,"column":1},{"name":"A4","available":true,"header":false,"wall":1,"row":4,"column":1},{"name":"A5","available":false,"header":false,"wall":1,"row":5,"column":1},{"name":"A6","available":true,"header":false,"wall":1,"row":6,"column":1},{"name":"B1","available":true,"header":false,"wall":1,"row":1,"column":2},{"name":"B2","available":true,"header":false,"wall":1,"row":2,"column":2},{"name":"B3","available":false,"header":false,"wall":1,"row":3,"column":2},{"name":"B4","available":true,"header":false,"wall":1,"row":4,"column":2},{"name":"B5","available":true,"header":false,"wall":1,"row":5,"column":2},{"name":"B6","available":true,"header":false,"wall":1,"row":6,"column":2},{"name":"C1","available":true,"header":false,"wall":1,"row":1,"column":3},{"name":"C2","available":true,"header":false,"wall":1,"row":2,"column":3},{"name":"C3","available":true,"header":false,"wall":1,"row":3,"column":3},{"name":"C4","available":true,"header":false,"wall":1,"row":4,"column":3},{"name":"C5","available":true,"header":false,"wall":1,"row":5,"column":3},{"name":"C6","available":true,"header":false,"wall":1,"row":6,"column":3},{"name":"D1","available":true,"header":false,"wall":1,"row":1,"column":4},{"name":"D2","available":false,"header":false,"wall":1,"row":2,"column":4},{"name":"D3","available":false,"header":false,"wall":1,"row":3,"column":4},{"name":"D4","available":true,"header":false,"wall":1,"row":4,"column":4},{"name":"D5","available":true,"header":false,"wall":1,"row":5,"column":4},{"name":"D6","available":true,"header":false,"wall":1,"row":6,"column":4},{"name":"E1","available":true,"header":false,"wall":1,"row":1,"column":5},{"name":"E2","available":true,"header":false,"wall":1,"row":2,"column":5},{"name":"E3","available":true,"header":false,"wall":1,"row":3,"column":5},{"name":"E4","available":true,"header":false,"wall":1,"row":4,"column":5},{"name":"E5","available":false,"header":false,"wall":1,"row":5,"column":5},{"name":"E6","available":true,"header":false,"wall":1,"row":6,"column":5},{"name":"F1","available":true,"header":false,"wall":1,"row":1,"column":6},{"name":"F2","available":true,"header":false,"wall":1,"row":2,"column":6},{"name":"F3","available":false,"header":false,"wall":1,"row":3,"column":6},{"name":"F4","available":true,"header":false,"wall":1,"row":4,"column":6},{"name":"F5","available":true,"header":false,"wall":1,"row":5,"column":6},{"name":"F6","available":true,"header":false,"wall":1,"row":6,"column":6},{"name":"G1","available":true,"header":false,"wall":1,"row":1,"column":7},{"name":"G2","available":true,"header":false,"wall":1,"row":2,"column":7},{"name":"G3","available":true,"header":false,"wall":1,"row":3,"column":7},{"name":"G4","available":true,"header":false,"wall":1,"row":4,"column":7},{"name":"G5","available":true,"header":false,"wall":1,"row":5,"column":7},{"name":"G6","available":true,"header":false,"wall":1,"row":6,"column":7},{"name":"H1","available":true,"header":false,"wall":1,"row":1,"column":8},{"name":"H2","available":false,"header":false,"wall":1,"row":2,"column":8},{"name":"H3","available":true,"header":false,"wall":1,"row":3,"column":8},{"name":"H4","available":true,"header":false,"wall":1,"row":4,"column":8},{"name":"H5","available":false,"header":false,"wall":1,"row":5,"column":8},{"name":"H6","available":true,"header":false,"wall":1,"row":6,"column":8},{"name":"I1","available":true,"header":false,"wall":1,"row":1,"column":9},{"name":"I2","available":true,"header":false,"wall":1,"row":2,"column":9},{"name":"I3","available":false,"header":false,"wall":1,"row":3,"column":9},{"name":"I4","available":true,"header":false,"wall":1,"row":4,"column":9},{"name":"I5","available":true,"header":false,"wall":1,"row":5,"column":9},{"name":"I6","available":true,"header":false,"wall":1,"row":6,"column":9},{"name":"J1","available":true,"header":false,"wall":1,"row":1,"column":10},{"name":"J2","available":false,"header":false,"wall":1,"row":2,"column":10},{"name":"J3","available":false,"header":false,"wall":1,"row":3,"column":10},{"name":"J4","available":true,"header":false,"wall":1,"row":4,"column":10},{"name":"J5","available":false,"header":false,"wall":1,"row":5,"column":10},{"name":"J6","available":true,"header":false,"wall":1,"row":6,"column":10},{"name":"1","available":false,"header":true,"wall":"1","row":"1","column":0},{"name":"2","available":false,"header":true,"wall":"1","row":"2","column":0},{"name":"3","available":false,"header":true,"wall":"1","row":"3","column":0},{"name":"4","available":false,"header":true,"wall":"1","row":"4","column":0},{"name":"5","available":false,"header":true,"wall":"1","row":"5","column":0},{"name":"6","available":false,"header":true,"wall":"1","row":"6","column":0},{"name":"A","available":false,"header":true,"wall":"1","row":0,"column":"1"},{"name":"B","available":false,"header":true,"wall":"1","row":0,"column":"2"},{"name":"C","available":false,"header":true,"wall":"1","row":0,"column":"3"},{"name":"D","available":false,"header":true,"wall":"1","row":0,"column":"4"},{"name":"E","available":false,"header":true,"wall":"1","row":0,"column":"5"},{"name":"F","available":false,"header":true,"wall":"1","row":0,"column":"6"},{"name":"G","available":false,"header":true,"wall":"1","row":0,"column":"7"},{"name":"H","available":false,"header":true,"wall":"1","row":0,"column":"8"},{"name":"I","available":false,"header":true,"wall":"1","row":0,"column":"9"},{"name":"J","available":false,"header":true,"wall":"1","row":0,"column":"10"}]}'|jq -r .image|base64 -d > /tmp/wall.jpg

docker kill $(docker ps|grep docker-image:test|awk ' { print $1 } ')
