import { EntityPageEdit } from "PageTemplates";
import { ActionSheet } from 'antd-mobile';
import { EnvConfig } from 'Configs';
import { Common } from 'UtilsCommon';

export default EntityPageEdit("detail_library", "Library", '文档详情', 600, {
  expandInit() {
    this.recommendReadProperty = this.getProperty('recommendRead');
    this.favoritesStartProperty = this.getProperty('favoritesStart');
  },
  setGetEntityDataLoad({ data, props, action }) {
    this.entityData = data;
    const { LibraryTypeUID, ApplicationUIDs, UID, Files } = data;
    if (!UID) return;

    this.lookFileOptions = [];
    this.downloadFileOptions = [];

    let look = false;
    let download = false;
    if (!this.token) {
      look = Files.length > 0;
      download = look;
      this.lookFileOptions = Files;
      this.downloadFileOptions = Files;
    }
    else {
      const { UserType } = this.loginUser;
      Files.forEach(f => {
        if (f.WhoCanRead === 0 || f.WhoCanRead <= UserType) this.lookFileOptions.push(f);
        if (f.WhoCanDownload === 0 || f.WhoCanDownload <= UserType) this.downloadFileOptions.push(f)
      });
      look = this.lookFileOptions.length > 0;
      download = this.downloadFileOptions.length > 0;
    }

    let consult = this.pageData.tabPage === '4';

    this.props.location.pageData.setBottomButtonVisibles({ look, download, consult });

    let ApplicationUID = '';

    if (ApplicationUIDs) {
      const ids = ApplicationUIDs.split(',');
      if (ids.length = 1) ApplicationUID = ids[0];
      else {
        const index = Math.floor(Math.random() * ids.length);
        ApplicationUID = ids[index];
      }
    }

    const param = {
      LibraryIndex: "ClicksDesc", PageSize: 4, PageNumber: 1,
      LibraryTypeUID,
      ApplicationUID
    };

    const payload = {
      formData: {
        Param: JSON.stringify(param),
        Act: 'Library_GetList'
      }
    };

    this.dispatchAction('LibraryService', 'getLibraryRelations', payload).then(res => {
      if (this.isSuccessProps(res)) {
        this.recommendReadProperty.dataSource = res.List.filter(f => f.UID !== UID);
        this.recommendReadProperty.refreshOptions();
      }
    });
  },
  //查看
  look() {
    if (this.lookFileOptions.length === 0) return;

    ActionSheet.showActionSheetWithOptions({
      options: this.lookFileOptions.map(m => m.FileName),
      title: '查看文件列表'
    }, (index, rowIndex) => {
      if (index >= 0) {
        const file = this.lookFileOptions[index];
        if (file.WhoCanRead !== 0 && !this.token) {
          this.toLogin();
          return;
        }
        if (Common.getFileExt(file.FileName) === 'pdf' && this.pageData.openId) {
          const url = `/miniSite/pdf/web/viewer.html?fileId=${file.UID}`;
          Common.setStorage(file.UID, JSON.stringify({ fileName: file.FileName, url: file.Url }));
          window.location.href = url;
        }
        else {
          const url = `/file/index?UID=${file.UID}&fileName=${escape(file.FileName)}`;
          this.toPage(url);
        }
      }
    });
  },
  //下载
  download() {
    if (this.downloadFileOptions.length === 0) return;

    ActionSheet.showActionSheetWithOptions({
      options: this.downloadFileOptions.map(m => m.FileName),
      title: '下载文件列表'
    }, (index, rowIndex) => {
      if (index >= 0) {
        const file = this.downloadFileOptions[index];
        if (file.WhoCanRead !== 0 && !this.token) {
          this.toLogin();
          return;
        }

        const payload = {
          formData: {
            Param: JSON.stringify({ FileUID: file.UID }),
            Act: 'Library_DownloadFile'
          }
        };
        this.dispatchAction('LibraryService', 'downloadFile', payload).then(res => {
          if (res.KeyUID) this.downloadFile(res.KeyUID)
          else this.alert(res.message)
        })
      }
    });
  },
  downloadFile(KeyUID) {
    const url = EnvConfig.getServiceUrl('ApiService')() + 'FileDownload.ashx';

    var form = document.createElement("form");
    form.method = "post";
    form.action = url;
    form.target = "_self";

    var input = document.createElement("input");
    input.type = "hidden";
    input.name = "KeyUID";
    input.value = KeyUID;
    form.appendChild(input);

    document.body.appendChild(form);
    form.submit();
    document.body.removeChild(form);
  },
  //咨询
  consult() {
    if (!this.judgeLogin()) return;

    this.invokeEventAction('showDialogConsultView', { pageAxis: this, property: { param: this.entityData } })
  },
  consultFailed({ data, props, action }) {
    if (!this.validationCodeProperty) {
      const { editView } = action.parameters;

      this.validationCodeProperty = this.getViewProperty(editView, 'ValidationCode');
    }

    this.validationCodeProperty.refreshVerifyUrl();
  },
  //收藏
  collect({ isCollect }) {
    if (!this.judgeLogin()) return;

    if (this.entityData.UID) {
      this.eventActions.page.collect({ isCollect, actionType: 602, favoritesStart: this.favoritesStartProperty, pageAxis: this }, {});
    }
  }
}, ['UserService/collect', 'consult', 'downloadFile', 'getLibraryRelations', 'getRandomUID']);