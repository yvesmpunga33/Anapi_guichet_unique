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
import ApprovalRequest from './ApprovalRequest.js';
import LegalDocument from './LegalDocument.js';
import WorkflowStep from './WorkflowStep.js';
// Nouveaux modeles pour le Guichet Unique
import Sector from './Sector.js';
import Ministry from './Ministry.js';
import ActeAdministratif from './ActeAdministratif.js';
import PieceRequise from './PieceRequise.js';
import ActeAdministration from './ActeAdministration.js';

// ==================== ASSOCIATIONS ====================

// User - Account
User.hasMany(Account, { foreignKey: 'userId', as: 'accounts' });
Account.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// User - Session
User.hasMany(Session, { foreignKey: 'userId', as: 'sessions' });
Session.belongsTo(User, { foreignKey: 'userId', as: 'user' });

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
  ApprovalRequest,
  LegalDocument,
  WorkflowStep,
  // Guichet Unique
  Sector,
  Ministry,
  ActeAdministratif,
  PieceRequise,
  ActeAdministration,
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
  ApprovalRequest,
  LegalDocument,
  WorkflowStep,
  // Guichet Unique
  Sector,
  Ministry,
  ActeAdministratif,
  PieceRequise,
  ActeAdministration,
};
