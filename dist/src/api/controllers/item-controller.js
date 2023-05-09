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
const http_status_1 = __importDefault(require("http-status"));
const db_service_1 = __importDefault(require("../../service/db-service"));
const PRODUCTS_TABLE = "PRODUCTS_TABLE";
const PRODUCTS_TABLE_KEY = "ITEM_NAME";
class ItemController {
    addItem(request, response) {
        var _a, _b, _c;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const payload = request.payload;
                if (!payload || payload.role != "master" || !payload.aud) {
                    throw "This is an unauthorized request!";
                }
                const itemInfo = request.body;
                const itemName = itemInfo.itemName;
                const mrp = itemInfo.mrp;
                const unit = itemInfo.unit;
                const discount = (_a = itemInfo.defaultDiscountInPct) !== null && _a !== void 0 ? _a : 0;
                const commission = (_b = itemInfo.commissionInPct) !== null && _b !== void 0 ? _b : 100;
                if (!itemName || !mrp || !unit) {
                    throw "Incorrect entry!";
                }
                const productDetails = {
                    ITEM_NAME: itemName,
                    mrp: mrp,
                    defaultDiscountInPct: discount,
                    commissionInPct: commission,
                    unit: unit,
                    updatedAt: Date.now(),
                    createdAt: Date.now(),
                    createdBy: payload.aud
                };
                const exists = (_c = (yield db_service_1.default.getItemById(PRODUCTS_TABLE, PRODUCTS_TABLE_KEY, itemName))) === null || _c === void 0 ? void 0 : _c.Item;
                if (exists) {
                    throw "Item with same name exists, select different item name!";
                }
                yield db_service_1.default.saveItem(PRODUCTS_TABLE, PRODUCTS_TABLE_KEY, itemName, productDetails);
                response.status(http_status_1.default.CREATED).send("Item created!");
            }
            catch (err) {
                console.log(err);
                response.status(http_status_1.default.BAD_REQUEST).send("This is an invalid request. " + err.toString());
            }
        });
    }
    editItem(request, response) {
        var _a, _b, _c;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const payload = request.payload;
                if (!payload || payload.role != "master" || !payload.aud) {
                    throw "This is an unauthorized request!";
                }
                const itemInfo = request.body;
                const itemName = itemInfo.itemName;
                const mrp = itemInfo.mrp;
                const unit = itemInfo.unit;
                const discount = (_a = itemInfo.defaultDiscountInPct) !== null && _a !== void 0 ? _a : 0;
                const commission = (_b = itemInfo.commissionInPct) !== null && _b !== void 0 ? _b : 100;
                if (!itemName || !mrp || !unit) {
                    throw "Incorrect entry!";
                }
                const dbItem = (_c = (yield db_service_1.default.getItemById(PRODUCTS_TABLE, PRODUCTS_TABLE_KEY, itemName))) === null || _c === void 0 ? void 0 : _c.Item;
                if (!dbItem) {
                    throw "This item is inexistent!";
                }
                yield db_service_1.default.updateItem(PRODUCTS_TABLE, PRODUCTS_TABLE_KEY, itemName, {
                    updatedAt: Date.now(),
                    mrp: mrp,
                    defaultDiscountInPct: discount,
                    commissionInPct: commission,
                    unit: unit
                });
                response.status(http_status_1.default.OK).send("Item updated!");
            }
            catch (err) {
                console.log(err);
                response.status(http_status_1.default.BAD_REQUEST).send("This is an invalid request. " + err.toString());
            }
        });
    }
    getItems(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const payload = request.payload;
                if (!payload || !payload.aud) {
                    throw "This is an unauthorized request!";
                }
                const dbItems = yield db_service_1.default.getAll(PRODUCTS_TABLE);
                response.status(http_status_1.default.OK).send(dbItems);
            }
            catch (err) {
                console.log(err);
                response.status(http_status_1.default.BAD_REQUEST).send("This is an invalid request. " + err.toString());
            }
        });
    }
    deleteItem(request, response) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const payload = request.payload;
                if (!payload || payload.role != "master" || !payload.aud) {
                    throw "This is an unauthorized request!";
                }
                const itemInfo = request.body;
                const itemName = itemInfo.itemName;
                const exists = (_a = (yield db_service_1.default.getItemById(PRODUCTS_TABLE, PRODUCTS_TABLE_KEY, itemName))) === null || _a === void 0 ? void 0 : _a.Item;
                if (!exists) {
                    throw "Item doesn't exist!";
                }
                yield db_service_1.default.deleteItem(PRODUCTS_TABLE, PRODUCTS_TABLE_KEY, itemName);
                response.status(http_status_1.default.OK).send("Item deleted!");
            }
            catch (err) {
                console.log(err);
                response.status(http_status_1.default.BAD_REQUEST).send("This is an invalid request. " + err.toString());
            }
        });
    }
}
exports.default = ItemController;
//# sourceMappingURL=item-controller.js.map