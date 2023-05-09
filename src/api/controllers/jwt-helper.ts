import { Response } from "express";
import httpStatus from "http-status";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export default class JwtHelper {
    public async verifyAccessToken(request: any, response: Response, isResponseNeeded: boolean = false) {
        try {
            const authHeader: string | undefined = request.headers!.authorization;
            const authToken: string = authHeader!.split(' ')[1];
            if (!authToken) {
                throw "The auth token is missing!";
            }
            jwt.verify(authToken, process.env.ACCESS_TOKEN_SECRET as string, (err, payload: any) => {
                if (err) {
                    response.status(httpStatus.UNAUTHORIZED).send("The user is unauthorized!");
                } else {
                    request.payload = payload;
                    if (isResponseNeeded) {
                        response.status(httpStatus.OK).send("Successfully authenticated! " + payload.aud);
                    }
                }
            });
        } catch (err: any) {
            console.log(err);
            response.status(httpStatus.UNAUTHORIZED).send("The user cannot be authorized!");
        }
    }
}