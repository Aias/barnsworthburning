<script context="module">
	export function preload({ params, query }) {
		return this.fetch(`feed.xml`);
	}
</script>

<div>This page exists on a technicality. You probably want <a href="/feed.xml">feed.xml</a>.</div>
