import { JwtPayload } from "jsonwebtoken";

declare module 'express-serve-static-core' {
    interface Request {
        user?: CustomJwtPayload;
    }
}

export type Roles = "customer" | "admin";

export interface CustomJwtPayload extends JwtPayload {
    id: string
    role: Roles
}

