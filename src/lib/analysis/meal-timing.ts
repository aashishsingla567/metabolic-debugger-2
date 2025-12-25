import type { MealTimes, MealAnalysis } from "../types";

// Calculate meal gaps and analyze meal timing
export function analyzeMealTiming(
  meals: MealTimes,
  isDaily: boolean,
): MealAnalysis {
  const gap1 = calculateGap(meals.m1, meals.m2);
  const gap2 = calculateGap(meals.m2, meals.m3);

  const isSpacingGood = gap1 >= 3 && gap1 <= 6.5 && gap2 >= 3 && gap2 <= 6.5;
  const isOptimal = isSpacingGood && isDaily;

  let msg = "Check spacing...";
  if (!isSpacingGood) {
    if (gap1 < 3 || gap2 < 3) {
      msg = "Gaps too short (<3h). Insulin won't reset.";
    } else if (gap1 > 7 || gap2 > 7) {
      msg = "Gaps too long (>7h). Cortisol rising.";
    }
  } else {
    msg = isDaily
      ? "Optimal metabolic rhythm."
      : "Timing good, but consistency is missing.";
  }

  return {
    gap1: gap1.toFixed(1),
    gap2: gap2.toFixed(1),
    isOptimal,
    msg,
    isSpacingGood,
  };
}

// Calculate time gap between two meals in hours
function calculateGap(time1: string, time2: string): number {
  if (!time1 || !time2) return 0;

  const [h1, m1] = time1.split(":").map(Number);
  const [h2, m2] = time2.split(":").map(Number);

  const time1Hours = (h1 ?? 0) + (m1 ?? 0) / 60;
  const time2Hours = (h2 ?? 0) + (m2 ?? 0) / 60;

  let diff = time2Hours - time1Hours;
  if (diff < 0) diff += 24; // Handle overnight gaps

  return diff;
}

// Validate if meal times are reasonable
export function validateMealTimes(meals: MealTimes): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  // Check if all times are provided
  if (!meals.m1 || !meals.m2 || !meals.m3) {
    errors.push("All meal times must be provided");
    return { isValid: false, errors };
  }

  // Check time format
  const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
  [meals.m1, meals.m2, meals.m3].forEach((time, index) => {
    if (!timeRegex.test(time)) {
      errors.push(`Invalid time format for meal ${index + 1}: ${time}`);
    }
  });

  // Check logical meal ordering
  const gap1 = calculateGap(meals.m1, meals.m2);
  const gap2 = calculateGap(meals.m2, meals.m3);

  if (gap1 <= 0) {
    errors.push("Lunch must be after breakfast");
  }
  if (gap2 <= 0) {
    errors.push("Dinner must be after lunch");
  }

  // Check for reasonable meal timing (6 AM to 11 PM)
  const isReasonableTime = (time: string): boolean => {
    const timePart = time.split(":")[0];
    if (!timePart) return false;
    const hours = parseInt(timePart);
    return !isNaN(hours) && hours >= 6 && hours <= 23;
  };

  [meals.m1, meals.m2, meals.m3].forEach((time, index) => {
    if (!isReasonableTime(time)) {
      errors.push(
        `Meal ${index + 1} time (${time}) should be between 6 AM and 11 PM`,
      );
    }
  });

  return { isValid: errors.length === 0, errors };
}

// Get meal timing recommendations
export function getMealTimingRecommendations(analysis: MealAnalysis): string[] {
  const recommendations: string[] = [];

  if (!analysis.isSpacingGood) {
    const gap1 = parseFloat(analysis.gap1);
    const gap2 = parseFloat(analysis.gap2);

    if (gap1 < 3) {
      recommendations.push(
        "Increase gap between breakfast and lunch to at least 3 hours",
      );
    }
    if (gap2 < 3) {
      recommendations.push(
        "Increase gap between lunch and dinner to at least 3 hours",
      );
    }
    if (gap1 > 7) {
      recommendations.push(
        "Reduce gap between breakfast and lunch to under 7 hours",
      );
    }
    if (gap2 > 7) {
      recommendations.push(
        "Reduce gap between lunch and dinner to under 7 hours",
      );
    }
  }

  if (!analysis.isOptimal) {
    recommendations.push("Maintain consistent meal times daily (±30 minutes)");
    recommendations.push(
      "Avoid late-night eating (finish dinner 3 hours before bed)",
    );
  }

  return recommendations;
}

// Calculate optimal meal times based on sleep schedule
export function calculateOptimalMealTimes(
  wakeTime: string,
  sleepTime: string,
  preferences?: {
    breakfastTime?: string;
    lunchTime?: string;
    dinnerTime?: string;
  },
): MealTimes {
  const wakeTimePart = wakeTime.split(":")[0];
  const sleepTimePart = sleepTime.split(":")[0];

  if (!wakeTimePart || !sleepTimePart) {
    // Return default times if parsing fails
    return {
      m1: "08:00",
      m2: "13:00",
      m3: "19:00",
    };
  }

  const wakeHour = parseInt(wakeTimePart);
  const sleepHour = parseInt(sleepTimePart);

  // Default optimal times based on circadian rhythm
  const breakfastHour = preferences?.breakfastTime
    ? parseInt(preferences.breakfastTime.split(":")[0] ?? "8")
    : Math.max(7, wakeHour + 1); // 1 hour after wake time, but not before 7 AM

  const lunchHour = preferences?.lunchTime
    ? parseInt(preferences.lunchTime.split(":")[0] ?? "13")
    : Math.min(14, breakfastHour + 4); // 4 hours after breakfast, but not after 2 PM

  const dinnerHour = preferences?.dinnerTime
    ? parseInt(preferences.dinnerTime.split(":")[0] ?? "19")
    : Math.min(20, sleepHour - 4); // 4 hours before sleep, but not after 8 PM

  // Ensure proper spacing
  let adjustedLunchHour = lunchHour;
  let adjustedDinnerHour = dinnerHour;

  if (adjustedLunchHour - breakfastHour < 3) {
    adjustedLunchHour = breakfastHour + 3;
  }
  if (adjustedDinnerHour - adjustedLunchHour < 3) {
    adjustedDinnerHour = adjustedLunchHour + 3;
  }

  // Format times
  const formatTime = (hour: number): string => {
    const h = hour.toString().padStart(2, "0");
    return `${h}:00`;
  };

  return {
    m1: formatTime(breakfastHour),
    m2: formatTime(adjustedLunchHour),
    m3: formatTime(adjustedDinnerHour),
  };
}
