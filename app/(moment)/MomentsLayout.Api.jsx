import { ApiUrl } from "../../services/ApiUrl";
import axiosFromBody from "../../utils/axiosClient/formBody";
import axiosFromData from "../../utils/axiosClient/formData";

export const getAllPost = async () => {
  try {
    const response = await axiosFromBody.get(`${ApiUrl.POST.GET_ALL}`);
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

export const getPostDetails = async (id) => {
  try {
    const response = await axiosFromBody.get(
      `${ApiUrl.POST.GET_DETAILS}?blogId=${id}`
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

export const commentPost = async (data) => {
  try {
    const response = await axiosFromData.post(
      `${ApiUrl.CUSTOMER.POST.COMMENT_POST}`,
      data
    );
    return response;
  } catch (error) {
    throw error;
  }
};

export const createPost = async (data) => {
  try {
    const response = await axiosFromData.post(
      `${ApiUrl.CUSTOMER.POST.CREATE_POST}`,
      data
    );
    return response;
  } catch (error) {
    throw error;
  }
};
