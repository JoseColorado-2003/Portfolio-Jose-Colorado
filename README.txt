PORTAFOLIO UGC WEB

Para visualizar el sitio con los videos y sus componentes, sirve esta carpeta por HTTP en lugar de abrir index.html directamente como archivo. En VS Code puedes usar la extensión Live Server; también puedes ejecutar `py -m http.server 8000` desde esta carpeta y abrir http://localhost:8000.

Cada componente tiene su propia carpeta dentro de `Components/`, con su archivo HTML y CSS. Los componentes que necesitan comportamiento también incluyen un JS propio (Header, Niches, Work y Footer). `Components/components.js` carga los componentes y controla el reveal editorial al desplazarse; `styles.css` conserva estilos globales y reglas responsive compartidas. El reveal respeta la preferencia de movimiento reducido. No se necesitan dependencias ni compilación.

Dirección visual: paleta neutra de negro, blanco roto, gris y beige; fondos claros y oscuros alternados; tipografía editorial serif combinada con sans serif; alto contraste y composiciones limpias.

No publiques colaboraciones, resultados ni testimonios que no sean reales. El sitio es estático y no necesita backend.
