export const tagSplit = (text) =>
    text
        .split(',')
        .map((tag) => tag.trim())
        .filter(Boolean);
