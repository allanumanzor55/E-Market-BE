import { Request, Response } from "express";
import { PlanModel, CompanyModel } from "../models";
import { sendResponse, sendInternalError, errorResponse } from "../utils/helpers";
import { USER_MSG } from "../utils/constants";
import { 
  COMPANY_SELECTED_PLAN_NO_EXISTS,
  COMPANY_DOES_NOT_EXIST,
  SELECTED_PLAN
} from "../utils/companies.constants";
import { IPlan } from "../types";

export const addPlan = async (req: Request, res: Response) => {
  const { name, slogan, icon, type, price, include } = req.body;
  try {
    let plan = await PlanModel.findOne({ name });
    if (plan) {
      const { ERROR, MSG } = USER_MSG.NAME_PLAN;
      return errorResponse(400, ERROR, res, [{ msg: MSG }]);
    }

    plan = new PlanModel({
      name,
      slogan,
      icon,
      type,
      price: price || 0,
      include: include,
    });

    await plan.save();

    sendResponse(201, USER_MSG.ADD_PLAN.MSG, res, {"name":name});
  } catch (error) {
    sendInternalError(res, error);
  }
};

export const getPlan = async (req: Request, res: Response) => {
  try {
    let plan: Partial<IPlan>[] = [];
    plan = await PlanModel.find({});

    plan = plan
      .map(({ id, name, slogan, icon, type, price, include }) => {
        return {
          id, 
          name, 
          slogan, 
          icon, 
          type, 
          price, 
          include
        };
      })
    sendResponse(200, USER_MSG.ADMIN_GET_PLANS, res, { list: plan });
  } catch (e) {
    sendInternalError(res, e);
  }
};

export const selectedPlan = async (req: Request, res: Response) => {
  const { idPlan, nameCompany } = req.body;
  try {
    const plan = await PlanModel.findOne({_id:idPlan}) 
    if (!plan) {
      errorResponse(400, COMPANY_SELECTED_PLAN_NO_EXISTS.MSG, 
        res, [{ msg: COMPANY_SELECTED_PLAN_NO_EXISTS.ERROR }]);
    }

    CompanyModel.findByIdAndUpdate
      (
        {name:nameCompany},
        {$set:{plan : plan?._id}},
        {new:true},
        function (err1:any,company:any){
          if (err1) {
            errorResponse(400, COMPANY_DOES_NOT_EXIST.MSG, 
              res, [{ msg: COMPANY_DOES_NOT_EXIST.ERROR }]);
          }
          sendResponse(200, SELECTED_PLAN, res, {"name":company.name});
        }
      );
    
  } catch (error) {
    sendInternalError(res, error);
  }
};