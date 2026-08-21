import mongoose from "mongoose";
import {DB_NAME} from "../constant.js"

const connectDB  = async ()=>{
    try{
        const connectionInstance = await mongoose.connect(`${process.env.MONGO_URI}/${DB_NAME}`)
        console.log(`\n Mongo connected: ${connectionInstance.connection.host} \n`)
    }catch(error){
        console.log("ERROR:", error);
        process.exit(1);
    }
}


export default connectDB