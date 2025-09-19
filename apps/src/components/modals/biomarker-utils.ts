// src/components/modals/biomarker-utils.ts
const RUSH  = '#721422';
const GREEN = '#4CAF50';
const AMBER = '#FF9800';
const RED   = '#F44336';
const GREY  = '#9E9E9E';

const norm = (s?: string | null) => (s ?? '').replace('−', '-').trim();

const disclaimer =
  '\n\n---\n\n⚠️ This info is a general interpretation from the kit instructions and is not medical advice. For medical guidance, consult a clinician.';

export function getPHStatus(pH?: number | null) {
  if (typeof pH !== 'number') return { color: GREY, tag: 'Unknown' };
  if (pH >= 3.8 && pH <= 4.4) return { color: GREEN, tag: 'Healthy' };
  if (pH >= 4.6) return { color: RED, tag: 'High' };
  return { color: GREY, tag: 'Outside Range' };
}

export function getPHDetail(pH?: number | null) {
  if (typeof pH !== 'number') return;
  if (pH >= 3.8 && pH <= 4.4) {
    return `**Perfect**
Your vagina's healthy "sour zone" (like mild vinegar). It's nature's way to block bad germs and protect good bacteria.${disclaimer}`;
  }
  if (pH === 4.6) {
    return `**Mildly High**
Common causes: Sex fluids, period ending, normal body changes, or douching. Your body can often fix this!
Slight risk: Germs grow easier. Watch for: Odor, unusual discharge, itch.${disclaimer}`;
  }
  if (pH === 4.8) {
    return `**Moderately High**
Frequent cause: Bacterial Vaginosis (BV). Other: STIs (like Trich), douching, hormone changes.${disclaimer}`;
  }
  if (pH === 5.4) {
    return `**Much Higher**
Typically indicates: Active BV or Trich. (Less common: Low hormones after menopause).${disclaimer}`;
  }
}

export function getBiomarkerStatus(
  rawValue: string,
  biomarker: 'H₂O₂' | 'LE' | 'SNA' | 'β-G' | 'NAG',
  pH?: number | null
) {
  const value = norm(rawValue);

  switch (biomarker) {
    case 'H₂O₂':
      if (value === '-') return { color: GREEN, tag: 'Good protective flora' };
      if (value === '±') return { color: AMBER, tag: 'Borderline protection' };
      if (value === '+') return { color: RED, tag: 'Low protective flora' };
      return { color: GREY, tag: 'Unknown' };

    case 'LE':
      if (value === '-' || value === '±') return { color: GREEN, tag: 'Low inflammation' };
      if (value === '+' || value === '++' || value === '+++') return { color: RED, tag: 'Inflammation present' };
      return { color: GREY, tag: 'Unknown' };

    case 'SNA':
      if (value === '-') return { color: GREEN, tag: 'Negative' };
      if (value === '±') return { color: AMBER, tag: 'Borderline' };
      if (value === '+') return { color: RED, tag: 'Positive' };
      return { color: GREY, tag: 'Unknown' };

    case 'β-G':
      if (value === '-') return { color: GREEN, tag: 'Negative' };
      if (value === '±') return { color: AMBER, tag: 'Borderline' };
      if (value === '+') return { color: RED, tag: 'Positive' };
      return { color: GREY, tag: 'Unknown' };

    case 'NAG':
      if (value === '-') return { color: GREEN, tag: 'Negative' };
      if (value === '±') return { color: AMBER, tag: 'Borderline' };
      if (value === '+') {
        if (typeof pH === 'number') {
          if (pH >= 4.8) return { color: RED, tag: 'Positive (Trich more likely with high pH)' };
          if (pH <= 4.6) return { color: RED, tag: 'Positive (Yeast more likely with low pH)' };
        }
        return { color: RED, tag: 'Positive' };
      }
      return { color: GREY, tag: 'Unknown' };
  }
}

