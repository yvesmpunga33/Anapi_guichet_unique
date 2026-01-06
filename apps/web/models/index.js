import sequelize from '../app/lib/sequelize.js';

// Import all models
import User from './User.js';
import Account from './Account.js';
import Session from './Session.js';
import VerificationToken from './VerificationToken.js';
import HRDepartment from './HRDepartment.js';
import Position from './Position.js';
import SalaryGrade from './SalaryGrade.js';
import WorkerCategory from './WorkerCategory.js';
import Employee from './Employee.js';
import EmployeeSpouse from './EmployeeSpouse.js';
import EmployeeChild from './EmployeeChild.js';
import EmployeeBankAccount from './EmployeeBankAccount.js';
import EmployeeIdentityDocument from './EmployeeIdentityDocument.js';
import EmployeeEmergencyContact from './EmployeeEmergencyContact.js';
import LeaveType from './LeaveType.js';
import Leave from './Leave.js';
import Payslip from './Payslip.js';
import Investor from './Investor.js';
import Investment from './Investment.js';
import ProjectHistory from './ProjectHistory.js';
import ApprovalRequest from './ApprovalRequest.js';
import ProjectDocument from './ProjectDocument.js';
import LegalDocument from './LegalDocument.js';
import WorkflowStep from './WorkflowStep.js';
// Nouveaux modeles pour le Guichet Unique
import Sector from './Sector.js';
import Ministry from './Ministry.js';
import ActeAdministratif from './ActeAdministratif.js';
import PieceRequise from './PieceRequise.js';
import ActeAdministration from './ActeAdministration.js';
import Dossier from './Dossier.js';
import DossierDocument from './DossierDocument.js';
import MinistryWorkflow from './MinistryWorkflow.js';
import MinistryRequest from './MinistryRequest.js';
import MinistryRequestHistory from './MinistryRequestHistory.js';
import MinistryRequestDocument from './MinistryRequestDocument.js';
import DossierSector from './DossierSector.js';
import RequiredDocument from './RequiredDocument.js';
import DossierStepValidation from './DossierStepValidation.js';
// Communication interne
import Message from './Message.js';
import MessageRecipient from './MessageRecipient.js';
import MessageAttachment from './MessageAttachment.js';
// Référentiels
import Province from './Province.js';
import City from './City.js';
import Commune from './Commune.js';
// Direction Juridique
import LegalDocumentType from './LegalDocumentType.js';
import LegalDomain from './LegalDomain.js';
import JuridicalText from './JuridicalText.js';
import ContractType from './ContractType.js';
import Contract from './Contract.js';
import LegalAlert from './LegalAlert.js';
// Devises
import Currency from './Currency.js';
// Pays
import Country from './Country.js';
// Configuration systeme
import SystemConfig from './SystemConfig.js';
// Passation de Marches
import MinistryDepartment from './MinistryDepartment.js';
import ProcurementDocumentType from './ProcurementDocumentType.js';
import Tender from './Tender.js';
import TenderLot from './TenderLot.js';
import TenderDocument from './TenderDocument.js';
import TenderHistory from './TenderHistory.js';
import Bidder from './Bidder.js';
import BidderDocument from './BidderDocument.js';
import Bid from './Bid.js';
import BidDocument from './BidDocument.js';
import ProcurementContract from './ProcurementContract.js';
import ContractExecution from './ContractExecution.js';
import ContractDocument from './ContractDocument.js';
import EvaluationCommittee from './EvaluationCommittee.js';
// Nouveaux modèles - Investissements
import ProjectMilestone from './ProjectMilestone.js';
import ProjectRisk from './ProjectRisk.js';
import ProjectImpact from './ProjectImpact.js';
// Nouveaux modèles - Procurement
import BidderRating from './BidderRating.js';
import FrameworkAgreement from './FrameworkAgreement.js';
import FrameworkAgreementSupplier from './FrameworkAgreementSupplier.js';
import FrameworkOrder from './FrameworkOrder.js';
// Nouveaux modèles - HR
import Attendance from './Attendance.js';
import Overtime from './Overtime.js';
import WorkSchedule from './WorkSchedule.js';
import PublicHoliday from './PublicHoliday.js';
// Climat des Affaires
import BusinessBarrier from './BusinessBarrier.js';
import BarrierResolution from './BarrierResolution.js';
import MediationCase from './MediationCase.js';
import StakeholderDialogue from './StakeholderDialogue.js';
import DialogueParticipant from './DialogueParticipant.js';
import LegalProposal from './LegalProposal.js';
import InternationalTreaty from './InternationalTreaty.js';
import ClimateIndicator from './ClimateIndicator.js';
import ClimateIndicatorValue from './ClimateIndicatorValue.js';
// Opportunites d'investissement par province
import ProvinceOpportunity from './ProvinceOpportunity.js';
import OpportunityDocument from './OpportunityDocument.js';
import OpportunityApplication from './OpportunityApplication.js';
import ApplicationDocument from './ApplicationDocument.js';

// ==================== ASSOCIATIONS ====================

// User - Account
User.hasMany(Account, { foreignKey: 'userId', as: 'accounts' });
Account.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// User - Session
User.hasMany(Session, { foreignKey: 'userId', as: 'sessions' });
Session.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// User - Ministry (utilisateur appartient à un ministère)
User.belongsTo(Ministry, { foreignKey: 'ministryId', as: 'ministry' });
Ministry.hasMany(User, { foreignKey: 'ministryId', as: 'users' });

// HRDepartment - Self reference (hierarchy)
HRDepartment.belongsTo(HRDepartment, { foreignKey: 'parentId', as: 'parent' });
HRDepartment.hasMany(HRDepartment, { foreignKey: 'parentId', as: 'children' });

// HRDepartment - Manager (Employee)
HRDepartment.belongsTo(Employee, { foreignKey: 'managerId', as: 'manager' });

