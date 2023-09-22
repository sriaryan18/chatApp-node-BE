Message Service (Real-Time and Offline):

So there is 2 flow 1 for online users and 1 for offline users.

When the user is online there will not be any involvment of Kafka. The communication will take place through websocksts.
But , when the user is offline in that case Kafka has to come into picture. So when the user is offline what will happen is that the messages that are coming will be pushed to the kafka. (Notifications will also be pushed but currently it is getting stored in Mongo and when the user comes online the notification reaches to the client) 

So , for messages what kafka will store is the messgaes with chatid and the connection information such that it will be same as we get from /get-connections api. 
The reason behind this is that we need to order the chats according to the timestamps. i.e latest message will reach at the top.
