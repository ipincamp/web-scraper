import axios from 'axios';
import { load } from 'cheerio';
import { Agent } from 'https';
import globalVariables from '../utils/globalVariables';
import {
  type IFilter,
  type ISeriesList,
  type ITVSeries,
} from '../interfaces/movieku.type';

const hostname = 'https://107.152.37.223';

const seriesList = async (): Promise<ISeriesList[]> => {
  try {
    const requestList = await axios({
      method: 'GET',
      url: `${hostname}/series-list/`,
      headers: {
        'User-Agent': globalVariables.userAgent,
      },
      httpsAgent: new Agent({ rejectUnauthorized: false }),
    });

    if (requestList.status !== 200) {
      throw new Error("Failed to get lists")
    }

    const $ = load(requestList.data);
    const result: ISeriesList[] = $('.blc')
      .map((_, blc) => {
        const $blc = $(blc);

        return {
          category: $blc.find('a[name]').text().trim(),
          seriesList: $blc
            .find('li')
            .map((__, li) => {
              const $series = $(li).find('a.series');

              return {
                id: $series.attr('rel'),
                title: encodeURIComponent($series.text().trim()),
                url: $series.attr('href'),
              };
            })
            .get(),
        };
      })
      .get();

    return result;
  } catch (error: any) {
    throw new Error(error);
  }
};

const onGoing = async (): Promise<ITVSeries[]> => {
  try {
    const requestList = await axios({
      method: 'GET',
      url: `${hostname}/ongoing/`,
      headers: {
        'User-Agent': globalVariables.userAgent,
      },
      httpsAgent: new Agent({ rejectUnauthorized: false }),
    });

    if (requestList.status !== 200) {
      throw new Error("Failed to get lists")
    }

    const $ = load(requestList.data);
    const result: ITVSeries[] = [];

    $('.latest .box').each((_, el) => {
      result.push({
        title: $(el).find('.entry-title').text(),
        genre: $(el)
          .find('.g')
          .text()
          .split(',')
          .map((genre) => genre.trim()),
        country: $(el).find('.c a').text(),
        dateCreated: $(el).find('[itemprop="dateCreated"]').attr('datetime'),
      });
    });

    return result;
  } catch (error: any) {
    throw new Error(error);
  }
};

const advancedSearch = async (): Promise<Record<string, IFilter[]>> => {
  try {
    const response = await axios({
      method: 'GET',
      url: `${hostname}/advanced-search/`,
      headers: {
        'User-Agent': globalVariables.userAgent,
      },
      httpsAgent: new Agent({ rejectUnauthorized: false }),
    });

    if (response.status !== 200) {
      throw new Error("Failed to get lists")
    }

    const html = (await response.data) as string;
    const $ = load(html);

    const getFilterList = (selector: string): IFilter[] => {
      return $(`${selector} ul.checkbox li`)
        .map((_, el) => ({
          name: $(el).find('label').text(),
          value: $(el).find('input[type="checkbox"]').attr('value') || '',
        }))
        .get();
    };

    const sortList = $('input[type="radio"]')
      .map((_, el) => ({
        name: $(el).next('label').text().trim(),
        value: $(el).attr('value') || '',
      }))
      .get();

    const filters = ['genre', 'country', 'type', 'status', 'quality', 'year'];

    const filterValues: Record<string, IFilter[]> = {};

    filters.forEach((filter) => {
      const key = filter === 'year' ? `${filter}s[]` : `${filter}[]`;
      filterValues[key] = getFilterList(`div.filter-${filter}`);
    });

    return {
      order: sortList,
      ...filterValues,
    };
  } catch (error: any) {
    throw new Error(error);
  }
};

// TODO: search with query

export { seriesList, onGoing, advancedSearch };
