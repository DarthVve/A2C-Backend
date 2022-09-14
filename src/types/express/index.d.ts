// to make the file a module and avoid the TypeScript error
// export {}

import { JwtPayload } from "jsonwebtoken";

declare global {
  namespace Express {
    export interface Request {
      user?: string;
    }
  }
}

// export interface userReq extends Request {
//   user?: string | JwtPayload;
// }
