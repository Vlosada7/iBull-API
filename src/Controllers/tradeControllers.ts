import { Request, Response } from "express";
import TradeModel from "../Models/Trades";

async function getLastTradeId(): Promise<number> {
  try {
    const lastTrade = await TradeModel.findOne().sort({ id: -1 }).exec();
    return lastTrade ? lastTrade.id : 0;
  } catch (error) {
    console.error('Erro ao buscar o último ID de trade:', error);
    throw error;
  }
}

const postTrade = async (req: Request, res: Response) => {
  const { type, user_id, symbol, shares, price } = req.body;
  if (type && user_id && symbol && shares && price) {
    if (price < 1 || price > 100) {
      res.status(400).send({ message: "Unaccepted price range" });
    } else if (type !== "buy" && type !== "sell") {
      res.status(400).send({ message: "Invalid type for the trade" });
    } else {
      try {
        const timestamp = Date.now();
        const lastTrade = await getLastTradeId(); 
        const newTrade = await TradeModel.create({ id: lastTrade + 1, type, user_id, symbol, shares, price, timestamp });
        res.status(201).send({
          message: "Trade created correctly",
          id: newTrade.id,
          symbol: newTrade.symbol,
          shares: newTrade.shares,
          price: newTrade.price,
        });
      } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Unexpected API error" });
      }
    }
  } else {
    res.status(400).send({ message: "Missing parameter to create a trade" });
  }
};


const getTrade = async (req: Request, res: Response) => {
  const { type, user_id } = req.query;
  let trades;
  if (type && user_id) {
    try {
      trades = await TradeModel.find({ type, user_id }).exec();
      if (trades.length === 0) {
        res.status(404).send({message: "Trade not found"});
      } else {
        res.status(200).send(trades);
      }
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: "Unexpected API error" });
    }
  } else {
    try {
      trades= await TradeModel.find().exec();
      if (trades.length === 0) {
        res.status(200).send({message: "Not trades yer"});
      } else {
        res.status(200).send(trades);
      }
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: "Unexpected API error" });
    }
  }
};

const getTradeById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const trade = await TradeModel.findOne({ id }).exec();
    if (trade) {
      res.status(200).send(trade);
    } else {
      res.status(404).send({ message: "There is no trade with the given id in the collection" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Unexpected API error" });
  }
};


const deleteTrade = async (req: Request, res: Response) => {
  const { id } = req.params;
  if (id) {
    try {
      const trade = await TradeModel.findOne({ id }).exec();
      if (trade) {
        await TradeModel.deleteOne({ id }).exec();
        res.status(204).send({ message: `Trade with ${id} successfully deleted`});
      } else {
        res.status(404).send({ message: "There is no trade with the given id in the collection" });
      }
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: "Unexpected API error" });
    }
  } else {
    res.status(400).send({ message: "Parameter is missing to delete a trade" });
  }
};


export { postTrade, getTrade, getTradeById, deleteTrade };
