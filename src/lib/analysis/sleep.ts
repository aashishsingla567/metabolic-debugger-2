import type { SleepData } from "../types";

// Analyze sleep quality based on duration and timing
export function analyzeSleep(sleepData: SleepData): {
  isOptimal: boolean;
  score: number;
  issues: string[];
  recommendations: string[];
} {
  const issues: string[] = [];
  const recommendations: string[] = [];

  // Analyze duration
  if (sleepData.duration < 7) {
    issues.push("Insufficient sleep duration");
    recommendations.push("Aim for at least 7 hours of sleep");
  } else if (sleepData.duration < 8) {
    recommendations.push(
      "Consider extending sleep to 7.5-8 hours for optimal recovery",
    );
  }

  if (sleepData.duration > 9) {
    issues.push("Excessive sleep duration");
    recommendations.push("Monitor sleep quality - longer isn't always better");
  }

  // Analyze sleep timing
  const bedtimePart = sleepData.bedtime.split(":")[0];
  const waketimePart = sleepData.waketime.split(":")[0];

  if (!bedtimePart || !waketimePart) {
    issues.push("Invalid time format");
    recommendations.push("Please enter valid time format (HH:MM)");
    return {
      isOptimal: false,
      score: 0,
      issues,
      recommendations,
    };
  }

  const bedtimeHour = parseInt(bedtimePart);
  const waketimeHour = parseInt(waketimePart);

  // Check bedtime (should be between 9 PM and 11 PM for optimal circadian rhythm)
  if (bedtimeHour < 21 && bedtimeHour > 0) {
    // 9 PM to 1 AM
    issues.push("Late bedtime may disrupt circadian rhythm");
    recommendations.push("Aim for bedtime between 9-11 PM");
  }

  if (bedtimeHour >= 0 && bedtimeHour < 6) {
    // Midnight to 6 AM
    issues.push("Very late bedtime detected");
    recommendations.push("Consider earlier bedtime to improve sleep quality");
  }

  // Check wake time (should be between 6 AM and 8 AM for optimal circadian alignment)
  if (waketimeHour < 6) {
    issues.push("Very early wake time may indicate sleep debt");
    recommendations.push("Consider adjusting bedtime rather than wake time");
  }

  if (waketimeHour > 8 && waketimeHour < 12) {
    issues.push("Late wake time may disrupt daily rhythm");
    recommendations.push("Aim for wake time between 6-8 AM");
  }

  if (waketimeHour >= 12) {
    issues.push("Very late wake time may indicate irregular sleep schedule");
    recommendations.push("Maintain consistent sleep schedule");
  }

  // Calculate sleep score (0-100)
  let score = 100;

  // Duration scoring
  if (sleepData.duration < 6) score -= 30;
  else if (sleepData.duration < 7) score -= 15;
  else if (sleepData.duration > 9) score -= 10;

  // Timing scoring
  if (bedtimeHour < 21 || bedtimeHour >= 1) score -= 10;
  if (waketimeHour < 6 || waketimeHour >= 12) score -= 10;

  // Ensure score is within bounds
  score = Math.max(0, Math.min(100, score));

  const isOptimal = issues.length === 0 && score >= 80;

  return {
    isOptimal,
    score,
    issues,
    recommendations,
  };
}

// Calculate sleep duration from bedtime and wake time
export function calculateSleepDuration(
  bedtime: string,
  waketime: string,
): number {
  const [bedHour, bedMin] = bedtime.split(":").map(Number);
  const [wakeHour, wakeMin] = waketime.split(":").map(Number);

  const bedTotalMinutes = (bedHour ?? 0) * 60 + (bedMin ?? 0);
  const wakeTotalMinutes = (wakeHour ?? 0) * 60 + (wakeMin ?? 0);

  let durationMinutes = wakeTotalMinutes - bedTotalMinutes;

  // Handle overnight sleep (when wake time is next day)
  if (durationMinutes <= 0) {
    durationMinutes += 24 * 60; // Add 24 hours in minutes
  }

  return durationMinutes / 60; // Convert to hours
}

// Validate sleep times
export function validateSleepTimes(
  bedtime: string,
  waketime: string,
): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  // Check time format
  const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;

  if (!timeRegex.test(bedtime)) {
    errors.push(`Invalid bedtime format: ${bedtime}`);
  }

  if (!timeRegex.test(waketime)) {
    errors.push(`Invalid wake time format: ${waketime}`);
  }

  // Check if times are the same (indicates error)
  if (bedtime === waketime) {
    errors.push("Bedtime and wake time cannot be the same");
  }

  return { isValid: errors.length === 0, errors };
}

// Get sleep hygiene recommendations
export function getSleepHygieneRecommendations(
  sleepData: SleepData,
  _analysis: ReturnType<typeof analyzeSleep>,
): string[] {
  const recommendations: string[] = [];

  // Duration-based recommendations
  if (sleepData.duration < 7) {
    recommendations.push(
      "Set a consistent bedtime to ensure 7+ hours of sleep",
    );
    recommendations.push("Create a relaxing bedtime routine");
    recommendations.push("Avoid screens 1 hour before bed");
  }

  // Timing-based recommendations
  const bedtimeHourStr = sleepData.bedtime?.split(":")[0];
  const bedtimeHour = bedtimeHourStr ? parseInt(bedtimeHourStr) : 0;
  if (bedtimeHour >= 1 || bedtimeHour < 21) {
    recommendations.push(
      "Maintain consistent sleep schedule, even on weekends",
    );
    recommendations.push("Avoid caffeine after 2 PM");
    recommendations.push("Keep bedroom cool (19°C/66°F) and dark");
  }

  // General sleep hygiene
  recommendations.push("Exercise regularly, but not within 3 hours of bedtime");
  recommendations.push("Avoid large meals before bedtime");
  recommendations.push("Consider magnesium glycinate as a natural sleep aid");

  return recommendations;
}

// Calculate optimal sleep schedule based on lifestyle
export function calculateOptimalSleepSchedule(
  wakeTimePreference = "07:00",
  sleepDuration = 8,
): { bedtime: string; waketime: string } {
  const [wakeHour, wakeMin] = wakeTimePreference.split(":").map(Number);

  // Calculate bedtime by subtracting sleep duration
  let bedtimeTotalMinutes =
    (wakeHour ?? 7) * 60 + (wakeMin ?? 0) - sleepDuration * 60;

  // Handle negative bedtime (previous day)
  if (bedtimeTotalMinutes < 0) {
    bedtimeTotalMinutes += 24 * 60; // Add 24 hours
  }

  const bedtimeHour = Math.floor(bedtimeTotalMinutes / 60);
  const bedtimeMin = bedtimeTotalMinutes % 60;

  const formatTime = (hours: number, minutes: number): string => {
    const h = hours.toString().padStart(2, "0");
    const m = minutes.toString().padStart(2, "0");
    return `${h}:${m}`;
  };

  return {
    bedtime: formatTime(bedtimeHour, bedtimeMin),
    waketime: wakeTimePreference,
  };
}
