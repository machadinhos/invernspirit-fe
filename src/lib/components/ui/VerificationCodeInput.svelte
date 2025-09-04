<script lang="ts">
  type Props = {
    value: string;
    type: 'numeric' | 'alphanumeric';
    length: number;
  };

  let { value = $bindable(), type, length }: Props = $props();
  const id = $props.id();

  const getIndexFromId = (id: string): number => Number(id.split('-')[2]);

  const getFullValue = (): string => {
    return Array.from({ length }, (_, i) => document.getElementById(`${id}-input-${i}`) as HTMLInputElement)
      .map((el) => el.value)
      .join('');
  };

  const oninput = (event: Event): void => {
    const target = event.target as HTMLInputElement;
    const index = getIndexFromId(target.id);
    let inputValue = target.value;
    if (inputValue.length > 1) {
      inputValue = inputValue.slice(-1);
      target.value = inputValue;
    }
    if (type === 'numeric') {
      inputValue = inputValue.replace(/[^0-9]/g, '');
      target.value = inputValue;
    }
    value = getFullValue();
    if (inputValue === '' || index === length - 1) return;
    const nextInput = document.getElementById(`${id}-input-${index + 1}`) as HTMLInputElement;
    nextInput.focus();
  };

  const onkeydown = (event: KeyboardEvent): void => {
    const target = event.target as HTMLInputElement;
    const index = getIndexFromId(target.id);

    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      if (index === 0) return;
      const prevInput = document.getElementById(`${id}-input-${index - 1}`) as HTMLInputElement;
      prevInput.focus();
    } else if (event.key === 'ArrowRight') {
      event.preventDefault();
      if (index === length - 1) return;
      const nextInput = document.getElementById(`${id}-input-${index + 1}`) as HTMLInputElement;
      nextInput.focus();
    } else if (event.key === 'Backspace') {
      if (index === 0 || target.value !== '') return;
      const prevInput = document.getElementById(`${id}-input-${index - 1}`) as HTMLInputElement;
      prevInput.focus();
    }
  };

  const onpaste = (event: ClipboardEvent): void => {
    event.preventDefault();
    const target = event.target as HTMLInputElement;
    let index = target.value !== '' ? getIndexFromId(target.id) + 1 : getIndexFromId(target.id);

    const text = (event.clipboardData?.getData('text') ?? '').trim();
    if ((index === length - 1 && target.value !== '') || text.length === 0 || /[^0-9]/g.test(text)) return;
    for (
      let inputIndex = index, charIndex = 0;
      inputIndex < length && charIndex < text.length;
      inputIndex++, charIndex++
    ) {
      const input = document.getElementById(`${id}-input-${inputIndex}`) as HTMLInputElement;
      input.value = text[charIndex];
    }

    const lastWrittenInput = document.getElementById(`${id}-input-${index + text.length}`);
    if (!lastWrittenInput) document.getElementById(`${id}-input-${length - 1}`)?.focus();
    else lastWrittenInput.focus();

    value = getFullValue();
  };

  const getInputs = (): HTMLInputElement[] => {
    const inputs = document.getElementsByClassName(`${id}-input`);
    return Array.from(inputs) as HTMLInputElement[];
  };

  const onfocus = (event: FocusEvent): void => {
    const target = event.target as HTMLInputElement;
    requestAnimationFrame(() => {
      target.setSelectionRange(target.value.length, target.value.length);
    });
    if (target.value !== '') return;
    const inputs = getInputs();
    const firstEmptyInput = inputs.find((input) => input.value === '');
    if (!firstEmptyInput) return;
    if (firstEmptyInput === target) return;
    const index = getIndexFromId(firstEmptyInput.id);
    if (index === length - 1) return;
    inputs[index].focus();
  };
</script>

<div class="flex gap-2">
  {#each Array.from({ length }, (_, i) => i) as index (index)}
    <input
      id="{id}-input-{index}"
      class="{id}-input w-7 border-b-2 border-white text-center focus:border-b-primary"
      aria-label="code digit {index + 1}"
      autocomplete="off"
      inputmode={type === 'numeric' ? 'numeric' : 'text'}
      {onfocus}
      {oninput}
      {onkeydown}
      {onpaste}
      required
      {type}
    />
  {/each}
</div>
