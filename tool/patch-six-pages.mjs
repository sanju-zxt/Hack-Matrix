/**
 * Atomic 7-page -> 6-page DL booklet patch.
 *
 * Applies every edit as a set of exact-string replacements, verifies each one
 * matched exactly once BEFORE writing anything, and only then writes the file a
 * single time. If any pattern is missing or ambiguous the script aborts and the
 * template on disk is left untouched, so a partial conversion is impossible.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const TARGET = join(ROOT, "brochure", "hack-matrix-brochure.html");

/** @type {{name: string, from: string, to: string}[]} */
const REPLACEMENTS = [];
const rep = (name, from, to) => REPLACEMENTS.push({ name, from, to });

// ── 1. title ────────────────────────────────────────────────────────────────
rep(
  "title",
  "Brochure (7-page DL booklet)",
  "Brochure (6-page DL booklet)"
);

// ── 2. new layout systems, appended after .foot ─────────────────────────────
rep(
  "css: hud layout systems",
  `.foot {
    margin-top: auto; padding-top: 2.4mm;
    border-top: .4mm solid var(--hair);
    font-family: "JetBrains Mono", monospace;
    font-size: 1.4mm; letter-spacing: .08em; color: var(--ink-3);
    display: flex; justify-content: space-between;
  }`,
  `.foot {
    margin-top: auto; padding-top: 2.4mm;
    border-top: .4mm solid var(--hair);
    font-family: "JetBrains Mono", monospace;
    font-size: 1.4mm; letter-spacing: .08em; color: var(--ink-3);
    display: flex; justify-content: space-between;
  }

  /* ═══════════ PAGE 2 · pull-quote block ═══════════ */
  .quote {
    border-left: .8mm solid var(--cy);
    background-color: var(--surf);
    padding: 2.8mm 3mm;
    margin-top: 4.4mm;
  }
  .quote p {
    font-family: "Space Grotesk", sans-serif; font-size: 2.6mm;
    font-weight: 600; line-height: 1.34; color: var(--ink);
  }
  .quote span {
    display: block; margin-top: 1.4mm;
    font-family: "JetBrains Mono", monospace; font-size: 1.4mm;
    letter-spacing: .14em; text-transform: uppercase; color: var(--cy);
  }

  /* ═══════════ PAGE 3 · theme card grid ═══════════ */
  .grid3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.4mm; }
  .tcard {
    background-color: var(--surf);
    border-top: .5mm solid var(--cy);
    padding: 1.8mm 1.6mm;
  }
  .tcard .n {
    display: block;
    font-family: "JetBrains Mono", monospace; font-size: 1.4mm; font-weight: 700;
    color: var(--cy); letter-spacing: .06em; margin-bottom: .9mm;
  }
  .tcard b {
    display: block;
    font-family: "Space Grotesk", sans-serif; font-size: 2mm; font-weight: 600;
    color: var(--ink); line-height: 1.2; margin-bottom: .7mm;
  }
  .tcard .d { display: block; font-size: 1.65mm; line-height: 1.35; color: var(--ink-3); }

  /* ═══════════ PAGE 4 · two-column split ═══════════ */
  .split { display: grid; grid-template-columns: 1fr 1fr; gap: 3.4mm; align-items: start; }
  .split > div { min-width: 0; }
  .split .tag { display: block; margin-bottom: 1.2mm; }
  .split .tag:last-child { margin-bottom: 0; }

  /* ═══════════ PAGE 5 · judging weight bars ═══════════ */
  .wrow { display: flex; align-items: center; gap: 2.4mm; margin-bottom: 2.1mm; }
  .wrow:last-child { margin-bottom: 0; }
  .wrow .wl {
    font-size: 1.9mm; color: var(--ink-2); line-height: 1.3;
    flex: 1 1 auto; min-width: 0;
  }
  .wrow .wt { flex: 0 0 18mm; height: 1.2mm; background-color: var(--hair); }
  .wrow .wt i { display: block; height: 1.2mm; background-color: var(--hair-3); }
  .wrow.top .wt i { background-color: var(--cy); }
  .wrow .wp {
    font-family: "JetBrains Mono", monospace; font-size: 1.8mm; font-weight: 700;
    color: var(--ink); flex: 0 0 8mm; text-align: right;
  }
  .wrow.top .wp { color: var(--cy); }

  /* ═══════════ PAGE 6 · run of show, one time gutter ═══════════ */
  .sched { display: flex; flex-direction: column; border-left: .4mm solid var(--hair-2); }
  .sched-item {
    display: flex; gap: 3mm; align-items: baseline;
    padding: 1.55mm 0 1.55mm 3mm; position: relative;
  }
  .sched-item::before {
    content: ""; position: absolute; left: -1.05mm; top: 2.05mm;
    width: 1.5mm; height: 1.5mm; background-color: var(--hair-3);
    clip-path: polygon(50% 0, 100% 50%, 50% 100%, 0 50%);
  }
  .sched-item.hot::before { background-color: var(--cy); }
  .sched-item .t {
    font-family: "JetBrains Mono", monospace; font-size: 1.85mm; font-weight: 700;
    color: var(--cy); flex: 0 0 12.5mm; line-height: 1.3;
  }
  .sched-item .l { font-size: 1.9mm; line-height: 1.35; color: var(--ink-2); min-width: 0; }
  .sched-item .l b {
    font-family: "Space Grotesk", sans-serif; font-size: 2mm; font-weight: 600;
    color: var(--ink); margin-right: 1.4mm;
  }
  .sched-item.pre .t { color: var(--ink-3); }`
);

