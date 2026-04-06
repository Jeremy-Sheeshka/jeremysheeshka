import React, { useRef, useEffect } from 'react';

// ============================================================
// SURVIVANCE — A JRPG Against Erasure (GBA Edition v10.1)
// Features: Community Hearts Economy, Empathy Locks, Glowing Exits
// Native GBA Resolution: 240x160 (Scaled 3x to 720x480)
// ============================================================

const GBA_W = 240;
const GBA_H = 160;
const SCALE = 3; 
const TILE = 16;

// GBA-inspired Palette
const PAL = {
  bg: '#283030', text: '#202020', white: '#f8f8f8',
  boxBorder: '#506880', boxBg: '#e8f0f8',
  grass: '#489848', dirt: '#a07850', wall: '#686868',
  water: '#3868c8', highlight: '#c0d0d8'
};

const PRIDE = ['#ff0018','#ffa52c','#ffff41','#008018','#0000f9','#86007d'];
const T = { EMPTY:0, FLOOR:1, WALL:2, GATE:3, HAZARD:4, EXIT:10, GRASS:11, DIRT:12, TREE:13 };

// ── DIALOGUE & STORY DATA ────────────────────────────────────
const DIALOGUE = {
  cutscene_1: { speaker: 'Narrator', pages: ['The year is 2026.', 'The game industry churns out hit after hit, but something is missing...'], portrait: 'narrator', next: 'cutscene_2' },
  cutscene_2: { speaker: 'Narrator', pages: ['You are a young developer who refuses to stay silent.', 'Today, you enter the Whitewashed Studio.'], portrait: 'narrator', next: 'cutscene_3' },
  cutscene_3: { speaker: 'Player', pages: ['I\'m ready.', 'No more compromising.'], portrait: 'player', next: 'intro' },

  intro: { speaker:'Narrator', pages:['You step into the Whitewashed Studio.', 'The fluorescent lights hum with the energy of a thousand unspoken compromises.', 'Posters celebrate "innovation" — but whose?'], next:'intro2', portrait:'narrator' },
  intro2: { speaker:'Narrator', pages:['The industry generates billions, yet stories told remain remarkably narrow.', 'Marginalized voices are systematically excluded... not by accident, but by design.'], next:'intro3', portrait:'narrator' },
  intro3: { speaker:'Narrator', pages:['Move with Arrow Keys or WASD.', 'Press Z or ENTER while facing characters to interact.', 'Watch your Stress meter. If it gets too high, you will be overwhelmed and need to rest.', 'Build your Community (♥) by supporting others. It boosts your resilience.'], portrait:'narrator' },

  npc_kai: { speaker:'Kai', pages:['Hey. You\'re new here?', 'I\'ve been trying to pitch a game about my community for two years.', 'They keep saying it\'s "too niche." Funny how stories about straight white men are never "niche," right?'], next:'npc_kai2', portrait:'kai' },
  
  // The 'ties' array dictates the reward: 'kai' for empathy, null for neutral response
  npc_kai2: { speaker:'Kai', pages:['I\'m not looking for someone to fight my battles.', 'Just... someone who gets it. Who\'ll stand with me.'], flag:'met_kai', choices:['I\'m here.','That sounds exhausting.'], ties:['kai', null], portrait:'kai' },

  npc_dev: { speaker:'Dev', pages:['Another diversity initiative. They brought me in to "consult" but won\'t let me touch the actual design.', 'Tokenism with extra steps.'], next:'npc_dev2', portrait:'dev' },
  npc_dev2: { speaker:'Dev', pages:['Kishonna Gray writes about how Black gamers build community spaces despite hostility.', 'That\'s what I\'m trying to do here. Build something real, even inside this machine.'], flag:'met_dev', tie:'dev', portrait:'dev' },

  npc_ada: { speaker:'Ada', pages:['I\'ve been crunching for six months on a game about queer joy.', 'The publisher wants me to "tone it down for broader appeal."'], next:'npc_ada2', portrait:'ada' },
  npc_ada2: { speaker:'Ada', pages:['Queerness isn\'t just a rainbow skin. It\'s in the systems.', 'How a game handles consent, how it measures progress.', 'If the mechanics are straight, a rainbow flag means nothing.'], flag:'met_ada', tie:'ada', portrait:'ada' },

  npc_mentor: { speaker:'Elder', pages:['The tools of erasure evolve, but the pattern is ancient: assimilate, flatten, package, sell.', 'What they call "inclusion" is often just a more efficient form of extraction.'], next:'npc_mentor2', portrait:'mentor' },
  npc_mentor2: { speaker:'Elder', pages:['Survivance — Gerald Vizenor\'s word — means more than survival.', 'It\'s the active presence of Indigenous agency. Not just enduring, but creating.', 'Take this key. The path to the Swamp is open to you.'], flag:'got_key', tie:'mentor', portrait:'mentor' },

  gate_locked: { speaker:'Narrator', pages:['A knowledge gate blocks the path.', 'You must speak with the Elder in the center of the room to proceed.'], portrait:'narrator' },
  gate_open: { speaker:'Narrator', pages:['You use the knowledge granted by the Elder.', 'The gate unlocks. The fog of the Straightwashing Swamp lies ahead.'], flag:'door_open', portrait:'narrator' },

  encounter_wb: { speaker:'Whitewasher', pages:['"We love your work! But could you make the protagonist more... universal?', 'Less specific? We want everyone to see themselves in this character."'], next:'encounter_wb2', portrait:'whitewasher' },
  encounter_wb2: { speaker:'Narrator', pages:['"Universal" means white. "Relatable" means straight.', 'The Whitewasher doesn\'t see their bias. You cannot change their mind.', 'You can only set your boundary.'], triggerCombat:'wb', portrait:'narrator' },

  encounter_harasser: { speaker:'Harasser', pages:['"You\'re ruining games. Go back to making walking simulators.', 'Real gamers don\'t want your politics in our hobby."'], next:'encounter_harasser2', portrait:'harasser' },
  encounter_harasser2: { speaker:'Narrator', pages:['The Harasser feeds on reaction. Engagement is their oxygen.', 'Sometimes the bravest boundary is simply walking away.', 'You don\'t owe anyone a debate about your right to exist.'], triggerCombat:'harass', portrait:'narrator' },

  zone2_enter: { speaker:'Narrator', pages:['You enter the Straightwashing Swamp. Progress slows here.', 'Traditional "gamer values" — speed, accumulation, difficulty-as-virtue — are the hazards now.', 'The swamp teaches: not everything valuable is efficient.'], flag:'entered_swamp', portrait:'narrator' },
  npc_sage: { speaker:'Sage', pages:['Nostalgia — it pulls you backward, tells you things were better before.', 'Before what? Before people like us were visible?', 'That\'s not nostalgia. That\'s erasure wearing a warm sweater.'], flag:'met_sage', tie:'sage', portrait:'sage' },
  npc_river: { speaker:'River', pages:['You can\'t speedrun understanding. You can\'t optimize empathy.', 'The fog is here to teach you that not everything valuable is efficient.'], flag:'met_river', tie:'river', portrait:'river' },
  
  encounter_sw: { speaker:'Straightwasher', pages:['"I love this indie game! The mechanics are so tight, and the 90s nostalgia is perfect.', 'What do you mean it\'s a queer story? I didn\'t see any of that. You\'re just projecting."'], next:'encounter_sw2', portrait:'straightwasher' },
  encounter_sw2: { speaker:'Narrator', pages:['They erase the core identity of the work to make it palatable for themselves.', 'This is straightwashing. Will you push back or walk away?'], triggerCombat:'sw', portrait:'narrator' },

  qargi_enter: { speaker:'The Circle', pages:['Welcome to the Digital Qargi — a communal space modeled on the Iñupiaq gathering house.', 'Here, knowledge is shared in circles, not hierarchies.', 'Everyone faces the center. Everyone is heard.'], next:'qargi_enter2', portrait:'circle' },
  qargi_enter2: { speaker:'The Circle', pages:['This is not a victory screen. There is no boss to defeat, no score to maximize.', 'Your community ties — the connections you\'ve made — are the real achievement.', 'Survivance continues beyond this game.'], next:'qargi_enter3', portrait:'circle' },
  qargi_enter3: { speaker:'The Circle', pages:['Seek out: Kishonna Gray, Adrienne Shaw, Gerald Vizenor, TreaAndrea Russworm, Bo Ruberg.', 'Read. Play differently. Build community. Practice survivance.'], flag:'completed', portrait:'circle' },

  overwhelm: { speaker:'Your Community', pages:['You were overwhelmed. That\'s not weakness — it\'s your body\'s wisdom.', 'Rest is resistance. Your community holds space for you.', 'When you\'re ready, the path remains.'], portrait:'narrator' },
};

