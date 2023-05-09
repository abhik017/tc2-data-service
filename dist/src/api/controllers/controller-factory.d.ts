import ItemController from "./item-controller";
import JwtHelper from "./jwt-helper";
export default function getApiControllers(): {
    jwtHelper: JwtHelper;
    itemController: ItemController;
};
