<script lang="ts">
	import type { Snippet } from 'svelte';
	import { getContext } from 'svelte';
	import { entityTypes } from '$helpers/params';
	import { resolve } from '$app/paths';
	import type { HTMLAnchorAttributes } from 'svelte/elements';
	import trail, { type TrailSegment } from '$lib/trail.svelte';

	interface TrailSegmentContext {
		readonly current: TrailSegment;
	}

	interface LinkBaseProps extends HTMLAnchorAttributes {
		active?: boolean;
		children: Snippet;
		inherit?: boolean;
	}

	interface InternalLinkProps extends LinkBaseProps {
		toType?: keyof typeof entityTypes;
		toId: string;
		href?: never;
	}

	interface StaticLinkProps extends LinkBaseProps {
		href: string;
		toType?: never;
		toId?: never;
	}

	type LinkProps = InternalLinkProps | StaticLinkProps;

	let {
		toType = 'extract',
		toId,
		active = false,
		inherit = false,
		href,
		children,
		...restProps
	}: LinkProps = $props();

	const trailSegmentCtx = getContext<TrailSegmentContext | undefined>('trailSegment');

	let url = $derived.by(() => {
		if (href) return href;
		let segment = entityTypes[toType].urlParam;
		return resolve(`/${segment}/${toId}`);
	});

	const handleClick = () => {
		trail.selectSegment(trailSegmentCtx?.current.entityId);
	};
</script>

<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -->
<a onclick={handleClick} href={url} class:inherit class:active {...restProps}
	>{@render children()}</a
>
