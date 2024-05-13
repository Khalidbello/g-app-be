import { Router, Request, Response, NextFunction } from 'express';
import { getVAccDetails } from './../handlers/virtual-account';
import { CustomSessionData } from './../types/session-types';


const router = Router();

router.use((req: Request, res: Response, next: NextFunction) => {
    if (
        (req.session as CustomSessionData).user?.email && (
            (req.session as CustomSessionData).user?.type === 'normal' ||
            (req.session as CustomSessionData).user?.type === 'admin' ||
            (req.session as CustomSessionData).user?.type === 'super'
        )) {
        next()
    } else {
        res.status(403).json({ message: 'you do not have permission to view this document' });
    };
});


// route to return user virtual account details
router.get('/v-account-details', (req: Request, res: Response) => {
    try {
        getVAccDetails(req, res);
    } catch (err) {
        console.log('error in get v account details..', err)
    }
});

export default router