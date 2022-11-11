import { Response } from "express";
import { ICompany, ICustomReq } from "../types/";
import {
  sendInternalError,
  errorResponse,
  sendResponse,
  getMulterFileUrl,
} from "../utils/helpers";
import { CompanyModel } from "../models";
import {
  USER_HAS_NO_COMPANY,
  COMPANY_INFO_UPDATED,
  FETCH_COMPANIES_LIST,
} from "../utils/constants";

export const updateCompanyInfo = async (
  req: ICustomReq<ICompany>,
  res: Response
) => {
  const { slogan, description, location } = req.body;
  const user = req.user!;

  try {
    const company = await CompanyModel.findOne({ name: user.companyName });
    if (!company) {
      const { ERROR, MSG } = USER_HAS_NO_COMPANY;
      return errorResponse(400, ERROR, res, [{ msg: MSG }]);
    }
    const logoUrl = getMulterFileUrl(req);
    company.slogan = slogan;
    company.description = description;
    company.location = location;
    company.logo = logoUrl;
    await company.save();
    sendResponse(200, COMPANY_INFO_UPDATED, res, {});
  } catch (error) {
    sendInternalError(res, error);
  }
};

export const getCompanies = async (req: ICustomReq, res: Response) => {
  try {
    const companies = await CompanyModel.find();
    let filteredCompanies: Partial<ICompany>[] | undefined;
    if (req.user?.role !== "admin") {
      filteredCompanies = companies.map(
        ({ name, slogan, description, logo, pages }) => ({
          name,
          slogan,
          description,
          logo,
          pages,
        })
      );
    }
    return sendResponse(200, FETCH_COMPANIES_LIST, res, {
      companies: filteredCompanies || companies,
    });
  } catch (error) {
    sendInternalError(res, 500);
  }
};
