const fetch = require('node-fetch')
const { Client } = require("pg");

const connectionString = process.env.DATABASE_URL

const client = new Client({connectionString});

client.connect();

async function pgQuery(query,values){
    try {
        const res = await client.query(query, values)
        return res.rows;
    } catch (err) {
        console.log(err.stack)
        return err
    }
}

async function getRequest(url){
    const result = await fetch(url);
    return await result.json();
}

module.exports = {
    pgQuery,
    getRequest
}
