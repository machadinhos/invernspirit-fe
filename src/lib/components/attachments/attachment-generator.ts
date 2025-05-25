import type { Attachment } from 'svelte/attachments';

export type AttachmentGenerator<Params extends unknown[]> = (...params: Params) => Attachment;
