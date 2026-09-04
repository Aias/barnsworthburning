<script lang="ts">
	import { recordPath, type RecordLink } from '#lib/records.js';
	import trail, { type TrailSegment } from '#lib/trail.svelte.js';
	import type { Snippet } from 'svelte';
	import { getContext } from 'svelte';
	import type { HTMLAnchorAttributes } from 'svelte/elements';

	interface LinkBaseProps extends HTMLAnchorAttributes {
		active?: boolean;
		children: Snippet;
		inherit?: boolean;
	}

	interface RecordLinkProps extends LinkBaseProps {
		record: Pick<RecordLink, 'id' | 'type' | 'title' | 'slug'>;
		href?: never;
	}

	interface StaticLinkProps extends LinkBaseProps {
		href: string;
		record?: never;
	}

	type LinkProps = RecordLinkProps | StaticLinkProps;

	let {
		record,
		active = false,
		inherit = false,
		href,
		children,
		...restProps
	}: LinkProps = $props();

	let getTrailSegment: (() => TrailSegment) | undefined = getContext('trailSegment');
	let getOpenRecordIds: (() => number[]) | undefined = getContext('openRecordIds');

	let url = $derived(href ?? (record ? recordPath(record) : '#'));
	let muted = $derived(
		record !== undefined &&
			record.id !== getTrailSegment?.().entityId &&
			(getOpenRecordIds?.().includes(record.id) ?? false)
	);

	const handleClick = () => {
		trail.selectSegment(getTrailSegment?.().entityId);
		trail.setPendingRecordType(record?.type);
	};
</script>

<a onclick={handleClick} href={url} class:inherit class:active class:muted {...restProps}
	>{@render children()}</a
>
