export function createInteractionState() {
	let altKeyPressed = $state(false);
	let metaKeyPressed = $state(false);

	return {
		get altKeyPressed() {
			return altKeyPressed;
		},
		setAltKeyPressed: (value: boolean) => {
			altKeyPressed = value;
		},
		get metaKeyPressed() {
			return metaKeyPressed;
		},
		setMetaKeyPressed: (value: boolean) => {
			metaKeyPressed = value;
		}
	};
}

export default createInteractionState();
