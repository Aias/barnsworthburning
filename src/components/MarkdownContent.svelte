<script lang="ts">
	import markdown from '$helpers/markdown';

	interface MarkdownContentProps {
		text: string;
		trimLength?: number;
	}
	let { text, trimLength }: MarkdownContentProps = $props();

	let trimmedText = $derived(trimLength ? text.substring(0, trimLength) : text);
</script>

{@html markdown.parse(trimmedText)}
