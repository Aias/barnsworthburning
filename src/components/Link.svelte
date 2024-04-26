<script lang="ts">
	import type { Snippet } from 'svelte';
	import { entityTypes } from '$helpers/params';

	interface LinkProps {
		toType?: keyof typeof entityTypes;
		toId: string;
		children: Snippet;
	}

	let { toType = 'extract', toId, children, ...restProps }: LinkProps = $props();

	let href = $derived.by(() => {
		let segment = entityTypes[toType].urlParam;
		return `/${segment}/${toId}`;
	});
</script>

<a {href} {...restProps}>{@render children()}</a>
