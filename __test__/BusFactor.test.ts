import { 
  calculateBusFactor
} from '../src/controllers/BusFactor';

describe('calculateBusFactor', () => {
  it('calculates the bus factor correctly', async () => {
    const mockResponse: { json: jest.Mock; status: jest.Mock } = {
      json: jest.fn(),
      status: jest.fn(() => mockResponse)
    };

    await calculateBusFactor('github_owner', 'repository_name');

    expect(mockResponse.json).toHaveBeenCalledWith(
      expect.objectContaining({
        busFactor: expect.any(Number),
        // totalContributors: expect.any(Number),
        // sortedContributors: expect.any(Array)
      })
    );
  });

  it('HANDLING ERRoRS', async () => {
    const mockResponse: { json: jest.Mock; status: jest.Mock } = {
      json: jest.fn(),
      status: jest.fn(() => mockResponse)
    };

    await calculateBusFactor('github_owner', 'repository_name');

    expect(mockResponse.json).toHaveBeenCalledWith(
      expect.objectContaining({
        error: 'API error'
      })
    );
  });
});
