const mongoose = require('mongoose');


class Database {
    constructor() {
        this.db_connect();
    }

    async db_connect() {
        try {
            const uri ='mongodb+srv://satyaprakashsinghkasia:yVCqFHLJIAwbMqHT@cluster0.o4esf7u.mongodb.net/?retryWrites=true&w=majority'; 
            this.database = await mongoose.connect(uri, {
            });
            console.log('Database connection successful');
            mongoose.set('debug', true); 
        } catch (err) {
            console.error('Database connection error:', err);
            process.exit(1); 
        }
    }
}

module.exports = new Database();
