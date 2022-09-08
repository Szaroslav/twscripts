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

eval("__webpack_require__.r(__webpack_exports__);\nvar _Memo = {\n  MAX_MEMO_SIZE: typeof char_limit === 'number' ? char_limit : 6e4,\n  MSG_DURATION: 1400,\n  createdMemoIds: [],\n  create: function create(schedule) {\n    var _this = this;\n\n    var contents = this.splitSchedule(schedule);\n\n    if (contents === null) {\n      UI.ErrorMessage('Nie udało się utworzyć rozpiski.', this.MSG_DURATION);\n      return;\n    }\n\n    UI.SuccessMessage('Tworzę rozpiskę, może to zająć kilka sekund.', this.MSG_DURATION);\n    var p = $.Deferred().resolve();\n\n    var _loop = function _loop(i) {\n      p = p.then(function () {\n        return _this.addTab();\n      }).then(function () {\n        return _this.renameTab(\"Rozpiska [\".concat(i + 1, \"]\"));\n      }).then(function () {\n        return _this.setContent(contents[i]);\n      });\n    };\n\n    for (var i = 0; i < contents.length; i++) {\n      _loop(i);\n    }\n\n    p.then(function () {\n      Memo.selectTab(_this.createdMemoIds[0]);\n      UI.SuccessMessage('Rozpiska została utworzona. Odświeżam stronę.', _this.MSG_DURATION);\n      setTimeout(function () {\n        return location.reload();\n      }, _this.MSG_DURATION + 600);\n    });\n  },\n  addTab: function addTab() {\n    var _this2 = this;\n\n    if (Memo.tabs.length >= 10) {\n      UI.ErrorMessage(s(_(\"3531dec6f954a7d15f46b4cf644c5bfe\"), Memo.tabs.length), this.MSG_DURATION);\n      return;\n    }\n\n    Memo.mobile && Memo.checkArrow(Memo.tabs.length);\n    return $.ajax({\n      url: $(\"#add_tab_url\").val(),\n      type: \"POST\",\n      dataType: \"json\",\n      data: {},\n      success: function success(e) {\n        if (e && e.id) {\n          if (Memo.tabs.push(e) >= Memo.max_tabs && $(\"#memo-add-tab-button\").hide(), $(\"div.memo-tab\").length >= 1) var t = $(\"div.memo-tab\").first().clone();else location.reload();\n          Memo.editTabElement(t, e.id, e.title, !0), t.appendTo($(\"#tab-bar\")), $(\".memo-tab-button-close\").show();\n          var a = $(\"div.memo_container\").first().clone(),\n              o = a.attr(\"id\").substr(5);\n          a.attr(\"id\", \"memo_\" + e.id), $(\"input[name='tab_id']\", a).val(e.id), $(\"tr.show_row > td\", a).empty(), $(\"textarea\", a).val(\"\").last().attr(\"id\", \"message_\" + e.id), $(\"tr.bbcodes > td\", a).empty(), a.insertAfter($(\"div.memo_container\").last()), Memo.Memory.toggle[o] && $(\".show_row, .edit_link, .edit_row, .submit_row, .bbcodes\", $(\"#memo_\" + e.id)).toggle(), Memo.selectTab(e.id);\n        }\n      }\n    }).then(function (res) {\n      return _this2.createdMemoIds.push(res.id);\n    });\n  },\n  renameTab: function renameTab(title) {\n    var memo = Memo.tabs[Memo.findTab(Memo.selectedTab)];\n    memo.title = title;\n\n    if (memo.title && memo.length > 16) {\n      UI.ErrorMessage(Memo.messages.tabNameLength, this.MSG_DURATION);\n    } else if (title.length == 0) {\n      UI.ErrorMessage(Memo.messages.tabNameEmpty, this.MSG_DURATION);\n    } else {\n      return $.ajax({\n        url: $(\"#rename_tab_url\").val(),\n        type: \"POST\",\n        dataType: \"json\",\n        data: {\n          id: memo.id,\n          newTitle: memo.title\n        },\n        success: function success(e) {\n          e.title && (Memo.tabs[Memo.findTab(Memo.selectedTab)].title = e.title, Memo.selectTab()), Dialog.close();\n        }\n      });\n    }\n  },\n  setContent: function setContent(content) {\n    var _this3 = this;\n\n    document.querySelector(\"#message_\".concat(Memo.selectedTab)).value = content;\n    var form = document.querySelector(\"#memo_\".concat(Memo.selectedTab, \" form\"));\n    var requestData = {\n      memo: form.elements.memo.value,\n      tab_id: form.elements.tab_id.value,\n      h: form.elements.h.value\n    };\n    return $.ajax(form.action, {\n      method: 'POST',\n      data: requestData\n    }).then(function (res, status) {\n      if (status !== 'success') {\n        UI.ErrorMessage('Nie udało się utworzyć rozpiski.', _this3.MSG_DURATION);\n      }\n    });\n  },\n  splitSchedule: function splitSchedule(schedule) {\n    var _this4 = this;\n\n    if (schedule instanceof Array === false) return null;\n    var newSchedule = [];\n    var newLine = '\\r\\n';\n    var memoText = '';\n    schedule.forEach(function (order) {\n      var orderText = order.join('');\n\n      if (memoText.length + orderText.length + newLine.length > _this4.MAX_MEMO_SIZE) {\n        newSchedule.push(memoText);\n        memoText = '';\n      }\n\n      if (memoText !== '') memoText += newLine;\n      memoText += orderText;\n    });\n    if (memoText !== '') newSchedule.push(memoText);\n    return newSchedule;\n  }\n};\n/* harmony default export */ __webpack_exports__[\"default\"] = (_Memo);\n\n//# sourceURL=webpack:///./private/Memo.js?");

