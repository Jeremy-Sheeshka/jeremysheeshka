import React, { useRef, useEffect } from 'react';

// ============================================================
// SURVIVANCE 
// ============================================================

const GBA_W = 240;
const GBA_H = 160;
const SCALE = 3;
const TILE = 16;

const PAL = {
  bg: '#283030', text: '#202020', white: '#f8f8f8',
  boxBorder: '#506880', boxBg: '#e8f0f8',
  grass: '#489848', dirt: '#a07850', wall: '#686868',
  water: '#3868c8', highlight: '#c0d0d8'
};

const PRIDE = ['#ff0018','#ffa52c','#ffff41','#008018','#0000f9','#86007d'];
const T = { EMPTY:0, FLOOR:1, WALL:2, GATE:3, HAZARD:4, EXIT:10, GRASS:11, DIRT:12, TREE:13, NOSTALGIA:14, DISCO:15, TERMINAL:16, BRIDGE:17, BREEZE:18 };

// ── CUSTOMIZATION DATA ──────────────────────────────────────
const HAIRSTYLES = [
  { id: 'afro',   name: 'Afro' },
  { id: 'locs',   name: 'Locs' },
  { id: 'twists', name: 'Twists' },
  { id: 'braids', name: 'Braids' },
  { id: 'bald',   name: 'Bald' }
];

const HAIR_COLORS = [
  { id: 'black',  name: 'Black',  hex: '#1a0a00' },
  { id: 'brown',  name: 'Brown',  hex: '#3d1f00' },
  { id: 'blonde', name: 'Blonde', hex: '#cca300' },
  { id: 'red',    name: 'Red',    hex: '#800000' },
  { id: 'purple', name: 'Purple', hex: '#660066' }
];

const SKIN_COLORS = [
  { id: 'light',  name: 'Light',  hex: '#f0d8b8' },
  { id: 'medium', name: 'Medium', hex: '#b88a68' },
  { id: 'dark',   name: 'Dark',   hex: '#8a5a44' },
  { id: 'deep',   name: 'Deep',   hex: '#4a2c1b' }
];

// ── DIALOGUE & STORY DATA ────────────────────────────────────
const DIALOGUE = {
  cutscene_1: { speaker: 'Narrator', pages: ['The year is 2026.', 'The game industry churns out hit after hit, but something is missing...'], portrait: 'narrator', next: 'cutscene_2' },
  cutscene_2: { speaker: 'Narrator', pages: ['You are a young developer who refuses to stay silent.', 'Today, you enter the Whitewashed Studio.'], portrait: 'narrator', next: 'cutscene_3' },
  cutscene_3: { speaker: 'PLAYER_NAME', pages: ["I'm ready.", 'No more compromising.'], portrait: 'player', next: 'intro' },

  intro: { speaker:'Narrator', pages:['You step into the Whitewashed Studio.', 'The fluorescent lights hum with the energy of a thousand unspoken compromises.', 'Posters celebrate "innovation", but whose?'], next:'intro2', portrait:'narrator' },
  intro2: { speaker:'Narrator', pages:['The industry generates billions, yet stories told remain remarkably narrow.', 'Marginalized voices are systematically excluded by design.'], next:'intro3', portrait:'narrator' },
  intro3: { speaker:'Narrator', pages:['Move using the Arrow Keys.', 'Press X, SPACE, or ENTER to interact.', 'Watch your Stress meter. Walking away from conflict is always valid.', 'Build Community Ties by listening to others. Ties open the Qargi.'], portrait:'narrator' },

  // Zone 1 NPCs (Studio) - Allies dispersed
  npc_kai: { speaker:'Kai', pages:["Hey. You're PLAYER_NAME, right?", "I've been trying to pitch a game about my community for two years.", 'They keep saying it\'s "too niche." Funny how stories about straight white men are never "niche," right?'], next:'npc_kai2', portrait:'kai' },
  npc_kai2: { speaker:'Kai', pages:["I'm not looking for someone to fight my battles.", 'Just... someone who\'ll stand with me.'], flag:'met_kai', choices:["I'm here.",'That sounds exhausting.'], ties:['kai', null], portrait:'kai' },

  npc_dev: { speaker:'Dev', pages:['Another diversity initiative. They brought me in to "consult" but won\'t let me touch the actual design.', 'Tokenism with extra steps.'], next:'npc_dev2', portrait:'dev' },
  npc_dev2: { speaker:'Dev', pages:['Kishonna Gray writes about how Black gamers build community spaces despite hostility.', "That's what I'm trying to do here. Build something real, even inside this machine."], flag:'met_dev', tie:'dev', portrait:'dev' },

  npc_ada: { speaker:'Ada', pages:["I've been crunching for six months on a game about queer joy.", 'The publisher wants me to "tone it down for broader appeal."'], next:'npc_ada2', portrait:'ada' },
  npc_ada2: {  speaker: 'Ada', pages: ["A rainbow flag doesn't make a game queer.", "Real queerness lives in the systems: how consent works, how progress is measured.", "If the rules are straight, the aesthetics won't save it." ], flag: 'met_ada', tie: 'ada',  portrait: 'ada' }, 

  npc_mentor: { speaker:'Elder', pages:['The tools of erasure evolve, but the pattern is ancient: assimilate, flatten, package, sell.', 'What they call "inclusion" is often just a more efficient form of extraction.'], next:'npc_mentor2', portrait:'mentor' },
  npc_mentor2: { speaker:'Elder', pages:['Survivance, Gerald Vizenor\'s word, means more than survival.', "It's the active presence of Indigenous agency. Not just enduring, but creating.", 'Take this key. The path to the Swamp is open to you.'], flag:'got_key', tie:'mentor', portrait:'mentor' },

  // Zone 2 NPCs (Swamp) - Allies seeded here too
  npc_sage: { speaker:'Sage', pages:['Nostalgia. It pulls you backward, tells you things were better before.', 'Before what? Before people like us were visible?', "That's not nostalgia. That's erasure wearing a warm sweater."], flag:'met_sage', tie:'sage', portrait:'sage' },
  npc_river: { speaker:'River', pages:["You can't speedrun understanding. You can't optimize empathy.", 'The friction in the game isn\'t a flaw, is here to teach you that not everything valuable is efficient.'], flag:'met_river', tie:'river', portrait:'river' },

  // CHANGE: Red NPC near swamp entrance — survivance dialogue update
  npc_red_scout: { speaker:'Scout', pages:['This place... it changes people. Warps them.', 'I came through here thinking I could fix things from the inside.', 'But the swamp has a way of making you doubt everything you knew.'], next:'npc_red_scout2', portrait:'harasser' },
  npc_red_scout2: { 
    speaker:'Scout', 
    pages:[
      'Be careful of the nostalgia traps. They glow like rewards.',
      'They\'re not rewards. They\'re anchors pulling you under.',
      'Keep moving. The people who wait here are trying to build a new path. Don\'t let the obstacles stop you now friend.'
    ], 
    flag:'met_red_scout', 
    portrait:'harasser' 
  },

  gate_locked: { speaker:'Narrator', pages:['A knowledge gate blocks the path.', 'You must speak with the Elder in the center of the room to proceed.'], portrait:'narrator' },
  gate_open: { speaker:'Narrator', pages:['You use the knowledge granted by the Elder.', 'The gate unlocks. The Straightwashing Swamp lies ahead.'], flag:'door_open', portrait:'narrator' },

  // HR Terminal - Zone 1 institutional UI manipulation ONLY (HACK PATH REMOVED)
  report_tool: { speaker:'System', pages:['HR & CONDUCT REPORTING PORTAL\nFiling harassment report...\n... ... ...'], next:'report_tool2', portrait:'none' },
  report_tool2: { 
    speaker:'System', 
    pages:[
      'RESOLUTION: Working as intended.\nNo violation of company culture found.\nThank you for your feedback.',
      'NOTE: Report option "Racism/Queerphobia" is currently unavailable in your region.'
    ], 
    stressEffect: 15, 
    flag: 'hr_reported', 
    next:'report_tool3', 
    portrait:'none' 
  },
  report_tool3: { speaker:'Narrator', pages:['The system is not broken. It is functioning exactly as designed.\nRelying on their tools will only drain you.'], portrait:'narrator' },
  
  // REMOVED: report_tool_hack, report_tool_hack2, report_tool_hack3 (hack path deleted)

  // Zone 1 Enemies (No gaslighting UI tricks here)
  encounter_wb: { speaker:'Whitewasher', pages:['"We love your work! But they don\'t quite fit our target demographic.', 'Can you tone down their look? Make your character more... universal?"'], next:'encounter_wb2', portrait:'whitewasher' },
  encounter_wb2: { speaker:'Narrator', pages:['"Universal" means white. "Relatable" means straight.', "The Whitewasher doesn't see their bias. Educating them is a risk.", 'Setting a boundary may be more effective.'], triggerCombat:'wb', portrait:'narrator' },

  encounter_tok: { speaker:'Tokenizer', pages:['"We love your perspective! We want you to be the face of our new diversity campaign.', 'Just smile for the camera and don\'t mention the pay disparity."'], next:'encounter_tok2', portrait:'tokenizer' },
  encounter_tok2: { speaker:'Narrator', pages:['They want your image, not your voice. They extract value without granting equity.', 'Will you educate them, or set a boundary?'], triggerCombat:'tok', portrait:'narrator' },

  // Zone 2 Entries & Environmental
  zone2_enter: { speaker:'Narrator', pages:['You enter the Straightwashing Swamp. Progress slows here.', 'Watch for glowing objects in the grass.', 'They are Nostalgia Traps, toxic comforts disguised as reward.'], flag:'entered_swamp', portrait:'narrator' },
  
  swamp_breeze: { speaker:'Narrator', pages:['A soft digital breeze washes over this clearing.', 'In this space of positive relationality, the environment itself is designed to heal.', 'You can feel your stress fading away.'], portrait:'narrator' },

  // REMOVED: encounter_sw_swamp, encounter_sw_choice, encounter_sw_result (Straightwasher merged)

  // Zone 2 Enemy - MERGED Toxic Gamer (includes Straightwasher dialogue)
  encounter_toxic: { 
    speaker:'Toxic Gamer', 
    pages:[
      '"You think your "diversity" makes you special?"',
      '"Real games don\'t need politics. Go make a farming simulator."',
    ], 
    next:'encounter_toxic2', 
    portrait:'harasser' 
  },
  encounter_toxic2: { speaker:'Narrator', pages:['They reject all nuance. Engagement is their oxygen.', 'Trying to "Educate" them will only trigger their institutional weaponization.', 'Set a boundary, draw on community, or walk away.'], triggerCombat:'toxic', portrait:'narrator' },

  encounter_hardcore: { speaker:'Hardcore Gamer', pages:['"Hey! You! You think you can just waltz through our swamp?"', '"If you\'re a real gamer, prove it!"'], next:'encounter_hardcore2', portrait:'harasser' },
  encounter_hardcore2: { speaker:'Narrator', pages:['The Hardcore Gamer asks for a wildly unfair skill check in front of you.', 'Will you try to prove your worth, or refuse their toxic standard?'], triggerCombat:'hardcore', portrait:'narrator' },

  // Dragon dialogue
  dragon_greet: { 
    speaker: 'Dragon', 
    pages: [ '"You refused their toxic rules. You proved your worth to yourself."', '"For too long, the game industry has depicted heroes who look like you as only belonging in the real world."', '"Here, you get to ride a purple dragon."', '"Climb on. Let\'s fly above the noise."' ], 
    next: 'dragon_mount',
    portrait: 'none' 
  },
  dragon_mount: { 
    speaker: 'Dragon', 
    pages: ['"Hold on."'], 
    flag: 'trigger_mount',
    portrait: 'none' 
  },
  dragon_dismount_landing: { speaker: 'Dragon', pages: ['"Until next time."'], portrait: 'none' },

  nostalgia_trap: { speaker:'Narrator', pages:['The familiar pixel glows with false warmth.', 'You reach for it and the environment lurches.', 'This nostalgia was never meant for you.'], portrait:'narrator' },
  disco_ball: { speaker:'Narrator', pages:['You touch the glowing sphere. A wave of camp energy washes over you.', 'The heteronormative space fractures. Your stress melts away.', 'The Gatekeepers are pushed back. You are safe here.'], portrait:'narrator' },

  // Zone 3: Qargi
  qargi_blocked: { speaker:'The Circle', pages:['You approach the Digital Qargi, but you are not yet ready.', 'Survivance cannot be achieved in isolation.', 'Listen to your peers. Build real connections, not scores.', '(You need ties with Kai, Dev, Ada, and the Elder)'], portrait:'circle' },
qargi_enter_assembled: { 
    speaker: 'The Circle', 
    pages: [
      'Welcome to the Digital Qargi. Here, knowledge is shared in circles, not hierarchies.', 
      'Look around. Every voice you stopped to hear—Kai, Dev, Ada, the Elder, Sage, River—is here.', 
      'Each one walked a road the industry tried to close.'
    ], 
    next: 'qargi_enter_assembled2', 
    portrait: 'circle' 
  },

  qargi_enter_assembled2: { 
    speaker: 'The Circle', 
    pages: [
      'This is not a traditional victory screen. There is no boss to defeat, no score to maximize.', 
      'Your community ties are not a currency. They are relationships. They are responsibility.'
    ], 
    next: 'qargi_enter_assembled3', 
    portrait: 'circle' 
  },

  qargi_enter_assembled3: { 
    speaker: 'The Circle', 
    pages: [
      'You crossed the Straightwashing Swamp and refused the gatekeepers.', 
      'That is survivance. Not just enduring, but actively, defiantly creating.', 
      'Carry this forward, into your work, and into the spaces they say you do not belong.'
    ], 
    flag: 'completed', 
    portrait: 'circle' 
  },
};

// ── STATE-BASED COMBAT DATA ──────────────────────────────────
const ENEMY_STATE_NAMES = ['Aggressive', 'Defensive', 'Uncertain', 'Disengaged'];
const ENEMY_STATE_COLORS = ['#ff0018', '#ffa52c', '#ffff41', '#008018'];

const ACTIONS = [
  { id:'boundary',  name:'Boundary',  desc:'Set a firm limit.' },
  { id:'community', name:'Community', desc:'Draw on your ties.' },
  { id:'educate',   name:'Educate',   desc:'Share systemic facts. Risky.' },
  { id:'leave',     name:'Leave',     desc:'Walk away. Always works.' },
];

const TIE_QUOTES = {
  kai: "I'm standing with you.",
  dev: "We build our own spaces.",
  ada: "We are rewriting the systems.",
  mentor: "Practice survivance.",
  sage: "Don't let them erase you.",
  river: "Take your time. We are here."
};

