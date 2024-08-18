export const API_BASE_URL =
  "https://eposhgraduation-001-site1.ftempurl.com/api/v1";
export const URL_IMAGE = "https://eposhgraduation-001-site1.ftempurl.com";

export const ApiUrl = {
  HOTEL: {
    GET_ALL: "/hotel/get-all",
    GET_DETAILS: "/hotel/get-by-id",
    GET_FEEDBACK: "/hotel/get-guest-review",
  },
  HOTEL_AMENITIES: {
    GET_ALL: "/hotel/get-service-by-hotelID",
  },
  ROOM: {
    GET_ALL: "/room/get-hotel-room",
    GET_DETAILS: "/room/get-room-by-id",
  },
  POST: {
    GET_ALL: "/blog/get-all-blog",
    GET_DETAILS: "/blog/get-blog-details",
  },
  VOUCHER: {
    GET_ALL: "/voucher/get-all-voucher",
  },
  ACCOUNT: {
    GET_PROFILE: "/auth/get-profile-by-account",
    UPDATE_PROFILE: "/auth/update-profile",
    CHANGE_PASSWORD: "/auth/change-password",
  },

  AUTH: {
    REGISTER: {
      CUSTOMER: "/auth/register-customer",
    },
    VERIFY_EMAIL: "/auth/active-account",
    SEND_MAIL: "/auth/send-mail",
    LOGIN: "/auth/login",
    GOOGLE_LOGIN: "/auth/google-login",
    RESET_PASSWORD: "/auth/update-new-password",
    LOGIN_PHONE_NUMBER: "/auth/login-phone",
    UPDATE_EMAIL: "/auth/update-email",
    UPDATE_PHONE: "/auth/update-phone",
  },

  CUSTOMER: {
    BOOKING: {
      GET_BY_ACCOUNT_ID: "/customer/booking/get-by-accountID",
      GET_DETAILS: "/customer/booking/get-booking-details",
      EXPORT: "/customer/booking/export-bookings-by-accountID",
      CANCEL_BOOKING: "/customer/booking/cancle-booking",
      CREATE_FEEDBACK: "/customer/feedback/create-feedback",
      CHECK_ROOM_PRICE: "/customer/booking/check-room-price",
      CREATE_BOOKING: "/customer/booking/create-booking",
    },
    POST: {
      GET_BY_ACCOUNT_ID: "/customer/blog/get-blog-by-account",
      CREATE_POST: "/customer/blog/create-blog",
      DELETE_POST: "/customer/blog/delete-blog",
      COMMENT_POST: "/customer/blog/comment-blog",
    },
    VOUCHER: {
      GET_BY_ACCOUNT_ID: "/customer/voucher/get-voucher-by-account",
      RECEIVE_VOUCHER: "/customer/voucher/receive-voucher",
    },
  },
  SEARCH: {
    SEARCH_NAME: "hotel/search",
  },
};
