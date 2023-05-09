import { Express } from "express";
import getApiControllers from "../controllers/controller-factory";

export default function routes(app: Express) {
    const { jwtHelper, itemController, salesController, expenseController } = getApiControllers();
    app.route("/healthcheck").get( async (req, res) => {
        await jwtHelper.verifyAccessToken(req, res, true);
    });
    app.route("/item/add").put( async (req, res) => {
        await jwtHelper.verifyAccessToken(req, res);
        await itemController.addItem(req, res);
    });
    app.route("/item/edit").put( async (req, res) => {
        await jwtHelper.verifyAccessToken(req, res);
        await itemController.editItem(req, res);
    });
    app.route("/item/").get( async (req, res) => {
        await jwtHelper.verifyAccessToken(req, res);
        await itemController.getItems(req, res);
    });
    app.route("/sales/add").put( async (req, res) => {
        await jwtHelper.verifyAccessToken(req, res);
        await salesController.addSales(req, res);
    });
    app.route("/sales/delete").put( async (req, res) => {
        await jwtHelper.verifyAccessToken(req, res);
        await salesController.deleteSalesEntry(req, res);
    });
    app.route("/sales").get( async (req, res) => {
        await jwtHelper.verifyAccessToken(req, res);
        await salesController.getAllEntries(req, res);
    });
    app.route("/sales/clear-debts").post( async (req, res) => {
        await jwtHelper.verifyAccessToken(req, res);
        await salesController.markAsPaid(req, res);
    });
    app.route("/expense/add").put( async (req, res) => {
        await jwtHelper.verifyAccessToken(req, res);
        await expenseController.addExpense(req, res);
    });
    app.route("/expense/delete").post( async (req, res) => {
        await jwtHelper.verifyAccessToken(req, res);
        await expenseController.deleteExpense(req, res);
    });
}