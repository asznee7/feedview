export interface NewsEntity {
  source: {
    id: string | null;
    name: string;
  };
  author: string;
  title: string;
  description: string;
  url: string;
  urlToImage: string;
  publishedAt: string;
  content: string;
  sentiment: {
    score: number;
  };
}

export interface IWSMessage<T = any> {
  data: T[];
  event: 'news';
}
