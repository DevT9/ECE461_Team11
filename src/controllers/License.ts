//src/controllers/Linces.ts

import { MetricParent } from '../helpers/MetricParent';
import axios from 'axios';

export class License extends MetricParent {
  private repoOwner: string;
  private repoName: string;
  private licenseDescription: string = '';

  constructor(someSharedProperty: string, repoOwner: string, repoName: string) {
    super(someSharedProperty, 'License Scorer', 'kim3574');
    this.repoOwner = repoOwner;
    this.repoName = repoName;
  }

  async fetchData(): Promise<any> {
    const url = `https://raw.githubusercontent.com/${this.repoOwner}/${this.repoName}/master/README.md`;
    try {
        const response = await axios.get(url);
        
        // Check if response or response.data is null or undefined
        if (!response || !response.data) {
            return Promise.reject(new Error('No response or data from the server'));
        }

        const readmeContent = response.data;

        // Use regex to extract license description from README
        const licenseRegex = /##\s*License\s*([\s\S]*?)(##|$)/i;
        const match = licenseRegex.exec(readmeContent);
        if (match && match[1]) {
            this.licenseDescription = match[1].trim();
        }

        return Promise.resolve('Fetched license data from README successfully');
    } catch (error) {
        //console.error('Error fetching README data:', error);
        return Promise.reject(error);
    }
}



  

  calculateMetric(): number {
    if (this.licenseDescription.includes('LGPLv2.1')) {
      return 10; 
    } else {
      return 1;
    }
  }
}
