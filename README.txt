PORTAFOLIO UGC WEB

Para visualizar el sitio con los videos y sus componentes, sirve esta carpeta por HTTP en lugar de abrir index.html directamente como archivo. En VS Code puedes usar la extensión Live Server; también puedes ejecutar `py -m http.server 8000` desde esta carpeta y abrir http://localhost:8000.

`index.html` muestra la animación de entrada y abre el CV cuando terminan la animación y la carga; con movimiento reducido, abre la vista en cuanto carga. `server.js` gestiona las vistas sin recargar la página: `?page=cv` abre el CV y `?page=ugc` abre el portafolio UGC. El toolbar compartido está en `components/Toolbar/`; su configuración de enlaces y secciones se encuentra en `server.js`, `CV/components/components.js` y `UGC/Components/components.js` (para UGC abierto directamente).

`CV/CV.html` declara las secciones del CV y también puede abrirse directamente. `CV/components/components.js` carga el HTML y CSS de cada carpeta en `CV/components/`, actualiza el año del pie de página e inicializa el toolbar cuando se abre el CV directamente. Los datos de contacto laboral están en `CV/components/contacto/contacto.html`. `CV/CV.js` y el JS de cada componente están reservados para comportamiento futuro y actualmente no se cargan. Edita los archivos de los componentes para actualizar el contenido del CV.

Los componentes del portafolio UGC están en `UGC/Components/`. `UGC/Components/components.js` los carga y controla el reveal editorial al desplazarse; `styles.css` conserva estilos globales y reglas responsive compartidas. El reveal respeta la preferencia de movimiento reducido. No se necesitan dependencias ni compilación.

Dirección visual: paleta neutra de negro, blanco roto, gris y beige; fondos claros y oscuros alternados; tipografía editorial serif combinada con sans serif; alto contraste y composiciones limpias.

No publiques colaboraciones, resultados ni testimonios que no sean reales. El sitio es estático y no necesita backend.
