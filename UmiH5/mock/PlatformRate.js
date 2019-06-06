import * as Common from "./Common";

export default {
    'POST /api/platformrate/getdatalist': GetDataList,
    'POST /api/platformrate/insert': Insert,
    'POST /api/platformrate/update': Update,
    'POST /api/platformrate/delete': Delete,
    'POST /api/platformrate/getdata': GetData
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
    data.PlatformRateId = Common.CreateGuid();
    data.UpdateDate = Common.GetCurrentDate();
    _DataList.push(data)

    res.send({
        code: "200000",
        data: { PlatformRateId: data.PlatformRateId }
    })
}

function Delete(req, res) {
    _DataList = _DataList.filter(f => f.PlatformRateId !== req.body.PlatformRateId);

    res.send({
        code: "200000",
        data: {}
    })
}

function Update(req, res) {
    var data = Common.ArrayFirst(_DataList, (f) => f.PlatformRateId === req.body.PlatformRateId);
    if (data !== null) {
        for (var key in req.body) data[key] = req.body[key];
        data.UpdateDate = Common.GetCurrentDate();
    }

    res.send({
        code: "200000",
        data: { PlatformRateId: data.PlatformRateId }
    })
}

function GetData(req, res) {
    var data = Common.ArrayFirst(_DataList, (f) => f.PlatformRateId === req.body.PlatformRateId);

    res.send({
        code: "200000",
        data: data
    })
}