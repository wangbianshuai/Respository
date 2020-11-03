function getProperty(name, label, dataType, isNullable, maxLength, scale) {
    dataType = dataType || "string";
    isNullable = isNullable === undefined ? true : isNullable;
    maxLength = maxLength || 50;
    scale = scale || 2
    return { name, label, dataType, isNullable, maxLength, scale }
}

function getButton(name, text, buttonType, x, y) {
    return { name, text, type: "Button", buttonType, x, y, isDisabled: true }
}

var guidId = 100000000;
var Guids = {};
var guidIndex = 1;

function createGuid(name) {
    if (name) {
        if (!Guids[name]) { guidIndex += 1; Guids[name] = guidIndex * 100000000; }
        var id = Guids[name];
        id += 1;
        Guids[name] = id;
        return id.toString();
    }
    else {
        guidId += 1;
        return guidId.toString();
    }
}

function getRadio(name, label, dataSource, x, y, defaultValue, buttonWidth) {
    return { name, label, type: "Radio", className: 'my-radio', dataSource, x, y, isButton: true, defaultValue, buttonWidth }
}

function getTextBox(name, label, controlType, x, y, placeHolder, maxLength) {
    return { name, label, type: "TextBox", controlType, placeHolder, x, y, maxLength }
}

function getRowTextBox(name, label, span, placeHolder, maxLength, isNullable, isEdit) {
    return { name, label, type: "TextBox", span, placeHolder, maxLength, isNullable, isEdit };
}

function getRowSelect(name, label, span, dataSource, defaultValue, isNullable, isEdit) {
    return { name, label, type: "Picker", span, dataSource, defaultValue, isNullable, isEdit }
}

function getRowSelect2(name, label, span, serviceDataSource, defaultValue, isNullable, isEdit) {
    return { name, label, type: "Picker", span, serviceDataSource, defaultValue, isNullable, isEdit }
}

function getSelect(name, label, dataSource, x, y, defaultValue) {
    return { name, label, type: "Picker", dataSource, x, y, defaultValue }
}

function getSelect2(name, label, serviceDataSource, x, y, defaultValue) {
    return { name, label, type: "Picker", serviceDataSource, x, y, defaultValue }
}

function getMoveSelect(name, label, dataSource, x, y, defaultValue) {
    return { name, label, type: "MoveSelect", className: 'divMoveSelect', dataSource, x, y, defaultValue }
}

function getMoveSelect2(name, label, serviceDataSource, x, y, defaultValue) {
    return { name, label, type: "MoveSelect", className: 'divMoveSelect', serviceDataSource, x, y, defaultValue }
}

function getAutoComplete(name, label, serviceDataSource, x, y, defaultValue) {
    return { name, label, type: "AutoComplete", serviceDataSource, x, y, defaultValue }
}


function getDatePicker(name, label, x, y, defaultValue) {
    return { name, label, type: "DatePicker", x, y, defaultValue }
}

function getSpanText(name, className, x, y) {
    return { name, type: 'SpanText', x, y, className, isDiv: true }
}

function getDateIconText(name, className, x, y) {
    return getIconText(name, 'calendar.png', className, x, y);
}

function getIconText(name, iconName, className, x, y) {
    return { name, type: 'IconText', iconName, className, x, y }
}

function getHtmlContent(name, className, x, y) {
    return { name, type: 'HtmlContent', className, x, y }
}

const regExpress = {};

//非数字与字母,用于替换
regExpress.noNumberChar = "[^0-9a-zA-Z]";

//只能输入数字与字母，用于键盘输入keypress
regExpress.inputNumberChar = "^[0-9a-zA-Z]+$";

//非数字,用户于替换
regExpress.noNumber = "[^\\d]";

//只能输入数字，用于键盘输入keypress
regExpress.inputNumber = "^[\\d]+$";

module.exports = {
    getAutoComplete,
    getButton,
    getDatePicker,
    getProperty,
    getRadio,
    getSelect,
    getSelect2,
    getTextBox,
    regExpress,
    createGuid,
    getRowSelect,
    getRowSelect2,
    getRowTextBox,
    getSpanText,
    getDateIconText,
    getHtmlContent,
    getIconText,
    getMoveSelect,
    getMoveSelect2
}