/**
 * Parses a UTC date string and converts to local datetime-local input format
 * @param {string} dateString - UTC date string
 * @returns {string} "YYYY-MM-DDTHH:MM" for datetime-local input
 */
export const parseToLocalInput = (dateString) => {
  if (!dateString) return "";
  try {
    const utcDate = new Date(dateString);
    const localDate = new Date(
      utcDate.getTime() - utcDate.getTimezoneOffset() * 60000,
    );
    return localDate.toISOString().slice(0, 16);
  } catch (error) {
    console.error("Invalid date:", dateString);
    return "";
  }
};

/**
 * Converts a UTC date string to localized display string
 * @param {string} dateString - UTC date string
 * @returns {string} locale string or original value
 */
export const toLocalDisplay = (dateString) => {
  if (!dateString) return dateString;
  return new Date(dateString).toLocaleString();
};