// ── 3. page 2: drop lockup, add pull-quote ──────────────────────────────────
rep(
  "page 2: pull-quote",
  `<div class="lockup">
      <span class="mark">HACK-MATRIX 2026</span><span class="sub">About the sprint</span>
    </div>

    <h2 class="page-title">Eight hours.<br />Zero pre-built projects.</h2>`,
  `<h2 class="page-title">Eight hours.<br />Zero pre-built projects.</h2>`
);

rep(
  "page 2: quote body",
  `build, deploy and present a working solution inside that window.
    </p>`,
  `build, deploy and present a working solution inside that window.
    </p>

    <div class="quote">
      <p>&ldquo;Build from zero.<br />Ship something real.&rdquo;</p>
      <span>// the only rule that matters</span>
    </div>`
);

// ── 4. page 3: 9 identical rows -> 3x3 card grid ────────────────────────────
rep(
  "page 3: theme grid",
  `<div class="lockup">
      <span class="mark">HACK-MATRIX 2026</span><span class="sub">Theme tracks</span>
    </div>

    <h2 class="page-title">Nine theme tracks</h2>`,
  `<h2 class="page-title">Nine theme tracks</h2>`
);

rep(
  "page 3: grid markup",
  `<div class="theme-list">
      <div class="theme"><span class="n">01</span><span class="t"><b>Artificial Intelligence</b><span>Agents, reasoning, generative AI.</span></span></div>
      <div class="theme"><span class="n">02</span><span class="t"><b>Machine Learning</b><span>Models, prediction, training pipelines.</span></span></div>
      <div class="theme"><span class="n">03</span><span class="t"><b>Data Science</b><span>Insight extraction, analytics tooling.</span></span></div>
      <div class="theme"><span class="n">04</span><span class="t"><b>Web &amp; Full-Stack</b><span>Complete apps, APIs, product builds.</span></span></div>
      <div class="theme"><span class="n">05</span><span class="t"><b>Automation</b><span>Tools and bots that cut human effort.</span></span></div>
      <div class="theme"><span class="n">06</span><span class="t"><b>Cybersecurity</b><span>Protecting systems, data and privacy.</span></span></div>
      <div class="theme"><span class="n">07</span><span class="t"><b>Cloud &amp; DevOps</b><span>Infrastructure, deployment, reliability.</span></span></div>
      <div class="theme"><span class="n">08</span><span class="t"><b>Social Impact</b><span>Technology that serves communities.</span></span></div>
      <div class="theme"><span class="n">09</span><span class="t"><b>Open Innovation</b><span>Bold, novel, unexpected &mdash; build it.</span></span></div>
    </div>`,
  `<div class="grid3">
      <div class="tcard"><span class="n">01</span><b>Artificial Intelligence</b><span class="d">Agents, reasoning, generative AI.</span></div>
      <div class="tcard"><span class="n">02</span><b>Machine Learning</b><span class="d">Models, prediction, training pipelines.</span></div>
      <div class="tcard"><span class="n">03</span><b>Data Science</b><span class="d">Insight extraction, analytics tooling.</span></div>
      <div class="tcard"><span class="n">04</span><b>Web &amp; Full-Stack</b><span class="d">Complete apps, APIs, product builds.</span></div>
      <div class="tcard"><span class="n">05</span><b>Automation</b><span class="d">Tools and bots that cut human effort.</span></div>
      <div class="tcard"><span class="n">06</span><b>Cybersecurity</b><span class="d">Protecting systems, data and privacy.</span></div>
      <div class="tcard"><span class="n">07</span><b>Cloud &amp; DevOps</b><span class="d">Infrastructure, deployment, reliability.</span></div>
      <div class="tcard"><span class="n">08</span><b>Social Impact</b><span class="d">Technology that serves communities.</span></div>
      <div class="tcard"><span class="n">09</span><b>Open Innovation</b><span class="d">Bold, novel, unexpected.</span></div>
    </div>`
);

