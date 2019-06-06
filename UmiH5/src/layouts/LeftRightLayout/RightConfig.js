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
        RightManage: "RightManage",//权限管理
        UserManage: "UserManage",//权限管理/用户管理 
        RoleManage: "RoleManage",//权限管理/角色管理 
        ProductConfig: "ProductConfig",//公共配置/产品配置
        ProductRateConfig: "ProductRateConfig",//公共配置/产品利率配置
        BackMethodConfig: "BackMethodConfig",//公共配置/还款方式配置
        PlatformRateConfig: "PlatformRateConfig",//公共配置/平台费率配置
        CommonConfig: "CommonConfig",//公共配置
        CustomerQuery: "CustomerQuery",//客户管理/客户查询
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
            DispatchOrder: "DispatchOrder",//派单
            GrabOrder: "GrabOrder"//抢单
        },
        OrderDetailList: {
            LookOrderDetail: "LookOrderDetail" //进件操作
        },
        WaitingOrderList: {
            HandlerOrder: "HandlerOrder",  //处理
            HandUpOrder: "HandUpOrder"  //挂起
        },
        HandledOrderList: {
            LookStatusRecord: "LookStatusRecord" //查看流转日志
        },
        SuspendedOrderList: {
            UnHandUpOrder: "UnHandUpOrder"//解封
        },
        QueryOrderList: {
            LookStatusRecord: "LookStatusRecord",//查看流转日志
            EditOrder: "EditOrder",//修改
            ChangeUser: "ChangeUser",//转单
            CancelOrder: "CancelOrder",//作废
            LookApproveInfo: "LookApproveInfo"//查看审核信息
        },
        OrderDetail: {
            OrderInfoRightButtonView: "OrderInfoRightButtonView", //基本信息
            PersonBaseInfoRightButtonView: "PersonBaseInfoRightButtonView",//个人基本信息
            PersonCardInfoRightButtonView: "PersonCardInfoRightButtonView",//个人证件信息
            PersonPropertyInfoRightButtonView: "PersonPropertyInfoRightButtonView",//个人资产信息
            CompanyBaseInfoRightButtonView: "CompanyBaseInfoRightButtonView",//企业基本信息
            ContactInfoRightButtonView: "ContactInfoRightButtonView",//联系人信息
            SubmitRightButtonView: "SubmitRightButtonView" //提交
        },
        OrderPatchEdit: {
            PatchInfoRightButtonView: "PatchInfoRightButtonView"//补件操作提交
        },
        ApproveResultConfirm: {
            SaveApprovalOpinion: "SaveApprovalOpinion"//审批结论确认提交
        },
        FirstTrialAuditing: {
            SaveApprovalOpinion: "SaveApprovalOpinion",//审核意见提交
            PersonCardInfoButtonView: "PersonCardInfoButtonView",//个人证件信息,
            PersonBaseInfoButtonView: "PersonBaseInfoButtonView",//个人基本信息
            CompanyBaseInfoButtonView: "CompanyBaseInfoButtonView",//企业基本信息
            PersonPropertyInfoButtonView: "PersonPropertyInfoButtonView",//个人资产信息
            ContactInfoButtonView: "ContactInfoButtonView",//联系人信息
            CompanyBankInfoButtonView: "CompanyBankInfoButtonView",//对公银行流水信息
            PersonBankInfoButtonView: "PersonBankInfoButtonView",//对私银行流水信息
            CollectBankInfoButtonView: "CollectBankInfoButtonView",//汇总数据
            CompanyCreditButtonView: "CompanyCreditButtonView",//企业类征信
            PersonCreditButtonView: "PersonCreditButtonView",//个人类征信
            OtherCreditButtonView: "OtherCreditButtonView"//其他数据
        },
        FirstTrialPhoneAuditing: {
            SaveApprovalOpinion: "SaveApprovalOpinion",//审核意见提交
            CompanyContactCheckButtonView: "CompanyContactCheckButtonView",//单位相关信息核实
            KinsfolkContactCheckButtonView: "KinsfolkContactCheckButtonView",//亲属联系人核实
            OwnerContactCheckButtonView: "OwnerContactCheckButtonView",//借款本人核实
            WorkmateContactCheckButtonView: "WorkmateContactCheckButtonView"//同事联系人核实
        },
        IndeedAuditing: {
            SaveApprovalOpinion: "SaveApprovalOpinion",//审核意见提交
        }
    }
}