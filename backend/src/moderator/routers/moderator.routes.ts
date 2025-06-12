import { Router } from "express";
import { authenticateToken } from "../../common/middleware/token-middleware";
import { permissionControl } from "../../common/middleware/permission-middleware";
import { moderatorStatusPanel } from "../controller/moderator-status-panel";
import { updateTicketStatus } from "../controller/change-ticket-status";

const router = Router()

router.get('/status-panel', authenticateToken, permissionControl, moderatorStatusPanel)
router.post('/status-panel/update-status', authenticateToken, permissionControl, updateTicketStatus)

export default router;