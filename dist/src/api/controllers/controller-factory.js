"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const item_controller_1 = __importDefault(require("./item-controller"));
const jwt_helper_1 = __importDefault(require("./jwt-helper"));
function getApiControllers() {
    const jwtHelper = new jwt_helper_1.default();
    const itemController = new item_controller_1.default();
    return {
        jwtHelper,
        itemController
    };
}
exports.default = getApiControllers;
//# sourceMappingURL=controller-factory.js.map