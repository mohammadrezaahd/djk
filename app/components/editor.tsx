import React from 'react';

const Editor = React.forwardRef((props, ref) => {
  return <div ref={ref as React.RefObject<HTMLDivElement>}></div>;
});

export default Editor;