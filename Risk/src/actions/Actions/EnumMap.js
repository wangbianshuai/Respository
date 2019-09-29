import National from "./National";
import { Common } from "UtilsCommon";

export default class EnumMap {

    /*借款渠道	01	自然流量 02	网络推广03	信贷员 */
    static GetLoanApplyChannelName(value) {
        return EnumMap.GetValueText({ "01": "自然流量", "02": "网络推广", "03": "信贷员" }, value);
    }

    /*借款人类型	01	个人 02	企业*/
    static GetLenderTypeName(value) {
        return EnumMap.GetValueText({ "01": "个人", "02": "企业" }, value);
    }

    //01:已删除，02:正常
    static GetRoleStatusName(value) {
        return EnumMap.GetValueText({ "01": "已删除", "02": "正常" }, value);
    }

    static GetBidIssueResultName(value){
        return EnumMap.GetValueText({ "01": "成功", "02": "失败" }, value);
    }

    static GetOrderStatusName(value) {
        return EnumMap.GetValueText({
            "01": "待提交进件", "02": "反欺诈审核中", "03": "待初审", "04": "初审审核中", "05": "补件中",
            "06": "初审电核中", "07": "待实地", "08": "实地审核中", "09": "待终审", "10": "终审审核中",
            "11": "终审复核中", "12": "待贷审会", "13": "贷审会进行中", "14": "信贷员确认中",
            "15": "等待签约条件确认中", "16": "拒绝", "17": "废弃", "18": "通过"
        }, value);
    }

    /*时间单位	01	日 02	周 03	月04	季 05	年*/
    static GetTimeUnit(value) {
        return EnumMap.GetValueText({ "01": "日", "03": "个月" }, value);
    }

    /*年化计算方式	01	360 02	365(闰年366)*/
    static GetAnnualCalcWayName(value) {
        return EnumMap.GetValueText({ "01": "360", "02": "365(闰年366)" }, value);
    }

    /*还款方式	01	等额本息 02	付息还本*/
    static GetReplaymentWayName(value) {
        return EnumMap.GetValueText({ "01": "等额本息", "02": "付息还本" }, value);
    }

    /*产品大类	01	新商贷 02	车贷*/
    static GetProductCategoryName(value) {
        return EnumMap.GetValueText({ "01": "新商贷", "02": "车贷" }, value);
    }

    /*亲属关系	01	夫妻02	父母 03	兄弟*/
    static GetKinsfolkRelationName(value) {
        return EnumMap.GetValueText({ "01": "夫妻", "02": "父母", "03": "兄弟" }, value);
    }

    /*单位关系	01	上级 02	下级  03	同事*/
    static GetCompanyRelationName(value) {
        return EnumMap.GetValueText({ "01": "上级", "02": "下级", "03": "同事" }, value);
    }

    /*紧急关系	01	亲属 02	同事 03	朋友*/
    static GetUrgencyRelationName(value) {
        return EnumMap.GetValueText({ "01": "亲属", "02": "同事", "03": "朋友" }, value);
    }

    /*费用收取方式	01	一次性收取02	分期收取*/
    static GetCollectionMethodName(value) {
        return EnumMap.GetValueText({ "01": "一次性收取", "02": "分期收取" }, value);
    }

    /*费用收取阶段	01	前置 02	后置*/
    static GetCollectionTypeName(value) {
        return EnumMap.GetValueText({ "01": "前置", "02": "后置" }, value);
    }

    /*担保主体	01	主担保人02	法定代表担保人03	有房朋友担保人04	额外担保人05	其他*/
    static GetCautionerTypeName(value) {
        return EnumMap.GetValueText({ "01": "主担保人", "02": "法定代表担保人", "03": "有房朋友担保人", "04": "额外担保人", "05": "其他" }, value);
    }

    /*s与借款主体关系	01	股东02	配偶03	亲属04	其他*/
    static GetLoanRelationName(value) {
        return EnumMap.GetValueText({ "01": "股东", "02": "配偶", "03": "亲属", "04": "其他" }, value);
    }

    /*借款用途	01	短期周转02	生意周转03	生活周转04	购物消费05	创业借款 06	其他借款*/
    static GetBorrowerUseName(value) {
        return EnumMap.GetValueText({ "01": "短期周转", "02": "生意周转", "03": "生活周转", "04": "购物消费", "05": "创业借款", "06": "其他借款" }, value);
    }

    /*性别	01	男02	女*/
    static GetSexName(value) {
        return EnumMap.GetValueText({ "01": "男", "02": "女" }, value);
    }

    /*教育程度	01	小学02	初中03	高中04	专科05	本科06	硕士07	博士08	未知09	中专10	博士后11其他*/
    static GetEducationalName(value) {
        return EnumMap.GetValueText({ "01": "小学", "02": "初中", "03": "高中", "04": "专科", "05": "本科", "06": "硕士", "07": "博士" ,
        "08": "未知", "09": "中专", "10": "博士后", "11": "其他" }, value);
    }

    /*婚姻状况	01	未婚02	已婚03	离异04	丧偶*/
    static GetMaritalStatusName(value) {
        return EnumMap.GetValueText({ "01": "未婚", "02": "已婚", "03": "离异", "04": "丧偶" }, value);
    }

    /*布尔值是否	01	是02	否*/
    static GetBoolStatusName(value) {
        return EnumMap.GetValueText({ "01": "是", "02": "否" }, value);
    }

    /*车辆类型01	轿车（5人座）02	SUV03	商务型（7人座）04	客车05	货车*/
    static GetCarTypeName(value) {
        return EnumMap.GetValueText({ "01": "轿车（5人座）", "02": "SUV", "03": "商务型（7人座）", "04": "客车", "05": "货车" }, value);
    }

    static GetValueText(dict, value) {
        if (!value) return "";
        return dict[value] || value;
    }

    /*车辆使用性质	01	营运 02	非营运*/
    static GetCarUseName(value) {
        return EnumMap.GetValueText({ "01": "营运", "02": "非营运" }, value);
    }

    ///*01	通过02	拒绝03	补件04	退回初审05	退回实地06	退回终审 07：流转实地，08：流转终审，09：退回终审重审*/
    static GetApprovalReusltName(value) {
        return EnumMap.GetValueText({
            "01": "通过", "02": "拒绝", "03": "补件",
            "04": "退回初审", "05": "退回实地", "06": "退回终审",
            "07": "流转实地", "08": "流转终审", "09": "退回终审重审",
        }, value);
    }

    static GetNationalityName(value) {
        const n = Common.ArrayFirst(National, (f) => Common.IsEquals(f.itemKey, value));
        return n !== null ? n.itemValue : value;
    }
}