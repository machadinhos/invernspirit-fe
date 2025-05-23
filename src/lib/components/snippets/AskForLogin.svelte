<script lang="ts">
  import { FaSolidArrowLeft, FaSolidXmark } from 'svelte-icons-pack/fa';
  import type { Attachment } from 'svelte/attachments';
  import { Button } from '$components';
  import { Icon } from 'svelte-icons-pack';
  import type { ModalInstance } from '$state';
  import { on } from 'svelte/events';
  import { onClickOutside } from '$components-attachments';
  import { scale } from 'svelte/transition';
  import SignIn from '$lib/components/ui/auth/SignIn.svelte';
  import SignUp from '$lib/components/ui/auth/SignUp.svelte';

  type Params = {
    action: () => Promise<void>;
    allowGuest: boolean;
  };

  type Props = {
    modal: ModalInstance<Params>;
    params: Params;
  };

  let { modal, params }: Props = $props();

  let state: 'choosing' | 'sign in' | 'sign up' = $state('choosing');

  const finalAction = async (modal: ModalInstance<Params>, action: () => Promise<void>): Promise<void> => {
    await (action ?? ((): Promise<void> => Promise.resolve()))();
    modal.close();
  };

  const getFinalAction = (modal: ModalInstance<Params>, action: () => Promise<void>): (() => Promise<void>) => {
    return () => finalAction(modal, action);
  };

  type choice = {
    name: string;
    getAction: (modal: ModalInstance<Params>, action: () => Promise<void>) => () => Promise<void> | void;
  };

  const choices: Record<'guest' | 'signIn' | 'signUp', choice> = {
    guest: {
      name: 'continue as a guest',
      getAction: getFinalAction,
    },
    signIn: {
      name: 'sign in',
      getAction: () => () => {
        state = 'sign in';
      },
    },
    signUp: {
      name: 'sign up',
      getAction: () => () => {
        state = 'sign up';
      },
    },
  };

  const gotoChoicesState = (): string => (state = 'choosing');

  const closeModal = (): void => {
    modal.close();
  };

  const closeModalOnEscape: Attachment = () => {
    const keydownHandler = (e: KeyboardEvent): void => {
      if (e.key === 'Escape') modal.close();
    };

    return on(document, 'keydown', keydownHandler);
  };
</script>

{#snippet setStateButton(name: string, action: () => void)}
  <Button class="font-bold" fullWidth onclick={action} shrinkOnClick={false}>{name}</Button>
{/snippet}

<div class="flex h-full w-full items-center justify-center" in:scale|global>
  <div
    class="bg-background-dark relative flex max-h-[80%] min-h-[35%] w-[90%] max-w-[500px] flex-col items-center overflow-y-auto p-4 pb-8 lg:px-8"
    class:justify-center={state === 'choosing'}
    {@attach closeModalOnEscape}
    {@attach onClickOutside({ callback: modal.close })}
  >
    <button
      class="absolute top-4 left-4"
      class:brightness-50={state === 'choosing'}
      aria-label="go back"
      disabled={state === 'choosing'}
      onclick={gotoChoicesState}
      type="button"
    >
      <Icon size="20" src={FaSolidArrowLeft} />
    </button>
    <button class="absolute top-4 right-4" aria-label="close" onclick={modal.close} type="button">
      <Icon size="20" src={FaSolidXmark} />
    </button>
    {#if state === 'choosing'}
      <div class="flex w-full flex-col gap-4 pt-8">
        {#if params.allowGuest}
          {@render setStateButton(choices.guest.name, choices.guest.getAction(modal, params.action))}
        {/if}
        {#each [choices.signIn, choices.signUp] as choice (choice)}
          {@render setStateButton(choice.name, choice.getAction(modal, params.action))}
        {/each}
      </div>
    {:else if state === 'sign in'}
      <SignIn
        actionAfterAuthentication={getFinalAction(modal, params.action)}
        actionAfterForgotPasswordClick={closeModal}
        showAuthSwitchMessage={false}
      />
    {:else if state === 'sign up'}
      <SignUp actionAfterAuthentication={getFinalAction(modal, params.action)} showAuthSwitchMessage={false} />
    {/if}
  </div>
</div>
