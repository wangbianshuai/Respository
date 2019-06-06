import * as Common from "./Common";

const _PatchInfo = {};

export default {
    'POST /RiskControlApproval/getpatchinfo': GetPatchInfo(),
    'POST /RiskControlApproval/savepatchinfo': SavePatchInfo,
    'POST /RiskControlApproval/getpatchrecords': GetPatchRecordList(),
}

function SavePatchInfo(req, res) {
    for (var key in req.body) _PatchInfo[key] = req.body[key];
    _PatchInfo.updateTime = Common.GetCurrentDate();

    res.send({
        code: "200000",
        data: {}
    })
}

function GetPatchInfo() {
    _PatchInfo.CreateDate = "2019-03-09 11:20";
    _PatchInfo.CreateUser = "张三";
    _PatchInfo.ApprovalOpinion = "返回补件";
    _PatchInfo.ApprovalRemark = "当前工单缺少借款人房屋租赁合同、借款人银行流水、个人征信信息。请补件！";
    _PatchInfo.MainTip = "重要提醒：剩余可操作时间还有12天3小时28分，到期后补件超时则视为补件失败而被拒单";

    return {
        respCode: 0,
        respMsg: "",
        data: _PatchInfo
    }
}

function GetPatchRecordList() {
    return {
        code: "200000",
        data: [{
            CreateDate: "2019-03-09 11:20",
            CreateUser: "张三",
            ApprovalOpinion: "返回补件",
            PatchCode: "1020320101-002",
            ApprovalRemark: "当前工单缺少借款人房屋租赁合同、借款人银行流水、个人征信信息。请补件！",
            PatchRemark: "重要提醒：剩余可操作时间还有12天3小时28分，到期后补件超时则视为补件失败而被拒单",
            ReceiveUser: "李四",
            SubmitDate: "2019-03-09 11:21"
        },
        {
            CreateDate: "2019-03-09 11:20",
            CreateUser: "王五",
            ApprovalOpinion: "返回补件",
            PatchCode: "1020320101-002",
            ApprovalRemark: "当前工单缺少借款人房屋租赁合同、借款人银行流水、个人征信信息。请补件！",
            PatchRemark: "重要提醒：剩余可操作时间还有12天3小时28分，到期后补件超时则视为补件失败而被拒单",
            ReceiveUser: "马六",
            SubmitDate: "2019-03-09 11:21"
        }]
    }
}