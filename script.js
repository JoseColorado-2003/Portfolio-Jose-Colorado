      const toggle = document.getElementById('toggle');
      const links = document.getElementById('links');
      const toolbar = document.getElementById('mi-toolbar');
      const sections = document.querySelectorAll('main > section');
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