// Position - Department
Position.belongsTo(HRDepartment, { foreignKey: 'departmentId', as: 'department' });
HRDepartment.hasMany(Position, { foreignKey: 'departmentId', as: 'positions' });

// Position - Grade
Position.belongsTo(SalaryGrade, { foreignKey: 'gradeId', as: 'grade' });
SalaryGrade.hasMany(Position, { foreignKey: 'gradeId', as: 'positions' });

// Employee associations
Employee.belongsTo(HRDepartment, { foreignKey: 'departmentId', as: 'department' });
HRDepartment.hasMany(Employee, { foreignKey: 'departmentId', as: 'employees' });

Employee.belongsTo(Position, { foreignKey: 'positionId', as: 'position' });
Position.hasMany(Employee, { foreignKey: 'positionId', as: 'employees' });

Employee.belongsTo(SalaryGrade, { foreignKey: 'gradeId', as: 'grade' });
SalaryGrade.hasMany(Employee, { foreignKey: 'gradeId', as: 'employees' });

Employee.belongsTo(WorkerCategory, { foreignKey: 'categoryId', as: 'category' });
WorkerCategory.hasMany(Employee, { foreignKey: 'categoryId', as: 'employees' });

Employee.belongsTo(Employee, { foreignKey: 'managerId', as: 'manager' });
Employee.hasMany(Employee, { foreignKey: 'managerId', as: 'subordinates' });

Employee.belongsTo(User, { foreignKey: 'userId', as: 'user' });
User.hasOne(Employee, { foreignKey: 'userId', as: 'employee' });

// Employee - Spouse (One-to-One or One-to-Many depending on requirements)
Employee.hasOne(EmployeeSpouse, { foreignKey: 'employeeId', as: 'spouse' });
EmployeeSpouse.belongsTo(Employee, { foreignKey: 'employeeId', as: 'employee' });

// Employee - Children
Employee.hasMany(EmployeeChild, { foreignKey: 'employeeId', as: 'children' });
EmployeeChild.belongsTo(Employee, { foreignKey: 'employeeId', as: 'employee' });

// Employee - Bank Accounts
Employee.hasMany(EmployeeBankAccount, { foreignKey: 'employeeId', as: 'bankAccounts' });
EmployeeBankAccount.belongsTo(Employee, { foreignKey: 'employeeId', as: 'employee' });

// Employee - Identity Documents
Employee.hasMany(EmployeeIdentityDocument, { foreignKey: 'employeeId', as: 'identityDocuments' });
EmployeeIdentityDocument.belongsTo(Employee, { foreignKey: 'employeeId', as: 'employee' });

// Employee - Emergency Contacts
Employee.hasMany(EmployeeEmergencyContact, { foreignKey: 'employeeId', as: 'emergencyContacts' });
EmployeeEmergencyContact.belongsTo(Employee, { foreignKey: 'employeeId', as: 'employee' });

// Leave associations
Leave.belongsTo(Employee, { foreignKey: 'employeeId', as: 'employee' });
Employee.hasMany(Leave, { foreignKey: 'employeeId', as: 'leaves' });

Leave.belongsTo(LeaveType, { foreignKey: 'leaveTypeId', as: 'leaveType' });
LeaveType.hasMany(Leave, { foreignKey: 'leaveTypeId', as: 'leaves' });

Leave.belongsTo(User, { foreignKey: 'approvedById', as: 'approvedBy' });

// Payslip associations
Payslip.belongsTo(Employee, { foreignKey: 'employeeId', as: 'employee' });
Employee.hasMany(Payslip, { foreignKey: 'employeeId', as: 'payslips' });

// Investment associations
Investment.belongsTo(Investor, { foreignKey: 'investorId', as: 'investor' });
Investor.hasMany(Investment, { foreignKey: 'investorId', as: 'investments' });

// ProjectHistory - Investment (historique des projets)
ProjectHistory.belongsTo(Investment, { foreignKey: 'projectId', as: 'project' });
Investment.hasMany(ProjectHistory, { foreignKey: 'projectId', as: 'history', onDelete: 'CASCADE' });

// ProjectDocument - Investment
ProjectDocument.belongsTo(Investment, { foreignKey: 'projectId', as: 'project' });
Investment.hasMany(ProjectDocument, { foreignKey: 'projectId', as: 'documents', onDelete: 'CASCADE' });

// ApprovalRequest associations
ApprovalRequest.belongsTo(Investor, { foreignKey: 'investorId', as: 'investor' });
Investor.hasMany(ApprovalRequest, { foreignKey: 'investorId', as: 'approvalRequests' });

ApprovalRequest.belongsTo(Investment, { foreignKey: 'investmentId', as: 'investment' });
Investment.hasMany(ApprovalRequest, { foreignKey: 'investmentId', as: 'approvalRequests' });

ApprovalRequest.belongsTo(User, { foreignKey: 'assignedToId', as: 'assignedTo' });

// LegalDocument associations
LegalDocument.belongsTo(Investment, { foreignKey: 'investmentId', as: 'investment' });
Investment.hasMany(LegalDocument, { foreignKey: 'investmentId', as: 'legalDocuments' });

// ==================== GUICHET UNIQUE ASSOCIATIONS ====================

// Sector - Self reference (hierarchy)
Sector.belongsTo(Sector, { foreignKey: 'parentId', as: 'parent' });
Sector.hasMany(Sector, { foreignKey: 'parentId', as: 'subSectors' });

// Sector - Ministry (ministere de tutelle)
Sector.belongsTo(Ministry, { foreignKey: 'ministryId', as: 'ministry' });
Ministry.hasMany(Sector, { foreignKey: 'ministryId', as: 'sectors' });

// ActeAdministratif - Sector
ActeAdministratif.belongsTo(Sector, { foreignKey: 'sectorId', as: 'sector' });
Sector.hasMany(ActeAdministratif, { foreignKey: 'sectorId', as: 'actes' });

