const video = document.getElementById('intro-video');

const redirectHome = () => {
  window.location.replace('../home/home.html');
};

if (video) {
  const handleVideoReady = () => {
    video.play().catch(() => {
      window.setTimeout(() => {
        redirectHome();
      }, 800);
    });
  };

  video.addEventListener('loadeddata', handleVideoReady, { once: true });
  video.addEventListener('ended', redirectHome, { once: true });

  if (video.readyState >= 2) {
    handleVideoReady();
  }
}

window.addEventListener('load', () => {
  if (video && video.readyState >= 2) {
    video.play().catch(() => {
      redirectHome();
    });
  }
});
