<script lang="ts">
  import { ChevronDownIcon, Icon } from '$components-svg-icons';
  import { DropdownMenu, DropdownMenuItem, ShrinkOnClickWrapper } from '$components';
  import { common } from '$content';
  import { page } from '$app/state';

  let isOpen = $state(false);

  const toggleDropdown = (): void => {
    isOpen = !isOpen;
  };

  const closeDropdown = (): void => {
    isOpen = false;
  };
</script>

{#snippet headerLogo()}
  <ShrinkOnClickWrapper>
    <div class="flex size-16 items-center justify-center">
      <a class="group flex size-full items-center justify-center" href="/{page.params.country}/">
        <img
          class="size-12 object-contain transition-[scale] duration-300 group-hover:scale-130"
          alt="logo"
          fetchpriority="high"
          src="/images/logo.webp"
        />
      </a>
    </div>
  </ShrinkOnClickWrapper>
{/snippet}

<nav class="mt-5 flex justify-center">
  <ul class="hidden h-full items-center gap-28 text-xl xl:flex">
    <li>
      <DropdownMenu isFullWidth bind:isOpen>
        {#snippet triggerElement()}
          <button class="flex items-center gap-1.5" onclick={toggleDropdown} type="button">
            {common.header.pages.shop.title}
            <Icon class={['transition-transform duration-300', isOpen && 'rotate-180']} src={ChevronDownIcon} />
          </button>
        {/snippet}
        <div class="flex flex-col items-center justify-center gap-4 py-4 text-2xl">
          <DropdownMenuItem>
            <a class="hover:text-primary" href="/{page.params.country}/shop/collections" onclick={closeDropdown}
              >{common.header.pages.shop.byCollection}</a
            >
          </DropdownMenuItem>
          <div class="h-0.5 w-10 bg-white"></div>
          <DropdownMenuItem>
            <a class="hover:text-primary" href="/{page.params.country}/shop/products" onclick={closeDropdown}
              >{common.header.pages.shop.byProduct}</a
            >
          </DropdownMenuItem>
        </div>
      </DropdownMenu>
    </li>
    <li>
      <a href="/{page.params.country}/about">{common.header.pages.about}</a>
    </li>
    <li class="logo">
      {@render headerLogo()}
    </li>
    <li>
      <a href="/{page.params.country}/contact">{common.header.pages.contact}</a>
    </li>
    <li>
      <a class="h-full" href="/{page.params.country}/faq">{common.header.pages.faq}</a>
    </li>
  </ul>

  <div class="xl:hidden">
    {@render headerLogo()}
  </div>
</nav>

<style>
  li:not(.logo) {
    display: inline;
    position: relative;
  }

  li:not(.logo)::after {
    pointer-events: none;
    content: '';
    position: absolute;
    left: 50%;
    bottom: -0.25rem;
    width: 100%;
    height: 2px;
    background: white;
    transform: translateX(-50%) scaleX(0);
    transform-origin: center;
    transition: transform 300ms ease-in-out;
  }

  @media (hover: hover) and (pointer: fine) {
    li:not(.logo):hover::after {
      transform: translateX(-50%) scaleX(1);
    }
  }
</style>
