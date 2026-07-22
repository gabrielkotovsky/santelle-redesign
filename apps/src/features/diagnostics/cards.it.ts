import type { CardVariantId, ModifierId } from './types';
import type { CardContent } from './cards';

const PROBIOTIC_STRAINS =
  'Lactobacillus rhamnosus GR-1, L. reuteri B-54 o L. reuteri RC-14';

const doctorSoon = 'Azione raccomandata: consulto medico';
const priorityCare = 'Azione raccomandata: consulto medico urgente';
const stiCentre = 'Azione raccomandata: centro di screening IST';
const recheck = 'Azione raccomandata: rilegga il risultato; se confermato, consulti un medico';

export const ITALIAN_CARDS: Record<CardVariantId, CardContent> = {
  'URGENT-1': {
    title: 'Importante: si rivolga tempestivamente a un medico',
    summary: 'Febbre o forte dolore pelvico associati a sintomi vaginali possono indicare un’infezione più grave, come la malattia infiammatoria pelvica (PID).',
    path: priorityCare,
    bullets: [
      'Consulti un medico entro 24–48 ore, prima se i sintomi peggiorano.',
      'Eviti l’autotrattamento da banco fino alla valutazione medica.',
      'Annoti i sintomi (momento di insorgenza, intensità, perdite) da riportare al consulto.',
    ],
  },
  'URGENT-2': {
    title: 'Gravidanza e segni di infezione — è necessaria una valutazione medica urgente',
    summary: 'La vaginosi batterica in gravidanza è un importante fattore di rischio per travaglio prematuro e parto pretermine. Qualsiasi segno di infezione in gravidanza richiede una valutazione medica tempestiva, con o senza sintomi.',
    path: priorityCare,
    bullets: [
      'Contatti il ginecologo o l’ostetrica entro 24–48 ore.',
      'Non inizi alcun trattamento da banco senza il parere di un medico durante la gravidanza.',
      'Porti i risultati del test al consulto.',
    ],
  },
  'URGENT-3': {
    title: 'Sanguinamento durante i rapporti sessuali — richieda una valutazione medica',
    summary: 'Il sanguinamento durante o dopo i rapporti sessuali è uno dei segni più comuni di clamidia, un’infezione sessualmente trasmissibile che questo test domiciliare non è in grado di rilevare. Un centro di screening IST o un ambulatorio di salute sessuale è solitamente più rapido e diretto rispetto a un appuntamento ginecologico.',
    path: priorityCare,
    bullets: [
      'Si rivolga presto a un centro di screening IST o a un ambulatorio di salute sessuale.',
      'Annoti quando si è verificato il sanguinamento, la quantità e se si ripete.',
      'Un medico può escludere cause cervicali o altre cause che il kit non è in grado di rilevare.',
    ],
  },
  'URGENT-4': {
    title: 'Sanguinamento fuori ciclo — si rivolga a un medico',
    summary: 'Un sanguinamento al di fuori del normale ciclo richiede una valutazione medica. Un centro di screening IST è il primo passo più rapido se si sospetta una causa sessualmente trasmissibile.',
    path: priorityCare,
    bullets: [
      'Fissi presto un appuntamento medico o si rivolga a un centro di screening IST.',
      'Annoti quando è iniziato il sanguinamento e le sue caratteristiche.',
      'Eviti l’autotrattamento da banco fino alla valutazione medica.',
    ],
  },
  'URGENT-5': {
    title: 'Tre marcatori di infezione positivi — rilegga il risultato e consulti un medico',
    summary: 'Tre marcatori di infezione positivi contemporaneamente sono biologicamente molto inusuali. Alcuni colori del test possono essere difficili da distinguere, soprattutto in condizioni di scarsa luce o dopo la finestra dei 15 minuti. Si raccomanda di rileggere il risultato confrontandolo con la tabella colori e, se confermato, di consultare un medico.',
    path: priorityCare,
    bullets: [
      'Rilegga il risultato del test confrontandolo con la tabella colori in buona luce.',
      'Se il risultato è confermato, fissi presto un consulto medico.',
      'Porti i risultati del test all’appuntamento.',
      'Eviti l’autotrattamento, che potrebbe mascherare una condizione mentre si tratta un’altra.',
    ],
  },

  'BV-LIKELY-PHARMACY': {
    title: 'Profilo probabile di vaginosi batterica (VB)',
    summary: 'In base ai marcatori del test e ai sintomi riportati. La combinazione di un marcatore di vaginosi batterica (in precedenza Gardnerella) elevato e sintomi corrispondenti offre un quadro sufficientemente chiaro perché un farmacista possa consigliare un trattamento.',
    path: 'Azione raccomandata: farmacia — antibiotici su prescrizione',
    bullets: [
      'Mostri i risultati al farmacista, che potrà consigliare antibiotici su prescrizione (come clindamicina topica o metronidazolo orale).',
      'Completi l’intero ciclo di trattamento, anche se i sintomi migliorano rapidamente.',
      'Eviti i rapporti sessuali durante il trattamento per ridurre il rischio di reinfezione e irritazione.',
      `Dopo il trattamento, consideri un probiotico vaginale con ${PROBIOTIC_STRAINS}: esistono evidenze che questi ceppi aiutino a prevenire le recidive di VB.`,
      'Ripeta il test 2–3 settimane dopo il completamento del trattamento per confermare la risoluzione.',
    ],
  },
  'BV-MARKERS-ONLY': {
    title: 'Profilo probabile di vaginosi batterica (VB)',
    summary: 'Il marcatore di vaginosi batterica (in precedenza Gardnerella) è positivo, ma non sono stati riportati sintomi corrispondenti. Anche una VB asintomatica può beneficiare di una valutazione medica, e si raccomanda una conferma medica prima di iniziare qualsiasi trattamento.',
    path: doctorSoon,
    bullets: [
      'Fissi un appuntamento medico nei prossimi giorni.',
      'Porti i risultati del test all’appuntamento.',
      'Presti attenzione a eventuali nuovi sintomi (odore di pesce, perdite grigie, prurito) e annoti quando compaiono.',
    ],
  },
  'BV-LIKELY-ESCALATION': {
    title: 'Profilo probabile di vaginosi batterica (VB) — ricorrente o persistente',
    summary: 'In base ai marcatori del test e ai sintomi riportati. Sintomi persistenti (oltre una settimana), VB ricorrente o incertezza riguardo a una possibile gravidanza rendono la valutazione medica la scelta più sicura. La VB ricorrente richiede spesso un trattamento più lungo o diverso rispetto a un singolo ciclo di antibiotici.',
    path: doctorSoon,
    bullets: [
      'Fissi un appuntamento medico nei prossimi giorni.',
      'Porti i risultati del test, indicando anche eventuali episodi precedenti di VB, se noti.',
      'In caso di incertezza su una possibile gravidanza, effettui un test di gravidanza prima di qualsiasi trattamento.',
      `Dopo il trattamento, consideri un probiotico vaginale con ${PROBIOTIC_STRAINS} per ridurre il rischio di recidiva.`,
    ],
  },
  'BV-POSSIBLE': {
    title: 'Profilo possibile di vaginosi batterica (VB)',
    summary: 'Il marcatore di vaginosi batterica (in precedenza Gardnerella) è borderline, né chiaramente positivo né chiaramente negativo. Ciò può accadere nelle fasi molto iniziali o di guarigione della VB, oppure dopo rapporti sessuali recenti, lavaggi vaginali interni o eventi legati al ciclo.',
    path: 'Azione raccomandata: consulto medico o nuovo test',
    bullets: [
      'Ripeta il test dopo 5–7 giorni, evitando prima rapporti sessuali, lavaggi vaginali interni e prodotti profumati.',
      'Se compaiono o peggiorano i sintomi, fissi subito un appuntamento medico senza attendere.',
    ],
  },
  'BV-POSSIBLE-SYMPTOMS': {
    title: 'Profilo possibile di vaginosi batterica (VB)',
    summary: 'I sintomi suggeriscono una vaginosi batterica (in precedenza Gardnerella), ma i marcatori del test sono negativi. Il test potrebbe aver rilevato l’infezione troppo precocemente, oppure i sintomi potrebbero avere un’altra causa.',
    path: 'Azione raccomandata: consulto medico o nuovo test',
    bullets: [
      'Ripeta il test dopo 5–7 giorni se i sintomi persistono.',
      'Se i sintomi peggiorano prima di allora, fissi un appuntamento medico.',
      'Eviti prodotti profumati e lavaggi vaginali interni, che possono mascherare o peggiorare i sintomi.',
    ],
  },

  'AV-LIKELY': {
    title: 'Profilo possibile di vaginite aerobica (VA)',
    summary: 'In base ai marcatori del test e ai sintomi riportati. La vaginite aerobica (VA) è una condizione meno consolidata rispetto alla VB e beneficia di una valutazione medica prima di qualsiasi trattamento.',
    path: doctorSoon,
    bullets: [
      'Fissi un appuntamento medico nei prossimi giorni.',
      'Porti i risultati del test all’appuntamento.',
      'Eviti nel frattempo prodotti irritanti e lavaggi vaginali interni.',
    ],
  },
  'AV-MARKERS-ONLY': {
    title: 'Profilo possibile di vaginite aerobica (VA)',
    summary: 'Il marcatore di vaginite aerobica (VA) è positivo, ma non sono stati riportati sintomi corrispondenti. Una valutazione medica è il passo successivo più indicato prima di qualsiasi intervento.',
    path: doctorSoon,
    bullets: [
      'Fissi un appuntamento medico nei prossimi giorni.',
      'Porti i risultati del test all’appuntamento.',
      'Presti attenzione a eventuali nuovi sintomi (perdite giallo-verdastre, bruciore, dolore) e annoti quando compaiono.',
    ],
  },
  'AV-POSSIBLE': {
    title: 'Profilo possibile di vaginite aerobica (VA)',
    summary: 'Il marcatore di vaginite aerobica (VA) è borderline. Ciò può accadere nelle fasi iniziali dell’infezione, durante la guarigione o dopo una recente assunzione di antibiotici.',
    path: 'Azione raccomandata: nuovo test o consulto medico',
    bullets: [
      'Ripeta il test dopo 5–7 giorni, evitando prima rapporti sessuali e prodotti irritanti.',
      'Se compaiono o peggiorano i sintomi, fissi subito un appuntamento medico senza attendere.',
    ],
  },
  'AV-POSSIBLE-SYMPTOMS': {
    title: 'Profilo possibile di vaginite aerobica (VA)',
    summary: 'I sintomi suggeriscono una vaginite aerobica (VA), ma i marcatori del test sono negativi. Il test potrebbe aver rilevato l’infezione troppo precocemente, oppure i sintomi potrebbero avere un’altra causa.',
    path: 'Azione raccomandata: nuovo test o consulto medico',
    bullets: [
      'Ripeta il test dopo 5–7 giorni se i sintomi persistono.',
      'Se i sintomi peggiorano prima di allora, fissi un appuntamento medico.',
    ],
  },

  'TRICH-LIKELY': {
    title: 'Profilo probabile di trichomoniasi',
    summary: 'In base ai marcatori del test. La trichomoniasi è un’infezione sessualmente trasmissibile che richiede un trattamento antibiotico su prescrizione per la paziente e per tutti i partner sessuali. Un medico o un centro di screening IST rappresentano il passo successivo più indicato.',
    path: 'Azione raccomandata: centro di screening IST + consulto medico',
    bullets: [
      'Si rivolga a un centro di screening IST o a un ambulatorio di salute sessuale per confermare la diagnosi e iniziare il trattamento.',
      'Tutti i partner sessuali recenti devono essere trattati, anche in assenza di sintomi, per prevenire la reinfezione.',
      'Effettui uno screening per altre infezioni sessualmente trasmissibili nella stessa visita: la trichomoniasi è un indicatore di possibile co-infezione.',
      'Eviti i rapporti sessuali finché lei e i suoi partner non hanno completato il trattamento.',
    ],
  },
  'TRICH-POSSIBLE': {
    title: 'Profilo possibile di trichomoniasi',
    summary: 'Il marcatore è borderline con pH elevato: questo quadro può indicare una trichomoniasi iniziale o in via di guarigione. Poiché la trichomoniasi è un’infezione sessualmente trasmissibile, un centro di screening IST è il modo più rapido per ottenere una conferma.',
    path: stiCentre,
    bullets: [
      'Si rivolga a un centro di screening IST o a un ambulatorio di salute sessuale per una conferma.',
      'Eviti i rapporti sessuali fino alla conferma e al trattamento.',
      'In caso di conferma, anche tutti i partner sessuali recenti devono essere trattati.',
    ],
  },
  'TRICH-POSSIBLE-SYMPTOMS': {
    title: 'Profilo possibile di trichomoniasi',
    summary: 'I sintomi suggeriscono una trichomoniasi, ma i marcatori sono negativi. Poiché la trichomoniasi è un’infezione sessualmente trasmissibile, un centro di screening IST è il modo più rapido e diretto per ottenere una conferma.',
    path: stiCentre,
    bullets: [
      'Si rivolga a un centro di screening IST o a un ambulatorio di salute sessuale per una conferma.',
      'Eviti i rapporti sessuali fino alla conferma e al trattamento.',
      'Effettui uno screening per altre infezioni sessualmente trasmissibili nella stessa visita.',
    ],
  },

  'YEAST-LIKELY': {
    title: 'Profilo probabile di infezione da lieviti',
    summary: 'In base ai marcatori del test e ai sintomi riportati.',
    path: 'Azione raccomandata: farmacia — antimicotico da banco',
    bullets: [
      'Inizi un antimicotico da banco (come clotrimazolo o fluconazolo): chieda consiglio al farmacista per il prodotto più adatto.',
      'I sintomi dovrebbero migliorare entro 3 giorni; in caso contrario, consulti un medico.',
      'Eviti i rapporti sessuali durante il trattamento per ridurre l’irritazione.',
      'Ripeta il test dopo 5–7 giorni se i sintomi persistono.',
    ],
  },
  'YEAST-ASYMPTOMATIC': {
    title: 'Lieviti rilevati senza sintomi',
    summary: 'I lieviti fanno normalmente parte dell’ecosistema vaginale. In assenza di sintomi non è necessario alcun trattamento.',
    path: 'Azione raccomandata: solo osservazione',
    bullets: [
      'Non è necessario alcun trattamento.',
      'Presti attenzione a eventuali sintomi (prurito, perdite grumose, bruciore) e ripeta il test se compaiono.',
      'Mantenga un’igiene delicata ed eviti lavaggi vaginali interni e prodotti profumati.',
    ],
  },
  'YEAST-LIKELY-ESCALATION': {
    title: 'Profilo probabile di infezione da lieviti — ricorrente o persistente',
    summary: 'In base ai marcatori del test e ai sintomi riportati. Sintomi che durano più di una settimana o infezioni da lieviti ricorrenti richiedono spesso una valutazione medica e talvolta un trattamento su prescrizione più forte o più lungo.',
    path: doctorSoon,
    bullets: [
      'Fissi un appuntamento medico nei prossimi giorni.',
      'Nel frattempo può utilizzare un antimicotico da banco, ma le infezioni da lieviti persistenti o ricorrenti richiedono spesso un trattamento su prescrizione.',
      'Porti i risultati del test all’appuntamento.',
      'In caso di recidiva, indichi la frequenza degli episodi negli ultimi 6 mesi.',
    ],
  },
  'YEAST-POSSIBLE': {
    title: 'Profilo possibile di infezione da lieviti',
    summary: 'Il marcatore dei lieviti è borderline. Ciò può accadere nelle fasi iniziali o di guarigione di un’infezione da lieviti.',
    path: 'Azione raccomandata: farmacia o nuovo test in base ai sintomi',
    bullets: [
      'Può iniziare un antimicotico da banco: chieda consiglio al farmacista.',
      'Se i sintomi non migliorano entro 3 giorni, fissi un appuntamento medico.',
    ],
    bulletsAsymptomatic: [
      'Non è necessario alcun trattamento.',
      'Ripeta il test dopo 5–7 giorni se compaiono sintomi.',
    ],
  },
  'YEAST-POSSIBLE-SYMPTOMS': {
    title: 'Profilo possibile di infezione da lieviti',
    summary: 'I sintomi suggeriscono un’infezione da lieviti, ma i marcatori sono negativi. Il test potrebbe aver rilevato l’infezione troppo precocemente.',
    path: 'Azione raccomandata: farmacia (antimicotico da banco)',
    bullets: [
      'Un antimicotico da banco può essere utilizzato come primo trattamento: chieda consiglio al farmacista.',
      'Se i sintomi non migliorano entro 3 giorni, fissi un appuntamento medico.',
    ],
  },

  'MIXED-BV-AV': {
    title: 'Combinazione mista rilevata — rilegga il risultato (VB + VA)',
    summary: 'I marcatori di vaginosi batterica (in precedenza Gardnerella) e di vaginite aerobica risultano entrambi positivi. Questa combinazione è biologicamente inusuale, poiché la VB è causata da batteri anaerobi mentre la VA è di natura aerobica. Alcuni colori del test possono essere difficili da distinguere: si raccomanda quindi di rileggere il risultato.',
    path: recheck,
    bullets: [
      'Rilegga il test confrontandolo con la tabella colori in buona luce.',
      'Se il risultato è confermato, fissi un appuntamento medico per un esame di laboratorio.',
      'Non si autotratti: trattare la condizione sbagliata può peggiorare l’altra.',
    ],
  },
  'MIXED-BV-YEAST': {
    title: 'Combinazione mista rilevata — rilegga il risultato (VB + lieviti)',
    summary: 'I marcatori di vaginosi batterica (in precedenza Gardnerella) e di lieviti risultano entrambi positivi. Questa combinazione è biologicamente inusuale, poiché la VB prospera con pH elevato mentre i lieviti prosperano con pH acido. Alcuni colori del test possono essere difficili da distinguere: si raccomanda di rileggere il risultato.',
    path: recheck,
    bullets: [
      'Rilegga il test confrontandolo con la tabella colori in buona luce.',
      'Se il risultato è confermato, fissi un appuntamento medico per un esame di laboratorio.',
      'Non si autotratti: un antimicotico da banco da solo non tratta la componente di VB, e viceversa.',
    ],
  },
  'MIXED-BV-TRICH': {
    title: 'Marcatori di VB e trichomoniasi entrambi positivi',
    summary: 'I marcatori di vaginosi batterica (in precedenza Gardnerella) e di trichomoniasi sono entrambi positivi. La trichomoniasi è un’infezione sessualmente trasmissibile che richiede un trattamento su prescrizione: un centro di screening IST è il passo successivo più indicato.',
    path: stiCentre,
    bullets: [
      'Si rivolga presto a un centro di screening IST o a un ambulatorio di salute sessuale.',
      'Anche tutti i partner sessuali recenti devono essere trattati per la trichomoniasi.',
      'Porti i risultati del test all’appuntamento.',
      'Eviti i rapporti sessuali fino al completamento del trattamento.',
    ],
  },
  'MIXED-AV-YEAST': {
    title: 'Combinazione mista rilevata — rilegga il risultato (VA + lieviti)',
    summary: 'I marcatori di vaginite aerobica e di lieviti risultano entrambi positivi. Questa combinazione è inusuale. Alcuni colori del test possono essere difficili da distinguere: si raccomanda di rileggere il risultato.',
    path: recheck,
    bullets: [
      'Rilegga il test confrontandolo con la tabella colori in buona luce.',
      'Se il risultato è confermato, fissi un appuntamento medico per un esame di laboratorio.',
      'Non si autotratti.',
    ],
  },
  'MIXED-AV-TRICH': {
    title: 'Marcatori di VA e trichomoniasi entrambi positivi',
    summary: 'I marcatori di vaginite aerobica e di trichomoniasi sono entrambi positivi. La trichomoniasi è un’infezione sessualmente trasmissibile che richiede un trattamento su prescrizione.',
    path: stiCentre,
    bullets: [
      'Si rivolga presto a un centro di screening IST o a un ambulatorio di salute sessuale.',
      'Anche tutti i partner sessuali recenti devono essere trattati per la trichomoniasi.',
      'Porti i risultati del test all’appuntamento.',
      'Eviti i rapporti sessuali fino al completamento del trattamento.',
    ],
  },

  'POSSIBLE-MIXED': {
    title: 'Profilo possibile misto',
    summary: 'Più di un marcatore è borderline. Questo quadro può manifestarsi nelle fasi iniziali o di guarigione di un’infezione, oppure dopo rapporti sessuali recenti, lavaggi vaginali interni o eventi legati al ciclo.',
    path: 'Azione raccomandata: nuovo test o consulto medico',
    bullets: [
      'Ripeta il test dopo 5–7 giorni, evitando prima rapporti sessuali, lavaggi vaginali interni e prodotti profumati.',
      'Se compaiono o peggiorano i sintomi, fissi subito un appuntamento medico senza attendere.',
    ],
  },
  'POSSIBLE-IRRITATION': {
    title: 'Profilo possibile di irritazione',
    summary: 'Il prurito in assenza di marcatori di infezione, insieme all’uso recente di prodotti profumati o aggressivi, suggerisce un’irritazione piuttosto che un’infezione.',
    path: 'Azione raccomandata: autogestione',
    bullets: [
      'Interrompa l’uso di saponi profumati, salviette, lavaggi vaginali interni e prodotti per l’igiene intima.',
      'Indossi biancheria intima di cotone traspirante.',
      'I sintomi dovrebbero migliorare entro pochi giorni. In caso contrario, ripeta il test o consulti un medico.',
    ],
  },
  'POSSIBLE-SYMPTOMATIC-LE': {
    title: 'Infiammazione rilevata — possibile IST',
    summary: 'È presente infiammazione senza un quadro specifico di VB / VA / lieviti / trichomoniasi. Leucociti elevati possono indicare clamidia o un’altra infezione sessualmente trasmissibile che questo test domiciliare non è in grado di rilevare.',
    path: stiCentre,
    bullets: [
      'Si rivolga a un centro di screening IST o a un ambulatorio di salute sessuale: la clamidia e altre infezioni sessualmente trasmissibili sono cause comuni.',
      'Eviti i rapporti sessuali fino alla valutazione medica.',
      'Ripeta il test dopo 5–7 giorni se non viene riscontrata alcuna IST e i sintomi persistono.',
    ],
  },
  'POSSIBLE-LE-ALONE': {
    title: 'Infiammazione rilevata senza sintomi',
    summary: 'Il test mostra infiammazione senza un quadro di infezione specifico. Un’infiammazione asintomatica può indicare un’infezione silente, come la clamidia.',
    path: 'Azione raccomandata: screening IST o nuovo test',
    bullets: [
      'Consideri uno screening IST: la clamidia è spesso silente ed è la causa più comune di leucociti elevati in assenza di altri marcatori.',
      'Ripeta il test dopo 5–7 giorni.',
      'Consulti un medico se compaiono sintomi.',
    ],
  },
  'POSSIBLE-GENERIC': {
    title: 'Profilo possibile sintomatico',
    summary: 'Sono presenti sintomi, ma il test non mostra un quadro di infezione specifico.',
    path: 'Azione raccomandata: autogestione e controllo successivo',
    bullets: [
      'Eviti prodotti irritanti e lavaggi vaginali interni.',
      'Ripeta il test dopo 5–7 giorni se i sintomi persistono.',
      'Se i sintomi peggiorano, fissi un appuntamento medico.',
    ],
  },

  'BALANCE-HEALTHY': {
    title: 'Profilo di equilibrio sano',
    summary: 'Nessun segnale di allarme rilevato.',
    path: 'Azione raccomandata: mantenimento dell’equilibrio',
    bullets: [
      'Continui la routine di mantenimento: igiene delicata, nessun lavaggio vaginale interno, nessun prodotto profumato all’interno della vagina.',
      'Ripeta il test se compaiono nuovi sintomi.',
    ],
  },
  'BALANCE-IMBALANCE-H2O2': {
    title: 'Profilo possibile di lieve squilibrio',
    summary: 'I batteri buoni risultano inferiori al livello ideale, anche se nessun marcatore di infezione è positivo. Sostenere i lattobacilli ora può contribuire a prevenire future infezioni.',
    path: 'Azione raccomandata: mantenimento dell’equilibrio',
    bullets: [
      'Continui con un’igiene delicata ed eviti lavaggi vaginali interni e prodotti profumati.',
      `Consideri un probiotico vaginale con ceppi supportati da evidenze di livello 1: ${PROBIOTIC_STRAINS}. L’assunzione orale quotidiana ha mostrato una riduzione delle recidive di infezione superiore al 50%; l’uso vaginale settimanale fino al 79%.`,
      'Chieda al farmacista un prodotto contenente questi ceppi specifici, con rivestimento gastroresistente per le formulazioni orali.',
      'Ripeta il test se compaiono sintomi.',
    ],
  },
  'BALANCE-IMBALANCE-PH': {
    title: 'Profilo possibile di lieve squilibrio',
    summary: 'Il pH è leggermente superiore all’intervallo sano, ma nessun marcatore di infezione specifico è positivo. Rapporti sessuali recenti, la fine del ciclo mestruale o prodotti per l’igiene possono causare variazioni temporanee.',
    path: 'Azione raccomandata: mantenimento dell’equilibrio',
    bullets: [
      'Ripeta il test dopo 3–5 giorni, evitando prima rapporti sessuali, lavaggi vaginali interni e prodotti profumati.',
      `Consideri un probiotico vaginale con ${PROBIOTIC_STRAINS}.`,
      'Ripeta il test se compaiono sintomi.',
    ],
  },
  'BALANCE-IMBALANCE-PHHIGH': {
    title: 'Profilo possibile di lieve squilibrio — ripeta il test',
    summary: 'Il pH è elevato, ma nessun marcatore specifico è positivo. Si tratta di una situazione inusuale: il test potrebbe aver rilevato un’infezione molto precoce, oppure la lettura del pH potrebbe essere influenzata da eventi recenti.',
    path: 'Azione raccomandata: mantenimento dell’equilibrio',
    bullets: [
      'Ripeta il test dopo 3–5 giorni per confermare.',
      'Eviti lavaggi vaginali interni, prodotti profumati e rapporti sessuali non protetti prima di ripetere il test.',
      'Fissi un appuntamento medico se i risultati restano elevati o compaiono sintomi.',
    ],
  },
};

