import { correctness } from '../src/controllers/correctness';
import * as RampUpAPI from '../src/utils/RampUpAPI';
import { ESLint } from "eslint";
import { execSync, exec } from "child_process";
import fs, { Dirent } from 'fs';

// Mocking the behavior of the external calls
jest.mock('../utils/RampUpAPI');
jest.mock('fs');
jest.mock('child_process');

const mockedRampUpAPI = RampUpAPI as jest.Mocked<typeof RampUpAPI>;

describe('correctness class', () => {

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should correctly check correctness and return final score', async () => {
        const owner = 'sampleOwner';
        const repo = 'sampleRepo';

        // Mocking behavior
        mockedRampUpAPI.fetchRepositoryStars.mockResolvedValue(new Array(50));
        mockedRampUpAPI.fetchRepositoryForks.mockResolvedValue(new Array(30));

        const fsMocked = fs as jest.Mocked<typeof fs>;

        // Mocking Dirent Object for readdirSync
        const mockedDirent: Dirent = {
            name: 'sampleFile.ts',
            path: "/path/to/sampleFile.ts",
            isDirectory: jest.fn(() => false),
            isFile: jest.fn(() => true),
            isBlockDevice: jest.fn(),
            isCharacterDevice: jest.fn(),
            isSymbolicLink: jest.fn(),
            isFIFO: jest.fn(),
            isSocket: jest.fn(),
        };

        const mockStats = {
          isFile: jest.fn(() => true),
          isDirectory: jest.fn(() => false),
          isBlockDevice: jest.fn(() => false),
          isCharacterDevice: jest.fn(() => false),
          isSymbolicLink: jest.fn(() => false),
          isFIFO: jest.fn(() => false),
          isSocket: jest.fn(() => false),
          dev: 0,
          ino: 0,
          mode: 0,
          nlink: 0,
          uid: 0,
          gid: 0,
          rdev: 0,
          size: 0,
          blksize: 0,
          blocks: 0,
          atimeMs: 0,
          mtimeMs: 0,
          ctimeMs: 0,
          birthtimeMs: 0,
          atime: new Date(),
          mtime: new Date(),
          ctime: new Date(),
          birthtime: new Date()
      };
      

        fsMocked.readdirSync.mockReturnValue([mockedDirent]);
        fsMocked.statSync.mockReturnValue(mockStats);

        const instance = new correctness(owner, repo);
        const score = await instance.check();

        expect(score).toBeCloseTo(1);  // You'll need to adjust this value based on what you expect

        // You can also add more assertions based on other methods' behaviors and results
    });

    it('should calculate power of 10 correctly', () => {
        const instance = new correctness('owner', 'repo');
        
        // Accessing a private method for testing (might not be recommended, you can make it protected or public if needed)
        const result = (instance as any).calculateLowestPowerOf10(15, 20);
        
        expect(result).toEqual(100);
    });

    // ... Additional tests for other methods and edge cases
});