// ActeAdministratif - Ministry (ministere principal)
ActeAdministratif.belongsTo(Ministry, { foreignKey: 'ministryId', as: 'ministry' });
Ministry.hasMany(ActeAdministratif, { foreignKey: 'ministryId', as: 'actes' });

// ActeAdministratif - PieceRequise
ActeAdministratif.hasMany(PieceRequise, { foreignKey: 'acteId', as: 'piecesRequises', onDelete: 'CASCADE' });
PieceRequise.belongsTo(ActeAdministratif, { foreignKey: 'acteId', as: 'acte' });

// ActeAdministratif - ActeAdministration (administrations impliquees)
ActeAdministratif.hasMany(ActeAdministration, { foreignKey: 'acteId', as: 'administrations', onDelete: 'CASCADE' });
ActeAdministration.belongsTo(ActeAdministratif, { foreignKey: 'acteId', as: 'acte' });

// ActeAdministration - Ministry
ActeAdministration.belongsTo(Ministry, { foreignKey: 'ministryId', as: 'ministry' });
Ministry.hasMany(ActeAdministration, { foreignKey: 'ministryId', as: 'acteAdministrations' });

// ==================== DOSSIER ASSOCIATIONS ====================

// Dossier - Investor (optionnel)
Dossier.belongsTo(Investor, { foreignKey: 'investorId', as: 'investor' });
Investor.hasMany(Dossier, { foreignKey: 'investorId', as: 'dossiers' });

// Dossier - User (assignedTo)
Dossier.belongsTo(User, { foreignKey: 'assignedToId', as: 'assignedTo' });

// Dossier - User (createdBy)
Dossier.belongsTo(User, { foreignKey: 'createdById', as: 'createdBy' });

// Dossier - Ministry (ministère responsable)
Dossier.belongsTo(Ministry, { foreignKey: 'ministryId', as: 'ministry' });
Ministry.hasMany(Dossier, { foreignKey: 'ministryId', as: 'dossiers' });

// Dossier - DossierDocument
Dossier.hasMany(DossierDocument, { foreignKey: 'dossierId', as: 'documents', onDelete: 'CASCADE' });
DossierDocument.belongsTo(Dossier, { foreignKey: 'dossierId', as: 'dossier' });

// DossierDocument - User (uploadedBy)
DossierDocument.belongsTo(User, { foreignKey: 'uploadedById', as: 'uploadedBy' });

// DossierSector - Many-to-Many (Dossier <-> Sector)
DossierSector.belongsTo(Dossier, { foreignKey: 'dossierId', as: 'dossier' });
DossierSector.belongsTo(Sector, { foreignKey: 'sectorId', as: 'sector' });
Dossier.hasMany(DossierSector, { foreignKey: 'dossierId', as: 'dossierSectors', onDelete: 'CASCADE' });
Sector.hasMany(DossierSector, { foreignKey: 'sectorId', as: 'dossierSectors' });

// Many-to-Many through DossierSector
Dossier.belongsToMany(Sector, { through: DossierSector, foreignKey: 'dossierId', otherKey: 'sectorId', as: 'sectors' });
Sector.belongsToMany(Dossier, { through: DossierSector, foreignKey: 'sectorId', otherKey: 'dossierId', as: 'dossiers' });

// Dossier - StepValidations (historique des validations d'étapes)
Dossier.hasMany(DossierStepValidation, { foreignKey: 'dossierId', as: 'stepValidations', onDelete: 'CASCADE' });
DossierStepValidation.belongsTo(Dossier, { foreignKey: 'dossierId', as: 'dossier' });

// DossierStepValidation - User (validatedBy)
DossierStepValidation.belongsTo(User, { foreignKey: 'validatedById', as: 'validatedBy' });

// ==================== COMMUNICATION INTERNE ASSOCIATIONS ====================

// Message - User (sender)
Message.belongsTo(User, { foreignKey: 'senderId', as: 'sender' });
User.hasMany(Message, { foreignKey: 'senderId', as: 'sentMessages' });

// Message - MessageRecipient
Message.hasMany(MessageRecipient, { foreignKey: 'messageId', as: 'recipients', onDelete: 'CASCADE' });
MessageRecipient.belongsTo(Message, { foreignKey: 'messageId', as: 'message' });

// MessageRecipient - User (recipient)
MessageRecipient.belongsTo(User, { foreignKey: 'recipientId', as: 'recipient' });
User.hasMany(MessageRecipient, { foreignKey: 'recipientId', as: 'receivedMessages' });

// Message - MessageAttachment
Message.hasMany(MessageAttachment, { foreignKey: 'messageId', as: 'attachments', onDelete: 'CASCADE' });
MessageAttachment.belongsTo(Message, { foreignKey: 'messageId', as: 'message' });

// ==================== MINISTRY REQUESTS ASSOCIATIONS ====================

// MinistryWorkflow - Ministry
MinistryWorkflow.belongsTo(Ministry, { foreignKey: 'ministryId', as: 'ministry' });
Ministry.hasMany(MinistryWorkflow, { foreignKey: 'ministryId', as: 'workflows' });

// MinistryRequest - Ministry
MinistryRequest.belongsTo(Ministry, { foreignKey: 'ministryId', as: 'ministry' });
Ministry.hasMany(MinistryRequest, { foreignKey: 'ministryId', as: 'requests' });

// MinistryRequest - Investor (optionnel)
MinistryRequest.belongsTo(Investor, { foreignKey: 'investorId', as: 'investor' });
Investor.hasMany(MinistryRequest, { foreignKey: 'investorId', as: 'ministryRequests' });

// MinistryRequest - Dossier (optionnel)
MinistryRequest.belongsTo(Dossier, { foreignKey: 'dossierId', as: 'dossier' });
Dossier.hasMany(MinistryRequest, { foreignKey: 'dossierId', as: 'ministryRequests' });

// MinistryRequestHistory - MinistryRequest
MinistryRequestHistory.belongsTo(MinistryRequest, { foreignKey: 'requestId', as: 'request' });
MinistryRequest.hasMany(MinistryRequestHistory, { foreignKey: 'requestId', as: 'history', onDelete: 'CASCADE' });

