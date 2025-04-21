<script lang="ts">
  import { CheckBox, TextInput, TextInputWithAutocomplete } from '$components';
  import type { CheckoutStage, Country } from '$types';
  import {
    FormField,
    mapFormFieldsToValues,
    populateFormFields,
    validateFormFields,
  } from '$lib/utils/form-fields.svelte';
  import { validateNotRequiredInput, validateRequiredInput } from '$lib/utils/input-validation';
  import { bffClient } from '$service';
  import { checkout } from '$content';
  import { onMount } from 'svelte';
  import { page } from '$app/state';
  import { provinces } from '$lib/utils/address';
  import { user } from '$state';

  type Props = {
    stages: CheckoutStage[];
    goToNextStage: () => void;
    onStageSubmit: ((e: SubmitEvent) => void) | undefined;
    country: Country;
  };

  let { stages = $bindable(), goToNextStage, onStageSubmit = $bindable(), country }: Props = $props();

  let saveAddress = $state(true);

  const formFields = {
    street: new FormField({
      id: 'address-street',
      name: 'street',
      autocomplete: 'street-address',
      type: 'text',
      label: checkout.addressPage.formFields.street.label,
      invalidText: checkout.addressPage.formFields.street.invalidText,
      validate: validateRequiredInput,
      required: true,
    }),
    postalCode: new FormField({
      id: 'address-postal-code',
      name: 'postalCode',
      autocomplete: 'postal-code',
      type: 'text',
      label: checkout.addressPage.formFields.postalCode.label,
      invalidText: checkout.addressPage.formFields.postalCode.invalidText,
      validate: validateRequiredInput,
      required: true,
    }),
    houseNumber: new FormField({
      id: 'address-house-number',
      name: 'houseNumber',
      autocomplete: 'on',
      type: 'text',
      label: checkout.addressPage.formFields.houseNumber.label,
      invalidText: checkout.addressPage.formFields.houseNumber.invalidText,
      validate: validateRequiredInput,
      required: true,
    }),
    apartment: new FormField({
      id: 'address-apartment',
      name: 'apartment',
      autocomplete: 'address-line2',
      type: 'text',
      label: checkout.addressPage.formFields.apartment.label,
      invalidText: checkout.addressPage.formFields.apartment.invalidText,
      validate: validateNotRequiredInput,
      required: false,
      filterFunction: (value: string): boolean => value.trim() !== '',
    }),
    city: new FormField({
      id: 'address-city',
      name: 'city',
      autocomplete: 'address-level2',
      type: 'text',
      label: checkout.addressPage.formFields.city.label,
      invalidText: checkout.addressPage.formFields.city.invalidText,
      validate: validateRequiredInput,
      required: true,
    }),
    province: new FormField({
      id: 'address-province',
      name: 'province',
      autocomplete: 'off',
      type: 'text',
      label: checkout.addressPage.formFields.province.label,
      invalidText: checkout.addressPage.formFields.province.invalidText,
      validate:
        page.params.country === 'es'
          ? (value): boolean => validateRequiredInput(value) && provinces.includes(value)
          : (): boolean => true,
      required: page.params.country === 'es',
      filterFunction: (): boolean => page.params.country === 'es',
    }),
  };

  const onFormSubmit = async (): Promise<void> => {
    if (!validateFormFields(formFields)) return;
    const payload = {
      address: mapFormFieldsToValues(formFields),
      ...(user.isLoggedIn && { saveAddress }),
    };
    const { availableCheckoutStages } = await bffClient.checkout.stages.address.set(page.params.country, payload);
    stages = availableCheckoutStages;
    goToNextStage();
  };

  onMount(async () => {
    const { address } = await bffClient.checkout.stages.address.get(page.params.country);
    if (address && address.country === country.code) populateFormFields(formFields, address);

    onStageSubmit = onFormSubmit;
  });
</script>

<p>{checkout.addressPage.countryDisclaimer}</p>

<div class="grid gap-4 lg:grid-cols-2">
  {#each Object.values(formFields) as field (field.id)}
    {#if field.name === 'province' && page.params.country === 'es'}
      <TextInputWithAutocomplete {field} options={provinces}>
        {#snippet label()}
          {field.label}
        {/snippet}
      </TextInputWithAutocomplete>
    {:else if field.name !== 'province'}
      <TextInput {field}>
        {#snippet label()}
          {field.label}
        {/snippet}
      </TextInput>
    {/if}
  {/each}
</div>

{#if user.isLoggedIn}
  <CheckBox label={checkout.addressPage.saveAddress} bind:checked={saveAddress} />
{/if}
