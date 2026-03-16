const app = require('./app');
const AppDataSource = require('./data-source');

const PORT = process.env.PORT || 3000;

(async()=> {
    try {
        await AppDataSource.connect();
        console.log('DB Connection Open');
        app.listen(PORT, () => {
            console.log(`server started at port ${PORT}`);
        })
    }
    catch (err) {
        console.log(err);
    }
})()