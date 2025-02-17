import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Bot } from "./schemas/bot.schema";
import { InjectBot } from "nestjs-telegraf";
import { BOT_NAME } from "src/app.constants";
import { Context, Markup, Telegraf } from "telegraf";
import { Model } from "mongoose";

@Injectable()
export class BotService {
  constructor(
    @InjectModel(Bot.name) private readonly botModel: Model<Bot>,
    @InjectBot(BOT_NAME) private readonly bot: Telegraf<Context>
  ) {}

  async onStart(ctx: Context) {
    try {
      const user_id = ctx.from?.id;
      const user = await this.botModel.findOne({ user_id: String(user_id) });

      if (!user) {
        await this.botModel.create({
          user_id,
          user_name: ctx.from?.username,
          first_name: ctx.from?.first_name,
          last_name: ctx.from?.last_name,
          user_lang: ctx.from?.language_code,
          status: true,
          last_state: "real_name",
          balance: 0,
        });
        await ctx.reply(
          `Salom ${ctx.from?.first_name}, botga xush kelibsiz\n\nIltimos haqiqiy ismingizni kiriting:`
        );
      } else if (user && !user.status) {
        user.status = true;
        await user.save();

        await ctx.replyWithHTML("Asknetga xush kelibsiz");
      } else if (user.last_state == "real_name" && user.status) {
        await ctx.replyWithHTML(`Iltimos haqiqiy ismingizni kiriting:`, {
          ...Markup.removeKeyboard(),
        });
        await user.save();
      } else if (user.last_state == "gender") {
        await ctx.reply(`Iltimos jinsingizni tanlang:`, {
          reply_markup: {
            inline_keyboard: [
              [
                { text: "Erkak 👨", callback_data: `male_${user.user_id}` },
                { text: "Ayol 👩‍🦱", callback_data: `female_${user.user_id}` },
              ],
            ],
          },
        });
      } else if (user.last_state == "phone_number") {
        await ctx.replyWithHTML(
          `Iltimos <b>📱 Kontaktni ulashish</b> tugmasini bosing:`,
          {
            ...Markup.keyboard([
              Markup.button.contactRequest("📱 Kontaktni ulashish"),
            ]).resize(),
          }
        );
      } else if (user.last_state == "birth_year") {
        await ctx.reply(`Tug'ilgan yilingizni kiriting:`, {
          ...Markup.removeKeyboard(),
        });
      } else if (user.last_state == "wait") {
        const user = await this.botModel.findOne({ user_id: String(user_id) });
        if (!user || user.last_state == "wait") {
          const userInfo =
            `✅ Ma'lumotlar qabul qilindi!\n\n` +
            `👤 Ism: <b>${user!.real_name}</b>\n` +
            `📞 Telefon: <b>${user!.phone_number}</b>\n` +
            `👥 Jins: <b>${user!.gender === "male" ? "Erkak 👨" : "Ayol 👩‍🦱"}</b>\n` +
            `📅 Tug'ilgan yil: <b>${user!.birth_year}</b>\n\n` +
            `🔄 Ma'lumotlaringizni <b>Profil</b> bo'limidan o'zgartirishingiz mumkin`;

          await ctx.replyWithHTML(userInfo, {
            reply_markup: {
              inline_keyboard: [
                [
                  {
                    text: "Tasdiqlash ✅",
                    callback_data: `accept_${user!.user_id}`,
                  },
                  {
                    text: "Qaytadan boshlash 🔄",
                    callback_data: `edit_${user!.user_id}`,
                  },
                ],
              ],
            },
          });
        }
      } else if (user.last_state == "finish" && user.status) {
        await ctx.replyWithHTML("Asknetga xush kelibsiz", {
          ...Markup.keyboard([
            ["👤 Profil", "💰 Balans"],
            ["ℹ️ Yordam", "📊 Statistika"],
          ]).resize(),
        });
      } else if (user.last_state == "finish" && !user.status) {
        await ctx.replyWithHTML(
          "Asknetga xush kelibsiz.\n\nSiz ro'yxatdan o'tmagansiz, Iltimos /start buyrug'ini bosing",
          {
            ...Markup.keyboard([["/start"]]).resize(),
          }
        );
      }
    } catch (error) {
      console.log("onStart error: ", error);
    }
  }

  async onActionGender(ctx: Context) {
    try {
      const user_id = ctx.callbackQuery!["data"].split("_")[1];
      const gender = ctx.callbackQuery!["data"].split("_")[0];
      const user = await this.botModel.findOne({ user_id: String(user_id) });
      console.log(user, user_id, gender, ctx.callbackQuery!["data"]);

      if (!user || !user.status) {
        await ctx.reply(
          "Siz ro'yxatdan o'tmagansiz yoki faol emassiz, Iltimos oldin botni qayta ishga tushuring\n /start",
          {
            ...Markup.keyboard([["/start"]]).resize(),
          }
        );
      } else if (user && user.last_state == "gender") {
        user.gender = gender;
        user.last_state = "phone_number";
        await user.save();

        await ctx.replyWithHTML(
          `Iltimos <b>📱 Kontaktni ulashish</b> tugmasini bosing:`,
          {
            ...Markup.keyboard([
              Markup.button.contactRequest("📱 Kontaktni ulashish"),
            ]).resize(),
          }
        );
      }
    } catch (error) {
      console.log("onActionGender error: ", error);
    }
  }

