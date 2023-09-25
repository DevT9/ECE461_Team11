import axios from 'axios';

export const getRequest = async (endpoint: string, params?: any) => {
  const url = `https://api.github.com${endpoint}`;
  const token = "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";
  if (!token) {
    throw new Error('No bearer token found');
  }
  try {
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`
      },
      params: params
    });
    return response.data;
  } catch (error) {
    console.error('Error making GET request:', error);
    throw error;
  }
};
