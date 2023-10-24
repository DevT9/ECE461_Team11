import { calculateRampUp } from '../src/controllers/RampUp';
import * as rampUpAPI from '../src/utils/RampUpAPI';

// Mocking the behavior of the external calls to the API
jest.mock('../src/utils/RampUpAPI');

const mockedRampUpAPI = rampUpAPI as jest.Mocked<typeof rampUpAPI>;

describe('calculateRampUp', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should calculate the ramp-up score correctly', async () => {
    mockedRampUpAPI.fetchRepositoryContributors.mockResolvedValue(new Array(5));
    mockedRampUpAPI.fetchRepositoryStars.mockResolvedValue(new Array(10));
    mockedRampUpAPI.fetchRepositoryForks.mockResolvedValue(new Array(3));
    mockedRampUpAPI.fetchFirstCommitTime.mockResolvedValue(new Date(Date.now() - (180 * 24 * 60 * 60 * 1000)).toISOString());

    const score = await calculateRampUp('sampleOwner', 'sampleRepo');
    expect(score).toBeCloseTo(0.625);

    expect(mockedRampUpAPI.fetchRepositoryContributors).toHaveBeenCalledWith('sampleOwner', 'sampleRepo');
    expect(mockedRampUpAPI.fetchRepositoryStars).toHaveBeenCalledWith('sampleOwner', 'sampleRepo');
    expect(mockedRampUpAPI.fetchRepositoryForks).toHaveBeenCalledWith('sampleOwner', 'sampleRepo');
    expect(mockedRampUpAPI.fetchFirstCommitTime).toHaveBeenCalledWith('sampleOwner', 'sampleRepo');
  });

  it('should handle errors and return 0', async () => {
    mockedRampUpAPI.fetchRepositoryContributors.mockImplementationOnce(() => {
      return Promise.reject(new Error('API Error'));
    });

    const score = await calculateRampUp('sampleOwner', 'sampleRepo');
    expect(score).toEqual(0);
  });

  // ... additional tests ...
});
