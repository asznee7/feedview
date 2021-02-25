import create, { State } from 'zustand';
import { persist } from 'zustand/middleware';
import { NewsEntity, TweetEntity } from '../types';

interface AppStore extends State {
  query: string;
  news: NewsEntity[];
  tweets: TweetEntity[],
  lastUpdated: string | null;
  getQuery: () => string;
  setQuery: (q: string) => void;
  setNews: (news: NewsEntity[]) => void;
  setTweets: (tweets: TweetEntity[]) => void;
  setLastUpdated: (date: string) => void;
}

const useStore = create<AppStore>(
  persist(
    (set, get) => {
      return {
        query: '',
        news: [],
        tweets: [],
        lastUpdated: null,
        getQuery: () => get()?.query,
        setQuery: (query: string) => set({ query }),
        setNews: (news) => set({ news, lastUpdated: new Date().toISOString() }),
        setTweets: (tweets) => set({ tweets, lastUpdated: new Date().toISOString() }),
        setLastUpdated: (date) => set({ lastUpdated: date }),
      };
    },
    { name: 'app-storage' },
  ),
);

export default useStore;
