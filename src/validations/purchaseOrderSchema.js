import * as yup from "yup";

export const purchaseOrderSchema = yup.object({
  supplier_id: yup.string().required("Nhà cung cấp là bắt buộc"),
});
