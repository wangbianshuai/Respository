import { EntityPageEdit } from "PageTemplates";

export default EntityPageEdit("marriage_marriageArrange", "MarriageArrange", document.title + '-相亲安排基本信息', 1600, {
    expandInit() {
        this.marriageArrangeEditEdit = this.getProperty('marriageArrangeEditEdit');
    },
    setGetEntityDataLoad({ data }) {
        if (data.MarriageArrangeId) {
            this.marriageArrangeEditEdit.properties.forEach(p => {
                if (p.name === 'Remark' || p.name === 'buttonView') {
                    p.style = undefined;
                    p.isVisible = true;
                    p.setVisible(true)
                }
                else if (p.name === 'MarriageContent' || p.name === 'MarriageAddress' || p.name === 'MarriageDate') {
                    p.style = undefined;
                    p.isReadOnly = false;
                    p.setIsReadOnly(false)
                }
            })
        }
    }
}, ['getMarriageArrangeById']);