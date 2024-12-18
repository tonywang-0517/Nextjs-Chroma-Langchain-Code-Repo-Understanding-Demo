import { Message } from '@/types';
import { FC } from 'react';
import MarkdownComponent from './Markdown';

interface Props {
  message: Message;
}

export const ChatMessage: FC<Props> = ({ message }) => {
  return (
    <div
      className={`flex flex-col ${
        message.sender === 'assistant' ? 'items-start' : 'items-end'
      }`}
    >
      <div
        className={`flex items-center ${
          message.sender === 'assistant'
            ? 'bg-neutral-200 text-neutral-900'
            : 'bg-blue-500 text-white'
        } rounded-2xl px-3 py-2 max-w-[67%] whitespace-pre-wrap`}
        style={{ overflowWrap: 'anywhere' }}
      >
        <div className='flex flex-col w-full overflow-auto'>
          <MarkdownComponent markdown={message.text} />
        </div>
      </div>
    </div>
  );
};
