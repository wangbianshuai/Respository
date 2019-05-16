export default {
    'POST /api/getorderlist': GetOrderList(),
    'POST /api/getorderstatuslogs': GetOrderStatusLogs()
}

function GetOrderList() {
    return {
        code: "200000",
        data: [{ OrderId: 1, OrderCode: "00001", Borrowers: "测试公司1", CurrentApproveUser: "张三" },
        { OrderId: 2, OrderCode: "00002", Borrowers: "测试公司2", CurrentApproveUser: "张三" },
        { OrderId: 3, OrderCode: "00003", Borrowers: "测试公司3", CurrentApproveUser: "张三" }]
    }
}

function GetOrderStatusLogs() {
    return {
        code: "200000",
        data: [{ LogId: 1, StepNo: 5, NodeName: "待初审3", LastNodeName: "待初审1" },
        { LogId: 2, StepNo: 4, NodeName: "待初审2", LastNodeName: "待初审2" },
        { LogId: 3, StepNo: 3, NodeName: "待初审1", LastNodeName: "待初审3" }]
    }
}