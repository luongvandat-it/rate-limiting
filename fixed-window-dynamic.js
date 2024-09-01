const express = require('express');
const rateLimit = require('express-rate-limit');

const app = express();

const dynamicLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: (req) => {
        // Adjust limit based on user or request properties
        if (req.user && req.user.isVIP) {
            return 1000; // higher limit for VIP users
        }
        return 100; // default limit
    },
    message: 'Too many requests from this IP, please try again later.',
});

app.use(dynamicLimiter);

app.get('/', (req, res) => {
    res.send('Hello World');
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
