import { Inject, Injectable, Scope } from "@nestjs/common";
import { REQUEST } from "@nestjs/core";
import { Request } from "express";

@Injectable({ scope: Scope.REQUEST })
export class RequestContext {

    constructor(
        @Inject(REQUEST)
        private readonly request: Request
    ) {}

    get user() {
        return (this.request as any).user;
    }
}
