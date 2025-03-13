<script lang="ts">
  import { about } from '$content';
  import { imageLinks } from '$constants';
</script>

<svelte:head><title>{about.headTitle}</title></svelte:head>

<div class="flex w-full justify-center">
  <section class="mt-9 w-[90%] max-w-[1400px]">
    <h1 class="text-center text-6xl">{about.title1}</h1>
    <h2 class="text-center text-4xl">{about.title2}</h2>
    <div class="my-4 h-px w-full bg-white"></div>
    <div class="flex flex-col gap-4">
      <div class="flex h-[150px] items-center overflow-hidden">
        <img class="w-full" alt="ceramic banner" src={imageLinks.about.banner} />
      </div>
      <h3>{about.subtitle1}</h3>
      <p>{about.text1}</p>
      <p>{about.text2}</p>
      <div class="flex w-full flex-col-reverse gap-4 lg:flex-row lg:gap-20">
        <div class="flex flex-col gap-4 lg:w-3/5">
          <p>{about.text3}</p>
          <p>{about.text4}</p>
          <p>{about.text5}</p>
          <p>{about.text6}</p>
          <h3>{about.subtitle4}</h3>
          <p>{about.text7}</p>
        </div>
        <div class="my-5 flex justify-center lg:my-0 lg:w-2/5">
          <img class="object-cover" alt="mafalda" src={imageLinks.about.mafalda} />
        </div>
      </div>
    </div>
  </section>
</div>

<style>
  p {
    text-align: justify;
    font-size: large;
  }

  h3 {
    font-size: xx-large;
  }
</style>
