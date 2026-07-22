/**
 * Italian copy for Learn articles, keyed by stable Supabase slug.
 * Mirrors the German app-overlay pattern (see german.ts) until
 * title_italian / subtitle_italian / content_md_italian columns are
 * populated in Supabase.
 */

export type ItalianArticleCopy = {
  title: string;
  subtitle: string;
  content_md: string;
};

export const ITALIAN_ARTICLES: Record<string, ItalianArticleCopy> = {
  learn_about_your_biomarkers: {
    title: 'Scopri di pi\u00f9 sui tuoi biomarcatori',
    subtitle: 'Scopri come interpretare ciascuno dei tuoi biomarcatori.',
    content_md: `### Potenziale idrogeno
**pH** misura quanto \u00e8 acida la tua vagina. Una vagina sana \u00e8 leggermente acida, il che aiuta a bloccare le infezioni. Quando il pH aumenta, di solito significa che batteri o parassiti indesiderati stanno prendendo il sopravvento.

### Perossido di idrogeno
**H\u2082O\u2082** misura la protezione naturale prodotta dai batteri buoni (lattobacilli). Se i livelli sono bassi, significa che questi batteri "di guardia" non mantengono l'equilibrio come dovrebbero.

### Esterasi leucocitaria
**LE** misura l'attivit\u00e0 dei globuli bianchi. Sono gli aiutanti naturali del tuo corpo; un'attivit\u00e0 pi\u00f9 elevata pu\u00f2 indicare che stanno reagendo a qualcosa.

### Sialidasi
**SNA** misura un enzima legato ai batteri che causano la vaginosi batterica (VB). La sua presenza pu\u00f2 indicare che la VB \u00e8 la causa dei tuoi sintomi.

### Beta-glucuronidasi
**\u03b2-G** misura un enzima legato alla proliferazione batterica o fungina. Indica quando sono presenti "troppi microbi sbagliati".

### N-acetil-\u03b2-D-glucosaminidasi
**NAG** misura i segni di una lieve irritazione della mucosa vaginale, aiutando a individuare quando il tuo tessuto \u00e8 sotto stress.

## Sources:

Feng, D., Zhang, F., Cai, J., Zhang, Y., Yan, H., Yang, Y., Zhong, H., & Ye, H. (2024). Functional testing is a complementary tool for the diagnosis of vaginitis. BMC Women\u2019s Health, 24, 224

O\u2019Hanlon, D. E., Moench, T. R., & Cone, R. A. (2013).
Vaginal pH and microbicidal lactic acid when Lactobacilli dominate the microbiota. PLoS ONE, 8(11), e80074.
https://doi.org/10.1371/journal.pone.0080074

Chen, L., Li, J., & Xiao, B. (2024).
The role of sialidases in the pathogenesis of bacterial vaginosis and their use as a promising pharmacological target in bacterial vaginosis. Frontiers in Cellular and Infection Microbiology, 14, 1367233. https://www.frontiersin.org/journals/cellular-and-infection-microbiology/articles/10.3389/fcimb.2024.1367233/full`,
  },

  otc_products_that_can_help_your_microbiome: {
    title: 'Prodotti da banco che possono aiutare il tuo microbioma vaginale',
    subtitle:
      'Un microbioma equilibrato protegge dalle infezioni e mantiene forti le difese del tuo corpo.',
    content_md: `## Perch\u00e9 il tuo microbioma vaginale \u00e8 importante

Il tuo microbioma vaginale \u00e8 composto da miliardi di batteri, soprattutto **Lactobacillus**. Questi batteri producono acido lattico, che mantiene il pH vaginale leggermente acido (3,8\u20134,5). Questa acidit\u00e0 impedisce la crescita di germi dannosi e riduce il rischio di infezioni come la vaginosi batterica (VB), la candidosi o anche le infezioni delle vie urinarie.

Ma l'equilibrio \u00e8 delicato. Antibiotici, stress, cambiamenti hormonali, i rapporti sessuali o anche il ciclo mestruale possono alterarlo. In questi casi, alcuni prodotti da banco (OTC) possono aiutare a ripristinare la stabilit\u00e0 e prevenire problemi ricorrenti.

## Prodotti da banco che possono aiutare il tuo microbioma

### 1. Probiotici
I probiotici sono tra le opzioni OTC pi\u00f9 studiate per la salute vaginale.
* **Come aiutano:** alcuni ceppi specifici di *Lactobacillus* (come *L. rhamnosus GR-1* e *L. reuteri RC-14*) possono colonizzare la vagina e ripristinare l'acidit\u00e0.
* **Formati:** disponibili come capsule orali, capsule vaginali o ovuli.
* **Evidenze:** gli studi dimostrano che i probiotici possono ridurre le recidive di VB e migliorare la flora vaginale dopo un trattamento antibiotico. Una revisione ha rilevato una riduzione delle recidive di VB fino al 45% rispetto al placebo.
* **Consiglio:** scegli probiotici pensati specificamente per la salute vaginale o urogenitale \u2013 i probiotici intestinali generici potrebbero non contenere i ceppi corretti.

### 2. Gel e detergenti riequilibranti del pH
La vagina mantiene naturalmente un pH leggermente acido per tenere i batteri in equilibrio, ma stress, antibiotici o cambiamenti hormonali possono alterarlo. I gel e i detergenti riequilibranti del pH possono aiutare a ripristinare questa acidit\u00e0 naturale e a prevenire la proliferazione di batteri dannosi.
* **Come aiutano:** se il pH vaginale supera 4,5, i batteri dannosi possono proliferare pi\u00f9 facilmente. I gel OTC a base di acido lattico possono riportare l'acidit\u00e0 a valori normali.
* **Quando usarli:** dopo un ciclo di antibiotici, in presenza di odore o perdite inusuali, o quando il medico li consiglia come supporto tra un trattamento e l'altro.
* **Attenzione:** evita saponi profumati o detergenti per "igiene intima". Spesso rimuovono la flora naturale e peggiorano lo squilibrio.

### 3. Creme idratanti e ovuli vaginali
* **Come aiutano:** secchezza e irritazione rendono la vagina pi\u00f9 vulnerabile agli squilibri. I prodotti idratanti a base di acido ialuronico o acido lattico possono idratare i tessuti sostenendo al contempo i batteri buoni.
* **Opzioni:** ovuli vaginali OTC con probiotici o acido lattico. Alcuni combinano idratazione e supporto al microbioma.
* **Evidenze:** gli studi suggeriscono che gli ovuli a base di acido lattico, se usati regolarmente, possono migliorare il confort e ridurre le recidive di VB.

## Prodotti da banco che non aiutano \u2013 e che possono danneggiare
La secchezza vaginale non \u00e8 solo fastidiosa: pu\u00f2 rendere l'ambiente vaginale pi\u00f9 vulnerabile agli squilibri. I prodotti idratanti e gli ovuli pensati per uso vaginale aiutano a mantenere i tessuti idratati e a sostenere un microbioma sano.
* **Lavande vaginali**: fortemente sconsigliate da OMS, CDC e ginecologi di tutto il mondo. Alterano la flora naturale e **aumentano il rischio di VB e malattia infiammatoria pelvica**.
* **Salviette profumate o spray deodoranti**: mascherano l'odore ma disturbano il microbioma.
* **Detergenti "purificanti" contro l'odore**: la maggior parte contiene sostanze che eliminano i batteri protettivi invece di sostenerli.

Considera la tua vagina come un organo autopulente: non ha bisogno di aiuto extra per restare "fresca". Sostenere il microbioma significa mantenere l'equilibrio, non lavare via tutto.

## Quando consultare un medico

I prodotti OTC sono di supporto, ma non trattano le infezioni.
Cerca assistenza medica se noti:
* Prurito, bruciore o dolore persistenti
* Odore forte, simile a pesce o lievito
* Perdite verdastre o schiumose
* Infezioni ricorrenti nonostante il supporto OTC

Questi sintomi possono richiedere un trattamento su prescrizione.

## Sostenere il microbioma in modo naturale

* Indossa biancheria intima traspirante (il cotone \u00e8 la scelta migliore).
* Evita antibiotici non necessari.
* Osserva i cambiamenti delle perdite e del pH: i tuoi pattern raccontano molto.
* Usa probiotici OTC o prodotti riequilibranti del pH come supporto, non come sostituto delle cure mediche.

Il tuo microbioma \u00e8 resiliente. Con il supporto giusto, spesso si ristabilisce rapidamente. I prodotti OTC possono far parte dei tuoi strumenti \u2013 ma la tua attenzione e la cura quotidiana contano altrettanto.

## Sources:
Kalia, N., Singh, J., & Kaur, M. (2020).
Microbiota in vaginal health and pathogenesis of recurrent vulvovaginal infections: A critical review. Annals of Clinical Microbiology and Antimicrobials, 19, 5.
https://doi.org/10.1186/s12941-020-0347-4

Reid, G., Dols, J., & Miller, W. (2009).
Targeting the vaginal microbiota with probiotics as a means to counteract infections. Current Opinion in Clinical Nutrition & Metabolic Care, 12(6), 583\u2013587.
https://doi.org/10.1097/MCO.0b013e328331b611

Abbe, C., & Mitchell, C. M. (2023).
Bacterial vaginosis: A review of approaches to treatment and prevention. Frontiers in Reproductive Health, 5, 1100029.
https://doi.org/10.3389/frph.2023.1100029

Donders, G. G. G., Bellen, G., & Mendling, W. (2011).
Management of recurrent vulvo-vaginal candidosis as a chronic illness. Gynecologic and Obstetric Investigation, 72(1), 1\u20138.
https://pubmed.ncbi.nlm.nih.gov/21051852/`,
  },

  risk_factors_for_vaginal_infections: {
    title: 'Fattori di rischio per le infezioni vaginali',
    subtitle:
      'Scopri cosa altera il tuo microbioma vaginale \u2013 e come piccole abitudini possono prevenire le infezioni.',
    content_md: `## Perch\u00e9 si verificano le infezioni
Le infezioni vaginali non hanno nulla a che fare con l'essere "poco pulite". Si verificano quando l'equilibrio naturale tra batteri e lieviti nella vagina viene alterato. Normalmente, i lattobacilli protettivi producono acido lattico che mantiene il pH leggermente acido (3,8\u20134,5), rendendo difficile la proliferazione dei germi dannosi.

Quando questo equilibrio si sposta, possono svilupparsi vaginosi batterica (VB), candidosi o altre condizioni. Alcuni fattori aumentano la probabilit\u00e0 che ci\u00f2 accada \u2013 conoscerli aiuta a ridurre il rischio e a intervenire precocemente.

## I principali fattori di rischio
### 1. Antibiotici
* **Perch\u00e9:** gli antibiotici non distinguono \u2013 uccidono i batteri dannosi, ma riducono anche i lattobacilli protettivi del microbioma vaginale.
Effetto: questo pu\u00f2 scatenare una proliferazione di lieviti (candidosi) o rendere pi\u00f9 vulnerabili alla VB.
* **Evidenze:** gli studi dimostrano che le donne che assumono antibiotici a largo spettro hanno una probabilit\u00e0 **da 2 a 3 volte maggiore** di sviluppare una candidosi nelle settimane successive.
* **Consiglio:** se hai bisogno di antibiotici, valuta l'assunzione di un probiotico vaginale in seguito per ripristinare l'equilibrio (chiedi prima al tuo medico).

### 2. Cambiamenti hormonali
* **Ciclo mestruale:** intorno e dopo le mestruazioni, il pH aumenta temporaneamente (diventa meno acido), favorendo i batteri che causano la VB.
* **Gravidanza:** livelli pi\u00f9 elevati di estrogeni aumentano il glicogeno nella vagina, favorendo la crescita dei lieviti e aumentando il rischio di candidosi.
* **Menopausa:** la riduzione degli estrogeni porta a secchezza, tessuti pi\u00f9 sottili e meno lattobacilli protettivi \u2013 le infezioni diventano pi\u00f9 frequenti.
* **Consiglio:** osserva il tuo ciclo per capire quando sei pi\u00f9 vulnerabile. Idratanti delicati o gel riequilibranti del pH possono aiutare nelle fasi con estrogeni bassi.

### 3. Attivit\u00e0 sessuale
* **VB:** non \u00e8 una IST, ma i rapporti sessuali possono alterare il mix batterico vaginale \u2013 soprattutto con partner nuovi o multipli.
* **Tricomoniasi:** un'infezione sessualmente trasmissibile causata da Trichomonas vaginalis \u2013 circa **156 milioni di nuovi casi all'anno** nel mondo (OMS). Richiede un trattamento su prescrizione.
* **Uso del preservativo:** pu\u00f2 ridurre il rischio di tricomoniasi e le alterazioni del pH.
* **Consiglio:** se noti sintomi dopo un rapporto sessuale (odore, irritazione), pu\u00f2 essere un segnale che il tuo microbioma \u00e8 stato alterato \u2013 osserva i pattern.

### 4. Prodotti per l'igiene
* **Lavande vaginali:** fortemente sconsigliate \u2013 OMS e CDC avvertono che aumentano il rischio di VB e malattia infiammatoria pelvica.
* **Salviette/spray profumati:** eliminano i batteri protettivi e irritano la mucosa.
* **Verit\u00e0:** la vagina si autopulisce. Le perdite normali sono sane e non devono essere lavate via.
* **Consiglio:** limita la pulizia esterna ad acqua tiepida o detergenti delicati e senza profumo. Non fare mai lavande vaginali.

### 5. Scelta dell'abbigliamento
* **Biancheria intima stretta o sintetica:** trattiene calore e umidit\u00e0 \u2013 condizioni in cui i lieviti proliferano.
* **Scelta pi\u00f9 sicura:** la biancheria in cotone permette la circolazione dell'aria e riduce il rischio di infezione.
* **Consiglio extra:** cambia rapidamente gli abiti sportivi sudati per evitare umidit\u00e0 prolungata.

### 6. Stress e stile di vita
* **Stress:** aumenta il cortisolo, debilita il sistema immunitario e riduce la capacit\u00e0 del corpo di mantenere i microbi in equilibrio.
* **Sonno e alimentazione:** un sonno scarso e un elevato consumo di zuccheri sono associati a tassi pi\u00f9 alti di proliferazione dei lieviti.
* **Consiglio:** sostieni il tuo microbioma con sonno adeguato, alimentazione equilibrata e gestione dello stress \u2013 conta tanto quanto i fattori esterni.

## Fattori che non puoi controllare completamente
* Cambiamenti hormonali naturali (mestruazioni, gravidanza, menopausa)
* Predisposizione genetica (alcune donne sono pi\u00f9 predisposte a VB o candidosi)
* Et\u00e0 (le donne pi\u00f9 giovani hanno pi\u00f9 spesso candidosi ricorrente; la VB \u00e8 pi\u00f9 comune in et\u00e0 fertile)

Non \u00e8 colpa tua \u2013 \u00e8 cos\u00ec che funziona il corpo. L'importante \u00e8 sapere quando sei pi\u00f9 vulnerabile, cos\u00ec puoi adottare misure di supporto.

## Fattori che puoi influenzare
* Evita lavande vaginali, salviette profumate o spray deodoranti
* Scegli biancheria intima in cotone e cambia gli abiti umidi
* Usa gli antibiotici solo se prescritti
* Sostieni il tuo microbioma, se necessario, con probiotici o prodotti riequilibranti del pH
* Osserva i cambiamenti delle tue perdite per individuare i pattern precocemente

## Chiarezza, non colpa
Le infezioni vaginali sono comuni e averne una non significa aver fatto qualcosa "di sbagliato". Conoscere i fattori di rischio significa **consapevolezza, non colpa**. Ti aiuta a comprendere i ritmi del tuo corpo e a proteggere il tuo equilibrio.

**Santelle** rende tutto questo pi\u00f9 semplice: controlli mensili discreti che danno sicurezza quando tutto appare normale, e orientamento quando \u00e8 il momento di agire.

## Sources:
Abbe, C., & Mitchell, C. M. (2023).
Bacterial vaginosis: A review of approaches to treatment and prevention. Frontiers in Reproductive Health, 5, 1100029.
https://doi.org/10.3389/frph.2023.1100029

Brown, H., & Drexler, M. (2020).
Improving the diagnosis of vulvovaginitis: Perspectives to align practice, guidelines, and awareness. Population Health Management, 23(Suppl 1), S-3\u2013S-12.
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
Management of recurrent vulvo-vaginal candidosis as a chronic illness. Gynecologic and Obstetric Investigation, 72(1), 1\u20138.
https://doi.org/10.1159/000323823

Foxman, B. (1990).
The epidemiology of vulvovaginal candidiasis: Risk factors. American Journal of Public Health, 80(3), 329\u2013331.
https://ajph.aphapublications.org/doi/10.2105/AJPH.80.3.329

Kalia, N., Singh, J., & Kaur, M. (2020).
Microbiota in vaginal health and pathogenesis of recurrent vulvovaginal infections: A critical review. Annals of Clinical Microbiology and Antimicrobials, 19, 5.
https://doi.org/10.1186/s12941-020-0347-4

O\u2019Hanlon, D. E., Moench, T. R., & Cone, R. A. (2013).
Vaginal pH and microbicidal lactic acid when Lactobacilli dominate the microbiota. PLoS ONE, 8(11), e80074.
https://doi.org/10.1371/journal.pone.0080074

Sobel, J. D. (2007).
Vulvovaginal candidosis. The Lancet, 369(9577), 1961\u20131971.
https://doi.org/10.1016/S0140-6736(07)60917-9`,
  },

  how_your_discharge_changes_with_your_menstrual_cycle: {
    title: 'Come cambiano le perdite vaginali durante il ciclo mestruale',
    subtitle:
      'Scopri come cambiano le perdite durante il ciclo \u2013 e cosa raccontano su equilibrio e salute.',
    content_md: `## Il tuo ciclo, i tuoi segnali
Le perdite vaginali non sono casuali \u2013 seguono il ritmo del tuo ciclo mestruale. Comprendere questi cambiamenti ti aiuta a sapere cosa \u00e8 normale, quando sei fertile e quando qualcosa potrebbe non essere a posto.

### Fase 1: fase mestruale (giorni 1\u20135)
Durante le mestruazioni, le perdite si mescolano al sangue. Il flusso va dal rosso al marrone scuro. Spesso non si nota molto altro perch\u00e9 il sanguinamento predomina.

### Fase 2: fase follicolare (giorni 6\u201313)
Dopo le mestruazioni, le perdite sono spesso scarse e possono sembrare secche per alcuni giorni.
* **Fase follicolare precoce:** poche o nessuna perdita.
* **Fase follicolare tardiva:** le perdite diventano cremose o bianco-torbide quando i livelli di estrogeni aumentano.

### Fase 3: ovulazione (giorni 14\u201316, variabile)
Al momento dell'ovulazione, le perdite sono pi\u00f9 evidenti.
* **Consistenza:** trasparente, filante, simile "all'albume" \u2013 si allunga tra le dita.
* **Scopo:** questo muco fertile aiuta gli spermatozoi a spostarsi pi\u00f9 facilmente.
* **Durata:** solitamente 2\u20133 giorni intorno all'ovulazione.

### Fase 4: fase luteale (giorni 17\u201328)
Dopo l'ovulazione, il progesterone aumenta. Le perdite tornano a essere pi\u00f9 dense.
* **Fase luteale precoce:** cremose, bianche o giallognole.
* **Fase luteale tardiva (prima delle mestruazioni):** le perdite possono diminuire, a volte diventando appiccicose o secche.

## Cosa \u00e8 normale \u2013 e cosa non lo \u00e8
Mentre le perdite cambiano naturalmente durante il ciclo, alcune variazioni possono segnalare che qualcosa non va.
* **Normale:** perdite trasparenti, lattiginose o simili all'albume, che cambiano con il ciclo.
* **Non tipico:** perdite grigie, verdi, grumose o con odore forte \u2013 possono indicare un'infezione.

## Perch\u00e9 il monitoraggio aiuta
Molte donne confondono normali cambiamenti del ciclo con un'infezione. In effetti, fino al 50% delle infezioni vaginali viene diagnosticato erroneamente la prima volta. Conoscere i propri pattern ti permette di sapere quando si tratta solo di ovulazione \u2013 e quando \u00e8 opportuno un ulteriore approfondimento.

## Il tuo ciclo come guida
Le tue perdite sono una parte naturale del ritmo del corpo. Non sono qualcosa da nascondere \u2013 sono un segnale di salute. Prestando attenzione, guadagni chiarezza, tranquillit\u00e0 e conversazioni migliori con il tuo medico, quando necessario.
**Santelle** ti aiuta a monitorare questi cambiamenti in modo discreto, cos\u00ec puoi riconoscere la tua normalit\u00e0 e notare ci\u00f2 che \u00e8 inusuale.

## Sources:
https://my.clevelandclinic.org/health/body/21957-cervical-mucus

The American College of Obstetricians and Gynecologists. FAQ: Fertility Awareness-Based Methods of Family Planning [internet]. Washington DC: American College of Obstetricians and Gynecologists; 2019. https://www.acog.org/womens-health/faqs/fertility-awareness-based-methods-of-family-planning

The American College of Obstetricians and Gynecologists. FAQ: Vulvovaginal health [internet]. Washington DC: American College of Obstetricians and Gynecologists. https://www.acog.org/womens-health/faqs/vulvovaginal-health#:~:text=Vaginal%20dryness%20can%20be%20caused,and%20urinary%20tract%20during%20menopause.`,
  },

  what_is_bv_yeast_infections_and_trichomoniasis: {
    title: 'Cosa sono la vaginosi batterica (VB), la candidosi e la tricomoniasi?',
    subtitle:
      'VB, candidosi e tricomoniasi sembrano simili \u2013 ecco come distinguerle e trattarle correttamente.',
    content_md: `## Comprendere le infezioni vaginali pi\u00f9 comuni
I cambiamenti nelle perdite possono talvolta indicare un'infezione. Tre delle pi\u00f9 comuni sono la **vaginosi batterica (VB), la candidosi e la tricomoniasi**. Sono condizioni diverse, ma presentano sintomi che si sovrappongono \u2013 per questo vengono spesso confuse.

## Vaginosi batterica (VB)
* **Causa:** uno squilibrio nel microbioma vaginale, in cui i batteri buoni protettivi (lattobacilli) sono ridotti e altri batteri possono proliferare.
* **Sintomi:**
  * Perdite sottili, grigio-bianche
  * Odore simile a pesce, spesso pi\u00f9 intenso dopo i rapporti sessuali
  * Lieve irritazione (a volte nessun sintomo)
* **Frequenza:** la VB \u00e8 l'infezione vaginale pi\u00f9 comune nelle donne in et\u00e0 fertile e ne colpisce circa il 20\u201330% in un dato momento.
* **Trattamento:** antibiotici prescritti da un medico (di solito metronidazolo o clindamicina). I prodotti OTC possono sostenere l'equilibrio, ma non curano la VB.

## Candidosi
* **Causa:** proliferazione eccessiva del fungo Candida albicans, normalmente presente in piccole quantit\u00e0 nella vagina.
* **Sintomi:**
  * Perdite dense e bianche, simili a "ricotta"
  * Prurito o bruciore intenso
  * Arrossamento e gonfiore della vulva
* **Frequenza: circa il 75% delle donne sperimenta almeno una candidosi nella vita**, e molte hanno recidive.
* **Trattamento:** creme o ovuli antimicotici (OTC o su prescrizione). I casi gravi o ricorrenti possono richiedere una terapia antimicotica orale prescritta dal medico.

## Tricomoniasi
* **Causa:** un'infezione sessualmente trasmissibile (IST) causata dal parassita Trichomonas vaginalis.
* **Sintomi:**
  * Perdite schiumose, giallo-verdi
  * Odore intenso
  * Prurito, irritazione o dolore durante i rapporti sessuali o la minzione
* **Frequenza:** circa 156 milioni di persone nel mondo sono colpite ogni anno dalla tricomoniasi, rendendola una delle IST non virali pi\u00f9 comuni (stima OMS, 2022).
* **Trattamento:** richiede antibiotici su prescrizione (di solito metronidazolo). I prodotti OTC non la trattano.

## Perch\u00e9 la diagnosi corretta \u00e8 importante
Poich\u00e9 i sintomi si sovrappongono, l'autodiagnosi \u00e8 difficile. Ad esempio, VB e candidosi possono entrambe causare irritazione, ma richiedono trattamenti molto diversi. Gli studi mostrano **tassi di diagnosi errata del 40\u201350%** quando le donne si basano solo sui sintomi.
Ecco perch\u00e9 test professionali \u2013 o kit per l'auto-test guidato in grado di distinguere tra le infezioni \u2013 sono importanti.

## Quando consultare un medico
Cerca assistenza medica se noti:
* Perdite persistenti o inusuali
* Odore forte
* Prurito o dolore intenso
* Sintomi che non migliorano dopo un trattamento OTC

## Affrontare con chiarezza
Queste infezioni sono comuni e curabili. Averne una non significa essere "poco pulite" \u2013 significa che il tuo microbioma si \u00e8 alterato. Con il trattamento giusto, l'equilibrio pu\u00f2 essere ripristinato rapidamente.

**Santelle** ti aiuta a comprendere i segnali del tuo corpo, cos\u00ec puoi affrontare il trattamento con sicurezza e tranquillit\u00e0.

## Sources:
Abbe, C., & Mitchell, C. M. (2023).
Bacterial vaginosis: A review of approaches to treatment and prevention. Frontiers in Reproductive Health, 5, 1100029.
https://doi.org/10.3389/frph.2023.1100029

Brown, H., & Drexler, M. (2020).
Improving the diagnosis of vulvovaginitis: Perspectives to align practice, guidelines, and awareness. Population Health Management, 23(Suppl 1), S-3\u2013S-12.
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
    title: 'Perch\u00e9 le infezioni vaginali continuano a tornare',
    subtitle:
      'Le infezioni ricorrenti non hanno nulla a che fare con l\u2019igiene \u2013 scopri perch\u00e9 tornano e come rompere il ciclo.',
    content_md: `## La frustrazione delle infezioni ricorrenti
Poche cose sono scoraggianti come curare un'infezione, sentirsi meglio \u2013 e poi ritrovarsela poche settimane dopo. Non sei sola:
* **Fino al 50% delle donne con VB ha una recidiva entro 6 mesi.**
* **Quasi l'8% delle donne soffre di candidosi ricorrente (\u22654 episodi all'anno).**

Le infezioni ricorrenti non hanno nulla a che fare con l'igiene o con "aver fatto qualcosa di sbagliato". Di solito si verificano perch\u00e9 l'equilibrio di base del microbioma vaginale non \u00e8 stato completamente ripristinato.

## Perch\u00e9 le infezioni tornano
### 1. Trattamento incompleto
* VB e candidosi spesso richiedono cicli di trattamento completi. Interromperli in anticipo \u2013 o usare il prodotto OTC sbagliato \u2013 pu\u00f2 alleviare i sintomi ma non eliminare la causa.
* Le diagnosi errate sono comuni: **circa il 40\u201350% delle infezioni viene inizialmente diagnosticato in modo errato**, portando a un trattamento inefficace.

### 2. Squilibrio del microbioma
L'ecosistema vaginale \u00e8 delicato. Anche dopo antibiotici o antimicotici, i lattobacilli protettivi possono rimanere troppo bassi.
Senza lattobacilli sufficienti, infezioni come VB o candidosi possono tornare rapidamente.
Probiotici o prodotti riequilibranti del pH possono aiutare a ripristinare questo equilibrio, ma richiedono tempo.

### 3. Fattori scatenanti ricorrenti
* **Attivit\u00e0 sessuale:** partner nuovi o multipli possono alterare la flora.
* **Antibiotici:** possono scatenare ripetutamente infezioni da lieviti.
* **Ciclo hormonale:** le variazioni del pH durante le mestruazioni rendono alcune donne predisposte a VB o candidosi mensili.
* **Stile di vita:** stress, sonno scarso e alimentazione ricca di zuccheri possono favorire le recidive.

### 4. Biofilm e resistenza
Alcuni batteri coinvolti nella VB possono formare **biofilm** \u2013 strati protettivi che ne rendono difficile l'eliminazione. Questo \u00e8 uno dei motivi per cui la VB spesso torna anche dopo il trattamento.

## Il peso emotivo
Le infezioni ricorrenti riguardano pi\u00f9 della sola salute. Possono influire sull'autostima, sulla vita sessuale e sul benessere psicologico. Le donne si sentono spesso non ascoltate dai medici o sentono dire che "\u00e8 solo immaginazione". Studi e testimonianze mostrano la frustrazione di vivere con un disagio costante e il sollievo quando la causa viene finalmente identificata.

## Rompere il ciclo
Le infezioni ricorrenti possono essere gestite. Alcuni passaggi che possono aiutare:
* Completare i cicli di trattamento prescritti.
* Sostenere il recupero con probiotici o prodotti riequilibranti del pH.
* Evitare fattori scatenanti conosciuti (prodotti profumati, lavande vaginali, abiti stretti).
* Osservare i pattern \u2013 molte donne notano recidive legate alle mestruazioni, agli antibiotici o allo stress.
* Discutere una gestione a lungo termine con un medico se le infezioni continuano a ripresentarsi.

## Trovare tranquillit\u00e0 nella chiarezza
Se stai lottando con infezioni ricorrenti, non sei sola \u2013 e non \u00e8 colpa tua. Capire perch\u00e9 tornano \u00e8 il primo passo per rompere il ciclo.

**Santelle** ti aiuta a riconoscere i pattern, sostenere il tuo microbioma e consultare il tuo medico con dati e sicurezza. Perch\u00e9 la tranquillit\u00e0 non nasce dal supporre, ma dal sapere.

## Sources:
Bradshaw CS, Morton AN, Hocking J, Garland SM, Morris MB, Moss LM, et al. High recurrence rates of bacterial vaginosis over the course of 12 months after oral metronidazole therapy and factors associated with recurrence. J Infect Dis. 2006;193(11):1478\u201389. https://doi.org/10.1086/503780.

Zhou, X., Westman, R., Hickey, R., Hansmann, M. A., & Forney, L. J. (2009). Vaginal microbiota of women with frequent vulvovaginal candidiasis. Infection and Immunity, 77(9), 4130\u20134135. Available from https://pmc.ncbi.nlm.nih.gov/articles/PMC2738030/

Brown, H., & Drexler, M. (2020). Improving the diagnosis of vulvovaginitis: Perspectives to align practice, guidelines, and awareness. Population Health Management, 23(Suppl 1), S-3\u2013S-12. Retrieved from https://pmc.ncbi.nlm.nih.gov/articles/PMC7591372/

Kalia, N., Singh, J., & Kaur, M. (2020). Microbiota in vaginal health and pathogenesis of recurrent vulvovaginal infections: a critical review. Annals of Clinical Microbiology and Antimicrobials, 19, 5. https://doi.org/10.1186/s12941-020-0347-4

https://almondobgyn.com/blog/getting-to-the-root-of-recurrent-vaginitis

Abbe, C., & Mitchell, C. M. (2023). Bacterial vaginosis: A review of approaches to treatment and prevention. Frontiers in Reproductive Health, 5, 1100029. https://doi.org/10.3389/frph.2023.1100029`,
  },

  what_your_discharge_means: {
    title: 'Cosa significano le tue perdite vaginali',
    subtitle:
      'Scopri cosa raccontano le tue perdite \u2013 e come il monitoraggio ti aiuta a restare in equilibrio.',
    content_md: `Le perdite vaginali sono un'esperienza comune a tutte le donne. Non sono un problema da risolvere \u2013 sono il modo in cui il tuo corpo comunica. Prestando attenzione ai cambiamenti, puoi capire cosa \u00e8 normale, cosa \u00e8 legato al ciclo e quando potrebbero indicare uno squilibrio.

## Il ruolo delle perdite
Le perdite sono un fluido sano prodotto dalla vagina e dalla cervice. Aiutano a mantenere l'ambiente vaginale equilibrato e protetto.
* **Trasparenti o lattiginose:** solitamente normali, soprattutto a met\u00e0 ciclo.
* **Consistenza simile all'albume:** un segno di ovulazione.
* **Pi\u00f9 dense o cremose:** spesso presenti prima o dopo le mestruazioni.

Il livello base di ogni donna \u00e8 leggermente diverso. La cosa pi\u00f9 importante \u00e8 riconoscere i propri pattern.

## Quando le perdite indicano equilibrio
Nella maggior parte dei casi, le perdite sono un segno di un ecosistema che funziona bene. Un pH vaginale leggermente acido (tra 3,8 e 4,5) tiene i batteri sotto controllo. I batteri principali, i lattobacilli, proteggono dalle infezioni producendo acido lattico.

## Quando prestare attenzione
Cambiamenti nel colore, nella consistenza o nell'odore possono talvolta indicare uno squilibrio:
* **Grigio o odore di pesce:** spesso associato a vaginosi batterica (VB).
* **Denso, bianco, consistenza "a ricotta":** pu\u00f2 indicare una candidosi.
* **Verdastro o giallo:** potrebbe indicare tricomoniasi o un'altra infezione.

A livello globale, **la VB \u00e8 l'infezione vaginale pi\u00f9 comune nelle donne in et\u00e0 fertile, colpendone il 20\u201330% in un dato momento.** Anche le infezioni da lieviti sono comuni \u2013 circa **il 75% delle donne ne sperimenta almeno una nella vita.**

## Perch\u00e9 il monitoraggio \u00e8 importante
Le donne spesso confondono un'infezione con un'altra \u2013 ad esempio, la VB con una candidosi. Gli studi mostrano che **fino al 50% delle infezioni vaginali viene diagnosticato erroneamente la prima volta.** Questo pu\u00f2 ritardare un trattamento efficace e prolungare il disagio.

Osservare i pattern delle perdite nel tempo aiuta a:
* Riconoscere i primi segni di uno squilibrio prima che i sintomi peggiorino.
* Comprendere i fattori scatenanti (ad esempio antibiotici, ciclo mestruale, un nuovo partner).
* Cercare pi\u00f9 rapidamente il trattamento giusto con maggiore sicurezza.

## Trovare tranquillit\u00e0 nella chiarezza
Le perdite non sono qualcosa di cui vergognarsi \u2013 sono un segnale importante della tua salute. Prestandovi attenzione, resti semplicemente in sintonia con il tuo corpo.
Santelle rende tutto questo pi\u00f9 semplice: controlli mensili discreti che ti danno sicurezza quando tutto appare normale, e orientamento quando qualcosa non sembra giusto.

## Sources:
 https://www.cdc.gov/std/vaginal-discharge

 https://www.mayoclinic.org/healthy-lifestyle/womens-health/in-depth/vaginal-discharge

 https://www.frontiersin.org/articles/10.3389/frph.2023.1100029
 https://pmc.ncbi.nlm.nih.gov/articles/PMC2738030/

 Brown, H., & Drexler, M. (2020). Improving the diagnosis of vulvovaginitis: Perspectives to align practice, guidelines, and awareness. Population Health Management, 23(Suppl 1), S-3\u2013S-12. https://pmc.ncbi.nlm.nih.gov/articles/PMC7591372/`,
  },
};
