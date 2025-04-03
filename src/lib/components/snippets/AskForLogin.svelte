<script lang="ts">
  import { FaSolidArrowLeft, FaSolidXmark } from 'svelte-icons-pack/fa';
  import { Button } from '$components';
  import { Icon } from 'svelte-icons-pack';
  import type { ModalInstance } from '$state';
  import { onClickOutside } from '$components-actions';
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
    reverseColor?: boolean;
  };

  const choices: Record<'guest' | 'signIn' | 'signUp', choice> = {
    guest: {
      name: 'continue as a guest',
      getAction: getFinalAction,
    },
    signIn: {
      name: 'sign in',
      getAction: () => () => {
        setTimeout(() => {
          state = 'sign in';
        }, 0);
      },
    },
    signUp: {
      name: 'sign up',
      getAction: () => () => {
        setTimeout(() => {
          state = 'sign up';
        }, 0);
      },
    },
  };

  const gotoChoicesState = (): string => (state = 'choosing');
</script>

{#snippet setStateButton(name: string, action: () => void, reverseColor: boolean = false)}
  <Button class="font-bold" fullWidth onclick={action} reverseColors={reverseColor} shrinkOnClick={false}>{name}</Button
  >
{/snippet}

<div class="flex h-full w-full items-center justify-center" in:scale|global>
  <div
    class="bg-background-dark relative flex max-h-[80%] min-h-[35%] w-[90%] max-w-[500px] flex-col items-center overflow-y-auto p-4 pb-8 lg:px-8"
    class:justify-center={state === 'choosing'}
    use:onClickOutside={{ callback: modal.close }}
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
          {@render setStateButton(
            choices.guest.name,
            choices.guest.getAction(modal, params.action),
            choices.guest.reverseColor,
          )}
        {/if}
        {@render setStateButton(
          choices.signIn.name,
          choices.signIn.getAction(modal, params.action),
          choices.signIn.reverseColor,
        )}
        {@render setStateButton(
          choices.signUp.name,
          choices.signUp.getAction(modal, params.action),
          choices.signUp.reverseColor,
        )}
      </div>
    {:else if state === 'sign in'}
      <SignIn actionAfterAuthentication={getFinalAction(modal, params.action)} showAuthSwitchMessage={false} />
    {:else if state === 'sign up'}
      <SignUp actionAfterAuthentication={getFinalAction(modal, params.action)} showAuthSwitchMessage={false} />
    {/if}
  </div>
</div>