// MinistryRequestDocument - MinistryRequest
MinistryRequestDocument.belongsTo(MinistryRequest, { foreignKey: 'requestId', as: 'request' });
MinistryRequest.hasMany(MinistryRequestDocument, { foreignKey: 'requestId', as: 'documents', onDelete: 'CASCADE' });

// ==================== REFERENTIELS ASSOCIATIONS ====================

// Province - City
Province.hasMany(City, { foreignKey: 'provinceId', as: 'cities' });
City.belongsTo(Province, { foreignKey: 'provinceId', as: 'province' });

// Dossier - Province/City (investisseur)
Dossier.belongsTo(Province, { foreignKey: 'investorProvinceId', as: 'investorProvinceRef' });
Dossier.belongsTo(City, { foreignKey: 'investorCityId', as: 'investorCityRef' });

// Dossier - Province/City (projet)
Dossier.belongsTo(Province, { foreignKey: 'projectProvinceId', as: 'projectProvinceRef' });
Dossier.belongsTo(City, { foreignKey: 'projectCityId', as: 'projectCityRef' });

// City - Commune
City.hasMany(Commune, { foreignKey: 'cityId', as: 'communes' });
Commune.belongsTo(City, { foreignKey: 'cityId', as: 'city' });

// Dossier - Commune (investisseur et projet)
Dossier.belongsTo(Commune, { foreignKey: 'investorCommuneId', as: 'investorCommuneRef' });
Dossier.belongsTo(Commune, { foreignKey: 'projectCommuneId', as: 'projectCommuneRef' });

// ==================== DIRECTION JURIDIQUE ASSOCIATIONS ====================

// JuridicalText - LegalDocumentType
JuridicalText.belongsTo(LegalDocumentType, { foreignKey: 'typeId', as: 'documentType' });
LegalDocumentType.hasMany(JuridicalText, { foreignKey: 'typeId', as: 'documents' });

// JuridicalText - LegalDomain
JuridicalText.belongsTo(LegalDomain, { foreignKey: 'domainId', as: 'domain' });
LegalDomain.hasMany(JuridicalText, { foreignKey: 'domainId', as: 'documents' });

// Contract - ContractType
Contract.belongsTo(ContractType, { foreignKey: 'typeId', as: 'contractType' });
ContractType.hasMany(Contract, { foreignKey: 'typeId', as: 'contracts' });

// Contract - LegalDomain
Contract.belongsTo(LegalDomain, { foreignKey: 'domainId', as: 'domain' });
LegalDomain.hasMany(Contract, { foreignKey: 'domainId', as: 'contracts' });

// LegalAlert - Contract
LegalAlert.belongsTo(Contract, { foreignKey: 'contractId', as: 'contract' });
Contract.hasMany(LegalAlert, { foreignKey: 'contractId', as: 'alerts' });

// LegalAlert - JuridicalText
LegalAlert.belongsTo(JuridicalText, { foreignKey: 'documentId', as: 'document' });
JuridicalText.hasMany(LegalAlert, { foreignKey: 'documentId', as: 'alerts' });

// ==================== PASSATION DE MARCHES ASSOCIATIONS ====================

// MinistryDepartment - Ministry
MinistryDepartment.belongsTo(Ministry, { foreignKey: 'ministryId', as: 'ministry' });
Ministry.hasMany(MinistryDepartment, { foreignKey: 'ministryId', as: 'departments' });

// Tender - Ministry
Tender.belongsTo(Ministry, { foreignKey: 'ministryId', as: 'ministry' });
Ministry.hasMany(Tender, { foreignKey: 'ministryId', as: 'tenders' });

// Tender - HRDepartment
Tender.belongsTo(HRDepartment, { foreignKey: 'departmentId', as: 'department' });

// Tender - User (createdBy, approvedBy, cancelledBy, archivedBy)
Tender.belongsTo(User, { foreignKey: 'createdById', as: 'createdBy' });
Tender.belongsTo(User, { foreignKey: 'approvedById', as: 'approvedBy' });
Tender.belongsTo(User, { foreignKey: 'cancelledById', as: 'cancelledBy' });
Tender.belongsTo(User, { foreignKey: 'archivedById', as: 'archivedBy' });

// Tender - TenderLot
Tender.hasMany(TenderLot, { foreignKey: 'tenderId', as: 'lots', onDelete: 'CASCADE' });
TenderLot.belongsTo(Tender, { foreignKey: 'tenderId', as: 'tender' });

// TenderLot - Bidder (awarded)
TenderLot.belongsTo(Bidder, { foreignKey: 'awardedBidderId', as: 'awardedBidder' });

// Tender - TenderDocument
Tender.hasMany(TenderDocument, { foreignKey: 'tenderId', as: 'documents', onDelete: 'CASCADE' });
TenderDocument.belongsTo(Tender, { foreignKey: 'tenderId', as: 'tender' });

// TenderDocument - ProcurementDocumentType
TenderDocument.belongsTo(ProcurementDocumentType, { foreignKey: 'documentTypeId', as: 'documentType' });

// TenderDocument - User (uploadedBy)
TenderDocument.belongsTo(User, { foreignKey: 'uploadedById', as: 'uploadedBy' });

// Tender - TenderHistory
Tender.hasMany(TenderHistory, { foreignKey: 'tenderId', as: 'history', onDelete: 'CASCADE' });
TenderHistory.belongsTo(Tender, { foreignKey: 'tenderId', as: 'tender' });
TenderHistory.belongsTo(User, { foreignKey: 'performedById', as: 'performedBy' });

// Tender - EvaluationCommittee
Tender.hasMany(EvaluationCommittee, { foreignKey: 'tenderId', as: 'committee', onDelete: 'CASCADE' });
EvaluationCommittee.belongsTo(Tender, { foreignKey: 'tenderId', as: 'tender' });
EvaluationCommittee.belongsTo(User, { foreignKey: 'userId', as: 'member' });
EvaluationCommittee.belongsTo(User, { foreignKey: 'nominatedById', as: 'nominatedBy' });

