<script lang="ts">
	import type { Snippet, SvelteComponent } from 'svelte';
	import { entityTypes } from '$helpers/params';
	import type { HTMLAnchorAttributes } from 'svelte/elements';

	// Separate interfaces for different cases
	interface ExternalLinkProps extends HTMLAnchorAttributes {
		href: string;
		children: Snippet;
		toType?: never;
		toId?: never;
	}

	interface InternalLinkProps extends HTMLAnchorAttributes {
		toType?: keyof typeof entityTypes;
		toId: string;
		children: Snippet;
		href?: never;
	}

	// Union type for LinkProps
	type LinkProps = ExternalLinkProps | InternalLinkProps;

	let { toType = 'extract', toId, href, children, ...restProps }: LinkProps = $props();

	let url = $derived.by(() => {
		if (href) return href;
		let segment = entityTypes[toType].urlParam;
		return `/${segment}/${toId}`;
	});
</script>

<a href={url} {...restProps}>{@render children()}</a>
