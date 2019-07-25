<script context="module">
	import { FULL_API } from '../../config.js';

	export async function preload(page, session) {
		const posts = await this.fetch(`${FULL_API}/posts`).then(data =>
			data.json()
		);

		return { posts };
	}
</script>

<script>
	import marked from 'marked';

	export let posts = [];

	let notFinished = `
		<p><em>This post has not been written. Maybe it's on its way.</em></p>
	`;
</script>

<h1>All blog posts</h1>
<ol>
	{#each posts as post}
	<li>
		<article>
			<h2>
				<a rel="prefetch" href="{`blog/${post.slug}`}">{post.title}</a>
			</h2>
			<h3>{post.description}</h3>
			<section>
				{@html post.content ? marked(post.content) : notFinished}
			</section>
		</article>
	</li>
	{/each}
</ol>

<style>
	ol {
		list-style-type: none;
		padding: 0;
	}
	li {
		border-bottom: 1px solid rgba(0, 0, 0, 0.15);
	}
</style>
