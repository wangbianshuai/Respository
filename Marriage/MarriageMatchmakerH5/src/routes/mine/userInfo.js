import { EntityPageEdit } from "PageTemplates";
import { LunarDate, Common } from 'UtilsCommon';

export default EntityPageEdit("mine_userInfo", "MarriageUser", '连理缘-个人基本信息', 400, {
  expandInit() {
    this.idCardProperty = this.getProperty('IdCard');
    this.idCardProperty.valueChange = this.idCardValueChange.bind(this);
    this.birthdayProperty = this.getProperty('Birthday');
    this.birthdayProperty.valueChange = this.birthdayValueChange.bind(this);
    this.birthTimeProperty = this.getProperty("BirthTime");
    this.birthTimeProperty.valueChange = this.birthTimeValueChange.bind(this);

    this.lunarBirthdayProperty = this.getProperty('LunarBirthday');
    this.birthEightProperty = this.getProperty('BirthEight');
  },
  birthdayValueChange(value) {
    if (!value) return;
    if (!this.birthdayProperty.isLoadValue) { this.birthdayProperty.isLoadValue = true; return; }
    this.setLunarDate(value, this.birthTimeProperty.getValue());
  },
  birthTimeValueChange(value) {
    if (!value) return;
    if (!this.birthTimeProperty.isLoadValue) { this.birthTimeProperty.isLoadValue = true; return; }
    this.setLunarDate(this.birthdayProperty.getValue(), value);
  },
  setLunarDate(birthday, birthTime) {
    const date = Common.convertToDate(birthday, "yyyy-MM-dd");
    if (!date || !(date instanceof Date) || Common.isNullOrEmpty(birthTime)) return;
    if (birthTime >= 0) {
      const [lunarDate, birthEight] = new LunarDate(date).getLunarDate(birthTime);

      this.lunarBirthdayProperty.setValue(lunarDate);
      this.birthEightProperty.setValue(birthEight);
    }
  },
  idCardValueChange(value) {
    if (!value) return;
    if (!this.idCardProperty.isLoadValue) { this.idCardProperty.isLoadValue = true; return; }
    if (!value || value.length < 14) return;

    var year = value.substr(6, 4);
    var month = value.substr(10, 2);
    var day = value.substr(12, 2);

    var date = year + '-' + month + '-' + day;
    this.birthdayProperty.setValue(date);
  }
}, ['updateUserInfo', 'ResourcesService/uploadFile']);