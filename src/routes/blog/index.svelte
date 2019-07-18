<script>
	import { onMount } from 'svelte';
	import marked from 'marked';

	let posts = [];

	onMount(() => {
		fetch('/.netlify/functions/posts')
			.then(data => data.json())
			.then(json => {
				posts = json;
			});
	});
</script>

<h1>All blog posts</h1>
<ol>
	{#each posts as post}
	<li>
		<article>
			<h2><a href="{`blog/posts/${post.slug}`}">{post.title}</a></h2>
			<h3>{post.description}</h3>
			<section>
				{@html marked(post.content)}
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
