<script lang="ts">
  import { bffClient, ClientError } from '$service';
  import { Button, TextInput } from '$components';
  import { FormField, mapFormFieldsToValues, validateFormFields } from '$lib/utils/form-fields.svelte';
  import { checkout } from '$content';
  import { loading } from '$state';
  import type { Order } from '$types';
  import { page } from '$app/state';
  import { validateEmail } from '$lib/utils/input-validation';

  type Props = {
    order: Order | null | undefined;
    issue: string | undefined;
  };

  let { order = $bindable(), issue = $bindable() }: Props = $props();

  const formFields = {
    email: new FormField({
      id: 'personal-details-email',
      type: 'email',
      name: 'email',
      autocomplete: 'username',
      label: checkout.personalDetailsPage.formFields.email.label,
      invalidText: checkout.personalDetailsPage.formFields.email.invalidText,
      validate: validateEmail,
      required: true,
    }),
  };

  const onFormSubmit = (event: Event): void => {
    event.preventDefault();
    if (!validateFormFields(formFields)) return;
    const orderId = page.url.searchParams.get('id') ?? undefined;

    const email = mapFormFieldsToValues(formFields).email;

    loading.withLoading(async () => {
      try {
        order = (
          await bffClient.order.getById(page.params.country, orderId ?? '', { headers: { 'x-user-email': email } })
        ).order;

        issue = undefined;
      } catch (error) {
        if (!(error instanceof ClientError)) {
          order = null;
          return;
        }
        if (error.statusCode !== 401) {
          order = null;
          issue = undefined;
        }
      }
    });
  };
</script>

<form class="w-96 max-w-[90%]" onsubmit={onFormSubmit}>
  <TextInput field={formFields.email}>
    {#snippet label()}
      {formFields.email.label}
    {/snippet}
  </TextInput>

  <Button class="mt-5" fullWidth type="submit">Submit</Button>
</form>
