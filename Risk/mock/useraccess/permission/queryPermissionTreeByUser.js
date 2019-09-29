export default {
    'POST /RiskControlApproval/useraccess/permission/queryPermissionTreeByUser': GetResponse(),
}

function GetResponse() {
    return {
        "code": 0,
        "message": null,
        "data": {
            "permissionId": "0",
            "name": null,
            "aliasName": "权限树根",
            "parentId": "root",
            "orderNum": null,
            "ownState": "01",
            "chlidPermission": [
                {
                    "permissionId": "3",
                    "name": null,
                    "aliasName": "审核管理",
                    "parentId": "0",
                    "orderNum": null,
                    "ownState": "01",
                    "chlidPermission": [
                        {
                            "permissionId": "43",
                            "name": null,
                            "aliasName": "反欺诈审核",
                            "parentId": "3",
                            "orderNum": null,
                            "ownState": "01",
                            "chlidPermission": [
                                {
                                    "permissionId": "47",
                                    "name": null,
                                    "aliasName": "查看",
                                    "parentId": "43",
                                    "orderNum": null,
                                    "ownState": "01",
                                    "chlidPermission": null
                                }
                            ]
                        },
                        {
                            "permissionId": "45",
                            "name": null,
                            "aliasName": "实地",
                            "parentId": "3",
                            "orderNum": null,
                            "ownState": "01",
                            "chlidPermission": [
                                {
                                    "permissionId": "56",
                                    "name": null,
                                    "aliasName": "实地审核",
                                    "parentId": "45",
                                    "orderNum": null,
                                    "ownState": "01",
                                    "chlidPermission": [
                                        {
                                            "permissionId": "58",
                                            "name": null,
                                            "aliasName": "提交",
                                            "parentId": "56",
                                            "orderNum": null,
                                            "ownState": "01",
                                            "chlidPermission": null
                                        },
                                        {
                                            "permissionId": "57",
                                            "name": null,
                                            "aliasName": "查看",
                                            "parentId": "56",
                                            "orderNum": null,
                                            "ownState": "01",
                                            "chlidPermission": null
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            "permissionId": "46",
                            "name": null,
                            "aliasName": "终审",
                            "parentId": "3",
                            "orderNum": null,
                            "ownState": "01",
                            "chlidPermission": [
                                {
                                    "permissionId": "61",
                                    "name": null,
                                    "aliasName": "贷审会",
                                    "parentId": "46",
                                    "orderNum": null,
                                    "ownState": "01",
                                    "chlidPermission": [
                                        {
                                            "permissionId": "69",
                                            "name": null,
                                            "aliasName": "提交",
                                            "parentId": "61",
                                            "orderNum": null,
                                            "ownState": "01",
                                            "chlidPermission": null
                                        },
                                        {
                                            "permissionId": "68",
                                            "name": null,
                                            "aliasName": "查看",
                                            "parentId": "61",
                                            "orderNum": null,
                                            "ownState": "01",
                                            "chlidPermission": null
                                        }
                                    ]
                                },
                                {
                                    "permissionId": "59",
                                    "name": null,
                                    "aliasName": "终审审核",
                                    "parentId": "46",
                                    "orderNum": null,
                                    "ownState": "01",
                                    "chlidPermission": [
                                        {
                                            "permissionId": "63",
                                            "name": null,
                                            "aliasName": "查看",
                                            "parentId": "59",
                                            "orderNum": null,
                                            "ownState": "01",
                                            "chlidPermission": null
                                        },
                                        {
                                            "permissionId": "65",
                                            "name": null,
                                            "aliasName": "提交",
                                            "parentId": "59",
                                            "orderNum": null,
                                            "ownState": "01",
                                            "chlidPermission": null
                                        },
                                        {
                                            "permissionId": "64",
                                            "name": null,
                                            "aliasName": "保存",
                                            "parentId": "59",
                                            "orderNum": null,
                                            "ownState": "01",
                                            "chlidPermission": null
                                        }
                                    ]
                                },
                                {
                                    "permissionId": "62",
                                    "name": null,
                                    "aliasName": "等待签约条件审核",
                                    "parentId": "46",
                                    "orderNum": null,
                                    "ownState": "01",
                                    "chlidPermission": [
                                        {
                                            "permissionId": "71",
                                            "name": null,
                                            "aliasName": "提交",
                                            "parentId": "62",
                                            "orderNum": null,
                                            "ownState": "01",
                                            "chlidPermission": null
                                        },
                                        {
                                            "permissionId": "70",
                                            "name": null,
                                            "aliasName": "查看",
                                            "parentId": "62",
                                            "orderNum": null,
                                            "ownState": "01",
                                            "chlidPermission": null
                                        }
                                    ]
                                },
                                {
                                    "permissionId": "60",
                                    "name": null,
                                    "aliasName": "终审复核",
                                    "parentId": "46",
                                    "orderNum": null,
                                    "ownState": "01",
                                    "chlidPermission": [
                                        {
                                            "permissionId": "67",
                                            "name": null,
                                            "aliasName": "提交",
                                            "parentId": "60",
                                            "orderNum": null,
                                            "ownState": "01",
                                            "chlidPermission": null
                                        },
                                        {
                                            "permissionId": "66",
                                            "name": null,
                                            "aliasName": "查看",
                                            "parentId": "60",
                                            "orderNum": null,
                                            "ownState": "01",
                                            "chlidPermission": null
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            "permissionId": "44",
                            "name": null,
                            "aliasName": "初审",
                            "parentId": "3",
                            "orderNum": null,
                            "ownState": "01",
                            "chlidPermission": [
                                {
                                    "permissionId": "48",
                                    "name": null,
                                    "aliasName": "初审审核",
                                    "parentId": "44",
                                    "orderNum": null,
                                    "ownState": "01",
                                    "chlidPermission": [
                                        {
                                            "permissionId": "50",
                                            "name": null,
                                            "aliasName": "查看",
                                            "parentId": "48",
                                            "orderNum": null,
                                            "ownState": "01",
                                            "chlidPermission": null
                                        },
                                        {
                                            "permissionId": "52",
                                            "name": null,
                                            "aliasName": "提交",
                                            "parentId": "48",
                                            "orderNum": null,
                                            "ownState": "01",
                                            "chlidPermission": null
                                        },
                                        {
                                            "permissionId": "51",
                                            "name": null,
                                            "aliasName": "保存",
                                            "parentId": "48",
                                            "orderNum": null,
                                            "ownState": "01",
                                            "chlidPermission": null
                                        }
                                    ]
                                },
                                {
                                    "permissionId": "49",
                                    "name": null,
                                    "aliasName": "初审电核",
                                    "parentId": "44",
                                    "orderNum": null,
                                    "ownState": "01",
                                    "chlidPermission": [
                                        {
                                            "permissionId": "54",
                                            "name": null,
                                            "aliasName": "保存",
                                            "parentId": "49",
                                            "orderNum": null,
                                            "ownState": "01",
                                            "chlidPermission": null
                                        },
                                        {
                                            "permissionId": "55",
                                            "name": null,
                                            "aliasName": "提交",
                                            "parentId": "49",
                                            "orderNum": null,
                                            "ownState": "01",
                                            "chlidPermission": null
                                        },
                                        {
                                            "permissionId": "53",
                                            "name": null,
                                            "aliasName": "查看",
                                            "parentId": "49",
                                            "orderNum": null,
                                            "ownState": "01",
                                            "chlidPermission": null
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                },
                {
                    "permissionId": "5",
                    "name": null,
                    "aliasName": "公共配置",
                    "parentId": "0",
                    "orderNum": null,
                    "ownState": "01",
                    "chlidPermission": [
                        {
                            "permissionId": "83",
                            "name": null,
                            "aliasName": "产品利率配置",
                            "parentId": "5",
                            "orderNum": null,
                            "ownState": "01",
                            "chlidPermission": [
                                {
                                    "permissionId": "90",
                                    "name": null,
                                    "aliasName": "新增",
                                    "parentId": "83",
                                    "orderNum": null,
                                    "ownState": "01",
                                    "chlidPermission": null
                                },
                                {
                                    "permissionId": "91",
                                    "name": null,
                                    "aliasName": "删除",
                                    "parentId": "83",
                                    "orderNum": null,
                                    "ownState": "01",
                                    "chlidPermission": null
                                },
                                {
                                    "permissionId": "89",
                                    "name": null,
                                    "aliasName": "查询",
                                    "parentId": "83",
                                    "orderNum": null,
                                    "ownState": "01",
                                    "chlidPermission": null
                                }
                            ]
                        },
                        {
                            "permissionId": "85",
                            "name": null,
                            "aliasName": "平台费率配置",
                            "parentId": "5",
                            "orderNum": null,
                            "ownState": "01",
                            "chlidPermission": [
                                {
                                    "permissionId": "97",
                                    "name": null,
                                    "aliasName": "删除",
                                    "parentId": "85",
                                    "orderNum": null,
                                    "ownState": "01",
                                    "chlidPermission": null
                                },
                                {
                                    "permissionId": "95",
                                    "name": null,
                                    "aliasName": "查询",
                                    "parentId": "85",
                                    "orderNum": null,
                                    "ownState": "01",
                                    "chlidPermission": null
                                },
                                {
                                    "permissionId": "96",
                                    "name": null,
                                    "aliasName": "新增",
                                    "parentId": "85",
                                    "orderNum": null,
                                    "ownState": "01",
                                    "chlidPermission": null
                                }
                            ]
                        },
                        {
                            "permissionId": "84",
                            "name": null,
                            "aliasName": "还款方式配置",
                            "parentId": "5",
                            "orderNum": null,
                            "ownState": "01",
                            "chlidPermission": [
                                {
                                    "permissionId": "94",
                                    "name": null,
                                    "aliasName": "删除",
                                    "parentId": "84",
                                    "orderNum": null,
                                    "ownState": "01",
                                    "chlidPermission": null
                                },
                                {
                                    "permissionId": "93",
                                    "name": null,
                                    "aliasName": "新增",
                                    "parentId": "84",
                                    "orderNum": null,
                                    "ownState": "01",
                                    "chlidPermission": null
                                },
                                {
                                    "permissionId": "92",
                                    "name": null,
                                    "aliasName": "查询",
                                    "parentId": "84",
                                    "orderNum": null,
                                    "ownState": "01",
                                    "chlidPermission": null
                                }
                            ]
                        },
                        {
                            "permissionId": "82",
                            "name": null,
                            "aliasName": "产品配置",
                            "parentId": "5",
                            "orderNum": null,
                            "ownState": "01",
                            "chlidPermission": [
                                {
                                    "permissionId": "87",
                                    "name": null,
                                    "aliasName": "新增",
                                    "parentId": "82",
                                    "orderNum": null,
                                    "ownState": "01",
                                    "chlidPermission": null
                                },
                                {
                                    "permissionId": "86",
                                    "name": null,
                                    "aliasName": "查询",
                                    "parentId": "82",
                                    "orderNum": null,
                                    "ownState": "01",
                                    "chlidPermission": null
                                },
                                {
                                    "permissionId": "88",
                                    "name": null,
                                    "aliasName": "修改",
                                    "parentId": "82",
                                    "orderNum": null,
                                    "ownState": "01",
                                    "chlidPermission": null
                                }
                            ]
                        }
                    ]
                },
                {
                    "permissionId": "6",
                    "name": null,
                    "aliasName": "权限管理",
                    "parentId": "0",
                    "orderNum": null,
                    "ownState": "01",
                    "chlidPermission": [
                        {
                            "permissionId": "98",
                            "name": null,
                            "aliasName": "用户管理",
                            "parentId": "6",
                            "orderNum": null,
                            "ownState": "01",
                            "chlidPermission": [
                                {
                                    "permissionId": "102",
                                    "name": null,
                                    "aliasName": "开户",
                                    "parentId": "98",
                                    "orderNum": null,
                                    "ownState": "01",
                                    "chlidPermission": null
                                },
                                {
                                    "permissionId": "101",
                                    "name": null,
                                    "aliasName": "查询",
                                    "parentId": "98",
                                    "orderNum": null,
                                    "ownState": "01",
                                    "chlidPermission": null
                                }
                            ]
                        },
                        {
                            "permissionId": "99",
                            "name": null,
                            "aliasName": "角色管理",
                            "parentId": "6",
                            "orderNum": null,
                            "ownState": "01",
                            "chlidPermission": [
                                {
                                    "permissionId": "106",
                                    "name": null,
                                    "aliasName": "修改",
                                    "parentId": "99",
                                    "orderNum": null,
                                    "ownState": "01",
                                    "chlidPermission": null
                                },
                                {
                                    "permissionId": "104",
                                    "name": null,
                                    "aliasName": "配置角色",
                                    "parentId": "99",
                                    "orderNum": null,
                                    "ownState": "01",
                                    "chlidPermission": null
                                },
                                {
                                    "permissionId": "107",
                                    "name": null,
                                    "aliasName": "删除",
                                    "parentId": "99",
                                    "orderNum": null,
                                    "ownState": "01",
                                    "chlidPermission": null
                                },
                                {
                                    "permissionId": "105",
                                    "name": null,
                                    "aliasName": "新增",
                                    "parentId": "99",
                                    "orderNum": null,
                                    "ownState": "01",
                                    "chlidPermission": null
                                },
                                {
                                    "permissionId": "103",
                                    "name": null,
                                    "aliasName": "查询",
                                    "parentId": "99",
                                    "orderNum": null,
                                    "ownState": "01",
                                    "chlidPermission": null
                                }
                            ]
                        },
                        {
                            "permissionId": "100",
                            "name": null,
                            "aliasName": "权限配置",
                            "parentId": "6",
                            "orderNum": null,
                            "ownState": "01",
                            "chlidPermission": [
                                {
                                    "permissionId": "108",
                                    "name": null,
                                    "aliasName": "配置权限",
                                    "parentId": "100",
                                    "orderNum": null,
                                    "ownState": "01",
                                    "chlidPermission": null
                                }
                            ]
                        }
                    ]
                },
                {
                    "permissionId": "1",
                    "name": null,
                    "aliasName": "工单",
                    "parentId": "0",
                    "orderNum": null,
                    "ownState": "01",
                    "chlidPermission": [
                        {
                            "permissionId": "9",
                            "name": null,
                            "aliasName": "工单查询",
                            "parentId": "1",
                            "orderNum": null,
                            "ownState": "01",
                            "chlidPermission": [
                                {
                                    "permissionId": "21",
                                    "name": null,
                                    "aliasName": "作废",
                                    "parentId": "9",
                                    "orderNum": null,
                                    "ownState": "01",
                                    "chlidPermission": null
                                },
                                {
                                    "permissionId": "17",
                                    "name": null,
                                    "aliasName": "查询",
                                    "parentId": "9",
                                    "orderNum": null,
                                    "ownState": "01",
                                    "chlidPermission": null
                                },
                                {
                                    "permissionId": "18",
                                    "name": null,
                                    "aliasName": "查看流转日志",
                                    "parentId": "9",
                                    "orderNum": null,
                                    "ownState": "01",
                                    "chlidPermission": null
                                },
                                {
                                    "permissionId": "20",
                                    "name": null,
                                    "aliasName": "转单",
                                    "parentId": "9",
                                    "orderNum": null,
                                    "ownState": "01",
                                    "chlidPermission": null
                                }
                            ]
                        },
                        {
                            "permissionId": "8",
                            "name": null,
                            "aliasName": "我的工单",
                            "parentId": "1",
                            "orderNum": null,
                            "ownState": "01",
                            "chlidPermission": [
                                {
                                    "permissionId": "14",
                                    "name": null,
                                    "aliasName": "待处理",
                                    "parentId": "8",
                                    "orderNum": null,
                                    "ownState": "01",
                                    "chlidPermission": [
                                        {
                                            "permissionId": "25",
                                            "name": null,
                                            "aliasName": "挂起",
                                            "parentId": "14",
                                            "orderNum": null,
                                            "ownState": "01",
                                            "chlidPermission": null
                                        },
                                        {
                                            "permissionId": "23",
                                            "name": null,
                                            "aliasName": "查询",
                                            "parentId": "14",
                                            "orderNum": null,
                                            "ownState": "01",
                                            "chlidPermission": null
                                        },
                                        {
                                            "permissionId": "24",
                                            "name": null,
                                            "aliasName": "处理",
                                            "parentId": "14",
                                            "orderNum": null,
                                            "ownState": "01",
                                            "chlidPermission": null
                                        }
                                    ]
                                },
                                {
                                    "permissionId": "13",
                                    "name": null,
                                    "aliasName": "待进件",
                                    "parentId": "8",
                                    "orderNum": null,
                                    "ownState": "01",
                                    "chlidPermission": [
                                        {
                                            "permissionId": "22",
                                            "name": null,
                                            "aliasName": "查询",
                                            "parentId": "13",
                                            "orderNum": null,
                                            "ownState": "01",
                                            "chlidPermission": null
                                        }
                                    ]
                                },
                                {
                                    "permissionId": "16",
                                    "name": null,
                                    "aliasName": "已挂起",
                                    "parentId": "8",
                                    "orderNum": null,
                                    "ownState": "01",
                                    "chlidPermission": [
                                        {
                                            "permissionId": "27",
                                            "name": null,
                                            "aliasName": "查询",
                                            "parentId": "16",
                                            "orderNum": null,
                                            "ownState": "01",
                                            "chlidPermission": null
                                        },
                                        {
                                            "permissionId": "28",
                                            "name": null,
                                            "aliasName": "解挂",
                                            "parentId": "16",
                                            "orderNum": null,
                                            "ownState": "01",
                                            "chlidPermission": null
                                        }
                                    ]
                                },
                                {
                                    "permissionId": "15",
                                    "name": null,
                                    "aliasName": "已处理",
                                    "parentId": "8",
                                    "orderNum": null,
                                    "ownState": "01",
                                    "chlidPermission": [
                                        {
                                            "permissionId": "26",
                                            "name": null,
                                            "aliasName": "查询",
                                            "parentId": "15",
                                            "orderNum": null,
                                            "ownState": "01",
                                            "chlidPermission": null
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            "permissionId": "7",
                            "name": null,
                            "aliasName": "工单池",
                            "parentId": "1",
                            "orderNum": null,
                            "ownState": "01",
                            "chlidPermission": [
                                {
                                    "permissionId": "12",
                                    "name": null,
                                    "aliasName": "抢单",
                                    "parentId": "7",
                                    "orderNum": null,
                                    "ownState": "01",
                                    "chlidPermission": null
                                },
                                {
                                    "permissionId": "11",
                                    "name": null,
                                    "aliasName": "派单",
                                    "parentId": "7",
                                    "orderNum": null,
                                    "ownState": "01",
                                    "chlidPermission": null
                                },
                                {
                                    "permissionId": "10",
                                    "name": null,
                                    "aliasName": "查询",
                                    "parentId": "7",
                                    "orderNum": null,
                                    "ownState": "01",
                                    "chlidPermission": null
                                }
                            ]
                        },
                        {
                            "permissionId": "109",
                            "name": null,
                            "aliasName": "标的查询",
                            "parentId": "1",
                            "orderNum": null,
                            "ownState": "01",
                            "chlidPermission": [
                                {
                                    "permissionId": "110",
                                    "name": null,
                                    "aliasName": "查询",
                                    "parentId": "109",
                                    "orderNum": null,
                                    "ownState": "01",
                                    "chlidPermission": null
                                },
                                {
                                    "permissionId": "111",
                                    "name": null,
                                    "aliasName": "发标",
                                    "parentId": "109",
                                    "orderNum": null,
                                    "ownState": "01",
                                    "chlidPermission": null
                                }
                            ]
                        }
                    ]
                },
                {
                    "permissionId": "4",
                    "name": null,
                    "aliasName": "客户管理",
                    "parentId": "0",
                    "orderNum": null,
                    "ownState": "01",
                    "chlidPermission": [
                        {
                            "permissionId": "73",
                            "name": null,
                            "aliasName": "网查复核",
                            "parentId": "4",
                            "orderNum": null,
                            "ownState": "01",
                            "chlidPermission": [
                                {
                                    "permissionId": "76",
                                    "name": null,
                                    "aliasName": "查询",
                                    "parentId": "73",
                                    "orderNum": null,
                                    "ownState": "01",
                                    "chlidPermission": null
                                },
                                {
                                    "permissionId": "77",
                                    "name": null,
                                    "aliasName": "复核",
                                    "parentId": "73",
                                    "orderNum": null,
                                    "ownState": "01",
                                    "chlidPermission": null
                                }
                            ]
                        },
                        {
                            "permissionId": "74",
                            "name": null,
                            "aliasName": "黑名单管理",
                            "parentId": "4",
                            "orderNum": null,
                            "ownState": "01",
                            "chlidPermission": [
                                {
                                    "permissionId": "81",
                                    "name": null,
                                    "aliasName": "删除",
                                    "parentId": "74",
                                    "orderNum": null,
                                    "ownState": "01",
                                    "chlidPermission": null
                                },
                                {
                                    "permissionId": "78",
                                    "name": null,
                                    "aliasName": "查询",
                                    "parentId": "74",
                                    "orderNum": null,
                                    "ownState": "01",
                                    "chlidPermission": null
                                },
                                {
                                    "permissionId": "80",
                                    "name": null,
                                    "aliasName": "修改",
                                    "parentId": "74",
                                    "orderNum": null,
                                    "ownState": "01",
                                    "chlidPermission": null
                                },
                                {
                                    "permissionId": "79",
                                    "name": null,
                                    "aliasName": "新增",
                                    "parentId": "74",
                                    "orderNum": null,
                                    "ownState": "01",
                                    "chlidPermission": null
                                }
                            ]
                        },
                        {
                            "permissionId": "72",
                            "name": null,
                            "aliasName": "客户查询",
                            "parentId": "4",
                            "orderNum": null,
                            "ownState": "01",
                            "chlidPermission": [
                                {
                                    "permissionId": "75",
                                    "name": null,
                                    "aliasName": "查询",
                                    "parentId": "72",
                                    "orderNum": null,
                                    "ownState": "01",
                                    "chlidPermission": null
                                }
                            ]
                        }
                    ]
                },
                {
                    "permissionId": "2",
                    "name": null,
                    "aliasName": "进件管理",
                    "parentId": "0",
                    "orderNum": null,
                    "ownState": "01",
                    "chlidPermission": [
                        {
                            "permissionId": "31",
                            "name": null,
                            "aliasName": "审批结论确认",
                            "parentId": "2",
                            "orderNum": null,
                            "ownState": "01",
                            "chlidPermission": [
                                {
                                    "permissionId": "41",
                                    "name": null,
                                    "aliasName": "查看",
                                    "parentId": "31",
                                    "orderNum": null,
                                    "ownState": "01",
                                    "chlidPermission": null
                                },
                                {
                                    "permissionId": "42",
                                    "name": null,
                                    "aliasName": "提交",
                                    "parentId": "31",
                                    "orderNum": null,
                                    "ownState": "01",
                                    "chlidPermission": null
                                }
                            ]
                        },
                        {
                            "permissionId": "29",
                            "name": null,
                            "aliasName": "进件",
                            "parentId": "2",
                            "orderNum": null,
                            "ownState": "01",
                            "chlidPermission": [
                                {
                                    "permissionId": "32",
                                    "name": null,
                                    "aliasName": "进件详情",
                                    "parentId": "29",
                                    "orderNum": null,
                                    "ownState": "01",
                                    "chlidPermission": [
                                        {
                                            "permissionId": "36",
                                            "name": null,
                                            "aliasName": "提交进件",
                                            "parentId": "32",
                                            "orderNum": null,
                                            "ownState": "01",
                                            "chlidPermission": null
                                        },
                                        {
                                            "permissionId": "33",
                                            "name": null,
                                            "aliasName": "查看",
                                            "parentId": "32",
                                            "orderNum": null,
                                            "ownState": "01",
                                            "chlidPermission": null
                                        },
                                        {
                                            "permissionId": "34",
                                            "name": null,
                                            "aliasName": "保存",
                                            "parentId": "32",
                                            "orderNum": null,
                                            "ownState": "01",
                                            "chlidPermission": null
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            "permissionId": "30",
                            "name": null,
                            "aliasName": "补件",
                            "parentId": "2",
                            "orderNum": null,
                            "ownState": "01",
                            "chlidPermission": [
                                {
                                    "permissionId": "37",
                                    "name": null,
                                    "aliasName": "补件操作",
                                    "parentId": "30",
                                    "orderNum": null,
                                    "ownState": "01",
                                    "chlidPermission": [
                                        {
                                            "permissionId": "39",
                                            "name": null,
                                            "aliasName": "提交",
                                            "parentId": "37",
                                            "orderNum": null,
                                            "ownState": "01",
                                            "chlidPermission": null
                                        }
                                    ]
                                },
                                {
                                    "permissionId": "38",
                                    "name": null,
                                    "aliasName": "补件记录",
                                    "parentId": "30",
                                    "orderNum": null,
                                    "ownState": "01",
                                    "chlidPermission": [
                                        {
                                            "permissionId": "40",
                                            "name": null,
                                            "aliasName": "查看",
                                            "parentId": "38",
                                            "orderNum": null,
                                            "ownState": "01",
                                            "chlidPermission": null
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                }
            ]
        }
    }
}