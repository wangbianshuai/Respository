import React, { useEffect, useMemo, useRef } from "react";
import { Common } from 'UtilsCommon';
import { useDvaData } from "UseHooks";
import { Toast } from 'antd-mobile';
import styles from '../../styles/file.scss';

export default (props) => {
    const frame = useRef();
    const [dispatch, dispatchAction, setActionState, state] = useDvaData(props.app, mapStateToProps);

    const queryString = useMemo(() => {
        const queryString = Common.getQueryString();
        document.title = queryString.fileName;
        return queryString;
    }, []);

    useEffect(() => {
        const payload = {
            formData: {
                Param: JSON.stringify({ FileUID: queryString.UID }),
                Act: 'Library_GetFileHtml'
            }
        }
        dispatchAction('LibraryService', 'getFileHtml', payload).then(res => {
            if (res.FileName) {
                const current = frame.current;
                const doc = document.all ? current.contentWindow.document : current.contentDocument;
                doc.open();
                doc.write(res.Content);
                doc.close();
            }
            else Toast.fail(res.message, 2);
        });
    }, [dispatchAction, queryString, frame]);

    return (
        <div className={styles.divFile}>
            <div className={styles.divTitle}><span>{queryString.fileName}</span></div>
            <div className={styles.divFrame}>
                <iframe ref={frame}  frameBorder="0" style={{ borderRadius: '4px', border: 'dotted 1px #000', width: '100%', height: '100%', backgroundColor: '#FFFFFF' }}></iframe>
            </div>
        </div>
    )
}

function mapStateToProps(state) {
    return {
        loading: state.LibraryService.getFileHtml_loading,
        getFileHtml: state.LibraryService.getFileHtml
    }
}