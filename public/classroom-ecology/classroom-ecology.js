(function(){"use strict";
var __m={},__c={};
function __req(id){if(__c[id])return __c[id];var e={};__c[id]=e;__m[id](e,__req);return e;}
__m["/home/sheeshka/Desktop/ubc/etec-534/media-ecology-spa/src/element.ts"]=function(e,__req){
/**
 * element.ts — <classroom-ecology>
 *
 * One photograph, sixteen surfaces, and ten recordings made in the room itself.
 * There is no slider, no layer toggle and no score.  The only things the visitor
 * can do are the two things the room already does to them: pass over something,
 * and stop to look at it.
 *
 * Interaction
 *   pointer over a surface  → the contour draws itself in, and the claims that
 *                             join it to the rest of the room are named
 *   pointer out             → both retract
 *   click / Enter           → that surface's own recording plays, once, and one
 *                             card opens: one line of ours, and the question
 *                             the medium makes askable
 *   touch                   → the first tap outlines the surface and the second
 *                             opens the card, because there is no hover on
 *                             glass
 *
 * The piece runs in two states.  The first is analytic: one medium at a time.
 * Once four surfaces have been met it resolves into the second — the relations
 * between the surfaces are drawn, and the room comes up as one texture.  The
 * move between the two states is the argument: an
 * environment is not the sum of its media, and Postman's unanswered question
 * about what kind of subject this is, is where it ends.
 */
const { ZONES, SUBTITLE, CLOSING_QUOTE, CLOSING_CITE, FIELD_HINT, HINT } = __req("/home/sheeshka/Desktop/ubc/etec-534/media-ecology-spa/src/zones.ts");
const { RoomSound } = __req("/home/sheeshka/Desktop/ubc/etec-534/media-ecology-spa/src/audio.ts");
const { CSS, CLOSE_GLYPH } = __req("/home/sheeshka/Desktop/ubc/etec-534/media-ecology-spa/src/styles.ts");
const { readSources, buildPicture, buildOverlay, buildRelationLabels, cardMarkup, rankHits } = __req("/home/sheeshka/Desktop/ubc/etec-534/media-ecology-spa/src/stage.ts");
/**
 * How many surfaces have to be met before the room resolves into a field.
 * Low on purpose: the point is made the moment a visitor realises the parts
 * belong to one another, and making them walk all sixteen first turns an
 * argument into a chore.
 */
const FIELD_AFTER = 4;
const TOUR_STAGGER = 55;
const TOUR_HOLD = 2600;

// Glass needs the instruction, because there is no hover to discover the piece
// with.  It still carries the two states, in a shorter form: the same sentence
// would run to three lines at this width.
const HINT_TOUCH = 'Tap a surface to look closer. First choose a medium, one at a time. Then, observe how the mediums come together to allign the whole.';

/** The contour and hit maps hold lists, because a surface may have two outlines. */
function add(map, key, value) {
  const list = map.get(key);
  if (list) list.push(value);
  else map.set(key, [value]);
}

function flatten(map) {
  const out = [];
  for (const list of map.values()) for (const item of list) out.push(item);
  return out;
}

const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
/** A device that can hover a cursor is a device that can be told to move one. */
const canHover = () => !(window.matchMedia('(any-pointer: coarse)').matches
  && !window.matchMedia('(any-pointer: fine)').matches);

class ClassroomEcology extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._live = null;
    this._held = null;
    this._visited = new Set();
    this._complete = false;
    this._tour = 0;
    this._tourStep = 0;
    this._tourActive = false;
    this._keyboard = false;
    this._px = 0;
    this._py = 0;
    this._mouseInStage = false;
    this._contours = new Map();
    this._hits = new Map();
    this._relations = new Map();
    this._field = false;
    this._tourTimers = [];
    this._onKey = this._onKey.bind(this);
  }

  connectedCallback() {
    if (this._built) return;
    this._built = true;
    this._paint();
    this._sound = new RoomSound(this.getAttribute('audio-base') || 'dist/audio');
    this._sound.prime(ZONES);
    this._listen();
    const start = () => this._beginTour();
    if (requestAnimationFrame) requestAnimationFrame(() => setTimeout(start, 620));
    else setTimeout(start, 620);
  }

  disconnectedCallback() {
    this._cancelTour();
  }

  /* ------------------------------------------------------------------ build */

  _paint() {
    // A shadow host is a black box to assistive tech unless it says what it is.
    if (!this.hasAttribute('role')) this.setAttribute('role', 'region');
    if (!this.getAttribute('aria-label')) {
      this.setAttribute('aria-label', 'A classroom, and sixteen of its invisible environments');
    }
    const root = this.shadowRoot;
    const style = document.createElement('style');
    style.textContent = CSS;

    const piece = document.createElement('div');
    piece.className = 'piece';

    const masthead = document.createElement('div');
    masthead.className = 'masthead';
    const mark = document.createElement('span');
    mark.className = 'wordmark';
    mark.textContent = 'Media ecology';
    this._sub = document.createElement('span');
    this._sub.className = 'subtitle';
    this._sub.textContent = SUBTITLE;
    masthead.append(mark, this._sub);

    const stage = document.createElement('div');
    stage.className = 'stage';

    const plate = document.createElement('div');
    plate.className = 'plate';
    const srcs = readSources(this);
    const alt = this.getAttribute('alt')
      || 'An elementary classroom: windows on the left, a wall loudspeaker, a hanging guitar and pinned papers on the back wall, a green crescent table and a row of student tables on the floor, an alphabet carpet, orange storage tubs on a shelf, and a unit ventilator along the wall.';
    const wash = document.createElement('div');
    wash.className = 'wash';
    const lqip = this.getAttribute('lqip');
    if (lqip) wash.style.backgroundImage = 'url("' + lqip + '")';
    plate.append(wash, buildPicture(srcs, alt));

    const overlay = buildOverlay();
    for (const c of overlay.querySelectorAll('.contour')) add(this._contours, c.dataset.zone, c);
    for (const h of overlay.querySelectorAll('.hit')) add(this._hits, h.dataset.zone, h);

    // Index each relation under both of the surfaces it joins, so holding
    // either one lights it and names it.
    const relPaths = new Map();
    for (const p of overlay.querySelectorAll('.relation')) relPaths.set(p.dataset.rel, p);
    const relLayer = buildRelationLabels();
    for (const node of relLayer.children) {
      const path = relPaths.get(node.dataset.rel);
      for (const id of node.dataset.rel.split('|')) {
        if (!this._relations.has(id)) this._relations.set(id, []);
        this._relations.get(id).push({ path: path, label: node });
      }
    }

    const scrim = document.createElement('div');
    scrim.className = 'scrim';

    const layer = document.createElement('div');
    layer.className = 'card-layer';
    const card = document.createElement('div');
    card.className = 'card';
    card.setAttribute('role', 'dialog');
    card.setAttribute('aria-modal', 'true');
    card.setAttribute('aria-label', 'Media ecology reading');
    this._closeBtn = document.createElement('button');
    this._closeBtn.type = 'button';
    this._closeBtn.className = 'card-close';
    this._closeBtn.setAttribute('aria-label', 'Close');
    this._closeBtn.innerHTML = CLOSE_GLYPH;
    this._body = document.createElement('div');
    this._body.className = 'card-body';
    card.append(this._closeBtn, this._body);
    layer.append(card);

    stage.append(plate, overlay, relLayer, scrim, layer);

    const status = document.createElement('div');
    status.className = 'statusline';
    this._hint = document.createElement('span');
    this._hint.className = 'hint';
    this._setHint();
    // Hybrids and emulators can change their mind after the page is up.
    const query = window.matchMedia('(any-pointer: coarse)');
    if (query.addEventListener) query.addEventListener('change', () => this._setHint());
    this._zoneLabel = document.createElement('span');
    this._zoneLabel.className = 'zone-label';
    status.append(this._hint, this._zoneLabel);

    const live = document.createElement('p');
    live.className = 'sr';
    live.setAttribute('aria-live', 'polite');
    this._liveRegion = live;

    piece.append(masthead, stage, status, live);
    root.append(style, piece);

    // Overlapping targets are ranked once the overlay can be measured, so the
    // specific object always wins the click over the broad one it sits inside.
    rankHits(overlay);

    this._stage = stage;
    this._scrim = scrim;
    this._plate = plate;

    const img = plate.querySelector('img');
    if (img && !img.complete) {
      img.addEventListener('load', () => stage.classList.add('is-ready'), { once: true });
      img.addEventListener('error', () => stage.classList.add('is-ready'), { once: true });
    } else {
      stage.classList.add('is-ready');
    }
    if (img) {
    }
    this._setDash();
  }

  /**
   * Measure each outline once and hand the length to CSS.  The length lives in
   * a custom property rather than in stroke-dashoffset itself, so a class
   * (.is-live, .is-held) can still pull the offset to zero — an inline
   * stroke-dashoffset would outrank every one of them.
   */
  _setHint() {
    if (!this._hint) return;
    // The two states, named before the reader has seen either of them.  The
    // definition that lands here later is then something they have done.
    this._hint.textContent = canHover() ? HINT : HINT_TOUCH;
  }

  _setDash() {
    const still = reducedMotion();
    for (const c of flatten(this._contours)) {
      if (still) c.classList.add('is-static');
      try {
        const len = c.getTotalLength();
        c.dataset.len = String(len);
        if (!still) c.style.setProperty('--me-len', len + 'px');
      } catch (e) {
        c.classList.add('is-static');
      }
    }
  }

  /* ----------------------------------------------------------------- events */

  _listen() {
    const root = this.shadowRoot;
    const wake = () => { if (this._sound) this._sound.resume(); };
    root.addEventListener('pointerdown', wake, { passive: true });
    root.addEventListener('keydown', (e) => { this._keyboard = true; wake(); });

    this._scrim.addEventListener('click', () => this._close());
    this._closeBtn.addEventListener('click', () => this._close());

    const interrupt = (e) => {
      this._cancelTour();
      // A touch is the surest signal that this is not a cursor.
      if (e && e.pointerType === 'touch' && this._hint) this._hint.textContent = HINT_TOUCH;
      if (e && e.pointerType && e.pointerType !== 'touch') {
        this._px = e.clientX;
        this._py = e.clientY;
        this._mouseInStage = true;
      }
    };
    root.addEventListener('pointermove', interrupt, { passive: true });
    root.addEventListener('touchstart', interrupt, { passive: true });
    // Leaving the room closes whatever was opened in it, the way walking away
    // from a conversation ends it.  Waiting to be clicked at always read as the
    // card being stuck.
    this._stage.addEventListener('pointerleave', () => {
      this._mouseInStage = false;
      if (this._held) this._close();
    }, { passive: true });

    root.addEventListener('keydown', this._onKey);

    root.addEventListener('click', (e) => {
      const t = e.target;
      if (t && t.classList && t.classList.contains('hit')) return;
      if (this._held) return;
      this._clear();
    });

    for (const hit of flatten(this._hits)) {
      const zone = ZONES.find((z) => z.id === hit.dataset.zone);
      hit.addEventListener('pointerenter', (e) => {
        if (e.pointerType === 'touch') return;
        this._cancelTour();
        this._enter(zone);
      });
      hit.addEventListener('pointerleave', (e) => {
        if (e.pointerType === 'touch') return;
        this._leave(zone);
      });
      hit.addEventListener('click', (e) => { e.preventDefault(); this._activate(zone); });
      hit.addEventListener('focus', () => {
        this._cancelTour();
        this._enter(zone);
      });
      hit.addEventListener('blur', () => this._leave(zone));
      hit.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ' || e.key === 'Spacebar') {
          e.preventDefault();
          this._keyboard = true;
          this._activate(zone);
        }
      });
    }
  }

  _onKey(e) {
    if (e.key === 'Escape' && this._held) {
      e.preventDefault();
      this._close();
    }
  }

  /* ------------------------------------------------------------- sound state */

  _enter(zone) {
    if (this._held && this._held.id !== zone.id) return;
    if (this._live && this._live.id === zone.id) return;
    if (this._live) {
      this._mark(this._live, false);
      this._lightRelations(this._live, false);
    }
    this._live = zone;
    this._mark(zone, true);
    this._lightRelations(zone, true);
    this._zoneLabel.textContent = zone.name;
    this._zoneLabel.classList.add('is-on');
  }

  _leave(zone) {
    if (this._held && this._held.id === zone.id) return;
    if (!this._live || this._live.id !== zone.id) return;
    this._mark(zone, false);
    this._lightRelations(zone, false);
    this._live = null;
    this._zoneLabel.classList.remove('is-on');
  }

  /** Draw and name the claims that join this surface to the rest of the room. */
  _lightRelations(zone, on) {
    // Relations are the second state: before the visitor has met enough
    // surfaces, each one stays on its own and nothing is joined to anything.
    // That means the arcs too, not only their names — a link drawn without a
    // word for it would still give the second state away.
    if (!this._field) on = false;
    const list = this._relations.get(zone.id);
    if (!list) return;
    // Two relations can carry the same claim, so one surface can share a label
    // with two others.  Drawing both is honest; printing the same sentence
    // twice is not, so each distinct label is shown once per surface.
    const named = new Set();
    for (const rel of list) {
      if (!rel.path) continue;
      // The arc is always drawn: the surface really is joined to that one, and
      // hiding the link would misreport the room.
      rel.path.classList.toggle('is-live', on);
      // The name is not.  Two different links can carry the same words — the
      // desk and the door both end the room at the same window — and saying it
      // twice on one hover only reads as a stutter.
      const text = rel.label.textContent;
      if (named.has(text)) {
        rel.label.classList.remove('is-on');
        continue;
      }
      named.add(text);
      rel.label.classList.toggle('is-on', on);
    }
  }

  _clear() {
    if (this._live) {
      this._mark(this._live, false);
      this._lightRelations(this._live, false);
      this._live = null;
    }
    this._zoneLabel.classList.remove('is-on');
  }

  _mark(zone, on) {
    const list = this._contours.get(zone.id);
    if (!list) return;
    for (const contour of list) this._markOne(contour, on);
  }

  _markOne(contour, on) {
    if (on) {
      if (reducedMotion()) {
        contour.classList.add('is-live');
        return;
      }
      // Restart the draw-in from the beginning of the path.
      contour.classList.remove('is-live');
      contour.style.setProperty('--me-len', (contour.dataset.len || 0) + 'px');
      void contour.getBoundingClientRect();
      contour.classList.add('is-live');
    } else {
      contour.classList.remove('is-live');
    }
  }

  /* -------------------------------------------------------------------- card */

  /**
   * One rule for every input. If the surface is not already summoning its
   * sound, this is a first contact and it answers with sound; if it is already
   * summoning, the visitor has met it once and is asking to look closer.
   *
   * On a desktop that reads as hover-then-click. On glass, where there is no
   * hover, it reads as tap-then-tap.
   */
  _activate(zone) {
    if (this._held) return;
    this._cancelTour();
    // The recordings are the room's own voice: one click, one playing.
    this._sound.play(zone);
    if (!this._live || this._live.id !== zone.id) {
      this._enter(zone);
      return;
    }
    this._open(zone);
  }

  _open(zone) {
    this._held = zone;
    if (!this._live || this._live.id !== zone.id) this._enter(zone);
    this._body.innerHTML = cardMarkup(zone);
    this._stage.classList.add('is-open');
    // Mirrors the card exactly: the label and the description, nothing else.
    this._liveRegion.textContent = zone.label + '. ' + zone.gloss;
    this._mark(zone, true);
    this._visit(zone);
    requestAnimationFrame(() => { try { this._closeBtn.focus({ preventScroll: true }); } catch (e) { /* ok */ } });
  }

  _close() {
    const zone = this._held;
    if (!zone) return;
    this._held = null;
    this._stage.classList.remove('is-open');
    const active = this.shadowRoot.activeElement;
    const first = this._hits.get(zone.id) && this._hits.get(zone.id)[0];
    if (active === this._closeBtn && first) {
      try { first.focus({ preventScroll: true }); } catch (e) { /* ok */ }
    }
    // Closing should not silence a surface the cursor is still resting on.
    const under = this._mouseInStage ? this._under(this._px, this._py) : null;
    if (under && under.id === zone.id) {
      this._enter(zone);
    } else if (this._live && this._live.id === zone.id) {
      this._mark(zone, false);
      this._lightRelations(zone, false);
      this._live = null;
      this._zoneLabel.classList.remove('is-on');
    }
  }

  /** Which surface, if any, is under a client point once the scrim has lifted. */
  _under(x, y) {
    try {
      const node = this.shadowRoot.elementFromPoint(x, y);
      const hit = node && node.closest ? node.closest('.hit') : node;
      if (!hit || !hit.dataset || !hit.dataset.zone) return null;
      return ZONES.find((z) => z.id === hit.dataset.zone) || null;
    } catch (e) {
      return null;
    }
  }

  _visit(zone) {
    this._visited.add(zone.id);
    if (this._complete || this._visited.size < FIELD_AFTER) return;
    this._complete = true;
    this._enterField();
  }

  /**
   * The ending, and the argument.  Meeting sixteen surfaces one at a time is
   * an inventory; an environment is not an inventory.  Once every surface has
   * been met, the outlines stay up together and the relations between them are
   * drawn — and the room comes up as one texture rather than sixteen separate
   * things.
   */
  _enterField() {
    if (this._field) return;
    this._field = true;
    this._stage.classList.add('is-field');
    for (const c of flatten(this._contours)) c.classList.add('is-held');
    this._sub.innerHTML = '\u201C' + CLOSING_QUOTE + '\u201D <span class="cite">\u2014 ' + CLOSING_CITE + '</span>';
    this._sub.style.color = 'var(--me-ink-dim)';
    if (this._hint) this._hint.textContent = FIELD_HINT;
  }

  /* -------------------------------------------------------------- the tour */

  /**
   * Sixteen surfaces cannot be marched through one at a time — that would take
   * thirteen seconds and teach nobody anything.  They are revealed at once,
   * staggered by a twentieth of a second, held, and retracted together: one
   * gesture that says *look at all of this* rather than sixteen that each say
   * *look here*.
   */
  _beginTour() {
    if (!this._built || this._complete) return;
    const order = flatten(this._contours);
    if (reducedMotion()) {
      for (const c of order) c.style.opacity = '0.15';
      this._tourTimers.push(window.setTimeout(() => {
        for (const c of order) c.style.opacity = '';
      }, 2600));
      return;
    }
    this._tourActive = true;
    order.forEach((contour, i) => {
      this._tourTimers.push(window.setTimeout(() => {
        if (!this._tourActive) return;
        contour.style.setProperty('--me-len', (contour.dataset.len || 0) + 'px');
        void contour.getBoundingClientRect();
        contour.classList.add('is-live');
      }, 90 + i * TOUR_STAGGER));
    });
    this._tourTimers.push(window.setTimeout(() => {
      this._tourActive = false;
      for (const c of order) c.classList.remove('is-live');
    }, 90 + order.length * TOUR_STAGGER + TOUR_HOLD));
  }

  _cancelTour() {
    this._tourActive = false;
    for (const id of this._tourTimers) clearTimeout(id);
    this._tourTimers = [];
    for (const [id, list] of this._contours) {
      if (this._live && this._live.id === id) continue;
      for (const c of list) c.classList.remove('is-live');
    }
    for (const c of flatten(this._contours)) c.style.opacity = '';
  }
}

