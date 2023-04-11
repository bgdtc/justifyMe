import express from 'express';

const router = express.Router();

router.route('/').get((req:any,res:any) => {
    res.status(200).send({ok:'ok'});
})

router.route('/tokens').post();

router.route('/justify').post();

export default router;
