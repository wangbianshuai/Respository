import { EntityPageEdit } from "PageTemplates";

export default EntityPageEdit("marriage_userPhoto", "MarriageArrangeUserPhoto", document.title + '-生活照', 2400,{
  expandInit() {
    const editView = this.getProperty('userPhotoEditEdit');
    editView.entity.params = { marriageArrangeId: this.pageData.marriageArrangeId };
  },
});