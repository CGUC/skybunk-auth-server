# User Flow #

## Adding user to server

1. Admin asks server to generate new keys
2. Server asks Auth to create new keys
3. Auth creates new keys, saves them (e.g. `[{ticketNumber, server}]`), and returns ticketNumbers to Server
4. Server saves keys returned by Auth
5. User sends registration request to Auth using key
6. Auth forwards request to Server
7. Server handles key in normal manner
8. Auth creates user if necessary (just add Server to User's list otherwise) and removes key
