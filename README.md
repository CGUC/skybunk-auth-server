# Register a Server

Make a `POST` request to `{{AUTH_URL}}/servers` with the following data
```js
{
  "name": "<Your-Server-Name>",
  "url" : "<Your-Server-URL>"
}
```
This will return something similar to the following JSON data
```js
{
  "_id": "5d48a772bc561942a828113d",
  "name": "<Your-Server-Name>",
  "url": "<Your-Server-URL>",
  "accessKey": "4ef4c15e-de7a-458e-bc1e-ca2c8f1ef9b6"
}
```
Where `_id` is the server ID and `accessKey` is required for any server related `REST` requests.

---
Open up a terminal on the server and set environment variables similar to below.
```sh
export MONGO_DB=server_db
export PORT=3001
export SERVER_ID=5d48a772bc561942a828113d
export ACCESS_KEY=4ef4c15e-de7a-458e-bc1e-ca2c8f1ef9b6
```

---
Your server is now registered.

# Creating Tickets
Make a `POST` request to a server (`{{SERVER_URL}}/admin/tickets`) with the following `JSON` data:
```js
{
  "count": <NUM_TICKETS>
}
```
The server will forward the request to auth to associate the tickets with the server so that users that register with the ticket will get the correct server added to their list.

# Registering Users
Exactly the same as before

# Logging in a User
The client sends a request to auth to find which servers they are part of, then logs in to the first server returned normally.
This should probably be changed to just having auth log the user in.