<script lang="ts">
  import { Anchor, Button, DropdownMenu, DropdownMenuItem } from '$components';
  import { auth, common } from '$content';
  import { cart, user } from '$state';
  import { FaSolidArrowRightFromBracket, FaSolidUser } from 'svelte-icons-pack/fa';
  import { bffClient } from '$service';
  import { goto } from '$app/navigation';
  import HeaderIcon from '$lib/components/layout/header/HeaderIcon.svelte';
  import { Icon } from 'svelte-icons-pack';
  import { page } from '$app/state';

  let isOpen = $state(false);

  const handleUserButtonClick = (): void => {
    isOpen = !isOpen;
  };

  const handleSignOut = async (): Promise<void> => {
    const { cart: newCart } = await bffClient.user.logout(page.params.country);
    isOpen = false;
    user.value = undefined;
    cart.setCart(newCart);
    goto(`/${page.params.country}`, {});
  };

  const closeDropdown = (): void => {
    isOpen = false;
  };
</script>

<div>
  <DropdownMenu class="p-5" position="right" bind:isOpen>
    {#snippet triggerElement()}
      {#if !user.value}
        <HeaderIcon
          aria-label={common.header.rightSection.areaLabels.user}
          href="/{page.params.country}/sign-in"
          src={FaSolidUser}
          type="anchor"
        />
      {:else}
        <HeaderIcon
          aria-label={common.header.rightSection.areaLabels.user}
          onclick={handleUserButtonClick}
          src={FaSolidUser}
          type="button"
        />
      {/if}
    {/snippet}
    <div class="text-nowrap">
      <DropdownMenuItem>
        <p class="text-2xl">{user.value?.firstName} {user.value?.lastName}</p>
      </DropdownMenuItem>
      <DropdownMenuItem>
        <p>{user.value?.email}</p>
      </DropdownMenuItem>
      <DropdownMenuItem>
        <Anchor href="/{page.params.country}/profile/user-details" onclick={closeDropdown}
          >{common.header.rightSection.profile}</Anchor
        >
      </DropdownMenuItem>
      <DropdownMenuItem class="mt-2 w-full">
        <div class="flex w-full justify-end">
          <Button class="flex gap-1.5" onclick={handleSignOut}
            ><Icon src={FaSolidArrowRightFromBracket} />{auth.signOut}</Button
          >
        </div>
      </DropdownMenuItem>
    </div>
  </DropdownMenu>
</div>
