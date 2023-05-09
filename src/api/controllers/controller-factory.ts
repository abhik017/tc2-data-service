import ExpenseController from "./expense-controller";
import ItemController from "./item-controller";
import JwtHelper from "./jwt-helper";
import SalesController from "./sales-controller";

export default function getApiControllers() {
    const jwtHelper: JwtHelper = new JwtHelper();
    const itemController: ItemController = new ItemController();
    const salesController: SalesController = new SalesController();
    const expenseController: ExpenseController = new ExpenseController();
    return {
        jwtHelper,
        itemController,
        salesController,
        expenseController
    }
}