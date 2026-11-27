PORTAFOLIO UGC WEB

Para visualizar el sitio con los videos y sus componentes, sirve esta carpeta por HTTP en lugar de abrir index.html directamente como archivo. En VS Code puedes usar la extensión Live Server; también puedes ejecutar `py -m http.server 8000` desde esta carpeta y abrir http://localhost:8000.

`index.html` muestra la animación de entrada y abre el CV cuando terminan la animación y la carga; con movimiento reducido, abre la vista en cuanto carga. `server.js` gestiona las vistas sin recargar la página: `?page=cv` abre el CV y `?page=ugc` abre el portafolio UGC. El toolbar compartido está en `components/Toolbar/`; su configuración de enlaces y secciones se encuentra en `server.js`, `CV/components/components.js` y `UGC/Components/components.js` (para UGC abierto directamente).

`CV/CV.html` declara las secciones del CV y también puede abrirse directamente. `CV/components/components.js` carga el HTML y CSS de cada carpeta en `CV/components/` e inicializa el toolbar cuando se abre el CV directamente. `CV/CV.js` y el JS de cada componente están reservados para comportamiento futuro y actualmente no se cargan. Edita los archivos de los componentes para actualizar el contenido del CV.

El contacto y el pie de página compartidos por CV, UGC y 3D están en `components/Contact/`. Los datos y enlaces de contacto se editan en `contact.html`; el año del pie se actualiza automáticamente. Cada vista conserva sus propias anclas de contacto y de regreso al inicio.

Los componentes del portafolio UGC están en `UGC/Components/`. `UGC/Components/components.js` los carga y controla el reveal editorial al desplazarse; `styles.css` conserva estilos globales y reglas responsive compartidas. El reveal respeta la preferencia de movimiento reducido. No se necesitan dependencias ni compilación.

Dirección visual: paleta neutra de negro, blanco roto, gris y beige; fondos claros y oscuros alternados; tipografía editorial serif combinada con sans serif; alto contraste y composiciones limpias.

No publiques colaboraciones, resultados ni testimonios que no sean reales. El sitio es estático y no necesita backend.

PORTAFOLIO 3D

La nueva vista está disponible desde Proyectos en el CV, en `?page=3d` o directamente en `components/3D/3D.html`. Sus archivos están en `components/3D/`. Para publicar un proyecto, guarda su modelo GLB (o glTF con sus recursos asociados) en el sitio y añade una entrada en `components/3D/projects.js`, por ejemplo:

  { title: 'Mi proyecto', description: 'Descripción del proyecto', model: '../../Assets/3D/mi-proyecto.glb' }

Las secciones de inicio y proyectos están en `components/3D/components/`, cada una con su HTML, CSS y JS; el contacto es compartido. `components/3D/components/components.js` carga los componentes y `proyectos/proyectos.js` controla el visor. La ruta del modelo se interpreta desde `components/3D/3D.js`. Se pueden añadir varias entradas separadas por comas: el primer proyecto se muestra automáticamente y se puede seleccionar otro de la lista. Sin proyectos, se muestra un mensaje en lugar de contenido ficticio.

El visor interactivo usa model-viewer desde Google CDN y necesita conexión a internet y un navegador compatible con WebGL. Si el visor o un modelo no se carga, se muestra un mensaje de error.