// ── COMBAT DATA ──────────────────────────────────────────────
const ACTIONS = [
  { id:'boundary', name:'Boundary',  desc:'Protect your peace.' },
  { id:'empathy',  name:'Empathy',   desc:'Draw on community.' },
  { id:'educate',  name:'Educate',   desc:'Share systemic facts.' },
  { id:'leave',    name:'Leave',     desc:'Walk away.' },
];

const ENEMIES = {
  wb: { 
    id:'whitewasher', name:'The Whitewasher', 
    aggression: 0.5, rejectsBoundary: false,
    responses: {
      boundary: [
        "I'm just trying to give you constructive professional feedback.",
        "There's no need to be defensive. It's just business."
      ],
      empathy: [
        "Niche communities are great, but they don't scale to AAA sales.",
        "You need to think bigger than just your own demographic."
      ],
      educate: {
        player: [
          "Adrienne Shaw argues humanity shouldn't require a business case.",
          "Straightwashing erases authentic queer joy for 'broader appeal'.",
          "We need structural change, not just PR band-aids."
        ],
        enemy: [
          "That's lovely, but investors only read return on investment.",
          "We can't alienate the core demographic. Be realistic.",
          "You're being too radical. Change takes decades."
        ],
        stress: [15, 20, 25]
      }
    }
  },
  harass: { 
    id:'harasser', name:'The Harasser', 
    aggression: 0.9, rejectsBoundary: true,
    responses: {
      boundary: [
        "Ignoring me won't change the fact that you don't belong here!",
        "Coward! You can't even debate me in the marketplace of ideas!"
      ],
      empathy: [
        "Running back to your echo chamber? Typical.",
        "Your little hugbox won't protect your game from real reviews."
      ],
      educate: {
        player: [
          "Actually, 57% of young gamers are people of color.",
          "Games are pedagogical tools that reinforce ideologies.",
          "Erasure in games is a documented form of systemic violence."
        ],
        enemy: [
          "Fake stats! Go back to making walking simulators!",
          "Stop forcing your garbage into our hobby!",
          "Nobody cares about your academic buzzwords!"
        ],
        stress: [20, 25, 34]
      }
    }
  },
  sw: { 
    id:'straightwasher', name:'The Straightwasher', 
    aggression: 0.7, rejectsBoundary: false,
    responses: {
      boundary: [
        "Why does everything have to be a political statement?",
        "I just think romance distracts from the pure gameplay."
      ],
      empathy: [
        "I don't care about the creator's identity, just the mechanics.",
        "You're reading too much into a simple video game."
      ],
      educate: {
        player: [
          "Ignoring queer narratives is an active choice to erase them.",
          "Consent culture in games challenges colonial mechanics.",
          "Straightwashing centers heteronormative comfort over truth."
        ],
        enemy: [
          "It's just a game, stop making it about sexuality!",
          "I'm evaluating the game on its objective merits, not politics.",
          "Real gamers only care about the difficulty and framerate."
        ],
        stress: [15, 25, 30]
      }
    }
  }
};

