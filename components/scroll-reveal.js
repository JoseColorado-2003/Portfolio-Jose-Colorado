const selectors = [
  '.wrap > .head',
  '.hero-grid > *',
  '.niche',
  '.format',
  '.tarjeta-trabajo',
  '.value-item',
  '.experience-card',
  '.price-row',
  '.terms',
  '.cv-profile-grid > *',
  '.cv-heading',
  '.cv-entry',
  '.cv-skills-grid > *',
  '.three-hero-grid > *',
  '.three-heading',
  '.three-work-grid > *',
  '.contact > .wrap > .eyebrow',
  '.contact-grid > *',
];

export function initScrollReveal(container) {
  if (!('IntersectionObserver' in window)) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      entry.target.classList.toggle('scroll-reveal-active', entry.isIntersecting);
    });
  });

  container.querySelectorAll('main > * > section').forEach((section) => {
    const items = section.querySelectorAll(selectors.join(','));
    items.forEach((item, index) => {
      item.classList.add('scroll-reveal-item');
      item.style.setProperty('--reveal-index', index);
      observer.observe(item);
    });
  });
}
