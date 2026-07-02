<script lang="ts">
	import Link from './Link.svelte';

	interface PaginationProps {
		page: number;
		totalPages: number;
	}
	let { page, totalPages }: PaginationProps = $props();
</script>

{#if totalPages > 1}
	<nav class="pagination text-mono" aria-label="Pagination">
		{#if page > 1}
			<Link href={`?page=${page - 1}`}>← Previous</Link>
		{/if}
		<span class="text-secondary">Page {page} of {totalPages}</span>
		{#if page < totalPages}
			<Link href={`?page=${page + 1}`}>Next →</Link>
		{/if}
	</nav>
{/if}

<style>
	.pagination {
		display: flex;
		justify-content: center;
		align-items: baseline;
		gap: 1.5em;
		margin-block-start: 2em;
	}
</style>
