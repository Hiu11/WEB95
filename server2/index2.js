import express from "express";
import { customers } from "./data2.js";

const app = express();

app.use(express.json());

app.get("/customers", (req, res) => {
    res.send(customers);
});

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});

// ======================== THUC HANH LESSON 2 ========================
// Mo ta du lieu:
// customers:
// - id: ma dinh danh duy nhat cua khach hang
// - name: ten day du cua khach hang
// - email: email cua khach hang, phai la duy nhat
// - age: tuoi cua khach hang
//
// products:
// - id: ma dinh danh duy nhat cua san pham
// - name: ten san pham
// - price: gia cua 1 don vi san pham
// - quantity: so luong san pham con lai trong kho
//
// orders:
// - id: ma dinh danh duy nhat cua don hang
// - customerId: id cua khach hang dat don
// - productId: id cua san pham trong don
// - quantity: so luong san pham duoc mua
// - totalPrice: tong tien cua don hang

// BAI 1:
// Viet API de lay toan bo danh sach khach hang.
// Endpoint: GET /customers
// Yeu cau: Tra ve danh sach toan bo khach hang.
app.get("/customers", (req, res) => {
    res.send(customers);
});

// BAI 2:
// Viet API de lay thong tin chi tiet cua 1 khach hang dua tren id.
// Endpoint: GET /customers/:id
// Vi du:
// - /customers/1 -> tra ve customer co id la 1
// - /customers/2 -> tra ve customer co id la 2
// Yeu cau: Tra ve thong tin cua 1 khach hang cu the dua tren id duoc truyen vao URL.
app.get("/customers/:id", (req, res) => {
    const { id } = req.params; // lay id tu params
    const customer = customers.find(c => c.id === id); // tim customer co id tuong ung
    if (customer) {
        res.send(customer); // tra ve thong tin customer neu tim thay
    } else {
        res.status(404).send({ message: "Customer not found" }); // tra ve loi 404 neu khong tim thay
    }
}); 

// BAI 3:
// Viet API de lay danh sach cac don hang cua 1 khach hang cu the dua tren customerId.
// Endpoint: GET /customers/:customerId/orders
// Vi du:
// - /customers/1/orders -> tra ve danh sach orders cua customer co id la 1
// Yeu cau:
// - Tra ve tat ca don hang cua 1 khach hang dua tren customerId
// - Neu khach hang khong co don hang nao thi tra ve mang rong
app.get("/customers/:customerId/orders", (req, res) => {
    const { customerId } = req.params; // lay customerId tu params
    const customerOrders = orders.filter(o => o.customerId === customerId); // loc cac don hang co customerId tuong ung
    res.send(customerOrders); // tra ve danh sach don hang cua khach hang
});

// BAI 4:
// Viet API de lay danh sach cac don hang co tong gia tri lon hon 10 trieu.
// Endpoint: GET /orders/highvalue
// Yeu cau: Tra ve danh sach cac don hang co totalPrice > 10000000.

// BAI 5:
// Viet API de loc danh sach san pham dua tren khoang gia minPrice va maxPrice.
// Endpoint: GET /products?minPrice=?&maxPrice=?
// Vi du:
// - GET /products?minPrice=5000000&maxPrice=10000000
// Yeu cau:
// - Tra ve danh sach san pham co gia trong khoang minPrice den maxPrice
// - Neu thieu 1 trong 2 query params thi tra ve toan bo danh sach products

// BAI 6:
// Viet API de them moi 1 khach hang vao danh sach customers.
// Endpoint: POST /customers
// Yeu cau:
// - Nhan thong tin tu request body: name, email, age
// - Them khach hang moi vao mang customers
// - Tra ve thong tin khach hang moi duoc them
// - id phai duoc sinh ngau nhien va khong trung (co the dung crypto)
// - email phai la duy nhat, khong duoc trung

// BAI 7:
// Viet API de tao moi 1 don hang.
// Endpoint: POST /orders
// Yeu cau:
// - Nhan thong tin tu request body: orderId, customerId, productId, quantity
// - quantity phai hop le va khong vuot qua quantity hien co cua product
// - Tinh totalPrice dua tren gia san pham va quantity
// - Them don hang vao mang orders
// - Tra ve thong tin don hang moi vua duoc tao

// BAI 8:
// Viet API de cap nhat so luong san pham trong 1 don hang dua tren orderId.
// Endpoint: PUT /orders/:orderId
// Yeu cau:
// - Nhan thong tin cap nhat tu request body, bao gom quantity
// - Tim don hang dua tren orderId
// - Cap nhat quantity moi va tinh lai totalPrice
// - Neu khong tim thay don hang thi tra ve loi 404

// BAI 9:
// Viet API de xoa 1 khach hang dua tren id.
// Endpoint: DELETE /customers/:id
// Yeu cau:
// - Xoa khach hang co id tuong ung khoi mang customers
// - Neu khong tim thay khach hang thi tra ve loi 404
// - Tra ve thong bao thanh cong sau khi xoa
