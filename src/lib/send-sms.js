"use server";

import { revalidatePath } from "next/cache";
import { Vonage } from "@vonage/server-sdk";

const vonage = new Vonage({
  apiKey: process.env.VONAGE_API_KEY,
  apiSecret: process.env.VONAGE_API_SECRET,
});

export async function sendSms(from, to, text) {
  try {
    const vonage_response = await vonage.sms.send({
      to: to,
      from: from,
      text: text,
    });

    revalidatePath("/");
    return {
      response:
        vonage_response.messages[0].status === "0"
          ? `🎉 Message sent successfully.`
          : `There was an error sending the SMS. ${
              // prettier-ignore
              vonage_response.messages[0].error-text
            }`,
    };
  } catch (e) {
    console.log(e)
    return {
      response: `There was an error sending the SMS. The error message: ${e.message}`,
    };
  }
}