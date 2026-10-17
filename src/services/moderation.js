// Content Moderation Engine for SpillATea

// Extensible list of offensive terms to mask
const PROFANITY_PATTERNS = [
  /\b(mf|motherfucker|fucking|fucker|fuck|shit|bitch|asshole|bastard|dick|cunt|pussy|whore|slut)\b/gi,
  /\bf+u+c+k+\b/gi,
  /\bs+h+i+t+\b/gi,
  /\bb+i+t+c+h+\b/gi
];

// Patterns for exposed personal information (Phone numbers, emails, home addresses)
const PHONE_PATTERN = /(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/g;
const EMAIL_PATTERN = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;

// High severity patterns: threats of violence, self-harm, severe harassment
const SEVERE_PATTERNS = [
  /\b(kill myself|suicide|commit suicide)\b/i,
  /\b(kill you|shoot you|bomb|stab you)\b/i,
  /\b(doxx|doxxing)\b/i
];

export function moderateText(text) {
  if (!text || typeof text !== 'string') {
    return {
      maskedText: '',
      hasProfanity: false,
      hasPersonalInfo: false,
      hasSevereViolation: false,
      requiresReview: false,
      reason: null
    };
  }

  let masked = text;
  let hasProfanity = false;

  // Mask common profanities
  for (const pattern of PROFANITY_PATTERNS) {
    if (pattern.test(masked)) {
      hasProfanity = true;
      masked = masked.replace(pattern, (match) => {
        return match.length <= 2 ? '**' : match[0] + '*'.repeat(match.length - 2) + match[match.length - 1];
      });
    }
  }

  // Detect exposed personal contact details
  const hasPhone = PHONE_PATTERN.test(text);
  const hasEmail = EMAIL_PATTERN.test(text);
  const hasPersonalInfo = hasPhone || hasEmail;

  // Detect severe harassment / threats
  let hasSevereViolation = false;
  let severeReason = null;
  for (const pattern of SEVERE_PATTERNS) {
    if (pattern.test(text)) {
      hasSevereViolation = true;
      severeReason = 'Content flagged for safety review: possible threat or self-harm mention.';
      break;
    }
  }

  const requiresReview = hasPersonalInfo || hasSevereViolation;

  let reason = null;
  if (hasPersonalInfo) {
    reason = 'Flagged for moderation review: contains unmasked personal contact details.';
  } else if (hasSevereViolation) {
    reason = severeReason;
  }

  return {
    maskedText: masked,
    hasProfanity,
    hasPersonalInfo,
    hasSevereViolation,
    requiresReview,
    reason
  };
}

export function validateAndModeratePost({ title, content, category }) {
  const errors = [];

  const trimmedTitle = (title || '').trim();
  const trimmedContent = (content || '').trim();

  if (trimmedTitle && trimmedTitle.length > 120) {
    errors.push('Post title or recipient cannot exceed 120 characters.');
  }

  if (!trimmedContent) {
    errors.push('Confession content is required.');
  }
  if (trimmedContent.length > 5000) {
    errors.push('Confession content cannot exceed 5,000 characters.');
  }

  const validCategories = [
    'Confessions',
    'Crushes',
    'Lost & Found',
    'Late Night',
    'Academics',
    'College Life',
    'Relationships',
    'Rants',
    'Memes and Fun',
    'Advice',
    'General'
  ];

  if (category && !validCategories.some(c => c.toLowerCase() === category.toLowerCase())) {
    errors.push('Please select a valid community category.');
  }

  if (errors.length > 0) {
    return {
      isValid: false,
      errors,
      post: null
    };
  }

  const titleMod = moderateText(trimmedTitle);
  const contentMod = moderateText(trimmedContent);

  const requiresReview = titleMod.requiresReview || contentMod.requiresReview;
  const reviewReason = titleMod.reason || contentMod.reason;

  return {
    isValid: true,
    errors: [],
    requiresReview,
    reviewReason,
    cleanTitle: titleMod.maskedText,
    cleanContent: contentMod.maskedText,
    hasProfanity: titleMod.hasProfanity || contentMod.hasProfanity
  };
}
