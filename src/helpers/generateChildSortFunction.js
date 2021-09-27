export default (childOrder = []) =>
	(a, b) => {
		const indexA = childOrder.indexOf(a.id);
		const indexB = childOrder.indexOf(b.id);

		if (indexA > indexB) return 1;
		else return -1;
	};
