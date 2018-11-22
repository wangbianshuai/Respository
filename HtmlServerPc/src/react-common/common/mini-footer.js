import React, { Component } from "react";

export default class Footer extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <div id="J_footer" className="footer">
                <div className="footer-wrap">
                    <div className="footer-bottom">
                        <div className="text"><a href="#">Copyright @新新贷（上海）金融信息服务有限公司 沪ICP备12026657号-1 版权所有，未经许可不得复制、转载或摘编，违者必究</a><span>V6.6.1</span><br />增值电信业务经营许可证B2-20151008<i className="chapter"></i><a href="http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=31010902001060">沪公网安备 31010902001060号</a></div>
                        <div className="footer-icons">
                            <a href="http://www.shjbzx.cn/" target="_blank" className="x1"> </a>
                            <a href="http://www.itrust.org.cn/yz/pjwx.asp?wm=1057638558" target="_blank" className="x2"> </a>
                            <a href="https://ss.knet.cn/verifyseal.dll?sn=e14050731010948597brpb000000&amp;comefrom=trust&amp;trustKey=dn&amp;trustValue=www.xinxindai.com" target="_blank" className="x3"> </a>
                            <a href="https://search.szfw.org/cert/l/CX20140224003875003530" target="_blank" className="x4"> </a>
                            <a href="http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=31010902001060" target="_blank" className="x5"> </a>
                            <a href="http://www.itrust.org.cn/home/index/itrust_certifi/wm/1057638558" target="_blank" className="x6"></a>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
