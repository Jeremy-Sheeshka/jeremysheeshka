# ETEC 531 Rhythm Prototype - Project Handoff Document

**Last updated:** July 21, 2026
**Owner:** Jeremy Sheeshka
**Repo:** github.com:Jeremy-Sheeshka/jeremysheeshka.git
**Local path:** /home/sheeshka/Desktop/jeremysheeshka/
**Production URL:** https://jeremysheeshka.ca/games/praxis-qtest/

---

## 1. What This Project Is

A rhythm sight-reading practice tool for an ETEC 531 (curriculum design) course. It wraps a Danish rhythm drill app (NL_rytmer / Musikipedia) inside an iframe and adds a custom UI layer with two practice modes:

- **Free Play** - solo practice. Generates random rhythms, plays them back, student taps along. Includes metronome, counting aids, line cursor, Listen button.
- **Co-Op (Trade Fours)** - two students share one screen. Rhythm split between Student A and Student B (trade 2s or 4s). Each taps their bars via keyboard (A and L keys). Includes A/B overlay tinting, turn indicators, beat dots.

Also: **Dashboard** page (index.html) with Cultural Datasets card, Ensemble Mode pulse preview, links to both modes. **Gallery** screen with literature references and a doing prompt.

---

## 2. Architecture

    PARENT PAGE (free-play.html or co-op.html)
      Navbar: Play, Listen, Bars, Tempo, BPM, Draw, Aid, Mute, Gear
      |
      +-- <iframe id=drill-frame>
      |     DRILL PAGE (exercise 720)
      |     + embed-bridge.js (injected)
      |     + embed-overrides.css (injected)
      |
      postMessage <--> postMessage

### Bridge injection - LOCAL
- Node.js proxy at localhost:4735 fetches drill from production URL, strips frame-bust, inlines embed-bridge.js + embed-overrides.css.
- Parent sets iframe.src to proxy URL. Co-op appends ?praxis=coop.
- **Proxy reads bridge/CSS at STARTUP. Restart proxy after editing those files.**

### Bridge injection - PRODUCTION
- Parent inline script fetches drill HTML + bridge + CSS via fetch(), strips frame-bust, injects into HTML string, sets iframe.srcdoc.
- Co-op prepends window.__PRAXIS_COOP=true before bridge script.
- No proxy restart needed. Must git push to deploy.

### Bridge branches
- **Co-op branch:** activates when __PRAXIS_COOP===true or URL has ?praxis=coop. Ends with return; to skip free-play.
- **Free-play branch:** fallback after co-op return.

---

## 3. File Inventory

### In public/games/praxis-qtest/

| File | Purpose |
|------|---------|
| embed-bridge.js | Injected into iframe. Patches MusicRhythmPlayer. Both branches. ~26KB. MOST FRAGILE FILE. |
| embed-overrides.css | Hides drill own UI chrome inside iframe. |
| embed-nav.css | Navbar layout styles for free-play. |
| free-play.html | Free Play page. ~984 lines. THREE script systems (see section 7). |
| co-op.html | Co-Op page. ~332 lines. |
| index.html | Dashboard. ~453 lines. |
| metro-sender.js | Free-play controls. Capture-phase stopImmediatePropagation. |

### Proxy (outside repo)
- /home/sheeshka/praxis-test-proxy/proxy.mjs - Node.js proxy on port 4735.

### Drill app (production server, NOT in repo)
- rhythm-min.js, rhythm_image-min.js, rhythm_player-min.js, rhythm_sounds-min.js, opgave-min.js, NL_rytmer-min.js
- Globals use Musikipedia* names. Bridge creates Music* aliases.

---

## 4. Message Protocol

### Parent to Bridge
- praxis-metro {playing, tempo} - start/stop, set tempo
- praxis-bars {bars} - change bar count
- praxis-tap {} - register tap
- praxis-aid {mode} - counting aids (none/syllables/numbers)
- praxis-listen {} - listen mode
- praxis-mute {muted} - mute Howler
- praxis-settings {settings} - update bridge settings
- praxis-split {split} - co-op split (2s/4s)

### Bridge to Parent
- drill-ready {tempo} - bridge initialized
- drill-state {playing, exercise?, mode?} - state changed
- drill-tap {} - tap registered
- coop-split {seq, numBars, splitMode, owner[], bars[]} - split info
- coop-beat {bar, eighthInBar, owner} - beat tick
- metro-beat {beat, accent} - quarter-note pulse
- praxis-new-exercise {} - new exercise (clear drawings)

---

## 5. Bridge Settings

### Co-op
    var settings = {loop:false, ab:true, cue:true, metroSound:true, master:false, marks:true, cursor:true};

