import api from '../lib/axios';

const getToken = () => localStorage.getItem('token');
// Register store owner
export const registerStoreOwner = async (payload) => {
    try {
      const res = await api.post('user_auth/register-store/', payload, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return res.data;
    } catch (error) {
      console.error('Registration failed', error.response || error);
      throw new Error(error.response?.data?.message || 'Something went wrong');
    }
  };

// Register customer
export const registerCustomer = async (payload) => {
  const res = await api.post('user_auth/register-customer/', payload);
  return res.data;
};

// Login user
export const loginUser = async (payload) => {
  const res = await api.post('user_auth/login_user/', payload);
  return res.data;
};

export const getData = async (endpoint) => {
  try {
    const token = getToken();
    const response = await api.get(endpoint, {
      headers: {
        Authorization: `Bearer ${token}`, // Hapus Content-Type
      },
    });
    return response.data;
  } catch (error) {
    console.error('GET Error:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Gagal mengambil data');
  }
};

// Fungsi POST dengan token
export const postData = async (endpoint, payload, config = {}) => {
  try {
    const token = getToken();
    
    // Check if payload is FormData (i.e. for file uploads)
    const isFormData = payload instanceof FormData;

    const response = await api.post(endpoint, payload, {
      ...config,
      headers: {
        ...(config.headers || {}),
        Authorization: `Bearer ${token}`,
        // Adjust Content-Type based on payload type
        ...(isFormData ? {} : { 'Content-Type': 'application/json' }), 
      },
    });
    return response.data;
  } catch (error) {
    console.error('POST Error:', error);
    throw new Error(error.response?.data?.message || 'Gagal mengirim data');
  }
};

// Fungsi PUT dengan token
export const putData = async (endpoint, payload, config = {}) => {
  try {
    const token = getToken();

    const isFormData = payload instanceof FormData;

    const response = await api.put(endpoint, payload, {
      ...config,
      headers: {
        ...(config.headers || {}),
        Authorization: `Bearer ${token}`,
        ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
      },
    });
    return response.data;
  } catch (error) {
    console.error('PUT Error:', error);
    throw new Error(error.response?.data?.message || 'Gagal mengupdate data');
  }
};

// Fungsi DELETE dengan token
export const deleteData = async (endpoint) => {
  try {
    const token = getToken();
    const response = await api.delete(endpoint, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('DELETE Error:', error);
    throw new Error(error.response?.data?.message || 'Gagal menghapus data');
  }
};