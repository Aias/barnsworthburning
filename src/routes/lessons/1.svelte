<script>
	import NormalParagraph from '../../components/NormalParagraph.svelte';

	let name = 'World';
	let src = './images/negativity.jpg';
	let htmlString = '<em>This will be rendered as italic.</em>';
</script>

<section id="1.1">
	<h1>Hello, {name}!</h1>
</section>

<section id="1.2">
	<img
		{src}
		alt="Me, trying to cut all the negativity and toxic people out of my life in 2019"
	/>
</section>

<section id="1.3">
	<p>
		This paragraph is big and purple.
	</p>
</section>

<section id="1.4">
	<NormalParagraph>
		This is a normal paragraph.
	</NormalParagraph>
</section>

<section id="1.5">
	<NormalParagraph>
		{@html htmlString}
	</NormalParagraph>
</section>

<style>
	img {
		max-width: 100%;
	}

	section + section {
		margin-top: 1em;
	}

	p {
		color: purple;
		font-size: 2em;
	}
</style>
