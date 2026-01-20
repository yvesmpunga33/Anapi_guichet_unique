// HR Services - Index
// Export all HR-related services

// Dashboard
export { default as dashboardService } from './dashboardService';
export * from './dashboardService';

// Employee Management
export { default as employeeService } from './employeeService';
export * from './employeeService';

export { default as employeeDocumentService } from './employeeDocumentService';
export * from './employeeDocumentService';

// Attendance Management
export { default as attendanceService } from './attendanceService';
export * from './attendanceService';

export { default as attendanceTypeService } from './attendanceTypeService';
export * from './attendanceTypeService';

// Leave Management
export { default as leaveService } from './leaveService';
export * from './leaveService';

// Payroll Management
export { default as payrollService } from './payrollService';
export * from './payrollService';

// Bonus Management
export { default as bonusService } from './bonusService';
export * from './bonusService';

export { default as bonusTypeService } from './bonusTypeService';
export * from './bonusTypeService';

// Deduction Management
export { default as deductionService } from './deductionService';
export * from './deductionService';

export { default as deductionTypeService } from './deductionTypeService';
export * from './deductionTypeService';

// Organization Structure
export { default as departmentService } from './departmentService';
export * from './departmentService';

export { default as positionService } from './positionService';
export * from './positionService';

export { default as gradeService } from './gradeService';
export * from './gradeService';

export { default as categoryService } from './categoryService';
export * from './categoryService';

// HR Configuration
export { default as hrconfigService } from './hrconfigService';
export * from './hrconfigService';

// Contract Types
export { default as contractTypeService } from './contractTypeService';
export * from './contractTypeService';

// Default export with all services grouped
import _dashboardService from './dashboardService';
import _employeeService from './employeeService';
import _employeeDocumentService from './employeeDocumentService';
import _attendanceService from './attendanceService';
import _attendanceTypeService from './attendanceTypeService';
import _leaveService from './leaveService';
import _payrollService from './payrollService';
import _bonusService from './bonusService';
import _bonusTypeService from './bonusTypeService';
import _deductionService from './deductionService';
import _deductionTypeService from './deductionTypeService';
import _departmentService from './departmentService';
import _positionService from './positionService';
import _gradeService from './gradeService';
import _categoryService from './categoryService';
import _hrconfigService from './hrconfigService';
import _contractTypeService from './contractTypeService';

export const hrServices = {
  dashboardService: _dashboardService,
  employeeService: _employeeService,
  employeeDocumentService: _employeeDocumentService,
  attendanceService: _attendanceService,
  attendanceTypeService: _attendanceTypeService,
  leaveService: _leaveService,
  payrollService: _payrollService,
  bonusService: _bonusService,
  bonusTypeService: _bonusTypeService,
  deductionService: _deductionService,
  deductionTypeService: _deductionTypeService,
  departmentService: _departmentService,
  positionService: _positionService,
  gradeService: _gradeService,
  categoryService: _categoryService,
  hrconfigService: _hrconfigService,
  contractTypeService: _contractTypeService,
};
