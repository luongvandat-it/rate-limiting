const express = require('express');

const app = express();

// Define rate limit settings
const WINDOW_SIZE_MS = 60000; // 1 minute window
const MAX_REQUESTS = 100; // max requests per window

// Store timestamps of requests
const requestLogs = new Map();

function slidingWindowLogLimiter(req, res, next) {
    const currentTime = Date.now();
    const userIP = req.ip;

    if (!requestLogs.has(userIP)) {
        requestLogs.set(userIP, []);
    }

    const timestamps = requestLogs.get(userIP);

    // Remove timestamps older than the window size
    while (timestamps.length && timestamps[0] <= currentTime - WINDOW_SIZE_MS) {
        timestamps.shift();
    }

    // Check if the request exceeds the limit
    if (timestamps.length >= MAX_REQUESTS) {
        return res.status(429).send('Too many requests, please try again later.');
    }

    // Log the current request timestamp
    timestamps.push(currentTime);
    requestLogs.set(userIP, timestamps);

    next();
}

app.use(slidingWindowLogLimiter);

app.get('/', (req, res) => {
    res.send('Hello World');
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
