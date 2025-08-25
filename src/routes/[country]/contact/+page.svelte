<script lang="ts">
  import { Button, TextInput } from '$components';
  import { FormField, validateFormFields } from '$lib/utils/form-fields.svelte';
  import { validateEmail, validateRequiredInput } from '$lib/utils/input-validation';
  import { contactUs } from '$content';

  const formFields = {
    name: new FormField({
      id: 'contact-us-name',
      name: 'name',
      type: 'text',
      autocomplete: 'name',
      label: contactUs.formFields.name.label,
      invalidText: contactUs.formFields.name.invalidText,
      validate: validateRequiredInput,
      required: true,
    }),
    email: new FormField({
      id: 'contact-us-email',
      name: 'email',
      autocomplete: 'email',
      type: 'email',
      label: contactUs.formFields.email.label,
      invalidText: contactUs.formFields.email.invalidText,
      validate: validateEmail,
      required: true,
    }),
    subject: new FormField({
      id: 'contact-us-subject',
      name: 'subject',
      autocomplete: 'on',
      type: 'text',
      label: contactUs.formFields.subject.label,
      invalidText: contactUs.formFields.subject.invalidText,
      validate: validateRequiredInput,
      required: true,
    }),
    message: new FormField({
      id: 'contact-us-message',
      name: 'message',
      autocomplete: 'off',
      type: 'textarea',
      label: contactUs.formFields.message.label,
      invalidText: contactUs.formFields.message.invalidText,
      validate: validateRequiredInput,
      required: true,
    }),
  };

  const submitMessage = (): void => {
    if (!validateFormFields(formFields)) return;
    alert('todo');
  };
</script>

<svelte:head><title>{contactUs.headTitle}</title></svelte:head>

<div class="flex h-full w-full justify-center">
  <div
    class="mt-10 flex h-fit w-[95%] flex-col items-center py-14 sm:w-[80%] md:w-[65%] md:bg-background-dark md:shadow-2xl lg:w-[50%] xl:w-[30%]"
  >
    <div class="flex w-full flex-col items-center">
      <h1 style="font-size: 2.5rem" class="text-center">
        {contactUs.title}
      </h1>
      <div class="pointer-events-none h-0.5 w-[35%] bg-white select-none"></div>
    </div>
    <div class="mt-5 w-[75%]">
      <form onsubmit={submitMessage}>
        {#each Object.values(formFields) as field (field.id)}
          <div class="w-full">
            <TextInput {field}>
              {#snippet label()}
                {field.label}
              {/snippet}
            </TextInput>
          </div>
        {/each}
        <Button class="mt-5" fullWidth type="submit">{contactUs.submitButton}</Button>
      </form>
    </div>
  </div>
</div>
