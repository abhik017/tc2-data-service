import ExpenseController from "./expense-controller";
import ItemController from "./item-controller";
import JwtHelper from "./jwt-helper";
import SalesController from "./sales-controller";
export default function getApiControllers(): {
    jwtHelper: JwtHelper;
    itemController: ItemController;
    salesController: SalesController;
    expenseController: ExpenseController;
};
