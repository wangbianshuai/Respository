import * as Common from "./Common";

export default {
    'POST /api/backmethod/getdatalist': GetDataList,
    'POST /api/backmethod/insert': Insert,
    'POST /api/backmethod/update': Update,
    'POST /api/backmethod/delete': Delete,
    'POST /api/backmethod/getdata': GetData
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
    data.BackMethodId = Common.CreateGuid();
    data.UpdateDate = Common.GetCurrentDate();
    _DataList.push(data)

    res.send({
        code: "200000",
        data: { BackMethodId: data.BackMethodId }
    })
}

function Delete(req, res) {
    _DataList = _DataList.filter(f => f.BackMethodId !== req.body.BackMethodId);

    res.send({
        code: "200000",
        data: {}
    })
}

function Update(req, res) {
    var data = Common.ArrayFirst(_DataList, (f) => f.BackMethodId === req.body.BackMethodId);
    if (data !== null) {
        for (var key in req.body) data[key] = req.body[key];
        data.UpdateDate = Common.GetCurrentDate();
    }

    res.send({
        code: "200000",
        data: { BackMethodId: data.BackMethodId }
    })
}

function GetData(req, res) {
    var data = Common.ArrayFirst(_DataList, (f) => f.BackMethodId === req.body.BackMethodId);

    res.send({
        code: "200000",
        data: data
    })
}