// Bidder - Country
Bidder.belongsTo(Country, { foreignKey: 'countryId', as: 'country' });

// Bidder - Province/City
Bidder.belongsTo(Province, { foreignKey: 'provinceId', as: 'province' });
Bidder.belongsTo(City, { foreignKey: 'cityId', as: 'city' });

// Bidder - User (createdBy, verifiedBy, blacklistedBy)
Bidder.belongsTo(User, { foreignKey: 'createdById', as: 'createdBy' });
Bidder.belongsTo(User, { foreignKey: 'verifiedById', as: 'verifiedBy' });
Bidder.belongsTo(User, { foreignKey: 'blacklistedById', as: 'blacklistedBy' });

// Bidder - BidderDocument
Bidder.hasMany(BidderDocument, { foreignKey: 'bidderId', as: 'documents', onDelete: 'CASCADE' });
BidderDocument.belongsTo(Bidder, { foreignKey: 'bidderId', as: 'bidder' });
BidderDocument.belongsTo(ProcurementDocumentType, { foreignKey: 'documentTypeId', as: 'documentType' });
BidderDocument.belongsTo(User, { foreignKey: 'uploadedById', as: 'uploadedBy' });
BidderDocument.belongsTo(User, { foreignKey: 'verifiedById', as: 'verifiedBy' });

// Bid - Tender
Bid.belongsTo(Tender, { foreignKey: 'tenderId', as: 'tender' });
Tender.hasMany(Bid, { foreignKey: 'tenderId', as: 'bids', onDelete: 'CASCADE' });

// Bid - Bidder
Bid.belongsTo(Bidder, { foreignKey: 'bidderId', as: 'bidder' });
Bidder.hasMany(Bid, { foreignKey: 'bidderId', as: 'bids' });

// Bid - TenderLot
Bid.belongsTo(TenderLot, { foreignKey: 'lotId', as: 'lot' });
TenderLot.hasMany(Bid, { foreignKey: 'lotId', as: 'bids' });

// Bid - User (evaluatedBy, receivedBy)
Bid.belongsTo(User, { foreignKey: 'evaluatedById', as: 'evaluatedBy' });
Bid.belongsTo(User, { foreignKey: 'receivedById', as: 'receivedBy' });

// Bid - BidDocument
Bid.hasMany(BidDocument, { foreignKey: 'bidId', as: 'documents', onDelete: 'CASCADE' });
BidDocument.belongsTo(Bid, { foreignKey: 'bidId', as: 'bid' });
BidDocument.belongsTo(ProcurementDocumentType, { foreignKey: 'documentTypeId', as: 'documentType' });
BidDocument.belongsTo(User, { foreignKey: 'uploadedById', as: 'uploadedBy' });
BidDocument.belongsTo(User, { foreignKey: 'checkedById', as: 'checkedBy' });

// ProcurementContract - Tender
ProcurementContract.belongsTo(Tender, { foreignKey: 'tenderId', as: 'tender' });
Tender.hasMany(ProcurementContract, { foreignKey: 'tenderId', as: 'contracts' });

// ProcurementContract - Bid
ProcurementContract.belongsTo(Bid, { foreignKey: 'bidId', as: 'bid' });
Bid.hasOne(ProcurementContract, { foreignKey: 'bidId', as: 'contract' });

// ProcurementContract - Bidder
ProcurementContract.belongsTo(Bidder, { foreignKey: 'bidderId', as: 'contractor' });
Bidder.hasMany(ProcurementContract, { foreignKey: 'bidderId', as: 'contracts' });

// ProcurementContract - TenderLot
ProcurementContract.belongsTo(TenderLot, { foreignKey: 'lotId', as: 'lot' });

// ProcurementContract - Ministry
ProcurementContract.belongsTo(Ministry, { foreignKey: 'ministryId', as: 'ministry' });

// ProcurementContract - User
ProcurementContract.belongsTo(User, { foreignKey: 'managedById', as: 'manager' });
ProcurementContract.belongsTo(User, { foreignKey: 'signedByClientId', as: 'signedByClient' });
ProcurementContract.belongsTo(User, { foreignKey: 'createdById', as: 'createdBy' });
ProcurementContract.belongsTo(User, { foreignKey: 'certificateIssuedById', as: 'certificateIssuedBy' });

// ProcurementContract - ContractExecution
ProcurementContract.hasMany(ContractExecution, { foreignKey: 'contractId', as: 'executions', onDelete: 'CASCADE' });
ContractExecution.belongsTo(ProcurementContract, { foreignKey: 'contractId', as: 'contract' });

// ContractExecution - User
ContractExecution.belongsTo(User, { foreignKey: 'inspectedById', as: 'inspectedBy' });
ContractExecution.belongsTo(User, { foreignKey: 'approvedById', as: 'approvedBy' });
ContractExecution.belongsTo(User, { foreignKey: 'createdById', as: 'createdBy' });

// ProcurementContract - ContractDocument
ProcurementContract.hasMany(ContractDocument, { foreignKey: 'contractId', as: 'documents', onDelete: 'CASCADE' });
ContractDocument.belongsTo(ProcurementContract, { foreignKey: 'contractId', as: 'contract' });
ContractDocument.belongsTo(ContractExecution, { foreignKey: 'executionId', as: 'execution' });
ContractDocument.belongsTo(ProcurementDocumentType, { foreignKey: 'documentTypeId', as: 'documentType' });
ContractDocument.belongsTo(User, { foreignKey: 'uploadedById', as: 'uploadedBy' });

// ==================== INVESTISSEMENTS - NOUVEAUX MODULES ====================

