const cleanText = (text) =>
    text
        .replace(/\*\*(.*?)\*\*|__(.*?)__/g, '$1$2')
        .replace(/`([^`]+)`/g, '$1')
        .replace(/[—–]/g, '-')
        .replace(/\u202f/g, ' ')
        .trim();

export const formatAssistantResponse = (content) => {
    const lines = content.split(/\r?\n/);
    const formattedLines = [];

    for (let index = 0; index < lines.length; index += 1) {
        const line = lines[index];
        if (!line.includes('|')) {
            formattedLines.push(cleanText(line).replace(/^\s*(?:[-*]|\d+[.)])\s+/, ''));
            continue;
        }

        const tableLines = [];
        while (index < lines.length && lines[index].includes('|')) {
            tableLines.push(lines[index].slice(lines[index].indexOf('|')));
            index += 1;
        }
        index -= 1;

        const rows = tableLines.map((row) => {
            const cells = row.split('|');
            if (!cells[0].trim()) {
                cells.shift();
            }
            if (!cells.at(-1).trim()) {
                cells.pop();
            }
            return cells.map((cell) => cleanText(cell));
        });
        const separatorIndex = rows.findIndex(
            (row) => row.length > 0 && row.every((cell) => /^:?-{3,}:?$/.test(cell)),
        );

        if (separatorIndex < 0 || separatorIndex === 0) {
            formattedLines.push(...tableLines.map(cleanText));
            continue;
        }

        const headers = rows[separatorIndex - 1].map((header) => header.toLowerCase());
        const titleIndex = headers.findIndex((header) => /title|movie|film/.test(header));
        const yearIndex = headers.findIndex((header) => /year/.test(header));
        const ratingIndex = headers.findIndex((header) => /rating|imdb/.test(header));

        for (const row of rows.slice(separatorIndex + 1)) {
            const title = row[titleIndex >= 0 ? titleIndex : 1] || row[0];
            if (!title) {
                continue;
            }
            const year = row[yearIndex];
            const rating = row[ratingIndex];
            formattedLines.push(
                [title, year ? `(${year})` : '', rating ? `- IMDb rating ${rating}/10` : '']
                    .filter(Boolean)
                    .join(' '),
            );
        }
    }

    return formattedLines.join('\n').trim();
};