export const ITALIAN_MODIFIER_TEXTS: Record<ModifierId, string> = {
  'Q5-RECURRENT': 'Sintomi ricorrenti richiedono spesso una valutazione medica: può essere necessario un trattamento più lungo o diverso.',
  'Q5-ANTIBIOTICS': 'L’assunzione recente di antibiotici altera spesso i batteri sani: infezioni da lieviti o squilibri sono comuni dopo l’uso di antibiotici.',
  'Q5-UNPROTECTED-SEX': 'Partner nuovi, multipli o non monogami aumentano il rischio di infezioni sessualmente trasmissibili. Si raccomanda uno screening IST.',
  'Q5-HYGIENE': 'Questi prodotti alterano spesso l’equilibrio vaginale naturale: interromperne l’uso è il primo passo.',
  'Q5-SWIMSUIT': 'Le condizioni umide e calde favoriscono i lieviti e altri batteri.',
  'Q5-TRAVEL': 'I viaggi e i cambiamenti di routine spesso innescano uno squilibrio temporaneo.',
  'Q2-PERSISTENT-4-7': 'Sintomi che persistono per diversi giorni meritano un monitoraggio più attento.',
  'Q2-PERSISTENT-WEEK': 'Sintomi che durano più di una settimana devono essere valutati da un medico.',
  'Q6-AFTER-PERIOD': 'I risultati del test subito dopo il ciclo possono essere meno affidabili: ripeta un test borderline dopo una settimana.',
  'Q6-BEFORE-PERIOD': 'I cambiamenti ormonali prima del ciclo possono modificare le perdite: ripeta un test poco chiaro dopo il ciclo.',
  'Q7-PREGNANT': 'È in gravidanza: discuta qualsiasi trattamento con il ginecologo o l’ostetrica prima di iniziarlo.',
  'Q7-NOT-SURE': 'Se esiste la possibilità di una gravidanza, effettui un test di gravidanza prima di iniziare qualsiasi trattamento.',
  'F5-SPOTTING': 'Le perdite di sangue leggere intorno al ciclo sono comuni; se persistono, consulti un medico.',
  'F13-RECURRENCE-TRACKING': 'In caso di ulteriori recidive, conviene monitorare la situazione con test regolari.',
};
