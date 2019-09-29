export default {
    //Key:菜单，Value:接口属性名
    MenuKeys: {
        Orders: "Orders", //工单
        OrderList: "OrderList", //工单/工单池
        OrderWorkManage: "OrderWorkManage",//进件管理
        ApprovalManage: "ApprovalManage",
        OrderWork: "OrderWork",//进件
        MyOrders: "MyOrders",//我的工单
        OrderDetailList: "OrderDetailList",//工单/进件列表
        WaitingOrderList: "WaitingOrderList",//工单/待处理 
        HandledOrderList: "HandledOrderList",//工单/已处理
        SuspendedOrderList: "SuspendedOrderList",//工单/已挂起
        QueryOrderList: "QueryOrderList",//工单/工单查询 
        QueryBidOrderList: "QueryBidOrderList",//工单/发标查询
        RightManage: "RightManage",//权限管理
        UserManage: "UserManage",//权限管理/用户管理 
        RoleManage: "RoleManage",//权限管理/角色管理 
        ProductConfig: "ProductConfig",//公共配置/产品配置
        ProductRateConfig: "ProductRateConfig",//公共配置/产品利率配置
        BackMethodConfig: "BackMethodConfig",//公共配置/还款方式配置
        PlatformRateConfig: "PlatformRateConfig",//公共配置/平台费率配置
        CommonConfig: "CommonConfig",//公共配置
        QueryCustomer: "QueryCustomer",//客户管理/客户查询
        WebQueryReview: "WebQueryReview",//客户管理/网查复核
        BlacklistManage: "BlacklistManage",//客户管理/黑名单配置
        CustomerManage: "CustomerManage",//客户管理
        AntiFraudAuditing: "AntiFraudAuditing",//审核管理/反欺诈审核
        FirstTrialAuditing: "FirstTrialAuditing",//审核管理/初审审核
        FirstTrialPhoneAuditing: "FirstTrialPhoneAuditing",//审核管理/初审电核
        FirstTrial: "FirstTrial",//初审
        IndeedAuditing: "IndeedAuditing",//审核管理/实地审核
        Indeed: "Indeed",//实地
        FinalAuditing: "FinalAuditing",//审核管理/终审审核
        FinalReviewAuditing: "FinalReviewAuditing",//审核管理/终审复核
        LoanReviewCommittee: "LoanReviewCommittee",//审核管理/贷审会
        WaitConditionAuditing: "WaitConditionAuditing",//审核管理/等待签约条件审核
        FinalApproval: "FinalApproval",//终审
        OrderDetail: "OrderDetail",//信贷管理/进件详情 
        OrderPatchEdit: "OrderPatchEdit",//信贷管理/补件操作
        OrderPatchRecord: "OrderPatchRecord",//信贷管理/补件记录
        Patch: "Patch",//补件
        ApproveResultConfirm: "ApproveResultConfirm"//信贷管理/审批结论确认 
    },
    //Key:页面控件属性名，Value:接口权限名
    PagePropertyNames: {
        OrderList: {
            Dispatch: "派单",//派单
            GrabOrder: "抢单"//抢单
        },
        OrderDetailList: {
            LookOrderDetail: "LookOrderDetail" //进件操作
        },
        WaitingOrderList: {
            HandlerOrder: "处理",  //处理
            HandUpOrder: "挂起"  //挂起
        },
        HandledOrderList: {
            LookStatusRecord: "查看流转日志" //查看流转日志
        },
        SuspendedOrderList: {
            UnHandUpOrder: "解挂"//解挂
        },
        QueryOrderList: {
            LookStatusRecord: "查看流转日志",//查看流转日志
            EditOrder: "EditOrder",//修改
            ChangeUser: "转单",//转单
            CancelOrder: "作废",//作废
            LookApproveInfo: "LookApproveInfo"//查看审核信息
        },
        OrderDetail: {
            OrderInfoRightButtonView: "保存", //基本信息
            PersonBaseInfoRightButtonView: "保存",//个人基本信息
            PersonCardInfoRightButtonView: "保存",//个人证件信息
            PersonPropertyInfoRightButtonView: "保存",//个人资产信息
            CompanyBaseInfoRightButtonView: "保存",//企业基本信息
            ContactInfoRightButtonView: "保存",//联系人信息
            SubmitRightButtonView: "提交进件" //提交
        },
        OrderPatchEdit: {
            PatchInfoRightButtonView: "提交"//补件操作提交
        },
        ApproveResultConfirm: {
            SaveApprovalOpinion: "提交"//审批结论确认提交
        },
        FirstTrialAuditing: {
            SaveApprovalOpinion: "提交",//审核意见提交
            PersonCardInfoButtonView: "保存",//个人证件信息,
            PersonBaseInfoButtonView: "保存",//个人基本信息
            CompanyBaseInfoButtonView: "保存",//企业基本信息
            PersonPropertyInfoButtonView: "保存",//个人资产信息
            ContactInfoButtonView: "保存",//联系人信息
            CompanyBankInfoButtonView: "保存",//对公银行流水信息
            PersonBankInfoButtonView: "保存",//对私银行流水信息
            CollectBankInfoButtonView: "保存",//汇总数据
            CompanyCreditButtonView: "保存",//企业类征信
            PersonCreditButtonView: "保存",//个人类征信
            OtherCreditButtonView: "保存"//其他数据
        },
        FirstTrialPhoneAuditing: {
            SaveApprovalOpinion: "提交",//审核意见提交
            CompanyContactCheckButtonView: "保存",//单位相关信息核实
            KinsfolkContactCheckButtonView: "保存",//亲属联系人核实
            OwnerContactCheckButtonView: "保存",//借款本人核实
            WorkmateContactCheckButtonView: "保存"//同事联系人核实
        },
        IndeedAuditing: {
            SaveApprovalOpinion: "提交",//审核意见提交
        },
        FinalAuditing: {
            SaveApprovalOpinion: "提交",//审核意见提交
            InvoiceInfoButtonView: "保存",//开票信息
            DebtInfoButtonView: "保存",//负债信息
            DealInfoButtonView: "保存",//经营信息
            PropertyInfoButtonView: "保存",//资产信息
            CompanyCreditButtonView: "保存",//企业类征信
            PersonCreditButtonView: "保存",//个人类征信
            OtherCreditButtonView: "保存",//其他数据
            CautionerInfoButtonView: "保存",//担保人信息
            CoBorrowerInfoButtonView: "保存",//共借人信息
            FinalCreditCalculateButtonView: "保存",//测试结果
            FinalCreditApprovalResultButtonView: "保存"//终审授信结论
        },
        FinalReviewAuditing: {
            SaveApprovalOpinion: "提交",//审核意见提交
        },
        LoanReviewCommittee: {
            SaveApprovalOpinion: "提交",//审核意见提交
        },
        WaitConditionAuditing: {
            SaveApprovalOpinion: "提交",//审核意见提交
        },
        QueryBidOrderList: {
            Bidding: "发标",//发标
            LookFailReason: "查询"//查看失败原因
        },
        QueryCustomer: {
            LookApproveInfo: "LookApproveInfo",//查看审批信息
        },
        WebQueryReview: {
            Review: "复核"//复核
        },
        BlacklistManage: {
            ToEditPage: "新增", //新增
            EditBlacklist: "修改",//修改
            DeleteBlacklist: "删除"//删除
        },
        ProductConfig: {
            ToEditPage: "新增", //新增
            EditProduct: "修改"//修改
        },
        ProductRateConfig: {
            ToEditPage: "新增", //新增
            DeleteProductRate: "删除"//删除
        },
        BackMethodConfig: {
            ToEditPage: "新增", //新增
            DeleteBackMethod: "删除"//删除
        },
        PlatformRateConfig: {
            ToEditPage: "新增", //新增
            DeletePlatformRate: "删除"//删除
        },
        UserManage: {
            ToEditPage: "开户", //开户
            ToRoleConfig: "ToRoleConfig"//配置角色
        },
        RoleManage: {
            ToEditPage: "新增", //新增
            ToConfigPage: "ToConfigPage",//配置权限
            EditRole: "修改",//修改
            DeleteRole: "删除"//删除
        },
    },
    /*01	待提交进件02	反欺诈审核中03	待初审04	初审审核中05	补件中06	初审电核中07	待实地08	实地审核中09	待终审
      10	终审审核中11	终审复核中12	待贷审会13	贷审会进行中14	信贷员确认中15	等待签约条件确认中16	拒绝17	废弃18	通过*/
    OrderStatusNoMenus: {
        "01": ["审批结论确认"],
        "02": ["审批结论确认", "初审", "实地", "终审"],
        "03": ["审批结论确认", "初审", "实地", "终审"],
        "04": ["审批结论确认", "初审电核", "实地", "终审"],
        "05": ["审批结论确认", "初审电核", "实地", "终审"],
        "06": ["审批结论确认", "实地", "终审"],
        "07": ["审批结论确认", "实地", "终审"],
        "08": ["审批结论确认", "终审"],
        "09": ["审批结论确认", "终审"],
        "10": ["审批结论确认", "终审复核", "贷审会", "等待签约条件审核"],
        "11": ["审批结论确认", "贷审会", "等待签约条件审核"],
        "12": ["审批结论确认", "贷审会", "等待签约条件审核"],
        "13": ["审批结论确认", "等待签约条件审核"],
        "14": ["等待签约条件审核"],
        "15": [],
        "16": [],
        "17": [],
        "18": [],
    }
}