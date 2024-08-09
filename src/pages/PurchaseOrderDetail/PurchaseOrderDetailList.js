import React, { useCallback, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Table } from "react-bootstrap";
import purchaseOrderDetailsApi from "../../apis/purchaseOrderDetailsApi";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import errorImage from "../../assets/img/error/error_image.png";

export default function PurchaseOrderDetailList() {
  const navigate = useNavigate();
  const { id: purchaseOrderDetailId } = useParams();
  const [purchaseOrderDetails, setPurchaseOrderDetails] = useState([]);
  const { setValue } = useForm();

  const fetchPurchaseOrderDetails = useCallback(() => {
    purchaseOrderDetailsApi
      .getByPurchaseOrderById(purchaseOrderDetailId)
      .then((response) => {
        setPurchaseOrderDetails(response.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [purchaseOrderDetailId]);

  useEffect(() => {
    fetchPurchaseOrderDetails();
  }, [fetchPurchaseOrderDetails]);

  useEffect(() => {
    if (purchaseOrderDetails.length > 0) {
      setValue(
        "name",
        purchaseOrderDetails[0]?.productDetail.product?.name || ""
      );
      setValue("size", purchaseOrderDetails[0]?.productDetail?.size?.name);
      setValue("color", purchaseOrderDetails[0]?.productDetail?.color?.name);
      setValue("code", purchaseOrderDetails[0]?.purchaseOrderId?.code);
      setValue(
        "orderDate",
        purchaseOrderDetails[0]?.purchaseOrderId?.orderDate
      );
      setValue("status", purchaseOrderDetails[0]?.purchaseOrderId?.status);
    }
  }, [purchaseOrderDetails, setValue]);

  const handleUpdateOrder = () => {
    // Gọi API cập nhật tất cả các chi tiết đơn đặt hàng đã thay đổi
    Promise.all(
      purchaseOrderDetails.map((detail) =>
        purchaseOrderDetailsApi.updatePurchaseOrderDetail(detail.id, {
          quantity: detail.quantity,
          price: detail.price, // Thêm cập nhật giá vào đây
        })
      )
    )
      .then(() => {
        toast.success("Cập nhật đơn hàng thành công!");
      })
      .catch(() => {
        toast.error("Không thể cập nhật đơn hàng!");
      });
  };

  return (
    <div>
      <div className="container my-4">
        <Link className="btn btn-link" onClick={() => navigate(-1)}>
          <FontAwesomeIcon icon={faArrowLeft} className="icon-size" />
        </Link>
        <h2 className="text-center mb-4">Chi tiết đơn đặt hàng</h2>

        <Table striped bordered hover>
          <thead>
            <tr>
              <th>ID</th>
              <th>Hình ảnh</th>
              <th>Sản phẩm</th>
              <th>Mã sku</th>
              <th>Giá </th>
              <th>Số lượng</th>
              <th>Ghi chú</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(purchaseOrderDetails) &&
              purchaseOrderDetails.length > 0 &&
              purchaseOrderDetails.map((purchaseOrderDetail, index) => (
                <tr key={purchaseOrderDetail.id}>
                  <td>{index + 1}</td>
                  <td>
                    <img
                      src={
                        purchaseOrderDetail.productDetail.images &&
                        purchaseOrderDetail.productDetail.images.length > 0
                          ? `http://localhost:8080/uploads/${purchaseOrderDetail.productDetail?.images[0]}`
                          : errorImage
                      }
                      style={{ width: "50px", height: "50px" }}
                      alt="images"
                    />
                  </td>
                  <td>{purchaseOrderDetail?.productDetail?.version_name}</td>
                  <td>{purchaseOrderDetail?.productDetail.version_sku}</td>
                  <td>
                    <input
                      type="number"
                      value={purchaseOrderDetail?.price}
                      className="input-field"
                      onChange={(e) => {
                        const newPrice = parseFloat(e.target.value);
                        setPurchaseOrderDetails((prevDetails) =>
                          prevDetails.map((detail) =>
                            detail.id === purchaseOrderDetail.id
                              ? { ...detail, price: newPrice }
                              : detail
                          )
                        );
                      }}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      value={purchaseOrderDetail?.quantity}
                      className="input-field"
                      onChange={(e) => {
                        const newQuantity = parseInt(e.target.value);
                        setPurchaseOrderDetails((prevDetails) =>
                          prevDetails.map((detail) =>
                            detail.id === purchaseOrderDetail.id
                              ? { ...detail, quantity: newQuantity }
                              : detail
                          )
                        );
                      }}
                    />
                  </td>
                  <td>{purchaseOrderDetail?.note}</td>
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
