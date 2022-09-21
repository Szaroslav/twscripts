/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (function() { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./private/Memo.js":
/*!*************************!*\
  !*** ./private/Memo.js ***!
  \*************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

eval("__webpack_require__.r(__webpack_exports__);\nconst _Memo = {\r\n    MAX_MEMO_SIZE: typeof char_limit === 'number' ? char_limit : 6e4,\r\n    MSG_DURATION: 1400,\r\n    createdMemoIds: [],\r\n\r\n    create: function (schedule) {\r\n        const contents = this.splitSchedule(schedule);\r\n\r\n        if (contents === null) {\r\n            UI.ErrorMessage('Nie udało się utworzyć rozpiski.', this.MSG_DURATION);\r\n            return;\r\n        }\r\n        UI.SuccessMessage('Tworzę rozpiskę, może to zająć kilka sekund.', this.MSG_DURATION);\r\n\r\n        let p = $.Deferred().resolve();\r\n        for (let i = 0; i < contents.length; i++) {\r\n            p = p\r\n                .then(() => this.addTab())\r\n                .then(() => this.renameTab(`Rozpiska [${i + 1}]`))\r\n                .then(() => this.setContent(contents[i]));\r\n        }\r\n        p.then(() => {\r\n            Memo.selectTab(this.createdMemoIds[0]);\r\n            UI.SuccessMessage('Rozpiska została utworzona. Odświeżam stronę.', this.MSG_DURATION);\r\n            setTimeout(() => location.reload(), this.MSG_DURATION + 600);\r\n        })\r\n    },\r\n\r\n    addTab: function () {\r\n        if (Memo.tabs.length >= 10) {\r\n            UI.ErrorMessage(s(_(\"3531dec6f954a7d15f46b4cf644c5bfe\"), Memo.tabs.length), this.MSG_DURATION);\r\n            return;\r\n        }\r\n\r\n        Memo.mobile && Memo.checkArrow(Memo.tabs.length);\r\n        \r\n        return $.ajax({\r\n            url: $(\"#add_tab_url\").val(),\r\n            type: \"POST\",\r\n            dataType: \"json\",\r\n            data: {},\r\n            success: function (e) {\r\n                if (e && e.id) {\r\n                    if ((Memo.tabs.push(e) >= Memo.max_tabs && $(\"#memo-add-tab-button\").hide(), $(\"div.memo-tab\").length >= 1)) var t = $(\"div.memo-tab\").first().clone();\r\n                    else location.reload();\r\n                    Memo.editTabElement(t, e.id, e.title, !0), t.appendTo($(\"#tab-bar\")), $(\".memo-tab-button-close\").show();\r\n                    var a = $(\"div.memo_container\").first().clone(),\r\n                        o = a.attr(\"id\").substr(5);\r\n                    a.attr(\"id\", \"memo_\" + e.id),\r\n                        $(\"input[name='tab_id']\", a).val(e.id),\r\n                        $(\"tr.show_row > td\", a).empty(),\r\n                        $(\"textarea\", a)\r\n                            .val(\"\")\r\n                            .last()\r\n                            .attr(\"id\", \"message_\" + e.id),\r\n                        $(\"tr.bbcodes > td\", a).empty(),\r\n                        a.insertAfter($(\"div.memo_container\").last()),\r\n                        Memo.Memory.toggle[o] && $(\".show_row, .edit_link, .edit_row, .submit_row, .bbcodes\", $(\"#memo_\" + e.id)).toggle(),\r\n                        Memo.selectTab(e.id);\r\n                }\r\n            },\r\n        }).then(res => this.createdMemoIds.push(res.id));\r\n    },\r\n    \r\n    renameTab: function (title) {\r\n        const memo = Memo.tabs[Memo.findTab(Memo.selectedTab)];\r\n        memo.title = title;\r\n\r\n        if (memo.title && memo.length > 16) {\r\n            UI.ErrorMessage(Memo.messages.tabNameLength, this.MSG_DURATION);\r\n        }\r\n        else if (title.length == 0) {\r\n            UI.ErrorMessage(Memo.messages.tabNameEmpty, this.MSG_DURATION);\r\n        }\r\n        else {\r\n            return $.ajax({\r\n                url: $(\"#rename_tab_url\").val(),\r\n                type: \"POST\",\r\n                dataType: \"json\",\r\n                data: { id: memo.id, newTitle: memo.title },\r\n                success: function (e) {\r\n                    e.title && ((Memo.tabs[Memo.findTab(Memo.selectedTab)].title = e.title), Memo.selectTab()), Dialog.close();\r\n                }\r\n            });\r\n        }\r\n    },\r\n\r\n    setContent: function (content) {\r\n        document.querySelector(`#message_${Memo.selectedTab}`).value = content;\r\n        const form = document.querySelector(`#memo_${Memo.selectedTab} form`);\r\n        const requestData = {memo: form.elements.memo.value, tab_id: form.elements.tab_id.value, h: form.elements.h.value};\r\n\r\n        return $.ajax(form.action, {method: 'POST', data: requestData})\r\n            .then((res, status) => {\r\n                if (status !== 'success') {\r\n                    UI.ErrorMessage('Nie udało się utworzyć rozpiski.', this.MSG_DURATION);\r\n                }\r\n            });\r\n    },\r\n\r\n    splitSchedule: function (schedule) {\r\n        if (schedule instanceof Array === false)\r\n            return null;\r\n        \r\n        const newSchedule = [];\r\n        const newLine = '\\r\\n';\r\n        let memoText = '';\r\n\r\n        schedule.forEach(order => {\r\n            const orderText = order.join('');\r\n            if (memoText.length + orderText.length + newLine.length > this.MAX_MEMO_SIZE) {\r\n                newSchedule.push(memoText);\r\n                memoText = '';\r\n            }\r\n\r\n            if (memoText !== '') memoText += newLine;\r\n            memoText += orderText;\r\n        });\r\n        if (memoText !== '') newSchedule.push(memoText);\r\n\r\n        return newSchedule;\r\n    }\r\n};\r\n\r\n/* harmony default export */ __webpack_exports__[\"default\"] = (_Memo);\n\n//# sourceURL=webpack:///./private/Memo.js?");

/***/ }),

