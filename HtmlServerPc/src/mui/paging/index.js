define(["base", "pagingTpl", "juicer"], function ($, tpl, jui) {
    var paging = {
        init: function (pagingObj) {
            var total = parseInt(pagingObj.total, 10); //总条数
            var pageSize = parseInt(pagingObj.pageSize, 10); // 最多显示条数
            //var pageIndex = pagingObj.pageIndex; //当前索引
            var totalPage = parseInt((total + pageSize - 1) / pageSize);
            var self = this;
            this.changePage(pagingObj);
            pagingObj.$dom.undelegate();   // 清除之前绑定的点击事件再绑定新的点击事件
            pagingObj.$dom.delegate(".j_firstPage , .j_prvPage , .j_changePage ,.j_nextPage ,.j_lastPage", "click", function () {
                var index = 1;
                var $me = $(this);
                var pagingObj = self.pagingObj;
                var pageIndex = parseInt(pagingObj.pageIndex);
                if ($me.hasClass("j_firstPage")) {
                    index = pageIndex == 1 ? -1 : 1;
                } else if ($me.hasClass("j_prvPage")) {
                    index = pageIndex > 1 ? pageIndex - 1 : -1;
                } else if ($me.hasClass("j_changePage")) {
                    var changeIndex = $me.find("a").html();
                    index = changeIndex == pageIndex ? -1 : changeIndex;
                } else if ($me.hasClass("j_nextPage")) {
                    index = pageIndex >= totalPage ? -1 : pageIndex + 1;
                } else if ($me.hasClass("j_lastPage")) {
                    index = pageIndex >= totalPage ? -1 : totalPage;
                }
                if (index > 0) {
                    pagingObj.pageIndex = index;
                    self.changePage(pagingObj);
                    var callback;
                    if (pagingObj && (callback = pagingObj.callback)) {
                        callback(pagingObj);
                    }
                }
            });
        },
        changePage: function (pagingObj) {
            this.pagingObj = pagingObj;
            var total = parseInt(pagingObj.total); //总条数
            var pageSize = parseInt(pagingObj.pageSize); // 最多显示条数
            var pageIndex = parseInt(pagingObj.pageIndex); //当前索引转为数字
            var totalPage = parseInt((total + pageSize - 1) / pageSize);
            var $warp = pagingObj.$dom;
            var loopSize = totalPage > 5 ? 5 : totalPage;
            var startIndex = 1, endIndex = totalPage;
            var half = parseInt((loopSize + 1) / 2);

            if (totalPage <= 5 || pageIndex < half) {
                startIndex = 1;
                endIndex = totalPage;
            } else if (pageIndex + half > totalPage) {
                startIndex = totalPage - 5 + 1;
                endIndex = totalPage;
            } else {
                startIndex = pageIndex - half + 1;
                endIndex = pageIndex + half;
            }
            var itemArray = [];
            for (var i = 0; i < loopSize; i++) {
                itemArray.push(startIndex + i);
            }

            if (totalPage > 0) {
                var template = juicer.to_html(tpl, {
                    total: total,
                    totalPage: totalPage,
                    itemArray: itemArray,
                    currentIndex: pageIndex
                });
                $warp.html(template);
            } else {
                $warp.html("");
            }
        }
    };

    function _f(pagingObj) {
        function _fn() {
        }

        _fn.prototype = paging;
        var f = new _fn;
        f.init(pagingObj);
    }

    return _f;
});