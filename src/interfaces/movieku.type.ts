interface ISeries {
  id?: string;
  title?: string;
  url?: string;
}

export interface ISeriesList {
  category: string;
  seriesList: ISeries[];
}

export interface ITVSeries {
  title: string;
  genre: string[];
  country: string;
  dateCreated?: string;
}

export interface IFilter {
  name: string;
  value: string;
}