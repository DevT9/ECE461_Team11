import { Router } from 'express';
import {
  getAllRepoCommits,
  getAllCollaborators
} from '../controllers/gitHub.controller';
import { calculateRampUp } from '../controllers/RampUp';

const router = Router();
// console.log('router:', router);

router.get('/commits', getAllRepoCommits);
router.get('/collaborators', getAllCollaborators);
router.get('/rampup', calculateRampUp);

export default router;
