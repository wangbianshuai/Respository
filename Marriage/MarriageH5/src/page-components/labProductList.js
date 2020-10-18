import React, { useState } from 'react';
import { Common } from 'UtilsCommon';
import { useGetDataSourceOptions } from 'UseHooks';
import Components from 'Components';
import styles from '../styles/view.scss';
import LabProductItem from './labProductItem';

const getOptions = (property, view, pageAxis, parentValue) => {
    const options = [];

    const { dataSource } = property;

    Common.isArray(dataSource) && dataSource.forEach((d, i) => {
        const props = { data: d, i, property, view, pageAxis };
        options.push(<LabProductItem {...props} key={i} />);
    });

    return options;
};

export default (props) => {
    const { Base } = Components;
    const { property, view, pageAxis } = Base.getProps(props);

    const [isVisible, setIsVisible] = useState(property.isVisible !== false);

    const [options, setOptions] = useGetDataSourceOptions(property, view, pageAxis, getOptions);

    property.setVisible = (v) => setIsVisible(v);
    property.refreshOptions = () => setOptions(getOptions(property, view, pageAxis));

    if (!isVisible) return null;

    const className = Base.getClassName(property, styles);

    return <div className={className}>
        {options}
    </div>;
}