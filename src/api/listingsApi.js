import axiosInstance from "./axiosInstance";

// ===========================================================================
// Guides
// ===========================================================================

export const getGuides = async (page = 1) => {
  const response = await axiosInstance.get(`/listings/guides/?page=${page}`);
  return response.data;
};

export const getGuideProfile = async () => {
  const response = await axiosInstance.get("/listings/guides/update/");
  return response.data;
};

export const updateGuideProfile = async (data) => {
  const formData = new FormData();

  Object.entries(data).forEach(([key, val]) => {
    if (val !== null && val !== undefined) {
      if (key === "profile_image" && !(val instanceof File)) {
        return;
      }
      formData.append(key, val);
    }
  });

  const response = await axiosInstance.patch(
    "/listings/guides/update/",
    formData,
    {
      headers: { "Content-Type": "multipart/form-data" },
    }
  );

  return response.data;
};

// ===========================================================================
// Hotels
// ===========================================================================

export const getHotels = async (page = 1) => {
  const response = await axiosInstance.get(`/listings/hotels/?page=${page}`);
  return response.data;
};

export const createHotelProfile = async (data) => {
  const formData = new FormData();

  Object.entries(data).forEach(([key, val]) => {
    if (val !== null && val !== undefined) {
      formData.append(key, val);
    }
  });

  const response = await axiosInstance.post(
    "/listings/hotels/create/",
    formData,
    {
      headers: { "Content-Type": "multipart/form-data" },
    }
  );

  return response.data;
};

// ===========================================================================
// Rooms
// ===========================================================================

export const getRooms = async (page = 1) => {
  const response = await axiosInstance.get(`/listings/rooms/?page=${page}`);
  return response.data;
};

export const createRoom = async (data) => {
  const response = await axiosInstance.post("/listings/rooms/create/", data);
  return response.data;
};

// ===========================================================================
// Packages
// ===========================================================================

export const getPackages = async (page = 1) => {
  const response = await axiosInstance.get(`/listings/packages/?page=${page}`);
  return response.data;
};

export const createPackage = async (data) => {
  const response = await axiosInstance.post("/listings/packages/create/", data);
  return response.data;
};

// ===========================================================================
// Image Uploads
// ===========================================================================

export const uploadHotelImages = async (hotelId, imageFiles) => {
  const formData = new FormData();
  imageFiles.forEach((file) => formData.append("images", file));

  const response = await axiosInstance.post(
    `/listings/hotels/${hotelId}/images/`,
    formData,
    { headers: { "Content-Type": "multipart/form-data" } }
  );

  return response.data;
};

export const uploadRoomImages = async (roomId, imageFiles) => {
  const formData = new FormData();
  imageFiles.forEach((file) => formData.append("images", file));

  const response = await axiosInstance.post(
    `/listings/rooms/${roomId}/images/`,
    formData,
    { headers: { "Content-Type": "multipart/form-data" } }
  );

  return response.data;
};

export const uploadPackageImages = async (packageId, imageFiles) => {
  const formData = new FormData();
  imageFiles.forEach((file) => formData.append("images", file));

  const response = await axiosInstance.post(
    `/listings/packages/${packageId}/images/`,
    formData,
    { headers: { "Content-Type": "multipart/form-data" } }
  );

  return response.data;
};