// ── 5. delete the process page; its content merges into page 6 ──────────────
rep(
  "page 4: delete process page",
  `<!-- ═══════════ PAGE 4 · HOW IT WORKS ═══════════ -->
<section class="page" data-page="4">
  <div class="reticle">
    <span class="bracket tl"></span><span class="bracket tr"></span>
    <span class="bracket bl"></span><span class="bracket br"></span>
  </div>
  <div class="ghostnum">04</div>

  <div class="flow">
    <span class="stamp">HACK-MATRIX 2026 // PROCESS</span>
    <div class="lockup">
      <span class="mark">HACK-MATRIX 2026</span><span class="sub">How it works</span>
    </div>

    <h2 class="page-title">Seven steps, start to finish</h2>
    <p class="page-lede">From registration to the closing ceremony.</p>

    <div class="rule-line"></div>

    <div class="steps">
      <div class="step"><span class="n">01</span><span class="x"><b>Register</b> Complete your team registration online.</span></div>
      <div class="step"><span class="n">02</span><span class="x"><b>Check in</b> Arrive early and complete verification.</span></div>
      <div class="step"><span class="n">03</span><span class="x"><b>Problem reveal</b> Statements drop at the bell.</span></div>
      <div class="step"><span class="n">04</span><span class="x"><b>Build</b> Eight hours to make it work.</span></div>
      <div class="step"><span class="n">05</span><span class="x"><b>Submit</b> Repo, demo and docs before the deadline.</span></div>
      <div class="step"><span class="n">06</span><span class="x"><b>Demo</b> Shortlisted teams present to judges.</span></div>
      <div class="step"><span class="n">07</span><span class="x"><b>Results</b> Winners announced at the closing ceremony.</span></div>
    </div>

    <div class="stack">
      <div class="sec"><h3>Ground rules</h3><div class="bar"></div></div>
      <ul class="tick-list">
        <li><b>Originality</b> &mdash; everything is built on event day. Starter code is fine as a foundation, but the core logic must be yours.</li>
        <li><b>AI assistance</b> &mdash; encouraged. You must be able to defend every part of your solution.</li>
        <li><b>Team conduct</b> &mdash; respect other teams, mentors and judges throughout.</li>
      </ul>
    </div>

    <div class="foot"><span>HACK-MATRIX 2026</span><span>04 / 07</span></div>
  </div>
</section>

<!-- ═══════════ PAGE 5 · WHO CAN JOIN / BRING ═══════════ -->`,
  `<!-- ═══════════ PAGE 4 · WHO CAN JOIN / BRING ═══════════ -->`
);