// ── ZONES & EXITS ────────────────────────────────────────────
const ZONES = {
  studio: {
    name: 'Whitewashed Studio', w: 20, h: 11,
    start: { x: 10*TILE, y: 8*TILE },
    grid: [
      [2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],
      [2,1,1,1,1,1,2,1,1,1,1,1,1,1,1,1,1,1,1,2],
      [2,1,1,1,1,1,2,1,1,1,1,1,1,1,1,1,1,1,1,2],
      [2,1,1,1,1,1,2,1,1,1,1,1,1,1,1,1,1,1,1,2],
      [2,2,2,1,2,2,2,2,2,2,1,1,1,1,1,1,1,1,1,2],
      [2,1,1,1,1,1,1,1,1,1,1,1,1,2,2,2,2,1,2,2],
      [2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2],
      [2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2],
      [2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2],
      [2,2,2,2,2,2,2,2,2,3,2,2,2,2,2,2,2,2,2,2],
      [2,0,0,0,0,0,0,0,0,10,0,0,0,0,0,0,0,0,0,2]
    ],
    npcs: [
      { c:3, r:2, id:'kai', dlg:'npc_kai' },
      { c:16, r:2, id:'dev', dlg:'npc_dev' },
      { c:16, r:7, id:'ada', dlg:'npc_ada' },
      { c:9, r:7, id:'mentor', dlg:'npc_mentor' },
      { c:6, r:5, id:'whitewasher', dlg:'encounter_wb' }, 
      { c:16, r:4, id:'harasser', dlg:'encounter_harasser' } 
    ],
    interacts: [
      { c:9, r:9, check: (flags) => { if (flags.has('door_open')) return null; return flags.has('got_key') ? 'gate_open' : 'gate_locked'; } }
    ],
    exits: [ { c:9, r:10, dest:'swamp', spawnX: 9*TILE, spawnY: 1*TILE } ]
  },
  swamp: {
    name: 'Straightwashing Swamp', w: 20, h: 10,
    start: { x: 9*TILE, y: 1*TILE },
    grid: [
      [13,13,13,13,13,13,13,13,13,10,13,13,13,13,13,13,13,13,13,13],
      [13,11,11,11,11,11,11,11,11,12,11,11,11,11,11,11,11,11,11,13],
      [13,11,11,11,11,11,11,11,11,12,12,11,11,11,11,11,11,11,11,13],
      [13,11,11,11,11,11,11,11,11,11,12,12,12,11,11,11,11,11,11,13],
      [13,11,11,11,11,11,11,11,11,11,11,11,12,12,11,11,11,11,11,13],
      [13,11,11,11,11,11,11,11,11,11,11,11,11,12,11,11,11,11,11,13],
      [13,11,11,11,11,11,11,11,11,11,11,11,11,12,11,11,11,11,11,13],
      [13,11,11,11,11,11,11,11,11,11,11,11,11,12,12,11,11,11,11,13],
      [13,11,11,11,11,11,11,11,11,11,11,11,11,11,12,12,10,11,11,13],
      [13,13,13,13,13,13,13,13,13,13,13,13,13,13,13,13,13,13,13,13]
    ],
    npcs: [ 
      { c:10, r:4, id:'river', dlg:'npc_river' },
      { c:5, r:7, id:'sage', dlg:'npc_sage' },
      { c:15, r:7, id:'straightwasher', dlg:'encounter_sw' } 
    ],
    interacts: [ { c:10, r:1, check: (flags) => flags.has('entered_swamp') ? null : 'zone2_enter' } ],
    exits: [ 
      { c:16, r:8, dest:'qargi', spawnX: 7*TILE, spawnY: 1*TILE },
      { c:9, r:0, dest:'studio', spawnX: 9*TILE, spawnY: 9*TILE }
    ]
  },
  qargi: {
    name: 'Digital Qargi', w: 15, h: 10,
    start: { x: 7*TILE, y: 8*TILE },
    grid: [
      [0,0,0,0,0,0,2,10,2,0,0,0,0,0,0], 
      [0,0,0,0,1,1,1,1,1,1,1,0,0,0,0],
      [0,0,0,1,1,1,1,1,1,1,1,1,0,0,0],
      [0,0,1,1,1,1,1,1,1,1,1,1,1,0,0],
      [0,0,1,1,1,1,1,1,1,1,1,1,1,0,0],
      [0,0,1,1,1,1,1,1,1,1,1,1,1,0,0],
      [0,0,0,1,1,1,1,1,1,1,1,1,0,0,0],
      [0,0,0,0,1,1,1,1,1,1,1,0,0,0,0],
      [0,0,0,0,0,0,0,1,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    ],
    npcs: [ { c:7, r:4, id:'circle', dlg:'qargi_enter' } ],
    interacts: [], 
    exits: [ { c:7, r:0, dest:'swamp', spawnX: 16*TILE, spawnY: 7*TILE } ]
  }
};

// ── ENGINE ───────────────────────────────────────────────────
function createGame(canvas) {
  const ctx = canvas.getContext('2d');
  canvas.width = GBA_W * SCALE; canvas.height = GBA_H * SCALE;
  ctx.imageSmoothingEnabled = false;

  const keys = new Set(); const justDown = new Set();
  const onKey = (e, isDown) => {
    if (isDown && !keys.has(e.key)) justDown.add(e.key);
    if (isDown) keys.add(e.key); else keys.delete(e.key);
    const trackedKeys = ['ArrowUp','ArrowDown','ArrowLeft','ArrowRight',' ','Enter','z','Z','e','E','x','X','w','W','a','A','s','S','d','D'];
    if (trackedKeys.includes(e.key)) e.preventDefault();
  };
  window.addEventListener('keydown', e => onKey(e, true)); window.addEventListener('keyup', e => onKey(e, false));
  const isDown = (...k) => k.some(x => keys.has(x)); const wasDown = (...k) => k.some(x => justDown.has(x));

  let state = 'TITLE'; 
  let introTimer = 0;
  
  let zoneId = 'studio'; let zone = ZONES[zoneId];
  let px = zone.start.x, py = zone.start.y;
  let pdir = 'down', pframe = 0, pmoving = false;
  let camera = { x:0, y:0 };
  let flags = new Set(); let ties = new Set();
  
  let stress = 0; 
  let displayStress = 0; 
  let hearts = 0; // Explicitly tracking consumable hearts
  let resilience = 1; 

  let dlg = null; let dlgChoiceSel = 0;
  let combat = null; let overwhelmTimer = 0;

  camera.x = Math.max(0, Math.min(zone.w*TILE - GBA_W, px - GBA_W/2));
  camera.y = Math.max(0, Math.min(zone.h*TILE - GBA_H, py - GBA_H/2));

  const paginateText = (text, maxW, maxLines) => {
    ctx.font = 'bold 10px monospace'; 
    const words = text.split(' '); const pages = [];
    let currentLines = []; let currentLine = '';

    for (let w of words) {
      let testLine = currentLine + w + ' ';
      if (ctx.measureText(testLine).width > maxW && currentLine !== '') {
        currentLines.push(currentLine.trim()); currentLine = w + ' ';
        if (currentLines.length === maxLines) { pages.push(currentLines); currentLines = []; }
      } else currentLine = testLine;
    }
    if (currentLine) currentLines.push(currentLine.trim());
    if (currentLines.length > 0) pages.push(currentLines);
    if (pages.length === 0) pages.push(['...']);
    return pages;
  };

  const getTile = (c, r) => (r >= 0 && r < zone.grid.length && c >= 0 && c < zone.grid[0].length) ? zone.grid[r][c] : 0;
  const solid = (c, r) => {
    const t = getTile(c,r);
    if ([T.WALL, T.TREE, T.EMPTY].includes(t)) return true;
    if (t === T.GATE && !flags.has('door_open')) return true;
    if (zone.npcs.find(n => n.c === c && n.r === r)) return true;
    return false;
  };

  function startDialogue(dialogueKey) {
    const node = DIALOGUE[dialogueKey]; if (!node) return;
    const maxW = (node.portrait && node.portrait !== 'none' && state !== 'CUTSCENE') ? (GBA_W - 8 - 65) : (GBA_W - 28);
    const generatedPages = paginateText(node.text || node.pages.join(' '), maxW, 3); 
    dlg = { node: node, pages: generatedPages, pageI: 0, charI: 0, face: node.portrait };
    dlgChoiceSel = 0;
    if (state === 'GAME') state = 'DIALOGUE';
  }

  function initCombat(encId) {
    const enemyData = ENEMIES[encId]; if (!enemyData) return;
    combat = {
      enemyId: encId,
      enemy: enemyData,
      playerStress: stress, 
      actionCounts: { boundary: 0, empathy: 0, educate: 0 },
      phase: 'SELECT', 
      turnCount: 0,
      actionSel: 0,
      pendingDmg: 0,
      dmgApplied: false
    };
    state = 'COMBAT';
  }

  function doPlayerAction(actionId) {
    if (actionId === 'leave') {
      combat.phase = 'ENDED'; stress = combat.playerStress; state = 'GAME'; combat = null; return;
    }

    let playerText = ''; let enemyText = ''; let dmg = 0;
    const count = combat.actionCounts[actionId];
    const enemyData = combat.enemy.responses[actionId];
    const basePower = Math.floor(10 + (combat.enemy.aggression || 0.5) * 15);

    if (actionId === 'boundary') {
      if (combat.enemy.rejectsBoundary) {
         playerText = `You try to set a boundary, but they push through!`;
         dmg = Math.floor(basePower * 1.5);
      } else {
         playerText = `You establish a firm boundary.`;
         dmg = Math.floor(basePower * 0.2);
      }
      enemyText = enemyData[count % enemyData.length];
    } else if (actionId === 'empathy') {
      // HEART MECHANIC: Empathy consumes a heart!
      hearts--; 
      playerText = `You draw strength from your community (-1 ♥).`;
      dmg = -20;
      enemyText = enemyData[count % enemyData.length];
    } else if (actionId === 'educate') {
      playerText = `You say: "${enemyData.player[count % enemyData.player.length]}"`;
      enemyText = enemyData.enemy[count % enemyData.enemy.length];
      dmg = enemyData.stress[count % enemyData.stress.length]; 
    }

    combat.actionCounts[actionId]++;
    combat.pendingDmg = dmg;
    combat.dmgApplied = false;
    
    let stressMsg = dmg > 0 ? `(+${dmg} Stress)` : `(${dmg} Stress)`;
    let combinedText = `${playerText} ${combat.enemy.name} counters: "${enemyText}" ${stressMsg}`;
    
    combat.pages = paginateText(combinedText, GBA_W - 28, 3);
    combat.pageI = 0;
    combat.charI = 0;
    combat.phase = 'RESULT';
    combat.turnCount++;
  }

  // ── UPDATE LOGIC ──
  function update() {
    let targetStress = (state === 'COMBAT' && combat) ? combat.playerStress : stress;
    if (displayStress < targetStress) {
      displayStress = Math.min(targetStress, displayStress + 1.5); 
    } else if (displayStress > targetStress) {
      displayStress = Math.max(targetStress, displayStress - 1.5); 
    }

    if (state === 'TITLE') {
      introTimer++;
      if (wasDown('Enter',' ','z','Z','e','E')) { state = 'CUTSCENE'; startDialogue('cutscene_1'); }
    } 
    else if (state === 'COMBAT') {
      if (combat.phase === 'SELECT') {
        
        if (wasDown('ArrowUp','w','W')) { if (combat.actionSel >= 2) combat.actionSel -= 2; } 
        else if (wasDown('ArrowDown','s','S')) { if (combat.actionSel <= 1) combat.actionSel += 2; } 
        else if (wasDown('ArrowLeft','a','A')) { if (combat.actionSel % 2 !== 0) combat.actionSel -= 1; } 
        else if (wasDown('ArrowRight','d','D')) { if (combat.actionSel % 2 === 0) combat.actionSel += 1; }

        if (wasDown('Enter',' ','z','Z','e','E')) {
          const selectedAction = ACTIONS[combat.actionSel].id;
          // Prevent selecting Empathy if out of hearts
          if (selectedAction === 'empathy' && hearts <= 0) {
             // Block selection
          } else {
             doPlayerAction(selectedAction);
          }
        }

      } else if (combat.phase === 'RESULT') {
        const currentLines = combat.pages[combat.pageI];
        const totalChars = currentLines.join(' ').length;
        
        if (combat.charI < totalChars) {
            combat.charI += 1.5; 
            if (wasDown('Enter',' ','z','Z','e','E')) combat.charI = totalChars;
        } 
        
        if (combat.charI >= totalChars) {
            const isLastPage = combat.pageI >= combat.pages.length - 1;
            if (isLastPage && !combat.dmgApplied) {
                combat.playerStress = Math.max(0, Math.min(100, combat.playerStress + combat.pendingDmg));
                combat.dmgApplied = true;
            }

            if (wasDown('Enter',' ','z','Z','e','E')) {
                if (!isLastPage) {
                    combat.pageI++;
                    combat.charI = 0;
                } else {
                    if (combat.turnCount >= 4 || combat.playerStress >= 100) {
                        combat.phase = 'ENDED'; stress = combat.playerStress; state = 'GAME'; combat = null;
                    } else {
                        combat.phase = 'SELECT';
                    }
                }
            }
        }
      }
    }
    else if (state === 'DIALOGUE' || state === 'CUTSCENE') {
      const currentLines = dlg.pages[dlg.pageI];
      const totalChars = currentLines.join(' ').length;
      
      if (dlg.charI < totalChars) {
        dlg.charI += 1; 
        if (wasDown('Enter',' ','z','Z','e','E')) dlg.charI = totalChars;
      } else {
        const isLastPage = dlg.pageI >= dlg.pages.length - 1;
        const hasChoices = isLastPage && dlg.node.choices;

        if (hasChoices) {
          if (wasDown('ArrowUp','w','W')) dlgChoiceSel = Math.max(0, dlgChoiceSel - 1);
          if (wasDown('ArrowDown','s','S')) dlgChoiceSel = Math.min(dlg.node.choices.length - 1, dlgChoiceSel + 1);
        }

        if (wasDown('Enter',' ','z','Z','e','E')) {
          if (!isLastPage) {
            dlg.pageI++; dlg.charI = 0;
          } else {
            if (dlg.node.flag) flags.add(dlg.node.flag);
            
            // Add ties based on choices or standard dialogue
            if (dlg.node.choices && dlg.node.ties && dlg.node.ties[dlgChoiceSel]) {
               const newTie = dlg.node.ties[dlgChoiceSel];
               if (!ties.has(newTie)) {
                 ties.add(newTie);
                 hearts++; // Gain 1 Community Heart
                 resilience = 1 + ties.size * 0.1;
               }
            } else if (!dlg.node.choices && dlg.node.tie) {
               if (!ties.has(dlg.node.tie)) {
                 ties.add(dlg.node.tie);
                 hearts++; // Gain 1 Community Heart
                 resilience = 1 + ties.size * 0.1;
               }
            }
            
            const nextNode = dlg.node.next;
            const combatTrigger = dlg.node.triggerCombat;

            dlg = null;
            if (combatTrigger) initCombat(combatTrigger);
            else if (nextNode) {
              if (nextNode === 'intro') { state = 'GAME'; startDialogue('intro'); } 
              else startDialogue(nextNode);
            } 
            else { state = 'GAME'; if (flags.has('completed')) state = 'END'; }
          }
        }
      }
    } 
    else if (state === 'GAME') {
      if (overwhelmTimer > 0) {
        overwhelmTimer--;
        if (overwhelmTimer <= 0) startDialogue('overwhelm');
      } else {
        let dx = 0, dy = 0;
        if (isDown('ArrowUp','w','W')) { dy = -1.5; pdir = 'up'; }
        else if (isDown('ArrowDown','s','S')) { dy = 1.5; pdir = 'down'; }
        else if (isDown('ArrowLeft','a','A')) { dx = -1.5; pdir = 'left'; }
        else if (isDown('ArrowRight','d','D')) { dx = 1.5; pdir = 'right'; }

        pmoving = dx !== 0 || dy !== 0;
        if (pmoving) {
          pframe = (pframe + 0.1) % 4;
          const nc = Math.floor((px + dx + 8) / TILE), nr = Math.floor((py + dy + 12) / TILE);
          if (!solid(nc, Math.floor((py+12)/TILE))) px += dx;
          if (!solid(Math.floor((px+8)/TILE), nr)) py += dy;
        } else pframe = 0;

        const pc = Math.floor((px+8)/TILE), pr = Math.floor((py+8)/TILE);
        const exit = zone.exits.find(e => e.c === pc && e.r === pr);
        if (exit) {
          zoneId = exit.dest; zone = ZONES[zoneId]; px = exit.spawnX; py = exit.spawnY;
          
          camera.x = Math.max(0, Math.min(zone.w*TILE - GBA_W, px - GBA_W/2));
          camera.y = Math.max(0, Math.min(zone.h*TILE - GBA_H, py - GBA_H/2));

          const enterTrigger = zone.interacts.find(i => i.check && i.c === pc && i.r === pr);
          if (enterTrigger) { const res = enterTrigger.check(flags); if (res) startDialogue(res); }
        }
        
        if (stress > 0 && !pmoving) stress = Math.max(0, stress - 0.02 * resilience);
        if (stress >= 100) { 
            overwhelmTimer = 180; 
            px = zone.start.x; py = zone.start.y; 
            stress = 40; displayStress = 40; 
        }

        if (wasDown('Enter',' ','z','Z','e','E')) {
          let ix = px + 8, iy = py + 8; 
          if (pdir === 'up') iy -= 14; if (pdir === 'down') iy += 14;
          if (pdir === 'left') ix -= 14; if (pdir === 'right') ix += 14;
          
          let closest = null, minDist = 18; 
          zone.npcs.forEach(n => { let d = Math.hypot(ix - (n.c * TILE + 8), iy - (n.r * TILE + 8)); if (d < minDist) { minDist = d; closest = n.dlg; } });
          zone.interacts.forEach(i => { let d = Math.hypot(ix - (i.c * TILE + 8), iy - (i.r * TILE + 8)); if (d < minDist) { const res = i.check(flags); if (res) { minDist = d; closest = res; } } });
          if (closest) startDialogue(closest);
        }
      }
    }

    if (state === 'GAME' || state === 'DIALOGUE' || state === 'CUTSCENE' || state === 'COMBAT') {
        camera.x = Math.max(0, Math.min(zone.w*TILE - GBA_W, px - GBA_W/2));
        camera.y = Math.max(0, Math.min(zone.h*TILE - GBA_H, py - GBA_H/2));
    }

    justDown.clear();
  }

  // ── DRAWING LOGIC ──
  function drawProceduralFace(id, x, y) {
    ctx.fillStyle = PAL.boxBorder; ctx.fillRect(x, y, 40, 40);
    if (id === 'narrator') { ctx.fillStyle = '#101020'; ctx.fillRect(x+2, y+2, 36, 36); ctx.fillStyle = '#404060'; ctx.fillRect(x+6, y+10, 28, 4); ctx.fillRect(x+6, y+18, 20, 4); ctx.fillRect(x+6, y+26, 24, 4); return; }
    
    ctx.fillStyle = (id === 'dev' || id === 'ada' || id === 'whitewasher') ? '#b88a68' : '#f0d8b8'; ctx.fillRect(x+8, y+8, 24, 24); 
    
    let hairColor = PRIDE[0];
    if (id === 'player') hairColor = PRIDE[1]; else if (id === 'kai') hairColor = PRIDE[4]; else if (id === 'ada') hairColor = PRIDE[5];
    else if (id === 'mentor') hairColor = '#a0a0a0'; else if (id === 'circle') hairColor = PRIDE[3]; else if (id === 'whitewasher') hairColor = '#ccaa66'; else if (id === 'harasser') hairColor = '#ff4444'; else if (id === 'straightwasher') hairColor = '#88aaff'; else ctx.fillStyle = PRIDE[0];
    ctx.fillStyle = hairColor; ctx.fillRect(x+6, y+4, 28, 12); 
    
    ctx.fillStyle = '#000'; ctx.fillRect(x+12, y+16, 4, 4); ctx.fillRect(x+24, y+16, 4, 4);
    if (id === 'player') { for(let i=0; i<PRIDE.length; i++){ ctx.fillStyle = PRIDE[i]; ctx.fillRect(x+6, y+12 + (i*0.5), 28, 1); } }
  }

  function drawCharacterSprite(ctx, dx, dy, id, dir, isMoving, frame) {
    ctx.fillStyle = 'rgba(0,0,0,0.4)'; ctx.beginPath(); ctx.ellipse(dx+8, dy+14, 6, 3, 0, 0, Math.PI*2); ctx.fill();
    dy -= (isMoving && Math.floor(frame) % 2 !== 0) ? 1 : 0; 

    ctx.fillStyle = (id === 'dev' || id === 'ada' || id === 'whitewasher') ? '#b88a68' : '#f0d8b8'; ctx.fillRect(dx + 4, dy + 2, 8, 8); 
    
    let hairColor = PRIDE[0];
    if (id === 'player') hairColor = PRIDE[1]; else if (id === 'kai') hairColor = PRIDE[4]; else if (id === 'ada') hairColor = PRIDE[5];
    else if (id === 'dev') hairColor = PRIDE[0]; else if (id === 'mentor') hairColor = '#a0a0a0'; else if (id === 'circle') hairColor = PRIDE[3];
    else if (id === 'sage') hairColor = PRIDE[2]; else if (id === 'river') hairColor = PRIDE[4]; else if (id === 'flame') hairColor = PRIDE[0];
    else if (id === 'whitewasher') hairColor = '#ccaa66'; else if (id === 'harasser') hairColor = '#ff4444'; else if (id === 'straightwasher') hairColor = '#88aaff';

    ctx.fillStyle = hairColor; ctx.fillRect(dx + 3, dy + 1, 10, 4); ctx.fillRect(dx + 3, dy + 4, 2, 4); ctx.fillRect(dx + 11, dy + 4, 2, 4); 

    ctx.fillStyle = '#000'; 
    if (dir === 'down') { ctx.fillRect(dx+5, dy+5, 2, 2); ctx.fillRect(dx+9, dy+5, 2, 2); }
    else if (dir === 'left') { ctx.fillRect(dx+4, dy+5, 2, 2); }
    else if (dir === 'right') { ctx.fillRect(dx+10, dy+5, 2, 2); }

    let bodyColor = PRIDE[3]; 
    if (id === 'player') bodyColor = '#404040'; else if (id === 'kai') bodyColor = PRIDE[5]; else if (id === 'ada') bodyColor = PRIDE[1]; 
    else if (id === 'harasser') bodyColor = '#441111'; else if (id === 'straightwasher') bodyColor = '#5555aa';
    ctx.fillStyle = bodyColor; ctx.fillRect(dx + 4, dy + 10, 8, 5);

    if (id === 'player') { const strH = 5 / PRIDE.length; for (let i=0; i<PRIDE.length; i++) { ctx.fillStyle = PRIDE[i]; ctx.fillRect(dx + 4, dy + 10 + (i*strH), 8, strH+0.5); } }

    ctx.fillStyle = '#222'; 
    if (isMoving && Math.floor(frame) % 2 !== 0) {
      if (dir === 'left' || dir === 'right') ctx.fillRect(dx + 6, dy + 15, 4, 3);
      else { ctx.fillRect(dx + 4, dy + 14, 3, 3); ctx.fillRect(dx + 9, dy + 15, 3, 3); }
    } else { ctx.fillRect(dx + 4, dy + 15, 3, 3); ctx.fillRect(dx + 9, dy + 15, 3, 3); }
  }

  function draw() {
    ctx.save(); ctx.scale(SCALE, SCALE); ctx.clearRect(0,0,GBA_W, GBA_H);

    if (state === 'TITLE') {
      ctx.fillStyle = '#0a0a14'; ctx.fillRect(0,0,GBA_W, GBA_H);
      const t = Date.now()/1000;
      for (let i=0; i<PRIDE.length; i++) {
        ctx.strokeStyle = PRIDE[i]+'33'; ctx.lineWidth = 2; ctx.beginPath();
        for (let x=0; x<GBA_W; x+=4) { const y = GBA_H/2 + Math.sin(x/40+t+i)*(15+i*5); x===0?ctx.moveTo(x,y):ctx.lineTo(x,y); } ctx.stroke();
      }
      ctx.fillStyle = '#fff'; ctx.font = '22px "VT323", monospace'; ctx.textAlign = 'center'; ctx.fillText("SURVIVANCE", GBA_W/2, GBA_H/2 - 15);
      ctx.fillStyle = '#aaa'; ctx.font = '10px monospace'; ctx.fillText("A Representational Audit", GBA_W/2, GBA_H/2 + 5);
      if (Math.floor(Date.now() / 400) % 2 === 0) { ctx.fillStyle = PRIDE[0]; ctx.fillText("Press Z or ENTER", GBA_W/2, GBA_H - 25); }
      ctx.restore(); return;
    }

    if (state === 'END') {
      ctx.fillStyle = '#000'; ctx.fillRect(0,0,GBA_W, GBA_H);
      ctx.fillStyle = '#fff'; ctx.font = '14px monospace'; ctx.textAlign = 'center'; ctx.fillText("SURVIVANCE", GBA_W/2, GBA_H/2 - 15);
      ctx.font = '10px monospace'; ctx.fillStyle = '#888'; ctx.fillText("A JRPG Against Erasure", GBA_W/2, GBA_H/2 + 5);
      ctx.fillStyle = PRIDE[4]; ctx.fillText("Thank you for playing.", GBA_W/2, GBA_H/2 + 25);
      ctx.restore(); return;
    }

    if (state === 'GAME' || state === 'DIALOGUE') {
      ctx.translate(-Math.floor(camera.x), -Math.floor(camera.y));
      for (let r=0; r<zone.grid.length; r++) {
        for (let c=0; c<zone.grid[r].length; c++) {
          const t = zone.grid[r][c]; const dx = c*TILE, dy = r*TILE;
          if (dx < camera.x-TILE || dx > camera.x+GBA_W || dy < camera.y-TILE || dy > camera.y+GBA_H) continue;

          if (t === T.FLOOR) { ctx.fillStyle = PAL.boxBg; ctx.fillRect(dx,dy,TILE,TILE); ctx.strokeStyle = PAL.highlight; ctx.strokeRect(dx,dy,TILE,TILE); } 
          else if (t === T.WALL) { ctx.fillStyle = PAL.boxBorder; ctx.fillRect(dx,dy,TILE,TILE); ctx.fillStyle = PAL.wall; ctx.fillRect(dx,dy,TILE,TILE-4); } 
          else if (t === T.GRASS) { ctx.fillStyle = PAL.grass; ctx.fillRect(dx,dy,TILE,TILE); ctx.fillStyle = '#388038'; ctx.fillRect(dx+2,dy+2,2,4); ctx.fillRect(dx+10,dy+8,2,4); } 
          else if (t === T.DIRT) { ctx.fillStyle = PAL.dirt; ctx.fillRect(dx,dy,TILE,TILE); } 
          else if (t === T.TREE) { ctx.fillStyle = PAL.grass; ctx.fillRect(dx,dy,TILE,TILE); ctx.fillStyle = '#184818'; ctx.beginPath(); ctx.arc(dx+8,dy+8,7,0,Math.PI*2); ctx.fill(); } 
          else if (t === T.GATE) { ctx.fillStyle = flags.has('door_open') ? PAL.boxBg : '#804040'; ctx.fillRect(dx,dy,TILE,TILE); if (flags.has('door_open')) { ctx.strokeStyle = PAL.highlight; ctx.strokeRect(dx,dy,TILE,TILE); } } 
          else if (t === T.EXIT) { 
             // Clear, pulsing green archway door
             ctx.fillStyle = '#222'; ctx.fillRect(dx,dy,TILE,TILE); 
             ctx.fillStyle = `rgba(0, 255, 100, ${0.2 + 0.2*Math.sin(Date.now()/200)})`;
             ctx.fillRect(dx, dy, TILE, TILE);
             ctx.fillStyle = '#111'; ctx.fillRect(dx+2, dy+2, 12, 14); 
             ctx.fillStyle = '#8ada8a'; ctx.fillRect(dx+4, dy+4, 8, 12); 
          }
        }
      }
      zone.npcs.forEach(n => { drawCharacterSprite(ctx, n.c*TILE, n.r*TILE, n.id, 'down', false, 0); });
      drawCharacterSprite(ctx, px, py, 'player', pdir, pmoving, pframe);
      ctx.translate(Math.floor(camera.x), Math.floor(camera.y));

      if (overwhelmTimer > 0) {
        ctx.fillStyle = `rgba(0,0,0,${Math.min(1, overwhelmTimer/100)})`; ctx.fillRect(0,0,GBA_W, GBA_H);
      }
    }

    if (state === 'COMBAT') {
      const bgGrad = ctx.createRadialGradient(GBA_W/2, GBA_H/2, 0, GBA_W/2, GBA_H/2, GBA_W);
      bgGrad.addColorStop(0, '#1a0a14'); bgGrad.addColorStop(1, '#05050a'); ctx.fillStyle = bgGrad; ctx.fillRect(0,0,GBA_W,GBA_H);
      const t = Date.now()/1000;
      for (let i=0; i<PRIDE.length; i++) {
        ctx.strokeStyle=PRIDE[i]+'22'; ctx.lineWidth=2; ctx.beginPath();
        for (let x=0; x<GBA_W; x+=4) { const y = GBA_H/2 + Math.sin(x/30+t+i*0.8)*(20+i*6); x===0?ctx.moveTo(x,y):ctx.lineTo(x,y); } ctx.stroke();
      }
      ctx.lineWidth=1;
      
      const pulse=0.5+0.5*Math.sin(t*4);
      ctx.fillStyle=`rgba(255,0,24,${0.15+0.1*pulse})`; ctx.beginPath(); ctx.arc(GBA_W/2, 45, 30+pulse*3, 0, Math.PI*2); ctx.fill();
      drawProceduralFace(combat.enemy.id, GBA_W/2 - 20, 25);
      ctx.fillStyle='#ff8888'; ctx.font='bold 12px monospace'; ctx.textAlign='center'; ctx.fillText(combat.enemy.name, GBA_W/2, 75);

      const bh = 48, bw = GBA_W - 8, bx = 4, by = GBA_H - bh - 4;
      ctx.fillStyle = PAL.boxBorder; ctx.fillRect(bx, by, bw, bh); ctx.fillStyle = PAL.white; ctx.fillRect(bx+2, by+2, bw-4, bh-4);

      if (combat.phase === 'SELECT') {
        ctx.fillStyle = '#000'; ctx.font = 'bold 10px monospace'; ctx.textAlign = 'left';
        ACTIONS.forEach((a,i) => {
          const col = i % 2, row = Math.floor(i / 2);
          const x = bx + 20 + (col * 100), y = by + 20 + (row * 16);
          
          if (combat.actionSel === i) { 
             // Grey out 'Empathy' if out of hearts
             if (a.id === 'empathy' && hearts <= 0) {
                 ctx.fillStyle = '#666'; ctx.fillRect(x - 12, y - 10, 85, 14); ctx.fillStyle = '#ccc'; ctx.fillText('x ' + a.name, x - 8, y);
             } else {
                 ctx.fillStyle = PRIDE[0]; ctx.fillRect(x - 12, y - 10, 85, 14); ctx.fillStyle = '#fff'; ctx.fillText('> ' + a.name, x - 8, y);
             }
          } else {
             if (a.id === 'empathy' && hearts <= 0) ctx.fillStyle = '#bbb';
             else ctx.fillStyle = '#888';
             ctx.fillText('  ' + a.name, x - 8, y);
          }
        });
      } else if (combat.phase === 'RESULT') {
        ctx.fillStyle = '#000'; ctx.font = 'bold 10px monospace'; ctx.textAlign = 'left';
        
        const currentLines = combat.pages[combat.pageI];
        let drawnChars = 0; let ly = by + 16; 
        
        for (let line of currentLines) {
          const remaining = combat.charI - drawnChars;
          if (remaining <= 0) break;
          const charsToDraw = Math.min(line.length, remaining);
          ctx.fillText(line.substring(0, charsToDraw), bx + 10, ly);
          drawnChars += line.length; ly += 12; 
        }

        const totalChars = currentLines.join(' ').length;
        if (combat.charI >= totalChars && Math.floor(Date.now() / 300) % 2 === 0) {
          ctx.fillStyle = PRIDE[0]; 
          const hasMore = (combat.pageI < combat.pages.length - 1);
          ctx.fillText(hasMore ? "▼" : "■", bx + bw - 14, by + bh - 10);
        }
      }
    }

    if (state === 'GAME' || state === 'COMBAT') {
      ctx.fillStyle = '#202020dd'; ctx.fillRect(4, 4, 80, 14);
      ctx.fillStyle = '#fff'; ctx.font = 'bold 8px monospace'; ctx.textAlign = 'left'; ctx.fillText('STRESS', 8, 14);
      ctx.fillStyle = '#444'; ctx.fillRect(42, 6, 38, 10);
      
      let pct = displayStress/100; if (isNaN(pct)) pct = 0;
      ctx.fillStyle = pct>0.7 ? '#ff0018' : pct>0.4 ? '#ffa52c' : '#008018'; 
      ctx.fillRect(42, 6, 38*pct, 10);
      
      if (ties.size > 0 || hearts > 0) { 
          ctx.fillStyle = '#202020dd'; ctx.fillRect(GBA_W - 88, 4, 84, 14); 
          ctx.fillStyle = hearts > 0 ? '#ffb3ba' : '#888'; 
          ctx.textAlign = 'right'; 
          ctx.fillText(`Community ${hearts}♥`, GBA_W - 8, 14); 
      }
    }

    if ((state === 'DIALOGUE' || state === 'CUTSCENE') && dlg) {
      if (state === 'CUTSCENE') { ctx.fillStyle = '#000'; ctx.fillRect(0,0,GBA_W, GBA_H); }

      const bh = 48, bw = GBA_W - 8, bx = 4, by = GBA_H - bh - 4;
      ctx.fillStyle = PAL.boxBorder; ctx.fillRect(bx, by, bw, bh); ctx.fillStyle = PAL.white; ctx.fillRect(bx+2, by+2, bw-4, bh-4); ctx.strokeStyle = PRIDE[0]; ctx.strokeRect(bx+4, by+4, bw-8, bh-8);

      ctx.font = 'bold 10px monospace'; ctx.textAlign='left';
      const hasFace = dlg.face && dlg.face !== 'none';
      if (hasFace) { if (state === 'CUTSCENE') drawProceduralFace(dlg.face, GBA_W/2 - 20, 30); else drawProceduralFace(dlg.face, bx + 6, by + 4); }

      const textX = (hasFace && state !== 'CUTSCENE') ? bx + 52 : bx + 10;
      const currentLines = dlg.pages[dlg.pageI];
      let drawnChars = 0; let ly = by + 16; 
      
      ctx.fillStyle = '#000'; 
      for (let line of currentLines) {
        const remaining = dlg.charI - drawnChars;
        if (remaining <= 0) break;
        const charsToDraw = Math.min(line.length, remaining);
        ctx.fillText(line.substring(0, charsToDraw), textX, ly);
        drawnChars += line.length; ly += 12; 
      }

      const totalChars = currentLines.join(' ').length;
      const isLastPage = dlg.pageI >= dlg.pages.length - 1;

      if (isLastPage && dlg.charI >= totalChars && dlg.node.choices) {
        ctx.font = 'bold 10px monospace';
        let maxTextW = 0;
        dlg.node.choices.forEach(ch => { maxTextW = Math.max(maxTextW, ctx.measureText(ch).width); });
        
        const chW = maxTextW + 30; 
        const chH = 10 + (dlg.node.choices.length * 14);
        const chX = GBA_W - chW - 8, chY = by - chH - 4;
        
        ctx.fillStyle = PAL.boxBorder; ctx.fillRect(chX, chY, chW, chH); 
        ctx.fillStyle = PAL.white; ctx.fillRect(chX+2, chY+2, chW-4, chH-4);
        
        dlg.node.choices.forEach((ch, i) => {
          const cy = chY + 14 + (i * 14);
          if (dlgChoiceSel === i) { ctx.fillStyle = PRIDE[0]; ctx.fillText('▸', chX + 6, cy); }
          ctx.fillStyle = (dlgChoiceSel === i) ? '#000' : '#888'; ctx.fillText(ch, chX + 16, cy);
        });
      } else if (dlg.charI >= totalChars && Math.floor(Date.now() / 300) % 2 === 0) {
        ctx.fillStyle = PRIDE[0]; ctx.fillText(isLastPage && !dlg.node.next ? "■" : "▼", bx + bw - 14, by + bh - 10);
      }
    }
    ctx.restore();
  }

  let running = true;
  function tick() { if (!running) return; update(); draw(); requestAnimationFrame(tick); }
  requestAnimationFrame(tick);
  return { destroy() { running = false; window.removeEventListener('keydown', onKey); window.removeEventListener('keyup', onKey); } };
}

export default function SurvivanceGame() {
  const canvasRef = useRef(null); const gameRef = useRef(null);
  useEffect(() => {
    if (!canvasRef.current || gameRef.current) return;
    gameRef.current = createGame(canvasRef.current);
    canvasRef.current.focus();
    return () => { if (gameRef.current) { gameRef.current.destroy(); gameRef.current = null; } };
  }, []);

  return (
    <canvas ref={canvasRef} style={{ width: '100%', maxWidth: '800px', imageRendering: 'pixelated', display: 'block', margin: '0 auto', border: '4px solid #202020', borderRadius: '8px', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }} tabIndex={0} />
  );
}