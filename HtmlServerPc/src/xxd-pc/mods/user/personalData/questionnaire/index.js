require(['base', "trackBase", 'store', 'side', 'juicer'
    , 'header', 'footer', "dialog", 'backTop', 'json', "requirejs"
], function ($, track, store, side, jui, header, footer, dialog) {

    header.init();
    footer.init();

    //左侧菜单
    side.leftMenu(3);
    var token = store && store.get("token") || {},
        locationName = $.getUrlParam('location', location.search),
        global = window["GLOBAL_STATIC_DATA"],
        havetatus = global.riskExamResult.data.status,
        lastCount,
        totalScore,
        typeName,
        notes,
        nextTestTime,
        lastCount1 = global.riskExamResult.data.results.count;
    //如果用户从来没测试过，进页面展示的是问题
    if (havetatus == false) {
        $('.questions-box').removeClass('hide');
    }
    //如果是从产品页点击直接测试的话页面展示问题
    if (locationName == "1") {
        $('.questionnaire-box,.question-title').addClass('hide');
        $('.questions-box,.question-tip').removeClass('hide');
        side.getLeftHeight();
    }
    //如果当前用户没有机会了，按钮置灰
    if(lastCount1 === ''){
        $('.J_nextQuestion').click(function () {
            $('.questionnaire-box,.question-title').addClass('hide');
            $('.questions-box,.question-tip').removeClass('hide');
            side.getLeftHeight();
        });
    } else if (lastCount1 != 0) {
        $('.J_nextQuestion').click(function () {
            $('.questionnaire-box,.question-title').addClass('hide');
            $('.questions-box,.question-tip').removeClass('hide');
            side.getLeftHeight();
        });
    }

    //判断当前用户是否已经填写过问卷了。
    $.xxdAjax({
        url: '/investmentAPI/users/riskExamStatus',
        type: 'get',
        clientId: 'XXD_FRONT_END',
        token: token,
        callbacks: function (data) {
            if (data && data.code == '200000') {
                if (data.data.status) {
                    $('.J_success').removeClass('hide');
                    $('#totalScore').html(data.data.results.totalScore);
                    $('#typeName').html(data.data.results.typeName);
                    $('#notes').html(data.data.results.notes);
                }
            }
        },
        error: function () {
            side.thisDialog('网络异常，请刷新重试');
        }
    });

    var name = ['job', 'education', 'deadline', 'viewpoint', 'year', 'income', 'rate', 'property'];


    //获取风险评估答案对应列表
    $.xxdAjax({
        url: '/investmentAPI/users/riskExamInfo',
        type: 'get',
        clientId: 'XXD_FRONT_END',
        callback: function (data) {
            if (data) {
                $.each(data, function (i, v) {
                    var contentArray = [];
                    contentArray.push('<div answerid="' + v.id + '" name="' + (i + 1) + '">');
                    contentArray.push('<h6>' + (i + 1) + '、' + v.topic + '</h6>');
                    contentArray.push('<label for="checker' + (i + "1") + '"><input name="' + name[i] + '" type="radio" id="checker' + (i + "1") + '" porder="' + v.answerOptions[0].porder + '" questionid="' + v.answerOptions[0].questionid + '">A.' + v.answerOptions[0].answeritem + '</label>');
                    contentArray.push('<label for="checker' + (i + "2") + '"><input name="' + name[i] + '" type="radio" id="checker' + (i + "2") + '" porder="' + v.answerOptions[1].porder + '" questionid="' + v.answerOptions[1].questionid + '">B.' + v.answerOptions[1].answeritem + '</label>');
                    contentArray.push('<label for="checker' + (i + "3") + '"><input name="' + name[i] + '" type="radio" id="checker' + (i + "3") + '" porder="' + v.answerOptions[2].porder + '" questionid="' + v.answerOptions[2].questionid + '">C.' + v.answerOptions[2].answeritem + '</label>');
                    contentArray.push('<label for="checker' + (i + "4") + '"><input name="' + name[i] + '" type="radio" id="checker' + (i + "4") + '" porder="' + v.answerOptions[3].porder + '" questionid="' + v.answerOptions[3].questionid + '">D.' + v.answerOptions[3].answeritem + '</label>');
                    if (v.answerOptions.length >= 5) {
                        contentArray.push('<label for="checker' + (i + "5") + '"><input name="' + name[i] + '" type="radio" id="checker' + (i + "5") + '" porder="' + v.answerOptions[4].porder + '" questionid="' + v.answerOptions[4].questionid + '">E.' + v.answerOptions[4].answeritem + '</label>');
                    }
                    if (v.answerOptions.length >= 6) {
                        contentArray.push('<label for="checker' + (i + "6") + '"><input name="' + name[i] + '" type="radio" id="checker' + (i + "6") + '" porder="' + v.answerOptions[5].porder + '" questionid="' + v.answerOptions[5].questionid + '">F.' + v.answerOptions[5].answeritem + '</label>');
                    }
                    if (v.answerOptions.length >= 7) {
                        contentArray.push('<label for="checker' + (i + "7") + '"><input name="' + name[i] + '" type="radio" id="checker' + (i + "7") + '" porder="' + v.answerOptions[6].porder + '" questionid="' + v.answerOptions[6].questionid + '">G.' + v.answerOptions[6].answeritem + '</label>');
                    }
                    contentArray.push('</div>');


                    $('.J_questions form').append(contentArray.join(""));

                });
            }
        },
        error: function () {
            side.thisDialog('网络异常，请刷新重试');
        }
    });
    //提交问卷调查
    var questions = [], questionIndex = 0, answers = [];
    var allQuestions = ['1', '2', '3', '4', '5', '6', '7', '8'];
    $('body').on('click', '.J_questions form input', function (v) {
        var parent = $(v.target).parent().parent();
        questionIndex = $(parent).attr('name');
        questions.push(questionIndex);
    });
    $('#submit').click(function () {
        questions = removeDuplicatedItem(questions);
        if (questions.length == 8) {
            var allInputs = $('.J_questions form input:checked');
            answers = [];
            $.each(allInputs, function (i, v) {
                var object = {};
                object.questionDetailId = $(v).attr('porder');
                object.questionId = $(v).attr('questionid');
                answers.push(object);
            });
            getRiskExam();
            return;
        } else {
            var newQuestions = [], x, o = {}, tmp = allQuestions.concat(questions);
            for (var i = 0; i < tmp.length; i++) {
                (tmp[i] in o) ? o[tmp[i]]++ : o[tmp[i]] = 1;
            }
            for (x in o) if (o[x] == 1) {
                newQuestions.push(x);
            }
            var noAnswer = newQuestions.join('、');
            side.thisDialog('您还有第' + noAnswer + '题没有作答！');
        }
    });
    //数组去重
    function removeDuplicatedItem(ar) {
        var ret = [];
        for (var i = 0, j = ar.length; i < j; i++) {
            if (ret.indexOf(ar[i]) === -1) {
                ret.push(ar[i]);
            }
        }
        return ret;
    }

    //请求接口
    function getRiskExam() {
        $.xxdAjax({
            url: '/investmentAPI/users/riskExam',
            type: 'patch',
            clientId: 'XXD_FRONT_END',
            token: token,
            data: JSON.stringify({
                "data": {
                    "answers": answers,
                    "ip": "127.0.0.1"
                }
            }),
            callbacks: function (data) {
                if (data && data.code == '200000') {
                    if (data.data.results.count >= 0) {
                        lastCount = data.data.results.count;
                        totalScore = data.data.results.totalScore;
                        typeName = data.data.results.typeName;
                        notes = data.data.results.notes;
                        nextTestTime = $.fnDateToString(data.data.results.nextTestTime, 'yyyy-MM-dd');
                        dialog({
                            content: "<div class='dimension operate-tip'>"
                            + "<i class='c_close close_x'>×</i>"
                            + "<h5>提示</h5>"
                            + "<div class='tip-content'>"
                            + "<p>您的风险承受能力与偏好测试得分为"+totalScore+"分</p>"
                            + "<p>属于测试类型是"+typeName+"</p>"
                            + "<p class='notes'>"+notes+"</p>"
                            + "<em class='J_getQues'>查看报告 &gt;&gt;</em> "
                            + "<a class='btn J_closeHtml'>我知道了</a>"
                            + "</div>"
                            + "</div>",
                            id: "",
                            confirm: function (art) {

                            },
                            cancel: function (art) {
                                art.remove();
                            }
                        });
                    } else {
                        noGetQuestion();
                    }
                }
                var clocks = setInterval(function () {
                    if (parseInt($('.g-left').height()) != parseInt($('.g-right').height())) {
                        $('.g-left').css('min-height', $('.g-right').height() + 'px');
                    } else {
                        clearInterval(clocks);
                    }
                }, 100);
            },
            error: function () {
                side.thisDialog('网络异常，请刷新重试');
            }
        });
    }

    $('body').on('click', '.J_closeHtml', function () {
        if (document.referrer) {
            window.location.href = document.referrer;
        } else {
            window.history.go(-1);
        }
    });
    $('body').on('click', '.J_getQues', function () {
        $('#totalScore').html(totalScore);
        $('#typeName').html(typeName);
        $('#notes').html(notes);
        $('.J_lastCount').html(lastCount); //测评次数
        $('.mui-dialog').remove();
        $('.J_success,.questionnaire-box,.question-title').removeClass('hide');
        $('.questions-box,.question-tip').addClass('hide');
        side.getLeftHeight();
        if(lastCount == 0){
            noGetQuestion();
        }
    });

    //达到上限
    function noGetQuestion() {
        $('.J_nextQuestion').addClass('disable').unbind("click");
        $('.lastCount').html("今年测评测试已达上限，【"+nextTestTime+"】后可重新开始测评。详情可拨打客服电话4000-169-521进行咨询。");
    }

    //返回按钮
    $('.J_back').click(function () {
        $('.questionnaire-box,.question-title').removeClass('hide');
        $('.questions-box,.question-tip').addClass('hide');
    });

    side.getLeftHeight();

}, function (err) {
    var con = null;
    if ((con = window.console)) con.log(err);
    else alert(err);
});

