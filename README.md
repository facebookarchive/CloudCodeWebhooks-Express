# ParseOCC-Express

An ExpressJS based Open Cloud Code example server.

### Getting Started

Using npm, install the required modules:

```
npm install
```

Open Cloud Code requires an HTTPS connection, and so a valid SSL certificate is required.  Self-signed certificates are not accepted.  

Update the locations at the top of `server.js` to point to your certificate and private key files, or place the files in this folder named `private-key.pem` and `certificate.pem`.  These files will be ignored by git.

Create a file named `webhook.key` and in it place the secret key from the Parse.com settings for your app.

```
echo "YourWebhookKeyHere" >> webhook.key
```

Create routes in `server.js` for your different cloud code triggers and cloud functions.  Examples are provided.

Start the server to listen for connections:

```
node server.js
```

It's common to use a daemon like [forever](https://github.com/foreverjs/forever) to keep your script running in the background and for it to restart if it happens to crash.  You can install forever and start the daemon like so:

```
npm install forever -g
forever start server.js
```