// ── 6. page 5 -> page 4: single column -> two-column split ──────────────────
rep(
  "page 4: split",
  `<section class="page" data-page="5">
  <div class="reticle">
    <span class="bracket tl"></span><span class="bracket tr"></span>
    <span class="bracket bl"></span><span class="bracket br"></span>
  </div>
  <div class="ghostnum">05</div>

  <div class="flow">
    <span class="stamp">HACK-MATRIX 2026 // ELIGIBILITY</span>
    <div class="lockup">
      <span class="mark">HACK-MATRIX 2026</span><span class="sub">Who can join</span>
    </div>

    <h2 class="page-title">Who can join</h2>
    <p class="page-lede">
      Open to any student who wants to build. Interest matters more than the degree
      you are enrolled in.
    </p>

    <div class="rule-line"></div>

    <div class="sec"><h3>Eligible</h3><div class="bar"></div></div>
    <ul class="tick-list">
      <li><b>Engineering students</b> &mdash; all branches, B.E. / B.Tech</li>
      <li><b>Computer Science</b> &mdash; CSE, ISE, AI &amp; DS, ML</li>
      <li><b>AI / ML students</b> &mdash; core and applied programs</li>
      <li><b>Data Science</b> &mdash; analytics, engineering, statistics</li>
      <li><b>Other disciplines</b> &mdash; ECE, EEE, mechanical, civil</li>
      <li><b>Anyone passionate about tech</b> &mdash; interest beats the degree</li>
    </ul>

    <div class="stack">
      <div class="sec"><h3>Bring with you</h3><div class="bar"></div></div>
      <div class="tags">
        <span class="tag">[ LAPTOP ]</span>
        <span class="tag">[ CHARGER ]</span>
        <span class="tag">[ DONGLE ]</span>
        <span class="tag">[ STUDENT ID ]</span>
        <span class="tag">[ GITHUB ]</span>
        <span class="tag">[ TEAM DETAILS ]</span>
      </div>
    </div>

    <div class="stack">
      <div class="sec"><h3>We provide</h3><div class="bar"></div></div>
      <div class="tags">
        <span class="tag">[ SEATS ]</span>
        <span class="tag">[ PLUG POINTS ]</span>
        <span class="tag">[ WI-FI ]</span>
        <span class="tag">[ MENTORS ]</span>
        <span class="tag">[ MEALS ]</span>
        <span class="tag">[ PRINT DESK ]</span>
        <span class="tag">[ CERTIFICATE ]</span>
      </div>
    </div>

    <div class="stack">
      <div class="data vi"><span class="k">Teams</span><span class="v s">Two to four members. Mix disciplines freely &mdash; diverse teams score better.</span></div>
    </div>

    <div class="foot"><span>HACK-MATRIX 2026</span><span>05 / 07</span></div>
  </div>
</section>`,
  `<section class="page" data-page="4">
  <div class="reticle">
    <span class="bracket tl"></span><span class="bracket tr"></span>
    <span class="bracket bl"></span><span class="bracket br"></span>
  </div>
  <div class="ghostnum">04</div>

  <div class="flow">
    <span class="stamp">HACK-MATRIX 2026 // ELIGIBILITY</span>

    <h2 class="page-title">Who can join</h2>
    <p class="page-lede">
      Open to any student who wants to build. Interest matters more than the degree
      you are enrolled in.
    </p>

    <div class="rule-line"></div>

    <div class="split">
      <div>
        <div class="sec"><h3>Eligible</h3><div class="bar"></div></div>
        <ul class="tick-list">
          <li><b>Engineering</b> &mdash; all branches, B.E. / B.Tech</li>
          <li><b>Computer Science</b> &mdash; CSE, ISE, AI &amp; DS, ML</li>
          <li><b>AI / ML</b> &mdash; core and applied programs</li>
          <li><b>Data Science</b> &mdash; analytics, engineering, statistics</li>
          <li><b>Other disciplines</b> &mdash; ECE, EEE, mechanical, civil</li>
          <li><b>Anyone passionate</b> about tech</li>
        </ul>
      </div>

      <div>
        <div class="sec"><h3>Bring</h3><div class="bar"></div></div>
        <span class="tag">[ LAPTOP + CHARGER ]</span>
        <span class="tag">[ DONGLE ]</span>
        <span class="tag">[ STUDENT ID ]</span>
        <span class="tag">[ GITHUB PROFILE ]</span>
        <span class="tag">[ TEAM DETAILS ]</span>

        <div class="stack">
          <div class="sec"><h3>We provide</h3><div class="bar"></div></div>
          <span class="tag">[ SEATS ]</span>
          <span class="tag">[ PLUG POINTS ]</span>
          <span class="tag">[ WI-FI ]</span>
          <span class="tag">[ MENTORS ]</span>
          <span class="tag">[ MEALS ]</span>
          <span class="tag">[ PRINT DESK ]</span>
          <span class="tag">[ CERTIFICATE ]</span>
        </div>
      </div>
    </div>

    <div class="stack">
      <div class="data vi"><span class="k">Teams</span><span class="v s">Two to four members. Mix disciplines freely &mdash; diverse teams score better.</span></div>
    </div>

    <div class="foot"><span>HACK-MATRIX 2026</span><span>04 / 06</span></div>
  </div>
</section>`
);

