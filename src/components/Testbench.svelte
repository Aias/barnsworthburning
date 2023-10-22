<script>
	import triptych from '$helpers/triptych';
	import { mode as modeStore } from '$helpers/triptych';

	export let mode = undefined;
	export let palette = undefined;
	export let chroma = undefined;

	const classes = triptych({
		mode,
		palette,
		chroma
	});

	const switchMode = () => {
		$modeStore = $modeStore === 'light' ? 'dark' : 'light';
	}
</script>

<section class={classes}>
	<h1>{mode} {palette} {chroma}</h1>
	<p>
		Here's some text I want you to read. <a class="text-accent" href="./">Show More</a>
		<button on:click={switchMode}>Change Mode</button>
	</p>
	<p>
		<slot />
	</p>
</section>

<style>
	h1 {
		color: var(--primary);
	}
	p {
		color: var(--display);
	}
	a {
		color: var(--link);
	}
	a:hover {
		color: var(--link-active);
	}
	section {
		background-color: var(--container);
		padding: 1rem;
		border-radius: 2px;
		border: 1px solid var(--divider);
	}
	h1, p {
		margin: 0;
	}
</style>