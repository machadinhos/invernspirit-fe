<script lang="ts">
  import { Anchor, Button, TextInput } from '$components';
  import { auth, profile } from '$content';
  import { FormField, mapFormFieldsToValues, validateFormFields } from '$lib/utils/form-fields.svelte';
  import { validateEmail, validateRequiredInput } from '$lib/utils/input-validation';
  import { bffClient } from '$service';
  import { config } from '$state';
  import type { GenericFormField } from '$lib/utils/form-fields.svelte';
  import { onMount } from 'svelte';
  import { page } from '$app/state';
  import type { UserDetails } from '$types';

  let user: UserDetails | undefined = $state();
  let editing = $state(false);
  let processing = $state(false);

  const formFields = {
    firstName: new FormField({
      id: 'sign-up-first-name',
      name: 'firstName',
      autocomplete: 'given-name',
      type: 'text',
      label: auth.signUp.formFields.firstName.label,
      invalidText: auth.signUp.formFields.firstName.invalidText,
      validate: validateRequiredInput,
      required: true,
      filterFunction: (value: string): boolean => value.trim() !== user?.firstName,
    }),
    lastName: new FormField({
      id: 'sign-up-last-name',
      name: 'lastName',
      autocomplete: 'family-name',
      type: 'text',
      label: auth.signUp.formFields.lastName.label,
      invalidText: auth.signUp.formFields.lastName.invalidText,
      validate: validateRequiredInput,
      required: true,
      filterFunction: (value: string): boolean => value.trim() !== user?.lastName,
    }),
    email: new FormField({
      id: 'sign-up-email',
      name: 'email',
      autocomplete: 'username',
      type: 'email',
      label: auth.signUp.formFields.email.label,
      invalidText: auth.signUp.formFields.email.invalidText,
      validate: validateEmail,
      required: true,
      filterFunction: (value: string): boolean => value.trim() !== user?.email,
    }),
  };

  const onEditClick = (): void => {
    if (!user) return;
    formFields.email.value = user.email;
    formFields.firstName.value = user.firstName;
    formFields.lastName.value = user.lastName;
    editing = true;
  };

  const onSaveChanges = async (): Promise<void> => {
    if (processing) return;
    processing = true;

    try {
      if (!validateFormFields(formFields)) return;
      const payload = mapFormFieldsToValues(formFields);
      user = await bffClient.user.update(page.params.country, payload);
      editing = false;
      return;
    } finally {
      processing = false;
    }
  };

  const onCancelChanges = (): void => {
    editing = false;
  };

  onMount(() => {
    config.afterInitialization(async () => {
      user = await bffClient.user.get(page.params.country);
    });
  });
</script>

{#snippet detailLine(label: string, value: string, formField: GenericFormField)}
  <tr>
    <td>
      {label}:
    </td>
    <td>
      {#if editing}
        <TextInput field={formField} />
      {:else}
        {value}
      {/if}
    </td>
  </tr>
{/snippet}

{#if user}
  <div class="flex flex-col">
    <table class="border-separate border-spacing-x-2">
      {@render detailLine(profile.userDetails.email, user.email, formFields.email)}
      {@render detailLine(profile.userDetails.firstName, user.firstName, formFields.firstName)}
      {@render detailLine(profile.userDetails.lastName, user.lastName, formFields.lastName)}
    </table>
    <!--  TODO-->
    {#if user.address}{/if}
    {#if !editing}
      <Button class="w-16" onclick={onEditClick} type="button">{profile.userDetails.edit}</Button>
    {:else}
      <div class="flex gap-5">
        <Button disabled={processing} onclick={onCancelChanges} type="button"
          >{profile.userDetails.cancelChanges}</Button
        >
        <Button disabled={processing} onclick={onSaveChanges} type="button">{profile.userDetails.saveChanges}</Button>
      </div>
    {/if}
    <!--  TODO-->
    <Anchor class="w-fit" href="/{page.params.country}/">{profile.userDetails.changePassword}</Anchor>
  </div>
{/if}
