import React from 'react';
import Markdown from 'react-markdown';
import SyntaxHighlighter from 'react-syntax-highlighter/dist/cjs/prism';
import { dark } from 'react-syntax-highlighter/dist/cjs/styles/prism';



type MarkdownComponentProps = {
  markdown: string;
};

const MarkdownComponent:React.FC<MarkdownComponentProps> = ({ markdown }) => {
  return (
    <Markdown
      // eslint-disable-next-line react/no-children-prop
      children={markdown}
      components={{
        code(props) {
          const { children, className, node, ...rest } = props;
          const match = /language-(\w+)/.exec(className || '');
          return match ? (
            <SyntaxHighlighter
              {...rest}
              PreTag='div'
              // eslint-disable-next-line react/no-children-prop
              children={String(children).replace(/\n$/, '')}
              language={match[1]}
              style={dark}
            />
          ) : (
            <code {...rest} className={className}>
              {children}
            </code>
          );
        },
      }}
    />
  );
};

export default MarkdownComponent;
