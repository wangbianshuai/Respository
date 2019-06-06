import * as Common from "./Common";

export default {
    'POST /api/role/getdatalist': GetDataList,
    'POST /api/role/insert': Insert,
    'POST /api/role/update': Update,
    'POST /api/role/delete': Delete,
    'POST /api/role/getdata': GetData
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
    data.RoleId = Common.CreateGuid();
    data.UpdateDate = Common.GetCurrentDate();
    _DataList.push(data)

    res.send({
        code: "200000",
        data: { RoleId: data.RoleId }
    })
}

function Delete(req, res) {
    _DataList = _DataList.filter(f => f.RoleId !== req.body.RoleId);

    res.send({
        code: "200000",
        data: {}
    })
}

function Update(req, res) {
    var data = Common.ArrayFirst(_DataList, (f) => f.RoleId === req.body.RoleId);
    if (data !== null) {
        for (var key in req.body) data[key] = req.body[key];
        data.UpdateDate = Common.GetCurrentDate();
    }

    res.send({
        code: "200000",
        data: { RoleId: data.RoleId }
    })
}

function GetData(req, res) {
    var data = Common.ArrayFirst(_DataList, (f) => f.RoleId === req.body.RoleId);

    res.send({
        code: "200000",
        data: data
    })
}