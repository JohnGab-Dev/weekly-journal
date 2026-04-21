export function formatDateMDY(date) {
    if (!date) return '';

    const d = new Date(date);

    return d.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: '2-digit',
    });
}

export function formatDateMDYT(date) {
    if (!date) return '';

    const d = new Date(date);

    return d.toLocaleString('en-US', {
        year: 'numeric',
        month: 'long',
        day: '2-digit',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    });
}