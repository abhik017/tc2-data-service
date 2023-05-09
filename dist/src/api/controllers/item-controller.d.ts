import { Response } from "express";
export default class ItemController {
    addItem(request: any, response: Response): Promise<void>;
    editItem(request: any, response: Response): Promise<void>;
    getItems(request: any, response: Response): Promise<void>;
}