if (!customElements.get('classroom-ecology')) {
  customElements.define('classroom-ecology', ClassroomEcology);
}


//# sourceURL=/home/sheeshka/Desktop/ubc/etec-534/media-ecology-spa/src/element.ts

};
__m["/home/sheeshka/Desktop/ubc/etec-534/media-ecology-spa/src/zones.ts"]=function(e,__req){
/**
 * zones.ts — the places in this room where its environment becomes audible.
 *
 * Every path is authored in the photograph's own coordinate space (1448 x 1086),
 * so a single viewBox carries the whole overlay and nothing can drift out of
 * register at any viewport size.
 *
 * "hit" is a deliberately looser contour than "path": it exists to keep the
 * targets usable on a phone, where the room is only a few hundred CSS pixels
 * wide.  It is never drawn.  Where a zone covers two separate objects — the
 * witch on the shelf and the pumpkin on the window sill are one idea wearing
 * two costumes — the extra object goes in "parts".
 *
 * "clip" is a recording made in this room, played once when the surface is
 * clicked.  Only the ten surfaces with something to hear have one; the rest are
 * silent by design rather than by omission.
 *
 * "quote" and "cite" are no longer drawn on the card.  They are kept here as
 * the record of which reading each surface came from, which is the thing that
 * has to survive into the writing.
 */
const NATIVE_W = 1448;
const NATIVE_H = 1086;

/**
 * The three layers the surfaces are sorted into, after Lum's account of a
 * medium's physical and symbolic form plus the institutional layer a school
 * adds.  The colour is only ever a hairline and a stroke, never a fill: it is
 * there to make a crossing visible, not to decorate.
 *
 * The witch and the pumpkin are left uncoloured on purpose.  They are the
 * counter-environment - here for a few weeks, making the rest of the room
 * visible by not belonging to it - so they belong to no layer at all.
 */
const GROUPS = {
  physical: { name: 'Physical form', token: '--me-g-physical' },
  symbolic: { name: 'Symbolic form', token: '--me-g-symbolic' },
  institutional: { name: 'Institutional', token: '--me-g-institutional' },
  counter: { name: 'Counter-environment', token: '' },
};
const ZONES = [
  {
    id: 'windows',
    group: 'physical',
    name: "The window bay",
    label: "Windows looking out at the street and the weather",
    clip: 'Noise.m4a',
    path: "M 10 8 L 184 8 L 186 300 L 192 434 L 186 690 L 172 788 L 142 800 L 8 802 Z",
    hit: "M 0 0 L 226 0 L 232 824 L 0 840 Z",
    anchor: [96, 300],
    quote: "The relational dynamics and modes of exchange that constitute educative action are essentially place bound.",
    cite: "Blenkinsop & Scutt (2010), in de Castell, Droumeva & Jenson (2014)",
    gloss: "The window is the place-based portal of which depicts the world outside of the classroom as if to bring perspective and contextualization beyond these walls.",
    question: "What does this room look out on, and what does that make possible?",
  },
  {
    id: 'ceiling',
    group: 'physical',
    name: "The stained ceiling tiles",
    label: "Water-stained ceiling tiles above the middle of the room",
    clip: 'Drips.m4a',
    path: "M 500 260 L 656 250 L 702 292 L 520 310 Z",
    hit: "M 470 232 L 686 222 L 734 320 L 488 340 Z",
    anchor: [596, 281],
    quote: "The ground rules, pervasive structure and overall patterns of environments elude easy perception.",
    cite: "McLuhan (1967), in de Castell, Droumeva & Jenson (2014)",
    gloss: "Water stains on the ceiling tiles showcase what a (normally hidden) environment looks like when it begins to break the fourth wall and become noticeable to the inhabitants.",
    question: "What else in here would we only notice once it failed?",
  },
  {
    id: 'lights',
    group: 'physical',
    name: "Fluorescent panels",
    label: "The bank of recessed fluorescent panels running across the ceiling",
    clip: 'Lights.m4a',
    path: "M 608 158 L 1198 174 L 1194 312 L 604 292 Z",
    hit: "M 572 128 L 1242 146 L 1238 346 L 566 322 Z",
    anchor: [900, 228],
    quote: "A building structures what we can see and say and, therefore, do.",
    cite: "Postman (1970, p. 162), in de Castell, Droumeva & Jenson (2014)",
    gloss: "Often unobserved, the state of the lights impact the institution's atmosphere and overall feel of the room. They influence how the classroom is felt and how things are seen.",
    question: "What has this room decided you will be able to see?",
  },
  {
    id: 'speaker',
    group: 'institutional',
    name: "Wall speaker",
    label: "Square loudspeaker mounted high on the back wall",
    clip: 'Bell.m4a',
    path: "M 941 305 Q 939 301 944 300 L 979 298 Q 984 298 984 303 L 986 350 Q 986 355 981 355 L 946 357 Q 941 357 940 352 Z",
    hit: "M 890 258 L 1036 252 L 1042 404 L 896 410 Z",
    anchor: [962, 327],
    quote: "The clock is not merely a means of keeping track of the hours, but of synchronizing the actions of men.",
    cite: "Mumford (1934, pp. 13-14), in Strate & Lum (2000)",
    gloss: "Semi-synonymous with the clock, the school's schedule, and the school bell. The speaker is the overarching institutional adhesive that reflects centralized administrative communication through infrastructure including marking the school-day's beginning and ending.",
    question: "Who decides when this room begins, and when it ends?",
  },
  {
    id: 'guitar',
    group: 'physical',
    name: "The hanging guitar",
    label: "Acoustic guitar hanging on the back wall",
    clip: 'Gtr.m4a',
    path: "M 893 420 C 908 420 919 431 919 448 C 919 461 914 468 907 472 C 917 476 924 486 924 497 C 924 509 910 515 893 515 C 876 515 862 509 862 497 C 862 486 869 476 879 472 C 872 468 867 461 867 448 C 867 431 878 420 893 420 Z M 873 428 L 888 428 L 894 368 L 874 365 Z",
    hit: "M 840 350 L 954 350 L 954 536 L 840 536 Z",
    anchor: [893, 462],
    quote: "Because of the different physical forms in which they encode, store, and transmit information, different media have different temporal, spatial, and sensory biases.",
    cite: "Nystrom's biases, in Lum (2000)",
    gloss: "A form of temporary media technics that exist only when being played.",
    question: "What is lost when a sound can be kept?",
  },
  {
    id: 'carpet',
    group: 'symbolic',
    name: "The carpet",
    label: "Blue alphabet carpet, printed with a square for every child",
    clip: 'Abc.m4a',
    path: "M 930 814 L 1442 810 L 1442 1078 L 1330 1078 L 1114 1046 Z",
    hit: "M 876 796 L 1448 796 L 1448 1086 L 1030 1086 Z",
    anchor: [1200, 930],
    quote: "A framework of ideas emphasizing organization, regularity, standardization, and control.",
    cite: "Miller (1986, p. 300), in Strate & Lum (2000)",
    gloss: "A pre-organized and self contained alphabet influencing social and spatial relationships with students assigned to individual spots. When we meet and talk together, it is the carpet which sorts the room.",
    question: "What does a child learn from a floor that is already sorted?",
  },
  {
    id: 'papers',
    group: 'symbolic',
    name: "Paper on the wall",
    label: "Papers and notices pinned to the back wall",
    clip: 'Papers.m4a',
    path: "M 944 468 L 1034 452 L 1076 490 L 1068 560 L 960 574 L 938 520 Z",
    hit: "M 916 434 L 1102 428 L 1108 566 L 922 572 Z",
    anchor: [1002, 514],
    quote: "Writing was also a container technology, one that stored not materials but information and ideas.",
    cite: "Strate & Lum (2000)",
    gloss: "My mess of papers pinned to the wall is representative of social and academic curricula along with administrative symbolism showcasing a space of working and learning together from an institutional perspective.",
    question: "Who wrote this, and who was it written for?",
  },
  {
    id: 'desk',
    group: 'institutional',
    name: "The teacher's desk",
    label: "The teacher's desk, computer, and chair",
    path: "M 950 552 L 1178 558 L 1182 626 L 954 636 Z",
    hit: "M 922 556 L 1200 562 L 1204 646 L 926 652 Z",
    anchor: [1066, 590],
    quote: "We do not so much need education to cultivate critical consumers as we need it to cultivate critical designers, makers, producers.",
    cite: "de Castell, Droumeva & Jenson (2014)",
    gloss: "The desk defines the megamachine and centralized social hierarchy of the room. It brings social structure to the teacher running the room, and the institution running the teacher.",
    question: "Is the teacher here a maker, or the manager of somebody else's system?",
  },
  {
    id: 'nametables',
    group: 'symbolic',
    name: "The student tables",
    label: "The row of student tables, each with a name card laid on it",
    path: "M 740 630 L 1364 636 L 1360 676 L 736 666 Z",
    hit: "M 732 618 L 1372 624 L 1376 758 L 728 746 Z",
    anchor: [1050, 654],
    quote: "... all too often that situated social practice is elided in favour of its nominal form - technology as a 'thing'.",
    cite: "de Castell, Droumeva & Jenson (2014)",
    gloss: "Names of students turn tables into assigned seats. While the furniture itself does not sort students (the teacher's practice around it does), it imbues social practices into physical structures.",
    question: "Who decided where you sit?",
  },
  {
    id: 'rainbow',
    group: 'symbolic',
    name: "The rainbow table",
    label: "Green crescent-shaped table in the middle of the floor",
    path: "M 626 710 C 700 700 820 702 900 716 C 962 730 1000 776 1000 826 C 1000 866 952 878 884 878 C 810 878 706 878 660 872 C 632 868 624 856 624 842 C 624 818 630 804 640 796 C 674 794 728 790 754 780 C 722 766 668 754 640 750 C 626 748 622 736 626 710 Z",
    hit: "M 612 692 L 1014 692 L 1014 894 L 612 894 Z",
    anchor: [846, 812],
    quote: "It assigns roles to us and insists on our playing them.",
    cite: "Postman (1970, p. 162), in de Castell, Droumeva & Jenson (2014)",
    gloss: "It is simultaneously no student's spot and every student's spot. Deconstructing social experiences due to its shape, the rainbow brings academic hierachy beyond the students' individualized spots and into an area of social learning assistance.",
    question: "What is this arrangement asking you to be?",
  },
  {
    id: 'birthday',
    group: 'symbolic',
    name: "The birthday chart",
    label: "Happy Birthday chart with a cupcake for each child",
    clip: 'Hbd2.m4a',
    path: "M 1170 434 L 1262 428 L 1268 560 L 1176 566 Z",
    hit: "M 1148 396 L 1294 392 L 1300 580 L 1154 586 Z",
    anchor: [1219, 497],
    quote: "Time-keeping passed into time-serving and time-accounting and time-rationing.",
    cite: "Mumford (1934, p. 14), in Strate & Lum (2000)",
    gloss: "A culturally embedded time analysis tool that brings cultural and personal awareness beyond the institutional standardization. The birthday chart is both a clock and bell in its own regard but with a different meaning.",
    question: "Whose time does this room keep?",
  },
  {
    id: 'halloween',
    group: 'counter',
    name: "The witch and the pumpkin",
    label: "Halloween witch on the shelf, and a carved pumpkin on the window sill",
    path: "M 1292 368 L 1360 362 L 1366 496 L 1296 502 Z",
    hit: "M 1270 340 L 1370 334 L 1376 500 L 1276 506 Z",
    parts: [{"path":"M 96 716 C 92 692 112 676 140 676 C 168 676 188 692 184 716 C 194 734 194 758 186 772 C 176 786 154 790 140 790 C 126 790 104 786 94 772 C 86 758 86 734 96 716 Z","hit":"M 70 656 L 210 656 L 210 806 L 70 806 Z"}],
    anchor: [1329, 428],
    quote: "Required for that wake-up call are what McLuhan called \"anti-environments\".",
    cite: "de Castell, Droumeva & Jenson (2014)",
    gloss: "Decorations bring forth a contrasting counter-environment probe into the environment itself. These objects disrupt the invisible classroom backdrop through their mere presence, making the everyday classroom visible again with their appearance.",
    question: "What would let you see this room as though you had never been in it?",
  },
  {
    id: 'vent',
    group: 'physical',
    name: "The furnace",
    label: "Grey heating unit along the wall under the board",
    clip: 'Furnace.m4a',
    path: "M 420 616 L 568 630 L 576 954 L 418 944 Z",
    hit: "M 390 586 L 602 600 L 610 986 L 392 976 Z",
    anchor: [492, 790],
    quote: "Significant deterioration, airborne particulates, leaks, draft, dust and toxic levels of mold.",
    cite: "de Castell, Droumeva & Jenson (2014)",
    gloss: "The furnace is what actively creates the felt (but often unnoticed) conditions for learning within the classroom environment. As physical infrastructure, it aligns environmental conditions and sensory presence.",
    question: "What is this building doing to the bodies in it, right now?",
  },
  {
    id: 'tubs',
    group: 'institutional',
    name: "Centre tubs",
    label: "Orange storage tubs holding the centre materials",
    clip: 'Centers.m4a',
    path: "M 224 812 C 214 778 216 730 230 704 C 246 676 294 654 338 646 C 378 639 416 642 422 666 C 428 692 420 728 404 756 C 390 780 380 792 378 812 Z",
    hit: "M 186 602 L 452 602 L 452 842 L 186 842 Z",
    anchor: [328, 722],
    quote: "A container of containers.",
    cite: "Mumford (1961, p. 16), in Strate & Lum (2000)",
    gloss: "A metacontainer of playful media representing a spatial segregation between academic work and social play.",
    question: "Who decides what is worth keeping, and who may reach it?",
  },
  {
    id: 'door',
    group: 'physical',
    name: "The door",
    label: "The door at the back of the room, another way out of it",
    path: "M 1366 404 L 1446 404 L 1446 682 L 1366 682 Z",
    hit: "M 1366 386 L 1448 386 L 1448 700 L 1366 700 Z",
    anchor: [1406, 543],
    quote: "The relational dynamics and modes of exchange that constitute educative action are essentially place bound.",
    cite: "Blenkinsop & Scutt (2010), in de Castell, Droumeva & Jenson (2014)",
    gloss: "While the window shows the outside and lets nothing through, the door is what creates the physical boundary of inclusion and exclusion amongst social groupings.",
    question: "What is this room built to keep in, and what is it built to let out?",
  },
];

/**
 * The relations.  Sixteen media in a room is an inventory, and an environment is
 * not an inventory: what makes it one is the claims that join them.
 *
 * Each entry is a claim about how two of these media constitute one another -
 * not a physical adjacency.  They are drawn only once every surface has been
 * met, and they are what turns the parts into a field.
 */
const RELATIONS = [
  { a: 'lights', b: 'vent', label: "The building's environmental conditions" },
  { a: 'speaker', b: 'birthday', label: "Two ways of keeping track of time with two different meanings" },
  { a: 'desk', b: 'windows', label: "A place where the room ends" },
  { a: 'rainbow', b: 'carpet', label: "Physical objects creating social structures" },
  { a: 'halloween', b: 'ceiling', label: "the counter-environment" },
  { a: 'nametables', b: 'carpet', label: "Physical objects creating social structures" },
  { a: 'door', b: 'windows', label: "A place where the room ends" },
  { a: 'guitar', b: 'tubs', label: "A container of cultural and social meanings" },
];

/** Shown in the subtitle slot once every zone has been listened to. */
const CLOSING_QUOTE = 'Is it a science? Is it a branch of philosophy? Is it a form of social criticism?';
const CLOSING_CITE = 'Postman (1988, p. 5), in Lum (2000)';

/** Shown under the wordmark at rest. */
const SUBTITLE = 'a look at my classroom';

/** Shown in the status line once the field is assembled. */
const FIELD_HINT =
  'Media ecology is what the combination of these mediums become when looked at as a whole. It is the physical, symbolic and institutional elements that come together to form the living interface that shapes how we learn, function and perceive the environment as one.';

/**
 * Shown in the status line before the field is assembled.  It names the move the
 * piece is about to make, so the definition above arrives as something the
 * reader has just done rather than something they have been told.
 */
const HINT =
  'First choose a medium, one at a time. Then, observe how the mediums come together to allign the whole.';


//# sourceURL=/home/sheeshka/Desktop/ubc/etec-534/media-ecology-spa/src/zones.ts
e.NATIVE_W=NATIVE_W;e.NATIVE_H=NATIVE_H;e.GROUPS=GROUPS;e.ZONES=ZONES;e.RELATIONS=RELATIONS;e.CLOSING_QUOTE=CLOSING_QUOTE;e.CLOSING_CITE=CLOSING_CITE;e.SUBTITLE=SUBTITLE;e.FIELD_HINT=FIELD_HINT;e.HINT=HINT;
};
__m["/home/sheeshka/Desktop/ubc/etec-534/media-ecology-spa/src/audio.ts"]=function(e,__req){
/**
 * audio.ts — the room's voice.
 *
 * Six of these surfaces now carry a recording made in the room itself.  A click
 * plays that recording once, at four fifths of its own level, and that is the
 * whole sound of the piece: the hover tone and the layered field texture of the
 * earlier build are gone.  A room recorded is more convincing than a room
 * synthesised, and the recordings were the point.
 *
 * One <audio> element per clip, made once and kept, so a second click restarts
 * the clip instead of refetching it.  The element is created on the visitor's
 * first gesture rather than on arrival, which starts the download at the moment
 * they have shown they are going to use the piece, and means the first click on
 * a surface tends to play rather than wait.
 *
 * play() rejects when the browser has not yet seen a gesture from the visitor.
 * That rejection is expected and deliberately swallowed, because the
 * alternative is an unhandled rejection in the console on every click before
 * the first one that works.
 */

/** Twenty percent below the recordings' own level. */
const VOLUME = 0.8;
class RoomSound {
  constructor(base) {
    this._base = String(base || '').replace(/\/+$/, '');
    this._els = new Map();
    this._urls = [];
    this._warmed = false;
  }

  /** Note which clips this build has, so they can be fetched in one go later. */
  prime(zones) {
    for (const zone of zones) {
      if (!zone.clip) continue;
      const url = this._base + '/' + zone.clip;
      if (this._urls.indexOf(url) === -1) this._urls.push(url);
    }
  }

  /** Start fetching everything on the first gesture.  Runs once. */
  resume() {
    if (this._warmed) return;
    this._warmed = true;
    for (const url of this._urls) this._el(url);
  }

  _el(url) {
    let el = this._els.get(url);
    if (!el) {
      el = new Audio(url);
      el.preload = 'auto';
      this._els.set(url, el);
    }
    return el;
  }

  /** Play one surface's recording from the top.  Silent if it has none. */
  play(zone) {
    if (!zone || !zone.clip) return;
    const el = this._el(this._base + '/' + zone.clip);
    el.volume = VOLUME;
    try {
      el.currentTime = 0;
    } catch (e) {
      /* Not seekable until the clip has loaded.  Playing from wherever it
         happens to be is better than not playing at all. */
    }
    const started = el.play();
    if (started && started.catch) started.catch(() => {});
  }
}


//# sourceURL=/home/sheeshka/Desktop/ubc/etec-534/media-ecology-spa/src/audio.ts
e.RoomSound=RoomSound;
};
__m["/home/sheeshka/Desktop/ubc/etec-534/media-ecology-spa/src/styles.ts"]=function(e,__req){
/**
 * styles.ts — everything the shadow root needs, in one string.
 *
 * The palette is sampled by eye from the photograph at dusk: bone, ash and a
 * near-black that is a shade warmer than pure black so the room does not look
 * pasted onto a void.  Nothing here draws a rounded, shadowed "card"; the
 * chrome is hairlines and letterspacing, which keeps the room the loudest thing
 * on the screen.
 */
const CSS = `
:host {
  --me-ink: #ece7dd;
  --me-ink-dim: #a09a8f;
  --me-ink-faint: #6d6860;
  --me-line: rgba(236, 231, 221, 0.14);
  --me-glow: #e6dcc6;
  /* The three layers, after Lum's physical and symbolic form plus the
     institutional layer a school adds.  Muted on purpose: they are hairlines and
     thin strokes, not fills, and they have to sit on a photograph. */
  --me-g-physical: #9fb4c4;
  --me-g-symbolic: #a9c3a0;
  --me-g-institutional: #d4b483;
  --me-ground: #0b0c0e;
  --me-sans: ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  --me-serif: "Iowan Old Style", "Palatino Linotype", Palatino, "Book Antiqua", Georgia, ui-serif, serif;

  display: block;
  width: 100%;
  min-width: 0;
  color: var(--me-ink);
  font-family: var(--me-sans);
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
}

*, *::before, *::after { box-sizing: border-box; }

.piece {
  --pad: clamp(14px, 3.2vw, 44px);
  width: min(1180px, 100%);
  margin-inline: auto;
  padding: var(--pad) 0;
  display: flex;
  flex-direction: column;
  min-width: 0;
}

/* Keep the whole piece on one screen when the viewport is wide enough that
   height, not width, is the binding constraint. */
@media (min-aspect-ratio: 5 / 4) {
  .piece { width: min(1180px, 100%, calc((100svh - var(--pad) * 2 - 92px) * 1.33333)); }
}

/* ---------- masthead ---------- */

.masthead {
  display: flex;
  align-items: baseline;
  flex-wrap: wrap;
  gap: 0.4rem 1.1rem;
  padding: 0 2px clamp(10px, 1.6vw, 18px);
}

.wordmark {
  font-size: 0.7rem;
  font-weight: 500;
  letter-spacing: 0.46em;
  text-transform: uppercase;
  color: var(--me-ink-dim);
  white-space: nowrap;
}

.subtitle {
  font-family: var(--me-serif);
  font-style: italic;
  font-size: clamp(0.78rem, 1.35vw, 0.92rem);
  line-height: 1.5;
  color: var(--me-ink-faint);
  max-width: 46ch;
  transition: color 0.6s ease;
}

.subtitle .cite {
  font-family: var(--me-sans);
  font-style: normal;
  font-size: 0.62rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  white-space: nowrap;
}

/* ---------- stage ---------- */

.stage {
  position: relative;
  aspect-ratio: 1448 / 1086;
  background: #090a0c;
  overflow: hidden;
  isolation: isolate;
}

.plate {
  position: absolute;
  inset: 0;
  background: #090a0c;
}

/* The 24 px LQIP, blown up and blurred, so a slow connection sees the room's
   light before it sees the room.  It is gone by the time the photograph is in. */
.wash {
  position: absolute;
  inset: 0;
  background-size: cover;
  background-position: center;
  filter: blur(16px);
  transform: scale(1.08);
  opacity: 1;
  transition: opacity 0.9s ease;
  pointer-events: none;
}

.stage.is-ready .wash { opacity: 0; }

.plate::after {
  content: "";
  position: absolute;
  inset: 0;
  pointer-events: none;
  background: radial-gradient(122% 92% at 50% 44%, rgba(0, 0, 0, 0) 52%, rgba(6, 7, 9, 0.5) 100%);
}

.plate picture, .plate img { display: block; width: 100%; height: 100%; }

.plate img {
  object-fit: cover;
  opacity: 0;
  transition: opacity 1.2s ease;
}

.stage.is-ready .plate img { opacity: 1; }

/* ---------- overlay ---------- */

.overlay {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  z-index: 2;
  pointer-events: none;
  overflow: visible;
}

.contour {
  fill: none;
  stroke: var(--me-glow);
  stroke-width: 1.25px;
  stroke-linecap: round;
  stroke-linejoin: round;
  vector-effect: non-scaling-stroke;
  stroke-dasharray: var(--me-len, 0);
  stroke-dashoffset: var(--me-len, 0);
  opacity: 0;
  filter: drop-shadow(0 0 1.5px rgba(230, 220, 198, 0.6)) drop-shadow(0 0 8px rgba(230, 220, 198, 0.22));
  transition: opacity 0.42s ease, stroke-dashoffset 0.78s cubic-bezier(0.22, 0.61, 0.36, 1);
}

.contour.is-held { opacity: 0.3; stroke-dashoffset: 0; }
.stage.is-field .contour.is-held { opacity: 0.2; }
.stage.is-field .contour.is-held.is-live { opacity: 1; }

.contour.is-live { opacity: 1; stroke-dashoffset: 0; }

/* Reduced motion: the outline is simply there, with no draw-in to watch. */
.contour.is-static { stroke-dasharray: none; stroke-dashoffset: 0; }

.hit {
  fill: none;
  stroke: none;
  pointer-events: all;
  cursor: pointer;
  outline: none;
  -webkit-tap-highlight-color: transparent;
}

/* ---------- scrim + card ---------- */

.scrim {
  position: absolute;
  inset: 0;
  z-index: 3;
  background: #040507;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.42s ease;
}

.stage.is-open .scrim { opacity: 0.3; pointer-events: auto; }

.card-layer {
  position: absolute;
  inset: 0;
  z-index: 4;
  display: grid;
  place-items: center;
  padding: clamp(12px, 3.4vw, 44px);
  pointer-events: none;
}

.card {
  pointer-events: none;
  width: min(31rem, 100%);
  max-height: 100%;
  overflow: auto;
  overscroll-behavior: contain;
  position: relative;
  padding: clamp(1.35rem, 3.2vw, 2.2rem);
  background: rgba(11, 12, 15, 0.9);
  -webkit-backdrop-filter: blur(18px) saturate(0.82);
  backdrop-filter: blur(18px) saturate(0.82);
  border: 1px solid var(--me-line);
  opacity: 0;
  transform: translateY(9px);
  transition: opacity 0.42s ease, transform 0.5s cubic-bezier(0.22, 0.61, 0.36, 1);
}

.stage.is-open .card { opacity: 1; transform: none; pointer-events: auto; }

.card-zone {
  font-size: 0.63rem;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  color: var(--me-ink-faint);
  margin-bottom: 0.95rem;
}

.card-rule {
  height: 1px;
  margin: 0 0 0.95rem;
  border: 0;
  background: var(--me-line);
}

/* The description: one or two sentences on what this surface is.  It is the
   only body text on the card, so it carries no label above it. */
.card-gloss {
  margin: 0;
  font-size: 0.83rem;
  line-height: 1.62;
  color: var(--me-ink-dim);
  text-wrap: pretty;
}

/* ---------- the relations ---------- */

.relations {
  opacity: 0;
  transition: opacity 0.7s ease;
}

.stage.is-field .relations { opacity: 1; }

/* No stroke here on purpose: each path points at its own gradient, and a
   stylesheet rule would outrank the attribute carrying that url(). */
.relation {
  fill: none;
  stroke-width: 1px;
  /* Low, but not so low that the hue cannot be named: the colour is the claim
     that a relation crosses two layers. */
  stroke-opacity: 0.55;
  transition: stroke-opacity 0.35s ease;
}

.stage.is-field .relation.is-live { stroke-opacity: 0.95; }

/* A relation label is a claim about two media, so it appears while one of them
   is being held.  A text-shadow, not a chip — nothing boxed. */
.rel-layer {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.rel-label {
  position: absolute;
  transform: translate(-50%, -50%);
  font-size: 0.58rem;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--me-ink);
  text-shadow: 0 0 3px var(--me-ground), 0 0 8px var(--me-ground), 0 1px 2px rgba(0, 0, 0, 0.9);
  opacity: 0;
  transition: opacity 0.35s ease;
  /* These names are set in caps with wide letter-spacing, so a long one runs
     very wide.  It has to be allowed to break: a name that cannot wrap simply
     leaves the picture.  The cap is wider than every short name, so those stay
     on one line and only the long ones take a second. */
  white-space: normal;
  text-align: center;
  max-width: 20rem;
}

.stage.is-field .rel-label.is-on { opacity: 1; }

.card-close {
  position: absolute;
  top: 0;
  right: 0;
  width: 46px;
  height: 46px;
  display: grid;
  place-items: center;
  padding: 0;
  border: 0;
  background: none;
  cursor: pointer;
  color: var(--me-ink-dim);
  transition: color 0.3s ease;
}

.card-close:hover, .card-close:focus-visible { color: var(--me-ink); }

.card-close svg {
  width: 13px;
  height: 13px;
  fill: none;
  stroke: currentColor;
  stroke-width: 1.3;
  stroke-linecap: round;
}

/* ---------- statusline ---------- */

.statusline {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  flex-wrap: wrap;
  min-width: 0;
  gap: 0.6rem 1.4rem;
  padding: clamp(10px, 1.6vw, 18px) 2px 0;
}

.hint {
  font-size: clamp(0.68rem, 1.25vw, 0.76rem);
  line-height: 1.55;
  color: var(--me-ink-faint);
  max-width: 52ch;
  min-width: 0;
  overflow-wrap: break-word;
  transition: opacity 0.35s ease;
}

.zone-label {
  font-size: 0.63rem;
  letter-spacing: 0.28em;
  text-transform: uppercase;
  color: var(--me-ink-dim);
  white-space: nowrap;
  opacity: 0;
  transition: opacity 0.32s ease;
}

.zone-label.is-on { opacity: 1; }

/* ---------- small screens ---------- */

@media (max-width: 700px) {
  /* The room is only ~300 px tall here; a card living inside it would be cut
     off, so on a phone the card leaves the stage and becomes a bottom sheet. */
  .scrim { position: fixed; }
  .card-layer {
    position: fixed;
    inset: 0;
    padding: 0;
    align-items: end;
  }
  .card {
    width: 100%;
    max-height: min(80svh, 36rem);
    border-left: 0;
    border-right: 0;
    border-bottom: 0;
    padding: 1.5rem clamp(1.1rem, 5vw, 1.6rem) calc(1.7rem + env(safe-area-inset-bottom, 0px));
  }
  .card-close { top: 2px; right: 2px; }
}

@media (max-width: 620px) {
  .masthead { gap: 0.3rem; }
  .wordmark { letter-spacing: 0.36em; font-size: 0.64rem; }
  .subtitle { font-size: 0.76rem; }
  .statusline { flex-direction: column; gap: 0.35rem; }
  .card-close { width: 42px; height: 42px; }
}

/* ---------- screen-reader only ---------- */

.sr {
  position: absolute;
  width: 1px;
  height: 1px;
  margin: -1px;
  padding: 0;
  overflow: hidden;
  clip-path: inset(50%);
  white-space: nowrap;
  border: 0;
}

/* ---------- reduced motion ---------- */

@media (prefers-reduced-motion: reduce) {
  .contour, .card, .scrim, .plate img, .subtitle, .zone-label, .wash,
  .relation, .relations, .rel-label {
    transition-duration: 0.001s !important;
  }
  .contour { filter: none; }
}

/* ---------- hero host ---------- */

/*
 * With the hero attribute the piece is the page's opening image rather than a
 * figure sitting on a dark card. The photograph keeps its exact 1448:1086 stage
 * -- cropping it would cut the carpet, which is the argument -- so the page sets
 * the host's width to whatever makes that stage fill the height it is given.
 * The chrome then rides on top of the picture behind its own scrims, so no
 * vertical space is spent on margins above and below it.
 */
:host([hero]) .piece {
  position: relative;
  width: 100%;
  padding: 0;
}

:host([hero]) .masthead,
:host([hero]) .statusline {
  position: absolute;
  left: 0;
  right: 0;
  z-index: 4;
  /* These sit on top of the photograph, so without this they would swallow
     every click on the surfaces beneath them — the ceiling and the lights under
     the heading, the carpet under the status line. */
  pointer-events: none;
}

:host([hero]) .masthead {
  top: 0;
  padding: clamp(16px, 2.2vw, 30px) clamp(18px, 2.6vw, 46px) clamp(40px, 7vw, 96px);
  background: linear-gradient(to bottom, rgba(6, 7, 9, 0.88) 0%, rgba(6, 7, 9, 0.6) 58%, rgba(6, 7, 9, 0) 100%);
}

/*
 * In hero mode the piece is not the top of the page: the blog's own title sits
 * directly above the picture, and repeating MEDIA ECOLOGY immediately under it
 * reads as a duplication rather than as a title card. The subtitle stays,
 * because it is both the piece's own answer to that title and the slot the
 * closing question arrives in once the field assembles.
 */
:host([hero]) .wordmark {
  display: none;
}

:host([hero]) .statusline {
  bottom: 0;
  padding: clamp(40px, 7vw, 96px) clamp(18px, 2.6vw, 46px) clamp(16px, 2.2vw, 30px);
  background: linear-gradient(to top, rgba(6, 7, 9, 0.88) 0%, rgba(6, 7, 9, 0.6) 58%, rgba(6, 7, 9, 0) 100%);
}

/*
 * The chrome reads light here because it sits on the picture behind a scrim.
 * --me-hero-ink lets the embedding page re-colour it, which it does on a phone
 * where the chrome moves off the picture and onto the page background.
 */
:host([hero]) .wordmark,
:host([hero]) .zone-label {
  color: var(--me-hero-ink, #ece7dd);
}
:host([hero]) .subtitle,
:host([hero]) .hint {
  color: var(--me-hero-ink, #ece7dd);
  opacity: 0.68;
}

/*
 * On a phone the picture is only as tall as its width allows, and chrome laid
 * over it would swallow it. Put the chrome above and below instead, on the
 * page's own background.
 */
@media (max-width: 700px) {
  :host([hero]) .masthead,
  :host([hero]) .statusline {
    position: static;
    background: none;
  }
  :host([hero]) .masthead {
    padding: 0 0 12px;
  }
  :host([hero]) .statusline {
    padding: 12px 0 0;
  }
}
`;

/** The × inside the card's close button. */
const CLOSE_GLYPH = '<svg viewBox="0 0 14 14" aria-hidden="true"><path d="M1 1 13 13M13 1 1 13"/></svg>';


//# sourceURL=/home/sheeshka/Desktop/ubc/etec-534/media-ecology-spa/src/styles.ts
e.CSS=CSS;e.CLOSE_GLYPH=CLOSE_GLYPH;
};
__m["/home/sheeshka/Desktop/ubc/etec-534/media-ecology-spa/src/stage.ts"]=function(e,__req){
/**
 * stage.ts — the picture, the vector layer over it, and the relations between
 * the surfaces.
 *
 * The picture and the contours are laid into one box whose aspect ratio is the
 * photograph's own (1448 × 1086).  The <img> fills that box and the <svg>
 * shares its viewBox, so every contour stays welded to the surface it names at
 * any viewport width, with no measurement and no resize handler.
 *
 * The relation labels are the one thing that cannot live in the SVG: text in a
 * viewBox stretched by preserveAspectRatio="none" would be distorted, so they
 * are HTML positioned in percentages of the same box instead.
 */
const { NATIVE_W, NATIVE_H, ZONES, RELATIONS, GROUPS } = __req("/home/sheeshka/Desktop/ubc/etec-534/media-ecology-spa/src/zones.ts");
const DEFAULT_WIDTHS = [800, 1280, 1448];

/** Which layer a surface belongs to.  Anything untagged falls to the counter. */
function groupOf(id) {
  const zone = ZONES.find((z) => z.id === id);
  return (zone && zone.group) || 'counter';
}

/**
 * The colour a layer is drawn in.  A layer with no token - the witch and the
 * pumpkin - keeps the neutral ink, which is the point of leaving it out.
 */
function layerColour(id) {
  const group = GROUPS[groupOf(id)];
  return group && group.token ? 'var(' + group.token + ')' : 'var(--me-glow)';
}

/** Gradients are named per instance so two pieces could share a page. */
let instances = 0;

/** Read how this instance was told to find the photograph. */
function readSources(host) {
  const raw = host.getAttribute('image-srcs');
  if (raw) {
    try {
      const list = JSON.parse(raw);
      if (Array.isArray(list) && list.length) return { kind: 'srcs', list: list };
    } catch (e) {
      /* fall through to the base form */
    }
  }
  const widthsAttr = host.getAttribute('widths');
  return {
    kind: 'base',
    base: host.getAttribute('image-base') || 'dist/img/classroom',
    formats: (host.getAttribute('formats') || 'webp,jpg').split(',').map((s) => s.trim()).filter(Boolean),
    widths: widthsAttr ? widthsAttr.split(',').map(Number).filter((n) => n > 0) : DEFAULT_WIDTHS,
  };
}

const MIME = { avif: 'image/avif', webp: 'image/webp', jpg: 'image/jpeg', jpeg: 'image/jpeg', png: 'image/png' };

const SIZES = '(min-width: 1220px) 1180px, 100vw';

/** Build the <picture>. */
function buildPicture(spec, alt) {
  const picture = document.createElement('picture');
  const stem = spec.kind === 'base' ? spec.base.replace(/\/+$/, '') : '';

  if (spec.kind === 'base') {
    for (const format of spec.formats) {
      const ext = format === 'jpg' ? 'jpg' : format;
      if (ext === 'jpg') continue;
      const source = document.createElement('source');
      if (MIME[ext]) source.type = MIME[ext];
      source.srcset = spec.widths.map((w) => stem + '-' + w + '.' + ext + ' ' + w + 'w').join(', ');
      source.sizes = SIZES;
      picture.appendChild(source);
    }
    const img = document.createElement('img');
    const last = spec.widths[spec.widths.length - 1];
    img.src = stem + '-' + last + '.jpg';
    img.srcset = spec.widths.map((w) => stem + '-' + w + '.jpg ' + w + 'w').join(', ');
    img.sizes = SIZES;
    img.alt = alt;
    img.decoding = 'async';
    img.fetchPriority = 'high';
    picture.appendChild(img);
    return picture;
  }

  const source = document.createElement('source');
  source.srcset = spec.list.map((entry) => entry.src + ' ' + entry.w + 'w').join(', ');
  source.sizes = SIZES;
  picture.appendChild(source);

  const img = document.createElement('img');
  const largest = spec.list[spec.list.length - 1];
  img.src = largest.src;
  img.alt = alt;
  img.decoding = 'async';
  img.fetchPriority = 'high';
  picture.appendChild(img);
  return picture;
}

/** Build the overlay: one invisible working outline per zone, then its target. */
/**
 * One relation, bowed into an arc.  Straight lines between sixteen anchors
 * cross in the middle of the room and read as a tangle; a slight bow keeps
 * each claim legible as its own gesture, and the alternating direction stops
 * the arcs from collapsing onto one another.
 */
function relationArc(a, b, flip) {
  const dx = b[0] - a[0];
  const dy = b[1] - a[1];
  const len = Math.hypot(dx, dy) || 1;
  const bow = Math.min(len * 0.15, 86) * (flip ? -1 : 1);
  const cx = (a[0] + b[0]) / 2 - (dy / len) * bow;
  const cy = (a[1] + b[1]) / 2 + (dx / len) * bow;
  return {
    d: 'M ' + a[0] + ' ' + a[1] + ' Q ' + cx.toFixed(1) + ' ' + cy.toFixed(1) + ' ' + b[0] + ' ' + b[1],
    // A quadratic's midpoint is not the average of its ends.
    mid: [0.25 * a[0] + 0.5 * cx + 0.25 * b[0], 0.25 * a[1] + 0.5 * cy + 0.25 * b[1]],
  };
}

/** Where each relation's label sits, as a percentage of the stage box. */
function relationGeometry() {
  const anchor = Object.fromEntries(ZONES.map((z) => [z.id, z.anchor]));
  return RELATIONS.map((r, i) => {
    const arc = relationArc(anchor[r.a], anchor[r.b], i % 2 === 1);
    return {
      key: r.a + '|' + r.b,
      a: r.a,
      b: r.b,
      // The ends, not just the curve: a gradient has to run from one to the other.
      pa: anchor[r.a],
      pb: anchor[r.b],
      label: r.label,
      d: arc.d,
      // Clamped: a label centred on a midpoint near the edge would otherwise
      // run out of the stage entirely.
      left: Math.max(9, Math.min(91, (arc.mid[0] / NATIVE_W) * 100)),
      top: Math.max(5, Math.min(95, (arc.mid[1] / NATIVE_H) * 100)),
    };
  });
}
function buildOverlay() {
  const ns = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(ns, 'svg');
  svg.setAttribute('class', 'overlay');
  svg.setAttribute('viewBox', '0 0 ' + NATIVE_W + ' ' + NATIVE_H);
  svg.setAttribute('preserveAspectRatio', 'none');
  svg.setAttribute('role', 'group');
  svg.setAttribute('aria-label', 'Sixteen surfaces of this classroom and the relations between them');

  const uid = 'me' + (instances += 1) + '-' + Math.floor(Math.random() * 1e6) + '-' + 'r';

  // Each relation joins two of the three layers, and several of them cross: the
  // bell answers to the institution while the birthday chart belongs to the
  // room's own symbolism, the teacher's desk to the institution while the window
  // bay is simply physical.  Painting the stroke as a gradient from one end's
  // layer to the other makes that crossing legible without labelling a thing.
  const defs = document.createElementNS(ns, 'defs');
  const relations = document.createElementNS(ns, 'g');
  relations.setAttribute('class', 'relations');
  relationGeometry().forEach((rel, i) => {
    const gradient = document.createElementNS(ns, 'linearGradient');
    gradient.setAttribute('id', uid + i);
    gradient.setAttribute('gradientUnits', 'userSpaceOnUse');
    gradient.setAttribute('x1', rel.pa[0]);
    gradient.setAttribute('y1', rel.pa[1]);
    gradient.setAttribute('x2', rel.pb[0]);
    gradient.setAttribute('y2', rel.pb[1]);
    [[rel.a, '0'], [rel.b, '1']].forEach((pair) => {
      const stop = document.createElementNS(ns, 'stop');
      stop.setAttribute('offset', pair[1]);
      stop.style.stopColor = layerColour(pair[0]);
      gradient.appendChild(stop);
    });
    defs.appendChild(gradient);

    const path = document.createElementNS(ns, 'path');
    path.setAttribute('class', 'relation');
    path.setAttribute('d', rel.d);
    path.setAttribute('data-rel', rel.key);
    path.setAttribute('data-a', rel.a);
    path.setAttribute('data-b', rel.b);
    // An attribute rather than a class: it has to be a url() to this path's own
    // gradient, which means the stylesheet must not set stroke on .relation.
    path.setAttribute('stroke', 'url(#' + uid + i + ')');
    path.setAttribute('vector-effect', 'non-scaling-stroke');
    relations.appendChild(path);
  })

  const contours = document.createElementNS(ns, 'g');
  contours.setAttribute('class', 'contours');
  const hits = document.createElementNS(ns, 'g');
  hits.setAttribute('class', 'hits');

  for (const zone of ZONES) {
    // A zone is usually one object.  The witch and the pumpkin are one idea in
    // two places, so they are two outlines and two targets that answer as one.
    const pieces = [{ path: zone.path, hit: zone.hit }].concat(zone.parts || []);
    pieces.forEach((piece, i) => {
      const contour = document.createElementNS(ns, 'path');
      contour.setAttribute('class', 'contour');
      contour.setAttribute('d', piece.path);
      contour.setAttribute('data-zone', zone.id);
      contours.appendChild(contour);

      const hit = document.createElementNS(ns, 'path');
      hit.setAttribute('class', 'hit');
      hit.setAttribute('d', piece.hit);
      hit.setAttribute('data-zone', zone.id);
      // One stop in the tab order per surface, not one per outline.
      if (i === 0) {
        hit.setAttribute('tabindex', '0');
        hit.setAttribute('role', 'button');
        hit.setAttribute('aria-label', zone.label);
      }
      hits.appendChild(hit);
    });
  }

  svg.appendChild(defs);
  svg.appendChild(relations);
  svg.appendChild(contours);
  svg.appendChild(hits);
  return svg;
}

/**
 * Order the targets biggest-first.
 *
 * Several of these surfaces genuinely overlap on screen: the stained tiles run
 * into the end of the fluorescent bank, the wall paper sits behind the
 * teacher's desk.  In SVG the
 * last element in document order wins the click, so whichever shape happened
 * to be authored last quietly swallowed its neighbour's targets.  Ranking by
 * area instead means the specific thing always beats the broad thing it sits
 * inside, whatever order the data happens to be written in.
 *
 * This has to run after the overlay is in the document, because getBBox() only
 * measures geometry that is attached to one.
 */
function rankHits(svg) {
  const group = svg.querySelector('.hits');
  if (!group) return;
  const items = Array.prototype.map.call(group.children, (el) => {
    let area = 0;
    try {
      const box = el.getBBox();
      area = box.width * box.height;
    } catch (e) {
      /* An unmeasurable target keeps area 0 and sinks to the bottom. */
    }
    return { el: el, area: area };
  });
  items.sort((a, b) => b.area - a.area);
  for (const item of items) group.appendChild(item.el);
}

/** The relation labels, positioned in percentages so they track the stage box. */
function buildRelationLabels() {
  const layer = document.createElement('div');
  layer.className = 'rel-layer';
  for (const rel of relationGeometry()) {
    const node = document.createElement('span');
    node.className = 'rel-label';
    node.dataset.rel = rel.key;
    node.style.left = rel.left.toFixed(3) + '%';
    node.style.top = rel.top.toFixed(3) + '%';
    node.textContent = rel.label;
    layer.appendChild(node);
  }
  return layer;
}

/** One line of the floating card. */
function cardMarkup(zone) {
  const group = GROUPS[zone.group] || GROUPS.counter;
  // The hairline under the name carries the layer.  A tint on the text would
  // make the card shout; a tint on the rule alone keeps it legible.
  const tint = group.token ? 'var(' + group.token + ')' : 'var(--me-line)';
  return ''
    + '<p class="card-zone">' + zone.name + '</p>'
    + '<hr class="card-rule" style="background:' + tint + '">'
    // Just the description: no layer, no category, and no relation to any other
    // surface.  Those arrive only once enough surfaces have been met.
    + '<p class="card-gloss">' + zone.gloss + '</p>';
}


//# sourceURL=/home/sheeshka/Desktop/ubc/etec-534/media-ecology-spa/src/stage.ts
e.readSources=readSources;e.buildPicture=buildPicture;e.relationArc=relationArc;e.relationGeometry=relationGeometry;e.buildOverlay=buildOverlay;e.rankHits=rankHits;e.buildRelationLabels=buildRelationLabels;e.cardMarkup=cardMarkup;
};
__req("/home/sheeshka/Desktop/ubc/etec-534/media-ecology-spa/src/element.ts");
})();