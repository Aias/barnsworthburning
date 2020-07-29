<script context="module">
	export async function preload({ params, query }) {
		const res = await this.fetch('about.json');
		const data = await res.json();

		if (res.status === 200) {
			return { about: data };
		} else {
			this.error(res.status, data.message);
		}
	}
</script>

<script>
	export let about = undefined;
</script>

<div class="wrapper">
	<article>
		{@html about.html}
	</article>
</div>

<style>
	.wrapper {
		max-width: 67ch;
		margin: 0 auto;
		min-height: 100%;
		display: flex;
		flex-direction: column;
		justify-content: center;
	}
	article {
		font-size: 1rem;
		text-align: center;
		line-height: 2;
	}
</style>
