<script lang="ts">
	import type { Snippet } from 'svelte';
	import { entityTypes } from '$helpers/params';
	import type { HTMLAnchorAttributes } from 'svelte/elements';

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

	interface ExternalLinkProps extends LinkBaseProps {
		href: string;
		toType?: never;
		toId?: never;
	}

	type LinkProps = InternalLinkProps | ExternalLinkProps;

	let {
		toType = 'extract',
		toId,
		active = false,
		inherit = false,
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

<a href={url} class:inherit class:active {...restProps}>{@render children()}</a>
