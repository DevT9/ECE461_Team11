import { Router } from 'express';
import { getAllRepoCommits } from '../controllers/gitHub.controller';

const router = Router();
// console.log('router:', router);

router.get('/commits', getAllRepoCommits);

export default router;
