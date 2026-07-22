// src/components/modals/biomarker-utils.ts
// Localized terminology follows the approved Santelle user manuals.

export type BiomarkerLang = 'en' | 'fr' | 'de';

const RUSH  = '#721422';
const GREEN = '#4CAF50';
const AMBER = '#FF9800';
const RED   = '#F44336';
const GREY  = '#9E9E9E';

const norm = (s?: string | null) => (s ?? '').replace('−', '-').trim();

const USER_MANUAL_URL_EN = 'https://kvagkkkyashwuvbkegvo.supabase.co/storage/v1/object/public/manufacturer/SantelleUserManualEnglish.pdf?download=SantelleUserManualEnglish.pdf';
const USER_MANUAL_URL_FR = 'https://kvagkkkyashwuvbkegvo.supabase.co/storage/v1/object/public/manufacturer/SantelleUserManualFrench.pdf?download=SantelleUserManualFrench.pdf';
const USER_MANUAL_URL_DE = 'https://kvagkkkyashwuvbkegvo.supabase.co/storage/v1/object/public/manufacturer/SantelleUserManualGerman.pdf?download=SantelleUserManualGerman.pdf';

function getDisclaimer(lang: BiomarkerLang): string {
  if (lang === 'de') {
    return `\n\n---\n\n⚠️ Diese Informationen sind eine allgemeine Interpretation der Gebrauchsanweisung des Kits und stellen keine medizinische Beratung dar. Für eine medizinische Beratung wenden Sie sich bitte an medizinisches Fachpersonal.\n\n📖 [Vollständige Gebrauchsanweisung ansehen](${USER_MANUAL_URL_DE})`;
  }
  if (lang === 'fr') {
    return `\n\n---\n\n⚠️ Ces informations sont une interprétation générale des instructions du kit et ne constituent pas un avis médical. Pour un avis médical, consultez un professionnel de santé.\n\n📖 [Voir le guide utilisateur complet](${USER_MANUAL_URL_FR})`;
  }
  return `\n\n---\n\n⚠️ This info is a general interpretation from the kit instructions and is not medical advice. For medical guidance, consult a clinician.\n\n📖 [View Full User Guide](${USER_MANUAL_URL_EN})`;
}

export function getPHStatus(pH?: number | null, lang: BiomarkerLang = 'en') {
  if (typeof pH !== 'number') return { color: GREY, tag: lang === 'de' ? 'Unbekannt' : lang === 'fr' ? 'Inconnu' : 'Unknown' };
  if (pH >= 3.8 && pH <= 4.4) return { color: GREEN, tag: lang === 'de' ? 'Gesund' : lang === 'fr' ? 'Sain' : 'Healthy' };
  if (pH >= 4.6) return { color: RED, tag: lang === 'de' ? 'Erhöht' : lang === 'fr' ? 'Élevé' : 'High' };
  return { color: GREY, tag: lang === 'de' ? 'Außerhalb des Bereichs' : lang === 'fr' ? 'Hors plage' : 'Outside Range' };
}

