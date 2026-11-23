const niches = document.querySelectorAll('.niche');
const closingNiches = new Map();

const openNiche = (niche) => {
  niche.open = true;
  niche.classList.remove('is-closing');
};

const finishNicheClose = (niche, closeState) => {
  if (closingNiches.get(niche) !== closeState) {
    return;
  }

  const description = niche.querySelector('p');
  description.removeEventListener('transitionend', closeState.transitionHandler);
  window.clearTimeout(closeState.fallbackTimer);
  niche.open = false;
  niche.classList.remove('is-closing');
  closingNiches.delete(niche);
};

const cancelNicheClose = (niche) => {
  const closeState = closingNiches.get(niche);
  if (!closeState) {
    return;
  }

  niche.querySelector('p').removeEventListener('transitionend', closeState.transitionHandler);
  window.clearTimeout(closeState.fallbackTimer);
  closingNiches.delete(niche);
  niche.classList.remove('is-closing');
};

const closeNiche = (niche) => {
  if (closingNiches.has(niche)) {
    return;
  }

  niche.classList.add('is-closing');
  const description = niche.querySelector('p');
  const closeState = { fallbackTimer: null, transitionHandler: null };
  closeState.transitionHandler = (event) => {
    if (event.target === description && event.propertyName === 'max-height') {
      finishNicheClose(niche, closeState);
    }
  };
  closingNiches.set(niche, closeState);
  description.addEventListener('transitionend', closeState.transitionHandler);
  const duration = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 450;
  closeState.fallbackTimer = window.setTimeout(
    () => finishNicheClose(niche, closeState),
    duration
  );
};

niches.forEach((niche) => {
  niche.querySelector('summary').addEventListener('click', (event) => {
    event.preventDefault();

    if (niche.open && !closingNiches.has(niche)) {
      closeNiche(niche);
      return;
    }

    if (closingNiches.has(niche)) {
      cancelNicheClose(niche);
    }

    const openNicheItem = Array.from(niches).find(
      (item) => item !== niche && item.open && !closingNiches.has(item)
    );
    if (openNicheItem) {
      closeNiche(openNicheItem);
    }

    openNiche(niche);
  });
});
