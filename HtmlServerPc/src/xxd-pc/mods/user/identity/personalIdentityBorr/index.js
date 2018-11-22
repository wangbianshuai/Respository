require(['base', "trackBase", 'store', 'juicer', 'header', 'footer', "dialog", 'backTop', 'json', "requirejs"], function ($, track, store, jui, header, footer, dialog) {
    header.init();
    footer.init();
    //更改绑定手机号弹框
    $("#J_changePhone").on("click", function () {
        dialog({
            id: "changePhoneDialog",
            content: "<div class='changeIdentity changePhone1'><a class='c_close' href='#'>×</a><div class='m-con-hd'>第一步：验证原手机号码</div> <div class='m-con-bd'> " +
            "<div class='filed-user'> <span>原手机号码</span> <div class='enterPhone clearfix'> <input type='text' class='phoneno' value='13812345678'> <a class='message'>获取短信验证码</a> </div> <a class='voice'>获取语音验证码</a> </div> " +
            "<div class='filed-user'> <span>手机验证码</span> <input type='text' placeholder='请输入手机验证码'> </div> <div class='wrong_tip wt_pos'>错误提示....</div> " +
            "<div class='filed-user'> <span></span> <p><a class='btn' id='J_changePhone1'>下一步</a></p> </div> </div> </div> " +
            "<div class='changeIdentity changePhone2 disnone'> <div class='m-con-hd'>第二步：验证新手机号码</div> <div class='m-con-bd'> " +
            "<div class='filed-user'> <span>原手机号码</span> <div class='enterPhone clearfix'> <input type='text' class='phoneno' value='13812345678'> <a class='message'>获取短信验证码</a> </div> <a class='voice'>获取语音验证码</a> </div> " +
            "<div class='filed-user'> <span>手机验证码</span> <input type='text' placeholder='请输入手机验证码'> </div> <div class='wrong_tip wt_pos'>错误提示....</div> " +
            "<div class='filed-user'> <span></span> <p><a class='btn' id='J_changePhone2'>立即绑定</a></p> </div> </div> </div>",
            cancel: function (clo) {
                clo.close();
            },
            comfirm: function () {

            }
        });
    });
    //更改绑定手机号
    $(document).on("click", "#J_changePhone1", function () {
        $(".changePhone1").addClass("disnone");
        $(".changePhone2").removeClass("disnone");

    });

    //实名认证弹框
    $("#J_realnameId").on("click", function () {
        dialog({
            id: "realNameDialog",
            content: "<div class='changeIdentity'><a class='c_close' href='#'>×</a><div class='m-con-hd'>实名认证</div><div class='m-con-bd'> " +
            "<div class='filed-user'> <span>证件类型</span> " +
            "<select id='J_IdType'> " +
            "<option value='1' selected>身份证</option> " +
            "<option value='2'>香港特别行政区护照</option> </select> " +
            "</div> <div class='filed-user'> <span>真实姓名</span> <input type='text' placeholder='您的真实姓名'> </div> " +
            "<div class='filed-user'> <span>证件号码</span> <input type='text' placeholder='您的证件号码'> </div> " +
            "<div class='filed-user disnone' id='J_FrontId'> <span class='threetxt'>正面证件照</span> " +
            "<p class='openbank'><span class='fadetip' value=''>请上传正面证件照</span><i>选择&nbsp; &gt;</i></p> " +
            "<input type='file' id='J_Hidefile' > " +
            "</div> <div class='wrong_tip wt_pos'>错误提示....</div> " +
            "<div class='filed-user'> <span></span> <p><a class='btn'>立即认证</a></p> </div> </div> </div>",
            cancel: function (clo) {
                clo.close();
            },
            comfirm: function () {

            }
        });
    });
    //更改实名认证
    $(document).on("change", "#J_IdType", function () {
        var selValue = $(this).val();
        if (selValue == 2) {
            $("#J_FrontId").removeClass("disnone");
        } else {
            $("#J_FrontId").addClass("disnone");
        }
    });

    //获取图片名称
    $(document).on("change", "#J_Hidefile", function () {
        var dir = $(this).val();
        $(".fadetip").html(getFilename(dir))

    });

    function getFilename(dir) {
        var ind = dir.lastIndexOf("\\");
        return dir.substring(ind + 1);
    };

    //设置支付密码弹框
    $("#J_setPaypwd").on("click", function () {
        dialog({
            id: "setPaypwdDialog",
            content: "<div class='changeIdentity'><a class='c_close' href='#'>×</a><div class='m-con-hd'>设置支付密码</div> <div class='m-con-bd'> " +
            "<div class='filed-user'> <span>支付密码</span> <input type='text' placeholder=''> </div> " +
            "<div class='filed-user'> <span>再次输入</span> <input type='text' placeholder=''> </div> " +
            "<div class='wrong_tip wt_pos'>错误提示....</div> " +
            "<div class='filed-user'> <span></span> <p><a class='btn'>设置</a></p> </div> </div> </div>",
            cancel: function (clo) {
                clo.close();
            },
            confirm: function () {

            }
        });
    });
    //设置安全保护问题弹框
    $("#J_setSafeQA").on("click", function () {
        dialog({
            id: "setPaypwdDialog",
            content: "<div class='changeIdentity'><a class='c_close' href='#'>×</a><div class='m-con-hd'>设置安全保护问题</div> " +
            "<div class='m-con-bd'> <div class='filed-user'> <span>安全保护问题</span> " +
            "<select id='J_IdType'> <option value='1' selected>你的爸爸叫什么？</option> " +
            "<option value='2'>香港特别行政区护照</option> </select> </div> " +
            "<div class='filed-user'> <span>输入答案</span> <input type='text' placeholder=''> </div> " +
            "<div class='wrong_tip wt_pos'>错误提示....</div> " +
            "<div class='filed-user'> <span></span> <p><a class='btn'>提交</a></p> </div> </div> </div>",
            cancel: function (clo) {
                clo.close();
            },
            confirm: function () {

            }
        });
    });
    //VIP认证弹框
    $("#J_setVipID").on("click", function () {
        dialog({
            id: "setVipDialog",
            content: "<div class='changeIdentity'><a class='c_close' href='#'>×</a><div class='m-con-hd'>VIP认证</div> " +
            "<div class='m-con-bd'> <div class='filed-user tips'> " +
            "<p>注:*申请成为VIP会员，请输入您的专属财富顾问编号，<span class='red'>可以享受专有福利。</span></p> " +
            "<p class='spe'>*请输入您的专属财富顾问编号</p> </div> " +
            "<div class='filed-user' style='margin-top: 0'> <span class='red' style='text-align: left'>服务人员编号</span> " +
            "<input type='text' placeholder=''> </div> " +
            "<div class='filed-user tips' style='margin-top: 25px'> " +
            "<p>没有专属财富顾问编号怎么办？可从下方选择我们提供的在线客服为您服务。</p> " +
            "<ul class='clearfix'> <li><input type='radio' name='kf'>新新贷客服宝宝</li> " +
            "<li><input type='radio' name='kf'>新新贷客服宝宝</li> " +
            "<li><input type='radio' name='kf'>新新贷客服宝宝</li> " +
            "<li><input type='radio' name='kf'>新新贷客服宝宝</li> " +
            "<li><input type='radio' name='kf'>新新贷客服宝宝</li> </ul> " +
            "</div> <div class='wrong_tip wt_pos'>错误提示....</div> " +
            "<div class='filed-user'> <span></span> <p><a class='btn'>确认提交</a></p> " +
            "</div> </div> </div>",
            cancel: function (clo) {
                clo.close();
            },
            confirm: function () {

            }
        });
    });
    //绑定邮箱弹框
    $("#J_setEmail").on("click", function () {
        dialog({
            id: "setEmailDialog",
            content: " <div class='changeIdentity'><a class='c_close' href='#'>×</a><div class='m-con-hd'>绑定邮箱</div> <div class='m-con-bd'> " +
            "<div class='filed-user'> <span>邮箱地址</span> <input type='text' placeholder='请输入邮箱地址'> </div> " +
            "<div class='wrong_tip wt_pos'>错误提示....</div> " +
            "<div class='filed-user'> <span></span> <p><a class='btn'>提交</a></p> </div> </div> </div>",
            cancel: function (clo) {
                clo.close();
            },
            confirm: function () {

            }
        });
    });

}, function (err) {
    var con = null;
    if ((con = window.console)) con.log(err);
    else alert(err);
});

