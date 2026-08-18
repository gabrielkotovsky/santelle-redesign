/**
 * Translations for auth and onboarding screens only.
 * Keyed by signUpLanguage.
 */
export type AuthOnboardingLang = 'en' | 'fr' | 'de' | 'it';

export const authOnboardingTranslations = {
  en: {
    // Landing
    welcomeTitle: 'Welcome to Santelle',
    continueWithEmail: 'Continue with Email',
    continueWithGoogle: 'Continue with Google',
    continueWithApple: 'Continue with Apple',
    signingIn: 'Signing in...',
    signInFailed: 'Sign in failed. Please try again.',
    appleSignInFailed: 'Apple sign in failed. Please try again.',
    googleSignInFailed: 'Google sign in failed. Please try again.',
    disclaimerBySigning: 'By signing up in the Santelle app, you agree to our ',
    termsAndConditions: 'Terms and Conditions',
    and: ' and ',
    privacyPolicy: 'Privacy Policy',
    disclaimerFrLine: "En vous inscrivant à l'application Santelle, vous acceptez nos ",
    conditionsGenerales: 'Conditions générales',
    etNotre: ' et notre ',
    politiqueConfidentialite: 'Politique de confidentialité',

    // Email
    enterYourEmail: 'Enter your email',
    weWillSendCode: "We'll send you a verification code",
    emailPlaceholder: 'email',
    continue: 'Continue',
    sending: 'Sending...',
    error: 'Error',
    pleaseEnterEmail: 'Please enter your email address',
    pleaseEnterValidEmail: 'Please enter a valid email address',
    checkYourEmail: 'Check your email',
    verificationCodeSent: "We've sent you a verification code. Please check your inbox.",
    ok: 'OK',
    failedToSendCode: 'Failed to send verification code. Please try again.',

    // OTP
    enterVerificationCode: 'Enter verification code',
    weSentCodeToEmail: 'We sent a 6-digit code to your email',
    verifying: 'Verifying...',
    resendPrompt: "Didn't receive the code? Resend",
    success: 'Success!',
    successfullyVerified: 'You have been successfully verified.',
    pleaseEnterCode: 'Please enter the verification code',
    pleaseEnterCompleteCode: 'Please enter the complete 6-digit code',
    emailNotFound: 'Email not found. Please try again.',
    invalidCode: 'Invalid verification code. Please try again.',
    codeExpired: 'The verification code has expired. Please request a new one.',
    invalidCodeCheck: 'Invalid verification code. Please check and try again.',
    codeSent: 'Code Sent',
    newCodeSent: 'A new verification code has been sent to your email.',
    failedToResend: 'Failed to resend code. Please try again.',

    // Subscription
    subscriptionRequired: 'Subscription Required',
    subscriptionSubtitle: 'You need an active subscription or trial to access Santelle.',
    subscriptionDescription: 'Subscribe to unlock all features and start tracking your health journey.',
    subscribeNow: 'Subscribe Now',
    signOut: 'Sign Out',
    unableToOpenSubscription: 'Unable to open the subscription page.',
    failedToSignOut: 'Failed to sign out. Please try again.',

    // Name (onboarding)
    whatShouldWeCallYou: 'What should we call you?',
    howYouAppear: "This is how you'll appear in the app",
    optionalSkip: '(Optional - you can skip this step)',
    displayNamePlaceholder: 'display name',
    skip: 'Skip',
    saving: 'Saving...',
    userNotFound: 'User not found. Please try again.',
    failedToSaveName: 'Failed to save your name. Please try again.',

    // Year (onboarding)
    whenBorn: 'When were you born?',
    personalizeExperience: 'This helps us personalize your experience',
    ageRequirement: 'You must be 16 or older to use Santelle.',
    ageRestrictionTitle: 'Age restriction',
    ageRestrictionMessage: 'You must be at least 16 years old to use this app.',
    month: 'Month',
    day: 'Day',
    year: 'Year',
    done: 'Done',
    months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
    failedToSaveDob: 'Failed to save your date of birth. Please try again.',

    // Country (onboarding)
    whereBased: 'Where are you based?',
    selectCountry: 'Select your country',
    searchCountryPlaceholder: 'Search or type country...',
    finishing: 'Finishing...',
    failedToCompleteOnboarding: 'Failed to complete onboarding. Please try again.',
  },
  fr: {
    // Landing
    welcomeTitle: 'Bienvenue sur Santelle',
    continueWithEmail: 'Continuer avec email',
    continueWithGoogle: 'Continuer avec Google',
    continueWithApple: 'Continuer avec Apple',
    signingIn: 'Connexion...',
    signInFailed: 'Échec de la connexion. Veuillez réessayer.',
    appleSignInFailed: 'Connexion Apple échouée. Veuillez réessayer.',
    googleSignInFailed: 'Connexion Google échouée. Veuillez réessayer.',
    disclaimerBySigning: "En vous inscrivant à l'application Santelle, vous acceptez nos ",
    termsAndConditions: 'Conditions générales',
    and: ' et notre ',
    privacyPolicy: 'Politique de confidentialité',
    disclaimerFrLine: "En vous inscrivant à l'application Santelle, vous acceptez nos ",
    conditionsGenerales: 'Conditions générales',
    etNotre: ' et notre ',
    politiqueConfidentialite: 'Politique de confidentialité',

    // Email
    enterYourEmail: 'Entrez votre email',
    weWillSendCode: 'Nous vous enverrons un code de vérification',
    emailPlaceholder: 'email',
    continue: 'Continuer',
    sending: 'Envoi...',
    error: 'Erreur',
    pleaseEnterEmail: 'Veuillez entrer votre adresse email',
    pleaseEnterValidEmail: 'Veuillez entrer une adresse email valide',
    checkYourEmail: 'Vérifiez votre email',
    verificationCodeSent: 'Nous vous avons envoyé un code de vérification. Consultez votre boîte de réception.',
    ok: 'OK',
    failedToSendCode: 'Échec de l\'envoi du code. Veuillez réessayer.',

    // OTP
    enterVerificationCode: 'ENTREZ LE CODE DE VERIFICATION',
    weSentCodeToEmail: 'Nous avons envoyé un code à 6 chiffres à votre email',
    verifying: 'Vérification...',
    resendPrompt: 'Vous n\'avez pas reçu le code? Renvoyer',
    success: 'Succès!',
    successfullyVerified: 'Vous avez été vérifié avec succès.',
    pleaseEnterCode: 'Veuillez entrer le code de vérification',
    pleaseEnterCompleteCode: 'Veuillez entrer le code à 6 chiffres complet',
    emailNotFound: 'Email introuvable. Veuillez réessayer.',
    invalidCode: 'Code de vérification invalide. Veuillez réessayer.',
    codeExpired: 'Le code de vérification a expiré. Veuillez en demander un nouveau.',
    invalidCodeCheck: 'Code invalide. Vérifiez et réessayez.',
    codeSent: 'Code envoyé',
    newCodeSent: 'Un nouveau code de vérification a été envoyé à votre email.',
    failedToResend: 'Échec du renvoi du code. Veuillez réessayer.',

    // Subscription
    subscriptionRequired: 'Abonnement requis',
    subscriptionSubtitle: 'Vous avez besoin d\'un abonnement ou d\'un essai actif pour accéder à Santelle.',
    subscriptionDescription: 'Abonnez-vous pour débloquer toutes les fonctionnalités et suivre votre parcours santé.',
    subscribeNow: 'S\'abonner',
    signOut: 'Se déconnecter',
    unableToOpenSubscription: 'Impossible d\'ouvrir la page d\'abonnement.',
    failedToSignOut: 'Échec de la déconnexion. Veuillez réessayer.',

    // Name (onboarding)
    whatShouldWeCallYou: 'COMMENT VOUS APPELEZ-VOUS?',
    howYouAppear: 'C\'est ainsi que vous apparaîtrez dans l\'app',
    optionalSkip: '(Optionnel - vous pouvez passer cette étape)',
    displayNamePlaceholder: 'nom d\'affichage',
    skip: 'Passer',
    saving: 'Enregistrement...',
    userNotFound: 'Utilisateur introuvable. Veuillez réessayer.',
    failedToSaveName: 'Échec de l\'enregistrement. Veuillez réessayer.',

    // Year (onboarding)
    whenBorn: 'QUAND ETES-VOUS NE(E)?',
    personalizeExperience: 'Cela nous aide à personnaliser votre expérience',
    ageRequirement: 'Vous devez avoir au moins 16 ans pour utiliser Santelle.',
    ageRestrictionTitle: 'Restriction d\'age',
    ageRestrictionMessage: 'Vous devez avoir au moins 16 ans pour utiliser cette application.',
    month: 'Mois',
    day: 'Jour',
    year: 'Année',
    done: 'Terminé',
    months: ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'],
    failedToSaveDob: 'Échec de l\'enregistrement de la date de naissance. Veuillez réessayer.',

    // Country (onboarding)
    whereBased: 'OU ETES-VOUS SITUE(E)?',
    selectCountry: 'Sélectionnez votre pays',
    searchCountryPlaceholder: 'Rechercher ou taper un pays...',
    finishing: 'Finalisation...',
    failedToCompleteOnboarding: 'Échec de la finalisation. Veuillez réessayer.',
  },
  de: {
    // Landing
    welcomeTitle: 'Willkommen bei Santelle',
    continueWithEmail: 'Mit E-Mail fortfahren',
    continueWithGoogle: 'Mit Google fortfahren',
    continueWithApple: 'Mit Apple fortfahren',
    signingIn: 'Anmeldung...',
    signInFailed: 'Anmeldung fehlgeschlagen. Bitte versuchen Sie es erneut.',
    appleSignInFailed: 'Apple-Anmeldung fehlgeschlagen. Bitte versuchen Sie es erneut.',
    googleSignInFailed: 'Google-Anmeldung fehlgeschlagen. Bitte versuchen Sie es erneut.',
    disclaimerBySigning: 'Mit der Registrierung in der Santelle-App stimmen Sie unseren ',
    termsAndConditions: 'Allgemeinen Geschäftsbedingungen',
    and: ' und unserer ',
    privacyPolicy: 'Datenschutzerklärung',
    disclaimerFrLine: 'Mit der Registrierung in der Santelle-App stimmen Sie unseren ',
    conditionsGenerales: 'Allgemeinen Geschäftsbedingungen',
    etNotre: ' und unserer ',
    politiqueConfidentialite: 'Datenschutzerklärung',

    // Email
    enterYourEmail: 'Geben Sie Ihre E-Mail-Adresse ein',
    weWillSendCode: 'Wir senden Ihnen einen Bestätigungscode',
    emailPlaceholder: 'E-Mail-Adresse',
    continue: 'Weiter',
    sending: 'Wird gesendet...',
    error: 'Fehler',
    pleaseEnterEmail: 'Bitte geben Sie Ihre E-Mail-Adresse ein',
    pleaseEnterValidEmail: 'Bitte geben Sie eine gültige E-Mail-Adresse ein',
    checkYourEmail: 'Prüfen Sie Ihre E-Mails',
    verificationCodeSent: 'Wir haben Ihnen einen Bestätigungscode gesendet. Bitte prüfen Sie Ihren Posteingang.',
    ok: 'OK',
    failedToSendCode: 'Der Bestätigungscode konnte nicht gesendet werden. Bitte versuchen Sie es erneut.',

    // OTP
    enterVerificationCode: 'Bestätigungscode eingeben',
    weSentCodeToEmail: 'Wir haben einen 6-stelligen Code an Ihre E-Mail-Adresse gesendet',
    verifying: 'Wird überprüft...',
    resendPrompt: 'Code nicht erhalten? Erneut senden',
    success: 'Erfolgreich!',
    successfullyVerified: 'Sie wurden erfolgreich verifiziert.',
    pleaseEnterCode: 'Bitte geben Sie den Bestätigungscode ein',
    pleaseEnterCompleteCode: 'Bitte geben Sie den vollständigen 6-stelligen Code ein',
    emailNotFound: 'E-Mail-Adresse nicht gefunden. Bitte versuchen Sie es erneut.',
    invalidCode: 'Ungültiger Bestätigungscode. Bitte versuchen Sie es erneut.',
    codeExpired: 'Der Bestätigungscode ist abgelaufen. Bitte fordern Sie einen neuen an.',
    invalidCodeCheck: 'Ungültiger Bestätigungscode. Bitte prüfen Sie ihn und versuchen Sie es erneut.',
    codeSent: 'Code gesendet',
    newCodeSent: 'Ein neuer Bestätigungscode wurde an Ihre E-Mail-Adresse gesendet.',
    failedToResend: 'Der Code konnte nicht erneut gesendet werden. Bitte versuchen Sie es erneut.',

    // Subscription
    subscriptionRequired: 'Abonnement erforderlich',
    subscriptionSubtitle: 'Sie benötigen ein aktives Abonnement oder eine Testphase, um Santelle zu nutzen.',
    subscriptionDescription: 'Abonnieren Sie Santelle, um alle Funktionen freizuschalten und Ihren Gesundheitsverlauf zu verfolgen.',
    subscribeNow: 'Jetzt abonnieren',
    signOut: 'Abmelden',
    unableToOpenSubscription: 'Die Abonnementseite konnte nicht geöffnet werden.',
    failedToSignOut: 'Abmeldung fehlgeschlagen. Bitte versuchen Sie es erneut.',

    // Name (onboarding)
    whatShouldWeCallYou: 'Wie dürfen wir Sie nennen?',
    howYouAppear: 'So werden Sie in der App angezeigt',
    optionalSkip: '(Optional – Sie können diesen Schritt überspringen)',
    displayNamePlaceholder: 'Anzeigename',
    skip: 'Überspringen',
    saving: 'Wird gespeichert...',
    userNotFound: 'Benutzerin nicht gefunden. Bitte versuchen Sie es erneut.',
    failedToSaveName: 'Ihr Name konnte nicht gespeichert werden. Bitte versuchen Sie es erneut.',

    // Year (onboarding)
    whenBorn: 'Wann wurden Sie geboren?',
    personalizeExperience: 'Damit können wir Ihre Erfahrung personalisieren',
    ageRequirement: 'Sie müssen mindestens 16 Jahre alt sein, um Santelle zu nutzen.',
    ageRestrictionTitle: 'Altersbeschränkung',
    ageRestrictionMessage: 'Sie müssen mindestens 16 Jahre alt sein, um diese App zu nutzen.',
    month: 'Monat',
    day: 'Tag',
    year: 'Jahr',
    done: 'Fertig',
    months: ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'],
    failedToSaveDob: 'Ihr Geburtsdatum konnte nicht gespeichert werden. Bitte versuchen Sie es erneut.',

    // Country (onboarding)
    whereBased: 'Wo leben Sie?',
    selectCountry: 'Wählen Sie Ihr Land',
    searchCountryPlaceholder: 'Land suchen oder eingeben...',
    finishing: 'Wird abgeschlossen...',
    failedToCompleteOnboarding: 'Das Onboarding konnte nicht abgeschlossen werden. Bitte versuchen Sie es erneut.',
  },
  it: {
    // Landing
    welcomeTitle: 'Benvenuta su Santelle',
    continueWithEmail: 'Continua con Email',
    continueWithGoogle: 'Continua con Google',
    continueWithApple: 'Continua con Apple',
    signingIn: 'Accesso in corso...',
    signInFailed: 'Accesso non riuscito. Riprova.',
    appleSignInFailed: 'Accesso con Apple non riuscito. Riprova.',
    googleSignInFailed: 'Accesso con Google non riuscito. Riprova.',
    disclaimerBySigning: "Registrandosi all'app Santelle, accetta i nostri ",
    termsAndConditions: 'Termini e Condizioni',
    and: ' e la ',
    privacyPolicy: 'Informativa sulla Privacy',
    disclaimerFrLine: "Registrandosi all'app Santelle, accetta i nostri ",
    conditionsGenerales: 'Termini e Condizioni',
    etNotre: ' e la ',
    politiqueConfidentialite: 'Informativa sulla Privacy',

    // Email
    enterYourEmail: 'Inserisca la sua email',
    weWillSendCode: 'Le invieremo un codice di verifica',
    emailPlaceholder: 'email',
    continue: 'Continua',
    sending: 'Invio in corso...',
    error: 'Errore',
    pleaseEnterEmail: 'Inserisca il suo indirizzo email',
    pleaseEnterValidEmail: 'Inserisca un indirizzo email valido',
    checkYourEmail: 'Controlli la sua email',
    verificationCodeSent: 'Le abbiamo inviato un codice di verifica. Controlli la sua casella di posta.',
    ok: 'OK',
    failedToSendCode: 'Invio del codice di verifica non riuscito. Riprova.',

    // OTP
    enterVerificationCode: 'Inserisca il codice di verifica',
    weSentCodeToEmail: 'Le abbiamo inviato un codice a 6 cifre alla sua email',
    verifying: 'Verifica in corso...',
    resendPrompt: 'Non ha ricevuto il codice? Invia di nuovo',
    success: 'Operazione riuscita!',
    successfullyVerified: 'È stata verificata con successo.',
    pleaseEnterCode: 'Inserisca il codice di verifica',
    pleaseEnterCompleteCode: 'Inserisca il codice completo a 6 cifre',
    emailNotFound: 'Email non trovata. Riprova.',
    invalidCode: 'Codice di verifica non valido. Riprova.',
    codeExpired: 'Il codice di verifica è scaduto. Ne richieda uno nuovo.',
    invalidCodeCheck: 'Codice di verifica non valido. Controlli e riprovi.',
    codeSent: 'Codice inviato',
    newCodeSent: 'Un nuovo codice di verifica è stato inviato alla sua email.',
    failedToResend: 'Impossibile inviare di nuovo il codice. Riprova.',

    // Subscription
    subscriptionRequired: 'Abbonamento richiesto',
    subscriptionSubtitle: 'È necessario un abbonamento attivo o una prova per accedere a Santelle.',
    subscriptionDescription: 'Si abboni per sbloccare tutte le funzionalità e iniziare a monitorare il suo percorso di salute.',
    subscribeNow: 'Si abboni ora',
    signOut: 'Esci',
    unableToOpenSubscription: 'Impossibile aprire la pagina di abbonamento.',
    failedToSignOut: 'Uscita non riuscita. Riprova.',

    // Name (onboarding)
    whatShouldWeCallYou: 'Come possiamo chiamarLa?',
    howYouAppear: "Così apparirà nell'app",
    optionalSkip: '(Opzionale - può saltare questo passaggio)',
    displayNamePlaceholder: 'nome visualizzato',
    skip: 'Salta',
    saving: 'Salvataggio in corso...',
    userNotFound: 'Utente non trovato. Riprova.',
    failedToSaveName: 'Impossibile salvare il suo nome. Riprova.',

    // Year (onboarding)
    whenBorn: 'Quando è nata?',
    personalizeExperience: 'Questo ci aiuta a personalizzare la sua esperienza',
    ageRequirement: 'Deve avere almeno 16 anni per utilizzare Santelle.',
    ageRestrictionTitle: 'Limite di età',
    ageRestrictionMessage: 'Deve avere almeno 16 anni per utilizzare questa app.',
    month: 'Mese',
    day: 'Giorno',
    year: 'Anno',
    done: 'Fatto',
    months: ['Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno', 'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre'],
    failedToSaveDob: 'Impossibile salvare la sua data di nascita. Riprova.',

    // Country (onboarding)
    whereBased: 'Dove si trova?',
    selectCountry: 'Selezioni il suo paese',
    searchCountryPlaceholder: 'Cerca o digita un paese...',
    finishing: 'Completamento in corso...',
    failedToCompleteOnboarding: "Impossibile completare l'onboarding. Riprova.",
  },
} as const;

// Use a mapped type that converts literal strings to `string` for flexibility across languages
export type AuthOnboardingT = {
  [K in keyof typeof authOnboardingTranslations.en]: 
    typeof authOnboardingTranslations.en[K] extends readonly string[] 
      ? readonly string[] 
      : string;
};

export function getAuthOnboardingT(lang: AuthOnboardingLang): AuthOnboardingT {
  return authOnboardingTranslations[lang];
}
