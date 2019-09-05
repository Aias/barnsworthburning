<script>
	import Link from '../../components/Link.svelte';
</script>

<div class="nav">
	<Link prefetch href="/commonplace">Extracts</Link>
	<Link prefetch href="/commonplace/creators">Creators</Link>
	<Link prefetch href="/commonplace/groups">Works</Link>
</div>

<style>
	.nav {
		text-align: center;
		margin-bottom: 0.5rem;
	}

	:global(.nav > *) {
		margin: 0 0.5rem;
	}
</style>