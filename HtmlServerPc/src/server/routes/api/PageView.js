import Router from 'koa-router';
import Home from "../../controllers/PageView/Home";
import ConsumptionDetail from "../../controllers/PageView/ConsumptionDetail";
import ConsumptionList from "../../controllers/PageView/ConsumptionList";
import AuthorizStatus from "../../controllers/PageView/AuthorizStatus";
import InvestFail from "../../controllers/PageView/InvestFail";
import Monthgold from "../../controllers/PageView/Monthgold";
import NewTender from "../../controllers/PageView/NewTender";
import PurchaseSuccess from "../../controllers/PageView/PurchaseSuccess";
import ThirtyTender from "../../controllers/PageView/ThirtyTender";
import Coupon from "../../controllers/PageView/Coupon";
import InviteFriendsDetail from "../../controllers/PageView/InviteFriendsDetail";
import BondsGoldIngot from "../../controllers/PageView/Bonds/GoldIngot";
import BondsMonthGold from "../../controllers/PageView/Bonds/MonthGold";
import BondsMonthSend from "../../controllers/PageView/Bonds/MonthSend";
import BondsNewTender from "../../controllers/PageView/Bonds/NewTender";
import BondsSevenGold from "../../controllers/PageView/Bonds/SevenGold";
import BondsStepDetail from "../../controllers/PageView/Bonds/StepDetail";
import BondsThirtyTender from "../../controllers/PageView/Bonds/ThirtyTender";
import UserCenterError from "../../controllers/PageView/UserCenterError";
import OpenaccountError from "../../controllers/PageView/OpenaccountError";
import OpenaccountSuccess from "../../controllers/PageView/OpenaccountSuccess";
import UserCenterSuccess from "../../controllers/PageView/UserCenterSuccess";
import CompanyAccountInfo from "../../controllers/PageView/Company/AccountInfo";
import CompanyAccount from "../../controllers/PageView/Company/Account";
import CompanyAuthentication from "../../controllers/PageView/Company/Authentication";
import CompanyBundled from "../../controllers/PageView/Company/Bundled";
import CompanyDealDetail from "../../controllers/PageView/Company/DealDetail";
import CompanyLogin from "../../controllers/PageView/Company/Login";
import CompanyRecharge from "../../controllers/PageView/Company/Recharge";
import CompanyRegister from "../../controllers/PageView/Company/Register";
import CompanySecuritySettings from "../../controllers/PageView/Company/SecuritySettings";
import CompanyUserLicense from "../../controllers/PageView/Company/UserLicense";
import UserlicenseAgree from "../../controllers/PageView/UserlicenseAgree";
import CompanyWithdraw from "../../controllers/PageView/Company/Withdraw";
import FundRecordCoinLog from "../../controllers/PageView/FundRecord/CoinLog";
import FundRecordDealDetail from "../../controllers/PageView/FundRecord/DealDetail";
import FundRecordOpenAccount from "../../controllers/PageView/FundRecord/OpenAccount";
import FundRecordRecharge from "../../controllers/PageView/FundRecord/Recharge";
import FundRecordWithdraw from "../../controllers/PageView/FundRecord/Withdraw";
import UserCenterBorrow from "../../controllers/PageView/UserCenterBorrow";
import UserCenterIdentity from "../../controllers/PageView/UserCenterIdentity";
import UserCenterMessage from "../../controllers/PageView/UserCenterMessage";
import UserCenterAccount from "../../controllers/PageView/UserCenterAccount";

const getRouter = {
    Home,
    ConsumptionList,
    AuthorizStatus,
    InvestFail,
    Monthgold,
    NewTender,
    PurchaseSuccess,
    ThirtyTender,
    Coupon,
    InviteFriendsDetail,
    BondsGoldIngot,
    BondsMonthGold,
    BondsMonthSend,
    BondsNewTender,
    BondsSevenGold,
    BondsStepDetail,
    BondsThirtyTender,
    UserCenterError,
    OpenaccountError,
    OpenaccountSuccess,
    UserCenterSuccess,
    CompanyAccountInfo,
    CompanyAccount,
    CompanyAuthentication,
    CompanyBundled,
    CompanyDealDetail,
    CompanyLogin,
    CompanyRecharge,
    CompanyRegister,
    CompanySecuritySettings,
    CompanyUserLicense,
    UserlicenseAgree,
    CompanyWithdraw,
    FundRecordCoinLog,
    FundRecordDealDetail,
    FundRecordOpenAccount,
    FundRecordRecharge,
    FundRecordWithdraw,
    UserCenterBorrow,
    UserCenterIdentity,
    UserCenterMessage,
    UserCenterAccount
};

const router = new Router({ prefix: '/PageView' });

for (let key in getRouter) router.get(`/Get${key}`, getRouter[key].GetData);

router.post('/GetConsumptionDetail', ConsumptionDetail.GetData);

export default router;