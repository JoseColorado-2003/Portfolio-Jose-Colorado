const routes = {
  home: './home/home.html',
  login: './login/login.html',
  register: './register/register.html',
};

const params = new URLSearchParams(window.location.search);
const page = (params.get('page') || 'home').toLowerCase();
const target = routes[page] ?? routes.home;

window.location.replace(target);