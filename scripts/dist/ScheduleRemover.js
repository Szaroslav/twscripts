/******/ (function() { // webpackBootstrap
/******/ 	"use strict";
var __webpack_exports__ = {};

;// CONCATENATED MODULE: ./private/BBCode.js
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

/* harmony default export */ var private_BBCode = (BBCode);
;// CONCATENATED MODULE: ./public/ScheduleRemover.js


const ScheduleRemover = {
    init: function () {
        console.log('%cScheduleRemover.js %cv0.2', 'display: inline-block; padding: 4px 0', 'display: inline-block; padding: 4px; background-color: #2151ae; color: white');
        console.log('Skrypt stworzony przez %cSzary %c(Plemiona: %cAGH Szary%c)', 'font-weight: bold', 'font-weight: normal', 'font-weight: bold', 'font-weight: normal');
        
        const memoContent = document.querySelector('.memo_script .show_row > td');
        console.log(private_BBCode.fromHTML(memoContent));
        const schedule = this.parseSchedule(memoContent, memoContent.childNodes);
        this.createCheckboxes(memoContent, schedule);
    },

    parseSchedule: function (root, nodes) {
        const schedule = [];

        for (let i = 0; i < nodes.length; i++) {
            if (nodes[i].nodeType === 3) {
                const text = nodes[i].textContent.trim();

                if (/^\d+\./.test(text)) {
                    schedule.push([]);
                    while (i < nodes.length && (nodes[i].nodeType !== 1 || nodes[i].tagName !== 'A' || !/Wyślij \w+/.test(nodes[i].textContent))) {
                        schedule[schedule.length - 1].push(nodes[i++]);
                    }
                    nodes[i].setAttribute('data-index', schedule.length - 1);
                    nodes[i].addEventListener('click', e => root.querySelector(`#order${e.target.getAttribute('data-index')}`).checked = true);
                    schedule[schedule.length - 1].push(nodes[i]);
                }
                else {
                    root.removeChild(nodes[i--]);
                }
            }
            else {
                root.removeChild(nodes[i--]);
            }
        }

        console.log(schedule);
        return schedule;
    },

    createCheckboxes: function (root, schedule) {
        schedule.forEach((order, i) => {
            const main = document.createElement('div');
            main.classList.add('schedule-row');
            main.style.cssText = 'display: flex; align-items: center; padding: .5em 0';

            const checkboxCtn = document.createElement('div');
            checkboxCtn.classList.add('schedule-checkbox-container');
            checkboxCtn.innerHTML = `<input type="checkbox" id="order${i}">`;
            main.appendChild(checkboxCtn);

            const scheduleCtn = document.createElement('div');
            scheduleCtn.classList.add('schedule-content-container');
            order.forEach(element => scheduleCtn.appendChild(element));
            main.appendChild(scheduleCtn);

            root.appendChild(main);
        });
    }
};

ScheduleRemover.init();
/******/ })()
;