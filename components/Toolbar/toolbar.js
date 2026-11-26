export const homeLinks = [
  { label: 'Sobre mí', href: '#sobre-mi' },
  { label: 'Nichos', href: '#nichos' },
  { label: 'Servicios', href: '#formatos' },
  { label: 'Portfolio', href: '#trabajos' },
  { label: 'Proceso', href: '#valor' },
  { label: 'Experiencia', href: '#experiencia' },
  { label: 'Tarifas', href: '#servicios' },
  { label: 'Contacto', href: '#contacto' },
];

export async function initToolbar(host, initialConfig) {
  const htmlUrl = new URL('./toolbar.html', import.meta.url);
  const cssUrl = new URL('./toolbar.css', import.meta.url);
  const stylesheet = document.createElement('link');
  stylesheet.rel = 'stylesheet';
  stylesheet.href = cssUrl.href;
  const stylesheetLoaded = new Promise((resolve, reject) => {
    stylesheet.addEventListener('load', resolve, { once: true });
    stylesheet.addEventListener('error', () => reject(new Error(`No se pudo cargar ${cssUrl.pathname}`)), { once: true });
  });
  document.head.append(stylesheet);
  const [response] = await Promise.all([fetch(htmlUrl), stylesheetLoaded]);
  if (!response.ok) throw new Error(`No se pudo cargar ${htmlUrl.pathname}: ${response.status}`);
  host.innerHTML = await response.text();

  const toolbar = host.querySelector('.top');
  const links = host.querySelector('.links');
  const toggle = host.querySelector('.toggle');
  const brand = host.querySelector('.brand');
  let sections = [];
  let scheduled = false;

  function setProjectsState(open) {
    const button = links.querySelector('.toolbar-project-toggle');
    const menu = links.querySelector('.toolbar-project-menu');
    if (!button || !menu) return;
    button.setAttribute('aria-expanded', String(open));
    menu.hidden = !open;
  }

  function setMenuState(open) {
    links.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.textContent = open ? '✕' : '☰';
    toggle.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
    if (!open) setProjectsState(false);
  }

  function update() {
    scheduled = false;
    const marker = toolbar.getBoundingClientRect().bottom;
    const current = sections.reduce((active, section) =>
      section.getBoundingClientRect().top <= marker ? section : active, sections[0]);
    if (!current) return;
    links.querySelectorAll('a[href^="#"]').forEach((link) => {
      if (link.hash === `#${current.id}`) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
    const styles = getComputedStyle(current);
    for (const property of ['--toolbar-background', '--toolbar-text-color', '--toolbar-logo-color']) {
      const value = styles.getPropertyValue(property).trim();
      if (value) toolbar.style.setProperty(property, value);
      else toolbar.style.removeProperty(property);
    }
  }

  function scheduleUpdate() {
    if (!scheduled) {
      scheduled = true;
      requestAnimationFrame(update);
    }
  }

  toggle.addEventListener('click', () => setMenuState(!links.classList.contains('open')));
  links.addEventListener('click', (event) => {
    const projectToggle = event.target.closest('.toolbar-project-toggle');
    if (projectToggle) {
      setProjectsState(projectToggle.getAttribute('aria-expanded') !== 'true');
      return;
    }
    if (event.target.closest('a')) setMenuState(false);
  });
  document.addEventListener('click', (event) => {
    if (!event.target.closest('.toolbar-projects')) setProjectsState(false);
  });
  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape') return;
    const projectToggle = links.querySelector('.toolbar-project-toggle[aria-expanded="true"]');
    if (projectToggle) {
      setProjectsState(false);
      projectToggle.focus();
    } else if (links.classList.contains('open')) {
      setMenuState(false);
      toggle.focus();
    }
  });
  window.addEventListener('scroll', scheduleUpdate, { passive: true });
  window.addEventListener('resize', () => {
    if (window.innerWidth > 800) setMenuState(false);
    scheduleUpdate();
  });

  function configure({ links: items, sections: viewSections, brandHref }) {
    sections = Array.from(viewSections);
    brand.href = brandHref;
    links.replaceChildren(...items.map(({ label, href, project }) => {
      const link = document.createElement('a');
      link.textContent = label;
      link.setAttribute('href', href);
      if (!project) return link;

      const wrapper = document.createElement('div');
      wrapper.className = 'toolbar-projects';
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'toolbar-project-toggle';
      button.setAttribute('aria-expanded', 'false');
      button.setAttribute('aria-controls', 'toolbar-project-menu');
      button.textContent = 'Proyectos';
      const menu = document.createElement('div');
      menu.className = 'toolbar-project-menu';
      menu.id = 'toolbar-project-menu';
      menu.hidden = true;
      menu.append(link);
      wrapper.append(button, menu);
      return wrapper;
    }));
    setMenuState(false);
    update();
  }

  configure(initialConfig);
  return { configure };
}
