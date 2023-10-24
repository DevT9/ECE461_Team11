import { getRequest } from '../utils/api.utils';
import axios from 'axios';

export const calculateBusFactor = async (owner: string, repo: string) => {
  interface Branch {
    name: string;
    url: string;
  }

  const getAllRepoBranches = async (owner: string, repo: string) => {
    try {
      const response = await getRequest(`/repos/${owner}/${repo}/branches?state=closed`);
      return parseBranchData(response);
    } catch (error: unknown) {
      return null;
    }
  };

  const parseBranchData = (branches: { name: string, commit: { url: string } }[]): Branch[] => {
    return branches.map((branch) => ({
      name: branch.name,
      url: branch.commit.url
    }));
  };

  const getAllRepoCommits = async (): Promise<Map<string, number> | null> => {
    const branches = await getAllRepoBranches(owner, repo);
    if (!branches) {
      return null;
    }
      
    const commitCounts: Map<string, number> = new Map();
    for (const branchUrl of branches) {
      try {
        const response = await axios.get(branchUrl.url);
        const author = response.data?.user?.login;
        if (author) {
          commitCounts.set(author, (commitCounts.get(author) || 0) + 1);
        }
      } catch (error: unknown) {
        return null;
      }
    }
    return commitCounts;
  };

  const getAllPullRequests = async (owner: string, repo: string) => {
    const response = await getRequest(`/repos/${owner}/${repo}/pulls?state=closed`);
    const pullRequests = response || [];
    const contributors: Map<string, number> = new Map();
  
    pullRequests.forEach((pr: { user: { login: string } }) => {
      const author = pr.user.login;
      contributors.set(author, (contributors.get(author) || 0) + 1);
    });
  
    return contributors;
  };
  
  const getAllClosedIssues = async (owner: string, repo: string) => {
    const response = await getRequest(`/repos/${owner}/${repo}/issues?state=closed`);
    const issues = response || [];
    const contributors: Map<string, number> = new Map();
  
    issues.forEach((issue: { user: { login: string } }) => {
      const author = issue.user.login;
      contributors.set(author, (contributors.get(author) || 0) + 1);
    });
  
    return contributors;
  };

  const allContributors: Map<string, { commits: number; prs: number; issues: number }> = new Map();

  const commitContributors = await getAllRepoCommits();
  commitContributors?.forEach((count, author) => {
    const current = allContributors.get(author) || { commits: 0, prs: 0, issues: 0 };
    allContributors.set(author, { ...current, commits: count });
  });

  const prContributors = await getAllPullRequests(owner, repo);
  prContributors.forEach((count, author) => {
    const current = allContributors.get(author) || { commits: 0, prs: 0, issues: 0 };
    allContributors.set(author, { ...current, prs: count });
  });

  const issueContributors = await getAllClosedIssues(owner, repo);
  issueContributors.forEach((count, author) => {
    const current = allContributors.get(author) || { commits: 0, prs: 0, issues: 0 };
    allContributors.set(author, { ...current, issues: count });
  });

  let totalContributions = 0;
  allContributors.forEach((contribution) => {
    totalContributions += contribution.commits + contribution.prs + contribution.issues;
  });

  let busFactor = 0;
  let runningTotal = 0;
  const sortedContributors = Array.from(allContributors.entries()).sort(
    (a, b) => {
      return (
        b[1].commits + b[1].prs + b[1].issues - 
        (a[1].commits + a[1].prs + a[1].issues)
      );
    }
  );

  for (const [, contributions] of sortedContributors) {
    runningTotal += contributions.commits + contributions.prs + contributions.issues;
    busFactor++;
    if (runningTotal / totalContributions > 0.5) {
      break;
    }
  }

  return busFactor;
};


