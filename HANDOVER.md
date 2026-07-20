# ETEC 531 · Curriculum Otherwise — Rhythm Prototype (HANDOVER)
Test area only: public/games/praxis-qtest/. Real drill + live site untouched. Revert: latest tar in ~/.praxis-checkpoints + ~/Downloads/Q*.html.

## Architecture (local test)
- index.html / free-play.html / co-op.html = outer Praxis shell (ETEC 531 branding), slim top nav (embed-nav.css). free-play + co-op embed the drill in <iframe id="drill-frame"> via the PROXY (http://localhost:4735/...), and include metro-sender.js which postMessages {type:'praxis-metro',playing,tempo,beats} to the iframe on play/tempo/beats change.
- Proxy /home/sheeshka/praxis-test-proxy/proxy.mjs (port 4735) fetches the LIVE drill and for HTML: strips X-Frame-Options/CSP/COOP/COEP/CORP; removes html{display:none}; neutralizes frame-bust; rewrites absolute live URLs; INLINES embed-overrides.css (as <style id=praxis-overrides>) + embed-bridge.js (as <script id=praxis-bridge>). Reads those two files at STARTUP -> restart proxy after editing them.
- embed-overrides.css (inlined) hides X, ?, progress, grading, footer, AND the in-app play button #afspil-lyd-felt (the ▶). The tap surface ("Click here to begin") is intentionally kept.
- embed-bridge.js (inlined) on praxis-metro playing=true: mutes Howler (window.Howler.mute(true)) -> this silences the drill's built-in metronome for certain (its metronome sounds are Howler sounds), then clicks the hidden #afspil-lyd to start the drill once. On playing=false: no click (drill left to finish). Logs [praxis-bridge].
- ONE metronome = the outer Praxis click (Web Audio in the parent page). The drill's click is muted. Responsive: >=1024px metronome in top bar, <1024px bottom dock.

## Confirmed / open
- Confirmed: shell + slim nav render; drill renders in iframe via proxy; X/?/progress/grading/in-app ▶ hidden; Howler mute removes the 2nd metronome; outer Play starts the drill; rename to ETEC 531 applied.
- OPEN (blocked on the API dump in /tmp/praxis-api.txt): (1) TEMPO visual sync — console proved window.MusicRhythmPlayer is undefined and all 6 guessed setters return 'none'; the drill does not expose its player/tempo on window under a reachable name. Need the real global + setter (dump sections A-D) or the inline dataFromDatabase.tempo path (section E) to mutate before start. (2) The top toolbar (≡ Play … 124 TEMPO ⚙), injected by templates/rhythm-app/js/app.min.js, is still visible = the 'second nav bar'; need its container selector (dump section G, or DevTools Inspect) to add one CSS line. (3) Whether the kept 'Click here to begin' box is the tap surface or a 2nd start button (dump section F) — decides if it should be hidden too and how outer Play arms tap-recording.
- 2/4/8-bar phrase lengths not wired (needs NL_rytmer/side_opsaetning config). Dead links remaining: co-op 'We Are Ready', trailing-slash dir URL, 'open original' target.
- Production (jeremysheeshka.ca): same-origin iframe allowed by X-Frame-Options SAMEORIGIN + CSP frame-src 'self'; only blocker was frame-bust (proxy/edge rewrite or an ?embed=1 mode solves it). Howler-mute + bridge approach is portable to production as-is.

## Run locally
1) Proxy (restart after editing embed-*.css/js): pkill -f praxis-test-proxy/proxy.mjs; nohup node /home/sheeshka/praxis-test-proxy/proxy.mjs > /tmp/praxis-proxy.log 2>&1 &
2) Astro: cd /home/sheeshka/Desktop/jeremysheeshka && npm run dev (use printed port).
3) Open /games/praxis-qtest/free-play.html ; press the TOP Play -> drill starts, you hear ONE click; drag slider = the one metronome's tempo (drill visual tempo sync pending the dump).
