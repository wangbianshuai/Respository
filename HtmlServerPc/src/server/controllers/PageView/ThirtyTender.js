async function GetData(ctx) {
    ctx.IsLog = false;
    ctx.body = {
        globalData: GetGlobalData(),
        global: GetGlobal()
    }
}

function GetGlobal() {
    return {
        staticHost: "//static.xinxindai.com",
        xxdVersion: "1.7.4"
    }
}

function GetGlobalData() {
    return {
        "formtoken": "71b51f670b09f56298f468cd2cd54213",
        "isLogin": true,
        "nickName": "18***41",
        "link": {
            "code": 200000,
            "data": {
                "items": [{
                    "textHref": "//www.sfia.org.cn/",
                    "text": "上海金融信息行业协会"
                }, {
                    "textHref": "//www.nifa.org.cn/nifa/index.html",
                    "text": "中国互联网金融协会"
                }, {
                    "textHref": "//www.wdzj.com/",
                    "text": "网贷之家"
                }, {
                    "textHref": "//www.wjchina.org/",
                    "text": "网金中国"
                }, {
                    "textHref": "//www.xinxindai.com",
                    "text": "网贷平台"
                }, {
                    "textHref": "//bbs.xinxindai.com/",
                    "text": "P2P网贷论坛"
                }, {
                    "textHref": "//finance.ifeng.com/itfinance/",
                    "text": "凤凰互联网金融"
                }, {
                    "textHref": "//www.zixinke.com",
                    "text": "资信客"
                }, {
                    "textHref": "//www.shengcai18.com/",
                    "text": "生菜网"
                }, {
                    "textHref": "//iof.hexun.com",
                    "text": "和讯互联网金融"
                }, {
                    "textHref": "//www.icaifu.com/",
                    "text": "研报下载"
                }, {
                    "textHref": "//shanghai.roadoor.com/",
                    "text": "上海贷款"
                }, {
                    "textHref": "//www.dimeng.net",
                    "text": "网贷系统"
                }, {
                    "textHref": "//h.shlxhd.gov.cn/xinxindai.lx",
                    "text": "新新贷党支部"
                }]
            }
        },
        "currentDate": 1542012700365,
        "detailThirtyTender": {
            "code": 200000,
            "data": {
                "testCount": "1",
                "typeName": "平衡型",
                "description": "",
                "isPurchasedProduct": true,
                "periodUnit": "MONTH",
                "isLogin": true,
                "usable": "0",
                "income5000": 58.33,
                "remAccount": 5387900,
                "meetTermOfPurchase": false,
                "terms": "1",
                "quota": "3000000",
                "closeTime": 1543593600000,
                "id": "RI20180105231",
                "income100": 1.16,
                "maxAmount": 0.0,
                "openTime": 1515340800000,
                "income1000": 11.66,
                "apr": 6.0,
                "period": "1",
                "investmentAmount": "100",
                "count": "4",
                "floatApr": 8.0,
                "nextTestTime": "2019-01-01",
                "mostTender": 10000,
                "releasePeriodCount": "201801001",
                "lowestTender": "100",
                "collectedInterest": "0",
                "income10000": 116.66,
                "name": "新元宝（新手专享）",
                "step": "100",
                "surplusAmount": "2999900",
                "isBetweenPurchaseTime": true,
                "useRedenvelope": "N",
                "account": "50000000",
                "status": 2
            }
        },
        "thirtyTenderRecord": {
            "code": 200000,
            "data": {
                "pageSize": 10,
                "currentPage": 1,
                "totalCount": 62585,
                "items": [{
                    "addTime": 1542003793000,
                    "userName": "13***60",
                    "account": 5000
                }, {
                    "addTime": 1541998122000,
                    "userName": "13***87",
                    "account": 5000
                }, {
                    "addTime": 1541994729000,
                    "userName": "15***65",
                    "account": 10000
                }, {
                    "addTime": 1541989452000,
                    "userName": "13***72",
                    "account": 10000
                }, {
                    "addTime": 1541926726000,
                    "userName": "15***64",
                    "account": 9000
                }, {
                    "addTime": 1541922311000,
                    "userName": "13***21",
                    "account": 10000
                }, {
                    "addTime": 1541905716000,
                    "userName": "15***56",
                    "account": 1000
                }, {
                    "addTime": 1541853776000,
                    "userName": "13***53",
                    "account": 2000
                }, {
                    "addTime": 1541841953000,
                    "userName": "13***01",
                    "account": 10000
                }, {
                    "addTime": 1541835122000,
                    "userName": "13***07",
                    "account": 10000
                }]
            }
        },
        "projectRiskText": "<h5>资金出借风险提示函</h5>\n<p>出借人应认真阅读《新新贷注册使用协议》、资金出借相关协议（包括但不限于《借款合同》、《债权转让协议》等）、本函内容及本网站（www.xinxindai.com）关于资金出借、资费介绍、标的说明等操作规则，充分了解在本网站上出借资金的法律意义及相关风险，在确认自身具有识别、承担相关风险的能力之后，并根据自身的出借经验、出借目的、出借期限、自身资产状况等谨慎决策，判断所选择的借款标的是否与自身的风险承受能力相匹配，并自行承担全部风险。</p>\n<p><b>新新贷为网络借贷信息中介平台，只提供借贷撮合服务，不为任何借款人提供明示或默示的担保或增信措施，不向任何出借人做明示或默示的保本保息等保证性承诺，出借人应依其独立判断做出决策，借贷风险由出借人自行承担。</b></p>\n<p>出借人的资金在出借过程中可能面临各种风险，包括但不限于政策风险、信用风险、流动性风险、战争或自然灾害等不可抗力导致的风险、操作风险、第三方风险及其他风险。</p>\n<p>主要风险说明如下：</p>\n<h6>一、政策风险</h6>\n<p>国家宏观政策、财政政策、货币政策、行业政策、地区发展政策的变动可能会对出借人产生不利影响，对此新新贷（上海）金融信息服务有限公司不承担责任。</p>\n<h6>二、借款人信用风险</h6>\n<p>当借款人因突发事件或其他不可预见的事件，导致短期或者长期丧失还款能力 (包括但不限于借款人收入情况、财产状况发生变化、人身出现意外、发生疾病、死亡等情况)，或者借款人的还款意愿发生变化时，出借人的资金存在无法按时回收之风险。</p>\n<h6>三、资金流动性风险</h6>\n<p>出借人按照约定将资金出借给借款人使用，在借款人不主动提前还款的情况下，借款人将按照约定的期限分期偿还出借人的本金和利息，出借人的出借资金将分期回收，因此资金回收需要一定的周期；</p>\n<p><b>若出借人需要于当期债权未到期时提前回收（至少持满一定期限后方可提前回收，以具体产品标注的锁定期限为准）出借资金的，应当以债权转让方式向第三人转让剩余债权。</b>本网站将在出借人提出需要以及其他对出借人有利的时机，帮助出借人寻找、向其他出借人推荐愿意受让出借人债权资产的第三方。</p>\n<p><b>出借人应当知晓在匹配债权受让人时，存在无法按其需求的时间或期限匹配到债权受让人的资金流动性风险。一旦发生风险，在完成本次债权转让匹配前，出借人仍将按照约定持有该债权，直至债权期满或债权转让成功。</b></p>\n<h6>四、不可抗力的风险</h6>\n<p>由于战争、动乱、罢工、自然灾害等不可抗力因素的出现，可能导致出借人的出借资金受到损失，对此新新贷（上海）金融信息服务有限公司不承担责任。</p>\n<h6>五、操作风险</h6>\n<p><b>因出借人自身的过错导致的任何损失，该过错包括但不限于操作不当、遗忘或泄露出借人用户名及/或密码、密码被他人破解、出借人使用的计算机系统被第三方侵入、其他不当操作而造成的损失，对此新新贷（上海）金融信息服务有限公司不承担责任。</b></p>\n<h6>六、第三方风险</h6>\n<p><b>因本网站及相关第三方（包括但不限于资金存管机构、电子签名服务机构）的设备、系统故障或缺陷、病毒、黑客攻击、电力中断、设备场所遭遇不可抗力、本网站或相关第三方终止营业、破产倒闭等事件导致的风险，对此新新贷（上海）金融信息服务有限公司不承担责任。</b></p>\n<h6>七、其他风险</h6>\n<p>本风险提示函的揭示事项仅为列举性质，未能详尽列明出借人所面临的全部风险和可能导致出借人资产损失的所有因素。</p>\n<p>出借人在出借资金前，应认真阅读并理解相关业务规则、标的说明书、网站服务协议、电子借款合同及本风险提示函等文件的全部内容，并确信自身已做好足够的风险评估与财务安排，避免因出借资金而遭受难以承受的损失。</p>\n<p>注：本函中 “出借人”是指在本网站注册，并以其自有合法资金通过本网站提供的信息服务获取收益的用户，包括网站各类借款标的投标人、债权受让人等。</p>\n<span>最后更新日期：2018年1月31日</span>\n<h5>出借人承诺</h5>\n<p>新新贷（上海）金融信息服务有限公司：</p>\n<p>本人已在贵司运营的新新贷平台（www.xinxindai.com）注册并有意实际出借自有资金。现本人基于出借行为作出承诺如下：</p>\n<p>一、本人系完全民事行为能力人。</p>\n<p>二、本人承诺本人资金来源合法。</p>\n<p>三、本人承诺所提供的信息和材料全部真实、准确，若有任何不实之处，本人自愿承担所有不利后果。</p>\n<p>四、本人已认真阅读《新新贷注册使用协议》、资金出借相关协议（包括但不限于《借款协议》、《债权转让协议》及新新贷网站关于资金出借、资费介绍、标的说明等操作规则），充分了解在贵网站上出借资金的法律意义及相关风险，并根据自身的出借经验、出借目的、出借期限、自身资产状况及自身的风险承受能力等判断选择借款标的，<b>本人依照自己独立判断做出决策，一切风险由本人自行承担。</b></p>\n<p><b>五、本人知晓并自愿承担出借人的资金在出借过程中可能面临各种风险，包括但不限于政策风险、借款人信用风险、资金流动性风险、不可抗力风险、操作风险、第三方风险及其他风险而导致的出借资金损失。</b></p>\n<p><b>六、本人知晓任何出借行为均存在风险，风险涵盖出借本金及利息等全部款项，本人作为出借人将自愿承担相应风险所导致的一切损失。</b></p>\n<p>七、本承诺书自本人<b>勾选确认之日</b>起单独成立并生效。本人通过新新贷平台签订《借款协议》、《服务协议》等一切文书是否生效、是否存在无效或效力瑕疵的情况，均不影响本承诺书的效力。 </p>\n<p><b>特此承诺！</b></p>\n<span>最后更新日期：2018年1月31日</span>",
        "token": "rZAUSEW7s3E7OTtQCsd_cYQxMV8EpGOJ5QRm2nUr0T3STzAxGsXIrVYP_K_IdJ1p7j83uhUCZXnlzgzWyzUdG5KLm95p9kd7WFChi2ZSSDU"
    }
}

export default { GetData }