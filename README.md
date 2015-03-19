# CloudCodeWebhooks-Express for Heroku

An ExpressJS based Parse Cloud Code Webhooks server, ready for deployment to Heroku

### Getting Started

Locally, you should install the dependencies for development by running:

```
npm install
```

Cloud Code Webhooks requires an HTTPS connection, and so a valid SSL certificate is required.  Heroku will handle this for you.

Make sure you're logged into Heroku:

```
heroku login
```

From the project folder, run:

```
heroku create
```

Add your Parse App Webhook Key to the Heroku app config variables:

```
heroku config:set WEBHOOK_KEY=yourwebhookkeyhere
```

Create routes in `server.js` for your different cloud code triggers and cloud functions.  Examples are provided.

Deploy your app to Heroku:

```
git push heroku master
```

Using the URL of your Heroku app, set up your Webhooks in the Parse app dashboard.
