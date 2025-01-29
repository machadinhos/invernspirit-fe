<script lang="ts">
  import { appleIcon, googleIcon } from '$components-svg-icons';
  import { auth } from '$content';
  import type { Snippet } from 'svelte';
</script>

{#snippet oAuthButton(icon: Snippet, label: string, name: string)}
  <button
    class="oauth-button flex h-[35px] w-full items-center justify-center gap-2 rounded-2xl border transition-all hover:scale-110"
    aria-label={label}
    type="button"
  >
    <div class="flex h-[30px] w-[30px] items-center">
      {@render icon()}
    </div>
    <p>Continue with {name}</p>
  </button>
{/snippet}

<div class="flex w-full flex-col justify-center gap-4">
  <div class="mt-8 flex items-center gap-2">
    <div class="h-0.5 w-full bg-white"></div>
    {auth.orOAuth}
    <div class="h-0.5 w-full bg-white"></div>
  </div>
  <div class="flex w-full flex-col items-center gap-3">
    {@render oAuthButton(googleIcon, auth.googleAriaLabel, auth.googleName)}
    {@render oAuthButton(appleIcon, auth.appleAriaLabel, auth.appleName)}
  </div>
</div>

<style>
  :global .oauth-button path {
    transition: fill 250ms ease-in-out;
  }

  :global .oauth-button:not(:hover) path {
    fill: white !important;
  }
</style>
