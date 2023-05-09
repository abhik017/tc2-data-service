import { Response } from "express";
import httpStatus from "http-status";
import dbService from "../../service/db-service";
import ProductDetails from "../models/product-details";
import SaleDetails from "../models/sale-details";

const PRODUCTS_TABLE: string = "PRODUCTS_TABLE";
const PRODUCTS_TABLE_KEY: string = "ITEM_NAME";
const SALES_TABLE: string = "SALES_TABLE";
const SALES_TABLE_KEY: string = "ID";
let lastId = 0;
export default class SalesController {
    async SalesController() {
        const allItems: SaleDetails[]= await dbService.getAll(SALES_TABLE) as SaleDetails[];
        allItems.forEach((item) => {
            lastId = Math.max(lastId, item.ID);
        });
    }
    public async addSales(request: any, response: Response) {
        try {
            const payload = request.payload;
            if (!payload || payload.role != "master" || !payload.aud) {
                throw "The user is unauthorized!";
            }
            const itemInfo = request.body;
            const itemName = itemInfo.itemName;
            const quantity = itemInfo.quantity;
            const amountReceived = itemInfo.amountReceived;
            const customerName = itemInfo.customerName;
            const customerPhone = itemInfo.customerPhone;
            const item: ProductDetails = (await dbService.getItemById(PRODUCTS_TABLE, PRODUCTS_TABLE_KEY, itemName))?.Item as ProductDetails;
            if (!item) {
                throw "Invalid entry!";
            }
            const discountInPct = itemInfo.discountInPct ?? item.defaultDiscountInPct;
            const commissionInPct = itemInfo.commissionInPct ?? 100;
            const pricePerUnit = itemInfo.mrp;
            const netSales = (quantity * pricePerUnit * commissionInPct * discountInPct)/10000.00;
            const dbEntry: SaleDetails = {
                ID: ++lastId,
                itemName: itemName,
                quantity: quantity,
                discountInPct: discountInPct,
                commissionInPct: commissionInPct,
                totalAmount: netSales,
                netAmountPending: netSales - amountReceived,
                netAmountRecieved: amountReceived,
                customerName: customerName,
                customerPhone: customerPhone,
                createdAt: Date.now()
            };
            await dbService.saveItem(SALES_TABLE, SALES_TABLE_KEY, lastId, dbEntry);
            response.status(httpStatus.CREATED).send("Entry added successfully!");
        } catch (err: any) {
            console.log(err);
            response.status(httpStatus.BAD_REQUEST).send("This is an invalid request! " + err.toString());
        }
    }

    public async deleteSalesEntry(request: any, response: Response) {
        try {
            const payload = request.payload;
            if (!payload || payload.role != "master" || !payload.aud) {
                throw "The user is unauthorized!";
            }
            const itemInfo = request.body;
            const id = itemInfo.ID;
            await dbService.deleteItem(SALES_TABLE, SALES_TABLE_KEY, id);
            response.status(httpStatus.OK).send("Entry deleted successfully!");
        } catch (err: any) {
            console.log(err);
            response.status(httpStatus.BAD_REQUEST).send("This is an invalid request! " + err.toString());
        }
    }

    public async getAllEntries(request: any, response: Response) {
        try {
            const payload = request.payload;
            if (!payload || payload.role != "master" || !payload.aud) {
                throw "The user is unauthorized!";
            }
            const items = await dbService.getAll(SALES_TABLE);
            response.status(httpStatus.OK).send(items);
        } catch (err: any) {
            console.log(err);
            response.status(httpStatus.BAD_REQUEST).send("This is an invalid request! " + err.toString());
        }
    }

    public async markAsPaid(request: any, response: Response) {
        try {
            const payload = request.payload;
            if (!payload || payload.role != "master" || !payload.aud) {
                throw "The user is unauthorized!";
            }
            const entryIds: number[] = request.body;
            for (const id in entryIds) {
                const entry: SaleDetails = ((await dbService.getItemById(PRODUCTS_TABLE, PRODUCTS_TABLE_KEY, id))?.Item as SaleDetails);
                if (!entry) {
                    continue;
                }
                await dbService.updateItem(SALES_TABLE, SALES_TABLE_KEY, id, {
                    netAmountReceived: entry.totalAmount,
                    netAmountPending: 0
                });
            }
        } catch (err: any) {
            console.log(err);
            response.status(httpStatus.BAD_REQUEST).send("This is an invalid request! " + err.toString());
        }
    }
}