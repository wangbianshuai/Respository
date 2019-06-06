import * as Common from "./Common";

export default {
    'POST /api/product/getdatalist': GetDataList,
    'POST /api/product/insert': Insert,
    'POST /api/product/update': Update,
    'POST /api/product/getdata': GetData
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
    data.ProductId = Common.CreateGuid();
    data.CreateDate = Common.GetCurrentDate();
    data.UpdateDate = Common.GetCurrentDate();
    _DataList.push(data)

    res.send({
        code: "200000",
        data: { ProductId: data.ProductId }
    })
}

function Update(req, res) {
    var data = Common.ArrayFirst(_DataList, (f) => f.ProductId === req.body.ProductId);
    if (data !== null) {
        for (var key in req.body) data[key] = req.body[key];
        data.UpdateDate = Common.GetCurrentDate();
    }

    res.send({
        code: "200000",
        data: { ProductId: data.ProductId }
    })
}

function GetData(req, res) {
    var data = Common.ArrayFirst(_DataList, (f) => f.ProductId === req.body.ProductId);

    res.send({
        code: "200000",
        data: data
    })
}