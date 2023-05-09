"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const expense_controller_1 = __importDefault(require("./expense-controller"));
const item_controller_1 = __importDefault(require("./item-controller"));
const jwt_helper_1 = __importDefault(require("./jwt-helper"));
const sales_controller_1 = __importDefault(require("./sales-controller"));
function getApiControllers() {
    const jwtHelper = new jwt_helper_1.default();
    const itemController = new item_controller_1.default();
    const salesController = new sales_controller_1.default();
    const expenseController = new expense_controller_1.default();
    return {
        jwtHelper,
        itemController,
        salesController,
        expenseController
    };
}
exports.default = getApiControllers;
//# sourceMappingURL=controller-factory.js.map