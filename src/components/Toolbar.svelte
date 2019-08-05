<script>
	import Link from './Link.svelte';
	import RSS from './icons/RSS.svelte';
	import Github from './icons/Github.svelte';
	import Spotify from './icons/Spotify.svelte';
</script>

<div>
	<Link href="https://barnsworthburning-api.netlify.com/.netlify/functions/feed"><RSS /></Link>
	<Link href="https://github.com/Aias"><Github /></Link>
	<Link href="https://open.spotify.com/user/223hhvix27azj60a9a80jelq3?si=2RpG1aWiTK6edlf_Uskjog"><Spotify /></Link>
</div>

<style>
	div {
		display: inline-grid;
		grid-column-gap: 1rem;
		grid-auto-flow: column;		
	}

	div :global(.icon) {
		font-size: 1.5rem;
		line-height: 1;
	}
</style>