function h2o2Detail(value?: string) {
  const v = norm(value);
  if (v === '-') return `**Negative** 
This is a GOOD result. It means you have plenty of good bacteria (lactobacilli) working to protect your vagina. These good bacteria naturally make hydrogen peroxide (H₂O₂), which acts like a cleaning agent. It helps protect against germs and prevent infections.${disclaimer}`;
  if (v === '±') return `**Moderate**
This means you have some good bacteria making small amounts of cleaning agents (H₂O₂), but not enough for full protection. Your vagina might need extra care to stay balanced and avoid infections.${disclaimer}`;
  if (v === '+') return `**Positive**
This means your vagina lacks enough good bacteria that naturally fight germs. Without enough of these protectors, your vagina becomes less protected. This makes you more likely to get infections like BV (bacterial vaginosis). Having plenty of these good bacteria lowers your BV risk.${disclaimer}`;
}

function leDetail(value?: string, others?: Array<{ name: string; value: string }>) {
  const v = norm(value);
  if (v === '-' || v === '±') {
    return `**Normal**
YOU ARE GOOD!.${disclaimer}`;
  }
  if (v === '+' || v === '++' || v === '+++') {
    const rest = (others ?? []).filter(b => b.name !== 'LE' && b.name !== 'pH');
    const allRestNonPos = rest.every(b => {
      const vv = norm(b.value);
      return vv === '-' || vv === '±';
    });
    if (allRestNonPos) {
      return `**Positive LE with all other tests negative**
Since all your other tests are negative, this inflammation could mean:
* A very early infection where germ levels are too low for other tests to detect yet (LE reacts first).
* Non-infection irritation (from soaps, douching products, lubricants, condoms).
* Hormonal changes like menopause or breastfeeding.
* Friction (from sex or tampons).
* Or other untreated issues like STIs (chlamydia/gonorrhea, not covered here) or general bacterial overgrowth (not BV/AV).

**What to do next for your isolated inflammation result?**
* Track symptoms like unusual discharge, itching/burning, or pain/odor.
* Avoid irritants like smelly soaps or douches.
* Consider regular at-home checks to see how your inflammation changes over time.${disclaimer}`;
    }
    return `**Positive LE with other positive tests**
Your inflammation strongly confirms you need treatment for the detected infection(s). LE acts like a "warning light" that something is wrong, and combined with your other positive results, this confirms the diagnosis.

**What to do next for your confirmed infection result?**
* Follow the specific guidance for your detected infection(s).
* Track symptoms and avoid irritants.
* Consider retesting after treatment to confirm resolution.${disclaimer}`;
  }
}

function snaDetail(value?: string) {
  const v = norm(value);
  if (v === '-') {
    return `**Negative**
YOU ARE GOOD!${disclaimer}`;
  } else if (v === '±') {
    return `**Possible BV**
Means your test was borderline—not clearly normal but not definitely BV. This can happen because:
* You might be in the **early or healing stages of BV**, during which bacterial levels are changing.
* Your vaginal bacteria are in a **mixed state** (some good, some bad).
* **Recent activities** like sex, douching, or your menstrual cycle temporarily affected the result.${disclaimer}`;
  } else if (v === '+') {
    return `**Positive**
Strongly means you have BV (bacterial vaginosis), as the test detects specific chemicals produced by BV-causing bacteria like Gardnerella and Prevotella.

**What to do next for your possible BV result?**
* Watch for fishy odor or thin gray discharge — these suggest BV.
* Note new discomfort during/after sex or periods.
* Avoid douching — it harms vagina's natural protection.
* Wait a week after antibiotics or your period ends.
* Retest between periods for best results.
* Avoid sex and lubricants for 2 days before retesting.${disclaimer}`;
  }
}

