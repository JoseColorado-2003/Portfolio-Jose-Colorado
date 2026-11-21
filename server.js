const routes = {
  home: './home/home.html',
  login: './login/login.html',
  register: './register/register.html',
};

const params = new URLSearchParams(window.location.search);
const page = (params.get('page') || 'home').toLowerCase();
const target = routes[page] ?? routes.home;

document.body.classList.add('is-loading');

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
window.setTimeout(() => {
  window.location.replace(target);
}, reducedMotion ? 1000 : 5000);