// ProjectMilestone - Investment
ProjectMilestone.belongsTo(Investment, { foreignKey: 'projectId', as: 'project' });
Investment.hasMany(ProjectMilestone, { foreignKey: 'projectId', as: 'milestones', onDelete: 'CASCADE' });
ProjectMilestone.belongsTo(User, { foreignKey: 'completedById', as: 'completedBy' });
ProjectMilestone.belongsTo(User, { foreignKey: 'createdById', as: 'createdBy' });

// ProjectRisk - Investment
ProjectRisk.belongsTo(Investment, { foreignKey: 'projectId', as: 'project' });
Investment.hasMany(ProjectRisk, { foreignKey: 'projectId', as: 'risks', onDelete: 'CASCADE' });
ProjectRisk.belongsTo(User, { foreignKey: 'createdById', as: 'createdBy' });
ProjectRisk.belongsTo(User, { foreignKey: 'updatedById', as: 'updatedBy' });

// ProjectImpact - Investment
ProjectImpact.belongsTo(Investment, { foreignKey: 'projectId', as: 'project' });
Investment.hasMany(ProjectImpact, { foreignKey: 'projectId', as: 'impacts', onDelete: 'CASCADE' });
ProjectImpact.belongsTo(User, { foreignKey: 'verifiedById', as: 'verifiedBy' });
ProjectImpact.belongsTo(User, { foreignKey: 'createdById', as: 'createdBy' });

// ==================== PROCUREMENT - NOUVEAUX MODULES ====================

// BidderRating - Bidder
BidderRating.belongsTo(Bidder, { foreignKey: 'bidderId', as: 'bidder' });
Bidder.hasMany(BidderRating, { foreignKey: 'bidderId', as: 'ratings', onDelete: 'CASCADE' });
BidderRating.belongsTo(ProcurementContract, { foreignKey: 'contractId', as: 'contract' });
BidderRating.belongsTo(Tender, { foreignKey: 'tenderId', as: 'tender' });
BidderRating.belongsTo(User, { foreignKey: 'evaluatedById', as: 'evaluatedBy' });
BidderRating.belongsTo(User, { foreignKey: 'approvedById', as: 'approvedBy' });

// FrameworkAgreement
FrameworkAgreement.belongsTo(Tender, { foreignKey: 'tenderId', as: 'tender' });
FrameworkAgreement.belongsTo(Ministry, { foreignKey: 'ministryId', as: 'ministry' });
FrameworkAgreement.belongsTo(User, { foreignKey: 'signedByClientId', as: 'signedByClient' });
FrameworkAgreement.belongsTo(User, { foreignKey: 'createdById', as: 'createdBy' });
FrameworkAgreement.belongsTo(User, { foreignKey: 'approvedById', as: 'approvedBy' });

// FrameworkAgreementSupplier
FrameworkAgreementSupplier.belongsTo(FrameworkAgreement, { foreignKey: 'agreementId', as: 'agreement' });
FrameworkAgreement.hasMany(FrameworkAgreementSupplier, { foreignKey: 'agreementId', as: 'suppliers', onDelete: 'CASCADE' });
FrameworkAgreementSupplier.belongsTo(Bidder, { foreignKey: 'bidderId', as: 'bidder' });
FrameworkAgreementSupplier.belongsTo(User, { foreignKey: 'addedById', as: 'addedBy' });

// FrameworkOrder
FrameworkOrder.belongsTo(FrameworkAgreement, { foreignKey: 'agreementId', as: 'agreement' });
FrameworkAgreement.hasMany(FrameworkOrder, { foreignKey: 'agreementId', as: 'orders', onDelete: 'CASCADE' });
FrameworkOrder.belongsTo(FrameworkAgreementSupplier, { foreignKey: 'supplierId', as: 'supplier' });
FrameworkOrder.belongsTo(Bidder, { foreignKey: 'bidderId', as: 'bidder' });
FrameworkOrder.belongsTo(User, { foreignKey: 'requestedById', as: 'requestedBy' });
FrameworkOrder.belongsTo(User, { foreignKey: 'approvedById', as: 'approvedBy' });
FrameworkOrder.belongsTo(User, { foreignKey: 'receivedById', as: 'receivedBy' });

// ==================== HR - NOUVEAUX MODULES ====================

// WorkSchedule - Employee
Employee.belongsTo(WorkSchedule, { foreignKey: 'workScheduleId', as: 'workSchedule' });
WorkSchedule.hasMany(Employee, { foreignKey: 'workScheduleId', as: 'employees' });

// Attendance - Employee
Attendance.belongsTo(Employee, { foreignKey: 'employeeId', as: 'employee' });
Employee.hasMany(Attendance, { foreignKey: 'employeeId', as: 'attendances', onDelete: 'CASCADE' });
Attendance.belongsTo(Leave, { foreignKey: 'leaveId', as: 'leave' });
Attendance.belongsTo(User, { foreignKey: 'validatedById', as: 'validatedBy' });

// Overtime - Employee
Overtime.belongsTo(Employee, { foreignKey: 'employeeId', as: 'employee' });
Employee.hasMany(Overtime, { foreignKey: 'employeeId', as: 'overtimes', onDelete: 'CASCADE' });
Overtime.belongsTo(Payslip, { foreignKey: 'payslipId', as: 'payslip' });
Overtime.belongsTo(User, { foreignKey: 'requestedById', as: 'requestedBy' });
Overtime.belongsTo(User, { foreignKey: 'approvedById', as: 'approvedBy' });

// ==================== CLIMAT DES AFFAIRES ====================

// BusinessBarrier - Investor
BusinessBarrier.belongsTo(Investor, { foreignKey: 'investorId', as: 'investor' });
Investor.hasMany(BusinessBarrier, { foreignKey: 'investorId', as: 'barriers' });

// BusinessBarrier - Investment
BusinessBarrier.belongsTo(Investment, { foreignKey: 'projectId', as: 'project' });
Investment.hasMany(BusinessBarrier, { foreignKey: 'projectId', as: 'barriers' });

