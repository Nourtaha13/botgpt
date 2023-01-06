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

const SchemaViews = mongoose.Schema({
   _id: {
      type: String,
      default: Math.floor(Math.random() * 1000000 + 1),
   },
   page: {
      type: String,
      default: "home"
   },
   views: {
      type: Number,
      default: 0
   }
}, {
   timestamps: true,
})

export const Model = mongoose.model("User", Schema);
export const GroupModel = mongoose.model("group", Schema);
export const ViewsModel = mongoose.model("views", SchemaViews);

