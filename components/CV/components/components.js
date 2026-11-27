import { loadSharedContact } from '../../Contact/contact.js';

const componentFolders = {
  'cv-perfil-section': 'perfil',
  'cv-experiencia-section': 'experiencia',
  'cv-educacion-section': 'educacion',
  'cv-habilidades-section': 'habilidades',
};

export const cvLinks = [
  { label: 'Perfil', href: '#cv-perfil' },
  { label: 'Experiencia', href: '#cv-experiencia' },
  { label: 'Educación', href: '#cv-educacion' },
  { label: 'Habilidades', href: '#cv-habilidades' },
  { label: 'Contacto', href: '#cv-contacto' },
];

class CVComponent extends HTMLElement {
  connectedCallback() {
    if (this.loadPromise) return;

    const name = componentFolders[this.localName];
    const htmlUrl = new URL(`./${name}/${name}.html`, import.meta.url);
    const cssUrl = new URL(`./${name}/${name}.css`, import.meta.url);
    const stylesheet = document.createElement('link');
    stylesheet.rel = 'stylesheet';
    stylesheet.href = cssUrl.href;
    const stylesheetLoaded = new Promise((resolve, reject) => {
      stylesheet.addEventListener('load', resolve, { once: true });
      stylesheet.addEventListener('error', () => reject(new Error(`No se pudo cargar ${cssUrl.pathname}`)), { once: true });
    });
    document.head.append(stylesheet);

    this.loadPromise = Promise.all([
      fetch(htmlUrl).then((response) => {
        if (!response.ok) throw new Error(`No se pudo cargar ${htmlUrl.pathname}: ${response.status}`);
        return response.text();
      }),
      stylesheetLoaded,
    ]).then(([markup]) => {
      this.innerHTML = markup;
      this.querySelectorAll('[data-current-year]').forEach((element) => {
        element.textContent = new Date().getFullYear();
      });
      this.querySelectorAll('[src]').forEach((element) => {
        element.setAttribute('src', new URL(element.getAttribute('src'), new URL('../../', import.meta.url)).href);
      });
    });
  }
}

Object.keys(componentFolders).forEach((tagName) => {
  customElements.define(tagName, class extends CVComponent {});
});

export function loadCVComponents(container) {
  const components = container.querySelectorAll(Object.keys(componentFolders).join(','));
  return Promise.all([...Array.from(components, (component) => component.loadPromise), loadSharedContact(container)]);
}

if (document.body.dataset.view === 'cv') {
  try {
    await loadCVComponents(document);
    const { initToolbar } = await import('../../Toolbar/toolbar.js');
    await initToolbar(document.querySelector('site-header'), {
      links: [...cvLinks, { label: 'UGC', href: '../UGC/UGC.html', project: true }, { label: '3D', href: '../3D/3D.html', project: true }],
      sections: document.querySelectorAll('main > * > section'),
      brandHref: '#cv-perfil',
    });
    const target = location.hash && document.getElementById(decodeURIComponent(location.hash.slice(1)));
    if (target) target.scrollIntoView();
  } catch (error) {
    console.error(error);
    const message = document.createElement('p');
    message.setAttribute('role', 'alert');
    message.textContent = 'No se pudo cargar el CV. Recarga la página para volver a intentarlo.';
    document.body.prepend(message);
  }
}
