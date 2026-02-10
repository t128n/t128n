---
title: Curriculum Vitae
---

<script setup lang="ts">
import { data } from './cv.data.ts'
</script>

<div class="mx-auto leading-snug">

  <div class="my-8 flex flex-col flex-col-reverse sm:flex-row items-center gap-8">
      <span class="text-justify leading-relaxed">{{ data.sections.Summary[0].bullet }}</span>
      <img :src="data.photo" alt="Picture of Torben" class="w-32 h-32 rounded-full object-cover shrink-0">
  </div>

  <h2 id="education" class="uppercase text-vp-brand-1">
    Education
  </h2>
  <div class="flex flex-col gap-4 mb-8">
    <div v-for="education in data.sections.Education" :key="education.institution">
      <div class="flex flex-col flex-col-reverse sm:flex-row justify-between items-baseline">
        <span class="font-bold">{{ education.institution }}</span>
        <span class="text-sm text-vp-text-3">{{ education.location }}</span>
      </div>
      <div class="flex flex flex-col sm:flex-row gap-2 sm:gap-0 justify-between items-baseline">
        <span class="italic w-2/3">{{ education.degree ? education.degree + ', ' : '' }}{{ education.area }}</span>
        <span class="text-sm text-vp-text-3 whitespace-nowrap">{{ education.start_date }} &ndash; {{ education.end_date || 'Present' }}</span>
      </div>
    </div>
  </div>
  <h2 id="experience" class="uppercase text-vp-brand-1">
    Experience
  </h2>
  <div class="flex flex-col gap-6 mb-8">
    <div v-for="experience in data.sections.Experience" :key="experience.company + experience.position">
      <div class="flex flex-row justify-between items-baseline">
        <span class="font-bold text-lg">{{ experience.position }}</span>
        <span class="text-sm text-vp-text-3 whitespace-nowrap">{{ experience.start_date }} &ndash; {{ experience.end_date || 'Present' }}</span>
      </div>
      <div class="flex justify-between items-center mb-2">
        <span class="text-sm text-vp-text-2">{{ experience.company }}</span>
        <span class="text-sm text-vp-text-3">{{ experience.location }}</span>
      </div>
      <p v-if="experience.summary" class="text-justify mb-2">
        {{ experience.summary }}
      </p>
      <ul class="list-disc list-outside text-justify">
        <li v-for="highlight in experience.highlights" :key="highlight" class="pl-1">
          {{ highlight }}
        </li>
      </ul>
    </div>
  </div>

  <h2 id="awards-certifications" class="uppercase text-vp-brand-1">
    Awards & Certifications
  </h2>
  <div class="flex flex-col gap-4">
    <div v-for="certification in data.sections['Awards & Certifications']" :key="certification.name" class="flex justify-between items-baseline">
      <div class="flex flex-col">
        <span class="font-semibold">{{ certification.name }}</span>
        <span class="text-sm text-vp-text-2">{{ certification.location }}</span>
      </div>
      <span class="text-sm text-vp-text-2">{{ certification.date }}</span>
    </div>
  </div>

  <h2 id="technical-skills" class="uppercase text-vp-brand-1">
    Technical Skills
  </h2>
  <ul class="list-none! ml-0! pl-0! flex flex-col gap-2 text-justify ">
    <li v-for="skill in data.sections['Technical Skills']" :key="skill.label" class="flex flex-col gap-2 sm:flex-row sm:gap-4 items-baseline">
      <span class="font-bold w-32 shrink-0 text-right">{{ skill.label }}:</span>
      <span>{{ skill.details }}</span>
    </li>
  </ul>
</div>

---

[View as PDF](/cv.pdf)
