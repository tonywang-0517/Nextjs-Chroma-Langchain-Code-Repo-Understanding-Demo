// pages/index.js
import Head from 'next/head';
import Chatbot from '../components/Chatbot'

export default function Home() {
  return (
      <div>
        <Head>
          <title>Chat Bot</title>
        </Head>
          <main style={{maxWidth: '600px', margin: '0 auto', padding: '20px'}}>
              <h1 style={{textAlign: 'center'}}>Chat Bot</h1>
              <Chatbot/>
          </main>
      </div>
  );
}
