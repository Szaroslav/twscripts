/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (function() { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./private/BBCode.js":
/*!***************************!*\
  !*** ./private/BBCode.js ***!
  \***************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

eval("__webpack_require__.r(__webpack_exports__);\nconst BBCode = {\r\n    fromHTML: function (html) {\r\n        if (html instanceof Element === false)\r\n            return '';\r\n\r\n        const parse = function (element, output) {\r\n            if (element.nodeType === 3) {\r\n                return output + element.textContent.trim();\r\n            }\r\n            if (element.nodeName === 'TD'  && element.classList.contains('quote_author')) {\r\n                return output;\r\n            }\r\n\r\n            let endTag = '';\r\n            if (element.nodeName === 'BR') {\r\n                output += '\\n';\r\n            }\r\n            else if (element.nodeName === 'B') {\r\n                output += '[b]';\r\n                endTag = '[/b]';\r\n            }\r\n            else if (element.nodeName === 'I') {\r\n                output += '[i]';\r\n                endTag = '[/i]';\r\n            }\r\n            else if (element.nodeName === 'U') {\r\n                output += '[u]';\r\n                endTag = '[/u]';\r\n            }\r\n            else if (element.nodeName === 'S') {\r\n                output += '[s]';\r\n                endTag = '[/s]';\r\n            }\r\n            else if (element.nodeName === 'TD' && element.classList.contains('quote_message')) {\r\n                const previousSibling = element.parentNode.previousSibling;\r\n                output += `[quote${previousSibling ? '=' + previousSibling.children[1].textContent.split(' ')[0] : ''}]`;\r\n                endTag = '[/quote]';\r\n            }\r\n            else if (element.nodeName === 'DIV' && element.classList.contains('spoiler')) {\r\n                const button = element.children[0];\r\n                output += `[spoiler${button.value !== 'Spoiler' ? '=' + button.value : ''}]`;\r\n                return parse(element.querySelector('span'), output) + '[/spoiler]';\r\n            }\r\n\r\n            for (let i = 0; i < element.childNodes.length; i++) {\r\n                output = parse(element.childNodes[i], output);\r\n            }\r\n\r\n            return output + endTag;\r\n        };\r\n\r\n        return parse(html, '');\r\n\r\n        // html.outerHTML = html.outerHTML\r\n        //     .replace('<br>', '\\n')\r\n        //     .replace('<b>', '[b]')\r\n        //     .replace('</b>', '[/b]')\r\n        //     .replace('<i>', '[i]')\r\n        //     .replace('</i>', '[/i]')\r\n        //     .replace('<u>', '[u]')\r\n        //     .replace('</u>', '[/u]')\r\n        //     .replace('<s>', '[s]')\r\n        //     .replace('</s>', '[/s]');\r\n    }\r\n};\r\n\r\n/* harmony default export */ __webpack_exports__[\"default\"] = (BBCode);//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9wcml2YXRlL0JCQ29kZS5qcy5qcyIsIm1hcHBpbmdzIjoiO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG1DQUFtQyxtRkFBbUY7QUFDdEg7QUFDQTtBQUNBO0FBQ0E7QUFDQSxxQ0FBcUMscURBQXFEO0FBQzFGO0FBQ0E7QUFDQTtBQUNBLDRCQUE0QiwrQkFBK0I7QUFDM0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsK0RBQWUsTUFBTSIsInNvdXJjZXMiOlsid2VicGFjazovLy8uL3ByaXZhdGUvQkJDb2RlLmpzPzczZjIiXSwic291cmNlc0NvbnRlbnQiOlsiY29uc3QgQkJDb2RlID0ge1xyXG4gICAgZnJvbUhUTUw6IGZ1bmN0aW9uIChodG1sKSB7XHJcbiAgICAgICAgaWYgKGh0bWwgaW5zdGFuY2VvZiBFbGVtZW50ID09PSBmYWxzZSlcclxuICAgICAgICAgICAgcmV0dXJuICcnO1xyXG5cclxuICAgICAgICBjb25zdCBwYXJzZSA9IGZ1bmN0aW9uIChlbGVtZW50LCBvdXRwdXQpIHtcclxuICAgICAgICAgICAgaWYgKGVsZW1lbnQubm9kZVR5cGUgPT09IDMpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBvdXRwdXQgKyBlbGVtZW50LnRleHRDb250ZW50LnRyaW0oKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoZWxlbWVudC5ub2RlTmFtZSA9PT0gJ1REJyAgJiYgZWxlbWVudC5jbGFzc0xpc3QuY29udGFpbnMoJ3F1b3RlX2F1dGhvcicpKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gb3V0cHV0O1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBsZXQgZW5kVGFnID0gJyc7XHJcbiAgICAgICAgICAgIGlmIChlbGVtZW50Lm5vZGVOYW1lID09PSAnQlInKSB7XHJcbiAgICAgICAgICAgICAgICBvdXRwdXQgKz0gJ1xcbic7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSBpZiAoZWxlbWVudC5ub2RlTmFtZSA9PT0gJ0InKSB7XHJcbiAgICAgICAgICAgICAgICBvdXRwdXQgKz0gJ1tiXSc7XHJcbiAgICAgICAgICAgICAgICBlbmRUYWcgPSAnWy9iXSc7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSBpZiAoZWxlbWVudC5ub2RlTmFtZSA9PT0gJ0knKSB7XHJcbiAgICAgICAgICAgICAgICBvdXRwdXQgKz0gJ1tpXSc7XHJcbiAgICAgICAgICAgICAgICBlbmRUYWcgPSAnWy9pXSc7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSBpZiAoZWxlbWVudC5ub2RlTmFtZSA9PT0gJ1UnKSB7XHJcbiAgICAgICAgICAgICAgICBvdXRwdXQgKz0gJ1t1XSc7XHJcbiAgICAgICAgICAgICAgICBlbmRUYWcgPSAnWy91XSc7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSBpZiAoZWxlbWVudC5ub2RlTmFtZSA9PT0gJ1MnKSB7XHJcbiAgICAgICAgICAgICAgICBvdXRwdXQgKz0gJ1tzXSc7XHJcbiAgICAgICAgICAgICAgICBlbmRUYWcgPSAnWy9zXSc7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSBpZiAoZWxlbWVudC5ub2RlTmFtZSA9PT0gJ1REJyAmJiBlbGVtZW50LmNsYXNzTGlzdC5jb250YWlucygncXVvdGVfbWVzc2FnZScpKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBwcmV2aW91c1NpYmxpbmcgPSBlbGVtZW50LnBhcmVudE5vZGUucHJldmlvdXNTaWJsaW5nO1xyXG4gICAgICAgICAgICAgICAgb3V0cHV0ICs9IGBbcXVvdGUke3ByZXZpb3VzU2libGluZyA/ICc9JyArIHByZXZpb3VzU2libGluZy5jaGlsZHJlblsxXS50ZXh0Q29udGVudC5zcGxpdCgnICcpWzBdIDogJyd9XWA7XHJcbiAgICAgICAgICAgICAgICBlbmRUYWcgPSAnWy9xdW90ZV0nO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2UgaWYgKGVsZW1lbnQubm9kZU5hbWUgPT09ICdESVYnICYmIGVsZW1lbnQuY2xhc3NMaXN0LmNvbnRhaW5zKCdzcG9pbGVyJykpIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGJ1dHRvbiA9IGVsZW1lbnQuY2hpbGRyZW5bMF07XHJcbiAgICAgICAgICAgICAgICBvdXRwdXQgKz0gYFtzcG9pbGVyJHtidXR0b24udmFsdWUgIT09ICdTcG9pbGVyJyA/ICc9JyArIGJ1dHRvbi52YWx1ZSA6ICcnfV1gO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHBhcnNlKGVsZW1lbnQucXVlcnlTZWxlY3Rvcignc3BhbicpLCBvdXRwdXQpICsgJ1svc3BvaWxlcl0nO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGVsZW1lbnQuY2hpbGROb2Rlcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgb3V0cHV0ID0gcGFyc2UoZWxlbWVudC5jaGlsZE5vZGVzW2ldLCBvdXRwdXQpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gb3V0cHV0ICsgZW5kVGFnO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHJldHVybiBwYXJzZShodG1sLCAnJyk7XHJcblxyXG4gICAgICAgIC8vIGh0bWwub3V0ZXJIVE1MID0gaHRtbC5vdXRlckhUTUxcclxuICAgICAgICAvLyAgICAgLnJlcGxhY2UoJzxicj4nLCAnXFxuJylcclxuICAgICAgICAvLyAgICAgLnJlcGxhY2UoJzxiPicsICdbYl0nKVxyXG4gICAgICAgIC8vICAgICAucmVwbGFjZSgnPC9iPicsICdbL2JdJylcclxuICAgICAgICAvLyAgICAgLnJlcGxhY2UoJzxpPicsICdbaV0nKVxyXG4gICAgICAgIC8vICAgICAucmVwbGFjZSgnPC9pPicsICdbL2ldJylcclxuICAgICAgICAvLyAgICAgLnJlcGxhY2UoJzx1PicsICdbdV0nKVxyXG4gICAgICAgIC8vICAgICAucmVwbGFjZSgnPC91PicsICdbL3VdJylcclxuICAgICAgICAvLyAgICAgLnJlcGxhY2UoJzxzPicsICdbc10nKVxyXG4gICAgICAgIC8vICAgICAucmVwbGFjZSgnPC9zPicsICdbL3NdJyk7XHJcbiAgICB9XHJcbn07XHJcblxyXG5leHBvcnQgZGVmYXVsdCBCQkNvZGU7Il0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./private/BBCode.js\n");

/***/ }),

