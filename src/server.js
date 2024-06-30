// const express = require("express");
// const multer = require("multer");
// const path = require("path");

// const app = express();
// const PORT = process.env.PORT || 3000;

// // Thiết lập lưu trữ hình ảnh
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "./uploads"); // Thư mục lưu trữ hình ảnh
//   },
//   filename: function (req, file, cb) {
//     cb(null, `${Date.now()}-${file.originalname}`); // Đổi tên file nếu cần
//   },
// });

// const upload = multer({ storage: storage });

// // Endpoint để upload hình ảnh cho sản phẩm
// app.post("/products/uploads/:id", upload.single("image"), (req, res) => {
//   const productId = req.params.id;
//   const imageUrl = `${req.protocol}://${req.get("host")}/uploads/${
//     req.file.filename
//   }`;

//   // Lưu imageUrl vào cơ sở dữ liệu hoặc trả về cho frontend
//   res.json({ imageUrl: imageUrl });
// });

// app.listen(PORT, () => {
//   console.log(`Server is running on http://localhost:${PORT}`);
// });
