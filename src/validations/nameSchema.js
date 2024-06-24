import * as yup from "yup";

export const createNameSchema = yup.object({
  name: yup.string().required("Name is required"),
});
