import { IUser, IPage, IPlan } from ".";

export type ICompany = {
  id: string;
  name: string;
  slogan: string;
  description: string;
  location: string;
  employees: IUser[];
  logo: string;
  pages: IPage[];
  plan?: IPlan;
};
