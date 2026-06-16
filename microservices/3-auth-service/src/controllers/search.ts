
import { gigById, gigsSearch } from '@auth/services/search.service';
import { IPaginateProps, ISearchResult } from '@rayeeskha/jobber-shared';
import { Request, Response } from 'express';
import { sortBy } from 'lodash';
import { StatusCodes } from 'http-status-codes';

export async function gigs(req: Request, res: Response): Promise<void> {
  const {  size } = req.params;
  const from = typeof req.params.from === 'string' ? req.params.from : '0';
  const type = typeof req.params.type === 'string' ? req.params.type : '';
  let resultHits: unknown[] = [];
  const paginate: IPaginateProps = { from, size: parseInt(`${size}`), type };

  const gigs: ISearchResult = await gigsSearch(
    `${req.query.query}`,
    paginate,
    `${req.query.delivery_time}`,
    parseInt(`${req.query.minPrice}`),
    parseInt(`${req.query.maxPrice}`),
  );
  for(const item of gigs.hits) {
    resultHits.push(item._source);
  }
  if (type === 'backward') {
    resultHits = sortBy(resultHits, ['sortId']);
  }
  res.status(StatusCodes.OK).json({ message: 'Search gigs results', total: gigs.total, gigs: resultHits });
}

export async function singleGigById(req: Request, res: Response): Promise<void> {
  const gig = await gigById('gigs', req.params.gigId as string);
  res.status(StatusCodes.OK).json({ message: 'Signle gig result', gig });
}
