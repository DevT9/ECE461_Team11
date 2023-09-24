import { correctness } from "./correctness";
import { calculateBusFactor } from "./BusFactor";
import { calculateRampUp } from "./RampUp";
import { Responsiveness } from "./Responsiveness";
import { License } from "./License";

export class NetScore {
    constructor(private owner: string, private repo: string) {
    };
    async calculate(): Promise<{correctnessScore: number, busFactorScore: number, rampUpScore: number, responsivenessScore: number, licenseScore: number, netScore: number}> {
        const correctnessobj = new correctness(this.owner, this.repo);
        const correctnessScore = await correctnessobj.check();
        const busFactorScore = await calculateBusFactor(this.owner, this.repo);
        const rampUpScore = await calculateRampUp(this.owner, this.repo);
        const responsiveness = new Responsiveness('someSharedProperty', this.owner, this.repo);
        await responsiveness.fetchData();
        const responsivenessScore = responsiveness.calculateMetric();
        const license = new License('someSharedProperty', this.owner, this.repo);
        const licenseScore = license.calculateMetric();
        const netScore = (correctnessScore * 0.25 + busFactorScore * 0.15 + rampUpScore * 0.25 + responsivenessScore * 0.3 + licenseScore * 0.05);
        return {correctnessScore, busFactorScore, rampUpScore, responsivenessScore, licenseScore, netScore};
    }
}
