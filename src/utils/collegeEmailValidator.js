// Institutional / College Student Email Verification
// Ensures only verified college students (@kiit.ac.in, .edu, .ac.in, etc.) can access SpillATea

const BLOCKED_PERSONAL_DOMAINS = new Set([
  'gmail.com',
  'googlemail.com',
  'yahoo.com',
  'yahoo.co.in',
  'outlook.com',
  'hotmail.com',
  'live.com',
  'icloud.com',
  'proton.me',
  'protonmail.com',
  'aol.com',
  'mail.com',
  'zoho.com',
  'yandex.com'
]);

export function isCollegeEmail(email) {
  if (!email || typeof email !== 'string') return false;
  const clean = email.trim().toLowerCase();
  const parts = clean.split('@');
  if (parts.length !== 2) return false;

  const domain = parts[1];

  // Block generic personal webmail providers
  if (BLOCKED_PERSONAL_DOMAINS.has(domain)) {
    return false;
  }

  // Must match institutional educational domain patterns
  const isEduDomain = (
    domain.endsWith('.ac.in') ||      // e.g. kiit.ac.in, iitb.ac.in, du.ac.in
    domain.endsWith('.edu.in') ||     // e.g. college.edu.in
    domain.endsWith('.edu') ||        // e.g. student.college.edu, harvard.edu
    domain.endsWith('.ernet.in') ||   // e.g. premier Indian research / university nets
    domain.endsWith('.res.in') ||     // research institutes
    domain.endsWith('.ac.uk') ||      // e.g. ox.ac.uk
    domain.endsWith('.edu.au') ||     // e.g. unimelb.edu.au
    domain.endsWith('.ac.nz') ||
    domain.includes('.edu.') ||
    domain.includes('.ac.')
  );

  return isEduDomain;
}

export function extractCollegeName(email) {
  if (!email) return 'College';
  const domain = email.split('@')[1] || '';
  if (domain.includes('kiit.ac.in')) return 'KIIT University';
  if (domain.endsWith('.ac.in')) {
    const name = domain.replace('.ac.in', '').toUpperCase();
    return `${name} Institute`;
  }
  if (domain.endsWith('.edu')) {
    const name = domain.replace('.edu', '');
    const cleanName = name.split('.').pop() || name;
    return cleanName.charAt(0).toUpperCase() + cleanName.slice(1);
  }
  return 'Campus';
}
