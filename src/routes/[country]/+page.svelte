<script lang="ts">
  import { Button, GrainyFilter } from '$components';
  import { home } from '$content';
  import { imageLinks } from '$constants';
  import { page } from '$app/state';

  let currentImageIndex = $state(0);
  let nextImageIndex = 1;

  const rotateImages = (): void => {
    nextImageIndex = (currentImageIndex + 1) % imageLinks.home.bgImages.length;
    currentImageIndex = nextImageIndex;
  };

  setInterval(rotateImages, 10000);
</script>

<!--links to prerender-->
<div class="hidden">
  <a href="/{page.params.country}/sign-in">sign-in</a>
  <a href="/{page.params.country}/sign-up">sign-up</a>
  <a href="/{page.params.country}/sign-up/verify-email">verify email</a>
  <a href="/{page.params.country}/profile/user-details">profile</a>
  <a href="/{page.params.country}/profile/user-details/update-email">profile</a>
  <a href="/{page.params.country}/profile/user-details/update-password">profile</a>
  <a href="/{page.params.country}/checkout">checkout</a>
  <a href="/{page.params.country}/order">order</a>
  <a href="/{page.params.country}/shop/search">search</a>
</div>

<svelte:head><title>{home.headTitle}</title></svelte:head>

<div class="pointer-events-none fixed inset-0 -z-10 h-full w-full overflow-hidden grayscale filter select-none">
  <GrainyFilter />
  {#each imageLinks.home.bgImages as image, index (index)}
    <div>
      <div
        style="background-image: url({image})"
        class={[
          'absolute inset-0 h-full w-full bg-cover bg-center bg-no-repeat brightness-[65%] transition-opacity duration-[2s]',
          index === currentImageIndex ? 'opacity-60' : 'opacity-0',
        ]}
      ></div>
    </div>
  {/each}
</div>

<div class="flex h-full w-full flex-col items-center justify-center px-5">
  <div>
    <div class="mb-4 select-none">
      <div>
        <div class="flex gap-4 font-thin">
          <h1 class="text-6xl md:text-8xl">{home.title}</h1>
          <div class="flex flex-col justify-center">
            <h2>{home.subTitle.firstLine}</h2>
            <h2>{home.subTitle.secondLine}</h2>
          </div>
        </div>
        <div class="h-0.5 w-full bg-white"></div>
      </div>
      <h3 class="text-2xl md:text-3xl">{home.description}</h3>
    </div>
    <a class="pulsating inline-flex" href="{page.params.country}/shop/products">
      <Button class="px-3 text-2xl">{home.button}</Button>
    </a>
  </div>
</div>

<style>
  @keyframes pulsate {
    from {
      filter: drop-shadow(0 0 10px rgba(255, 255, 255, 0.5));
    }
    to {
      filter: drop-shadow(0 0 10px rgba(255, 255, 255, 0));
    }
  }

  .pulsating {
    animation: pulsate 2s infinite alternate;
  }
</style>