// ── 7. page 6 -> page 5: vertical rail -> horizontal weight bars ─────────────
rep(
  "page 5: judging bars",
  `<section class="page" data-page="6">
  <div class="reticle">
    <span class="bracket tl"></span><span class="bracket tr"></span>
    <span class="bracket bl"></span><span class="bracket br"></span>
  </div>
  <div class="ghostnum">06</div>

  <div class="flow">
    <span class="stamp">HACK-MATRIX 2026 // PRIZES</span>
    <div class="lockup">
      <span class="mark">HACK-MATRIX 2026</span><span class="sub">Prizes &amp; judging</span>
    </div>

    <h2 class="page-title">Prizes &amp; judging</h2>`,
  `<section class="page" data-page="5">
  <div class="reticle">
    <span class="bracket tl"></span><span class="bracket tr"></span>
    <span class="bracket bl"></span><span class="bracket br"></span>
  </div>
  <div class="ghostnum">05</div>

  <div class="flow">
    <span class="stamp">HACK-MATRIX 2026 // PRIZES</span>

    <h2 class="page-title">Prizes &amp; judging</h2>`
);

rep(
  "page 5: rail -> bars",
  `<div class="rail">
        <div class="rail-item hot"><span class="t">40%</span><span class="l">Innovation &mdash; originality of approach</span></div>
        <div class="rail-item"><span class="t">25%</span><span class="l">Technical depth &mdash; difficulty solved</span></div>
        <div class="rail-item"><span class="t">15%</span><span class="l">Impact &mdash; usefulness to real users</span></div>
        <div class="rail-item"><span class="t">10%</span><span class="l">Usability &mdash; does it work well</span></div>
        <div class="rail-item"><span class="t">10%</span><span class="l">Demo quality &mdash; clarity of pitch</span></div>
      </div>`,
  `<div class="wrow top"><span class="wl">Innovation &mdash; originality of approach</span><span class="wt"><i style="width:100%"></i></span><span class="wp">40%</span></div>
      <div class="wrow"><span class="wl">Technical depth &mdash; difficulty solved</span><span class="wt"><i style="width:62%"></i></span><span class="wp">25%</span></div>
      <div class="wrow"><span class="wl">Impact &mdash; usefulness to real users</span><span class="wt"><i style="width:38%"></i></span><span class="wp">15%</span></div>
      <div class="wrow"><span class="wl">Usability &mdash; does it work well</span><span class="wt"><i style="width:25%"></i></span><span class="wp">10%</span></div>
      <div class="wrow"><span class="wl">Demo quality &mdash; clarity of pitch</span><span class="wt"><i style="width:25%"></i></span><span class="wp">10%</span></div>`
);

rep(
  "page 5: footer",
  `<span>06 / 07</span>`,
  `<span>05 / 06</span>`
);

