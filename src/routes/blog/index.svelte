<script>
	import { onMount } from 'svelte';
	import marked from 'marked';

	let posts = [];

	onMount(() => {
		fetch(`blog/posts.json`)
			.then(data => data.json())
			.then(json => {
				posts = json;
			});
	});
</script>

<h1>All blog posts</h1>
<ul>
	{#each posts as post}
	<li>
		<article>
			<h2>{post.title}</h2>
			<h3>{post.description}</h3>
			<section>
				{@html marked(post.content)}
			</section>
		</article>
	</li>
	{/each}
</ul>