export function getPHDetail(pH?: number | null, lang: BiomarkerLang = 'en') {
  const disclaimer = getDisclaimer(lang);
  if (typeof pH !== 'number') return;
  if (pH >= 3.8 && pH <= 4.4) {
    if (lang === 'de') {
      return `**Perfekt**
Die gesunde „Säurezone“ der Vagina (ähnlich wie milder Essig). Sie schützt auf natürliche Weise vor schädlichen Keimen und erhält die guten Bakterien.${disclaimer}`;
    }
    if (lang === 'fr') {
      return `**Parfait**
La zone acide saine de votre vagin (comme le vinaigre doux). C'est la façon naturelle de bloquer les mauvais germes et de protéger les bonnes bactéries.${disclaimer}`;
    }
    return `**Perfect**
Your vagina's healthy "sour zone" (like mild vinegar). It's nature's way to block bad germs and protect good bacteria.${disclaimer}`;
  }
  if (pH === 4.6) {
    if (lang === 'de') {
      return `**Leicht erhöht**
Häufige Ursachen: Sperma, Ende der Menstruation, normale Körperveränderungen oder Vaginalduschen. Der Körper kann dies oft selbst ausgleichen.
Leichtes Risiko: Keime wachsen leichter. Achten Sie auf Geruch, ungewöhnlichen Ausfluss und Juckreiz.${disclaimer}`;
    }
    if (lang === 'fr') {
      return `**Légèrement élevé**
Causes fréquentes : fluides sexuels, fin des règles, changements corporels normaux ou douches vaginales. Votre corps peut souvent corriger cela !
Risque léger : les germes se développent plus facilement. Surveillez : odeur, pertes inhabituelles, démangeaisons.${disclaimer}`;
    }
    return `**Mildly High**
Common causes: Sex fluids, period ending, normal body changes, or douching. Your body can often fix this!
Slight risk: Germs grow easier. Watch for: Odor, unusual discharge, itch.${disclaimer}`;
  }
  if (pH === 4.8) {
    if (lang === 'de') {
      return `**Mäßig erhöht**
Häufige Ursache: bakterielle Vaginose (BV). Weitere mögliche Ursachen: sexuell übertragbare Infektionen wie Trichomoniasis, Vaginalduschen oder hormonelle Veränderungen.${disclaimer}`;
    }
    if (lang === 'fr') {
      return `**Modérément élevé**
Cause fréquente : vaginose bactérienne (VB). Autres : IST (comme la trichomonase), douches vaginales, changements hormonaux.${disclaimer}`;
    }
    return `**Moderately High**
Frequent cause: Bacterial Vaginosis (BV). Other: STIs (like Trich), douching, hormone changes.${disclaimer}`;
  }
  if (pH === 5.4) {
    if (lang === 'de') {
      return `**Deutlich erhöht**
Weist typischerweise auf aktive BV oder Trichomoniasis hin. Seltener können niedrige Hormonwerte nach der Menopause die Ursache sein.${disclaimer}`;
    }
    if (lang === 'fr') {
      return `**Beaucoup plus élevé**
Indique généralement : VB ou trichomonase active. (Moins fréquent : baisse des hormones après la ménopause).${disclaimer}`;
    }
    return `**Much Higher**
Typically indicates: Active BV or Trich. (Less common: Low hormones after menopause).${disclaimer}`;
  }
}

export function getBiomarkerStatus(
  rawValue: string,
  biomarker: 'H₂O₂' | 'LE' | 'SNA' | 'β-G' | 'NAG',
  pH?: number | null,
  lang: BiomarkerLang = 'en'
) {
  const value = norm(rawValue);
  const unk = lang === 'de' ? 'Unbekannt' : lang === 'fr' ? 'Inconnu' : 'Unknown';

  switch (biomarker) {
    case 'H₂O₂':
      if (value === '-') return { color: GREEN, tag: lang === 'de' ? 'Viele gute Bakterien' : lang === 'fr' ? 'Bonne flore protectrice' : 'Good protective flora' };
      if (value === '±') return { color: AMBER, tag: lang === 'de' ? 'Mäßige Menge guter Bakterien' : lang === 'fr' ? 'Protection limite' : 'Borderline protection' };
      if (value === '+') return { color: RED, tag: lang === 'de' ? 'Geringe Menge guter Bakterien' : lang === 'fr' ? 'Faible flore protectrice' : 'Low protective flora' };
      return { color: GREY, tag: unk };

    case 'LE':
      if (value === '-' || value === '±') return { color: GREEN, tag: lang === 'de' ? 'Keine Entzündungszeichen' : lang === 'fr' ? 'Faible inflammation' : 'Low inflammation' };
      if (value === '+' || value === '++' || value === '+++') return { color: RED, tag: lang === 'de' ? 'Entzündung nachgewiesen' : lang === 'fr' ? 'Inflammation présente' : 'Inflammation present' };
      return { color: GREY, tag: unk };

    case 'SNA':
      if (value === '-') return { color: GREEN, tag: lang === 'de' ? 'Negativ' : lang === 'fr' ? 'Négatif' : 'Negative' };
      if (value === '±') return { color: AMBER, tag: lang === 'de' ? 'Grenzwertig' : lang === 'fr' ? 'Limite' : 'Borderline' };
      if (value === '+') return { color: RED, tag: lang === 'de' ? 'Positiv' : lang === 'fr' ? 'Positif' : 'Positive' };
      return { color: GREY, tag: unk };

    case 'β-G':
      if (value === '-') return { color: GREEN, tag: lang === 'de' ? 'Negativ' : lang === 'fr' ? 'Négatif' : 'Negative' };
      if (value === '±') return { color: AMBER, tag: lang === 'de' ? 'Grenzwertig' : lang === 'fr' ? 'Limite' : 'Borderline' };
      if (value === '+') return { color: RED, tag: lang === 'de' ? 'Positiv' : lang === 'fr' ? 'Positif' : 'Positive' };
      return { color: GREY, tag: unk };

    case 'NAG':
      if (value === '-') return { color: GREEN, tag: lang === 'de' ? 'Negativ' : lang === 'fr' ? 'Négatif' : 'Negative' };
      if (value === '±') return { color: AMBER, tag: lang === 'de' ? 'Grenzwertig' : lang === 'fr' ? 'Limite' : 'Borderline' };
      if (value === '+') {
        if (typeof pH === 'number') {
          if (pH >= 4.8) return { color: RED, tag: lang === 'de' ? 'Positiv (Trich bei hohem pH wahrscheinlicher)' : lang === 'fr' ? 'Positif (trichomonase plus probable avec pH élevé)' : 'Positive (Trich more likely with high pH)' };
          if (pH <= 4.6) return { color: RED, tag: lang === 'de' ? 'Positiv (Hefepilz bei niedrigem pH wahrscheinlicher)' : lang === 'fr' ? 'Positif (mycose plus probable avec pH bas)' : 'Positive (Yeast more likely with low pH)' };
        }
        return { color: RED, tag: lang === 'de' ? 'Positiv' : lang === 'fr' ? 'Positif' : 'Positive' };
      }
      return { color: GREY, tag: unk };
  }
}

