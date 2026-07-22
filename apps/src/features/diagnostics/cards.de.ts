import type { CardVariantId, ModifierId } from './types';
import type { CardContent } from './cards';

const PROBIOTIC_STRAINS =
  'Lactobacillus rhamnosus GR-1, L. reuteri B-54 oder L. reuteri RC-14';

const doctorSoon = 'Empfohlene Maßnahme: ärztliche Beratung';
const priorityCare = 'Empfohlene Maßnahme: dringende ärztliche Beratung';
const stiCentre = 'Empfohlene Maßnahme: STI-Teststelle';
const recheck = 'Empfohlene Maßnahme: Ergebnis erneut ablesen; bei Bestätigung ärztlich abklären';

export const GERMAN_CARDS: Record<CardVariantId, CardContent> = {
  'URGENT-1': {
    title: 'Wichtig: Bitte nehmen Sie umgehend medizinische Hilfe in Anspruch',
    summary: 'Fieber oder starke Unterbauchschmerzen zusammen mit vaginalen Symptomen können auf eine ernstere Infektion wie eine entzündliche Beckenerkrankung (PID) hinweisen.',
    path: priorityCare,
    bullets: [
      'Suchen Sie innerhalb von 24–48 Stunden medizinisches Fachpersonal auf – bei Verschlechterung früher.',
      'Vermeiden Sie bis zur Abklärung eine rezeptfreie Selbstbehandlung.',
      'Notieren Sie Zeitpunkt, Stärke und Art Ihrer Symptome und Ihres Ausflusses.',
    ],
  },
  'URGENT-2': {
    title: 'Schwangerschaft und Infektionszeichen – dringende medizinische Abklärung erforderlich',
    summary: 'Bakterielle Vaginose während der Schwangerschaft ist ein wichtiger Risikofaktor für vorzeitige Wehen und Frühgeburt. Jedes Infektionszeichen während der Schwangerschaft muss zeitnah abgeklärt werden – mit oder ohne Symptome.',
    path: priorityCare,
    bullets: [
      'Kontaktieren Sie innerhalb von 24–48 Stunden Ihre gynäkologische Praxis oder Hebamme.',
      'Beginnen Sie während der Schwangerschaft keine rezeptfreie Behandlung ohne medizinische Beratung.',
      'Bringen Sie Ihre Testergebnisse zur Untersuchung mit.',
    ],
  },
  'URGENT-3': {
    title: 'Blutungen beim Geschlechtsverkehr – bitte abklären lassen',
    summary: 'Blutungen während oder nach dem Geschlechtsverkehr zählen zu den häufigen Anzeichen einer Chlamydieninfektion, die dieser Heimtest nicht erkennt. Eine STI-Teststelle oder sexualmedizinische Beratungsstelle ist meist der schnellste direkte Weg zur Abklärung.',
    path: priorityCare,
    bullets: [
      'Suchen Sie zeitnah eine STI-Teststelle oder sexualmedizinische Beratungsstelle auf.',
      'Notieren Sie Zeitpunkt, Menge und Wiederholung der Blutung.',
      'Medizinisches Fachpersonal kann Ursachen am Gebärmutterhals oder andere Ursachen abklären, die das Kit nicht erkennt.',
    ],
  },
  'URGENT-4': {
    title: 'Blutung außerhalb des Zyklus – bitte ärztlich abklären',
    summary: 'Blutungen außerhalb Ihres normalen Zyklus müssen medizinisch abgeklärt werden. Wenn Sie eine sexuell übertragbare Ursache vermuten, ist eine STI-Teststelle ein schneller erster Schritt.',
    path: priorityCare,
    bullets: [
      'Vereinbaren Sie zeitnah einen Arzttermin oder besuchen Sie eine STI-Teststelle.',
      'Notieren Sie Beginn und Art der Blutung.',
      'Vermeiden Sie bis zur Abklärung eine rezeptfreie Selbstbehandlung.',
    ],
  },
  'URGENT-5': {
    title: 'Drei Infektionsmarker positiv – bitte erneut ablesen und ärztlich abklären',
    summary: 'Drei gleichzeitig positive Infektionsmarker sind biologisch sehr ungewöhnlich. Einige Testfarben sind besonders bei schwachem Licht oder nach dem 15-Minuten-Fenster schwer zu unterscheiden. Lesen Sie den Test erneut anhand der Farbkarte ab und lassen Sie ein bestätigtes Ergebnis medizinisch abklären.',
    path: priorityCare,
    bullets: [
      'Vergleichen Sie den Test bei gutem Licht erneut mit der Farbkarte.',
      'Vereinbaren Sie bei Bestätigung zeitnah einen Arzttermin.',
      'Bringen Sie Ihre Testergebnisse zum Termin mit.',
      'Vermeiden Sie eine Selbstbehandlung, die eine Erkrankung verdecken könnte, während eine andere behandelt wird.',
    ],
  },

  'BV-LIKELY-PHARMACY': {
    title: 'Wahrscheinliches Profil einer bakteriellen Vaginose (BV)',
    summary: 'Basierend auf Ihren Testmarkern und den angegebenen Symptomen. Die Kombination aus erhöhtem BV-Marker (früher Gardnerella) und passenden Symptomen ist deutlich genug für eine Beratung in der Apotheke.',
    path: 'Empfohlene Maßnahme: Apotheke – verschreibungspflichtige Antibiotika',
    bullets: [
      'Zeigen Sie Ihre Ergebnisse in der Apotheke. Dort kann man Sie zu verschreibungspflichtigen Antibiotika wie topischem Clindamycin oder oralem Metronidazol beraten.',
      'Führen Sie die gesamte Behandlung durch, auch wenn sich die Symptome schnell bessern.',
      'Vermeiden Sie während der Behandlung Geschlechtsverkehr, um Reinfektion und Reizung zu reduzieren.',
      `Erwägen Sie nach der Behandlung ein Vaginalprobiotikum mit ${PROBIOTIC_STRAINS}; diese Stämme können helfen, BV-Rückfällen vorzubeugen.`,
      'Wiederholen Sie den Test 2–3 Wochen nach Abschluss der Behandlung.',
    ],
  },
  'BV-MARKERS-ONLY': {
    title: 'Wahrscheinliches Profil einer bakteriellen Vaginose (BV)',
    summary: 'Ihr BV-Marker (früher Gardnerella) ist positiv, Sie haben jedoch keine passenden Symptome angegeben. Auch eine asymptomatische BV sollte abgeklärt werden; vor einer Behandlung wird eine ärztliche Bestätigung empfohlen.',
    path: doctorSoon,
    bullets: [
      'Vereinbaren Sie in den nächsten Tagen einen Arzttermin.',
      'Bringen Sie Ihre Testergebnisse zum Termin mit.',
      'Achten Sie auf neue Symptome wie fischähnlichen Geruch, grauen Ausfluss oder Juckreiz.',
    ],
  },
  'BV-LIKELY-ESCALATION': {
    title: 'Wahrscheinliches BV-Profil – wiederkehrend oder anhaltend',
    summary: 'Anhaltende Beschwerden über mehr als eine Woche, wiederkehrende BV oder Unsicherheit über eine Schwangerschaft machen eine ärztliche Abklärung zur sichereren Wahl. Wiederkehrende BV benötigt häufig eine längere oder andere Behandlung.',
    path: doctorSoon,
    bullets: [
      'Vereinbaren Sie in den nächsten Tagen einen Arzttermin.',
      'Bringen Sie Ihre Testergebnisse und, falls bekannt, Angaben zu früheren BV-Episoden mit.',
      'Machen Sie bei möglicher Schwangerschaft vor jeder Behandlung einen Schwangerschaftstest.',
      `Erwägen Sie nach der Behandlung ein Vaginalprobiotikum mit ${PROBIOTIC_STRAINS}, um das Rückfallrisiko zu senken.`,
    ],
  },
  'BV-POSSIBLE': {
    title: 'Mögliches Profil einer bakteriellen Vaginose (BV)',
    summary: 'Ihr BV-Marker ist grenzwertig – weder eindeutig positiv noch eindeutig negativ. Dies kann in einem frühen oder abklingenden BV-Stadium oder nach Geschlechtsverkehr, Vaginalduschen oder Zyklusereignissen auftreten.',
    path: 'Empfohlene Maßnahme: ärztliche Beratung oder erneuter Test',
    bullets: [
      'Wiederholen Sie den Test nach 5–7 Tagen und vermeiden Sie vorher Geschlechtsverkehr, Vaginalduschen und parfümierte Produkte.',
      'Vereinbaren Sie ohne abzuwarten einen Arzttermin, wenn Symptome auftreten oder sich verschlimmern.',
    ],
  },
  'BV-POSSIBLE-SYMPTOMS': {
    title: 'Mögliches Profil einer bakteriellen Vaginose (BV)',
    summary: 'Ihre Symptome deuten auf BV hin, die Testmarker sind jedoch unauffällig. Möglicherweise wurde sehr früh getestet oder die Symptome haben eine andere Ursache.',
    path: 'Empfohlene Maßnahme: ärztliche Beratung oder erneuter Test',
    bullets: [
      'Wiederholen Sie den Test nach 5–7 Tagen, wenn die Symptome anhalten.',
      'Vereinbaren Sie früher einen Arzttermin, wenn sich die Symptome verschlimmern.',
      'Vermeiden Sie parfümierte Produkte und Vaginalduschen, da sie Symptome verdecken oder verschlimmern können.',
    ],
  },

  'AV-LIKELY': {
    title: 'Mögliches Profil einer aeroben Vaginitis (AV)',
    summary: 'Basierend auf Ihren Testmarkern und Symptomen. AV ist weniger eindeutig etabliert als BV und sollte vor jeder Behandlung ärztlich beurteilt werden.',
    path: doctorSoon,
    bullets: [
      'Vereinbaren Sie in den nächsten Tagen einen Arzttermin.',
      'Bringen Sie Ihre Testergebnisse zum Termin mit.',
      'Vermeiden Sie bis dahin reizende Produkte und Vaginalduschen.',
    ],
  },
  'AV-MARKERS-ONLY': {
    title: 'Mögliches Profil einer aeroben Vaginitis (AV)',
    summary: 'Ihr AV-Marker ist positiv, Sie haben jedoch keine passenden Symptome angegeben. Vor weiteren Maßnahmen ist eine ärztliche Beurteilung sinnvoll.',
    path: doctorSoon,
    bullets: [
      'Vereinbaren Sie in den nächsten Tagen einen Arzttermin.',
      'Bringen Sie Ihre Testergebnisse zum Termin mit.',
      'Achten Sie auf gelb-grünen Ausfluss, Brennen oder Schmerzen.',
    ],
  },
  'AV-POSSIBLE': {
    title: 'Mögliches Profil einer aeroben Vaginitis (AV)',
    summary: 'Ihr AV-Marker ist grenzwertig. Dies kann bei einer frühen Infektion, während der Abheilung oder nach kürzlicher Antibiotikaeinnahme auftreten.',
    path: 'Empfohlene Maßnahme: erneuter Test oder ärztliche Beratung',
    bullets: [
      'Wiederholen Sie den Test nach 5–7 Tagen und vermeiden Sie vorher Geschlechtsverkehr und reizende Produkte.',
      'Vereinbaren Sie ohne abzuwarten einen Arzttermin, wenn Symptome auftreten oder sich verschlimmern.',
    ],
  },
  'AV-POSSIBLE-SYMPTOMS': {
    title: 'Mögliches Profil einer aeroben Vaginitis (AV)',
    summary: 'Ihre Symptome deuten auf AV hin, die Testmarker sind jedoch unauffällig. Möglicherweise wurde sehr früh getestet oder die Symptome haben eine andere Ursache.',
    path: 'Empfohlene Maßnahme: erneuter Test oder ärztliche Beratung',
    bullets: [
      'Wiederholen Sie den Test nach 5–7 Tagen, wenn die Symptome anhalten.',
      'Vereinbaren Sie früher einen Arzttermin, wenn sich die Symptome verschlimmern.',
    ],
  },

  'TRICH-LIKELY': {
    title: 'Wahrscheinliches Trichomoniasis-Profil',
    summary: 'Trichomoniasis ist eine sexuell übertragbare Infektion, die eine verschreibungspflichtige antibiotische Behandlung für Sie und alle Sexualpartner erfordert. Wenden Sie sich an eine ärztliche Praxis oder STI-Teststelle.',
    path: 'Empfohlene Maßnahme: STI-Teststelle und ärztliche Beratung',
    bullets: [
      'Besuchen Sie zur Bestätigung und Behandlung eine STI-Teststelle oder sexualmedizinische Beratungsstelle.',
      'Alle Sexualpartner der letzten Zeit müssen auch ohne Symptome behandelt werden, um eine Reinfektion zu verhindern.',
      'Lassen Sie sich beim selben Termin auf weitere STI testen.',
      'Vermeiden Sie Geschlechtsverkehr, bis Sie und Ihre Partner die Behandlung abgeschlossen haben.',
    ],
  },
  'TRICH-POSSIBLE': {
    title: 'Mögliches Trichomoniasis-Profil',
    summary: 'Ihr Marker ist bei erhöhtem pH-Wert grenzwertig. Dieses Muster kann auf eine beginnende oder abklingende Trichomoniasis hinweisen. Eine STI-Teststelle kann dies am schnellsten bestätigen.',
    path: stiCentre,
    bullets: [
      'Besuchen Sie zur Bestätigung eine STI-Teststelle oder sexualmedizinische Beratungsstelle.',
      'Vermeiden Sie Geschlechtsverkehr bis zur Bestätigung und Behandlung.',
      'Bei Bestätigung müssen alle Sexualpartner der letzten Zeit ebenfalls behandelt werden.',
    ],
  },
  'TRICH-POSSIBLE-SYMPTOMS': {
    title: 'Mögliches Trichomoniasis-Profil',
    summary: 'Ihre Symptome deuten auf Trichomoniasis hin, die Marker sind jedoch unauffällig. Da Trichomoniasis sexuell übertragen wird, ist eine STI-Teststelle der schnellste direkte Weg zur Bestätigung.',
    path: stiCentre,
    bullets: [
      'Besuchen Sie zur Bestätigung eine STI-Teststelle oder sexualmedizinische Beratungsstelle.',
      'Vermeiden Sie Geschlechtsverkehr bis zur Bestätigung und Behandlung.',
      'Lassen Sie sich beim selben Termin auf weitere STI testen.',
    ],
  },

  'YEAST-LIKELY': {
    title: 'Wahrscheinliches Hefepilzprofil',
    summary: 'Basierend auf Ihren Testmarkern und den angegebenen Symptomen.',
    path: 'Empfohlene Maßnahme: Apotheke – rezeptfreies Antimykotikum',
    bullets: [
      'Beginnen Sie mit einem rezeptfreien Antimykotikum wie Clotrimazol oder Fluconazol; lassen Sie sich in der Apotheke beraten.',
      'Die Symptome sollten sich innerhalb von 3 Tagen bessern. Falls nicht, suchen Sie medizinisches Fachpersonal auf.',
      'Vermeiden Sie während der Behandlung Geschlechtsverkehr, um Reizungen zu reduzieren.',
      'Wiederholen Sie den Test nach 5–7 Tagen, wenn die Symptome anhalten.',
    ],
  },
  'YEAST-ASYMPTOMATIC': {
    title: 'Hefepilz ohne Symptome nachgewiesen',
    summary: 'Hefepilze gehören zum normalen vaginalen Ökosystem. Ohne Symptome ist keine Behandlung erforderlich.',
    path: 'Empfohlene Maßnahme: nur beobachten',
    bullets: [
      'Es ist keine Behandlung erforderlich.',
      'Achten Sie auf Juckreiz, klumpigen Ausfluss oder Brennen und testen Sie bei Auftreten erneut.',
      'Achten Sie auf sanfte Hygiene und vermeiden Sie Vaginalduschen und parfümierte Produkte.',
    ],
  },
  'YEAST-LIKELY-ESCALATION': {
    title: 'Wahrscheinliches Hefepilzprofil – wiederkehrend oder anhaltend',
    summary: 'Beschwerden über mehr als eine Woche oder wiederkehrende Hefepilzinfektionen sollten ärztlich abgeklärt werden und benötigen manchmal eine stärkere oder längere verschreibungspflichtige Behandlung.',
    path: doctorSoon,
    bullets: [
      'Vereinbaren Sie in den nächsten Tagen einen Arzttermin.',
      'Während der Wartezeit kann ein rezeptfreies Antimykotikum verwendet werden; anhaltende oder wiederkehrende Infektionen benötigen jedoch oft eine verschreibungspflichtige Behandlung.',
      'Bringen Sie Ihre Testergebnisse zum Termin mit.',
      'Geben Sie bei wiederkehrenden Beschwerden an, wie oft sie in den letzten 6 Monaten aufgetreten sind.',
    ],
  },
  'YEAST-POSSIBLE': {
    title: 'Mögliches Hefepilzprofil',
    summary: 'Ihr Hefepilzmarker ist grenzwertig. Dies kann bei einer beginnenden oder abklingenden Hefepilzinfektion vorkommen.',
    path: 'Empfohlene Maßnahme: je nach Symptomen Apotheke oder erneuter Test',
    bullets: [
      'Sie können ein rezeptfreies Antimykotikum anwenden; lassen Sie sich in der Apotheke beraten.',
      'Vereinbaren Sie einen Arzttermin, wenn sich die Symptome innerhalb von 3 Tagen nicht bessern.',
    ],
    bulletsAsymptomatic: [
      'Es ist keine Behandlung erforderlich.',
      'Wiederholen Sie den Test nach 5–7 Tagen, wenn Symptome auftreten.',
    ],
  },
  'YEAST-POSSIBLE-SYMPTOMS': {
    title: 'Mögliches Hefepilzprofil',
    summary: 'Ihre Symptome deuten auf eine Hefepilzinfektion hin, die Marker sind jedoch unauffällig. Möglicherweise wurde sehr früh getestet.',
    path: 'Empfohlene Maßnahme: Apotheke (rezeptfreies Antimykotikum)',
    bullets: [
      'Ein rezeptfreies Antimykotikum kann als Erstbehandlung verwendet werden; lassen Sie sich in der Apotheke beraten.',
      'Vereinbaren Sie einen Arzttermin, wenn sich die Symptome innerhalb von 3 Tagen nicht bessern.',
    ],
  },

  'MIXED-BV-AV': {
    title: 'Gemischte Kombination erkannt – bitte erneut ablesen (BV + AV)',
    summary: 'BV- und AV-Marker sind beide positiv. Diese Kombination ist biologisch ungewöhnlich, da BV durch anaerobe und AV durch aerobe Bakterien verursacht wird. Einige Testfarben sind schwer zu unterscheiden; lesen Sie das Ergebnis erneut ab.',
    path: recheck,
    bullets: [
      'Vergleichen Sie den Test bei gutem Licht erneut mit der Farbkarte.',
      'Vereinbaren Sie bei Bestätigung einen Arzttermin für einen Labortest.',
      'Behandeln Sie sich nicht selbst; eine falsche Behandlung kann die andere Erkrankung verschlimmern.',
    ],
  },
  'MIXED-BV-YEAST': {
    title: 'Gemischte Kombination erkannt – bitte erneut ablesen (BV + Hefepilz)',
    summary: 'BV- und Hefepilzmarker sind beide positiv. Diese Kombination ist ungewöhnlich, weil BV einen hohen und Hefepilze einen sauren pH-Wert bevorzugen. Lesen Sie das Ergebnis erneut ab.',
    path: recheck,
    bullets: [
      'Vergleichen Sie den Test bei gutem Licht erneut mit der Farbkarte.',
      'Vereinbaren Sie bei Bestätigung einen Arzttermin für einen Labortest.',
      'Behandeln Sie sich nicht selbst; ein Antimykotikum behandelt keine BV und umgekehrt.',
    ],
  },
  'MIXED-BV-TRICH': {
    title: 'BV- und Trichomoniasis-Marker beide positiv',
    summary: 'BV- und Trichomoniasis-Marker sind beide positiv. Trichomoniasis ist eine sexuell übertragbare Infektion, die verschreibungspflichtig behandelt werden muss.',
    path: stiCentre,
    bullets: [
      'Besuchen Sie zeitnah eine STI-Teststelle oder sexualmedizinische Beratungsstelle.',
      'Alle Sexualpartner der letzten Zeit müssen ebenfalls gegen Trichomoniasis behandelt werden.',
      'Bringen Sie Ihre Testergebnisse zum Termin mit.',
      'Vermeiden Sie Geschlechtsverkehr bis zum Abschluss der Behandlung.',
    ],
  },
  'MIXED-AV-YEAST': {
    title: 'Gemischte Kombination erkannt – bitte erneut ablesen (AV + Hefepilz)',
    summary: 'AV- und Hefepilzmarker sind beide positiv. Diese Kombination ist ungewöhnlich. Einige Testfarben sind schwer zu unterscheiden; lesen Sie das Ergebnis erneut ab.',
    path: recheck,
    bullets: [
      'Vergleichen Sie den Test bei gutem Licht erneut mit der Farbkarte.',
      'Vereinbaren Sie bei Bestätigung einen Arzttermin für einen Labortest.',
      'Behandeln Sie sich nicht selbst.',
    ],
  },
  'MIXED-AV-TRICH': {
    title: 'AV- und Trichomoniasis-Marker beide positiv',
    summary: 'AV- und Trichomoniasis-Marker sind beide positiv. Trichomoniasis ist eine sexuell übertragbare Infektion, die verschreibungspflichtig behandelt werden muss.',
    path: stiCentre,
    bullets: [
      'Besuchen Sie zeitnah eine STI-Teststelle oder sexualmedizinische Beratungsstelle.',
      'Alle Sexualpartner der letzten Zeit müssen ebenfalls gegen Trichomoniasis behandelt werden.',
      'Bringen Sie Ihre Testergebnisse zum Termin mit.',
      'Vermeiden Sie Geschlechtsverkehr bis zum Abschluss der Behandlung.',
    ],
  },

  'POSSIBLE-MIXED': {
    title: 'Mögliches gemischtes Profil',
    summary: 'Mehr als ein Marker ist grenzwertig. Dieses Muster kann in einem frühen oder abklingenden Infektionsstadium oder nach Geschlechtsverkehr, Vaginalduschen oder Zyklusereignissen auftreten.',
    path: 'Empfohlene Maßnahme: erneuter Test oder ärztliche Beratung',
    bullets: [
      'Wiederholen Sie den Test nach 5–7 Tagen und vermeiden Sie vorher Geschlechtsverkehr, Vaginalduschen und parfümierte Produkte.',
      'Vereinbaren Sie ohne abzuwarten einen Arzttermin, wenn Symptome auftreten oder sich verschlimmern.',
    ],
  },
  'POSSIBLE-IRRITATION': {
    title: 'Mögliches Reizungsprofil',
    summary: 'Juckreiz ohne Infektionsmarker nach kürzlicher Verwendung parfümierter oder aggressiver Produkte spricht eher für eine Reizung als für eine Infektion.',
    path: 'Empfohlene Maßnahme: Selbstpflege',
    bullets: [
      'Setzen Sie parfümierte Seifen, Intimtücher, Vaginalduschen und Intimhygieneprodukte ab.',
      'Tragen Sie atmungsaktive Baumwollunterwäsche.',
      'Die Symptome sollten sich innerhalb weniger Tage bessern. Falls nicht, testen Sie erneut oder suchen Sie medizinisches Fachpersonal auf.',
    ],
  },
  'POSSIBLE-SYMPTOMATIC-LE': {
    title: 'Entzündung nachgewiesen – mögliche STI',
    summary: 'Es liegt eine Entzündung ohne spezifisches BV-, AV-, Hefepilz- oder Trichomoniasis-Muster vor. Erhöhte Leukozyten können auf Chlamydien oder eine andere vom Heimtest nicht erkannte STI hinweisen.',
    path: stiCentre,
    bullets: [
      'Besuchen Sie eine STI-Teststelle oder sexualmedizinische Beratungsstelle; Chlamydien und andere STI sind häufige Ursachen.',
      'Vermeiden Sie Geschlechtsverkehr bis zur Abklärung.',
      'Wiederholen Sie den Test nach 5–7 Tagen, wenn keine STI gefunden wird und die Symptome anhalten.',
    ],
  },
  'POSSIBLE-LE-ALONE': {
    title: 'Entzündung ohne Symptome nachgewiesen',
    summary: 'Ihr Test zeigt eine Entzündung ohne spezifisches Infektionsmuster. Eine asymptomatische Entzündung kann auf eine unbemerkte Infektion wie Chlamydien hinweisen.',
    path: 'Empfohlene Maßnahme: STI-Test oder erneuter Test',
    bullets: [
      'Erwägen Sie einen STI-Test; Chlamydien verlaufen häufig ohne Symptome und sind eine häufige Ursache erhöhter Leukozyten ohne andere Marker.',
      'Wiederholen Sie den Test nach 5–7 Tagen.',
      'Lassen Sie sich beraten, wenn Symptome auftreten.',
    ],
  },
  'POSSIBLE-GENERIC': {
    title: 'Mögliches symptomatisches Profil',
    summary: 'Sie haben Symptome, aber Ihr Test zeigt kein spezifisches Infektionsmuster.',
    path: 'Empfohlene Maßnahme: Selbstpflege und Verlaufskontrolle',
    bullets: [
      'Vermeiden Sie reizende Produkte und Vaginalduschen.',
      'Wiederholen Sie den Test nach 5–7 Tagen, wenn die Symptome anhalten.',
      'Vereinbaren Sie einen Arzttermin, wenn sich die Symptome verschlimmern.',
    ],
  },

  'BALANCE-HEALTHY': {
    title: 'Gesundes Gleichgewichtsprofil',
    summary: 'Keine Warnsignale festgestellt.',
    path: 'Empfohlene Maßnahme: Gleichgewicht erhalten',
    bullets: [
      'Setzen Sie Ihre sanfte Hygieneroutine fort und vermeiden Sie Vaginalduschen sowie parfümierte Produkte in der Vagina.',
      'Wiederholen Sie den Test, wenn neue Symptome auftreten.',
    ],
  },
  'BALANCE-IMBALANCE-H2O2': {
    title: 'Mögliches leichtes Ungleichgewicht',
    summary: 'Die Menge Ihrer guten Bakterien scheint geringer als ideal, obwohl kein Infektionsmarker positiv ist. Die Unterstützung der Laktobazillen kann zukünftigen Infektionen vorbeugen.',
    path: 'Empfohlene Maßnahme: Gleichgewicht erhalten',
    bullets: [
      'Achten Sie auf sanfte Hygiene und vermeiden Sie Vaginalduschen und parfümierte Produkte.',
      `Erwägen Sie ein Vaginalprobiotikum mit ${PROBIOTIC_STRAINS}.`,
      'Fragen Sie in der Apotheke nach einem Produkt mit diesen spezifischen Stämmen.',
      'Wiederholen Sie den Test, wenn Symptome auftreten.',
    ],
  },
  'BALANCE-IMBALANCE-PH': {
    title: 'Mögliches leichtes Ungleichgewicht',
    summary: 'Ihr pH-Wert liegt leicht über dem gesunden Bereich, aber kein spezifischer Infektionsmarker ist positiv. Geschlechtsverkehr, das Ende der Menstruation oder Hygieneprodukte können vorübergehende Veränderungen verursachen.',
    path: 'Empfohlene Maßnahme: Gleichgewicht erhalten',
    bullets: [
      'Wiederholen Sie den Test nach 3–5 Tagen und vermeiden Sie vorher Geschlechtsverkehr, Vaginalduschen und parfümierte Produkte.',
      `Erwägen Sie ein Vaginalprobiotikum mit ${PROBIOTIC_STRAINS}.`,
      'Wiederholen Sie den Test, wenn Symptome auftreten.',
    ],
  },
  'BALANCE-IMBALANCE-PHHIGH': {
    title: 'Mögliches leichtes Ungleichgewicht – bitte erneut testen',
    summary: 'Ihr pH-Wert ist erhöht, aber kein spezifischer Marker ist positiv. Dies ist ungewöhnlich; möglicherweise wurde eine sehr frühe Infektion erfasst oder die pH-Ablesung wurde durch kürzliche Ereignisse beeinflusst.',
    path: 'Empfohlene Maßnahme: Gleichgewicht erhalten',
    bullets: [
      'Wiederholen Sie den Test nach 3–5 Tagen zur Bestätigung.',
      'Vermeiden Sie vor dem erneuten Test Vaginalduschen, parfümierte Produkte und ungeschützten Geschlechtsverkehr.',
      'Vereinbaren Sie einen Arzttermin, wenn der pH-Wert erhöht bleibt oder Symptome auftreten.',
    ],
  },
};