/***/ "./public/ScheduleRemover.js":
/*!***********************************!*\
  !*** ./public/ScheduleRemover.js ***!
  \***********************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _private_BBCode_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../private/BBCode.js */ \"./private/BBCode.js\");\n\r\n\r\nconst ScheduleRemover = {\r\n    init: function () {\r\n        console.log('%cScheduleRemover.js %cv0.2', 'display: inline-block; padding: 4px 0', 'display: inline-block; padding: 4px; background-color: #2151ae; color: white');\r\n        console.log('Skrypt stworzony przez %cSzary %c(Plemiona: %cAGH Szary%c)', 'font-weight: bold', 'font-weight: normal', 'font-weight: bold', 'font-weight: normal');\r\n        \r\n        const memoContent = document.querySelector('.memo_script .show_row > td');\r\n        console.log(_private_BBCode_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"].fromHTML(memoContent));\r\n        const schedule = this.parseSchedule(memoContent, memoContent.childNodes);\r\n        this.createCheckboxes(memoContent, schedule);\r\n    },\r\n\r\n    parseSchedule: function (root, nodes) {\r\n        const schedule = [];\r\n\r\n        for (let i = 0; i < nodes.length; i++) {\r\n            if (nodes[i].nodeType === 3) {\r\n                const text = nodes[i].textContent.trim();\r\n\r\n                if (/^\\d+\\./.test(text)) {\r\n                    schedule.push([]);\r\n                    while (i < nodes.length && (nodes[i].nodeType !== 1 || nodes[i].tagName !== 'A' || !/Wyślij \\w+/.test(nodes[i].textContent))) {\r\n                        schedule[schedule.length - 1].push(nodes[i++]);\r\n                    }\r\n                    nodes[i].setAttribute('data-index', schedule.length - 1);\r\n                    nodes[i].addEventListener('click', e => root.querySelector(`#order${e.target.getAttribute('data-index')}`).checked = true);\r\n                    schedule[schedule.length - 1].push(nodes[i]);\r\n                }\r\n                else {\r\n                    root.removeChild(nodes[i--]);\r\n                }\r\n            }\r\n            else {\r\n                root.removeChild(nodes[i--]);\r\n            }\r\n        }\r\n\r\n        console.log(schedule);\r\n        return schedule;\r\n    },\r\n\r\n    createCheckboxes: function (root, schedule) {\r\n        schedule.forEach((order, i) => {\r\n            const main = document.createElement('div');\r\n            main.classList.add('schedule-row');\r\n            main.style.cssText = 'display: flex; align-items: center; padding: .5em 0';\r\n\r\n            const checkboxCtn = document.createElement('div');\r\n            checkboxCtn.classList.add('schedule-checkbox-container');\r\n            checkboxCtn.innerHTML = `<input type=\"checkbox\" id=\"order${i}\">`;\r\n            main.appendChild(checkboxCtn);\r\n\r\n            const scheduleCtn = document.createElement('div');\r\n            scheduleCtn.classList.add('schedule-content-container');\r\n            order.forEach(element => scheduleCtn.appendChild(element));\r\n            main.appendChild(scheduleCtn);\r\n\r\n            root.appendChild(main);\r\n        });\r\n    }\r\n};\r\n\r\nScheduleRemover.init();//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9wdWJsaWMvU2NoZWR1bGVSZW1vdmVyLmpzLmpzIiwibWFwcGluZ3MiOiI7O0FBQTBDO0FBQzFDO0FBQ0E7QUFDQTtBQUNBLDJFQUEyRSx5Q0FBeUMsY0FBYywyQkFBMkI7QUFDN0o7QUFDQTtBQUNBO0FBQ0Esb0JBQW9CLG1FQUFlO0FBQ25DO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQSx3QkFBd0Isa0JBQWtCO0FBQzFDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHdGQUF3RixvQ0FBb0M7QUFDNUg7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlEQUFpRCxxQkFBcUI7QUFDdEU7QUFDQTtBQUNBO0FBQ0EsdUVBQXVFLEVBQUU7QUFDekU7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQSIsInNvdXJjZXMiOlsid2VicGFjazovLy8uL3B1YmxpYy9TY2hlZHVsZVJlbW92ZXIuanM/ZjU4NCJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgQkJDb2RlIGZyb20gJy4uL3ByaXZhdGUvQkJDb2RlLmpzJztcclxuXHJcbmNvbnN0IFNjaGVkdWxlUmVtb3ZlciA9IHtcclxuICAgIGluaXQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBjb25zb2xlLmxvZygnJWNTY2hlZHVsZVJlbW92ZXIuanMgJWN2MC4yJywgJ2Rpc3BsYXk6IGlubGluZS1ibG9jazsgcGFkZGluZzogNHB4IDAnLCAnZGlzcGxheTogaW5saW5lLWJsb2NrOyBwYWRkaW5nOiA0cHg7IGJhY2tncm91bmQtY29sb3I6ICMyMTUxYWU7IGNvbG9yOiB3aGl0ZScpO1xyXG4gICAgICAgIGNvbnNvbGUubG9nKCdTa3J5cHQgc3R3b3J6b255IHByemV6ICVjU3phcnkgJWMoUGxlbWlvbmE6ICVjQUdIIFN6YXJ5JWMpJywgJ2ZvbnQtd2VpZ2h0OiBib2xkJywgJ2ZvbnQtd2VpZ2h0OiBub3JtYWwnLCAnZm9udC13ZWlnaHQ6IGJvbGQnLCAnZm9udC13ZWlnaHQ6IG5vcm1hbCcpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIGNvbnN0IG1lbW9Db250ZW50ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLm1lbW9fc2NyaXB0IC5zaG93X3JvdyA+IHRkJyk7XHJcbiAgICAgICAgY29uc29sZS5sb2coQkJDb2RlLmZyb21IVE1MKG1lbW9Db250ZW50KSk7XHJcbiAgICAgICAgY29uc3Qgc2NoZWR1bGUgPSB0aGlzLnBhcnNlU2NoZWR1bGUobWVtb0NvbnRlbnQsIG1lbW9Db250ZW50LmNoaWxkTm9kZXMpO1xyXG4gICAgICAgIHRoaXMuY3JlYXRlQ2hlY2tib3hlcyhtZW1vQ29udGVudCwgc2NoZWR1bGUpO1xyXG4gICAgfSxcclxuXHJcbiAgICBwYXJzZVNjaGVkdWxlOiBmdW5jdGlvbiAocm9vdCwgbm9kZXMpIHtcclxuICAgICAgICBjb25zdCBzY2hlZHVsZSA9IFtdO1xyXG5cclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IG5vZGVzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGlmIChub2Rlc1tpXS5ub2RlVHlwZSA9PT0gMykge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgdGV4dCA9IG5vZGVzW2ldLnRleHRDb250ZW50LnRyaW0oKTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoL15cXGQrXFwuLy50ZXN0KHRleHQpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgc2NoZWR1bGUucHVzaChbXSk7XHJcbiAgICAgICAgICAgICAgICAgICAgd2hpbGUgKGkgPCBub2Rlcy5sZW5ndGggJiYgKG5vZGVzW2ldLm5vZGVUeXBlICE9PSAxIHx8IG5vZGVzW2ldLnRhZ05hbWUgIT09ICdBJyB8fCAhL1d5xZtsaWogXFx3Ky8udGVzdChub2Rlc1tpXS50ZXh0Q29udGVudCkpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNjaGVkdWxlW3NjaGVkdWxlLmxlbmd0aCAtIDFdLnB1c2gobm9kZXNbaSsrXSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIG5vZGVzW2ldLnNldEF0dHJpYnV0ZSgnZGF0YS1pbmRleCcsIHNjaGVkdWxlLmxlbmd0aCAtIDEpO1xyXG4gICAgICAgICAgICAgICAgICAgIG5vZGVzW2ldLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZSA9PiByb290LnF1ZXJ5U2VsZWN0b3IoYCNvcmRlciR7ZS50YXJnZXQuZ2V0QXR0cmlidXRlKCdkYXRhLWluZGV4Jyl9YCkuY2hlY2tlZCA9IHRydWUpO1xyXG4gICAgICAgICAgICAgICAgICAgIHNjaGVkdWxlW3NjaGVkdWxlLmxlbmd0aCAtIDFdLnB1c2gobm9kZXNbaV0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcm9vdC5yZW1vdmVDaGlsZChub2Rlc1tpLS1dKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHJvb3QucmVtb3ZlQ2hpbGQobm9kZXNbaS0tXSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnNvbGUubG9nKHNjaGVkdWxlKTtcclxuICAgICAgICByZXR1cm4gc2NoZWR1bGU7XHJcbiAgICB9LFxyXG5cclxuICAgIGNyZWF0ZUNoZWNrYm94ZXM6IGZ1bmN0aW9uIChyb290LCBzY2hlZHVsZSkge1xyXG4gICAgICAgIHNjaGVkdWxlLmZvckVhY2goKG9yZGVyLCBpKSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IG1haW4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICAgICAgICAgICAgbWFpbi5jbGFzc0xpc3QuYWRkKCdzY2hlZHVsZS1yb3cnKTtcclxuICAgICAgICAgICAgbWFpbi5zdHlsZS5jc3NUZXh0ID0gJ2Rpc3BsYXk6IGZsZXg7IGFsaWduLWl0ZW1zOiBjZW50ZXI7IHBhZGRpbmc6IC41ZW0gMCc7XHJcblxyXG4gICAgICAgICAgICBjb25zdCBjaGVja2JveEN0biA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgICAgICAgICBjaGVja2JveEN0bi5jbGFzc0xpc3QuYWRkKCdzY2hlZHVsZS1jaGVja2JveC1jb250YWluZXInKTtcclxuICAgICAgICAgICAgY2hlY2tib3hDdG4uaW5uZXJIVE1MID0gYDxpbnB1dCB0eXBlPVwiY2hlY2tib3hcIiBpZD1cIm9yZGVyJHtpfVwiPmA7XHJcbiAgICAgICAgICAgIG1haW4uYXBwZW5kQ2hpbGQoY2hlY2tib3hDdG4pO1xyXG5cclxuICAgICAgICAgICAgY29uc3Qgc2NoZWR1bGVDdG4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICAgICAgICAgICAgc2NoZWR1bGVDdG4uY2xhc3NMaXN0LmFkZCgnc2NoZWR1bGUtY29udGVudC1jb250YWluZXInKTtcclxuICAgICAgICAgICAgb3JkZXIuZm9yRWFjaChlbGVtZW50ID0+IHNjaGVkdWxlQ3RuLmFwcGVuZENoaWxkKGVsZW1lbnQpKTtcclxuICAgICAgICAgICAgbWFpbi5hcHBlbmRDaGlsZChzY2hlZHVsZUN0bik7XHJcblxyXG4gICAgICAgICAgICByb290LmFwcGVuZENoaWxkKG1haW4pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG59O1xyXG5cclxuU2NoZWR1bGVSZW1vdmVyLmluaXQoKTsiXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///./public/ScheduleRemover.js\n");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	!function() {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = function(exports) {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	}();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval-source-map devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./public/ScheduleRemover.js");
/******/ 	
/******/ })()
;