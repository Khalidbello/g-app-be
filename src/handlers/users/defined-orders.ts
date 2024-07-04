import { Request, Response } from "express-serve-static-core";
import { CustomSessionData } from "../../types/session-types";
import { deleteDOrder, retrieveDOrder, saveDOrder } from "../../services/users/order-queries";


// handler for defined ordr creation
const createDOrder = async (req: Request, res: Response) => {
    // @ts-ignore
    const userId: number = (req.session as CustomSessionData).user?.id;
    const { gurasa, suya, name } = req.body;
    const date = new Date();

    try {
        const result: boolean = await saveDOrder(gurasa, suya, name, userId, date);

        if (result === true) return res.json({ message: 'defined order created successfully' });
        throw 'error';
    } catch {
        res.status(500).json({ message: 'Something went wrong' });
    };
};


// handler to handle getting defined orders
const getDOrders = async (req: Request, res: Response) => {
    // @ts-ignore
    const userId: number = (req.session as CustomSessionData).user?.id;

    try {
        const count: number = parseInt(req.params.count);
        const limit: number = parseInt(req.params.limit);
        const result = await retrieveDOrder(count, limit, userId);
        console.log(result, 'in getDordersss');
        return res.json({ data: result });
    } catch (err) {
        console.error('erro in get defined orders', err)
        res.status(500).json({ message: 'Something went wrong' });
    };
};


// function to handle deleting of defined order
const removeDOrder = async (req: Request, res: Response) => {
    try {
        // @ts-ignore
        const userId: number = (req.session as CustomSessionData).user?.id;
        const id = parseInt(req.params.id);
        const response: boolean = await deleteDOrder(id, userId);

        if (response === true) return res.json({ message: `defined order with id ${id} deleted succesfully` });
    } catch (err) {
        console.error
        res.status(500).json({ message: 'unable to delete defined order something went wrong' });
    }
}

export { createDOrder, getDOrders, removeDOrder };