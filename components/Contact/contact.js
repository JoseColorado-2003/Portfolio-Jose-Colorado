const templates = {
  'contact-section': 'contact',
  'site-footer': 'footer',
};
const resources = {};

function loadResource(name) {
  if (!resources[name]) {
    const htmlUrl = new URL(`./${name}.html`, import.meta.url);
    const cssUrl = new URL(`./${name}.css`, import.meta.url);
    const stylesheet = document.createElement('link');
    stylesheet.rel = 'stylesheet';
    stylesheet.href = cssUrl.href;
    const stylesheetLoaded = new Promise((resolve, reject) => {
      stylesheet.addEventListener('load', resolve, { once: true });
      stylesheet.addEventListener('error', () => reject(new Error(`No se pudo cargar ${cssUrl.pathname}`)), { once: true });
    });
    document.head.append(stylesheet);
    resources[name] = Promise.all([
      fetch(htmlUrl).then((response) => {
        if (!response.ok) throw new Error(`No se pudo cargar ${htmlUrl.pathname}: ${response.status}`);
        return response.text();
      }),
      stylesheetLoaded,
    ]).then(([markup]) => markup);
  }
  return resources[name];
}

class SharedContactComponent extends HTMLElement {
  connectedCallback() {
    if (this.loadPromise) return;
    this.loadPromise = loadResource(templates[this.localName]).then((markup) => {
      this.innerHTML = markup;
      const section = this.querySelector('section');
      if (section) section.id = this.getAttribute('section-id') || 'contacto';
      const backToTop = this.querySelector('[data-back-to-top]');
      if (backToTop) backToTop.setAttribute('href', this.getAttribute('top-href') || '#inicio');
      this.querySelectorAll('[data-current-year]').forEach((element) => {
        element.textContent = new Date().getFullYear();
      });
    });
  }
}

Object.keys(templates).forEach((tagName) => {
  customElements.define(tagName, class extends SharedContactComponent {});
});

export function loadSharedContact(container) {
  const components = container.querySelectorAll(Object.keys(templates).join(','));
  return Promise.all(Array.from(components, (component) => component.loadPromise));
}