// BusinessBarrier - User
BusinessBarrier.belongsTo(User, { foreignKey: 'assignedToId', as: 'assignedTo' });
BusinessBarrier.belongsTo(User, { foreignKey: 'createdById', as: 'createdBy' });
BusinessBarrier.belongsTo(User, { foreignKey: 'resolvedById', as: 'resolvedBy' });

// BarrierResolution - BusinessBarrier
BarrierResolution.belongsTo(BusinessBarrier, { foreignKey: 'barrierId', as: 'barrier' });
BusinessBarrier.hasMany(BarrierResolution, { foreignKey: 'barrierId', as: 'resolutions', onDelete: 'CASCADE' });
BarrierResolution.belongsTo(User, { foreignKey: 'performedById', as: 'performedBy' });

// MediationCase - Investor
MediationCase.belongsTo(Investor, { foreignKey: 'investorId', as: 'investor' });
Investor.hasMany(MediationCase, { foreignKey: 'investorId', as: 'mediationCases' });

// MediationCase - Investment
MediationCase.belongsTo(Investment, { foreignKey: 'projectId', as: 'project' });
Investment.hasMany(MediationCase, { foreignKey: 'projectId', as: 'mediationCases' });

// MediationCase - BusinessBarrier
MediationCase.belongsTo(BusinessBarrier, { foreignKey: 'barrierId', as: 'barrier' });
BusinessBarrier.hasMany(MediationCase, { foreignKey: 'barrierId', as: 'mediationCases' });

// MediationCase - User
MediationCase.belongsTo(User, { foreignKey: 'mediatorId', as: 'mediator' });
MediationCase.belongsTo(User, { foreignKey: 'createdById', as: 'createdBy' });

// StakeholderDialogue - Self-reference (next event)
StakeholderDialogue.belongsTo(StakeholderDialogue, { foreignKey: 'nextEventId', as: 'nextEvent' });
StakeholderDialogue.hasOne(StakeholderDialogue, { foreignKey: 'nextEventId', as: 'previousEvent' });

// StakeholderDialogue - User
StakeholderDialogue.belongsTo(User, { foreignKey: 'organizerId', as: 'organizer' });
StakeholderDialogue.belongsTo(User, { foreignKey: 'createdById', as: 'createdBy' });

// DialogueParticipant - StakeholderDialogue
DialogueParticipant.belongsTo(StakeholderDialogue, { foreignKey: 'dialogueId', as: 'dialogue' });
StakeholderDialogue.hasMany(DialogueParticipant, { foreignKey: 'dialogueId', as: 'participants', onDelete: 'CASCADE' });

// DialogueParticipant - Investor
DialogueParticipant.belongsTo(Investor, { foreignKey: 'investorId', as: 'investor' });

// DialogueParticipant - User
DialogueParticipant.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// LegalProposal - JuridicalText
LegalProposal.belongsTo(JuridicalText, { foreignKey: 'relatedTextId', as: 'relatedText' });
JuridicalText.hasMany(LegalProposal, { foreignKey: 'relatedTextId', as: 'proposals' });

// LegalProposal - User
LegalProposal.belongsTo(User, { foreignKey: 'createdById', as: 'createdBy' });
LegalProposal.belongsTo(User, { foreignKey: 'approvedById', as: 'approvedBy' });

// InternationalTreaty - User
InternationalTreaty.belongsTo(User, { foreignKey: 'responsibleId', as: 'responsible' });
InternationalTreaty.belongsTo(User, { foreignKey: 'createdById', as: 'createdBy' });

// ClimateIndicator - User
ClimateIndicator.belongsTo(User, { foreignKey: 'createdById', as: 'createdBy' });

// ClimateIndicatorValue - ClimateIndicator
ClimateIndicatorValue.belongsTo(ClimateIndicator, { foreignKey: 'indicatorId', as: 'indicator' });
ClimateIndicator.hasMany(ClimateIndicatorValue, { foreignKey: 'indicatorId', as: 'values', onDelete: 'CASCADE' });

// ClimateIndicatorValue - User
ClimateIndicatorValue.belongsTo(User, { foreignKey: 'createdById', as: 'createdBy' });
ClimateIndicatorValue.belongsTo(User, { foreignKey: 'verifiedById', as: 'verifiedBy' });

// ==================== OPPORTUNITES D'INVESTISSEMENT PAR PROVINCE ====================

// ProvinceOpportunity - Province
ProvinceOpportunity.belongsTo(Province, { foreignKey: 'provinceId', as: 'province' });
Province.hasMany(ProvinceOpportunity, { foreignKey: 'provinceId', as: 'opportunities' });

// ProvinceOpportunity - Sector
ProvinceOpportunity.belongsTo(Sector, { foreignKey: 'sectorId', as: 'sector' });
Sector.hasMany(ProvinceOpportunity, { foreignKey: 'sectorId', as: 'opportunities' });

// ProvinceOpportunity - User (createdBy)
ProvinceOpportunity.belongsTo(User, { foreignKey: 'createdById', as: 'createdBy' });

// ProvinceOpportunity - OpportunityDocument (documents requis)
ProvinceOpportunity.hasMany(OpportunityDocument, { foreignKey: 'opportunityId', as: 'requiredDocuments', onDelete: 'CASCADE' });
OpportunityDocument.belongsTo(ProvinceOpportunity, { foreignKey: 'opportunityId', as: 'opportunity' });

// ProvinceOpportunity - OpportunityApplication (candidatures)
ProvinceOpportunity.hasMany(OpportunityApplication, { foreignKey: 'opportunityId', as: 'applications', onDelete: 'CASCADE' });
OpportunityApplication.belongsTo(ProvinceOpportunity, { foreignKey: 'opportunityId', as: 'opportunity' });

// OpportunityApplication - Investor
OpportunityApplication.belongsTo(Investor, { foreignKey: 'investorId', as: 'investor' });
Investor.hasMany(OpportunityApplication, { foreignKey: 'investorId', as: 'opportunityApplications' });

