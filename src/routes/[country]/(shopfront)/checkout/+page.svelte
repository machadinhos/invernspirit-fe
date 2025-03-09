<script lang="ts">
  import type { CheckoutStage, StageName } from '$types';
  import { nextStage, prevStage, stagesTitles } from './stages';
  import AddressPage from './AddressPage.svelte';
  import { bffClient } from '$service';
  import { BreadCrumbs } from '$components';
  import { checkout } from '$content';
  import { config } from '$state';
  import { FaSolidArrowLeft } from 'svelte-icons-pack/fa';
  import { goto } from '$app/navigation';
  import { Icon } from 'svelte-icons-pack';
  import { onMount } from 'svelte';
  import { page } from '$app/state';
  import type { PageData } from './$types';
  import PersonalDetailsPage from './PersonalDetailsPage.svelte';
  import ReviewPage from './ReviewPage.svelte';
  import ShippingMethodPage from './ShippingMethodPage.svelte';
  import SummarySection from '../SummarySection.svelte';

  type Props = {
    data: PageData;
  };

  let { data }: Props = $props();

  let selectedStage: StageName | undefined = $state();
  let stages: CheckoutStage[] | undefined = $state();
  let enabledStages: StageName[] | undefined = $derived(
    stages?.filter((stage) => stage.isEnabled).map((stage) => stage.name),
  );
  let shippingCost = $state(0);
  let onStageSubmit: ((e: SubmitEvent) => Promise<void>) | undefined = $state();

  const finalOnStageSubmit = async (e: SubmitEvent): Promise<void> => {
    e.preventDefault();
    await onStageSubmit?.(e);
  };

  const getStageFromUrl = (): StageName | undefined => (page.url.searchParams.get('stage') as StageName) ?? undefined;

  $effect(() => {
    const newStage = getStageFromUrl();
    if (enabledStages?.includes(newStage as StageName)) selectedStage = newStage;
  });

  const goToStage = (getStageFunc: (stage: StageName, stages: StageName[]) => StageName): void => {
    if (!selectedStage || !enabledStages) return;
    const newStage = getStageFunc(selectedStage, enabledStages);
    if (selectedStage === newStage) return;
    goto(`/${page.params.country}/checkout?stage=${newStage}`);
  };

  const goToNextStage = (): void => goToStage(nextStage);
  const goToPrevStage = (): void => goToStage(prevStage);

  const goToCart = (): Promise<void> => goto(`/${page.params.country}/cart`);

  onMount(async () => {
    const { availableCheckoutStages, isCheckoutPossible } = await config.afterInitialization(() =>
      bffClient.checkout.stages.get(page.params.country),
    );
    if (isCheckoutPossible === false) {
      goto(`/${page.params.country}/cart`, { replaceState: true });
      return;
    }
    stages = availableCheckoutStages;
    const lastEnabledStage = enabledStages?.at(-1);
    if (lastEnabledStage !== getStageFromUrl()) {
      goto(`/${page.params.country}/checkout?stage=${lastEnabledStage}`, { replaceState: true });
      selectedStage = lastEnabledStage;
    }
  });
</script>

<svelte:head><title>{checkout.headTitle}</title></svelte:head>

<div class="flex h-full w-full flex-col items-center">
  {#if stages && selectedStage && enabledStages}
    <div class="mt-4 mb-4 flex flex-col items-center">
      <div class="ml-2 flex gap-3">
        <button
          onclick={prevStage(selectedStage, enabledStages) !== selectedStage ? goToPrevStage : goToCart}
          type="button"
        >
          <Icon size="20" src={FaSolidArrowLeft} />
        </button>
        <BreadCrumbs aria-label="Checkout Stages" breadCrumbs={stages}>
          {#snippet separator()}<span class="select-none">/</span>{/snippet}
          {#snippet breadCrumbSnippet(stage: CheckoutStage)}
            {#if stage.isEnabled}
              <a
                class="text-primary"
                class:underline={stage.isEnabled && stage.name === selectedStage}
                href="/{page.params.country}/checkout?stage={stage.name}">{stage.title}</a
              >
            {:else}
              <span>{stage.title}</span>
            {/if}
          {/snippet}
        </BreadCrumbs>
      </div>
      <h1 style="font-size: 2.5rem" class="text-center">
        {stagesTitles[selectedStage]}
      </h1>
      <div class="pointer-events-none h-0.5 w-32 bg-white select-none"></div>
    </div>
    <form
      class="flex w-full flex-1 flex-col items-center md:flex-row md:items-start md:justify-center md:gap-5 lg:gap-10"
      onsubmit={finalOnStageSubmit}
    >
      <div class="flex w-[90%] max-w-[675px] flex-1 flex-col gap-4 md:mb-5 md:w-2/3">
        {#if selectedStage === 'personal-details'}
          <PersonalDetailsPage {goToNextStage} bind:onStageSubmit bind:stages />
        {:else if selectedStage === 'address'}
          <AddressPage {goToNextStage} bind:onStageSubmit bind:stages />
        {:else if selectedStage === 'shipping'}
          <ShippingMethodPage country={data.country} {goToNextStage} bind:onStageSubmit bind:stages />
        {:else if selectedStage === 'review'}
          <ReviewPage country={data.country} bind:onStageSubmit bind:shippingCost />
        {/if}
      </div>
      <div class="sticky -bottom-px w-full md:top-0 md:w-1/3 md:max-w-[396px]">
        <SummarySection
          additionalCharges={page.url.searchParams.get('stage') === 'review' && shippingCost
            ? [{ name: checkout.shippingCost, price: shippingCost }]
            : undefined}
          buttonText="Continue"
          buttonType="submit"
          country={data.country}
        />
      </div>
    </form>
  {/if}
</div>
