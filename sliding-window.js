const express = require('express');
const rateLimit = require('express-rate-limit');
const RateLimit = require('express-rate-limit').RateLimit;

const app = express();

const slidingWindowLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.',
    keyGenerator: (req) => req.ip,
    handler: (req, res, next) => {
        RateLimit({
            windowMs: 60 * 1000,
            max: 100,
            message: 'Too many requests, please try again later.',
        });
        next();
    }
});

app.use(slidingWindowLimiter);

app.get('/', (req, res) => {
    res.send('Hello World');
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
