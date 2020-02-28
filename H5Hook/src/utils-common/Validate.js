export default class Validate {
    static ValidateEmail(arg) {
        var patter = /^([a-zA-Z0-9]+[_|\-|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\-|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
        if (!patter.test(arg)) return 'The email address is incorrect. Please enter the correct email address.';

        return true
    }

    static Len(s) {
        var l = 0;
        var a = s.split("");
        for (var i = 0; i < a.length; i++) {
            if (a[i].charCodeAt(0) < 299) l++;
            else l += 2;
        }
        return l;
    }
}