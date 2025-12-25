import type { DietType } from "./types";

// Database of dietary fixes organized by diet type
const FIX_DB: Record<DietType, readonly string[]> = {
  Vegetarian: [
    "Starter: Cucumber sticks with hummus -> Main: Paneer Bhurji + 1 Roti.",
    "Starter: Small Bowl of Sprout Salad -> Main: Dal Tadka + Rice.",
    "Starter: Tomato Soup -> Main: Soya Chunk Curry + Quinoa.",
    "Add a side of Greek Yogurt (Curd) to this meal.",
    "Add a scoop of Whey Protein in water before the meal.",
    "Include 200g of Paneer in your curry.",
    "Add a handful of mixed nuts (30g) to increase protein.",
    "Include 2 boiled eggs if you're ovo-vegetarian.",
    "Add chickpeas or kidney beans to your dal.",
    "Include quinoa or amaranth as a protein grain.",
  ] as const,
  Vegan: [
    "Starter: Carrot sticks -> Main: Tofu Scramble + Toast.",
    "Starter: Green Salad -> Main: Chickpea Curry + Rice.",
    "Starter: Clear Soup -> Main: Tempeh Stir-fry.",
    "Add a scoop of Pea/Rice Protein shake.",
    "Increase portion of lentils/beans by 50%.",
    "Include 200g of Tofu or Tempeh.",
    "Add hemp seeds or nutritional yeast for complete protein.",
    "Include quinoa or buckwheat as protein grains.",
    "Add spirulina or chlorella powder to smoothies.",
    "Include edamame or young soybeans.",
  ] as const,
  "Non-Veg": [
    "Starter: 2 Boiled Eggs -> Main: Chicken Curry + Rice.",
    "Starter: Bone Broth -> Main: Grilled Fish + Salad.",
    "Starter: Minced Meat (Keema) + Roti.",
    "Add 150g Grilled Chicken Breast side.",
    "Add a can of Tuna in water.",
    "Include 2-3 eggs in your meal.",
    "Add lean turkey or lean beef (150g).",
    "Include salmon or mackerel for omega-3.",
    "Add shrimp or prawns for variety.",
    "Include cottage cheese or Greek yogurt.",
  ] as const,
};

// Get a random fix suggestion for the specified diet type
export function getRandomFix(diet: DietType): string {
  const fixes = FIX_DB[diet] ?? FIX_DB.Vegetarian;
  const randomIndex = Math.floor(Math.random() * fixes.length);
  return fixes[randomIndex] ?? "Review your protein sources";
}

// Get all fixes for a diet type
export function getFixesForDiet(diet: DietType): readonly string[] {
  return FIX_DB[diet] ?? FIX_DB.Vegetarian;
}

// Get dietary recommendations based on common deficiencies
export function getDietaryRecommendations(
  issues: string[],
): Record<DietType, string[]> {
  const recommendations: Record<DietType, string[]> = {
    Vegetarian: [],
    Vegan: [],
    "Non-Veg": [],
  };

  issues.forEach((issue) => {
    switch (issue.toLowerCase()) {
      case "low bioavailability":
        recommendations.Vegetarian.push(
          "Combine legumes with grains for complete protein",
        );
        recommendations.Vegan.push(
          "Pair beans with nuts/seeds for amino acid profile",
        );
        break;
      case "catabolic risk":
        recommendations.Vegetarian.push(
          "Include protein with every meal, especially breakfast",
        );
        recommendations.Vegan.push(
          "Don't skip protein-rich meals, even snacks",
        );
        break;
      case "insufficient protein":
        recommendations["Non-Veg"].push(
          "Consider increasing portion sizes of existing protein",
        );
        recommendations.Vegetarian.push(
          "Add dairy or eggs to plant-based meals",
        );
        break;
      default:
        // General recommendations
        recommendations.Vegetarian.push(
          "Focus on protein variety: dairy, eggs, legumes",
        );
        recommendations.Vegan.push(
          "Combine different plant proteins throughout the day",
        );
        recommendations["Non-Veg"].push("Maintain consistent protein sources");
    }
  });

  return recommendations;
}
