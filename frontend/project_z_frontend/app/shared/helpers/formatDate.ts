export const formatDate = (dateString?: string): string => {
    if (!dateString) return 'N/A';

    const normalizedDate = dateString.endsWith('Z') ? dateString : `${dateString}Z`;

    return new Date(normalizedDate).toLocaleString('en-UK', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
    });
};