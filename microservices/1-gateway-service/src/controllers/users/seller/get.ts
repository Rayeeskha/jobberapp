import { AxiosResponse } from 'axios';
import { StatusCodes } from 'http-status-codes';
import { Request, Response } from 'express';
import { sellerService } from '@gateway/services/api/seller.service';

export class Get {
  public async id(req: Request, res: Response): Promise<void> {
    const response: AxiosResponse = await sellerService.getSellerById(
      req.params.sellerId as string,
    );
    res
      .status(StatusCodes.OK)
      .json({ message: response.data.message, seller: response.data.seller });
  }

  public async username(req: Request, res: Response): Promise<void> {
    const response: AxiosResponse = await sellerService.getSellerByUsername(
      req.params.username as string,
    );
    res
      .status(StatusCodes.OK)
      .json({ message: response.data.message, seller: response.data.seller });
  }

  public async random(req: Request, res: Response): Promise<void> {
    const response: AxiosResponse = await sellerService.getRandomSellers(
      req.params.size as string,
    );
    res
      .status(StatusCodes.OK)
      .json({ message: response.data.message, sellers: response.data.sellers });
  }
}
