import { initToolbar, homeLinks } from './components/Toolbar/toolbar.js';
import { loadCVComponents, cvLinks } from './components/CV/components/components.js';
import { load3DComponents, threeDLinks } from './components/3D/components/components.js';

const views = document.getElementById('views');
const status = document.getElementById('view-status');
const app = document.getElementById('app');
const loadingPage = document.querySelector('.loading-page');
const intro = Promise.all(
  loadingPage.getAnimations()
    .filter((animation) => animation.animationName === 'loading-background')
    .map((animation) => animation.finished.catch((error) => {
      if (error.name !== 'AbortError') throw error;
    }))
);
const containers = {};
const loads = {};
let navigation = 0;
let toolbar;
let toolbarPromise;
let activePage;

const routes = {
  cv: {
    links: [...cvLinks, { label: 'UGC', href: '?page=ugc', project: true }, { label: '3D', href: '?page=3d', project: true }],
    brandHref: '#cv-perfil',
    async load(container) {
      const response = await fetch(new URL('./components/CV/CV.html', import.meta.url));
      if (!response.ok) throw new Error(`No se pudo cargar el CV: ${response.status}`);
      const page = new DOMParser().parseFromString(await response.text(), 'text/html');
      container.append(page.querySelector('main'), page.querySelector('site-footer'));
      const stylesheet = document.createElement('link');
      stylesheet.rel = 'stylesheet';
      stylesheet.href = new URL('./components/CV/CV.css', import.meta.url).href;
      await Promise.all([
        new Promise((resolve, reject) => {
          stylesheet.addEventListener('load', resolve, { once: true });
          stylesheet.addEventListener('error', () => reject(new Error('No se pudieron cargar los estilos del CV')), { once: true });
          document.head.append(stylesheet);
        }),
        loadCVComponents(container),
      ]);
    },
  },
  ugc: {
    links: [...homeLinks, { label: 'VOLVER', href: '?page=cv' }],
    brandHref: '#inicio',
    async load(container) {
      const response = await fetch(new URL('./components/UGC/UGC.html', import.meta.url));
      if (!response.ok) throw new Error(`No se pudo cargar UGC: ${response.status}`);
      const page = new DOMParser().parseFromString(await response.text(), 'text/html');
      container.append(page.querySelector('main'), page.querySelector('site-footer'));
      const stylesheet = document.createElement('link');
      stylesheet.rel = 'stylesheet';
      stylesheet.href = new URL('./components/UGC/UGC.css', import.meta.url).href;
      await new Promise((resolve, reject) => {
        stylesheet.addEventListener('load', resolve, { once: true });
        stylesheet.addEventListener('error', () => reject(new Error('No se pudieron cargar los estilos de UGC')), { once: true });
        document.head.append(stylesheet);
      });
      await import('./components/UGC/Components/components.js');
    },
  },
  '3d': {
    links: [...threeDLinks, { label: 'VOLVER', href: '?page=cv' }],
    brandHref: '#3d-inicio',
    async load(container) {
      const response = await fetch(new URL('./components/3D/3D.html', import.meta.url));
      if (!response.ok) throw new Error(`No se pudo cargar 3D: ${response.status}`);
      const page = new DOMParser().parseFromString(await response.text(), 'text/html');
      container.append(page.querySelector('main'), page.querySelector('site-footer'));
      const stylesheet = document.createElement('link');
      stylesheet.rel = 'stylesheet';
      stylesheet.href = new URL('./components/3D/3D.css', import.meta.url).href;
      await Promise.all([
        new Promise((resolve, reject) => {
          stylesheet.addEventListener('load', resolve, { once: true });
          stylesheet.addEventListener('error', () => reject(new Error('No se pudieron cargar los estilos de 3D')), { once: true });
          document.head.append(stylesheet);
        }),
        load3DComponents(container),
      ]);
    },
  },
};

function currentRoute() {
  const page = new URLSearchParams(location.search).get('page')?.toLowerCase() || 'cv';
  return Object.hasOwn(routes, page) ? page : 'cv';
}

async function showRoute() {
  const request = ++navigation;
  const page = currentRoute();
  const route = routes[page];
  status.textContent = 'Cargando contenido…';
  status.hidden = false;

  if (!loads[page]) {
    const container = document.createElement('div');
    container.hidden = true;
    containers[page] = container;
    views.append(container);
    loads[page] = route.load(container).catch((error) => {
      container.remove();
      delete containers[page];
      delete loads[page];
      throw error;
    });
  }

  try {
    await loads[page];
    if (request !== navigation) return;
    Object.entries(containers).forEach(([name, container]) => { container.hidden = name !== page; });
    if (activePage !== page && containers.ugc) {
      containers.ugc.querySelectorAll('video[autoplay]').forEach((video) => {
        if (page !== 'ugc') video.pause();
        else video.play().catch((error) => console.warn('No se pudo reproducir el video:', error));
      });
    }
    activePage = page;
    const config = {
      links: route.links,
      brandHref: route.brandHref,
      sections: containers[page].querySelectorAll('main > * > section'),
    };
    if (!toolbarPromise) {
      toolbarPromise = initToolbar(document.querySelector('site-header'), config);
    }
    toolbar = await toolbarPromise;
    await intro;
    if (request !== navigation) return;
    status.hidden = true;
    loadingPage.remove();
    app.hidden = false;
    const target = location.hash && document.getElementById(decodeURIComponent(location.hash.slice(1)));
    if (target && containers[page].contains(target)) target.scrollIntoView();
    else window.scrollTo(0, 0);
    toolbar.configure(config);
  } catch (error) {
    if (request !== navigation) return;
    if (!toolbar) toolbarPromise = null;
    console.error(error);
    loadingPage.remove();
    app.hidden = false;
    status.textContent = 'No se pudo cargar la vista. Recarga la página para volver a intentarlo.';
  }
}

document.addEventListener('click', (event) => {
  const link = event.target.closest('a');
  if (!link || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || link.target || link.hasAttribute('download')) return;
  const url = new URL(link.href, location.href);
  if (url.origin !== location.origin || url.pathname !== location.pathname || !url.searchParams.has('page')) return;
  if (!Object.hasOwn(routes, url.searchParams.get('page'))) return;
  event.preventDefault();
  history.pushState({}, '', url);
  showRoute();
});

window.addEventListener('popstate', showRoute);

showRoute();
