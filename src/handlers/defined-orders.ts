import { Request, Response } from "express-serve-static-core";
import { CustomSessionData } from './../types/session-types';
import { saveDOrder, retrieveDOrder, deleteDOrder } from "../services/order-queries";
import { response } from "express";


// handler for defined ordr creation
const createDOrder = async (req: Request, res: Response) => {
    const email = (req.session as CustomSessionData).user?.email;
    const { gurasa, suya, name } = req.body;
    const date = new Date();

    const result: boolean = await saveDOrder(gurasa, suya, name, email, date);

    if (result) return res.json({ message: 'defined order created successfully' });
    res.status(500).json({ message: 'Something went wrong' });
};


// handler to handle getting defined orders
const getDOrders = async (req: Request, res: Response) => {
    const email = (req.session as CustomSessionData).user?.email;
    const count: number = parseInt(req.params.count);
    const limit: number = parseInt(req.params.limit);

    //@ts-ignore
    const result = await retrieveDOrder(count, limit, email);
    console.log(result, 'in getDordersss');
    if (result.length > 0) {
        return res.json({ data: result })
    };
    res.status(500).json({ message: 'Something went wrong' });
};


// function to handle deleting of defined order
const removeDOrder = async (req: Request, res: Response) => {
    const email = (req.session as CustomSessionData).user?.email;
    const id = parseInt(req.params.id);

    const response: boolean = await deleteDOrder(id, email);

    if (response === true) return res.json({ message: `defined order with id ${id} deleted succesfully` });

    res.status(500).json({ message: 'unable to delete defined order something went wrong' });
}

export { createDOrder, getDOrders, removeDOrder };