// CONSOLIDATED ENEMIES - 4 types, clean separation
const ENEMIES = {
  wb: {
    id:'whitewasher', name:'The Whitewasher', zone: 'studio',
    rejectsBoundary: false, hasGaslighting: false,
    responses: {
      boundary: [
        { player: "I am not changing my story to make you comfortable.", response: "I'm just offering professional feedback." },
        { player: "My demographic deserves to be seen authentically.", response: "There's no need to be defensive. It's just business." }
      ],
      community: [{ response: "You can't keep relying on peer support instead of the industry." }],
      educate: [
        { fact: "Diverse stories reach wider audiences and drive innovation.", response: "That's lovely, but investors only read return on investment." },
        { fact: "Universal design shouldn't mean 'default white and straight'.", response: "You're being too radical. Change takes time." },
        { fact: "Whitewashing erases authentic histories to sell a comfortable lie.", response: "We prefer to call it 'broadening the appeal'." },
        { fact: "Tokenizing characters without their culture is harmful.", response: "We gave you a seat at the table. Be grateful." }
      ],
      harden: ["See, this hostility is why you people aren't succeeding."]
    }
  },
  tok: {
    id:'tokenizer', name:'The Tokenizer', zone: 'studio',
    rejectsBoundary: false, hasGaslighting: false,
    responses: {
      boundary: [
        { player: "My identity is not your marketing tool.", response: "Ouch. We're just trying to give you a platform." },
        { player: "Do not use my face without giving me equity.", response: "Don't bite the hand that feeds you." }
      ],
      community: [{ response: "Why are you talking to them? We have the budget." }],
      educate: [
        { fact: "Representation without equity is just exploitation.", response: "You're asking for too much too fast." },
        { fact: "True diversity means leadership roles, not just PR.", response: "We have to walk before we can run." },
        { fact: "Using our trauma for your marketing is harmful.", response: "We're raising awareness! That's a good thing." },
        { fact: "You extract our culture but exclude us from profits.", response: "Exposure is an invaluable currency right now." }
      ],
      harden: ["Fine. We'll just find someone more cooperative then."]
    }
  },
  toxic: {
    id:'toxic', name:'The Toxic Gamer', zone: 'swamp',
    rejectsBoundary: true, hasGaslighting: true,
    responses: {
      boundary: [
        { player: "I am not entertaining this harassment.", response: "Because you have no real arguments!" },
        { player: "Do not speak to me like that.", response: "I'll speak however I want!" },
        { player: "The queer themes are intentional and central.", response: "Why does everything have to be political?" },
        { player: "I won't hide the romance to suit your preferences.", response: "I just think it distracts from the gameplay." },
        // MERGED: Straightwasher dialogue added here
        { player: "The swamp is so... messy. Why can't we just make it a nice, clean park?", response: "Order isn't oppression. You're just making excuses." }
      ],
      community: [{ response: "Running back to your echo chamber? Typical." }, { response: "You're reading too much into a simple video game." }],
      educate: [
        { fact: "57% of young gamers are actually people of color.", response: "Fake stats! Go back to making walking simulators!" },
        { fact: "Consent mechanics actively subvert colonial gaming tropes.", response: "It's just a game, stop making it about sexuality!" },
        { fact: "Ignoring queer narratives is an active choice to erase them.", response: "Real gamers only care about the difficulty and framerate." },
        { fact: "Queer coding is historically how we survived in media.", response: "You're just reaching to make everything gay." }
      ],
      harden: ["Cry more! You're just proving my point!", "You're just projecting your agenda onto normal games."]
    }
  },
  hardcore: {
    id:'hardcore', name:'The Gatekeepers', zone: 'swamp',
    rejectsBoundary: false, hasGaslighting: false,
    responses: {
      boundary: [
        { player: "I don't need to prove myself to you.", response: "Whatever, fake gamer! Go back to casual mode." },
        { player: "Your toxic standards don't define my worth.", response: "You just don't have the skills!" }
      ],
     community: [
  { response: "Your casual community is ruining the industry!" }
],
educate: [
  { 
    fact: "Demanding 'mastery over the machine' is just a toxic performance of traditional gamer masculinity.", 
    response: "You're just making excuses because you lack the skills! Git Gud!" 
  },
  { 
    fact: "The division between 'hardcore' and 'casual' games is just an artificial gatekeeping tool to exclude marginalized players.", 
    response: "You're just a fake gamer. Go back to easy mode!" 
  }
],
      harden: ["Noob!"]
    }
  }
};

// ── ZONES ────────────────────────────────────────────────────
const generateSwampGrid = () => {
    let grid = [];
    for(let r=0; r<10; r++) {
        let row = new Array(40).fill(11); 
        if (r===0 || r===9) row.fill(13); 
        row[0] = 13; 
        if (r < 4 || r > 5) { row[19] = 13; row[20] = 13; } 
        else { row[19] = 17; row[20] = 17; } 
        if (r===8) row[1] = 10; 
        if (r===8) row[38] = 10; 
        grid.push(row);
    }
    grid[2][5] = 12; grid[3][10] = 12; grid[6][14] = 12; grid[4][25] = 12; grid[7][30] = 12; 
    
    // CHANGE: Moved the breeze to the top right / middle area (Columns 26 through 30)
    for (let r=2; r<=5; r++) { for (let c=36; c<=40; c++) { grid[r][c] = 18; }}
    
    return grid;
};

const ZONES = {
  studio: {
    name: 'Whitewashed Studio', w: 20, h: 11, uiTricks: ['institutional'],
    start: { x: 10*TILE, y: 8*TILE },
    grid: [
      [2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],
      [2,1,1,1,1,1,2,1,1,1,1,1,1,1,1,1,1,1,1,2],
      [2,1,1,1,1,1,2,1,1,1,1,1,1,1,1,1,1,1,1,2], 
      [2,1,1,1,1,1,2,1,1,1,1,1,1,1,1,1,1,1,1,2],
      [2,2,2,1,2,16,2,2,2,2,1,1,1,1,1,1,1,1,1,2],
      [2,1,1,1,1,1,1,1,1,1,1,1,1,2,2,2,2,1,2,2],
      [2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2],
      [2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2],
      [2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2],
      [2,2,2,2,2,2,2,2,2,3,2,2,2,2,2,2,2,2,2,2],
      [2,0,0,0,0,0,0,0,0,10,0,0,0,0,0,0,0,0,0,2]
    ],
    npcs: [
      { c:3, r:2, id:'kai', dlg:'npc_kai', wander: true },
      { c:16, r:2, id:'dev', dlg:'npc_dev', wander: true },
      { c:16, r:7, id:'ada', dlg:'npc_ada' },
      { c:9, r:7, id:'mentor', dlg:'npc_mentor' },
      { c:6, r:5, id:'whitewasher', dlg:'encounter_wb' },
      { c:7, r:2, id:'tokenizer', dlg:'encounter_tok' }
    ],
    interacts: [
      { c:9, r:9, check: (flags) => { if (flags.has('door_open')) return null; return flags.has('got_key') ? 'gate_open' : 'gate_locked'; } },
      // CHANGE: HR Terminal - hack path removed, only report_tool accessible
      { c:5, r:4, check: (flags) => flags.has('hr_reported') ? null : 'report_tool' }
    ],
    exits: [ { c:9, r:10, dest:'swamp', spawnX: 2*TILE, spawnY: 8*TILE } ]
  },
  swamp: {
    name: 'Straightwashing Swamp', w: 40, h: 10, uiTricks: ['gaslighting', 'glitch'],
    start: { x: 2*TILE, y: 8*TILE },
    grid: generateSwampGrid(),
    hazards: [], 
    npcs: [
      // CHANGE: Red scout NPC moved close to swamp entrance
      { c:4, r:6, id:'red_scout', dlg:'npc_red_scout', wander: false },
      { c:7, r:7, id:'river', dlg:'npc_river', wander: true },
      { c:25, r:7, id:'sage', dlg:'npc_sage', wander: true },
      { c:32, r:3, id:'toxic', dlg:'encounter_toxic' },
      { c:36, r:2, id:'dragon', interactOnly: true, dlg: 'dragon_greet' }
      // REMOVED: Straightwasher NPC (merged into Toxic Gamer)
    ],
    interacts: [ { c:10, r:1, check: (flags) => flags.has('entered_swamp') ? null : 'zone2_enter' } ],
    exits: [
      { c:38, r:8, dest:'qargi', spawnX: 7*TILE, spawnY: 9*TILE },
      { c:1, r:8, dest:'studio', spawnX: 9*TILE, spawnY: 9*TILE }
    ]
  },
  qargi: {
    name: 'Digital Qargi', w: 15, h: 11, uiTricks: [],
    start: { x: 7*TILE, y: 9*TILE },
    grid: [
      [0,0,0,0,0,0,2,2,2,0,0,0,0,0,0],
      [0,0,0,0,1,1,1,1,1,1,1,0,0,0,0],
      [0,0,0,1,1,1,1,1,1,1,1,1,0,0,0],
      [0,0,1,1,1,1,1,1,1,1,1,1,1,0,0],
      [0,0,1,1,1,1,1,1,1,1,1,1,1,0,0],
      [0,0,1,1,1,1,1,1,1,1,1,1,1,0,0],
      [0,0,0,1,1,1,1,1,1,1,1,1,0,0,0],
      [0,0,0,0,1,1,1,1,1,1,1,0,0,0,0],
      [0,0,0,0,0,0,0,1,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,1,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,10,0,0,0,0,0,0,0],
    ],
    npcs: [ 
      { c:7, r:4, id:'circle', dlg: (flags, ties) => {
        const required = ['kai','dev','ada','mentor'];
        if (required.every(r => ties.has(r))) {
          return flags.has('qargi_circle_talked') ? 'qargi_enter' : 'qargi_enter_assembled';
        }
        return 'qargi_blocked';
      }}
    ],
    interacts: [],
    exits: [ { c:7, r:10, dest:'swamp', spawnX: 37*TILE, spawnY: 8*TILE } ]
  }
};

const NOSTALGIA_SHAPES = ['coin','mushroom','star', 'coin', 'mushroom'];

