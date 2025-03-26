
import { User } from './types';

// Define permission levels for each role
export const rolePermissions = {
  admin: {
    canAddPatient: true,
    canViewAllPatients: true,
    canModifyPatientData: true,
    canAddDoctor: true,
    canViewFinances: true,
    canManagePharmacy: true,
    canManageReports: true,
    canManageSystem: true,
    canBookAppointment: true,
    canPerformAdmission: true,
    canGenerateReports: true,
  },
  doctor: {
    canAddPatient: true,
    canViewAllPatients: true,
    canModifyPatientData: true,
    canAddDoctor: false,
    canViewFinances: false,
    canManagePharmacy: false,
    canManageReports: true,
    canManageSystem: false,
    canBookAppointment: true,
    canPerformAdmission: true,
    canGenerateReports: true,
  },
  nurse: {
    canAddPatient: true,
    canViewAllPatients: true,
    canModifyPatientData: true,
    canAddDoctor: false,
    canViewFinances: false,
    canManagePharmacy: false,
    canManageReports: false,
    canManageSystem: false,
    canBookAppointment: true,
    canPerformAdmission: true,
    canGenerateReports: false,
  },
  receptionist: {
    canAddPatient: true,
    canViewAllPatients: true,
    canModifyPatientData: false,
    canAddDoctor: false,
    canViewFinances: true,
    canManagePharmacy: false,
    canManageReports: false,
    canManageSystem: false,
    canBookAppointment: true,
    canPerformAdmission: false,
    canGenerateReports: false,
  },
  patient: {
    canAddPatient: false,
    canViewAllPatients: false,
    canModifyPatientData: false,
    canAddDoctor: false,
    canViewFinances: false,
    canManagePharmacy: false,
    canManageReports: false,
    canManageSystem: false,
    canBookAppointment: true,
    canPerformAdmission: false,
    canGenerateReports: false,
  },
  pharmacist: {
    canAddPatient: false,
    canViewAllPatients: false,
    canModifyPatientData: false,
    canAddDoctor: false,
    canViewFinances: false,
    canManagePharmacy: true,
    canManageReports: false,
    canManageSystem: false,
    canBookAppointment: false,
    canPerformAdmission: false,
    canGenerateReports: false,
  }
};

// Helper function to check if a user has a specific permission
export const hasPermission = (user: User | null, permission: keyof typeof rolePermissions[keyof typeof rolePermissions]): boolean => {
  if (!user) return false;
  
  const role = user.role;
  return rolePermissions[role][permission] === true;
};
