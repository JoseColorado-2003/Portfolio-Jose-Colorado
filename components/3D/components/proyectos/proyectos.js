import { projects } from '../../projects.js';

let viewerLibrary;
function loadViewer() {
  if (!viewerLibrary) {
    viewerLibrary = new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.type = 'module';
      script.src = 'https://ajax.googleapis.com/ajax/libs/model-viewer/4.0.0/model-viewer.min.js';
      script.addEventListener('load', resolve, { once: true });
      script.addEventListener('error', () => {
        script.remove();
        viewerLibrary = null;
        reject(new Error('No se pudo cargar la biblioteca del visor 3D.'));
      }, { once: true });
      document.head.append(script);
    });
  }
  return viewerLibrary;
}

export function initProyectos(container) {
  const viewer = container.querySelector('[data-model-viewer]');
  const placeholder = container.querySelector('[data-viewer-placeholder]');
  const status = container.querySelector('[data-viewer-status]');
  const list = container.querySelector('[data-projects]');
  const empty = container.querySelector('[data-projects-empty]');
  const info = container.querySelector('[data-model-info]');
  const title = container.querySelector('[data-model-title]');
  const description = container.querySelector('[data-model-description]');
  let selection = 0;
  let modelFailed = false;

  viewer.addEventListener('load', () => {
    modelFailed = false;
    status.textContent = 'Modelo cargado. Arrastra para girar.';
  });
  viewer.addEventListener('error', () => {
    modelFailed = true;
    status.textContent = 'No se pudo cargar el modelo. Comprueba el archivo y su ruta.';
  });

  async function showModel(project, button) {
    if (button.getAttribute('aria-pressed') === 'true' && viewer.loaded) return;
    const request = ++selection;
    list.querySelectorAll('.three-project').forEach((item) => {
      item.setAttribute('aria-pressed', String(item === button));
    });
    title.textContent = project.title;
    description.textContent = project.description;
    info.hidden = false;
    placeholder.textContent = 'Preparando el modelo 3D…';
    placeholder.hidden = false;
    viewer.hidden = true;
    status.textContent = 'Cargando visor 3D…';
    try {
      await loadViewer();
      if (request !== selection) return;
      viewer.setAttribute('alt', `Modelo 3D: ${project.title}`);
      const src = new URL(project.model, new URL('../../3D.js', import.meta.url)).href;
      if (viewer.getAttribute('src') === src && modelFailed) {
        viewer.removeAttribute('src');
        await new Promise((resolve) => requestAnimationFrame(resolve));
        if (request !== selection) return;
      }
      viewer.hidden = false;
      placeholder.hidden = true;
      status.textContent = viewer.loaded && viewer.getAttribute('src') === src
        ? 'Modelo cargado. Arrastra para girar.'
        : 'Cargando modelo…';
      if (viewer.getAttribute('src') !== src) viewer.setAttribute('src', src);
    } catch (error) {
      if (request !== selection) return;
      console.error(error);
      placeholder.textContent = 'No se pudo mostrar el modelo 3D.';
      status.textContent = 'No se pudo cargar el visor 3D. Comprueba tu conexión e inténtalo de nuevo.';
    }
  }

  projects.forEach((project) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'three-project';
    const projectTitle = document.createElement('strong');
    projectTitle.textContent = project.title;
    const projectDescription = document.createElement('span');
    projectDescription.textContent = project.description;
    button.append(projectTitle, projectDescription);
    button.addEventListener('click', () => showModel(project, button));
    list.append(button);
  });
  empty.hidden = projects.length > 0;
  if (projects.length) showModel(projects[0], list.firstElementChild);
}
