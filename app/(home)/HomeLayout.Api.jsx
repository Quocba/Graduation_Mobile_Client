import { ApiUrl } from "../../services/ApiUrl";
import axiosFromBody from "../../utils/axiosClient/formBody";

export const getAllHotel = async () => {
  try {
    const response = await axiosFromBody.get(`${ApiUrl.HOTEL.GET_ALL}`);
    if (response.status === 200) {
      return response.data.data;
    } else {
      return [];
    }
  } catch (error) {
    console.log(error);
    return [];
  }
};