export const GERMAN_MODIFIER_TEXTS: Record<ModifierId, string> = {
  'Q5-RECURRENT': 'Wiederkehrende Symptome sollten ärztlich beurteilt werden; möglicherweise ist eine längere oder andere Behandlung erforderlich.',
  'Q5-ANTIBIOTICS': 'Kürzlich eingenommene Antibiotika stören häufig die gesunden Bakterien; Hefepilzinfektionen oder ein Ungleichgewicht sind danach häufig.',
  'Q5-UNPROTECTED-SEX': 'Neue, mehrere oder nicht monogame Sexualpartner erhöhen das STI-Risiko. Ein STI-Test wird empfohlen.',
  'Q5-HYGIENE': 'Diese Produkte stören häufig das natürliche vaginale Gleichgewicht. Setzen Sie sie zunächst ab.',
  'Q5-SWIMSUIT': 'Feuchte, warme Bedingungen begünstigen Hefepilze und andere Bakterien.',
  'Q5-TRAVEL': 'Reisen und Veränderungen der Routine können ein vorübergehendes Ungleichgewicht auslösen.',
  'Q2-PERSISTENT-4-7': 'Seit mehreren Tagen anhaltende Symptome sollten genauer beobachtet werden.',
  'Q2-PERSISTENT-WEEK': 'Symptome, die länger als eine Woche anhalten, sollten medizinisch abgeklärt werden.',
  'Q6-AFTER-PERIOD': 'Testergebnisse direkt nach der Menstruation können weniger zuverlässig sein. Wiederholen Sie einen grenzwertigen Test nach einer Woche.',
  'Q6-BEFORE-PERIOD': 'Hormonelle Veränderungen vor der Menstruation können den Ausfluss verändern. Wiederholen Sie einen unklaren Test nach der Menstruation.',
  'Q7-PREGNANT': 'Sie sind schwanger. Besprechen Sie jede Behandlung vor Beginn mit Ihrer gynäkologischen Praxis oder Hebamme.',
  'Q7-NOT-SURE': 'Wenn eine Schwangerschaft möglich ist, machen Sie vor Beginn einer Behandlung einen Schwangerschaftstest.',
  'F5-SPOTTING': 'Leichte Blutungen rund um die Menstruation sind häufig. Lassen Sie sie abklären, wenn sie anhalten.',
  'F13-RECURRENCE-TRACKING': 'Bei weiteren Wiederholungen ist eine regelmäßige Verlaufskontrolle mit Tests sinnvoll.',
};
