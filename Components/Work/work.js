const workCards = document.querySelectorAll('.tarjeta-trabajo');
const touchLayout = window.matchMedia('(hover: none), (max-width: 800px)');

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
    if (!touchLayout.matches || event.target.closest('a')) {
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
