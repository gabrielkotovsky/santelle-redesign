/**
 * German copy for Learn articles, keyed by stable Supabase slug.
 * Mirrors the French DB-column pattern until title_german / subtitle_german /
 * content_md_german columns are populated in Supabase.
 */

export type GermanArticleCopy = {
  title: string;
  subtitle: string;
  content_md: string;
};

export const GERMAN_ARTICLES: Record<string, GermanArticleCopy> = {
  learn_about_your_biomarkers: {
    title: 'Mehr über Ihre Biomarker erfahren',
    subtitle: 'Erfahren Sie, wie Sie Ihre einzelnen Biomarker interpretieren.',
    content_md: `### Potenzieller Wasserstoff
**pH** misst, wie sauer Ihre Vagina ist. Eine gesunde Vagina ist leicht sauer, was hilft, Infektionen abzuwehren. Steigt der pH-Wert, bedeutet das meist, dass unerwünschte Bakterien oder Parasiten die Oberhand gewinnen.

### Wasserstoffperoxid
**H₂O₂** misst den natürlichen Schutz durch gute Bakterien (Laktobazillen). Sind die Werte niedrig, halten diese „Wachhund“-Bakterien das Gleichgewicht nicht mehr wie vorgesehen.

### Leukozytenesterase
**LE** misst die Aktivität der weißen Blutkörperchen. Das sind die natürlichen Helfer Ihres Körpers; eine höhere Aktivität kann zeigen, dass sie auf etwas reagieren.

### Sialidase
**SNA** misst ein Enzym, das mit Bakterien zusammenhängt, die bakterielle Vaginose (BV) verursachen. Sein Nachweis kann darauf hinweisen, dass BV die Ursache Ihrer Symptome ist.

### Beta-Glucuronidase
**β-G** misst ein Enzym, das mit bakterieller oder Hefepilz-Überwucherung zusammenhängt. Es zeigt an, wenn „zu viele der falschen Mikroben“ vorhanden sind.

### N-Acetyl-β-D-glucosaminidase
**NAG** misst Anzeichen einer leichten Reizung der Vaginalschleimhaut und hilft zu erkennen, wann Ihr Gewebe unter Stress steht.

## Sources:

Feng, D., Zhang, F., Cai, J., Zhang, Y., Yan, H., Yang, Y., Zhong, H., & Ye, H. (2024). Functional testing is a complementary tool for the diagnosis of vaginitis. BMC Women’s Health, 24, 224

O’Hanlon, D. E., Moench, T. R., & Cone, R. A. (2013).
Vaginal pH and microbicidal lactic acid when Lactobacilli dominate the microbiota. PLoS ONE, 8(11), e80074.
https://doi.org/10.1371/journal.pone.0080074

Chen, L., Li, J., & Xiao, B. (2024).
The role of sialidases in the pathogenesis of bacterial vaginosis and their use as a promising pharmacological target in bacterial vaginosis. Frontiers in Cellular and Infection Microbiology, 14, 1367233. https://www.frontiersin.org/journals/cellular-and-infection-microbiology/articles/10.3389/fcimb.2024.1367233/full`,
  },

  otc_products_that_can_help_your_microbiome: {
    title: 'Rezeptfreie Produkte, die Ihr vaginales Mikrobiom unterstützen können',
    subtitle:
      'Ein ausgeglichenes Mikrobiom schützt vor Infektionen und hält die Abwehrkräfte Ihres Körpers stark.',
    content_md: `## Warum Ihr vaginales Mikrobiom wichtig ist

Ihr vaginales Mikrobiom besteht aus Milliarden von Bakterien, vor allem **Lactobacillus**. Diese Bakterien produzieren Milchsäure, die Ihren vaginalen pH-Wert leicht sauer hält (3,8–4,5). Diese Säure verhindert das Wachstum schädlicher Keime und senkt das Risiko für Infektionen wie bakterielle Vaginose (BV), Hefepilzinfektionen oder auch Harnwegsinfektionen.

Doch das Gleichgewicht ist empfindlich. Antibiotika, Stress, hormonelle Veränderungen, Geschlechtsverkehr oder auch Ihre Periode können es verschieben. Dann können einige rezeptfreie (OTC) Produkte helfen, die Stabilität wiederherzustellen und wiederkehrenden Problemen vorzubeugen.

## OTC-Produkte, die Ihr Mikrobiom unterstützen können

### 1. Probiotika
Probiotika gehören zu den am besten untersuchten OTC-Optionen für die vaginale Gesundheit.
* **Wie sie helfen:** Bestimmte Stämme von *Lactobacillus* (wie *L. rhamnosus GR-1* und *L. reuteri RC-14*) können die Vagina besiedeln und die Säure wiederherstellen.
* **Formen:** Erhältlich als orale Kapseln, Vaginalkapseln oder Zäpfchen.
* **Evidenz:** Studien zeigen, dass Probiotika BV-Rückfälle verringern und die Vaginalflora nach einer Antibiotikabehandlung verbessern können. Ein Review fand eine Senkung der BV-Rückfälle um bis zu 45 % im Vergleich zu Placebo.
* **Tipp:** Wählen Sie Probiotika, die speziell für die vaginale oder urogenitale Gesundheit vermarktet werden – allgemeine Darmprobiotika haben möglicherweise nicht die richtigen Stämme.

### 2. pH-ausgleichende Gele und Waschlotionen
Die Vagina hält von Natur aus einen leicht sauren pH-Wert, um Bakterien im Gleichgewicht zu halten – Stress, Antibiotika oder hormonelle Veränderungen können ihn jedoch stören. pH-ausgleichende Gele und Waschlotionen können helfen, diese natürliche Säure wiederherzustellen und das Überwachsen schädlicher Bakterien zu verhindern.
* **Wie sie helfen:** Steigt Ihr vaginaler pH-Wert über 4,5, können schädliche Bakterien gedeihen. OTC-Gele mit Milchsäure können die Säure wieder auf normale Werte bringen.
* **Wann anwenden:** Nach Antibiotika, bei ungewöhnlichem Geruch oder Ausfluss oder wenn Ihre Ärztin oder Ihr Arzt es als Unterstützung zwischen Behandlungen empfiehlt.
* **Vorsicht:** Vermeiden Sie parfümierte Seifen oder „Intimhygiene“-Waschlotionen. Sie entfernen oft die natürliche Flora und verschlechtern das Ungleichgewicht.

### 3. Vaginale Feuchtigkeitscremes und Zäpfchen
* **Wie sie helfen:** Trockenheit und Reizung machen die Vagina anfälliger für Ungleichgewichte. Feuchtigkeitsprodukte mit Hyaluronsäure oder Milchsäure können Gewebe hydratisieren und gleichzeitig gute Bakterien unterstützen.
* **Optionen:** OTC-Vaginalzäpfchen mit Probiotika oder Milchsäure. Manche kombinieren Feuchtigkeit mit Mikrobiom-Unterstützung.
* **Evidenz:** Studien deuten darauf hin, dass Milchsäure-Zäpfchen bei regelmäßiger Anwendung den Komfort verbessern und BV-Rückfälle verringern können.

## OTC-Produkte, die nicht helfen – und schaden können
Vaginale Trockenheit ist nicht nur unangenehm – sie kann die Umgebung auch anfälliger für Ungleichgewichte machen. Für die vaginale Anwendung entwickelte Feuchtigkeitscremes und Zäpfchen helfen, Gewebe hydratisiert zu halten und ein gesundes Mikrobiom zu unterstützen.
* **Vaginalduschen**: Von WHO, CDC und Gynäkologinnen und Gynäkologen weltweit stark abgeraten. Sie stören die natürliche Flora und **erhöhen das Risiko für BV und entzündliche Beckenerkrankungen**.
* **Parfümierte Tücher oder Deo-Sprays**: Sie überdecken Geruch, stören aber das Mikrobiom.
* **„Reinigende“ Waschlotionen gegen Geruch**: Die meisten enthalten Stoffe, die schützende Bakterien entfernen statt sie zu unterstützen.

Betrachten Sie Ihre Vagina als selbstreinigend – sie braucht keine Extra-Hilfe, um „frisch“ zu bleiben. Das Mikrobiom zu unterstützen bedeutet Gleichgewicht, nicht Wegwaschen.

## Wann Sie eine Ärztin oder einen Arzt aufsuchen sollten

OTC-Produkte sind unterstützend, aber keine Behandlung von Infektionen.
Suchen Sie medizinische Hilfe, wenn Sie Folgendes bemerken:
* Anhaltenden Juckreiz, Brennen oder Schmerzen
* Starken fischähnlichen oder hefeartigen Geruch
* Grünlichen oder schaumigen Ausfluss
* Wiederkehrende Infektionen trotz OTC-Unterstützung

Diese Symptome können eine verschreibungspflichtige Behandlung erfordern.

## Ihr Mikrobiom natürlich unterstützen

* Tragen Sie atmungsaktive Unterwäsche (Baumwolle ist am besten).
* Vermeiden Sie unnötige Antibiotika.
* Beobachten Sie Veränderungen bei Ausfluss und pH-Wert – Ihre Muster verraten viel.
* Nutzen Sie OTC-Probiotika oder pH-ausgleichende Produkte als Unterstützung, nicht als Ersatz für medizinische Versorgung.

Ihr Mikrobiom ist widerstandsfähig. Mit der richtigen Unterstützung stellt es sich oft schnell wieder her. OTC-Produkte können Teil Ihres Werkzeugs sein – aber Ihre Aufmerksamkeit und tägliche Pflege zählen ebenso.

## Sources:
Kalia, N., Singh, J., & Kaur, M. (2020).
Microbiota in vaginal health and pathogenesis of recurrent vulvovaginal infections: A critical review. Annals of Clinical Microbiology and Antimicrobials, 19, 5.
https://doi.org/10.1186/s12941-020-0347-4

Reid, G., Dols, J., & Miller, W. (2009).
Targeting the vaginal microbiota with probiotics as a means to counteract infections. Current Opinion in Clinical Nutrition & Metabolic Care, 12(6), 583–587.
https://doi.org/10.1097/MCO.0b013e328331b611

Abbe, C., & Mitchell, C. M. (2023).
Bacterial vaginosis: A review of approaches to treatment and prevention. Frontiers in Reproductive Health, 5, 1100029.
https://doi.org/10.3389/frph.2023.1100029

Donders, G. G. G., Bellen, G., & Mendling, W. (2011).
Management of recurrent vulvo-vaginal candidosis as a chronic illness. Gynecologic and Obstetric Investigation, 72(1), 1–8.
https://pubmed.ncbi.nlm.nih.gov/21051852/`,
  },

  risk_factors_for_vaginal_infections: {
    title: 'Risikofaktoren für vaginale Infektionen',
    subtitle:
      'Erfahren Sie, was Ihr vaginales Mikrobiom stört – und wie kleine Gewohnheiten Infektionen vorbeugen.',
    content_md: `## Warum Infektionen entstehen
Vaginale Infektionen haben nichts damit zu tun, „unsauber“ zu sein. Sie entstehen, wenn das natürliche Gleichgewicht von Bakterien und Hefepilzen in der Vagina gestört wird. Normalerweise produzieren schützende Laktobazillen Milchsäure, die den pH-Wert leicht sauer hält (3,8–4,5) und es schädlichen Keimen erschwert zu gedeihen.

Verschiebt sich dieses Gleichgewicht, können bakterielle Vaginose (BV), Hefepilzinfektionen oder andere Zustände entstehen. Einige Faktoren erhöhen die Wahrscheinlichkeit – sie zu kennen hilft, das Risiko zu senken und früh zu reagieren.

## Die wichtigsten Risikofaktoren
### 1. Antibiotika
* **Warum:** Antibiotika unterscheiden nicht – sie töten schädliche Bakterien, reduzieren aber auch die schützenden Laktobazillen in Ihrem vaginalen Mikrobiom.
Auswirkung: Das kann eine Hefepilz-Überwucherung (Candida-Infektionen) auslösen oder Sie anfälliger für BV machen.
* **Evidenz:** Studien zeigen, dass Frauen nach Breitspektrum-Antibiotika in den folgenden Wochen bis zu **2–3-mal häufiger** eine Hefepilzinfektion entwickeln.
* **Tipp:** Wenn Sie Antibiotika brauchen, erwägen Sie danach ein Vaginalprobiotikum, um das Gleichgewicht wiederherzustellen (fragen Sie vorher Ihre Ärztin oder Ihren Arzt).

### 2. Hormonelle Veränderungen
* **Menstruationszyklus:** Rund um und nach der Menstruation steigt der pH-Wert vorübergehend (weniger sauer), was BV-verursachende Bakterien begünstigt.
* **Schwangerschaft:** Höhere Östrogenspiegel erhöhen Glykogen in der Vagina, fördern Hefewachstum und erhöhen das Risiko für Candidiasis.
* **Menopause:** Weniger Östrogen führt zu Trockenheit, dünnerem Gewebe und weniger schützenden Laktobazillen – Infektionen werden häufiger.
* **Tipp:** Beobachten Sie Ihren Zyklus, um zu verstehen, wann Sie anfälliger sind. Sanfte Feuchtigkeitsprodukte oder pH-ausgleichende Gele können in Phasen mit niedrigem Östrogen unterstützen.

### 3. Sexuelle Aktivität
* **BV:** Keine STI, aber Geschlechtsverkehr kann die bakterielle Mischung in der Vagina verändern – besonders bei neuen oder mehreren Partnern.
* **Trichomoniasis:** Eine sexuell übertragbare Infektion durch Trichomonas vaginalis – weltweit etwa **156 Millionen neue Fälle pro Jahr** (WHO). Sie erfordert eine verschreibungspflichtige Behandlung.
* **Kondomnutzung:** Kann das Risiko für Trichomoniasis senken und pH-Störungen verringern.
* **Tipp:** Wenn Sie nach dem Geschlechtsverkehr Symptome bemerken (Geruch, Reizung), kann das ein Zeichen sein, dass Ihr Mikrobiom gestört wurde – beobachten Sie Muster.

### 4. Hygieneprodukte
* **Vaginalduschen:** Stark abgeraten – WHO und CDC warnen, dass sie das Risiko für BV und entzündliche Beckenerkrankungen erhöhen.
* **Parfümierte Tücher/Sprays:** Entfernen schützende Bakterien und reizen die Schleimhaut.
* **Realitätscheck:** Vaginas reinigen sich selbst. Normaler Ausfluss ist gesund und muss nicht weggewaschen werden.
* **Tipp:** Bleiben Sie bei warmem Wasser oder milden, duftfreien Reinigern nur äußerlich. Niemals vaginal duschen.

### 5. Kleidungswahl
* **Enge oder synthetische Unterwäsche:** Speichert Wärme und Feuchtigkeit – Bedingungen, in denen Hefepilze gedeihen.
* **Sicherere Wahl:** Baumwollunterwäsche ermöglicht Luftzirkulation und senkt das Infektionsrisiko.
* **Zusatztipp:** Wechseln Sie schwitzige Sportkleidung schnell, um anhaltende Feuchtigkeit zu vermeiden.

### 6. Stress und Lebensstil
* **Stress:** Erhöht Cortisol, schwächt das Immunsystem und verringert die Fähigkeit Ihres Körpers, Mikroben im Gleichgewicht zu halten.
* **Schlaf & Ernährung:** Schlechter Schlaf und hoher Zuckerkonsum stehen im Zusammenhang mit höheren Raten von Hefeüberwucherung.
* **Tipp:** Unterstützen Sie Ihr Mikrobiom mit ausreichend Schlaf, ausgewogener Ernährung und Stressmanagement – das zählt genauso wie äußere Faktoren.

## Faktoren, die Sie nicht vollständig kontrollieren können
* Natürliche hormonelle Veränderungen (Periode, Schwangerschaft, Menopause)
* Genetische Veranlagung (manche Frauen neigen eher zu BV oder Hefepilz)
* Alter (jüngere Frauen haben häufiger wiederkehrende Hefepilzinfektionen, BV ist im gebärfähigen Alter am häufigsten)

Das ist nicht Ihre Schuld – so funktionieren Körper. Wichtig ist zu wissen, wann Sie anfälliger sind, damit Sie unterstützende Schritte gehen können.

## Faktoren, die Sie beeinflussen können
* Vermeiden Sie Vaginalduschen, parfümierte Tücher oder Deo-Sprays
* Wählen Sie Baumwollunterwäsche und wechseln Sie feuchte Kleidung
* Nutzen Sie Antibiotika nur, wenn sie verschrieben wurden
* Unterstützen Sie Ihr Mikrobiom bei Bedarf mit Probiotika oder pH-ausgleichenden Produkten
* Beobachten Sie Veränderungen Ihres Ausflusses, um Muster früh zu erkennen

## Klarheit statt Schuld
Vaginale Infektionen sind häufig, und eine zu haben bedeutet nicht, dass Sie etwas „falsch“ gemacht haben. Risikofaktoren zu kennen bedeutet **Bewusstsein, nicht Schuld**. Es hilft Ihnen, die Rhythmen Ihres Körpers zu verstehen und Ihr Gleichgewicht zu schützen.

**Santelle** macht das einfacher: diskrete monatliche Check-ins, die Sicherheit geben, wenn alles normal aussieht, und Orientierung, wenn es Zeit zu handeln ist.

## Sources:
Abbe, C., & Mitchell, C. M. (2023).
Bacterial vaginosis: A review of approaches to treatment and prevention. Frontiers in Reproductive Health, 5, 1100029.
https://doi.org/10.3389/frph.2023.1100029

Brown, H., & Drexler, M. (2020).
Improving the diagnosis of vulvovaginitis: Perspectives to align practice, guidelines, and awareness. Population Health Management, 23(Suppl 1), S-3–S-12.
https://pmc.ncbi.nlm.nih.gov/articles/PMC7591372/

Centers for Disease Control and Prevention (CDC). (2023).
Bacterial vaginosis (BV).
https://www.cdc.gov/std/bv

Centers for Disease Control and Prevention (CDC). (2023).
Vulvovaginal candidiasis (yeast infection).
https://www.cdc.gov/fungal/diseases/candidiasis/genital

Centers for Disease Control and Prevention (CDC). (2023).
Trichomoniasis.
https://www.cdc.gov/std/trichomonas

Donders, G. G. G., Bellen, G., & Mendling, W. (2011).
Management of recurrent vulvo-vaginal candidosis as a chronic illness. Gynecologic and Obstetric Investigation, 72(1), 1–8.
https://doi.org/10.1159/000323823

Foxman, B. (1990).
The epidemiology of vulvovaginal candidiasis: Risk factors. American Journal of Public Health, 80(3), 329–331.
https://ajph.aphapublications.org/doi/10.2105/AJPH.80.3.329

Kalia, N., Singh, J., & Kaur, M. (2020).
Microbiota in vaginal health and pathogenesis of recurrent vulvovaginal infections: A critical review. Annals of Clinical Microbiology and Antimicrobials, 19, 5.
https://doi.org/10.1186/s12941-020-0347-4

O’Hanlon, D. E., Moench, T. R., & Cone, R. A. (2013).
Vaginal pH and microbicidal lactic acid when Lactobacilli dominate the microbiota. PLoS ONE, 8(11), e80074.
https://doi.org/10.1371/journal.pone.0080074

Sobel, J. D. (2007).
Vulvovaginal candidosis. The Lancet, 369(9577), 1961–1971.
https://doi.org/10.1016/S0140-6736(07)60917-9`,
  },

  how_your_discharge_changes_with_your_menstrual_cycle: {
    title: 'Wie sich Ihr Ausfluss im Laufe Ihres Zyklus verändert',
    subtitle:
      'Sehen Sie, wie sich Ihr Ausfluss im Zyklus verändert – und was das über Gleichgewicht und Gesundheit aussagt.',
    content_md: `## Ihr Zyklus, Ihre Signale
Ausfluss ist nicht zufällig – er folgt dem Rhythmus Ihres Menstruationszyklus. Diese Veränderungen zu verstehen hilft Ihnen zu wissen, was normal ist, wann Sie fruchtbar sind und wann etwas nicht stimmen könnte.

### Phase 1: Menstruationsphase (Tag 1–5)
Während Ihrer Periode vermischt sich Ausfluss mit Blut. Der Fluss ist meist rot bis dunkelbraun. Oft bemerken Sie wenig anderes, weil die Blutung dominiert.

### Phase 2: Follikelphase (Tag 6–13)
Nach Ihrer Periode ist der Ausfluss oft gering und kann sich einige Tage trocken anfühlen.
* **Frühe Follikelphase:** Wenig oder kein Ausfluss.
* **Späte Follikelphase:** Der Ausfluss wird cremig oder trüb-weiß, wenn der Östrogenspiegel steigt.

### Phase 3: Eisprung (Tag 14–16, variabel)
Zum Eisprung ist der Ausfluss am auffälligsten.
* **Konsistenz:** Klar, dehnbar, „eiweißartig“ – er lässt sich zwischen den Fingern ziehen.
* **Zweck:** Dieser fruchtbare Schleim hilft Spermien, leichter zu wandern.
* **Dauer:** Meist 2–3 Tage rund um den Eisprung.

### Phase 4: Lutealphase (Tag 17–28)
Nach dem Eisprung steigt Progesteron. Der Ausfluss wird wieder dicker.
* **Frühe Lutealphase:** Cremig, weiß oder gelblich.
* **Späte Lutealphase (vor der Periode):** Der Ausfluss kann abnehmen, manchmal klebrig oder trocken.

## Was normal ist – und was nicht
Während sich der Ausfluss natürlich im Zyklus verändert, können manche Abweichungen signalisieren, dass etwas nicht stimmt.
* **Normal:** Klarer, milchiger oder eiweißartiger Ausfluss, der sich mit Ihrem Zyklus verändert.
* **Nicht typisch:** Grauer, grüner, klumpiger oder stark riechender Ausfluss – das kann auf eine Infektion hinweisen.

## Warum Tracking hilft
Viele Frauen halten normale Zyklusveränderungen für eine Infektion. Tatsächlich werden bis zu 50 % der vaginalen Infektionen beim ersten Mal falsch diagnostiziert. Wenn Sie Ihre eigenen Muster kennen, wissen Sie, wann es nur der Eisprung ist – und wann eine weitere Abklärung sinnvoll ist.

## Ihr Zyklus als Leitfaden
Ihr Ausfluss ist ein natürlicher Teil des Körperrhythmus. Er ist nichts zum Verstecken – er ist ein Gesundheitszeichen. Wenn Sie darauf achten, gewinnen Sie Klarheit, innere Ruhe und bessere Gespräche mit Ihrer Ärztin oder Ihrem Arzt, wenn nötig.
**Santelle** hilft Ihnen, diese Veränderungen diskret zu verfolgen, damit Sie Ihr Normal erkennen und Ungewöhnliches bemerken.

## Sources:
https://my.clevelandclinic.org/health/body/21957-cervical-mucus

The American College of Obstetricians and Gynecologists. FAQ: Fertility Awareness-Based Methods of Family Planning [internet]. Washington DC: American College of Obstetricians and Gynecologists; 2019. https://www.acog.org/womens-health/faqs/fertility-awareness-based-methods-of-family-planning

The American College of Obstetricians and Gynecologists. FAQ: Vulvovaginal health [internet]. Washington DC: American College of Obstetricians and Gynecologists. https://www.acog.org/womens-health/faqs/vulvovaginal-health#:~:text=Vaginal%20dryness%20can%20be%20caused,and%20urinary%20tract%20during%20menopause.`,
  },

  what_is_bv_yeast_infections_and_trichomoniasis: {
    title: 'Was ist bakterielle Vaginose (BV), Hefepilzinfektion und Trichomoniasis?',
    subtitle:
      'BV, Hefepilzinfektion und Trichomoniasis fühlen sich ähnlich an – so unterscheiden Sie sie und behandeln Sie sie richtig.',
    content_md: `## Häufige vaginale Infektionen verstehen
Veränderungen des Ausflusses können manchmal auf eine Infektion hinweisen. Drei der häufigsten sind **bakterielle Vaginose (BV), Hefepilzinfektionen und Trichomoniasis**. Es sind unterschiedliche Erkrankungen, aber sie haben überlappende Symptome – deshalb werden sie oft verwechselt.

## Bakterielle Vaginose (BV)
* **Ursache:** Ein Ungleichgewicht im vaginalen Mikrobiom, bei dem schützende gute Bakterien (Laktobazillen) reduziert sind und andere Bakterien wachsen können.
* **Symptome:**
  * Dünnflüssiger, grau-weißer Ausfluss
  * Fischähnlicher Geruch, oft stärker nach dem Geschlechtsverkehr
  * Leichte Reizung (manchmal aber gar keine Symptome)
* **Häufigkeit:** BV ist die häufigste vaginale Infektion bei Frauen im gebärfähigen Alter und betrifft zu jedem Zeitpunkt etwa 20–30 %.
* **Behandlung:** Antibiotika, die von einem Arzt verschrieben werden (meist Metronidazol oder Clindamycin). OTC-Produkte können das Gleichgewicht unterstützen, heilen aber keine BV.

## Hefepilzinfektionen (Candidiasis)
* **Ursache:** Überwucherung des Pilzes Candida albicans, der normalerweise in kleinen Mengen in der Vagina vorkommt.
* **Symptome:**
  * Dicker, weißer „Hüttenkäse-ähnlicher“ Ausfluss
  * Starker Juckreiz oder Brennen
  * Rötung und Schwellung der Vulva
* **Häufigkeit: Etwa 75 % der Frauen erleben mindestens eine Hefepilzinfektion in ihrem Leben**, und viele haben Rückfälle.
* **Behandlung:** Antimykotische Cremes oder Zäpfchen (OTC oder verschreibungspflichtig). Schwere oder wiederkehrende Fälle können eine orale antimykotische Medikation vom Arzt erfordern.

## Trichomoniasis
* **Ursache:** Eine sexuell übertragbare Infektion (STI), verursacht durch den Parasiten Trichomonas vaginalis.
* **Symptome:**
  * Schaumiger, gelb-grüner Ausfluss
  * Starker Geruch
  * Juckreiz, Reizung oder Schmerzen beim Geschlechtsverkehr oder Wasserlassen
* **Häufigkeit:** Weltweit sind jährlich etwa 156 Millionen Menschen von Trichomoniasis betroffen, was sie zu einer der häufigsten nicht-viralen STIs macht (WHO-Schätzung, 2022).
* **Behandlung:** Erfordert verschreibungspflichtige Antibiotika (meist Metronidazol). OTC-Produkte behandeln sie nicht.

## Warum die richtige Diagnose wichtig ist
Weil sich die Symptome überschneiden, ist die Selbstdiagnose schwierig. Zum Beispiel können BV und Hefepilzinfektionen beide Reizungen verursachen, erfordern aber sehr unterschiedliche Behandlungen. Studien zeigen **Fehldiagnosequoten von 40–50 %**, wenn Frauen nur anhand der Symptome raten.
Deshalb ist professionelles Testen – oder geführte Heimtest-Kits, die zwischen Infektionen unterscheiden können – wichtig.

## Wann Sie einen Arzt aufsuchen sollten
Suchen Sie medizinische Hilfe, wenn Sie Folgendes bemerken:
* Anhaltenden oder ungewöhnlichen Ausfluss
* Starken Geruch
* Starker Juckreiz oder Schmerzen
* Symptome, die nach OTC-Behandlung nicht verschwinden

## Sich selbst mit Klarheit unterstützen
Diese Infektionen sind häufig und behandelbar. Eine zu haben bedeutet nicht, dass Sie „unsauber“ sind – es bedeutet, dass sich Ihr Mikrobiom verschoben hat. Mit der richtigen Behandlung kann das Gleichgewicht schnell wiederhergestellt werden.

**Santelle** hilft Ihnen, die Signale Ihres Körpers zu verstehen, damit Sie die Behandlung mit Zuversicht und innerer Ruhe angehen können.

## Sources:
Abbe, C., & Mitchell, C. M. (2023).
Bacterial vaginosis: A review of approaches to treatment and prevention. Frontiers in Reproductive Health, 5, 1100029.
https://doi.org/10.3389/frph.2023.1100029

Brown, H., & Drexler, M. (2020).
Improving the diagnosis of vulvovaginitis: Perspectives to align practice, guidelines, and awareness. Population Health Management, 23(Suppl 1), S-3–S-12.
https://pmc.ncbi.nlm.nih.gov/articles/PMC7591372/

Centers for Disease Control and Prevention (CDC). (2023).
Bacterial vaginosis (BV).
https://www.cdc.gov/std/bv

Centers for Disease Control and Prevention (CDC). (2023).
Vulvovaginal candidiasis (yeast infection).
https://www.cdc.gov/fungal/diseases/candidiasis/genital

Centers for Disease Control and Prevention (CDC). (2023).
Trichomoniasis.
https://www.cdc.gov/std/trichomonas

Kalia, N., Singh, J., & Kaur, M. (2020).
Microbiota in vaginal health and pathogenesis of recurrent vulvovaginal infections: A critical review. Annals of Clinical Microbiology and Antimicrobials, 19, 5.
https://doi.org/10.1186/s12941-020-0347-4`,
  },

  infections_keep_coming_back: {
    title: 'Warum vaginale Infektionen immer wieder kommen',
    subtitle:
      'Wiederkehrende Infektionen haben nichts mit Hygiene zu tun – hier erfahren Sie, warum sie zurückkehren und wie Sie den Kreislauf durchbrechen.',
    content_md: `## Die Frustration wiederkehrender Infektionen
Kaum etwas ist so entmutigend wie eine Infektion zu behandeln, sich besser zu fühlen – und dann Wochen später erneut damit konfrontiert zu werden. Sie sind nicht allein:
* **Bis zu 50 % der Frauen mit BV erleben innerhalb von 6 Monaten einen Rückfall.**
* **Fast 8 % der Frauen leiden unter wiederkehrenden Hefepilzinfektionen (≥4 pro Jahr).**

Wiederkehrende Infektionen haben nichts mit Hygiene oder „etwas falsch gemacht zu haben“ zu tun. Sie entstehen meist, weil das zugrunde liegende Gleichgewicht im vaginalen Mikrobiom nicht vollständig wiederhergestellt wurde.

## Warum Infektionen zurückkommen
### 1. Unvollständige Behandlung
* BV und Hefepilzinfektionen erfordern oft vollständige Behandlungskuren. Frühzeitiges Absetzen – oder die Verwendung des falschen OTC-Produkts – kann Symptome lindern, aber die Ursache nicht beseitigen.
* Fehldiagnosen sind häufig: **Etwa 40–50 % der Infektionen werden anfangs falsch diagnostiziert**, was zu ineffektiver Behandlung führt.

### 2. Mikrobiom-Ungleichgewicht
Das vaginale Ökosystem ist empfindlich. Selbst nach Antibiotika oder Antimykotika können schützende Laktobazillen zu niedrig bleiben.
Ohne genügend Laktobazillen können Infektionen wie BV oder Hefepilzinfektionen schnell zurückkehren.
Probiotika oder pH-ausgleichende Produkte können helfen, dieses Gleichgewicht wiederherzustellen, brauchen aber Zeit.

### 3. Wiederkehrende Auslöser
* **Sexuelle Aktivität:** Neue oder mehrere Partner können die Flora stören.
* **Antibiotika:** Können wiederholt Hefepilzinfektionen auslösen.
* **Hormonelle Zyklen:** pH-Wert-Verschiebungen während der Periode machen manche Frauen anfällig für monatliche BV oder Hefepilzinfektionen.
* **Lebensstil:** Stress, schlechter Schlaf und eine zuckerreiche Ernährung können Rückfälle begünstigen.

### 4. Biofilme und Widerstandsfähigkeit
Einige an BV beteiligte Bakterien können **Biofilme** bilden – Schutzschichten, die ihre Beseitigung erschweren. Das ist ein Grund, warum BV oft auch nach der Behandlung zurückkommt.

## Die emotionale Belastung
Wiederkehrende Infektionen betreffen mehr als die Gesundheit. Sie können das Selbstvertrauen, das Sexualleben und das seelische Wohlbefinden beeinträchtigen. Frauen fühlen sich oft von Ärzten abgewiesen oder hören, es sei „nur Einbildung“. Studien und Erfahrungsberichte zeigen die Frustration, mit ständigem Unbehagen zu leben, und die Erleichterung, wenn die Ursache endlich identifiziert wird.

## Den Kreislauf durchbrechen
Wiederkehrende Infektionen lassen sich behandeln. Schritte, die helfen können:
* Vollständige Kuren der verschriebenen Behandlung abschließen.
* Die Erholung mit Probiotika oder pH-ausgleichenden Produkten unterstützen.
* Bekannte Auslöser vermeiden (parfümierte Produkte, Vaginalduschen, enge Kleidung).
* Muster beobachten – viele Frauen bemerken Rückfälle im Zusammenhang mit der Periode, Antibiotika oder Stress.
* Langfristiges Management mit einem Arzt besprechen, wenn Infektionen immer wieder auftreten.

## Ruhe durch Klarheit finden
Wenn Sie mit wiederkehrenden Infektionen kämpfen, sind Sie nicht allein – und es ist nicht Ihre Schuld. Zu verstehen, warum sie zurückkommen, ist der erste Schritt, den Kreislauf zu durchbrechen.

**Santelle** hilft Ihnen, Muster zu erkennen, Ihr Mikrobiom zu unterstützen und Ihren Arzt mit Daten und Zuversicht aufzusuchen. Denn innerer Frieden kommt nicht vom Raten, sondern vom Wissen.

## Sources:
Bradshaw CS, Morton AN, Hocking J, Garland SM, Morris MB, Moss LM, et al. High recurrence rates of bacterial vaginosis over the course of 12 months after oral metronidazole therapy and factors associated with recurrence. J Infect Dis. 2006;193(11):1478–89. https://doi.org/10.1086/503780.

Zhou, X., Westman, R., Hickey, R., Hansmann, M. A., & Forney, L. J. (2009). Vaginal microbiota of women with frequent vulvovaginal candidiasis. Infection and Immunity, 77(9), 4130–4135. Available from https://pmc.ncbi.nlm.nih.gov/articles/PMC2738030/

Brown, H., & Drexler, M. (2020). Improving the diagnosis of vulvovaginitis: Perspectives to align practice, guidelines, and awareness. Population Health Management, 23(Suppl 1), S-3–S-12. Retrieved from https://pmc.ncbi.nlm.nih.gov/articles/PMC7591372/

Kalia, N., Singh, J., & Kaur, M. (2020). Microbiota in vaginal health and pathogenesis of recurrent vulvovaginal infections: a critical review. Annals of Clinical Microbiology and Antimicrobials, 19, 5. https://doi.org/10.1186/s12941-020-0347-4

https://almondobgyn.com/blog/getting-to-the-root-of-recurrent-vaginitis

Abbe, C., & Mitchell, C. M. (2023). Bacterial vaginosis: A review of approaches to treatment and prevention. Frontiers in Reproductive Health, 5, 1100029. https://doi.org/10.3389/frph.2023.1100029`,
  },

  what_your_discharge_means: {
    title: 'Was Ihr Ausfluss bedeutet',
    subtitle:
      'Verstehen Sie, was Ihr Ausfluss verrät – und wie das Tracking Ihnen hilft, im Gleichgewicht zu bleiben.',
    content_md: `Vaginaler Ausfluss erlebt jede Frau. Er ist kein Problem, das behoben werden muss – er ist die Art Ihres Körpers zu kommunizieren. Wenn Sie auf Veränderungen achten, können Sie verstehen, was normal ist, was zyklusbedingt ist und wann er auf ein Ungleichgewicht hinweisen könnte.

## Die Rolle des Ausflusses
Ausfluss ist eine gesunde Flüssigkeit, die von Vagina und Gebärmutterhals produziert wird. Er hilft, die vaginale Umgebung ausgeglichen und geschützt zu halten.
* **Klar oder milchig:** meist normal, besonders zur Zyklusmitte.
* **Eiweiß-ähnliche Konsistenz:** ein Zeichen des Eisprungs.
* **Dicker oder cremiger:** tritt oft vor oder nach der Periode auf.

Die Ausgangslage jeder Frau ist leicht unterschiedlich. Am wichtigsten ist, die eigenen Muster zu erkennen.

## Wenn Ausfluss Gleichgewicht signalisiert
Meistens ist Ausfluss ein Zeichen eines gut funktionierenden Ökosystems. Ein leicht saurer vaginaler pH-Wert (zwischen 3,8 und 4,5) hält Bakterien in Schach. Die wichtigsten Bakterien, Laktobazillen, schützen vor Infektionen, indem sie Milchsäure produzieren.

## Wann Sie aufmerksam sein sollten
Veränderungen in Farbe, Konsistenz oder Geruch können manchmal auf ein Ungleichgewicht hinweisen:
* **Grau oder fischähnlicher Geruch:** oft mit bakterieller Vaginose (BV) verbunden.
* **Dick, weiß, „Hüttenkäse“-Konsistenz:** kann auf eine Hefepilzinfektion hinweisen.
* **Grünlich oder gelb:** könnte auf Trichomoniasis oder eine andere Infektion hinweisen.

Weltweit ist **BV die häufigste vaginale Infektion bei Frauen im gebärfähigen Alter und betrifft zu jedem Zeitpunkt 20–30 %.** Hefepilzinfektionen sind ebenfalls häufig – etwa **75 % der Frauen erleben mindestens eine in ihrem Leben.**

## Warum Tracking wichtig ist
Frauen verwechseln oft eine Infektion mit einer anderen – zum Beispiel BV mit einer Hefepilzinfektion. Studien zeigen, dass **bis zu 50 % der vaginalen Infektionen beim ersten Mal falsch diagnostiziert werden.** Das kann eine wirksame Behandlung verzögern und Unbehagen verlängern.

Das Beobachten von Ausflussmustern über die Zeit hilft:
* Frühe Anzeichen eines Ungleichgewichts zu erkennen, bevor Symptome schlimmer werden.
* Auslöser zu verstehen (z. B. Antibiotika, Menstruationszyklus, neuer Partner).
* Schneller die richtige Behandlung mit mehr Zuversicht zu suchen.

## Ruhe in Klarheit finden
Ausfluss ist nichts, wofür man sich schämen müsste – er ist ein wichtiges Zeichen Ihrer Gesundheit. Indem Sie darauf achten, bleiben Sie einfach im Einklang mit Ihrem Körper.
Santelle macht das einfacher: diskrete monatliche Check-ins geben Ihnen Sicherheit, wenn alles normal aussieht, und Orientierung, wenn sich etwas nicht richtig anfühlt.

## Sources:
 https://www.cdc.gov/std/vaginal-discharge

 https://www.mayoclinic.org/healthy-lifestyle/womens-health/in-depth/vaginal-discharge

 https://www.frontiersin.org/articles/10.3389/frph.2023.1100029
 https://pmc.ncbi.nlm.nih.gov/articles/PMC2738030/

 Brown, H., & Drexler, M. (2020). Improving the diagnosis of vulvovaginitis: Perspectives to align practice, guidelines, and awareness. Population Health Management, 23(Suppl 1), S-3–S-12. https://pmc.ncbi.nlm.nih.gov/articles/PMC7591372/`,
  },
};
