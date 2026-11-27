import { loadSharedContact } from '../../Contact/contact.js';
import { initScrollReveal } from '../../scroll-reveal.js';

const componentFolders = {
  'hero-section': 'Hero',
  'niches-section': 'Niches',
  'formats-section': 'Formats',
  'work-section': 'Work',
  'value-section': 'Value',
  'experience-section': 'Experience',
  'pricing-section': 'Pricing',
};

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
      this.querySelectorAll('[src]').forEach((element) => {
        const src = element.getAttribute('src');
        element.setAttribute('src', new URL(src, new URL('../UGC.html', import.meta.url)).href);
      });
    });
  }
}

Object.keys(componentFolders).forEach((tagName) => {
  customElements.define(tagName, class extends PortfolioComponent {});
});

const components = Array.from(document.querySelectorAll(Object.keys(componentFolders).join(',')));
try {
  await Promise.all([...components.map((component) => component.loadPromise), loadSharedContact(document)]);
} catch (error) {
  if (document.body.dataset.view === 'ugc') {
    const message = document.createElement('p');
    message.setAttribute('role', 'alert');
    message.textContent = 'No se pudo cargar UGC. Recarga la página para volver a intentarlo.';
    document.body.prepend(message);
  }
  throw error;
}

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

initScrollReveal(document.querySelector('hero-section').closest('main').parentElement);

await Promise.all([
  import('./Niches/niches.js'),
  import('./Work/work.js'),
]);

if (document.body.dataset.view === 'home') {
  const { initToolbar, homeLinks } = await import('../../components/Toolbar/toolbar.js');
  await initToolbar(document.querySelector('site-header'), {
    links: [...homeLinks, { label: 'VOLVER', href: '../CV/CV.html' }],
    sections: document.querySelectorAll('main > * > section'),
    brandHref: '#inicio',
  });
}
