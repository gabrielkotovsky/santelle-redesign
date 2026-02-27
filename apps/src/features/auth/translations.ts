/**
 * Translations for auth and onboarding screens only.
 * Keyed by signUpLanguage ('en' | 'fr').
 */
export type AuthOnboardingLang = 'en' | 'fr';

export const authOnboardingTranslations = {
  en: {
    // Landing
    welcomeTitle: 'Welcome to Santelle',
    continueWithEmail: 'Continue with Email',
    continueWithApple: 'Continue with Apple',
    signingIn: 'Signing in...',
    signInFailed: 'Sign in failed. Please try again.',
    appleSignInFailed: 'Apple sign in failed. Please try again.',
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
    continueWithApple: 'Continuer avec Apple',
    signingIn: 'Connexion...',
    signInFailed: 'Échec de la connexion. Veuillez réessayer.',
    appleSignInFailed: 'Connexion Apple échouée. Veuillez réessayer.',
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
    months: ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'],
    failedToSaveDob: 'Échec de l\'enregistrement de la date de naissance. Veuillez réessayer.',

    // Country (onboarding)
    whereBased: 'OU ETES-VOUS SITUE(E)?',
    selectCountry: 'Sélectionnez votre pays',
    searchCountryPlaceholder: 'Rechercher ou taper un pays...',
    finishing: 'Finalisation...',
    failedToCompleteOnboarding: 'Échec de la finalisation. Veuillez réessayer.',
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
