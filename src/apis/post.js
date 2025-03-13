import authorizedAxiosInstance from "@/utils/authorizedAxios";
import { BASE_URL } from "@/configs/globalVariables";

export const likeOrDislikeAPI = async (postId, action) => {
  return await authorizedAxiosInstance.put(
    `${BASE_URL}/post/${postId}/${action}`
  );
};

export const commentAPI = async (postId, text) => {
  return await authorizedAxiosInstance.post(
    `${BASE_URL}/post/${postId}/comment`,
    { text }
  );
};

export const deletePostAPI = async (postId) => {
  return await authorizedAxiosInstance.delete(`${BASE_URL}/post/${postId}`);
};

export const updatePostAPI = async (postId, data) => {
  console.log(data);
  return await authorizedAxiosInstance.put(`${BASE_URL}/post/${postId}`, data);
};

export const bookmarkAPI = async (postId) => {
  return await authorizedAxiosInstance.get(
    `${BASE_URL}/post/${postId}/bookmark`
  );
};

export const fetchAllPostsAPI = async (page = 1, limit = 4) => {
  return await authorizedAxiosInstance.get(
    `${BASE_URL}/post/all?sortBy=createdAt:desc&limit=${limit}&page=${page}`
  );
};

export const getPostById = async (postId) => {
  return await authorizedAxiosInstance.get(
    `${BASE_URL}/post/${postId}/getpostbyid`
  );
};

export const addPostsAPI = async (formData) => {
  return await authorizedAxiosInstance.post(
    `${BASE_URL}/post/addpost`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
};

// Adoption post

export const addAdoptPostsAPI = async (formData) => {
  return await authorizedAxiosInstance.post(
    `${BASE_URL}/adoption-post/`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
};

export const fetchAllAdoptionPostsAPI = async (
  page,
  limit=5,
  sortBy = "createdAt:desc",
  adoptStatus = null
) => {
  let url = `${BASE_URL}/adoption-post/all?limit=${limit}&page=${page}&sortBy=${sortBy}`;
  if (adoptStatus) {
    url += `&adopt_status=${adoptStatus}`;
  }

  return await authorizedAxiosInstance.get(url);
};

export const updateAdoptPostsAPI = async (postId, formData) => {
  return await authorizedAxiosInstance.put(
    `${BASE_URL}/adoption-post/${postId}`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
};

export const addAdoptionForm = async (formData) => {
  const response = await authorizedAxiosInstance.post(
    `${BASE_URL}/adoption-form/create`,
    formData
  );
  console.log("addAdoptionForm response:", response);
  return response;
};

export const fetchAllAdoptionFormsAPI = async (
  page,
  limit,
  sortBy = "createdAt:desc",
  status = null
) => {
  let url = `${BASE_URL}/adoption-form/all?limit=${limit}&page=${page}&sortBy=${sortBy}`;
  if (status) {
    url += `&status=${status}`;
  }

  return await authorizedAxiosInstance.get(url);
};

export const fetchAllAdoptionPostsByBreedAPI = async (page, breed) => {
  const response = await authorizedAxiosInstance.get(
    `${BASE_URL}/adoption-post/breed/${breed}?limit=4&page=${page}`
  );
  console.log("response", response);
  return response;
};


export const updateAdoptionFormStatusAPI = async (formId, status) => {
  const response = await authorizedAxiosInstance.put(`${BASE_URL}/adoption-form/form/${formId}`, {
    status,
  });
  return response;
};

export const addPeriodicCheckAPI = async (adoptionFormId, checkData) => {
  try {
    console.log('Sending periodic check data:', {
      adoptionFormId,
      formDataEntries: Array.from(checkData.entries()),
    });
    
    const response = await authorizedAxiosInstance.post(
      `${BASE_URL}/adoption-form/check`,
      checkData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    
    console.log('Periodic check response:', response);
    return response;
  } catch (error) {
    console.error('Error in addPeriodicCheckAPI:', error.response || error);
    throw error;
  }
};

