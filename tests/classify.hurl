POST http://localhost:8080
HTTP 404

POST http://localhost:8080/classify
[MultipartFormData]
# https://pixabay.com/photos/kitty-playful-flowers-wildflowers-2948404/
content: file,kitty.jpg;

HTTP 200
[Asserts]
jsonpath "$.prediction.neutral" > 0.99
jsonpath "$.prediction.drawing" < 0.01
jsonpath "$.prediction.porn" < 0.01
jsonpath "$.prediction.sexy" < 0.01
jsonpath "$.prediction.hentai" < 0.01
