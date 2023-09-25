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
