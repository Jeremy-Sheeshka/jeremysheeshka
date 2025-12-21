---
title: 'ETEC 510 Playing with Design'
description: "Using a Metronome: an Interactive Introduction"
category: blogpost
key: 'ETEC 510'
tags: ETEC 510
date: 2025-09-30
---


<!-- REPLACED IFRAME WITH DIRECT LINK BUTTON -->
<div style="text-align: center; padding: 40px 20px; border: 2px dashed #4f6b86; background: #f8f9fa; margin: 20px 0; border-radius: 8px;">
  <h3 style="color: #4f6b86; margin-bottom: 15px;">Interactive Metronome Manual</h3>
  <p style="margin-bottom: 20px; color: #666;">Click the button below to open the interactive metronome guide:</p>
  <a href="/assets/html/Metronome-Manual.htm" 
     target="_blank" 
     style="display: inline-block; padding: 12px 30px; background: #4f6b86; color: white; text-decoration: none;">
    Metronome - Instructional Manual
  </a>
</div>

<div class="dropdown-menu">
<!-- Reflection Top-Level -->
<div class="dropdown-item top-level" id="reflection-section">
<dt class="dropdown-question">Reflection</dt>
<div class="reflection-submenus">
<div class="dropdown-item nested">
<dt class="dropdown-question">Initial Thoughts</dt>
<dd class="dropdown-answer">
<p>
For my Playing with Design project, I decided to choose a metronome as my object and to build an interactive how to guide using Twine. I had never used Twine before, but I chose it because it seemed both technical and creative as it allowed me to make use of my existing knowledge of HTML, CSS, and JavaScript in a new way. I built this with introductory musicians and music-lovers in mind as my users. </p>
</dd>
</div>
<div class="dropdown-item nested">
<dt class="dropdown-question">Affordances and Constraints of Twine</dt>
<dd class="dropdown-answer">
<p>As a digital tool, Twine mixes storytelling and interactivity through a "choose-your-own-adventure" style interface which I found to be a good fit for a guided, step-by-step learning process The multimodality of Twine, combined with HTML, CSS, and JS, allowed me to build a learning experience that was part story and part tool. For this project I was able to create an adjustable metronome with visual feedback and three functioning instruments (snare drum, cowbell, and triangle) for the user to interact with. <br>
I discovered that Twine's flexibility comes from how the tool supports both simple and complex workflows depending on the user's pre-existing technical abilities. The different story formats Twine allows for on the platform make it so that web development languages and syntax can be either simplified or expanded on depending on the functionality desired between text passages and the user's level of computer literacy. I initially started out with the built-in Harlowe story format in Twine but eventually had to restart my project and switch to the SugarCube story format as Harlow couldn't script the audio and interactivity I had hoped for in the design of my metronome guide.</p>
</dd>
</div>
<div class="dropdown-item nested">
<dt class="dropdown-question">Combining Tools and Problem Solving</dt>
<dd class="dropdown-answer">
<p>
To make this project work, I had to combine several technologies to create the level of interactivity I wanted. This included using pre-constructed sound files and animations from CodePen and Universal Soundbank, as well as ChatGPT and DeepSeek to help me wrap my head around the coding, formatting, and troubleshooting aspects of how everything had to come together for this to be functional.<br> 
One of the biggest challenges I faced in this was making the instruments play audio instantly when clicked. In the Harlowe format, I could call sounds via .mp3 files and the Web Audio API, but I found that audio clips would not overlap correctly which caused for a laggy user experience. In making the switch to the SugarCube story format I was able to solve this problem but had to redo much of my previous syntax and formatting as the two different story formats had different ways of putting things together. I also ran into issues embedding the exported Twine HTML into my blog. I eventually found success in making the Twine HTML document pop out into a new window as I could not accomodate rendering the file in an iframe inside the blog. <br>
If I had more time, I would fix how the Twine HTML file appears on my blog post, I would make the Twine window more responsive to different screen sizes, and lastly I would improve text styling to make things a little easier to read.</p>
</dd>
</div>
<div class="dropdown-item nested">
<dt class="dropdown-question">Pedagogical Perspectives</dt>
<dd class="dropdown-answer">
<p>Looking at my project through educational frameworks from ETEC510 helped me to apply a greater foundational and theoretical perspective in my understanding of educational design as it related to the experiential learning outcomes I wanted achieve using this digital tool. <br>
From an instructionist perspective, Twine provided a clear, step-by-step learning process where users followed structured prompts and tasks as they were instructed towards a predetermined learning objective. <br>
From a constructivist perspective, the interactive affordances of Twine encouraged learners to explore at their own pace which was valuable for my choice of object. As users were able to adjust metronome parameters and make sounds with the virutal instruments, I believe that the experimental and low-stakes learning environment I was able to create became significant in allowing users to build individualized understandings and self-confidence in using a metronome. <br>
From a constructionist perspective, the Twine I had created allows for users to create short rhythms through which users can play with making beats and sounds in a real-time context. One future improvement towards this would be to modify the project to allow users to visually display and save these rhythms on a backend server, making participation more artifactual and shareable overall. It would also be interesting to add a skill-testing checkpoint or mini-game at the end, where users could share their skills on a leaderboard amongst eachother for fun in the future, and perhaps incorporate video instruction within the Twine in order to demonstrate the examples further and provide greater mix of modalities.</p>
</dd>
</div>
<div class="dropdown-item nested">
<dt class="dropdown-question">Reflection and Future Improvements</dt>
<dd class="dropdown-answer">
<p>I found working with Twine to be challenging but insightful. Despite the learning curve and technical problems I encountered, I found its ability to present information while allowing for different outcomes/directions to take the user fascinating and engaging. Overall, I found this project to be a good exercise in patience, persistence, and educational design (especially since I chose a complex setup with audio and interactive elements beyond text). 
<br>
With that said, I see value in how approachable Twine could be as an educational tool for anyone regardless of technical ability or know-how as it offers a simple and accessible workflow allowing users to jump right in and make something interesting. Despite the challenges, I see Twine as being a powerful creative media production and educational tool for educators and students alike, and would encourage others to experiment with it regardless of any past computer or coding experience. </p>
</dd>
</div>
</div>
</div>
<!-- References Top-Level -->
<div class="dropdown-item top-level">
<dt class="dropdown-question">References</dt>
<dd class="dropdown-answer">
<div class="aside-readmore">
{#% asideReadmore {#%#}
<ul>
<li>CodePen. (n.d.). CodePen: Social development environment for front-end designers and developers. <a href="https://codepen.io" target="_blank">https://codepen.io</a></li>
<li>DeepSeek. (2025). DeepSeek [Large language model]. <a href="https://www.deepseek.com" target="_blank">https://www.deepseek.com</a></li>
<li>OpenAI. (2025). ChatGPT (GPT-5) [Large language model]. <a href="https://chat.openai.com" target="_blank">https://chat.openai.com</a></li>
<li>Twinery.org. (n.d.). Twine [Interactive storytelling tool]. <a href="https://twinery.org" target="_blank">https://twinery.org</a></li>
<li>Universal Soundbank. (n.d.). Free sound effects and music samples. <a href="https://universal-soundbank.com" target="_blank">https://universal-soundbank.com</a></li>
</ul>
{#% endasideReadmore {#%#}
</div>
</dd>
</div>
</div>

<style>
.dropdown-menu { width: 100%; font-family: Arial, sans-serif; }
.dropdown-item.top-level { margin-bottom: 1rem; }
.dropdown-item.nested { margin: 0.5rem 0; }
.dropdown-question { width: 100%; display: block; background-color: #4f6b86ff; color: white; padding: 1rem; cursor: pointer; font-weight: 500; transition: background 0.3s; box-sizing: border-box; }
.dropdown-item.nested .dropdown-question { background-color: #6b7b8cff; font-size: 0.95rem; }
.dropdown-question:hover { background-color: #1774d1ff; }
.dropdown-item.nested .dropdown-question:hover { background-color: #4287f5ff; }

/* Dropdown answer styling */
.dropdown-answer { 
width: 100%; 
max-height: 0; 
overflow: hidden; 
line-height: 1.6; 
transition: max-height 0.5s ease, padding 0.5s ease; 
padding: 0 1rem; 
box-sizing: border-box; 
}

/* Active states for nested dropdown answers ONLY when individually activated */
.dropdown-item.nested.active .dropdown-answer {
max-height: 5000px; /* Large enough to contain all content */
padding: 1rem;
}

/* Active state for top-level dropdown answers (References) */
.dropdown-item.top-level.active .dropdown-answer {
max-height: 5000px;
padding: 1rem;
}

/* Reflection submenus container - only shows/hides the container, not the content */
.reflection-submenus { 
overflow: hidden; 
max-height: 0; 
transition: max-height 0.5s ease; 
}

/* When reflection submenus are active - only shows the container */
.reflection-submenus.active {
max-height: 5000px; /* Large enough to contain all submenus */
}

/* Ensure nested dropdowns inside reflection start collapsed */
.reflection-submenus .dropdown-item.nested .dropdown-answer {
max-height: 0;
padding: 0 1rem;
}

/* Only expand when individually activated */
.reflection-submenus .dropdown-item.nested.active .dropdown-answer {
max-height: 5000px;
padding: 1rem;
}

.aside-readmore { padding: 1rem; border-left: 4px solid #4f6b86ff; }
.aside-readmore ul { padding-left: 1rem; margin: 0; }
.aside-readmore li { margin-bottom: 0.5rem; }
</style>

<script>
// Simple and reliable dropdown functionality
document.addEventListener('DOMContentLoaded', function() {
// Handle Reflection top-level dropdown
const reflectionQuestion = document.querySelector('#reflection-section .dropdown-question');
const reflectionSubmenus = document.querySelector('.reflection-submenus');
reflectionQuestion.addEventListener('click', function() {
reflectionSubmenus.classList.toggle('active');
});

// Handle nested dropdowns within Reflection
document.querySelectorAll('.dropdown-item.nested .dropdown-question').forEach(question => {
question.addEventListener('click', function(e) {
const parent = this.closest('.dropdown-item');
parent.classList.toggle('active');
e.stopPropagation(); // Prevent triggering parent click events
});
});

// Handle References top-level dropdown
const referencesQuestion = document.querySelector('.dropdown-item.top-level:not(#reflection-section) .dropdown-question');
referencesQuestion.addEventListener('click', function() {
const parent = this.closest('.dropdown-item');
parent.classList.toggle('active');
});

// Close dropdowns when clicking outside
document.addEventListener('click', function(e) {
if (!e.target.closest('.dropdown-menu')) {
// Close all nested dropdowns
document.querySelectorAll('.dropdown-item.nested').forEach(item => {
item.classList.remove('active');
});
// Close References
document.querySelectorAll('.dropdown-item.top-level:not(#reflection-section)').forEach(item => {
item.classList.remove('active');
});
// Note: We don't close the reflection submenus container here
// so users can keep the submenu list visible while interacting with individual items
}
});
});
</script>
