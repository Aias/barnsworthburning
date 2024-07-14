export const classnames = (...args: any[]): string => {
	return args.filter(Boolean).join(' ');
};
