<script context="module">
	import { FULL_API } from '../../config';

	export async function preload(page, session) {
		let options = {
			view: 'Grid view'
		};

		let projects = null;
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

		return { projects };
	}
</script>

<script>
	import { selectedSpace } from '../../stores';

	selectedSpace.set('projects');
	export let projects = undefined;
</script>

<section>
	<p>
		<strong>A disclaimer:</strong> Ideally, this would be the place where
		you'd find case studies of my projects, with long discussions on
		research methods, design processes, and results validation.
	</p>
	<p>
		I've worked on a lot of things over the years. However, most of that
		work has been done at an enterprise company that places a high value on
		privacy and intellectual property. This being the case, I can't share
		most of the details here.
	</p>
	<p>
		Instead, here's what we can do: below are some potentially interesting
		things I've done, along with my role in each, the technologies used, and
		some other relevant information. If there's something that's piques your
		interest,
		<a target="_blank" href="mailto:trombley.nick@gmail.com"
			>send me a message</a
		>
		and I'd be happy to chat about it via email, phone, or video.
	</p>
	<p>I look forward to exchanging ideas.</p>
</section>
<iframe
	title="Projects list"
	class="airtable-embed"
	src="https://airtable.com/embed/shrvDRuNsI02qPYES?backgroundColor=gray&viewControls=on"
	frameborder="0"
	onmousewheel=""
	width="100%"
></iframe>

<style>
	iframe {
		height: 100%;
		background: transparent;
		border: 1px solid var(--divider);
	}
</style>
