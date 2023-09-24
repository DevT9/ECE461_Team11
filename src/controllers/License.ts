import { MetricParent } from '../helpers/MetricParent';
import axios from 'axios';

export class License extends MetricParent {
  private repoOwner: string;
  private repoName: string;
  private licenseName: string = '';

  constructor(someSharedProperty: string, repoOwner: string, repoName: string) {
    super(someSharedProperty, 'License Scorer', 'kim3574');
    this.repoOwner = repoOwner;
    this.repoName = repoName;
  }

  async fetchData(): Promise<any> {
    const url = `https://api.github.com/repos/${this.repoOwner}/${this.repoName}/license`;
    try {
      const response = await axios.get(url);
      this.licenseName = response.data.license.spdx_id;
      return Promise.resolve('Fetched license data successfully');
    } catch (error) {
      console.error('Error fetching license data:', error);
      return Promise.reject(error);
    }
  }

  calculateMetric(): number {
    switch (this.licenseName) {
      case 'MIT':
      case 'Apache-2.0':
      case 'BSD-2-Clause':
      case 'BSD-3-Clause':
        return 10;
      case 'GPL-3.0':
      case 'LGPL-3.0':
        return 7;
      case 'NOASSERTION':
      case 'UNKNOWN':
        return 3;
      default:
        return 1;
    }
  }
}
