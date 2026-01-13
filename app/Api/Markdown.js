

export function markdownInterpreter(text) {
    const md = {
        headers: {
            h1: /(?<=^# )[^#]+/g,
            h2: /(?<=^## )[^#]+/g,
            h3: /(?<=^### )[^#]+/g,
            h4: /(?<=^#### )[^#]+/g,
            h5: /(?<=^##### )[^#]+/g,
            h6: /(?<=^###### )[^#]+/g
        },
        lists: {
            ol: /\n\s*\d+\.\s*(.*)/g,
            ul: /\n\s*\* (.*)/g
        },
        links: {
            url: /\[([^\]]+)\]\(([^)]+)\)/g
        },
        bold: /\*\*(.*?)\*\*/g,
        italic: /\*(.*?)\*/g,
        strikethrough: ~~/(.*?)~~~/g,
        code: /`(.*)`/g,
        quote: /"> (.*)"/g
    };

    function replaceMarkdown(text) {
        for (const [regex, replacement] of Object.entries(md)) {
            text = text.replace(regex, replacement);
        }
        return text;
    }

    const interpretedText = replaceMarkdown(text);

    return interpretedText;
}