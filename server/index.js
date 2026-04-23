import http from 'http';

const products = [
  {
    id: 1,
    name: 'Iphone 14 Pro Max',
    price: 30000000,
  },
  {
    id: 2,
    name: 'Iphone 14 Pro',
    price: 25000000,
  },
  {
    id: 3,
    name: 'Iphone 14',
    price: 20000000,
  },
];

const users = [
  {
    id: 1,
    name: 'Nguyen Van A',
    email: 'nguyenvana@example.com',
  },
  {
    id: 2,
    name: 'Tran Thi B',
    email: 'tranthib@example.com',
  },
];

// createServer là phương thức giúp chúng ta khởi tạo 1 Server với giao thức http
// và sẽ giúp xử lý các request và response cho client
const app = http.createServer((request, response) => {
  // route: là đường dẫn mà client gửi lên server để yêu cầu dữ liệu
  const url = request.url;
  const method = request.method;

  console.log('method:', method);
  // /products?minPrice=100

  switch (url) {
    case '/products':
      response.end(JSON.stringify(products));
      break;
    case '/users':
      if (method === 'GET') {
        response.end(JSON.stringify(users));
      }

      if (method === 'POST') {
        users.push({ id: 3, name: 'Duyen', email: 'duyen@example.com' });
        response.end(JSON.stringify(users));
        //nếu k end thì client sẽ chờ mãi vì server chưa gửi phản hồi về cho client nên sẽ bị lỗi timeout
      }

      break;
    default:
      response.end(JSON.stringify({ message: 'Not Found' }));
      break;
  }

  // request: là đối tượng chứa thông tin về yêu cầu của client gửi lên server
  // response: là đối tượng chứa thông tin về phản hồi của server gửi về cho client
  // JSON.stringify là phương thức giúp chúng ta chuyển đổi 1 đối tượng JavaScript thành 1 chuỗi JSON
});

// để lắng nghe được, ta cần sử dụng phương thức listen
// và có 2 tham số truyền vào
// app.listen(Cổng khởi tạo, callback Function)
// callback Function sẽ được thực thi sau khi server được khởi tạo thành công
app.listen(3001, () => {
  console.log('Server is running hehe!');
});


// restful API: là một kiến trúc phần mềm được sử dụng để xây dựng các dịch vụ web. Nó sử dụng các phương thức HTTP (GET, POST, PUT, DELETE) để tương tác với tài nguyên trên server. Mỗi tài nguyên được định danh bằng một URL duy nhất và có thể được truy cập thông qua các phương thức HTTP khác nhau. RESTful API giúp tạo ra các ứng dụng web linh hoạt, dễ bảo trì và mở rộng.
// C: Create -> POST ví dụ POST /products -> tạo mới 1 sản phẩm
// R: Read -> GET ví dụ GET /products -> lấy danh sách sản phẩm
// U: Update -> PUT ví dụ PUT /products/1 -> cập nhật thông tin sản phẩm có id = 1
// D: Delete -> DELETE ví dụ DELETE /products/1 -> xóa sản phẩm có id = 1
