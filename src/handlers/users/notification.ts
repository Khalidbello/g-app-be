import { Request, Response } from "express";
import { CustomSessionData } from "../../types/session-types";
import { querySetAllNotificationViewd, queryUserCountUnViewedNoti, queryUserNotifications, userQueryUpdateNoteToViewed, userQueryUpdateNoteToViewedById } from "../../services/users/notifications-queries";

const checkUnViewedNotiication = async (req: Request, res: Response) => {
    try {
        const userId = (req.session as CustomSessionData).user?.id;
        // @ts-ignore
        const notificationExists = await queryUserCountUnViewedNoti(userId);

        if (!notificationExists) return res.json({ status: false });

        res.json({ status: true });
    } catch (err) {
        console.error('an error occured check if notification exists', err);
        res.status(500).json({ message: err });
    };
};


const getNotifications = async (req: Request, res: Response) => {
    try {
        // @ts-ignore
        const userId: number = (req.session as CustomSessionData).user?.id;
        const limit = parseInt(req.params.limit);
        const pagin = parseInt(req.params.pagin);

        const notificaions = await queryUserNotifications(userId, limit, pagin);

        res.json(notificaions);
        // userQueryUpdateNoteToViewed(userId);
    } catch (err) {
        console.error('an error occured fetch lessons', err);
        res.status(500).json({ message: err });
    };
};


// function to set all user notification to viewed
const setNotToViewed = (req: Request, res: Response) => {
    try {
        // @ts-ignore
        const userId: number = (req.session as CustomSessionData).user?.id;
        // @ts-ignore
        const notifId: number = req.params.id;

        const updated = userQueryUpdateNoteToViewedById(userId, notifId);

        res.json({ message: 'notifications updated' });
    } catch (err) {
        console.error('error in updating notifiaion to viwed', err);
        res.status(500).json({ message: err });
    };
};


// handler to set all user notification to viewd
const setAllNotificationToViewed = async (req: Request, res: Response) => {
    try {
        // @ts-ignores
        const userId: number = (req.session as CustomSessionData).user?.id;
        const updated = await querySetAllNotificationViewd(userId);

        if (!updated) throw 'Something went wrong';
        res.json({ message: 'All notifications updated to viewed' });
    } catch (err) {
        console.error('error in updating all notifiaion to viewed', err);
        res.status(500).json({ message: err });
    };
};


export {
    checkUnViewedNotiication,
    getNotifications,
    setNotToViewed,
    setAllNotificationToViewed,
};