import { Model, GroupModel } from "./mongoose.js";

export const sendMessage = () => {
   return new Promise(async (resolve, reject) => {
      try {
         const usersId = [];
         const users = await Model.find({});
         const group = await GroupModel.find({});
         await users.forEach((user) => usersId.push(user._id));
         await group.forEach((group) => usersId.push(group._id));
         resolve(usersId);
      } catch (error) {
         reject(error);
      }
   });
};
