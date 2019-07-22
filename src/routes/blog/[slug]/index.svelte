<script>
	import { FULL_API } from '../../../config.js';

	export let post = {};

	export async function preload(page, session) {
		const posts = await this.fetch(`${FULL_API}/posts`).then(data =>
			data.json()
		);

		return { post };
	}
</script>

<div>
	This will be the page for an individual blog post. It'll get the id from the
	title and then render it.
</div>
