import React, { useState, useRef } from 'react';

export default React.memo((props) => {
    const { property, } = props;
    const [isVisible, setIsVisible] = useState(property.isVisible !== false);
    const inputFile = useRef(null);

    property.setVisible = (v) => setIsVisible(v);
    property.setValue = (v) => inputFile.current.value = v;
    property.getValue = () => inputFile.current.files.length > 0 ? inputFile.current.files[0] : null;

    if (!isVisible) return null;

    return (
        <input type='file' accept={property.accept} ref={inputFile} />
    )
});