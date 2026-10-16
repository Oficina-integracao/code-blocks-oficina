import React from "react";
import { Hero } from "@/components/home/hero";
import { LearningPath } from "@/components/home/learning-path";
import { AboutProject } from "@/components/home/about-project";

export default function HomePage() {
  return (
    <main>
      <Hero />
      <LearningPath />
      <AboutProject />
    </main>
  );
}
