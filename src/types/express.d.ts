import { User } from "@prisma/client";
import { Request } from "express";

// declare global {
//   namespace Express {
//     interface Request {
//       user: User;
//     }
//   }
// }
import { Role } from "@prisma/client";

declare global {
  namespace Express {
    interface User {
      id: number;
      email: string;
      name: string;
      role: Role;
    }
  }
}

export {}
