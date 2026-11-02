const workCards = document.querySelectorAll('.tarjeta-trabajo');
const touchLayout = window.matchMedia('(hover: none), (max-width: 800px)');

const toggleWorkCard = (card) => {
  const shouldOpen = !card.classList.contains('is-open');
  workCards.forEach((workCard) => {
    workCard.classList.remove('is-open');
    workCard.setAttribute('aria-expanded', 'false');
  });

  if (shouldOpen) {
    card.classList.add('is-open');
    card.setAttribute('aria-expanded', 'true');
  }
};

workCards.forEach((card) => {
  card.setAttribute('tabindex', '0');
  card.setAttribute('aria-expanded', 'false');
  card.setAttribute(
    'aria-label',
    card.querySelector('.detalles-video h3').textContent.trim()
  );

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