// ── ENGINE ───────────────────────────────────────────────────
function createGame(canvas) {
  const ctx = canvas.getContext('2d');
  canvas.width = GBA_W * SCALE; canvas.height = GBA_H * SCALE;
  ctx.imageSmoothingEnabled = false;

  const sfxLevelComplete = new Audio('/assets/audio/levelcomplete.mp3');
  const bgMusic = new Audio('/assets/audio/bgmusic.mp3');
  const bgFinish = new Audio('/assets/audio/bgfinish.mp3');
  const sfxInsight = new Audio('/assets/audio/insight.mp3');
  const sfxHarasser = new Audio('/assets/audio/harasser.mp3');
  const sfxStressed = new Audio('/assets/audio/stressed.mp3');
  const sfxRestart = new Audio('/assets/audio/restart.mp3');
  const sfxTalk = new Audio('/assets/audio/talk.mp3');
  const sfxSystemError = new Audio('/assets/audio/systemerror.mp3');

  bgMusic.loop = true;
  let isGameEnding = false;

  bgMusic.addEventListener('timeupdate', () => {
    if (isGameEnding && bgMusic.duration > 0) {
      if (bgMusic.duration - bgMusic.currentTime < 0.25) {
        bgMusic.pause(); isGameEnding = false;
        bgFinish.currentTime = 0; bgFinish.volume = 1;
        bgFinish.play().catch(() => {});
      }
    }
  });

  sfxRestart.addEventListener('ended', () => {
    if (!isGameEnding) { bgMusic.volume = 1; bgMusic.play().catch(() => {}); }
  });

  let audioUnlocked = false;
  const unlockAudio = () => {
    if (audioUnlocked) return;
    [bgMusic, bgFinish, sfxInsight, sfxHarasser, sfxStressed, sfxRestart, sfxTalk, sfxSystemError].forEach(a => {
      a.volume = 0; a.play().then(() => { a.pause(); a.currentTime = 0; a.volume = 1; }).catch(() => {});
    });
    audioUnlocked = true;
  };

  let state = 'TITLE'; 
  let introTimer = 0;
  let transitionTimer = 0;
  let glitchOverrideTimer = 0;
  let discoActive = 0;
  
  let playerPrefs = { name: '', hair: HAIRSTYLES[0], hairColor: HAIR_COLORS[0], skin: SKIN_COLORS[1] };
  let creatorFocus = 0; 
  
  let ambushTimer = 0;
  let ambushNpcs = [];
  let ambushCoords = {x: 0, y: 0};
  let projectiles = [];

  let zoneId = 'studio'; let zone = ZONES[zoneId];
  let px = zone.start.x, py = zone.start.y;
  let pdir = 'down', pframe = 0, pmoving = false;
  let camera = { x:0, y:0 };
  let flags = new Set(); let ties = new Set();

  let stress = 0;
  let maxStress = 100;
  let displayStress = 0;
  let resilience = 1;
  let shakeFrames = 0;
  let frameCount = 0;

  let dlg = null; let dlgChoiceSel = 0;
  let combat = null;
  let restTimer = 0;
  let victoryTimer = 0;

  // Initialize Static Hazards for Swamp
  for (let i = 0; i < 15; i++) {
    const shape = NOSTALGIA_SHAPES[i % 5];
    ZONES.swamp.hazards.push({ 
      id: i, 
      px: (2 + Math.random() * 36) * TILE, 
      py: (1 + Math.random() * 8) * TILE, 
      shape,
      active: true,
      vx: 0,
      vy: 0,
    });
  }

  camera.x = Math.max(0, Math.min(zone.w*TILE - GBA_W, px - GBA_W/2));
  camera.y = Math.max(0, Math.min(zone.h*TILE - GBA_H, py - GBA_H/2));

  const keys = new Set(); const justDown = new Set();
  const onKey = (e, isDown) => {
    if (isDown && !keys.has(e.key)) {
      justDown.add(e.key);
      
      if (state === 'TITLE' && ['Enter',' ','z','Z','x','X'].includes(e.key)) {
        sfxLevelComplete.currentTime = 0; sfxLevelComplete.volume = 1;
        sfxLevelComplete.play().catch(() => {});
        unlockAudio(); state = 'CREATOR'; return; 
      } else { unlockAudio(); }

      if (state === 'CREATOR' && creatorFocus === 0) {
         if (e.key === 'Backspace') { playerPrefs.name = playerPrefs.name.slice(0, -1); } 
         else if (e.key.length === 1 && /[a-zA-Z0-9 ]/.test(e.key) && playerPrefs.name.length < 10) { playerPrefs.name += e.key; } 
         else if (['Enter',' ','x','X','z','Z'].includes(e.key)) { creatorFocus = 1; }
         return; 
      }

      if (flags.has('mounted_dragon') && ['Enter',' ','x','X','z','Z'].includes(e.key) && state === 'GAME') {
          flags.delete('mounted_dragon');
          sfxInsight.currentTime = 0; sfxInsight.play().catch(()=>{});
          let dX = px; let dY = py;
          if (pdir === 'up') dY += TILE * 2;
          else if (pdir === 'down') dY -= TILE * 2;
          else if (pdir === 'left') dX += TILE * 2;
          else if (pdir === 'right') dX -= TILE * 2;
          dX = Math.max(TILE, Math.min((zone.w - 2) * TILE, dX));
          dY = Math.max(TILE, Math.min((zone.h - 2) * TILE, dY));
          zone.npcs.push({ 
            id: 'dragon', 
            c: Math.floor(dX/TILE), r: Math.floor(dY/TILE), 
            px: dX, py: dY, 
            interactOnly: true, 
            dlg: 'dragon_mount', 
            dir: pdir 
          });
          startDialogue('dragon_dismount_landing');
          return; 
      }
    }
    if (isDown) keys.add(e.key); else keys.delete(e.key);
    const tracked = ['ArrowUp','ArrowDown','ArrowLeft','ArrowRight',' ','Enter','z','Z','x','X'];
    if (tracked.includes(e.key)) e.preventDefault();
  };
  window.addEventListener('keydown', e => onKey(e, true)); window.addEventListener('keyup', e => onKey(e, false));
  const isDown = (...k) => k.some(x => keys.has(x)); const wasDown = (...k) => k.some(x => justDown.has(x));

  const paginateText = (text, maxW, maxLines) => {
    ctx.font = 'bold 10px "VT323", monospace';
    const processedText = text.replace(/PLAYER_NAME/g, playerPrefs.name || 'Alex');
    const words = processedText.split(' '); const pages = [];
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

  const getTile = (c, r) => (r >= 0 && r < zone.grid.length && c >= 0 && c < zone.grid[0].length) ? zone.grid[r][c] : 13;

  const solid = (c, r, ignoreId) => {
    if (flags.has('mounted_dragon') && ignoreId === 'player') {
       if (c <= 0 || c >= zone.w - 1 || r <= 0 || r >= zone.h - 1) return true;
       return false;
    }
    const t = getTile(c, r);
    if ([T.WALL, T.TREE, T.EMPTY, T.TERMINAL].includes(t)) return true;
    if (t === T.GATE && !flags.has('door_open')) return true;
    if (t === T.BRIDGE && (r < 4 || r > 5)) return true; 
    if (zone.npcs.find(n => n.c === c && n.r === r && n.id !== ignoreId && !n.disengaged && n.id !== 'disco' && n.id !== 'dragon')) return true;
    return false;
  };

  const isNpcSolid = (c, r, id) => {
    const t = getTile(c, r);
    if (![T.FLOOR, T.GRASS, T.DIRT, T.NOSTALGIA, T.DISCO, T.BRIDGE, T.BREEZE].includes(t)) return true;
    if (t === T.GATE && !flags.has('door_open')) return true;
    if (zone.npcs.find(n => n.c === c && n.r === r && n.id !== id && n.id !== 'disco' && n.id !== 'dragon')) return true;
    let pc = Math.floor((px+8)/TILE); let pr = Math.floor((py+8)/TILE);
    if (c === pc && r === pr) return true;
    return false;
  };

  const toMockingCase = (str) => {
      return str.split('').map((c, i) => i % 2 === 0 ? c.toLowerCase() : c.toUpperCase()).join('');
  };

  function startDialogue(dialogueKey) {
    const node = DIALOGUE[dialogueKey]; if (!node) return;
    if (node.stressEffect) { stress = Math.max(0, Math.min(maxStress, stress + node.stressEffect)); triggerShake(10); }
    if (dialogueKey === 'cutscene_3') { bgMusic.currentTime = 0; bgMusic.volume = 1; bgMusic.play().catch(() => {}); }
    ctx.font = 'bold 10px "VT323", monospace'; 
    const maxW = (node.portrait && node.portrait !== 'none' && state !== 'CUTSCENE') ? (GBA_W - 8 - 65) : (GBA_W - 28);
    const generatedPages = paginateText(node.text || node.pages.join(' '), maxW, 3);
    const speakerName = node.speaker === 'PLAYER_NAME' ? (playerPrefs.name || 'Alex') : node.speaker;
    dlg = { node: {...node, speaker: speakerName}, pages: generatedPages, pageI: 0, charI: 0, face: node.portrait };
    dlgChoiceSel = 0;
    if (state === 'GAME' || state === 'AMBUSH') state = 'DIALOGUE';
  }

  function triggerShake(frames) { shakeFrames = frames; }

  // STATE-BASED COMBAT - WITH QUEER GLITCH SUPPORT
  function initCombat(encId) {
    const enemyData = ENEMIES[encId]; if (!enemyData) return;
    let acts = ACTIONS.map(a => ({...a})); 
    if (encId === 'tok') {
        if (flags.has('exposure_used')) {
          acts[2] = { id:'educate', name:'Educate', desc:'Share systemic facts. Risky.' };
        } else {
          acts[2] = { id:'exposure', name:'Exposure', desc:'Trap.' };
        }
    } else if (encId === 'hardcore') {
        acts = [
            { id:'prove_skill', name:'Prove Skill', desc:'Take the test.' },
            { id:'disobey', name:'Disobey', desc:'Refuse to prove worth.' },
            { id:'community', name:'Community', desc:'Draw on your ties.' },
            { id:'leave', name:'Leave', desc:'Walk away.' }
        ];
    }
    combat = {
      enemyId: encId, enemy: enemyData, enemyState: 0, 
      playerStress: stress, responseCounts: { boundary:0, educate:0, community:0 },
      communityUsed: false, justAJoke: false, gaslightingActive: false,
      queerGlitchActive: false, glitchText: null, // NEW: queer glitch state
      actions: acts, warningTimer: 0,
      phase: 'SELECT', actionSel: 0, resultPages: null, resultPageI: 0, resultCharI: 0,
    };
    state = 'COMBAT';
  }

  function doPlayerAction(actionId) {
    const enemy = combat.enemy;
    let resultText = ''; let stressChange = 0; let stateChange = 0; 

    if (enemy.hasGaslighting && actionId === 'educate') {
      combat.gaslightingActive = true;
      sfxSystemError.currentTime = 0; sfxSystemError.volume = 1; sfxSystemError.play().catch(() => {});
      resultText = `SYSTEM ERROR: "${toMockingCase('You think facts matter here? lol')}" Your reality destabilizes.`;
      stressChange = 25; 
      stateChange = -combat.enemyState;
      triggerShake(20);
      ctx.font = 'bold 10px "VT323", monospace'; 
      combat.resultPages = paginateText(resultText, GBA_W - 28, 3);
      combat.resultPageI = 0; 
      combat.resultCharI = 0;
      combat.phase = 'RESULT'; 
      combat.playerStress = Math.max(0, Math.min(maxStress, combat.playerStress + stressChange));
      combat.enemyState = Math.max(0, Math.min(3, combat.enemyState + stateChange));
      return;
    }

    if (actionId === 'leave') {
      stressChange = -5;
      combat.playerStress = Math.max(0, combat.playerStress + stressChange); stress = combat.playerStress;
      sfxInsight.currentTime = 0; sfxInsight.volume = 1; sfxInsight.play().catch(() => {});
      combat.phase = 'ENDED'; state = 'VICTORY'; victoryTimer = 180; combat = null; return;
    }

    if (actionId === 'disobey') {
      resultText = "You refuse to engage with their toxic standards.";
      combat.playerStress = Math.max(0, combat.playerStress - 5); stress = combat.playerStress;
      flags.add('hardcore_disobeyed');
      combat.phase = 'ENDED'; state = 'VICTORY'; victoryTimer = 180; combat = null; return;
    }
// CHANGE: Queer Glitch Sequence for Hardcore Gamer - PART 1 (The Setup)
    if (actionId === 'prove_skill' && combat.enemyId === 'hardcore') {
      
      // The Gatekeeper's threat dialogue
      const threatText = `"Prove skill? That's exactly what I wanted you to do. But first, let me hack this game and delete your 'community ties' data. Real gamers play solo!"`;
      
      ctx.font = 'bold 10px "VT323", monospace'; 
      combat.resultPages = paginateText(threatText, GBA_W - 28, 3);
      combat.resultPageI = 0; combat.resultCharI = 0;
      combat.phase = 'RESULT';
      
      // Tell the game engine to hold the glitch until after they read this text
      combat.triggerGlitchNext = true; 
      return;
    }

    if (actionId === 'prove_skill') {
      stressChange = 30;
      resultText = `"Not a real gamer. Git Gud." They crush you with an unfair trap.`;
      stateChange = -combat.enemyState; 
      triggerShake(20);
      combat.playerStress = Math.max(0, Math.min(maxStress, combat.playerStress + stressChange));
      ctx.font = 'bold 10px "VT323", monospace'; 
      combat.resultPages = paginateText(resultText, GBA_W - 28, 3);
      combat.resultPageI = 0; combat.resultCharI = 0;
      combat.phase = 'RESULT';
      return;
    }

    const count = combat.responseCounts[actionId] || 0;

    if (actionId === 'exposure') {
      flags.add('exposure_used');
      maxStress = Math.max(20, maxStress - 20);
      resultText = `"Exposure is invaluable!" The Tokenizer smiles. Your maximum stress capacity permanently shrinks.`;
      stateChange = 1; 
    } else if (actionId === 'boundary') {
      const respObj = enemy.responses.boundary[count % enemy.responses.boundary.length];
      if (enemy.rejectsBoundary || Math.random() < 0.40) { 
        resultText = `You assert a boundary. They push through! "${respObj.response}"`;
        stressChange = 15; stateChange = -combat.enemyState;
        triggerShake(12);
      } else {
        resultText = `You establish a firm boundary. "${respObj.player}" They step back.`;
        stressChange = 0; stateChange = 1;
      }
    } else if (actionId === 'educate') {
      stressChange = 25; 
      const respObj = enemy.responses.educate[count % enemy.responses.educate.length];
      resultText = `You state: "${respObj.fact}" They counter: "${respObj.response}"`;
      if (Math.random() < 0.90) { 
        stateChange = -combat.enemyState; triggerShake(6); 
        resultText += ` ${enemy.responses.harden[0]}`;
      } else {
        stateChange = 3 - combat.enemyState; 
        resultText += " Surprisingly, they disengage.";
      }
    } else if (actionId === 'community') {
      if (ties.size === 0) {
        resultText = `You reach out, but have no ties yet. Listen to others to build community.`;
      } else {
        const tieArray = Array.from(ties);
        const randomTie = tieArray[Math.floor(Math.random() * tieArray.length)];
        const allyName = randomTie.charAt(0).toUpperCase() + randomTie.slice(1);
        const respObj = enemy.responses.community[count % enemy.responses.community.length];
        resultText = `${allyName} reminds you: "${TIE_QUOTES[randomTie]}" Enemy scoffs: "${respObj.response}"`;
        stressChange = -(ties.size * 10); 
        stateChange = 0;
        combat.communityUsed = true;
      }
    }

    combat.responseCounts[actionId] = count + 1;
    combat.playerStress = Math.max(0, Math.min(maxStress, combat.playerStress + stressChange));
    combat.enemyState = Math.max(0, Math.min(3, combat.enemyState + stateChange));

    if (combat.enemyState >= 3) resultText += ' They disengage. You protected yourself.';
    
    ctx.font = 'bold 10px "VT323", monospace'; 
    combat.resultPages = paginateText(resultText, GBA_W - 28, 3);
    combat.resultPageI = 0; combat.resultCharI = 0;
    combat.phase = combat.enemyState >= 3 ? 'RESULT_FINAL' : 'RESULT';
  }

  // ── UPDATE ──────────────────────────────────────────────────
  function update() {
    frameCount++;
    if (shakeFrames > 0) shakeFrames--;
    if (glitchOverrideTimer > 0) glitchOverrideTimer--;
    if (discoActive > 0) discoActive--;

    if (zoneId === 'swamp' && state === 'GAME') {
        const currentTile = getTile(Math.floor((px+8)/TILE), Math.floor((py+8)/TILE));
        if (currentTile === T.BREEZE) {
            if (frameCount % 60 === 0 && stress > 0) stress = Math.max(0, stress - 1);
            if (!flags.has('felt_breeze')) {
                flags.add('felt_breeze');
                startDialogue('swamp_breeze');
            }
        }
    }

    let targetStress = (state === 'COMBAT' && combat) ? combat.playerStress : stress;
    if (displayStress < targetStress) displayStress = Math.min(targetStress, displayStress + 1.5);
    else if (displayStress > targetStress) displayStress = Math.max(targetStress, displayStress - 1.5);

    if (state === 'TITLE') { introTimer++; }
    else if (state === 'CREATOR') {
      let hairIdx = HAIRSTYLES.findIndex(h => h.id === playerPrefs.hair.id);
      let colorIdx = HAIR_COLORS.findIndex(c => c.id === playerPrefs.hairColor.id);
      let skinIdx = SKIN_COLORS.findIndex(s => s.id === playerPrefs.skin.id);

      if (wasDown('ArrowUp')) { 
          creatorFocus = Math.max(0, creatorFocus - 1); 
          if (creatorFocus === 2 && playerPrefs.hair.id === 'bald') creatorFocus = 1;
          sfxTalk.play().catch(()=>{}); 
      }
      if (wasDown('ArrowDown')) { 
          creatorFocus = Math.min(4, creatorFocus + 1); 
          if (creatorFocus === 2 && playerPrefs.hair.id === 'bald') creatorFocus = 3;
          sfxTalk.play().catch(()=>{}); 
      }

      if (creatorFocus === 1) { 
        if (wasDown('ArrowLeft')) { playerPrefs.hair = HAIRSTYLES[(hairIdx - 1 + HAIRSTYLES.length) % HAIRSTYLES.length]; sfxTalk.play().catch(()=>{}); }
        if (wasDown('ArrowRight')) { playerPrefs.hair = HAIRSTYLES[(hairIdx + 1) % HAIRSTYLES.length]; sfxTalk.play().catch(()=>{}); }
      }
      else if (creatorFocus === 2 && playerPrefs.hair.id !== 'bald') { 
        if (wasDown('ArrowLeft')) { playerPrefs.hairColor = HAIR_COLORS[(colorIdx - 1 + HAIR_COLORS.length) % HAIR_COLORS.length]; sfxTalk.play().catch(()=>{}); }
        if (wasDown('ArrowRight')) { playerPrefs.hairColor = HAIR_COLORS[(colorIdx + 1) % HAIR_COLORS.length]; sfxTalk.play().catch(()=>{}); }
      }
      else if (creatorFocus === 3) { 
        if (wasDown('ArrowLeft')) { playerPrefs.skin = SKIN_COLORS[(skinIdx - 1 + SKIN_COLORS.length) % SKIN_COLORS.length]; sfxTalk.play().catch(()=>{}); }
        if (wasDown('ArrowRight')) { playerPrefs.skin = SKIN_COLORS[(skinIdx + 1) % SKIN_COLORS.length]; sfxTalk.play().catch(()=>{}); }
      }
      else if (creatorFocus === 4) {
        if (wasDown('Enter', ' ', 'z', 'Z', 'x', 'X')) {
           playerPrefs.name = playerPrefs.name.trim() || 'Alex';
           state = 'FADE_OUT'; transitionTimer = 90;
           sfxLevelComplete.currentTime=0; sfxLevelComplete.play().catch(()=>{});
        }
      }
    }
    else if (state === 'FADE_OUT') {
      transitionTimer--;
      if (transitionTimer <= 0) { state = 'CUTSCENE'; startDialogue('cutscene_1'); }
    }
    else if (state === 'REST') {
      restTimer--; stress = Math.max(0, stress - (maxStress / 600)); displayStress = stress;
      let pcx = px + 8, pcy = py + 8;
      zone.npcs.forEach(n => {
        if (n.pushX === undefined) n.pushX = 0; if (n.pushY === undefined) n.pushY = 0;
        let nx = (n.px !== undefined ? n.px : n.c * TILE) + 8 + n.pushX;
        let ny = (n.py !== undefined ? n.py : n.r * TILE) + 8 + n.pushY;
        let dist = Math.hypot(nx - pcx, ny - pcy);
        if (dist < 48 && dist > 0.1) { n.pushX += ((nx-pcx)/dist)*2.0; n.pushY += ((ny-pcy)/dist)*2.0; }
      });
      if (restTimer <= 0) {
        state = 'GAME'; stress = 0; displayStress = 0;
        sfxRestart.currentTime = 0; sfxRestart.volume = 1;
        sfxRestart.play().catch(() => { if (!isGameEnding) bgMusic.play(); });
      }
    }
    else if (state === 'VICTORY') {
      victoryTimer--;
      if (victoryTimer <= 0 || wasDown('Enter',' ','z','Z','x','X')) {
          sfxInsight.currentTime = 0; sfxInsight.volume = 1; sfxInsight.play().catch(() => {});
          state = 'GAME';
      }
    }
    else if (state === 'AMBUSH') {
      ambushTimer++;
      let allArrived = true;
      ambushNpcs.forEach(n => {
          let speed = 2; let moved = false;
          if (n.py < n.targetY) { n.py += speed; n.dir = 'down'; moved = true; }
          else if (n.px < n.targetX) { n.px += speed; n.dir = 'right'; moved = true; }
          else if (n.px > n.targetX) { n.px -= speed; n.dir = 'left'; moved = true; }
          if (Math.abs(n.py - n.targetY) > speed || Math.abs(n.px - n.targetX) > speed) allArrived = false;
          if (moved) n.frame = (n.frame || 0) + 0.15;
      });
      if (allArrived && ambushTimer > 30) {
          startDialogue('encounter_hardcore');
          ambushNpcs.forEach(n => {
              n.c = Math.floor(n.px/TILE); n.r = Math.floor(n.py/TILE);
              n.wander = false; n.disengaged = false; n.showExclamation = false;
              if (!zone.npcs.some(zn => zn.id === n.id)) zone.npcs.push(n);
          });
          ambushNpcs = [];
      }
    }
    else if (state === 'QARGI_ENTRANCE') {
       ambushTimer++;
       let allArrived = true;
       const centerX = 7 * TILE;
       const centerY = 4 * TILE;

       ambushNpcs.forEach(n => {
          const dx = n.targetX - n.px;
          const dy = n.targetY - n.py;
          const dist = Math.hypot(dx, dy);

          if (dist > 1.5) {
            const speed = Math.min(1.5, dist * 0.06 + 0.4);
            n.px += (dx / dist) * speed;
            n.py += (dy / dist) * speed;
            n.frame = (n.frame || 0) + 0.08;
            if (Math.abs(dx) > Math.abs(dy)) {
              n.dir = dx > 0 ? 'right' : 'left';
            } else {
              n.dir = dy > 0 ? 'down' : 'up';
            }
            allArrived = false;
          } else {
            n.px = n.targetX;
            n.py = n.targetY;
            const faceDx = centerX - n.px;
            const faceDy = centerY - n.py;
            if (Math.abs(faceDx) > Math.abs(faceDy)) {
              n.dir = faceDx > 0 ? 'right' : 'left';
            } else {
              n.dir = faceDy > 0 ? 'down' : 'up';
            }
          }
       });

       if (allArrived && ambushTimer > 30) {
          ambushNpcs.forEach(n => {
              n.c = Math.floor((n.px + 8)/TILE); n.r = Math.floor((n.py + 8)/TILE);
              n.wander = false;
              if (!zone.npcs.some(zn => zn.id === n.id)) zone.npcs.push(n);
          });
          ambushNpcs = [];
          state = 'GAME';
       }
    }
    else if (state === 'COMBAT') {
      if (combat.phase === 'GASLIGHTING_RESULT') {
          combat.warningTimer = (combat.warningTimer || 0) + 1;
          if (combat.warningTimer > 90) {
              ctx.font = 'bold 10px "VT323", monospace'; 
              const text = `They weaponize the system: "lol". Your reality destabilizes.`;
              combat.resultPages = paginateText(text, GBA_W - 28, 3);
              combat.resultPageI = 0; combat.resultCharI = 0;
              combat.phase = 'RESULT';
              combat.gaslightingActive = false;
          }
      } else if (combat.phase === 'SELECT') {
        const actCount = combat.actions.length;
        if (wasDown('ArrowUp')) { if (combat.actionSel >= 2) combat.actionSel -= 2; }
        if (wasDown('ArrowDown')) { 
            if (combat.actionSel + 2 < actCount) combat.actionSel += 2; 
            else if (combat.actionSel % 2 === 0 && combat.actionSel + 1 < actCount) combat.actionSel += 1; 
        }
        if (wasDown('ArrowLeft')) { if (combat.actionSel % 2 !== 0) combat.actionSel -= 1; }
        if (wasDown('ArrowRight')) { if (combat.actionSel % 2 === 0 && combat.actionSel + 1 < actCount) combat.actionSel += 1; }

        if (wasDown('Enter',' ','z','Z','x','X')) {
          let sel = combat.actions[combat.actionSel].id;
          if (sel === 'exposure' && flags.has('exposure_used')) { /* blocked, do nothing */ }
          else if (sel === 'community' && (ties.size === 0 || combat.communityUsed)) { /* blocked */ } 
          else doPlayerAction(sel);
        }
      } else if (combat.phase === 'RESULT' || combat.phase === 'RESULT_FINAL') {
        const currentLines = combat.resultPages[combat.resultPageI];
        const totalChars = currentLines.join(' ').length;
        if (combat.resultCharI < totalChars) {
          combat.resultCharI += 1.5;
          if (wasDown('Enter',' ','z','Z','x','X')) combat.resultCharI = totalChars;
        }
        if (combat.resultCharI >= totalChars) {
          if (wasDown('Enter',' ','z','Z','x','X')) {
            if (combat.resultPageI < combat.resultPages.length - 1) {
              combat.resultPageI++; combat.resultCharI = 0;
            } else {
              // --- START NEW GLITCH TRIGGER LOGIC ---
              if (combat.triggerGlitchNext) {
                combat.triggerGlitchNext = false;
                
                // 1. Trigger the glitch effects and sounds
                sfxSystemError.currentTime = 0; sfxSystemError.volume = 1; sfxSystemError.play().catch(() => {});
                triggerShake(25);
                combat.queerGlitchActive = true;
                combat.glitchText = true; 
                
                // 2. Clear the standard dialogue box so it's empty behind the glitch
                combat.resultPages = [['']]; 
                combat.resultPageI = 0; combat.resultCharI = 0;
                
                // 3. The Timer (4 seconds) before the Gatekeeper reacts
                setTimeout(() => {
                  if (combat && combat.enemyId === 'hardcore') {
                    triggerShake(15);
                    
                    // NEW: Lower the player's stress because the hack failed!
                    combat.playerStress = Math.max(0, combat.playerStress - 30);
                    
                    // NEW: Update the dialogue to reflect the mechanical change
                    combat.resultPages = paginateText(
                      `"Wait, what?! That's against the rules! You're cheating!" Their failed hack leaves them flustered. Your ties hold strong, and your stress drops!`, 
                      GBA_W - 28, 3
                    );
                    combat.resultPageI = 0; combat.resultCharI = 0;
                    
                    // Turn off the glitch visuals
                    combat.queerGlitchActive = false;
                    combat.glitchText = false;
                    
                    // NEW: Keep the battle going!
                    // Put them in a Defensive state (1) instead of Disengaged (3)
                    combat.enemyState = 1; 
                    // 'RESULT' means after reading, it goes back to the 'SELECT' menu
                    combat.phase = 'RESULT'; 
                  }
                }, 4000);
              
                return;
              }
              // --- END NEW GLITCH TRIGGER LOGIC ---
              if (combat.phase === 'RESULT_FINAL') {
                stress = combat.playerStress; 
                state = 'VICTORY'; victoryTimer = 180; combat = null;
              } else if (combat.playerStress >= maxStress) {
                stress = combat.playerStress; sfxHarasser.currentTime = 0; sfxHarasser.volume = 1; sfxHarasser.play().catch(() => {});
                state = 'GAME'; combat = null;
              } else { combat.phase = 'SELECT'; }
            }
          }
        }
      }
    }
    else if (state === 'DIALOGUE' || state === 'CUTSCENE') {
      const currentLines = dlg.pages[dlg.pageI];
      const totalChars = currentLines.join(' ').length;
      if (dlg.charI < totalChars) {
        dlg.charI += 1; if (wasDown('Enter',' ','z','Z','x','X')) dlg.charI = totalChars;
      } else {
        const isLastPage = dlg.pageI >= dlg.pages.length - 1;
        const hasChoices = isLastPage && dlg.node.choices;
        if (hasChoices) {
          if (wasDown('ArrowUp'))    dlgChoiceSel = Math.max(0, dlgChoiceSel - 1);
          if (wasDown('ArrowDown')) dlgChoiceSel = Math.min(dlg.node.choices.length - 1, dlgChoiceSel + 1);
        }
        if (wasDown('Enter',' ','z','Z','x','X')) {
          if (!isLastPage) { dlg.pageI++; dlg.charI = 0; }
          else {
            if (dlg.node.flag) {
              flags.add(dlg.node.flag);
              if (dlg.node.flag === 'trigger_mount') {
                  flags.add('mounted_dragon');
                  zone.npcs = zone.npcs.filter(n => n.id !== 'dragon'); 
              }
            }
            if (dlg.node.speaker === 'The Circle' && (dlg.node.next === 'qargi_enter_assembled2' || dlg.node.next === 'qargi_enter')) {
              flags.add('qargi_circle_talked');
            }
            if (dlg.node.choices && dlg.node.ties && dlg.node.ties[dlgChoiceSel]) {
              const newTie = dlg.node.ties[dlgChoiceSel];
              if (!ties.has(newTie)) { ties.add(newTie); resilience = 1 + ties.size * 0.1; }
              sfxInsight.currentTime = 0; sfxInsight.volume = 1; sfxInsight.play().catch(() => {});
            } else if (!dlg.node.choices && dlg.node.tie) {
              if (!ties.has(dlg.node.tie)) { ties.add(dlg.node.tie); resilience = 1 + ties.size * 0.1; }
              sfxInsight.currentTime = 0; sfxInsight.volume = 1; sfxInsight.play().catch(() => {});
            }
            const nextNode = dlg.node.next; const combatTrigger = dlg.node.triggerCombat;
            dlg = null;
            if (combatTrigger) {
               if (!flags.has(combatTrigger + '_disengaged')) initCombat(combatTrigger);
               else { state = 'GAME'; } 
            }
            else if (nextNode) {
              if (nextNode === 'intro') { state = 'GAME'; startDialogue('intro'); } else startDialogue(nextNode);
            } else {
              state = 'GAME';
              if (flags.has('completed')) {
                state = 'END'; isGameEnding = true; bgMusic.pause();
                bgFinish.currentTime = 0; bgFinish.volume = 1; bgFinish.play().catch(() => {});
              }
            }
          }
        }
      }
    }
    else if (state === 'END') {
      if (wasDown('Enter',' ','z','Z','x','X')) {
        state = 'TITLE'; introTimer = 0; transitionTimer = 0;
        flags.clear(); ties.clear(); stress = 0; maxStress = 100; displayStress = 0; resilience = 1;
        playerPrefs = { name: '', hair: HAIRSTYLES[0], hairColor: HAIR_COLORS[0], skin: SKIN_COLORS[1] };
        zoneId = 'studio'; zone = ZONES[zoneId]; px = zone.start.x; py = zone.start.y;
        pdir = 'down'; isGameEnding = false; bgFinish.pause(); bgFinish.currentTime = 0;
        projectiles = [];
      }
    }
    else if (state === 'GAME') {
      if (stress >= maxStress) {
        state = 'REST'; restTimer = 600; bgMusic.pause();
        sfxStressed.currentTime = 0; sfxStressed.volume = 1; sfxStressed.play().catch(() => {});
      } else {
        const pc = Math.floor((px+8)/TILE), pr = Math.floor((py+8)/TILE);

        if (zoneId === 'swamp' && state === 'GAME') {
          const pcx = px + 8, pcy = py + 8;
          zone.hazards.forEach(hz => {
            if (!hz.active) return;
            const hcx = hz.px + 8, hcy = hz.py + 8;

            if (hz.shape === 'star') {
              const dist = Math.hypot(hcx - pcx, hcy - pcy);
              if (dist > 1) {
                hz.px += ((pcx - hcx) / dist) * 0.12;
                hz.py += ((pcy - hcy) / dist) * 0.12;
              }
            }

            const colDist = Math.hypot(hcx - pcx, hcy - pcy);
            if (colDist < 10 && !flags.has('mounted_dragon')) {
              const trapStress = Math.floor(20 + Math.random() * 10);
              stress = Math.min(maxStress, stress + trapStress);
              hz.active = false;
              triggerShake(14);
              startDialogue('nostalgia_trap');
            }
            else if (colDist < 10 && flags.has('mounted_dragon')) {
              hz.active = false;
            }
          });
        }

        if (zoneId === 'swamp' && flags.has('hardcore_disobeyed')) {
            if (frameCount % 45 === 0) {
                zone.npcs.forEach(n => {
                    if (n.id === 'toxic' || n.id === 'hardcore') {
                        let angle = Math.atan2((py+8) - (n.py+8), (px+8) - (n.px+8));
                        angle += (Math.random() - 0.5) * 0.5;
                        projectiles.push({ px: n.px+8, py: n.py+8, vx: Math.cos(angle)*1.5, vy: Math.sin(angle)*1.5, text: ['REPORTED FOR HACKING', 'TRY HARD', 'TYPICAL SOCIAL JUSTIC WARRIOR', '?????', 'GIT GUD', 'NOOB', 'SNOWFLAKE'][Math.floor(Math.random()*4)] });
                    }
                });
            }
        }

        for (let i = projectiles.length - 1; i >= 0; i--) {
            let p = projectiles[i];
            p.px += p.vx; p.py += p.vy;
            let dist = Math.hypot(p.px - (px+8), p.py - (py+8));
            if (dist < 12) {
                if (!flags.has('mounted_dragon')) {
                    stress = Math.min(maxStress, stress + 5); triggerShake(5);
                }
                projectiles.splice(i, 1);
            } else if (p.px < 0 || p.px > zone.w*TILE || p.py < 0 || p.py > zone.h*TILE) {
                projectiles.splice(i, 1);
            }
        }

        if (zoneId === 'swamp' && !flags.has('swamp_ambush') && pc >= 16 && pr >= 3 && pr <= 6) {
            flags.add('swamp_ambush');
            state = 'AMBUSH'; ambushTimer = 0;
            ambushCoords = {x: 16*TILE, y: 5*TILE};
            ambushNpcs = [
                { 
                    id: 'hardcore',
                    px: 16*TILE, 
                    py: -16, 
                    targetY: py - 20, 
                    targetX: px,
                    showExclamation: true, 
                    dir: 'down', 
                    dlg: 'encounter_hardcore'
                }
            ];
            sfxHarasser.currentTime = 0; sfxHarasser.play().catch(()=>{});
            pmoving = false;
            return;
        }

        zone.npcs.forEach(n => {
          if (n.reqTie && !ties.has(n.reqTie)) return;
          if (n.pushX) n.pushX *= 0.9; if (n.pushY) n.pushY *= 0.9;
          
          if ((glitchOverrideTimer > 0 || discoActive > 0) && ['whitewasher', 'toxic', 'tokenizer'].includes(n.id)) {
            let nx = (n.px !== undefined ? n.px : n.c * TILE) + 8; let ny = (n.py !== undefined ? n.py : n.r * TILE) + 8;
            let pcx2 = px + 8, pcy2 = py + 8; let dist = Math.hypot(nx - pcx2, ny - pcy2);
            if (dist < 100 && dist > 0.1) { n.pushX += ((nx-pcx2)/dist)*4.0; n.pushY += ((ny-pcy2)/dist)*4.0; }
            n.disengaged = true;
          }

          if (n.wander) {
            if (n.state === undefined) {
              n.px = n.c * TILE; n.py = n.r * TILE; n.startX = n.px; n.startY = n.py;
              n.wait = Math.random() * 60; n.dir = 'down'; n.frame = 0; n.moving = false; n.state = 'idle'; n.moveTimer = 0;
            }
            if (n.state === 'idle') {
              n.wait--;
              if (n.wait <= 0 && !n.disengaged) {
                const dirs = [[0,1,'down'],[0,-1,'up'],[-1,0,'left'],[1,0,'right'],[0,0,n.dir]];
                const pick = dirs[Math.floor(Math.random() * dirs.length)];
                n.dx = pick[0]*0.5; n.dy = pick[1]*0.5; n.dir = pick[2];
                n.moveTimer = Math.random()*60+30; n.state = 'moving';
              }
            } else if (n.state === 'moving' || n.disengaged) {
              let outOfBounds = Math.hypot((n.px+n.dx)-n.startX, (n.py+n.dy)-n.startY) > 48;
              if (outOfBounds && !n.disengaged) { n.dx = 0; n.dy = 0; n.moveTimer = 0; }
              else {
                const nextC = Math.floor((n.px+n.dx+8)/TILE); const currR = Math.floor((n.py+12)/TILE);
                if (!isNpcSolid(nextC, currR, n.id)) n.px += n.dx; else { n.dx = 0; n.moveTimer = 0; }
                const currC = Math.floor((n.px+8)/TILE); const nextR = Math.floor((n.py+n.dy+12)/TILE);
                if (!isNpcSolid(currC, nextR, n.id)) n.py += n.dy; else { n.dy = 0; n.moveTimer = 0; }
                n.c = Math.floor((n.px+8)/TILE); n.r = Math.floor((n.py+8)/TILE);
                n.moving = (n.dx!==0||n.dy!==0);
                if (n.moving) n.frame = (n.frame+0.05)%4;
              }
              n.moveTimer--;
              if (n.moveTimer <= 0 && !n.disengaged) { n.dx=0; n.dy=0; n.moving=false; n.frame=0; n.wait=Math.random()*120+60; n.state='idle'; }
            }
          }
        });

        let dx = 0, dy = 0;
        let speed = flags.has('mounted_dragon') ? 3.0 : 2.0;

        if (isDown('ArrowUp')) { dy = -speed; pdir = 'up'; }
        else if (isDown('ArrowDown')) { dy = speed; pdir = 'down'; }
        else if (isDown('ArrowLeft')) { dx = -speed; pdir = 'left'; }
        else if (isDown('ArrowRight')) { dx = speed; pdir = 'right'; }

        pmoving = dx !== 0 || dy !== 0;
        if (pmoving) {
          pframe = (pframe+0.1)%4;
          const nc = Math.floor((px+dx+8)/TILE), nr = Math.floor((py+dy+12)/TILE);
          if (!solid(nc, Math.floor((py+12)/TILE))) px += dx;
          if (!solid(Math.floor((px+8)/TILE), nr)) py += dy;
        } else pframe = 0;

        const currentTile = getTile(pc, pr);
        if (currentTile === T.DISCO) {
          stress = Math.max(0, stress - 50); zone.grid[pr][pc] = T.GRASS;
          discoActive = 180; glitchOverrideTimer = 180; triggerShake(30);
          zone.npcs.forEach(n => { if (['whitewasher', 'toxic', 'tokenizer'].includes(n.id)) flags.add(n.id + '_disengaged'); });
          sfxInsight.currentTime = 0; sfxInsight.play().catch(()=>{}); startDialogue('disco_ball');
        }

        const exit = zone.exits.find(e => e.c === pc && e.r === pr);
        if (exit) {
          zoneId = exit.dest; zone = ZONES[zoneId]; px = exit.spawnX; py = exit.spawnY;
          projectiles = []; 
          camera.x = Math.max(0, Math.min(zone.w*TILE - GBA_W, px - GBA_W/2));
          camera.y = Math.max(0, Math.min(zone.h*TILE - GBA_H, py - GBA_H/2));
          const enterTrigger = zone.interacts.find(i => i.check && i.c === pc && i.r === pr);
          
          if (zoneId === 'qargi' && !flags.has('qargi_entered_once')) {
              flags.add('qargi_entered_once');
              ambushTimer = 0; ambushNpcs = [];
              const potentialQargiNpcs = [
                  { id:'kai',    reqTie:'kai',    targetX: 4*TILE,  targetY: 4*TILE,  dlg:'qargi_kai' },
                  { id:'dev',    reqTie:'dev',    targetX: 10*TILE, targetY: 4*TILE,  dlg:'qargi_dev' },
                  { id:'ada',    reqTie:'ada',    targetX: 5*TILE,  targetY: 3*TILE,  dlg:'qargi_ada' },
                  { id:'mentor', reqTie:'mentor', targetX: 9*TILE,  targetY: 3*TILE,  dlg:'qargi_mentor' },
                  { id:'sage',   reqTie:'sage',   targetX: 5*TILE,  targetY: 6*TILE,  dlg:'qargi_sage' },
                  { id:'river',  reqTie:'river',  targetX: 9*TILE,  targetY: 6*TILE,  dlg:'qargi_river' }
              ];
              potentialQargiNpcs.forEach(n => {
                  if (ties.has(n.reqTie)) ambushNpcs.push({...n, px: 7*TILE, py: 9*TILE, dir: 'up'});
              });
              if (ambushNpcs.length > 0) { state = 'QARGI_ENTRANCE'; pmoving = false; return; }
          }
          
          if (enterTrigger) { const res = enterTrigger.check(flags); if (res) startDialogue(res); }
        }

        if (stress > 0 && !pmoving && !flags.has('mounted_dragon')) {
          stress = Math.max(0, stress - 0.02*resilience);
        }
        if (wasDown('Enter',' ','z','Z','x','X')) {
          if (flags.has('mounted_dragon')) return;

          let ix = px+8, iy = py+8;
          if (pdir==='up') iy-=14; if (pdir==='down') iy+=14;
          if (pdir==='left') ix-=14; if (pdir==='right') ix+=14;
          let closest = null, minDist = 18;
          
          zone.npcs.forEach(n => {
            if (n.disengaged && n.id !== 'dragon') return;
            let nx = (n.px!==undefined?n.px:n.c*TILE)+8+(n.pushX||0); 
            let ny = (n.py!==undefined?n.py:n.r*TILE)+8+(n.pushY||0);
            let d = Math.hypot(ix-nx,iy-ny);

            if (d < minDist) {
              if (n.id === 'dragon' && flags.has('dragon_introduced')) {
                flags.add('mounted_dragon');
                zone.npcs = zone.npcs.filter(npc => npc.id !== 'dragon');
                sfxInsight.currentTime = 0; sfxInsight.play().catch(()=>{});
                closest = null;
              } else {
                closest = typeof n.dlg === 'function' ? n.dlg(flags, ties) : n.dlg;
              }
              minDist = d;
            }
          });
          zone.interacts.forEach(i => {
            let d = Math.hypot(ix-(i.c*TILE+8),iy-(i.r*TILE+8));
            if (d < minDist) { const res = i.check(flags); if (res) { minDist = d; closest = res; } }
          });
          if (closest) {
            sfxTalk.currentTime = 0; sfxTalk.volume = 1; sfxTalk.play().catch(() => {});
            startDialogue(closest);
          }
        }
      }
    }

    if (['GAME','DIALOGUE','CUTSCENE','COMBAT','REST','AMBUSH','QARGI_ENTRANCE','VICTORY'].includes(state)) {
      let shakeDx = shakeFrames > 0 ? (Math.random()-0.5)*4 : 0;
      let shakeDy = shakeFrames > 0 ? (Math.random()-0.5)*4 : 0;
      camera.x = Math.max(0, Math.min(zone.w*TILE - GBA_W, px - GBA_W/2)) + shakeDx;
      camera.y = Math.max(0, Math.min(zone.h*TILE - GBA_H, py - GBA_H/2)) + shakeDy;
    }
    justDown.clear();
  }

  // ── DRAWING ──────────────────────────────────────────────────
  function drawHair(x, y, hId, hexColor) {
    if (hId === 'bald') return;
    ctx.fillStyle = hexColor;
    if (hId === 'afro') {
      ctx.beginPath(); ctx.arc(x+20, y+8, 14, 0, Math.PI*2); ctx.fill();
    } else if (hId === 'locs') {
      ctx.fillRect(x+6, y+4, 28, 10); ctx.fillRect(x+4, y+14, 6, 18); ctx.fillRect(x+30, y+14, 6, 18);
    } else if (hId === 'twists') {
      for(let i=0;i<4;i++) for(let j=0;j<7;j++) if((i+j)%2===0) ctx.fillRect(x+6+(j*4), y+4+(i*4), 4, 4);
    } else if (hId === 'braids') {
      ctx.fillRect(x+6, y+4, 28, 6); 
      ctx.fillRect(x+8, y+10, 4, 16); ctx.fillRect(x+18, y+10, 4, 16); ctx.fillRect(x+28, y+10, 4, 16); 
    }
  }

  function drawProceduralFace(id, x, y) {
    ctx.fillStyle = '#202030'; ctx.fillRect(x, y, 40, 40);
    if (id === 'none') return;
    ctx.fillStyle = PAL.boxBorder; ctx.fillRect(x+1, y+1, 38, 38);
    ctx.fillStyle = '#101018'; ctx.fillRect(x+2, y+2, 36, 36);

    if (id === 'narrator') {
      ctx.fillStyle = '#404060'; ctx.fillRect(x+6,y+10,28,4); ctx.fillRect(x+6,y+18,20,4); ctx.fillRect(x+6,y+26,24,4);
      return;
    }

    const skinColor = (id === 'player') ? playerPrefs.skin.hex : ((id==='dev'||id==='ada'||id==='whitewasher'||id==='tokenizer') ? '#b88a68' : '#f0d8b8');
    ctx.fillStyle = skinColor; ctx.fillRect(x+8, y+8, 24, 24);
    
    if (id === 'player') {
      drawHair(x, y, playerPrefs.hair.id, playerPrefs.hairColor.hex);
    } else {
      let hc = PRIDE[0];
      if (id==='kai') hc=PRIDE[4];
      else if (id==='ada') hc=PRIDE[5];
      else if (id==='mentor') hc='#a0a0a0';
      else if (id==='circle') hc=PRIDE[3];
      else if (id==='whitewasher') hc='#ccaa66';
      else if (id==='toxic') hc='#ff4444';
      else if (id==='tokenizer') hc='#4bb';
      else if (id==='sage') hc=PRIDE[2];
      else if (id==='river') hc=PRIDE[4];
      else if (id==='dev') hc=PRIDE[0];
      else if (id==='harasser') hc='#cc2222';
      ctx.fillStyle = hc; ctx.fillRect(x+6,y+4,28,12);
    }

    ctx.fillStyle = '#000'; ctx.fillRect(x+12,y+16,4,4); ctx.fillRect(x+24,y+16,4,4);
    
    if (id === 'player') {
      for (let i=0;i<PRIDE.length;i++) { ctx.fillStyle=PRIDE[i]; ctx.fillRect(x+8,y+26+i,24,1); }
    }
  }

  function drawCharacterSprite(ctx2, dx, dy, id, dir, isMoving, frame) {
    if (id === 'dragon') {
        ctx2.save();
        ctx2.translate(dx + 8, dy + 8);
        if (dir === 'left') ctx2.scale(-1, 1);
        ctx2.translate(-(dx + 8), -(dy + 8));

        ctx2.fillStyle = '#5c2a9d'; 
        ctx2.fillRect(dx+4, dy+8, 16, 10);
        ctx2.fillRect(dx-2, dy+12, 6, 4);
        ctx2.fillRect(dx-6, dy+10, 4, 2);
        ctx2.fillRect(dx+16, dy+2, 6, 8); 
        ctx2.fillRect(dx+20, dy+2, 6, 5); 
        ctx2.fillStyle = '#ffea00'; ctx2.fillRect(dx+22, dy+3, 2, 2);
        ctx2.fillStyle = '#ffaa00'; ctx2.fillRect(dx+14, dy, 4, 2);
        ctx2.fillStyle = 'rgba(250, 204, 21, 0.85)';
        const wingY = (isMoving || flags.has('mounted_dragon')) && Math.floor(frame)%2!==0 ? -4 : 0;
        ctx2.beginPath(); ctx2.moveTo(dx+12, dy+8); ctx2.lineTo(dx-2, dy-2+wingY); ctx2.lineTo(dx+8, dy+2+wingY); ctx2.fill();
        ctx2.beginPath(); ctx2.moveTo(dx+14, dy+8); ctx2.lineTo(dx+22, dy-6+wingY); ctx2.lineTo(dx+16, dy+2+wingY); ctx2.fill();
        ctx2.restore();
        return;
    }

    ctx2.fillStyle = 'rgba(0,0,0,0.4)';
    ctx2.beginPath(); ctx2.ellipse(dx+8,dy+14,6,3,0,0,Math.PI*2); ctx2.fill();
    
    if (id === 'player' && flags.has('mounted_dragon')) {
        ctx2.save();
        ctx2.translate(dx + 8, dy + 8);
        if (dir === 'left') ctx2.scale(-1, 1);
        ctx2.translate(-(dx + 8), -(dy + 8));
        ctx2.fillStyle = '#5c2a9d'; 
        ctx2.fillRect(dx+4, dy+8, 16, 10);
        ctx2.fillRect(dx-2, dy+12, 6, 4);
        ctx2.fillRect(dx-6, dy+10, 4, 2);
        ctx2.fillRect(dx+16, dy+2, 6, 8); 
        ctx2.fillRect(dx+20, dy+2, 6, 5); 
        ctx2.fillStyle = '#ffea00'; ctx2.fillRect(dx+22, dy+3, 2, 2);
        ctx2.fillStyle = '#ffaa00'; ctx2.fillRect(dx+14, dy, 4, 2);
        ctx2.fillStyle = 'rgba(250, 204, 21, 0.85)';
        const wingY2 = isMoving && Math.floor(frame)%2!==0 ? -4 : 0;
        ctx2.beginPath(); ctx2.moveTo(dx+12, dy+8); ctx2.lineTo(dx-2, dy-2+wingY2); ctx2.lineTo(dx+8, dy+2+wingY2); ctx2.fill();
        ctx2.beginPath(); ctx2.moveTo(dx+14, dy+8); ctx2.lineTo(dx+22, dy-6+wingY2); ctx2.lineTo(dx+16, dy+2+wingY2); ctx2.fill();
        ctx2.restore();
        dy -= 12; 
    }

    dy -= (isMoving && Math.floor(frame)%2!==0) ? 1 : 0;
    
    const skinColor = (id === 'player') ? playerPrefs.skin.hex : 
      ((id==='dev'||id==='ada'||id==='whitewasher'||id==='tokenizer') ? '#b88a68' : 
      (id==='red_scout' ? '#c85050' : '#f0d8b8'));
    ctx2.fillStyle = skinColor; ctx2.fillRect(dx+4, dy+2, 8, 8);
    
    if (id === 'player') {
       ctx2.fillStyle = playerPrefs.hairColor.hex;
       const hId = playerPrefs.hair.id;
       if (hId === 'afro') { ctx2.beginPath(); ctx2.arc(dx+8,dy+1,7,0,Math.PI*2); ctx2.fill(); }
       else if (hId === 'locs') { ctx2.fillRect(dx+3,dy-2,10,6); ctx2.fillRect(dx+2,dy+4,3,4); ctx2.fillRect(dx+11,dy+4,3,4); }
       else if (hId === 'twists') { ctx2.fillRect(dx+4,dy-1,2,2); ctx2.fillRect(dx+8,dy-1,2,2); ctx2.fillRect(dx+3,dy+1,2,2); ctx2.fillRect(dx+11,dy+1,2,2); }
       else if (hId === 'braids') { ctx2.fillRect(dx+3,dy-1,10,3); ctx2.fillRect(dx+4,dy+2,1,6); ctx2.fillRect(dx+8,dy+2,1,6); ctx2.fillRect(dx+11,dy+2,1,6); }
    } else {
      let hc = PRIDE[0];
      if (id==='kai') hc=PRIDE[4]; else if (id==='ada') hc=PRIDE[5]; else if (id==='dev') hc=PRIDE[0];
      else if (id==='mentor') hc='#a0a0a0'; else if (id==='circle') hc=PRIDE[3]; else if (id==='sage') hc=PRIDE[2]; 
      else if (id==='river') hc=PRIDE[4];
      else if (id==='whitewasher') hc='#ccaa66'; else if (id==='toxic') hc='#ff4444'; else if (id==='tokenizer') hc='#4bb';
      else if (id==='red_scout') hc='#cc2222';
      ctx2.fillStyle = hc; ctx2.fillRect(dx+3,dy+1,10,4); ctx2.fillRect(dx+3,dy+4,2,4); ctx2.fillRect(dx+11,dy+4,2,4);
    }

    ctx2.fillStyle = '#000';
    if (dir==='down') { ctx2.fillRect(dx+5,dy+5,2,2); ctx2.fillRect(dx+9,dy+5,2,2); }
    else if (dir==='left') { ctx2.fillRect(dx+4,dy+5,2,2); }
    else if (dir==='right') { ctx2.fillRect(dx+10,dy+5,2,2); }
    
    let bodyColor = PRIDE[3];
    if (id==='player') bodyColor='#404040'; else if (id==='kai') bodyColor=PRIDE[5]; else if (id==='ada') bodyColor=PRIDE[1];
    else if (id==='toxic') bodyColor='#441111'; else if (id==='tokenizer') bodyColor='#227';
    else if (id==='red_scout') bodyColor='#8b0000';
    ctx2.fillStyle = bodyColor; ctx2.fillRect(dx+4,dy+10,8,5);
    
    if (id==='player') {
      const strH = 4/PRIDE.length;
      for (let i=0;i<PRIDE.length;i++) { ctx2.fillStyle=PRIDE[i]; ctx2.fillRect(dx+4,dy+11+(i*strH),8,strH); }
    }
    ctx2.fillStyle = '#222';
    if (isMoving && Math.floor(frame)%2!==0) {
      if (dir==='left'||dir==='right') ctx2.fillRect(dx+6,dy+15,4,3);
      else { ctx2.fillRect(dx+4,dy+14,3,3); ctx2.fillRect(dx+9,dy+15,3,3); }
    } else { ctx2.fillRect(dx+4,dy+15,3,3); ctx2.fillRect(dx+9,dy+15,3,3); }
  }

  const GLITCH_CHARS = '!@#$%&*?█▓▒░';
  function scrambleText(text, amount) {
    return text.split('').map(c => Math.random() < amount ? GLITCH_CHARS[Math.floor(Math.random()*GLITCH_CHARS.length)] : c).join('');
  }
  
  function drawQueerGlitch(intensity, isCampOverride, isGaslighting) {
    if (intensity <= 0 && !isCampOverride && !isGaslighting) return;
    const t = Date.now();
    const effectiveIntensity = isCampOverride ? 1.0 : (isGaslighting ? 0.9 : intensity);
    const shift = Math.floor(effectiveIntensity * 4);
    
    ctx.save(); ctx.globalCompositeOperation = 'screen'; ctx.globalAlpha = effectiveIntensity * 0.3;
    ctx.fillStyle = '#ff000033'; ctx.fillRect(-shift, 0, GBA_W, GBA_H);
    ctx.fillStyle = '#0000ff33'; ctx.fillRect(shift, 0, GBA_W, GBA_H);
    ctx.restore();
    
    ctx.save(); ctx.globalAlpha = effectiveIntensity * 0.15; ctx.fillStyle = '#000';
    for (let y = 0; y < GBA_H; y += 6) { ctx.fillRect(0, y, GBA_W, 2); }
    ctx.restore();

    if (Math.floor(t/80)%3===0 && effectiveIntensity > 0.3) {
      ctx.save(); ctx.globalAlpha = effectiveIntensity * 0.4;
      ctx.fillStyle = PRIDE[Math.floor(Math.random()*PRIDE.length)];
      ctx.fillRect(0, Math.floor(Math.random()*GBA_H), GBA_W, Math.floor(Math.random()*6)+2);
      ctx.restore();
    }

    if ((isCampOverride || isGaslighting) && Math.random() > 0.6) {
        ctx.save(); ctx.globalAlpha = 0.6;
        ctx.fillStyle = PRIDE[Math.floor(Math.random()*PRIDE.length)];
        const rx = Math.random() * GBA_W; const ry = Math.random() * GBA_H;
        ctx.translate(rx, ry); ctx.scale(1.5, 1.5);
        if (Math.random() > 0.5) {
            ctx.beginPath(); ctx.moveTo(0,0); ctx.lineTo(10,0); ctx.lineTo(8,20); ctx.lineTo(15,25); ctx.lineTo(15,30); ctx.lineTo(0,30); ctx.fill();
        } else {
            ctx.beginPath(); ctx.moveTo(0,0); ctx.lineTo(20,-10); ctx.lineTo(25,0); ctx.lineTo(10,10); ctx.fill();
        }
        ctx.restore();
    }
  }

  function drawNostalgiaTrap(hpx, hpy, shape) {
    const dx = hpx, dy = hpy;
    const pulse = 0.7+0.3*Math.sin(Date.now()/200+dx+dy);
    ctx.fillStyle=PAL.grass; ctx.fillRect(dx,dy,TILE,TILE);
    if (shape === 'coin') {
      ctx.fillStyle=`rgba(255,220,0,${pulse})`;
      ctx.beginPath(); ctx.ellipse(dx+8, dy+8, 5, 6, 0, 0, Math.PI*2); ctx.fill();
      ctx.fillStyle = '#c8a000'; ctx.beginPath(); ctx.ellipse(dx+8, dy+8, 2, 5, 0, 0, Math.PI*2); ctx.fill();
    } else if (shape === 'mushroom') {
      ctx.fillStyle = '#e03020'; ctx.beginPath(); ctx.arc(dx+8, dy+7, 6, Math.PI, 0); ctx.fill();
      ctx.fillStyle = '#f8f8f8'; ctx.fillRect(dx+4, dy+9, 8, 5);
      ctx.fillStyle = '#ffffffcc'; ctx.fillRect(dx+5, dy+5, 3, 3); ctx.fillRect(dx+10, dy+6, 2, 2);
    } else if (shape === 'star') {
      ctx.fillStyle = `rgba(248, 224, 0, ${pulse})`;
      const cx = dx+8, cy = dy+8, r1 = 6, r2 = 3;
      ctx.beginPath();
      for (let i = 0; i < 5; i++) {
        const a1 = (i * 2 * Math.PI / 5) - Math.PI/2, a2 = a1 + Math.PI/5;
        if (i === 0) ctx.moveTo(cx + r1*Math.cos(a1), cy + r1*Math.sin(a1));
        else ctx.lineTo(cx + r1*Math.cos(a1), cy + r1*Math.sin(a1));
        ctx.lineTo(cx + r2*Math.cos(a2), cy + r2*Math.sin(a2));
      }
      ctx.closePath(); ctx.fill();
      ctx.strokeStyle=`rgba(255, 80, 0, ${pulse})`; ctx.lineWidth=1; ctx.stroke();
    }
  }

  function drawDiscoBall(dx, dy) {
      const t = Date.now() / 150;
      ctx.fillStyle=PAL.grass; ctx.fillRect(dx,dy,TILE,TILE);
      ctx.save(); ctx.translate(dx + 8, dy + 8);
      ctx.globalAlpha = 0.4 + 0.2 * Math.sin(t);
      ctx.fillStyle = PRIDE[Math.floor(t) % PRIDE.length];
      ctx.beginPath(); ctx.arc(0, 0, 10, 0, Math.PI*2); ctx.fill();
      ctx.globalAlpha = 1.0; ctx.fillStyle = '#eee'; ctx.beginPath(); ctx.arc(0, 0, 6, 0, Math.PI*2); ctx.fill();
      for(let i=0; i<12; i++) {
          ctx.fillStyle = Math.random() > 0.5 ? '#fff' : '#ccc';
          const a = i * Math.PI/6 + t;
          ctx.fillRect(Math.cos(a)*4 - 1, Math.sin(a)*4 - 1, 2, 2);
      }
      ctx.restore();
  }

  function draw() {
    ctx.save(); ctx.scale(SCALE, SCALE); ctx.clearRect(0,0,GBA_W,GBA_H);
    ctx.font = 'bold 10px "VT323", monospace';

    if (state==='TITLE'||state==='FADE_OUT') {
      ctx.fillStyle='#0a0a14'; ctx.fillRect(0,0,GBA_W,GBA_H);
      const t = Date.now()/1000;
      for (let i=0;i<PRIDE.length;i++) {
        ctx.strokeStyle=PRIDE[i]+'33'; ctx.lineWidth=2; ctx.beginPath();
        for (let x=0;x<GBA_W;x+=4) { const y=GBA_H/2+Math.sin(x/40+t+i)*(15+i*5); x===0?ctx.moveTo(x,y):ctx.lineTo(x,y); }
        ctx.stroke();
      }
      ctx.fillStyle='#fff'; ctx.font='22px "VT323", monospace'; ctx.textAlign='center';
      ctx.fillText('SURVIVANCE', GBA_W/2, GBA_H/2-15);
      ctx.fillStyle='#aaa'; ctx.font='10px "VT323", monospace';
      ctx.fillText('A Representational Audit', GBA_W/2, GBA_H/2+5);
      if (state==='TITLE' && Math.floor(Date.now()/400)%2===0) {
        ctx.fillStyle=PRIDE[0]; ctx.fillText('Press ENTER', GBA_W/2, GBA_H-25);
      }
      if (state==='FADE_OUT') {
        ctx.fillStyle=`rgba(0,0,0,${1-(transitionTimer/90)})`; ctx.fillRect(0,0,GBA_W,GBA_H);
      }
      ctx.restore(); return;
    }

    if (state === 'CREATOR') {
      ctx.fillStyle = '#0a0a14'; ctx.fillRect(0, 0, GBA_W, GBA_H);
      ctx.fillStyle = '#202030'; ctx.fillRect(10, 20, 60, 60);
      ctx.fillStyle = PAL.boxBorder; ctx.fillRect(12, 22, 56, 56);
      ctx.fillStyle = '#101018'; ctx.fillRect(14, 24, 52, 52);
      ctx.save(); ctx.translate(10, 20); ctx.scale(1.5, 1.5);
      drawProceduralFace('player', 0, 0); ctx.restore();

      ctx.font = '10px "VT323", monospace'; ctx.textAlign = 'left';
      const cFocus = creatorFocus === 0 ? PRIDE[0] : '#fff';
      ctx.fillStyle = cFocus; ctx.fillText("NAME:", 80, 25);
      ctx.fillStyle = '#222'; ctx.fillRect(116, 16, 100, 12);
      ctx.fillStyle = cFocus; ctx.fillText(playerPrefs.name + (creatorFocus===0 && Math.floor(Date.now()/300)%2 ? '_' : ''), 120, 25);

      const hFocus = creatorFocus === 1 ? PRIDE[0] : '#fff';
      ctx.fillStyle = hFocus; ctx.fillText("HAIR:", 80, 45); ctx.fillText(`◄ ${playerPrefs.hair.name} ►`, 120, 45);

      const hcFocus = creatorFocus === 2 ? PRIDE[0] : '#fff';
      ctx.fillStyle = hcFocus; ctx.fillText("COLOR:", 80, 65);
      if (playerPrefs.hair.id === 'bald') { ctx.fillStyle = '#555'; ctx.fillText(`◄ N/A ►`, 120, 65); }
      else { ctx.fillText(`◄ ${playerPrefs.hairColor.name} ►`, 120, 65); }

      const sFocus = creatorFocus === 3 ? PRIDE[0] : '#fff';
      ctx.fillStyle = sFocus; ctx.fillText("SKIN:", 80, 85); ctx.fillText(`◄ ${playerPrefs.skin.name} ►`, 120, 85);

      const stFocus = creatorFocus === 4 ? PRIDE[0] : '#fff';
      ctx.fillStyle = stFocus; ctx.textAlign = 'center';
      ctx.fillText(creatorFocus===4 ? "▶ BEGIN ◀" : "BEGIN", GBA_W/2, GBA_H - 30);
      ctx.fillStyle = '#888'; ctx.font = '8px "VT323", monospace';
      ctx.fillText('Arrows to select, Enter to confirm', GBA_W/2, GBA_H - 10);
      ctx.restore(); return;
    }

    if (state==='END') {
      ctx.fillStyle='#000'; ctx.fillRect(0,0,GBA_W,GBA_H);
      ctx.fillStyle='#fff'; ctx.font='14px "VT323", monospace'; ctx.textAlign='center';
      ctx.fillText('SURVIVANCE', GBA_W/2, GBA_H/2-25);
      ctx.font='10px "VT323", monospace'; ctx.fillStyle='#888';
      ctx.fillText('An ETEC 544 Intellectual Production.', GBA_W/2, GBA_H/2-5);
      ctx.fillStyle=PRIDE[4]; ctx.fillText('Thank you for playing.', GBA_W/2, GBA_H/2+15);
      if (Math.floor(Date.now()/400)%2===0) {
        ctx.fillStyle=PRIDE[0]; ctx.fillText('Press SPACE or ENTER to restart', GBA_W/2, GBA_H/2+40);
      }
      ctx.restore(); return;
    }

    const glitchIntensity = stress > 70 ? (stress - 70) / 30 : 0; 
    const isCampOverride = glitchOverrideTimer > 0;
    const isGaslighting = (state === 'COMBAT' && combat && combat.gaslightingActive);

    if (['GAME','DIALOGUE','REST','AMBUSH','QARGI_ENTRANCE','VICTORY'].includes(state)) {
      if (state==='REST') ctx.filter='grayscale(100%)';
      else if (displayStress > 70 && discoActive === 0) ctx.filter = 'contrast(120%) hue-rotate(15deg)'; 

      ctx.translate(-Math.floor(camera.x), -Math.floor(camera.y));
      const isQargi = (zoneId === 'qargi');
      const t = Date.now()/1000;

      if (zoneId === 'swamp' && state === 'GAME') {
          ctx.fillStyle = 'rgba(150, 255, 200, 0.2)';
          for(let i=0; i<15; i++) {
              ctx.fillRect( (t*100 + i*40) % (ZONES.swamp.w*TILE), Math.sin(i)*ZONES.swamp.h*TILE, 15, 1 );
          }
      }

      for (let r=0;r<zone.grid.length;r++) {
        for (let c=0;c<zone.grid[r].length;c++) {
          const tile=zone.grid[r][c]; const dx=c*TILE, dy=r*TILE;
          if (dx<camera.x-TILE||dx>camera.x+GBA_W||dy<camera.y-TILE||dy>camera.y+GBA_H) continue;

          if (tile===T.FLOOR) {
            ctx.fillStyle=isQargi ? '#d8e8d0' : PAL.boxBg; ctx.fillRect(dx,dy,TILE,TILE);
            ctx.strokeStyle=isQargi ? '#b8c8b0' : PAL.highlight; ctx.lineWidth=isQargi ? 0.5 : 1; ctx.strokeRect(dx,dy,TILE,TILE);
          } else if (tile===T.WALL) {
            ctx.fillStyle=PAL.boxBorder; ctx.fillRect(dx,dy,TILE,TILE); ctx.fillStyle=PAL.wall; ctx.fillRect(dx,dy,TILE,TILE-4);
            ctx.fillStyle='#909090'; ctx.fillRect(dx,dy,TILE,2);
          } else if (tile===T.BRIDGE) {
            ctx.fillStyle=PAL.dirt; ctx.fillRect(dx,dy,TILE,TILE);
            ctx.fillStyle='#705030'; ctx.fillRect(dx,dy,TILE,2); ctx.fillRect(dx,dy+TILE-2,TILE,2);
          } else if (tile===T.GRASS) {
            ctx.fillStyle=PAL.grass; ctx.fillRect(dx,dy,TILE,TILE);
            if (!isQargi) { ctx.strokeStyle='#30683055'; ctx.lineWidth=1; ctx.strokeRect(dx,dy,TILE,TILE); }
          } else if (tile===T.DIRT) { ctx.fillStyle=PAL.dirt; ctx.fillRect(dx,dy,TILE,TILE);
          } else if (tile===T.BREEZE) { 
            ctx.fillStyle='#58a858'; ctx.fillRect(dx,dy,TILE,TILE); 
            ctx.fillStyle='rgba(150, 255, 200, 0.4)';
            const offset = (Date.now()/50 + dx + dy) % TILE;
            ctx.fillRect(dx + offset, dy + offset/2, 4, 1);
            ctx.fillRect(dx + (offset+8)%TILE, dy + (offset/2+4)%TILE, 2, 1);
          } else if (tile===T.TREE) { ctx.fillStyle=PAL.grass; ctx.fillRect(dx,dy,TILE,TILE); ctx.fillStyle='#184818'; ctx.beginPath(); ctx.arc(dx+8,dy+8,7,0,Math.PI*2); ctx.fill();
          } else if (tile===T.GATE) { ctx.fillStyle=flags.has('door_open')?PAL.boxBg:'#804040'; ctx.fillRect(dx,dy,TILE,TILE); if (flags.has('door_open')) { ctx.strokeStyle=PAL.highlight; ctx.strokeRect(dx,dy,TILE,TILE); }
          } else if (tile===T.EXIT) { ctx.fillStyle='#222'; ctx.fillRect(dx,dy,TILE,TILE); ctx.fillStyle=`rgba(0,255,100,${0.2+0.2*Math.sin(Date.now()/200)})`; ctx.fillRect(dx,dy,TILE,TILE); ctx.fillStyle='#111'; ctx.fillRect(dx+2,dy+2,12,14); ctx.fillStyle='#8ada8a'; ctx.fillRect(dx+4,dy+4,8,12);
          } else if (tile===T.HAZARD) { ctx.fillStyle='#5e1e1e'; ctx.fillRect(dx,dy,TILE,TILE); ctx.fillStyle='#ff001844'; ctx.fillRect(dx,dy,TILE,TILE);
          } else if (tile===T.DISCO) { drawDiscoBall(dx, dy); 
        } else if (tile===T.TERMINAL) {
             ctx.fillStyle=PAL.boxBorder; ctx.fillRect(dx,dy,TILE,TILE); ctx.fillStyle=PAL.wall; ctx.fillRect(dx,dy,TILE,4);
             ctx.fillStyle='#000'; ctx.fillRect(dx+2, dy+2, 12, 8); 
             
             // CHANGE: Flashing indicator + greyed-out "Report Racism/Queerphobia" button
             if (flags.has('hr_reported') && !flags.has('hr_hacked')) {
                 if (Math.floor(frameCount / 15) % 2 === 0) {
                     ctx.fillStyle = '#ff0018';
                 } else {
                     ctx.fillStyle = '#400000';
                 }
                 ctx.fillRect(dx + 3, dy + 3, 10, 6);
                 ctx.fillStyle = '#fff';
                 ctx.fillRect(dx + 4, dy + 4 + (Math.sin(frameCount/5)*2), 8, 1);
             } else if (flags.has('hr_hacked')) {
                 ctx.fillStyle = '#00ffff'; ctx.fillRect(dx + 3, dy + 3, 10, 6);
             } else {
                 ctx.fillStyle='#00aaff'; ctx.fillRect(dx+3, dy+3, 10, 6);
                 if (Math.floor(Date.now()/500)%2) { ctx.fillStyle='#fff'; ctx.fillRect(dx+4, dy+4, 4, 1); }
             }
          
          }
        }
      }

      if (zoneId === 'swamp') {
          zone.hazards.forEach(hz => { if (hz.active) drawNostalgiaTrap(hz.px, hz.py, hz.shape); });
      }
      
      projectiles.forEach(p => {
          ctx.fillStyle = '#ff0000';
          ctx.font = 'bold 8px "VT323", monospace';
          ctx.fillText(p.text, p.px, p.py);
      });

if (zoneId === 'studio' && flags.has('hr_reported')) {
        ctx.fillStyle = '#ff0000';
        ctx.font = 'bold 8px "VT323", monospace'; ctx.textAlign='center';
        ctx.fillText("81% OF DEVS", 5*TILE + 8, 4*TILE - 6 + Math.sin(t*4)*2); 
        ctx.fillText("ARE WHITE", 5*TILE + 8, 4*TILE + 2 + Math.sin(t*4)*2);
      }
      if (zoneId === 'swamp' && flags.has('hardcore_disobeyed')) {
          ctx.save(); ctx.translate(ambushCoords.x, ambushCoords.y); 
          ctx.fillStyle = '#ff00ff'; ctx.font = 'bold 12px "VT323", monospace'; ctx.textAlign='left';
          ctx.rotate(-0.1);
          ctx.fillText("I WILL NOT PROVE", 0, 0); ctx.fillText("MY WORTH TO YOU.", 10, 12);
          ctx.restore();
      }

      zone.npcs.forEach(n => {
        let drawX = (n.px!==undefined?n.px:n.c*TILE)+(n.pushX||0);
        let drawY = (n.py!==undefined?n.py:n.r*TILE)+(n.pushY||0);
        if (displayStress > 70 && (n.id === 'toxic' || n.id === 'whitewasher' || n.id === 'tokenizer')) {
           ctx.globalAlpha = 0.5; drawCharacterSprite(ctx, drawX - 2, drawY, n.id, n.dir || 'down', n.moving || false, n.frame || 0); ctx.globalAlpha = 1.0;
        }
        drawCharacterSprite(ctx, drawX, drawY, n.id, n.dir||'down', n.moving||false, n.frame||0);

        if (n.id==='circle') {
          const required=['kai','dev','ada','mentor'];
          const allAssembled = required.every(r=>ties.has(r));
          const showExcl = !allAssembled || (allAssembled && !flags.has('qargi_circle_talked'));
          if (showExcl) {
            const bounce = Math.sin(Date.now()/150)*3;
            ctx.fillStyle='#ff0018'; ctx.fillRect(drawX+6,drawY-14+bounce,4,10); ctx.fillRect(drawX+6,drawY-2+bounce,4,4);
            ctx.fillStyle='#fff'; ctx.fillRect(drawX+7,drawY-13+bounce,2,8); ctx.fillRect(drawX+7,drawY-1+bounce,2,2);
          }
        }
      });

      if (state === 'AMBUSH' || state === 'QARGI_ENTRANCE') {
          ambushNpcs.forEach(n => {
              drawCharacterSprite(ctx, n.px, n.py, n.id, n.dir, true, (ambushTimer*0.1)%4);
              if (n.showExclamation) {
                 const bounce = Math.sin(Date.now() / 150) * 3;
                 ctx.fillStyle='#ff0018'; ctx.fillRect(n.px+6, n.py-14+bounce, 4, 10); ctx.fillRect(n.px+6, n.py-2+bounce, 4, 4);
              }
          });
      }

      if (state==='REST') ctx.filter='none';
      drawCharacterSprite(ctx, px, py, 'player', pdir, pmoving, pframe);

      if (flags.has('mounted_dragon') && state === 'GAME') {
        ctx.save();
        ctx.globalAlpha = 0.3 + 0.2 * Math.sin(Date.now() / 100);
        ctx.strokeStyle = '#ffd700';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(px + 8, py + 8, 14, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }

      if (state==='REST') {
        const fade=Math.min(1,(600-restTimer)/60); const fadeOut=Math.min(1,restTimer/60);
        for (let i=0;i<5;i++) {
          let angle=(i/5)*Math.PI*2+t*0.5; let sx=px+8+Math.cos(angle)*45, sy=py+8+Math.sin(angle)*45;
          ctx.save(); ctx.translate(sx,sy); ctx.globalAlpha=Math.min(fade,fadeOut)*(0.8+0.2*Math.sin(t*5+i));
          if (i === 0) { ctx.shadowColor = '#0ff'; ctx.shadowBlur = 8;
            ctx.fillStyle = '#aaa'; ctx.fillRect(-8, -5, 16, 10); 
            ctx.fillStyle = '#222'; ctx.fillRect(-6, -1, 4, 1); ctx.fillRect(-4.5, -2.5, 1, 4); 
            ctx.fillStyle = '#d00'; ctx.fillRect(2, -1, 2, 2); ctx.fillRect(5, -3, 2, 2); 
          } else if (i === 1) { ctx.shadowColor = '#fa0'; ctx.shadowBlur = 8;
            ctx.fillStyle = '#f80'; 
            ctx.fillRect(-4, -2, 8, 6); ctx.fillRect(-4, -5, 6, 4); 
            ctx.fillRect(-4, -7, 2, 2); ctx.fillRect(0, -7, 2, 2); 
            ctx.fillRect(3, 1, 4, 2); ctx.fillRect(7, -2, 2, 4); 
            ctx.fillStyle = '#000'; ctx.fillRect(-3, -3, 1, 1); ctx.fillRect(-1, -3, 1, 1); 
          } else if (i === 2) { ctx.shadowColor = '#f0f'; ctx.shadowBlur = 8;
            ctx.fillStyle = '#b88a68'; ctx.fillRect(-3, -7, 6, 6); 
            ctx.fillStyle = PRIDE[5]; ctx.fillRect(-4, -8, 8, 3); 
            ctx.fillStyle = PRIDE[4]; ctx.fillRect(-3, -1, 6, 6); 
            ctx.fillStyle = '#222'; ctx.fillRect(-3, 5, 2, 3); ctx.fillRect(1, 5, 2, 3); 
          } else if (i === 3) { ctx.shadowColor = '#0f0'; ctx.shadowBlur = 8;
            ctx.fillStyle = '#f0d8b8'; ctx.fillRect(-3, -7, 6, 6); 
            ctx.fillStyle = PRIDE[1]; ctx.fillRect(-3, -8, 6, 2); 
            ctx.fillStyle = PRIDE[2]; ctx.fillRect(-3, -1, 6, 6); 
            ctx.fillStyle = '#222'; ctx.fillRect(-3, 5, 2, 3); ctx.fillRect(1, 5, 2, 3); 
          } else { ctx.shadowColor = '#0f0'; ctx.shadowBlur = 8;
            ctx.fillStyle = '#632'; ctx.fillRect(-2, 2, 4, 6); 
            ctx.fillStyle = '#282'; ctx.fillRect(-5, -2, 10, 4); ctx.fillRect(-3, -6, 4, 4); ctx.fillRect(-1, -8, 2, 2); 
          }
          ctx.restore();
        }
      }
      ctx.translate(Math.floor(camera.x), Math.floor(camera.y));
      if (['GAME', 'AMBUSH', 'QARGI_ENTRANCE'].includes(state)) drawQueerGlitch(glitchIntensity, isCampOverride, isGaslighting);

      if (state==='REST') {
        const a=Math.min(1,(600-restTimer)/60,restTimer/60);
        ctx.fillStyle=`rgba(0,0,0,${a*0.75})`; ctx.fillRect(0,0,GBA_W,GBA_H);
        ctx.fillStyle=`rgba(255,255,255,${a})`; ctx.font='bold 12px "VT323", monospace'; ctx.textAlign='center';
        ctx.fillText('You are overwhelmed.', GBA_W/2, GBA_H/2-15);
        ctx.font='10px "VT323", monospace'; ctx.fillStyle=`rgba(150,255,150,${a})`;
        ctx.fillText('Your community forms a', GBA_W/2, GBA_H/2-2);
        ctx.fillText('circle of protection.', GBA_W/2, GBA_H/2+10);
        ctx.fillStyle=`rgba(200,200,200,${a})`; 
        ctx.fillText('Rest and recover...', GBA_W/2, GBA_H/2+24);
      }
      
      if (state === 'VICTORY') {
        const a = Math.min(1, (180 - victoryTimer) / 10);
        ctx.fillStyle = `rgba(0, 0, 0, ${a * 0.85})`; ctx.fillRect(0, 0, GBA_W, GBA_H);
        ctx.fillStyle = '#ff8888'; ctx.font = 'bold 16px "VT323", monospace'; ctx.textAlign = 'center';
        ctx.fillText('ENCOUNTER SURVIVED.', GBA_W/2, GBA_H/2 - 10);
        ctx.fillStyle = '#aaa'; ctx.font = '10px "VT323", monospace';
        ctx.fillText('+0 XP. +0 GOLD.', GBA_W/2, GBA_H/2 + 5);
        ctx.fillStyle = '#88ff88'; ctx.font = 'bold 12px "VT323", monospace';
        ctx.fillText('PEACE PROTECTED.', GBA_W/2, GBA_H/2 + 20);
      }
      
      ctx.filter = 'none';
    }

   if (state==='COMBAT') {
      // NEW: Wrap the entire combat screen in a save state to apply the shake!
      ctx.save(); 
      let shakeDx = shakeFrames > 0 ? (Math.random() - 0.5) * 6 : 0;
      let shakeDy = shakeFrames > 0 ? (Math.random() - 0.5) * 6 : 0;
      ctx.translate(shakeDx, shakeDy);

      const bgGrad=ctx.createRadialGradient(GBA_W/2,GBA_H/2,0,GBA_W/2,GBA_H/2,GBA_W);
      bgGrad.addColorStop(0,'#1a0a14'); bgGrad.addColorStop(1,'#05050a'); ctx.fillStyle=bgGrad; ctx.fillRect(0,0,GBA_W,GBA_H);
      const t=Date.now()/1000;
      for (let i=0;i<PRIDE.length;i++) {
        ctx.strokeStyle=PRIDE[i]+'22'; ctx.lineWidth=2; ctx.beginPath();
        for (let x=0;x<GBA_W;x+=4) { const y=GBA_H/2+Math.sin(x/30+t+i*0.8)*(20+i*6); x===0?ctx.moveTo(x,y):ctx.lineTo(x,y); } ctx.stroke();
      }
      ctx.lineWidth=1;

      const pulse=0.5+0.5*Math.sin(t*4); 
      
      ctx.save();
      if (combat.phase === 'GASLIGHTING_RESULT') { 
          ctx.fillStyle = 'rgba(0, 0, 0, 0.95)'; ctx.fillRect(0, 0, GBA_W, GBA_H);
          ctx.fillStyle = '#ff0018'; ctx.font = 'bold 14px "VT323", monospace'; ctx.textAlign = 'center';
          ctx.fillText('⚠ SYSTEM ERROR ⚠', GBA_W/2, GBA_H/2 - 20);
          ctx.font = 'bold 10px "VT323", monospace'; ctx.fillStyle = '#fff';
          ctx.fillText('WARNING: Player input violates community guidelines', GBA_W/2, GBA_H/2);
          ctx.fillText('Social Justice Penalty Applied', GBA_W/2, GBA_H/2 + 12);
          ctx.fillText('Please review our Terms of Engagement', GBA_W/2, GBA_H/2 + 24);
          ctx.fillStyle = PRIDE[0];
          if (Math.floor(Date.now()/200)%2===0) ctx.fillText('▼', GBA_W/2, GBA_H/2 + 40);
          ctx.restore();
          return;
      }
      
      ctx.fillStyle=`rgba(255,0,24,${0.15+0.1*pulse})`; ctx.beginPath(); ctx.arc(GBA_W-95, 35, 30+pulse*3, 0, Math.PI*2); ctx.fill();
      drawProceduralFace(combat.enemy.id, GBA_W-115, 15);
      
      ctx.font='bold 11px "VT323", monospace'; ctx.textAlign='center'; ctx.fillStyle='#ff8888'; 
      let eName = combat.enemy.name;
      if (displayStress > 70 && Math.random() > 0.8 && zone.uiTricks.includes('glitch')) { eName = scrambleText(eName, 0.5); }
      ctx.fillText(eName, GBA_W-95, 65);
      
      const stateIdx = combat.enemyState; ctx.fillStyle=ENEMY_STATE_COLORS[stateIdx]; const stateName=ENEMY_STATE_NAMES[stateIdx];
      ctx.font='bold 10px "VT323", monospace'; ctx.fillText(`State: ${stateName}`, GBA_W-95, 78);
      ctx.restore();

      ctx.fillStyle=`rgba(0,128,255,${0.15+0.1*pulse})`; ctx.beginPath(); ctx.arc(45, 65, 25+pulse*2, 0, Math.PI*2); ctx.fill();
      drawProceduralFace('player', 25, 45);
      ctx.fillStyle='#ffffff'; ctx.font='bold 12px "VT323", monospace'; ctx.textAlign = 'center';
      ctx.fillText(playerPrefs.name || 'Alex', 45, 95);

      const bh=56, bw=GBA_W-8, bx=4, by=GBA_H-bh-4;
      ctx.fillStyle=PAL.boxBorder; ctx.fillRect(bx,by,bw,bh); ctx.fillStyle=PAL.white; ctx.fillRect(bx+2,by+2,bw-4,bh-4); ctx.strokeStyle=PAL.boxBorder; ctx.lineWidth=2; ctx.strokeRect(bx+4,by+4,bw-8,bh-8); ctx.lineWidth=1;

      if (combat.phase==='SELECT') {
        ctx.font='bold 10px "VT323", monospace'; ctx.textAlign='left'; ctx.fillStyle='#333'; ctx.fillText('What will you do?', bx+8, by+14);
        combat.actions.forEach((a,i) => {
          const col=i%2, row=Math.floor(i/2); const ax=bx+14+(col*104), ay=by+26+(row*14);
          const isExposureUsed = a.id === 'exposure' && flags.has('exposure_used');
          const blocked = (a.id==='community' && (ties.size===0 || combat.communityUsed)) || isExposureUsed;
          if (combat.actionSel===i) {
            ctx.fillStyle=blocked?'#555':PRIDE[0]; ctx.fillRect(ax-10,ay-10,98,13);
            ctx.fillStyle=blocked?'#aaa':'#fff'; ctx.fillText('▶ '+a.name+(isExposureUsed?' (used)':''), ax-6, ay);
          } else { ctx.fillStyle=blocked?'#bbb':'#666'; ctx.fillText('  '+a.name+(isExposureUsed?' (used)':''), ax-6, ay); }
        });
      } else if (combat.phase==='RESULT'||combat.phase==='RESULT_FINAL') {
        ctx.font='bold 10px "VT323", monospace'; ctx.textAlign='left';
        const currentLines=combat.resultPages[combat.resultPageI];
        let drawn=0, ly=by+14;
        for (let line of currentLines) {
          const rem=combat.resultCharI-drawn; if (rem<=0) break;
          let dLine = line.substring(0,Math.min(line.length,rem));
          if (glitchIntensity > 0.6 && zone.uiTricks.includes('glitch')) dLine = scrambleText(dLine, glitchIntensity * 0.1);
          ctx.fillStyle='#000'; ctx.fillText(dLine, bx+8, ly); drawn+=line.length; ly+=12;
        }
        const totalChars=currentLines.join(' ').length;
        if (combat.resultCharI>=totalChars && Math.floor(Date.now()/300)%2===0) {
          ctx.fillStyle=PRIDE[0]; const hasMore=combat.resultPageI<combat.resultPages.length-1; ctx.fillText(hasMore?'▼':'■', bx+bw-14, by+bh-10);
        }
      }
     // CHANGE: Render Queer Glitch system override text
      if (combat && combat.queerGlitchActive && combat.glitchText) {
        ctx.save();
        ctx.globalAlpha = 0.95;
        ctx.fillStyle = '#000';
        
        // Made the box slightly taller (50px instead of 40px)
        ctx.fillRect(0, GBA_H/2 - 25, GBA_W, 50); 
        ctx.strokeStyle = PRIDE[combat.enemyState % PRIDE.length];
        ctx.lineWidth = 2;
        ctx.strokeRect(5, GBA_H/2 - 23, GBA_W - 10, 46);
        
        ctx.fillStyle = '#00ffcc';
        ctx.font = 'bold 9px "VT323", monospace';
        ctx.textAlign = 'center';
        
        // Split into THREE lines to ensure it fits perfectly inside the GBA width
        ctx.fillText("OVERRIDE FAILED:", GBA_W/2, GBA_H/2 - 10);
        ctx.fillText("Community is not data.", GBA_W/2, GBA_H/2 + 2);
        ctx.fillText("Relations cannot be deleted.", GBA_W/2, GBA_H/2 + 14);
        
        ctx.restore();
       
      }
      
      ctx.restore(); // NEW: This closes out the overall screen shake we just added!
    }

    if (['GAME','COMBAT','VICTORY'].includes(state)) {
      
    }

    if (['GAME','COMBAT','VICTORY'].includes(state)) {
      ctx.fillStyle='#202020dd'; ctx.fillRect(4,4,80,14); ctx.fillStyle='#fff'; ctx.font='bold 8px "VT323", monospace'; ctx.textAlign='left'; ctx.fillText('STRESS', 8, 14); ctx.fillStyle='#444'; ctx.fillRect(42,6,38,10);
      let pct=displayStress/maxStress; if(isNaN(pct)) pct=0; ctx.fillStyle=pct>0.7?'#ff0018':pct>0.4?'#ffa52c':'#008018'; 
      ctx.fillRect(42,6,38*Math.min(1, pct),10);
      let lostPct = (100 - maxStress) / 100;
      if (lostPct > 0) { ctx.fillStyle = '#222'; ctx.fillRect(42 + 38 * (1 - lostPct), 6, 38 * lostPct, 10); }
      let showTies = ties.size > 0 && !(state === 'COMBAT' && combat && combat.ambushState === 1);
      if (showTies) {
        ctx.font='bold 8px "VT323", monospace'; const tieText=`Ties: ${ties.size}`; const tw=ctx.measureText(tieText).width;
        ctx.fillStyle='#202020dd'; ctx.fillRect(GBA_W-8-tw-4,4,tw+8,14); ctx.fillStyle='#8aff8a'; ctx.textAlign='right'; ctx.fillText(tieText, GBA_W-8, 14);
      }
    }

    if ((state==='DIALOGUE'||state==='CUTSCENE') && dlg) {
      if (state==='CUTSCENE') { ctx.fillStyle='#000'; ctx.fillRect(0,0,GBA_W,GBA_H); }

      const bh=52, bw=GBA_W-8, bx=4, by=GBA_H-bh-4; const hasFace=dlg.face&&dlg.face!=='none';

      if (dlg.node.speaker && state !== 'CUTSCENE' && dlg.node.speaker !== 'System') {
        const spk = dlg.node.speaker;
        ctx.font='bold 9px "VT323", monospace'; 
        const spkW = ctx.measureText(spk).width+12; 
        ctx.fillStyle=PAL.boxBorder; ctx.fillRect(bx,by-14,spkW,14); ctx.fillStyle=PAL.white; ctx.fillRect(bx+2,by-12,spkW-4,11); ctx.fillStyle='#000'; ctx.textAlign='left'; ctx.fillText(spk, bx+6, by-3);
      }

      ctx.fillStyle=PAL.boxBorder; ctx.fillRect(bx,by,bw,bh); ctx.fillStyle=PAL.white; ctx.fillRect(bx+2,by+2,bw-4,bh-4); ctx.strokeStyle=PAL.boxBorder; ctx.lineWidth=2; ctx.strokeRect(bx+4,by+4,bw-8,bh-8); ctx.strokeStyle=PRIDE[0]; ctx.lineWidth=1; ctx.strokeRect(bx+5,by+5,bw-10,bh-10); ctx.lineWidth=1;

      if (hasFace) {
        if (state==='CUTSCENE') drawProceduralFace(dlg.face, GBA_W/2-20, 30);
        else { ctx.fillStyle='#202030'; ctx.fillRect(bx+5,by+3,42,46); ctx.fillStyle='#303050'; ctx.fillRect(bx+6,by+4,40,44); drawProceduralFace(dlg.face, bx+7, by+5); }
      }

      const textX=(hasFace&&state!=='CUTSCENE')?bx+52:bx+10;
      const currentLines=dlg.pages[dlg.pageI]; let drawn=0, ly=by+16;
      ctx.fillStyle=dlg.node.stressEffect ? '#b00' : '#000'; 
      ctx.font='bold 10px "VT323", monospace'; ctx.textAlign='left';
      for (let line of currentLines) {
        const rem=dlg.charI-drawn; if (rem<=0) break;
        let dLine = line.substring(0,Math.min(line.length,rem));
        if (glitchIntensity > 0.6 && zone.uiTricks.includes('glitch')) dLine = scrambleText(dLine, glitchIntensity * 0.1);
        ctx.fillText(dLine, textX, ly); drawn+=line.length; ly+=13;
      }

      const totalChars=currentLines.join(' ').length; const isLastPage=dlg.pageI>=dlg.pages.length-1;
      if (isLastPage && dlg.charI>=totalChars && dlg.node.choices) {
        ctx.font='bold 10px "VT323", monospace';
        let maxTextW = 0; dlg.node.choices.forEach(ch => { maxTextW = Math.max(maxTextW, ctx.measureText(ch).width); });
        const chW = maxTextW + 30; const chH = 10 + (dlg.node.choices.length * 14); const chX = GBA_W - chW - 8, chY = by - chH - 4;
        ctx.fillStyle = PAL.boxBorder; ctx.fillRect(chX, chY, chW, chH); ctx.fillStyle = PAL.white; ctx.fillRect(chX+2, chY+2, chW-4, chH-4);
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
  
  return { 
    destroy() { 
      running = false; 
      window.removeEventListener('keydown', onKey); window.removeEventListener('keyup', onKey); 
      [sfxLevelComplete, sfxInsight, sfxHarasser, sfxStressed, sfxRestart, sfxTalk, sfxSystemError, bgMusic, bgFinish].forEach(a => a.pause());
    } 
  };
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
    <div style={{display:'flex', alignItems:'center', justifyContent:'center', minHeight:'100vh', background:'#0a0a14', padding: 20}}>
      <canvas ref={canvasRef} style={{ width: '100%', maxWidth: '800px', imageRendering: 'pixelated', display: 'block', margin: '0 auto', border: '4px solid #202020', borderRadius: '8px', boxShadow: '0 10px 30px rgba(0,0,0,0.5)', outline: 'none' }} tabIndex={0} />
    </div>
  );
}