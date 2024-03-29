export enum ViewportContent {
	Default = 'width=device-width,initial-scale=1.0',
	NoSafariZoom = 'width=device-width,initial-scale=1.0,maximum-scale=1.0,user-scalable=no'
}

export function createMeta() {
	let viewport: ViewportContent = $state(ViewportContent.Default);

	return {
		get viewport() {
			return viewport;
		},
		setViewport: (value: ViewportContent) => {
			viewport = value;
		}
	};
}

export default createMeta();
