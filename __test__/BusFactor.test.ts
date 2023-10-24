import { calculateBusFactor } from '../src/controllers/BusFactor'; // Change to your actual path
import * as apiUtils from '../src/utils/api.utils';
import axios from 'axios';

jest.mock('../src/utils/api.utils');
jest.mock('axios');

const mockedApiUtils = apiUtils as jest.Mocked<typeof apiUtils>;
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('calculateBusFactor', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should calculate the bus factor correctly', async () => {
    // Mocked data
    mockedApiUtils.getRequest.mockImplementation((url: string) => {
      if (url.includes('branches')) {
        return Promise.resolve([{ name: 'branch1', commit: { url: 'mocked_url' } }]);
      } else if (url.includes('pulls')) {
        return Promise.resolve([{ user: { login: 'user1' } }]);
      } else if (url.includes('issues')) {
        return Promise.resolve([{ user: { login: 'user1' } }]);
      }
      return Promise.resolve([]);
    });

    mockedAxios.get.mockResolvedValue({ data: { user: { login: 'user1' } } });

    const busFactor = await calculateBusFactor('sampleOwner', 'sampleRepo');
    expect(busFactor).toBe(1); // Adjust as per your understanding of the calculation
  });

  it('should handle errors and throw', async () => {
    mockedApiUtils.getRequest.mockRejectedValue(new Error('API Error'));
  
    await expect(calculateBusFactor('sampleOwner', 'sampleRepo')).rejects.toThrow('API Error');
  });
  

  // ... you can add more test cases for different scenarios.
});
