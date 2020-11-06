var P = [0x04bd8, 0x04ae0, 0x0a570, 0x054d5, 0x0d260, 0x0d950, 0x16554, 0x056a0, 0x09ad0, 0x055d2, 0x04ae0, 0x0a5b6, 0x0a4d0, 0x0d250, 0x1d255, 0x0b540, 0x0d6a0, 0x0ada2, 0x095b0, 0x14977, 0x04970, 0x0a4b0, 0x0b4b5, 0x06a50, 0x06d40, 0x1ab54, 0x02b60, 0x09570, 0x052f2, 0x04970, 0x06566, 0x0d4a0, 0x0ea50, 0x06e95, 0x05ad0, 0x02b60, 0x186e3, 0x092e0, 0x1c8d7, 0x0c950, 0x0d4a0, 0x1d8a6, 0x0b550, 0x056a0, 0x1a5b4, 0x025d0, 0x092d0, 0x0d2b2, 0x0a950, 0x0b557, 0x06ca0, 0x0b550, 0x15355, 0x04da0, 0x0a5b0, 0x14573, 0x052b0, 0x0a9a8, 0x0e950, 0x06aa0, 0x0aea6, 0x0ab50, 0x04b60, 0x0aae4, 0x0a570, 0x05260, 0x0f263, 0x0d950, 0x05b57, 0x056a0, 0x096d0, 0x04dd5, 0x04ad0, 0x0a4d0, 0x0d4d4, 0x0d250, 0x0d558, 0x0b540, 0x0b6a0, 0x195a6, 0x095b0, 0x049b0, 0x0a974, 0x0a4b0, 0x0b27a, 0x06a50, 0x06d40, 0x0af46, 0x0ab60, 0x09570, 0x04af5, 0x04970, 0x064b0, 0x074a3, 0x0ea50, 0x06b58, 0x055c0, 0x0ab60, 0x096d5, 0x092e0, 0x0c960, 0x0d954, 0x0d4a0, 0x0da50, 0x07552, 0x056a0, 0x0abb7, 0x025d0, 0x092d0, 0x0cab5, 0x0a950, 0x0b4a0, 0x0baa4, 0x0ad50, 0x055d9, 0x04ba0, 0x0a5b0, 0x15176, 0x052b0, 0x0a930, 0x07954, 0x06aa0, 0x0ad50, 0x05b52, 0x04b60, 0x0a6e6, 0x0a4e0, 0x0d260, 0x0ea65, 0x0d530, 0x05aa0, 0x076a3, 0x096d0, 0x04bd7, 0x04ad0, 0x0a4d0, 0x1d0b6, 0x0d250, 0x0d520, 0x0dd45, 0x0b5a0, 0x056d0, 0x055b2, 0x049b0, 0x0a577, 0x0a4b0, 0x0aa50, 0x1b255, 0x06d20, 0x0ada0, 0x14b63];
var K = "甲乙丙丁戊己庚辛壬癸";
var J = "子丑寅卯辰巳午未申酉戌亥";
var O = "鼠牛虎兔龙蛇马羊猴鸡狗猪";
var L = ["小寒", "大寒", "立春", "雨水", "惊蛰", "春分", "清明", "谷雨", "立夏", "小满", "芒种", "夏至", "小暑", "大暑", "立秋", "处暑", "白露", "秋分", "寒露", "霜降", "立冬", "小雪", "大雪", "冬至"];
var D = [0, 21208, 43467, 63836, 85337, 107014, 128867, 150921, 173149, 195551, 218072, 240693, 263343, 285989, 308563, 331033, 353350, 375494, 397447, 419210, 440795, 462224, 483532, 504758];
var B = "日一二三四五六七八九十";
var H = ["正", "二", "三", "四", "五", "六", "七", "八", "九", "十", "十一", "腊"];
var E = "初十廿卅";
var V = {
    "0101": "*1元旦节",
    "0214": "情人节",
    "0305": "学雷锋纪念日",
    "0308": "妇女节",
    "0312": "植树节",
    "0315": "消费者权益日",
    "0401": "愚人节",
    "0501": "*1劳动节",
    "0504": "青年节",
    "0601": "国际儿童节",
    "0701": "中国共产党诞辰",
    "0801": "建军节",
    "0910": "中国教师节",
    "1001": "*3国庆节",
    "1224": "平安夜",
    "1225": "圣诞节"
};

