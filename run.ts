import { readFileSync, existsSync } from 'fs';
import { execSync } from 'child_process';
import { NetScore } from './src/controllers/NetScore';
import ndjson from 'ndjson';

class PackageClassifier {
  urls: string[];

  constructor(file: string) {
    if (!existsSync(file)) {
      throw new Error('ERORR!!');
    }
    this.urls = readFileSync(file, 'utf-8').split('\n').filter(Boolean);
  }

  classifyUrls(): { gitUrls: string[]; npmPackageUrls: string[] } {
    const gitUrls: string[] = [];
    const npmPackageUrls: string[] = [];

    for (const url of this.urls) {
      if (
        url.startsWith('https://github.com/') ||
        url.startsWith('git+https://github.com/') ||
        url.startsWith('git+ssh://git@github.com/') ||
        url.startsWith('ssh://git@github.com/')
      ) {
        let cleanUrl = url
          .replace('git+', '')
          .replace('git+ssh://', '')
          .replace('ssh://', '');
        gitUrls.push(cleanUrl);
      } else if (url.startsWith('https://www.npmjs.com/package/')) {
        npmPackageUrls.push(url);
        const packageName = url.split('/').pop();
        if (packageName) {
          const repoUrl = this.getNpmPackageRepoUrl(packageName);
          if (repoUrl) {
            let cleanRepoUrl = repoUrl
              .replace('git+', '')
              .replace('git+ssh://', '')
              .replace('ssh://', '');
            gitUrls.push(cleanRepoUrl);
          }
        }
      }
    }

    return { gitUrls, npmPackageUrls };
  }

  private getNpmPackageRepoUrl(packageName: string): string | null {
    try {
      const output = execSync(`npm view ${packageName} repository.url`, {
        encoding: 'utf-8'
      });
      return output.trim();
    } catch (error) {
      console.error(
        `Error getting repository URL for package ${packageName}: ${error.message}`
      );
      return null;
    }
  }
}

const classifier = new PackageClassifier('test.txt');
const { gitUrls, npmPackageUrls } = classifier.classifyUrls();
console.log('Git URLs:');

const results: any[] = [];

for (const url of gitUrls) {
  const temp = url.match(/github\.com\/([^\/]+)\/([^\/]+)/);
  if (temp) {
    const owner = temp[1];
    let repo = temp[2];
    repo = repo.replace(/\.git$/, '');
    const NScore = new NetScore(owner, repo);
    const scoreResults = await NScore.calculate();
    results.push(scoreResults);
    process.stdout.write(ndjson.stringify(scoreResults));
  }
}

console.log(`Git URLs: ${gitUrls.join(', ')}`);
console.log(`NPM Package URLs: ${npmPackageUrls.join(', ')}`);
