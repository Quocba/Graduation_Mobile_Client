import { ApiUrl } from "../../services/ApiUrl";
import axiosFromBody from "../../utils/axiosClient/formBody";
import axiosFromData from "../../utils/axiosClient/formData";

export const getAllRoom = async (id) => {
  try {
    const response = await axiosFromBody.get(
      `${ApiUrl.ROOM.GET_ALL}?hotelID=${id}`
    );

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

export const getRoomDetails = async (id) => {
  try {
    const response = await axiosFromBody.get(
      `${ApiUrl.ROOM.GET_DETAILS}?roomID=${id}`
    );
    if (response.status === 200) {
      return response.data.data;
    } else {
      return {};
    }
  } catch (error) {
    console.log(error);
    return {};
  }
};

export const checkRoomPrice = async (data) => {
  try {
    const response = await axiosFromData.post(
      `${ApiUrl.CUSTOMER.BOOKING.CHECK_ROOM_PRICE}`,
      data
    );
    return response;
  } catch (error) {
    throw error;
  }
};

export const createBooking = async (data) => {
  try {
    const response = await axiosFromData.post(
      `${ApiUrl.CUSTOMER.BOOKING.CREATE_BOOKING}`,
      data
    );
    return response;
  } catch (error) {
    throw error;
  }
};
