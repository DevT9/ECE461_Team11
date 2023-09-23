import {
  fetchRepositoryContributors,
  fetchRepositoryStars,
  fetchRepositoryForks,
  fetchFirstCommitTime
} from '../utils/RampUpAPI';
import { Request, Response, NextFunction } from 'express';

export const calculateRampUp = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { owner, repo } = req.query as { owner: string; repo: string };

  try {
    // Fetch data from GitHub API
    const contributors = await fetchRepositoryContributors(owner, repo);
    const stars = await fetchRepositoryStars(owner, repo);
    const forks = await fetchRepositoryForks(owner, repo);
    const firstCommitTime = await fetchFirstCommitTime(owner, repo);

    const weights = {
      Contributors: 0.3,
      Stars: 0.2,
      Forks: 0.2,
      FirstCommit: 0.3
    };

    // Calculate the ramp-up score
    let rampUpScore =
      weights.Contributors * contributors.length +
      weights.Stars * stars.length +
      weights.Forks * forks.length;

    if (firstCommitTime) {
      // Calculate the time difference for the first commit in milliseconds
      const currentTime = new Date().getTime();
      const firstCommitTimestamp = new Date(firstCommitTime).getTime();
      const timeDifference = currentTime - firstCommitTimestamp;

      // Normalize the time difference (0 to 1) and add it to the ramp-up score
      const maxTimeDifference = 365 * 24 * 60 * 60 * 1000; // Max time difference set to 1 year
      const normalizedTimeDifference = Math.min(
        timeDifference / maxTimeDifference,
        1
      );
      rampUpScore += weights.FirstCommit * normalizedTimeDifference;
    }

    console.log('Ramp-Up Score:', rampUpScore);
    res.json({ rampUpScore });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Internal Server Error');
  }
};
