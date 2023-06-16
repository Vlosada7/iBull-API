import { Request, Response } from "express";

const postTrade = async (req: Request, res: Response) => {
	res.status(200).send("Post Trade working");
};

const getTrade = async (req: Request, res: Response) => {
	res.status(200).send("get Trade working");
};

const getTradeById = async (req: Request, res: Response) => {
	res.status(200).send("get by id Trade working");
};

const deleteTrade = async (req: Request, res: Response) => {
	res.status(200).send("delete Trade working");
};

export { postTrade, getTrade, getTradeById, deleteTrade };
