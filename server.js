const express = require("express");
const authRoutes = require("./routes/auth-routes");
const postRoutes = require("./routes/post-routes");
const userRoutes = require("./routes/user-routes");
const isError = require('./middelware/is-error')
const morganLogs = require('./middelware/morgan-logs')
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use(morganLogs())


app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*')
    // res.setHeader('Access-Control-Allow-Origin', `http://localhost:${port}`)
    res.setHeader('Access-Control-Allow-Credentials', true)
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization,Content-disposition,Content-Length')
    next()
})

app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/users", userRoutes);
app.use((req, res, next) => {
    console.log(req)
    next()
})

app.use(isError);

app.listen(port, () =>
    console.log(`Express server is running on port ${port}`)
);