// ── 8. page 7 -> page 6: merge timeline into one run-of-show ─────────────────
rep(
  "page 6: merge run of show",
  `<section class="page" data-page="7" data-role="back">
  <div class="reticle">
    <span class="bracket tl"></span><span class="bracket tr"></span>
    <span class="bracket bl"></span><span class="bracket br"></span>
  </div>
  <div class="ghostnum">07</div>

  <div class="flow">
    <span class="stamp">HACK-MATRIX 2026 // SCHEDULE</span>
    <div class="lockup">
      <span class="mark">HACK-MATRIX 2026</span><span class="sub">Timeline &amp; register</span>
    </div>

    <h2 class="page-title">Timeline &amp; register</h2>

    <div class="rule-line"></div>

    <div class="sec"><h3>Event day</h3><div class="bar"></div></div>
    <div class="rail">
      <div class="rail-item"><span class="t">09:00</span><span class="l">Check-in &amp; verification</span></div>
      <div class="rail-item hot"><span class="t">09:30</span><span class="l">Problem statement reveal</span></div>
      <div class="rail-item"><span class="t">09:30</span><span class="l">Build sprint begins</span></div>
      <div class="rail-item"><span class="t">16:30</span><span class="l">Submission deadline</span></div>
      <div class="rail-item"><span class="t">17:00</span><span class="l">Demos to the judges</span></div>
      <div class="rail-item hot"><span class="t">18:30</span><span class="l">Results &amp; certificates</span></div>
    </div>
    <p class="note" style="margin-top:1.8mm;">Indicative schedule &mdash; final timings confirmed at registration.</p>

    <div class="stack">
      <div class="sec"><h3>Partners</h3><div class="bar"></div></div>
      <div class="partners">
        <span class="partner">Title</span>
        <span class="partner">Technology</span>
        <span class="partner">AI / Cloud</span>
      </div>
      <p class="note" style="margin-top:1.8mm;">Sponsor a track or a prize &mdash; mail hackmatrix@vvit.edu.in.</p>
    </div>

    <div class="stack">
      <div class="sec"><h3>Register now</h3><div class="bar"></div></div>
      <div class="clip">
        <div class="qr-row">
          <span class="qr-swatch"><img src="__QR_DATA_URI__" alt="QR code linking to hack-matrix-lac.vercel.app" /></span>
          <span class="qr-cap">
            <span class="qk">Scan to register</span>
            <span class="qu">hack-matrix-lac.vercel.app</span>
            <p>Registration, rules, schedule and results on one page.</p>
          </span>
        </div>
      </div>
    </div>

    <div class="stack">
      <div class="sec"><h3>Contact</h3><div class="bar"></div></div>
      <div class="data"><span class="k">Website</span><span class="v">hack-matrix-lac.vercel.app</span></div>
      <div class="data"><span class="k">Email</span><span class="v">hackmatrix@vvit.edu.in</span></div>
      <div class="data"><span class="k">Instagram</span><span class="v">@vvithackmatrix</span></div>
      <div class="data"><span class="k">LinkedIn</span><span class="v">vvit-bengaluru</span></div>
    </div>

    <div class="foot"><span>Vijaya Vittala Institute of Technology</span><span>07 / 07</span></div>
  </div>
</section>`,
  `<section class="page" data-page="6" data-role="back">
  <div class="reticle">
    <span class="bracket tl"></span><span class="bracket tr"></span>
    <span class="bracket bl"></span><span class="bracket br"></span>
  </div>
  <div class="ghostnum">06</div>

  <div class="flow">
    <span class="stamp">HACK-MATRIX 2026 // RUN OF SHOW</span>

    <h2 class="page-title">One day, start to finish</h2>

    <div class="rule-line"></div>

    <div class="sec"><h3>Run of show</h3><div class="bar"></div></div>
    <div class="sched">
      <div class="sched-item pre"><span class="t">PRE</span><span class="l"><b>Register</b> Complete your team registration online.</span></div>
      <div class="sched-item"><span class="t">09:00</span><span class="l"><b>Check in</b> Arrive early and complete verification.</span></div>
      <div class="sched-item hot"><span class="t">09:30</span><span class="l"><b>Problem reveal</b> Statements drop at the bell.</span></div>
      <div class="sched-item"><span class="t">09:30</span><span class="l"><b>Build</b> Eight hours to make it work.</span></div>
      <div class="sched-item"><span class="t">16:30</span><span class="l"><b>Submit</b> Repo, demo and docs before the deadline.</span></div>
      <div class="sched-item"><span class="t">17:00</span><span class="l"><b>Demo</b> Shortlisted teams present to judges.</span></div>
      <div class="sched-item hot"><span class="t">18:30</span><span class="l"><b>Results</b> Winners and certificates announced.</span></div>
    </div>
    <p class="note" style="margin-top:1.8mm;">Indicative schedule &mdash; final timings confirmed at registration.</p>

    <div class="stack">
      <div class="sec"><h3>Ground rules</h3><div class="bar"></div></div>
      <ul class="tick-list">
        <li><b>Originality</b> &mdash; starter code is fine as a foundation, the core logic must be yours.</li>
        <li><b>AI assistance</b> &mdash; encouraged, but you must defend every part.</li>
      </ul>
    </div>

    <div class="stack">
      <div class="sec"><h3>Register now</h3><div class="bar"></div></div>
      <div class="clip">
        <div class="qr-row">
          <span class="qr-swatch"><img src="__QR_DATA_URI__" alt="QR code linking to hack-matrix-lac.vercel.app" /></span>
          <span class="qr-cap">
            <span class="qk">Scan to register</span>
            <span class="qu">hack-matrix-lac.vercel.app</span>
            <p>Registration, rules, schedule and results on one page.</p>
          </span>
        </div>
      </div>
    </div>

    <div class="stack">
      <div class="sec"><h3>Contact &amp; partners</h3><div class="bar"></div></div>
      <div class="data"><span class="k">Email</span><span class="v">hackmatrix@vvit.edu.in</span></div>
      <div class="data gr"><span class="k">Social</span><span class="v s">@vvithackmatrix &middot; vvit-bengaluru</span></div>
      <div class="partners" style="margin-top:2mm;">
        <span class="partner">Title</span>
        <span class="partner">Technology</span>
        <span class="partner">AI / Cloud</span>
      </div>
    </div>

    <div class="foot"><span>Vijaya Vittala Institute of Technology</span><span>06 / 06</span></div>
  </div>
</section>`
);

