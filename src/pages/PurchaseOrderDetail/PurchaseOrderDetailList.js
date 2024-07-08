import React, { useCallback, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Table } from "react-bootstrap";
import purchaseOrderDetailsApi from "../../apis/purchaseOrderDetailsApi";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

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
  }, []);

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

  const handleQuantityUpdate = (id, newQuantity) => {
    purchaseOrderDetailsApi
      .updatePurchaseOrderDetail(id, { quantity: newQuantity })
      .then((response) => {
        console.log("Cập nhật số lượng thành công!");
        fetchPurchaseOrderDetails();
      })
      .catch((error) => {
        console.error("Lỗi khi cập nhật số lượng:", error);
      });
  };

  const handleUpdateOrder = () => {
    // Gọi API cập nhật tất cả các chi tiết đơn đặt hàng đã thay đổi
    Promise.all(
      purchaseOrderDetails.map((detail) =>
        purchaseOrderDetailsApi.updatePurchaseOrderDetail(detail.id, {
          quantity: detail.quantity,
        })
      )
    )
      .then((responses) => {
        toast.success("Cập nhật đơn hàng thành công!");
      })
      .catch((error) => {
        toast.error("Lỗi khi cập nhật đơn hàng!");
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
              <th>Mã đơn hàng</th>
              <th>Ngày đặt hàng</th>
              <th>Sản phẩm</th>
              <th>Giá </th>
              <th>Số lượng</th>
              <th>Ghi chú</th>
              <th>Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(purchaseOrderDetails) &&
              purchaseOrderDetails.length > 0 &&
              purchaseOrderDetails.map((purchaseOrderDetail, index) => (
                <tr key={purchaseOrderDetail.id}>
                  <td>{index + 1}</td>
                  <td>{purchaseOrderDetail?.purchaseOrderId?.code}</td>
                  <td>{purchaseOrderDetail?.purchaseOrderId?.orderDate}</td>
                  <td>
                    {purchaseOrderDetail?.productDetail?.product.name} -{" "}
                    {purchaseOrderDetail?.productDetail?.size.name} -{" "}
                    {purchaseOrderDetail?.productDetail?.color.name}
                  </td>
                  <td>{purchaseOrderDetail?.price}</td>
                  <td>
                    <input
                      type="number"
                      value={purchaseOrderDetail?.quantity}
                      className="input-field"
                      onChange={(e) => {
                        const newQuantity = parseInt(e.target.value);
                        handleQuantityUpdate(
                          purchaseOrderDetail.id,
                          newQuantity
                        );
                      }}
                    />
                  </td>
                  <td>{purchaseOrderDetail?.note}</td>
                  <td>{purchaseOrderDetail?.status}</td>
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
