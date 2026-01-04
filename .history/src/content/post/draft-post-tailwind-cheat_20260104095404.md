---
title: "The Developer's Toolkit: Site Features"
description: "A showcase of every component and style available for your future posts."
publishDate: 2026-01-03
tags: ["Guide", "Tailwind", "Components"]
showToc: false
draft: true
---

<style>
  /* Standard fix to keep text readable and kill TOC anchors */
  .post-body { color: var(--theme-text, #1a1a1a); max-width: 75ch; margin: 0 auto; }
  .header-anchor, .anchor-link, .toc-container { display: none !important; }
</style>

<div class="post-body space-y-8">

<section>
  <h2 class="text-2xl font-bold mb-4">1. Sparkle & Shine</h2>
  <p class="text-lg">
    You can make specific words pop by wrapping them in the sparkle component. 
    It’s great for titles or <sparkly-text style="--sparkly-text-color: #ffd700;">key takeaways</sparkly-text> that deserve extra attention.
  </p>
</section>

<hr class="border-zinc-200 dark:border-zinc-800" />

<section>
  <h2 class="text-2xl font-bold mb-4">2. Side-by-Side Comparison</h2>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-8 my-6">
    <div class="p-6 bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 rounded">
      <h4 class="font-bold text-blue-700 dark:text-blue-300">Option A: Piaget</h4>
      <p class="text-sm m-0">Focuses on individual cognitive development and internal stages.</p>
    </div>
    <div class="p-6 bg-purple-50 dark:bg-purple-900/20 border-l-4 border-purple-500 rounded">
      <h4 class="font-bold text-purple-700 dark:text-purple-300">Option B: Vygotsky</h4>
      <p class="text-sm m-0">Emphasizes social interaction and the cultural context of learning.</p>
    </div>
  </div>
</section>

<hr class="border-zinc-200 dark:border-zinc-800" />

<section>
  <h2 class="text-2xl font-bold mb-4">3. Styled Blockquotes</h2>
  <blockquote class="relative p-8 my-8 border-none bg-zinc-50 dark:bg-zinc-900 rounded-xl italic text-xl text-center shadow-inner">
    <span class="text-6xl absolute top-2 left-4 opacity-20 serif">“</span>
    Learning is not the product of teaching. Learning is the product of the activity of learners.
    <footer class="mt-4 text-base font-bold not-italic">— John Holt</footer>
  </blockquote>
</section>

<hr class="border-zinc-200 dark:border-zinc-800" />

<section>
  <h2 class="text-2xl font-bold mb-4">4. Feedback & Callouts</h2>
  
  <div class="flex items-center gap-4 p-4 mb-4 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 rounded-lg border border-green-200 dark:border-green-800">
    <span class="text-2xl">✅</span>
    <span><strong>Success:</strong> Your site is now live on Netlify!</span>
  </div>

  <div class="flex items-center gap-4 p-4 mb-4 bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300 rounded-lg border border-amber-200 dark:border-amber-800">
    <span class="text-2xl">⚠️</span>
    <span><strong>Reminder:</strong> Move images to the <code>src/assets</code> folder for optimization.</span>
  </div>
</section>

<hr class="border-zinc-200 dark:border-zinc-800" />

<section>
  <h2 class="text-2xl font-bold mb-4">5. Call to Action</h2>
  <p>If you need to link to an external resource like Gen Exchange:</p>
  <div class="flex justify-center my-6">
    <a href="https://jeremysheeshka.ca" 
       class="px-8 py-3 bg-accent text-white font-bold rounded-full hover:scale-105 transition-transform shadow-lg no-underline">
       Explore the Exchange
    </a>
  </div>
</section>

<hr class="border-zinc-200 dark:border-zinc-800" />

<section class="bg-zinc-100 dark:bg-zinc-800 p-8 rounded-2xl">
  <h2 class="text-2xl font-bold mb-4">🎨 Theme Cheat Sheet</h2>
  <ul class="space-y-2 list-none p-0">
    <li><code class="bg-white dark:bg-black px-2 py-1 rounded text-accent">text-accent</code>: Primary theme color (Gold/Blue).</li>
    <li><code class="bg-white dark:bg-black px-2 py-1 rounded">bg-zinc-900</code>: Best background for "dark mode" boxes.</li>
    <li><code class="bg-white dark:bg-black px-2 py-1 rounded">max-w-prose</code>: Limits text width for perfect readability.</li>
    <li><code class="bg-white dark:bg-black px-2 py-1 rounded text-red-500">text-red-500</code>: Use for critical errors or warnings.</li>
    <li><code class="bg-white dark:bg-black px-2 py-1 rounded">shadow-2xl</code>: Deep shadow for "floating" images.</li>
  </ul>
</section>

</div>
