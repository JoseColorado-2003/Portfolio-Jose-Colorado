import { initProyectos } from './proyectos/proyectos.js';
import { loadSharedContact } from '../../Contact/contact.js';
import { initScrollReveal } from '../../scroll-reveal.js';

const componentFolders = {
  'three-inicio-section': 'inicio',
  'three-proyectos-section': 'proyectos',
};

export const threeDLinks = [
  { label: 'Inicio', href: '#3d-inicio' },
  { label: 'Proyectos', href: '#3d-proyectos' },
  { label: 'Contacto', href: '#3d-contacto' },
];

class ThreeDComponent extends HTMLElement {
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
      if (name === 'proyectos') initProyectos(this);
    });
  }
}

Object.keys(componentFolders).forEach((tagName) => {
  customElements.define(tagName, class extends ThreeDComponent {});
});

export async function load3DComponents(container) {
  const components = container.querySelectorAll(Object.keys(componentFolders).join(','));
  await Promise.all([...Array.from(components, (component) => component.loadPromise), loadSharedContact(container)]);
  initScrollReveal(container);
}

if (document.body.dataset.view === '3d') {
  try {
    await load3DComponents(document);
    const { initToolbar } = await import('../../Toolbar/toolbar.js');
    await initToolbar(document.querySelector('site-header'), {
      links: [...threeDLinks, { label: 'VOLVER', href: '../CV/CV.html' }],
      sections: document.querySelectorAll('main > * > section'),
      brandHref: '#3d-inicio',
    });
    const target = location.hash && document.getElementById(decodeURIComponent(location.hash.slice(1)));
    if (target) target.scrollIntoView();
  } catch (error) {
    console.error(error);
    const message = document.createElement('p');
    message.setAttribute('role', 'alert');
    message.textContent = 'No se pudo cargar 3D. Recarga la página para volver a intentarlo.';
    document.body.prepend(message);
  }
}
