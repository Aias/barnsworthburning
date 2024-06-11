<script lang="ts">
	import type { Snippet } from 'svelte';
	import { entityTypes } from '$helpers/params';
	import type { HTMLAnchorAttributes } from 'svelte/elements';

	interface ExternalLinkProps extends HTMLAnchorAttributes {
		href: string;
		children: Snippet;
		active?: boolean;
		toType?: never;
		toId?: never;
	}

	interface InternalLinkProps extends HTMLAnchorAttributes {
		toType?: keyof typeof entityTypes;
		toId: string;
		children: Snippet;
		active?: boolean;
		href?: never;
	}

	type LinkProps = ExternalLinkProps | InternalLinkProps;

	let {
		toType = 'extract',
		toId,
		active = false,
		href,
		children,
		...restProps
	}: LinkProps = $props();

	let url = $derived.by(() => {
		if (href) return href;
		let segment = entityTypes[toType].urlParam;
		return `/${segment}/${toId}`;
	});
</script>

<a href={url} class:active {...restProps}>{@render children()}</a>
