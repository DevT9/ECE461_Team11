import { execSync } from 'child_process';
import fs from 'fs';

class PackageClassifier {
    urls: string[];
    private gitPattern: RegExp;

    constructor(file: string) {
        this.urls = fs.readFileSync(file, 'utf-8').split('\n').filter(Boolean); // Added filter(Boolean) to remove empty lines
        // eslint-disable-next-line no-useless-escape
        this.gitPattern = new RegExp("https://github.com/[\w-]+/[\w-]+|git\+https://github.com/[\w-]+/[\w-]+\.git|git\+ssh://git@github.com/[\w-]+/[\w-]+\.git");
    }

    classifyUrls(): { gitUrls: string[], npmPackageUrls: string[] } {
        const gitUrls: string[] = [];
        const npmPackageUrls: string[] = [];

        for (const url of this.urls) {
            if (url.startsWith('git@') || url.startsWith('https://github.com/')) {
                if (this.gitPattern.test(url)) {
                    gitUrls.push(url);
                }
            } else if (url.startsWith('https://www.npmjs.com/package/')) {
                const packageName = url.split('/').pop();
                if (packageName) {
                    const repoUrl = this.getNpmPackageRepoUrl(packageName);
                    if (repoUrl) {
                        gitUrls.push(repoUrl);
                    }
                    npmPackageUrls.push(url);
                }
            }
        }
        return { gitUrls, npmPackageUrls };
    }

    private getNpmPackageRepoUrl(packageName: string): string | null {
        try {
            const output = execSync(`npm view ${packageName} repository.url`, { encoding: 'utf-8' });
            return output.trim();
        } catch (error) {
            console.error(`Error getting repository URL for package ${packageName}: ${error.message}`);
            return null;
        }
    }

}

const classifier = new PackageClassifier('test.txt');
const { gitUrls, npmPackageUrls } = classifier.classifyUrls();
console.log(`Git URLs: ${gitUrls}`);
console.log(`NPM Package URLs: ${npmPackageUrls}`);
