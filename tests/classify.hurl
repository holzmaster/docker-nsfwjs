POST http://localhost:8080
HTTP 404

POST http://localhost:8080/single/multipart-form
[MultipartFormData]
# https://pixabay.com/photos/kitty-playful-flowers-wildflowers-2948404/
content: file,kitty.jpg;

HTTP 200
[Asserts]
jsonpath "$.prediction[0].className" == "Neutral"
jsonpath "$.prediction[0].probability" > 0.99
jsonpath "$.prediction[1].className" == "Drawing"
jsonpath "$.prediction[1].probability" < 0.01
jsonpath "$.prediction[2].className" == "Porn"
jsonpath "$.prediction[2].probability" < 0.01
jsonpath "$.prediction[3].className" == "Sexy"
jsonpath "$.prediction[3].probability" < 0.01
jsonpath "$.prediction[4].className" == "Hentai"
jsonpath "$.prediction[4].probability" < 0.01
