<script lang="ts">
  import type { EmblaCarouselType, EmblaOptionsType } from 'embla-carousel';
  import emblaCarouselSvelte from 'embla-carousel-svelte';
  import type { Image } from '$types';

  type Props = {
    images: Image[];
    emblaApi: EmblaCarouselType | undefined;
    thumbsApi: EmblaCarouselType | undefined;
    selectedSlide: number;
    axis: EmblaOptionsType['axis'];
  };

  let { images, emblaApi, thumbsApi = $bindable(), selectedSlide, axis }: Props = $props();

  const options: EmblaOptionsType = { containScroll: 'keepSnaps', dragFree: true, axis };

  const onInit = (event: CustomEvent): void => {
    thumbsApi = event.detail;
  };

  const generateOnclickCallback = (index: number) => {
    return (): void => emblaApi?.scrollTo(index);
  };
</script>

<div class="embla select-none">
  <div class="embla__viewport" onemblaInit={onInit} use:emblaCarouselSvelte={{ plugins: [], options }}>
    <div class={['embla__container', axis === 'x' && 'axisX', axis === 'y' && 'axisY']}>
      {#each images as { url, alt }, index (index)}
        <button
          class={['embla__slide transition-[brightness]', index !== selectedSlide && 'brightness-50']}
          onclick={generateOnclickCallback(index)}
          type="button"
        >
          <img class="size-full object-cover" {alt} src={url} />
        </button>
      {/each}
    </div>
  </div>
</div>

<style>
  .embla {
    margin: auto;
    --slide-height: 25%;
    --slide-size: 25%;
  }

  .embla__viewport {
    overflow: clip;
  }

  .embla__container {
    display: flex;
  }

  .embla__container.axisX {
    height: 21.25vw;
    flex-direction: row;
  }

  .embla__container.axisY {
    height: 35vw;
    flex-direction: column;
  }

  .embla__slide {
    transform: translate3d(0, 0, 0);
    flex: 0 0 var(--slide-size);
    min-height: 0;
    aspect-ratio: 1;
    touch-action: manipulation;
  }
</style>
