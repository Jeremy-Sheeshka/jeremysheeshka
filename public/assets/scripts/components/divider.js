const HEIGHT = 200;
const WIDTH = 1000;
const ITERATIONS = 4;
const ROUGHNESS = 0.60;

function generate() {
  const dividerSvg = divider();
  const resultDiv = document.querySelector(".result");
  if (resultDiv) resultDiv.innerHTML = dividerSvg;
}

function divider() { 
  const segments = Math.pow(2, ITERATIONS);
  const points = line(WIDTH, displaceMap(HEIGHT, HEIGHT / 4, ROUGHNESS, segments));
  const path = convertPath(WIDTH, HEIGHT, points);
  return genSvg(WIDTH, HEIGHT, path);
}

function displaceMap(height, displace, roughness, power) {
  const points = [];
  points[0] = height / 2 + Math.random() * displace * 2 - displace;
  points[power] = height / 2 + Math.random() * displace * 2 - displace;
  displace *= roughness;
  for (let i = 1; i < power; i *= 2) {
    for (let j = power / i / 2; j < power; j += power / i) {
      points[j] = (points[j - power / i / 2] + points[j + power / i / 2]) / 2;
      points[j] += Math.random() * displace * 2 - displace;
    }
    displace *= roughness;
  }
  return points;
}

function line(width, points) {
  const sep = width / (points.length - 1);
  return points.map((val, i) => [i * sep, val]);
}

function convertPath(width, height, points) {
  const first = points.shift();
  let path = `M ${first[0]} ${first[1]}`;
  points.forEach(val => {
    path += ` L ${val[0]} ${val[1]}`;
  });
  path += ` L ${width} ${height} L 0 ${height} Z`;
  return path;
}

function genSvg(width, height, path) {
  return `
    <svg viewBox="0 0 ${width} ${height}" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
      <path fill="currentColor" d="${path}"></path>
    </svg>
  `;
}

window.addEventListener("DOMContentLoaded", generate);

const observer = new MutationObserver(() => generate());
observer.observe(document.documentElement, {
  attributes: true,
  attributeFilter: ["data-theme"],
});
