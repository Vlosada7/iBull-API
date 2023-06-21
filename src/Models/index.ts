import mongoose from 'mongoose';

// const uri = 'mongodb://127.0.0.1:27017/iBull';

const uri =
	"mongodb+srv://Vlosada:abcd1234@ibull.8rhctdf.mongodb.net/";

mongoose
	.connect(uri)
	.then(() => {
		console.log("Connected to MongoDB!");
	})
	.catch((error) => {
		console.error("Error connecting to MongoDB:", error);
	});

  
export default mongoose;