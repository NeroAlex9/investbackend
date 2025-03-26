require('dotenv').config();
const express = require('express');
const {response} = require("express");
const axios = require("axios");
const cors = require("cors");
const app = express();
const port = process.env.PORT;

// Middleware для обработки JSON
app.use(express.json());
app.use(cors());

// Маршрут для получения данных о облигациях
app.get('/bonds', async (req, res) => {
    try{
        const response = await axios.post(
            'https://invest-public-api.tinkoff.ru/rest/tinkoff.public.invest.api.contract.v1.InstrumentsService/Bonds',
            {
                instrumentStatus: "INSTRUMENT_STATUS_UNSPECIFIED",
                instrumentExchange: "INSTRUMENT_EXCHANGE_UNSPECIFIED"
            },
            {
                headers: {
                    'Authorization': `Bearer ${process.env.KEY}`,
                    'Content-Type': 'application/json',
                }
            }
        );
        res.json(response.data.instruments);
    }catch(err){
        console.log('Ошибка в запросе АПИ' + err);
    }
});

app.get('/coupons/:id', async (req, res) => {
    const bondsId = req.params.id;
    console.log(bondsId);
    try{
        const response = await axios.post('https://invest-public-api.tinkoff.ru/rest/tinkoff.public.invest.api.contract.v1.InstrumentsService/GetBondCoupons', {
            from: "2024-01-01T10:46:37.073Z",
            to: "2025-03-26T10:46:37.073Z",
            instrumentId: bondsId,
        },{
            headers: {
                'Authorization': `Bearer ${process.env.KEY}`,
                'Content-Type': 'application/json',
            }
        });
        return res.json(response.data.events[0].payOneBond.units);
    }catch(err){
        console.log('Ошибка в запросе получения купонов' + err)
    }
})


// Запуск сервера
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});


