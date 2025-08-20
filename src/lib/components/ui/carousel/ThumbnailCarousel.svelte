<script lang="ts">
  import { BiSolidChevronLeftCircle, BiSolidChevronRightCircle } from 'svelte-icons-pack/bi';
  import type { EmblaCarouselType, EmblaOptionsType } from 'embla-carousel';
  import emblaCarouselSvelte from 'embla-carousel-svelte';
  import { Icon } from 'svelte-icons-pack';
  import type { Image } from '$types';
  import Thumbnails from './Thumbnails.svelte';

  type Props = {
    images: Image[];
  };

  let { images }: Props = $props();

  let emblaApi: EmblaCarouselType | undefined = $state();
  let verticalThumbsApi: EmblaCarouselType | undefined = $state();
  let horizontalThumbsApi: EmblaCarouselType | undefined = $state();
  let selectedSlide = $state(0);

  const options: EmblaOptionsType = { loop: true };

  let prevButton: HTMLElement;
  let nextButton: HTMLElement;

  const stopPropagation = (fn: { call: (arg0: HTMLElement, arg1: Event) => void }) => {
    return function (this: HTMLElement, event: Event): void {
      event.stopPropagation();
      fn.call(this, event);
    };
  };

  const onInit = (event: CustomEvent): void => {
    emblaApi = event.detail;

    if (emblaApi !== undefined) {
      prevButton.addEventListener('click', stopPropagation(emblaApi.scrollPrev));
      nextButton.addEventListener('click', stopPropagation(emblaApi.scrollNext));
    }
  };

  $effect(() => {
    if (emblaApi === undefined || verticalThumbsApi === undefined || horizontalThumbsApi === undefined) return;
    emblaApi.on('select', (eventApi) => {
      const selectedIndex = eventApi.selectedScrollSnap();
      if (verticalThumbsApi !== undefined && horizontalThumbsApi !== undefined) {
        verticalThumbsApi.scrollTo(selectedIndex);
        horizontalThumbsApi.scrollTo(selectedIndex);
        selectedSlide = selectedIndex;
      }
    });
  });
</script>

<div class="flex flex-col-reverse select-none lg:flex-row">
  <div class="hidden h-[35vw] w-[8.75vw] lg:block">
    <Thumbnails axis="y" {emblaApi} {images} {selectedSlide} bind:thumbsApi={verticalThumbsApi} />
  </div>

  <div class="h-[21.25vw] w-[85vw] lg:hidden">
    <Thumbnails axis="x" {emblaApi} {images} {selectedSlide} bind:thumbsApi={horizontalThumbsApi} />
  </div>

  <div class="relative h-[85vw] w-[85vw] lg:h-[35vw] lg:w-[35vw]">
    <button bind:this={prevButton} class="prev-button" aria-label="prev slide" type="button">
      <Icon size="25" src={BiSolidChevronLeftCircle} />
    </button>

    <div class="embla" onemblaInit={onInit} use:emblaCarouselSvelte={{ plugins: [], options }}>
      <div class="embla__container">
        {#each images as { url, alt } (url + alt)}
          <div class="embla__slide">
            <img class="h-[85vw] object-cover lg:h-[35vw]" {alt} src={url} />
          </div>
        {/each}
      </div>
    </div>

    <button bind:this={nextButton} class="next-button" aria-label="next slide" type="button">
      <Icon size="25" src={BiSolidChevronRightCircle} />
    </button>
  </div>
</div>

<style>
  .prev-button,
  .next-button {
    color: rgba(255, 255, 255, 0.5);
    position: absolute;
    top: 45%;
    z-index: 1;
    cursor: pointer;
    margin: 10px;
  }

  .next-button {
    right: 0;
  }

  .embla {
    overflow: hidden;
  }

  .embla__container {
    display: flex;
  }

  .embla__slide {
    flex: 0 0 100%;
    min-width: 0;
  }
</style>
