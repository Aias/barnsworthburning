<script context="module">
	export async function load({ fetch }) {
		return fetch(`feed.xml`);
	}
</script>

<div>This page exists on a technicality. You probably want <a href="/feed.xml">feed.xml</a>.</div>
