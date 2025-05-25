<script lang="ts">
  type Props = {
    error: string;
  };

  let { error }: Props = $props();
</script>

<p>{error}</p>
