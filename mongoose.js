import mongoose from "mongoose";

mongoose.set("strictQuery", false);
const Schema = mongoose.Schema(
   {
      _id: {
         type: String,
         default: Math.floor(Math.random() * 1000000 + 1),
      },
      username: {
         type: String,
      },
      name: {
         type: String,
      },
      messages: {
         type: Array,
         default: [],
      },
   },
   {
      timestamps: true,
   }
);

const SchemaChat = mongoose.Schema(
   {
      _id: {
         type: String,
         default: Math.floor(Math.random() * 1000000 + 1),
      },
      title: {
         type: String,
      },
      username: {
         type: String,
      },
      messages: {
         type: Array,
         default: [],
      },
   },
   {
      timestamps: true,
   }
);

export const Model = mongoose.model("User", Schema);
export const GroupModel = mongoose.model("group", Schema);

