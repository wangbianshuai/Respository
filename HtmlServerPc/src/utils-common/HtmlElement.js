export default class {
    constructor(ele) {
        this.Element = ele;
    }

    GetOffset() {
        const elem = this.Element;
        if (!elem.getClientRects().length) return { top: 0, left: 0 };

        const rect = elem.getBoundingClientRect();
        const win = elem.ownerDocument.defaultView;
        return {
            top: rect.top + win.pageYOffset,
            left: rect.left + win.pageXOffset
        };
    }
}