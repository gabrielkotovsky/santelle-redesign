# Italian translation review

The Italian app copy uses terminology from:

- `SantelleKitInstructionsItalian.pdf`
- `SantelleUserManualItalian.pdf`

Italian content was translated from the **approved English/French app copy** (not German).
Kit/manual PDF wording was used for biomarker and infection names.

## Terminology used

| EN | IT (app) |
| --- | --- |
| Bacterial vaginosis (BV) | vaginosi batterica (VB) |
| Aerobic vaginitis (AV) | vaginite aerobica (VA) |
| Trichomoniasis | trichomoniasi (Trich) |
| Yeast infection | candidosi / infezione da lieviti |
| Hydrogen peroxide | perossido di idrogeno (H₂O₂) |
| Leukocyte | leucociti (LE) |
| Sialidase | sialidasi (SNA) |
| β-Glucuronidase | β-glucuronidasi (β-G) |
| N-acetylglucosaminidase | N-acetilglucosaminidasi (NAG) |
| Color card | carta dei colori |

Note: the Italian user manual sometimes writes “vaginite batterica”; the kit color card
uses **vaginosi batterica (VB)**. The app follows the color-card form.

## Wording / process notes

1. **Indicative result**
   - App wording: **«Risultato indicativo»**

2. **Form of address**
   - Formal **Lei** where the English copy addresses the user.

3. **Test instruction measurements**
   - App source instruction: insert about half an index finger and rotate for **10–15 seconds**.
   - Approved Italian kit PDF: insert about **5 cm** and rotate for **30 seconds**.
   - Italian UI currently preserves the app’s existing measurements so changing language
     does not change the procedure. Align instructions across languages after confirming
     the correct procedure.

## Assets / content still requiring approved Italian versions

1. **Italian user-manual download**
   - Local asset added: `apps/SantelleUserManualItalian.remote.pdf`
   - The app expects `SantelleUserManualItalian.pdf` in the Supabase `manufacturer`
     storage folder (same pattern as EN/FR/DE). Confirm upload before release.

2. **Terms and privacy policy**
   - No approved Italian legal-document URLs were provided.
   - Italian users currently open the existing English legal documents (same as DE).

3. **Learn articles**
   - All 7 published Learn articles have Italian title/subtitle/body copy in
     `apps/src/features/articles/italian.ts`, overlaid when the app language is Italian.
   - French still uses Supabase `*_french` columns; Italian currently uses the local
     overlay only (same approach as German).

## Medical copy beyond the PDFs

The full diagnostic result-card library includes clinical routing and treatment copy
beyond the two approved PDFs. Those sections were translated from the approved English
app logic while retaining PDF terminology for VB, VA, Trich, candidosi, and biomarkers.

Medical/legal review is recommended before production release.
