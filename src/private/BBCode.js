const BBCode = {
    fromHTML: function (html) {
        if (html instanceof Element === false)
            return '';

        const parse = function (element, output) {
            if (element.nodeType === 3) {
                return output + element.textContent.trim();
            }
            if (element.nodeName === 'TD'  && element.classList.contains('quote_author')) {
                return output;
            }

            let endTag = '';
            if (element.nodeName === 'BR') {
                output += '\n';
            }
            else if (element.nodeName === 'B') {
                output += '[b]';
                endTag = '[/b]';
            }
            else if (element.nodeName === 'I') {
                output += '[i]';
                endTag = '[/i]';
            }
            else if (element.nodeName === 'U') {
                output += '[u]';
                endTag = '[/u]';
            }
            else if (element.nodeName === 'S') {
                output += '[s]';
                endTag = '[/s]';
            }
            else if (element.nodeName === 'TD' && element.classList.contains('quote_message')) {
                const previousSibling = element.parentNode.previousSibling;
                output += `[quote${previousSibling ? '=' + previousSibling.children[1].textContent.split(' ')[0] : ''}]`;
                endTag = '[/quote]';
            }
            else if (element.nodeName === 'DIV' && element.classList.contains('spoiler')) {
                const button = element.children[0];
                output += `[spoiler${button.value !== 'Spoiler' ? '=' + button.value : ''}]`;
                return parse(element.querySelector('span'), output) + '[/spoiler]';
            }

            for (let i = 0; i < element.childNodes.length; i++) {
                output = parse(element.childNodes[i], output);
            }

            return output + endTag;
        };

        return parse(html, '');

        // html.outerHTML = html.outerHTML
        //     .replace('<br>', '\n')
        //     .replace('<b>', '[b]')
        //     .replace('</b>', '[/b]')
        //     .replace('<i>', '[i]')
        //     .replace('</i>', '[/i]')
        //     .replace('<u>', '[u]')
        //     .replace('</u>', '[/u]')
        //     .replace('<s>', '[s]')
        //     .replace('</s>', '[/s]');
    }
};

export default BBCode;