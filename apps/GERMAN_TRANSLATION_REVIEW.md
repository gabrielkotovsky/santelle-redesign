# German translation review

The German app copy uses terminology from:

- `SantelleKitInstructionsGerman.pdf`
- `SantelleUserManualGerman.pdf`

The items below need product, medical, or legal confirmation because the approved
PDFs do not establish the exact wording or because another approved asset is
required.

## Wording to confirm

1. **STI testing location**
   - Current app wording: **„STI-Teststelle oder sexualmedizinische Beratungsstelle“**
   - Used for English “STD screening centre or sexual health clinic”.
   - Alternative: „Testzentrum für sexuell übertragbare Infektionen“.

2. **Indicative result**
   - Current app wording: **„Orientierendes Ergebnis“**
   - Alternatives: „Hinweisendes Ergebnis“ or „Vorläufiges Ergebnis“.
   - „Vorläufig“ may imply that a later result is expected, so „orientierend“ was
     chosen.

3. **Tone and form of address**
   - Current German copy consistently uses formal **Sie/Ihre**.
   - Confirm whether Santelle should instead use informal **du/dein**.

4. **Good-bacteria wording**
   - The approved PDFs use **„gute Bakterien“**.
   - The app therefore uses this patient-friendly term rather than
     „schützende Vaginalflora“ in most places.

5. **Test instruction mismatch between the current app and approved German PDF**
   - Current app source instruction: insert about half an index finger and rotate
     for **10–15 seconds**.
   - Approved German kit PDF: insert about **5 cm** and rotate for **30 seconds**.
   - The German translation currently preserves the app’s existing measurements
     so changing language does not change the procedure. The underlying
     instructions should be aligned across every language after you confirm the
     correct procedure.

## Assets/content still requiring approved German versions

1. **German user-manual download**
   - The app now expects:
     `SantelleUserManualGerman.pdf` in the existing Supabase `manufacturer`
     storage folder.
   - Confirm that this PDF has been uploaded under that exact filename before
     release.

2. **Terms and privacy policy**
   - No approved German legal-document URLs were provided.
   - German users currently open the existing English legal documents.

3. **Learn articles**
   - All 7 published Learn articles now have German title/subtitle/body copy in
     `apps/src/features/articles/german.ts`, overlaid when the app language is
     German.
   - French still uses Supabase `title_french` / `subtitle_french` /
     `content_md_french` columns.
   - To mirror French in the database later, run
     `supabase/migrations/20260722_add_german_article_columns.sql` and load the
     German copy into `title_german` / `subtitle_german` / `content_md_german`.

## Medical copy not present in the approved PDFs

The full diagnostic result-card library includes clinical routing and treatment
copy beyond the scope of the two approved PDFs (for example PID urgency,
pharmacy/doctor routing, recurrent infection guidance, and probiotics). These
sections were translated conservatively from the existing approved English app
logic while retaining the PDF terminology for BV, AV, Trichomoniasis,
Hefepilzinfektion, pH-Wert, Entzündung, and biomarker names.

Medical/legal review is recommended before production release.
