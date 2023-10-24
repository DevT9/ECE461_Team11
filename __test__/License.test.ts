//__test__/License.test.ts
import { License } from '../src/controllers/License';
import axios from 'axios';
import { mocked } from 'jest-mock';

// Mock the axios.get method
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

const repoOwner = 'kim3574';
const repoName = 'ECE461_Team11';

describe('License Class', () => {
  beforeEach(() => {
    // Reset the mocks before each test
    jest.clearAllMocks();
  });

  it('should fetch data and calculate metric', async () => {
    // Mock API response
    mocked(axios.get).mockResolvedValue({
      data: "## License\n\nLGPLv2.1\n\n## Another Section"
    });

    const license = new License('sharedProperty', repoOwner, repoName);
    await license.fetchData();
    const result = license.calculateMetric();

    expect(result).toBe(10); // LGPLv2.1 license score
  });

  it('should return 1 for calculateMetric when unknown license', async () => {
    mocked(axios.get).mockResolvedValue({
      data: "## License\n\nUNKNOWN\n\n## Another Section"
    });

    const license = new License('sharedProperty', repoOwner, repoName);
    await license.fetchData();
    const result = license.calculateMetric();

    expect(result).toBe(1); // Unknown license score
  });

  it('should handle empty API responses in fetchData', async () => {
    // Mock axios.get response to simulate no data scenario
    mockedAxios.get.mockResolvedValueOnce({ data: null });
  
    const license = new License('sharedProperty', repoOwner, repoName);
  
    // We're expecting fetchData to be rejected with a specific error message
    await expect(license.fetchData()).rejects.toThrow('No response or data from the server');
  });
  


  it('should handle API errors in fetchData', async () => {
    mocked(axios.get).mockRejectedValue(new Error('API Error'));

    const license = new License('sharedProperty', repoOwner, repoName);
    await expect(license.fetchData()).rejects.toThrow('API Error');
  });
});
