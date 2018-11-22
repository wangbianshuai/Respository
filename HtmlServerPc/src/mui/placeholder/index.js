define(["base"],function ($){
    var placeholder = {
        init:function ($e){
            if ($.isPlaceholderSupport()) return;
            if (!($e instanceof $)) {
                $e = $("input[component*='placeholder'],textarea[component*='placeholder']");
            }
            if ($e.length == 0) return;
        }
    };
    return placeholder;
});