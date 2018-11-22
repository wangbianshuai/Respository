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
        "news": {
            "code": 200000,
            "data": {
                "items": [
                    {
                        "textHref": "//www.xinxindai.com/news/newsDetail.html?id=2251&newstype=news-2-1.html",
                        "text": "[最新动态]信贷中国万里行·厦门站：调研制造业，深挖新三板，探索信贷服务新思路"
                    },
                    {
                        "textHref": "//www.xinxindai.com/news/newsDetail.html?id=2248&newstype=news-2-1.html",
                        "text": "[最新动态]为进博会助力，新新贷团委组队参加2018上海青年风尚节定向赛"
                    },
                    {
                        "textHref": "//www.xinxindai.com/news/newsDetail.html?id=2246&newstype=news-2-1.html",
                        "text": "[最新动态]新新贷银行存管系统成功升级2.0，合规再迈一大步！"
                    },
                    {
                        "textHref": "//www.xinxindai.com/news/newsDetail.html?id=2247&newstype=news-2-1.html",
                        "text": "[最新动态]新新贷CEO张扬率队赴扬州调研一线市场需求"
                    },
                    {
                        "textHref": "//www.xinxindai.com/news/newsDetail.html?id=2245&newstype=news-2-1.html",
                        "text": "[最新动态]新新贷参加中国互金协会网贷机构自查自纠工作座谈会"
                    },
                    {
                        "textHref": "//www.xinxindai.com/news/newsDetail.html?id=2232&newstype=news-2-1.html",
                        "text": "[最新动态]新新贷联合创始人陈志飞出席虹口区“两新”组织庆改革开放40周年企业家论坛"
                    },
                    {
                        "textHref": "//www.xinxindai.com/news/newsDetail.html?id=2213&newstype=news-2-1.html",
                        "text": "[最新动态]新新贷CIO张君祥受邀出席2018中国国际云计算CIO技术峰会"
                    },
                    {
                        "textHref": "//www.xinxindai.com/news/newsDetail.html?id=2212&newstype=news-2-1.html",
                        "text": "[最新动态]新新贷出席2018朗迪中国峰会论道“智能时代”"
                    }
                ]
            }
        },
        "XYB": {
            "code": 200000,
            "data": {
                "isMemberDay": "true",
                "accumulatedInvestors": "25.91万人",
                "name": "新元宝",
                "items": [
                    {
                        "floatingRate": 0,
                        "frozenPeriod": 1,
                        "plannedAnnualRateTo": "6",
                        "periodName": "20181109007期",
                        "remark": "",
                        "leastPeriod": "1",
                        "leastPeriodUnit": "个月",
                        "plannedAnnualRateFrom": "6",
                        "leftAmount": "1755300",
                        "id": "OS20181109064",
                        "leastTenderAmountLabel": "100元",
                        "mostTenderAmountLabel": "200.00万元",
                        "status": {
                            "code": "SELLING",
                            "message": "立即加入"
                        }
                    },
                    {
                        "floatingRate": 1,
                        "frozenPeriod": 3,
                        "plannedAnnualRateTo": "7",
                        "periodName": "20181109008期",
                        "remark": "双11狂欢",
                        "leastPeriod": "3",
                        "leastPeriodUnit": "个月",
                        "plannedAnnualRateFrom": "7",
                        "leftAmount": "380900",
                        "id": "OS20181109065",
                        "leastTenderAmountLabel": "100元",
                        "mostTenderAmountLabel": "200.00万元",
                        "status": {
                            "code": "SELLING",
                            "message": "立即加入"
                        }
                    },
                    {
                        "floatingRate": 1,
                        "frozenPeriod": 6,
                        "plannedAnnualRateTo": "8",
                        "periodName": "20181109009期",
                        "remark": "双11狂欢",
                        "leastPeriod": "6",
                        "leastPeriodUnit": "个月",
                        "plannedAnnualRateFrom": "8",
                        "leftAmount": "1515700",
                        "id": "OS20181109066",
                        "leastTenderAmountLabel": "100元",
                        "mostTenderAmountLabel": "200.00万元",
                        "status": {
                            "code": "SELLING",
                            "message": "立即加入"
                        }
                    },
                    {
                        "floatingRate": 0.5,
                        "frozenPeriod": 12,
                        "plannedAnnualRateTo": "10",
                        "periodName": "20181111001期",
                        "remark": "双11狂欢",
                        "leastPeriod": "12",
                        "leastPeriodUnit": "个月",
                        "plannedAnnualRateFrom": "10",
                        "leftAmount": "2515000",
                        "id": "OS20181111069",
                        "leastTenderAmountLabel": "100元",
                        "mostTenderAmountLabel": "500.00万元",
                        "status": {
                            "code": "SELLING",
                            "message": "立即加入"
                        }
                    }
                ]
            }
        },
        "thirtyTender": {
            "code": 200000,
            "data": {
                "floatingRate": 8,
                "floatingRateFormat": "8",
                "limitPurchaseCount": "1",
                "plannedAnnualRate": "6",
                "remark": "",
                "leastPeriod": "1",
                "leastPeriodUnit": "个月",
                "accumulatedInvestors": "6.26万人",
                "name": "新元宝（新手专享）",
                "id": "RI20180105231",
                "leastTenderAmountLabel": "100元",
                "mostTenderAmountLabel": "10000元",
                "status": {
                    "code": "SELLING",
                    "message": "立即加入"
                }
            }
        },
        "ad": {
            "code": 200000,
            "data": {
                "items": [
                    {
                        "extendUrl": "//www.xinxindai.com/static/admin/image/data/ppt/83c2fe7cc57c4357ab14906d46330a66.jpg",
                        "extendUrlFront": "//www.xinxindai.com/static/admin/image/data/ppt/83c2fe7cc57c4357ab14906d46330a66.jpg",
                        "textHref": "//www.xinxindai.com/html/doubleEle/index.html",
                        "backgroundColor": "",
                        "extendUrlBack": "//www.xinxindai.com/static/admin/image/data/ppt/83c2fe7cc57c4357ab14906d46330a66.jpg",
                        "id": "1505",
                        "text": "双11狂欢  "
                    },
                    {
                        "extendUrl": "//www.xinxindai.com/static/admin/image/data/ppt/fa9ef58d4e9543a4a733c4ab6a96b2d0.jpg",
                        "extendUrlFront": "//www.xinxindai.com/static/admin/image/data/ppt/fa9ef58d4e9543a4a733c4ab6a96b2d0.jpg",
                        "textHref": "//www.wdzj.com/video/dhwdr70/",
                        "backgroundColor": "",
                        "extendUrlBack": "//www.xinxindai.com/static/admin/image/data/ppt/fa9ef58d4e9543a4a733c4ab6a96b2d0.jpg",
                        "id": "1493",
                        "text": "《对话网贷人》走进新新贷"
                    },
                    {
                        "extendUrl": "//www.xinxindai.com/static/admin/image/data/ppt/29e32341882a45669cf35622ff85ad08.jpg",
                        "extendUrlFront": "//www.xinxindai.com/static/admin/image/data/ppt/29e32341882a45669cf35622ff85ad08.jpg",
                        "textHref": "//www.xinxindai.com/dist/videoTopic/index.html",
                        "backgroundColor": "",
                        "extendUrlBack": "//www.xinxindai.com/static/admin/image/data/ppt/29e32341882a45669cf35622ff85ad08.jpg",
                        "id": "1497",
                        "text": "立于信·见于真系列直播专题"
                    },
                    {
                        "extendUrl": "//www.xinxindai.com/static/admin/image/data/ppt/dcdcfea3568e4930913145ba01da5ce3.jpg",
                        "extendUrlFront": "//www.xinxindai.com/static/admin/image/data/ppt/dcdcfea3568e4930913145ba01da5ce3.jpg",
                        "textHref": "//mp.weixin.qq.com/s/ZpB3BD5p5cyfi_nGT9Ws3w",
                        "backgroundColor": "",
                        "extendUrlBack": "//www.xinxindai.com/static/admin/image/data/ppt/dcdcfea3568e4930913145ba01da5ce3.jpg",
                        "id": "1516",
                        "text": "信贷中国万里行"
                    },
                    {
                        "extendUrl": "//www.xinxindai.com/static/admin/image/data/ppt/199f4ccf2b58445092422c6d1ed4e78b.jpg",
                        "extendUrlFront": "//www.xinxindai.com/static/admin/image/data/ppt/199f4ccf2b58445092422c6d1ed4e78b.jpg",
                        "textHref": "//www.xinxindai.com/html/safety-creditInfo/index.html",
                        "backgroundColor": "",
                        "extendUrlBack": "//www.xinxindai.com/static/admin/image/data/ppt/199f4ccf2b58445092422c6d1ed4e78b.jpg",
                        "id": "1126",
                        "text": "新新贷合规进程"
                    }
                ]
            }
        },
        "ZQZR": {
            "code": 200000,
            "data": {
                "name": "债权转让",
                "items": [
                    {
                        "leastPeriodUnit": "个月",
                        "name": "生意周转",
                        "plannedAnnualRate": "12.5",
                        "id": "TR2018050983292",
                        "label": "ic-xsd",
                        "transferPriceFormat": "93.02",
                        "riskGrade": "A1",
                        "leastPeriod": "33",
                        "status": {
                            "code": "ZQZR_SOLD_OUT",
                            "message": "已转让"
                        },
                        "transferPrice": "93.02"
                    },
                    {
                        "leastPeriodUnit": "个月",
                        "name": "我要借款",
                        "plannedAnnualRate": "11",
                        "id": "TR2017101261078",
                        "label": "ic-xsd",
                        "transferPriceFormat": "101,920.00",
                        "riskGrade": "A1",
                        "leastPeriod": "12",
                        "status": {
                            "code": "ZQZR_SOLD_OUT",
                            "message": "已转让"
                        },
                        "transferPrice": "101920"
                    },
                    {
                        "leastPeriodUnit": "个月",
                        "name": "资金周转",
                        "plannedAnnualRate": "11",
                        "id": "TR2017091872272",
                        "label": "ic-xsd",
                        "transferPriceFormat": "164,580.00",
                        "riskGrade": "A1",
                        "leastPeriod": "12",
                        "status": {
                            "code": "ZQZR_SOLD_OUT",
                            "message": "已转让"
                        },
                        "transferPrice": "164580"
                    },
                    {
                        "leastPeriodUnit": "个月",
                        "name": "资金周转 扩大经营",
                        "plannedAnnualRate": "12",
                        "id": "TR2016123037196",
                        "label": "ic-xsd",
                        "transferPriceFormat": "45,455.22",
                        "riskGrade": "A1",
                        "leastPeriod": "12",
                        "status": {
                            "code": "ZQZR_SOLD_OUT",
                            "message": "已转让"
                        },
                        "transferPrice": "45455.22"
                    },
                    {
                        "leastPeriodUnit": "个月",
                        "name": "本人用陕西房产进行抵押，用于短期公司经营周转",
                        "plannedAnnualRate": "12",
                        "id": "TR2016120901770",
                        "label": "ic-xfd",
                        "transferPriceFormat": "1,438.08",
                        "riskGrade": "A1",
                        "leastPeriod": "2",
                        "status": {
                            "code": "ZQZR_SOLD_OUT",
                            "message": "已转让"
                        },
                        "transferPrice": "1438.08"
                    }
                ]
            }
        },
        "achievement": {
            "code": 200000,
            "data": {
                "securityItem": {
                    "nvalue": "47208861.79",
                    "amount": "6年264天15小时",
                    "unit": "",
                    "code": "SECURITY_TIME",
                    "name": "稳健运营时间",
                    "inforName": "质保服务专款余额（元）"
                },
                "totalIncomeItem": {
                    "nvalue": "854234760.81",
                    "amount": "8.54",
                    "unit": "亿元",
                    "code": "TOTAL_INCOME",
                    "name": "累计为出借人赚取",
                    "inforName": "累计为出借人赚取"
                },
                "totalRegister": "1,862,830",
                "totalTradeItem": {
                    "nvalue": "13965965701.10",
                    "amount": "139.66",
                    "unit": "亿元",
                    "code": "TOTAL_TRADE",
                    "name": "累计交易总额",
                    "inforName": "累计交易总额"
                }
            }
        },
        "nickName": null,
        "more": {
            "code": 200000,
            "data": {
                "items": [
                    {
                        "extendUrl": "//www.xinxindai.com/static/images/public/v5index20140613_r8_c3.png",
                        "textHref": "//www.xinxindai.com/html/help/contactus.html",
                        "text": "全国服务"
                    },
                    {
                        "extendUrl": "//www.xinxindai.com/static/images/public/v5index20140613_r8_c7.png",
                        "textHref": "//www.xinxindai.com/security/business_security.html",
                        "text": "100%隐私保护"
                    },
                    {
                        "extendUrl": "//www.xinxindai.com/static/images/public/v5index20140613_r8_c13.png",
                        "textHref": "//www.xinxindai.com/news/newsDetail.html?id=864",
                        "text": "中国小额信贷联盟P2P行业委员会"
                    },
                    {
                        "extendUrl": "//www.xinxindai.com/static/images/public/v5index20140613_r8_c18.png",
                        "textHref": "//www.xinxindai.com/news/newsDetail.html?id=816",
                        "text": "上海网络信贷服务业企业联盟成员"
                    },
                    {
                        "extendUrl": "//www.xinxindai.com/static/images/public/v5index20140613_r8_c23.png",
                        "textHref": "//www.xinxindai.com/news/newsDetail.html?id=746",
                        "text": "上海市信息服务业行业协会理事单位"
                    },
                    {
                        "extendUrl": "//www.xinxindai.com/static/images/public/v5index20140613_r8_c28.png",
                        "textHref": "//www.shsxsh.com/Mien.asp?ClsID=1141&NewsKey=678",
                        "text": "上海陕西商会副会长单位"
                    },
                    {
                        "extendUrl": "//www.xinxindai.com/static/images/public/v5index20140613_r8_c29.png",
                        "textHref": "//www.sfia.org.cn/",
                        "text": "上海金融信息行业协会"
                    }
                ]
            }
        },
        "link": {
            "code": 200000,
            "data": {
                "items": [
                    {
                        "textHref": "//www.sfia.org.cn/",
                        "text": "上海金融信息行业协会"
                    },
                    {
                        "textHref": "//www.nifa.org.cn/nifa/index.html",
                        "text": "中国互联网金融协会"
                    },
                    {
                        "textHref": "//www.wdzj.com/",
                        "text": "网贷之家"
                    },
                    {
                        "textHref": "//www.wjchina.org/",
                        "text": "网金中国"
                    },
                    {
                        "textHref": "//www.xinxindai.com",
                        "text": "网贷平台"
                    },
                    {
                        "textHref": "//bbs.xinxindai.com/",
                        "text": "P2P网贷论坛"
                    },
                    {
                        "textHref": "//finance.ifeng.com/itfinance/",
                        "text": "凤凰互联网金融"
                    },
                    {
                        "textHref": "//www.zixinke.com",
                        "text": "资信客"
                    },
                    {
                        "textHref": "//www.shengcai18.com/",
                        "text": "生菜网"
                    },
                    {
                        "textHref": "//iof.hexun.com",
                        "text": "和讯互联网金融"
                    },
                    {
                        "textHref": "//www.icaifu.com/",
                        "text": "研报下载"
                    },
                    {
                        "textHref": "//shanghai.roadoor.com/",
                        "text": "上海贷款"
                    },
                    {
                        "textHref": "//www.dimeng.net",
                        "text": "网贷系统"
                    },
                    {
                        "textHref": "//h.shlxhd.gov.cn/xinxindai.lx",
                        "text": "新新贷党支部"
                    }
                ]
            }
        },
        "currentDate": "2018-11-11T15:30:54.406+08:00",
        "investmentRank": {
            "code": 200000,
            "data": {
                "currentMonth": "11",
                "items": [
                    {
                        "investmentAmount": 3553000,
                        "nickName": "15***67"
                    },
                    {
                        "investmentAmount": 3200000,
                        "nickName": "s*h"
                    },
                    {
                        "investmentAmount": 3000000,
                        "nickName": "yu****min"
                    },
                    {
                        "investmentAmount": 2906900,
                        "nickName": "li****mei"
                    },
                    {
                        "investmentAmount": 2000000,
                        "nickName": "zh***an"
                    }
                ]
            }
        },
        "media": {
            "code": 200000,
            "data": {
                "items": [
                    {
                        "textHref": "//www.xinxindai.com/news/newsDetail.html?id=2249&newstype=news-2-1.html",
                        "text": "[媒体报道]互联网金融新闻中心：《对话网贷人》张扬吐露心声 新新贷立志打造中国版IPC"
                    },
                    {
                        "textHref": "//www.xinxindai.com/news/newsDetail.html?id=2242&newstype=news-2-1.html",
                        "text": "[媒体报道]互金观察站：走近新新贷张扬——时光不语，静待春来……"
                    },
                    {
                        "textHref": "//www.xinxindai.com/news/newsDetail.html?id=2207&newstype=news-2-1.html",
                        "text": "[媒体报道]互金通讯社：曾为20元做兼职，苗圃“园丁”如何实现年流水千万？|看得见的普惠"
                    },
                    {
                        "textHref": "//www.xinxindai.com/news/newsDetail.html?id=2167&newstype=news-2-1.html",
                        "text": "[媒体报道]凤凰财经：跨界组合！新新贷登陆上海电台动感101"
                    },
                    {
                        "textHref": "//www.xinxindai.com/news/newsDetail.html?id=2131&newstype=news-2-1.html",
                        "text": "[媒体报道]凤凰网：看得见的融资，新新贷重磅推出资产端故事《信贷中国》"
                    },
                    {
                        "textHref": "//www.xinxindai.com/news/newsDetail.html?id=2102&newstype=news-2-1.html",
                        "text": "[媒体报道]互金观察站：新新贷六年坚守 开启科技金融新时代"
                    },
                    {
                        "textHref": "//www.xinxindai.com/news/newsDetail.html?id=2043&newstype=news-2-1.html",
                        "text": "[媒体报道]互金通讯社：践行普惠使命 新新贷用金融科技开启第2个“5年计划”"
                    },
                    {
                        "textHref": "//www.xinxindai.com/news/newsDetail.html?id=2021&newstype=news-2-1.html",
                        "text": "[媒体报道]新新贷：赋能小微 打造中国版的IPC信贷服务平台"
                    }
                ]
            }
        },
        "isPurchased": false,
        "token": null,
        "SBZT": {
            "code": 200000,
            "data": {
                "name": "散标直投",
                "items": [
                    {
                        "leastPeriodUnit": "个月",
                        "name": "资金周转",
                        "bidAmount": 182548.8,
                        "plannedAnnualRate": "7",
                        "leftAmount": 0,
                        "id": "BW201811094579",
                        "label": "ic-xcd",
                        "leftAmountFormat": "0.00",
                        "percent": "100",
                        "riskGrade": "A1",
                        "leastPeriod": "1",
                        "status": {
                            "code": "SBZT_SOLD_OUT",
                            "message": "已满标"
                        }
                    },
                    {
                        "leastPeriodUnit": "个月",
                        "name": "资金周转",
                        "bidAmount": 70991.2,
                        "plannedAnnualRate": "7",
                        "leftAmount": 0,
                        "id": "BW201811094561",
                        "label": "ic-xcd",
                        "leftAmountFormat": "0.00",
                        "percent": "100",
                        "riskGrade": "A2",
                        "leastPeriod": "1",
                        "status": {
                            "code": "SBZT_SOLD_OUT",
                            "message": "已满标"
                        }
                    },
                    {
                        "leastPeriodUnit": "个月",
                        "name": "扩大经营，短期周转",
                        "bidAmount": 25707.5,
                        "plannedAnnualRate": "7",
                        "leftAmount": 0,
                        "id": "BW201811094536",
                        "label": "ic-xsd",
                        "leftAmountFormat": "0.00",
                        "percent": "100",
                        "riskGrade": "A1",
                        "leastPeriod": "1",
                        "status": {
                            "code": "SBZT_SOLD_OUT",
                            "message": "已满标"
                        }
                    },
                    {
                        "leastPeriodUnit": "个月",
                        "name": "生意周转",
                        "bidAmount": 214800,
                        "plannedAnnualRate": "9",
                        "leftAmount": 0,
                        "id": "BW201811094531",
                        "label": "ic-xsd",
                        "leftAmountFormat": "0.00",
                        "percent": "100",
                        "riskGrade": "A1",
                        "leastPeriod": "3",
                        "status": {
                            "code": "SBZT_SOLD_OUT",
                            "message": "已满标"
                        }
                    },
                    {
                        "leastPeriodUnit": "个月",
                        "name": "资金周转",
                        "bidAmount": 35990.5,
                        "plannedAnnualRate": "7",
                        "leftAmount": 0,
                        "id": "BW201811094530",
                        "label": "ic-xsd",
                        "leftAmountFormat": "0.00",
                        "percent": "100",
                        "riskGrade": "A2",
                        "leastPeriod": "1",
                        "status": {
                            "code": "SBZT_SOLD_OUT",
                            "message": "已满标"
                        }
                    }
                ]
            }
        },
        "isLogin": false,
        "YYP": {
            "code": 200000,
            "data": {
                "floatingRate": "",
                "frozenPeriod": "12个月",
                "plannedAnnualRateFrom": "9.50",
                "plannedAnnualRateTo": "9.50",
                "accumulatedInvestors": "4970人",
                "name": "月月派",
                "remark": "",
                "leastTenderAmountLabel": "100元",
                "leastPeriod": "3",
                "mostTenderAmountLabel": "50.00万元"
            }
        },
        "partner": {
            "code": 200000,
            "data": {
                "items": [
                    {
                        "extendUrl": "//www.xinxindai.com/static/admin/image/data/link/ddda8a910ef44e03a005d9bfe7eea0f7.jpg",
                        "textHref": "//www.nifa.org.cn/nifa/index.html",
                        "text": "中国互联网金融协会"
                    },
                    {
                        "extendUrl": "//www.xinxindai.com/static/admin//image/data/footer/v5index20140613_r1_c3.jpg",
                        "textHref": "//www.dachengnet.com/",
                        "text": "大成律师事务所"
                    },
                    {
                        "extendUrl": "//www.xinxindai.com/static/admin//image/data/footer/v5index20140613_r1_c4.jpg",
                        "textHref": "//www.fuiou.com/",
                        "text": "上海富友支付服务有限公司"
                    },
                    {
                        "extendUrl": "//www.xinxindai.com/static/admin/image/data/link/2e3396b8d90449c2a2f3202244cb5e75.jpg",
                        "textHref": "//www.pycredit.cn/",
                        "text": "鹏元征信有限公司"
                    },
                    {
                        "extendUrl": "//www.xinxindai.com/static/admin//image/data/footer/v5index20140613_r1_c6.jpg",
                        "textHref": "//www.shanghai-cis.com.cn/index2.aspx",
                        "text": "上海资信有限公司"
                    },
                    {
                        "extendUrl": "//www.xinxindai.com/static/admin/image/data/link/7c6f83d709ad4e1fb7f60465fb9263bd.png",
                        "textHref": "//qhzx.pingan.com/",
                        "text": "前海征信"
                    },
                    {
                        "extendUrl": "//www.xinxindai.com/static/admin/image/data/link/88d7f95df1e94e819448ecf211d1516f.jpg",
                        "textHref": "//www.fadada.com/ ",
                        "text": "法大大"
                    },
                    {
                        "extendUrl": "//www.xinxindai.com/static/admin/image/data/link/5aa119d4e42240febe9bd8f8b814ea9a.jpg",
                        "textHref": "//www.99bill.com/",
                        "text": "快钱支付清算信息有限公司"
                    }
                ]
            }
        },
        "time": 1541921454406,
        "YJDJ": {
            "code": 200000,
            "data": {
                "floatingRate": "0.00",
                "lefTime": 0,
                "periodName": "1",
                "plannedAnnualRate": 12,
                "remark": "",
                "activitedEndDate": 1541951940000,
                "leastPeriod": "31",
                "leastPeriodUnit": "天",
                "activitedStartDate": 1541937600000,
                "activitedStartDateFormat": "20:00",
                "name": "月进斗金",
                "activitedEndDateFormat": "23:59",
                "leftAmount": 200000,
                "id": "RI20181108281",
                "plannedAmount": 200000,
                "leastTenderAmountLabel": "100元",
                "mostTenderAmountLabel": "8000元",
                "status": {
                    "code": "WAIT_TO_SELL",
                    "message": "等待发售"
                }
            }
        },
        "announcement": {
            "code": 200000,
            "data": {
                "items": [
                    {
                        "textHref": "//www.xinxindai.com/news/newsDetail.html?id=2243&newstype=news-1-1.html",
                        "text": "【活动预告】双11狂欢 欢乐赢iPhone XS 再享加息1%"
                    },
                    {
                        "textHref": "//www.xinxindai.com/news/newsDetail.html?id=2240&newstype=news-1-1.html",
                        "text": "关于10月21日客服值班调整公告 "
                    },
                    {
                        "textHref": "//www.xinxindai.com/news/newsDetail.html?id=2236&newstype=news-1-1.html",
                        "text": "【活动预告】庆银行存管2.0隆重上线 最高加息1%"
                    },
                    {
                        "textHref": "//www.xinxindai.com/news/newsDetail.html?id=2233&newstype=news-1-1.html",
                        "text": "关于存管2.0上线停服维护公告"
                    },
                    {
                        "textHref": "//www.xinxindai.com/news/newsDetail.html?id=2230&newstype=news-1-1.html",
                        "text": "2018年国庆作息公告"
                    }
                ]
            }
        }
    };
}

export default { GetData }