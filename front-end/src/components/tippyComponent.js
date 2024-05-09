import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';

const StringContent = ({children, title}) => (
    <Tippy content={title} delay={200}>
        {children}
    </Tippy>
);

export default StringContent


