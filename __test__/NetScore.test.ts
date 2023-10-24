import { NET_SCORE } from '../src/controllers/NetScore';
import { correctness } from '../src/controllers/correctness';
import { calculateBusFactor } from '../src/controllers/BusFactor';
import { calculateRampUp } from '../src/controllers/RampUp';
import { Responsiveness } from '../src/controllers/Responsiveness';
import { License } from '../src/controllers/License';

jest.mock('../src/controllers/correctness');
jest.mock('../src/controllers/BusFactor');
jest.mock('../src/controllers/RampUp');
jest.mock('../src/controllers/Responsiveness');
jest.mock('../src/controllers/License');

const mockedCorrectness = correctness as jest.MockedClass<typeof correctness>;
const mockedCalculateBusFactor = calculateBusFactor as jest.MockedFunction<typeof calculateBusFactor>;
const mockedCalculateRampUp = calculateRampUp as jest.MockedFunction<typeof calculateRampUp>;
const mockedResponsiveness = Responsiveness as jest.MockedClass<typeof Responsiveness>;
const mockedLicense = License as jest.MockedClass<typeof License>;

describe('NET_SCORE', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should calculate NET_SCORE correctly', async () => {
    // Mock behavior of the individual score calculations
    const mockCorrectnessInstance = {
      check: jest.fn().mockResolvedValue(0.8)
    };
    mockedCorrectness.mockImplementation(() => mockCorrectnessInstance);

    mockedCalculateBusFactor.mockResolvedValue(0.9);
    mockedCalculateRampUp.mockResolvedValue(0.7);

    const mockResponsivenessInstance = {
      calculateMetric: jest.fn().mockReturnValue(0.85)
    };
    mockedResponsiveness.mockImplementation(() => mockResponsivenessInstance);

    const mockLicenseInstance = {
      calculateMetric: jest.fn().mockReturnValue(0.95)
    };
    mockedLicense.mockImplementation(() => mockLicenseInstance);

    const netscore = new NET_SCORE('sampleOwner', 'sampleRepo');
    const result = await netscore.calculate();

    // Validate scores based on the mocked values
    expect(result.CORRECTNESS_SCORE).toBeCloseTo(0.8);
    expect(result.BUS_FACTOR_SCORE).toBeCloseTo(0.9);
    expect(result.RAMP_UP_SCORE).toBeCloseTo(0.7);
    expect(result.RESPONSIVE_MAINTAINER_SCORE).toBeCloseTo(0.85);
    expect(result.LICENSE_SCORE).toBeCloseTo(0.95);

    // Validate the overall NET_SCORE
    const expectedNetScore = (0.8 * 0.25 + 0.9 * 0.15 + 0.7 * 0.25 + 0.85 * 0.3 + 0.95 * 0.05);
    expect(result.NET_SCORE).toBeCloseTo(expectedNetScore);
  });

  // ... additional tests such as failure scenarios ...
});
