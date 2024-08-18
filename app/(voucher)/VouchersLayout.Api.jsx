import { ApiUrl } from "../../services/ApiUrl";
import axiosFromBody from "../../utils/axiosClient/formBody";
import axiosFromData from "../../utils/axiosClient/formData";

export const getAllVoucher = async () => {
  try {
    const response = await axiosFromBody.get(`${ApiUrl.VOUCHER.GET_ALL}`);
    if (response.status === 200) {
      return response.data.data;
    } else {
      return [];
    }
  } catch (error) {
    throw error;
  }
};

export const receiveVoucher = async (data) => {
  try {
    const response = await axiosFromData.post(
      `${ApiUrl.CUSTOMER.VOUCHER.RECEIVE_VOUCHER}`,
      data
    );
    return response;
  } catch (error) {
    throw error;
  }
};
