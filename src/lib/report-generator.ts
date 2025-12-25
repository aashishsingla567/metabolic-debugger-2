import type {
  FinalReportData,
  ActionPlan,
  ProteinReport,
  SleepData,
  MealTimes,
} from "./types";
import { analyzeSleep } from "./analysis/sleep";
import { analyzeMealTiming } from "./analysis/meal-timing";
import { getProteinRecommendations } from "./analysis/protein";

// Check if a step failed based on the collected data
export function checkStepStatus(
  id: string,
  data: FinalReportData,
): "pass" | "fail" | "unknown" {
  switch (id) {
    case "sleep": {
      const sleepData = data.sleep;
      if (!sleepData) return "unknown";
      const analysis = analyzeSleep(sleepData);
      return analysis.isOptimal ? "pass" : "fail";
    }

    case "meal-timing": {
      const mealData = data["meal-timing"];
      if (!mealData) return "unknown";
      return mealData.analysis.isOptimal && mealData.isDaily ? "pass" : "fail";
    }

    case "protein": {
      const proteinData = data.protein;
      if (!proteinData) return "unknown";
      return proteinData.report.overall.pass ? "pass" : "fail";
    }

    case "order":
    case "hygiene":
    case "movement": {
      const selectData = data[id as keyof FinalReportData] as
        | { value: string }
        | undefined;
      if (!selectData) return "unknown";
      return ["veg", "protein"].includes(selectData.value) ? "pass" : "fail";
    }

    default:
      return "pass";
  }
}

// Generate action plan based on failed steps
export function generateActionPlan(reportData: FinalReportData): ActionPlan[] {
  const actions: ActionPlan[] = [];

  // Sleep optimization
  if (checkStepStatus("sleep", reportData) === "fail") {
    const sleepData = reportData.sleep;
    const duration = sleepData?.duration ?? 0;
    actions.push({
      step: "Sleep",
      title: "Sleep Optimization",
      detail: `You averaged ${duration}h. Target is 7.5h+.`,
      steps: [
        "Set a hard 'Tech Off' time 45 mins before bed.",
        "Use magnesium glycinate before sleep.",
        "Cool your room to 19°C.",
      ],
    });
  }

  // Meal timing optimization
  if (checkStepStatus("meal-timing", reportData) === "fail") {
    const mealTimingData = reportData["meal-timing"];
    const meals = mealTimingData?.meals ?? {
      m1: "08:00",
      m2: "13:00",
      m3: "19:00",
    };
    actions.push({
      step: "Meals",
      title: "Circadian Rhythm",
      detail: "Your eating window is irregular or gaps are suboptimal.",
      steps: [
        `Stick to ${meals.m1}, ${meals.m2}, ${meals.m3} everyday ±30mins.`,
        "Do not snack between these meals.",
        "Finish dinner 3 hours before sleep.",
      ],
    });
  }

  // Protein optimization
  if (checkStepStatus("protein", reportData) === "fail") {
    const proteinData = reportData.protein;
    const diet = proteinData?.report.detected_diet ?? "your diet";
    actions.push({
      step: "Protein",
      title: "Protein Thresholds",
      detail: `Your ${diet} meals are missing the leucine threshold for satiety.`,
      steps: [
        "Aim for 30g protein per meal minimum.",
        "Prioritize the protein source first on your plate.",
        "Use the alternatives suggested in the analysis.",
      ],
    });
  }

  // Eating sequence optimization
  if (checkStepStatus("order", reportData) === "fail") {
    actions.push({
      step: "Order",
      title: "Glucose Management",
      detail: "Eating carbs first spikes insulin unnecessarily.",
      steps: [
        "Eat vegetables/fiber first.",
        "Eat protein/fats second.",
        "Eat starches/sugars last.",
      ],
    });
  }

  // Eating hygiene optimization
  if (checkStepStatus("hygiene", reportData) === "fail") {
    actions.push({
      step: "Hygiene",
      title: "Mindful Eating",
      detail: "Distracted eating bypasses satiety signals.",
      steps: [
        "No screens while eating.",
        "Chew each bite 20 times.",
        "Put the fork down between bites.",
      ],
    });
  }

  // Movement optimization
  if (checkStepStatus("movement", reportData) === "fail") {
    actions.push({
      step: "Movement",
      title: "Active Glucose Disposal",
      detail: "Sedentary post-meal time leads to fat storage.",
      steps: [
        "10 minute walk immediately after big meals.",
        "Do 20 air squats if you can't walk outside.",
      ],
    });
  }

  return actions;
}

