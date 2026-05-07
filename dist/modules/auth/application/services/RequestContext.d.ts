import { Request } from "express";
export declare class RequestContext {
    private readonly request;
    constructor(request: Request);
    get user(): any;
}
