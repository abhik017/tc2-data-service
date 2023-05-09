"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const controller_factory_1 = __importDefault(require("../controllers/controller-factory"));
function routes(app) {
    const { jwtHelper, itemController, salesController, expenseController } = (0, controller_factory_1.default)();
    app.route("/healthcheck").get((req, res) => __awaiter(this, void 0, void 0, function* () {
        yield jwtHelper.verifyAccessToken(req, res, true);
    }));
    app.route("/item/add").put((req, res) => __awaiter(this, void 0, void 0, function* () {
        yield jwtHelper.verifyAccessToken(req, res);
        yield itemController.addItem(req, res);
    }));
    app.route("/item/edit").put((req, res) => __awaiter(this, void 0, void 0, function* () {
        yield jwtHelper.verifyAccessToken(req, res);
        yield itemController.editItem(req, res);
    }));
    app.route("/item/").get((req, res) => __awaiter(this, void 0, void 0, function* () {
        yield jwtHelper.verifyAccessToken(req, res);
        yield itemController.getItems(req, res);
    }));
    app.route("/sales/add").put((req, res) => __awaiter(this, void 0, void 0, function* () {
        yield jwtHelper.verifyAccessToken(req, res);
        yield salesController.addSales(req, res);
    }));
    app.route("/sales/delete").put((req, res) => __awaiter(this, void 0, void 0, function* () {
        yield jwtHelper.verifyAccessToken(req, res);
        yield salesController.deleteSalesEntry(req, res);
    }));
    app.route("/sales").get((req, res) => __awaiter(this, void 0, void 0, function* () {
        yield jwtHelper.verifyAccessToken(req, res);
        yield salesController.getAllEntries(req, res);
    }));
    app.route("/sales/clear-debts").post((req, res) => __awaiter(this, void 0, void 0, function* () {
        yield jwtHelper.verifyAccessToken(req, res);
        yield salesController.markAsPaid(req, res);
    }));
    app.route("/expense/add").put((req, res) => __awaiter(this, void 0, void 0, function* () {
        yield jwtHelper.verifyAccessToken(req, res);
        yield expenseController.addExpense(req, res);
    }));
    app.route("/expense/delete").post((req, res) => __awaiter(this, void 0, void 0, function* () {
        yield jwtHelper.verifyAccessToken(req, res);
        yield expenseController.deleteExpense(req, res);
    }));
}
exports.default = routes;
//# sourceMappingURL=routes.js.map