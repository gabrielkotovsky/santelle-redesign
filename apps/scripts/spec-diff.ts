// Compares the implemented English card copy in cards.ts against the v3 spec
// markdown, variant by variant. Reports any textual difference.
// Run with: esbuild bundle + node (see verify-diagnostics workflow).

import * as fs from 'fs';
import { CARDS, MODIFIER_TEXTS } from '../src/features/diagnostics/cards';
import type { CardVariantId } from '../src/features/diagnostics/types';

const SPEC_PATH = '/Users/axelsabbag/Downloads/santelle_master_diagnostic_logic_v3.md';
const spec = fs.readFileSync(SPEC_PATH, 'utf8');

function normalize(s: string): string {
  return s
    .replace(/[’‘]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/\*/g, '') // markdown emphasis (probiotic strain italics)
    .replace(/\s+/g, ' ')
    .replace(/\u00a0/g, ' ')
    .trim();
}

type SpecVariant = {
  id: string;
  title?: string;
  summary?: string;
  path?: string;
  bullets: string[];
  bulletsSymptomatic?: string[];
  bulletsAsymptomatic?: string[];
};

function parseSpec(md: string): Map<string, SpecVariant> {
  const out = new Map<string, SpecVariant>();
  const lines = md.split('\n');
  let current: SpecVariant | null = null;
  let bulletTarget: 'bullets' | 'bulletsSymptomatic' | 'bulletsAsymptomatic' = 'bullets';

  for (const line of lines) {
    const variantMatch = line.match(/^### Variant ([A-Z0-9-]+)(\s|$)/);
    if (variantMatch) {
      current = { id: variantMatch[1], bullets: [] };
      bulletTarget = 'bullets';
      out.set(current.id, current);
      continue;
    }
    if (!current) continue;
    if (line.startsWith('## ') || line.startsWith('# ')) {
      current = null;
      continue;
    }

    const title = line.match(/^- \*\*Title:\*\*\s*(.+)$/);
    if (title) { current.title = title[1]; continue; }
    const summary = line.match(/^- \*\*Summary:\*\*\s*(.+)$/);
    if (summary) { current.summary = summary[1]; continue; }
    const path = line.match(/^- \*\*Path:\*\*\s*(.+)$/);
    if (path) { current.path = path[1]; continue; }

    if (/^- \*\*Bullets \(if symptoms present\):\*\*/.test(line)) {
      bulletTarget = 'bulletsSymptomatic';
      current.bulletsSymptomatic = [];
      continue;
    }
    if (/^- \*\*Bullets \(if no symptoms\):\*\*/.test(line)) {
      bulletTarget = 'bulletsAsymptomatic';
      current.bulletsAsymptomatic = [];
      continue;
    }
    if (/^- \*\*Bullets:\*\*/.test(line)) {
      bulletTarget = 'bullets';
      continue;
    }

    const bullet = line.match(/^\s+- (.+)$/);
    if (bullet) {
      if (bulletTarget === 'bullets') current.bullets.push(bullet[1]);
      else (current[bulletTarget] ||= []).push(bullet[1]);
    }
  }
  return out;
}

const specVariants = parseSpec(spec);
let issues = 0;
let checked = 0;

function compare(id: string, field: string, specText: string | undefined, implText: string | undefined) {
  if (specText === undefined) return;
  checked++;
  if (normalize(specText) !== normalize(implText ?? '')) {
    issues++;
    console.log(`DIFF ${id} :: ${field}`);
    console.log(`  spec: ${normalize(specText)}`);
    console.log(`  impl: ${normalize(implText ?? '(missing)')}`);
  }
}

for (const [id, sv] of specVariants) {
  const impl = CARDS[id as CardVariantId];
  if (!impl) {
    issues++;
    console.log(`MISSING VARIANT in implementation: ${id}`);
    continue;
  }
  compare(id, 'title', sv.title, impl.en.title);
  compare(id, 'summary', sv.summary, impl.en.summary);
  compare(id, 'path', sv.path, impl.en.path);

  const specBullets = sv.bulletsSymptomatic ?? sv.bullets;
  const implBullets = impl.en.bullets;
  if (specBullets.length !== implBullets.length) {
    issues++;
    console.log(`DIFF ${id} :: bullets count spec=${specBullets.length} impl=${implBullets.length}`);
  }
  specBullets.forEach((b, i) => compare(id, `bullet[${i}]`, b, implBullets[i]));

  if (sv.bulletsAsymptomatic) {
    const implA = impl.en.bulletsAsymptomatic ?? [];
    if (sv.bulletsAsymptomatic.length !== implA.length) {
      issues++;
      console.log(`DIFF ${id} :: asymptomatic bullets count spec=${sv.bulletsAsymptomatic.length} impl=${implA.length}`);
    }
    sv.bulletsAsymptomatic.forEach((b, i) => compare(id, `asym bullet[${i}]`, b, implA[i]));
  }
}

// Check every implemented variant exists in the spec.
for (const id of Object.keys(CARDS)) {
  if (!specVariants.has(id)) {
    issues++;
    console.log(`EXTRA VARIANT in implementation (not in spec): ${id}`);
  }
}

// --- Section D modifier texts ---
const modifierSpec: Array<{ id: keyof typeof MODIFIER_TEXTS; specText: string }> = [
  { id: 'Q5-ANTIBIOTICS', specText: 'Recent antibiotics often disrupt healthy bacteria — yeast or imbalance is common after antibiotic use.' },
  { id: 'Q5-SWIMSUIT', specText: 'Damp, warm conditions favour yeast and other bacteria.' },
  { id: 'Q5-UNPROTECTED-SEX', specText: 'New, multiple, or non-monogamous partners increase the risk of sexually transmitted infection. STD screening is recommended.' },
  { id: 'Q5-HYGIENE', specText: 'These products often disrupt the natural vaginal balance — pausing them is the first step.' },
  { id: 'Q5-TRAVEL', specText: 'Travel and routine changes often trigger temporary imbalance.' },
  { id: 'Q5-RECURRENT', specText: 'Recurrent symptoms often need a doctor\u2019s evaluation — a longer or alternative treatment may be required.' },
  { id: 'Q6-AFTER-PERIOD', specText: 'Test results just after period can be less reliable — retest in a week if results are borderline.' },
  { id: 'Q6-BEFORE-PERIOD', specText: 'Hormonal changes before your period can shift discharge — retest after your period if results are unclear.' },
  { id: 'Q2-PERSISTENT-4-7', specText: 'Symptoms persisting for several days warrant closer monitoring.' },
  { id: 'Q2-PERSISTENT-WEEK', specText: 'Symptoms lasting more than a week should be evaluated by a clinician.' },
  { id: 'Q7-PREGNANT', specText: "You're pregnant — discuss any treatment with your obstetrician or midwife before starting it." },
  { id: 'Q7-NOT-SURE', specText: "If there's a chance you may be pregnant, take a pregnancy test before starting any treatment." },
  { id: 'F5-SPOTTING', specText: 'Spotting around your period is common; if it persists, consult.' },
  { id: 'F13-RECURRENCE-TRACKING', specText: 'Worth tracking with regular testing if recurrence continues.' },
];

for (const m of modifierSpec) {
  compare(`MODIFIER ${m.id}`, 'text', m.specText, MODIFIER_TEXTS[m.id].en);
}

console.log(`\nChecked ${checked} text fields across ${specVariants.size} spec variants.`);
if (issues === 0) {
  console.log('NO DIFFERENCES — implementation copy matches the spec.');
} else {
  console.log(`${issues} difference(s) found (review above; some may be intentional).`);
}
