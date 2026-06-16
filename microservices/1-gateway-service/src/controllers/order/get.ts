import { orderService } from '@gateway/services/api/order.service';
import { AxiosResponse } from 'axios';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

export class Get {
  public async orderId(req: Request, res: Response): Promise<void> {
    const response: AxiosResponse = await orderService.getOrderById(req.params.orderId as string);
    res.status(StatusCodes.OK).json({ message: response.data.message, order: response.data.order });
  }

  public async sellerOrders(req: Request, res: Response): Promise<void> {
    const response: AxiosResponse = await orderService.sellerOrders(req.params.sellerId as string);
    res.status(StatusCodes.OK).json({ message: response.data.message, orders: response.data.orders });
  }

  public async buyerOrders(req: Request, res: Response): Promise<void> {
    const response: AxiosResponse = await orderService.buyerOrders(req.params.buyerId as string);
    res.status(StatusCodes.OK).json({ message: response.data.message, orders: response.data.orders });
  }

  public async notifications(req: Request, res: Response): Promise<void> {
    const response: AxiosResponse = await orderService.getNotifications(req.params.userTo as string);
    res.status(StatusCodes.OK).json({ message: response.data.message, notifications: response.data.notifications });
  }
}
