<script lang="ts">
	import { page } from '$app/stores';
	import type { Snippet } from 'svelte';
	import { decodeTrail, entityTypes, encodeTrail } from '$helpers/params';

	interface LinkProps {
		toType?: 'extract' | 'creator' | 'space';
		toId: string;
		children: Snippet;
	}

	let { toType = 'extract', toId, children, ...restProps }: LinkProps = $props();

	let currentTrail = $derived(decodeTrail($page.params.trail));
	let href = $derived(makeNewTrail());

	function makeNewTrail() {
		let newSegment = {
			id: toId,
			entityType: entityTypes[toType]
		};

		let newTrail = [...currentTrail, newSegment];
		return encodeTrail(newTrail);
	}
</script>

<a {href} {...restProps}>{@render children()}</a>
