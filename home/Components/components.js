const componentFolders = {
  'site-header': 'Header',
  'hero-section': 'Hero',
  'about-section': 'About',
  'niches-section': 'Niches',
  'formats-section': 'Formats',
  'work-section': 'Work',
  'value-section': 'Value',
  'experience-section': 'Experience',
  'pricing-section': 'Pricing',
  'contact-section': 'Contact',
  'site-footer': 'Footer',
};

const revealSelectors = [
  '.wrap > .head',
  '.hero-grid > *',
  '.about-grid > *',
  '.niche',
  '.format',
  '.tarjeta-trabajo',
  '.value-item',
  '.experience-card',
  '.price-row',
  '.terms',
  '.contact > .wrap > .eyebrow',
  '.contact-grid > *',
];

class PortfolioComponent extends HTMLElement {
  connectedCallback() {
    if (this.loadPromise) {
      return;
    }

    const folder = componentFolders[this.localName];
    const componentName = folder.toLowerCase();
    const componentUrl = new URL(`${folder}/${componentName}.html`, import.meta.url);
    const stylesheetUrl = new URL(`${folder}/${componentName}.css`, import.meta.url);
    const stylesheet = document.createElement('link');
    stylesheet.rel = 'stylesheet';
    stylesheet.href = stylesheetUrl.href;

    const stylesheetLoaded = new Promise((resolve, reject) => {
      stylesheet.addEventListener('load', resolve, { once: true });
      stylesheet.addEventListener('error', () => {
        reject(new Error(`No se pudo cargar ${stylesheetUrl.pathname}`));
      }, { once: true });
    });

    document.head.append(stylesheet);
    this.loadPromise = Promise.all([
      fetch(componentUrl).then((response) => {
        if (!response.ok) {
          throw new Error(`No se pudo cargar ${componentUrl.pathname}: ${response.status}`);
        }

        return response.text();
      }),
      stylesheetLoaded,
    ]).then(([markup]) => {
      this.innerHTML = markup;
    });
  }
}

Object.keys(componentFolders).forEach((tagName) => {
  customElements.define(tagName, class extends PortfolioComponent {});
});

const components = Array.from(document.querySelectorAll(Object.keys(componentFolders).join(',')));
await Promise.all(components.map((component) => component.loadPromise));

const sharedStylesheet = Array.from(document.querySelectorAll('link[rel="stylesheet"]')).find((link) => {
  const href = (link.getAttribute('href') || '').replace(/\\/g, '/');
  return href === 'styles.css' || href.endsWith('/styles.css') || href === './styles.css';
});

if (!sharedStylesheet) {
  throw new Error('No se encontró la hoja de estilos global styles.css');
}

document.head.append(sharedStylesheet);

const instagramScript = document.createElement('script');
instagramScript.async = true;
instagramScript.src = 'https://www.instagram.com/embed.js';
document.body.append(instagramScript);

const sections = Array.from(document.querySelectorAll('main > * > section'));
const exitTimers = new Map();
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

if (!reducedMotion.matches && 'IntersectionObserver' in window) {
  sections.forEach((section) => {
    const revealItems = new Set(
      revealSelectors.flatMap((selector) => Array.from(section.querySelectorAll(selector)))
    );

    Array.from(revealItems).forEach((item, index) => {
      item.classList.add('scroll-reveal-item');
      item.style.setProperty('--reveal-index', index);
    });
  });

  const resetDelay = 1100;
  const updateActiveSection = () => {
    const viewportCenter = window.innerHeight / 2;
    const activeSection = sections.find((section) => {
      const bounds = section.getBoundingClientRect();
      return bounds.top <= viewportCenter && bounds.bottom >= viewportCenter;
    });

    sections.forEach((section) => {
      const wasActive = section.classList.contains('scroll-reveal-active');
      const isActive = section === activeSection;
      const exitTimer = exitTimers.get(section);

      if (isActive) {
        if (exitTimer) {
          window.clearTimeout(exitTimer);
          exitTimers.delete(section);
        }

        section.classList.remove('scroll-reveal-exiting');
        section.classList.add('scroll-reveal-active');
      } else if (wasActive) {
        section.classList.remove('scroll-reveal-active');
        section.classList.add('scroll-reveal-exiting');
        exitTimers.set(section, window.setTimeout(() => {
          section.classList.remove('scroll-reveal-exiting');
          exitTimers.delete(section);
        }, resetDelay));
      }
    });
  };

  let observer;
  const observeSections = () => {
    if (observer) {
      observer.disconnect();
    }

    const centerOffset = Math.floor(window.innerHeight * 0.45);
    observer = new IntersectionObserver(updateActiveSection, {
      rootMargin: `-${centerOffset}px 0px -${centerOffset}px 0px`,
      threshold: 0,
    });

    sections.forEach((section) => observer.observe(section));
  };

  observeSections();
  window.addEventListener('resize', observeSections, { passive: true });
}

await Promise.all([
  import('./Header/header.js'),
  import('./Niches/niches.js'),
  import('./Work/work.js'),
  import('./Footer/footer.js'),
]);
