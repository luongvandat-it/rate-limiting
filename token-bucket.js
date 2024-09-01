const express = require('express');
const rateLimit = require('express-rate-limit');
const RateLimit = require('express-rate-limit').RateLimit;
const TokenBucket = require('token-bucket');

const app = express();

const tokenBucket = new TokenBucket({
    capacity: 100, // max number of requests in the bucket
    refillRate: 1, // tokens per second
    refillAmount: 1, // number of tokens added per refill
});

const tokenBucketLimiter = (req, res, next) => {
    if (tokenBucket.tryRemoveTokens(1)) {
        next();
    } else {
        res.status(429).send('Too many requests');
    }
};

app.use(tokenBucketLimiter);

app.get('/', (req, res) => {
    res.send('Hello World');
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
