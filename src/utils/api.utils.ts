/* eslint-disable no-useless-catch */
import axios from 'axios';
// import { newToken } from '../index';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getRequest = async (endpoint: string, params?: any) => {
  //console.log(newToken);
  const url = `https://api.github.com${endpoint}`;
  const token = `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`;
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
    //console.error('Error making GET request:', error);
    throw error;
  }
};
