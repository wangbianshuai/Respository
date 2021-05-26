import DvaIndex from "DvaCommon";
import { EntityModelConfig } from 'Configs';

const config = EntityModelConfig('AccountBill');

config.actionList.push(get("getBillYear", "ViewAccountBill?$select=BillYear,Count(*) BillCount&$orderby BillYear desc&$groupby=BillYear", "getBillYear", "ViewAccountBill"));
config.actionList.push(get("getBillQuarter", "ViewAccountBill?$select=BillYear,BillQuarter,BillQuarterName,Count(*) BillCount&$orderby BillYear desc&$groupby=BillYear,BillQuarter,BillQuarterName", "getBillQuarter", "ViewAccountBill"));
config.actionList.push(get("getBillMonth", "ViewAccountBill?$select=BillYear,BillMonth,Count(*) BillCount&$orderby BillYear desc&$groupby=BillYear,BillMonth", "getBillMonth", "ViewAccountBill"));

function get(actionName, url, stateName, dataKey, isToken, hasToken) {
  return { actionName, url, method: "GET", stateName, dataKey, isToken, hasToken }
}

export default DvaIndex(config);
