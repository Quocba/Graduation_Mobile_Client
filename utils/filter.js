// Filter list hotels have room
export const filterListHotelsHaveRoom = (listHotels) => {
  let listHotel = [];

  listHotels?.forEach((element) => {
    if (element?.rooms?.length > 0) {
      listHotel.push(element);
    }
  });

  return listHotel;
};
