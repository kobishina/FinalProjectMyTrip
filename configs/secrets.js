// file are contains the secert things

require('dotenv').config();

exports.configs = {
    db_pass: process.env.DB_PASS,
    db_user: process.env.DB_USER,

    token_secret: process.env.TOKEN_SECRET,

    db_url: process.env.DB_URL,
    db_local_url: process.env.DB_LOCAL_URL,

    accountSid: process.env.ACCOUNT_SID,
    authToken: process.env.AUTH_TOKEN,
    fromWA: process.env.FROM_WA,
    toWA: process.env.TO_WA
};










// file are contains the secert things

// exports.configs = {
//     db_pass: "",
//     db_user: "",

//     // token
//     token_secret: "kobiProject",

//     // mongo
//     db_url: "mongodb+srv://mosheb932:1234moshe@myservercluster.yy6dviz.mongodb.net/finalProjectDB",
//     db_local_url: "mongodb://127.0.0.1:27017/finalProjectDB",

//     // twilio
//     accountSid: "AC68ef1082c242500e4535903210a45660",
//     authToken: "22d5f54cc136e5e82cfbb8e1233a8ccd",
//     fromWA: "+14155238886",
//     toWA: "+972539313477"
// }