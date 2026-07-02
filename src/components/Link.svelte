<script lang="ts">
	import type { Snippet } from 'svelte';
	import { getContext } from 'svelte';
	import type { HTMLAnchorAttributes } from 'svelte/elements';
	import { recordPath, type RecordLink } from '$lib/records';
	import trail, { type TrailSegment } from '$lib/trail.svelte';

	interface LinkBaseProps extends HTMLAnchorAttributes {
		active?: boolean;
		children: Snippet;
		inherit?: boolean;
	}

	interface RecordLinkProps extends LinkBaseProps {
		record: Pick<RecordLink, 'id' | 'title' | 'slug'>;
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
	};
</script>

<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -->
<a onclick={handleClick} href={url} class:inherit class:active {...restProps}
	>{@render children()}</a
>
