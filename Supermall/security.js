// security.js
console.log('%c[Security] Client-side protections active','color:green;font-weight:bold');

// Sanitize text to remove potential script tags and common SQL injection words
function sanitizeText(s) {
  if (!s) return s;
  // Remove <script> tags and on* attributes
  return s.replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, '')
          .replace(/on\w+\s*=/gi, '')
          .replace(/(?:select|insert|delete|update|drop|union)\b/gi, '');
}

// Protect input fields by sanitizing on blur
document.addEventListener('blur', (e) => {
  const t = e.target;
  if (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA') {
    t.value = sanitizeText(t.value);
  }
}, true);

// Block click-to-malicious-links (basic)
window.addEventListener('click', (ev) => {
  const a = ev.target.closest && ev.target.closest('a');
  if (a && a.href) {
    const href = a.href.toLowerCase();
    if (href.includes('phish') || href.includes('malware') || href.includes('xss') || href.includes('javascript:')) {
      ev.preventDefault();
      alert('Blocked potentially unsafe link by client-side protection.');
      console.warn('[security] Blocked link', a.href);
    }
  }
});
