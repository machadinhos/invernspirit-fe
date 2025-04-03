<script lang="ts">
  import { Button, DropdownMenu, DropdownMenuItem, TextInput } from '$components';
  import { FormField, validateFormFields } from '$lib/utils/form-fields.svelte';
  import { common } from '$content';
  import { FaNewspaper } from 'svelte-icons-pack/fa';
  import HeaderIcon from '../HeaderIcon.svelte';
  import { Icon } from 'svelte-icons-pack';
  import { TiMail } from 'svelte-icons-pack/ti';
  import { validateEmail } from '$lib/utils/input-validation';

  let isOpen = $state(false);

  const formFields = {
    email: new FormField({
      id: 'newsletter-email',
      type: 'email',
      name: 'newsletter email',
      autocomplete: 'email',
      label: common.header.leftSection.emailForm.label,
      invalidText: common.header.leftSection.emailForm.invalidText,
      validate: validateEmail,
      required: true,
    }),
  };

  const handleIconClick = (): void => {
    isOpen = !isOpen;
  };

  const subscribeToNewsletter = (): void => {
    if (!validateFormFields(formFields)) return;
    alert('todo');
    isOpen = false;
  };

  const clearState = (): void => {
    isOpen = false;
    formFields.email.value = '';
    formFields.email.isValid = true;
  };
</script>

<div>
  <DropdownMenu class="w-80" onClose={clearState} position="left" bind:isOpen>
    {#snippet triggerElement()}
      <HeaderIcon
        aria-label={common.header.leftSection.areaLabels.newsletter}
        onclick={handleIconClick}
        src={FaNewspaper}
        type="button"
      />
    {/snippet}
    <form class="m-5" onsubmit={subscribeToNewsletter}>
      <DropdownMenuItem>
        <h2 class="text-lg">{common.header.leftSection.newsletterTitle}</h2>
      </DropdownMenuItem>
      <DropdownMenuItem class="w-full">
        <div class="mt-2 w-full">
          <TextInput field={formFields.email}>
            {#snippet label()}
              <div class="flex items-center gap-0.5">
                <Icon size="20" src={TiMail} />
                {common.header.leftSection.emailForm.label}
              </div>
            {/snippet}
          </TextInput>
        </div>
      </DropdownMenuItem>
      <DropdownMenuItem class="w-full">
        <Button class="mt-2" fullWidth type="submit">{common.header.leftSection.subscribe}</Button>
      </DropdownMenuItem>
    </form>
  </DropdownMenu>
</div>
