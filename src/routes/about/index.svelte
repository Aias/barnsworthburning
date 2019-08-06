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
	export let about;
</script>

<article>
	{@html about.html}
</article>