  async hearYear(ctx: Context) {
    try {
      if ("text" in ctx.message!) {
        const user_id = ctx.from?.id;
        const user = await this.botModel.findOne({ user_id: String(user_id) });

        if (!user || !user.status) {
          await ctx.reply(
            "Siz ro'yxatdan o'tmagansiz yoki faol emassiz, Iltimos oldin botni qayta ishga tushuring\n /start",
            {
              ...Markup.keyboard([["/start"]]),
            }
          );
        } else if (user && user.last_state == "birth_year") {
          user.birth_year = ctx.message.text;
          user.last_state = "wait";
          await user.save();

          const userInfo =
            `✅ Ma'lumotlar qabul qilindi!\n\n` +
            `👤 Ism: <b>${user.real_name}</b>\n` +
            `📞 Telefon: <b>${user.phone_number}</b>\n` +
            `👥 Jins: <b>${user.gender === "male" ? "Erkak 👨" : "Ayol 👩‍🦱"}</b>\n` +
            `📅 Tug'ilgan yil: <b>${user.birth_year}</b>\n\n` +
            `🔄 Ma'lumotlaringizni <b>Profil</b> bo'limidan o'zgartirishingiz mumkin`;

          await ctx.replyWithHTML(userInfo, {
            reply_markup: {
              inline_keyboard: [
                [
                  {
                    text: "Tasdiqlash ✅",
                    callback_data: `accept_${user.user_id}`,
                  },
                  {
                    text: "Qaytadan boshlash 🔄",
                    callback_data: `edit_${user.user_id}`,
                  },
                ],
              ],
            },
          });
        }
      }
    } catch (error) {
      console.log("hearYear error: ", error);
    }
  }

  async onContact(ctx: Context) {
    try {
      if ("contact" in ctx.message!) {
        const user_id = ctx.from?.id;
        const user = await this.botModel.findOne({ user_id: String(user_id) });

        if (!user || !user.status) {
          await ctx.reply(
            "Siz ro'yxatdan o'tmagansiz, Iltimos /start buyrug'ini bosing",
            {
              ...Markup.keyboard([["/start"]]),
            }
          );
        } else if (user && user.last_state == "phone_number") {
          user.phone_number = ctx.message.contact.phone_number;
          user.last_state = "birth_year";
          await user.save();

          await ctx.reply(`Tug'ilgan yilingizni kiriting:`, {
            ...Markup.removeKeyboard(),
          });
        }
      }
    } catch (error) {
      console.log("onContact error: ", error);
    }
  }

  async onActionAccept(ctx: Context) {
    try {
      const user_id = ctx.callbackQuery!["data"].split("_")[1];
      const user = await this.botModel.findOne({ user_id: String(user_id) });
      if (!user || !user.status) {
        await ctx.reply(
          "Siz ro'yxatdan o'tmagansiz, Iltimos /start buyrug'ini bosing",
          {
            ...Markup.keyboard([["/start"]]),
          }
        );
      } else if (user && user.last_state == "wait") {
        user.last_state = "finish";
        await user.save();
        await ctx.replyWithHTML(`✅ Muvaffaqiyatli ro'yxatdan o'tdingiz`, {
          ...Markup.removeKeyboard(),
          ...Markup.keyboard([
            ["👤 Profil", "💰 Balans"],
            ["ℹ️ Yordam", "📊 Statistika"],
          ]).resize(),
        });
      }
    } catch (error) {
      console.log("onActionAccept error: ", error);
    }
  }

  async onActionEdit(ctx: Context) {
    try {
      const user_id = ctx.callbackQuery!["data"].split("_")[1];
      const user = await this.botModel.findOne({ user_id: String(user_id) });
      if (!user || !user.status) {
        await ctx.reply(
          "Siz ro'yxatdan o'tmagansiz, Iltimos /start buyrug'ini bosing",
          {
            ...Markup.keyboard([["/start"]]),
          }
        );
      } else if (user && user.last_state == "wait") {
        user.last_state = "real_name";
        await user.save();
        await ctx.replyWithHTML(`Iltimos haqiqiy ismingizni kiriting:`, {
          ...Markup.removeKeyboard(),
        });
      }
    } catch (error) {
      console.log("onActionEdit error: ", error);
    }
  }

  async onText(ctx: Context) {
    try {
      if ("text" in ctx.message!) {
        const user_id = ctx.from?.id;
        const user = await this.botModel.findOne({ user_id: String(user_id) });

        if (!user || !user.status) {
          await ctx.reply(
            "Siz ro'yxatdan o'tmagansiz, Iltimos /start buyrug'ini bosing",
            {
              ...Markup.keyboard([["/start"]]),
            }
          );
        } else if (user && user.last_state == "real_name") {
          user.real_name = ctx.message.text;
          user.last_state = "gender";
          await user.save();

          await ctx.reply(`Jinsingizni tanlang:`, {
            reply_markup: {
              inline_keyboard: [
                [
                  { text: "Erkak 👨", callback_data: `male_${user.user_id}` },
                  { text: "Ayol 👩‍🦱", callback_data: `female_${user.user_id}` },
                ],
              ],
            },
          });
        }
      }
    } catch (error) {
      console.log("onText error: ", error);
    }
  }
}
