import { Request, Response } from "express";
import { CustomSessionData } from '../../types/session-types';
import { getAcc, updateBalance } from "../../services/v-acc-queries";
import { addNewOrderForVAcc, getPlacedOrders, queryOrderById } from '../../services/users/order-queries';

const gurasaP = 200;
const suyaP = 100;

const initiateNewOrder = async (req: Request, res: Response) => {
    try {
        const email = (req.session as CustomSessionData).user?.email;
        console.log(req.body, 'iitiate order req body');
        const suya = parseInt(req.body.suya);
        const gurasa = parseInt(req.body.gurasa);
        const price = suya * suyaP + gurasa * gurasaP;
        const created_date: Date = new Date();
        const result = await getAcc(email);
        let payment_date: Date;

        if (!suya && !gurasa) return res.status(401).json({ message: 'missig parameters' });

        if (!result?.account_number) return res.status(404).json({ message: 'order cannot be placed unless a user has a virtual account' });

        if (result.balance < price) return res.status(402).json({ message: 'user have to fund account', toFund: price - result.balance });

        const newBalance = result.balance - price;

        // @ts-ignore
        const balanceUpdated: boolean = await updateBalance(newBalance, email);
        payment_date = new Date(); console.log(payment_date, 'paymnt date...........');

        if (balanceUpdated !== true) throw 'error updating balance';

        // add order to database
        const order_id = 'NVDSVVNEUN1234N5669' // call functio to create new ordr id
        // @ts-ignore
        const response = await addNewOrderForVAcc(email, 'paid', gurasa, suya, price, created_date, payment_date, order_id);


        //@ts-ignore
        if (response.affectedRows > 0) return res.json({ id: response.insertId });

        throw 'error creating order please report issue';
    } catch (error) {
        res.status(500).json({ message: error });
    };
};

const getOrderById = async (req: Request, res: Response) => {
    try {
        // @ts-ignore
        const userId: number = (req.session as CustomSessionData).user?.id;
        const id = parseInt(req.params.id);

        const order = await queryOrderById(userId, id);

        res.json({ data: order })
    } catch (error) {
        res.status(500).json({ message: error });
    };
};

const getOrders = async (req: Request, res: Response) => {
    try {
        // @ts-ignore
        const userId: number = (req.session as CustomSessionData).user?.email;
        const limit: number = parseInt(req.params.limit);
        const count: number = parseInt(req.params.count);

        const orders = await getPlacedOrders(userId, limit, count);
        res.json({ data: orders, message: 'order fetched succesfully' });
    } catch (error) {
        res.status(500).json({ message: error });
    };
};



export {
    initiateNewOrder,
    getOrderById,
    getOrders
}