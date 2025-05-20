// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			theme: {
				mode: import('./types/Theme').Mode;
				chroma: import('./types/Theme').Chroma;
				palette: import('./types/Theme').Palette;
				class: string;
			};
		}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
