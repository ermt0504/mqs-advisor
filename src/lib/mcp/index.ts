import { defineMcp } from "@lovable.dev/mcp-js";
import listProjects from "./tools/list-projects";
import getCompanyInfo from "./tools/get-company-info";
import recommendWebsite from "./tools/recommend-website";

export default defineMcp({
  name: "mqs-advisor",
  title: "MQS Advisor",
  version: "0.1.0",
  instructions:
    "Public tools for MQS_Advisor, a product studio and incubator (Canada, France, Senegal, Djibouti). Browse its projects and company info, or get AI website recommendations for a business idea. Content is available in French (default) or English.",
  tools: [listProjects, getCompanyInfo, recommendWebsite],
});
