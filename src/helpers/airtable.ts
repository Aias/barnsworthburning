// Airtable record IDs follow the pattern: rec + 14-17 alphanumeric characters
const AIRTABLE_RECORD_ID_REGEX = /^rec[A-Za-z0-9]{14,17}$/;

/**
 * Validates that a string is a valid Airtable record ID.
 * Returns the ID if valid, throws if invalid.
 */
export const validateRecordId = (id: string): string => {
	if (!AIRTABLE_RECORD_ID_REGEX.test(id)) {
		throw new Error(`Invalid Airtable record ID: ${id}`);
	}
	return id;
};

/**
 * Escapes a string for safe use in Airtable formulas.
 * Escapes single quotes and backslashes.
 */
export const escapeFormulaString = (input: string): string => {
	return input.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
};
