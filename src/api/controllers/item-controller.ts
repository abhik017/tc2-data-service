import { Response } from "express";
import httpStatus from "http-status";
import ProductDetails from "../models/product-details";
import dbService from "../../service/db-service";

const PRODUCTS_TABLE: string = "PRODUCTS_TABLE";
const PRODUCTS_TABLE_KEY: string = "ITEM_NAME";
export default class ItemController {
    public async addItem(request: any, response: Response) {
        try {
            const payload = request.payload;
            if (!payload || payload.role != "master" || !payload.aud) {
                throw "This is an unauthorized request!";
            }
            const itemInfo = request.body;
            const itemName = itemInfo.itemName;
            const mrp = itemInfo.mrp;
            const unit = itemInfo.unit;
            const discount = itemInfo.defaultDiscountInPct ?? 0;
            const commission = itemInfo.commissionInPct ?? 100;
            if (!itemName || !mrp || !unit) {
                throw "Incorrect entry!";
            }
            const productDetails: ProductDetails = {
                ITEM_NAME: itemName,
                mrp: mrp,
                defaultDiscountInPct: discount,
                commissionInPct: commission,
                unit: unit,
                updatedAt: Date.now(),
                createdAt: Date.now(),
                createdBy: payload.aud
            };
            const exists = (await dbService.getItemById(PRODUCTS_TABLE, PRODUCTS_TABLE_KEY, itemName))?.Item;
            if (exists) {
                throw "Item with same name exists, select different item name!";
            }
            await dbService.saveItem(PRODUCTS_TABLE, PRODUCTS_TABLE_KEY, itemName, productDetails);
            response.status(httpStatus.CREATED).send("Item created!");
        } catch (err: any) {
            console.log(err);
            response.status(httpStatus.BAD_REQUEST).send("This is an invalid request. " + err.toString());
        }
    }

    public async editItem(request: any, response: Response) {
        try {
            const payload = request.payload;
            if (!payload || payload.role != "master" || !payload.aud) {
                throw "This is an unauthorized request!";
            }
            const itemInfo = request.body;
            const itemName = itemInfo.itemName;
            const mrp = itemInfo.mrp;
            const unit = itemInfo.unit;
            const discount = itemInfo.defaultDiscountInPct ?? 0;
            const commission = itemInfo.commissionInPct ?? 100;
            if (!itemName || !mrp || !unit) {
                throw "Incorrect entry!";
            }
            const dbItem = (await dbService.getItemById(PRODUCTS_TABLE, PRODUCTS_TABLE_KEY, itemName))?.Item;
            if (!dbItem) {
                throw "This item is inexistent!";
            }
            await dbService.updateItem(PRODUCTS_TABLE, PRODUCTS_TABLE_KEY, itemName, {
                updatedAt: Date.now(),
                mrp: mrp,
                defaultDiscountInPct: discount,
                commissionInPct: commission,
                unit: unit  
            });
            response.status(httpStatus.OK).send("Item updated!");
        } catch (err: any) {
            console.log(err);
            response.status(httpStatus.BAD_REQUEST).send("This is an invalid request. " + err.toString());
        }
    }

    public async getItems(request: any, response: Response) {
        try {
            const payload = request.payload;
            if (!payload || !payload.aud) {
                throw "This is an unauthorized request!";
            }
            const dbItems = await dbService.getAll(PRODUCTS_TABLE);
            response.status(httpStatus.OK).send(dbItems);
        } catch (err: any) {
            console.log(err);
            response.status(httpStatus.BAD_REQUEST).send("This is an invalid request. " + err.toString());
        }
    }

    public async deleteItem(request: any, response: Response) {
        try {
            const payload = request.payload;
            if (!payload || payload.role != "master" || !payload.aud) {
                throw "This is an unauthorized request!";
            }
            const itemInfo = request.body;
            const itemName = itemInfo.itemName;
            const exists = (await dbService.getItemById(PRODUCTS_TABLE, PRODUCTS_TABLE_KEY, itemName))?.Item;
            if (!exists) {
                throw "Item doesn't exist!";
            }
            await dbService.deleteItem(PRODUCTS_TABLE, PRODUCTS_TABLE_KEY, itemName);
            response.status(httpStatus.OK).send("Item deleted!");
        } catch (err: any) {
            console.log(err);
            response.status(httpStatus.BAD_REQUEST).send("This is an invalid request. " + err.toString());
        }
    }
}