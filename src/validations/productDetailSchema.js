import * as yup from "yup";

export const createProductDetailSchema = yup.object({
  name: yup.string().required("Name is required"),
});
