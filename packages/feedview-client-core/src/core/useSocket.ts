import { useEffect, useRef, useState } from 'react';
import useStore from './useStore';
import { IWSMessage } from '../types';
import { v4 as uuidv4 } from 'uuid';

interface IUseSocket {
  sendQuery: (query: string) => void;
}

export default function useSocket(): IUseSocket {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const ws = useRef<WebSocket | null>(null);

  const { setNews, setTweets } = useStore((store) => store);

  function sendQuery(query: string) {
    if (isOpen && ws.current?.OPEN) {
      ws.current?.send(
        JSON.stringify({
          event: 'query',
          data: query,
        }),
      );
    }
  }

  function createConnection() {
    ws.current = new WebSocket(process.env.REACT_APP_WS as string);
    ws.current.onopen = () => {
      setIsOpen(true);

      const clientId = localStorage.getItem('fv-app-id') || uuidv4();

      ws.current?.send(
        JSON.stringify({
          event: 'registration',
          data: clientId,
        }),
      );

      localStorage.setItem('fv-app-id', clientId);

      console.log('ws opened');
    };
    ws.current.onclose = () => {
      setIsOpen(false);
      console.log('ws closed');
    };
  }

  useEffect(() => {
    const callback = () => createConnection();

    let interval: NodeJS.Timeout;

    if (!isOpen) {
      interval = setInterval(callback, 10 * 1000);
    }

    return () => clearInterval(interval);
  }, [isOpen]);

  useEffect(() => {
    createConnection();

    return () => {
      ws.current?.close();
    };
  }, []);

  useEffect(() => {
    if (!ws.current) return;

    ws.current.onmessage = (e) => {
      if (!isOpen) return;
      const message: IWSMessage<any> = JSON.parse(e.data);
      switch (message.event) {
        case 'news': {
          console.log(message.data);
          setNews(message.data);
          break;
        }
        case 'twitter': {
          console.log(message.data);
          setTweets(message.data);
          break;
        }
        default: {
          console.log('uknown message');
        }
      }
    };
  }, [isOpen, setNews, setTweets]);

  return { sendQuery };
}
