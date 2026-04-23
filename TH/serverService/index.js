import http from 'http';
import { customers, orders, products } from './data.js';

const app = http.createServer((request, response) => {
    const url = request.url;
    const method = request.method;
    const baseUrl = new URL(request.url, 'http://localhost:3003'); // do bài 5 có sử dụng query parameters nên cần tạo đối tượng URL để dễ dàng truy xuất các tham số này
    const pathname = baseUrl.pathname; // do bài 5 có sử dụng query parameters nên cần tạo đối tượng URL để dễ dàng truy xuất đường dẫn chính của URL mà không bị ảnh hưởng bởi các tham số truy vấn

    //BÀI 1 LẤY TOÀN BỘ DANH SÁCH KHÁCH HÀNG
    if (url === '/customers' && method === 'GET') { // kiểm tra xem url có phải là '/customers' và phương thức là 'GET' hay không
        response.end(JSON.stringify(customers)) // nếu đúng, trả về toàn bộ danh sách khách hàng dưới dạng JSON
        return
    }

    //BÀI 2 LAY THÔNG TIN KHÁCH HÀNG THEO ID
    if (url.startsWith('/customers/') && url.split('/').length === 3 && method === 'GET') { // chỉ xử lý route dạng /customers/:id để tránh bị trùng với /customers/:id/orders
        const customerId = url.split('/')[2] // split: tách chuỗi url thành mảng, sau đó lấy phần tử thứ 2 để lấy id khách hàng
        const customer = customers.find(customer => customer.id === customerId) // find: tìm khách hàng có id trùng với customerId

        if (customer) {
            response.end(JSON.stringify(customer)) // nếu tìm thấy khách hàng, trả về thông tin khách hàng dưới dạng JSON
        } else {
            response.end(JSON.stringify({ message: 'Khách hàng không tồn tại' })) // nếu không tìm thấy khách hàng, trả về thông báo lỗi
        }

        return
    }

    //BÀI 3 LẤY DANH SÁCH ĐƠN HÀNG CỦA KHÁCH HÀNG CỤ THỂ GET /customers/:id/orders
    if (url.startsWith('/customers/') && url.endsWith('/orders') && method === 'GET') { // kiểm tra xem url có bắt đầu bằng '/customers/' và kết thúc bằng '/orders' và phương thức là 'GET' hay không
        const customerId = url.split('/')[2] // lấy id của khách hàng từ URL, ví dụ /customers/c001/orders thì customerId = c001
        const ordersOfCustomer = orders.filter(order => order.customerId === customerId) // filter: lọc ra tất cả đơn hàng có customerId trùng với id khách hàng

        if (ordersOfCustomer.length > 0) {
            response.end(JSON.stringify(ordersOfCustomer)) // nếu có đơn hàng thì trả về danh sách đơn hàng của khách hàng đó
        } else {
            response.end(JSON.stringify({ message: 'Không có đơn hàng cho khách hàng này' })) // nếu không có đơn hàng thì trả về thông báo
        }

        return
    }

    // BÀI 4: LẤY THÔNG TIN CÁC ĐƠN HÀNG CÓ TỔNG GIÁ TRỊ TRÊN 10 TRIỆU
    // Mô tả: Viết API để lấy danh sách các đơn hàng có tổng giá trị (totalPrice) trên 10 triệu.
    // Endpoint: GET /orders/highvalue
    // Yêu cầu: Trả về danh sách các đơn hàng có totalPrice lớn hơn 10000000.
    if (url === '/orders/highvalue' && method === 'GET') { // kiểm tra xem url có phải là '/orders/highvalue' và phương thức là 'GET' hay không
        const highValueOrders = orders.filter(order => order.totalPrice > 10000000) // lọc ra các đơn hàng có totalPrice lớn hơn 10 triệu
        response.end(JSON.stringify(highValueOrders)) // trả về danh sách các đơn hàng thỏa điều kiện dưới dạng JSON
        return
    }


    // BÀI 5: LỌC DANH SÁCH SẢN PHẨM THEO KHOẢNG GIÁ
    // Mô tả: Viết API để lọc danh sách sản phẩm dựa trên khoảng giá minPrice và maxPrice được truyền vào qua query parameters.
    // Nếu không có 1 trong 2 giá trị này thì trả về toàn bộ danh sách sản phẩm.
    // Endpoint: GET /products?minPrice=&maxPrice=
    // Ví dụ: GET /products?minPrice=5000000&maxPrice=10000000
    // Kết quả mong muốn: Trả về danh sách sản phẩm có giá từ 5 triệu đến 10 triệu.
    if (pathname === '/products' && method === 'GET') { // kiểm tra xem endpoint có phải là '/products' và phương thức là 'GET' hay không
        const minPrice = baseUrl.searchParams.get('minPrice') // lấy giá trị minPrice từ query parameters
        const maxPrice = baseUrl.searchParams.get('maxPrice') // lấy giá trị maxPrice từ query parameters

        if (minPrice === null || maxPrice === null) {
            response.end(JSON.stringify(products)) // nếu thiếu 1 trong 2 giá trị thì trả về toàn bộ danh sách sản phẩm
            return
        }

        const filteredProducts = products.filter(product => product.price >= Number(minPrice) && product.price <= Number(maxPrice)) // lọc danh sách sản phẩm theo khoảng giá
        response.end(JSON.stringify(filteredProducts)) // trả về danh sách sản phẩm thỏa điều kiện dưới dạng JSON
        return
    }

    response.end(JSON.stringify({ message: 'Hello World' })); // nếu url không phải là '/customers' hoặc '/customers/:id', trả về thông báo 'Hello World' dưới dạng JSON
});

app.listen(3003, () => { // lắng nghe trên cổng 3003 và khi server đã sẵn sàng, in ra thông báo 'Server is running on port 3003!'
    console.log('Server is running on port 3003!'); // khi server đã sẵn sàng, in ra thông báo 'Server is running on port 3003!'
});
