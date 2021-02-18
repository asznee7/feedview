import { useEffect, useRef, useState } from 'react';
import useStore from './useStore';
import { IWSMessage } from '../types';

interface IUseSocket {
  sendQuery: (query: string) => void;
}

export default function useSocket(): IUseSocket {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const ws = useRef<WebSocket | null>(null);

  const { setNews } = useStore((store) => store);

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

  useEffect(() => {
    ws.current = new WebSocket(process.env.REACT_APP_WS as string);
    ws.current.onopen = () => {
      setIsOpen(true);
      console.log('ws opened');
    };
    ws.current.onclose = () => {
      setIsOpen(false);
      console.log('ws closed');
    };

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
        default: {
          console.log('uknown message');
        }
      }
    };
  }, [isOpen, setNews]);

  return { sendQuery };
}
