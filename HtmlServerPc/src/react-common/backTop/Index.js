import React from "react";
import BaseIndex2 from "../BaseIndex2";
import $ from "jquery";
import { Common } from "UtilsCommon";
import Feedback from "./Feedback";

export default class Index extends BaseIndex2 {
    constructor(props) {
        super(props);
        this.state = { IsToTop: false }
    }

    componentDidMount() {
        this.$WrapBody = $("#J_wrapBody");
        const fn = () => this.BackToTop();

        this.$WrapBody.off("scroll", fn);
        this.$WrapBody.on("scroll", fn);

        this.BackToTop();
    }

    BackToTop() {
        const st = this.$WrapBody.scrollTop();
        this.setState({ IsToTop: st > 0 });
    }

    SetToTop() {
        return () => {
            this.$WrapBody.animate({ scrollTop: 0 }, 500);
            return false;
        }
    }

    ToLinkService(){
        return (e)=>{
            const token = Common.GetCookie("Token") ||"";
            const imParam = "?token=" + token + "&type=1";
            let imsrc = "//csm.xinxindai.com/csm/customer-im" + imParam;
            if (location.host.indexOf("xinxindai.com") < 0) imsrc = "//test-csm.xxd.com/csm/customer-im" + imParam;

            window.open(imsrc, "_blank");
            e && e.preventDefault();
        }
    }

    OpenFeedback(){
        return ()=>{
            this.props.Page.Dialogs.Add(<Feedback Page={this.props.Page} key={Common.CreateGuid()}/>)
        }
    }

    render() {
        const { IsToTop } = this.state;

        return (
            <div className='mui-backTop'>
                <ul className='clearfix'>
                    <li><a target='_blank' className='mui-t2' onClick={this.ToLinkService()}></a></li>
                    <li><a target='_blank' href='/html/introduce/guide.html' className='mui-t3'></a></li>
                    <li><a className='mui-feedback' onClick={this.OpenFeedback()}></a></li>
                    {IsToTop && <li><a className='mui-top' onClick={this.SetToTop()}></a></li>}
                </ul>
            </div>
        )
    }
}