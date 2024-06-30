import * as yup from "yup";

export const phoneSchema = yup.object({
  phone_number: yup.string().required("Phone là bắt buộc"),
});
