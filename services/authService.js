import api from '../lib/axios';

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
