import create, { State } from 'zustand';
import { persist } from 'zustand/middleware';
import { NewsEntity, TweetEntity } from '../types';

interface AppStore extends State {
  query: string;
  news: NewsEntity[];
  tweets: TweetEntity[],
  lastUpdatedNews: string | null;
  lastUpdatedTwitter: string | null;
  getQuery: () => string;
  setQuery: (q: string) => void;
  setNews: (news: NewsEntity[]) => void;
  setTweets: (tweets: TweetEntity[]) => void;
}

const useStore = create<AppStore>(
  persist(
    (set, get) => {
      return {
        query: '',
        news: [],
        tweets: [],
        lastUpdatedNews: null,
        lastUpdatedTwitter: null,
        getQuery: () => get()?.query,
        setQuery: (query: string) => set({ query }),
        setNews: (news) => set({ news, lastUpdatedNews: new Date().toISOString() }),
        setTweets: (tweets) => set({ tweets, lastUpdatedTwitter: new Date().toISOString() }),
      };
    },
    { name: 'app-storage' },
  ),
);

export default useStore;
