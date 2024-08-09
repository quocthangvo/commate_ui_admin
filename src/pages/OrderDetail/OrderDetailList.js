import React, { useCallback, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Table } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { useForm } from "react-hook-form";
import orderDetailsApi from "../../apis/orderDetailsApi";
import errorImage from "../../assets/img/error/error_image.png";

export default function OrderDetailList() {
  const navigate = useNavigate();
  const { id: orderId } = useParams();
  const [orderDetails, setOrderDetails] = useState([]);
  const { setValue } = useForm();

  const fetchOrderDetails = useCallback(() => {
    orderDetailsApi
      .getOrderDetailById(orderId)
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

  return (
    <div>
      <div className="container my-4">
        <Link className="btn btn-link" onClick={() => navigate(-1)}>
          <FontAwesomeIcon icon={faArrowLeft} className="icon-size" />
        </Link>
        <h2 className="text-center mb-4">Chi tiết đơn hàng</h2>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>ID</th>
              <th>Hình ảnh</th>
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
                  <td>
                    <img
                      src={
                        orderDetail.product_detail_id.images &&
                        orderDetail.product_detail_id.images.length > 0
                          ? `http://localhost:8080/uploads/${orderDetail.product_detail_id.images[0]}`
                          : errorImage
                      }
                      style={{ width: "50px", height: "50px" }}
                      alt="images"
                    />
                  </td>
                  <td>{orderDetail?.product_detail_id?.version_name}</td>
                  <td>{orderDetail?.quantity}</td>
                </tr>
              ))}
          </tbody>
        </Table>
      </div>
    </div>
  );
}
