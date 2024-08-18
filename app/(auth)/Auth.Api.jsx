import { ApiUrl } from "../../services/ApiUrl";
import axiosFromBody from "../../utils/axiosClient/formBody";
import axiosFromData from "../../utils/axiosClient/formData";

export const login = async (data) => {
  try {
    const response = await axiosFromBody.post(`${ApiUrl.AUTH.LOGIN}`, data);
    return response;
  } catch (error) {
    throw error;
  }
};

export const googleLogin = async (data) => {
  try {
    const response = await axiosFromData.post(
      `${ApiUrl.AUTH.GOOGLE_LOGIN}`,
      data
    );
    return response;
  } catch (error) {
    throw error;
  }
};

export const getProfile = async (id) => {
  try {
    const response = await axiosFromBody.get(
      `${ApiUrl.ACCOUNT.GET_PROFILE}?accountId=${id}`
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

export const changePassword = async (data) => {
  try {
    const response = await axiosFromBody.put(
      `${ApiUrl.ACCOUNT.CHANGE_PASSWORD}`,
      data
    );
    return response;
  } catch (error) {
    console.log(error);
    return false;
  }
};

export const saveProfile = (profile) => {
  return {
    type: HomeActions.SAVE_DATA_PROFILE,
    payload: profile,
  };
};

export const updateProfile = async (data) => {
  try {
    const response = await axiosFromData.put(
      `${ApiUrl.ACCOUNT.UPDATE_PROFILE}`,
      data
    );
    if (response.status === 200) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.log(error);
    return false;
  }
};

export const getAllVoucherByAccountId = async (accountId) => {
  try {
    const response = await axiosFromBody.get(
      `${ApiUrl.CUSTOMER.VOUCHER.GET_BY_ACCOUNT_ID}?accountId=${accountId}`
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

export const getAllPostByAccountId = async (id) => {
  try {
    const response = await axiosFromBody.get(
      `${ApiUrl.CUSTOMER.POST.GET_BY_ACCOUNT_ID}?accountId=${id}`
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

export const deletePost = async (id) => {
  try {
    const response = await axiosFromBody.delete(
      `${ApiUrl.CUSTOMER.POST.DELETE_POST}?blogId=${id}`
    );
    return response;
  } catch (error) {
    throw error;
  }
};

export const getBookingByAccountId = async (id) => {
  try {
    const response = await axiosFromBody.get(
      `${ApiUrl.CUSTOMER.BOOKING.GET_BY_ACCOUNT_ID}?accountID=${id}`
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

export const getBookingDetails = async (id) => {
  try {
    const response = await axiosFromBody.get(
      `${ApiUrl.CUSTOMER.BOOKING.GET_DETAILS}?bookingID=${id}`
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

export const cancelBooking = async (data) => {
  try {
    const response = await axiosFromData.put(
      `${ApiUrl.CUSTOMER.BOOKING.CANCEL_BOOKING}`,
      data
    );
    return response;
  } catch (error) {
    throw error;
  }
};

export const createFeedback = async (data) => {
  try {
    const response = await axiosFromData.post(
      `${ApiUrl.CUSTOMER.BOOKING.CREATE_FEEDBACK}`,
      data
    );
    return response;
  } catch (error) {
    throw error;
  }
};

export const registerCustomer = async (data) => {
  try {
    const response = await axiosFromBody.post(
      `${ApiUrl.AUTH.REGISTER.CUSTOMER}`,
      data
    );
    return response;
  } catch (error) {
    throw error;
  }
};

export const verifyEmail = async (email) => {
  try {
    const response = await axiosFromData.put(
      `${ApiUrl.AUTH.VERIFY_EMAIL}`,
      email
    );
    return response;
  } catch (error) {
    throw error;
  }
};

export const sendMail = async (email) => {
  try {
    const response = await axiosFromBody.post(
      `${ApiUrl.AUTH.SEND_MAIL}`,
      email
    );
    return response;
  } catch (error) {
    console.log(error);
  }
};

export const resetPassword = async (data) => {
  try {
    const response = await axiosFromData.put(
      `${ApiUrl.AUTH.RESET_PASSWORD}`,
      data
    );
    return response;
  } catch (error) {
    throw error;
  }
};

export const loginPhone = async (data) => {
  try {
    const response = await axiosFromData.post(
      `${ApiUrl.AUTH.LOGIN_PHONE_NUMBER}`,
      data
    );
    return response;
  } catch (error) {
    throw error;
  }
};

export const getSearchName = async (name) => {
  try {
    const response = await axiosFromData.get(
      `${ApiUrl.SEARCH.SEARCH_NAME}?name=${name}`
    );
    if (response.status === 200) {
      return response.data.data;
    } else {
      return {};
    }
  } catch (error) {
    console.error(error);
    return {};
  }
};

export const updateEmail = async (email) => {
  try {
    const response = await axiosFromData.put(
      `${ApiUrl.AUTH.UPDATE_EMAIL}`,
      email
    );
    return response;
  } catch (error) {
    console.log(error);
  }
};

export const updatePhone = async (phone) => {
  try {
    const response = await axiosFromData.put(
      `${ApiUrl.AUTH.UPDATE_PHONE}`,
      phone
    );
    return response;
  } catch (error) {
    console.log(error);
  }
};