// Calculate overall system score
export function calculateSystemScore(
  reportData: FinalReportData,
  totalSteps: number,
): number {
  const actionPlan = generateActionPlan(reportData);
  const optimizedSystems = totalSteps - actionPlan.length;
  return Math.round((optimizedSystems / totalSteps) * 100);
}

// Get personalized recommendations based on diet type
export function getPersonalizedRecommendations(
  reportData: FinalReportData,
): string[] {
  const recommendations: string[] = [];

  const proteinData = reportData.protein;
  if (proteinData) {
    const dietType = proteinData.report.detected_diet;
    switch (dietType) {
      case "Vegetarian":
        recommendations.push(
          "Focus on combining legumes with grains for complete proteins",
        );
        recommendations.push(
          "Include dairy or eggs in each meal for essential amino acids",
        );
        break;
      case "Vegan":
        recommendations.push(
          "Combine different plant proteins throughout the day",
        );
        recommendations.push(
          "Consider B12 supplementation and iron-rich foods",
        );
        break;
      case "Non-Veg":
        recommendations.push(
          "Maintain variety in protein sources (fish, poultry, eggs)",
        );
        recommendations.push(
          "Include plant-based proteins for fiber and micronutrients",
        );
        break;
    }
  }

  // Add general recommendations based on analysis
  const sleepAnalysis = reportData.sleep
    ? analyzeSleep(reportData.sleep)
    : null;
  if (sleepAnalysis && !sleepAnalysis.isOptimal) {
    recommendations.push(
      "Prioritize sleep - it's the foundation of metabolic health",
    );
  }

  return recommendations;
}

// Generate detailed analysis summary
export function generateAnalysisSummary(reportData: FinalReportData): {
  summary: string;
  priorities: string[];
  nextSteps: string[];
} {
  const failedSteps = Object.keys(reportData).filter(
    (stepId) => checkStepStatus(stepId, reportData) === "fail",
  );

  const priorityAreas = failedSteps.map((stepId) => {
    switch (stepId) {
      case "sleep":
        return "Sleep optimization";
      case "meal-timing":
        return "Meal timing consistency";
      case "protein":
        return "Protein intake";
      case "order":
        return "Meal sequencing";
      case "hygiene":
        return "Mindful eating";
      case "movement":
        return "Post-meal activity";
      default:
        return stepId;
    }
  });

  const actionPlan = generateActionPlan(reportData);
  const nextSteps = actionPlan.slice(0, 3).map((action) => action.title);

  let summary = "Based on your responses, ";
  if (failedSteps.length === 0) {
    summary +=
      "you have an excellent metabolic foundation! Maintain your current protocols.";
  } else if (failedSteps.length <= 2) {
    summary += `focus on ${priorityAreas.join(" and ")} for optimal results.`;
  } else {
    summary += `there are several areas for improvement. Focus on ${priorityAreas.slice(0, 2).join(", ")}, and ${priorityAreas[2]} for the best results.`;
  }

  return {
    summary,
    priorities: priorityAreas,
    nextSteps,
  };
}

// Export all failed step data for detailed analysis
export function getDetailedStepData(
  reportData: FinalReportData,
): Record<string, unknown> {
  const details: Record<string, unknown> = {};

  Object.entries(reportData).forEach(([stepId, data]) => {
    const status = checkStepStatus(stepId, reportData);
    if (status === "fail") {
      details[stepId] = {
        data,
        status,
        recommendations: getStepRecommendations(stepId, data),
      };
    }
  });

  return details;
}

// Get specific recommendations for a failed step
function getStepRecommendations(stepId: string, data: unknown): string[] {
  switch (stepId) {
    case "sleep": {
      const analysis = analyzeSleep(data as SleepData);
      return analysis.recommendations;
    }
    case "meal-timing": {
      const stepData = data as { meals: MealTimes; isDaily: boolean };
      const analysis = analyzeMealTiming(stepData.meals, stepData.isDaily);
      return analysis.isOptimal
        ? ["Maintain current timing"]
        : ["Adjust meal gaps to 3-6 hours", "Maintain consistency"];
    }
    case "protein": {
      const stepData = data as { report: ProteinReport };
      const recs = getProteinRecommendations(stepData.report);
      return Object.values(recs).flat();
    }
    default:
      return ["Focus on this area for improvement"];
  }
}
