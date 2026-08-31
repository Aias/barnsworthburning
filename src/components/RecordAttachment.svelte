<script lang="ts">
	import markdown from '#helpers/markdown.js';
	import type { RecordLink } from '#lib/records.js';
	import CreatorList from './CreatorList.svelte';
	import Link from './Link.svelte';

	interface RecordAttachmentProps {
		record: RecordLink & { creators: RecordLink[] };
		dock: 'top' | 'bottom';
		relation: 'container' | 'response' | 'quote';
		preview?: string | null;
	}

	let { record, dock, relation, preview = null }: RecordAttachmentProps = $props();
</script>

{#if record.title || record.creators.length > 0 || preview}
	<section class="extract-attachment" data-dock={dock} data-relation={relation}>
		{#if record.title || record.creators.length > 0}
			<div class="attachment-heading">
				{#if record.title}
					<strong class="attachment-title"><Link {record} inherit>{record.title}</Link></strong>
				{/if}
				{#if record.creators.length > 0}
					<CreatorList class="attachment-creators" creators={record.creators} />
				{/if}
			</div>
		{/if}
		{#if preview}
			<div class="attachment-preview content">
				{@html markdown.parsePreview(preview)}
			</div>
		{/if}
	</section>
{/if}
