import { NET_SCORE } from '../src/controllers/NetScore';
import { calculateRampUp } from '../src/controllers/RampUp';

// Mocked implementations
jest.mock('../src/controllers/correctness', () => {
  return {
    correctness: jest.fn().mockImplementation(() => {
      return {
        check: jest.fn().mockResolvedValue(0.8),
      };
    }),
  };
});

jest.mock('../src/controllers/BusFactor', () => {
  return jest.fn().mockResolvedValue(0.9);
});

jest.mock('../src/controllers/RampUp', () => {
  return {
    calculateRampUp: jest.fn().mockResolvedValue(0.7)
  };
});

jest.mock('../src/controllers/Responsiveness', () => {
  return jest.fn().mockReturnValue(0.85);
});

jest.mock('../src/controllers/License', () => {
  return jest.fn().mockReturnValue(0.95);
});

describe('NET_SCORE', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should calculate NET_SCORE correctly', async () => {
    const netscore = new NET_SCORE('sampleOwner', 'sampleRepo');
    const result = await netscore.calculate();

    // Validate the individual scores based on the mocked values
    expect(result.CORRECTNESS_SCORE).toBeCloseTo(0.8);
    expect(result.BUS_FACTOR_SCORE).toBeCloseTo(0.9);
    expect(result.RAMP_UP_SCORE).toBeCloseTo(0.7);
    expect(result.RESPONSIVE_MAINTAINER_SCORE).toBeCloseTo(0.85);
    expect(result.LICENSE_SCORE).toBeCloseTo(0.95);

    // Validate the overall NET_SCORE
    const expectedNetScore = (0.8 * 0.25 + 0.9 * 0.15 + 0.7 * 0.25 + 0.85 * 0.3 + 0.95 * 0.05);
    expect(result.NET_SCORE).toBeCloseTo(expectedNetScore);
  });
});
