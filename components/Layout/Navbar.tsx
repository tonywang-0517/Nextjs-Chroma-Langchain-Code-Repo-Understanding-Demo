import { FC } from 'react';

export const Navbar: FC = () => {
  return (
    <div className='flex h-[50px] sm:h-[60px] border-b border-neutral-300 py-2 px-2 sm:px-8 items-center justify-between'>
      <div className='flex items-center text-3xl font-bold'>
        Spark Repositories Chatbot
      </div>
    </div>
  );
};
