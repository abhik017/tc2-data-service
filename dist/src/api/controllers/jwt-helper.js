"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_status_1 = __importDefault(require("http-status"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
class JwtHelper {
    verifyAccessToken(request, response, isResponseNeeded = false) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const authHeader = request.headers.authorization;
                const authToken = authHeader.split(' ')[1];
                if (!authToken) {
                    throw "The auth token is missing!";
                }
                jsonwebtoken_1.default.verify(authToken, process.env.ACCESS_TOKEN_SECRET, (err, payload) => {
                    if (err) {
                        response.status(http_status_1.default.UNAUTHORIZED).send("The user is unauthorized!");
                    }
                    else {
                        request.payload = payload;
                        if (isResponseNeeded) {
                            response.status(http_status_1.default.OK).send("Successfully authenticated! " + payload.aud);
                        }
                    }
                });
            }
            catch (err) {
                console.log(err);
                response.status(http_status_1.default.UNAUTHORIZED).send("The user cannot be authorized!");
            }
        });
    }
    getAccessFromRefreshToken(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const requestBody = request.body;
                const refreshToken = requestBody.refreshToken;
                if (!refreshToken) {
                    throw "The refresh token is missing!";
                }
                jsonwebtoken_1.default.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, payload) => __awaiter(this, void 0, void 0, function* () {
                    if (err) {
                        response.status(http_status_1.default.UNAUTHORIZED).send("The user is unauthorized!");
                    }
                    else {
                        const accessToken = yield this.signAccessToken(payload.aud.toString(), payload.role);
                        response.status(http_status_1.default.OK).send({
                            accessToken: accessToken,
                            refreshToken: refreshToken,
                            role: payload.role
                        });
                    }
                }));
            }
            catch (err) {
                console.log(err);
                response.status(http_status_1.default.UNAUTHORIZED).send("The user could not be authorized!");
            }
        });
    }
    signAccessToken(phoneNumber, role) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                const payload = {
                    role: role
                };
                const secret = process.env.ACCESS_TOKEN_SECRET;
                const options = {
                    expiresIn: "10m",
                    issuer: "tc2-data-service",
                    audience: phoneNumber
                };
                return jsonwebtoken_1.default.sign(payload, secret, options, (err, token) => {
                    if (err) {
                        console.log(err);
                        reject("Internal server error " + err.toString());
                    }
                    resolve(token);
                });
            });
        });
    }
}
exports.default = JwtHelper;
//# sourceMappingURL=jwt-helper.js.map