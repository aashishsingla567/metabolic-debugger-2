import type {
  ProteinReport,
  ProteinLog,
  ProteinMealAnalysis,
  DietType,
} from "../types";
import { getRandomFix } from "../fixes";

// Common protein detection patterns (must match original logic exactly)
const PROTEIN_PATTERNS = {
  nonVeg: /chicken|beef|steak|fish|salmon|tuna|pork|turkey|meat|egg|omelet/i,
  dairy: /yogurt|curd|paneer|cheese|milk|whey|butter|ghee/i,
  supplements: /whey|protein|shake|powder/i,
  carbHeavy: /cereal|toast|bagel|oat|poha|upma|paratha/i,
  legumes: /dal|beans|chickpeas|lentils|soya|tofu/i,
  salads: /salad/i,
};

// Analyze a single meal for protein content
function analyzeMeal(text: string): ProteinMealAnalysis {
  const t = (text || "").toLowerCase();
  const echo = text || "Skipped";

  if (!t) {
    return {
      input_echo: echo,
      protein: "0g",
      analysis: "Skipped.",
      issue: "Fasting",
      fix: "Add a meal.",
    };
  }

  // Check for Supplements/Protein sources first
  const hasSupplement = PROTEIN_PATTERNS.supplements.test(t);

  // Carb Heavy Breakfasts
  if (PROTEIN_PATTERNS.carbHeavy.test(t)) {
    if (
      hasSupplement ||
      PROTEIN_PATTERNS.dairy.test(t) ||
      t.includes("egg") ||
      t.includes("paneer") ||
      t.includes("tofu")
    ) {
      return {
        input_echo: echo,
        protein: "~25-30g",
        ingredients: "Carbs + Protein",
        analysis: "Balanced with protein.",
        issue: "None",
        fix: "Great job fortification.",
      };
    }

    return {
      input_echo: echo,
      protein: "< 8g",
      ingredients: "Grains/Carbs",
      analysis: "Carb-dominant start.",
      issue: "High Glycemic Load",
      fix: getRandomFix(detectDietType(t)),
    };
  }

  // Vegetarian Common Meals (Dal/Rice combinations)
  if (
    (PROTEIN_PATTERNS.legumes.test(t) || /rice|roti|sabzi|curry/.test(t)) &&
    !PROTEIN_PATTERNS.nonVeg.test(t) &&
    !hasSupplement
  ) {
    if (t.includes("paneer") || t.includes("soya") || t.includes("tofu")) {
      return {
        input_echo: echo,
        protein: "~20g",
        ingredients: "Mixed Meal",
        analysis: "Decent protein.",
        issue: "None",
        fix: "Ensure portion is sufficient.",
      };
    }
    return {
      input_echo: echo,
      protein: "~10-15g",
      ingredients: "Lentils/Grains",
      analysis: "Incomplete protein profile.",
      issue: "Low bioavailability",
      fix: getRandomFix(detectDietType(t)),
    };
  }

  // Salads/Light meals
  if (
    PROTEIN_PATTERNS.salads.test(t) &&
    !PROTEIN_PATTERNS.nonVeg.test(t) &&
    !t.includes("chicken") &&
    !t.includes("tofu") &&
    !t.includes("paneer") &&
    !t.includes("egg") &&
    !hasSupplement
  ) {
    return {
      input_echo: echo,
      protein: "< 5g",
      ingredients: "Vegetables",
      analysis: "Fiber rich, protein poor.",
      issue: "Catabolic Risk",
      fix: getRandomFix(detectDietType(t)),
    };
  }

  // Good Protein Sources
  if (
    PROTEIN_PATTERNS.nonVeg.test(t) ||
    t.includes("paneer") ||
    t.includes("tofu") ||
    hasSupplement
  ) {
    return {
      input_echo: echo,
      protein: "~25-30g",
      ingredients: "Protein Source",
      analysis: "Good source.",
      issue: "None",
      fix: "Perfect.",
    };
  }

  // Eggs specific analysis
  if (t.includes("egg") || t.includes("omelet")) {
    if (t.includes("1") || t.includes("one")) {
      return {
        input_echo: echo,
        protein: "~6g",
        ingredients: "1 Egg",
        analysis: "Volume too low.",
        issue: "Insufficient Protein",
        fix: "Increase to 3 eggs minimum.",
      };
    }
    return {
      input_echo: echo,
      protein: "~18g+",
      ingredients: "Eggs",
      analysis: "Bioavailable gold standard.",
      issue: "None",
      fix: "Perfect.",
    };
  }

  // Default case
  return {
    input_echo: echo,
    protein: "Unknown",
    ingredients: "Mixed",
    analysis: "Unclear profile.",
    issue: "Potential low protein",
    fix: "Ensure 30g protein source is present.",
  };
}

// Detect diet type based on food content
function detectDietType(text: string): DietType {
  const allText = text.toLowerCase();
  const isNonVeg = PROTEIN_PATTERNS.nonVeg.test(allText);
  const isVegan = !isNonVeg && !PROTEIN_PATTERNS.dairy.test(allText);

  return isNonVeg ? "Non-Veg" : isVegan ? "Vegan" : "Vegetarian";
}

// Main protein analysis function
export async function analyzeProtein(
  logs: ProteinLog,
  apiKey?: string,
): Promise<ProteinReport> {
  // Check for real API key and implement if needed
  if (apiKey) {
    // TODO: Implement real Gemini API call
    // For now, fallback to simulation
  }

  // Fallback simulation (preserves original logic)
  return new Promise((resolve) => {
    setTimeout(() => {
      const allText = (logs.m1 + " " + logs.m2 + " " + logs.m3).toLowerCase();
      const dietType = detectDietType(allText);

      const m1 = analyzeMeal(logs.m1);
      const m2 = analyzeMeal(logs.m2);
      const m3 = analyzeMeal(logs.m3);

      const pass =
        (m1.issue === "None" ||
          m1.protein.includes("30") ||
          m1.protein.includes("25")) &&
        (m2.issue === "None" ||
          m2.protein.includes("30") ||
          m2.protein.includes("25")) &&
        (m3.issue === "None" ||
          m3.protein.includes("30") ||
          m3.protein.includes("25"));

      resolve({
        detected_diet: dietType,
        m1,
        m2,
        m3,
        overall: {
          pass,
          msg: pass
            ? `Optimal ${dietType} distribution.`
            : `Protein intake inconsistent for ${dietType} diet.`,
        },
      });
    }, 1200);
  });
}

// Helper function to get protein recommendations
export function getProteinRecommendations(
  report: ProteinReport,
): Record<string, string[]> {
  const recommendations: Record<string, string[]> = {
    breakfast: [],
    lunch: [],
    dinner: [],
  };

  [report.m1, report.m2, report.m3].forEach((meal, index) => {
    const mealName =
      index === 0 ? "breakfast" : index === 1 ? "lunch" : "dinner";

    if (meal.issue && meal.issue !== "None") {
      if (meal.fix) {
        recommendations[mealName]?.push(`Fix: ${meal.fix}`);
      }
      recommendations[mealName]?.push(`Issue: ${meal.issue}`);
    } else {
      recommendations[mealName]?.push("Protein intake is optimal");
    }
  });

  return recommendations;
}
