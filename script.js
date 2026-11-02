      const toggle = document.getElementById('toggle');
      const links = document.getElementById('links');
      const toolbar = document.getElementById('mi-toolbar');
      const sections = document.querySelectorAll('main > section');
      const workCards = document.querySelectorAll('.tarjeta-trabajo');
      const touchLayout = window.matchMedia('(hover: none), (max-width: 800px)');
      let sectionUpdateScheduled = false;

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
