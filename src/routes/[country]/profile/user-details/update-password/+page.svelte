<script lang="ts">
  import { Button, TextInput } from '$components';
  import { FormField, mapFormFieldsToValues, validateFormFields } from '$lib/utils/form-fields.svelte';
  import { bffClient } from '$service';
  import { Form } from '$components-utils';
  import { goto } from '$app/navigation';
  import { page } from '$app/state';
  import { profile } from '$content';
  import { validatePassword } from '$lib/utils/input-validation';

  let processing = $state(false);

  const formFields = {
    currentPassword: new FormField({
      id: 'update-password-current-password',
      name: 'currentPassword',
      type: 'password',
      autocomplete: 'current-password',
      label: profile.userDetails.updatePassword.formFields.currentPassword.label,
      invalidText: profile.userDetails.updatePassword.formFields.currentPassword.invalidText,
      validate: (value): boolean => validatePassword(value).isValid,
      required: true,
    }),
    newPassword: new FormField({
      id: 'update-password-new-password',
      name: 'newPassword',
      type: 'password',
      autocomplete: 'new-password',
      label: profile.userDetails.updatePassword.formFields.newPassword.label,
      invalidText: profile.userDetails.updatePassword.formFields.newPassword.invalidText,
      validate: (value): boolean => validatePassword(value).isValid,
      required: true,
    }),
    confirmPassword: new FormField({
      id: 'update-password-confirm-password',
      name: 'confirmPassword',
      type: 'password',
      autocomplete: 'new-password',
      label: profile.userDetails.updatePassword.formFields.confirmPassword.label,
      invalidText: profile.userDetails.updatePassword.formFields.confirmPassword.invalidText,
      validate: (value): boolean => validatePassword(value).isValid,
      required: true,
      includeInMapping: false,
    }),
  };

  const onsubmit = async (): Promise<void> => {
    if (!validateFormFields(formFields)) return;

    const payload = mapFormFieldsToValues(formFields);
    await bffClient.user.update.password(page.params.country, payload);

    goto(`/${page.params.country}/profile/user-details`);
  };
</script>

<Form class="w-full" {onsubmit} bind:processing>
  {#each Object.values(formFields) as field (field.id)}
    <TextInput {field}>
      {#snippet label()}
        {field.label}
      {/snippet}
    </TextInput>
  {/each}

  <Button class="mt-5" disabled={processing} fullWidth type="submit"
    >{profile.userDetails.updatePassword.submitButton}</Button
  >
</Form>
