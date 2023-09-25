import { correctness } from "./correctness";
import { calculateBusFactor } from "./BusFactor";
import { calculateRampUp } from "./RampUp";
import { Responsiveness } from "./Responsiveness";
import { License } from "./License";

export class NetScore {
    constructor(private owner: string, private repo: string) {
    };
    async calculate(): Promise<{correctnessScore: number, busFactorScore: number, rampUpScore: number, responsivenessScore: number, licenseScore: number, netScore: number}> {
        console.log("HERE");
        const correctnessobj = new correctness(this.owner, this.repo);
        console.log("correctness", correctnessobj);
        let correctnessScore = 0;
        try {
            correctnessScore = await correctnessobj.check();
            console.log("correctnessScore", correctnessScore);
        } catch(e) {
            console.log("Error", e);
        }
        let busFactorScore = 0;
        try {
            busFactorScore = await calculateBusFactor(this.owner, this.repo);
            console.log("BusFactor", busFactorScore);
        } catch(e) {
            console.log("Error", e);
        }
        const rampUpScore = await calculateRampUp(this.owner, this.repo);
        console.log("rampUpScore", rampUpScore);
        const responsiveness = new Responsiveness('someSharedProperty', this.owner, this.repo);
        console.log("Responsiveness", responsiveness);
        const res = await responsiveness.fetchData();
        console.log("RES", res);
        const responsivenessScore = responsiveness.calculateMetric();
        console.log("RESPONSIVENESSSCORE", responsivenessScore);
        const license = new License('someSharedProperty', this.owner, this.repo);
        const licenseScore = license.calculateMetric();
        console.log("licenseScore", licenseScore);
        const netScore = (correctnessScore * 0.25 + busFactorScore * 0.15 + rampUpScore * 0.25 + responsivenessScore * 0.3 + licenseScore * 0.05);
        console.log("netscore", netScore);
        return {correctnessScore, busFactorScore, rampUpScore, responsivenessScore, licenseScore, netScore};
    }
}
