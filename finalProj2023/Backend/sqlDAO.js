
var express = require('express');
var app = express();
require('dotenv').config();
var pmysql = require('promise-mysql'); 
var pool;
const username = 'root';
const password = '';
const database = 'proj2023';
const host = 'localhost';
const port = 3306;
const connectionLimit = 3;


pmysql.createPool({
    connectionLimit: connectionLimit,
    host: host,
    user: username,
    password: password,
    database: database,
    port: port
}).then(p => {
    pool = p;
}).catch(error => {
    console.log("Pool Error: " + error);
});

//get all stores from database
function getStore() {
    return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM store')
            .then((data) => {
                resolve(data);
            })
            .catch(error => {
                reject(error);
            })
    })
}

/*
//add a new store to the database using the values from the addStore page
function addStore(sid, location, mgrid) {
    return new Promise(async (resolve, reject) => {
        try {
            //Checks if the mgrid is already assigned to a store
            const mgridExists = await pool.query("SELECT * FROM store WHERE mgrid = ?", [mgrid]);
            if (mgridExists.length > 0) {
                //If the manager ID is found, throw an error
                throw new Error('Manager ID is already assigned to another store');
            }

            pool.query('INSERT INTO store (sid, location, mgrid) VALUES (?, ?, ?)', [sid, location, mgrid])
                .then((data) => {
                    resolve(data);
                })
                .catch(err => {
                    reject(err);
                })
        } catch (err) {
            console.error("Error adding store in SQL DAO:", err);
            reject(err);
        }
    }
    )
}*/

//delete a store from the database
function deleteStore(sid) {
    return new Promise((resolve, reject) => {
        pool.query('DELETE FROM store WHERE sid = ?', [sid])
            .then((data) => {
                resolve(data);
            })
            .catch(error => {
                reject(error);
            })
    })
}


//get a store by its id
function getStoreById(sid) {
    return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM store WHERE sid = ?', [sid])
            .then((data) => {
                resolve(data[0]); //return the first row of data
            })
            .catch(error => {
                console.log(colorize('red', 'Error in sqlDAO.js: \n ' + error));
                reject(error);
            })
    })
}

//get products from database
function getAllProducts() {
    return new Promise((resolve, reject) => {
        const sqlQuery = `
        SELECT p.pid, p.productdesc, ps.sid, s.location, ps.price
        FROM product p
        LEFT JOIN product_store ps ON p.pid = ps.pid
        LEFT JOIN store s ON ps.sid = s.sid;
        
        `;
        pool.query(sqlQuery)
            .then((data) => {
                resolve(data);
            })
            .catch(error => {
                reject(error);
            });
    });
}

//Function to delete a product
function deleteProduct(pid) {
    return new Promise((resolve, reject) => {
        pool.query('DELETE FROM product_store WHERE pid = ?', [pid])
            .then(() => {
                return pool.query('DELETE FROM product WHERE pid = ?', [pid]);
            })
            .then((result) => {
                resolve(result);
            })
            .catch((error) => {
                reject(error);
            });
    });
}

//checks if peoduct is in a store to prevent deletion
function checkProductInStores(pid) {
    return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM product_store WHERE pid = ?', [pid])
            .then((result) => {
                resolve(result);
            })
            .catch((error) => {
                reject(error);
            });
    });
}


module.exports = {
    getStore, addStore, getStoreById, deleteStore, getAllProducts,
    deleteProduct, checkProductInStores
};