/***/ }),

/***/ "./public/ScheduleMerger.js":
/*!**********************************!*\
  !*** ./public/ScheduleMerger.js ***!
  \**********************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _private_Memo_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../private/Memo.js */ \"./private/Memo.js\");\n/**\r\n * ScheduleMerger.js v0.9\r\n * Szary (Plemiona: AGH Szary)\r\n * GitHub: https://github.com/Szaroslav\r\n * \r\n * Skrypt łączący kilka rozpisek z plemsy.pl w jedną, sortujący od najwcześniejszych do najpóźniejszych rozkazów,\r\n * jeśli rozpiska jest zbyt duża skrypt dzieli je na kilka notatek.\r\n * Dopuszczalne formaty rozpisek: tekst prosty, rozszerzony lub dla zastępcy - skrypt nie obsługuje tabel.\r\n */\n\nvar ScheduleMerger = {\n  MSG_DURATION: 1400,\n  init: function init() {\n    console.log('%cScheduleMerger.js %cv0.9', 'display: inline-block; padding: 4px 0', 'display: inline-block; padding: 4px; background-color: #2151ae; color: white');\n    console.log('Skrypt stworzony przez %cSzary %c(Plemiona: %cAGH Szary%c)', 'font-weight: bold', 'font-weight: normal', 'font-weight: bold', 'font-weight: normal');\n\n    if (typeof Memo !== 'undefined') {\n      this.MSG_DURATION = _private_Memo_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"].MSG_DURATION;\n      var schedule = this.getSchedule();\n\n      _private_Memo_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"].create(schedule);\n    } else {\n      UI.ErrorMessage('Nie jesteś w notatkach. Przenoszę.');\n      setTimeout(function () {\n        return location.href = \"\".concat(location.origin, \"/game.php?screen=memo\");\n      }, this.MSG_DURATION + 600);\n    }\n  },\n  getSchedule: function getSchedule() {\n    var schedule = [];\n    var memos = document.querySelectorAll('.memo_container');\n    memos.forEach(function (memo) {\n      var d = memo.querySelector('textarea[name=\"memo\"]').value.split('\\n').filter(function (line) {\n        return line !== '';\n      }).filter(function (line) {\n        return /^[0-9]{1,}./.test(line) || /^\\[b\\][0-9]{4}-[0-9]{2}-[0-9]{2}/.test(line) || /Wyślij \\w+\\[\\/url]$/.test(line);\n      }).map(function (line) {\n        return line + '\\r\\n';\n      });\n\n      for (var i = 0; i < d.length; i += 3) {\n        if (i + 2 >= d.length) return;\n        schedule.push([d[i], d[i + 1], d[i + 2]]);\n      }\n    });\n    schedule.sort(function (a, b) {\n      var dateA = new Date(\"\".concat(a[1].match(/[0-9]{4}-[0-9]{2}-[0-9]{2}/), \"T\").concat(a[1].match(/[0-9]{2}:[0-9]{2}:[0-9]{2}/)));\n      var dateB = new Date(\"\".concat(b[1].match(/[0-9]{4}-[0-9]{2}-[0-9]{2}/), \"T\").concat(b[1].match(/[0-9]{2}:[0-9]{2}:[0-9]{2}/)));\n      return dateA - dateB;\n    });\n    schedule.forEach(function (order, i) {\n      return order[0] = order[0].replace(/^[0-9]{1,}./, \"\".concat(i + 1, \".\"));\n    });\n    return schedule;\n  }\n};\nScheduleMerger.init();\n\n//# sourceURL=webpack:///./public/ScheduleMerger.js?");

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