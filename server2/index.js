import express from "express";
import { users } from "./data.js";

/*
======================== EXPRESSJS - GHI CHÚ LÝ THUYẾT ========================

1. ExpressJS là gì?
- ExpressJS là framework chạy trên Node.js, giúp tạo server và viết API dễ hơn
  so với việc dùng thuần module http.
- Cú pháp gọn hơn, dễ tổ chức route, dễ xử lý request/response.

2. Khởi tạo server
- const app = express(); -> tạo ứng dụng Express
- app.listen(port, callback) -> mở server ở một cổng nhất định

3. Request và Response
- req (request): chứa thông tin client gửi lên server
- res (response): dùng để trả dữ liệu từ server về client

4. CRUD và các method thường dùng
- GET: lấy dữ liệu (Read)
- POST: tạo dữ liệu mới (Create)
- PUT: cập nhật dữ liệu (Update)
- DELETE: xóa dữ liệu (Delete)

5. Các cách lấy dữ liệu từ request
- req.query: lấy query params sau dấu ?
  Ví dụ: /user?age=20&name=An
- req.params: lấy params trên URL
  Ví dụ: /users/:id
- req.body: lấy dữ liệu body mà client gửi lên
  Thường dùng với POST, PUT, PATCH

6. Middleware express.json()
- app.use(express.json()) giúp Express hiểu body dạng JSON
- Nếu thiếu middleware này, req.body thường sẽ là undefined

7. Trả dữ liệu về client
- res.send(data): trả dữ liệu về client
- res.status(code).send(data): trả dữ liệu kèm mã trạng thái HTTP

8. Một số status code hay gặp
- 200: OK -> xử lý thành công
- 201: Created -> tạo dữ liệu thành công
- 400: Bad Request -> request gửi lên không hợp lệ
- 401: Unauthorized -> chưa xác thực được client
- 403: Forbidden -> client không có quyền
- 404: Not Found -> không tìm thấy tài nguyên
- 500: Internal Server Error -> lỗi phía server

9. Lưu ý khi học Express
- Express đọc route từ trên xuống dưới.
- Nếu có 2 route trùng method và trùng path, route ở trên thường chạy trước.
- Dữ liệu trong mảng users hiện chỉ nằm trong RAM.
- Nếu restart server, dữ liệu thêm/sửa/xóa sẽ quay về như file data.js ban đầu.

===============================================================================
*/

const app = express();

// phương thức get với base API
app.get("/user/", (req, res) => {
    // req là request, res là response
    const data = req.query; // lấy query parameters từ request
    // get là phương thức HTTP, '' là đường dẫn của API
    console.log(`age: ${data.age}`); // in ra query parameters
    res.send(data);
    // res.end() là phương thức kết thúc response, gửi dữ liệu về client
});

app.get('/users/:id', (req, res) => {
    // :id là path parameter, có thể lấy được giá trị của id từ req.params
    // req.params là object chứa các path parameters, có thể lấy được giá trị của id từ req.params.id
    const { id } = req.params;
    // đây là cấy lấy query parameters từ request, có thể dùng để lọc dữ liệu hoặc thực hiện các tác vụ khác
    const data = req.query; // lấy query parameters từ request
    // sự khác nhau giữa path parameters và query parameters là path parameters được sử dụng để xác định tài nguyên cụ thể, trong khi query parameters được sử dụng để lọc hoặc sắp xếp dữ liệu.
    const user = users.find(item => item.id === id);
    res.send(user);
});


app.use(express.json()); // đây là một cách xử lý, giúp cho server nhận dạng dữ liệu gửi lên là một json
                         // là một hàm xử lý trung gian, tất cả các request sẽ đều đi qua. (sau này gọi là middleware)
app.post('/users', (req, res) => {
    // get data từ body 
    const body = req.body;
    // push data vào mảng users
    users.push(body);
    // gửi data về client
    res.send(users);
});

// lấy tất cả users, có thể dùng để hiển thị danh sách người dùng hoặc thực hiện các tác vụ khác
app.get('/users', (req, res) => {
    res.send(users);
});

app.put('/users/:id', (req, res) => {
    // lấy id từ path parameters
    const { id } = req.params;
    // lấy data từ body
    const fieldsUpdate = req.body;
    //  tìm user có id bằng id trong path parameters
    const currentUser = users.find(item => item.id === id);
    // cập nhật các trường của user bằng data từ body
    for (const key in fieldsUpdate) {
        currentUser[key] = fieldsUpdate[key];
    }
    res.send(users);
});

app.delete('/users/:id', (req, res) => {
    // lấy id từ path parameters
    const { id } = req.params;
    // tìm index của user có id bằng id trong path parameters
    const currentIndxUser = users.findIndex(item => item.id === id);
    // xóa user có index bằng index tìm được
    users.splice(currentIndxUser, 1);
    res.send(users);
});

app.get('/users/:id', (req, res) => {
    const { id } = req.params;
    const user = users.find(item => item.id === id);
    // kiểm tra tồn tại user hay không
    if (!user) {
        res.status(500).send({
            message: 'Không tìm thấy user',
            success: false,
            data: null
        });
    } else {
        res.status(200).send({
            data: user,
            message: 'Tìm user thành công',
            success: true
        });
    }
});

app.listen(8080, () => {
    // 8080 là port của server, có thể thay đổi tùy ý
    console.log("Server is running 123!");
});


// call back là hàm được gọi sau khi server đã khởi động thành công, có thể dùng để in ra thông báo hoặc thực hiện các tác vụ khác.

// query parameters là các tham số được truyền vào trong URL sau dấu hỏi (?), có thể dùng để lọc dữ liệu hoặc thực hiện các tác vụ khác. 
// Ví dụ: http://localhost:8080?name=John&age=30, trong đó name và age là query parameters.

// HTTP status code là mã trạng thái giúp client biết request đang thành công hay bị lỗi ở đâu.
// Một số nhóm status code thường gặp:
// 1xx: Informational responses (100 - 199)
// 2xx: Successful responses (200 - 299)
// 3xx: Redirection messages (300 - 399)
// 4xx: Client error responses (400 - 499)
// 5xx: Server error responses (500 - 599)

// Một số mã hay dùng và ý nghĩa:
// 200 - OK: dùng khi xử lý thành công.
// 201 - Created: dùng khi thêm dữ liệu thành công.
// 401 - Unauthorized: dùng khi server không xác thực được thông tin client gửi lên.
// 403 - Forbidden: client đã được nhận diện nhưng không có quyền truy cập tài nguyên.
// 404 - Not Found: server không tìm thấy tài nguyên mà client yêu cầu.
// 500 - Internal Server Error: lỗi phía server khi không xử lý được request.

// Cú pháp trả về status code trong Express:
// res.status(ma_can_tra_ve).send(du_lieu_tra_ve);

// Ví dụ:
// res.status(200).send({ message: 'Lấy dữ liệu thành công' });
// res.status(201).send({ message: 'Tạo user thành công' });
// res.status(404).send({ message: 'Không tìm thấy user' });
