<script lang="ts">
  import { Button, TextInput } from '$components';
  import { FormField, mapFormFieldsToValues, validateFormFields } from '$lib/utils/form-fields.svelte';
  import { auth } from '$content';
  import { bffClient } from '$service';
  import { Form } from '$components-utils';
  import { goto } from '$app/navigation';
  import { onMount } from 'svelte';
  import { page } from '$app/state';
  import { validateEmail } from '$lib/utils/input-validation';

  let processing = $state(false);

  const formFields = {
    email: new FormField({
      id: 'forgot-password-email',
      name: 'email',
      autocomplete: 'username',
      type: 'email',
      label: auth.forgotPassword.emailPage.emailFormField.label,
      invalidText: auth.forgotPassword.emailPage.emailFormField.invalidText,
      validate: validateEmail,
      required: true,
    }),
  };

  const onsubmit = async (): Promise<void> => {
    if (!validateFormFields(formFields)) return;

    const email = mapFormFieldsToValues(formFields).email;
    await bffClient.user.forgotPassword.submitEmail(page.params.country, email);

    goto(`/${page.params.country}/forgot-password?email=${encodeURIComponent(email)}`);
  };

  onMount(() => {
    if (page.url.searchParams.has('autofill-email')) {
      formFields.email.value = page.url.searchParams.get('autofill-email') ?? '';
      page.url.searchParams.delete('autofill-email');
      goto(page.url, { replaceState: true });
    }
  });
</script>

<Form class="w-full" {onsubmit} bind:processing>
  <h1 class="text-center text-3xl">{auth.forgotPassword.emailPage.title}</h1>
  <TextInput field={formFields.email}>
    {#snippet label()}
      {formFields.email.label}
    {/snippet}
  </TextInput>
  <Button class="mt-2.5" disabled={processing} fullWidth type="submit"
    >{auth.forgotPassword.emailPage.submitButton}</Button
  >
</Form>
