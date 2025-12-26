"use client";

import React from "react";
import { ReferenceCard } from "../molecules/ReferenceCard";

const SLEEP_REFERENCES = [
  {
    title: "Sleep Duration and Metabolic Health",
    url: "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC3623790/",
    citation: "Sleep, Metabolism, and Obesity",
  },
  {
    title: "Sleep Duration and Risk of Obesity",
    url: "https://academic.oup.com/sleep/article/31/5/627/2453599",
    citation: "Sleep. 2008;31(5):627-633.",
  },
];

const MEAL_TIMING_REFERENCES = [
  {
    title: "Meal Timing and Circadian Rhythms",
    url: "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC6595518/",
    citation: "Circadian Rhythms in Meal Timing",
  },
  {
    title: "Intermittent Fasting and Metabolic Health",
    url: "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC8434910/",
    citation: "Intermittent Fasting and Metabolic Health",
  },
];

const PROTEIN_REFERENCES = [
  {
    title: "Protein, Satiety, and Weight Management",
    url: "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC5240305/",
    citation: "Protein, Satiety, and Weight Management",
  },
  {
    title: "Leucine Signaling in Protein Synthesis",
    url: "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC5064155/",
    citation: "Leucine Signaling in Protein Synthesis",
  },
];

const EATING_SEQUENCE_REFERENCES = [
  {
    title: "Food Order and Glucose Response",
    url: "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC5900805/",
    citation: "Food Order and Postprandial Glucose",
  },
  {
    title: "Postprandial Glucose Response",
    url: "https://pubmed.ncbi.nlm.nih.gov/29510531/",
    citation: "Postprandial Glucose Response",
  },
];

const MOVEMENT_REFERENCES = [
  {
    title: "Post-meal Walking and Glucose",
    url: "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC6439655/",
    citation: "Post-meal Walking and Glucose",
  },
  {
    title: "Physical Activity and Glucose Disposal",
    url: "https://www.sciencedirect.com/science/article/pii/S1550413117302475",
    citation: "Physical Activity and Glucose Disposal",
  },
];

const MINDFUL_EATING_REFERENCES = [
  {
    title: "Mindful Eating and Food Intake",
    url: "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC5580788/",
    citation: "Mindful Eating and Food Intake",
  },
  {
    title: "Television and Overeating",
    url: "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC4562960/",
    citation: "Television and Overeating",
  },
];

export function AboutPage() {
  return (
    <div className="space-y-16">
      <section>
        <h1 className="mb-4 text-4xl font-bold text-white">
          About <span className="text-emerald-400">Metabolic Debugger</span>
        </h1>
        <p className="text-lg text-slate-400">
          Identifying the rate-limiting step in your biology.
        </p>
      </section>

      <section>
        <h2 className="mb-6 text-2xl font-bold text-white">
          What is the Rate-Limiting Step Concept?
        </h2>
        <p className="mb-4 text-slate-300">
          Just as a chain is only as strong as its weakest link, your metabolic
          health is limited by your worst habit. The Metabolic Debugger
          identifies these bottlenecks through a systematic analysis of six key
          areas.
        </p>
        <p className="text-slate-300">
          By addressing the weakest link first, you create the biggest impact on
          overall metabolic efficiency. This principle is used in sports
          science, manufacturing, and now—personal health optimization.
        </p>
      </section>

      <section>
        <h2 className="mb-6 text-2xl font-bold text-white">
          The Science Behind Each Area
        </h2>
        <div className="space-y-8">
          <ReferenceCard
            title="Sleep and Circadian Rhythm"
            explanation="Less than 7 hours of sleep spikes ghrelin (hunger hormone) and
              slashes insulin sensitivity. Your body enters a 'famine mode' and
              hoards fat as a safety mechanism."
            references={SLEEP_REFERENCES}
          />

          <ReferenceCard
            title="Meal Timing and Consistency"
            explanation="Erratic eating signals 'famine' stress to your body. Consistent
              meal windows aligned with circadian rhythms optimize metabolic
              processes and prevent fat storage."
            references={MEAL_TIMING_REFERENCES}
          />

          <ReferenceCard
            title="Protein and Leucine Threshold"
            explanation="Protein is the biological 'off switch' for hunger. If you don't
              hit ~30g of protein per meal (leucine threshold), your brain
              keeps the hunger signal on, searching for amino acids."
            references={PROTEIN_REFERENCES}
          />

          <ReferenceCard
            title="Eating Sequence (Food Order)"
            explanation="Fiber first creates a mesh in the gut. Protein second signals
              satiety. Carbs last have 70% less impact on blood sugar.
              This sequence dramatically reduces insulin spikes."
            references={EATING_SEQUENCE_REFERENCES}
          />

          <ReferenceCard
            title="Post-Meal Movement"
            explanation="A 10-minute walk creates a 'glucose sink' in your leg
              muscles, pulling sugar from the blood physically rather than
              chemically. Walking uses glucose immediately without requiring insulin."
            references={MOVEMENT_REFERENCES}
          />

          <ReferenceCard
            title="Mindful Eating"
            explanation="Distracted eating blocks the 'I'm Full' signal. Your brain
              needs to register the sensory experience of eating to start digestion
              and trigger satiety hormones."
            references={MINDFUL_EATING_REFERENCES}
          />
        </div>
      </section>

      <section>
        <h2 className="mb-6 text-2xl font-bold text-white">How It Works</h2>
        <div className="space-y-4 text-slate-300">
          <p>
            <strong className="text-white">
              1. Answer Diagnostic Questions
            </strong>{" "}
            — Go through each area honestly, providing your current habits and
            data.
          </p>
          <p>
            <strong className="text-white">2. Identify Bottlenecks</strong> —
            The system identifies which areas need optimization based on
            scientific thresholds.
          </p>
          <p>
            <strong className="text-white">3. Receive Action Plan</strong> — Get
            personalized recommendations for each bottleneck with specific,
            actionable steps.
          </p>
          <p>
            <strong className="text-white">4. Implement and Retest</strong> —
            Address the bottlenecks, then return to re-evaluate and identify the
            next rate-limiting step.
          </p>
        </div>
      </section>

      <section>
        <h2 className="mb-6 text-2xl font-bold text-white">
          Scientific Methodology
        </h2>
        <p className="mb-4 text-slate-300">
          This tool is built on evidence-based recommendations from
          peer-reviewed research in endocrinology, nutrition science, and
          chronobiology. Each threshold and recommendation is backed by
          scientific studies.
        </p>
        <p className="mb-4 text-slate-300">
          <strong className="text-white">Disclaimer:</strong> This tool is for
          educational purposes and does not replace professional medical advice.
          Consult with healthcare providers before making significant changes to
          diet, sleep, or exercise routines.
        </p>
      </section>
    </div>
  );
}

export default AboutPage;