/***/ "./public/ScheduleMerger.js":
/*!**********************************!*\
  !*** ./public/ScheduleMerger.js ***!
  \**********************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _private_Memo_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../private/Memo.js */ \"./private/Memo.js\");\n/**\r\n * ScheduleMerger.js v0.9\r\n * Szary (Plemiona: AGH Szary)\r\n * GitHub: https://github.com/Szaroslav\r\n * \r\n * Skrypt łączący kilka rozpisek z plemiona-planer.pl w jedną, sortujący od najwcześniejszych do najpóźniejszych rozkazów,\r\n * jeśli rozpiska jest zbyt duża, skrypt dzieli je na kilka notatek.\r\n * Dopuszczalne formaty rozpisek: tekst prosty, rozszerzony lub dla zastąpcy - skrypt aktualnie nie obsługuje tabel.\r\n */\r\n\r\n\r\n\r\nconst ScheduleMerger = {\r\n    MSG_DURATION: 1400,\r\n\r\n    init: function () {\r\n        console.log('%cScheduleMerger.js %cv0.9', 'display: inline-block; padding: 4px 0', 'display: inline-block; padding: 4px; background-color: #2151ae; color: white');\r\n        console.log('Skrypt stworzony przez %cSzary %c(Plemiona: %cAGH Szary%c)', 'font-weight: bold', 'font-weight: normal', 'font-weight: bold', 'font-weight: normal');\r\n\r\n        if (typeof Memo !== 'undefined') {\r\n            this.MSG_DURATION = _private_Memo_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"].MSG_DURATION;\r\n            const schedule = this.getSchedule();\r\n            \r\n            _private_Memo_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"].create(schedule);\r\n        }\r\n        else {\r\n            UI.ErrorMessage('Nie jesteś w notatkach. Przenoszę.');\r\n            setTimeout(() => location.href = `${location.origin}/game.php?screen=memo`, this.MSG_DURATION + 600);\r\n        }\r\n    },\r\n\r\n\r\n\r\n    getSchedule: function () {\r\n        const schedule = [];\r\n        const memos = document.querySelectorAll('.memo_container');\r\n\r\n        memos.forEach(memo => {\r\n            const d = memo.querySelector('textarea[name=\"memo\"]').value\r\n                .split('\\n')\r\n                .filter(line => line !== '')\r\n                .filter(line => /^[0-9]{1,}./.test(line) || /^\\[b\\][0-9]{4}-[0-9]{2}-[0-9]{2}/.test(line) || /Wyślij \\w+\\[\\/url]$/.test(line))\r\n                .map(line => line + '\\r\\n');\r\n\r\n            for (let i = 0; i < d.length; i += 3) {\r\n                if (i + 2 >= d.length) return;\r\n                schedule.push([d[i], d[i + 1], d[i + 2]]);\r\n            }\r\n        });\r\n\r\n        schedule.sort((a, b) => {\r\n            const dateA = new Date(`${a[1].match(/[0-9]{4}-[0-9]{2}-[0-9]{2}/)}T${a[1].match(/[0-9]{2}:[0-9]{2}:[0-9]{2}/)}`);\r\n            const dateB = new Date(`${b[1].match(/[0-9]{4}-[0-9]{2}-[0-9]{2}/)}T${b[1].match(/[0-9]{2}:[0-9]{2}:[0-9]{2}/)}`);\r\n            return dateA - dateB;\r\n        });\r\n        schedule.forEach((order, i) => order[0] = order[0].replace(/^[0-9]{1,}./, `${i + 1}.`))\r\n\r\n        return schedule;\r\n    }\r\n};\r\n\r\nScheduleMerger.init();\n\n//# sourceURL=webpack:///./public/ScheduleMerger.js?");

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
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./public/ScheduleMerger.js");
/******/ 	
/******/ })()
;