function h2o2Detail(value?: string, lang: BiomarkerLang = 'en') {
  const v = norm(value);
  const disclaimer = getDisclaimer(lang);
  if (v === '-') {
    if (lang === 'de') {
      return `**Negativ**
Das ist ein GUTES Ergebnis. Es bedeutet, dass viele gute Bakterien (Laktobazillen) vorhanden sind, die Ihre Vagina schützen. Diese Bakterien produzieren natürlich Wasserstoffperoxid (H₂O₂), das wie ein Reinigungsmittel wirkt, vor Keimen schützt und Infektionen vorbeugt.${disclaimer}`;
    }
    if (lang === 'fr') {
      return `**Négatif**
C'est un BON résultat. Vous avez suffisamment de bonnes bactéries (lactobacilles) qui protègent votre vagin. Ces bonnes bactéries produisent naturellement du peroxyde d'hydrogène (H₂O₂), qui agit comme un agent nettoyant. Cela aide à protéger contre les germes et à prévenir les infections.${disclaimer}`;
    }
    return `**Negative** 
This is a GOOD result. It means you have plenty of good bacteria (lactobacilli) working to protect your vagina. These good bacteria naturally make hydrogen peroxide (H₂O₂), which acts like a cleaning agent. It helps protect against germs and prevent infections.${disclaimer}`;
  }
  if (v === '±') {
    if (lang === 'de') {
      return `**Moderat**
Einige gute Bakterien produzieren kleine Mengen Wasserstoffperoxid (H₂O₂), aber nicht genug für vollen Schutz. Ihre Vagina benötigt möglicherweise zusätzliche Pflege, um im Gleichgewicht zu bleiben und Infektionen zu vermeiden.${disclaimer}`;
    }
    if (lang === 'fr') {
      return `**Modéré**
Vous avez quelques bonnes bactéries qui produisent de petites quantités d'agents nettoyants (H₂O₂), mais pas assez pour une protection complète. Votre vagin pourrait avoir besoin de soins supplémentaires pour rester équilibré et éviter les infections.${disclaimer}`;
    }
    return `**Moderate**
This means you have some good bacteria making small amounts of cleaning agents (H₂O₂), but not enough for full protection. Your vagina might need extra care to stay balanced and avoid infections.${disclaimer}`;
  }
  if (v === '+') {
    if (lang === 'de') {
      return `**Positiv**
Es sind nicht genügend gute Bakterien vorhanden, um Keime natürlich zu bekämpfen. Ohne diese Schutzbakterien ist die Vagina weniger geschützt, wodurch das Risiko für Infektionen wie bakterielle Vaginose (BV) steigt.${disclaimer}`;
    }
    if (lang === 'fr') {
      return `**Positif**
Votre vagin manque de bonnes bactéries qui luttent naturellement contre les germes. Sans assez de ces protecteurs, votre vagin est moins protégé. Vous êtes plus susceptible d'avoir des infections comme la VB (vaginose bactérienne). Avoir suffisamment de ces bonnes bactéries réduit votre risque de VB.${disclaimer}`;
    }
    return `**Positive**
This means your vagina lacks enough good bacteria that naturally fight germs. Without enough of these protectors, your vagina becomes less protected. This makes you more likely to get infections like BV (bacterial vaginosis). Having plenty of these good bacteria lowers your BV risk.${disclaimer}`;
  }
}

