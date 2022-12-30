import TeleBot from "telebot";
import { openAiDate } from "./openai.js";
import { connect } from "./config.js";
import { Model, GroupModel } from "./mongoose.js";
import { sendMessage } from "./sendMessage.js";
export const botTele = async () => {
   connect();
   const token = process.env.TELEBOT_TOKEN;
   const bot = new TeleBot(token, { polling: true });
   try {
      // bot.sendMessage(-1001419964099, "fuck all");
      const getIds = await sendMessage();
//       getIds.forEach((id) => {
//          new Promise(async (_) => {
//             try {
//               bot.sendMessage(id, `لو في اي مشاكل او اخطاء تحدث مع المطور
// @Noureldin13`).catch((err) =>
//                   console.log(err)
//               );
//             } catch (error) {
//               console.log(error);
//             }
//          });
      // });
      await bot.on("/start", async (msg) => {
         new Promise(async (_) => {
            try {
               bot.sendMessage(
                  msg.chat.id,
                  `Hello, ${msg.from.first_name}!
Enter the message and the OpenAI bot will answer you!
Just for experience, the answers may be different and not correct.\n
This bot uses OpenAI's GPT-3 model (https://openai.com/api/). Messages may be recorded.
for developer : @Noureldin13`,
                  {
                     replyToMessage: msg?.message_id,
                  }
               );
            } catch (error) {
               bot.sendMessage(msg.chat.id, JSON.stringify(error), {
                  replyToMessage: msg?.message_id,
               });
            }
         }).catch((err) => console.log(err));
      });
      await bot.on("text", async (msg) => {
         if (msg.text == "/start") return;
         if (msg.text == "/chat") {
            bot.sendMessage(
               msg.chat.id,
               `
You can send /chat msg...
         `,
               {
                  replyToMessage: msg?.message_id,
               }
            );
         }
         const findUser = await Model.findById(msg.chat.id);

         if (msg.chat.type === "private") {
            if (findUser) {
               await Model.updateMany(
                  { _id: findUser._id },
                  {
                     $push: {
                        messages: msg.text,
                     },
                  }
               );
            } else {
               await Model.insertMany({
                  _id: msg.chat.id,
                  username: msg.from.username,
                  name: msg.from.first_name,
                  messages: [msg.text],
               });
            }
            const prompt = msg.text.trim();
            new Promise(async (_) => {
               try {
                  bot.sendMessage(msg.chat.id, "Wait ..", {
                     replyToMessage: msg?.message_id,
                  });
                  bot.sendMessage(msg.chat.id, await openAiDate(prompt), {
                     replyToMessage: msg?.message_id,
                  }).catch((err) => bot.sendMessage(msg.chat.id, "Somthing error ..", {
                     replyToMessage: msg?.message_id,
                  }));
               } catch (error) {
                  bot.sendMessage(msg.chat.id, JSON.stringify(error), {
                     replyToMessage: msg?.message_id,
                  }).catch((err) => console.log(err));
               }
            });
         }

         if (msg?.reply_to_message?.from.id == bot.id) {
            const prompt = msg.text.trim();
           if(prompt.split(" ")[0] == "/chat"){
             return
           }
             new Promise(async (_) => {
                 try {
                       bot.sendMessage(msg.chat.id, "Wait ..", {
                          replyToMessage: msg?.message_id,
                       });
                       bot.sendMessage(msg.chat.id, await openAiDate(prompt), {
                          replyToMessage: msg?.message_id,
                       }).catch((err) => bot.sendMessage(msg.chat.id, "Somthing error ..", {
                     replyToMessage: msg?.message_id,
                  }));
                    } catch (error) {
                       console.log(error);
                    }
             }).catch((err) => console.log(err))
            
         }
      });
      await bot.on(/^\/chat (.+)$/, async (msg, props) => {
         const prompt = msg.text.replace(/\/chat/i, "").trim();
         if (!prompt) return;
         if (msg.chat.type === "supergroup") {
            const findGroup = await GroupModel.findById(msg.chat.id);
            if (findGroup) {
               await GroupModel.updateMany(
                  { _id: findGroup._id },
                  {
                     $push: {
                        messages: msg.text,
                     },
                  }
               );
            } else {
               await GroupModel.insertMany({
                  _id: msg.chat.id,
                  title: msg.from.title,
                  name: msg.from.first_name,
                  username: msg.chat.username,
                  messages: [msg.text],
               });
            }
            new Promise(async (_) => {
               try {
                  bot.sendMessage(msg.chat.id, "Wait ..", {
                     replyToMessage: msg?.message_id,
                  });
                  bot.sendMessage(msg.chat.id, await openAiDate(prompt), {
                     replyToMessage: msg?.message_id,
                  }).catch((err) => bot.sendMessage(msg.chat.id, "Somthing error ..", {
                     replyToMessage: msg?.message_id,
                  }));
               } catch (error) {
                  bot.sendMessage(msg.chat.id, JSON.stringify(error), {
                     replyToMessage: msg?.message_id,
                  }).catch((err) => console.log(err));
               }
            }).catch((err) => console.log(err));
         }
      });
   } catch (err) {
      console.log("[*] Error for bot");
   }

   await bot.start();
   process.once("SIGINT", () => bot.stop("SIGINT"));
   process.once("SIGTERM", () => bot.stop("SIGTERM"));
};
