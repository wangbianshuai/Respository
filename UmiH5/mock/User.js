import * as Common from "./Common";

export default {
    'POST /api/user/getdatalist': GetDataList,
    'POST /api/user/insert': Insert,
    'POST /api/user/update': Update,
    'POST /api/user/delete': Delete,
    'POST /api/user/getdata': GetData,
    'POST /RiskControlApproval/getuserlist': GetUserList()
}

var _DataList = [];

function GetDataList(req, res) {
    res.send({
        code: "200000",
        data: _DataList
    })
}

function Insert(req, res) {
    const data = req.body;
    data.UserId = Common.CreateGuid();
    data.UpdateDate = Common.GetCurrentDate();
    _DataList.push(data)

    res.send({
        code: "200000",
        data: { UserId: data.UserId }
    })
}

function Delete(req, res) {
    _DataList = _DataList.filter(f => f.UserId !== req.body.UserId);

    res.send({
        code: "200000",
        data: {}
    })
}

function Update(req, res) {
    var data = Common.ArrayFirst(_DataList, (f) => f.UserId === req.body.UserId);
    if (data !== null) {
        for (var key in req.body) data[key] = req.body[key];
        data.UpdateDate = Common.GetCurrentDate();
    }

    res.send({
        code: "200000",
        data: { UserId: data.UserId }
    })
}

function GetData(req, res) {
    var data = Common.ArrayFirst(_DataList, (f) => f.UserId === req.body.UserId);

    res.send({
        code: "200000",
        data: data
    })
}

function GetUserList() {
    return {
        code: "200000",
        data: [{ UserId: 1, UserName: "张三", Email: "233434@xxd.com", Phone: "15656565343", DepartName: "风险经营中心/贷前管理/产品组", JobName: "产品主管" },
        { UserId: 2, UserName: "李四", Email: "233434@xxd.com", Phone: "15656565343", DepartName: "风险经营中心/贷前管理/产品组", JobName: "产品主管" },
        { UserId: 3, UserName: "王五", Email: "233434@xxd.com", Phone: "15656565343", DepartName: "风险经营中心/贷前管理/产品组", JobName: "产品主管" },
        { UserId: 4, UserName: "马六", Email: "233434@xxd.com", Phone: "15656565343", DepartName: "风险经营中心/贷前管理/产品组", JobName: "产品主管" },
        { UserId: 5, UserName: "赵七", Email: "233434@xxd.com", Phone: "15656565343", DepartName: "风险经营中心/贷前管理/产品组", JobName: "产品主管" }]
    }
}