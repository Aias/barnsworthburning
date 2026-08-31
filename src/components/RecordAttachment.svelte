<script lang="ts">
	import markdown from '#helpers/markdown.js';
	import { displayTitle, type RecordLink } from '#lib/records.js';
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

<section class="extract-attachment" data-dock={dock} data-relation={relation}>
	<div class="attachment-heading">
		<strong class="attachment-title"><Link {record} inherit>{displayTitle(record)}</Link></strong>
		{#if record.creators.length > 0}
			<CreatorList class="attachment-creators" creators={record.creators} />
		{/if}
	</div>
	{#if preview}
		<div class="attachment-preview content">
			{@html markdown.parsePreview(preview)}
		</div>
	{/if}
</section>
