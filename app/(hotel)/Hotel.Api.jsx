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

export const getHotelDetails = async (id) => {
  try {
    const response = await axiosFromBody.get(
      `${ApiUrl.HOTEL.GET_DETAILS}?id=${id}`
    );
    if (response.status === 200) {
      return response.data.data.hotel;
    } else {
      return {};
    }
  } catch (error) {
    console.log(error);
    return {};
  }
};

export const getFeedbackByHotelId = async (id) => {
  try {
    const response = await axiosFromBody.get(
      `${ApiUrl.HOTEL.GET_FEEDBACK}?hotelID=${id}`
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

export const getAllAmenitiesByHotelId = async (id) => {
  try {
    const response = await axiosFromBody.get(
      `${ApiUrl.HOTEL_AMENITIES.GET_ALL}?hotelID=${id}`
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
