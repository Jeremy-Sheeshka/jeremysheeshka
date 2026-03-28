var imgState = { gender: 'male', subject: 'gamer', ai: 'chatgpt' };
var imgLabels = {
  gender: { male: 'Male', female: 'Female' },
  subject: { gamer: 'Gamer', gamecharacter: 'Game Character' },
  ai: { chatgpt: 'ChatGPT', grok: 'Grok', qwen: 'Qwen', gemini: 'Gemini' }
};

function setOption(group, val) {
  // 1. Update State immediately
  imgState[group] = val;

  // 2. Identify "Friction" (if the user selects female)
  var isFriction = (group === 'gender' && val === 'female');
  var delay = isFriction ? 1000 : 150; // 1 second for female, normal snap for male

  var img = document.getElementById('selector-img');
  var btnContainer = document.querySelector('[data-group="' + group + '"]');

  // 3. UI Feedback: Start the "Struggle"
  img.style.opacity = '0.3';
  img.style.filter = isFriction ? 'grayscale(1) blur(2px)' : 'none';
  
  // Highlight the button immediately so the UI feels responsive
  document.querySelectorAll('[data-group="' + group + '"] button').forEach(function(btn) {
    var active = btn.dataset.val === val;
    btn.style.background = active ? '#6366f1' : 'transparent';
    btn.style.color = active ? 'white' : 'inherit';
    
    // Add a CSS class if friction is active (for the shake effect)
    if (active && isFriction) {
        btn.style.animation = "friction-shake 0.2s ease-in-out infinite";
    } else {
        btn.style.animation = "none";
    }
  });

  // 4. Delayed Execution (The "Algorithmic Labor")
  setTimeout(function() {
    var filename = imgState.gender + imgState.subject + imgState.ai + '.png';
    
    img.src = '/assets/images/blog/' + filename;
    img.alt = 'AI-generated image: ' + imgLabels.gender[imgState.gender] + ' ' + imgLabels.subject[imgState.subject] + ' by ' + imgLabels.ai[imgState.ai];
    
    // Reset visual effects
    img.style.opacity = '1';
    img.style.filter = 'none';
    
    // Stop the button shaking
    document.querySelectorAll('[data-group="' + group + '"] button').forEach(function(btn) {
        btn.style.animation = "none";
    });

    document.getElementById('selector-label').textContent =
      imgLabels.gender[imgState.gender] + ' \u00B7 ' + imgLabels.subject[imgState.subject] + ' \u00B7 ' + imgLabels.ai[imgState.ai];
  }, delay);
}