<script lang="ts">
	import { recordPath, type RecordLink } from '$lib/records';
	import trail, { type TrailSegment } from '$lib/trail.svelte';
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

	let url = $derived(href ?? (record ? recordPath(record) : '#'));

	const handleClick = () => {
		trail.selectSegment(getTrailSegment?.().entityId);
		trail.setPendingRecordType(record?.type);
	};
</script>

<a onclick={handleClick} href={url} class:inherit class:active {...restProps}
	>{@render children()}</a
>
