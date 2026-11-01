      const toggle = document.getElementById('toggle');
      const links = document.getElementById('links');

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

      document.getElementById('year').textContent = new Date().getFullYear();
