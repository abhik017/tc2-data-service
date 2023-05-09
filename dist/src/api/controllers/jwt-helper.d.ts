import { Response } from "express";
export default class JwtHelper {
    verifyAccessToken(request: any, response: Response, isResponseNeeded?: boolean): Promise<void>;
    getAccessFromRefreshToken(request: any, response: Response): Promise<void>;
    private signAccessToken;
}
