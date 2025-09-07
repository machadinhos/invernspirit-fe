import type { ComponentProps } from 'svelte';
import Icon from './Icon.svelte';

export { Icon };
export type IconSrcType = ComponentProps<typeof Icon>['src'];
export * from './icons';
export * from './logos';
