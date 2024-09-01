const express = require('express');
const rateLimit = require('express-rate-limit');
const LeakyBucket = require('leaky-bucket');

const app = express();

const leakyBucket = new LeakyBucket({
    capacity: 100, // bucket capacity
    leakRate: 1, // requests per second
});

const leakyBucketLimiter = (req, res, next) => {
    if (leakyBucket.tryRemoveTokens(1)) {
        next();
    } else {
        res.status(429).send('Too many requests');
    }
};

app.use(leakyBucketLimiter);

app.get('/', (req, res) => {
    res.send('Hello World');
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