### Free-play
    var fsettings = {metroSound:true, master:false, marks:true, cursor:true};

**Naming collision:** Parent sends lineCursor. Bridge maps it to cursor.

---

## 6. Features (Current State)

### Working (when bridge is alive)
- Drill loads in iframe (both modes, local + production)
- Random rhythm generation, Play/Stop, Tempo, Bars selector
- Co-op split, A/B overlay, turn banner, beat dots, keyboard tapping (A/L/Space)
- Counting aids (Ta/ti or 1+/numbers)
- Draw canvas, Settings gear, Mute, Listen, Line cursor, Visual Pulse
- Dashboard, Gallery, dark mode

### Broken / Needs Verification
- **Bridge syntax error** - expected expression, got keyword else at srcdoc:180. Caused by accumulated patches. Complete rewrite was provided but may not have been applied. CHECK: node -c embed-bridge.js
- **Free-play Listen** - competing handlers (capture vs bubble). Needs verification.
- **Line cursor visibility** - 5px red rect may be hard to see.
- **Default bars** - Co-op=8, Free-play=4. Verify.

---

## 7. Known Bugs and Next Steps

### Critical: Bridge Integrity
Patched ~15+ times with string replacements. At least one corrupted an if/else chain.
**ALWAYS verify with node -c before deploying. If corrupted, do COMPLETE rewrite, NOT more patches.**

### Outstanding User Requests
1. Draw visibility tied to Show Draw setting
2. Line cursor forced on when marks off
3. Co-op Play + click-to-start sync
4. Double metronome in co-op (parent Web Audio + engine Howler)
5. Bars visual layout (4 per row) - controlled by drill renderer, hard to change

### Architecture Concerns
- Three script systems in free-play.html: inline metronome IIFE, metro-sender.js, EXTRAS block.
- metro-sender.js uses capture-phase stopImmediatePropagation - can silently kill other handlers.
- Settings naming is ad-hoc (lineCursor/dots/cursor/marks).

---

## 8. Deployment Workflow

    # 1. Edit files
    # 2. Restart proxy if bridge/CSS changed:
    pkill -f praxis-test-proxy/proxy.mjs
    nohup node /home/sheeshka/praxis-test-proxy/proxy.mjs > /tmp/praxis-proxy.log 2>&1 &
    # 3. Test locally: http://localhost:4321/games/praxis-qtest/free-play.html
    # 4. Deploy:
    cd /home/sheeshka/Desktop/jeremysheeshka && git add -A && git commit -m msg && git push
    # 5. Test production: https://jeremysheeshka.ca/games/praxis-qtest/free-play.html
    # 6. Hard reload: Ctrl+Shift+R

---

## 9. Technical Details

### Engine State Machine
MusicRhythmPlayer: stop -> countin -> play -> tap -> countout -> stop
Bridge sets: includeCountIn=true, includePlaying=true, includeTapping=true, includeCountOut=false
Callbacks: changeStatusCallback(s), finishedTappingCallback, afterStoppingCallback

### Rhythm Data
    { metricalStructure: 4/4, bars: [
      { components: [
        { length: 144, rest: false },  // quarter
        { length: 72, rest: false },   // eighth
        { length: 288, rest: false },  // half
        { length: 576, rest: false }   // whole
      ]}
    ]}
Units: quarter=144, eighth=72, half=288, whole=576.

### SVG
Drill renders into #spoergsmaal. Components get .x/.y from setRhythm().

### Howler
Howler.mute(bool), Howler.stop(), p.removeMetronome() (one-way).

### Frame-bust
Both proxy and parent strip if(top==self), top.location=... via regex.

---

## 10. User Preferences

- Prefers heredoc/Python scripts pasted into terminal
- Wants concise responses, copy-paste commands
- Gets frustrated by round-trips - prefers one comprehensive fix
- Tests on both local and production
- Console noise expected (Cloudflare, CSP, autoplay, AudioContext, source maps) - ignore
- NOT a programmer - explain practically
- Always: node -c bridge, restart proxy, git push, hard-reload

---

## 11. If You Are Picking This Up

1. **Check bridge:** node -c embed-bridge.js. If fails, rewrite whole file.
2. **Check proxy:** cat /tmp/praxis-proxy.log. Restart if needed.
3. **Test locally:** open both pages, check console.
4. **Test production:** hard-reload, check console.
5. **Do NOT patch bridge with string replacements.** Rewrite whole file + node -c.
6. **Drill engine is opaque.** Interact only via bridge patches to initialisation/setRhythm.
7. **Free-play has three overlapping script systems.** Beware event handler conflicts.