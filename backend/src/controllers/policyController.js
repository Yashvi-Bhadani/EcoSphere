import asyncHandler from "../utils/asyncHandler.js";
import * as policyService from "../services/policyService.js";
import ApiError from "../utils/apiError.js";

export const getPolicies = asyncHandler(async (_req, res) => {
  const policies = await policyService.getAllPolicies();
  res.status(200).json({ success: true, message: "Policies fetched successfully", data: policies });
});

export const getPolicy = asyncHandler(async (req, res) => {
  const policy = await policyService.getPolicyById(Number(req.params.id));
  res.status(200).json({ success: true, message: "Policy fetched successfully", data: policy });
});

export const createPolicy = asyncHandler(async (req, res) => {
  const policy = await policyService.createPolicy(req.body, req.user);
  res.status(201).json({ success: true, message: "Policy created successfully", data: policy });
});

export const updatePolicy = asyncHandler(async (req, res) => {
  const policy = await policyService.updatePolicy(Number(req.params.id), req.body);
  res.status(200).json({ success: true, message: "Policy updated successfully", data: policy });
});

export const deletePolicy = asyncHandler(async (req, res) => {
  await policyService.deletePolicy(Number(req.params.id));
  res.status(200).json({ success: true, message: "Policy deleted successfully", data: {} });
});
