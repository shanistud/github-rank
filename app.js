const  http = require('http');

const express = require('express');
const bodyparser = require('body-parser');
const app = express();
const routes = require('./lib/routes');

app.use(routes);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('path Not Found');
    err.status = 404;
    next(err);
});

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next)
{
    res.status(err.status || 500).send({fault: err.message});
});

app.set('port', 3000);
const server = http.createServer(app);
server.listen(3000);