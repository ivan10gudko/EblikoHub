export const formatRatingInput = (value: string): string | null => {
    let formatted = value.replace(',', '.');

    if (/^\d{2}$/.test(formatted) && formatted !== '10') {
        formatted = `${formatted[0]}.${formatted[1]}`;
    }

    if (formatted === '' || /^[0-9]*\.?[0-9]?$/.test(formatted)) {
        const num = parseFloat(formatted);

        if (formatted !== '' && formatted !== '.' && !isNaN(num)) {
            if (num > 10 || (num === 10 && formatted.includes('.'))) {
                return null;
            }
        }

        return formatted;
    }

    return null;
};