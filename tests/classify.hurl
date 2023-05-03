POST http://localhost:8080
HTTP 404

POST http://localhost:8080/single/multipart-form
[MultipartFormData]
# https://pixabay.com/photos/kitty-playful-flowers-wildflowers-2948404/
content: file,kitty.jpg;

# TODO: Assert return code
