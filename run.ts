/* eslint-disable @typescript-eslint/no-var-requires */
import { execSync } from 'child_process';

class PackageClassifier {
    urls: string[];

    constructor(file: string) {
        // Read the file and store each line as a URL in the urls array
        const fs = require('fs');
        this.urls = fs.readFileSync(file, 'utf-8').split('\n');
    }

    classifyUrls(): { gitUrls: string[], npmPackageUrls: string[] } {
        const gitUrls: string[] = [];
        const npmPackageUrls: string[] = [];

        for (const url of this.urls) {
            if (url.startsWith('git@') || url.startsWith('https://github.com/')) {
                gitUrls.push(url);
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