<div style="background-image: url(/images/logo.webp)" class="pulsating-image size-44 bg-cover"></div>

<style>
  .pulsating-image {
    filter: drop-shadow(0 0 5px white);
    animation: pulsate 1.5s infinite;
  }

  @keyframes pulsate {
    0% {
      opacity: 0;
    }
    80% {
      opacity: 1;
      transform: scale(1.2);
    }
    100% {
      opacity: 0;
      transform: scale(1.2);
    }
  }
</style>
