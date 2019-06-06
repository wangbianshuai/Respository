import * as Common from "./Common";

export default {
    'POST /api/blacklist/getdatalist': GetDataList,
    'POST /api/blacklist/insert': Insert,
    'POST /api/blacklist/update': Update,
    'POST /api/blacklist/delete': Delete,
    'POST /api/blacklist/getdata': GetData
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
    data.BlacklistId = Common.CreateGuid();
    data.UpdateDate = Common.GetCurrentDate();
    _DataList.push(data)

    res.send({
        code: "200000",
        data: { BlacklistId: data.BlacklistId }
    })
}

function Delete(req, res) {
    _DataList = _DataList.filter(f => f.BlacklistId !== req.body.BlacklistId);

    res.send({
        code: "200000",
        data: {}
    })
}

function Update(req, res) {
    var data = Common.ArrayFirst(_DataList, (f) => f.BlacklistId === req.body.BlacklistId);
    if (data !== null) {
        for (var key in req.body) data[key] = req.body[key];
        data.UpdateDate = Common.GetCurrentDate();
    }

    res.send({
        code: "200000",
        data: { BlacklistId: data.BlacklistId }
    })
}

function GetData(req, res) {
    var data = Common.ArrayFirst(_DataList, (f) => f.BlacklistId === req.body.BlacklistId);

    res.send({
        code: "200000",
        data: data
    })
}