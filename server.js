const routes = {
  demo: './demostration/demostration.html',
  home: './home/home.html',
  login: './login/login.html',
  register: './register/register.html',
};

const params = new URLSearchParams(window.location.search);
const page = (params.get('page') || 'demo').toLowerCase();
const target = routes[page] ?? routes.demo;

window.location.replace(target);