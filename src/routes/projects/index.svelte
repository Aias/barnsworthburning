<script context="module">
	import { FULL_API } from '../../config';

	export async function preload(page, session) {
		let options = {
			view: 'Grid view'
		};

		// let projects = await this.fetch(
		// 	`${FULL_API}/airtableGet?base=portfolio&table=projects&options=${JSON.stringify(
		// 		options
		// 	)}`
		// )
		// 	.then(data => data.json())
		// 	.catch(error => {
		// 		console.log(error);
		// 		return [];
		// 	});

		// return { projects };
	}
</script>

<script>
	import { selectedSpace } from '../../stores';

	selectedSpace.set('projects');
	export let projects = undefined;
</script>

<div class="wrapper">
	<section>
		<p>
			I've worked on many projects over the course of my career, across
			disciplines, technologies, tools, and topics. However, most of this
			work has been done at a large, private company that places a high
			value on privacy and intellectual property. This being the case, I
			can't share most of the details of these projects on a public
			platform.
		</p>
		<p>
			Instead, here's what we can do: below are some interesting things
			I've worked on, along with my role in them, the technologies used,
			and some other relevant information. If there's something that's
			piques your interest,
			<a target="_blank" href="mailto:trombley.nick@gmail.com"
				>send me a message</a
			>
			and I'll be happy to talk about it, over email, on a phone call, or
			your video chat platform of choice.
		</p>
		<p>I look forward to exchanging ideas.</p>
	</section>
	<iframe
		title="Projects list"
		class="airtable-embed"
		src="https://airtable.com/embed/shrvDRuNsI02qPYES?backgroundColor=green&layout=card&viewControls=on"
		frameborder="0"
		onmousewheel=""
		width="100%"
	></iframe>
</div>

<style>
	.wrapper {
		display: flex;
		flex-direction: column;
		height: 100%;
	}

	iframe {
		flex: 1;
		min-height: 350px;
		background: transparent;
		border: 1px solid var(--divider);
	}
</style>