var T = {
    "0101": "*2春节",
    "0115": "元宵节",
    "0505": "*1端午节",
    "0815": "*1中秋节",
    "0909": "重阳节",
    "1208": "腊八节",
    "0100": "除夕"
};

function U(Y) {
    function c(j, i) {
        var h = new Date((31556925974.7 * (j - 1900) + D[i] * 60000) + Date.UTC(1900, 0, 6, 2, 5));
        return (h.getUTCDate())
    }

    function d(k) {
        var h, j = 348;
        for (h = 32768; h > 8; h >>= 1) {
            j += (P[k - 1900] & h) ? 1 : 0
        }
        return (j + b(k))
    }

    function a(h) {
        return (K.charAt(h % 10) + J.charAt(h % 12))
    }

    function b(h) {
        if (g(h)) {
            return ((P[h - 1900] & 65536) ? 30 : 29)
        } else {
            return (0)
        }
    }

    function g(h) {
        return (P[h - 1900] & 15)
    }

    function e(i, h) {
        return ((P[i - 1900] & (65536 >> h)) ? 30 : 29)
    }

    function C(m) {
        var k, j = 0,
            h = 0;
        var l = new Date(1900, 0, 31);
        var n = (m - l) / 86400000;
        this.dayCyl = n + 40;
        this.monCyl = 14;
        for (k = 1900; k < 2050 && n > 0; k++) {
            h = d(k);
            n -= h;
            this.monCyl += 12
        }
        if (n < 0) {
            n += h;
            k--;
            this.monCyl -= 12
        }
        this.year = k;
        this.yearCyl = k - 1864;
        j = g(k);
        this.isLeap = false;
        for (k = 1; k < 13 && n > 0; k++) {
            if (j > 0 && k == (j + 1) && this.isLeap == false) {
                --k;
                this.isLeap = true;
                h = b(this.year)
            } else {
                h = e(this.year, k)
            }
            if (this.isLeap == true && k == (j + 1)) {
                this.isLeap = false
            }
            n -= h;
            if (this.isLeap == false) {
                this.monCyl++
            }
        }
        if (n == 0 && j > 0 && k == j + 1) {
            if (this.isLeap) {
                this.isLeap = false
            } else {
                this.isLeap = true;
                --k;
                --this.monCyl
            }
        }
        if (n < 0) {
            n += h;
            --k;
            --this.monCyl
        }
        this.month = k;
        this.day = n + 1
    }

    function G(h) {
        return h < 10 ? "0" + h : h
    }

    function f(i, j) {
        var h = i;
        return j.replace(/dd?d?d?|MM?M?M?|yy?y?y?/g, function (k) {
            switch (k) {
                case "yyyy":
                    var l = "000" + h.getFullYear();
                    return l.substring(l.length - 4);
                case "dd":
                    return G(h.getDate());
                case "d":
                    return h.getDate().toString();
                case "MM":
                    return G((h.getMonth() + 1));
                case "M":
                    return h.getMonth() + 1;
                default: return ''
            }
        })
    }

    function Z(i, h) {
        var j;
        switch (i, h) {
            case 10:
                j = "初十";
                break;
            case 20:
                j = "二十";
                break;
            case 30:
                j = "三十";
                break;
            default:
                j = E.charAt(Math.floor(h / 10));
                j += B.charAt(h % 10)
        }
        return (j)
    }
    this.date = Y;
    this.isToday = false;
    this.isRestDay = false;
    this.solarYear = f(Y, "yyyy");
    this.solarMonth = f(Y, "M");
    this.solarDate = f(Y, "d");
    this.solarWeekDay = Y.getDay();
    this.solarWeekDayInChinese = "星期" + B.charAt(this.solarWeekDay);
    var X = new C(Y);
    this.lunarYear = X.year;
    this.shengxiao = O.charAt((this.lunarYear - 4) % 12);
    this.lunarMonth = X.month;
    this.lunarIsLeapMonth = X.isLeap;
    this.lunarMonthInChinese = this.lunarIsLeapMonth ? "闰" + H[X.month - 1] : H[X.month - 1];
    this.lunarDate = X.day;
    this.showInLunar = this.lunarDateInChinese = Z(this.lunarMonth, this.lunarDate);
    if (this.lunarDate == 1) {
        this.showInLunar = this.lunarMonthInChinese + "月"
    }
    this.ganzhiYear = a(X.yearCyl);
    this.ganzhiMonth = a(X.monCyl);
    this.ganzhiDate = a(X.dayCyl++);
    this.jieqi = "";
    this.restDays = 0;
    if (c(this.solarYear, (this.solarMonth - 1) * 2) == f(Y, "d")) {
        this.showInLunar = this.jieqi = L[(this.solarMonth - 1) * 2]
    }
    if (c(this.solarYear, (this.solarMonth - 1) * 2 + 1) == f(Y, "d")) {
        this.showInLunar = this.jieqi = L[(this.solarMonth - 1) * 2 + 1]
    }
    if (this.showInLunar == "清明") {
        this.showInLunar = "清明节";
        this.restDays = 1
    }
    this.solarFestival = V[f(Y, "MM") + f(Y, "dd")];
    if (typeof this.solarFestival == "undefined") {
        this.solarFestival = ""
    } else {
        if (/\*(\d)/.test(this.solarFestival)) {
            this.restDays = parseInt(RegExp.$1);
            this.solarFestival = this.solarFestival.replace(/\*\d/, "")
        }
    }
    this.showInLunar = (this.solarFestival == "") ? this.showInLunar : this.solarFestival;
    this.lunarFestival = T[this.lunarIsLeapMonth ? "00" : G(this.lunarMonth) + G(this.lunarDate)];
    if (typeof this.lunarFestival == "undefined") {
        this.lunarFestival = ""
    } else {
        if (/\*(\d)/.test(this.lunarFestival)) {
            this.restDays = (this.restDays > parseInt(RegExp.$1)) ? this.restDays : parseInt(RegExp.$1);
            this.lunarFestival = this.lunarFestival.replace(/\*\d/, "")
        }
    }
    if (this.lunarMonth == 12 && this.lunarDate == e(this.lunarYear, 12)) {
        this.lunarFestival = T["0100"];
        this.restDays = 1
    }
    this.showInLunar = (this.lunarFestival == "") ? this.showInLunar : this.lunarFestival;
    this.showInLunar = (this.showInLunar.length > 4) ? this.showInLunar.substr(0, 2) + "..." : this.showInLunar;

    this.getHourGanzi = function (index) {
        var ganzi = this.ganzhiDate.substr(0, 1);

        var startIndex = getHourGanzi(K.indexOf(ganzi));

        var ganIndex = startIndex + index;
        ganIndex = ganIndex < 10 ? ganIndex : ganIndex - 10;

        return K.charAt(ganIndex) + J.charAt(index);
    };

    this.getLunarDate = function (hourIndex) {
        var index = Math.ceil(hourIndex / 2);
        index = index === 12 ? 0 : index;
        var birthEight = this.ganzhiYear + ' ' + this.ganzhiMonth + ' ' + this.ganzhiDate + ' ' + this.getHourGanzi(index);

        var lunarDate = this.ganzhiYear + '年' + this.lunarMonthInChinese + '月' + this.lunarDateInChinese;

        return [lunarDate, birthEight];
    };

    //时辰
    //this.ganziHour = getGanziHour.call(this);

    // function getGanziHour() {
    //     var hh = this.date.getHours();
    //     var mm = this.date.getMinutes();

    //     var index = getHourDizhi(hh, mm);
    //     return this.getHourGanzi(index);
    // }

    function getHourGanzi(ganIndex) {
        if (ganIndex === 0 || ganIndex === 5) return 0;
        else if (ganIndex === 1 || ganIndex === 6) return 2;
        else if (ganIndex === 2 || ganIndex === 7) return 4;
        else if (ganIndex === 3 || ganIndex === 8) return 6;
        else if (ganIndex === 4 || ganIndex === 9) return 8;
    }

    // function getHourDizhi(hh, mm) {
    //     var h = (hh * 60 + mm) / 60;
    //     if (h <= 1 || h > 23) return 0;
    //     else if (h > 1 && h <= 3) return 1;
    //     else if (h > 3 && h <= 5) return 2;
    //     else if (h > 5 && h <= 7) return 3;
    //     else if (h > 7 && h <= 9) return 4;
    //     else if (h > 9 && h <= 11) return 5;
    //     else if (h > 11 && h <= 13) return 6;
    //     else if (h > 13 && h <= 15) return 7;
    //     else if (h > 15 && h <= 17) return 8;
    //     else if (h > 17 && h <= 19) return 9;
    //     else if (h > 19 && h <= 21) return 10;
    //     else if (h > 21 && h <= 23) return 11;
    // }
}

export default U;