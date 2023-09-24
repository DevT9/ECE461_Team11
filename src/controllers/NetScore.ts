import { correctness } from "../src/controllers/correctness";
import { getAllRepoCommits, getAllPullRequests, getAllClosedIssues, calculateBusFactor } from "../src/controllers/BusFactor";
import { calculateRampUp } from "../src/controllers/RampUp";
import { Responsiveness } from "../src/controllers/Responsiveness";
import { License } from "../src/controllers/License";

export class NetScore {
    constructor(private owner: string, private repo: string) {
    });
    calculate(): number {
        const correctnessobj = correctness(this.owner, this.repo);
        const correctnessScore = await correctnessobj.check();
        const busFactorScore = calculateBusFactor(getAllRepoCommits(), getAllPullRequests(), getAllClosedIssues());
        const rampUpScore = calculateRampUp(this.owner, this.repo);
        
        const responsivenessScore = Responsiveness.calculate(this.owner, this.repo);
        const licenseScore = License.calculate();

        return correctnessScore + busFactorScore + rampUpScore + responsivenessScore + licenseScore;
    }
}

export class ScoreCalculator {
    calculate(): number {
        const netScore = new NetScore();
        const score = netScore.calculate();
        return score;
    }
}
