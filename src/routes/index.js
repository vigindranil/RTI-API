const express = require('express');
const router = express.Router();

const spioController = require('../controllers/spioController');
const stateController = require('../controllers/stateController');
const districtController = require('../controllers/districtController');
const departmentController = require('../controllers/departmentController');
const policeStationController = require('../controllers/policeStationController');
const postOfficeController = require('../controllers/postOfficeController');
const municipalityController = require('../controllers/municipalityController');
const applicationThroughController = require('../controllers/applicationThroughController');
const committeeController = require('../controllers/committeeController');
const appealAuthorityController = require('../controllers/appealAuthorityController');
const endorseMemberController = require('../controllers/endorseMemberController');
const searchApplicationController = require('../controllers/searchApplicationController');
const meetingInvitationController = require('../controllers/meetingInvitationController');
const applicationController = require('../controllers/applicationController');
const applicationInfoController = require('../controllers/applicationInfoController');
const createmeetingInvitationController = require('../controllers/createmeetingInvitationController');
const meetingInvitationDetailsController = require('../controllers/meetingInvitationDetailsController');


// SPIO routes
router.post('/spio', spioController.insertSpio);
router.get('/spio', spioController.getSpioDetails);

// State routes
router.post('/state', stateController.insertState);
router.get('/state', stateController.getState);

// District routes
router.post('/district', districtController.insertDistrict);
router.get('/district', districtController.getDistrict);

// Department routes
router.post('/department', departmentController.insertDepartment);
router.get('/department', departmentController.getDepartment);

// Police Station routes
router.post('/police-station', policeStationController.insertPoliceStation);
router.get('/police-station', policeStationController.getPoliceStations);

// Post Office routes
router.post('/post-office', postOfficeController.insertPostOffice);
router.get('/post-office', postOfficeController.getPostOffices);

// Municipality routes
router.post('/municipality', municipalityController.insertMunicipality);
router.get('/municipality', municipalityController.getMunicipalities);

// Application Through routes
router.post('/application-through', applicationThroughController.insertApplicationThrough);
router.get('/application-through', applicationThroughController.getApplicationThrough);

// Committee routes
router.post('/committee/department', committeeController.insertCommitteeDepartment);
router.get('/committee/department', committeeController.getCommitteeDepartment);
router.post('/committee/member', committeeController.insertCommitteeMember);
router.get('/committee/member', committeeController.getCommitteeMember);

// Appeal Authority routes
router.post('/appeal-authority/member', appealAuthorityController.insertAppealAuthorityMember);
router.get('/appeal-authority/member', appealAuthorityController.getAppealAuthorityMember);

// Endorse Member routes
router.post('/endorse-member', endorseMemberController.insertEndorseMember);
router.get('/endorse-member', endorseMemberController.getEndorseMember);

// Search Application routes
router.get('/search-application', searchApplicationController.searchApplications);

// Meeting Invitation routes
router.get('/meeting-invitation', meetingInvitationController.getMeetingInvitationDetails);

// Application routes
router.get('/applications/by-status', applicationController.getApplicationsByStatus);
router.post('/admin/createNewApplication', applicationInfoController.createNewApplication);
router.post('/admin/createMeetingInvitation', createmeetingInvitationController.createMeetingInvitation);
router.get('/admin/getMeetingNumber', meetingInvitationDetailsController.getMeetingIdAndNumber);
module.exports = router;