function leDetail(value?: string, others?: Array<{ name: string; value: string }>, lang: BiomarkerLang = 'en') {
  const v = norm(value);
  const disclaimer = getDisclaimer(lang);
  if (v === '-' || v === '±') {
    if (lang === 'de') {
      return `**Normal**
Keine Anzeichen einer Entzündung festgestellt.${disclaimer}`;
    }
    if (lang === 'fr') {
      return `**Normal**
TOUT VA BIEN !${disclaimer}`;
    }
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
      if (lang === 'de') {
        return `**Positives LE bei allen anderen negativen Tests**
Da alle anderen Tests negativ sind, kann diese Entzündung Folgendes bedeuten:
* Eine sehr frühe Infektion, bei der die Keimzahl noch zu gering ist, um von den anderen Tests erkannt zu werden (LE reagiert zuerst).
* Eine nichtinfektiöse Reizung durch Seifen, Vaginalduschen, Gleitmittel oder Kondome.
* Hormonelle Veränderungen wie Menopause oder Stillzeit.
* Reibung durch Geschlechtsverkehr oder Tampons.
* Andere unbehandelte Probleme wie sexuell übertragbare Infektionen (Chlamydien/Gonorrhö, hier nicht abgedeckt) oder eine allgemeine bakterielle Überwucherung (nicht BV/AV).

**Was ist als Nächstes zu tun?**
* Beobachten Sie ungewöhnlichen Ausfluss, Juckreiz/Brennen, Schmerzen oder Geruch.
* Vermeiden Sie Reizstoffe wie parfümierte Seifen oder Vaginalduschen.
* Führen Sie regelmäßige Selbsttests durch, um Veränderungen der Entzündung zu beobachten.${disclaimer}`;
      }
      if (lang === 'fr') {
        return `**LE positif avec tous les autres tests négatifs**
Comme tous vos autres tests sont négatifs, cette inflammation peut signifier :
* Une infection très précoce où les niveaux de germes sont trop bas pour que les autres tests les détectent (la LE réagit en premier).
* Une irritation non infectieuse (savons, produits de douche vaginale, lubrifiants, préservatifs).
* Des changements hormonaux comme la ménopause ou l'allaitement.
* Des frottements (rapports sexuels ou tampons).
* Ou d'autres problèmes non traités comme les IST (chlamydia/gonorrhée, non couverts ici) ou une prolifération bactérienne générale (pas VB/VA).

**Que faire pour votre résultat d'inflammation isolée ?**
* Surveillez les symptômes : pertes inhabituelles, démangeaisons/brûlures, douleur ou odeur.
* Évitez les irritants : savons parfumés ou douches vaginales.
* Envisagez des contrôles réguliers à domicile pour voir l'évolution de votre inflammation.${disclaimer}`;
      }
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
    if (lang === 'de') {
      return `**Positives LE mit weiteren positiven Tests**
Die Entzündung bestätigt deutlich, dass die nachgewiesene(n) Infektion(en) behandelt werden müssen. LE wirkt wie ein Warnsignal; zusammen mit den anderen positiven Ergebnissen stützt es den Befund.

**Was ist als Nächstes zu tun?**
* Befolgen Sie die spezifischen Empfehlungen für die nachgewiesene(n) Infektion(en).
* Beobachten Sie Ihre Symptome und vermeiden Sie Reizstoffe.
* Erwägen Sie nach der Behandlung einen erneuten Test, um die Abheilung zu bestätigen.${disclaimer}`;
    }
    if (lang === 'fr') {
      return `**LE positif avec d'autres tests positifs**
Votre inflammation confirme fortement que vous avez besoin d'un traitement pour l'infection(s) détectée(s). La LE agit comme un « voyant » indiquant un problème ; combinée à vos autres résultats positifs, cela confirme le diagnostic.

**Que faire pour votre résultat d'infection confirmée ?**
* Suivez les recommandations spécifiques pour l'infection(s) détectée(s).
* Surveillez les symptômes et évitez les irritants.
* Envisagez un nouveau test après traitement pour confirmer la guérison.${disclaimer}`;
    }
    return `**Positive LE with other positive tests**
Your inflammation strongly confirms you need treatment for the detected infection(s). LE acts like a "warning light" that something is wrong, and combined with your other positive results, this confirms the diagnosis.

**What to do next for your confirmed infection result?**
* Follow the specific guidance for your detected infection(s).
* Track symptoms and avoid irritants.
* Consider retesting after treatment to confirm resolution.${disclaimer}`;
  }
}

