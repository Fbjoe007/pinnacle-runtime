import { SummaryInput, ExecutiveSummary } from "./summary.types.js";

export class SummaryEngine {
  public generateSummary(input: SummaryInput): ExecutiveSummary {
    const { assessment, businessName } = input;
    const { score, rating, findings } = assessment;

    let headline = "";
    let criticalImpact = "";
    let recommendedAction = "";

    if (rating === "HEALTHY") {
      headline = "Identity and digital footprint for " + businessName + " are secure and verified.";
      criticalImpact = "The organization demonstrates solid operational practices across core infrastructure, web reachability, and corporate profile parameters.";
      recommendedAction = "Maintain active oversight schedules. No critical remediations required at this junction.";
    } else if (rating === "CAUTION") {
      headline = "Operational infrastructure concerns detected for " + businessName + ".";
      criticalImpact = "Minor gaps or warnings exist within the digital perimeter. Total vulnerability metrics accumulated an adjusted risk score of " + score + ".";
      recommendedAction = "Remediate operational issues immediately. Address the following items: " + findings.map(f => f.reason).join("; ");
    } else {
      headline = "High risk profile identified for " + businessName + "!";
      criticalImpact = "Severe security, connection, or operational profile failures present. Core parameters dropped trust thresholds down to a risk score of " + score + ".";
      recommendedAction = "Halt operational interactions until critical validation failures are fully investigated: " + findings.map(f => f.reason).join("; ");
    }

    return {
      headline,
      criticalImpact,
      recommendedAction,
      generatedAt: new Date().toISOString()
    };
  }
}