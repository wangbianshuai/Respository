export default {
    'POST /api/getuserlist': GetUserList()
}

function GetUserList() {
    return {
        code: "200000",
        data: [{ UserId: 1, UserName: "张三" },
        { UserId: 2, UserName: "李四" },
        { UserId: 3, UserName: "王五" },
        { UserId: 4, UserName: "马六" },
        { UserId: 5, UserName: "赵七" }]
    }
}