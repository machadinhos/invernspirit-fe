<script lang="ts">
  import { faq } from '$content';
  import { Icon } from 'svelte-icons-pack';
  import { SlMagnifier } from 'svelte-icons-pack/sl';

  type FAQItem = {
    question: string;
    answer: string;
  };

  const faqData: FAQItem[] = [
    {
      question: 'TEST1',
      answer: 'test test test test',
    },
    {
      question: 'TEST2',
      answer: 'test test test test',
    },
    {
      question: 'TEST3',
      answer: 'test test test test',
    },
    {
      question: 'TEST4',
      answer: 'test test test test',
    },
    {
      question: 'TEST5',
      answer: 'test test test test',
    },
    {
      question: 'TEST6',
      answer: 'test test test test',
    },
    {
      question: 'TEST7',
      answer: 'test test test test',
    },
    {
      question: 'TEST8',
      answer: 'test test test test',
    },
    {
      question: 'TEST9',
      answer: 'test test test test',
    },
    {
      question: 'TEST10',
      answer: 'test test test test',
    },
    {
      question: 'TEST11',
      answer: 'test test test test',
    },
    {
      question: 'TEST12',
      answer: 'test test test test',
    },
    {
      question: 'TEST13',
      answer: 'test test test test',
    },
    {
      question: 'TEST14',
      answer: 'test test test test',
    },
    {
      question: 'TEST15',
      answer: 'test test test test',
    },
    {
      question: 'TEST16',
      answer: 'test test test test',
    },
    {
      question: 'TEST17',
      answer: 'test test test test',
    },
    {
      question: 'TEST18',
      answer: 'test test test test',
    },
    {
      question: 'TEST19',
      answer: 'test test test test',
    },
    {
      question: 'TEST20',
      answer: 'test test test test',
    },
    {
      question: 'TEST21',
      answer: 'test test test test',
    },
    {
      question: 'TEST22',
      answer: 'test test test test',
    },
    {
      question: 'TEST23',
      answer: 'test test test test',
    },
    {
      question: 'TEST24',
      answer: 'test test test test',
    },
    {
      question: 'TEST25',
      answer: 'test test test test',
    },
    {
      question: 'TEST26',
      answer: 'test test test test',
    },
  ];

  const getVisibleItems = (faqItems: FAQItem[], searchString: string): number[] => {
    const searchLower = searchString.toLowerCase();

    return faqItems.reduce<number[]>((matches, item, index) => {
      const hasMatch =
        item.question.toLowerCase().includes(searchLower) || item.answer.toLowerCase().includes(searchLower);

      if (hasMatch) matches.push(index);

      return matches;
    }, []);
  };

  let focusedIndex = $state(0);
  let searchString = $state('');
  let visibleItemsIndex = $derived(getVisibleItems(faqData, searchString));

  const scrollToElement = (prefix: string, index: number): void => {
    const element = document.getElementById(`${prefix}-${index}`);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  };

  $effect(() => {
    scrollToElement('faq-question', focusedIndex);
    scrollToElement('faq-toc', focusedIndex);
  });

  $effect(() => {
    if (!visibleItemsIndex.includes(focusedIndex)) focusedIndex = visibleItemsIndex[0];
  });

  const getOnkeydownCallback = (index: number) => {
    return (e: KeyboardEvent): void => {
      if (e.key === 'Enter' || e.key === ' ') focusedIndex = index;
    };
  };

  const getOnclickCallback = (index: number) => {
    return (): void => {
      focusedIndex = index;
    };
  };
</script>

<svelte:head><title>{faq.headTitle}</title></svelte:head>

<div class="flex h-full flex-col">
  <h1 class="py-6 text-center text-4xl font-bold">
    {faq.pageTitle}
  </h1>
  <div class="flex h-[calc(100%-(--spacing(24)))] flex-1">
    <div class="bg-background flex h-full w-1/5 flex-col">
      <div class="p-4">
        <h2 class="text-lg font-bold">{faq.tocTitle}</h2>
      </div>
      <div class="mb-2 flex w-full items-center">
        <div class="px-2">
          <Icon color="white" size="20" src={SlMagnifier} />
        </div>
        <input
          name="searchString"
          class="w-full bg-transparent focus:border-none focus:outline-hidden"
          autocomplete="off"
          placeholder={faq.searchPlaceholder}
          type="search"
          bind:value={searchString}
        />
      </div>
      <div class="flex-1 overflow-y-auto">
        {#each faqData as item, index (index)}
          <button
            id="faq-toc-{index}"
            class="w-full rounded-xl px-4 py-2 transition-all duration-300 {focusedIndex === index
              ? 'bg-primary'
              : 'hover:bg-secondary-background'}"
            class:hidden={!visibleItemsIndex.includes(index)}
            onclick={getOnclickCallback(index)}
            type="button"
          >
            {item.question}
          </button>
        {/each}
      </div>
    </div>

    <div class="flex h-full flex-1 flex-col items-center overflow-y-auto pb-3">
      {#each faqData as item, index (index)}
        <div
          id="faq-question-{index}"
          class="w-[90%] transform rounded-lg p-6 transition-all duration-300 {focusedIndex === index
            ? 'bg-background scale-105 cursor-auto shadow-lg'
            : 'cursor-pointer opacity-50'}"
          class:hidden={!visibleItemsIndex.includes(index)}
          onclick={getOnclickCallback(index)}
          onkeydown={getOnkeydownCallback(index)}
          role="button"
          tabindex={index}
        >
          <h2 class="mb-2 text-xl font-bold">{item.question}</h2>
          <p>{item.answer}</p>
        </div>
      {/each}
    </div>
  </div>
</div>
