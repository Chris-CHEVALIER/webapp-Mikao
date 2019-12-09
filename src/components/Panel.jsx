import React from 'react';

const Panel = ({
    children, className, title, ...props
}) => (
    <div className={`layout-panel ${className || ''}`} {...props}>
        {title && <h2 className="panel-title">{title}</h2>}
        <div className="panel-content">{children}</div>
    </div>
);

export default Panel;
