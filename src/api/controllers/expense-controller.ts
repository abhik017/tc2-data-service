import { Response } from "express";
import httpStatus from "http-status";
import ExpenseDetails from "../models/expense-details";
import dbService from "../../service/db-service";

const EXPENSE_TABLE = "EXPENSE_TABLE";
const EXPENSE_TABLE_KEY = "ID";
let lastId = 0;
export default class ExpenseController {
    async ExpenseController() {
        const allItems: ExpenseDetails[] = await dbService.getAll(EXPENSE_TABLE) as ExpenseDetails[];
        allItems.forEach((item) => {
            lastId = Math.max(lastId, item.ID);
        });
    }
    public async addExpense(request: any, response: Response) {
        try {
            const payload = request.payload;
            if (!payload || payload.role != "master" || !payload.aud) {
                throw "The user is unauthorized!";
            }
            const itemInfo = request.body;
            const expenseName = itemInfo.expenseName;
            const expense: ExpenseDetails = {
                expenseName: expenseName,
                ID: ++lastId,
                createdAt: Date.now()
            };
            await dbService.saveItem(EXPENSE_TABLE, EXPENSE_TABLE_KEY, ++lastId, expense);
            response.status(httpStatus.CREATED).send("The expense has been saved!");
        } catch (err: any) {
            console.log(err);
            response.status(httpStatus.BAD_REQUEST).send("This is an invalid request! " + err.toString());
        }
    }

    public async deleteExpense(request: any, response: Response) {
        try {
            const payload = request.payload;
            if (!payload || payload.role != "master" || !payload.aud) {
                throw "The user is unauthorized!";
            }
            const itemInfo = request.body;
            const id = itemInfo.id;
            await dbService.deleteItem(EXPENSE_TABLE, EXPENSE_TABLE_KEY, id);
            response.status(httpStatus.OK).send("The expense has been deleted!");
        } catch (err: any) {
            console.log(err);
            response.status(httpStatus.BAD_REQUEST).send("This is an invalid request! " + err.toString());
        }
    }
}