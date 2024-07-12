import React, { useCallback, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Table } from "react-bootstrap";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import orderDetailsApi from "../../apis/orderDetailsApi";

export default function OrderDetailList() {
  const navigate = useNavigate();
  const { id: orderId } = useParams(); // Đổi tên biến cho rõ ràng
  const [orderDetails, setOrderDetails] = useState([]);
  const { setValue } = useForm();

  const fetchOrderDetails = useCallback(() => {
    orderDetailsApi
      .getOrderDetailById(orderId) // Cập nhật phương thức gọi API
      .then((response) => {
        setOrderDetails(response.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [orderId]);

  useEffect(() => {
    fetchOrderDetails();
  }, [fetchOrderDetails]);

  useEffect(() => {
    if (orderDetails.length > 0) {
      setValue("orderCode", orderDetails[0]?.productDetail?.orderCode);
      setValue("productDetail", orderDetails[0]?.productDetail?.versionName);
      setValue("quantity", orderDetails[0]?.productDetail?.quantity);
    }
  }, [orderDetails, setValue]);

  const handleUpdateOrder = () => {
    // Gọi API cập nhật tất cả các chi tiết đơn đặt hàng đã thay đổi
    Promise.all(
      orderDetails.map((detail) =>
        orderDetailsApi.updateOrderDetail(detail.id, {
          quantity: detail.quantity,
          price: detail.price, // Thêm cập nhật giá vào đây
        })
      )
    )
      .then((responses) => {
        toast.success("Cập nhật đơn hàng thành công!");
      })
      .catch((error) => {
        toast.error("Không thể cập nhật đơn hàng!");
      });
  };

  return (
    <div>
      <div className="container my-4">
        <Link className="btn btn-link" onClick={() => navigate(-1)}>
          <FontAwesomeIcon icon={faArrowLeft} className="icon-size" />
        </Link>
        <h2 className="text-center mb-4">Chi tiết đơn hàng</h2>{" "}
        {/* Đổi tiêu đề */}
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>ID</th>
              <th>Mã đơn hàng</th>
              <th>Tên sản phẩm</th>
              <th>Số lượng</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(orderDetails) &&
              orderDetails.length > 0 &&
              orderDetails.map((orderDetail, index) => (
                <tr key={orderDetail.id}>
                  <td>{index + 1}</td>
                  <td>{orderDetail?.orderCode}</td>
                  <td>{orderDetail?.productDetail?.versionName}</td>
                  <td>{orderDetail?.quantity}</td>
                </tr>
              ))}
          </tbody>
        </Table>
        <div className="text-end">
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleUpdateOrder}
          >
            Cập nhật đơn hàng
          </button>
        </div>
      </div>
    </div>
  );
}
