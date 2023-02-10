"use strict";
(self["webpackChunkcoords"] = self["webpackChunkcoords"] || []).push([["index"],{

/***/ "./src/ajax.ts":
/*!*********************!*\
  !*** ./src/ajax.ts ***!
  \*********************/
/***/ (function(__unused_webpack_module, exports) {


var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var TribalWars = {
    URL: 'plemiona.pl',
    getPlayersData: function (serverName) {
        return __awaiter(this, void 0, void 0, function () {
            var res, resBody;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log("https://".concat(serverName, ".").concat(this.URL, "/map/player.txt"));
                        return [4 /*yield*/, fetch("https://".concat(serverName, ".").concat(this.URL, "/map/player.txt"), { headers: { 'Access-Control-Allow-Origin': '*' } })];
                    case 1:
                        res = _a.sent();
                        return [4 /*yield*/, res.json()];
                    case 2:
                        resBody = _a.sent();
                        console.log(resBody);
                        return [2 /*return*/];
                }
            });
        });
    }
};
exports["default"] = TribalWars;


/***/ }),

/***/ "./src/index.ts":
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


exports.__esModule = true;
var ajax_1 = __webpack_require__(/*! ./ajax */ "./src/ajax.ts");
ajax_1["default"].getPlayersData('pl177');


/***/ })

},
/******/ __webpack_require__ => { // webpackRuntimeModules
/******/ var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
/******/ var __webpack_exports__ = (__webpack_exec__("./src/index.ts"));
/******/ }
]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguYnVuZGxlLmpzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsSUFBTSxVQUFVLEdBQUc7SUFDZixHQUFHLEVBQUUsYUFBYTtJQUVsQixjQUFjLEVBQUUsVUFBZ0IsVUFBa0I7Ozs7Ozt3QkFDOUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxrQkFBVyxVQUFVLGNBQUksSUFBSSxDQUFDLEdBQUcsb0JBQWlCLENBQUMsQ0FBQzt3QkFDcEQscUJBQU0sS0FBSyxDQUFDLGtCQUFXLFVBQVUsY0FBSSxJQUFJLENBQUMsR0FBRyxvQkFBaUIsRUFBRSxFQUFDLE9BQU8sRUFBRSxFQUFDLDZCQUE2QixFQUFFLEdBQUcsRUFBQyxFQUFDLENBQUM7O3dCQUF0SCxHQUFHLEdBQUcsU0FBZ0g7d0JBQzVHLHFCQUFNLEdBQUcsQ0FBQyxJQUFJLEVBQUU7O3dCQUExQixPQUFPLEdBQUcsU0FBZ0I7d0JBQ2hDLE9BQU8sQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUM7Ozs7O0tBQ3hCO0NBQ0osQ0FBQztBQUVGLHFCQUFlLFVBQVUsQ0FBQzs7Ozs7Ozs7Ozs7OztBQ1gxQixnRUFBZ0M7QUFFaEMsaUJBQVUsQ0FBQyxjQUFjLENBQUMsT0FBTyxDQUFDLENBQUMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9jb29yZHMvLi9zcmMvYWpheC50cyIsIndlYnBhY2s6Ly9jb29yZHMvLi9zcmMvaW5kZXgudHMiXSwic291cmNlc0NvbnRlbnQiOlsiY29uc3QgVHJpYmFsV2FycyA9IHtcclxuICAgIFVSTDogJ3BsZW1pb25hLnBsJyxcclxuXHJcbiAgICBnZXRQbGF5ZXJzRGF0YTogYXN5bmMgZnVuY3Rpb24gKHNlcnZlck5hbWU6IHN0cmluZykge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKGBodHRwczovLyR7c2VydmVyTmFtZX0uJHt0aGlzLlVSTH0vbWFwL3BsYXllci50eHRgKTtcclxuICAgICAgICBjb25zdCByZXMgPSBhd2FpdCBmZXRjaChgaHR0cHM6Ly8ke3NlcnZlck5hbWV9LiR7dGhpcy5VUkx9L21hcC9wbGF5ZXIudHh0YCwge2hlYWRlcnM6IHsnQWNjZXNzLUNvbnRyb2wtQWxsb3ctT3JpZ2luJzogJyonfX0pO1xyXG4gICAgICAgIGNvbnN0IHJlc0JvZHkgPSBhd2FpdCByZXMuanNvbigpO1xyXG4gICAgICAgIGNvbnNvbGUubG9nKHJlc0JvZHkpO1xyXG4gICAgfSxcclxufTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IFRyaWJhbFdhcnM7XHJcbiIsImltcG9ydCBUcmliYWxXYXJzIGZyb20gJy4vYWpheCc7XHJcblxyXG5UcmliYWxXYXJzLmdldFBsYXllcnNEYXRhKCdwbDE3NycpO1xyXG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=