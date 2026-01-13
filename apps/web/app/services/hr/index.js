// HR Services - Index
// Export all HR-related services

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

// Default export with all services grouped
export default {
  employeeService: require('./employeeService').default,
  employeeDocumentService: require('./employeeDocumentService').default,
  attendanceService: require('./attendanceService').default,
  attendanceTypeService: require('./attendanceTypeService').default,
  leaveService: require('./leaveService').default,
  payrollService: require('./payrollService').default,
  bonusService: require('./bonusService').default,
  bonusTypeService: require('./bonusTypeService').default,
  deductionService: require('./deductionService').default,
  deductionTypeService: require('./deductionTypeService').default,
  departmentService: require('./departmentService').default,
  positionService: require('./positionService').default,
  gradeService: require('./gradeService').default,
  categoryService: require('./categoryService').default,
  hrconfigService: require('./hrconfigService').default,
};
