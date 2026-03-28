var imgState = { gender: 'male', subject: 'gamer', ai: 'chatgpt' };
var imgLabels = {
  gender: { male: 'Male', female: 'Female' },
  subject: { gamer: 'Gamer', gamecharacter: 'Game Character' },
  ai: { chatgpt: 'ChatGPT', grok: 'Grok', qwen: 'Qwen', gemini: 'Gemini' }
};

function setOption(group, val) {
  imgState[group] = val;

  document.querySelectorAll('[data-group="' + group + '"]').forEach(function(btn) {
    var active = btn.dataset.val === val;
    btn.style.background = active ? '#6366f1' : 'transparent';
    btn.style.color = active ? 'white' : 'inherit';
  });

  var img = document.getElementById('selector-img');
  var filename = imgState.gender + imgState.subject + imgState.ai + '.png';
  img.style.opacity = '0';
  setTimeout(function() {
    img.src = '/assets/images/blog/' + filename;
    img.alt = 'AI-generated image: ' + imgLabels.gender[imgState.gender] + ' ' + imgLabels.subject[imgState.subject] + ' by ' + imgLabels.ai[imgState.ai];
    img.style.opacity = '1';
  }, 150);

  document.getElementById('selector-label').textContent =
    imgLabels.gender[imgState.gender] + ' \u00B7 ' + imgLabels.subject[imgState.subject] + ' \u00B7 ' + imgLabels.ai[imgState.ai];
}