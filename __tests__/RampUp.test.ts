import { calculateRampUp } from '../src/controllers/RampUp';

jest.mock('../src/utils/RampUpAPI', () => ({
  fetchRepositoryContributors: jest.fn(() => Promise.resolve([])),
  fetchRepositoryStars: jest.fn(() => Promise.resolve([])),
  fetchRepositoryForks: jest.fn(() => Promise.resolve([])),
  fetchFirstCommitTime: jest.fn(() => Promise.resolve('2023-09-20T12:00:00Z')),
}));

describe('calculateRampUp', () => {
  it('calculates the ramp-up score correctly', async () => {
    const mockResponse: any = {
      json: jest.fn(),
      status: jest.fn(() => mockResponse),
      send: jest.fn(),
    };

    const {
      fetchRepositoryContributors,
      fetchRepositoryStars,
      fetchRepositoryForks,
      fetchFirstCommitTime,
    } = require('../src/utils/RampUpAPI');
    await calculateRampUp(
      { query: { owner: 'github_owner', repo: 'repository_name' } } as any,
      mockResponse as any,
      {} as any
    );
    expect(fetchRepositoryContributors).toHaveBeenCalledWith('github_owner', 'repository_name');
    expect(fetchRepositoryStars).toHaveBeenCalledWith('github_owner', 'repository_name');
    expect(fetchRepositoryForks).toHaveBeenCalledWith('github_owner', 'repository_name');
    expect(fetchFirstCommitTime).toHaveBeenCalledWith('github_owner', 'repository_name');
    expect(mockResponse.json).toHaveBeenCalledWith({ rampUpScore: expect.any(Number) });
  });
});