function snaDetail(value?: string, lang: BiomarkerLang = 'en') {
  const v = norm(value);
  const disclaimer = getDisclaimer(lang);
  if (v === '-') {
    if (lang === 'de') {
      return `**Negativ**
Keine bakterielle Vaginose (BV) festgestellt.${disclaimer}`;
    }
    if (lang === 'fr') {
      return `**Négatif**
TOUT VA BIEN !${disclaimer}`;
    }
    return `**Negative**
YOU ARE GOOD!${disclaimer}`;
  }
  if (v === '±') {
    if (lang === 'de') {
      return `**Mögliche BV**
Ihr Test ist grenzwertig – nicht eindeutig normal, aber auch nicht sicher BV. Das kann vorkommen, weil:
* Sie sich in einem **frühen oder abklingenden Stadium einer BV** befinden und sich die Bakterienkonzentrationen verändern.
* Ihre Vaginalflora **gemischt** ist (einige gute, einige schädliche Bakterien).
* **Kürzliche Aktivitäten** wie Geschlechtsverkehr, Vaginalduschen oder Ihr Menstruationszyklus das Ergebnis vorübergehend beeinflusst haben.${disclaimer}`;
    }
    if (lang === 'fr') {
      return `**VB possible**
Votre test est limite — ni clairement normal ni clairement VB. Cela peut arriver parce que :
* Vous pourriez être en **phase précoce ou de guérison de la VB**, les niveaux bactériens changent.
* Vos bactéries vaginales sont dans un **état mixte** (bonnes et mauvaises).
* Des **activités récentes** (rapports, douche vaginale, cycle) ont temporairement affecté le résultat.${disclaimer}`;
    }
    return `**Possible BV**
Means your test was borderline—not clearly normal but not definitely BV. This can happen because:
* You might be in the **early or healing stages of BV**, during which bacterial levels are changing.
* Your vaginal bacteria are in a **mixed state** (some good, some bad).
* **Recent activities** like sex, douching, or your menstrual cycle temporarily affected the result.${disclaimer}`;
  }
  if (v === '+') {
    if (lang === 'de') {
      return `**Positiv**
Das Ergebnis weist deutlich auf eine bakterielle Vaginose (BV) hin. Der Test erkennt chemische Substanzen, die von BV-verursachenden Bakterien wie Gardnerella und Prevotella produziert werden.

**Was ist als Nächstes zu tun?**
* Achten Sie auf fischähnlichen Geruch oder dünnflüssigen grauen Ausfluss – dies weist auf BV hin.
* Beachten Sie neues Unbehagen während oder nach dem Geschlechtsverkehr oder der Menstruation.
* Vermeiden Sie Vaginalduschen – sie schaden dem natürlichen Schutz der Vagina.
* Warten Sie eine Woche nach Antibiotika oder dem Ende der Menstruation.
* Testen Sie zwischen den Menstruationen für die besten Ergebnisse.
* Vermeiden Sie Geschlechtsverkehr und Gleitmittel zwei Tage vor der erneuten Testung.${disclaimer}`;
    }
    if (lang === 'fr') {
      return `**Positif**
Indique fortement une vaginose bactérienne (VB), le test détecte des substances produites par les bactéries responsables de la VB (Gardnerella, Prevotella).

**Que faire pour un résultat VB possible ?**
* Surveillez une odeur de poisson ou des pertes grises fines — typiques de la VB.
* Notez tout inconfort pendant/après les rapports ou les règles.
* Évitez les douches vaginales — elles nuisent à la protection naturelle du vagin.
* Attendez une semaine après la fin des antibiotiques ou des règles.
* Refaites un test entre les règles pour de meilleurs résultats.
* Évitez rapports et lubrifiants 2 jours avant le nouveau test.${disclaimer}`;
    }
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

function betaGDetail(value?: string, lang: BiomarkerLang = 'en') {
  const v = norm(value);
  const disclaimer = getDisclaimer(lang);
  if (v === '-') {
    if (lang === 'de') {
      return `**Negativ**
Keine aerobe Vaginitis (AV) festgestellt.${disclaimer}`;
    }
    if (lang === 'fr') {
      return `**Négatif**
TOUT VA BIEN !${disclaimer}`;
    }
    return `**Negative**
YOU ARE GOOD!${disclaimer}`;
  }
  if (v === '±') {
    if (lang === 'de') {
      return `**Mögliche AV**
Der Test zeigt leicht erhöhte Werte chemischer Substanzen, die von aeroben Bakterien produziert werden – über dem Normalwert, aber nicht eindeutig positiv. Dies kann bei einer frühen Infektion, während der Erholung, aufgrund von Problemen bei der Probenentnahme, nach kürzlicher Antibiotikaeinnahme oder in zeitlicher Nähe zur Menstruation auftreten.${disclaimer}`;
    }
    if (lang === 'fr') {
      return `**VA possible**
Le test a détecté des niveaux limites de signaux chimiques produits par les bactéries aérobies (VA) — au-dessus de la normale mais pas clairement positifs. Cela peut survenir en phase précoce d'infection, de guérison, ou à cause du prélèvement, d'antibiotiques récents ou du cycle.${disclaimer}`;
    }
    return `**Possible AV**
Means that the test detected borderline elevated levels of chemical signs produced by aerobic bacteria (AV)—above normal but not clearly positive. This outcome may occur during early infection, recovery, or due to sample collection issues, recent antibiotic use, or timing related to your period.${disclaimer}`;
  }
  if (v === '+') {
    if (lang === 'de') {
      return `**Positiv**
Das Ergebnis weist auf aerobe Vaginitis (AV) hin, eine Infektion durch schädliche Bakterien. AV und bakterielle Vaginose (BV) können beide Juckreiz oder Brennen verursachen. AV zeigt meist gelben Ausfluss mit vaginaler Rötung oder Schwellung, während BV typischerweise dünnflüssigen grau-weißen Ausfluss mit fischähnlichem Geruch ohne Rötung verursacht. Einige Frauen – insbesondere während der Schwangerschaft – haben keine AV-Symptome; eine frühe Abklärung ist wichtig, da unbehandelte AV zu Frühgeburten führen kann.${disclaimer}`;
    }
    if (lang === 'fr') {
      return `**Positif**
Indique une vaginite aérobie (VA), infection causée par des bactéries nocives. La VA et la VB (vaginose bactérienne) provoquent toutes deux démangeaisons/brûlures et peuvent coexister. La VA se manifeste souvent par des pertes jaunes avec rougeur/gonflement vaginal, alors que la VB par des pertes gris-blanc fines et une odeur de poisson sans rougeur. Certaines femmes — surtout enceintes — n'ont pas de symptômes de VA ; un dépistage précoce est important car une VA non traitée peut favoriser un accouchement prématuré.${disclaimer}`;
    }
    return `**Positive**
Means Aerobic Vaginitis (AV), an infection caused by harmful bacteria. While AV and Bacterial Vaginosis (BV) both cause itching/burning and may occur together, AV usually shows yellow discharge with vaginal redness/swelling, whereas BV features thin gray-white discharge with fishy odor but no redness/swelling. Importantly, some women—especially during pregnancy—have no AV symptoms; early testing is vital since untreated AV may cause early birth.${disclaimer}`;
  }
}

function nagDetail(value?: string, pH?: number | null, lang: BiomarkerLang = 'en') {
  const v = norm(value);
  const disclaimer = getDisclaimer(lang);
  if (v === '-') {
    if (lang === 'de') {
      return `**Negativ**
Keine Infektion festgestellt.${disclaimer}`;
    }
    if (lang === 'fr') {
      return `**Négatif**
TOUT VA BIEN !${disclaimer}`;
    }
    return `**Negative**
YOU ARE GOOD!${disclaimer}`;
  }
  if (v === '±') {
    if (lang === 'de') {
      return `**Mögliche Trichomoniasis oder Hefepilzinfektion**
Ihr Test zeigt grenzwertige Anzeichen einer Infektion – nicht schwach genug für ein negatives, aber nicht stark genug für ein eindeutig positives Ergebnis. Dies kann auf eine sehr milde, beginnende oder abklingende Infektion hinweisen. Blut, Geschlechtsverkehr, Vaginalduschen, Sprays oder Gleitmittel können den pH-Wert und das Ergebnis vorübergehend beeinflussen.

**Was ist als Nächstes zu tun?**
Wiederholen Sie den Test nach 5–7 Tagen. Vermeiden Sie Geschlechtsverkehr, Vaginalduschen und Vaginalcremes 24 Stunden vor dem Test und warten Sie mindestens 3 Tage nach dem Ende der Menstruation.${disclaimer}`;
    }
    if (lang === 'fr') {
      return `**Trichomonase ou mycose possible**
Votre test montre des signes d'infection limites — pas assez faibles pour être négatif ni assez nets pour être clairement positif, avec une acidité vaginale en zone intermédiaire. Cela peut indiquer une infection très légère en début ou en guérison. Les fluides sexuels ou une douche récente peuvent affecter le test ; les règles, un rapport récent ou sprays/lubrifiants peuvent aussi modifier temporairement l'acidité — surveillez l'évolution.

**Que faire pour un résultat « trichomonase ou mycose possible » ?**
Refaites un test dans 5 à 7 jours — évitez rapports, douches ou crèmes vaginales 24 h avant, et attendez au moins 3 jours après la fin des règles.${disclaimer}`;
    }
    return `**Possible Trich or Yeast**
Means your test shows borderline infection signs—not weak enough to be negative but not strong enough for a clear positive—with your vagina's sourness (acidity) in the middle zone. This could mean a very mild infection starting or healing. Sometimes sex fluids, or recent douching affect the test; normal events like your period, recent sex, or using sprays/lubes can also change sourness (acidity) temporarily—watch for changes but don't worry yet.

**What to do next for your "possible trich or yeast" result?**
Retest in 5–7 days—avoid sex, douches, or vaginal creams for 24 hours beforehand, and wait until at least 3 days after your period ends.${disclaimer}`;
  }
  if (v === '+') {
    if (typeof pH === 'number') {
      if (pH >= 4.8) {
        if (lang === 'de') {
          return `**Positives NAG bei pH ${pH}**
Bei einem pH-Wert von ${pH} (≥ 4,8) handelt es sich eher um **Trichomoniasis**.

**Was ist als Nächstes zu tun?**
Wiederholen Sie den Test nach 5–7 Tagen. Vermeiden Sie Geschlechtsverkehr, Vaginalduschen und Vaginalcremes 24 Stunden vor dem Test und warten Sie mindestens 3 Tage nach dem Ende der Menstruation.${disclaimer}`;
        }
        if (lang === 'fr') {
          return `**NAG positif avec pH ${pH}**
Avec un pH de ${pH} (≥ 4,8), il s'agit plus probablement d'une **trichomonase**.

**Que faire pour un résultat trichomonase ?**
Refaites un test dans 5 à 7 jours — évitez rapports, douches ou crèmes vaginales 24 h avant, et attendez au moins 3 jours après la fin des règles.${disclaimer}`;
        }
        return `**Positive NAG with pH ${pH}**
Based on your pH of ${pH} (≥ 4.8), this is more likely to be **trichomoniasis**.

**What to do next for your trichomoniasis result?**
Retest in 5–7 days—avoid sex, douches, or vaginal creams for 24 hours beforehand, and wait until at least 3 days after your period ends.${disclaimer}`;
      }
      if (pH <= 4.6) {
        if (lang === 'de') {
          return `**Positives NAG bei pH ${pH}**
Bei einem pH-Wert von ${pH} (≤ 4,6) handelt es sich eher um eine **Hefepilzinfektion**.

**Was ist als Nächstes zu tun?**
Wiederholen Sie den Test nach 5–7 Tagen. Vermeiden Sie Geschlechtsverkehr, Vaginalduschen und Vaginalcremes 24 Stunden vor dem Test und warten Sie mindestens 3 Tage nach dem Ende der Menstruation.${disclaimer}`;
        }
        if (lang === 'fr') {
          return `**NAG positif avec pH ${pH}**
Avec un pH de ${pH} (≤ 4,6), il s'agit plus probablement d'une **mycose**.

**Que faire pour un résultat d'une mycose ?**
Refaites un test dans 5 à 7 jours — évitez rapports, douches ou crèmes vaginales 24 h avant, et attendez au moins 3 jours après la fin des règles.${disclaimer}`;
        }
        return `**Positive NAG with pH ${pH}**
Based on your pH of ${pH} (≤ 4.6), this is more likely to be a **yeast infection**.

**What to do next for your yeast infection result?**
Retest in 5–7 days—avoid sex, douches, or vaginal creams for 24 hours beforehand, and wait until at least 3 days after your period ends.${disclaimer}`;
      }
    }
    if (lang === 'de') {
      return `**Positiv**
**NAG ist ein gemeinsamer Marker für Trichomoniasis und Hefepilzinfektionen und kann sie allein nicht unterscheiden. Zusammen mit dem vaginalen pH-Wert hilft er zu erkennen, welche wahrscheinlicher ist:**
* Positiv („+“) und hoher pH-Wert (4,8 oder höher) → eher **Trichomoniasis**.
* Positiv („+“) und niedriger pH-Wert (4,6 oder niedriger) → eher **Hefepilzinfektion**.

**Was ist als Nächstes zu tun?**
Wiederholen Sie den Test nach 5–7 Tagen. Vermeiden Sie Geschlechtsverkehr, Vaginalduschen und Vaginalcremes 24 Stunden vor dem Test und warten Sie mindestens 3 Tage nach dem Ende der Menstruation.${disclaimer}`;
    }
    if (lang === 'fr') {
      return `**Positif**
**(NAG) est un marqueur commun à la trichomonase et aux mycoses, il ne peut pas les distinguer seul — mais avec le pH vaginal, il aide à savoir si c'est plutôt trichomonase ou mycose :**
* Positif (« + ») et pH élevé (4,8 ou plus) → plus probablement **trichomonase**. (La trichomonase élève le pH.)
* Positif (« + ») et pH bas (4,6 ou moins) → plus probablement **infection à mycoses**.

**Que faire pour un résultat « trichomonase ou mycoses possible » ?**
Refaites un test dans 5 à 7 jours — évitez rapports, douches ou crèmes vaginales 24 h avant, et attendez au moins 3 jours après la fin des règles.${disclaimer}`;
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
  all?: Array<{ name: string; value: string }>,
  lang: BiomarkerLang = 'en'
) {
  if (biomarker === 'pH') return getPHDetail(Number(value), lang);
  if (biomarker === 'H₂O₂') return h2o2Detail(value, lang);
  if (biomarker === 'LE') return leDetail(value, all, lang);
  if (biomarker === 'SNA') return snaDetail(value, lang);
  if (biomarker === 'β-G') return betaGDetail(value, lang);
  if (biomarker === 'NAG') {
    const pHVal = Number(all?.find(b => b.name === 'pH')?.value);
    return nagDetail(value, Number.isFinite(pHVal) ? pHVal : undefined, lang);
  }
  return lang === 'de' ? 'Biomarker' : lang === 'fr' ? 'Biomarqueur' : 'Biomarker';
}
