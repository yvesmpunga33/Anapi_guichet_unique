import { NextResponse } from 'next/server';
import { auth } from '../../../../lib/auth.js';
import {
  Employee,
  HRDepartment,
  Position,
  SalaryGrade,
  WorkerCategory,
  EmployeeSpouse,
  EmployeeChild,
  EmployeeBankAccount,
  EmployeeIdentityDocument,
  EmployeeEmergencyContact,
} from '../../../../../models/index.js';

// GET /api/hr/employees/[id] - Get employee by ID with all relations
export async function GET(request, { params }) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'Non autorise' }, { status: 401 });
    }

    const { id } = await params;

    const employee = await Employee.findByPk(id, {
      include: [
        { model: HRDepartment, as: 'department', attributes: ['id', 'name', 'code'] },
        { model: Position, as: 'position', attributes: ['id', 'title', 'code'] },
        { model: SalaryGrade, as: 'grade', attributes: ['id', 'name', 'code', 'minSalary', 'maxSalary'] },
        { model: WorkerCategory, as: 'category', attributes: ['id', 'name', 'code'] },
        { model: Employee, as: 'manager', attributes: ['id', 'firstName', 'lastName', 'matricule'] },
        { model: EmployeeSpouse, as: 'spouse' },
        { model: EmployeeChild, as: 'children' },
        { model: EmployeeBankAccount, as: 'bankAccounts' },
        { model: EmployeeIdentityDocument, as: 'identityDocuments' },
        { model: EmployeeEmergencyContact, as: 'emergencyContacts' },
      ],
    });

    if (!employee) {
      return NextResponse.json({ error: 'Employe non trouve' }, { status: 404 });
    }

    return NextResponse.json({ employee: employee.toJSON() });
  } catch (error) {
    console.error('Error fetching employee:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la recuperation de l\'employe' },
      { status: 500 }
    );
  }
}

// PUT /api/hr/employees/[id] - Update employee
export async function PUT(request, { params }) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'Non autorise' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();

    const employee = await Employee.findByPk(id);
    if (!employee) {
      return NextResponse.json({ error: 'Employe non trouve' }, { status: 404 });
    }

    // Update employee fields
    await employee.update({
      firstName: body.firstName,
      lastName: body.lastName,
      middleName: body.middleName,
      gender: body.gender,
      photoUrl: body.photoUrl,
      dateOfBirth: body.dateOfBirth,
      placeOfBirth: body.placeOfBirth,
      provinceOfOrigin: body.provinceOfOrigin,
      nationality: body.nationality,
      countryOfBirth: body.countryOfBirth,
      maritalStatus: body.maritalStatus,
      marriageDate: body.marriageDate,
      marriageRegime: body.marriageRegime,
      numberOfChildren: body.numberOfChildren,
      dependentsCount: body.dependentsCount,
      addressLine1: body.addressLine1,
      addressLine2: body.addressLine2,
      neighborhood: body.neighborhood,
      commune: body.commune,
      city: body.city,
      province: body.province,
      country: body.country,
      postalCode: body.postalCode,
      phonePrimary: body.phonePrimary,
      phoneSecondary: body.phoneSecondary,
      personalEmail: body.personalEmail,
      workEmail: body.workEmail,
      nationalIdNumber: body.nationalIdNumber,
      nationalIdIssueDate: body.nationalIdIssueDate,
      nationalIdExpiryDate: body.nationalIdExpiryDate,
      passportNumber: body.passportNumber,
      passportIssueDate: body.passportIssueDate,
      passportExpiryDate: body.passportExpiryDate,
      socialSecurityNumber: body.socialSecurityNumber,
      taxIdNumber: body.taxIdNumber,
      driverLicenseNumber: body.driverLicenseNumber,
      driverLicenseExpiry: body.driverLicenseExpiry,
      departmentId: body.departmentId,
      positionId: body.positionId,
      gradeId: body.gradeId,
      categoryId: body.categoryId,
      managerId: body.managerId,
      costCenterId: body.costCenterId,
      hireDate: body.hireDate,
      contractType: body.contractType,
      contractStartDate: body.contractStartDate,
      contractEndDate: body.contractEndDate,
      probationEndDate: body.probationEndDate,
      terminationDate: body.terminationDate,
      terminationReason: body.terminationReason,
      baseSalary: body.baseSalary,
      currency: body.currency,
      status: body.status,
      isActive: body.isActive,
    });

    // Fetch updated employee with relations
    const updatedEmployee = await Employee.findByPk(id, {
      include: [
        { model: HRDepartment, as: 'department', attributes: ['id', 'name', 'code'] },
        { model: Position, as: 'position', attributes: ['id', 'title', 'code'] },
        { model: SalaryGrade, as: 'grade', attributes: ['id', 'name', 'code'] },
        { model: WorkerCategory, as: 'category', attributes: ['id', 'name', 'code'] },
      ],
    });

    return NextResponse.json({ employee: updatedEmployee?.toJSON() });
  } catch (error) {
    console.error('Error updating employee:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la mise a jour de l\'employe' },
      { status: 500 }
    );
  }
}

// DELETE /api/hr/employees/[id] - Delete employee
export async function DELETE(request, { params }) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'Non autorise' }, { status: 401 });
    }

    const { id } = await params;

    const employee = await Employee.findByPk(id);
    if (!employee) {
      return NextResponse.json({ error: 'Employe non trouve' }, { status: 404 });
    }

    // Soft delete - just mark as inactive
    await employee.update({ isActive: false, status: 'TERMINATED' });

    return NextResponse.json({ message: 'Employe supprime avec succes' });
  } catch (error) {
    console.error('Error deleting employee:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la suppression de l\'employe' },
      { status: 500 }
    );
  }
}