// ── 9. remaining stale footers ──────────────────────────────────────────────
rep("page 2 footer", `<span>02 / 07</span>`, `<span>02 / 06</span>`);
rep("page 3 footer", `<span>03 / 07</span>`, `<span>03 / 06</span>`);

// ── verify then write ───────────────────────────────────────────────────────
const original = readFileSync(TARGET, "utf8");

const problems = [];
for (const { name, from } of REPLACEMENTS) {
  const count = original.split(from).length - 1;
  if (count !== 1) problems.push(`${name}: matched ${count}x (expected exactly 1)`);
}
if (problems.length) {
  console.error("ABORT - template left untouched:");
  for (const p of problems) console.error("  FAIL " + p);
  process.exit(1);
}

let out = original;
for (const { name, from, to } of REPLACEMENTS) {
  out = out.replace(from, () => to);
  console.log(`  ok  ${name}`);
}

// post-write structural assertions
const count = (re) => (out.match(re) || []).length;
const checks = [
  // NB: the cover is `<section class="page cover">`, so match the class attribute
  // prefix rather than `<section class="page"` which would skip the cover.
  ["6 page sections", count(/<section class="page\b/g) === 6],
  ["1 logo image", count(/__LOGO_DATA_URI__/g) === 1],
  ["1 QR image", count(/__QR_DATA_URI__/g) === 1],
  ["0 duplicate lockups", count(/class="lockup"/g) === 0],
  ["0 stale / 07 footers", count(/\/ 07/g) === 0],
  ["0 old URL", count(/hack-matrix\.vercel\.app/g) === 0],
  ["grid3 present", count(/class="grid3"/g) === 1],
  ["split present", count(/class="split"/g) === 1],
  ["sched present", count(/class="sched"/g) === 1],
  ["quote present", count(/class="quote"/g) === 1],
  ["5 judging bars", count(/class="wrow/g) === 5],
];
const failed = checks.filter(([, ok]) => !ok);
if (failed.length) {
  console.error("ABORT - structural check failed, nothing written:");
  for (const [n] of failed) console.error("  FAIL " + n);
  process.exit(1);
}

writeFileSync(TARGET, out, "utf8");
console.log(`\nWROTE ${TARGET}`);
console.log(`  ${original.length} -> ${out.length} bytes`);
for (const [n] of checks) console.log(`  OK  ${n}`);