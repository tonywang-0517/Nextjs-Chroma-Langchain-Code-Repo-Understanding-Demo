import { Chat } from '@/components/Chat/Chat';
import { Footer } from '@/components/Layout/Footer';
import { Navbar } from '@/components/Layout/Navbar';
import { Message } from '@/types';
import Head from 'next/head';
import { useEffect, useRef, useState } from 'react';

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // const handleSend = async (message: Message) => {
  //   const updatedMessages = [...messages, message];

  //   setMessages(updatedMessages);
  //   setLoading(true);

  //   const response = await fetch('/api/chat', {
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'application/json',
  //     },
  //     body: JSON.stringify({
  //       messages: updatedMessages,
  //     }),
  //   });

  //   if (!response.ok) {
  //     setLoading(false);
  //     throw new Error(response.statusText);
  //   }

  //   const data = response.body;

  //   if (!data) {
  //     return;
  //   }

  //   setLoading(false);

  //   const reader = data.getReader();
  //   const decoder = new TextDecoder();
  //   let done = false;
  //   let isFirst = true;

  //   while (!done) {
  //     const { value, done: doneReading } = await reader.read();
  //     done = doneReading;
  //     const chunkValue = decoder.decode(value);

  //     if (isFirst) {
  //       isFirst = false;
  //       setMessages((messages) => [
  //         ...messages,
  //         {
  //           sender: 'assistant',
  //           text: chunkValue,
  //         },
  //       ]);
  //     } else {
  //       setMessages((messages) => {
  //         const lastMessage = messages[messages.length - 1];
  //         const updatedMessage = {
  //           ...lastMessage,
  //           content: lastMessage.text + chunkValue,
  //         };
  //         return [...messages.slice(0, -1), updatedMessage];
  //       });
  //     }
  //   }
  // };

  const handleSend = async (message: Message) => {
    if (!message.text.trim()) return;

    setMessages((prevMessages) => [...prevMessages, message]);
    setLoading(true);

    try {
      const response = await fetch('/api/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: message.text }),
      });

      const data = await response.json();
      const botMessage: Message = { sender: 'assistant', text: data.reply };

      setMessages((prevMessages) => [...prevMessages, botMessage]);
    } catch (error) {
      const errorMessage: Message = {
        sender: 'assistant',
        text: 'Sorry, there was an issue processing your request. Please try again later.',
      };
      setMessages((prevMessages) => [...prevMessages, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setMessages([
      {
        sender: 'assistant',
        text: `Hi! I am your assistant for the Spark repositories. Let me know how I can help you navigate or understand its code logic.`,
      },
    ]);
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    setMessages([
      {
        sender: 'assistant',
        text: `Hi! I am your assistant for the Spark repository. Let me know how I can help you navigate or understand its code logic.`,
      },
    ]);
  }, []);

  return (
    <>
      <Head>
        <title>Spark Repositories Chatbot</title>
        <meta name='description' content='' />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <div className='flex flex-col h-screen'>
        <Navbar />

        <div className='flex-1 pb-4 overflow-auto sm:px-10 sm:pb-10'>
          <div className='max-w-[800px] mx-auto mt-4 sm:mt-12'>
            <Chat
              messages={messages}
              loading={loading}
              onSend={handleSend}
              onReset={handleReset}
            />
            <div ref={messagesEndRef} />
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
}
