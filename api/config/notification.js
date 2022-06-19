/*
 * Copyright (c) 28/04/2022 17:16
 * @author Ronald Tchuekou
 * @email ronaldtchuekou@gmail.com
 */

const {Expo} = require('expo-server-sdk')
const expo = new Expo()

/**
 * Sent push notifications to users.
 * @param {Array<string>} tokens
 * @param {string} title
 * @param {string}  body
 * @param {object} [data={}]
 * @return {Promise<void>}
 */
exports.sendNotificationPush = async (tokens, title, body, data) => {
   if (tokens.length === 0)
      return;
   try {
      let messages = []
      for (let token of tokens) {
         if (!Expo.isExpoPushToken(token)) {
            console.error(`Push token ${token} is not a valid Expo push token`)
            continue
         }
         messages.push({
            to: token,
            title: title,
            body: body,
            priority: 'high',
            subtitle: 'phomag',
            sound: 'default',
            badge: 1,
            channelId: 'default',
            data: data,
            lightColor: '#004e9b'
         })
      }
      const chunks = expo.chunkPushNotifications(messages)
      let tickets = []
      await (async () => {
         for (let chunk of chunks) {
            try {
               const ticketChunk = await expo.sendPushNotificationsAsync(chunk)
               tickets.push(ticketChunk)
            } catch (error) {
               console.error(error)
            }
         }
      })()
      let receiptIds = []
      for (let ticket of tickets) {
         if (ticket.id) {
            receiptIds.push(ticket.id)
         }
      }
      let receiptIdChunks = expo.chunkPushNotificationReceiptIds(receiptIds)
      await (async () => {
         for (let chunk of receiptIdChunks) {
            try {
               let receipts = await expo.getPushNotificationReceiptsAsync(chunk)
               for (let receiptId in receipts) {
                  let {status, message, details} = receipts[receiptId]
                  if (status === 'error') {
                     console.error(
                        `There was an error sending a notification: ${message}`
                     )
                     if (details && details.error) {
                        console.error(`The error code is ${details.error}`)
                     }
                  }
               }
            } catch (error) {
               console.error(error)
            }
         }
      })()
   } catch (e) {
      console.log(e)
   }
}
