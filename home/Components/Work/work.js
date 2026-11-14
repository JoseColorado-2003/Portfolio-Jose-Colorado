const workCards = document.querySelectorAll('.tarjeta-trabajo');
const filterButtons = document.querySelectorAll('.work-filter');
const touchLayout = window.matchMedia('(hover: none), (max-width: 800px)');
const nicheStorageKey = 'portfolio-selected-nicho';

const readSavedNicheFilter = () => {
  try {
    return sessionStorage.getItem(nicheStorageKey);
  } catch (error) {
    return null;
  }
};

const persistNicheFilter = (filter) => {
  try {
    if (!filter || filter === 'all') {
      sessionStorage.removeItem(nicheStorageKey);
      return;
    }

    sessionStorage.setItem(nicheStorageKey, filter);
  } catch (error) {
    // Ignore storage restrictions in privacy-mode browsers.
  }
};

const applyWorkFilter = (filter) => {
  const nextFilter = filter || 'all';

  filterButtons.forEach((button) => {
    const isActive = button.dataset.filter === nextFilter;
    button.classList.toggle('is-active', isActive);
    button.setAttribute('aria-pressed', isActive ? 'true' : 'false');
  });

  workCards.forEach((card) => {
    const matches = nextFilter === 'all' || card.dataset.nicho === nextFilter;
    card.classList.toggle('is-hidden', !matches);
    card.hidden = !matches;
    card.setAttribute('aria-hidden', matches ? 'false' : 'true');
  });

  persistNicheFilter(nextFilter);
};

const syncFilterFromUrl = () => {
  const params = new URLSearchParams(window.location.search);
  const filterFromUrl = params.get('nicho');
  const savedNiche = readSavedNicheFilter();
  const selected = filterFromUrl || savedNiche || 'all';
  const validFilter = [...filterButtons].some((button) => button.dataset.filter === selected)
    ? selected
    : 'all';

  applyWorkFilter(validFilter);
};

filterButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const nextFilter = button.dataset.filter;
    applyWorkFilter(nextFilter);

    const url = new URL(window.location.href);
    url.hash = 'trabajos';
    if (nextFilter && nextFilter !== 'all') {
      url.searchParams.set('nicho', nextFilter);
    } else {
      url.searchParams.delete('nicho');
    }
    window.history.replaceState({}, '', url);
  });
});

document.addEventListener('click', (event) => {
  const nicheButton = event.target.closest('.niche-button');
  if (!nicheButton) {
    return;
  }

  const filter = nicheButton.dataset.nicho;
  if (!filter) {
    return;
  }

  event.preventDefault();
  applyWorkFilter(filter);

  const url = new URL(window.location.href);
  url.hash = 'trabajos';
  url.searchParams.set('nicho', filter);
  window.history.replaceState({}, '', url);

  const workSection = document.getElementById('trabajos');
  if (workSection) {
    workSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
});

window.addEventListener('hashchange', () => {
  const isWorkSection = window.location.hash.includes('trabajos');
  if (!isWorkSection) {
    return;
  }

  const filterFromUrl = new URLSearchParams(window.location.search).get('nicho');
  if (filterFromUrl) {
    const validFilter = [...filterButtons].some((button) => button.dataset.filter === filterFromUrl)
      ? filterFromUrl
      : 'all';
    applyWorkFilter(validFilter);
  }
});

syncFilterFromUrl();

const toggleWorkCard = (card) => {
  const shouldOpen = !card.classList.contains('is-open');
  workCards.forEach((workCard) => {
    workCard.classList.remove('is-open');
    workCard.setAttribute('aria-expanded', 'false');
    const toggleButton = workCard.querySelector('.tarjeta-detalles-toggle');
    toggleButton.setAttribute('aria-expanded', 'false');
    toggleButton.textContent = 'Ver detalles';
  });

  if (shouldOpen) {
    card.classList.add('is-open');
    card.setAttribute('aria-expanded', 'true');
    const toggleButton = card.querySelector('.tarjeta-detalles-toggle');
    toggleButton.setAttribute('aria-expanded', 'true');
    toggleButton.textContent = 'Cerrar detalles';
  }
};

workCards.forEach((card) => {
  const details = card.querySelector('.detalles-video');
  const toggleButton = document.createElement('button');
  toggleButton.className = 'tarjeta-detalles-toggle';
  toggleButton.type = 'button';
  toggleButton.textContent = 'Ver detalles';
  toggleButton.setAttribute('aria-expanded', 'false');
  toggleButton.setAttribute('aria-controls', `detalles-${Array.from(workCards).indexOf(card) + 1}`);
  details.id = toggleButton.getAttribute('aria-controls');
  card.prepend(toggleButton);

  card.setAttribute('tabindex', '0');
  card.setAttribute('aria-expanded', 'false');
  card.setAttribute(
    'aria-label',
    details.querySelector('h3').textContent.trim()
  );

  toggleButton.addEventListener('click', (event) => {
    event.stopPropagation();
    toggleWorkCard(card);
  });

  card.addEventListener('click', (event) => {
    if (!touchLayout.matches || event.target.closest('a, button, video, audio')) {
      return;
    }

    toggleWorkCard(card);
  });

  card.addEventListener('keydown', (event) => {
    if (event.target !== card || (event.key !== 'Enter' && event.key !== ' ')) {
      return;
    }

    event.preventDefault();
    toggleWorkCard(card);
  });
});
