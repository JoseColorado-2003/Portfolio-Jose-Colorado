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

const sharedStylesheet = document.querySelector('link[rel="stylesheet"][href="styles.css"]');
if (!sharedStylesheet) {
  throw new Error('No se encontró la hoja de estilos global styles.css');
}

document.head.append(sharedStylesheet);

const instagramScript = document.createElement('script');
instagramScript.async = true;
instagramScript.src = 'https://www.instagram.com/embed.js';
document.body.append(instagramScript);

await Promise.all([
  import('./Header/header.js'),
  import('./Niches/niches.js'),
  import('./Work/work.js'),
  import('./Footer/footer.js'),
]);
