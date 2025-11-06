const express = require('express');
const { searchJobs, findCompanyByName, predictCareer } = require('../controllers/job.controller');
const { suggest, chatWithAI, getChatHistory, clearChatHistory } = require('../controllers/gemini.controller');
const { findStudyMaterials, getAllStudyMaterials, importDataFromCSV, getStudyMaterialsbyId } = require('../controllers/study_material.controller');
const { signup, login, syncDataStudent, updateRole, getCurrentUser, changePassword, checkMembershipStatus } = require('../controllers/user.controller');
const { authenticateToken, checkRole } = require('../middleware/auth.middleware');
const { getDocumentbyId } = require('../controllers/document.controller');
const { getInvoicesByUserIdAPI, createInvoiceAPI, updateInvoiceStatusAPI, deleteInvoiceAPI } = require('../controllers/invoice.controller');
const { addWatchHistory, isDocumentWatched, getUserCourseProgress } = require('../controllers/watchHistory.controller');

const router = express.Router();

// AUTH
router.post('/signup', signup);
router.post('/login', login);

// WEBHOOK PAYOS
router.post('/payment/payos', updateInvoiceStatusAPI);
router.get('/payment/payos', (req, res) => res.status(200).json({ message: 'Webhook URL verified' }));
router.post('/studyMaterial', importDataFromCSV);

// MIDDLEWARE AUTH
router.use(authenticateToken);

// USER
router.get('/user', getCurrentUser);
router.patch('/user/role', updateRole);
router.patch('/user/changePassword', changePassword);
router.post('/user/checkMembershipStatus', checkMembershipStatus);
router.post('/user/getUserCourseProgress', getUserCourseProgress);

// STUDENT
router.post('/student/syncData', syncDataStudent);

// JOBS
router.post('/jobs/search', searchJobs);
router.post('/company/search', findCompanyByName);

// PREDICT
router.post('/predict/career', predictCareer);

// STUDY MATERIAL
router.post('/studyMaterials/search', findStudyMaterials);
router.get('/studyMaterials', getAllStudyMaterials);
router.get('/studyMaterials/:id', getStudyMaterialsbyId);

// DOCUMENT
router.get('/documents/:id', getDocumentbyId);
router.post('/documents', addWatchHistory);
router.post('/documents/:id', isDocumentWatched);

// INVOICE
router.post('/invoice', createInvoiceAPI);

// openai (Gemini)
router.post('/openai/suggest', suggest);
router.post('/openai/chat', chatWithAI);
router.get('/openai/chat/history', getChatHistory);
router.delete('/openai/chat', clearChatHistory);


module.exports = router;