function betaGDetail(value?: string) {
  const v = norm(value);
  if (v === '-') return `**Negative**
YOU ARE GOOD!${disclaimer}`;
  if (v === '±') return `**Possible AV**
Means that the test detected borderline elevated levels of chemical signs produced by aerobic bacteria (AV)—above normal but not clearly positive. This outcome may occur during early infection, recovery, or due to sample collection issues, recent antibiotic use, or timing related to your period.${disclaimer}`;
  if (v === '+') return `**Positive**
Means Aerobic Vaginitis (AV), an infection caused by harmful bacteria. While AV and Bacterial Vaginosis (BV) both cause itching/burning and may occur together, AV usually shows yellow discharge with vaginal redness/swelling, whereas BV features thin gray-white discharge with fishy odor but no redness/swelling. Importantly, some women—especially during pregnancy—have no AV symptoms; early testing is vital since untreated AV may cause early birth.${disclaimer}`;
}

function nagDetail(value?: string, pH?: number | null) {
  const v = norm(value);
  if (v === '-') return `**Negative**
YOU ARE GOOD!${disclaimer}`;
  if (v === '±') return `**Possible Trich or Yeast**
Means your test shows borderline infection signs—not weak enough to be negative but not strong enough for a clear positive—with your vagina's sourness (acidity) in the middle zone. This could mean a very mild infection starting or healing. Sometimes sex fluids, or recent douching affect the test; normal events like your period, recent sex, or using sprays/lubes can also change sourness (acidity) temporarily—watch for changes but don't worry yet.

**What to do next for your "possible trich or yeast" result?**
Retest in 5–7 days—avoid sex, douches, or vaginal creams for 24 hours beforehand, and wait until at least 3 days after your period ends.${disclaimer}`;
  if (v === '+') {
    if (typeof pH === 'number') {
      if (pH >= 4.8) {
        return `**Positive NAG with pH ${pH}**
Based on your pH of ${pH} (≥ 4.8), this is more likely to be **trichomoniasis**.

**What to do next for your trichomoniasis result?**
Retest in 5–7 days—avoid sex, douches, or vaginal creams for 24 hours beforehand, and wait until at least 3 days after your period ends.${disclaimer}`;
      }
      if (pH <= 4.6) {
        return `**Positive NAG with pH ${pH}**
Based on your pH of ${pH} (≤ 4.6), this is more likely to be a **yeast infection**.

**What to do next for your yeast infection result?**
Retest in 5–7 days—avoid sex, douches, or vaginal creams for 24 hours beforehand, and wait until at least 3 days after your period ends.${disclaimer}`;
      }
    }
    return `**Positive**
**(NAG) is a marker both trich and yeast share, so it can't tell them apart alone—but combined with your vaginal pH, it helps figure out whether you have trich or a yeast infection:**
* Positive ("+") and pH is high (4.8 or above) → more likely to be **trich**. (Trich makes your pH higher).
* Positive ("+") and pH is low (4.6 or below) → more likely to be a **yeast infection**.

**What to do next for your "possible trich or yeast" result?**
Retest in 5–7 days—avoid sex, douches, or vaginal creams for 24 hours beforehand, and wait until at least 3 days after your period ends.${disclaimer}`;
  }
}

export function getBiomarkerDescription(
  biomarker: 'pH' | 'H₂O₂' | 'LE' | 'SNA' | 'β-G' | 'NAG',
  value?: string,
  all?: Array<{ name: string; value: string }>
) {
  if (biomarker === 'pH') return getPHDetail(Number(value));
  if (biomarker === 'H₂O₂') return h2o2Detail(value);
  if (biomarker === 'LE') return leDetail(value, all);
  if (biomarker === 'SNA') return snaDetail(value);
  if (biomarker === 'β-G') return betaGDetail(value);
  if (biomarker === 'NAG') {
    const pH = Number(all?.find(b => b.name === 'pH')?.value);
    return nagDetail(value, Number.isFinite(pH) ? pH : undefined);
  }
  return 'Biomarker';
}