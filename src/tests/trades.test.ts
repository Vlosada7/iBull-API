import request from "supertest";
import { describe } from "node:test";
import TradeModel from "../Models/Trades";
import mongoose from "mongoose";



const URL = "http://localhost:3002";

const mockTradeBuy = {
	type: "buy",
	user_id: 7,
	symbol: "ABX",
	shares: 30,
	price: 77,
};
const mockTradeSell = {
	type: "sell",
	user_id: 77,
	symbol: "ABX",
	shares: 30,
	price: 77,
};
const mockTradeSell1 = {
	type: "sell",
	user_id: 777,
	symbol: "ABA",
	shares: 30,
	price: 77,
};
const mockTradeMissingParameter = {
	type: "buy",
	user_id: 77,
	symbol: "ABX",
	price: 30,
};
const mockTradeWrongType = {
	type: "bu",
	user_id: 77,
	symbol: "ABX",
	shares: 30,
	price: 77,
};
const mockTradeWrongPriceUp = {
	type: "buy",
	user_id: 77,
	symbol: "ABX",
	shares: 30,
	price: 101,
};
const mockTradeWrongPriceDown = {
	type: "buy",
	user_id: 77,
	symbol: "ABX",
	shares: 30,
	price: 0,
};

describe("Post Trade", () => {
  beforeAll(async () => {
    await mongoose.connect('mongodb://127.0.0.1:27017/iBull');
  });
  afterAll(async () => {
    await mongoose.disconnect();
  })
	it("Should return 400 if some parameter is missing", async () => {
		const res = await request(URL)
			.post("/trades")
			.send(mockTradeMissingParameter);
		expect(res.status).toBe(400);
		expect(res.body.message).toEqual("Missing parameter to create a trade");
	});
	it("Should return 400 with all parameters passed but the price is less than 1", async () => {
		const res = await request(URL)
			.post("/trades")
			.send(mockTradeWrongPriceDown);
		expect(res.status).toBe(400);
		expect(res.body.message).toEqual("Unaccepted price range");
	});
	it("Should return 400 with all parameters passed but the price is greater than 100", async () => {
		const res = await request(URL).post("/trades").send(mockTradeWrongPriceUp);
		expect(res.status).toBe(400);
		expect(res.body.message).toEqual("Unaccepted price range");
	});
	it("Should return 400 with all parameters passed but the type is not 'buy' or 'sell'", async () => {
	  const res = await request(URL).post("/trades").send(mockTradeWrongType);
	  expect(res.status).toBe(400);
	  expect(res.body.message).toEqual("Invalid type for the trade");
	})
  it("Should post a trade if all the parameters are there and are correct and return with 201 code", async () => {
    const res = await request(URL).post("/trades").send(mockTradeBuy);
    expect(res.status).toBe(201);
    expect(res.body.message).toEqual("Trade created correctly");
    expect(res.body.symbol).toEqual(mockTradeBuy.symbol);
    expect(res.body.shares).toEqual(mockTradeBuy.shares);
    expect(res.body.price).toEqual(mockTradeBuy.price);
  });
  it("Should autoincrement the ID by one every new trade", async () => {
    const res = await request(URL).post("/trades").send(mockTradeSell);
    const lastId = res.body.id;
    const res1 = await request(URL).post("/trades").send(mockTradeSell1);
    expect(res1.body.id).toBe(lastId + 1);
  })
});

describe("Delete Trade", () => {
  beforeAll(async () => {
    await mongoose.connect('mongodb://127.0.0.1:27017/iBull');
  });
  afterAll(async () => {
    await mongoose.disconnect();
  })
  it ("Should return 404 if passed some id who doesn exist", async () => {
    const trades = await TradeModel.find();
    const id = trades.length * 5;
    const res = await request(URL).delete(`/trades/${id}`);
    expect(res.status).toBe(404);
    expect(res.body.message).toEqual("There is no trade with the given id in the collection");
  })
  it ("Should return 400 if no id is passed", async () => {
    const res = await request(URL).delete("/trades/");
    expect(res.status).toBe(404);
  })
  it ("Should delete a trade with the correct id", async () => {
    const lastTrade = await TradeModel.findOne().sort({id: -1}).exec();
    if (lastTrade) {
      const id = lastTrade.id;
      const res = await request(URL).delete(`/trades/${id}`);
      expect(res.status).toBe(204);
    }
  })
});

describe("Get Trade", () => {
  beforeAll(async () => {
    await mongoose.connect('mongodb://127.0.0.1:27017/iBull');
  });
  afterAll(async () => {
    await mongoose.disconnect();
  })

  it("Should return a list with all trades if has no query and status 200", async () => {
    const trades = await TradeModel.find().lean().exec();
    const res = await request(URL).get("/trades/");
    expect(res.status).toBe(200);
    expect(res.body).toEqual(trades);
  })
  it("Should return all sell trades if passed in query", async () => {
    const sellTrades = await TradeModel.find({ type: "sell" });
    const res = await request(URL).get("/trades/?type=sell");
    expect(res.status).toBe(200);
    expect(JSON.stringify(res.body)).toEqual(JSON.stringify(sellTrades));
  })
  it("Should return all trades from an specific user_id if passed in query", async () => {
    const specTrade = await TradeModel.find({user_id: 7});
    const res = await request(URL).get("/trades/?user_id=7");
    expect(res.status).toBe(200);
    expect(JSON.stringify(res.body)).toEqual(JSON.stringify(specTrade));
  })
  it("Should return all buy trades from an specific user_id if passed in query", async () => {
    const trades = await TradeModel.find({type: "buy", user_id: 7});
    const res = await request(URL).get("/trades/?type=buy&user_id=7");
    expect(res.status).toBe(200);
    expect(JSON.stringify(res.body)).toEqual(JSON.stringify(trades));
  })
})
