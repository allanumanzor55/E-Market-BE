import { Request, Response } from "express";

export type TUserRole = "admin" | "customer" | "company";

export interface IUser {
  id: string;
  name: string;
  company?: {
    id: number;
    name: string;
  };
  email: string;
  profilePic: string;
  password: string;
  role: TUserRole;
  lastLogin: number;
}

export interface IReqHeaderUser {
  id: string;
  role: TUserRole;
  companyName: {id:string,name:string};
}

export interface ICustomReq<T extends object = Record<string, unknown>>
  extends Request {
  user?: IReqHeaderUser;
  body: T;
}

export interface ICustomRes extends Response {
  sendAndCache?: (body: Record<string, unknown>) => void;
}