// OpportunityApplication - User (reviewedBy)
OpportunityApplication.belongsTo(User, { foreignKey: 'reviewedById', as: 'reviewedBy' });

// OpportunityApplication - ApplicationDocument
OpportunityApplication.hasMany(ApplicationDocument, { foreignKey: 'applicationId', as: 'documents', onDelete: 'CASCADE' });
ApplicationDocument.belongsTo(OpportunityApplication, { foreignKey: 'applicationId', as: 'application' });

// ApplicationDocument - OpportunityDocument (document requis correspondant)
ApplicationDocument.belongsTo(OpportunityDocument, { foreignKey: 'requiredDocumentId', as: 'requiredDocument' });

// ApplicationDocument - User (uploadedBy, verifiedBy)
ApplicationDocument.belongsTo(User, { foreignKey: 'uploadedById', as: 'uploadedBy' });
ApplicationDocument.belongsTo(User, { foreignKey: 'verifiedById', as: 'verifiedBy' });

// Export all models
export {
  sequelize,
  User,
  Account,
  Session,
  VerificationToken,
  HRDepartment,
  Position,
  SalaryGrade,
  WorkerCategory,
  Employee,
  EmployeeSpouse,
  EmployeeChild,
  EmployeeBankAccount,
  EmployeeIdentityDocument,
  EmployeeEmergencyContact,
  LeaveType,
  Leave,
  Payslip,
  Investor,
  Investment,
  ProjectHistory,
  ProjectDocument,
  ApprovalRequest,
  LegalDocument,
  WorkflowStep,
  // Guichet Unique
  Sector,
  Ministry,
  ActeAdministratif,
  PieceRequise,
  ActeAdministration,
  Dossier,
  DossierDocument,
  DossierSector,
  DossierStepValidation,
  // Ministry Requests
  MinistryWorkflow,
  MinistryRequest,
  MinistryRequestHistory,
  MinistryRequestDocument,
  // Configuration
  RequiredDocument,
  // Communication interne
  Message,
  MessageRecipient,
  MessageAttachment,
  // Référentiels
  Province,
  City,
  Commune,
  Currency,
  Country,
  // Direction Juridique
  LegalDocumentType,
  LegalDomain,
  JuridicalText,
  ContractType,
  Contract,
  LegalAlert,
  // Configuration systeme
  SystemConfig,
  // Passation de Marches
  MinistryDepartment,
  ProcurementDocumentType,
  Tender,
  TenderLot,
  TenderDocument,
  TenderHistory,
  Bidder,
  BidderDocument,
  Bid,
  BidDocument,
  ProcurementContract,
  ContractExecution,
  ContractDocument,
  EvaluationCommittee,
  // Nouveaux modèles - Investissements
  ProjectMilestone,
  ProjectRisk,
  ProjectImpact,
  // Nouveaux modèles - Procurement
  BidderRating,
  FrameworkAgreement,
  FrameworkAgreementSupplier,
  FrameworkOrder,
  // Nouveaux modèles - HR
  Attendance,
  Overtime,
  WorkSchedule,
  PublicHoliday,
  // Climat des Affaires
  BusinessBarrier,
  BarrierResolution,
  MediationCase,
  StakeholderDialogue,
  DialogueParticipant,
  LegalProposal,
  InternationalTreaty,
  ClimateIndicator,
  ClimateIndicatorValue,
  // Opportunites d'investissement par province
  ProvinceOpportunity,
  OpportunityDocument,
  OpportunityApplication,
  ApplicationDocument,
};

export default {
  sequelize,
  User,
  Account,
  Session,
  VerificationToken,
  HRDepartment,
  Position,
  SalaryGrade,
  WorkerCategory,
  Employee,
  EmployeeSpouse,
  EmployeeChild,
  EmployeeBankAccount,
  EmployeeIdentityDocument,
  EmployeeEmergencyContact,
  LeaveType,
  Leave,
  Payslip,
  Investor,
  Investment,
  ProjectHistory,
  ProjectDocument,
  ApprovalRequest,
  LegalDocument,
  WorkflowStep,
  // Guichet Unique
  Sector,
  Ministry,
  ActeAdministratif,
  PieceRequise,
  ActeAdministration,
  Dossier,
  DossierDocument,
  DossierSector,
  DossierStepValidation,
  // Ministry Requests
  MinistryWorkflow,
  MinistryRequest,
  MinistryRequestHistory,
  MinistryRequestDocument,
  // Configuration
  RequiredDocument,
  // Communication interne
  Message,
  MessageRecipient,
  MessageAttachment,
  // Référentiels
  Province,
  City,
  Commune,
  Currency,
  Country,
  // Direction Juridique
  LegalDocumentType,
  LegalDomain,
  JuridicalText,
  ContractType,
  Contract,
  LegalAlert,
  // Configuration systeme
  SystemConfig,
  // Passation de Marches
  MinistryDepartment,
  ProcurementDocumentType,
  Tender,
  TenderLot,
  TenderDocument,
  TenderHistory,
  Bidder,
  BidderDocument,
  Bid,
  BidDocument,
  ProcurementContract,
  ContractExecution,
  ContractDocument,
  EvaluationCommittee,
  // Nouveaux modèles - Investissements
  ProjectMilestone,
  ProjectRisk,
  ProjectImpact,
  // Nouveaux modèles - Procurement
  BidderRating,
  FrameworkAgreement,
  FrameworkAgreementSupplier,
  FrameworkOrder,
  // Nouveaux modèles - HR
  Attendance,
  Overtime,
  WorkSchedule,
  PublicHoliday,
  // Climat des Affaires
  BusinessBarrier,
  BarrierResolution,
  MediationCase,
  StakeholderDialogue,
  DialogueParticipant,
  LegalProposal,
  InternationalTreaty,
  ClimateIndicator,
  ClimateIndicatorValue,
  // Opportunites d'investissement par province
  ProvinceOpportunity,
  OpportunityDocument,
  OpportunityApplication,
  ApplicationDocument,
};
