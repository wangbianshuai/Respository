import React, { useCallback } from 'react';
import { Common } from 'UtilsCommon';
import { List, Modal } from 'antd-mobile';
import Controls from 'Controls';
import styles from '../styles/view.scss';


const showConfirm = (title, content, onOk) => {
    const alertInstance = Modal.alert(title, content, [
        { text: '取消', style: 'default' },
        { text: '确定', onPress: () => onOk(alertInstance) },
    ]);
};

const updateMarriageSquareRoseCount = (pageAxis, property, isSend, modal) => {
    if (property.isLoading) return;
    const userId = pageAxis.pageData.userId;
    property.isLoading = true;
    pageAxis.dispatchAction('MarriageSquareService', 'updateMarriageSquareRoseCount', { isSend, userId }).then(res => {
        property.isLoading = false;
        if (pageAxis.isSuccessProps(res)) {
            if (modal) modal.close();
            pageAxis.updateRoseCount && pageAxis.updateRoseCount(isSend);
        }
        else pageAxis.alert(res.message);
    });
}

export default (props) => {
    const { property, pageAxis } = Controls.Base.getProps(props);

    const onClick = useCallback(() => {
        updateMarriageSquareRoseCount(pageAxis, property, true)
    }, [pageAxis, property]);

    const onCancel = useCallback(() => {
        showConfirm('取消赠送', '确认要取消赠送吗?', (modal) => updateMarriageSquareRoseCount(pageAxis, property, false, modal))
    }, [pageAxis, property]);

    const className = Controls.Base.getClassName(property, styles);

    const roseImg = Common.getImageUrl('rose.png');

    if (property.isCancel) {
        return <List className={className}>
            <List.Item onClick={onCancel}>取消赠送</List.Item>
        </List>
    }

    return <List className={className}>
        <List.Item onClick={onClick}><img src={roseImg} alt='' />赠送玫瑰<img src={roseImg} alt='' />
            <List.Item.Brief>赠送玫瑰表示对对方有好感，如果彼此互赠送玫瑰，表示可安排相亲</List.Item.Brief>
        </List.Item>
    </List>
}