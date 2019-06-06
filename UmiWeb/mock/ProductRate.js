import * as Common from "./Common";

export default {
    'POST /api/productrate/getdatalist': GetDataList,
    'POST /api/productrate/insert': Insert,
    'POST /api/productrate/update': Update,
    'POST /api/productrate/delete': Delete,
    'POST /api/productrate/getdata': GetData
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
    data.ProductRateId = Common.CreateGuid();
    data.UpdateDate = Common.GetCurrentDate();
    _DataList.push(data)

    res.send({
        code: "200000",
        data: { ProductRateId: data.ProductRateId }
    })
}

function Delete(req, res) {
    _DataList = _DataList.filter(f => f.ProductRateId !== req.body.ProductRateId);

    res.send({
        code: "200000",
        data: {}
    })
}

function Update(req, res) {
    var data = Common.ArrayFirst(_DataList, (f) => f.ProductRateId === req.body.ProductRateId);
    if (data !== null) {
        for (var key in req.body) data[key] = req.body[key];
        data.UpdateDate = Common.GetCurrentDate();
    }

    res.send({
        code: "200000",
        data: { ProductRateId: data.ProductRateId }
    })
}

function GetData(req, res) {
    var data = Common.ArrayFirst(_DataList, (f) => f.ProductRateId === req.body.ProductRateId);

    res.send({
        code: "200000",
        data: data
    })
}