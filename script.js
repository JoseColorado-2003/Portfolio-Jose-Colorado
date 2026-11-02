      const toggle = document.getElementById('toggle');
      const links = document.getElementById('links');
      const toolbar = document.getElementById('mi-toolbar');
      const sections = document.querySelectorAll('main > section');
      const workCards = document.querySelectorAll('.tarjeta-trabajo');
      const nicheList = document.querySelector('.niche-list');
      const niches = nicheList.querySelectorAll('.niche');
      const touchLayout = window.matchMedia('(hover: none), (max-width: 800px)');
      let sectionUpdateScheduled = false;
      const closingNiches = new Map();

      toggle.addEventListener('click', () => {
        links.classList.toggle('open');
        toggle.setAttribute(
          'aria-expanded',
          links.classList.contains('open') ? 'true' : 'false'
        );
      });

      links.querySelectorAll('a').forEach((a) => {
        a.addEventListener('click', () => links.classList.remove('open'));
      });

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

      const updateToolbarColor = () => {
        sectionUpdateScheduled = false;
        const marker = toolbar.getBoundingClientRect().bottom;
        const currentSection = Array.from(sections).reduce((current, section) => {
          return section.getBoundingClientRect().top <= marker ? section : current;
        }, sections[0]);

        if (currentSection) {
          links.querySelectorAll('a[href^="#"]').forEach((link) => {
            if (link.hash === `#${currentSection.id}`) {
              link.setAttribute('aria-current', 'location');
            } else {
              link.removeAttribute('aria-current');
            }
          });

          const sectionStyles = window.getComputedStyle(currentSection);
          toolbar.style.setProperty(
            '--toolbar-background',
            sectionStyles.getPropertyValue('--toolbar-background').trim()
          );
          toolbar.style.setProperty(
            '--toolbar-text-color',
            sectionStyles.getPropertyValue('--toolbar-text-color').trim()
          );
        }
      };

      const scheduleToolbarColorUpdate = () => {
        if (!sectionUpdateScheduled) {
          sectionUpdateScheduled = true;
          window.requestAnimationFrame(updateToolbarColor);
        }
      };

      window.addEventListener('scroll', scheduleToolbarColorUpdate, { passive: true });
      window.addEventListener('resize', scheduleToolbarColorUpdate);
      updateToolbarColor();

      document.getElementById('year').textContent = new Date().getFullYear();
