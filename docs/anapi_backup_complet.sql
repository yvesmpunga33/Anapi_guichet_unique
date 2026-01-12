--
-- PostgreSQL database dump
--

\restrict iHPxdQhw2CP1H2vK4KhmXfHz5yHUab3MX9U9P6t3QU17TaeZotKathzYKt9aRd5

-- Dumped from database version 16.11 (Homebrew)
-- Dumped by pg_dump version 16.11 (Homebrew)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: AdvanceStatus; Type: TYPE; Schema: public; Owner: yvesmpunga
--

CREATE TYPE public."AdvanceStatus" AS ENUM (
    'PENDING',
    'APPROVED',
    'REJECTED',
    'DISBURSED',
    'REPAYING',
    'REPAID'
);


ALTER TYPE public."AdvanceStatus" OWNER TO yvesmpunga;

--
-- Name: ApprovalStatus; Type: TYPE; Schema: public; Owner: yvesmpunga
--

CREATE TYPE public."ApprovalStatus" AS ENUM (
    'DRAFT',
    'SUBMITTED',
    'UNDER_REVIEW',
    'PENDING_DOCUMENTS',
    'APPROVED',
    'REJECTED',
    'CANCELLED'
);


ALTER TYPE public."ApprovalStatus" OWNER TO yvesmpunga;

--
-- Name: AttendanceSource; Type: TYPE; Schema: public; Owner: yvesmpunga
--

CREATE TYPE public."AttendanceSource" AS ENUM (
    'MANUAL',
    'BIOMETRIC',
    'BADGE',
    'MOBILE',
    'IMPORT'
);


ALTER TYPE public."AttendanceSource" OWNER TO yvesmpunga;

--
-- Name: AttendanceStatus; Type: TYPE; Schema: public; Owner: yvesmpunga
--

CREATE TYPE public."AttendanceStatus" AS ENUM (
    'PRESENT',
    'ABSENT',
    'LATE',
    'HALF_DAY',
    'ON_LEAVE',
    'HOLIDAY',
    'MISSION',
    'REMOTE'
);


ALTER TYPE public."AttendanceStatus" OWNER TO yvesmpunga;

--
-- Name: ChildRelationship; Type: TYPE; Schema: public; Owner: yvesmpunga
--

CREATE TYPE public."ChildRelationship" AS ENUM (
    'BIOLOGICAL',
    'ADOPTED',
    'STEP_CHILD'
);


ALTER TYPE public."ChildRelationship" OWNER TO yvesmpunga;

--
-- Name: ContractStatus; Type: TYPE; Schema: public; Owner: yvesmpunga
--

CREATE TYPE public."ContractStatus" AS ENUM (
    'DRAFT',
    'ACTIVE',
    'EXPIRED',
    'TERMINATED',
    'RENEWED'
);


ALTER TYPE public."ContractStatus" OWNER TO yvesmpunga;

--
-- Name: EmergencyContactRelationship; Type: TYPE; Schema: public; Owner: yvesmpunga
--

CREATE TYPE public."EmergencyContactRelationship" AS ENUM (
    'SPOUSE',
    'PARENT',
    'CHILD',
    'SIBLING',
    'UNCLE_AUNT',
    'COUSIN',
    'FRIEND',
    'NEIGHBOR',
    'COLLEAGUE',
    'OTHER'
);


ALTER TYPE public."EmergencyContactRelationship" OWNER TO yvesmpunga;

--
-- Name: EmployeeDocumentType; Type: TYPE; Schema: public; Owner: yvesmpunga
--

CREATE TYPE public."EmployeeDocumentType" AS ENUM (
    'ID_CARD',
    'PASSPORT',
    'CV',
    'DIPLOMA',
    'CERTIFICATE',
    'CONTRACT',
    'MEDICAL_CERTIFICATE',
    'PHOTO',
    'OTHER'
);


ALTER TYPE public."EmployeeDocumentType" OWNER TO yvesmpunga;

--
-- Name: EmployeeStatus; Type: TYPE; Schema: public; Owner: yvesmpunga
--

CREATE TYPE public."EmployeeStatus" AS ENUM (
    'ACTIVE',
    'ON_LEAVE',
    'SUSPENDED',
    'RESIGNED',
    'TERMINATED',
    'RETIRED'
);


ALTER TYPE public."EmployeeStatus" OWNER TO yvesmpunga;

--
-- Name: EmploymentType; Type: TYPE; Schema: public; Owner: yvesmpunga
--

CREATE TYPE public."EmploymentType" AS ENUM (
    'CDI',
    'CDD',
    'STAGE',
    'CONSULTANT',
    'INTERIM'
);


ALTER TYPE public."EmploymentType" OWNER TO yvesmpunga;

--
-- Name: EvaluationStatus; Type: TYPE; Schema: public; Owner: yvesmpunga
--

CREATE TYPE public."EvaluationStatus" AS ENUM (
    'DRAFT',
    'IN_PROGRESS',
    'SUBMITTED',
    'REVIEWED',
    'COMPLETED'
);


ALTER TYPE public."EvaluationStatus" OWNER TO yvesmpunga;

--
-- Name: EvaluationType; Type: TYPE; Schema: public; Owner: yvesmpunga
--

CREATE TYPE public."EvaluationType" AS ENUM (
    'PROBATION',
    'QUARTERLY',
    'SEMI_ANNUAL',
    'ANNUAL'
);


ALTER TYPE public."EvaluationType" OWNER TO yvesmpunga;

--
-- Name: Gender; Type: TYPE; Schema: public; Owner: yvesmpunga
--

CREATE TYPE public."Gender" AS ENUM (
    'MALE',
    'FEMALE'
);


ALTER TYPE public."Gender" OWNER TO yvesmpunga;

--
-- Name: InvestmentStatus; Type: TYPE; Schema: public; Owner: yvesmpunga
--

CREATE TYPE public."InvestmentStatus" AS ENUM (
    'DRAFT',
    'PENDING',
    'UNDER_REVIEW',
    'APPROVED',
    'REJECTED',
    'IN_PROGRESS',
    'COMPLETED',
    'CANCELLED'
);


ALTER TYPE public."InvestmentStatus" OWNER TO yvesmpunga;

--
-- Name: InvestorCategory; Type: TYPE; Schema: public; Owner: yvesmpunga
--

CREATE TYPE public."InvestorCategory" AS ENUM (
    'INDIVIDUAL',
    'COMPANY',
    'PARTNERSHIP',
    'GOVERNMENT',
    'NGO'
);


ALTER TYPE public."InvestorCategory" OWNER TO yvesmpunga;

--
-- Name: InvestorStatus; Type: TYPE; Schema: public; Owner: yvesmpunga
--

CREATE TYPE public."InvestorStatus" AS ENUM (
    'PENDING',
    'ACTIVE',
    'SUSPENDED',
    'INACTIVE'
);


ALTER TYPE public."InvestorStatus" OWNER TO yvesmpunga;

--
-- Name: InvestorType; Type: TYPE; Schema: public; Owner: yvesmpunga
--

CREATE TYPE public."InvestorType" AS ENUM (
    'NATIONAL',
    'INTERNATIONAL'
);


ALTER TYPE public."InvestorType" OWNER TO yvesmpunga;

--
-- Name: LeaveStatus; Type: TYPE; Schema: public; Owner: yvesmpunga
--

CREATE TYPE public."LeaveStatus" AS ENUM (
    'PENDING',
    'APPROVED',
    'REJECTED',
    'CANCELLED'
);


ALTER TYPE public."LeaveStatus" OWNER TO yvesmpunga;

--
-- Name: LegalDocumentStatus; Type: TYPE; Schema: public; Owner: yvesmpunga
--

CREATE TYPE public."LegalDocumentStatus" AS ENUM (
    'DRAFT',
    'SUBMITTED',
    'IN_TREATMENT',
    'AUTHORIZED',
    'APPROVED',
    'REJECTED',
    'CANCELLED',
    'EXPIRED'
);


ALTER TYPE public."LegalDocumentStatus" OWNER TO yvesmpunga;

--
-- Name: LegalDocumentType; Type: TYPE; Schema: public; Owner: yvesmpunga
--

CREATE TYPE public."LegalDocumentType" AS ENUM (
    'LICENCE',
    'AUTORISATION',
    'PERMIS',
    'CERTIFICAT',
    'AGREMENT'
);


ALTER TYPE public."LegalDocumentType" OWNER TO yvesmpunga;

--
-- Name: MaritalStatus; Type: TYPE; Schema: public; Owner: yvesmpunga
--

CREATE TYPE public."MaritalStatus" AS ENUM (
    'SINGLE',
    'MARRIED',
    'DIVORCED',
    'WIDOWED'
);


ALTER TYPE public."MaritalStatus" OWNER TO yvesmpunga;

--
-- Name: PaymentMethod; Type: TYPE; Schema: public; Owner: yvesmpunga
--

CREATE TYPE public."PaymentMethod" AS ENUM (
    'BANK_TRANSFER',
    'CASH',
    'CHECK',
    'MOBILE_MONEY'
);


ALTER TYPE public."PaymentMethod" OWNER TO yvesmpunga;

--
-- Name: PaymentType; Type: TYPE; Schema: public; Owner: yvesmpunga
--

CREATE TYPE public."PaymentType" AS ENUM (
    'MONTHLY',
    'HOURLY',
    'DAILY',
    'WEEKLY'
);


ALTER TYPE public."PaymentType" OWNER TO yvesmpunga;

--
-- Name: PayrollConfigType; Type: TYPE; Schema: public; Owner: yvesmpunga
--

CREATE TYPE public."PayrollConfigType" AS ENUM (
    'INSS_EMPLOYEE',
    'INSS_EMPLOYER',
    'IPR',
    'INPP',
    'ALLOWANCE',
    'DEDUCTION'
);


ALTER TYPE public."PayrollConfigType" OWNER TO yvesmpunga;

--
-- Name: PayslipStatus; Type: TYPE; Schema: public; Owner: yvesmpunga
--

CREATE TYPE public."PayslipStatus" AS ENUM (
    'DRAFT',
    'VALIDATED',
    'PAID',
    'CANCELLED'
);


ALTER TYPE public."PayslipStatus" OWNER TO yvesmpunga;

--
-- Name: TrainingParticipationStatus; Type: TYPE; Schema: public; Owner: yvesmpunga
--

CREATE TYPE public."TrainingParticipationStatus" AS ENUM (
    'ENROLLED',
    'IN_PROGRESS',
    'COMPLETED',
    'FAILED',
    'CANCELLED'
);


ALTER TYPE public."TrainingParticipationStatus" OWNER TO yvesmpunga;

--
-- Name: TrainingStatus; Type: TYPE; Schema: public; Owner: yvesmpunga
--

CREATE TYPE public."TrainingStatus" AS ENUM (
    'PLANNED',
    'IN_PROGRESS',
    'COMPLETED',
    'CANCELLED'
);


ALTER TYPE public."TrainingStatus" OWNER TO yvesmpunga;

--
-- Name: UserRole; Type: TYPE; Schema: public; Owner: yvesmpunga
--

CREATE TYPE public."UserRole" AS ENUM (
    'USER',
    'AGENT',
    'MANAGER',
    'MINISTRY',
    'ADMIN',
    'SUPER_ADMIN'
);


ALTER TYPE public."UserRole" OWNER TO yvesmpunga;

--
-- Name: enum_actes_administratifs_category; Type: TYPE; Schema: public; Owner: yvesmpunga
--

CREATE TYPE public.enum_actes_administratifs_category AS ENUM (
    'LICENCE',
    'PERMIS',
    'AUTORISATION',
    'AGREMENT',
    'CERTIFICAT',
    'ATTESTATION'
);


ALTER TYPE public.enum_actes_administratifs_category OWNER TO yvesmpunga;

--
-- Name: enum_actes_administratifs_currency; Type: TYPE; Schema: public; Owner: yvesmpunga
--

CREATE TYPE public.enum_actes_administratifs_currency AS ENUM (
    'USD',
    'CDF'
);


ALTER TYPE public.enum_actes_administratifs_currency OWNER TO yvesmpunga;

--
-- Name: enum_application_documents_status; Type: TYPE; Schema: public; Owner: yvesmpunga
--

CREATE TYPE public.enum_application_documents_status AS ENUM (
    'UPLOADED',
    'VERIFIED',
    'REJECTED',
    'EXPIRED'
);


ALTER TYPE public.enum_application_documents_status OWNER TO yvesmpunga;

--
-- Name: enum_approvals_status; Type: TYPE; Schema: public; Owner: yvesmpunga
--

CREATE TYPE public.enum_approvals_status AS ENUM (
    'pending',
    'approved',
    'rejected',
    'revision_requested'
);


ALTER TYPE public.enum_approvals_status OWNER TO yvesmpunga;

--
-- Name: enum_approvals_type; Type: TYPE; Schema: public; Owner: yvesmpunga
--

CREATE TYPE public.enum_approvals_type AS ENUM (
    'initial_review',
    'technical_review',
    'financial_review',
    'legal_review',
    'final_approval',
    'certificate_issuance'
);


ALTER TYPE public.enum_approvals_type OWNER TO yvesmpunga;

--
-- Name: enum_attendances_source; Type: TYPE; Schema: public; Owner: yvesmpunga
--

CREATE TYPE public.enum_attendances_source AS ENUM (
    'MANUAL',
    'BIOMETRIC',
    'MOBILE',
    'SYSTEM'
);


ALTER TYPE public.enum_attendances_source OWNER TO yvesmpunga;

--
-- Name: enum_attendances_status; Type: TYPE; Schema: public; Owner: yvesmpunga
--

CREATE TYPE public.enum_attendances_status AS ENUM (
    'PRESENT',
    'ABSENT',
    'LATE',
    'HALF_DAY',
    'ON_LEAVE',
    'REMOTE',
    'MISSION',
    'SICK',
    'HOLIDAY',
    'WEEKEND'
);


ALTER TYPE public.enum_attendances_status OWNER TO yvesmpunga;

--
-- Name: enum_attendances_work_location; Type: TYPE; Schema: public; Owner: yvesmpunga
--

CREATE TYPE public.enum_attendances_work_location AS ENUM (
    'OFFICE',
    'REMOTE',
    'FIELD',
    'MISSION'
);


ALTER TYPE public.enum_attendances_work_location OWNER TO yvesmpunga;

--
-- Name: enum_barrier_resolutions_actionType; Type: TYPE; Schema: public; Owner: yvesmpunga
--

CREATE TYPE public."enum_barrier_resolutions_actionType" AS ENUM (
    'STATUS_CHANGE',
    'ASSIGNMENT',
    'CONTACT_ADMIN',
    'MEETING',
    'DOCUMENT_REQUEST',
    'ESCALATION',
    'RESOLUTION',
    'COMMENT',
    'FOLLOW_UP'
);


ALTER TYPE public."enum_barrier_resolutions_actionType" OWNER TO yvesmpunga;

--
-- Name: enum_bidder_ratings_evaluation_type; Type: TYPE; Schema: public; Owner: yvesmpunga
--

CREATE TYPE public.enum_bidder_ratings_evaluation_type AS ENUM (
    'CONTRACT_COMPLETION',
    'PERIODIC',
    'INCIDENT',
    'INITIAL'
);


ALTER TYPE public.enum_bidder_ratings_evaluation_type OWNER TO yvesmpunga;

--
-- Name: enum_bidder_ratings_recommendation; Type: TYPE; Schema: public; Owner: yvesmpunga
--

CREATE TYPE public.enum_bidder_ratings_recommendation AS ENUM (
    'HIGHLY_RECOMMENDED',
    'RECOMMENDED',
    'ACCEPTABLE',
    'CONDITIONAL',
    'NOT_RECOMMENDED'
);


ALTER TYPE public.enum_bidder_ratings_recommendation OWNER TO yvesmpunga;

--
-- Name: enum_bidder_ratings_status; Type: TYPE; Schema: public; Owner: yvesmpunga
--

CREATE TYPE public.enum_bidder_ratings_status AS ENUM (
    'DRAFT',
    'SUBMITTED',
    'APPROVED',
    'REJECTED'
);


ALTER TYPE public.enum_bidder_ratings_status OWNER TO yvesmpunga;

--
-- Name: enum_business_barriers_category; Type: TYPE; Schema: public; Owner: yvesmpunga
--

CREATE TYPE public.enum_business_barriers_category AS ENUM (
    'ADMINISTRATIVE',
    'FISCAL',
    'REGULATORY',
    'LAND',
    'CUSTOMS',
    'LABOR',
    'INFRASTRUCTURE',
    'FINANCIAL',
    'CORRUPTION',
    'OTHER'
);


ALTER TYPE public.enum_business_barriers_category OWNER TO yvesmpunga;

--
-- Name: enum_business_barriers_reportSource; Type: TYPE; Schema: public; Owner: yvesmpunga
--

CREATE TYPE public."enum_business_barriers_reportSource" AS ENUM (
    'INVESTOR',
    'AGENT',
    'MINISTRY',
    'PUBLIC',
    'SURVEY'
);


ALTER TYPE public."enum_business_barriers_reportSource" OWNER TO yvesmpunga;

--
-- Name: enum_business_barriers_resolutionType; Type: TYPE; Schema: public; Owner: yvesmpunga
--

CREATE TYPE public."enum_business_barriers_resolutionType" AS ENUM (
    'PROCEDURE_SIMPLIFIED',
    'REGULATION_CHANGED',
    'TRAINING_PROVIDED',
    'MEDIATION_SUCCESS',
    'ESCALATED_RESOLVED',
    'NOT_APPLICABLE',
    'OTHER'
);


ALTER TYPE public."enum_business_barriers_resolutionType" OWNER TO yvesmpunga;

--
-- Name: enum_business_barriers_severity; Type: TYPE; Schema: public; Owner: yvesmpunga
--

CREATE TYPE public.enum_business_barriers_severity AS ENUM (
    'LOW',
    'MEDIUM',
    'HIGH',
    'CRITICAL'
);


ALTER TYPE public.enum_business_barriers_severity OWNER TO yvesmpunga;

--
-- Name: enum_business_barriers_status; Type: TYPE; Schema: public; Owner: yvesmpunga
--

CREATE TYPE public.enum_business_barriers_status AS ENUM (
    'REPORTED',
    'ACKNOWLEDGED',
    'UNDER_ANALYSIS',
    'IN_PROGRESS',
    'ESCALATED',
    'RESOLVED',
    'CLOSED',
    'REJECTED'
);


ALTER TYPE public.enum_business_barriers_status OWNER TO yvesmpunga;

--
-- Name: enum_cities_city_type; Type: TYPE; Schema: public; Owner: yvesmpunga
--

CREATE TYPE public.enum_cities_city_type AS ENUM (
    'capital',
    'chief_town',
    'city',
    'municipality'
);


ALTER TYPE public.enum_cities_city_type OWNER TO yvesmpunga;

--
-- Name: enum_climate_indicators_betterDirection; Type: TYPE; Schema: public; Owner: yvesmpunga
--

CREATE TYPE public."enum_climate_indicators_betterDirection" AS ENUM (
    'HIGHER',
    'LOWER'
);


ALTER TYPE public."enum_climate_indicators_betterDirection" OWNER TO yvesmpunga;

--
-- Name: enum_climate_indicators_category; Type: TYPE; Schema: public; Owner: yvesmpunga
--

CREATE TYPE public.enum_climate_indicators_category AS ENUM (
    'DOING_BUSINESS',
    'INVESTMENT_CLIMATE',
    'GOVERNANCE',
    'INFRASTRUCTURE',
    'HUMAN_CAPITAL',
    'COMPETITIVENESS',
    'TRADE',
    'CORRUPTION',
    'EASE_OF_BUSINESS',
    'CUSTOM'
);


ALTER TYPE public.enum_climate_indicators_category OWNER TO yvesmpunga;

--
-- Name: enum_climate_indicators_measureType; Type: TYPE; Schema: public; Owner: yvesmpunga
--

CREATE TYPE public."enum_climate_indicators_measureType" AS ENUM (
    'SCORE',
    'RANK',
    'PERCENTAGE',
    'DAYS',
    'COUNT',
    'CURRENCY',
    'INDEX',
    'RATIO'
);


ALTER TYPE public."enum_climate_indicators_measureType" OWNER TO yvesmpunga;

--
-- Name: enum_climate_indicators_updateFrequency; Type: TYPE; Schema: public; Owner: yvesmpunga
--

CREATE TYPE public."enum_climate_indicators_updateFrequency" AS ENUM (
    'DAILY',
    'WEEKLY',
    'MONTHLY',
    'QUARTERLY',
    'ANNUALLY'
);


ALTER TYPE public."enum_climate_indicators_updateFrequency" OWNER TO yvesmpunga;

--
-- Name: enum_dialogue_participants_invitationStatus; Type: TYPE; Schema: public; Owner: yvesmpunga
--

CREATE TYPE public."enum_dialogue_participants_invitationStatus" AS ENUM (
    'PENDING',
    'SENT',
    'CONFIRMED',
    'DECLINED',
    'TENTATIVE',
    'CANCELLED'
);


ALTER TYPE public."enum_dialogue_participants_invitationStatus" OWNER TO yvesmpunga;

--
-- Name: enum_dialogue_participants_participantType; Type: TYPE; Schema: public; Owner: yvesmpunga
--

CREATE TYPE public."enum_dialogue_participants_participantType" AS ENUM (
    'INVESTOR',
    'GOVERNMENT',
    'MINISTRY',
    'PRIVATE_SECTOR',
    'CIVIL_SOCIETY',
    'INTERNATIONAL_ORG',
    'EXPERT',
    'MEDIA',
    'ANAPI_STAFF',
    'OTHER'
);


ALTER TYPE public."enum_dialogue_participants_participantType" OWNER TO yvesmpunga;

--
-- Name: enum_dialogue_participants_role; Type: TYPE; Schema: public; Owner: yvesmpunga
--

CREATE TYPE public.enum_dialogue_participants_role AS ENUM (
    'ORGANIZER',
    'SPEAKER',
    'PANELIST',
    'MODERATOR',
    'PARTICIPANT',
    'OBSERVER',
    'RAPPORTEUR'
);


ALTER TYPE public.enum_dialogue_participants_role OWNER TO yvesmpunga;

--
-- Name: enum_dossiers_dossierType; Type: TYPE; Schema: public; Owner: yvesmpunga
--

CREATE TYPE public."enum_dossiers_dossierType" AS ENUM (
    'AGREMENT_REGIME',
    'DECLARATION_INVESTISSEMENT',
    'DEMANDE_TERRAIN',
    'LICENCE_EXPLOITATION'
);


ALTER TYPE public."enum_dossiers_dossierType" OWNER TO yvesmpunga;

--
-- Name: enum_dossiers_investorType; Type: TYPE; Schema: public; Owner: yvesmpunga
--

CREATE TYPE public."enum_dossiers_investorType" AS ENUM (
    'company',
    'individual'
);


ALTER TYPE public."enum_dossiers_investorType" OWNER TO yvesmpunga;

--
-- Name: enum_dossiers_status; Type: TYPE; Schema: public; Owner: yvesmpunga
--

CREATE TYPE public.enum_dossiers_status AS ENUM (
    'DRAFT',
    'SUBMITTED',
    'IN_REVIEW',
    'PENDING_DOCUMENTS',
    'APPROVED',
    'REJECTED',
    'CANCELLED'
);


ALTER TYPE public.enum_dossiers_status OWNER TO yvesmpunga;

--
-- Name: enum_framework_agreement_suppliers_status; Type: TYPE; Schema: public; Owner: yvesmpunga
--

CREATE TYPE public.enum_framework_agreement_suppliers_status AS ENUM (
    'ACTIVE',
    'SUSPENDED',
    'REMOVED'
);


ALTER TYPE public.enum_framework_agreement_suppliers_status OWNER TO yvesmpunga;

--
-- Name: enum_framework_agreements_category; Type: TYPE; Schema: public; Owner: yvesmpunga
--

CREATE TYPE public.enum_framework_agreements_category AS ENUM (
    'GOODS',
    'SERVICES',
    'WORKS',
    'CONSULTING'
);


ALTER TYPE public.enum_framework_agreements_category OWNER TO yvesmpunga;

--
-- Name: enum_framework_agreements_status; Type: TYPE; Schema: public; Owner: yvesmpunga
--

CREATE TYPE public.enum_framework_agreements_status AS ENUM (
    'DRAFT',
    'PENDING_APPROVAL',
    'ACTIVE',
    'SUSPENDED',
    'EXPIRED',
    'TERMINATED',
    'RENEWED'
);


ALTER TYPE public.enum_framework_agreements_status OWNER TO yvesmpunga;

--
-- Name: enum_framework_agreements_type; Type: TYPE; Schema: public; Owner: yvesmpunga
--

CREATE TYPE public.enum_framework_agreements_type AS ENUM (
    'SINGLE_SUPPLIER',
    'MULTI_SUPPLIER',
    'CASCADING'
);


ALTER TYPE public.enum_framework_agreements_type OWNER TO yvesmpunga;

--
-- Name: enum_framework_orders_payment_status; Type: TYPE; Schema: public; Owner: yvesmpunga
--

CREATE TYPE public.enum_framework_orders_payment_status AS ENUM (
    'PENDING',
    'PARTIAL',
    'PAID'
);


ALTER TYPE public.enum_framework_orders_payment_status OWNER TO yvesmpunga;

--
-- Name: enum_framework_orders_quality_status; Type: TYPE; Schema: public; Owner: yvesmpunga
--

CREATE TYPE public.enum_framework_orders_quality_status AS ENUM (
    'PENDING',
    'ACCEPTED',
    'PARTIAL_REJECTION',
    'REJECTED'
);


ALTER TYPE public.enum_framework_orders_quality_status OWNER TO yvesmpunga;

--
-- Name: enum_framework_orders_status; Type: TYPE; Schema: public; Owner: yvesmpunga
--

CREATE TYPE public.enum_framework_orders_status AS ENUM (
    'DRAFT',
    'PENDING_APPROVAL',
    'APPROVED',
    'ORDERED',
    'PARTIALLY_DELIVERED',
    'DELIVERED',
    'COMPLETED',
    'CANCELLED'
);


ALTER TYPE public.enum_framework_orders_status OWNER TO yvesmpunga;

--
-- Name: enum_international_treaties_status; Type: TYPE; Schema: public; Owner: yvesmpunga
--

CREATE TYPE public.enum_international_treaties_status AS ENUM (
    'NEGOTIATING',
    'SIGNED',
    'RATIFICATION_PENDING',
    'RATIFIED',
    'IN_FORCE',
    'SUSPENDED',
    'TERMINATED',
    'EXPIRED',
    'RENEGOTIATING'
);


ALTER TYPE public.enum_international_treaties_status OWNER TO yvesmpunga;

--
-- Name: enum_international_treaties_treatyType; Type: TYPE; Schema: public; Owner: yvesmpunga
--

CREATE TYPE public."enum_international_treaties_treatyType" AS ENUM (
    'BIT',
    'FTA',
    'DTA',
    'INVESTMENT_PROTECTION',
    'ECONOMIC_PARTNERSHIP',
    'TRADE_AGREEMENT',
    'MULTILATERAL',
    'REGIONAL',
    'SECTOR_SPECIFIC',
    'OTHER'
);


ALTER TYPE public."enum_international_treaties_treatyType" OWNER TO yvesmpunga;

--
-- Name: enum_investments_currency; Type: TYPE; Schema: public; Owner: yvesmpunga
--

CREATE TYPE public.enum_investments_currency AS ENUM (
    'USD',
    'EUR',
    'CDF'
);


ALTER TYPE public.enum_investments_currency OWNER TO yvesmpunga;

--
-- Name: enum_investments_projects_status; Type: TYPE; Schema: public; Owner: yvesmpunga
--

CREATE TYPE public.enum_investments_projects_status AS ENUM (
    'DRAFT',
    'SUBMITTED',
    'UNDER_REVIEW',
    'APPROVED',
    'IN_PROGRESS',
    'COMPLETED',
    'REJECTED',
    'CANCELLED'
);


ALTER TYPE public.enum_investments_projects_status OWNER TO yvesmpunga;

--
-- Name: enum_investments_status; Type: TYPE; Schema: public; Owner: yvesmpunga
--

CREATE TYPE public.enum_investments_status AS ENUM (
    'draft',
    'submitted',
    'under_review',
    'approved',
    'rejected',
    'in_progress',
    'completed',
    'cancelled'
);


ALTER TYPE public.enum_investments_status OWNER TO yvesmpunga;

--
-- Name: enum_investors_status; Type: TYPE; Schema: public; Owner: yvesmpunga
--

CREATE TYPE public.enum_investors_status AS ENUM (
    'ACTIVE',
    'PENDING',
    'SUSPENDED',
    'INACTIVE'
);


ALTER TYPE public.enum_investors_status OWNER TO yvesmpunga;

--
-- Name: enum_investors_type; Type: TYPE; Schema: public; Owner: yvesmpunga
--

CREATE TYPE public.enum_investors_type AS ENUM (
    'individual',
    'company',
    'organization',
    'government'
);


ALTER TYPE public.enum_investors_type OWNER TO yvesmpunga;

--
-- Name: enum_legal_proposals_domain; Type: TYPE; Schema: public; Owner: yvesmpunga
--

CREATE TYPE public.enum_legal_proposals_domain AS ENUM (
    'INVESTMENT_CODE',
    'TAX',
    'CUSTOMS',
    'LABOR',
    'LAND',
    'ENVIRONMENT',
    'TRADE',
    'MINING',
    'AGRICULTURE',
    'FINANCE',
    'BUSINESS_CREATION',
    'OTHER'
);


ALTER TYPE public.enum_legal_proposals_domain OWNER TO yvesmpunga;

--
-- Name: enum_legal_proposals_priority; Type: TYPE; Schema: public; Owner: yvesmpunga
--

CREATE TYPE public.enum_legal_proposals_priority AS ENUM (
    'LOW',
    'MEDIUM',
    'HIGH',
    'URGENT'
);


ALTER TYPE public.enum_legal_proposals_priority OWNER TO yvesmpunga;

--
-- Name: enum_legal_proposals_proposalType; Type: TYPE; Schema: public; Owner: yvesmpunga
--

CREATE TYPE public."enum_legal_proposals_proposalType" AS ENUM (
    'LAW',
    'DECREE',
    'ORDER',
    'CIRCULAR',
    'REGULATION',
    'AMENDMENT',
    'RECOMMENDATION',
    'OPINION',
    'OTHER'
);


ALTER TYPE public."enum_legal_proposals_proposalType" OWNER TO yvesmpunga;

--
-- Name: enum_legal_proposals_status; Type: TYPE; Schema: public; Owner: yvesmpunga
--

CREATE TYPE public.enum_legal_proposals_status AS ENUM (
    'DRAFT',
    'SUBMITTED',
    'UNDER_REVIEW',
    'APPROVED',
    'FORWARDED',
    'UNDER_DISCUSSION',
    'ADOPTED',
    'REJECTED',
    'WITHDRAWN',
    'ARCHIVED'
);


ALTER TYPE public.enum_legal_proposals_status OWNER TO yvesmpunga;

--
-- Name: enum_mediation_cases_complainantType; Type: TYPE; Schema: public; Owner: yvesmpunga
--

CREATE TYPE public."enum_mediation_cases_complainantType" AS ENUM (
    'INVESTOR',
    'COMPANY',
    'INDIVIDUAL'
);


ALTER TYPE public."enum_mediation_cases_complainantType" OWNER TO yvesmpunga;

--
-- Name: enum_mediation_cases_disputeType; Type: TYPE; Schema: public; Owner: yvesmpunga
--

CREATE TYPE public."enum_mediation_cases_disputeType" AS ENUM (
    'CONTRACT',
    'TAX',
    'LABOR',
    'LAND',
    'PERMIT',
    'CUSTOMS',
    'ADMINISTRATIVE',
    'COMMERCIAL',
    'ENVIRONMENTAL',
    'OTHER'
);


ALTER TYPE public."enum_mediation_cases_disputeType" OWNER TO yvesmpunga;

--
-- Name: enum_mediation_cases_priority; Type: TYPE; Schema: public; Owner: yvesmpunga
--

CREATE TYPE public.enum_mediation_cases_priority AS ENUM (
    'LOW',
    'MEDIUM',
    'HIGH',
    'URGENT'
);


ALTER TYPE public.enum_mediation_cases_priority OWNER TO yvesmpunga;

--
-- Name: enum_mediation_cases_respondentType; Type: TYPE; Schema: public; Owner: yvesmpunga
--

CREATE TYPE public."enum_mediation_cases_respondentType" AS ENUM (
    'MINISTRY',
    'AGENCY',
    'COMPANY',
    'INDIVIDUAL'
);


ALTER TYPE public."enum_mediation_cases_respondentType" OWNER TO yvesmpunga;

--
-- Name: enum_mediation_cases_status; Type: TYPE; Schema: public; Owner: yvesmpunga
--

CREATE TYPE public.enum_mediation_cases_status AS ENUM (
    'SUBMITTED',
    'ACCEPTED',
    'REJECTED',
    'SCHEDULED',
    'IN_MEDIATION',
    'AGREEMENT_REACHED',
    'FAILED',
    'CLOSED',
    'REFERRED_COURT'
);


ALTER TYPE public.enum_mediation_cases_status OWNER TO yvesmpunga;

--
-- Name: enum_message_recipients_recipient_type; Type: TYPE; Schema: public; Owner: yvesmpunga
--

CREATE TYPE public.enum_message_recipients_recipient_type AS ENUM (
    'TO',
    'CC',
    'BCC'
);


ALTER TYPE public.enum_message_recipients_recipient_type OWNER TO yvesmpunga;

--
-- Name: enum_messages_message_type; Type: TYPE; Schema: public; Owner: yvesmpunga
--

CREATE TYPE public.enum_messages_message_type AS ENUM (
    'INTERNAL',
    'EXTERNAL_OUT',
    'EXTERNAL_IN'
);


ALTER TYPE public.enum_messages_message_type OWNER TO yvesmpunga;

--
-- Name: enum_messages_priority; Type: TYPE; Schema: public; Owner: yvesmpunga
--

CREATE TYPE public.enum_messages_priority AS ENUM (
    'NORMAL',
    'HIGH',
    'URGENT'
);


ALTER TYPE public.enum_messages_priority OWNER TO yvesmpunga;

--
-- Name: enum_messages_send_status; Type: TYPE; Schema: public; Owner: yvesmpunga
--

CREATE TYPE public.enum_messages_send_status AS ENUM (
    'PENDING',
    'SENT',
    'FAILED'
);


ALTER TYPE public.enum_messages_send_status OWNER TO yvesmpunga;

--
-- Name: enum_ministry_request_documents_status; Type: TYPE; Schema: public; Owner: yvesmpunga
--

CREATE TYPE public.enum_ministry_request_documents_status AS ENUM (
    'PENDING',
    'UPLOADED',
    'VALIDATED',
    'REJECTED'
);


ALTER TYPE public.enum_ministry_request_documents_status OWNER TO yvesmpunga;

--
-- Name: enum_ministry_request_history_action; Type: TYPE; Schema: public; Owner: yvesmpunga
--

CREATE TYPE public.enum_ministry_request_history_action AS ENUM (
    'CREATED',
    'SUBMITTED',
    'ASSIGNED',
    'STEP_COMPLETED',
    'DOCUMENTS_REQUESTED',
    'DOCUMENTS_RECEIVED',
    'APPROVED',
    'REJECTED',
    'ON_HOLD',
    'CANCELLED',
    'COMMENT_ADDED',
    'CONTACT_APPLICANT'
);


ALTER TYPE public.enum_ministry_request_history_action OWNER TO yvesmpunga;

--
-- Name: enum_ministry_requests_applicantType; Type: TYPE; Schema: public; Owner: yvesmpunga
--

CREATE TYPE public."enum_ministry_requests_applicantType" AS ENUM (
    'INVESTOR',
    'COMPANY',
    'INDIVIDUAL'
);


ALTER TYPE public."enum_ministry_requests_applicantType" OWNER TO yvesmpunga;

--
-- Name: enum_ministry_requests_priority; Type: TYPE; Schema: public; Owner: yvesmpunga
--

CREATE TYPE public.enum_ministry_requests_priority AS ENUM (
    'LOW',
    'NORMAL',
    'HIGH',
    'URGENT'
);


ALTER TYPE public.enum_ministry_requests_priority OWNER TO yvesmpunga;

--
-- Name: enum_ministry_requests_requestType; Type: TYPE; Schema: public; Owner: yvesmpunga
--

CREATE TYPE public."enum_ministry_requests_requestType" AS ENUM (
    'AUTORISATION',
    'LICENCE',
    'PERMIS'
);


ALTER TYPE public."enum_ministry_requests_requestType" OWNER TO yvesmpunga;

--
-- Name: enum_ministry_requests_status; Type: TYPE; Schema: public; Owner: yvesmpunga
--

CREATE TYPE public.enum_ministry_requests_status AS ENUM (
    'DRAFT',
    'SUBMITTED',
    'IN_PROGRESS',
    'PENDING_DOCUMENTS',
    'UNDER_REVIEW',
    'APPROVED',
    'REJECTED',
    'CANCELLED'
);


ALTER TYPE public.enum_ministry_requests_status OWNER TO yvesmpunga;

--
-- Name: enum_ministry_workflows_requestType; Type: TYPE; Schema: public; Owner: yvesmpunga
--

CREATE TYPE public."enum_ministry_workflows_requestType" AS ENUM (
    'AUTORISATION',
    'LICENCE',
    'PERMIS'
);


ALTER TYPE public."enum_ministry_workflows_requestType" OWNER TO yvesmpunga;

--
-- Name: enum_opportunity_applications_status; Type: TYPE; Schema: public; Owner: yvesmpunga
--

CREATE TYPE public.enum_opportunity_applications_status AS ENUM (
    'DRAFT',
    'SUBMITTED',
    'UNDER_REVIEW',
    'SHORTLISTED',
    'APPROVED',
    'REJECTED',
    'WITHDRAWN'
);


ALTER TYPE public.enum_opportunity_applications_status OWNER TO yvesmpunga;

--
-- Name: enum_opportunity_documents_category; Type: TYPE; Schema: public; Owner: yvesmpunga
--

CREATE TYPE public.enum_opportunity_documents_category AS ENUM (
    'LEGAL',
    'FINANCIAL',
    'TECHNICAL',
    'ADMINISTRATIVE',
    'OTHER'
);


ALTER TYPE public.enum_opportunity_documents_category OWNER TO yvesmpunga;

--
-- Name: enum_permissions_action; Type: TYPE; Schema: public; Owner: yvesmpunga
--

CREATE TYPE public.enum_permissions_action AS ENUM (
    'view',
    'create',
    'update',
    'delete',
    'approve',
    'export',
    'manage'
);


ALTER TYPE public.enum_permissions_action OWNER TO yvesmpunga;

--
-- Name: enum_pieces_requises_category; Type: TYPE; Schema: public; Owner: yvesmpunga
--

CREATE TYPE public.enum_pieces_requises_category AS ENUM (
    'IDENTITE',
    'JURIDIQUE',
    'FISCAL',
    'TECHNIQUE',
    'FINANCIER',
    'AUTRE'
);


ALTER TYPE public.enum_pieces_requises_category OWNER TO yvesmpunga;

--
-- Name: enum_procurement_bid_documents_category; Type: TYPE; Schema: public; Owner: yvesmpunga
--

CREATE TYPE public.enum_procurement_bid_documents_category AS ENUM (
    'ADMINISTRATIVE',
    'TECHNICAL',
    'FINANCIAL',
    'OTHER'
);


ALTER TYPE public.enum_procurement_bid_documents_category OWNER TO yvesmpunga;

--
-- Name: enum_procurement_bidders_status; Type: TYPE; Schema: public; Owner: yvesmpunga
--

CREATE TYPE public.enum_procurement_bidders_status AS ENUM (
    'ACTIVE',
    'INACTIVE',
    'BLACKLISTED',
    'PENDING_VERIFICATION'
);


ALTER TYPE public.enum_procurement_bidders_status OWNER TO yvesmpunga;

--
-- Name: enum_procurement_bids_administrative_status; Type: TYPE; Schema: public; Owner: yvesmpunga
--

CREATE TYPE public.enum_procurement_bids_administrative_status AS ENUM (
    'PENDING',
    'COMPLIANT',
    'NON_COMPLIANT'
);


ALTER TYPE public.enum_procurement_bids_administrative_status OWNER TO yvesmpunga;

--
-- Name: enum_procurement_bids_delivery_unit; Type: TYPE; Schema: public; Owner: yvesmpunga
--

CREATE TYPE public.enum_procurement_bids_delivery_unit AS ENUM (
    'DAYS',
    'WEEKS',
    'MONTHS'
);


ALTER TYPE public.enum_procurement_bids_delivery_unit OWNER TO yvesmpunga;

--
-- Name: enum_procurement_bids_status; Type: TYPE; Schema: public; Owner: yvesmpunga
--

CREATE TYPE public.enum_procurement_bids_status AS ENUM (
    'RECEIVED',
    'ADMINISTRATIVE_CHECK',
    'TECHNICAL_EVALUATION',
    'FINANCIAL_EVALUATION',
    'EVALUATED',
    'SELECTED',
    'AWARDED',
    'REJECTED',
    'DISQUALIFIED',
    'WITHDRAWN'
);


ALTER TYPE public.enum_procurement_bids_status OWNER TO yvesmpunga;

--
-- Name: enum_procurement_contract_documents_category; Type: TYPE; Schema: public; Owner: yvesmpunga
--

CREATE TYPE public.enum_procurement_contract_documents_category AS ENUM (
    'CONTRACT',
    'AMENDMENT',
    'INVOICE',
    'DELIVERY',
    'INSPECTION',
    'PAYMENT',
    'CERTIFICATE',
    'OTHER'
);


ALTER TYPE public.enum_procurement_contract_documents_category OWNER TO yvesmpunga;

--
-- Name: enum_procurement_contract_executions_status; Type: TYPE; Schema: public; Owner: yvesmpunga
--

CREATE TYPE public.enum_procurement_contract_executions_status AS ENUM (
    'PLANNED',
    'IN_PROGRESS',
    'COMPLETED',
    'DELAYED',
    'CANCELLED'
);


ALTER TYPE public.enum_procurement_contract_executions_status OWNER TO yvesmpunga;

--
-- Name: enum_procurement_contract_executions_type; Type: TYPE; Schema: public; Owner: yvesmpunga
--

CREATE TYPE public.enum_procurement_contract_executions_type AS ENUM (
    'MILESTONE',
    'DELIVERY',
    'PAYMENT',
    'INSPECTION',
    'AMENDMENT',
    'PENALTY',
    'OTHER'
);


ALTER TYPE public.enum_procurement_contract_executions_type OWNER TO yvesmpunga;

--
-- Name: enum_procurement_contracts_status; Type: TYPE; Schema: public; Owner: yvesmpunga
--

CREATE TYPE public.enum_procurement_contracts_status AS ENUM (
    'DRAFT',
    'PENDING_SIGNATURE',
    'SIGNED',
    'ACTIVE',
    'SUSPENDED',
    'COMPLETED',
    'TERMINATED',
    'CANCELLED'
);


ALTER TYPE public.enum_procurement_contracts_status OWNER TO yvesmpunga;

--
-- Name: enum_procurement_document_types_category; Type: TYPE; Schema: public; Owner: yvesmpunga
--

CREATE TYPE public.enum_procurement_document_types_category AS ENUM (
    'TENDER',
    'BID',
    'CONTRACT',
    'EXECUTION',
    'OTHER'
);


ALTER TYPE public.enum_procurement_document_types_category OWNER TO yvesmpunga;

--
-- Name: enum_procurement_evaluation_committees_role; Type: TYPE; Schema: public; Owner: yvesmpunga
--

CREATE TYPE public.enum_procurement_evaluation_committees_role AS ENUM (
    'PRESIDENT',
    'MEMBER',
    'SECRETARY',
    'OBSERVER',
    'EXPERT'
);


ALTER TYPE public.enum_procurement_evaluation_committees_role OWNER TO yvesmpunga;

--
-- Name: enum_procurement_evaluation_committees_status; Type: TYPE; Schema: public; Owner: yvesmpunga
--

CREATE TYPE public.enum_procurement_evaluation_committees_status AS ENUM (
    'ACTIVE',
    'INACTIVE',
    'RECUSED'
);


ALTER TYPE public.enum_procurement_evaluation_committees_status OWNER TO yvesmpunga;

--
-- Name: enum_procurement_tender_lots_status; Type: TYPE; Schema: public; Owner: yvesmpunga
--

CREATE TYPE public.enum_procurement_tender_lots_status AS ENUM (
    'OPEN',
    'AWARDED',
    'CANCELLED',
    'NO_BID'
);


ALTER TYPE public.enum_procurement_tender_lots_status OWNER TO yvesmpunga;

--
-- Name: enum_procurement_tenders_category; Type: TYPE; Schema: public; Owner: yvesmpunga
--

CREATE TYPE public.enum_procurement_tenders_category AS ENUM (
    'WORKS',
    'GOODS',
    'SERVICES',
    'CONSULTING'
);


ALTER TYPE public.enum_procurement_tenders_category OWNER TO yvesmpunga;

--
-- Name: enum_procurement_tenders_delivery_unit; Type: TYPE; Schema: public; Owner: yvesmpunga
--

CREATE TYPE public.enum_procurement_tenders_delivery_unit AS ENUM (
    'DAYS',
    'WEEKS',
    'MONTHS'
);


ALTER TYPE public.enum_procurement_tenders_delivery_unit OWNER TO yvesmpunga;

--
-- Name: enum_procurement_tenders_status; Type: TYPE; Schema: public; Owner: yvesmpunga
--

CREATE TYPE public.enum_procurement_tenders_status AS ENUM (
    'DRAFT',
    'PENDING_APPROVAL',
    'PUBLISHED',
    'SUBMISSION_CLOSED',
    'EVALUATION',
    'AWARDED',
    'CANCELLED',
    'COMPLETED'
);


ALTER TYPE public.enum_procurement_tenders_status OWNER TO yvesmpunga;

--
-- Name: enum_procurement_tenders_type; Type: TYPE; Schema: public; Owner: yvesmpunga
--

CREATE TYPE public.enum_procurement_tenders_type AS ENUM (
    'OPEN',
    'RESTRICTED',
    'NEGOTIATED',
    'DIRECT',
    'FRAMEWORK'
);


ALTER TYPE public.enum_procurement_tenders_type OWNER TO yvesmpunga;

--
-- Name: enum_project_documents_type; Type: TYPE; Schema: public; Owner: yvesmpunga
--

CREATE TYPE public.enum_project_documents_type AS ENUM (
    'pdf',
    'image',
    'document',
    'spreadsheet',
    'other'
);


ALTER TYPE public.enum_project_documents_type OWNER TO yvesmpunga;

--
-- Name: enum_project_history_action; Type: TYPE; Schema: public; Owner: yvesmpunga
--

CREATE TYPE public.enum_project_history_action AS ENUM (
    'CREATED',
    'UPDATED',
    'STATUS_CHANGED',
    'DOCUMENT_UPLOADED',
    'DOCUMENT_DELETED',
    'INVESTOR_CHANGED',
    'AMOUNT_UPDATED',
    'APPROVED',
    'REJECTED',
    'STARTED',
    'COMPLETED',
    'CANCELLED',
    'COMMENT_ADDED',
    'MILESTONE_REACHED'
);


ALTER TYPE public.enum_project_history_action OWNER TO yvesmpunga;

--
-- Name: enum_project_impacts_status; Type: TYPE; Schema: public; Owner: yvesmpunga
--

CREATE TYPE public.enum_project_impacts_status AS ENUM (
    'DRAFT',
    'SUBMITTED',
    'VERIFIED',
    'APPROVED',
    'REJECTED'
);


ALTER TYPE public.enum_project_impacts_status OWNER TO yvesmpunga;

--
-- Name: enum_project_milestones_category; Type: TYPE; Schema: public; Owner: yvesmpunga
--

CREATE TYPE public.enum_project_milestones_category AS ENUM (
    'PLANNING',
    'DESIGN',
    'PROCUREMENT',
    'CONSTRUCTION',
    'INSTALLATION',
    'TESTING',
    'TRAINING',
    'LAUNCH',
    'OPERATIONAL',
    'OTHER'
);


ALTER TYPE public.enum_project_milestones_category OWNER TO yvesmpunga;

--
-- Name: enum_project_milestones_status; Type: TYPE; Schema: public; Owner: yvesmpunga
--

CREATE TYPE public.enum_project_milestones_status AS ENUM (
    'NOT_STARTED',
    'IN_PROGRESS',
    'COMPLETED',
    'DELAYED',
    'ON_HOLD',
    'CANCELLED'
);


ALTER TYPE public.enum_project_milestones_status OWNER TO yvesmpunga;

--
-- Name: enum_project_risks_category; Type: TYPE; Schema: public; Owner: yvesmpunga
--

CREATE TYPE public.enum_project_risks_category AS ENUM (
    'FINANCIAL',
    'TECHNICAL',
    'OPERATIONAL',
    'REGULATORY',
    'ENVIRONMENTAL',
    'SOCIAL',
    'POLITICAL',
    'MARKET',
    'SUPPLY_CHAIN',
    'SECURITY',
    'OTHER'
);


ALTER TYPE public.enum_project_risks_category OWNER TO yvesmpunga;

--
-- Name: enum_project_risks_impact; Type: TYPE; Schema: public; Owner: yvesmpunga
--

CREATE TYPE public.enum_project_risks_impact AS ENUM (
    'VERY_LOW',
    'LOW',
    'MEDIUM',
    'HIGH',
    'VERY_HIGH'
);


ALTER TYPE public.enum_project_risks_impact OWNER TO yvesmpunga;

--
-- Name: enum_project_risks_probability; Type: TYPE; Schema: public; Owner: yvesmpunga
--

CREATE TYPE public.enum_project_risks_probability AS ENUM (
    'VERY_LOW',
    'LOW',
    'MEDIUM',
    'HIGH',
    'VERY_HIGH'
);


ALTER TYPE public.enum_project_risks_probability OWNER TO yvesmpunga;

--
-- Name: enum_project_risks_risk_level; Type: TYPE; Schema: public; Owner: yvesmpunga
--

CREATE TYPE public.enum_project_risks_risk_level AS ENUM (
    'LOW',
    'MODERATE',
    'HIGH',
    'CRITICAL'
);


ALTER TYPE public.enum_project_risks_risk_level OWNER TO yvesmpunga;

--
-- Name: enum_project_risks_status; Type: TYPE; Schema: public; Owner: yvesmpunga
--

CREATE TYPE public.enum_project_risks_status AS ENUM (
    'IDENTIFIED',
    'ASSESSED',
    'MITIGATING',
    'MONITORING',
    'RESOLVED',
    'ACCEPTED',
    'OCCURRED'
);


ALTER TYPE public.enum_project_risks_status OWNER TO yvesmpunga;

--
-- Name: enum_province_opportunities_priority; Type: TYPE; Schema: public; Owner: yvesmpunga
--

CREATE TYPE public.enum_province_opportunities_priority AS ENUM (
    'LOW',
    'MEDIUM',
    'HIGH',
    'URGENT'
);


ALTER TYPE public.enum_province_opportunities_priority OWNER TO yvesmpunga;

--
-- Name: enum_province_opportunities_status; Type: TYPE; Schema: public; Owner: yvesmpunga
--

CREATE TYPE public.enum_province_opportunities_status AS ENUM (
    'DRAFT',
    'PUBLISHED',
    'CLOSED',
    'ARCHIVED'
);


ALTER TYPE public.enum_province_opportunities_status OWNER TO yvesmpunga;

--
-- Name: enum_public_holidays_type; Type: TYPE; Schema: public; Owner: yvesmpunga
--

CREATE TYPE public.enum_public_holidays_type AS ENUM (
    'NATIONAL',
    'RELIGIOUS',
    'REGIONAL',
    'COMPANY'
);


ALTER TYPE public.enum_public_holidays_type OWNER TO yvesmpunga;

--
-- Name: enum_stakeholder_dialogues_eventType; Type: TYPE; Schema: public; Owner: yvesmpunga
--

CREATE TYPE public."enum_stakeholder_dialogues_eventType" AS ENUM (
    'ROUNDTABLE',
    'FORUM',
    'WORKSHOP',
    'CONSULTATION',
    'BILATERAL',
    'SECTOR_MEETING',
    'WORKING_GROUP',
    'CONFERENCE',
    'WEBINAR',
    'OTHER'
);


ALTER TYPE public."enum_stakeholder_dialogues_eventType" OWNER TO yvesmpunga;

--
-- Name: enum_stakeholder_dialogues_status; Type: TYPE; Schema: public; Owner: yvesmpunga
--

CREATE TYPE public.enum_stakeholder_dialogues_status AS ENUM (
    'PLANNED',
    'INVITATIONS_SENT',
    'CONFIRMED',
    'IN_PROGRESS',
    'COMPLETED',
    'CANCELLED',
    'POSTPONED'
);


ALTER TYPE public.enum_stakeholder_dialogues_status OWNER TO yvesmpunga;

--
-- Name: enum_users_language; Type: TYPE; Schema: public; Owner: yvesmpunga
--

CREATE TYPE public.enum_users_language AS ENUM (
    'fr',
    'en',
    'pt',
    'es',
    'ar'
);


ALTER TYPE public.enum_users_language OWNER TO yvesmpunga;

--
-- Name: enum_users_role; Type: TYPE; Schema: public; Owner: yvesmpunga
--

CREATE TYPE public.enum_users_role AS ENUM (
    'admin',
    'manager',
    'agent',
    'investor',
    'partner'
);


ALTER TYPE public.enum_users_role OWNER TO yvesmpunga;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: Account; Type: TABLE; Schema: public; Owner: yvesmpunga
--

CREATE TABLE public."Account" (
    id text NOT NULL,
    "userId" text NOT NULL,
    type character varying(255) NOT NULL,
    provider character varying(255) NOT NULL,
    "providerAccountId" character varying(255) NOT NULL,
    refresh_token text,
    access_token text,
    expires_at integer,
    token_type character varying(255),
    scope character varying(255),
    id_token text,
    session_state character varying(255),
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public."Account" OWNER TO yvesmpunga;

--
-- Name: ApprovalRequest; Type: TABLE; Schema: public; Owner: yvesmpunga
--

CREATE TABLE public."ApprovalRequest" (
    id text NOT NULL,
    "requestNumber" text NOT NULL,
    "investorId" text NOT NULL,
    "investmentId" text,
    "approvalType" text NOT NULL,
    regime text,
    "projectName" text NOT NULL,
    "projectDescription" text,
    "investmentAmount" numeric(18,2) NOT NULL,
    currency text DEFAULT 'USD'::text NOT NULL,
    "jobsToCreate" integer DEFAULT 0 NOT NULL,
    province text NOT NULL,
    sector text NOT NULL,
    status public."ApprovalStatus" DEFAULT 'DRAFT'::public."ApprovalStatus" NOT NULL,
    "currentStep" integer DEFAULT 1 NOT NULL,
    "assignedToId" text,
    "assignedAt" timestamp(3) without time zone,
    "decisionDate" timestamp(3) without time zone,
    "decisionNote" text,
    "submittedAt" timestamp(3) without time zone,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "directJobs" integer DEFAULT 0,
    "indirectJobs" integer DEFAULT 0
);


ALTER TABLE public."ApprovalRequest" OWNER TO yvesmpunga;

--
-- Name: Attendance; Type: TABLE; Schema: public; Owner: yvesmpunga
--

CREATE TABLE public."Attendance" (
    id text NOT NULL,
    "employeeId" text NOT NULL,
    date date NOT NULL,
    "checkIn" timestamp(3) without time zone,
    "checkOut" timestamp(3) without time zone,
    "workHours" numeric(5,2),
    "overtimeHours" numeric(5,2),
    status public."AttendanceStatus" DEFAULT 'PRESENT'::public."AttendanceStatus" NOT NULL,
    source public."AttendanceSource" DEFAULT 'MANUAL'::public."AttendanceSource" NOT NULL,
    notes text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Attendance" OWNER TO yvesmpunga;

--
-- Name: CategoryDeduction; Type: TABLE; Schema: public; Owner: yvesmpunga
--

CREATE TABLE public."CategoryDeduction" (
    id text NOT NULL,
    "categoryId" text NOT NULL,
    code text NOT NULL,
    name text NOT NULL,
    description text,
    amount numeric(18,2) NOT NULL,
    "isPercentage" boolean DEFAULT false NOT NULL,
    "isBeforeTax" boolean DEFAULT false NOT NULL,
    "isMandatory" boolean DEFAULT true NOT NULL,
    "isActive" boolean DEFAULT true NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."CategoryDeduction" OWNER TO yvesmpunga;

--
-- Name: CategoryPrime; Type: TABLE; Schema: public; Owner: yvesmpunga
--

CREATE TABLE public."CategoryPrime" (
    id text NOT NULL,
    "categoryId" text NOT NULL,
    code text NOT NULL,
    name text NOT NULL,
    description text,
    amount numeric(18,2) NOT NULL,
    "isPercentage" boolean DEFAULT false NOT NULL,
    "isTaxable" boolean DEFAULT true NOT NULL,
    "isSubjectToCNSS" boolean DEFAULT false NOT NULL,
    "isActive" boolean DEFAULT true NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."CategoryPrime" OWNER TO yvesmpunga;

--
-- Name: City; Type: TABLE; Schema: public; Owner: yvesmpunga
--

CREATE TABLE public."City" (
    id text NOT NULL,
    code text NOT NULL,
    name text NOT NULL,
    "provinceId" text NOT NULL,
    population integer,
    "isCapital" boolean DEFAULT false,
    "isActive" boolean DEFAULT true,
    "createdAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public."City" OWNER TO yvesmpunga;

--
-- Name: Commune; Type: TABLE; Schema: public; Owner: yvesmpunga
--

CREATE TABLE public."Commune" (
    id text NOT NULL,
    code text NOT NULL,
    name text NOT NULL,
    "cityId" text NOT NULL,
    population integer,
    "isActive" boolean DEFAULT true,
    "createdAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public."Commune" OWNER TO yvesmpunga;

--
-- Name: Contract; Type: TABLE; Schema: public; Owner: yvesmpunga
--

CREATE TABLE public."Contract" (
    id text NOT NULL,
    "contractNumber" text NOT NULL,
    "employeeId" text NOT NULL,
    type public."EmploymentType" NOT NULL,
    "startDate" timestamp(3) without time zone NOT NULL,
    "endDate" timestamp(3) without time zone,
    "baseSalary" numeric(18,2) NOT NULL,
    currency text DEFAULT 'USD'::text NOT NULL,
    "housingAllowance" numeric(18,2),
    "transportAllowance" numeric(18,2),
    "otherAllowances" numeric(18,2),
    "documentUrl" text,
    status public."ContractStatus" DEFAULT 'ACTIVE'::public."ContractStatus" NOT NULL,
    "terminationDate" timestamp(3) without time zone,
    "terminationReason" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Contract" OWNER TO yvesmpunga;

--
-- Name: Currency; Type: TABLE; Schema: public; Owner: yvesmpunga
--

CREATE TABLE public."Currency" (
    id text NOT NULL,
    code text NOT NULL,
    name text NOT NULL,
    "nameFr" text NOT NULL,
    symbol text NOT NULL,
    "exchangeRate" numeric(18,6) DEFAULT 1 NOT NULL,
    "previousRate" numeric(18,6) DEFAULT 1 NOT NULL,
    "isBaseCurrency" boolean DEFAULT false NOT NULL,
    "isActive" boolean DEFAULT true NOT NULL,
    "lastUpdated" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Currency" OWNER TO yvesmpunga;

--
-- Name: Document; Type: TABLE; Schema: public; Owner: yvesmpunga
--

CREATE TABLE public."Document" (
    id text NOT NULL,
    name text NOT NULL,
    type text NOT NULL,
    category text,
    "fileUrl" text NOT NULL,
    "fileSize" integer,
    "mimeType" text,
    "investorId" text,
    "investmentId" text,
    "approvalRequestId" text,
    "legalDocumentId" text,
    "uploadedBy" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Document" OWNER TO yvesmpunga;

--
-- Name: Employee; Type: TABLE; Schema: public; Owner: yvesmpunga
--

CREATE TABLE public."Employee" (
    id text NOT NULL,
    matricule text NOT NULL,
    "firstName" text NOT NULL,
    "lastName" text NOT NULL,
    "middleName" text,
    gender public."Gender" NOT NULL,
    "dateOfBirth" timestamp(3) without time zone NOT NULL,
    "placeOfBirth" text,
    nationality text DEFAULT 'Congolaise'::text NOT NULL,
    "nationalId" text,
    "maritalStatus" public."MaritalStatus" DEFAULT 'SINGLE'::public."MaritalStatus" NOT NULL,
    "numberOfChildren" integer DEFAULT 0 NOT NULL,
    email text NOT NULL,
    phone text,
    "alternatePhone" text,
    address text,
    city text,
    province text,
    photo text,
    "hireDate" timestamp(3) without time zone NOT NULL,
    "employmentType" public."EmploymentType" DEFAULT 'CDI'::public."EmploymentType" NOT NULL,
    status public."EmployeeStatus" DEFAULT 'ACTIVE'::public."EmployeeStatus" NOT NULL,
    "departmentId" text NOT NULL,
    "positionId" text NOT NULL,
    "managerId" text,
    "bankName" text,
    "bankAccountNumber" text,
    "bankAccountName" text,
    "emergencyContactName" text,
    "emergencyContactPhone" text,
    "emergencyContactRelation" text,
    "userId" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "workerCategoryId" text
);


ALTER TABLE public."Employee" OWNER TO yvesmpunga;

--
-- Name: EmployeeBankAccount; Type: TABLE; Schema: public; Owner: yvesmpunga
--

CREATE TABLE public."EmployeeBankAccount" (
    id text NOT NULL,
    "employeeId" text NOT NULL,
    "bankName" text NOT NULL,
    "accountNumber" text NOT NULL,
    iban text,
    swift text,
    "currencyId" text,
    "isDefault" boolean DEFAULT false NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."EmployeeBankAccount" OWNER TO yvesmpunga;

--
-- Name: EmployeeChild; Type: TABLE; Schema: public; Owner: yvesmpunga
--

CREATE TABLE public."EmployeeChild" (
    id text NOT NULL,
    "employeeId" text NOT NULL,
    "lastName" text NOT NULL,
    "firstName" text NOT NULL,
    "middleName" text,
    "dateOfBirth" timestamp(3) without time zone,
    gender public."Gender",
    relationship public."ChildRelationship" DEFAULT 'BIOLOGICAL'::public."ChildRelationship" NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."EmployeeChild" OWNER TO yvesmpunga;

--
-- Name: EmployeeDocument; Type: TABLE; Schema: public; Owner: yvesmpunga
--

CREATE TABLE public."EmployeeDocument" (
    id text NOT NULL,
    "employeeId" text NOT NULL,
    name text NOT NULL,
    type public."EmployeeDocumentType" NOT NULL,
    description text,
    "fileUrl" text NOT NULL,
    "fileSize" integer,
    "mimeType" text,
    "issueDate" timestamp(3) without time zone,
    "expiryDate" timestamp(3) without time zone,
    "isVerified" boolean DEFAULT false NOT NULL,
    "verifiedAt" timestamp(3) without time zone,
    "verifiedBy" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."EmployeeDocument" OWNER TO yvesmpunga;

--
-- Name: EmployeeEmergencyContact; Type: TABLE; Schema: public; Owner: yvesmpunga
--

CREATE TABLE public."EmployeeEmergencyContact" (
    id text NOT NULL,
    "employeeId" text NOT NULL,
    "fullName" text NOT NULL,
    phone text NOT NULL,
    relationship public."EmergencyContactRelationship" NOT NULL,
    "isPrimary" boolean DEFAULT false NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."EmployeeEmergencyContact" OWNER TO yvesmpunga;

--
-- Name: EmployeeSpouse; Type: TABLE; Schema: public; Owner: yvesmpunga
--

CREATE TABLE public."EmployeeSpouse" (
    id text NOT NULL,
    "employeeId" text NOT NULL,
    "lastName" text NOT NULL,
    "firstName" text NOT NULL,
    "middleName" text,
    "dateOfBirth" timestamp(3) without time zone,
    phone text,
    occupation text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."EmployeeSpouse" OWNER TO yvesmpunga;

--
-- Name: EmployeeTraining; Type: TABLE; Schema: public; Owner: yvesmpunga
--

CREATE TABLE public."EmployeeTraining" (
    id text NOT NULL,
    "employeeId" text NOT NULL,
    "trainingId" text NOT NULL,
    status public."TrainingParticipationStatus" DEFAULT 'ENROLLED'::public."TrainingParticipationStatus" NOT NULL,
    score numeric(5,2),
    "certificateUrl" text,
    "completedAt" timestamp(3) without time zone,
    feedback text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."EmployeeTraining" OWNER TO yvesmpunga;

--
-- Name: Evaluation; Type: TABLE; Schema: public; Owner: yvesmpunga
--

CREATE TABLE public."Evaluation" (
    id text NOT NULL,
    "evaluationNumber" text NOT NULL,
    "employeeId" text NOT NULL,
    "evaluatorId" text NOT NULL,
    "periodStart" timestamp(3) without time zone NOT NULL,
    "periodEnd" timestamp(3) without time zone NOT NULL,
    type public."EvaluationType" DEFAULT 'ANNUAL'::public."EvaluationType" NOT NULL,
    objectives jsonb,
    results jsonb,
    "performanceScore" numeric(5,2),
    strengths text,
    "areasToImprove" text,
    "employeeComments" text,
    "evaluatorComments" text,
    recommendations text,
    "trainingNeeds" text,
    status public."EvaluationStatus" DEFAULT 'DRAFT'::public."EvaluationStatus" NOT NULL,
    "submittedAt" timestamp(3) without time zone,
    "completedAt" timestamp(3) without time zone,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Evaluation" OWNER TO yvesmpunga;

--
-- Name: HRDepartment; Type: TABLE; Schema: public; Owner: yvesmpunga
--

CREATE TABLE public."HRDepartment" (
    id text NOT NULL,
    code character varying(255) NOT NULL,
    name character varying(255) NOT NULL,
    description text,
    "parentId" text,
    "managerId" text,
    "isActive" boolean DEFAULT true,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public."HRDepartment" OWNER TO yvesmpunga;

--
-- Name: Holiday; Type: TABLE; Schema: public; Owner: yvesmpunga
--

CREATE TABLE public."Holiday" (
    id text NOT NULL,
    name text NOT NULL,
    date date NOT NULL,
    year integer NOT NULL,
    "isRecurring" boolean DEFAULT false NOT NULL,
    description text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Holiday" OWNER TO yvesmpunga;

--
-- Name: Investment; Type: TABLE; Schema: public; Owner: yvesmpunga
--

CREATE TABLE public."Investment" (
    id text NOT NULL,
    "projectCode" text NOT NULL,
    "projectName" text NOT NULL,
    description text,
    "investorId" text NOT NULL,
    sector text NOT NULL,
    "subSector" text,
    province text NOT NULL,
    city text,
    address text,
    amount numeric(18,2) NOT NULL,
    currency text DEFAULT 'USD'::text,
    "jobsCreated" integer DEFAULT 0,
    "jobsIndirect" integer DEFAULT 0,
    "startDate" timestamp with time zone,
    "endDate" timestamp with time zone,
    status character varying(255) DEFAULT 'DRAFT'::public."InvestmentStatus",
    progress integer DEFAULT 0,
    "approvalDate" timestamp with time zone,
    "approvedBy" text,
    "rejectionDate" timestamp with time zone,
    "rejectedBy" text,
    "rejectionReason" text,
    "createdById" text,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public."Investment" OWNER TO yvesmpunga;

--
-- Name: Investor; Type: TABLE; Schema: public; Owner: yvesmpunga
--

CREATE TABLE public."Investor" (
    id text NOT NULL,
    "investorCode" text NOT NULL,
    name text NOT NULL,
    type public."InvestorType" NOT NULL,
    category public."InvestorCategory" NOT NULL,
    country text DEFAULT 'RDC'::text NOT NULL,
    nationality text,
    email text,
    phone text,
    address text,
    city text,
    province text,
    sector text,
    "registrationNumber" text,
    "taxId" text,
    status public."InvestorStatus" DEFAULT 'PENDING'::public."InvestorStatus" NOT NULL,
    "contactName" text,
    "contactEmail" text,
    "contactPhone" text,
    "contactPosition" text,
    "createdById" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Investor" OWNER TO yvesmpunga;

--
-- Name: Leave; Type: TABLE; Schema: public; Owner: yvesmpunga
--

CREATE TABLE public."Leave" (
    id text NOT NULL,
    "leaveNumber" text NOT NULL,
    "employeeId" text NOT NULL,
    "leaveTypeId" text NOT NULL,
    "startDate" timestamp(3) without time zone NOT NULL,
    "endDate" timestamp(3) without time zone NOT NULL,
    days numeric(5,2) NOT NULL,
    reason text,
    "documentUrl" text,
    status public."LeaveStatus" DEFAULT 'PENDING'::public."LeaveStatus" NOT NULL,
    "approvedById" text,
    "approvedAt" timestamp(3) without time zone,
    "approvalNote" text,
    "rejectionReason" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Leave" OWNER TO yvesmpunga;

--
-- Name: LeaveBalance; Type: TABLE; Schema: public; Owner: yvesmpunga
--

CREATE TABLE public."LeaveBalance" (
    id text NOT NULL,
    "employeeId" text NOT NULL,
    "leaveTypeId" text NOT NULL,
    year integer NOT NULL,
    entitled numeric(5,2) NOT NULL,
    taken numeric(5,2) DEFAULT 0 NOT NULL,
    pending numeric(5,2) DEFAULT 0 NOT NULL,
    balance numeric(5,2) NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."LeaveBalance" OWNER TO yvesmpunga;

--
-- Name: LeaveType; Type: TABLE; Schema: public; Owner: yvesmpunga
--

CREATE TABLE public."LeaveType" (
    id text NOT NULL,
    code text NOT NULL,
    name text NOT NULL,
    description text,
    "defaultDays" integer DEFAULT 0 NOT NULL,
    "isPaid" boolean DEFAULT true NOT NULL,
    "requiresApproval" boolean DEFAULT true NOT NULL,
    "requiresDocument" boolean DEFAULT false NOT NULL,
    "isActive" boolean DEFAULT true NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    color text DEFAULT '#3B82F6'::text NOT NULL,
    "maxDays" integer DEFAULT 30 NOT NULL
);


ALTER TABLE public."LeaveType" OWNER TO yvesmpunga;

--
-- Name: LegalDocument; Type: TABLE; Schema: public; Owner: yvesmpunga
--

CREATE TABLE public."LegalDocument" (
    id text NOT NULL,
    "documentNumber" text NOT NULL,
    type public."LegalDocumentType" NOT NULL,
    "subType" text,
    "investmentId" text NOT NULL,
    "ministryId" text,
    "ministryName" text,
    province text,
    sector text,
    status public."LegalDocumentStatus" DEFAULT 'DRAFT'::public."LegalDocumentStatus" NOT NULL,
    "issueDate" timestamp(3) without time zone,
    "expiryDate" timestamp(3) without time zone,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."LegalDocument" OWNER TO yvesmpunga;

--
-- Name: Ministry; Type: TABLE; Schema: public; Owner: yvesmpunga
--

CREATE TABLE public."Ministry" (
    id text NOT NULL,
    code text NOT NULL,
    name text NOT NULL,
    "shortName" text,
    description text,
    "contactEmail" text,
    "contactPhone" text,
    address text,
    "isActive" boolean DEFAULT true NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Ministry" OWNER TO yvesmpunga;

--
-- Name: PayrollConfig; Type: TABLE; Schema: public; Owner: yvesmpunga
--

CREATE TABLE public."PayrollConfig" (
    id text NOT NULL,
    code text NOT NULL,
    name text NOT NULL,
    description text,
    type public."PayrollConfigType" NOT NULL,
    rate numeric(10,4) NOT NULL,
    amount numeric(18,2),
    "minAmount" numeric(18,2),
    "maxAmount" numeric(18,2),
    "isEmployerContribution" boolean DEFAULT false NOT NULL,
    "isEmployeeContribution" boolean DEFAULT true NOT NULL,
    "isActive" boolean DEFAULT true NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."PayrollConfig" OWNER TO yvesmpunga;

--
-- Name: Payslip; Type: TABLE; Schema: public; Owner: yvesmpunga
--

CREATE TABLE public."Payslip" (
    id text NOT NULL,
    "payslipNumber" text NOT NULL,
    "employeeId" text NOT NULL,
    month integer NOT NULL,
    year integer NOT NULL,
    "periodStart" timestamp(3) without time zone NOT NULL,
    "periodEnd" timestamp(3) without time zone NOT NULL,
    "baseSalary" numeric(18,2) NOT NULL,
    allowances jsonb,
    "totalAllowances" numeric(18,2) DEFAULT 0 NOT NULL,
    "grossSalary" numeric(18,2) NOT NULL,
    deductions jsonb,
    "totalDeductions" numeric(18,2) DEFAULT 0 NOT NULL,
    "employerContributions" jsonb,
    "netSalary" numeric(18,2) NOT NULL,
    "overtimeHours" numeric(5,2) DEFAULT 0 NOT NULL,
    "overtimeAmount" numeric(18,2) DEFAULT 0 NOT NULL,
    advances numeric(18,2) DEFAULT 0 NOT NULL,
    status public."PayslipStatus" DEFAULT 'DRAFT'::public."PayslipStatus" NOT NULL,
    "paymentDate" timestamp(3) without time zone,
    "paymentMethod" public."PaymentMethod",
    "paymentReference" text,
    "documentUrl" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Payslip" OWNER TO yvesmpunga;

--
-- Name: Position; Type: TABLE; Schema: public; Owner: yvesmpunga
--

CREATE TABLE public."Position" (
    id text NOT NULL,
    code text NOT NULL,
    title text NOT NULL,
    description text,
    responsibilities text,
    requirements text,
    "departmentId" text NOT NULL,
    "isActive" boolean DEFAULT true NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    location text,
    "supervisorId" text,
    "workDaysPerWeek" integer DEFAULT 5 NOT NULL,
    "workHoursPerDay" integer DEFAULT 8 NOT NULL
);


ALTER TABLE public."Position" OWNER TO yvesmpunga;

--
-- Name: Province; Type: TABLE; Schema: public; Owner: yvesmpunga
--

CREATE TABLE public."Province" (
    id text NOT NULL,
    code text NOT NULL,
    name text NOT NULL,
    capital text,
    population integer,
    area double precision,
    "isActive" boolean DEFAULT true NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Province" OWNER TO yvesmpunga;

--
-- Name: SalaryAdvance; Type: TABLE; Schema: public; Owner: yvesmpunga
--

CREATE TABLE public."SalaryAdvance" (
    id text NOT NULL,
    "advanceNumber" text NOT NULL,
    "employeeId" text NOT NULL,
    amount numeric(18,2) NOT NULL,
    reason text,
    "repaymentMonths" integer DEFAULT 1 NOT NULL,
    "monthlyDeduction" numeric(18,2) NOT NULL,
    "remainingAmount" numeric(18,2) NOT NULL,
    status public."AdvanceStatus" DEFAULT 'PENDING'::public."AdvanceStatus" NOT NULL,
    "approvedById" text,
    "approvedAt" timestamp(3) without time zone,
    "disbursementDate" timestamp(3) without time zone,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."SalaryAdvance" OWNER TO yvesmpunga;

--
-- Name: SalaryGrade; Type: TABLE; Schema: public; Owner: yvesmpunga
--

CREATE TABLE public."SalaryGrade" (
    id text NOT NULL,
    code text NOT NULL,
    name text NOT NULL,
    level integer NOT NULL,
    "minSalary" numeric(18,2) NOT NULL,
    "maxSalary" numeric(18,2) NOT NULL,
    description text,
    "isActive" boolean DEFAULT true NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."SalaryGrade" OWNER TO yvesmpunga;

--
-- Name: Sector; Type: TABLE; Schema: public; Owner: yvesmpunga
--

CREATE TABLE public."Sector" (
    id text NOT NULL,
    code text NOT NULL,
    name text NOT NULL,
    description text,
    "parentId" text,
    "isActive" boolean DEFAULT true NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Sector" OWNER TO yvesmpunga;

--
-- Name: Session; Type: TABLE; Schema: public; Owner: yvesmpunga
--

CREATE TABLE public."Session" (
    id text NOT NULL,
    "sessionToken" character varying(255) NOT NULL,
    "userId" text NOT NULL,
    expires timestamp with time zone NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public."Session" OWNER TO yvesmpunga;

--
-- Name: Training; Type: TABLE; Schema: public; Owner: yvesmpunga
--

CREATE TABLE public."Training" (
    id text NOT NULL,
    code text NOT NULL,
    title text NOT NULL,
    description text,
    category text,
    provider text,
    duration integer,
    "startDate" timestamp(3) without time zone,
    "endDate" timestamp(3) without time zone,
    location text,
    cost numeric(18,2),
    currency text DEFAULT 'USD'::text NOT NULL,
    "maxParticipants" integer,
    status public."TrainingStatus" DEFAULT 'PLANNED'::public."TrainingStatus" NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Training" OWNER TO yvesmpunga;

--
-- Name: User; Type: TABLE; Schema: public; Owner: yvesmpunga
--

CREATE TABLE public."User" (
    id text NOT NULL,
    name character varying(255),
    email character varying(255) NOT NULL,
    "emailVerified" timestamp with time zone,
    password character varying(255),
    image text,
    role character varying(255) DEFAULT 'USER'::character varying,
    department text,
    phone text,
    "isActive" boolean DEFAULT true,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    "ministryId" uuid,
    modules jsonb DEFAULT '[]'::jsonb
);


ALTER TABLE public."User" OWNER TO yvesmpunga;

--
-- Name: COLUMN "User".modules; Type: COMMENT; Schema: public; Owner: yvesmpunga
--

COMMENT ON COLUMN public."User".modules IS 'Liste des modules auxquels l''utilisateur a accès';


--
-- Name: VerificationToken; Type: TABLE; Schema: public; Owner: yvesmpunga
--

CREATE TABLE public."VerificationToken" (
    identifier character varying(255) NOT NULL,
    token character varying(255) NOT NULL,
    expires timestamp with time zone NOT NULL,
    id integer NOT NULL
);


ALTER TABLE public."VerificationToken" OWNER TO yvesmpunga;

--
-- Name: VerificationToken_id_seq; Type: SEQUENCE; Schema: public; Owner: yvesmpunga
--

CREATE SEQUENCE public."VerificationToken_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."VerificationToken_id_seq" OWNER TO yvesmpunga;

--
-- Name: VerificationToken_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: yvesmpunga
--

ALTER SEQUENCE public."VerificationToken_id_seq" OWNED BY public."VerificationToken".id;


--
-- Name: WorkerCategory; Type: TABLE; Schema: public; Owner: yvesmpunga
--

CREATE TABLE public."WorkerCategory" (
    id text NOT NULL,
    code text NOT NULL,
    name text NOT NULL,
    description text,
    "baseSalary" numeric(18,2) NOT NULL,
    "hourlyRate" numeric(18,2),
    "paymentType" public."PaymentType" DEFAULT 'MONTHLY'::public."PaymentType" NOT NULL,
    "currencyId" text,
    "subjectToIPR" boolean DEFAULT true NOT NULL,
    "subjectToCNSS" boolean DEFAULT true NOT NULL,
    "subjectToINPP" boolean DEFAULT false NOT NULL,
    "subjectToONEM" boolean DEFAULT false NOT NULL,
    "iprRate" numeric(5,2) DEFAULT 0 NOT NULL,
    "cnssEmployeeRate" numeric(5,2) DEFAULT 5 NOT NULL,
    "cnssEmployerRate" numeric(5,2) DEFAULT 9 NOT NULL,
    "inppRate" numeric(5,2) DEFAULT 1 NOT NULL,
    "onemRate" numeric(5,2) DEFAULT 0.2 NOT NULL,
    "workHoursPerDay" integer DEFAULT 8 NOT NULL,
    "workDaysPerMonth" integer DEFAULT 22 NOT NULL,
    "overtimeRate" numeric(5,2) DEFAULT 1.5 NOT NULL,
    "isActive" boolean DEFAULT true NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."WorkerCategory" OWNER TO yvesmpunga;

--
-- Name: actes_administratifs; Type: TABLE; Schema: public; Owner: yvesmpunga
--

CREATE TABLE public.actes_administratifs (
    id uuid NOT NULL,
    code character varying(20) NOT NULL,
    name character varying(200) NOT NULL,
    "shortName" character varying(50),
    description text,
    category public.enum_actes_administratifs_category DEFAULT 'AUTORISATION'::public.enum_actes_administratifs_category NOT NULL,
    "sectorId" uuid,
    "ministryId" uuid,
    "legalBasis" text,
    "legalDelayDays" integer DEFAULT 30 NOT NULL,
    "warningDelayDays" integer DEFAULT 5 NOT NULL,
    cost numeric(15,2) DEFAULT 0 NOT NULL,
    "costCDF" numeric(15,2),
    currency public.enum_actes_administratifs_currency DEFAULT 'USD'::public.enum_actes_administratifs_currency NOT NULL,
    "validityMonths" integer,
    "isRenewable" boolean DEFAULT false NOT NULL,
    "renewalDelayDays" integer,
    "workflowType" character varying(50) DEFAULT 'DOSSIER'::character varying NOT NULL,
    instructions text,
    prerequisites text,
    "isActive" boolean DEFAULT true NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public.actes_administratifs OWNER TO yvesmpunga;

--
-- Name: COLUMN actes_administratifs."legalBasis"; Type: COMMENT; Schema: public; Owner: yvesmpunga
--

COMMENT ON COLUMN public.actes_administratifs."legalBasis" IS 'Base legale (loi, decret, arrete)';


--
-- Name: COLUMN actes_administratifs."legalDelayDays"; Type: COMMENT; Schema: public; Owner: yvesmpunga
--

COMMENT ON COLUMN public.actes_administratifs."legalDelayDays" IS 'Delai legal en jours ouvrables';


--
-- Name: COLUMN actes_administratifs."warningDelayDays"; Type: COMMENT; Schema: public; Owner: yvesmpunga
--

COMMENT ON COLUMN public.actes_administratifs."warningDelayDays" IS 'Delai d''alerte avant expiration';


--
-- Name: COLUMN actes_administratifs.cost; Type: COMMENT; Schema: public; Owner: yvesmpunga
--

COMMENT ON COLUMN public.actes_administratifs.cost IS 'Cout officiel';


--
-- Name: COLUMN actes_administratifs."costCDF"; Type: COMMENT; Schema: public; Owner: yvesmpunga
--

COMMENT ON COLUMN public.actes_administratifs."costCDF" IS 'Cout en CDF (optionnel)';


--
-- Name: COLUMN actes_administratifs."validityMonths"; Type: COMMENT; Schema: public; Owner: yvesmpunga
--

COMMENT ON COLUMN public.actes_administratifs."validityMonths" IS 'Duree de validite en mois (null = illimite)';


--
-- Name: COLUMN actes_administratifs."renewalDelayDays"; Type: COMMENT; Schema: public; Owner: yvesmpunga
--

COMMENT ON COLUMN public.actes_administratifs."renewalDelayDays" IS 'Delai pour demander le renouvellement';


--
-- Name: COLUMN actes_administratifs."workflowType"; Type: COMMENT; Schema: public; Owner: yvesmpunga
--

COMMENT ON COLUMN public.actes_administratifs."workflowType" IS 'Type de workflow associe';


--
-- Name: COLUMN actes_administratifs.instructions; Type: COMMENT; Schema: public; Owner: yvesmpunga
--

COMMENT ON COLUMN public.actes_administratifs.instructions IS 'Instructions pour le demandeur';


--
-- Name: COLUMN actes_administratifs.prerequisites; Type: COMMENT; Schema: public; Owner: yvesmpunga
--

COMMENT ON COLUMN public.actes_administratifs.prerequisites IS 'Prerequis ou conditions';


--
-- Name: application_documents; Type: TABLE; Schema: public; Owner: yvesmpunga
--

CREATE TABLE public.application_documents (
    id uuid NOT NULL,
    "applicationId" uuid NOT NULL,
    "requiredDocumentId" uuid,
    name character varying(200) NOT NULL,
    "fileName" character varying(500) NOT NULL,
    "filePath" character varying(1000) NOT NULL,
    "fileSize" integer,
    "mimeType" character varying(100),
    status public.enum_application_documents_status DEFAULT 'UPLOADED'::public.enum_application_documents_status NOT NULL,
    "verifiedAt" timestamp with time zone,
    "verifiedById" uuid,
    "verificationNotes" text,
    "uploadedById" uuid,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public.application_documents OWNER TO yvesmpunga;

--
-- Name: COLUMN application_documents."applicationId"; Type: COMMENT; Schema: public; Owner: yvesmpunga
--

COMMENT ON COLUMN public.application_documents."applicationId" IS 'Candidature concernee';


--
-- Name: COLUMN application_documents."requiredDocumentId"; Type: COMMENT; Schema: public; Owner: yvesmpunga
--

COMMENT ON COLUMN public.application_documents."requiredDocumentId" IS 'Document requis correspondant';


--
-- Name: COLUMN application_documents.name; Type: COMMENT; Schema: public; Owner: yvesmpunga
--

COMMENT ON COLUMN public.application_documents.name IS 'Nom du document telecharge';


--
-- Name: COLUMN application_documents."fileName"; Type: COMMENT; Schema: public; Owner: yvesmpunga
--

COMMENT ON COLUMN public.application_documents."fileName" IS 'Nom du fichier original';


--
-- Name: COLUMN application_documents."filePath"; Type: COMMENT; Schema: public; Owner: yvesmpunga
--

COMMENT ON COLUMN public.application_documents."filePath" IS 'Chemin de stockage du fichier';


--
-- Name: COLUMN application_documents."fileSize"; Type: COMMENT; Schema: public; Owner: yvesmpunga
--

COMMENT ON COLUMN public.application_documents."fileSize" IS 'Taille du fichier en octets';


--
-- Name: COLUMN application_documents."mimeType"; Type: COMMENT; Schema: public; Owner: yvesmpunga
--

COMMENT ON COLUMN public.application_documents."mimeType" IS 'Type MIME du fichier';


--
-- Name: COLUMN application_documents.status; Type: COMMENT; Schema: public; Owner: yvesmpunga
--

COMMENT ON COLUMN public.application_documents.status IS 'Statut de verification du document';


--
-- Name: COLUMN application_documents."verificationNotes"; Type: COMMENT; Schema: public; Owner: yvesmpunga
--

COMMENT ON COLUMN public.application_documents."verificationNotes" IS 'Notes de verification';


--
-- Name: approvals; Type: TABLE; Schema: public; Owner: yvesmpunga
--

CREATE TABLE public.approvals (
    id uuid NOT NULL,
    investment_id uuid NOT NULL,
    type public.enum_approvals_type NOT NULL,
    status public.enum_approvals_status DEFAULT 'pending'::public.enum_approvals_status,
    assigned_to uuid,
    reviewed_by uuid,
    reviewed_at timestamp with time zone,
    comments text,
    documents jsonb DEFAULT '[]'::jsonb,
    due_date date,
    sort_order integer DEFAULT 0,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


ALTER TABLE public.approvals OWNER TO yvesmpunga;

--
-- Name: attendances; Type: TABLE; Schema: public; Owner: yvesmpunga
--

CREATE TABLE public.attendances (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    employee_id uuid NOT NULL,
    date date NOT NULL,
    check_in time without time zone,
    check_out time without time zone,
    break_start time without time zone,
    break_end time without time zone,
    working_hours numeric(5,2),
    break_hours numeric(5,2),
    overtime_hours numeric(5,2) DEFAULT 0,
    status character varying(20) DEFAULT 'PRESENT'::character varying,
    late_minutes integer DEFAULT 0,
    early_leave_minutes integer DEFAULT 0,
    work_location character varying(20) DEFAULT 'OFFICE'::character varying,
    location_details character varying(255),
    check_in_latitude numeric(10,8),
    check_in_longitude numeric(11,8),
    check_out_latitude numeric(10,8),
    check_out_longitude numeric(11,8),
    absence_reason text,
    is_justified boolean DEFAULT false,
    justification_document character varying(500),
    leave_id uuid,
    notes text,
    is_validated boolean DEFAULT false,
    validated_by_id character varying(255),
    validated_at timestamp without time zone,
    source character varying(20) DEFAULT 'MANUAL'::character varying,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.attendances OWNER TO yvesmpunga;

--
-- Name: barrier_resolutions; Type: TABLE; Schema: public; Owner: yvesmpunga
--

CREATE TABLE public.barrier_resolutions (
    id uuid NOT NULL,
    "barrierId" uuid NOT NULL,
    "actionType" public."enum_barrier_resolutions_actionType" NOT NULL,
    description text NOT NULL,
    "previousStatus" character varying(50),
    "newStatus" character varying(50),
    "contactName" character varying(255),
    "contactOrganization" character varying(255),
    "contactEmail" character varying(255),
    "actionDate" timestamp with time zone,
    "followUpDate" timestamp with time zone,
    outcome text,
    attachments jsonb DEFAULT '[]'::jsonb,
    "isInternal" boolean DEFAULT false,
    "performedById" character varying(50) NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public.barrier_resolutions OWNER TO yvesmpunga;

--
-- Name: COLUMN barrier_resolutions."isInternal"; Type: COMMENT; Schema: public; Owner: yvesmpunga
--

COMMENT ON COLUMN public.barrier_resolutions."isInternal" IS 'Si vrai, non visible par l''investisseur';


--
-- Name: bidder_ratings; Type: TABLE; Schema: public; Owner: yvesmpunga
--

CREATE TABLE public.bidder_ratings (
    id uuid NOT NULL,
    bidder_id uuid NOT NULL,
    contract_id uuid,
    tender_id uuid,
    evaluation_type public.enum_bidder_ratings_evaluation_type DEFAULT 'PERIODIC'::public.enum_bidder_ratings_evaluation_type,
    evaluation_date timestamp with time zone,
    evaluation_period character varying(50),
    quality_score numeric(3,2),
    delivery_score numeric(3,2),
    price_score numeric(3,2),
    communication_score numeric(3,2),
    compliance_score numeric(3,2),
    safety_score numeric(3,2),
    environmental_score numeric(3,2),
    overall_score numeric(3,2),
    criteria_weights json DEFAULT '{"quality":20,"delivery":20,"price":15,"communication":15,"compliance":15,"safety":10,"environmental":5}'::json,
    incidents_count integer DEFAULT 0,
    penalties_applied numeric(18,2) DEFAULT 0,
    delays_count integer DEFAULT 0,
    total_delay_days integer DEFAULT 0,
    strengths text,
    weaknesses text,
    improvements text,
    recommendation public.enum_bidder_ratings_recommendation,
    notes text,
    status public.enum_bidder_ratings_status DEFAULT 'DRAFT'::public.enum_bidder_ratings_status,
    evaluated_by_id character varying(255),
    approved_by_id character varying(255),
    approved_at timestamp with time zone,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


ALTER TABLE public.bidder_ratings OWNER TO yvesmpunga;

--
-- Name: COLUMN bidder_ratings.contract_id; Type: COMMENT; Schema: public; Owner: yvesmpunga
--

COMMENT ON COLUMN public.bidder_ratings.contract_id IS 'Contrat associé à cette évaluation';


--
-- Name: COLUMN bidder_ratings.evaluation_period; Type: COMMENT; Schema: public; Owner: yvesmpunga
--

COMMENT ON COLUMN public.bidder_ratings.evaluation_period IS 'Ex: Q1 2025, Contrat PM-2025-0001';


--
-- Name: COLUMN bidder_ratings.quality_score; Type: COMMENT; Schema: public; Owner: yvesmpunga
--

COMMENT ON COLUMN public.bidder_ratings.quality_score IS 'Qualité des livrables (1-5)';


--
-- Name: COLUMN bidder_ratings.delivery_score; Type: COMMENT; Schema: public; Owner: yvesmpunga
--

COMMENT ON COLUMN public.bidder_ratings.delivery_score IS 'Respect des délais (1-5)';


--
-- Name: COLUMN bidder_ratings.price_score; Type: COMMENT; Schema: public; Owner: yvesmpunga
--

COMMENT ON COLUMN public.bidder_ratings.price_score IS 'Rapport qualité/prix (1-5)';


--
-- Name: COLUMN bidder_ratings.communication_score; Type: COMMENT; Schema: public; Owner: yvesmpunga
--

COMMENT ON COLUMN public.bidder_ratings.communication_score IS 'Communication et réactivité (1-5)';


--
-- Name: COLUMN bidder_ratings.compliance_score; Type: COMMENT; Schema: public; Owner: yvesmpunga
--

COMMENT ON COLUMN public.bidder_ratings.compliance_score IS 'Conformité aux spécifications (1-5)';


--
-- Name: COLUMN bidder_ratings.safety_score; Type: COMMENT; Schema: public; Owner: yvesmpunga
--

COMMENT ON COLUMN public.bidder_ratings.safety_score IS 'Respect des normes de sécurité (1-5)';


--
-- Name: COLUMN bidder_ratings.environmental_score; Type: COMMENT; Schema: public; Owner: yvesmpunga
--

COMMENT ON COLUMN public.bidder_ratings.environmental_score IS 'Respect de l''environnement (1-5)';


--
-- Name: COLUMN bidder_ratings.overall_score; Type: COMMENT; Schema: public; Owner: yvesmpunga
--

COMMENT ON COLUMN public.bidder_ratings.overall_score IS 'Score global calculé (1-5)';


--
-- Name: business_barriers; Type: TABLE; Schema: public; Owner: yvesmpunga
--

CREATE TABLE public.business_barriers (
    id uuid NOT NULL,
    reference character varying(50) NOT NULL,
    title character varying(255) NOT NULL,
    description text NOT NULL,
    category public.enum_business_barriers_category DEFAULT 'ADMINISTRATIVE'::public.enum_business_barriers_category,
    severity public.enum_business_barriers_severity DEFAULT 'MEDIUM'::public.enum_business_barriers_severity,
    status public.enum_business_barriers_status DEFAULT 'REPORTED'::public.enum_business_barriers_status,
    "estimatedImpact" numeric(15,2),
    "concernedAdministration" character varying(255),
    province character varying(100),
    sector character varying(100),
    "reportSource" public."enum_business_barriers_reportSource" DEFAULT 'INVESTOR'::public."enum_business_barriers_reportSource",
    "reporterName" character varying(255),
    "reporterEmail" character varying(255),
    "reporterPhone" character varying(50),
    "reportedAt" timestamp with time zone,
    "acknowledgedAt" timestamp with time zone,
    "resolvedAt" timestamp with time zone,
    "closedAt" timestamp with time zone,
    "targetResolutionDays" integer DEFAULT 30,
    resolution text,
    "resolutionType" public."enum_business_barriers_resolutionType",
    "internalNotes" text,
    attachments jsonb DEFAULT '[]'::jsonb,
    "investorId" uuid,
    "projectId" uuid,
    "assignedToId" character varying(50),
    "createdById" character varying(50),
    "resolvedById" character varying(50),
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public.business_barriers OWNER TO yvesmpunga;

--
-- Name: COLUMN business_barriers."estimatedImpact"; Type: COMMENT; Schema: public; Owner: yvesmpunga
--

COMMENT ON COLUMN public.business_barriers."estimatedImpact" IS 'Impact financier estimé en USD';


--
-- Name: cities; Type: TABLE; Schema: public; Owner: yvesmpunga
--

CREATE TABLE public.cities (
    id uuid NOT NULL,
    code character varying(20) NOT NULL,
    name character varying(255) NOT NULL,
    name_fr character varying(255) NOT NULL,
    name_en character varying(255),
    name_pt character varying(255),
    name_es character varying(255),
    name_ar character varying(255),
    province_id uuid NOT NULL,
    city_type public.enum_cities_city_type DEFAULT 'city'::public.enum_cities_city_type,
    population bigint,
    area numeric(12,2),
    latitude numeric(10,8),
    longitude numeric(11,8),
    postal_code character varying(20),
    description text,
    sort_order integer DEFAULT 0,
    is_active boolean DEFAULT true,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


ALTER TABLE public.cities OWNER TO yvesmpunga;

--
-- Name: COLUMN cities.city_type; Type: COMMENT; Schema: public; Owner: yvesmpunga
--

COMMENT ON COLUMN public.cities.city_type IS 'Type of city: capital, chief_town, city, municipality';


--
-- Name: COLUMN cities.area; Type: COMMENT; Schema: public; Owner: yvesmpunga
--

COMMENT ON COLUMN public.cities.area IS 'Area in km2';


--
-- Name: climate_indicator_values; Type: TABLE; Schema: public; Owner: yvesmpunga
--

CREATE TABLE public.climate_indicator_values (
    id uuid NOT NULL,
    "indicatorId" uuid NOT NULL,
    year integer NOT NULL,
    quarter integer,
    month integer,
    value numeric(15,4) NOT NULL,
    "previousValue" numeric(15,4),
    "changePercentage" numeric(10,2),
    rank integer,
    "rankOutOf" integer,
    "regionalAverage" numeric(15,4),
    "regionalRank" integer,
    notes text,
    source character varying(255),
    "sourceUrl" character varying(500),
    "publishedDate" timestamp with time zone,
    "isVerified" boolean DEFAULT false,
    "verifiedAt" timestamp with time zone,
    "verifiedById" uuid,
    "createdById" uuid,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public.climate_indicator_values OWNER TO yvesmpunga;

--
-- Name: COLUMN climate_indicator_values.quarter; Type: COMMENT; Schema: public; Owner: yvesmpunga
--

COMMENT ON COLUMN public.climate_indicator_values.quarter IS '1-4 pour les indicateurs trimestriels';


--
-- Name: COLUMN climate_indicator_values.month; Type: COMMENT; Schema: public; Owner: yvesmpunga
--

COMMENT ON COLUMN public.climate_indicator_values.month IS '1-12 pour les indicateurs mensuels';


--
-- Name: COLUMN climate_indicator_values."rankOutOf"; Type: COMMENT; Schema: public; Owner: yvesmpunga
--

COMMENT ON COLUMN public.climate_indicator_values."rankOutOf" IS 'Classement sur combien de pays';


--
-- Name: climate_indicators; Type: TABLE; Schema: public; Owner: yvesmpunga
--

CREATE TABLE public.climate_indicators (
    id uuid NOT NULL,
    code character varying(50) NOT NULL,
    name character varying(255) NOT NULL,
    description text,
    category public.enum_climate_indicators_category DEFAULT 'INVESTMENT_CLIMATE'::public.enum_climate_indicators_category,
    "subCategory" character varying(100),
    "measureType" public."enum_climate_indicators_measureType" DEFAULT 'SCORE'::public."enum_climate_indicators_measureType",
    unit character varying(50),
    "betterDirection" public."enum_climate_indicators_betterDirection" DEFAULT 'HIGHER'::public."enum_climate_indicators_betterDirection",
    "dataSource" character varying(255),
    "updateFrequency" public."enum_climate_indicators_updateFrequency" DEFAULT 'ANNUALLY'::public."enum_climate_indicators_updateFrequency",
    "targetValue" numeric(15,4),
    "targetYear" integer,
    "isActive" boolean DEFAULT true,
    "displayOrder" integer DEFAULT 0,
    metadata jsonb DEFAULT '{}'::jsonb,
    "createdById" uuid,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public.climate_indicators OWNER TO yvesmpunga;

--
-- Name: COLUMN climate_indicators."dataSource"; Type: COMMENT; Schema: public; Owner: yvesmpunga
--

COMMENT ON COLUMN public.climate_indicators."dataSource" IS 'Ex: Banque Mondiale, FMI, ANAPI';


--
-- Name: contract_types; Type: TABLE; Schema: public; Owner: yvesmpunga
--

CREATE TABLE public.contract_types (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    code character varying(20) NOT NULL,
    name character varying(100) NOT NULL,
    description text,
    "defaultDuration" integer,
    "alertDays" jsonb DEFAULT '[30, 60, 90]'::jsonb,
    "requiredFields" jsonb DEFAULT '[]'::jsonb,
    template text,
    "sortOrder" integer DEFAULT 0,
    "isActive" boolean DEFAULT true,
    "createdAt" timestamp with time zone DEFAULT now(),
    "updatedAt" timestamp with time zone DEFAULT now()
);


ALTER TABLE public.contract_types OWNER TO yvesmpunga;

--
-- Name: contracts; Type: TABLE; Schema: public; Owner: yvesmpunga
--

CREATE TABLE public.contracts (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    "contractNumber" character varying(50) NOT NULL,
    title character varying(255) NOT NULL,
    "typeId" uuid NOT NULL,
    "domainId" uuid,
    parties jsonb DEFAULT '[]'::jsonb NOT NULL,
    object text,
    description text,
    "signatureDate" date,
    "startDate" date NOT NULL,
    "endDate" date,
    "renewalDate" date,
    value numeric(18,2),
    currency character varying(3) DEFAULT 'USD'::character varying,
    "paymentTerms" text,
    obligations jsonb DEFAULT '[]'::jsonb,
    "filePath" character varying(500),
    "fileName" character varying(255),
    "fileSize" integer,
    annexes jsonb DEFAULT '[]'::jsonb,
    status character varying(20) DEFAULT 'DRAFT'::character varying,
    "alertDays" jsonb DEFAULT '[30, 60, 90]'::jsonb,
    "lastAlertSent" date,
    "isRenewable" boolean DEFAULT true,
    "renewalTerms" text,
    "previousContractId" uuid,
    "createdById" text,
    "updatedById" text,
    "createdAt" timestamp with time zone DEFAULT now(),
    "updatedAt" timestamp with time zone DEFAULT now(),
    "renewalType" character varying(50) DEFAULT 'MANUAL'::character varying,
    "renewedFromId" uuid,
    "renewedToId" uuid,
    "renewedAt" timestamp with time zone,
    "renewedById" uuid,
    "renewalNotes" text,
    "alertEnabled" boolean DEFAULT true
);


ALTER TABLE public.contracts OWNER TO yvesmpunga;

--
-- Name: countries; Type: TABLE; Schema: public; Owner: yvesmpunga
--

CREATE TABLE public.countries (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    code character varying(2) NOT NULL,
    code3 character varying(3),
    name character varying(255) NOT NULL,
    name_fr character varying(255) NOT NULL,
    name_en character varying(255),
    nationality character varying(255),
    nationality_fr character varying(255),
    phone_code character varying(10),
    continent character varying(50),
    is_active boolean DEFAULT true,
    sort_order integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.countries OWNER TO yvesmpunga;

--
-- Name: currencies; Type: TABLE; Schema: public; Owner: yvesmpunga
--

CREATE TABLE public.currencies (
    id uuid NOT NULL,
    code character varying(3) NOT NULL,
    name character varying(255) NOT NULL,
    name_fr character varying(255) NOT NULL,
    name_en character varying(255),
    symbol character varying(10) NOT NULL,
    decimals integer DEFAULT 2,
    exchange_rate numeric(18,6) DEFAULT 1 NOT NULL,
    exchange_rate_date date,
    is_base_currency boolean DEFAULT false,
    is_active boolean DEFAULT true,
    sort_order integer DEFAULT 0,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


ALTER TABLE public.currencies OWNER TO yvesmpunga;

--
-- Name: COLUMN currencies.code; Type: COMMENT; Schema: public; Owner: yvesmpunga
--

COMMENT ON COLUMN public.currencies.code IS 'ISO 4217 currency code (USD, EUR, CDF)';


--
-- Name: COLUMN currencies.symbol; Type: COMMENT; Schema: public; Owner: yvesmpunga
--

COMMENT ON COLUMN public.currencies.symbol IS 'Currency symbol ($, €, FC)';


--
-- Name: COLUMN currencies.decimals; Type: COMMENT; Schema: public; Owner: yvesmpunga
--

COMMENT ON COLUMN public.currencies.decimals IS 'Number of decimal places';


--
-- Name: COLUMN currencies.exchange_rate; Type: COMMENT; Schema: public; Owner: yvesmpunga
--

COMMENT ON COLUMN public.currencies.exchange_rate IS 'Exchange rate relative to base currency (USD)';


--
-- Name: COLUMN currencies.exchange_rate_date; Type: COMMENT; Schema: public; Owner: yvesmpunga
--

COMMENT ON COLUMN public.currencies.exchange_rate_date IS 'Date of the exchange rate';


--
-- Name: COLUMN currencies.is_base_currency; Type: COMMENT; Schema: public; Owner: yvesmpunga
--

COMMENT ON COLUMN public.currencies.is_base_currency IS 'Is this the base currency for conversions';


--
-- Name: dialogue_participants; Type: TABLE; Schema: public; Owner: yvesmpunga
--

CREATE TABLE public.dialogue_participants (
    id uuid NOT NULL,
    "dialogueId" uuid NOT NULL,
    "participantType" public."enum_dialogue_participants_participantType" DEFAULT 'INVESTOR'::public."enum_dialogue_participants_participantType",
    name character varying(255) NOT NULL,
    title character varying(100),
    organization character varying(255),
    email character varying(255),
    phone character varying(50),
    "invitationStatus" public."enum_dialogue_participants_invitationStatus" DEFAULT 'PENDING'::public."enum_dialogue_participants_invitationStatus",
    attended boolean DEFAULT false,
    role public.enum_dialogue_participants_role DEFAULT 'PARTICIPANT'::public.enum_dialogue_participants_role,
    notes text,
    "investorId" uuid,
    "userId" uuid,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public.dialogue_participants OWNER TO yvesmpunga;

--
-- Name: COLUMN dialogue_participants.title; Type: COMMENT; Schema: public; Owner: yvesmpunga
--

COMMENT ON COLUMN public.dialogue_participants.title IS 'Titre/fonction';


--
-- Name: districts; Type: TABLE; Schema: public; Owner: yvesmpunga
--

CREATE TABLE public.districts (
    id uuid NOT NULL,
    code character varying(20) NOT NULL,
    name character varying(255) NOT NULL,
    name_fr character varying(255) NOT NULL,
    name_en character varying(255),
    name_pt character varying(255),
    name_es character varying(255),
    name_ar character varying(255),
    province_id uuid NOT NULL,
    chief_town character varying(255),
    population bigint,
    area numeric(12,2),
    latitude numeric(10,8),
    longitude numeric(11,8),
    description text,
    sort_order integer DEFAULT 0,
    is_active boolean DEFAULT true,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


ALTER TABLE public.districts OWNER TO yvesmpunga;

--
-- Name: COLUMN districts.chief_town; Type: COMMENT; Schema: public; Owner: yvesmpunga
--

COMMENT ON COLUMN public.districts.chief_town IS 'Chef-lieu du district';


--
-- Name: COLUMN districts.area; Type: COMMENT; Schema: public; Owner: yvesmpunga
--

COMMENT ON COLUMN public.districts.area IS 'Area in km2';


--
-- Name: dossier_documents; Type: TABLE; Schema: public; Owner: yvesmpunga
--

CREATE TABLE public.dossier_documents (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    "dossierId" uuid NOT NULL,
    name character varying(255) NOT NULL,
    description text,
    category character varying(50) DEFAULT 'OTHER'::character varying,
    "fileName" character varying(255) NOT NULL,
    "filePath" character varying(255) NOT NULL,
    "fileSize" integer,
    "mimeType" character varying(255),
    "uploadedById" uuid,
    "createdAt" timestamp with time zone DEFAULT now(),
    "updatedAt" timestamp with time zone DEFAULT now()
);


ALTER TABLE public.dossier_documents OWNER TO yvesmpunga;

--
-- Name: dossier_sectors; Type: TABLE; Schema: public; Owner: yvesmpunga
--

CREATE TABLE public.dossier_sectors (
    id uuid NOT NULL,
    "dossierId" uuid NOT NULL,
    "sectorId" uuid NOT NULL,
    "isPrimary" boolean DEFAULT false,
    note text,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public.dossier_sectors OWNER TO yvesmpunga;

--
-- Name: COLUMN dossier_sectors."isPrimary"; Type: COMMENT; Schema: public; Owner: yvesmpunga
--

COMMENT ON COLUMN public.dossier_sectors."isPrimary" IS 'Indique si c''est le secteur principal du dossier';


--
-- Name: COLUMN dossier_sectors.note; Type: COMMENT; Schema: public; Owner: yvesmpunga
--

COMMENT ON COLUMN public.dossier_sectors.note IS 'Note ou justification pour ce secteur';


--
-- Name: dossier_step_validations; Type: TABLE; Schema: public; Owner: yvesmpunga
--

CREATE TABLE public.dossier_step_validations (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    dossier_id uuid NOT NULL,
    step_number integer NOT NULL,
    step_name character varying(255),
    validated_by_id text,
    validated_by_name character varying(255),
    note text,
    validated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    status character varying(20) DEFAULT 'VALIDATED'::character varying,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.dossier_step_validations OWNER TO yvesmpunga;

--
-- Name: dossiers; Type: TABLE; Schema: public; Owner: yvesmpunga
--

CREATE TABLE public.dossiers (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    "dossierNumber" character varying(255) NOT NULL,
    "dossierType" character varying(50) NOT NULL,
    "investorId" uuid,
    "investorType" character varying(20) DEFAULT 'company'::character varying,
    "investorName" character varying(255) NOT NULL,
    rccm character varying(255),
    "idNat" character varying(255),
    nif character varying(255),
    "investorEmail" character varying(255) NOT NULL,
    "investorPhone" character varying(255) NOT NULL,
    "investorProvince" character varying(255),
    "investorCity" character varying(255),
    "investorAddress" text,
    "investorCountry" character varying(255) DEFAULT 'RDC'::character varying,
    "projectName" character varying(255) NOT NULL,
    "projectDescription" text,
    sector character varying(255) NOT NULL,
    "subSector" character varying(255),
    "projectProvince" character varying(255) NOT NULL,
    "projectCity" character varying(255),
    "projectAddress" text,
    "investmentAmount" numeric(18,2) NOT NULL,
    currency character varying(3) DEFAULT 'USD'::character varying,
    "directJobs" integer DEFAULT 0,
    "indirectJobs" integer DEFAULT 0,
    "startDate" date,
    "endDate" date,
    status character varying(50) DEFAULT 'DRAFT'::character varying,
    "currentStep" integer DEFAULT 1,
    "assignedToId" text,
    "assignedAt" timestamp with time zone,
    "submittedAt" timestamp with time zone,
    "reviewedAt" timestamp with time zone,
    "decisionDate" timestamp with time zone,
    "decisionNote" text,
    "createdById" text,
    "createdAt" timestamp with time zone DEFAULT now(),
    "updatedAt" timestamp with time zone DEFAULT now(),
    "ministryId" uuid,
    "investorProvinceId" text,
    "investorCityId" text,
    "projectProvinceId" text,
    "projectCityId" text,
    "investorCommuneId" text,
    "projectCommuneId" text,
    "investorCommune" text,
    "projectCommune" text,
    "representativeName" character varying(255),
    "representativeFunction" character varying(255),
    "representativePhone" character varying(255),
    "representativeEmail" character varying(255)
);


ALTER TABLE public.dossiers OWNER TO yvesmpunga;

--
-- Name: exchange_rate_history; Type: TABLE; Schema: public; Owner: yvesmpunga
--

CREATE TABLE public.exchange_rate_history (
    id uuid NOT NULL,
    currency_id uuid NOT NULL,
    rate numeric(18,6) NOT NULL,
    rate_date date NOT NULL,
    source character varying(255),
    created_by uuid,
    created_at timestamp with time zone NOT NULL
);


ALTER TABLE public.exchange_rate_history OWNER TO yvesmpunga;

--
-- Name: COLUMN exchange_rate_history.rate; Type: COMMENT; Schema: public; Owner: yvesmpunga
--

COMMENT ON COLUMN public.exchange_rate_history.rate IS 'Exchange rate relative to USD';


--
-- Name: COLUMN exchange_rate_history.source; Type: COMMENT; Schema: public; Owner: yvesmpunga
--

COMMENT ON COLUMN public.exchange_rate_history.source IS 'Source of the exchange rate (BCC, manual, API)';


--
-- Name: framework_agreement_suppliers; Type: TABLE; Schema: public; Owner: yvesmpunga
--

CREATE TABLE public.framework_agreement_suppliers (
    id uuid NOT NULL,
    agreement_id uuid NOT NULL,
    bidder_id uuid NOT NULL,
    rank integer DEFAULT 1,
    status public.enum_framework_agreement_suppliers_status DEFAULT 'ACTIVE'::public.enum_framework_agreement_suppliers_status,
    specific_discount numeric(5,2),
    specific_terms text,
    max_value numeric(18,2),
    used_value numeric(18,2) DEFAULT 0,
    orders_count integer DEFAULT 0,
    average_rating numeric(3,2),
    notes text,
    added_by_id character varying(255),
    added_at timestamp with time zone,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


ALTER TABLE public.framework_agreement_suppliers OWNER TO yvesmpunga;

--
-- Name: COLUMN framework_agreement_suppliers.rank; Type: COMMENT; Schema: public; Owner: yvesmpunga
--

COMMENT ON COLUMN public.framework_agreement_suppliers.rank IS 'Rang pour les accords en cascade';


--
-- Name: COLUMN framework_agreement_suppliers.specific_discount; Type: COMMENT; Schema: public; Owner: yvesmpunga
--

COMMENT ON COLUMN public.framework_agreement_suppliers.specific_discount IS 'Remise spécifique en %';


--
-- Name: framework_agreements; Type: TABLE; Schema: public; Owner: yvesmpunga
--

CREATE TABLE public.framework_agreements (
    id uuid NOT NULL,
    agreement_number character varying(100) NOT NULL,
    title character varying(500) NOT NULL,
    description text,
    tender_id uuid,
    ministry_id uuid,
    category public.enum_framework_agreements_category NOT NULL,
    sub_category character varying(255),
    type public.enum_framework_agreements_type DEFAULT 'SINGLE_SUPPLIER'::public.enum_framework_agreements_type,
    start_date timestamp with time zone NOT NULL,
    end_date timestamp with time zone NOT NULL,
    is_renewable boolean DEFAULT false,
    renewal_count integer DEFAULT 0,
    max_renewals integer DEFAULT 1,
    renewal_period_months integer DEFAULT 12,
    max_value numeric(18,2),
    min_order_value numeric(18,2),
    max_order_value numeric(18,2),
    used_value numeric(18,2) DEFAULT 0,
    currency character varying(10) DEFAULT 'USD'::character varying,
    max_quantity numeric(18,2),
    used_quantity numeric(18,2) DEFAULT 0,
    unit character varying(50),
    price_revision_clause text,
    price_revision_index character varying(255),
    delivery_terms text,
    payment_terms text,
    warranty_terms text,
    penalty_clause text,
    has_catalog boolean DEFAULT false,
    catalog_items json DEFAULT '[]'::json,
    status public.enum_framework_agreements_status DEFAULT 'DRAFT'::public.enum_framework_agreements_status,
    alert_days integer DEFAULT 30,
    alert_sent boolean DEFAULT false,
    notes text,
    signed_by_client_id character varying(255),
    signed_at timestamp with time zone,
    created_by_id character varying(255),
    approved_by_id character varying(255),
    approved_at timestamp with time zone,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


ALTER TABLE public.framework_agreements OWNER TO yvesmpunga;

--
-- Name: COLUMN framework_agreements.tender_id; Type: COMMENT; Schema: public; Owner: yvesmpunga
--

COMMENT ON COLUMN public.framework_agreements.tender_id IS 'Appel d''offres source';


--
-- Name: COLUMN framework_agreements.type; Type: COMMENT; Schema: public; Owner: yvesmpunga
--

COMMENT ON COLUMN public.framework_agreements.type IS 'Mono-attributaire, multi-attributaires, ou cascade';


--
-- Name: COLUMN framework_agreements.max_value; Type: COMMENT; Schema: public; Owner: yvesmpunga
--

COMMENT ON COLUMN public.framework_agreements.max_value IS 'Montant maximum de l''accord-cadre';


--
-- Name: COLUMN framework_agreements.catalog_items; Type: COMMENT; Schema: public; Owner: yvesmpunga
--

COMMENT ON COLUMN public.framework_agreements.catalog_items IS 'Articles du catalogue [{code, name, description, unit, price}]';


--
-- Name: COLUMN framework_agreements.alert_days; Type: COMMENT; Schema: public; Owner: yvesmpunga
--

COMMENT ON COLUMN public.framework_agreements.alert_days IS 'Jours avant expiration pour alerte';


--
-- Name: framework_orders; Type: TABLE; Schema: public; Owner: yvesmpunga
--

CREATE TABLE public.framework_orders (
    id uuid NOT NULL,
    order_number character varying(100) NOT NULL,
    agreement_id uuid NOT NULL,
    supplier_id uuid NOT NULL,
    bidder_id uuid NOT NULL,
    title character varying(500) NOT NULL,
    description text,
    items json DEFAULT '[]'::json,
    quantity numeric(18,2),
    unit character varying(50),
    unit_price numeric(18,2),
    total_value numeric(18,2) NOT NULL,
    currency character varying(10) DEFAULT 'USD'::character varying,
    order_date timestamp with time zone,
    expected_delivery_date timestamp with time zone,
    actual_delivery_date timestamp with time zone,
    delivery_location character varying(500),
    delivery_contact character varying(255),
    status public.enum_framework_orders_status DEFAULT 'DRAFT'::public.enum_framework_orders_status,
    received_quantity numeric(18,2) DEFAULT 0,
    reception_notes text,
    quality_status public.enum_framework_orders_quality_status,
    invoice_number character varying(100),
    invoice_date timestamp with time zone,
    paid_amount numeric(18,2) DEFAULT 0,
    payment_date timestamp with time zone,
    payment_status public.enum_framework_orders_payment_status DEFAULT 'PENDING'::public.enum_framework_orders_payment_status,
    notes text,
    requested_by_id character varying(255),
    approved_by_id character varying(255),
    approved_at timestamp with time zone,
    received_by_id character varying(255),
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


ALTER TABLE public.framework_orders OWNER TO yvesmpunga;

--
-- Name: COLUMN framework_orders.supplier_id; Type: COMMENT; Schema: public; Owner: yvesmpunga
--

COMMENT ON COLUMN public.framework_orders.supplier_id IS 'FrameworkAgreementSupplier ID';


--
-- Name: COLUMN framework_orders.items; Type: COMMENT; Schema: public; Owner: yvesmpunga
--

COMMENT ON COLUMN public.framework_orders.items IS 'Articles commandés [{code, name, quantity, unit, unitPrice, total}]';


--
-- Name: international_treaties; Type: TABLE; Schema: public; Owner: yvesmpunga
--

CREATE TABLE public.international_treaties (
    id uuid NOT NULL,
    reference character varying(50) NOT NULL,
    title character varying(500) NOT NULL,
    "shortTitle" character varying(100),
    description text,
    "treatyType" public."enum_international_treaties_treatyType" DEFAULT 'BIT'::public."enum_international_treaties_treatyType",
    status public.enum_international_treaties_status DEFAULT 'NEGOTIATING'::public.enum_international_treaties_status,
    "partnerCountries" jsonb DEFAULT '[]'::jsonb,
    "regionalOrganization" character varying(100),
    "negotiationStartDate" timestamp with time zone,
    "signedDate" timestamp with time zone,
    "ratifiedDate" timestamp with time zone,
    "entryIntoForceDate" timestamp with time zone,
    "expiryDate" timestamp with time zone,
    duration integer,
    "autoRenewal" boolean DEFAULT false,
    "renewalPeriod" integer,
    "keyProvisions" jsonb DEFAULT '[]'::jsonb,
    "investorBenefits" jsonb DEFAULT '[]'::jsonb,
    "coveredSectors" jsonb DEFAULT '[]'::jsonb,
    exclusions jsonb DEFAULT '[]'::jsonb,
    "disputeResolution" text,
    attachments jsonb DEFAULT '[]'::jsonb,
    "treatyTextUrl" character varying(500),
    notes text,
    "responsibleId" text,
    "createdById" text,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public.international_treaties OWNER TO yvesmpunga;

--
-- Name: COLUMN international_treaties."partnerCountries"; Type: COMMENT; Schema: public; Owner: yvesmpunga
--

COMMENT ON COLUMN public.international_treaties."partnerCountries" IS 'Liste des pays partenaires avec codes ISO';


--
-- Name: COLUMN international_treaties."regionalOrganization"; Type: COMMENT; Schema: public; Owner: yvesmpunga
--

COMMENT ON COLUMN public.international_treaties."regionalOrganization" IS 'SADC, COMESA, UA, etc.';


--
-- Name: COLUMN international_treaties."renewalPeriod"; Type: COMMENT; Schema: public; Owner: yvesmpunga
--

COMMENT ON COLUMN public.international_treaties."renewalPeriod" IS 'Période de renouvellement en années';


--
-- Name: COLUMN international_treaties."keyProvisions"; Type: COMMENT; Schema: public; Owner: yvesmpunga
--

COMMENT ON COLUMN public.international_treaties."keyProvisions" IS 'Dispositions principales du traité';


--
-- Name: investments; Type: TABLE; Schema: public; Owner: yvesmpunga
--

CREATE TABLE public.investments (
    id uuid NOT NULL,
    reference_number character varying(255) NOT NULL,
    project_name character varying(255) NOT NULL,
    description text,
    sector_id uuid NOT NULL,
    investor_id uuid NOT NULL,
    province_id uuid NOT NULL,
    amount numeric(18,2) NOT NULL,
    currency public.enum_investments_currency DEFAULT 'USD'::public.enum_investments_currency,
    jobs_created integer DEFAULT 0,
    status public.enum_investments_status DEFAULT 'draft'::public.enum_investments_status,
    submitted_at timestamp with time zone,
    approved_at timestamp with time zone,
    approved_by uuid,
    start_date date,
    end_date date,
    notes text,
    documents jsonb DEFAULT '[]'::jsonb,
    created_by uuid NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    city_id uuid
);


ALTER TABLE public.investments OWNER TO yvesmpunga;

--
-- Name: COLUMN investments.amount; Type: COMMENT; Schema: public; Owner: yvesmpunga
--

COMMENT ON COLUMN public.investments.amount IS 'Investment amount in USD';


--
-- Name: investments_projects; Type: TABLE; Schema: public; Owner: yvesmpunga
--

CREATE TABLE public.investments_projects (
    id uuid NOT NULL,
    "projectCode" character varying(255) NOT NULL,
    "projectName" character varying(255) NOT NULL,
    description text,
    "investorId" uuid,
    sector character varying(255),
    "subSector" character varying(255),
    province character varying(255),
    city character varying(255),
    address text,
    amount numeric(18,2) DEFAULT 0 NOT NULL,
    currency character varying(255) DEFAULT 'USD'::character varying,
    "jobsCreated" integer DEFAULT 0,
    "jobsIndirect" integer DEFAULT 0,
    "startDate" timestamp with time zone,
    "endDate" timestamp with time zone,
    status public.enum_investments_projects_status DEFAULT 'DRAFT'::public.enum_investments_projects_status,
    progress integer DEFAULT 0,
    "approvalDate" timestamp with time zone,
    "approvedBy" uuid,
    "rejectionDate" timestamp with time zone,
    "rejectedBy" uuid,
    "rejectionReason" text,
    "createdById" uuid,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public.investments_projects OWNER TO yvesmpunga;

--
-- Name: investors; Type: TABLE; Schema: public; Owner: yvesmpunga
--

CREATE TABLE public.investors (
    id uuid NOT NULL,
    type public.enum_investors_type DEFAULT 'company'::public.enum_investors_type NOT NULL,
    name character varying(255) NOT NULL,
    email character varying(255),
    phone character varying(255),
    country character varying(255) DEFAULT 'RDC'::character varying,
    address text,
    city character varying(255),
    website character varying(255),
    "investorCode" character varying(255) NOT NULL,
    category character varying(255),
    province character varying(255),
    "contactPerson" character varying(255),
    "contactPosition" character varying(255),
    "contactEmail" character varying(255),
    "contactPhone" character varying(255),
    rccm character varying(255),
    "idNat" character varying(255),
    nif character varying(255),
    status public.enum_investors_status DEFAULT 'PENDING'::public.enum_investors_status,
    "isVerified" boolean DEFAULT false,
    description text,
    "createdById" uuid,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public.investors OWNER TO yvesmpunga;

--
-- Name: COLUMN investors.country; Type: COMMENT; Schema: public; Owner: yvesmpunga
--

COMMENT ON COLUMN public.investors.country IS 'ISO 3166-1 alpha-3 country code';


--
-- Name: juridical_texts; Type: TABLE; Schema: public; Owner: yvesmpunga
--

CREATE TABLE public.juridical_texts (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    "documentNumber" character varying(50) NOT NULL,
    title character varying(255) NOT NULL,
    "typeId" uuid NOT NULL,
    "domainId" uuid,
    "officialReference" character varying(100),
    "journalOfficiel" character varying(50),
    "publicationDate" date,
    "effectiveDate" date,
    "expirationDate" date,
    summary text,
    content text,
    keywords jsonb DEFAULT '[]'::jsonb,
    tags jsonb DEFAULT '[]'::jsonb,
    "filePath" character varying(500),
    "fileName" character varying(255),
    "fileSize" integer,
    "mimeType" character varying(100),
    checksum character varying(64),
    version integer DEFAULT 1,
    "previousVersionId" uuid,
    "isCurrentVersion" boolean DEFAULT true,
    status character varying(20) DEFAULT 'DRAFT'::character varying,
    "modifiedById" uuid,
    "abrogatedById" uuid,
    "relatedDocuments" jsonb DEFAULT '[]'::jsonb,
    "createdById" text,
    "updatedById" text,
    "approvedById" text,
    "approvedAt" timestamp with time zone,
    "createdAt" timestamp with time zone DEFAULT now(),
    "updatedAt" timestamp with time zone DEFAULT now()
);


ALTER TABLE public.juridical_texts OWNER TO yvesmpunga;

--
-- Name: legal_alerts; Type: TABLE; Schema: public; Owner: yvesmpunga
--

CREATE TABLE public.legal_alerts (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    "alertNumber" character varying(50) NOT NULL,
    type character varying(30) NOT NULL,
    priority character varying(10) DEFAULT 'MEDIUM'::character varying,
    title character varying(255) NOT NULL,
    description text,
    "triggerDate" date,
    "dueDate" date,
    "contractId" uuid,
    "documentId" uuid,
    "assignedToId" text,
    "notifiedUsers" jsonb DEFAULT '[]'::jsonb,
    status character varying(20) DEFAULT 'PENDING'::character varying,
    actions jsonb DEFAULT '[]'::jsonb,
    "resolvedAt" timestamp with time zone,
    "resolvedById" text,
    "resolutionNote" text,
    "createdAt" timestamp with time zone DEFAULT now(),
    "updatedAt" timestamp with time zone DEFAULT now()
);


ALTER TABLE public.legal_alerts OWNER TO yvesmpunga;

--
-- Name: legal_document_types; Type: TABLE; Schema: public; Owner: yvesmpunga
--

CREATE TABLE public.legal_document_types (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    code character varying(20) NOT NULL,
    name character varying(100) NOT NULL,
    description text,
    category character varying(20) DEFAULT 'LEGISLATION'::character varying NOT NULL,
    "requiredFields" jsonb DEFAULT '[]'::jsonb,
    "allowedExtensions" jsonb DEFAULT '[".pdf", ".docx"]'::jsonb,
    "maxFileSize" integer DEFAULT 50,
    "retentionPeriod" integer,
    "requiresApproval" boolean DEFAULT false,
    "sortOrder" integer DEFAULT 0,
    "isActive" boolean DEFAULT true,
    "createdAt" timestamp with time zone DEFAULT now(),
    "updatedAt" timestamp with time zone DEFAULT now()
);


ALTER TABLE public.legal_document_types OWNER TO yvesmpunga;

--
-- Name: legal_domains; Type: TABLE; Schema: public; Owner: yvesmpunga
--

CREATE TABLE public.legal_domains (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    code character varying(20) NOT NULL,
    name character varying(100) NOT NULL,
    description text,
    "parentId" uuid,
    color character varying(7) DEFAULT '#3B82F6'::character varying,
    icon character varying(50) DEFAULT 'scale'::character varying,
    "sortOrder" integer DEFAULT 0,
    "isActive" boolean DEFAULT true,
    "createdAt" timestamp with time zone DEFAULT now(),
    "updatedAt" timestamp with time zone DEFAULT now()
);


ALTER TABLE public.legal_domains OWNER TO yvesmpunga;

--
-- Name: legal_proposals; Type: TABLE; Schema: public; Owner: yvesmpunga
--

CREATE TABLE public.legal_proposals (
    id uuid NOT NULL,
    reference character varying(50) NOT NULL,
    title character varying(255) NOT NULL,
    summary text NOT NULL,
    "fullText" text,
    "proposalType" public."enum_legal_proposals_proposalType" DEFAULT 'RECOMMENDATION'::public."enum_legal_proposals_proposalType",
    domain public.enum_legal_proposals_domain DEFAULT 'INVESTMENT_CODE'::public.enum_legal_proposals_domain,
    status public.enum_legal_proposals_status DEFAULT 'DRAFT'::public.enum_legal_proposals_status,
    priority public.enum_legal_proposals_priority DEFAULT 'MEDIUM'::public.enum_legal_proposals_priority,
    justification text,
    "expectedImpact" text,
    "targetedBarriers" jsonb DEFAULT '[]'::jsonb,
    "submittedAt" timestamp with time zone,
    "forwardedAt" timestamp with time zone,
    "adoptedAt" timestamp with time zone,
    "targetAuthority" character varying(255),
    feedback text,
    "feedbackDate" timestamp with time zone,
    attachments jsonb DEFAULT '[]'::jsonb,
    "internalNotes" text,
    "relatedTextId" uuid,
    "createdById" character varying(50),
    "approvedById" character varying(50),
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public.legal_proposals OWNER TO yvesmpunga;

--
-- Name: COLUMN legal_proposals.summary; Type: COMMENT; Schema: public; Owner: yvesmpunga
--

COMMENT ON COLUMN public.legal_proposals.summary IS 'Résumé de la proposition';


--
-- Name: COLUMN legal_proposals."fullText"; Type: COMMENT; Schema: public; Owner: yvesmpunga
--

COMMENT ON COLUMN public.legal_proposals."fullText" IS 'Texte complet de la proposition';


--
-- Name: COLUMN legal_proposals.justification; Type: COMMENT; Schema: public; Owner: yvesmpunga
--

COMMENT ON COLUMN public.legal_proposals.justification IS 'Justification et contexte';


--
-- Name: COLUMN legal_proposals."targetedBarriers"; Type: COMMENT; Schema: public; Owner: yvesmpunga
--

COMMENT ON COLUMN public.legal_proposals."targetedBarriers" IS 'Liste des obstacles que cette proposition vise à résoudre';


--
-- Name: mediation_cases; Type: TABLE; Schema: public; Owner: yvesmpunga
--

CREATE TABLE public.mediation_cases (
    id uuid NOT NULL,
    reference character varying(50) NOT NULL,
    title character varying(255) NOT NULL,
    description text NOT NULL,
    "disputeType" public."enum_mediation_cases_disputeType" DEFAULT 'ADMINISTRATIVE'::public."enum_mediation_cases_disputeType",
    status public.enum_mediation_cases_status DEFAULT 'SUBMITTED'::public.enum_mediation_cases_status,
    priority public.enum_mediation_cases_priority DEFAULT 'MEDIUM'::public.enum_mediation_cases_priority,
    "disputedAmount" numeric(15,2),
    currency character varying(3) DEFAULT 'USD'::character varying,
    "complainantType" public."enum_mediation_cases_complainantType" DEFAULT 'INVESTOR'::public."enum_mediation_cases_complainantType",
    "complainantName" character varying(255),
    "complainantContact" character varying(255),
    "respondentType" public."enum_mediation_cases_respondentType" DEFAULT 'MINISTRY'::public."enum_mediation_cases_respondentType",
    "respondentName" character varying(255),
    "respondentContact" character varying(255),
    "respondentOrganization" character varying(255),
    "submittedAt" timestamp with time zone,
    "acceptedAt" timestamp with time zone,
    "firstSessionAt" timestamp with time zone,
    "closedAt" timestamp with time zone,
    "sessionsCount" integer DEFAULT 0,
    outcome text,
    "agreementSummary" text,
    "complainantSatisfaction" integer,
    "respondentSatisfaction" integer,
    "internalNotes" text,
    attachments jsonb DEFAULT '[]'::jsonb,
    "investorId" uuid,
    "projectId" uuid,
    "barrierId" uuid,
    "mediatorId" character varying(50),
    "createdById" character varying(50),
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public.mediation_cases OWNER TO yvesmpunga;

--
-- Name: COLUMN mediation_cases."barrierId"; Type: COMMENT; Schema: public; Owner: yvesmpunga
--

COMMENT ON COLUMN public.mediation_cases."barrierId" IS 'Lien optionnel vers un obstacle signalé';


--
-- Name: message_attachments; Type: TABLE; Schema: public; Owner: yvesmpunga
--

CREATE TABLE public.message_attachments (
    id uuid NOT NULL,
    message_id uuid NOT NULL,
    filename character varying(255) NOT NULL,
    original_name character varying(255) NOT NULL,
    filepath character varying(500) NOT NULL,
    filetype character varying(100),
    filesize integer,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


ALTER TABLE public.message_attachments OWNER TO yvesmpunga;

--
-- Name: message_recipients; Type: TABLE; Schema: public; Owner: yvesmpunga
--

CREATE TABLE public.message_recipients (
    id uuid NOT NULL,
    message_id uuid NOT NULL,
    recipient_id uuid NOT NULL,
    recipient_type public.enum_message_recipients_recipient_type DEFAULT 'TO'::public.enum_message_recipients_recipient_type,
    read_at timestamp with time zone,
    is_deleted boolean DEFAULT false,
    deleted_at timestamp with time zone,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


ALTER TABLE public.message_recipients OWNER TO yvesmpunga;

--
-- Name: messages; Type: TABLE; Schema: public; Owner: yvesmpunga
--

CREATE TABLE public.messages (
    id uuid NOT NULL,
    subject character varying(255) NOT NULL,
    body text NOT NULL,
    priority public.enum_messages_priority DEFAULT 'NORMAL'::public.enum_messages_priority,
    sender_id text,
    is_deleted boolean DEFAULT false,
    deleted_at timestamp with time zone,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    message_type character varying(20) DEFAULT 'INTERNAL'::character varying,
    external_from character varying(255),
    external_to text,
    external_cc text,
    external_message_id character varying(255),
    sent_at timestamp without time zone,
    send_status character varying(20) DEFAULT 'PENDING'::character varying,
    send_error text
);


ALTER TABLE public.messages OWNER TO yvesmpunga;

--
-- Name: ministries; Type: TABLE; Schema: public; Owner: yvesmpunga
--

CREATE TABLE public.ministries (
    id uuid NOT NULL,
    code character varying(20) NOT NULL,
    name character varying(300) NOT NULL,
    "shortName" character varying(50),
    description text,
    address text,
    phone character varying(50),
    email character varying(200),
    website character varying(300),
    "contactPerson" character varying(200),
    "contactEmail" character varying(200),
    "contactPhone" character varying(50),
    "isActive" boolean DEFAULT true NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public.ministries OWNER TO yvesmpunga;

--
-- Name: COLUMN ministries."contactPerson"; Type: COMMENT; Schema: public; Owner: yvesmpunga
--

COMMENT ON COLUMN public.ministries."contactPerson" IS 'Point focal ANAPI';


--
-- Name: ministry_departments; Type: TABLE; Schema: public; Owner: yvesmpunga
--

CREATE TABLE public.ministry_departments (
    id uuid NOT NULL,
    code character varying(50) NOT NULL,
    name character varying(255) NOT NULL,
    description text,
    ministry_id uuid NOT NULL,
    head_name character varying(200),
    head_title character varying(100),
    phone character varying(50),
    email character varying(200),
    is_active boolean DEFAULT true,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


ALTER TABLE public.ministry_departments OWNER TO yvesmpunga;

--
-- Name: COLUMN ministry_departments.head_name; Type: COMMENT; Schema: public; Owner: yvesmpunga
--

COMMENT ON COLUMN public.ministry_departments.head_name IS 'Nom du responsable du département';


--
-- Name: COLUMN ministry_departments.head_title; Type: COMMENT; Schema: public; Owner: yvesmpunga
--

COMMENT ON COLUMN public.ministry_departments.head_title IS 'Titre du responsable (Directeur, Chef de service, etc.)';


--
-- Name: ministry_request_documents; Type: TABLE; Schema: public; Owner: yvesmpunga
--

CREATE TABLE public.ministry_request_documents (
    id uuid NOT NULL,
    "requestId" uuid NOT NULL,
    "documentType" character varying(255) NOT NULL,
    "documentName" character varying(255) NOT NULL,
    description text,
    "isRequired" boolean DEFAULT true,
    "requestedAtStep" integer,
    "requestedById" text,
    "requestedByName" character varying(255),
    "requestedAt" timestamp with time zone,
    "requestNote" text,
    status public.enum_ministry_request_documents_status DEFAULT 'PENDING'::public.enum_ministry_request_documents_status,
    "fileName" character varying(255),
    "fileUrl" character varying(255),
    "fileSize" integer,
    "mimeType" character varying(255),
    "uploadedAt" timestamp with time zone,
    "uploadedById" text,
    "uploadedByName" character varying(255),
    "validatedAt" timestamp with time zone,
    "validatedById" text,
    "validatedByName" character varying(255),
    "validationNote" text,
    "rejectionReason" text,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public.ministry_request_documents OWNER TO yvesmpunga;

--
-- Name: COLUMN ministry_request_documents."requestId"; Type: COMMENT; Schema: public; Owner: yvesmpunga
--

COMMENT ON COLUMN public.ministry_request_documents."requestId" IS 'Reference vers la demande';


--
-- Name: COLUMN ministry_request_documents."documentType"; Type: COMMENT; Schema: public; Owner: yvesmpunga
--

COMMENT ON COLUMN public.ministry_request_documents."documentType" IS 'Type de document (depuis la configuration)';


--
-- Name: COLUMN ministry_request_documents."documentName"; Type: COMMENT; Schema: public; Owner: yvesmpunga
--

COMMENT ON COLUMN public.ministry_request_documents."documentName" IS 'Nom du document requis';


--
-- Name: COLUMN ministry_request_documents."requestedAtStep"; Type: COMMENT; Schema: public; Owner: yvesmpunga
--

COMMENT ON COLUMN public.ministry_request_documents."requestedAtStep" IS 'Etape a laquelle le document a ete demande';


--
-- Name: COLUMN ministry_request_documents."requestedById"; Type: COMMENT; Schema: public; Owner: yvesmpunga
--

COMMENT ON COLUMN public.ministry_request_documents."requestedById" IS 'Agent qui a demande le document';


--
-- Name: COLUMN ministry_request_documents."requestNote"; Type: COMMENT; Schema: public; Owner: yvesmpunga
--

COMMENT ON COLUMN public.ministry_request_documents."requestNote" IS 'Note de demande de document';


--
-- Name: ministry_request_history; Type: TABLE; Schema: public; Owner: yvesmpunga
--

CREATE TABLE public.ministry_request_history (
    id uuid NOT NULL,
    "requestId" uuid NOT NULL,
    "stepNumber" integer NOT NULL,
    "stepName" character varying(255) NOT NULL,
    action public.enum_ministry_request_history_action NOT NULL,
    "previousStatus" character varying(255),
    "newStatus" character varying(255),
    comment text,
    "performedById" text,
    "performedByName" character varying(255),
    "createdAt" timestamp with time zone NOT NULL
);


ALTER TABLE public.ministry_request_history OWNER TO yvesmpunga;

--
-- Name: COLUMN ministry_request_history."requestId"; Type: COMMENT; Schema: public; Owner: yvesmpunga
--

COMMENT ON COLUMN public.ministry_request_history."requestId" IS 'Reference vers la demande';


--
-- Name: ministry_requests; Type: TABLE; Schema: public; Owner: yvesmpunga
--

CREATE TABLE public.ministry_requests (
    id uuid NOT NULL,
    "requestNumber" character varying(255) NOT NULL,
    "requestType" public."enum_ministry_requests_requestType" NOT NULL,
    "ministryId" uuid NOT NULL,
    "applicantType" public."enum_ministry_requests_applicantType" DEFAULT 'COMPANY'::public."enum_ministry_requests_applicantType",
    "applicantName" character varying(255) NOT NULL,
    "applicantEmail" character varying(255) NOT NULL,
    "applicantPhone" character varying(255) NOT NULL,
    "applicantAddress" text,
    rccm character varying(255),
    "idNat" character varying(255),
    nif character varying(255),
    subject character varying(255) NOT NULL,
    description text,
    sector character varying(255),
    province character varying(255),
    city character varying(255),
    "investmentAmount" numeric(18,2),
    currency character varying(3) DEFAULT 'USD'::character varying,
    status public.enum_ministry_requests_status DEFAULT 'DRAFT'::public.enum_ministry_requests_status,
    "currentStep" integer DEFAULT 1,
    "totalSteps" integer DEFAULT 1,
    priority public.enum_ministry_requests_priority DEFAULT 'NORMAL'::public.enum_ministry_requests_priority,
    "assignedToId" text,
    "assignedAt" timestamp with time zone,
    "submittedAt" timestamp with time zone,
    "lastStepAt" timestamp with time zone,
    "dueDate" timestamp with time zone,
    "decisionDate" timestamp with time zone,
    "decisionNote" text,
    "rejectionReason" text,
    "dossierId" uuid,
    "investorId" uuid,
    "createdById" text,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public.ministry_requests OWNER TO yvesmpunga;

--
-- Name: COLUMN ministry_requests."requestNumber"; Type: COMMENT; Schema: public; Owner: yvesmpunga
--

COMMENT ON COLUMN public.ministry_requests."requestNumber" IS 'Numero unique (AUT-2025-00001, LIC-2025-00001, PER-2025-00001)';


--
-- Name: COLUMN ministry_requests."ministryId"; Type: COMMENT; Schema: public; Owner: yvesmpunga
--

COMMENT ON COLUMN public.ministry_requests."ministryId" IS 'Ministere de tutelle';


--
-- Name: COLUMN ministry_requests.subject; Type: COMMENT; Schema: public; Owner: yvesmpunga
--

COMMENT ON COLUMN public.ministry_requests.subject IS 'Objet de la demande';


--
-- Name: COLUMN ministry_requests."assignedToId"; Type: COMMENT; Schema: public; Owner: yvesmpunga
--

COMMENT ON COLUMN public.ministry_requests."assignedToId" IS 'Agent traitant du ministere';


--
-- Name: COLUMN ministry_requests."lastStepAt"; Type: COMMENT; Schema: public; Owner: yvesmpunga
--

COMMENT ON COLUMN public.ministry_requests."lastStepAt" IS 'Date du dernier changement d''etape';


--
-- Name: COLUMN ministry_requests."dueDate"; Type: COMMENT; Schema: public; Owner: yvesmpunga
--

COMMENT ON COLUMN public.ministry_requests."dueDate" IS 'Date limite de traitement';


--
-- Name: COLUMN ministry_requests."dossierId"; Type: COMMENT; Schema: public; Owner: yvesmpunga
--

COMMENT ON COLUMN public.ministry_requests."dossierId" IS 'Reference vers le dossier ANAPI si applicable';


--
-- Name: ministry_workflows; Type: TABLE; Schema: public; Owner: yvesmpunga
--

CREATE TABLE public.ministry_workflows (
    id uuid NOT NULL,
    "ministryId" uuid NOT NULL,
    "requestType" public."enum_ministry_workflows_requestType" NOT NULL,
    "stepNumber" integer NOT NULL,
    "stepName" character varying(255) NOT NULL,
    "stepDescription" text,
    "responsibleRole" character varying(255),
    "estimatedDays" integer DEFAULT 3,
    "requiredDocuments" jsonb DEFAULT '[]'::jsonb,
    "isActive" boolean DEFAULT true,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public.ministry_workflows OWNER TO yvesmpunga;

--
-- Name: COLUMN ministry_workflows."ministryId"; Type: COMMENT; Schema: public; Owner: yvesmpunga
--

COMMENT ON COLUMN public.ministry_workflows."ministryId" IS 'Reference vers le ministere';


--
-- Name: COLUMN ministry_workflows."requestType"; Type: COMMENT; Schema: public; Owner: yvesmpunga
--

COMMENT ON COLUMN public.ministry_workflows."requestType" IS 'Type de demande';


--
-- Name: COLUMN ministry_workflows."stepNumber"; Type: COMMENT; Schema: public; Owner: yvesmpunga
--

COMMENT ON COLUMN public.ministry_workflows."stepNumber" IS 'Numero de l''etape dans le workflow';


--
-- Name: COLUMN ministry_workflows."stepName"; Type: COMMENT; Schema: public; Owner: yvesmpunga
--

COMMENT ON COLUMN public.ministry_workflows."stepName" IS 'Nom de l''etape (ex: Reception, Verification, Validation)';


--
-- Name: COLUMN ministry_workflows."stepDescription"; Type: COMMENT; Schema: public; Owner: yvesmpunga
--

COMMENT ON COLUMN public.ministry_workflows."stepDescription" IS 'Description detaillee de l''etape';


--
-- Name: COLUMN ministry_workflows."responsibleRole"; Type: COMMENT; Schema: public; Owner: yvesmpunga
--

COMMENT ON COLUMN public.ministry_workflows."responsibleRole" IS 'Role responsable de cette etape';


--
-- Name: COLUMN ministry_workflows."estimatedDays"; Type: COMMENT; Schema: public; Owner: yvesmpunga
--

COMMENT ON COLUMN public.ministry_workflows."estimatedDays" IS 'Duree estimee en jours';


--
-- Name: COLUMN ministry_workflows."requiredDocuments"; Type: COMMENT; Schema: public; Owner: yvesmpunga
--

COMMENT ON COLUMN public.ministry_workflows."requiredDocuments" IS 'Liste des documents requis pour cette etape';


--
-- Name: opportunity_applications; Type: TABLE; Schema: public; Owner: yvesmpunga
--

CREATE TABLE public.opportunity_applications (
    id uuid NOT NULL,
    reference character varying(50) NOT NULL,
    "opportunityId" uuid NOT NULL,
    "investorId" uuid NOT NULL,
    "proposedAmount" numeric(20,2),
    "proposedJobs" integer,
    motivation text,
    experience text,
    timeline character varying(500),
    status public.enum_opportunity_applications_status DEFAULT 'DRAFT'::public.enum_opportunity_applications_status NOT NULL,
    "submittedAt" timestamp with time zone,
    "reviewedAt" timestamp with time zone,
    "reviewedById" uuid,
    "reviewNotes" text,
    score integer,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public.opportunity_applications OWNER TO yvesmpunga;

--
-- Name: COLUMN opportunity_applications.reference; Type: COMMENT; Schema: public; Owner: yvesmpunga
--

COMMENT ON COLUMN public.opportunity_applications.reference IS 'Reference unique de la candidature (ex: CAND-2026-001)';


--
-- Name: COLUMN opportunity_applications."opportunityId"; Type: COMMENT; Schema: public; Owner: yvesmpunga
--

COMMENT ON COLUMN public.opportunity_applications."opportunityId" IS 'Opportunite concernee';


--
-- Name: COLUMN opportunity_applications."investorId"; Type: COMMENT; Schema: public; Owner: yvesmpunga
--

COMMENT ON COLUMN public.opportunity_applications."investorId" IS 'Investisseur candidat';


--
-- Name: COLUMN opportunity_applications."proposedAmount"; Type: COMMENT; Schema: public; Owner: yvesmpunga
--

COMMENT ON COLUMN public.opportunity_applications."proposedAmount" IS 'Montant d''investissement propose (USD)';


--
-- Name: COLUMN opportunity_applications."proposedJobs"; Type: COMMENT; Schema: public; Owner: yvesmpunga
--

COMMENT ON COLUMN public.opportunity_applications."proposedJobs" IS 'Nombre d''emplois proposes';


--
-- Name: COLUMN opportunity_applications.motivation; Type: COMMENT; Schema: public; Owner: yvesmpunga
--

COMMENT ON COLUMN public.opportunity_applications.motivation IS 'Lettre de motivation / presentation';


--
-- Name: COLUMN opportunity_applications.experience; Type: COMMENT; Schema: public; Owner: yvesmpunga
--

COMMENT ON COLUMN public.opportunity_applications.experience IS 'Experience pertinente de l''investisseur';


--
-- Name: COLUMN opportunity_applications.timeline; Type: COMMENT; Schema: public; Owner: yvesmpunga
--

COMMENT ON COLUMN public.opportunity_applications.timeline IS 'Calendrier propose pour le projet';


--
-- Name: COLUMN opportunity_applications.status; Type: COMMENT; Schema: public; Owner: yvesmpunga
--

COMMENT ON COLUMN public.opportunity_applications.status IS 'Statut de la candidature';


--
-- Name: COLUMN opportunity_applications."submittedAt"; Type: COMMENT; Schema: public; Owner: yvesmpunga
--

COMMENT ON COLUMN public.opportunity_applications."submittedAt" IS 'Date de soumission';


--
-- Name: COLUMN opportunity_applications."reviewedAt"; Type: COMMENT; Schema: public; Owner: yvesmpunga
--

COMMENT ON COLUMN public.opportunity_applications."reviewedAt" IS 'Date de revision';


--
-- Name: COLUMN opportunity_applications."reviewedById"; Type: COMMENT; Schema: public; Owner: yvesmpunga
--

COMMENT ON COLUMN public.opportunity_applications."reviewedById" IS 'Agent qui a examine la candidature';


--
-- Name: COLUMN opportunity_applications."reviewNotes"; Type: COMMENT; Schema: public; Owner: yvesmpunga
--

COMMENT ON COLUMN public.opportunity_applications."reviewNotes" IS 'Notes de l''agent sur la candidature';


--
-- Name: COLUMN opportunity_applications.score; Type: COMMENT; Schema: public; Owner: yvesmpunga
--

COMMENT ON COLUMN public.opportunity_applications.score IS 'Score d''evaluation (0-100)';


--
-- Name: opportunity_documents; Type: TABLE; Schema: public; Owner: yvesmpunga
--

CREATE TABLE public.opportunity_documents (
    id uuid NOT NULL,
    "opportunityId" uuid NOT NULL,
    name character varying(200) NOT NULL,
    description text,
    "isRequired" boolean DEFAULT true NOT NULL,
    category public.enum_opportunity_documents_category DEFAULT 'OTHER'::public.enum_opportunity_documents_category NOT NULL,
    "templateUrl" character varying(500),
    "maxFileSize" integer DEFAULT 10485760,
    "allowedFormats" character varying(200) DEFAULT 'pdf,doc,docx'::character varying,
    "sortOrder" integer DEFAULT 0 NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public.opportunity_documents OWNER TO yvesmpunga;

--
-- Name: COLUMN opportunity_documents."opportunityId"; Type: COMMENT; Schema: public; Owner: yvesmpunga
--

COMMENT ON COLUMN public.opportunity_documents."opportunityId" IS 'Opportunite concernee';


--
-- Name: COLUMN opportunity_documents.name; Type: COMMENT; Schema: public; Owner: yvesmpunga
--

COMMENT ON COLUMN public.opportunity_documents.name IS 'Nom du document requis';


--
-- Name: COLUMN opportunity_documents.description; Type: COMMENT; Schema: public; Owner: yvesmpunga
--

COMMENT ON COLUMN public.opportunity_documents.description IS 'Description du document';


--
-- Name: COLUMN opportunity_documents."isRequired"; Type: COMMENT; Schema: public; Owner: yvesmpunga
--

COMMENT ON COLUMN public.opportunity_documents."isRequired" IS 'Document obligatoire ou optionnel';


--
-- Name: COLUMN opportunity_documents.category; Type: COMMENT; Schema: public; Owner: yvesmpunga
--

COMMENT ON COLUMN public.opportunity_documents.category IS 'Categorie du document';


--
-- Name: COLUMN opportunity_documents."templateUrl"; Type: COMMENT; Schema: public; Owner: yvesmpunga
--

COMMENT ON COLUMN public.opportunity_documents."templateUrl" IS 'URL du modele de document a telecharger';


--
-- Name: COLUMN opportunity_documents."maxFileSize"; Type: COMMENT; Schema: public; Owner: yvesmpunga
--

COMMENT ON COLUMN public.opportunity_documents."maxFileSize" IS 'Taille maximale du fichier en octets';


--
-- Name: COLUMN opportunity_documents."allowedFormats"; Type: COMMENT; Schema: public; Owner: yvesmpunga
--

COMMENT ON COLUMN public.opportunity_documents."allowedFormats" IS 'Formats de fichiers acceptes';


--
-- Name: COLUMN opportunity_documents."sortOrder"; Type: COMMENT; Schema: public; Owner: yvesmpunga
--

COMMENT ON COLUMN public.opportunity_documents."sortOrder" IS 'Ordre d''affichage';


--
-- Name: overtimes; Type: TABLE; Schema: public; Owner: yvesmpunga
--

CREATE TABLE public.overtimes (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    employee_id uuid NOT NULL,
    date date NOT NULL,
    start_time time without time zone NOT NULL,
    end_time time without time zone NOT NULL,
    hours numeric(5,2) NOT NULL,
    type character varying(20) DEFAULT 'REGULAR'::character varying,
    rate numeric(5,2) DEFAULT 1.5,
    reason text NOT NULL,
    project character varying(255),
    request_date timestamp without time zone DEFAULT now(),
    is_pre_approved boolean DEFAULT false,
    status character varying(20) DEFAULT 'PENDING'::character varying,
    compensation_type character varying(20) DEFAULT 'PAYMENT'::character varying,
    compensation_amount numeric(18,2),
    compensation_hours numeric(5,2),
    currency character varying(10) DEFAULT 'USD'::character varying,
    is_paid boolean DEFAULT false,
    paid_amount numeric(18,2),
    paid_at timestamp without time zone,
    payslip_id uuid,
    notes text,
    rejection_reason text,
    requested_by_id character varying(255),
    approved_by_id character varying(255),
    approved_at timestamp without time zone,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.overtimes OWNER TO yvesmpunga;

--
-- Name: permissions; Type: TABLE; Schema: public; Owner: yvesmpunga
--

CREATE TABLE public.permissions (
    id uuid NOT NULL,
    code character varying(100) NOT NULL,
    name character varying(255) NOT NULL,
    name_fr character varying(255) NOT NULL,
    name_en character varying(255),
    description text,
    module character varying(50) NOT NULL,
    action public.enum_permissions_action NOT NULL,
    is_active boolean DEFAULT true,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


ALTER TABLE public.permissions OWNER TO yvesmpunga;

--
-- Name: COLUMN permissions.code; Type: COMMENT; Schema: public; Owner: yvesmpunga
--

COMMENT ON COLUMN public.permissions.code IS 'Permission code (e.g., investments.create, users.view)';


--
-- Name: COLUMN permissions.module; Type: COMMENT; Schema: public; Owner: yvesmpunga
--

COMMENT ON COLUMN public.permissions.module IS 'Module name (investments, users, settings, etc.)';


--
-- Name: pieces_requises; Type: TABLE; Schema: public; Owner: yvesmpunga
--

CREATE TABLE public.pieces_requises (
    id uuid NOT NULL,
    "acteId" uuid NOT NULL,
    name character varying(200) NOT NULL,
    description text,
    category public.enum_pieces_requises_category DEFAULT 'AUTRE'::public.enum_pieces_requises_category NOT NULL,
    "isRequired" boolean DEFAULT true NOT NULL,
    "acceptedFormats" character varying(100) DEFAULT 'PDF,JPG,PNG'::character varying,
    "maxSizeMB" integer DEFAULT 10,
    "templateUrl" character varying(500),
    "templateName" character varying(200),
    "orderIndex" integer DEFAULT 0 NOT NULL,
    "validityMonths" integer,
    instructions text,
    "isActive" boolean DEFAULT true NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public.pieces_requises OWNER TO yvesmpunga;

--
-- Name: COLUMN pieces_requises.description; Type: COMMENT; Schema: public; Owner: yvesmpunga
--

COMMENT ON COLUMN public.pieces_requises.description IS 'Description ou precisions sur le document';


--
-- Name: COLUMN pieces_requises."isRequired"; Type: COMMENT; Schema: public; Owner: yvesmpunga
--

COMMENT ON COLUMN public.pieces_requises."isRequired" IS 'Obligatoire ou optionnel';


--
-- Name: COLUMN pieces_requises."acceptedFormats"; Type: COMMENT; Schema: public; Owner: yvesmpunga
--

COMMENT ON COLUMN public.pieces_requises."acceptedFormats" IS 'Formats acceptes separes par virgule';


--
-- Name: COLUMN pieces_requises."maxSizeMB"; Type: COMMENT; Schema: public; Owner: yvesmpunga
--

COMMENT ON COLUMN public.pieces_requises."maxSizeMB" IS 'Taille max en MB';


--
-- Name: COLUMN pieces_requises."templateUrl"; Type: COMMENT; Schema: public; Owner: yvesmpunga
--

COMMENT ON COLUMN public.pieces_requises."templateUrl" IS 'URL du modele a telecharger';


--
-- Name: COLUMN pieces_requises."templateName"; Type: COMMENT; Schema: public; Owner: yvesmpunga
--

COMMENT ON COLUMN public.pieces_requises."templateName" IS 'Nom du fichier modele';


--
-- Name: COLUMN pieces_requises."orderIndex"; Type: COMMENT; Schema: public; Owner: yvesmpunga
--

COMMENT ON COLUMN public.pieces_requises."orderIndex" IS 'Ordre d''affichage';


--
-- Name: COLUMN pieces_requises."validityMonths"; Type: COMMENT; Schema: public; Owner: yvesmpunga
--

COMMENT ON COLUMN public.pieces_requises."validityMonths" IS 'Duree de validite du document en mois';


--
-- Name: COLUMN pieces_requises.instructions; Type: COMMENT; Schema: public; Owner: yvesmpunga
--

COMMENT ON COLUMN public.pieces_requises.instructions IS 'Instructions specifiques pour ce document';


--
-- Name: procurement_bid_documents; Type: TABLE; Schema: public; Owner: yvesmpunga
--

CREATE TABLE public.procurement_bid_documents (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    bid_id uuid,
    document_type_id uuid,
    category character varying(50) DEFAULT 'ADMINISTRATIVE'::character varying,
    title character varying(500) NOT NULL,
    description text,
    filename character varying(255) NOT NULL,
    original_name character varying(255),
    filepath character varying(500) NOT NULL,
    filetype character varying(100),
    filesize integer,
    is_compliant boolean,
    compliance_notes text,
    checked_by_id uuid,
    checked_at timestamp without time zone,
    uploaded_by_id uuid,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.procurement_bid_documents OWNER TO yvesmpunga;

--
-- Name: procurement_bidder_documents; Type: TABLE; Schema: public; Owner: yvesmpunga
--

CREATE TABLE public.procurement_bidder_documents (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    bidder_id uuid,
    document_type_id uuid,
    title character varying(500) NOT NULL,
    description text,
    filename character varying(255) NOT NULL,
    original_name character varying(255),
    filepath character varying(500) NOT NULL,
    filetype character varying(100),
    filesize integer,
    expiry_date date,
    is_verified boolean DEFAULT false,
    verified_by_id uuid,
    verified_at timestamp without time zone,
    uploaded_by_id uuid,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.procurement_bidder_documents OWNER TO yvesmpunga;

--
-- Name: procurement_bidders; Type: TABLE; Schema: public; Owner: yvesmpunga
--

CREATE TABLE public.procurement_bidders (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    code character varying(50) NOT NULL,
    company_name character varying(500) NOT NULL,
    trade_name character varying(255),
    legal_form character varying(100),
    rccm character varying(100),
    idnat character varying(100),
    nif character varying(100),
    niss character varying(100),
    capital_social numeric(18,2),
    currency character varying(10) DEFAULT 'USD'::character varying,
    founding_date date,
    country_id character varying(50),
    province_id character varying(50),
    city_id character varying(50),
    address text,
    postal_code character varying(20),
    phone character varying(50),
    phone2 character varying(50),
    fax character varying(50),
    email character varying(255),
    website character varying(255),
    contact_person character varying(255),
    contact_title character varying(100),
    contact_phone character varying(50),
    contact_email character varying(255),
    bank_name character varying(255),
    bank_account_number character varying(100),
    bank_swift_code character varying(50),
    main_activity text,
    sectors jsonb,
    employee_count integer,
    annual_revenue numeric(18,2),
    certifications jsonb,
    status character varying(50) DEFAULT 'ACTIVE'::character varying,
    blacklist_reason text,
    blacklist_start_date date,
    blacklist_end_date date,
    blacklisted_by_id uuid,
    rating numeric(3,2),
    total_contracts_won integer DEFAULT 0,
    total_contracts_value numeric(18,2) DEFAULT 0,
    logo character varying(500),
    notes text,
    created_by_id uuid,
    verified_by_id uuid,
    verified_at timestamp without time zone,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.procurement_bidders OWNER TO yvesmpunga;

--
-- Name: procurement_bids; Type: TABLE; Schema: public; Owner: yvesmpunga
--

CREATE TABLE public.procurement_bids (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    tender_id uuid,
    bidder_id uuid,
    lot_id uuid,
    reference character varying(100) NOT NULL,
    submission_date timestamp without time zone DEFAULT now(),
    financial_offer numeric(18,2),
    currency character varying(10) DEFAULT 'USD'::character varying,
    technical_proposal text,
    delivery_time integer,
    delivery_unit character varying(20) DEFAULT 'DAYS'::character varying,
    validity_period integer,
    guarantee_provided boolean DEFAULT false,
    guarantee_amount numeric(18,2),
    guarantee_reference character varying(255),
    guarantee_expiry_date date,
    status character varying(50) DEFAULT 'RECEIVED'::character varying,
    administrative_score numeric(5,2),
    administrative_status character varying(50) DEFAULT 'PENDING'::character varying,
    administrative_notes text,
    technical_score numeric(5,2),
    technical_details jsonb,
    technical_notes text,
    financial_score numeric(5,2),
    financial_details jsonb,
    financial_notes text,
    total_score numeric(5,2),
    ranking integer,
    rejection_reason text,
    disqualification_reason text,
    evaluated_by_id uuid,
    evaluation_date timestamp without time zone,
    received_by_id uuid,
    notes text,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.procurement_bids OWNER TO yvesmpunga;

--
-- Name: procurement_contract_documents; Type: TABLE; Schema: public; Owner: yvesmpunga
--

CREATE TABLE public.procurement_contract_documents (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    contract_id uuid,
    execution_id uuid,
    document_type_id uuid,
    category character varying(50) DEFAULT 'CONTRACT'::character varying,
    title character varying(500) NOT NULL,
    description text,
    filename character varying(255) NOT NULL,
    original_name character varying(255),
    filepath character varying(500) NOT NULL,
    filetype character varying(100),
    filesize integer,
    version integer DEFAULT 1,
    is_signed boolean DEFAULT false,
    signed_at timestamp without time zone,
    uploaded_by_id uuid,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.procurement_contract_documents OWNER TO yvesmpunga;

--
-- Name: procurement_contract_executions; Type: TABLE; Schema: public; Owner: yvesmpunga
--

CREATE TABLE public.procurement_contract_executions (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    contract_id uuid,
    phase character varying(255) NOT NULL,
    description text,
    type character varying(50) DEFAULT 'MILESTONE'::character varying,
    planned_date date,
    actual_date date,
    status character varying(50) DEFAULT 'PLANNED'::character varying,
    progress_percent numeric(5,2),
    quantity_planned numeric(18,2),
    quantity_delivered numeric(18,2),
    unit character varying(50),
    amount_planned numeric(18,2),
    amount_paid numeric(18,2),
    currency character varying(10) DEFAULT 'USD'::character varying,
    payment_date date,
    payment_reference character varying(255),
    invoice_number character varying(100),
    invoice_date date,
    penalty_amount numeric(18,2),
    penalty_reason text,
    delay_days integer,
    quality_score numeric(5,2),
    quality_notes text,
    inspection_report text,
    inspected_by_id uuid,
    inspection_date date,
    approved_by_id uuid,
    approval_date date,
    created_by_id uuid,
    notes text,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.procurement_contract_executions OWNER TO yvesmpunga;

--
-- Name: procurement_contracts; Type: TABLE; Schema: public; Owner: yvesmpunga
--

CREATE TABLE public.procurement_contracts (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    tender_id uuid,
    bid_id uuid,
    bidder_id uuid,
    lot_id uuid,
    contract_number character varying(100) NOT NULL,
    title character varying(500) NOT NULL,
    description text,
    contract_value numeric(18,2) NOT NULL,
    currency character varying(10) DEFAULT 'USD'::character varying,
    signature_date date,
    effective_date date,
    start_date date,
    end_date date,
    delivery_deadline date,
    delivery_location character varying(500),
    status character varying(50) DEFAULT 'DRAFT'::character varying,
    performance_guarantee numeric(18,2),
    guarantee_reference character varying(255),
    guarantee_expiry_date date,
    advance_payment numeric(18,2),
    advance_payment_date date,
    retention_percentage numeric(5,2),
    payment_terms text,
    penalty_clause text,
    penalty_percentage_per_day numeric(5,2),
    max_penalty_percentage numeric(5,2),
    total_penalty_applied numeric(18,2) DEFAULT 0,
    progress_percent numeric(5,2) DEFAULT 0,
    total_paid numeric(18,2) DEFAULT 0,
    remaining_amount numeric(18,2),
    completion_date date,
    reception_date date,
    final_reception_date date,
    termination_reason text,
    termination_date date,
    ministry_id uuid,
    managed_by_id text,
    signed_by_client_id text,
    signed_by_contractor_name character varying(255),
    signed_by_contractor_title character varying(255),
    created_by_id text,
    is_archived boolean DEFAULT false,
    archived_at timestamp without time zone,
    certificate_number character varying(100),
    certificate_issued_at timestamp without time zone,
    certificate_issued_by_id text,
    notes text,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.procurement_contracts OWNER TO yvesmpunga;

--
-- Name: procurement_document_types; Type: TABLE; Schema: public; Owner: yvesmpunga
--

CREATE TABLE public.procurement_document_types (
    id uuid NOT NULL,
    code character varying(50) NOT NULL,
    name character varying(255) NOT NULL,
    description text,
    category public.enum_procurement_document_types_category DEFAULT 'TENDER'::public.enum_procurement_document_types_category,
    is_required boolean DEFAULT false,
    is_active boolean DEFAULT true,
    sort_order integer DEFAULT 0,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


ALTER TABLE public.procurement_document_types OWNER TO yvesmpunga;

--
-- Name: procurement_evaluation_committees; Type: TABLE; Schema: public; Owner: yvesmpunga
--

CREATE TABLE public.procurement_evaluation_committees (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    tender_id uuid,
    user_id uuid NOT NULL,
    role character varying(50) DEFAULT 'MEMBER'::character varying,
    specialization character varying(255),
    can_evaluate_technical boolean DEFAULT true,
    can_evaluate_financial boolean DEFAULT true,
    has_voting_right boolean DEFAULT true,
    nominated_by_id uuid,
    nomination_date timestamp without time zone,
    status character varying(50) DEFAULT 'ACTIVE'::character varying,
    recused_reason text,
    notes text,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.procurement_evaluation_committees OWNER TO yvesmpunga;

--
-- Name: procurement_tender_documents; Type: TABLE; Schema: public; Owner: yvesmpunga
--

CREATE TABLE public.procurement_tender_documents (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    tender_id uuid,
    document_type_id uuid,
    title character varying(500) NOT NULL,
    description text,
    filename character varying(255) NOT NULL,
    original_name character varying(255),
    filepath character varying(500) NOT NULL,
    filetype character varying(100),
    filesize integer,
    is_public boolean DEFAULT true,
    version integer DEFAULT 1,
    uploaded_by_id uuid,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.procurement_tender_documents OWNER TO yvesmpunga;

--
-- Name: procurement_tender_history; Type: TABLE; Schema: public; Owner: yvesmpunga
--

CREATE TABLE public.procurement_tender_history (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    tender_id uuid,
    action character varying(100) NOT NULL,
    previous_status character varying(50),
    new_status character varying(50),
    description text,
    metadata jsonb,
    performed_by_id uuid,
    ip_address character varying(50),
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.procurement_tender_history OWNER TO yvesmpunga;

--
-- Name: procurement_tender_lots; Type: TABLE; Schema: public; Owner: yvesmpunga
--

CREATE TABLE public.procurement_tender_lots (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    tender_id uuid,
    lot_number integer NOT NULL,
    title character varying(500) NOT NULL,
    description text,
    specifications text,
    quantity numeric(18,2),
    unit character varying(50),
    estimated_value numeric(18,2),
    awarded_value numeric(18,2),
    status character varying(50) DEFAULT 'OPEN'::character varying,
    awarded_bidder_id uuid,
    award_date timestamp without time zone,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.procurement_tender_lots OWNER TO yvesmpunga;

--
-- Name: procurement_tenders; Type: TABLE; Schema: public; Owner: yvesmpunga
--

CREATE TABLE public.procurement_tenders (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    reference character varying(100) NOT NULL,
    title character varying(500) NOT NULL,
    description text,
    objective text,
    products_or_services text,
    type character varying(50) DEFAULT 'OPEN'::character varying,
    category character varying(50) DEFAULT 'GOODS'::character varying,
    status character varying(50) DEFAULT 'DRAFT'::character varying,
    estimated_budget numeric(18,2),
    currency character varying(10) DEFAULT 'USD'::character varying,
    minimum_budget numeric(18,2),
    maximum_budget numeric(18,2),
    publish_date timestamp without time zone,
    submission_deadline timestamp without time zone,
    opening_date timestamp without time zone,
    evaluation_start_date timestamp without time zone,
    evaluation_end_date timestamp without time zone,
    award_date timestamp without time zone,
    contract_start_date timestamp without time zone,
    contract_end_date timestamp without time zone,
    delivery_deadline integer,
    delivery_unit character varying(20) DEFAULT 'DAYS'::character varying,
    delivery_location character varying(500),
    technical_criteria_weight numeric(5,2) DEFAULT 70.00,
    financial_criteria_weight numeric(5,2) DEFAULT 30.00,
    minimum_technical_score numeric(5,2) DEFAULT 70.00,
    eligibility_criteria text,
    technical_criteria jsonb,
    financial_criteria jsonb,
    guarantee_required boolean DEFAULT false,
    guarantee_percentage numeric(5,2),
    guarantee_type character varying(100),
    ministry_id uuid,
    department_id uuid,
    created_by_id uuid,
    approved_by_id uuid,
    approval_date timestamp without time zone,
    approval_notes text,
    cancellation_reason text,
    cancelled_by_id uuid,
    cancellation_date timestamp without time zone,
    is_archived boolean DEFAULT false,
    archived_at timestamp without time zone,
    archived_by_id uuid,
    fiscal_year integer,
    budget_line character varying(100),
    funding_source character varying(255),
    contact_name character varying(255),
    contact_email character varying(255),
    contact_phone character varying(50),
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.procurement_tenders OWNER TO yvesmpunga;

--
-- Name: project_documents; Type: TABLE; Schema: public; Owner: yvesmpunga
--

CREATE TABLE public.project_documents (
    id uuid NOT NULL,
    "projectId" uuid NOT NULL,
    name character varying(255) NOT NULL,
    "originalName" character varying(255) NOT NULL,
    description text,
    type public.enum_project_documents_type DEFAULT 'other'::public.enum_project_documents_type,
    category character varying(255),
    "mimeType" character varying(255) NOT NULL,
    size integer NOT NULL,
    path character varying(255) NOT NULL,
    url character varying(255),
    "uploadedById" uuid,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public.project_documents OWNER TO yvesmpunga;

--
-- Name: project_history; Type: TABLE; Schema: public; Owner: yvesmpunga
--

CREATE TABLE public.project_history (
    id uuid NOT NULL,
    "projectId" uuid NOT NULL,
    action public.enum_project_history_action NOT NULL,
    "previousStatus" character varying(255),
    "newStatus" character varying(255),
    "fieldChanged" character varying(255),
    "previousValue" text,
    "newValue" text,
    description text,
    metadata json DEFAULT '{}'::json,
    "performedById" text,
    "performedByName" character varying(255),
    "ipAddress" character varying(255),
    "createdAt" timestamp with time zone NOT NULL
);


ALTER TABLE public.project_history OWNER TO yvesmpunga;

--
-- Name: COLUMN project_history."projectId"; Type: COMMENT; Schema: public; Owner: yvesmpunga
--

COMMENT ON COLUMN public.project_history."projectId" IS 'Reference vers le projet Investment';


--
-- Name: COLUMN project_history."fieldChanged"; Type: COMMENT; Schema: public; Owner: yvesmpunga
--

COMMENT ON COLUMN public.project_history."fieldChanged" IS 'Nom du champ modifie';


--
-- Name: COLUMN project_history.description; Type: COMMENT; Schema: public; Owner: yvesmpunga
--

COMMENT ON COLUMN public.project_history.description IS 'Description de laction';


--
-- Name: COLUMN project_history.metadata; Type: COMMENT; Schema: public; Owner: yvesmpunga
--

COMMENT ON COLUMN public.project_history.metadata IS 'Donnees additionnelles (document info, etc.)';


--
-- Name: project_impacts; Type: TABLE; Schema: public; Owner: yvesmpunga
--

CREATE TABLE public.project_impacts (
    id uuid NOT NULL,
    project_id uuid NOT NULL,
    report_date timestamp with time zone NOT NULL,
    report_period character varying(50),
    direct_jobs_planned integer DEFAULT 0,
    direct_jobs_created integer DEFAULT 0,
    indirect_jobs_planned integer DEFAULT 0,
    indirect_jobs_created integer DEFAULT 0,
    permanent_jobs integer DEFAULT 0,
    temporary_jobs integer DEFAULT 0,
    local_jobs integer DEFAULT 0,
    female_jobs integer DEFAULT 0,
    youth_jobs integer DEFAULT 0,
    projected_revenue numeric(18,2) DEFAULT 0,
    actual_revenue numeric(18,2) DEFAULT 0,
    taxes_paid numeric(18,2) DEFAULT 0,
    local_purchases numeric(18,2) DEFAULT 0,
    export_revenue numeric(18,2) DEFAULT 0,
    currency character varying(10) DEFAULT 'USD'::character varying,
    trained_employees integer DEFAULT 0,
    training_hours integer DEFAULT 0,
    training_investment numeric(18,2) DEFAULT 0,
    community_investment numeric(18,2) DEFAULT 0,
    infrastructure_built json DEFAULT '[]'::json,
    beneficiaries integer DEFAULT 0,
    carbon_footprint numeric(10,2),
    renewable_energy_percent numeric(5,2),
    waste_recycled_percent numeric(5,2),
    water_usage numeric(18,2),
    environmental_measures json DEFAULT '[]'::json,
    technology_transfers json DEFAULT '[]'::json,
    patents_registered integer DEFAULT 0,
    local_partnerships integer DEFAULT 0,
    achievements text,
    challenges text,
    next_steps text,
    notes text,
    status public.enum_project_impacts_status DEFAULT 'DRAFT'::public.enum_project_impacts_status,
    verified_by_id character varying(255),
    verified_at timestamp with time zone,
    created_by_id character varying(255),
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


ALTER TABLE public.project_impacts OWNER TO yvesmpunga;

--
-- Name: COLUMN project_impacts.report_period; Type: COMMENT; Schema: public; Owner: yvesmpunga
--

COMMENT ON COLUMN public.project_impacts.report_period IS 'Ex: Q1 2025, Année 2024';


--
-- Name: COLUMN project_impacts.local_jobs; Type: COMMENT; Schema: public; Owner: yvesmpunga
--

COMMENT ON COLUMN public.project_impacts.local_jobs IS 'Emplois pour les résidents locaux';


--
-- Name: COLUMN project_impacts.youth_jobs; Type: COMMENT; Schema: public; Owner: yvesmpunga
--

COMMENT ON COLUMN public.project_impacts.youth_jobs IS 'Emplois pour les jeunes (18-35 ans)';


--
-- Name: COLUMN project_impacts.local_purchases; Type: COMMENT; Schema: public; Owner: yvesmpunga
--

COMMENT ON COLUMN public.project_impacts.local_purchases IS 'Achats auprès de fournisseurs locaux';


--
-- Name: COLUMN project_impacts.community_investment; Type: COMMENT; Schema: public; Owner: yvesmpunga
--

COMMENT ON COLUMN public.project_impacts.community_investment IS 'Investissements communautaires (écoles, hôpitaux, etc.)';


--
-- Name: COLUMN project_impacts.infrastructure_built; Type: COMMENT; Schema: public; Owner: yvesmpunga
--

COMMENT ON COLUMN public.project_impacts.infrastructure_built IS 'Infrastructures construites [{type, description, value}]';


--
-- Name: COLUMN project_impacts.beneficiaries; Type: COMMENT; Schema: public; Owner: yvesmpunga
--

COMMENT ON COLUMN public.project_impacts.beneficiaries IS 'Nombre de bénéficiaires directs dans la communauté';


--
-- Name: COLUMN project_impacts.carbon_footprint; Type: COMMENT; Schema: public; Owner: yvesmpunga
--

COMMENT ON COLUMN public.project_impacts.carbon_footprint IS 'Empreinte carbone en tonnes CO2';


--
-- Name: COLUMN project_impacts.water_usage; Type: COMMENT; Schema: public; Owner: yvesmpunga
--

COMMENT ON COLUMN public.project_impacts.water_usage IS 'Consommation d''eau en m³';


--
-- Name: COLUMN project_impacts.environmental_measures; Type: COMMENT; Schema: public; Owner: yvesmpunga
--

COMMENT ON COLUMN public.project_impacts.environmental_measures IS 'Mesures environnementales [{measure, status, impact}]';


--
-- Name: COLUMN project_impacts.technology_transfers; Type: COMMENT; Schema: public; Owner: yvesmpunga
--

COMMENT ON COLUMN public.project_impacts.technology_transfers IS 'Technologies transférées [{name, description, beneficiaries}]';


--
-- Name: project_milestones; Type: TABLE; Schema: public; Owner: yvesmpunga
--

CREATE TABLE public.project_milestones (
    id uuid NOT NULL,
    project_id uuid NOT NULL,
    name character varying(255) NOT NULL,
    description text,
    category public.enum_project_milestones_category DEFAULT 'OTHER'::public.enum_project_milestones_category,
    planned_start_date timestamp with time zone,
    planned_end_date timestamp with time zone NOT NULL,
    actual_start_date timestamp with time zone,
    actual_end_date timestamp with time zone,
    status public.enum_project_milestones_status DEFAULT 'NOT_STARTED'::public.enum_project_milestones_status,
    progress integer DEFAULT 0,
    budget numeric(18,2),
    actual_cost numeric(18,2),
    currency character varying(10) DEFAULT 'USD'::character varying,
    weight numeric(5,2) DEFAULT 0,
    deliverables json DEFAULT '[]'::json,
    dependencies json DEFAULT '[]'::json,
    responsible_name character varying(255),
    responsible_contact character varying(255),
    notes text,
    "order" integer DEFAULT 0,
    completed_by_id character varying(255),
    completed_at timestamp with time zone,
    created_by_id character varying(255),
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    priority character varying(20) DEFAULT 'MEDIUM'::character varying
);


ALTER TABLE public.project_milestones OWNER TO yvesmpunga;

--
-- Name: COLUMN project_milestones.weight; Type: COMMENT; Schema: public; Owner: yvesmpunga
--

COMMENT ON COLUMN public.project_milestones.weight IS 'Poids du jalon dans le calcul de progression globale (en %)';


--
-- Name: COLUMN project_milestones.deliverables; Type: COMMENT; Schema: public; Owner: yvesmpunga
--

COMMENT ON COLUMN public.project_milestones.deliverables IS 'Liste des livrables attendus [{name, description, status}]';


--
-- Name: COLUMN project_milestones.dependencies; Type: COMMENT; Schema: public; Owner: yvesmpunga
--

COMMENT ON COLUMN public.project_milestones.dependencies IS 'IDs des jalons prérequis';


--
-- Name: project_risks; Type: TABLE; Schema: public; Owner: yvesmpunga
--

CREATE TABLE public.project_risks (
    id uuid NOT NULL,
    project_id uuid NOT NULL,
    code character varying(50),
    title character varying(255) NOT NULL,
    description text,
    category public.enum_project_risks_category DEFAULT 'OTHER'::public.enum_project_risks_category,
    probability public.enum_project_risks_probability DEFAULT 'MEDIUM'::public.enum_project_risks_probability,
    impact public.enum_project_risks_impact DEFAULT 'MEDIUM'::public.enum_project_risks_impact,
    risk_score integer,
    risk_level public.enum_project_risks_risk_level,
    status public.enum_project_risks_status DEFAULT 'IDENTIFIED'::public.enum_project_risks_status,
    mitigation_strategy text,
    mitigation_actions json DEFAULT '[]'::json,
    contingency_plan text,
    estimated_cost numeric(18,2),
    mitigation_cost numeric(18,2),
    currency character varying(10) DEFAULT 'USD'::character varying,
    identified_date timestamp with time zone,
    review_date timestamp with time zone,
    next_review_date timestamp with time zone,
    resolved_date timestamp with time zone,
    owner_name character varying(255),
    owner_contact character varying(255),
    triggers json DEFAULT '[]'::json,
    notes text,
    created_by_id character varying(255),
    updated_by_id character varying(255),
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


ALTER TABLE public.project_risks OWNER TO yvesmpunga;

--
-- Name: COLUMN project_risks.risk_score; Type: COMMENT; Schema: public; Owner: yvesmpunga
--

COMMENT ON COLUMN public.project_risks.risk_score IS 'Score calculé: probability * impact (1-25)';


--
-- Name: COLUMN project_risks.mitigation_strategy; Type: COMMENT; Schema: public; Owner: yvesmpunga
--

COMMENT ON COLUMN public.project_risks.mitigation_strategy IS 'Stratégie d''atténuation du risque';


--
-- Name: COLUMN project_risks.mitigation_actions; Type: COMMENT; Schema: public; Owner: yvesmpunga
--

COMMENT ON COLUMN public.project_risks.mitigation_actions IS 'Actions de mitigation [{action, responsible, deadline, status}]';


--
-- Name: COLUMN project_risks.contingency_plan; Type: COMMENT; Schema: public; Owner: yvesmpunga
--

COMMENT ON COLUMN public.project_risks.contingency_plan IS 'Plan de contingence si le risque se réalise';


--
-- Name: COLUMN project_risks.estimated_cost; Type: COMMENT; Schema: public; Owner: yvesmpunga
--

COMMENT ON COLUMN public.project_risks.estimated_cost IS 'Coût estimé si le risque se réalise';


--
-- Name: COLUMN project_risks.mitigation_cost; Type: COMMENT; Schema: public; Owner: yvesmpunga
--

COMMENT ON COLUMN public.project_risks.mitigation_cost IS 'Coût des mesures de mitigation';


--
-- Name: COLUMN project_risks.owner_name; Type: COMMENT; Schema: public; Owner: yvesmpunga
--

COMMENT ON COLUMN public.project_risks.owner_name IS 'Responsable du suivi du risque';


--
-- Name: COLUMN project_risks.triggers; Type: COMMENT; Schema: public; Owner: yvesmpunga
--

COMMENT ON COLUMN public.project_risks.triggers IS 'Indicateurs de déclenchement du risque';


--
-- Name: province_opportunities; Type: TABLE; Schema: public; Owner: yvesmpunga
--

CREATE TABLE public.province_opportunities (
    id uuid NOT NULL,
    reference character varying(50) NOT NULL,
    title character varying(300) NOT NULL,
    description text,
    "provinceId" text NOT NULL,
    "sectorId" uuid,
    "minInvestment" numeric(20,2),
    "maxInvestment" numeric(20,2),
    "expectedJobs" integer,
    "projectDuration" character varying(100),
    location character varying(500),
    advantages text,
    requirements text,
    "contactName" character varying(200),
    "contactEmail" character varying(200),
    "contactPhone" character varying(50),
    deadline date,
    status public.enum_province_opportunities_status DEFAULT 'DRAFT'::public.enum_province_opportunities_status NOT NULL,
    priority public.enum_province_opportunities_priority DEFAULT 'MEDIUM'::public.enum_province_opportunities_priority NOT NULL,
    "isFeatured" boolean DEFAULT false NOT NULL,
    "viewsCount" integer DEFAULT 0 NOT NULL,
    "applicationsCount" integer DEFAULT 0 NOT NULL,
    "imageUrl" character varying(500),
    "publishedAt" timestamp with time zone,
    "closedAt" timestamp with time zone,
    "createdById" uuid,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public.province_opportunities OWNER TO yvesmpunga;

--
-- Name: COLUMN province_opportunities.reference; Type: COMMENT; Schema: public; Owner: yvesmpunga
--

COMMENT ON COLUMN public.province_opportunities.reference IS 'Reference unique de l''opportunite (ex: OPP-2026-001)';


--
-- Name: COLUMN province_opportunities.title; Type: COMMENT; Schema: public; Owner: yvesmpunga
--

COMMENT ON COLUMN public.province_opportunities.title IS 'Titre du projet d''investissement';


--
-- Name: COLUMN province_opportunities.description; Type: COMMENT; Schema: public; Owner: yvesmpunga
--

COMMENT ON COLUMN public.province_opportunities.description IS 'Description detaillee du projet';


--
-- Name: COLUMN province_opportunities."provinceId"; Type: COMMENT; Schema: public; Owner: yvesmpunga
--

COMMENT ON COLUMN public.province_opportunities."provinceId" IS 'Province qui propose l''opportunite';


--
-- Name: COLUMN province_opportunities."sectorId"; Type: COMMENT; Schema: public; Owner: yvesmpunga
--

COMMENT ON COLUMN public.province_opportunities."sectorId" IS 'Secteur d''activite';


--
-- Name: COLUMN province_opportunities."minInvestment"; Type: COMMENT; Schema: public; Owner: yvesmpunga
--

COMMENT ON COLUMN public.province_opportunities."minInvestment" IS 'Montant minimum d''investissement requis (USD)';


--
-- Name: COLUMN province_opportunities."maxInvestment"; Type: COMMENT; Schema: public; Owner: yvesmpunga
--

COMMENT ON COLUMN public.province_opportunities."maxInvestment" IS 'Montant maximum d''investissement (USD)';


--
-- Name: COLUMN province_opportunities."expectedJobs"; Type: COMMENT; Schema: public; Owner: yvesmpunga
--

COMMENT ON COLUMN public.province_opportunities."expectedJobs" IS 'Nombre d''emplois prevus';


--
-- Name: COLUMN province_opportunities."projectDuration"; Type: COMMENT; Schema: public; Owner: yvesmpunga
--

COMMENT ON COLUMN public.province_opportunities."projectDuration" IS 'Duree estimee du projet';


--
-- Name: COLUMN province_opportunities.location; Type: COMMENT; Schema: public; Owner: yvesmpunga
--

COMMENT ON COLUMN public.province_opportunities.location IS 'Localisation precise du projet';


--
-- Name: COLUMN province_opportunities.advantages; Type: COMMENT; Schema: public; Owner: yvesmpunga
--

COMMENT ON COLUMN public.province_opportunities.advantages IS 'Avantages et incitations offerts (JSON array)';


--
-- Name: COLUMN province_opportunities.requirements; Type: COMMENT; Schema: public; Owner: yvesmpunga
--

COMMENT ON COLUMN public.province_opportunities.requirements IS 'Exigences pour les investisseurs (JSON array)';


--
-- Name: COLUMN province_opportunities."contactName"; Type: COMMENT; Schema: public; Owner: yvesmpunga
--

COMMENT ON COLUMN public.province_opportunities."contactName" IS 'Nom du contact';


--
-- Name: COLUMN province_opportunities."contactEmail"; Type: COMMENT; Schema: public; Owner: yvesmpunga
--

COMMENT ON COLUMN public.province_opportunities."contactEmail" IS 'Email de contact';


--
-- Name: COLUMN province_opportunities."contactPhone"; Type: COMMENT; Schema: public; Owner: yvesmpunga
--

COMMENT ON COLUMN public.province_opportunities."contactPhone" IS 'Telephone de contact';


--
-- Name: COLUMN province_opportunities.deadline; Type: COMMENT; Schema: public; Owner: yvesmpunga
--

COMMENT ON COLUMN public.province_opportunities.deadline IS 'Date limite de candidature';


--
-- Name: COLUMN province_opportunities.status; Type: COMMENT; Schema: public; Owner: yvesmpunga
--

COMMENT ON COLUMN public.province_opportunities.status IS 'Statut de l''opportunite';


--
-- Name: COLUMN province_opportunities."isFeatured"; Type: COMMENT; Schema: public; Owner: yvesmpunga
--

COMMENT ON COLUMN public.province_opportunities."isFeatured" IS 'Opportunite mise en avant';


--
-- Name: COLUMN province_opportunities."viewsCount"; Type: COMMENT; Schema: public; Owner: yvesmpunga
--

COMMENT ON COLUMN public.province_opportunities."viewsCount" IS 'Nombre de vues';


--
-- Name: COLUMN province_opportunities."applicationsCount"; Type: COMMENT; Schema: public; Owner: yvesmpunga
--

COMMENT ON COLUMN public.province_opportunities."applicationsCount" IS 'Nombre de candidatures recues';


--
-- Name: COLUMN province_opportunities."imageUrl"; Type: COMMENT; Schema: public; Owner: yvesmpunga
--

COMMENT ON COLUMN public.province_opportunities."imageUrl" IS 'Image de presentation';


--
-- Name: COLUMN province_opportunities."publishedAt"; Type: COMMENT; Schema: public; Owner: yvesmpunga
--

COMMENT ON COLUMN public.province_opportunities."publishedAt" IS 'Date de publication';


--
-- Name: COLUMN province_opportunities."closedAt"; Type: COMMENT; Schema: public; Owner: yvesmpunga
--

COMMENT ON COLUMN public.province_opportunities."closedAt" IS 'Date de cloture';


--
-- Name: COLUMN province_opportunities."createdById"; Type: COMMENT; Schema: public; Owner: yvesmpunga
--

COMMENT ON COLUMN public.province_opportunities."createdById" IS 'Utilisateur qui a cree l''opportunite';


--
-- Name: provinces; Type: TABLE; Schema: public; Owner: yvesmpunga
--

CREATE TABLE public.provinces (
    id uuid NOT NULL,
    code character varying(10) NOT NULL,
    name character varying(255) NOT NULL,
    name_fr character varying(255) NOT NULL,
    name_en character varying(255),
    name_pt character varying(255),
    name_es character varying(255),
    name_ar character varying(255),
    capital character varying(255),
    population bigint,
    area numeric(12,2),
    latitude numeric(10,8),
    longitude numeric(11,8),
    description text,
    sort_order integer DEFAULT 0,
    is_active boolean DEFAULT true,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


ALTER TABLE public.provinces OWNER TO yvesmpunga;

--
-- Name: COLUMN provinces.area; Type: COMMENT; Schema: public; Owner: yvesmpunga
--

COMMENT ON COLUMN public.provinces.area IS 'Area in km2';


--
-- Name: public_holidays; Type: TABLE; Schema: public; Owner: yvesmpunga
--

CREATE TABLE public.public_holidays (
    id uuid NOT NULL,
    name character varying(255) NOT NULL,
    date date NOT NULL,
    type public.enum_public_holidays_type DEFAULT 'NATIONAL'::public.enum_public_holidays_type,
    is_recurring boolean DEFAULT true,
    recurring_month integer,
    recurring_day integer,
    is_paid boolean DEFAULT true,
    overtime_rate numeric(4,2) DEFAULT 2,
    description text,
    is_active boolean DEFAULT true,
    created_by_id character varying(255),
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


ALTER TABLE public.public_holidays OWNER TO yvesmpunga;

--
-- Name: COLUMN public_holidays.is_recurring; Type: COMMENT; Schema: public; Owner: yvesmpunga
--

COMMENT ON COLUMN public.public_holidays.is_recurring IS 'Se répète chaque année à la même date';


--
-- Name: COLUMN public_holidays.recurring_month; Type: COMMENT; Schema: public; Owner: yvesmpunga
--

COMMENT ON COLUMN public.public_holidays.recurring_month IS '1-12 pour les jours fériés récurrents';


--
-- Name: COLUMN public_holidays.recurring_day; Type: COMMENT; Schema: public; Owner: yvesmpunga
--

COMMENT ON COLUMN public.public_holidays.recurring_day IS '1-31 pour les jours fériés récurrents';


--
-- Name: COLUMN public_holidays.overtime_rate; Type: COMMENT; Schema: public; Owner: yvesmpunga
--

COMMENT ON COLUMN public.public_holidays.overtime_rate IS 'Taux pour le travail ce jour';


--
-- Name: required_documents; Type: TABLE; Schema: public; Owner: yvesmpunga
--

CREATE TABLE public.required_documents (
    id uuid NOT NULL,
    code character varying(50) NOT NULL,
    name character varying(200) NOT NULL,
    description text,
    "dossierType" character varying(50) NOT NULL,
    "isRequired" boolean DEFAULT true NOT NULL,
    "acceptedFormats" character varying(255)[] DEFAULT ARRAY['pdf'::character varying(255), 'jpg'::character varying(255), 'jpeg'::character varying(255), 'png'::character varying(255)],
    "maxSizeMB" integer DEFAULT 10,
    "order" integer DEFAULT 0 NOT NULL,
    "isActive" boolean DEFAULT true NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public.required_documents OWNER TO yvesmpunga;

--
-- Name: COLUMN required_documents.code; Type: COMMENT; Schema: public; Owner: yvesmpunga
--

COMMENT ON COLUMN public.required_documents.code IS 'Code unique du document (ex: RCCM, ID_NAT)';


--
-- Name: COLUMN required_documents.name; Type: COMMENT; Schema: public; Owner: yvesmpunga
--

COMMENT ON COLUMN public.required_documents.name IS 'Nom du document (ex: Registre de commerce)';


--
-- Name: COLUMN required_documents.description; Type: COMMENT; Schema: public; Owner: yvesmpunga
--

COMMENT ON COLUMN public.required_documents.description IS 'Description ou instructions pour ce document';


--
-- Name: COLUMN required_documents."dossierType"; Type: COMMENT; Schema: public; Owner: yvesmpunga
--

COMMENT ON COLUMN public.required_documents."dossierType" IS 'Type de dossier (LICENCE_EXPLOITATION, PERMIS_CONSTRUCTION, etc.)';


--
-- Name: COLUMN required_documents."isRequired"; Type: COMMENT; Schema: public; Owner: yvesmpunga
--

COMMENT ON COLUMN public.required_documents."isRequired" IS 'Document obligatoire ou optionnel';


--
-- Name: COLUMN required_documents."acceptedFormats"; Type: COMMENT; Schema: public; Owner: yvesmpunga
--

COMMENT ON COLUMN public.required_documents."acceptedFormats" IS 'Formats de fichier acceptes';


--
-- Name: COLUMN required_documents."maxSizeMB"; Type: COMMENT; Schema: public; Owner: yvesmpunga
--

COMMENT ON COLUMN public.required_documents."maxSizeMB" IS 'Taille maximale en MB';


--
-- Name: COLUMN required_documents."order"; Type: COMMENT; Schema: public; Owner: yvesmpunga
--

COMMENT ON COLUMN public.required_documents."order" IS 'Ordre d''affichage';


--
-- Name: role_permissions; Type: TABLE; Schema: public; Owner: yvesmpunga
--

CREATE TABLE public.role_permissions (
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    permission_id uuid NOT NULL,
    role_id uuid NOT NULL
);


ALTER TABLE public.role_permissions OWNER TO yvesmpunga;

--
-- Name: roles; Type: TABLE; Schema: public; Owner: yvesmpunga
--

CREATE TABLE public.roles (
    id uuid NOT NULL,
    code character varying(50) NOT NULL,
    name character varying(255) NOT NULL,
    name_fr character varying(255) NOT NULL,
    name_en character varying(255),
    description text,
    level integer DEFAULT 0,
    permissions jsonb DEFAULT '[]'::jsonb,
    is_system boolean DEFAULT false,
    is_active boolean DEFAULT true,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


ALTER TABLE public.roles OWNER TO yvesmpunga;

--
-- Name: COLUMN roles.level; Type: COMMENT; Schema: public; Owner: yvesmpunga
--

COMMENT ON COLUMN public.roles.level IS 'Hierarchy level (0=highest)';


--
-- Name: COLUMN roles.permissions; Type: COMMENT; Schema: public; Owner: yvesmpunga
--

COMMENT ON COLUMN public.roles.permissions IS 'Array of permission codes';


--
-- Name: COLUMN roles.is_system; Type: COMMENT; Schema: public; Owner: yvesmpunga
--

COMMENT ON COLUMN public.roles.is_system IS 'System roles cannot be deleted';


--
-- Name: sectors; Type: TABLE; Schema: public; Owner: yvesmpunga
--

CREATE TABLE public.sectors (
    id uuid NOT NULL,
    code character varying(20) NOT NULL,
    name character varying(200) NOT NULL,
    description text,
    "parentId" uuid,
    "isActive" boolean DEFAULT true NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    "ministryId" uuid,
    color character varying(20) DEFAULT 'blue'::character varying
);


ALTER TABLE public.sectors OWNER TO yvesmpunga;

--
-- Name: COLUMN sectors."ministryId"; Type: COMMENT; Schema: public; Owner: yvesmpunga
--

COMMENT ON COLUMN public.sectors."ministryId" IS 'Ministere de tutelle du secteur';


--
-- Name: COLUMN sectors.color; Type: COMMENT; Schema: public; Owner: yvesmpunga
--

COMMENT ON COLUMN public.sectors.color IS 'Couleur pour l''affichage';


--
-- Name: stakeholder_dialogues; Type: TABLE; Schema: public; Owner: yvesmpunga
--

CREATE TABLE public.stakeholder_dialogues (
    id uuid NOT NULL,
    reference character varying(50) NOT NULL,
    title character varying(255) NOT NULL,
    description text,
    "eventType" public."enum_stakeholder_dialogues_eventType" DEFAULT 'ROUNDTABLE'::public."enum_stakeholder_dialogues_eventType",
    status public.enum_stakeholder_dialogues_status DEFAULT 'PLANNED'::public.enum_stakeholder_dialogues_status,
    sector character varying(100),
    "mainTopic" character varying(255),
    objectives jsonb DEFAULT '[]'::jsonb,
    agenda jsonb DEFAULT '[]'::jsonb,
    venue character varying(255),
    "venueAddress" text,
    "isOnline" boolean DEFAULT false,
    "onlineLink" character varying(500),
    "scheduledDate" timestamp with time zone NOT NULL,
    "startTime" time without time zone,
    "endTime" time without time zone,
    "expectedParticipants" integer DEFAULT 0,
    "actualParticipants" integer,
    "invitedParticipants" jsonb DEFAULT '[]'::jsonb,
    minutes text,
    decisions jsonb DEFAULT '[]'::jsonb,
    "actionItems" jsonb DEFAULT '[]'::jsonb,
    recommendations jsonb DEFAULT '[]'::jsonb,
    attachments jsonb DEFAULT '[]'::jsonb,
    photos jsonb DEFAULT '[]'::jsonb,
    budget numeric(15,2),
    "actualCost" numeric(15,2),
    notes text,
    "nextEventId" uuid,
    "organizerId" character varying(50),
    "createdById" character varying(50),
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public.stakeholder_dialogues OWNER TO yvesmpunga;

--
-- Name: COLUMN stakeholder_dialogues.objectives; Type: COMMENT; Schema: public; Owner: yvesmpunga
--

COMMENT ON COLUMN public.stakeholder_dialogues.objectives IS 'Liste des objectifs';


--
-- Name: COLUMN stakeholder_dialogues.agenda; Type: COMMENT; Schema: public; Owner: yvesmpunga
--

COMMENT ON COLUMN public.stakeholder_dialogues.agenda IS 'Points de l''ordre du jour';


--
-- Name: COLUMN stakeholder_dialogues."invitedParticipants"; Type: COMMENT; Schema: public; Owner: yvesmpunga
--

COMMENT ON COLUMN public.stakeholder_dialogues."invitedParticipants" IS 'Liste des personnes/organisations invitées';


--
-- Name: COLUMN stakeholder_dialogues."actionItems"; Type: COMMENT; Schema: public; Owner: yvesmpunga
--

COMMENT ON COLUMN public.stakeholder_dialogues."actionItems" IS 'Actions avec responsable et deadline';


--
-- Name: system_configs; Type: TABLE; Schema: public; Owner: yvesmpunga
--

CREATE TABLE public.system_configs (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    key character varying(100) NOT NULL,
    value text,
    category character varying(50) DEFAULT 'general'::character varying NOT NULL,
    type character varying(20) DEFAULT 'string'::character varying NOT NULL,
    description text,
    "isEncrypted" boolean DEFAULT false,
    "isEditable" boolean DEFAULT true,
    "updatedById" text,
    "createdAt" timestamp with time zone DEFAULT now(),
    "updatedAt" timestamp with time zone DEFAULT now()
);


ALTER TABLE public.system_configs OWNER TO yvesmpunga;

--
-- Name: territories; Type: TABLE; Schema: public; Owner: yvesmpunga
--

CREATE TABLE public.territories (
    id uuid NOT NULL,
    code character varying(20) NOT NULL,
    name character varying(255) NOT NULL,
    name_fr character varying(255) NOT NULL,
    name_en character varying(255),
    name_pt character varying(255),
    name_es character varying(255),
    name_ar character varying(255),
    province_id uuid NOT NULL,
    district_id uuid,
    chief_town character varying(255),
    population bigint,
    area numeric(12,2),
    latitude numeric(10,8),
    longitude numeric(11,8),
    description text,
    sort_order integer DEFAULT 0,
    is_active boolean DEFAULT true,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


ALTER TABLE public.territories OWNER TO yvesmpunga;

--
-- Name: COLUMN territories.chief_town; Type: COMMENT; Schema: public; Owner: yvesmpunga
--

COMMENT ON COLUMN public.territories.chief_town IS 'Chef-lieu du territoire';


--
-- Name: COLUMN territories.area; Type: COMMENT; Schema: public; Owner: yvesmpunga
--

COMMENT ON COLUMN public.territories.area IS 'Area in km2';


--
-- Name: users; Type: TABLE; Schema: public; Owner: yvesmpunga
--

CREATE TABLE public.users (
    id uuid NOT NULL,
    email character varying(255) NOT NULL,
    password character varying(255) NOT NULL,
    first_name character varying(255) NOT NULL,
    last_name character varying(255) NOT NULL,
    phone character varying(255),
    avatar character varying(255),
    role public.enum_users_role DEFAULT 'agent'::public.enum_users_role,
    language public.enum_users_language DEFAULT 'fr'::public.enum_users_language,
    is_active boolean DEFAULT true,
    is_verified boolean DEFAULT false,
    last_login_at timestamp with time zone,
    province_id uuid,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    city_id uuid,
    role_id uuid,
    ministry_id uuid,
    name character varying(255),
    image character varying(255),
    department character varying(255),
    modules text[]
);


ALTER TABLE public.users OWNER TO yvesmpunga;

--
-- Name: work_schedules; Type: TABLE; Schema: public; Owner: yvesmpunga
--

CREATE TABLE public.work_schedules (
    id uuid NOT NULL,
    name character varying(255) NOT NULL,
    description text,
    is_default boolean DEFAULT false,
    monday_start time without time zone,
    monday_end time without time zone,
    monday_break_start time without time zone,
    monday_break_end time without time zone,
    monday_work_hours numeric(4,2),
    tuesday_start time without time zone,
    tuesday_end time without time zone,
    tuesday_break_start time without time zone,
    tuesday_break_end time without time zone,
    tuesday_work_hours numeric(4,2),
    wednesday_start time without time zone,
    wednesday_end time without time zone,
    wednesday_break_start time without time zone,
    wednesday_break_end time without time zone,
    wednesday_work_hours numeric(4,2),
    thursday_start time without time zone,
    thursday_end time without time zone,
    thursday_break_start time without time zone,
    thursday_break_end time without time zone,
    thursday_work_hours numeric(4,2),
    friday_start time without time zone,
    friday_end time without time zone,
    friday_break_start time without time zone,
    friday_break_end time without time zone,
    friday_work_hours numeric(4,2),
    saturday_start time without time zone,
    saturday_end time without time zone,
    saturday_break_start time without time zone,
    saturday_break_end time without time zone,
    saturday_work_hours numeric(4,2),
    sunday_start time without time zone,
    sunday_end time without time zone,
    sunday_break_start time without time zone,
    sunday_break_end time without time zone,
    sunday_work_hours numeric(4,2),
    weekly_hours numeric(5,2),
    working_days integer DEFAULT 5,
    late_tolerance_minutes integer DEFAULT 15,
    early_leave_tolerance_minutes integer DEFAULT 15,
    overtime_threshold numeric(4,2) DEFAULT 8,
    regular_overtime_rate numeric(4,2) DEFAULT 1.5,
    weekend_overtime_rate numeric(4,2) DEFAULT 2,
    holiday_overtime_rate numeric(4,2) DEFAULT 2.5,
    night_overtime_rate numeric(4,2) DEFAULT 1.75,
    night_start_time time without time zone DEFAULT '22:00:00'::time without time zone,
    night_end_time time without time zone DEFAULT '06:00:00'::time without time zone,
    is_active boolean DEFAULT true,
    created_by_id character varying(255),
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


ALTER TABLE public.work_schedules OWNER TO yvesmpunga;

--
-- Name: COLUMN work_schedules.overtime_threshold; Type: COMMENT; Schema: public; Owner: yvesmpunga
--

COMMENT ON COLUMN public.work_schedules.overtime_threshold IS 'Heures après lesquelles les HS commencent';


--
-- Name: workflow_steps; Type: TABLE; Schema: public; Owner: yvesmpunga
--

CREATE TABLE public.workflow_steps (
    id uuid NOT NULL,
    "workflowType" character varying(255) DEFAULT 'AGREMENT'::character varying NOT NULL,
    "stepNumber" integer NOT NULL,
    name character varying(255) NOT NULL,
    description text,
    icon character varying(255) DEFAULT 'Circle'::character varying,
    color character varying(255) DEFAULT '#3B82F6'::character varying,
    "estimatedDays" integer DEFAULT 7,
    "requiredDocuments" jsonb DEFAULT '[]'::jsonb,
    "availableActions" jsonb DEFAULT '["approve", "reject", "request_info"]'::jsonb,
    "responsibleRole" character varying(255),
    "isFinal" boolean DEFAULT false,
    "isRequired" boolean DEFAULT true,
    "isActive" boolean DEFAULT true,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public.workflow_steps OWNER TO yvesmpunga;

--
-- Name: VerificationToken id; Type: DEFAULT; Schema: public; Owner: yvesmpunga
--

ALTER TABLE ONLY public."VerificationToken" ALTER COLUMN id SET DEFAULT nextval('public."VerificationToken_id_seq"'::regclass);


--
-- Data for Name: Account; Type: TABLE DATA; Schema: public; Owner: yvesmpunga
--

COPY public."Account" (id, "userId", type, provider, "providerAccountId", refresh_token, access_token, expires_at, token_type, scope, id_token, session_state, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: ApprovalRequest; Type: TABLE DATA; Schema: public; Owner: yvesmpunga
--

COPY public."ApprovalRequest" (id, "requestNumber", "investorId", "investmentId", "approvalType", regime, "projectName", "projectDescription", "investmentAmount", currency, "jobsToCreate", province, sector, status, "currentStep", "assignedToId", "assignedAt", "decisionDate", "decisionNote", "submittedAt", "createdAt", "updatedAt", "directJobs", "indirectJobs") FROM stdin;
35e3630f-c3e4-4cb3-9e5d-d2f7d967c2b4	AGR-2025-00001	6259bec5-8494-4bbc-b311-6387273a4999	\N	AGREMENT_REGIME	NORMAL	Exploitation Miniere Katanga	Exploitation de cuivre et cobalt	50000000.00	USD	2500	Haut-Katanga	Mines et extraction	SUBMITTED	1	\N	\N	\N	\N	2025-12-29 11:16:59.468	2025-12-29 11:16:59.468	2025-12-29 11:16:59.468	500	2000
\.


--
-- Data for Name: Attendance; Type: TABLE DATA; Schema: public; Owner: yvesmpunga
--

COPY public."Attendance" (id, "employeeId", date, "checkIn", "checkOut", "workHours", "overtimeHours", status, source, notes, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: CategoryDeduction; Type: TABLE DATA; Schema: public; Owner: yvesmpunga
--

COPY public."CategoryDeduction" (id, "categoryId", code, name, description, amount, "isPercentage", "isBeforeTax", "isMandatory", "isActive", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: CategoryPrime; Type: TABLE DATA; Schema: public; Owner: yvesmpunga
--

COPY public."CategoryPrime" (id, "categoryId", code, name, description, amount, "isPercentage", "isTaxable", "isSubjectToCNSS", "isActive", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: City; Type: TABLE DATA; Schema: public; Owner: yvesmpunga
--

COPY public."City" (id, code, name, "provinceId", population, "isCapital", "isActive", "createdAt", "updatedAt") FROM stdin;
046a58fe-68e9-46d7-9c27-73a293341b50	KIN-001	Kinshasa	cmjomofsn000bjhjmaomn4zl5	17000000	t	t	2026-01-02 11:57:38.306+01	2026-01-02 11:57:38.306+01
f81f1b88-c76a-420a-879c-1b36f36529b1	KOC-001	Matadi	cmjomofss000gjhjmk11g62v2	350000	t	t	2026-01-02 11:57:38.334+01	2026-01-02 11:57:38.334+01
5bab82f1-9c78-48c6-aa46-b90ea5ab244c	KOC-002	Boma	cmjomofss000gjhjmk11g62v2	180000	f	t	2026-01-02 11:57:38.335+01	2026-01-02 11:57:38.335+01
a2c0c538-cb7f-4567-9f49-209d203c6136	KOC-003	Moanda	cmjomofss000gjhjmk11g62v2	100000	f	t	2026-01-02 11:57:38.336+01	2026-01-02 11:57:38.336+01
5777b863-91d5-4120-9a82-eff57decfe03	KOC-004	Tshela	cmjomofss000gjhjmk11g62v2	50000	f	t	2026-01-02 11:57:38.336+01	2026-01-02 11:57:38.336+01
58e2bacd-bb7b-499a-bab6-4cbcdc2a87fe	KOC-005	Mbanza-Ngungu	cmjomofss000gjhjmk11g62v2	80000	f	t	2026-01-02 11:57:38.337+01	2026-01-02 11:57:38.337+01
393db23a-2e02-413c-83de-9fdc30f87dd7	KOC-006	Lukala	cmjomofss000gjhjmk11g62v2	40000	f	t	2026-01-02 11:57:38.338+01	2026-01-02 11:57:38.338+01
d49761a6-b051-4793-b203-032645adf623	KOC-007	Songololo	cmjomofss000gjhjmk11g62v2	30000	f	t	2026-01-02 11:57:38.338+01	2026-01-02 11:57:38.338+01
449eae1f-90b9-4658-a7b5-6eef2ea08abc	KOC-008	Kasangulu	cmjomofss000gjhjmk11g62v2	60000	f	t	2026-01-02 11:57:38.339+01	2026-01-02 11:57:38.339+01
6972e1b6-2eee-4366-a6eb-eea41f186c6b	HKA-001	Lubumbashi	cmjomofsp000cjhjmmfq29ufa	2000000	t	t	2026-01-02 11:57:38.34+01	2026-01-02 11:57:38.34+01
68c76713-ba71-431d-90f1-9328bfba0d24	HKA-002	Likasi	cmjomofsp000cjhjmmfq29ufa	450000	f	t	2026-01-02 11:57:38.34+01	2026-01-02 11:57:38.34+01
378fba68-0146-42f6-ba2f-d1f1e834c661	HKA-003	Kipushi	cmjomofsp000cjhjmmfq29ufa	120000	f	t	2026-01-02 11:57:38.341+01	2026-01-02 11:57:38.341+01
acd6fd5d-a922-4a43-831f-38e44bc2b7d9	HKA-004	Kasumbalesa	cmjomofsp000cjhjmmfq29ufa	80000	f	t	2026-01-02 11:57:38.342+01	2026-01-02 11:57:38.342+01
62ed97ac-049c-40e8-aa02-9a700c2f2bcb	HKA-005	Kambove	cmjomofsp000cjhjmmfq29ufa	50000	f	t	2026-01-02 11:57:38.343+01	2026-01-02 11:57:38.343+01
2727fae1-d634-4446-a859-ada8edad792d	LUA-001	Kolwezi	cmjomofsq000djhjmg1bgk6sw	500000	t	t	2026-01-02 11:57:38.343+01	2026-01-02 11:57:38.343+01
bdb5d7e2-56c3-4ae8-8e7a-d1b197ecc883	LUA-002	Dilolo	cmjomofsq000djhjmg1bgk6sw	40000	f	t	2026-01-02 11:57:38.344+01	2026-01-02 11:57:38.344+01
48d43fb6-ff04-4f6a-87ee-651e82671b03	LUA-003	Fungurume	cmjomofsq000djhjmg1bgk6sw	30000	f	t	2026-01-02 11:57:38.345+01	2026-01-02 11:57:38.345+01
8e4cbab4-a560-4413-a243-d23338ca6898	LUA-004	Mutshatsha	cmjomofsq000djhjmg1bgk6sw	25000	f	t	2026-01-02 11:57:38.346+01	2026-01-02 11:57:38.346+01
06cad77b-2310-46a5-8951-9aa7c3f9f155	NKI-001	Goma	cmjomofsr000ejhjmz9x3fwrh	1000000	t	t	2026-01-02 11:57:38.346+01	2026-01-02 11:57:38.346+01
37c4283c-7693-4cf2-8a16-c518d1829f84	NKI-002	Butembo	cmjomofsr000ejhjmz9x3fwrh	700000	f	t	2026-01-02 11:57:38.347+01	2026-01-02 11:57:38.347+01
3a496cd4-741d-4715-a434-da434ea29794	NKI-003	Beni	cmjomofsr000ejhjmz9x3fwrh	400000	f	t	2026-01-02 11:57:38.348+01	2026-01-02 11:57:38.348+01
388cd142-5567-4366-8d66-925568bd7fb8	NKI-004	Rutshuru	cmjomofsr000ejhjmz9x3fwrh	100000	f	t	2026-01-02 11:57:38.348+01	2026-01-02 11:57:38.348+01
1daae281-efff-4c2f-99a8-20bdb96af7bc	NKI-005	Masisi	cmjomofsr000ejhjmz9x3fwrh	80000	f	t	2026-01-02 11:57:38.349+01	2026-01-02 11:57:38.349+01
403f64ec-7bd6-4bc3-9937-b95764b88004	NKI-006	Walikale	cmjomofsr000ejhjmz9x3fwrh	60000	f	t	2026-01-02 11:57:38.35+01	2026-01-02 11:57:38.35+01
9348a990-6062-45c2-bd5f-d677dcc5d96e	NKI-007	Lubero	cmjomofsr000ejhjmz9x3fwrh	90000	f	t	2026-01-02 11:57:38.35+01	2026-01-02 11:57:38.35+01
065afd96-8f78-4fd7-bd90-be1e51189135	SKI-001	Bukavu	cmjomofsr000fjhjmgh3ewr5c	900000	t	t	2026-01-02 11:57:38.351+01	2026-01-02 11:57:38.351+01
980d1ebf-dfbe-4c47-bbc0-d4c2edc23236	SKI-002	Uvira	cmjomofsr000fjhjmgh3ewr5c	300000	f	t	2026-01-02 11:57:38.352+01	2026-01-02 11:57:38.352+01
64323eea-9b00-4469-80d9-4ed5d3e8d5c6	SKI-003	Baraka	cmjomofsr000fjhjmgh3ewr5c	80000	f	t	2026-01-02 11:57:38.353+01	2026-01-02 11:57:38.353+01
e4f77d78-d7c8-423a-a37a-da33ec2d063f	SKI-004	Kamituga	cmjomofsr000fjhjmgh3ewr5c	100000	f	t	2026-01-02 11:57:38.354+01	2026-01-02 11:57:38.354+01
7e65f2fb-10fe-495d-8e0e-a5b0a95b449c	SKI-005	Kabare	cmjomofsr000fjhjmgh3ewr5c	60000	f	t	2026-01-02 11:57:38.354+01	2026-01-02 11:57:38.354+01
132356c0-8ee2-4e3b-89c8-45b1c650a3bb	SKI-006	Walungu	cmjomofsr000fjhjmgh3ewr5c	50000	f	t	2026-01-02 11:57:38.355+01	2026-01-02 11:57:38.355+01
99f70d5e-db80-4cbd-b830-b6fad485c294	KAO-001	Mbuji-Mayi	a393dca1-e20e-41a7-8f53-bc3432296eae	2500000	t	t	2026-01-02 11:57:38.356+01	2026-01-02 11:57:38.356+01
bafe0bbf-c2cd-4caf-a342-f3efd4dcbab1	KAO-002	Tshilenge	a393dca1-e20e-41a7-8f53-bc3432296eae	80000	f	t	2026-01-02 11:57:38.357+01	2026-01-02 11:57:38.357+01
fcae6d66-248e-4b67-8866-f597d4ecc2bc	KAO-003	Kabeya-Kamwanga	a393dca1-e20e-41a7-8f53-bc3432296eae	50000	f	t	2026-01-02 11:57:38.357+01	2026-01-02 11:57:38.357+01
eceb8977-22fc-4e3d-b3c6-c7c3bff6be78	KAC-001	Kananga	634101a8-bf8a-4be5-bfef-8894b84e5937	1200000	t	t	2026-01-02 11:57:38.358+01	2026-01-02 11:57:38.358+01
6a40b7ad-c92b-4269-9b32-62597c6f9194	KAC-002	Luiza	634101a8-bf8a-4be5-bfef-8894b84e5937	80000	f	t	2026-01-02 11:57:38.359+01	2026-01-02 11:57:38.359+01
c8f2f911-a7d5-4e17-a603-040eb1036b7a	KAC-003	Demba	634101a8-bf8a-4be5-bfef-8894b84e5937	60000	f	t	2026-01-02 11:57:38.359+01	2026-01-02 11:57:38.359+01
ed905e26-a1a1-4f5e-b5a9-c28a512384fe	KAC-004	Dibaya	634101a8-bf8a-4be5-bfef-8894b84e5937	50000	f	t	2026-01-02 11:57:38.36+01	2026-01-02 11:57:38.36+01
3fdd3132-7f6d-42d5-9637-36b44868fe0b	EQU-001	Mbandaka	cmjomofst000hjhjm4zedearj	500000	t	t	2026-01-02 11:57:38.361+01	2026-01-02 11:57:38.361+01
616b22a1-04f3-47f5-8b9b-473d37475ae0	EQU-002	Bikoro	cmjomofst000hjhjm4zedearj	60000	f	t	2026-01-02 11:57:38.362+01	2026-01-02 11:57:38.362+01
d560f529-f0f1-433a-92f2-cadbd0ea4260	EQU-003	Ingende	cmjomofst000hjhjm4zedearj	40000	f	t	2026-01-02 11:57:38.362+01	2026-01-02 11:57:38.362+01
7fcea143-411c-463b-b3c4-aff164669072	EQU-004	Bolomba	cmjomofst000hjhjm4zedearj	35000	f	t	2026-01-02 11:57:38.363+01	2026-01-02 11:57:38.363+01
eb41088f-add7-4a40-8f13-b462874fdb44	TOP-001	Kisangani	82e038d5-14db-4501-9018-f310747c08e7	1200000	t	t	2026-01-02 11:57:38.364+01	2026-01-02 11:57:38.364+01
7efd07da-a86b-47ab-acc3-48d2a498aa5b	TOP-002	Isangi	82e038d5-14db-4501-9018-f310747c08e7	80000	f	t	2026-01-02 11:57:38.364+01	2026-01-02 11:57:38.364+01
578bfb17-9dcd-4178-95da-7317856e7da3	TOP-003	Basoko	82e038d5-14db-4501-9018-f310747c08e7	60000	f	t	2026-01-02 11:57:38.365+01	2026-01-02 11:57:38.365+01
e89f7887-c567-426d-b256-6725b8ccec89	TOP-004	Yahuma	82e038d5-14db-4501-9018-f310747c08e7	40000	f	t	2026-01-02 11:57:38.365+01	2026-01-02 11:57:38.365+01
79066185-1008-4f67-a72c-938b5aaa7024	TOP-005	Ubundu	82e038d5-14db-4501-9018-f310747c08e7	50000	f	t	2026-01-02 11:57:38.366+01	2026-01-02 11:57:38.366+01
d0ef3db9-126d-4082-a225-7edddd386a95	TAN-001	Kalemie	cmjomofsu000jjhjmtjr9wluq	200000	t	t	2026-01-02 11:57:38.371+01	2026-01-02 11:57:38.371+01
495d107b-0d53-465c-86a3-5c00e8d2835b	TAN-002	Moba	cmjomofsu000jjhjmtjr9wluq	80000	f	t	2026-01-02 11:57:38.371+01	2026-01-02 11:57:38.371+01
0b90dc16-f35c-4a83-85ac-9deca28f2a67	TAN-003	Kongolo	cmjomofsu000jjhjmtjr9wluq	70000	f	t	2026-01-02 11:57:38.372+01	2026-01-02 11:57:38.372+01
37b52514-7ea8-4781-8b02-b969554546b4	TAN-004	Manono	cmjomofsu000jjhjmtjr9wluq	60000	f	t	2026-01-02 11:57:38.373+01	2026-01-02 11:57:38.373+01
fa7dd0a5-b148-4913-bf0b-1dc6113240cf	MAN-001	Kindu	9bf56c6f-d560-4248-9246-3cc0ad95752d	200000	t	t	2026-01-02 11:57:38.373+01	2026-01-02 11:57:38.373+01
baecde7a-bc2b-42ac-9eb2-b0c0e126ad97	MAN-002	Kasongo	9bf56c6f-d560-4248-9246-3cc0ad95752d	80000	f	t	2026-01-02 11:57:38.374+01	2026-01-02 11:57:38.374+01
4fb50b08-be1b-4748-b192-eb15281993c7	MAN-003	Lubutu	9bf56c6f-d560-4248-9246-3cc0ad95752d	50000	f	t	2026-01-02 11:57:38.375+01	2026-01-02 11:57:38.375+01
c4469ae0-dd11-45aa-acc5-d374ba1de67b	MAN-004	Kailo	9bf56c6f-d560-4248-9246-3cc0ad95752d	40000	f	t	2026-01-02 11:57:38.376+01	2026-01-02 11:57:38.376+01
7a824444-9203-4ed6-b8cb-0a0f9a02b4d5	KAS-001	Luebo	cmjomofsu000ijhjm3d1k9icw	100000	t	t	2026-01-02 11:57:38.376+01	2026-01-02 11:57:38.376+01
283f966b-1a7e-41a1-b8f5-ae9e9f18f407	KAS-002	Tshikapa	cmjomofsu000ijhjm3d1k9icw	500000	f	t	2026-01-02 11:57:38.377+01	2026-01-02 11:57:38.377+01
15e4f45d-f836-4fd8-ad97-1f1e78f58ae0	KAS-003	Ilebo	cmjomofsu000ijhjm3d1k9icw	80000	f	t	2026-01-02 11:57:38.378+01	2026-01-02 11:57:38.378+01
d4344d73-7f77-45cd-8b31-68722b256e8c	KAS-004	Mweka	cmjomofsu000ijhjm3d1k9icw	60000	f	t	2026-01-02 11:57:38.379+01	2026-01-02 11:57:38.379+01
9681fc2d-9e4f-47cb-868b-89496001d1fa	HLO-001	Kamina	44a2fd55-34cf-4236-922a-e31a4433cec8	200000	t	t	2026-01-02 11:57:38.379+01	2026-01-02 11:57:38.379+01
493e900e-23a8-4832-9aa8-3052a6614869	HLO-002	Kabongo	44a2fd55-34cf-4236-922a-e31a4433cec8	80000	f	t	2026-01-02 11:57:38.38+01	2026-01-02 11:57:38.38+01
c00acbe1-fd63-496f-9a35-9ed0006dc521	HLO-003	Malemba-Nkulu	44a2fd55-34cf-4236-922a-e31a4433cec8	60000	f	t	2026-01-02 11:57:38.381+01	2026-01-02 11:57:38.381+01
110818f1-a370-443f-bc31-157addc04c6c	HLO-004	Bukama	44a2fd55-34cf-4236-922a-e31a4433cec8	50000	f	t	2026-01-02 11:57:38.382+01	2026-01-02 11:57:38.382+01
f9cc12da-28c8-4922-ac23-8787211b50d8	KWI-001	Kikwit	fa8dc2bf-69ba-4e6d-8eee-20f380afa2e4	400000	t	t	2026-01-02 11:57:38.382+01	2026-01-02 11:57:38.382+01
1b1f0594-5a89-4e3d-ac95-aca3c2492f0f	KWI-002	Bandundu	fa8dc2bf-69ba-4e6d-8eee-20f380afa2e4	150000	f	t	2026-01-02 11:57:38.383+01	2026-01-02 11:57:38.383+01
43945bda-177e-4593-a851-a369837e4ed9	KWI-003	Gungu	fa8dc2bf-69ba-4e6d-8eee-20f380afa2e4	60000	f	t	2026-01-02 11:57:38.384+01	2026-01-02 11:57:38.384+01
a4c65fa3-27da-416d-9828-200e8c326ea7	KWI-004	Idiofa	fa8dc2bf-69ba-4e6d-8eee-20f380afa2e4	50000	f	t	2026-01-02 11:57:38.384+01	2026-01-02 11:57:38.384+01
a22ee188-c112-4d3a-853c-42e7efbd7bd9	KWA-001	Kenge	8be9273d-1acb-499a-bad0-85045c48c4c2	100000	t	t	2026-01-02 11:57:38.385+01	2026-01-02 11:57:38.385+01
c18aceb0-7fc9-438f-86ff-87cef1e3bf7f	KWA-002	Kahemba	8be9273d-1acb-499a-bad0-85045c48c4c2	40000	f	t	2026-01-02 11:57:38.386+01	2026-01-02 11:57:38.386+01
a7412f1b-ab44-4378-a52b-d31d43b4cc82	KWA-003	Feshi	8be9273d-1acb-499a-bad0-85045c48c4c2	30000	f	t	2026-01-02 11:57:38.386+01	2026-01-02 11:57:38.386+01
7df1ed2d-b7dc-49e7-bc67-19b99847388d	KWA-004	Kasongo-Lunda	8be9273d-1acb-499a-bad0-85045c48c4c2	50000	f	t	2026-01-02 11:57:38.387+01	2026-01-02 11:57:38.387+01
cbc8b524-7868-43fb-bd08-55a5ff4a640a	MAI-001	Inongo	d68bf654-711d-4a51-951e-0222d79fa572	60000	t	t	2026-01-02 11:57:38.39+01	2026-01-02 11:57:38.39+01
2c53540c-f9f5-4675-b4da-b241ca1ccb0a	MAI-002	Kiri	d68bf654-711d-4a51-951e-0222d79fa572	30000	f	t	2026-01-02 11:57:38.39+01	2026-01-02 11:57:38.39+01
7b5e65cb-a9d2-464a-9ffe-35467dda024d	MAI-003	Kutu	d68bf654-711d-4a51-951e-0222d79fa572	25000	f	t	2026-01-02 11:57:38.391+01	2026-01-02 11:57:38.391+01
f0d1abc0-7b5d-403a-96be-121cbba81258	MAI-004	Mushie	d68bf654-711d-4a51-951e-0222d79fa572	20000	f	t	2026-01-02 11:57:38.392+01	2026-01-02 11:57:38.392+01
07d61007-1845-4b30-aede-eb331973fbe3	SUD-001	Gemena	1814ac5d-c208-4b64-9c43-1d7793f4ac4f	120000	t	t	2026-01-02 11:57:38.393+01	2026-01-02 11:57:38.393+01
1785b196-36bd-4808-90de-438803337856	SUD-002	Libenge	1814ac5d-c208-4b64-9c43-1d7793f4ac4f	50000	f	t	2026-01-02 11:57:38.393+01	2026-01-02 11:57:38.393+01
dbc2054d-67cc-4433-b21b-e42c39e414e6	SUD-003	Zongo	1814ac5d-c208-4b64-9c43-1d7793f4ac4f	40000	f	t	2026-01-02 11:57:38.394+01	2026-01-02 11:57:38.394+01
c16dbcbb-e960-42da-9282-d96c893a4bcf	SUD-004	Budjala	1814ac5d-c208-4b64-9c43-1d7793f4ac4f	30000	f	t	2026-01-02 11:57:38.394+01	2026-01-02 11:57:38.394+01
65dad125-0312-4388-b153-e4b8eb76ff4e	NOR-001	Gbadolite	7fbe84fb-bb5f-4add-ab5e-9866b9988378	80000	t	t	2026-01-02 11:57:38.395+01	2026-01-02 11:57:38.395+01
66ce3513-2743-499f-8ab7-c1de84a5477c	NOR-002	Mobayi-Mbongo	7fbe84fb-bb5f-4add-ab5e-9866b9988378	40000	f	t	2026-01-02 11:57:38.395+01	2026-01-02 11:57:38.395+01
7542f7a7-5efc-4898-bbfe-8ceee98a8f76	NOR-003	Yakoma	7fbe84fb-bb5f-4add-ab5e-9866b9988378	30000	f	t	2026-01-02 11:57:38.396+01	2026-01-02 11:57:38.396+01
6bec7da1-0eef-4fe1-806b-29e9543e579c	MON-001	Lisala	a5c5ce08-bfec-4f21-9216-1450baffc402	100000	t	t	2026-01-02 11:57:38.397+01	2026-01-02 11:57:38.397+01
dc1f3ed4-368c-4144-933d-72aef8462707	MON-002	Bumba	a5c5ce08-bfec-4f21-9216-1450baffc402	80000	f	t	2026-01-02 11:57:38.398+01	2026-01-02 11:57:38.398+01
1c0f2266-36c5-4825-adfa-7f8769838a98	MON-003	Bongandanga	a5c5ce08-bfec-4f21-9216-1450baffc402	40000	f	t	2026-01-02 11:57:38.398+01	2026-01-02 11:57:38.398+01
e719ebdf-5abb-4073-830b-64a57b8788ca	TSH-001	Boende	bc520b58-36b4-4d18-bded-c7927c6a47ef	60000	t	t	2026-01-02 11:57:38.399+01	2026-01-02 11:57:38.399+01
1c35a6fd-3872-48bc-8670-5a12b77b02f6	TSH-002	Befale	bc520b58-36b4-4d18-bded-c7927c6a47ef	30000	f	t	2026-01-02 11:57:38.4+01	2026-01-02 11:57:38.4+01
c26da0bf-2bf8-49f9-883c-e8d7e9d356c1	TSH-003	Ikela	bc520b58-36b4-4d18-bded-c7927c6a47ef	25000	f	t	2026-01-02 11:57:38.4+01	2026-01-02 11:57:38.4+01
9991463a-7b78-45d2-aa97-fd826cb00fa8	BAS-001	Buta	af077cc1-b91e-47b3-9a4d-9d6d5b70ed5d	80000	t	t	2026-01-02 11:57:38.401+01	2026-01-02 11:57:38.401+01
a2e4732e-3dc0-4013-a3b4-a765df0e6ed5	BAS-002	Aketi	af077cc1-b91e-47b3-9a4d-9d6d5b70ed5d	40000	f	t	2026-01-02 11:57:38.402+01	2026-01-02 11:57:38.402+01
f229ef97-0f19-4334-b441-10b909102f05	BAS-003	Ango	af077cc1-b91e-47b3-9a4d-9d6d5b70ed5d	30000	f	t	2026-01-02 11:57:38.402+01	2026-01-02 11:57:38.402+01
6b931b96-e807-466c-b97c-11eaa39ddda3	HAU-001	Isiro	8804ac19-8c41-4ffe-a101-1a958f712b14	150000	t	t	2026-01-02 11:57:38.403+01	2026-01-02 11:57:38.403+01
e379a567-8a13-415b-bfa0-7576bed872be	HAU-002	Wamba	8804ac19-8c41-4ffe-a101-1a958f712b14	60000	f	t	2026-01-02 11:57:38.403+01	2026-01-02 11:57:38.403+01
bd527728-71ea-4df3-9537-546be3c75c9a	HAU-003	Watsa	8804ac19-8c41-4ffe-a101-1a958f712b14	50000	f	t	2026-01-02 11:57:38.404+01	2026-01-02 11:57:38.404+01
facbb304-488d-444d-931d-5367f8e79a40	HAU-004	Dungu	8804ac19-8c41-4ffe-a101-1a958f712b14	40000	f	t	2026-01-02 11:57:38.404+01	2026-01-02 11:57:38.404+01
7ab13bd7-fb93-4ea8-970a-971bbdd58608	HAU-005	Faradje	8804ac19-8c41-4ffe-a101-1a958f712b14	30000	f	t	2026-01-02 11:57:38.405+01	2026-01-02 11:57:38.405+01
9dad1c1f-e4b7-4033-b8c0-1c1a9476ecfe	LOM-001	Kabinda	0b85bdf5-cb21-4b2a-a5b3-fa549d42d9df	150000	t	t	2026-01-02 11:57:38.406+01	2026-01-02 11:57:38.406+01
6a6ea6c3-b49d-4c6a-912f-f28a4b760d8b	LOM-002	Mwene-Ditu	0b85bdf5-cb21-4b2a-a5b3-fa549d42d9df	200000	f	t	2026-01-02 11:57:38.407+01	2026-01-02 11:57:38.407+01
48cae25a-c903-427a-8bd8-7aa115e5f883	LOM-003	Ngandajika	0b85bdf5-cb21-4b2a-a5b3-fa549d42d9df	80000	f	t	2026-01-02 11:57:38.407+01	2026-01-02 11:57:38.407+01
69209cfa-c5ba-47b5-bba4-b6d783c7e983	LOM-004	Lubao	0b85bdf5-cb21-4b2a-a5b3-fa549d42d9df	60000	f	t	2026-01-02 11:57:38.408+01	2026-01-02 11:57:38.408+01
6d23a672-ea34-4cda-8fa5-d93f81f8cebb	SKA-001	Lusambo	484c65de-6b01-44ba-9bec-d2119e0b0b2e	60000	t	t	2026-01-02 11:57:38.409+01	2026-01-02 11:57:38.409+01
95b2937c-455e-4bf6-aa5a-ce6ad0f80357	SKA-002	Lodja	484c65de-6b01-44ba-9bec-d2119e0b0b2e	80000	f	t	2026-01-02 11:57:38.409+01	2026-01-02 11:57:38.409+01
aa7c502c-d097-43c5-9b1c-2d900a79404b	SKA-003	Katako-Kombe	484c65de-6b01-44ba-9bec-d2119e0b0b2e	40000	f	t	2026-01-02 11:57:38.41+01	2026-01-02 11:57:38.41+01
ff10828f-ce51-454c-bc11-a9688d5cf5f7	ITU-001	Bunia	cmjomofsv000kjhjmlzhjhg6l	400000	t	t	2026-01-02 11:57:38.367+01	2026-01-02 11:57:38.367+01
5af6cd19-d31b-4c4d-9506-2502f9afbe7b	ITU-002	Aru	cmjomofsv000kjhjmlzhjhg6l	120000	f	t	2026-01-02 11:57:38.368+01	2026-01-02 11:57:38.368+01
a8815261-dfc3-4642-b19c-f7ae3e5d04eb	ITU-003	Mahagi	cmjomofsv000kjhjmlzhjhg6l	100000	f	t	2026-01-02 11:57:38.369+01	2026-01-02 11:57:38.369+01
2efa70eb-e005-476d-a84d-588dcb0c19f3	ITU-004	Djugu	cmjomofsv000kjhjmlzhjhg6l	80000	f	t	2026-01-02 11:57:38.369+01	2026-01-02 11:57:38.369+01
097437a4-07bc-49a4-9dbf-7e0f682a1539	ITU-005	Irumu	cmjomofsv000kjhjmlzhjhg6l	70000	f	t	2026-01-02 11:57:38.37+01	2026-01-02 11:57:38.37+01
\.


--
-- Data for Name: Commune; Type: TABLE DATA; Schema: public; Owner: yvesmpunga
--

COPY public."Commune" (id, code, name, "cityId", population, "isActive", "createdAt", "updatedAt") FROM stdin;
6c53cd08-fced-4d7e-a112-d97f2c24be05	KIN-GOM	Gombe	046a58fe-68e9-46d7-9c27-73a293341b50	40000	t	2026-01-02 12:16:26.953+01	2026-01-02 12:16:26.953+01
d705eb15-665f-4d02-800f-996e1a071673	KIN-LIN	Lingwala	046a58fe-68e9-46d7-9c27-73a293341b50	100000	t	2026-01-02 12:16:26.957+01	2026-01-02 12:16:26.957+01
bcd26d96-2930-4d1d-9bd1-272887b246a8	KIN-BAR	Barumbu	046a58fe-68e9-46d7-9c27-73a293341b50	150000	t	2026-01-02 12:16:26.959+01	2026-01-02 12:16:26.959+01
c21bf4d3-ad94-467d-96d4-eb03064107da	KIN-KIN	Kinshasa	046a58fe-68e9-46d7-9c27-73a293341b50	250000	t	2026-01-02 12:16:26.961+01	2026-01-02 12:16:26.961+01
98863bc5-467f-4f69-86c3-3d9735aef8e9	KIN-KIT	Kintambo	046a58fe-68e9-46d7-9c27-73a293341b50	180000	t	2026-01-02 12:16:26.962+01	2026-01-02 12:16:26.962+01
4b39d847-ffb5-4eaa-9871-618ec516b848	KIN-NGA	Ngaliema	046a58fe-68e9-46d7-9c27-73a293341b50	1500000	t	2026-01-02 12:16:26.963+01	2026-01-02 12:16:26.963+01
dbe16e14-8dbc-4c08-87d0-b8dfc8b42d28	KIN-MNG	Mont-Ngafula	046a58fe-68e9-46d7-9c27-73a293341b50	400000	t	2026-01-02 12:16:26.964+01	2026-01-02 12:16:26.964+01
8b590ae1-bce6-46ef-a91f-08f96cf2b447	KIN-SEL	Selembao	046a58fe-68e9-46d7-9c27-73a293341b50	300000	t	2026-01-02 12:16:26.966+01	2026-01-02 12:16:26.966+01
f848da4a-9499-4f54-afb2-575232628836	KIN-BAN	Bandalungwa	046a58fe-68e9-46d7-9c27-73a293341b50	350000	t	2026-01-02 12:16:26.967+01	2026-01-02 12:16:26.967+01
4eeeb30e-dd21-44ca-9bde-320b730b7427	KIN-KAS	Kasa-Vubu	046a58fe-68e9-46d7-9c27-73a293341b50	200000	t	2026-01-02 12:16:26.969+01	2026-01-02 12:16:26.969+01
40e799c9-a0eb-442a-a05e-a5cf81852a52	KIN-NGN	Ngiri-Ngiri	046a58fe-68e9-46d7-9c27-73a293341b50	180000	t	2026-01-02 12:16:26.97+01	2026-01-02 12:16:26.97+01
6e01e021-ca17-443d-a944-d937250964c2	KIN-KAL	Kalamu	046a58fe-68e9-46d7-9c27-73a293341b50	200000	t	2026-01-02 12:16:26.971+01	2026-01-02 12:16:26.971+01
6d21f65a-be56-4835-be8c-64fdbf21ebcf	KIN-LEM	Lemba	046a58fe-68e9-46d7-9c27-73a293341b50	450000	t	2026-01-02 12:16:26.972+01	2026-01-02 12:16:26.972+01
6eb3a782-e7de-49c5-8fb7-6d1d5e95e07f	KIN-LIM	Limete	046a58fe-68e9-46d7-9c27-73a293341b50	700000	t	2026-01-02 12:16:26.973+01	2026-01-02 12:16:26.973+01
c7153aed-1750-41ab-9083-3f095409cd20	KIN-MAT	Matete	046a58fe-68e9-46d7-9c27-73a293341b50	300000	t	2026-01-02 12:16:26.974+01	2026-01-02 12:16:26.974+01
bd7c9090-0270-42e9-addd-a3d1aa0d0a25	KIN-NGB	Ngaba	046a58fe-68e9-46d7-9c27-73a293341b50	150000	t	2026-01-02 12:16:26.975+01	2026-01-02 12:16:26.975+01
979f9147-63c0-4dc0-8926-93c4791fe21c	KIN-MAK	Makala	046a58fe-68e9-46d7-9c27-73a293341b50	250000	t	2026-01-02 12:16:26.976+01	2026-01-02 12:16:26.976+01
269112c0-a52e-4fbf-a851-bb9a856b8203	KIN-BUM	Bumbu	046a58fe-68e9-46d7-9c27-73a293341b50	350000	t	2026-01-02 12:16:26.977+01	2026-01-02 12:16:26.977+01
e4ecdc03-2ddb-4e6f-823f-b2bea285fde4	KIN-MAS	Masina	046a58fe-68e9-46d7-9c27-73a293341b50	900000	t	2026-01-02 12:16:26.978+01	2026-01-02 12:16:26.978+01
64c40d0d-a817-4075-8cfe-89bd3c24c9db	KIN-NDJ	N'Djili	046a58fe-68e9-46d7-9c27-73a293341b50	500000	t	2026-01-02 12:16:26.979+01	2026-01-02 12:16:26.979+01
bde764d1-ace7-41b7-948a-eedb2070e8e1	KIN-KIM	Kimbanseke	046a58fe-68e9-46d7-9c27-73a293341b50	1800000	t	2026-01-02 12:16:26.98+01	2026-01-02 12:16:26.98+01
53899d28-84b3-47f7-82e1-84f1072d4017	KIN-NSE	Nsele	046a58fe-68e9-46d7-9c27-73a293341b50	400000	t	2026-01-02 12:16:26.98+01	2026-01-02 12:16:26.98+01
f422ae7b-952a-4f5c-b0c3-c495186056e7	KIN-MLU	Maluku	046a58fe-68e9-46d7-9c27-73a293341b50	300000	t	2026-01-02 12:16:26.981+01	2026-01-02 12:16:26.981+01
d04a7134-2480-42c3-b11f-c4438271e0eb	KIN-NGS	Ngaba	046a58fe-68e9-46d7-9c27-73a293341b50	160000	t	2026-01-02 12:16:26.982+01	2026-01-02 12:16:26.982+01
78bd8d8d-b392-4c07-a68c-e0f87ecfab13	LUB-LUB	Lubumbashi	6972e1b6-2eee-4366-a6eb-eea41f186c6b	800000	t	2026-01-02 12:16:26.984+01	2026-01-02 12:16:26.984+01
2fcbdaca-20af-44ac-ae29-834e426597ac	LUB-KAM	Kampemba	6972e1b6-2eee-4366-a6eb-eea41f186c6b	400000	t	2026-01-02 12:16:26.984+01	2026-01-02 12:16:26.984+01
08bb5598-1ac0-41bb-b5df-18a6e02b8d73	LUB-KEN	Kenya	6972e1b6-2eee-4366-a6eb-eea41f186c6b	300000	t	2026-01-02 12:16:26.985+01	2026-01-02 12:16:26.985+01
4a746b44-e683-47fb-b47c-31e6a62c6a58	LUB-KAT	Katuba	6972e1b6-2eee-4366-a6eb-eea41f186c6b	350000	t	2026-01-02 12:16:26.986+01	2026-01-02 12:16:26.986+01
9a60b2d0-115d-4f78-ae1b-f9849f00a7ec	LUB-KAM2	Kamalondo	6972e1b6-2eee-4366-a6eb-eea41f186c6b	150000	t	2026-01-02 12:16:26.987+01	2026-01-02 12:16:26.987+01
323e6799-ce24-45d9-940f-c783d7ae03fd	LUB-RUK	Ruashi	6972e1b6-2eee-4366-a6eb-eea41f186c6b	250000	t	2026-01-02 12:16:26.987+01	2026-01-02 12:16:26.987+01
6eef4bc4-3817-4459-8d81-13e76fe253ab	LUB-ANN	Annexe	6972e1b6-2eee-4366-a6eb-eea41f186c6b	200000	t	2026-01-02 12:16:26.988+01	2026-01-02 12:16:26.988+01
ea39f403-efd9-4d0a-aede-def9649cb13c	GOM-GOM	Goma	06cad77b-2310-46a5-8951-9aa7c3f9f155	400000	t	2026-01-02 12:16:26.99+01	2026-01-02 12:16:26.99+01
bfe8fd3b-1a28-452f-8208-3a6bb11e4fc7	GOM-KAR	Karisimbi	06cad77b-2310-46a5-8951-9aa7c3f9f155	350000	t	2026-01-02 12:16:26.991+01	2026-01-02 12:16:26.991+01
ce14350e-f25f-46b0-8f63-69996811aca6	BUK-IBD	Ibanda	065afd96-8f78-4fd7-bd90-be1e51189135	250000	t	2026-01-02 12:16:26.992+01	2026-01-02 12:16:26.992+01
85e086af-8083-4554-b463-20f1370fb683	BUK-KAD	Kadutu	065afd96-8f78-4fd7-bd90-be1e51189135	350000	t	2026-01-02 12:16:26.993+01	2026-01-02 12:16:26.993+01
c4a0b846-2d1e-4242-af9a-5c0c2781def0	BUK-BAG	Bagira	065afd96-8f78-4fd7-bd90-be1e51189135	200000	t	2026-01-02 12:16:26.994+01	2026-01-02 12:16:26.994+01
5a3cc70e-e801-4540-aae3-c8e9c1b776f7	MBJ-MBJ	Mbuji-Mayi	99f70d5e-db80-4cbd-b830-b6fad485c294	600000	t	2026-01-02 12:16:26.996+01	2026-01-02 12:16:26.996+01
964f5756-317d-4f54-ba2c-5f2868721639	MBJ-KAN	Kanshi	99f70d5e-db80-4cbd-b830-b6fad485c294	500000	t	2026-01-02 12:16:26.996+01	2026-01-02 12:16:26.996+01
965a3fdc-e1fa-4c3d-9524-9c6bbe8744ca	MBJ-BIP	Bipemba	99f70d5e-db80-4cbd-b830-b6fad485c294	400000	t	2026-01-02 12:16:26.997+01	2026-01-02 12:16:26.997+01
a405c672-0fdb-4f05-9c6f-87dd4cf26dab	MBJ-DIB	Dibindi	99f70d5e-db80-4cbd-b830-b6fad485c294	350000	t	2026-01-02 12:16:26.998+01	2026-01-02 12:16:26.998+01
4aec40b8-1aba-4ee3-a5d8-c3dbcfa72c2d	MBJ-MUA	Muya	99f70d5e-db80-4cbd-b830-b6fad485c294	300000	t	2026-01-02 12:16:26.999+01	2026-01-02 12:16:26.999+01
9cff7f17-79fa-459b-8a7b-cac5d5798c8a	KNG-KNG	Kananga	eceb8977-22fc-4e3d-b3c6-c7c3bff6be78	400000	t	2026-01-02 12:16:27+01	2026-01-02 12:16:27+01
0c70184b-bdb2-452e-ae6f-cf585bb8619f	KNG-NGA	Nganza	eceb8977-22fc-4e3d-b3c6-c7c3bff6be78	350000	t	2026-01-02 12:16:27.001+01	2026-01-02 12:16:27.001+01
0548ac1e-dd86-46eb-9634-37743c798aae	KNG-KAT	Katoka	eceb8977-22fc-4e3d-b3c6-c7c3bff6be78	250000	t	2026-01-02 12:16:27.001+01	2026-01-02 12:16:27.001+01
de337f71-5cd8-4915-8683-c47103154a51	KNG-LUK	Lukonga	eceb8977-22fc-4e3d-b3c6-c7c3bff6be78	200000	t	2026-01-02 12:16:27.002+01	2026-01-02 12:16:27.002+01
98f2258a-5f3d-493f-ba46-e83e487a1dab	KNG-NDI	Ndesha	eceb8977-22fc-4e3d-b3c6-c7c3bff6be78	150000	t	2026-01-02 12:16:27.003+01	2026-01-02 12:16:27.003+01
dcccd5f6-3630-46c2-82d2-99572ea59fb4	KIS-KIS	Kisangani	eb41088f-add7-4a40-8f13-b462874fdb44	350000	t	2026-01-02 12:16:27.004+01	2026-01-02 12:16:27.004+01
9e65f6de-27b8-4a4e-9072-3dd19691949b	KIS-MAK	Makiso	eb41088f-add7-4a40-8f13-b462874fdb44	300000	t	2026-01-02 12:16:27.006+01	2026-01-02 12:16:27.006+01
206a1654-15d6-4d23-bd42-c7a531011f03	KIS-TSH	Tshopo	eb41088f-add7-4a40-8f13-b462874fdb44	250000	t	2026-01-02 12:16:27.006+01	2026-01-02 12:16:27.006+01
95dfa376-4a15-47d2-8c7d-4ef4d35cc745	KIS-KAB	Kabondo	eb41088f-add7-4a40-8f13-b462874fdb44	200000	t	2026-01-02 12:16:27.007+01	2026-01-02 12:16:27.007+01
35d1a2c4-1705-4b19-ad9d-4c9b22a78244	KIS-MAN	Mangobo	eb41088f-add7-4a40-8f13-b462874fdb44	150000	t	2026-01-02 12:16:27.007+01	2026-01-02 12:16:27.007+01
85e2dafa-4c82-450b-9000-ac88c9610c2b	KIS-LUB	Lubunga	eb41088f-add7-4a40-8f13-b462874fdb44	100000	t	2026-01-02 12:16:27.009+01	2026-01-02 12:16:27.009+01
\.


--
-- Data for Name: Contract; Type: TABLE DATA; Schema: public; Owner: yvesmpunga
--

COPY public."Contract" (id, "contractNumber", "employeeId", type, "startDate", "endDate", "baseSalary", currency, "housingAllowance", "transportAllowance", "otherAllowances", "documentUrl", status, "terminationDate", "terminationReason", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: Currency; Type: TABLE DATA; Schema: public; Owner: yvesmpunga
--

COPY public."Currency" (id, code, name, "nameFr", symbol, "exchangeRate", "previousRate", "isBaseCurrency", "isActive", "lastUpdated", "createdAt", "updatedAt") FROM stdin;
cmjp8k1u9000rdi8mu14sqwzc	USD	US Dollar	Dollar américain	$	1.000000	1.000000	t	t	2025-12-28 04:35:01.329	2025-12-28 04:35:01.329	2025-12-28 04:35:01.329
cmjp8k1ue000sdi8muamnwvfr	CDF	Congolese Franc	Franc congolais	FC	2800.000000	1.000000	f	t	2025-12-28 04:35:01.335	2025-12-28 04:35:01.335	2025-12-28 04:35:01.335
cmjp8k1ug000tdi8m8agbgdmz	EUR	Euro	Euro	€	0.920000	1.000000	f	t	2025-12-28 04:35:01.336	2025-12-28 04:35:01.336	2025-12-28 04:35:01.336
ff850e75-aff9-41e7-85bd-3d29fee2952a	GBP	British Pound	Livre sterling	£	0.790000	1.000000	f	t	2025-12-28 06:26:07.577	2025-12-28 06:26:07.577	2025-12-28 06:26:07.577
38c48c05-9fbf-41a8-9093-fddc42c7e6e3	CNY	Chinese Yuan	Yuan chinois	¥	7.250000	1.000000	f	t	2025-12-28 06:26:07.577	2025-12-28 06:26:07.577	2025-12-28 06:26:07.577
9dbf2df4-e9cd-4ea6-890f-75e48fa8a6e6	ZAR	South African Rand	Rand sud-africain	R	18.500000	1.000000	f	t	2025-12-28 06:26:07.577	2025-12-28 06:26:07.577	2025-12-28 06:26:07.577
\.


--
-- Data for Name: Document; Type: TABLE DATA; Schema: public; Owner: yvesmpunga
--

COPY public."Document" (id, name, type, category, "fileUrl", "fileSize", "mimeType", "investorId", "investmentId", "approvalRequestId", "legalDocumentId", "uploadedBy", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: Employee; Type: TABLE DATA; Schema: public; Owner: yvesmpunga
--

COPY public."Employee" (id, matricule, "firstName", "lastName", "middleName", gender, "dateOfBirth", "placeOfBirth", nationality, "nationalId", "maritalStatus", "numberOfChildren", email, phone, "alternatePhone", address, city, province, photo, "hireDate", "employmentType", status, "departmentId", "positionId", "managerId", "bankName", "bankAccountNumber", "bankAccountName", "emergencyContactName", "emergencyContactPhone", "emergencyContactRelation", "userId", "createdAt", "updatedAt", "workerCategoryId") FROM stdin;
cmjp9b5do00302qutcz8ixxe4	ANAPI250003	Patrick	MUTOMBO	Kasongo	MALE	1985-11-08 00:00:00	\N	Congolaise	\N	MARRIED	2	p.mutombo@anapi.cd	+243999000003	\N	78 Rue des Cliniques	Kinshasa	Kinshasa	/images/employees/default-male.svg	2021-03-15 00:00:00	CDI	ACTIVE	cmjp8k1up000wdi8mmxzpzga1	cmjp8k1vh001kdi8m90vm43m6	\N	\N	\N	\N	\N	\N	\N	\N	2025-12-28 04:56:05.628	2025-12-28 04:56:05.628	\N
cmjp9b5dw003c2qut51f9jsmb	ANAPI250005	Emmanuel	TSHISEKEDI	\N	MALE	1992-09-12 00:00:00	\N	Congolaise	\N	SINGLE	0	e.tshisekedi@anapi.cd	+243999000005	\N	56 Rue de la Science	Kinshasa	Kinshasa	/images/employees/default-male.svg	2024-02-20 00:00:00	CDD	ACTIVE	cmjp8k1uv0010di8mfvp5j92p	cmjp8k1vy002cdi8m4wd38pz3	\N	\N	\N	\N	\N	\N	\N	\N	2025-12-28 04:56:05.636	2025-12-28 04:56:05.636	\N
cmjp9b5ds00362qutfs3upehr	ANAPI250004	Sylvie	MBOMBO	\N	FEMALE	1990-04-30 00:00:00	\N	Congolaise	\N	MARRIED	1	s.mbombo@anapi.cd	+243999000004	\N	12 Avenue Kasavubu	Kinshasa	Kinshasa	/images/employees/default-female.svg	2023-01-10 00:00:00	CDI	ACTIVE	cmjp8k1uo000vdi8mvy0lvlbr	cmjp8k1vc001cdi8mo5i3wpit	\N	\N	\N	\N	\N	\N	\N	\N	2025-12-28 04:56:05.632	2025-12-28 04:56:05.632	\N
cmjp9b5d9002o2qutzadoqfx1	ANAPI250001	Jean-Pierre	KABONGO	Mwamba	MALE	1975-03-15 00:00:00	\N	Congolaise	\N	MARRIED	0	jp.kabongo@anapi.cd	+243999000001	\N	123 Avenue Lumumba	Kinshasa	Kinshasa	/images/employees/1766899091146-ij5aul.webp	2020-01-15 00:00:00	CDI	ACTIVE	cmjp8k1uh000udi8mq3fcoxjx	cmjp8k1v00012di8mi86q3kii	\N	\N	\N	\N	\N	\N	\N	\N	2025-12-28 04:56:05.613	2025-12-28 05:20:12.035	\N
cmjp9b5dh002u2qut60a6yoib	ANAPI250002	Marie-Claire	LUKUSA	\N	FEMALE	1988-07-22 00:00:00	\N	Congolaise	\N	SINGLE	2	mc.lukusa@anapi.cd	+243999000002	\N	45 Boulevard du 30 Juin	Kinshasa	Kinshasa	/images/employees/1766899231254-dzbmi7.jpeg	2022-06-01 00:00:00	CDI	ACTIVE	cmjp8k1uq000xdi8m8bxcynqr	cmjp8k1vl001qdi8mjzydbg2i	\N	\N	\N	\N	\N	\N	\N	\N	2025-12-28 04:56:05.622	2025-12-28 05:21:30.462	\N
\.


--
-- Data for Name: EmployeeBankAccount; Type: TABLE DATA; Schema: public; Owner: yvesmpunga
--

COPY public."EmployeeBankAccount" (id, "employeeId", "bankName", "accountNumber", iban, swift, "currencyId", "isDefault", "createdAt", "updatedAt") FROM stdin;
cmjp9b5dp00322qutfpclljo7	cmjp9b5do00302qutcz8ixxe4	FBN Bank	006868593223	\N	\N	cmjp8k1u9000rdi8mu14sqwzc	t	2025-12-28 04:56:05.629	2025-12-28 04:56:05.629
cmjp9b5dt00382qutjcyr61rx	cmjp9b5ds00362qutfs3upehr	TMB	008105459602	\N	\N	cmjp8k1u9000rdi8mu14sqwzc	t	2025-12-28 04:56:05.634	2025-12-28 04:56:05.634
cmjp9b5dw003e2qut1dzdixiy	cmjp9b5dw003c2qut51f9jsmb	Rawbank	002405965078	\N	\N	cmjp8k1u9000rdi8mu14sqwzc	t	2025-12-28 04:56:05.637	2025-12-28 04:56:05.637
cmjpa65fs00034dru1lidlfym	cmjp9b5d9002o2qutzadoqfx1	Equity BCDC	003262423070	\N	\N	cmjp8k1u9000rdi8mu14sqwzc	t	2025-12-28 05:20:12.04	2025-12-28 05:20:12.04
cmjpa7ty8000a4dru70ewb7lo	cmjp9b5dh002u2qut60a6yoib	Rawbank	008647896397	\N	\N	cmjp8k1u9000rdi8mu14sqwzc	t	2025-12-28 05:21:30.464	2025-12-28 05:21:30.464
\.


--
-- Data for Name: EmployeeChild; Type: TABLE DATA; Schema: public; Owner: yvesmpunga
--

COPY public."EmployeeChild" (id, "employeeId", "lastName", "firstName", "middleName", "dateOfBirth", gender, relationship, "createdAt", "updatedAt") FROM stdin;
cmjpa7tyd000b4dru9ydbx9ln	cmjp9b5dh002u2qut60a6yoib	LUKUSA	Patrick	\N	2025-12-09 00:00:00	MALE	BIOLOGICAL	2025-12-28 05:21:30.469	2025-12-28 05:21:30.469
cmjpa7tyd000c4dru3a54s4lk	cmjp9b5dh002u2qut60a6yoib	Dsvid	Mutamba	\N	2025-12-02 00:00:00	MALE	BIOLOGICAL	2025-12-28 05:21:30.469	2025-12-28 05:21:30.469
\.


--
-- Data for Name: EmployeeDocument; Type: TABLE DATA; Schema: public; Owner: yvesmpunga
--

COPY public."EmployeeDocument" (id, "employeeId", name, type, description, "fileUrl", "fileSize", "mimeType", "issueDate", "expiryDate", "isVerified", "verifiedAt", "verifiedBy", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: EmployeeEmergencyContact; Type: TABLE DATA; Schema: public; Owner: yvesmpunga
--

COPY public."EmployeeEmergencyContact" (id, "employeeId", "fullName", phone, relationship, "isPrimary", "createdAt", "updatedAt") FROM stdin;
cmjp9b5dq00342qut3xa0fdof	cmjp9b5do00302qutcz8ixxe4	Contact de Patrick	+243999000050	PARENT	t	2025-12-28 04:56:05.63	2025-12-28 04:56:05.63
cmjp9b5du003a2qut7b8u8fo1	cmjp9b5ds00362qutfs3upehr	Contact de Sylvie	+243999000086	PARENT	t	2025-12-28 04:56:05.635	2025-12-28 04:56:05.635
cmjp9b5dx003g2qutqzxizz8p	cmjp9b5dw003c2qut51f9jsmb	Contact de Emmanuel	+243999000088	PARENT	t	2025-12-28 04:56:05.638	2025-12-28 04:56:05.638
cmjpa65fw00044druy9dgms1v	cmjp9b5d9002o2qutzadoqfx1	Contact de Jean-Pierre	+243999000055	PARENT	t	2025-12-28 05:20:12.044	2025-12-28 05:20:12.044
cmjpa7tye000d4druj0e4z86q	cmjp9b5dh002u2qut60a6yoib	Contact de Marie-Claire	+243999000062	PARENT	t	2025-12-28 05:21:30.47	2025-12-28 05:21:30.47
\.


--
-- Data for Name: EmployeeSpouse; Type: TABLE DATA; Schema: public; Owner: yvesmpunga
--

COPY public."EmployeeSpouse" (id, "employeeId", "lastName", "firstName", "middleName", "dateOfBirth", phone, occupation, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: EmployeeTraining; Type: TABLE DATA; Schema: public; Owner: yvesmpunga
--

COPY public."EmployeeTraining" (id, "employeeId", "trainingId", status, score, "certificateUrl", "completedAt", feedback, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: Evaluation; Type: TABLE DATA; Schema: public; Owner: yvesmpunga
--

COPY public."Evaluation" (id, "evaluationNumber", "employeeId", "evaluatorId", "periodStart", "periodEnd", type, objectives, results, "performanceScore", strengths, "areasToImprove", "employeeComments", "evaluatorComments", recommendations, "trainingNeeds", status, "submittedAt", "completedAt", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: HRDepartment; Type: TABLE DATA; Schema: public; Owner: yvesmpunga
--

COPY public."HRDepartment" (id, code, name, description, "parentId", "managerId", "isActive", "createdAt", "updatedAt") FROM stdin;
cmjp8k1uh000udi8mq3fcoxjx	DG	Direction Générale	Direction générale de l'ANAPI	\N	\N	t	2025-12-28 05:35:01.338+01	2025-12-28 05:35:01.338+01
cmjp8k1uo000vdi8mvy0lvlbr	DAF	Direction Administrative et Financière	Gestion administrative et financière	\N	\N	t	2025-12-28 05:35:01.344+01	2025-12-28 05:35:01.344+01
cmjp8k1up000wdi8mmxzpzga1	DRH	Direction des Ressources Humaines	Gestion des ressources humaines	\N	\N	t	2025-12-28 05:35:01.346+01	2025-12-28 05:35:01.346+01
cmjp8k1uq000xdi8m8bxcynqr	DTI	Direction des Technologies de l'Information	Systèmes d'information et technologies	\N	\N	t	2025-12-28 05:35:01.347+01	2025-12-28 05:35:01.347+01
cmjp8k1us000ydi8mvz7ks5sl	DPI	Direction de la Promotion des Investissements	Promotion et facilitation des investissements	\N	\N	t	2025-12-28 05:35:01.348+01	2025-12-28 05:35:01.348+01
cmjp8k1ut000zdi8mucb22tto	DJC	Direction Juridique et du Contentieux	Affaires juridiques et contentieux	\N	\N	t	2025-12-28 05:35:01.35+01	2025-12-28 05:35:01.35+01
cmjp8k1uv0010di8mfvp5j92p	DGU	Guichet Unique	Service du guichet unique	\N	\N	t	2025-12-28 05:35:01.352+01	2025-12-28 05:35:01.352+01
\.


--
-- Data for Name: Holiday; Type: TABLE DATA; Schema: public; Owner: yvesmpunga
--

COPY public."Holiday" (id, name, date, year, "isRecurring", description, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: Investment; Type: TABLE DATA; Schema: public; Owner: yvesmpunga
--

COPY public."Investment" (id, "projectCode", "projectName", description, "investorId", sector, "subSector", province, city, address, amount, currency, "jobsCreated", "jobsIndirect", "startDate", "endDate", status, progress, "approvalDate", "approvedBy", "rejectionDate", "rejectedBy", "rejectionReason", "createdById", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: Investor; Type: TABLE DATA; Schema: public; Owner: yvesmpunga
--

COPY public."Investor" (id, "investorCode", name, type, category, country, nationality, email, phone, address, city, province, sector, "registrationNumber", "taxId", status, "contactName", "contactEmail", "contactPhone", "contactPosition", "createdById", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: Leave; Type: TABLE DATA; Schema: public; Owner: yvesmpunga
--

COPY public."Leave" (id, "leaveNumber", "employeeId", "leaveTypeId", "startDate", "endDate", days, reason, "documentUrl", status, "approvedById", "approvedAt", "approvalNote", "rejectionReason", "createdAt", "updatedAt") FROM stdin;
cmjpmpl5t0001gcj7nmbrpf9b	LEAVE-2025-00001	cmjp9b5d9002o2qutzadoqfx1	cmjplz3nn0001ui8b452ygvhm	2025-12-30 00:00:00	2025-12-31 00:00:00	2.00	Le travailleur est malade	\N	PENDING	\N	\N	\N	\N	2025-12-28 11:11:14.273	2025-12-28 11:11:14.273
\.


--
-- Data for Name: LeaveBalance; Type: TABLE DATA; Schema: public; Owner: yvesmpunga
--

COPY public."LeaveBalance" (id, "employeeId", "leaveTypeId", year, entitled, taken, pending, balance, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: LeaveType; Type: TABLE DATA; Schema: public; Owner: yvesmpunga
--

COPY public."LeaveType" (id, code, name, description, "defaultDays", "isPaid", "requiresApproval", "requiresDocument", "isActive", "createdAt", "updatedAt", color, "maxDays") FROM stdin;
cmjplz3nk0000ui8b6rx6lcsn	CA	Congé Annuel	Congé annuel payé auquel chaque employé a droit selon le Code du Travail congolais.	26	t	t	f	t	2025-12-28 10:50:38.528	2025-12-28 10:50:38.528	#3B82F6	30
cmjplz3nn0001ui8b452ygvhm	CM	Congé Maladie	Congé pour raison de santé avec certificat médical obligatoire.	15	t	t	t	t	2025-12-28 10:50:38.532	2025-12-28 10:50:38.532	#EF4444	180
cmjplz3np0002ui8b4q4y9vbf	CMAT	Congé de Maternité	Congé accordé aux femmes enceintes avant et après l'accouchement.	98	t	t	t	t	2025-12-28 10:50:38.533	2025-12-28 10:50:38.533	#EC4899	112
cmjplz3nq0003ui8biiy50yhc	CPAT	Congé de Paternité	Congé accordé aux pères à la naissance d'un enfant.	3	t	t	t	t	2025-12-28 10:50:38.534	2025-12-28 10:50:38.534	#06B6D4	10
cmjplz3nr0004ui8bbe8s2csf	CDEUIL	Congé de Deuil	Congé pour décès d'un membre de la famille proche.	3	t	t	t	t	2025-12-28 10:50:38.535	2025-12-28 10:50:38.535	#6B7280	5
cmjplz3ns0005ui8bcgi2g29e	CMAR	Congé de Mariage	Congé accordé à l'occasion du mariage de l'employé.	3	t	t	t	t	2025-12-28 10:50:38.537	2025-12-28 10:50:38.537	#F59E0B	5
cmjplz3nt0006ui8bce4amkwt	CSS	Congé Sans Solde	Congé non rémunéré pour convenances personnelles.	0	f	t	f	t	2025-12-28 10:50:38.538	2025-12-28 10:50:38.538	#8B5CF6	365
cmjplz3nu0007ui8budiw34su	CFORM	Congé de Formation	Congé pour suivre une formation professionnelle.	5	t	t	t	t	2025-12-28 10:50:38.539	2025-12-28 10:50:38.539	#10B981	30
cmjplz3nv0008ui8bapi87dwo	RTT	Récupération (RTT)	Repos compensatoire pour heures supplémentaires effectuées.	0	t	t	f	t	2025-12-28 10:50:38.54	2025-12-28 10:50:38.54	#F97316	12
cmjplz3nx0009ui8bhnij00a2	CEXC	Congé Exceptionnel	Congé pour circonstances exceptionnelles (déménagement, événements familiaux, etc.).	2	t	t	f	t	2025-12-28 10:50:38.541	2025-12-28 10:50:38.541	#14B8A6	5
\.


--
-- Data for Name: LegalDocument; Type: TABLE DATA; Schema: public; Owner: yvesmpunga
--

COPY public."LegalDocument" (id, "documentNumber", type, "subType", "investmentId", "ministryId", "ministryName", province, sector, status, "issueDate", "expiryDate", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: Ministry; Type: TABLE DATA; Schema: public; Owner: yvesmpunga
--

COPY public."Ministry" (id, code, name, "shortName", description, "contactEmail", "contactPhone", address, "isActive", "createdAt", "updatedAt") FROM stdin;
cmjomp25v000lx7hrepp7ao4j	MINES	Ministère des Mines	Min. Mines	\N	\N	\N	\N	t	2025-12-27 18:23:03.476	2025-12-27 18:23:03.476
cmjomp25y000mx7hr7c3n02t3	FINANCES	Ministère des Finances	Min. Finances	\N	\N	\N	\N	t	2025-12-27 18:23:03.478	2025-12-27 18:23:03.478
cmjomp25z000nx7hr3ypsvnki	COMMERCE	Ministère du Commerce	Min. Commerce	\N	\N	\N	\N	t	2025-12-27 18:23:03.479	2025-12-27 18:23:03.479
cmjomp260000ox7hrx0ds05yx	INDUSTRIE	Ministère de l'Industrie	Min. Industrie	\N	\N	\N	\N	t	2025-12-27 18:23:03.48	2025-12-27 18:23:03.48
cmjomp261000px7hrdtmvaw6s	AGRICULTURE	Ministère de l'Agriculture	Min. Agriculture	\N	\N	\N	\N	t	2025-12-27 18:23:03.481	2025-12-27 18:23:03.481
cmjomp262000qx7hr05753t9j	ENVIRONNEMENT	Ministère de l'Environnement	Min. Environnement	\N	\N	\N	\N	t	2025-12-27 18:23:03.482	2025-12-27 18:23:03.482
\.


--
-- Data for Name: PayrollConfig; Type: TABLE DATA; Schema: public; Owner: yvesmpunga
--

COPY public."PayrollConfig" (id, code, name, description, type, rate, amount, "minAmount", "maxAmount", "isEmployerContribution", "isEmployeeContribution", "isActive", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: Payslip; Type: TABLE DATA; Schema: public; Owner: yvesmpunga
--

COPY public."Payslip" (id, "payslipNumber", "employeeId", month, year, "periodStart", "periodEnd", "baseSalary", allowances, "totalAllowances", "grossSalary", deductions, "totalDeductions", "employerContributions", "netSalary", "overtimeHours", "overtimeAmount", advances, status, "paymentDate", "paymentMethod", "paymentReference", "documentUrl", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: Position; Type: TABLE DATA; Schema: public; Owner: yvesmpunga
--

COPY public."Position" (id, code, title, description, responsibilities, requirements, "departmentId", "isActive", "createdAt", "updatedAt", location, "supervisorId", "workDaysPerWeek", "workHoursPerDay") FROM stdin;
cmjp8k1v00012di8mi86q3kii	DG001	Directeur Général	\N	\N	\N	cmjp8k1uh000udi8mq3fcoxjx	t	2025-12-28 04:35:01.356	2025-12-28 05:45:17.227	\N	\N	5	8
cmjp8k1v50014di8mnw30xi3k	DG002	Directeur Général Adjoint	\N	\N	\N	cmjp8k1uh000udi8mq3fcoxjx	t	2025-12-28 04:35:01.362	2025-12-28 05:45:17.229	\N	\N	5	8
cmjp8k1v60016di8my43w3kqp	DG003	Secrétaire de Direction	\N	\N	\N	cmjp8k1uh000udi8mq3fcoxjx	t	2025-12-28 04:35:01.363	2025-12-28 05:45:17.23	\N	\N	5	8
cmjp8k1v80018di8myimfcjym	DAF001	Directeur Administratif et Financier	\N	\N	\N	cmjp8k1uo000vdi8mvy0lvlbr	t	2025-12-28 04:35:01.364	2025-12-28 05:45:17.231	\N	\N	5	8
cmjp8k1va001adi8mp4gvkq26	DAF002	Chef Comptable	\N	\N	\N	cmjp8k1uo000vdi8mvy0lvlbr	t	2025-12-28 04:35:01.366	2025-12-28 05:45:17.231	\N	\N	5	8
cmjp8k1vc001cdi8mo5i3wpit	DAF003	Comptable	\N	\N	\N	cmjp8k1uo000vdi8mvy0lvlbr	t	2025-12-28 04:35:01.369	2025-12-28 05:45:17.232	\N	\N	5	8
cmjp8k1vf001gdi8mwfsuioqh	DRH001	Directeur des Ressources Humaines	\N	\N	\N	cmjp8k1up000wdi8mmxzpzga1	t	2025-12-28 04:35:01.371	2025-12-28 05:45:17.233	\N	\N	5	8
cmjp8k1vg001idi8mj2dbjgvx	DRH002	Responsable Paie	\N	\N	\N	cmjp8k1up000wdi8mmxzpzga1	t	2025-12-28 04:35:01.373	2025-12-28 05:45:17.233	\N	\N	5	8
cmjp8k1vh001kdi8m90vm43m6	DRH003	Gestionnaire RH	\N	\N	\N	cmjp8k1up000wdi8mmxzpzga1	t	2025-12-28 04:35:01.374	2025-12-28 05:45:17.234	\N	\N	5	8
cmjp8k1vi001mdi8m4puffvie	DRH004	Chargé de Recrutement	\N	\N	\N	cmjp8k1up000wdi8mmxzpzga1	t	2025-12-28 04:35:01.375	2025-12-28 05:45:17.234	\N	\N	5	8
cmjp8k1vk001odi8m4ywud8bo	DTI001	Directeur IT	\N	\N	\N	cmjp8k1uq000xdi8m8bxcynqr	t	2025-12-28 04:35:01.376	2025-12-28 05:45:17.234	\N	\N	5	8
cmjp8k1vl001qdi8mjzydbg2i	DTI002	Développeur Senior	\N	\N	\N	cmjp8k1uq000xdi8m8bxcynqr	t	2025-12-28 04:35:01.377	2025-12-28 05:45:17.235	\N	\N	5	8
cmjp8k1vm001sdi8mrqmu9sq6	DTI003	Développeur Junior	\N	\N	\N	cmjp8k1uq000xdi8m8bxcynqr	t	2025-12-28 04:35:01.378	2025-12-28 05:45:17.235	\N	\N	5	8
cmjp8k1vn001udi8mb3hgx03o	DTI004	Administrateur Système	\N	\N	\N	cmjp8k1uq000xdi8m8bxcynqr	t	2025-12-28 04:35:01.379	2025-12-28 05:45:17.236	\N	\N	5	8
cmjp8k1vo001wdi8ms9h5eexa	DTI005	Technicien Support	\N	\N	\N	cmjp8k1uq000xdi8m8bxcynqr	t	2025-12-28 04:35:01.38	2025-12-28 05:45:17.236	\N	\N	5	8
cmjp8k1vp001ydi8m6iuunvyf	DPI001	Directeur de la Promotion	\N	\N	\N	cmjp8k1us000ydi8mvz7ks5sl	t	2025-12-28 04:35:01.382	2025-12-28 05:45:17.236	\N	\N	5	8
cmjp8k1vq0020di8m6b5bzc8t	DPI002	Chargé de Promotion	\N	\N	\N	cmjp8k1us000ydi8mvz7ks5sl	t	2025-12-28 04:35:01.383	2025-12-28 05:45:17.237	\N	\N	5	8
cmjp8k1vs0022di8m4je7ohxk	DPI003	Analyste Investissements	\N	\N	\N	cmjp8k1us000ydi8mvz7ks5sl	t	2025-12-28 04:35:01.384	2025-12-28 05:45:17.238	\N	\N	5	8
cmjp8k1vt0024di8misbqg5nc	DJC001	Directeur Juridique	\N	\N	\N	cmjp8k1ut000zdi8mucb22tto	t	2025-12-28 04:35:01.386	2025-12-28 05:45:17.238	\N	\N	5	8
cmjp8k1vu0026di8m0ky7kgf2	DJC002	Juriste Senior	\N	\N	\N	cmjp8k1ut000zdi8mucb22tto	t	2025-12-28 04:35:01.387	2025-12-28 05:45:17.239	\N	\N	5	8
cmjp8k1vw0028di8maenbhhhx	DJC003	Juriste	\N	\N	\N	cmjp8k1ut000zdi8mucb22tto	t	2025-12-28 04:35:01.388	2025-12-28 05:45:17.24	\N	\N	5	8
cmjp8k1vx002adi8mw2gqcdu8	DGU001	Responsable Guichet Unique	\N	\N	\N	cmjp8k1uv0010di8mfvp5j92p	t	2025-12-28 04:35:01.389	2025-12-28 05:45:17.24	\N	\N	5	8
cmjp8k1vy002cdi8m4wd38pz3	DGU002	Agent Guichet	\N	\N	\N	cmjp8k1uv0010di8mfvp5j92p	t	2025-12-28 04:35:01.391	2025-12-28 05:45:17.241	\N	\N	5	8
cmjp8k1w1002edi8m7kh9f23n	DGU003	Assistant Guichet	\N	\N	\N	cmjp8k1uv0010di8mfvp5j92p	t	2025-12-28 04:35:01.394	2025-12-28 05:45:17.242	\N	\N	5	8
cmjp8k1ve001edi8m1p9n3yyp	DAF004	Assistant Administratif	\N	\N	\N	cmjp8k1uo000vdi8mvy0lvlbr	t	2025-12-28 04:35:01.37	2025-12-28 07:45:11.556	\N	\N	5	8
\.


--
-- Data for Name: Province; Type: TABLE DATA; Schema: public; Owner: yvesmpunga
--

COPY public."Province" (id, code, name, capital, population, area, "isActive", "createdAt", "updatedAt") FROM stdin;
cmjomofsn000bjhjmaomn4zl5	KIN	Kinshasa	Kinshasa	\N	\N	t	2025-12-27 18:22:34.487	2025-12-27 18:22:34.487
cmjomofsp000cjhjmmfq29ufa	HKA	Haut-Katanga	Lubumbashi	\N	\N	t	2025-12-27 18:22:34.489	2025-12-27 18:22:34.489
cmjomofsq000djhjmg1bgk6sw	LUA	Lualaba	Kolwezi	\N	\N	t	2025-12-27 18:22:34.49	2025-12-27 18:22:34.49
cmjomofsr000ejhjmz9x3fwrh	NKI	Nord-Kivu	Goma	\N	\N	t	2025-12-27 18:22:34.491	2025-12-27 18:22:34.491
cmjomofsr000fjhjmgh3ewr5c	SKI	Sud-Kivu	Bukavu	\N	\N	t	2025-12-27 18:22:34.492	2025-12-27 18:22:34.492
cmjomofss000gjhjmk11g62v2	KOC	Kongo-Central	Matadi	\N	\N	t	2025-12-27 18:22:34.493	2025-12-27 18:22:34.493
cmjomofst000hjhjm4zedearj	EQU	Équateur	Mbandaka	\N	\N	t	2025-12-27 18:22:34.493	2025-12-27 18:22:34.493
cmjomofsu000ijhjm3d1k9icw	KAS	Kasaï	Tshikapa	\N	\N	t	2025-12-27 18:22:34.494	2025-12-27 18:22:34.494
cmjomofsu000jjhjmtjr9wluq	TAN	Tanganyika	Kalemie	\N	\N	t	2025-12-27 18:22:34.495	2025-12-27 18:22:34.495
cmjomofsv000kjhjmlzhjhg6l	IUR	Ituri	Bunia	\N	\N	t	2025-12-27 18:22:34.496	2025-12-27 18:22:34.496
8be9273d-1acb-499a-bad0-85045c48c4c2	KWA	Kwango	Kenge	2045000	89974	t	2026-01-02 10:53:27.508	2026-01-02 10:53:27.508
fa8dc2bf-69ba-4e6d-8eee-20f380afa2e4	KWI	Kwilu	Kikwit	5174000	78219	t	2026-01-02 10:53:27.512	2026-01-02 10:53:27.512
d68bf654-711d-4a51-951e-0222d79fa572	MAI	Mai-Ndombe	Inongo	1768000	127465	t	2026-01-02 10:53:27.514	2026-01-02 10:53:27.514
1814ac5d-c208-4b64-9c43-1d7793f4ac4f	SUD	Sud-Ubangi	Gemena	2744000	51648	t	2026-01-02 10:53:27.516	2026-01-02 10:53:27.516
7fbe84fb-bb5f-4add-ab5e-9866b9988378	NOR	Nord-Ubangi	Gbadolite	1482000	56644	t	2026-01-02 10:53:27.517	2026-01-02 10:53:27.517
a5c5ce08-bfec-4f21-9216-1450baffc402	MON	Mongala	Lisala	1793000	58141	t	2026-01-02 10:53:27.519	2026-01-02 10:53:27.519
bc520b58-36b4-4d18-bded-c7927c6a47ef	TSH	Tshuapa	Boende	1316000	132957	t	2026-01-02 10:53:27.52	2026-01-02 10:53:27.52
82e038d5-14db-4501-9018-f310747c08e7	TOP	Tshopo	Kisangani	2614000	199567	t	2026-01-02 10:53:27.521	2026-01-02 10:53:27.521
af077cc1-b91e-47b3-9a4d-9d6d5b70ed5d	BAS	Bas-Uele	Buta	1093000	148331	t	2026-01-02 10:53:27.523	2026-01-02 10:53:27.523
8804ac19-8c41-4ffe-a101-1a958f712b14	HAU	Haut-Uele	Isiro	1920000	89683	t	2026-01-02 10:53:27.524	2026-01-02 10:53:27.524
9bf56c6f-d560-4248-9246-3cc0ad95752d	MAN	Maniema	Kindu	2333000	132250	t	2026-01-02 10:53:27.528	2026-01-02 10:53:27.528
44a2fd55-34cf-4236-922a-e31a4433cec8	HLO	Haut-Lomami	Kamina	2540000	108204	t	2026-01-02 10:53:27.529	2026-01-02 10:53:27.529
0b85bdf5-cb21-4b2a-a5b3-fa549d42d9df	LOM	Lomami	Kabinda	2048000	56426	t	2026-01-02 10:53:27.531	2026-01-02 10:53:27.531
484c65de-6b01-44ba-9bec-d2119e0b0b2e	SKA	Sankuru	Lusambo	1374000	104331	t	2026-01-02 10:53:27.532	2026-01-02 10:53:27.532
634101a8-bf8a-4be5-bfef-8894b84e5937	KAC	Kasai-Central	Kananga	2976000	60958	t	2026-01-02 10:53:27.534	2026-01-02 10:53:27.534
a393dca1-e20e-41a7-8f53-bc3432296eae	KAO	Kasai-Oriental	Mbuji-Mayi	5475000	9545	t	2026-01-02 10:53:27.535	2026-01-02 10:53:27.535
\.


--
-- Data for Name: SalaryAdvance; Type: TABLE DATA; Schema: public; Owner: yvesmpunga
--

COPY public."SalaryAdvance" (id, "advanceNumber", "employeeId", amount, reason, "repaymentMonths", "monthlyDeduction", "remainingAmount", status, "approvedById", "approvedAt", "disbursementDate", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: SalaryGrade; Type: TABLE DATA; Schema: public; Owner: yvesmpunga
--

COPY public."SalaryGrade" (id, code, name, level, "minSalary", "maxSalary", description, "isActive", "createdAt", "updatedAt") FROM stdin;
cmjp8q8bs0011v49gldd6xlul	G1	Grade 1 - Directeur	1	5000.00	8000.00	Niveau Direction	t	2025-12-28 04:39:49.673	2025-12-28 04:39:49.673
cmjp8q8bx0013v49grxy09d72	G3	Grade 3 - Chef de Service	3	3000.00	4500.00	Niveau Chef de Service	t	2025-12-28 04:39:49.677	2025-12-28 04:39:49.677
cmjp8q8by0014v49g8ad7nkpi	G4	Grade 4 - Cadre Senior	4	2500.00	3500.00	Niveau Cadre Supérieur	t	2025-12-28 04:39:49.678	2025-12-28 04:39:49.678
cmjp8q8bz0015v49gg182b3eg	G5	Grade 5 - Cadre	5	1800.00	2800.00	Niveau Cadre	t	2025-12-28 04:39:49.68	2025-12-28 04:39:49.68
cmjp8q8c00016v49g1q5pod9f	G6	Grade 6 - Agent Senior	6	1200.00	1800.00	Niveau Agent Supérieur	t	2025-12-28 04:39:49.68	2025-12-28 04:39:49.68
cmjp8q8c10017v49gi3wy7g6y	G7	Grade 7 - Agent	7	800.00	1200.00	Niveau Agent	t	2025-12-28 04:39:49.681	2025-12-28 04:39:49.681
cmjp8q8c20018v49gd9s90x8q	G8	Grade 8 - Assistant	8	500.00	800.00	Niveau Assistant	t	2025-12-28 04:39:49.682	2025-12-28 04:39:49.682
cmjp8q8bw0012v49gy5ubadbe	G2	Grade 2 - Directeur Adjoint	2	4000.00	6000.00	Niveau Direction Adjointe	t	2025-12-28 04:39:49.676	2025-12-28 07:01:56.042
\.


--
-- Data for Name: Sector; Type: TABLE DATA; Schema: public; Owner: yvesmpunga
--

COPY public."Sector" (id, code, name, description, "parentId", "isActive", "createdAt", "updatedAt") FROM stdin;
cmjomnpxf0003hpvy5413zuvg	MIN	Mines & Carrières	Extraction minière et exploitation de carrières	\N	t	2025-12-27 18:22:00.964	2025-12-27 18:22:00.964
cmjomnpxi0004hpvyzv9vjjlo	AGR	Agriculture	Agriculture, élevage et pêche	\N	t	2025-12-27 18:22:00.966	2025-12-27 18:22:00.966
cmjomnpxj0005hpvy0rclbdjp	ENE	Énergie	Production et distribution d'énergie	\N	t	2025-12-27 18:22:00.967	2025-12-27 18:22:00.967
cmjomnpxk0006hpvyg3sijg8i	IND	Industrie	Industrie manufacturière	\N	t	2025-12-27 18:22:00.968	2025-12-27 18:22:00.968
cmjomnpxl0007hpvylykjua5i	TEC	Technologies	Technologies de l'information et communication	\N	t	2025-12-27 18:22:00.969	2025-12-27 18:22:00.969
cmjomnpxn0008hpvyrol8hgxc	SER	Services	Services financiers et professionnels	\N	t	2025-12-27 18:22:00.971	2025-12-27 18:22:00.971
cmjomnpxo0009hpvyihgdbsvl	TOU	Tourisme	Hôtellerie et tourisme	\N	t	2025-12-27 18:22:00.973	2025-12-27 18:22:00.973
cmjomnpxq000ahpvy09hd1avy	CON	Construction	Bâtiment et travaux publics	\N	t	2025-12-27 18:22:00.974	2025-12-27 18:22:00.974
\.


--
-- Data for Name: Session; Type: TABLE DATA; Schema: public; Owner: yvesmpunga
--

COPY public."Session" (id, "sessionToken", "userId", expires, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: Training; Type: TABLE DATA; Schema: public; Owner: yvesmpunga
--

COPY public."Training" (id, code, title, description, category, provider, duration, "startDate", "endDate", location, cost, currency, "maxParticipants", status, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: User; Type: TABLE DATA; Schema: public; Owner: yvesmpunga
--

COPY public."User" (id, name, email, "emailVerified", password, image, role, department, phone, "isActive", "createdAt", "updatedAt", "ministryId", modules) FROM stdin;
cmjomlta40001pwlr2dusnzjt	Agent ANAPI	agent@anapi.cd	\N	$2b$12$b77JD1QG.JbxAwd4Jh5sZ.O0foFkNlvwYO9Bny2We2p2M3yv7nPGy	\N	AGENT	\N	+243 999 000 002	t	2025-12-27 19:20:31.997+01	2025-12-27 19:20:31.997+01	\N	[]
cmjomnpxc0002hpvysngs00i2	Jean Kabila	investor@demo.cd	\N	$2b$12$xof4mmJxN2heTxgMuZlNTeyUytTpzAsTYHgYfs5LXdrrScLdo33iG	\N	USER	Congo Mining Corporation	+243 999 000 003	t	2025-12-27 19:22:00.961+01	2025-12-27 19:22:00.961+01	\N	[]
cmjomlt9y0000pwlroksodx16	Admin ANAPI	admin@anapi.cd	\N	$2b$10$AtMYS8NWChMXPlbaudb5funKNir78ix0zCULgITXdoJQmHYifVxvK	\N	ADMIN	\N	+243 999 000 001	t	2025-12-27 19:20:31.991+01	2025-12-29 02:15:24.246+01	\N	[]
cmjopae590000zjq2jkhfrkre	Yves Mpunga	yves2@gmail.com	\N	$2b$12$CUzzU0aNQY.r//i.M1sUGuFaCZrUT.hw24.QGrZKTKCYWsNY7BEu.	/images/utilisateurs/1767346854000-memld.jpeg	ADMIN	\N	\N	t	2025-12-27 20:35:38.014+01	2026-01-02 10:40:54+01	\N	[]
\.


--
-- Data for Name: VerificationToken; Type: TABLE DATA; Schema: public; Owner: yvesmpunga
--

COPY public."VerificationToken" (identifier, token, expires, id) FROM stdin;
\.


--
-- Data for Name: WorkerCategory; Type: TABLE DATA; Schema: public; Owner: yvesmpunga
--

COPY public."WorkerCategory" (id, code, name, description, "baseSalary", "hourlyRate", "paymentType", "currencyId", "subjectToIPR", "subjectToCNSS", "subjectToINPP", "subjectToONEM", "iprRate", "cnssEmployeeRate", "cnssEmployerRate", "inppRate", "onemRate", "workHoursPerDay", "workDaysPerMonth", "overtimeRate", "isActive", "createdAt", "updatedAt") FROM stdin;
cmjpb2evf002o10yi82e4h58p	CAD-SUP	Cadre Supérieur	Directeurs, chefs de département et managers seniors	3500.00	\N	MONTHLY	cmjp8k1u9000rdi8mu14sqwzc	t	t	t	f	15.00	5.00	9.00	1.00	0.20	8	22	1.50	t	2025-12-28 05:45:17.259	2025-12-28 05:45:17.259
cmjpb2evj002q10yifoebwy26	CAD-MOY	Cadre Moyen	Chefs de service, coordinateurs et superviseurs	2000.00	\N	MONTHLY	cmjp8k1u9000rdi8mu14sqwzc	t	t	t	f	10.00	5.00	9.00	1.00	0.20	8	22	1.50	t	2025-12-28 05:45:17.264	2025-12-28 05:45:17.264
cmjpb2evl002s10yijmxy5nqz	AGENT	Agent	Agents administratifs et techniciens	800.00	\N	MONTHLY	cmjp8k1u9000rdi8mu14sqwzc	t	t	f	f	5.00	5.00	9.00	1.00	0.20	8	22	1.50	t	2025-12-28 05:45:17.265	2025-12-28 05:45:17.265
cmjpb2evn002w10yi0xs6d5gv	JOURN	Journalier	Travailleurs payés à la journée	25000.00	3125.00	DAILY	cmjp8k1ue000sdi8muamnwvfr	f	f	f	f	0.00	0.00	0.00	1.00	0.20	8	22	1.50	t	2025-12-28 05:45:17.268	2025-12-28 05:45:17.268
cmjpb2evm002u10yixwe6rcn7	OUVRIER	Ouvrier	Personnel d'exécution et de maintenance	500000.00	\N	MONTHLY	cmjp8k1ue000sdi8muamnwvfr	f	t	f	f	0.00	5.00	9.00	1.00	0.20	8	22	1.50	t	2025-12-28 05:45:17.267	2025-12-28 06:34:30.831
\.


--
-- Data for Name: actes_administratifs; Type: TABLE DATA; Schema: public; Owner: yvesmpunga
--

COPY public.actes_administratifs (id, code, name, "shortName", description, category, "sectorId", "ministryId", "legalBasis", "legalDelayDays", "warningDelayDays", cost, "costCDF", currency, "validityMonths", "isRenewable", "renewalDelayDays", "workflowType", instructions, prerequisites, "isActive", "createdAt", "updatedAt") FROM stdin;
8066a734-fa8a-4878-847e-7e5bb5a4b617	AGR-CI-001	Agrement au Code des Investissements	Agrement CI	Agrement permettant de beneficier des avantages fiscaux et douaniers prevus par le Code des Investissements de la RDC	AGREMENT	\N	488984b3-173c-4944-9bb6-ebe597b69d43	Loi n° 004/2002 du 21 fevrier 2002 portant Code des Investissements	30	5	500.00	\N	USD	60	t	90	AGREMENT	Deposer le dossier complet au guichet unique de l'ANAPI. Delai de traitement: 30 jours ouvrables.	Etre une entreprise legalement constituee en RDC. Projet d'investissement minimum de 200.000 USD.	t	2025-12-29 06:44:47.379+01	2025-12-29 06:44:47.379+01
862f5733-01f2-493c-8d58-eebb411934b0	LIC-IMP-001	Licence d'importation	Licence Import	Licence autorisant l'importation de marchandises en RDC	LICENCE	0ead10da-d54e-423f-a77d-39d0cf505301	abe2ef02-9479-40ef-9b64-04b2d851df11	Ordonnance-Loi n° 10/002 du 20 aout 2010	15	3	200.00	\N	USD	12	t	30	DOSSIER	\N	\N	t	2025-12-29 06:44:47.385+01	2025-12-29 06:44:47.385+01
3f39bcd2-740c-44e2-be00-b263acb7268f	PER-MIN-001	Permis d'exploitation miniere	PE Minier	Permis autorisant l'exploitation de substances minerales	PERMIS	c1c50065-a923-4d2f-aec4-e2f9e93e396b	72b9abbd-b70e-46cc-bae4-eee5cb71325d	Loi n° 007/2002 du 11 juillet 2002 portant Code Minier	60	10	5000.00	\N	USD	300	t	180	DOSSIER	\N	\N	t	2025-12-29 06:44:47.387+01	2025-12-29 06:44:47.387+01
67f382b3-3e04-4e4c-b722-341c322e9230	AUT-IND-001	Autorisation d'exploitation industrielle	Autorisation Indus	Autorisation d'exploiter une unite industrielle en RDC	AUTORISATION	a4324488-6fcd-427e-afe6-b6d2a071f632	d31c0252-90de-4fae-8fb9-f001f0a6591e	Decret n° 08/010 du 30 janvier 2008	45	7	1000.00	\N	USD	\N	f	\N	DOSSIER	\N	\N	t	2025-12-29 06:44:47.389+01	2025-12-29 06:44:47.389+01
781da678-84a7-4717-93bc-41beeaaa587d	CER-ORI-001	Certificat d'origine	Certificat Origine	Document attestant l'origine des marchandises exportees	CERTIFICAT	0ead10da-d54e-423f-a77d-39d0cf505301	abe2ef02-9479-40ef-9b64-04b2d851df11	\N	5	1	50.00	\N	USD	6	f	\N	DOSSIER	\N	\N	t	2025-12-29 06:44:47.391+01	2025-12-29 06:44:47.391+01
9c5e4642-47ba-4e86-b663-5b6c0306eea5	ATT-ENV-001	Attestation de conformite environnementale	ACE	Attestation delivree apres verification de la conformite environnementale d'une installation	ATTESTATION	\N	222a177a-1027-4909-8da1-1c551c65ffe2	Loi n° 11/009 du 09 juillet 2011 portant principes fondamentaux relatifs a la protection de l'environnement	30	5	300.00	\N	USD	24	t	60	DOSSIER	\N	\N	t	2025-12-29 06:44:47.393+01	2025-12-29 06:44:47.393+01
\.


--
-- Data for Name: application_documents; Type: TABLE DATA; Schema: public; Owner: yvesmpunga
--

COPY public.application_documents (id, "applicationId", "requiredDocumentId", name, "fileName", "filePath", "fileSize", "mimeType", status, "verifiedAt", "verifiedById", "verificationNotes", "uploadedById", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: approvals; Type: TABLE DATA; Schema: public; Owner: yvesmpunga
--

COPY public.approvals (id, investment_id, type, status, assigned_to, reviewed_by, reviewed_at, comments, documents, due_date, sort_order, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: attendances; Type: TABLE DATA; Schema: public; Owner: yvesmpunga
--

COPY public.attendances (id, employee_id, date, check_in, check_out, break_start, break_end, working_hours, break_hours, overtime_hours, status, late_minutes, early_leave_minutes, work_location, location_details, check_in_latitude, check_in_longitude, check_out_latitude, check_out_longitude, absence_reason, is_justified, justification_document, leave_id, notes, is_validated, validated_by_id, validated_at, source, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: barrier_resolutions; Type: TABLE DATA; Schema: public; Owner: yvesmpunga
--

COPY public.barrier_resolutions (id, "barrierId", "actionType", description, "previousStatus", "newStatus", "contactName", "contactOrganization", "contactEmail", "actionDate", "followUpDate", outcome, attachments, "isInternal", "performedById", "createdAt", "updatedAt") FROM stdin;
1a19746f-e93a-4984-87c3-ef9129d3e688	7563d7a1-0ad3-4b76-9cc7-524d4cf67147	STATUS_CHANGE	Obstacle signalé et enregistré dans le système	\N	REPORTED	\N	\N	\N	2026-01-04 18:24:06.831+01	\N	\N	[]	f	cmjopae590000zjq2jkhfrkre	2026-01-04 18:24:06.831+01	2026-01-04 18:24:06.831+01
f38b48db-0206-4a2a-b52b-3848aedd6185	7dfafa5b-ae6e-4016-a325-f70a9057ee80	STATUS_CHANGE	Obstacle signalé et enregistré dans le système	\N	REPORTED	\N	\N	\N	2026-01-04 18:29:55.44+01	\N	\N	[]	f	cmjopae590000zjq2jkhfrkre	2026-01-04 18:29:55.441+01	2026-01-04 18:29:55.441+01
9d403796-3a63-4543-b2ef-77dbdd53a5ef	13ab78a5-9cea-450a-ad3a-51f82255ed84	STATUS_CHANGE	Obstacle signalé et enregistré dans le système	\N	REPORTED	\N	\N	\N	2026-01-04 19:02:17.48+01	\N	\N	[]	f	cmjopae590000zjq2jkhfrkre	2026-01-04 19:02:17.48+01	2026-01-04 19:02:17.48+01
7323c071-1095-4d26-ae64-eec54cf8030d	f9908f8e-1e2f-4a5e-881f-f1b747e504e0	STATUS_CHANGE	Obstacle signalé et enregistré dans le système	\N	REPORTED	\N	\N	\N	2026-01-04 19:13:22.452+01	\N	\N	[]	f	cmjopae590000zjq2jkhfrkre	2026-01-04 19:13:22.452+01	2026-01-04 19:13:22.452+01
939f9394-4d42-41b3-b599-f0e34ed09ca7	f9908f8e-1e2f-4a5e-881f-f1b747e504e0	STATUS_CHANGE	dfsdf	REPORTED	REPORTED	\N	\N	\N	2026-01-04 19:13:42.762+01	2026-01-21 01:00:00+01	\N	[]	f	cmjopae590000zjq2jkhfrkre	2026-01-04 19:13:42.762+01	2026-01-04 19:13:42.762+01
\.


--
-- Data for Name: bidder_ratings; Type: TABLE DATA; Schema: public; Owner: yvesmpunga
--

COPY public.bidder_ratings (id, bidder_id, contract_id, tender_id, evaluation_type, evaluation_date, evaluation_period, quality_score, delivery_score, price_score, communication_score, compliance_score, safety_score, environmental_score, overall_score, criteria_weights, incidents_count, penalties_applied, delays_count, total_delay_days, strengths, weaknesses, improvements, recommendation, notes, status, evaluated_by_id, approved_by_id, approved_at, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: business_barriers; Type: TABLE DATA; Schema: public; Owner: yvesmpunga
--

COPY public.business_barriers (id, reference, title, description, category, severity, status, "estimatedImpact", "concernedAdministration", province, sector, "reportSource", "reporterName", "reporterEmail", "reporterPhone", "reportedAt", "acknowledgedAt", "resolvedAt", "closedAt", "targetResolutionDays", resolution, "resolutionType", "internalNotes", attachments, "investorId", "projectId", "assignedToId", "createdById", "resolvedById", "createdAt", "updatedAt") FROM stdin;
1a64a2c1-c0d2-4496-8228-42f1b85762fe	OBS-2026-0001	sfsd	sdfds	ADMINISTRATIVE	MEDIUM	REPORTED	2300.00	\N	Kinshasa	Agriculture	INVESTOR	\N	\N	\N	2026-01-04 18:09:49.119+01	\N	\N	\N	30	\N	\N	\N	[]	fc31a1f8-536a-4bef-91ab-e74a69fc7709	e9a739d4-b37d-4913-9d00-eb2727d21a46	\N	\N	\N	2026-01-04 18:09:49.12+01	2026-01-04 18:09:49.12+01
7fa29749-1868-471d-8479-8765b846c24e	OBS-2026-0002	sfsd	sdfds	ADMINISTRATIVE	MEDIUM	REPORTED	2300.00	\N	Kinshasa	Agriculture	INVESTOR	\N	\N	\N	2026-01-04 18:10:05.134+01	\N	\N	\N	30	\N	\N	\N	[]	fc31a1f8-536a-4bef-91ab-e74a69fc7709	e9a739d4-b37d-4913-9d00-eb2727d21a46	\N	\N	\N	2026-01-04 18:10:05.135+01	2026-01-04 18:10:05.135+01
7563d7a1-0ad3-4b76-9cc7-524d4cf67147	OBS-2026-0003	Teste obstacle	sdsd	ADMINISTRATIVE	HIGH	REPORTED	5000.00	sdsds	Kinshasa	Agriculture	INVESTOR	sfd	fdf@gmail.com	35435	2026-01-04 18:24:06.821+01	\N	\N	\N	30	\N	\N	sdsds	[]	6259bec5-8494-4bbc-b311-6387273a4999	e9a739d4-b37d-4913-9d00-eb2727d21a46	\N	cmjopae590000zjq2jkhfrkre	\N	2026-01-04 18:24:06.822+01	2026-01-04 18:24:06.822+01
7dfafa5b-ae6e-4016-a325-f70a9057ee80	OBS-2026-0004	Teste obstracle	cvc	FISCAL	HIGH	REPORTED	4500.00	dsdffsd	Kwango	Agriculture	INVESTOR	fs	dffd@gmail.com	343434	2026-01-04 18:29:55.435+01	\N	\N	\N	30	\N	\N	fg	[]	6259bec5-8494-4bbc-b311-6387273a4999	e9a739d4-b37d-4913-9d00-eb2727d21a46	\N	cmjopae590000zjq2jkhfrkre	\N	2026-01-04 18:29:55.436+01	2026-01-04 18:29:55.436+01
13ab78a5-9cea-450a-ad3a-51f82255ed84	OBS-2026-0005	dasd	adfsdf	ADMINISTRATIVE	HIGH	REPORTED	780.00	sdfsd	Kinshasa	Mines	INVESTOR	sdf	sdf@gmail.com	345345345	2026-01-04 19:02:17.474+01	\N	\N	\N	30	\N	\N	gdfg	[]	6259bec5-8494-4bbc-b311-6387273a4999	e9a739d4-b37d-4913-9d00-eb2727d21a46	\N	cmjopae590000zjq2jkhfrkre	\N	2026-01-04 19:02:17.475+01	2026-01-04 19:02:17.475+01
f9908f8e-1e2f-4a5e-881f-f1b747e504e0	OBS-2026-0006	fgdfgf	dfgfd	ADMINISTRATIVE	HIGH	REPORTED	600.00	fdgfd	Kinshasa	Mines	INVESTOR	dfg	rtd@gmail.com	54545	2026-01-04 19:13:22.448+01	\N	\N	\N	30	\N	\N	fgd	[]	6259bec5-8494-4bbc-b311-6387273a4999	e9a739d4-b37d-4913-9d00-eb2727d21a46	\N	cmjopae590000zjq2jkhfrkre	\N	2026-01-04 19:13:22.448+01	2026-01-04 19:13:22.448+01
\.


--
-- Data for Name: cities; Type: TABLE DATA; Schema: public; Owner: yvesmpunga
--

COPY public.cities (id, code, name, name_fr, name_en, name_pt, name_es, name_ar, province_id, city_type, population, area, latitude, longitude, postal_code, description, sort_order, is_active, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: climate_indicator_values; Type: TABLE DATA; Schema: public; Owner: yvesmpunga
--

COPY public.climate_indicator_values (id, "indicatorId", year, quarter, month, value, "previousValue", "changePercentage", rank, "rankOutOf", "regionalAverage", "regionalRank", notes, source, "sourceUrl", "publishedDate", "isVerified", "verifiedAt", "verifiedById", "createdById", "createdAt", "updatedAt") FROM stdin;
badb972c-6809-498a-96dc-04adbaeae892	0a11c2eb-ae3d-4c0d-80cd-71b90b4c79be	2020	\N	\N	36.2000	\N	0.30	183	190	\N	\N	\N	\N	\N	\N	t	\N	\N	\N	2026-01-05 08:55:18.595562+01	2026-01-05 08:55:18.595562+01
004a564a-5935-4833-a854-0a0da26f98c6	0a11c2eb-ae3d-4c0d-80cd-71b90b4c79be	2019	\N	\N	35.9000	\N	1.10	184	190	\N	\N	\N	\N	\N	\N	t	\N	\N	\N	2026-01-05 08:55:18.597842+01	2026-01-05 08:55:18.597842+01
9a38d599-690f-4441-8de6-1b0aabb41014	0a11c2eb-ae3d-4c0d-80cd-71b90b4c79be	2018	\N	\N	35.5000	\N	\N	182	190	\N	\N	\N	\N	\N	\N	t	\N	\N	\N	2026-01-05 08:55:18.598505+01	2026-01-05 08:55:18.598505+01
a6ac6f7e-c7bf-4c9a-9a75-56c8bcba56de	c1330501-7425-4dff-a63a-eb7b631a123f	2020	\N	\N	183.0000	\N	-0.50	\N	\N	\N	\N	\N	\N	\N	\N	t	\N	\N	\N	2026-01-05 08:55:18.599617+01	2026-01-05 08:55:18.599617+01
af4526e6-ee08-4c3e-9f89-92638662f023	c1330501-7425-4dff-a63a-eb7b631a123f	2019	\N	\N	184.0000	\N	1.10	\N	\N	\N	\N	\N	\N	\N	\N	t	\N	\N	\N	2026-01-05 08:55:18.60024+01	2026-01-05 08:55:18.60024+01
fc1454f0-8263-47e4-b1f8-1875d49ca1d7	c1330501-7425-4dff-a63a-eb7b631a123f	2018	\N	\N	182.0000	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	t	\N	\N	\N	2026-01-05 08:55:18.600772+01	2026-01-05 08:55:18.600772+01
4a1de73a-d4dd-4814-ae68-a3086e6bddc5	534aaf52-c010-4ef8-930d-a39003bde9b0	2020	\N	\N	27.0000	\N	-10.00	\N	\N	\N	\N	\N	\N	\N	\N	t	\N	\N	\N	2026-01-05 08:55:18.601898+01	2026-01-05 08:55:18.601898+01
77ee61d6-50b0-4251-bc50-3ce5fe0fea94	534aaf52-c010-4ef8-930d-a39003bde9b0	2019	\N	\N	30.0000	\N	-6.25	\N	\N	\N	\N	\N	\N	\N	\N	t	\N	\N	\N	2026-01-05 08:55:18.602339+01	2026-01-05 08:55:18.602339+01
1714e481-b61c-49d8-add8-bad547c036c8	534aaf52-c010-4ef8-930d-a39003bde9b0	2018	\N	\N	32.0000	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	t	\N	\N	\N	2026-01-05 08:55:18.602688+01	2026-01-05 08:55:18.602688+01
b5ae2d64-0cd2-4d26-a42a-b009e9b797c7	1362ecbb-6ecf-4250-82ce-cd45630f7b91	2024	\N	\N	20.0000	\N	0.00	162	180	\N	\N	\N	\N	\N	\N	t	\N	\N	\N	2026-01-05 08:55:18.603666+01	2026-01-05 08:55:18.603666+01
11fa0937-f34e-48b1-9c97-c86a9dd7d5bc	1362ecbb-6ecf-4250-82ce-cd45630f7b91	2023	\N	\N	20.0000	\N	-4.80	166	180	\N	\N	\N	\N	\N	\N	t	\N	\N	\N	2026-01-05 08:55:18.604065+01	2026-01-05 08:55:18.604065+01
2e7d3d39-bcb5-4282-83d0-fb201a5e219e	1362ecbb-6ecf-4250-82ce-cd45630f7b91	2022	\N	\N	21.0000	\N	\N	169	180	\N	\N	\N	\N	\N	\N	t	\N	\N	\N	2026-01-05 08:55:18.604424+01	2026-01-05 08:55:18.604424+01
d08bb204-1a20-4397-9a5f-9eb5e13faffa	a710159d-0221-4974-9c15-d53a08c3d8a7	2023	\N	\N	1800.0000	\N	12.50	\N	\N	\N	\N	\N	\N	\N	\N	t	\N	\N	\N	2026-01-05 08:55:18.605099+01	2026-01-05 08:55:18.605099+01
06bc90ac-b167-4fe7-9cec-c294fd68600b	a710159d-0221-4974-9c15-d53a08c3d8a7	2022	\N	\N	1600.0000	\N	14.30	\N	\N	\N	\N	\N	\N	\N	\N	t	\N	\N	\N	2026-01-05 08:55:18.605613+01	2026-01-05 08:55:18.605613+01
553883c9-de67-48da-9d62-27de4f4d7d24	a710159d-0221-4974-9c15-d53a08c3d8a7	2021	\N	\N	1400.0000	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	t	\N	\N	\N	2026-01-05 08:55:18.605972+01	2026-01-05 08:55:18.605972+01
f8238d83-2ae7-43a6-bbcc-a4a320fb0151	0a11c2eb-ae3d-4c0d-80cd-71b90b4c79be	2026	1	1	1200.0000	36.2000	3214.92	45	178	\N	\N	ghchg	jhvhjv	\N	\N	t	\N	\N	\N	2026-01-05 11:28:27.644+01	2026-01-05 11:28:27.644+01
\.


--
-- Data for Name: climate_indicators; Type: TABLE DATA; Schema: public; Owner: yvesmpunga
--

COPY public.climate_indicators (id, code, name, description, category, "subCategory", "measureType", unit, "betterDirection", "dataSource", "updateFrequency", "targetValue", "targetYear", "isActive", "displayOrder", metadata, "createdById", "createdAt", "updatedAt") FROM stdin;
0a11c2eb-ae3d-4c0d-80cd-71b90b4c79be	DB_DTF	Doing Business - Distance to Frontier	Score global mesurant la facilité de faire des affaires en RDC par rapport aux meilleures pratiques mondiales.	DOING_BUSINESS	Score Global	SCORE	points	HIGHER	Banque Mondiale	ANNUALLY	60.0000	2030	t	1	{}	\N	2026-01-05 08:55:18.591044+01	2026-01-05 08:55:18.591044+01
c1330501-7425-4dff-a63a-eb7b631a123f	DB_RANK	Classement Doing Business	Position de la RDC dans le classement mondial Doing Business.	DOING_BUSINESS	Classement Mondial	RANK	\N	LOWER	Banque Mondiale	ANNUALLY	100.0000	2030	t	2	{}	\N	2026-01-05 08:55:18.599072+01	2026-01-05 08:55:18.599072+01
534aaf52-c010-4ef8-930d-a39003bde9b0	DB_SB_DAYS	Délai de création d'entreprise	Nombre de jours nécessaires pour créer une entreprise en RDC.	DOING_BUSINESS	Starting a Business	DAYS	jours	LOWER	Banque Mondiale	ANNUALLY	7.0000	2028	t	3	{}	\N	2026-01-05 08:55:18.601416+01	2026-01-05 08:55:18.601416+01
1362ecbb-6ecf-4250-82ce-cd45630f7b91	CPI_SCORE	Indice de Perception de la Corruption	Score de perception de la corruption selon Transparency International.	CORRUPTION	\N	SCORE	points	HIGHER	Transparency International	ANNUALLY	40.0000	2030	t	4	{}	\N	2026-01-05 08:55:18.603121+01	2026-01-05 08:55:18.603121+01
a710159d-0221-4974-9c15-d53a08c3d8a7	FDI_INFLOW	Investissements Directs Étrangers	Flux entrants d'investissements directs étrangers en RDC.	INVESTMENT_CLIMATE	IDE	CURRENCY	millions USD	HIGHER	CNUCED	ANNUALLY	5000.0000	2030	t	5	{}	\N	2026-01-05 08:55:18.604744+01	2026-01-05 08:55:18.604744+01
\.


--
-- Data for Name: contract_types; Type: TABLE DATA; Schema: public; Owner: yvesmpunga
--

COPY public.contract_types (id, code, name, description, "defaultDuration", "alertDays", "requiredFields", template, "sortOrder", "isActive", "createdAt", "updatedAt") FROM stdin;
27141158-9112-405d-931e-70aed774c1fd	PREST	Prestation de services	Contrat de prestation de services	12	[30, 60, 90]	[]	\N	1	t	2026-01-02 14:06:47.221733+01	2026-01-02 14:06:47.221733+01
3832ef33-7204-4a92-b76b-3ae7bcc513c6	FOURN	Fourniture	Contrat de fourniture de biens	12	[30, 60, 90]	[]	\N	2	t	2026-01-02 14:06:47.221733+01	2026-01-02 14:06:47.221733+01
9a6af84c-b9d2-49f2-84ae-55a5d84ef7cb	PART	Partenariat	Convention de partenariat	24	[30, 60, 90]	[]	\N	3	t	2026-01-02 14:06:47.221733+01	2026-01-02 14:06:47.221733+01
0a5c5e65-6f9b-438f-b83a-26d4e368576c	BAIL	Bail	Contrat de location immobilière	36	[30, 60, 90]	[]	\N	4	t	2026-01-02 14:06:47.221733+01	2026-01-02 14:06:47.221733+01
02592728-70b8-4213-8e5e-9aba05db496e	CONS	Consultation	Contrat de consultation	6	[30, 60, 90]	[]	\N	5	t	2026-01-02 14:06:47.221733+01	2026-01-02 14:06:47.221733+01
5f28368c-c77b-463d-b8ef-6d04533c6cb1	MAINT	Maintenance	Contrat de maintenance	12	[30, 60, 90]	[]	\N	6	t	2026-01-02 14:06:47.221733+01	2026-01-02 14:06:47.221733+01
8141e0e5-3796-4f3c-a972-cd6aa4024e54	TRAV	Travaux	Contrat de travaux	24	[30, 60, 90]	[]	\N	7	t	2026-01-02 14:06:47.221733+01	2026-01-02 14:06:47.221733+01
bb04932f-b55e-4f91-81e1-1f65339067b1	AUTRE	Autre	Autre type de contrat	12	[30, 60, 90]	[]	\N	8	t	2026-01-02 14:06:47.221733+01	2026-01-02 14:06:47.221733+01
\.


--
-- Data for Name: contracts; Type: TABLE DATA; Schema: public; Owner: yvesmpunga
--

COPY public.contracts (id, "contractNumber", title, "typeId", "domainId", parties, object, description, "signatureDate", "startDate", "endDate", "renewalDate", value, currency, "paymentTerms", obligations, "filePath", "fileName", "fileSize", annexes, status, "alertDays", "lastAlertSent", "isRenewable", "renewalTerms", "previousContractId", "createdById", "updatedById", "createdAt", "updatedAt", "renewalType", "renewedFromId", "renewedToId", "renewedAt", "renewedById", "renewalNotes", "alertEnabled") FROM stdin;
909eb835-9b3c-4656-8913-c9c0a68682d6	CONTRAT-2026-00001	Contrat de prestation de services informatiques	27141158-9112-405d-931e-70aed774c1fd	\N	[{"name": "ANAPI", "role": "Client", "contact": "info@anapi.cd"}, {"name": "TechSolutions SARL", "role": "Prestataire", "contact": "contact@techsol.cd"}]	\N	Maintenance du systeme informatique ANAPI	\N	2024-01-01	2026-01-06	\N	50000.00	USD	\N	[]	/uploads/legal/contracts/2026/CONTRAT-2026-00001.pdf	rapport-enquete-PLT-20251225-0001-2025-12-26.pdf	55742	[]	ACTIVE	[30, 60, 90]	\N	t	\N	\N	\N	\N	2026-01-02 14:32:27.372+01	2026-01-03 12:41:00.183+01	MANUAL	\N	\N	\N	\N	\N	t
4abad790-6347-4c6d-bb94-497dfd510489	CONTRAT-2026-00002	Fourniture des equioement	3832ef33-7204-4a92-b76b-3ae7bcc513c6	\N	[]	\N	Check Contrat fourniture et autes	\N	2026-01-14	2026-01-14	\N	800.00	USD	\N	[]	/uploads/legal/contracts/2026/CONTRAT-2026-00002.pdf	marche_Lb_tables_2025-12-24.pdf	17046	[]	PENDING_SIGNATURE	[30, 60, 90]	\N	t	\N	\N	\N	\N	2026-01-03 12:46:31.328+01	2026-01-03 12:46:31.328+01	MANUAL	\N	\N	\N	\N	\N	t
b2b089ae-6b98-4afb-8543-2df2cc84ba85	CONTRAT-2026-00003	sfsd	9a6af84c-b9d2-49f2-84ae-55a5d84ef7cb	\N	[{"name": "dsf", "role": "sdf", "contact": "df"}]	\N	dsfds	\N	2026-01-21	2026-01-29	\N	400.00	USD	\N	[]	/uploads/legal/contracts/2026/CONTRAT-2026-00003.pdf	rapport-enquete-PLT-20251225-0001-2025-12-26.pdf	55742	[]	DRAFT	[30, 60, 90]	\N	t	\N	\N	\N	\N	2026-01-03 16:34:29.238+01	2026-01-03 16:34:29.238+01	AUTO	\N	\N	\N	\N	\N	t
\.


--
-- Data for Name: countries; Type: TABLE DATA; Schema: public; Owner: yvesmpunga
--

COPY public.countries (id, code, code3, name, name_fr, name_en, nationality, nationality_fr, phone_code, continent, is_active, sort_order, created_at, updated_at) FROM stdin;
1c00b01f-f9d1-4784-a2d6-db1b571694dc	CD	COD	Congo (RDC)	Republique Democratique du Congo	Democratic Republic of the Congo	Congolese	Congolais(e)	+243	Afrique	t	1	2026-01-02 14:51:31.251413+01	2026-01-02 14:51:31.251413+01
9cc7c279-82c2-4ef0-beaf-5857b9c288b1	CG	COG	Congo (Brazzaville)	Republique du Congo	Republic of the Congo	Congolese	Congolais(e)	+242	Afrique	t	2	2026-01-02 14:51:31.251413+01	2026-01-02 14:51:31.251413+01
675459a8-d1a1-49f8-a723-3440435efaac	AO	AGO	Angola	Angola	Angola	Angolan	Angolais(e)	+244	Afrique	t	3	2026-01-02 14:51:31.251413+01	2026-01-02 14:51:31.251413+01
492744b2-6799-48e9-9d6f-26bd32b20ab9	ZM	ZMB	Zambie	Zambie	Zambia	Zambian	Zambien(ne)	+260	Afrique	t	4	2026-01-02 14:51:31.251413+01	2026-01-02 14:51:31.251413+01
9acb81e3-5253-424b-af31-99fb6253bc8f	TZ	TZA	Tanzanie	Tanzanie	Tanzania	Tanzanian	Tanzanien(ne)	+255	Afrique	t	5	2026-01-02 14:51:31.251413+01	2026-01-02 14:51:31.251413+01
a88d7b0c-67ff-4c8a-8902-030c6d7a04d9	UG	UGA	Ouganda	Ouganda	Uganda	Ugandan	Ougandais(e)	+256	Afrique	t	6	2026-01-02 14:51:31.251413+01	2026-01-02 14:51:31.251413+01
7dfaa1bb-ecc6-4421-957b-b262cf73e803	RW	RWA	Rwanda	Rwanda	Rwanda	Rwandan	Rwandais(e)	+250	Afrique	t	7	2026-01-02 14:51:31.251413+01	2026-01-02 14:51:31.251413+01
bb0f21f5-517c-42bb-a4ba-931ccbfd0351	BI	BDI	Burundi	Burundi	Burundi	Burundian	Burundais(e)	+257	Afrique	t	8	2026-01-02 14:51:31.251413+01	2026-01-02 14:51:31.251413+01
16b9bb02-6d4f-40f4-a9e5-b57a5e7bd622	CF	CAF	Centrafrique	Republique Centrafricaine	Central African Republic	Central African	Centrafricain(e)	+236	Afrique	t	9	2026-01-02 14:51:31.251413+01	2026-01-02 14:51:31.251413+01
6dcb6b9f-2eba-4bf1-aa05-e217692465c4	SS	SSD	Soudan du Sud	Soudan du Sud	South Sudan	South Sudanese	Sud-Soudanais(e)	+211	Afrique	t	10	2026-01-02 14:51:31.251413+01	2026-01-02 14:51:31.251413+01
41282bd8-6e70-4172-a2f0-68c934091915	ZA	ZAF	Afrique du Sud	Afrique du Sud	South Africa	South African	Sud-Africain(e)	+27	Afrique	t	11	2026-01-02 14:51:31.251413+01	2026-01-02 14:51:31.251413+01
c445fa46-abdb-4133-8ec1-ca43ee02a068	NG	NGA	Nigeria	Nigeria	Nigeria	Nigerian	Nigerian(e)	+234	Afrique	t	12	2026-01-02 14:51:31.251413+01	2026-01-02 14:51:31.251413+01
9392fe7c-2e39-40c5-bca6-e4311d82f544	KE	KEN	Kenya	Kenya	Kenya	Kenyan	Kenyan(e)	+254	Afrique	t	13	2026-01-02 14:51:31.251413+01	2026-01-02 14:51:31.251413+01
fe821648-cb9c-43b3-9c47-7847f4213f11	CM	CMR	Cameroun	Cameroun	Cameroon	Cameroonian	Camerounais(e)	+237	Afrique	t	14	2026-01-02 14:51:31.251413+01	2026-01-02 14:51:31.251413+01
8a02136a-7f86-491c-b199-9fbc9059e4c4	SN	SEN	Senegal	Senegal	Senegal	Senegalese	Senegalais(e)	+221	Afrique	t	15	2026-01-02 14:51:31.251413+01	2026-01-02 14:51:31.251413+01
0d63c8d8-93f8-47ab-843e-bf8ea922d91b	CI	CIV	Cote d Ivoire	Cote d Ivoire	Ivory Coast	Ivorian	Ivoirien(ne)	+225	Afrique	t	16	2026-01-02 14:51:31.251413+01	2026-01-02 14:51:31.251413+01
a6ca01a3-4d99-4b6a-993d-f2bc9af21fc6	MA	MAR	Maroc	Maroc	Morocco	Moroccan	Marocain(e)	+212	Afrique	t	17	2026-01-02 14:51:31.251413+01	2026-01-02 14:51:31.251413+01
246bd074-6ed6-4aa2-bfe7-26e616ce23e5	EG	EGY	Egypte	Egypte	Egypt	Egyptian	Egyptien(ne)	+20	Afrique	t	18	2026-01-02 14:51:31.251413+01	2026-01-02 14:51:31.251413+01
e0bce3ad-f3e0-484f-a14f-6ee01580c118	FR	FRA	France	France	France	French	Francais(e)	+33	Europe	t	20	2026-01-02 14:51:31.251413+01	2026-01-02 14:51:31.251413+01
b562f692-8b87-4c9a-bc01-701c3e655df3	BE	BEL	Belgique	Belgique	Belgium	Belgian	Belge	+32	Europe	t	21	2026-01-02 14:51:31.251413+01	2026-01-02 14:51:31.251413+01
bbe8286c-b528-4c03-8057-857d90da05aa	DE	DEU	Allemagne	Allemagne	Germany	German	Allemand(e)	+49	Europe	t	22	2026-01-02 14:51:31.251413+01	2026-01-02 14:51:31.251413+01
bd35fed1-8c26-400d-82b1-e22eb673bfb0	GB	GBR	Royaume-Uni	Royaume-Uni	United Kingdom	British	Britannique	+44	Europe	t	23	2026-01-02 14:51:31.251413+01	2026-01-02 14:51:31.251413+01
a8848505-6eb4-4a04-b901-78fea5b3cb7a	US	USA	Etats-Unis	Etats-Unis	United States	American	Americain(e)	+1	Amerique	t	24	2026-01-02 14:51:31.251413+01	2026-01-02 14:51:31.251413+01
25611a1a-7fd7-4516-9894-b397c8860ec0	CA	CAN	Canada	Canada	Canada	Canadian	Canadien(ne)	+1	Amerique	t	25	2026-01-02 14:51:31.251413+01	2026-01-02 14:51:31.251413+01
fb86f00a-d7e9-469a-98c0-450bbe551495	BR	BRA	Bresil	Bresil	Brazil	Brazilian	Bresilien(ne)	+55	Amerique	t	26	2026-01-02 14:51:31.251413+01	2026-01-02 14:51:31.251413+01
93772451-35f2-4dcd-b82e-3696f321be99	CN	CHN	Chine	Chine	China	Chinese	Chinois(e)	+86	Asie	t	27	2026-01-02 14:51:31.251413+01	2026-01-02 14:51:31.251413+01
5514b664-1201-4d5a-8793-c8556a5492d0	JP	JPN	Japon	Japon	Japan	Japanese	Japonais(e)	+81	Asie	t	28	2026-01-02 14:51:31.251413+01	2026-01-02 14:51:31.251413+01
913ddb71-fce6-4b70-b719-693303738ace	IN	IND	Inde	Inde	India	Indian	Indien(ne)	+91	Asie	t	29	2026-01-02 14:51:31.251413+01	2026-01-02 14:51:31.251413+01
48acf285-ed10-46b5-b40b-6117508613c2	AE	ARE	Emirats Arabes Unis	Emirats Arabes Unis	United Arab Emirates	Emirati	Emirati(e)	+971	Asie	t	30	2026-01-02 14:51:31.251413+01	2026-01-02 14:51:31.251413+01
30fde15f-d42f-402e-b652-be8a996574f4	SA	SAU	Arabie Saoudite	Arabie Saoudite	Saudi Arabia	Saudi	Saoudien(ne)	+966	Asie	t	31	2026-01-02 14:51:31.251413+01	2026-01-02 14:51:31.251413+01
0a4f2813-b29d-48c5-8d7f-05b58c8f6487	TR	TUR	Turquie	Turquie	Turkey	Turkish	Turc/Turque	+90	Europe	t	32	2026-01-02 14:51:31.251413+01	2026-01-02 14:51:31.251413+01
1c30e738-4ba1-4c97-b8da-1e84b9fa21ee	AU	AUS	Australie	Australie	Australia	Australian	Australien(ne)	+61	Oceanie	t	33	2026-01-02 14:51:31.251413+01	2026-01-02 14:51:31.251413+01
\.


--
-- Data for Name: currencies; Type: TABLE DATA; Schema: public; Owner: yvesmpunga
--

COPY public.currencies (id, code, name, name_fr, name_en, symbol, decimals, exchange_rate, exchange_rate_date, is_base_currency, is_active, sort_order, created_at, updated_at) FROM stdin;
d16894df-b20b-475c-832e-155905626433	EUR	Euro	Euro	Euro	€	2	0.920000	\N	f	t	2	2026-01-02 14:41:33.1517+01	2026-01-02 14:41:33.1517+01
5ecf5225-3f21-4bca-933b-7b8fd5f4bfd8	CDF	Franc congolais	Franc congolais	Congolese Franc	FC	0	2750.000000	\N	f	t	3	2026-01-02 14:41:33.1517+01	2026-01-02 14:41:33.1517+01
77b2ed17-19b9-48e2-8837-6d29702829ee	GBP	Livre sterling	Livre sterling	British Pound	£	2	0.790000	\N	f	t	4	2026-01-02 14:41:33.1517+01	2026-01-02 14:41:33.1517+01
6e3a7ef0-07e2-4558-bc8c-69d31c620e38	CNY	Yuan chinois	Yuan chinois	Chinese Yuan	¥	2	7.240000	\N	f	t	5	2026-01-02 14:41:33.1517+01	2026-01-02 14:41:33.1517+01
95bc5aaf-5eaf-4d0e-97d8-684694dcdcb3	ZAR	Rand sud-africain	Rand sud-africain	South African Rand	R	2	18.500000	\N	f	t	6	2026-01-02 14:41:33.1517+01	2026-01-02 14:41:33.1517+01
e3c14c9d-73e4-4e87-8208-33457aad9166	XAF	Franc CFA	Franc CFA	CFA Franc	FCFA	0	603.000000	\N	f	t	7	2026-01-02 14:41:33.1517+01	2026-01-02 14:41:33.1517+01
62a3073b-054e-4a1b-8a15-7ceef5060252	CHF	Franc suisse	Franc suisse	Swiss Franc	CHF	2	0.880000	\N	f	t	8	2026-01-02 14:41:33.1517+01	2026-01-02 14:41:33.1517+01
e08fb569-c579-439d-9b87-406107d6947c	USD	Dollar americain	Dollar americain	US Dollar	$	2	1.050000	\N	t	t	1	2026-01-02 14:41:33.1517+01	2026-01-02 14:49:48.164+01
\.


--
-- Data for Name: dialogue_participants; Type: TABLE DATA; Schema: public; Owner: yvesmpunga
--

COPY public.dialogue_participants (id, "dialogueId", "participantType", name, title, organization, email, phone, "invitationStatus", attended, role, notes, "investorId", "userId", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: districts; Type: TABLE DATA; Schema: public; Owner: yvesmpunga
--

COPY public.districts (id, code, name, name_fr, name_en, name_pt, name_es, name_ar, province_id, chief_town, population, area, latitude, longitude, description, sort_order, is_active, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: dossier_documents; Type: TABLE DATA; Schema: public; Owner: yvesmpunga
--

COPY public.dossier_documents (id, "dossierId", name, description, category, "fileName", "filePath", "fileSize", "mimeType", "uploadedById", "createdAt", "updatedAt") FROM stdin;
a6fef287-1a12-4eca-82a8-822ff3dc5031	9ba81685-4610-4b50-b34f-867420766798	DIRECTIONS ANAPI ET MISSIONS (1).docx		RCCM	1767314948639_DIRECTIONS_ANAPI_ET_MISSIONS__1_.docx	/uploads/guichet-unique/dossiers/9ba81685-4610-4b50-b34f-867420766798/1767314948639_DIRECTIONS_ANAPI_ET_MISSIONS__1_.docx	19283	application/vnd.openxmlformats-officedocument.wordprocessingml.document	\N	2026-01-02 01:49:08.639+01	2026-01-02 01:49:08.639+01
eb285e40-4ae7-4ecc-be9d-7bcae06d60a8	9ba81685-4610-4b50-b34f-867420766798	ANAPI_Employes_par_Categorie_2025-12-28.pdf		ID_NATIONAL	1767315005742_ANAPI_Employes_par_Categorie_2025_12_28.pdf	/uploads/guichet-unique/dossiers/9ba81685-4610-4b50-b34f-867420766798/1767315005742_ANAPI_Employes_par_Categorie_2025_12_28.pdf	20491	application/pdf	\N	2026-01-02 01:50:05.743+01	2026-01-02 01:50:05.743+01
0d93d52a-6d7f-46d9-b563-13d71cb228a4	cda16883-1088-4d44-8c5d-290801d3ed00	ANAPI_Employes_par_Categorie_2025-12-28.pdf	imaged rccm	RCCM	1767348220525_ANAPI_Employes_par_Categorie_2025_12_28.pdf	/uploads/guichet-unique/dossiers/cda16883-1088-4d44-8c5d-290801d3ed00/1767348220525_ANAPI_Employes_par_Categorie_2025_12_28.pdf	20491	application/pdf	\N	2026-01-02 11:03:40.525+01	2026-01-02 11:03:40.525+01
50b2722e-3d12-455e-b206-49675788e7e5	aa71a101-3efd-4096-a985-57564ee1c042	ANAPI_Employes_par_Categorie_2025-12-28.pdf		FINANCIAL_PROOF	1767455073318_ANAPI_Employes_par_Categorie_2025_12_28.pdf	/uploads/guichet-unique/dossiers/aa71a101-3efd-4096-a985-57564ee1c042/1767455073318_ANAPI_Employes_par_Categorie_2025_12_28.pdf	20491	application/pdf	\N	2026-01-03 16:44:33.318+01	2026-01-03 16:44:33.318+01
\.


--
-- Data for Name: dossier_sectors; Type: TABLE DATA; Schema: public; Owner: yvesmpunga
--

COPY public.dossier_sectors (id, "dossierId", "sectorId", "isPrimary", note, "createdAt", "updatedAt") FROM stdin;
8fac2281-9d3b-403d-aebc-333b13b8485b	83e0e2ab-221e-4944-9b93-1892f5686883	bb09ea1d-1413-48dd-8c51-23dc9997f67d	t	\N	2026-01-02 01:35:10.483+01	2026-01-02 01:35:10.483+01
720af3cb-f6af-4df6-b385-e2fd69398569	cda16883-1088-4d44-8c5d-290801d3ed00	bb09ea1d-1413-48dd-8c51-23dc9997f67d	t	\N	2026-01-02 10:47:52.034+01	2026-01-02 10:47:52.034+01
\.


--
-- Data for Name: dossier_step_validations; Type: TABLE DATA; Schema: public; Owner: yvesmpunga
--

COPY public.dossier_step_validations (id, dossier_id, step_number, step_name, validated_by_id, validated_by_name, note, validated_at, status, created_at, updated_at) FROM stdin;
2dfbf87b-88bd-460f-b8cb-b04de987b1ef	9ba81685-4610-4b50-b34f-867420766798	1	Reception 1	cmjopae590000zjq2jkhfrkre	Yves Mpunga	Okay, etape 1 valide	2026-01-02 02:17:39.918	VALIDATED	2026-01-02 02:17:39.919	2026-01-02 02:17:39.919
d43d4c60-4381-42b6-8ce1-86739eb9592a	9ba81685-4610-4b50-b34f-867420766798	2	Verification documents	cmjopae590000zjq2jkhfrkre	Yves Mpunga	Etape 2 valide	2026-01-02 02:17:46.5	VALIDATED	2026-01-02 02:17:46.5	2026-01-02 02:17:46.5
8feacdd5-aa28-4748-bfac-e7a0f4c15dbd	9ba81685-4610-4b50-b34f-867420766798	3	Examen fiscal	cmjopae590000zjq2jkhfrkre	Yves Mpunga	Etape 3 valide	2026-01-02 02:17:53.096	VALIDATED	2026-01-02 02:17:53.096	2026-01-02 02:17:53.096
1403ed91-164a-48cb-b4fe-290cba8bf5ea	9ba81685-4610-4b50-b34f-867420766798	4	Decision finale	cmjopae590000zjq2jkhfrkre	Yves Mpunga	tout es okay, emettre le certificat	2026-01-02 02:18:04.111	VALIDATED	2026-01-02 02:18:04.112	2026-01-02 02:18:04.112
39a6bdc3-2342-41fd-a7d5-63599e958514	cda16883-1088-4d44-8c5d-290801d3ed00	1	Reception 1	cmjopae590000zjq2jkhfrkre	Yves Mpunga	Pkay, validation	2026-01-02 10:24:07.262	VALIDATED	2026-01-02 10:24:07.262	2026-01-02 10:24:07.262
8ffd3a00-db52-481f-ae32-7895b1f5187b	cda16883-1088-4d44-8c5d-290801d3ed00	2	Verification documents	cmjopae590000zjq2jkhfrkre	Yves Mpunga	Ok Vaide	2026-01-02 10:27:27.458	VALIDATED	2026-01-02 10:27:27.458	2026-01-02 10:27:27.458
\.


--
-- Data for Name: dossiers; Type: TABLE DATA; Schema: public; Owner: yvesmpunga
--

COPY public.dossiers (id, "dossierNumber", "dossierType", "investorId", "investorType", "investorName", rccm, "idNat", nif, "investorEmail", "investorPhone", "investorProvince", "investorCity", "investorAddress", "investorCountry", "projectName", "projectDescription", sector, "subSector", "projectProvince", "projectCity", "projectAddress", "investmentAmount", currency, "directJobs", "indirectJobs", "startDate", "endDate", status, "currentStep", "assignedToId", "assignedAt", "submittedAt", "reviewedAt", "decisionDate", "decisionNote", "createdById", "createdAt", "updatedAt", "ministryId", "investorProvinceId", "investorCityId", "projectProvinceId", "projectCityId", "investorCommuneId", "projectCommuneId", "investorCommune", "projectCommune", "representativeName", "representativeFunction", "representativePhone", "representativeEmail") FROM stdin;
aa71a101-3efd-4096-a985-57564ee1c042	DOS-2025-00001	AGREMENT_REGIME	\N	company	Test Company SARL	\N	\N	\N	test@company.cd	+243 812 345 678	Kinshasa	Kinshasa	\N	RDC	Projet Test Agriculture	\N	agriculture	\N	Kinshasa	\N	\N	5000000.00	USD	50	150	\N	\N	SUBMITTED	1	\N	\N	2025-12-29 12:13:22.049+01	\N	\N	\N	\N	2025-12-29 12:13:22.05+01	2025-12-29 12:13:22.05+01	d31c0252-90de-4fae-8fb9-f001f0a6591e	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
90662c0b-a723-4b7e-b022-b995f560f807	DOS-2025-00002	DECLARATION_INVESTISSEMENT	\N	company	Iraela International	4565567	6567657	5567567	isra@gmail.com	456456456	Kinshasa	Kinshasa	gombe	RDC	Project d'investissemeent sur les femmes et filles Cogolaises	teste de rojec	commerce	Traitement	Kinshasa	Kinshasa	Ma Campagne	120000.00	USD	10	50	2025-12-16	2025-12-18	SUBMITTED	1	\N	\N	2025-12-29 12:42:08.944+01	\N	\N	\N	cmjopae590000zjq2jkhfrkre	2025-12-29 12:42:08.945+01	2025-12-29 12:52:21.94+01	d31c0252-90de-4fae-8fb9-f001f0a6591e	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
cda16883-1088-4d44-8c5d-290801d3ed00	DOS-2026-00002	PERMIS_CONSTRUCTION	\N	company	InfoTec	345345	45654654	56456456	inbf@gmail.com	45345345	Kinshasa	Kinsnasa	gombe Beau tout	RDC	Informatisation de la Poste de la RDC	teste	Telecommunications		Kinshasa	Kinsnasa	Maluku 2	34000.00	USD	6	12	2025-12-28	2026-01-29	IN_REVIEW	3	\N	\N	2026-01-02 10:47:52.029+01	\N	\N	\N	cmjopae590000zjq2jkhfrkre	2026-01-02 10:47:52.03+01	2026-01-02 11:27:27.461+01	4eb63f50-d06a-4288-86f8-789e3c2f7d4d	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
9ba81685-4610-4b50-b34f-867420766798	DOS-2025-00004	LICENCE_EXPLOITATION	\N	company	Jordan Investiment	345435	4656456	3454353	jor@gmail.cm	34534534543	Kinshasa	Kinshasa	Lmeba	RDC	Investiseement en Technologie Web	sdfsd	tech	Web	Kinshasa	Kinshasa	Lemba	150000.00	USD	34	67	2025-12-15	2025-12-25	APPROVED	4	\N	\N	2025-12-29 14:43:43.218+01	\N	2026-01-02 03:18:04.115+01	tout es okay, emettre le certificat	cmjopae590000zjq2jkhfrkre	2025-12-29 14:43:43.219+01	2026-01-02 13:19:47.185+01	d31c0252-90de-4fae-8fb9-f001f0a6591e	\N	\N	cmjomofsn000bjhjmaomn4zl5	046a58fe-68e9-46d7-9c27-73a293341b50	\N	\N	\N	\N	\N	\N	\N	\N
05d557b0-2e3f-4ee4-bb79-10e43465cd0b	DOS-2025-00003	AGREMENT_REGIME	\N	company	Isreala Internationz	erw	erte	45456456	4isreala@gmaiol.com	456456	Haut-Uele	Watsa	Lemba	RDC	Academie  de Beaute Insr	f	education	education	Haut-Uele	Watsa	Lemba Salomgo	120000.00	USD	12	50	2025-12-19	2025-12-31	SUBMITTED	1	\N	\N	2025-12-29 12:44:24.55+01	\N	\N	\N	cmjopae590000zjq2jkhfrkre	2025-12-29 12:44:24.551+01	2026-01-02 13:20:51.43+01	d31c0252-90de-4fae-8fb9-f001f0a6591e	\N	\N	8804ac19-8c41-4ffe-a101-1a958f712b14	bd527728-71ea-4df3-9537-546be3c75c9a	\N	\N	\N	\N	\N	\N	\N	\N
83e0e2ab-221e-4944-9b93-1892f5686883	DOS-2026-00001	PERMIS_CONSTRUCTION	\N	company	Futuriss SA	877878878	JH7878	989898	fut@gmail.com	98788778	Kinshasa	Kinshasa	87hjjh	RDC	Project web du systeme Nationa RDC	dfgdf	Telecommunications		Kinshasa	Kinshasa	futurissvision.com	50000.00	USD	34	111	2026-01-07	2026-01-29	APPROVED	5	\N	\N	2026-01-02 01:35:10.475+01	\N	2026-01-02 02:40:03.165+01	Dossier approuvé	cmjopae590000zjq2jkhfrkre	2026-01-02 01:35:10.476+01	2026-01-02 02:40:03.165+01	d31c0252-90de-4fae-8fb9-f001f0a6591e	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
\.


--
-- Data for Name: exchange_rate_history; Type: TABLE DATA; Schema: public; Owner: yvesmpunga
--

COPY public.exchange_rate_history (id, currency_id, rate, rate_date, source, created_by, created_at) FROM stdin;
\.


--
-- Data for Name: framework_agreement_suppliers; Type: TABLE DATA; Schema: public; Owner: yvesmpunga
--

COPY public.framework_agreement_suppliers (id, agreement_id, bidder_id, rank, status, specific_discount, specific_terms, max_value, used_value, orders_count, average_rating, notes, added_by_id, added_at, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: framework_agreements; Type: TABLE DATA; Schema: public; Owner: yvesmpunga
--

COPY public.framework_agreements (id, agreement_number, title, description, tender_id, ministry_id, category, sub_category, type, start_date, end_date, is_renewable, renewal_count, max_renewals, renewal_period_months, max_value, min_order_value, max_order_value, used_value, currency, max_quantity, used_quantity, unit, price_revision_clause, price_revision_index, delivery_terms, payment_terms, warranty_terms, penalty_clause, has_catalog, catalog_items, status, alert_days, alert_sent, notes, signed_by_client_id, signed_at, created_by_id, approved_by_id, approved_at, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: framework_orders; Type: TABLE DATA; Schema: public; Owner: yvesmpunga
--

COPY public.framework_orders (id, order_number, agreement_id, supplier_id, bidder_id, title, description, items, quantity, unit, unit_price, total_value, currency, order_date, expected_delivery_date, actual_delivery_date, delivery_location, delivery_contact, status, received_quantity, reception_notes, quality_status, invoice_number, invoice_date, paid_amount, payment_date, payment_status, notes, requested_by_id, approved_by_id, approved_at, received_by_id, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: international_treaties; Type: TABLE DATA; Schema: public; Owner: yvesmpunga
--

COPY public.international_treaties (id, reference, title, "shortTitle", description, "treatyType", status, "partnerCountries", "regionalOrganization", "negotiationStartDate", "signedDate", "ratifiedDate", "entryIntoForceDate", "expiryDate", duration, "autoRenewal", "renewalPeriod", "keyProvisions", "investorBenefits", "coveredSectors", exclusions, "disputeResolution", attachments, "treatyTextUrl", notes, "responsibleId", "createdById", "createdAt", "updatedAt") FROM stdin;
7934c589-7682-4af0-b207-f7f0682a12e3	TRT-2026-0001	teste traite	\N	\N	FTA	SIGNED	["dfdfd"]	\N	\N	2026-01-08 01:00:00+01	\N	\N	\N	\N	f	\N	[]	[]	[]	[]	\N	[]	\N	\N	\N	cmjopae590000zjq2jkhfrkre	2026-01-05 12:05:41.489+01	2026-01-05 12:05:41.489+01
\.


--
-- Data for Name: investments; Type: TABLE DATA; Schema: public; Owner: yvesmpunga
--

COPY public.investments (id, reference_number, project_name, description, sector_id, investor_id, province_id, amount, currency, jobs_created, status, submitted_at, approved_at, approved_by, start_date, end_date, notes, documents, created_by, created_at, updated_at, city_id) FROM stdin;
\.


--
-- Data for Name: investments_projects; Type: TABLE DATA; Schema: public; Owner: yvesmpunga
--

COPY public.investments_projects (id, "projectCode", "projectName", description, "investorId", sector, "subSector", province, city, address, amount, currency, "jobsCreated", "jobsIndirect", "startDate", "endDate", status, progress, "approvalDate", "approvedBy", "rejectionDate", "rejectedBy", "rejectionReason", "createdById", "createdAt", "updatedAt") FROM stdin;
2073b8d8-abf6-467f-b6de-d049ed32cdd4	PRJ-2024-00001	Extension Mine de Cuivre Kolwezi	Projet d'extension de la capacite de production de la mine de cuivre avec nouvelles installations de traitement	e418e199-5e65-41dc-b3a4-3599bcc81794	Mines	Cuivre et Cobalt	Lualaba	Kolwezi	\N	45000000.00	USD	1200	3500	2023-06-01 01:00:00+01	2026-12-31 01:00:00+01	IN_PROGRESS	65	\N	\N	\N	\N	\N	\N	2025-12-29 02:33:57.421+01	2025-12-29 02:33:57.421+01
ebf58575-cabb-4bb6-84b4-e19d02c16f9c	PRJ-2024-00002	Plantation de Palmiers a Huile	Creation d'une plantation industrielle de palmiers a huile avec usine de transformation	5fa9503a-8d01-42b4-b3eb-748216a9a7ac	Agriculture	Oleagineux	Equateur	Mbandaka	\N	8500000.00	USD	450	1200	2024-03-01 01:00:00+01	2027-03-01 01:00:00+01	APPROVED	25	\N	\N	\N	\N	\N	\N	2025-12-29 02:33:57.425+01	2025-12-29 02:33:57.425+01
a5663614-8e36-4530-b729-0ceaf98d24fe	PRJ-2024-00003	Hotel Touristique Goma	Construction d'un hotel 4 etoiles avec centre de conferences et spa	d46245b9-70b5-476e-be7c-cdb0469904e6	Tourisme	Hotellerie	Nord-Kivu	Goma	\N	2500000.00	USD	150	400	2024-06-01 01:00:00+01	2026-06-01 01:00:00+01	UNDER_REVIEW	0	\N	\N	\N	\N	\N	\N	2025-12-29 02:33:57.426+01	2025-12-29 02:33:57.426+01
79acbb05-0c66-422d-bead-7bf53a6ac287	PRJ-2024-00004	Data Center Kinshasa	Installation d'un centre de donnees moderne avec solutions cloud pour entreprises	fc31a1f8-536a-4bef-91ab-e74a69fc7709	Technologies	Infrastructure IT	Kinshasa	Kinshasa	\N	15000000.00	USD	80	250	2024-09-01 01:00:00+01	\N	SUBMITTED	0	\N	\N	\N	\N	\N	\N	2025-12-29 02:33:57.427+01	2025-12-29 02:33:57.427+01
261ea6aa-ec7d-433f-a944-6ef5efe6364e	PRJ-2024-00005	Usine de Ciment Matadi	Construction d'une nouvelle ligne de production de ciment	a979b513-7d0c-4565-bce8-f8471dd7f6c8	Industrie	Materiaux de construction	Kongo Central	Matadi	\N	35000000.00	USD	300	800	2023-01-01 01:00:00+01	2025-06-30 01:00:00+01	REJECTED	0	\N	\N	\N	\N	Etude d'impact environnemental insuffisante	\N	2025-12-29 02:33:57.428+01	2025-12-29 02:33:57.428+01
e9a739d4-b37d-4913-9d00-eb2727d21a46	PRJ-2024-00006	Centrale Solaire Lubumbashi - 8	Installation d'une centrale solaire photovoltaique de 50MW	10e18b82-51b3-4ed4-b3f2-ad6c114d565a	Energie	Energies renouvelables	Haut-Katanga	Lubumbashi	\N	68000000.00	USD	200	500	2022-03-01 01:00:00+01	2024-03-01 01:00:00+01	COMPLETED	100	2022-01-15 01:00:00+01	\N	\N	\N	\N	\N	2025-12-29 02:33:57.429+01	2025-12-29 02:48:14.508+01
\.


--
-- Data for Name: investors; Type: TABLE DATA; Schema: public; Owner: yvesmpunga
--

COPY public.investors (id, type, name, email, phone, country, address, city, website, "investorCode", category, province, "contactPerson", "contactPosition", "contactEmail", "contactPhone", rccm, "idNat", nif, status, "isVerified", description, "createdById", "createdAt", "updatedAt") FROM stdin;
e418e199-5e65-41dc-b3a4-3599bcc81794	company	Congo Mining Corporation	contact@congomining.com	+243 81 234 5678	Afrique du Sud	Avenue des Mines, 45	Kolwezi	www.congomining.com	INV-2024-00001	Multinationale	Lualaba	John Smith	Directeur General	john.smith@congomining.com	+243 81 234 5679	CD/KIN/RCCM/2023-B-00125	01-83-N00125X	A0125456	ACTIVE	t	Societe miniere specialisee dans extraction et traitement du cuivre et du cobalt en RDC.	\N	2025-12-29 02:11:26.124+01	2025-12-29 02:11:26.124+01
5fa9503a-8d01-42b4-b3eb-748216a9a7ac	company	AgroTech RDC SARL	info@agrotechrdc.cd	+243 99 876 5432	RDC	Boulevard du Commerce, 78	Mbandaka	\N	INV-2024-00002	PME	Equateur	Marie Kabila	Presidente	marie.kabila@agrotechrdc.cd	+243 99 876 5433	CD/EQU/RCCM/2023-B-00078	01-45-N00078Y	A0078123	ACTIVE	t	Entreprise agricole specialisee dans la culture et la transformation du palmier a huile.	\N	2025-12-29 02:11:26.13+01	2025-12-29 02:11:26.13+01
d46245b9-70b5-476e-be7c-cdb0469904e6	individual	Jean-Pierre Mukendi	jp.mukendi@gmail.com	+243 81 555 1234	RDC	Avenue du Lac, 23	Goma	\N	INV-2024-00003	Investisseur prive	Nord-Kivu	\N	\N	\N	\N	\N	01-NK-N00234Z	\N	ACTIVE	t	Investisseur prive congolais avec experience dans le secteur touristique et hotelier.	\N	2025-12-29 02:11:26.132+01	2025-12-29 02:11:26.132+01
fc31a1f8-536a-4bef-91ab-e74a69fc7709	company	TechInvest Africa Ltd	invest@techinvest.africa	+254 20 123 4567	Kenya	\N	\N	\N	INV-2024-00004	Fonds d'investissement	\N	Sarah Ouma	Investment Manager	\N	\N	\N	\N	\N	PENDING	f	Fonds d'investissement panafricain specialise dans les technologies.	\N	2025-12-29 02:11:26.133+01	2025-12-29 02:11:26.133+01
a979b513-7d0c-4565-bce8-f8471dd7f6c8	company	Congo Cement Industries	direction@congociment.cd	+243 81 999 8888	RDC	Zone Industrielle, Secteur 3	Matadi	\N	INV-2024-00005	Grande entreprise	Kongo Central	Albert Mbeki	DG Adjoint	\N	\N	CD/KON/RCCM/2022-B-00045	01-KON-N00045W	A0045789	SUSPENDED	t	Industrie cimentiere leader en RDC avec usines a Matadi et Lukala.	\N	2025-12-29 02:11:26.134+01	2025-12-29 02:11:26.134+01
10e18b82-51b3-4ed4-b3f2-ad6c114d565a	organization	African Development Fund	projects@adf.org	+225 20 123 456	Cote d'Ivoire	\N	\N	\N	INV-2024-00006	Institution financiere	\N	Fatou Diallo	Chargee de projets	\N	\N	\N	\N	\N	ACTIVE	t	Fonds de developpement pour les projets infrastructure en Afrique.	\N	2025-12-29 02:11:26.136+01	2025-12-29 02:11:26.136+01
effc55bd-51db-412d-a052-e15d3130d708	company	Mining Corp DRC	contact@mining.cd	+243 999 888 777	RDC	\N	\N	\N	INV-MJR29L22	\N	\N	\N	\N	\N	\N	\N	\N	\N	PENDING	f	\N	\N	2025-12-29 12:14:27.674+01	2025-12-29 12:14:27.674+01
6ab4823e-aa34-42d8-9053-e080933cc029	company	Mining Corp DRC	contact@mining.cd	+243 999 888 777	RDC	\N	\N	\N	INV-MJR2B4G6	\N	\N	\N	\N	\N	\N	\N	\N	\N	PENDING	f	\N	\N	2025-12-29 12:15:39.463+01	2025-12-29 12:15:39.463+01
6259bec5-8494-4bbc-b311-6387273a4999	company	Mining Corp DRC	contact@mining.cd	+243 999 888 777	RDC	\N	\N	\N	INV-MJR2CU6H	\N	\N	\N	\N	\N	\N	\N	\N	\N	PENDING	f	\N	\N	2025-12-29 12:16:59.465+01	2025-12-29 12:16:59.465+01
\.


--
-- Data for Name: juridical_texts; Type: TABLE DATA; Schema: public; Owner: yvesmpunga
--

COPY public.juridical_texts (id, "documentNumber", title, "typeId", "domainId", "officialReference", "journalOfficiel", "publicationDate", "effectiveDate", "expirationDate", summary, content, keywords, tags, "filePath", "fileName", "fileSize", "mimeType", checksum, version, "previousVersionId", "isCurrentVersion", status, "modifiedById", "abrogatedById", "relatedDocuments", "createdById", "updatedById", "approvedById", "approvedAt", "createdAt", "updatedAt") FROM stdin;
2e2c76f7-a3ea-41d0-b838-8fb55c57ed12	LOI-2026-00001	Loi sur le Code des investissements	280c8772-9ada-4e8e-8eca-98ad1b4e788c	897ebb26-fc37-4d58-a961-20b0521735fb	Loi n°24-001 du 15/01/2024	JO n°2024-05	2024-01-15	2024-02-01	\N	Cette loi definit le cadre juridique des investissements en RDC	\N	["investissement", "code", "avantages"]	[]	/uploads/legal/texts/2026/LOI-2026-00001.pdf	organigramme_2025-12-28.pdf	18523989	application/pdf	65a9854925d72d73fdb96bd5f2342fc7cf92099eb9bd84bc5ff638a282caabbe	1	\N	t	ACTIVE	\N	\N	[]	\N	\N	\N	\N	2026-01-02 14:32:05.11+01	2026-01-02 16:53:40.41+01
ffbbca15-bfb1-4e38-88db-2c207efadcb2	ORD-2026-00001	Ordance Yves 009	15093141-4e24-4648-ab44-4192702e543c	3765ac01-5239-442d-8d1a-4114e8b48fbb	94949494	93948844	2026-01-07	2026-01-23	2026-01-26	Ordonnance teste 2	\N	[]	[]	/uploads/legal/texts/2026/ORD-2026-00001.pdf	clients_2025-12-31-1.pdf	13863	application/pdf	6fbe5b3d8638b0ae9a0fe38e923bdf412e2b95a01af02c58320fa0c81880cfa9	1	\N	t	ABROGATED	\N	\N	[]	\N	\N	\N	\N	2026-01-03 12:43:34.253+01	2026-01-03 12:44:54.132+01
\.


--
-- Data for Name: legal_alerts; Type: TABLE DATA; Schema: public; Owner: yvesmpunga
--

COPY public.legal_alerts (id, "alertNumber", type, priority, title, description, "triggerDate", "dueDate", "contractId", "documentId", "assignedToId", "notifiedUsers", status, actions, "resolvedAt", "resolvedById", "resolutionNote", "createdAt", "updatedAt") FROM stdin;
76333410-597d-4bad-8194-374b28ea83f5	ALERT-2026-1767376603271-001-388	CONTRACT_EXPIRATION	CRITICAL	Expiration du contrat CONTRAT-2026-00001	Le contrat "Contrat de prestation de services informatiques" expire dans 4 jours (seuil: 30 jours). Date d'expiration: 06/01/2026.	2026-01-02	2026-01-06	909eb835-9b3c-4656-8913-c9c0a68682d6	\N	\N	[]	PENDING	[]	\N	\N	\N	2026-01-02 18:56:43.272+01	2026-01-02 18:56:43.272+01
d59356f2-e352-4b79-9c8c-12cf335439b4	ALERT-2026-1767376603279-002-143	CONTRACT_EXPIRATION	CRITICAL	Expiration du contrat CONTRAT-2026-00001	Le contrat "Contrat de prestation de services informatiques" expire dans 4 jours (seuil: 60 jours). Date d'expiration: 06/01/2026.	2026-01-02	2026-01-06	909eb835-9b3c-4656-8913-c9c0a68682d6	\N	\N	[]	PENDING	[]	\N	\N	\N	2026-01-02 18:56:43.279+01	2026-01-02 18:56:43.279+01
26c6b560-8095-4aa1-98df-21597f11c892	ALERT-2026-1767376603282-003-673	CONTRACT_EXPIRATION	CRITICAL	Expiration du contrat CONTRAT-2026-00001	Le contrat "Contrat de prestation de services informatiques" expire dans 4 jours (seuil: 90 jours). Date d'expiration: 06/01/2026.	2026-01-02	2026-01-06	909eb835-9b3c-4656-8913-c9c0a68682d6	\N	\N	[]	RESOLVED	[]	2026-01-03 16:33:35.149+01	\N	\N	2026-01-02 18:56:43.282+01	2026-01-03 16:33:36.051+01
\.


--
-- Data for Name: legal_document_types; Type: TABLE DATA; Schema: public; Owner: yvesmpunga
--

COPY public.legal_document_types (id, code, name, description, category, "requiredFields", "allowedExtensions", "maxFileSize", "retentionPeriod", "requiresApproval", "sortOrder", "isActive", "createdAt", "updatedAt") FROM stdin;
280c8772-9ada-4e8e-8eca-98ad1b4e788c	LOI	Loi	Texte législatif voté par le Parlement	LEGISLATION	[]	[".pdf", ".docx"]	50	\N	f	1	t	2026-01-02 14:06:47.221733+01	2026-01-02 14:06:47.221733+01
15093141-4e24-4648-ab44-4192702e543c	ORD	Ordonnance	Acte du Président de la République	LEGISLATION	[]	[".pdf", ".docx"]	50	\N	f	2	t	2026-01-02 14:06:47.221733+01	2026-01-02 14:06:47.221733+01
0f7a7e02-82fe-4ad9-8794-64679e13c34a	DEC	Décret	Acte réglementaire du Premier Ministre	REGLEMENTATION	[]	[".pdf", ".docx"]	50	\N	f	3	t	2026-01-02 14:06:47.221733+01	2026-01-02 14:06:47.221733+01
2c40d7d4-e248-4dd9-a357-39ec7f690921	ARR	Arrêté	Acte d'un ministre ou autorité administrative	REGLEMENTATION	[]	[".pdf", ".docx"]	50	\N	f	4	t	2026-01-02 14:06:47.221733+01	2026-01-02 14:06:47.221733+01
330b628f-950c-4548-820c-4f2ddaadcf5e	CIR	Circulaire	Instruction administrative interne	DOCTRINE	[]	[".pdf", ".docx"]	50	\N	f	5	t	2026-01-02 14:06:47.221733+01	2026-01-02 14:06:47.221733+01
ef7c1c53-e288-4bc5-b04f-a2bd3763b5e5	NOTE	Note de service	Communication interne	INTERNE	[]	[".pdf", ".docx"]	50	\N	f	6	t	2026-01-02 14:06:47.221733+01	2026-01-02 14:06:47.221733+01
ac0716af-42d6-470e-a438-6a06099dbc14	CONV	Convention	Accord entre parties	CONTRAT	[]	[".pdf", ".docx"]	50	\N	f	7	t	2026-01-02 14:06:47.221733+01	2026-01-02 14:06:47.221733+01
cb590c75-297c-4351-adf0-5f63aceb1db1	AVIS	Avis juridique	Opinion juridique consultative	DOCTRINE	[]	[".pdf", ".docx"]	50	\N	f	8	t	2026-01-02 14:06:47.221733+01	2026-01-02 14:06:47.221733+01
\.


--
-- Data for Name: legal_domains; Type: TABLE DATA; Schema: public; Owner: yvesmpunga
--

COPY public.legal_domains (id, code, name, description, "parentId", color, icon, "sortOrder", "isActive", "createdAt", "updatedAt") FROM stdin;
897ebb26-fc37-4d58-a961-20b0521735fb	INV	Investissement	Code des investissements et régimes préférentiels	\N	#3B82F6	trending-up	1	t	2026-01-02 14:06:47.221733+01	2026-01-02 14:06:47.221733+01
5148bd89-e677-40a1-b4ee-7798bf8746c9	FISC	Fiscalité	Droit fiscal et parafiscal	\N	#10B981	calculator	2	t	2026-01-02 14:06:47.221733+01	2026-01-02 14:06:47.221733+01
ca767088-3e62-4c9b-a2ba-7ebba43c1962	DOUA	Douanes	Législation douanière	\N	#F59E0B	package	3	t	2026-01-02 14:06:47.221733+01	2026-01-02 14:06:47.221733+01
602e54bd-a63c-4d09-b40b-74f2fc8c6bdd	TRAV	Travail	Droit du travail et sécurité sociale	\N	#8B5CF6	users	4	t	2026-01-02 14:06:47.221733+01	2026-01-02 14:06:47.221733+01
01e9dbfc-8e48-4220-99a1-0092653f4bba	FONC	Foncier	Droit foncier et immobilier	\N	#EF4444	map-pin	5	t	2026-01-02 14:06:47.221733+01	2026-01-02 14:06:47.221733+01
d55f84e8-85c2-42b6-b32d-66ada44ba143	COM	Commerce	Droit commercial et des affaires	\N	#06B6D4	briefcase	6	t	2026-01-02 14:06:47.221733+01	2026-01-02 14:06:47.221733+01
7fe69feb-fa02-43e7-b32b-03560ab04d28	ENV	Environnement	Droit de l'environnement	\N	#22C55E	leaf	7	t	2026-01-02 14:06:47.221733+01	2026-01-02 14:06:47.221733+01
3765ac01-5239-442d-8d1a-4114e8b48fbb	ADM	Administratif	Droit administratif général	\N	#6B7280	building-2	8	t	2026-01-02 14:06:47.221733+01	2026-01-02 14:06:47.221733+01
\.


--
-- Data for Name: legal_proposals; Type: TABLE DATA; Schema: public; Owner: yvesmpunga
--

COPY public.legal_proposals (id, reference, title, summary, "fullText", "proposalType", domain, status, priority, justification, "expectedImpact", "targetedBarriers", "submittedAt", "forwardedAt", "adoptedAt", "targetAuthority", feedback, "feedbackDate", attachments, "internalNotes", "relatedTextId", "createdById", "approvedById", "createdAt", "updatedAt") FROM stdin;
d4b70003-74fc-418c-aebf-c823f90d5b04	PROP-2026-0001	Simplification des procédures d'enregistrement des entreprises	Proposition visant à réduire le nombre de jours nécessaires pour créer une entreprise en RDC de 30 à 7 jours.	\N	RECOMMENDATION	BUSINESS_CREATION	DRAFT	HIGH	Le temps de création d'entreprise en RDC est parmi les plus longs en Afrique, ce qui décourage les investisseurs potentiels.	Amélioration du classement Doing Business, augmentation du nombre de nouvelles entreprises créées.	[]	\N	\N	\N	Ministère du Commerce Extérieur	\N	\N	[]	\N	\N	\N	\N	2026-01-05 04:03:37.314056+01	2026-01-05 04:03:37.314056+01
c9434804-f65b-42b4-9bec-ef14b75fcef7	PROP-2026-0002	Réforme du régime fiscal des investissements miniers	Proposition de modification du Code minier pour harmoniser les incitations fiscales avec les standards internationaux.	\N	LAW	MINING	SUBMITTED	HIGH	Les investisseurs miniers se plaignent de l'instabilité fiscale et de la complexité des régimes d'imposition.	Attraction de nouveaux investissements miniers estimés à 2 milliards USD sur 5 ans.	[]	2026-01-05 04:03:37.313+01	\N	\N	Ministère des Mines	\N	\N	[]	\N	\N	\N	\N	2026-01-05 04:03:37.320133+01	2026-01-05 04:03:37.320133+01
f055d9f7-d061-49f1-b095-d46b8656572e	PROP-2026-0003	Création d'un guichet unique virtuel pour les licences commerciales	Mise en place d'une plateforme numérique permettant d'obtenir toutes les autorisations commerciales en ligne.	\N	DECREE	TRADE	UNDER_REVIEW	MEDIUM	La digitalisation des services publics est essentielle pour améliorer l'efficacité administrative.	Réduction des délais d'obtention des licences de 60%, économie de temps et d'argent pour les entreprises.	[]	\N	\N	\N	Primature	\N	\N	[]	\N	\N	\N	\N	2026-01-05 04:03:37.320743+01	2026-01-05 04:03:37.320743+01
19486802-7012-4480-8096-c57efece69d7	PROP-2026-0004	Harmonisation des procédures douanières avec la ZLECAF	Adaptation du code des douanes aux exigences de la Zone de Libre-Échange Continentale Africaine.	\N	LAW	CUSTOMS	ADOPTED	URGENT	La RDC doit se conformer aux engagements pris dans le cadre de la ZLECAF pour bénéficier pleinement du marché unique africain.	Facilitation des échanges commerciaux intra-africains, croissance des exportations de 15%.	[]	\N	\N	2026-01-05 04:03:37.313+01	Ministère des Finances	\N	\N	[]	\N	\N	\N	\N	2026-01-05 04:03:37.321521+01	2026-01-05 04:03:37.321521+01
7c88ade7-cd27-4639-9a68-bb0a90a2c08c	PROP-2026-0005	kjb	kj	l 	AMENDMENT	TAX	DRAFT	LOW	nk 	j	[]	\N	\N	\N	Primature	\N	\N	[]	j 	2e2c76f7-a3ea-41d0-b838-8fb55c57ed12	cmjopae590000zjq2jkhfrkre	\N	2026-01-05 04:07:55.585+01	2026-01-05 04:07:55.585+01
\.


--
-- Data for Name: mediation_cases; Type: TABLE DATA; Schema: public; Owner: yvesmpunga
--

COPY public.mediation_cases (id, reference, title, description, "disputeType", status, priority, "disputedAmount", currency, "complainantType", "complainantName", "complainantContact", "respondentType", "respondentName", "respondentContact", "respondentOrganization", "submittedAt", "acceptedAt", "firstSessionAt", "closedAt", "sessionsCount", outcome, "agreementSummary", "complainantSatisfaction", "respondentSatisfaction", "internalNotes", attachments, "investorId", "projectId", "barrierId", "mediatorId", "createdById", "createdAt", "updatedAt") FROM stdin;
d0770f15-5a71-48d3-a2b8-0d172c40fefc	MED-2026-0001	Media 233	Nous mmedd	CONTRACT	SUBMITTED	LOW	600.00	USD	INVESTOR	\N	\N	MINISTRY	xv	vcx	\N	2026-01-05 03:11:06.617+01	\N	2026-01-23 07:07:00+01	\N	0	\N	\N	\N	\N	dfgfd	[]	6259bec5-8494-4bbc-b311-6387273a4999	261ea6aa-ec7d-433f-a944-6ef5efe6364e	\N	\N	cmjopae590000zjq2jkhfrkre	2026-01-05 03:11:06.617+01	2026-01-05 03:11:06.617+01
\.


--
-- Data for Name: message_attachments; Type: TABLE DATA; Schema: public; Owner: yvesmpunga
--

COPY public.message_attachments (id, message_id, filename, original_name, filepath, filetype, filesize, created_at, updated_at) FROM stdin;
b9a021ac-a2b2-403c-ba21-010f1bf318f4	3964d992-29f5-40af-ba08-9658005a21ea	1767450651388_attachment	attachment	/images/communicationinterne/documents/1767450651388_attachment	message/rfc822	6505	2026-01-03 15:30:51.388+01	2026-01-03 15:30:51.388+01
\.


--
-- Data for Name: message_recipients; Type: TABLE DATA; Schema: public; Owner: yvesmpunga
--

COPY public.message_recipients (id, message_id, recipient_id, recipient_type, read_at, is_deleted, deleted_at, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: messages; Type: TABLE DATA; Schema: public; Owner: yvesmpunga
--

COPY public.messages (id, subject, body, priority, sender_id, is_deleted, deleted_at, created_at, updated_at, message_type, external_from, external_to, external_cc, external_message_id, sent_at, send_status, send_error) FROM stdin;
22fc0990-2c96-420a-aed2-d908fcc2143d	Teste email a partir du comopte	<p>Je suis en train de tester en email 22</p>	NORMAL	cmjopae590000zjq2jkhfrkre	f	\N	2026-01-03 14:28:34.979+01	2026-01-03 14:28:37.346+01	EXTERNAL_OUT	\N	["yves.mpunga33@gmail.com"]	\N	<ba7de47c-4d43-82f8-9298-3d13e7f4df19@futurissvision.com>	2026-01-03 13:28:37.346	SENT	\N
9058d4f5-1d98-42db-a7f6-2e6e438be85e	Email bie. formatte2	<p>Je suis en train de tester un email externe bienformstté</p>	NORMAL	cmjopae590000zjq2jkhfrkre	f	\N	2026-01-03 14:48:43.073+01	2026-01-03 14:48:45.799+01	EXTERNAL_OUT	\N	["yves.munga33@gmail.com"]	\N	<5fe701d9-d16e-c3b2-0b55-54c23412fa51@futurissvision.com>	2026-01-03 13:48:45.799	SENT	\N
6425170a-8eb1-42a6-b334-2f1428fe80fd	Teste email	<p>Je suis en train de tester kles email dynamique</p>	NORMAL	cmjopae590000zjq2jkhfrkre	f	\N	2026-01-03 14:51:51.621+01	2026-01-03 14:51:53.856+01	EXTERNAL_OUT	\N	["yves.mpunga33@gmail.com"]	\N	<69fdfc4c-70e7-2781-60b0-2794f486aea1@futurissvision.com>	2026-01-03 13:51:53.856	SENT	\N
3964d992-29f5-40af-ba08-9658005a21ea	Undelivered Mail Returned to Sender	<p>This is the mail system at host <a href="http://pe-bsn.jellyfish.systems">pe-bsn.jellyfish.systems</a>.</p><p>I&apos;m sorry to have to inform you that your message could not<br/>be delivered to one or more recipients. It&apos;s attached below.</p><p>For further assistance, please send mail to postmaster.</p><p>If you do so, please include this problem report. You can<br/>delete your own text from the attached returned message.</p><p>                   The mail system</p><p>&lt;<a href="mailto:yves.munga33@gmail.com">yves.munga33@gmail.com</a>&gt;: host <a href="http://gmail-smtp-in.l.google.com">gmail-smtp-in.l.google.com</a>[<a href="http://64.233.177.26">64.233.177.26</a>] said:<br/>    550-5.1.1 The email account that you tried to reach does not exist. Please<br/>    try 550-5.1.1 double-checking the recipient&apos;s email address for typos or<br/>    550-5.1.1 unnecessary spaces. For more information, go to 550 5.1.1<br/>    <a href="https://support.google.com/mail/?p=NoSuchUser">https://support.google.com/mail/?p=NoSuchUser</a><br/>    00721157ae682-78fb462a7a8si673256787b3.259 - gsmtp (in reply to RCPT TO<br/>    command)</p><br/>\n<p>Reporting-MTA: dns; <a href="http://pe-bsn.jellyfish.systems">pe-bsn.jellyfish.systems</a><br/>X-Postfix-Queue-ID: 4dk23165jVz2ycw<br/>X-Postfix-Sender: rfc822; <a href="mailto:merrykapula@futurissvision.com">merrykapula@futurissvision.com</a><br/>Arrival-Date: Sat, 03 Jan 2026 13:48:45 +0000 (UTC)</p><p>Final-Recipient: rfc822; <a href="mailto:yves.munga33@gmail.com">yves.munga33@gmail.com</a><br/>Original-Recipient: <a href="mailto:rfc822;yves.munga33@gmail.com">rfc822;yves.munga33@gmail.com</a><br/>Action: failed<br/>Status: 5.1.1<br/>Remote-MTA: dns; <a href="http://gmail-smtp-in.l.google.com">gmail-smtp-in.l.google.com</a><br/>Diagnostic-Code: smtp; 550-5.1.1 The email account that you tried to reach does<br/>    not exist. Please try 550-5.1.1 double-checking the recipient&apos;s email<br/>    address for typos or 550-5.1.1 unnecessary spaces. For more information, go<br/>    to 550 5.1.1  <a href="https://support.google.com/mail/?p=NoSuchUser">https://support.google.com/mail/?p=NoSuchUser</a><br/>    00721157ae682-78fb462a7a8si673256787b3.259 - gsmtp</p>	NORMAL	\N	f	\N	2026-01-03 14:48:46+01	2026-01-03 15:30:51.383+01	EXTERNAL_IN	MAILER-DAEMON@pe-bsn.jellyfish.systems	["merrykapula@futurissvision.com"]	\N	<4dk23235Fwz2ywg@pe-bsn.jellyfish.systems>	2026-01-03 13:48:46	SENT	\N
c5ad3489-8b75-45e7-80d4-476a8cac069c	Testing ANPI Email	<p>Hello Emmanuel </p>	NORMAL	cmjopae590000zjq2jkhfrkre	f	\N	2026-01-03 17:26:46.067+01	2026-01-03 17:26:48.955+01	EXTERNAL_OUT	\N	["ebaako7@gmail.com"]	\N	<fe5c8b34-272c-7446-0408-8901e5a0beba@futurissvision.com>	2026-01-03 16:26:48.955	SENT	\N
\.


--
-- Data for Name: ministries; Type: TABLE DATA; Schema: public; Owner: yvesmpunga
--

COPY public.ministries (id, code, name, "shortName", description, address, phone, email, website, "contactPerson", "contactEmail", "contactPhone", "isActive", "createdAt", "updatedAt") FROM stdin;
366e67f9-b8ff-4944-bc1b-ae2352dd77ed	MIN-PLAN	Ministere du Plan	Plan	Ministere du Plan	\N	\N	\N	\N	\N	\N	\N	t	2025-12-29 06:44:47.376+01	2025-12-29 06:44:47.376+01
a05085da-8a12-46d3-ba54-2c7f3c9ff5e3	MIN-FIN	Ministere des Finances	Finances	Ministere des Finances	\N	\N	\N	\N	\N	\N	\N	t	2025-12-29 06:44:47.376+01	2025-12-29 06:44:47.376+01
abe2ef02-9479-40ef-9b64-04b2d851df11	MIN-COM	Ministere du Commerce Exterieur	Commerce	Ministere du Commerce Exterieur	\N	\N	\N	\N	\N	\N	\N	t	2025-12-29 06:44:47.376+01	2025-12-29 06:44:47.376+01
d31c0252-90de-4fae-8fb9-f001f0a6591e	MIN-IND	Ministere de l'Industrie	Industrie	Ministere de l'Industrie	\N	\N	\N	\N	\N	\N	\N	t	2025-12-29 06:44:47.376+01	2025-12-29 06:44:47.376+01
72b9abbd-b70e-46cc-bae4-eee5cb71325d	MIN-MINE	Ministere des Mines	Mines	Ministere des Mines	\N	\N	\N	\N	\N	\N	\N	t	2025-12-29 06:44:47.376+01	2025-12-29 06:44:47.376+01
d33f001c-23b0-457d-8d8f-538f97eacc16	MIN-AGRI	Ministere de l'Agriculture	Agriculture	Ministere de l'Agriculture	\N	\N	\N	\N	\N	\N	\N	t	2025-12-29 06:44:47.376+01	2025-12-29 06:44:47.376+01
4eb63f50-d06a-4288-86f8-789e3c2f7d4d	MIN-TRANS	Ministere des Transports	Transports	Ministere des Transports et Voies de Communication	\N	\N	\N	\N	\N	\N	\N	t	2025-12-29 06:44:47.376+01	2025-12-29 06:44:47.376+01
b4c4d208-ba0f-4e2f-87ae-0f263fa8a8c7	MIN-ENERG	Ministere de l'Energie	Energie	Ministere de l'Energie et Ressources Hydrauliques	\N	\N	\N	\N	\N	\N	\N	t	2025-12-29 06:44:47.376+01	2025-12-29 06:44:47.376+01
222a177a-1027-4909-8da1-1c551c65ffe2	MIN-ENV	Ministere de l'Environnement	Environnement	Ministere de l'Environnement et Developpement Durable	\N	\N	\N	\N	\N	\N	\N	t	2025-12-29 06:44:47.376+01	2025-12-29 06:44:47.376+01
73c13713-92e7-4613-99f6-ef83b9a7fa4d	MIN-INT	Ministere de l'Interieur	Interieur	Ministere de l'Interieur et Securite	\N	\N	\N	\N	\N	\N	\N	t	2025-12-29 06:44:47.376+01	2025-12-29 06:44:47.376+01
d0fac2fe-221e-455a-a6c4-b79449054fbd	MIN-JUST	Ministere de la Justice	Justice	Ministere de la Justice	\N	\N	\N	\N	\N	\N	\N	t	2025-12-29 06:44:47.376+01	2025-12-29 06:44:47.376+01
488984b3-173c-4944-9bb6-ebe597b69d43	ANAPI	ANAPI	ANAPI -99	Agence Nationale pour la Promotion des Investissements								t	2025-12-29 06:44:47.376+01	2026-01-01 23:05:42.803+01
\.


--
-- Data for Name: ministry_departments; Type: TABLE DATA; Schema: public; Owner: yvesmpunga
--

COPY public.ministry_departments (id, code, name, description, ministry_id, head_name, head_title, phone, email, is_active, created_at, updated_at) FROM stdin;
95b561f2-ae22-4e1a-9c7b-7650f8f11a35	DAF	Direction Administrative et Financière	\N	488984b3-173c-4944-9bb6-ebe597b69d43	\N	Directeur	\N	\N	t	2026-01-03 23:33:02.696+01	2026-01-03 23:33:02.696+01
4e4ed090-d583-468d-9d7e-5a202eec0c57	DI	Direction des Investissements	\N	488984b3-173c-4944-9bb6-ebe597b69d43	\N	Directeur	\N	\N	t	2026-01-03 23:33:02.706+01	2026-01-03 23:33:02.706+01
708e0f8a-6856-400f-92dd-95b7d23e03b1	DGU	Direction du Guichet Unique	\N	488984b3-173c-4944-9bb6-ebe597b69d43	\N	Directeur	\N	\N	t	2026-01-03 23:33:02.708+01	2026-01-03 23:33:02.708+01
7a18f193-9654-48be-9ef2-397f3a1ba5b4	DAJ	Direction des Affaires Juridiques	\N	488984b3-173c-4944-9bb6-ebe597b69d43	\N	Directeur	\N	\N	t	2026-01-03 23:33:02.71+01	2026-01-03 23:33:02.71+01
2c79b237-b17a-4322-8937-0a4928baa9cd	DPM	Direction de la Passation des Marchés	\N	488984b3-173c-4944-9bb6-ebe597b69d43	\N	Directeur	\N	\N	t	2026-01-03 23:33:02.712+01	2026-01-03 23:33:02.712+01
\.


--
-- Data for Name: ministry_request_documents; Type: TABLE DATA; Schema: public; Owner: yvesmpunga
--

COPY public.ministry_request_documents (id, "requestId", "documentType", "documentName", description, "isRequired", "requestedAtStep", "requestedById", "requestedByName", "requestedAt", "requestNote", status, "fileName", "fileUrl", "fileSize", "mimeType", "uploadedAt", "uploadedById", "uploadedByName", "validatedAt", "validatedById", "validatedByName", "validationNote", "rejectionReason", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: ministry_request_history; Type: TABLE DATA; Schema: public; Owner: yvesmpunga
--

COPY public.ministry_request_history (id, "requestId", "stepNumber", "stepName", action, "previousStatus", "newStatus", comment, "performedById", "performedByName", "createdAt") FROM stdin;
23aee36d-5844-4b88-a91d-018f6da34ac6	62538e2f-42bc-4592-b967-6c76cee28003	1	Création	CREATED	\N	DRAFT	\N	\N	Système (Simulation)	2025-10-17 16:45:44.127+01
7521530a-bf67-4bba-b87e-161505296032	62538e2f-42bc-4592-b967-6c76cee28003	1	Réception de la demande	SUBMITTED	DRAFT	SUBMITTED	\N	\N	Système (Simulation)	2025-10-21 16:45:44.127+01
f5009bae-e730-4e04-9c91-bdd773265041	62538e2f-42bc-4592-b967-6c76cee28003	1	Réception de la demande	STEP_COMPLETED	SUBMITTED	IN_PROGRESS	\N	\N	Système (Simulation)	2025-10-26 16:45:44.127+01
3f04b59b-173f-4c45-afe9-f1ba8676f518	62538e2f-42bc-4592-b967-6c76cee28003	2	Analyse technique	STEP_COMPLETED	IN_PROGRESS	IN_PROGRESS	\N	\N	Système (Simulation)	2025-10-29 16:45:44.127+01
1ecd0bfc-78df-4b80-bfe2-5be0480376c3	62538e2f-42bc-4592-b967-6c76cee28003	3	Vérification juridique	STEP_COMPLETED	IN_PROGRESS	IN_PROGRESS	\N	\N	Système (Simulation)	2025-11-03 16:45:44.127+01
85a5c4d9-42f9-4a43-ab4b-bc0e3e1df040	62538e2f-42bc-4592-b967-6c76cee28003	4	Validation du chef de service	STEP_COMPLETED	IN_PROGRESS	IN_PROGRESS	\N	\N	Système (Simulation)	2025-11-07 16:45:44.127+01
72254c16-6905-4693-9dcf-a2b30cb7b1f3	62538e2f-42bc-4592-b967-6c76cee28003	5	Décision finale	APPROVED	UNDER_REVIEW	APPROVED	Demande approuvée après vérification complète du dossier.	\N	Système (Simulation)	2025-11-11 16:45:44.127+01
8fc6cc92-2ac6-4b3f-8b9b-e17d1125ebcc	b0c27f20-139e-4c00-8f20-52148bbc8239	1	Création	CREATED	\N	DRAFT	\N	\N	Système (Simulation)	2025-11-16 19:59:47.939+01
b38876f9-3341-4b71-99db-e4274166ba29	b0c27f20-139e-4c00-8f20-52148bbc8239	1	Réception de la demande	SUBMITTED	DRAFT	SUBMITTED	\N	\N	Système (Simulation)	2025-11-18 19:59:47.939+01
0f7044d9-9298-43b8-a534-a54561e2f2ec	b0c27f20-139e-4c00-8f20-52148bbc8239	1	Réception de la demande	STEP_COMPLETED	SUBMITTED	IN_PROGRESS	\N	\N	Système (Simulation)	2025-11-22 19:59:47.939+01
5702e977-12c1-4eae-bc36-fd6b6b82bc12	b0c27f20-139e-4c00-8f20-52148bbc8239	2	Analyse technique	STEP_COMPLETED	IN_PROGRESS	IN_PROGRESS	\N	\N	Système (Simulation)	2025-11-24 19:59:47.939+01
45048f9d-7451-4084-9cbe-39955ddf3057	b0c27f20-139e-4c00-8f20-52148bbc8239	3	Vérification juridique	STEP_COMPLETED	IN_PROGRESS	IN_PROGRESS	\N	\N	Système (Simulation)	2025-11-28 19:59:47.939+01
c6100ac4-9140-403a-ab23-2185f2e47ec0	b0c27f20-139e-4c00-8f20-52148bbc8239	4	Validation du chef de service	STEP_COMPLETED	IN_PROGRESS	IN_PROGRESS	\N	\N	Système (Simulation)	2025-12-01 19:59:47.939+01
6cc3e358-ef92-45f1-83cd-91157193f991	b0c27f20-139e-4c00-8f20-52148bbc8239	5	Décision finale	REJECTED	UNDER_REVIEW	REJECTED	Demande rejetée - critères non satisfaits.	\N	Système (Simulation)	2025-12-02 19:59:47.939+01
d506e00f-b91d-4540-9063-ab77a32b0409	06def3a4-e4d2-4eb5-96c0-13471426650e	1	Création	CREATED	\N	DRAFT	\N	\N	Système (Simulation)	2025-10-21 05:28:19.936+01
b7796e98-9081-452d-aad2-d0837a452360	06def3a4-e4d2-4eb5-96c0-13471426650e	1	Réception de la demande	SUBMITTED	DRAFT	SUBMITTED	\N	\N	Système (Simulation)	2025-10-25 05:28:19.936+01
9fe9e2fe-2251-4776-b17a-64f84159f842	1d1f5971-f654-46a1-b72e-ea9a1fca24fe	1	Création	CREATED	\N	DRAFT	\N	\N	Système (Simulation)	2025-11-16 02:21:12.085+01
1429df3c-c744-42ce-833e-b884ffb9f45a	88fab93c-2c91-4c33-a599-922ac1b5849f	1	Création	CREATED	\N	DRAFT	\N	\N	Système (Simulation)	2025-12-29 16:17:19.76+01
04f718d9-8b1c-4813-b35f-d2c868069074	88fab93c-2c91-4c33-a599-922ac1b5849f	1	Enregistrement	SUBMITTED	DRAFT	SUBMITTED	\N	\N	Système (Simulation)	2026-01-03 16:17:19.76+01
292a90bb-67f7-43e3-9448-146e5f0e13d4	88fab93c-2c91-4c33-a599-922ac1b5849f	1	Enregistrement	STEP_COMPLETED	SUBMITTED	IN_PROGRESS	\N	\N	Système (Simulation)	2026-01-07 16:17:19.76+01
cf0154c9-1b65-4033-bfb5-95372c6a899f	e5159a19-8d2e-4ad0-9340-862c883017d8	1	Création	CREATED	\N	DRAFT	\N	\N	Système (Simulation)	2025-11-03 21:00:05.267+01
8a43d65f-17f7-4f01-8dd6-9010bbe781d3	cc260406-115f-4b7c-abcc-bfab03a05418	1	Création	CREATED	\N	DRAFT	\N	\N	Système (Simulation)	2025-11-01 10:12:42.848+01
87d82228-d172-431a-b18f-db524ff4781d	cc260406-115f-4b7c-abcc-bfab03a05418	1	Enregistrement	SUBMITTED	DRAFT	SUBMITTED	\N	\N	Système (Simulation)	2025-11-04 10:12:42.848+01
2a600669-3c75-4423-8646-2d47fdbf5e0b	cc260406-115f-4b7c-abcc-bfab03a05418	1	Enregistrement	STEP_COMPLETED	SUBMITTED	IN_PROGRESS	\N	\N	Système (Simulation)	2025-11-05 10:12:42.848+01
d6905696-eabe-470c-8b17-d33f4c60eb97	cc260406-115f-4b7c-abcc-bfab03a05418	2	Inspection préalable	STEP_COMPLETED	IN_PROGRESS	IN_PROGRESS	\N	\N	Système (Simulation)	2025-11-09 10:12:42.848+01
d7926f48-82c0-44f7-ade8-fffadfdd4606	cc260406-115f-4b7c-abcc-bfab03a05418	3	Évaluation des capacités	STEP_COMPLETED	IN_PROGRESS	IN_PROGRESS	\N	\N	Système (Simulation)	2025-11-12 10:12:42.848+01
c34a4bd2-860e-4ad9-8060-d71b8934a296	cc260406-115f-4b7c-abcc-bfab03a05418	4	Commission d'attribution	STEP_COMPLETED	IN_PROGRESS	IN_PROGRESS	\N	\N	Système (Simulation)	2025-11-13 10:12:42.848+01
e92faba9-30dd-462a-8dc4-7ca6613a94d1	cc260406-115f-4b7c-abcc-bfab03a05418	5	Émission de la licence	REJECTED	UNDER_REVIEW	REJECTED	Demande rejetée - critères non satisfaits.	\N	Système (Simulation)	2025-11-14 10:12:42.848+01
5eab4ded-2b7b-45a0-b59b-8362f78a3d2f	3cfd304e-6946-447e-b279-9fcb23b4f85f	1	Création	CREATED	\N	DRAFT	\N	\N	Système (Simulation)	2025-10-21 10:11:24.217+01
73d860c6-28a4-437f-b39f-5561f127c15b	3cfd304e-6946-447e-b279-9fcb23b4f85f	1	Enregistrement	SUBMITTED	DRAFT	SUBMITTED	\N	\N	Système (Simulation)	2025-10-24 10:11:24.217+01
8a49d380-12a1-44d9-823e-f81ffccb78b8	24d86165-f7d9-4eb7-a366-dc5960126425	1	Création	CREATED	\N	DRAFT	\N	\N	Système (Simulation)	2025-10-12 11:11:56.46+01
fba62ecc-2207-483e-817f-b10142818d80	22521d10-3e1b-4815-9620-1e8ae28b7941	1	Création	CREATED	\N	DRAFT	\N	\N	Système (Simulation)	2025-11-17 05:13:27.649+01
661919f9-fa4f-4d53-8a96-92b92398e506	22521d10-3e1b-4815-9620-1e8ae28b7941	1	Enregistrement	SUBMITTED	DRAFT	SUBMITTED	\N	\N	Système (Simulation)	2025-11-19 05:13:27.649+01
ee245a06-ad8c-4eb7-b2bd-f05479f1a26b	d95b6c25-5263-490f-918d-c2daf5eb7b7c	1	Création	CREATED	\N	DRAFT	\N	\N	Système (Simulation)	2025-12-09 21:41:48.734+01
6274899f-6f45-4988-a142-974f43b294cf	d95b6c25-5263-490f-918d-c2daf5eb7b7c	1	Enregistrement	SUBMITTED	DRAFT	SUBMITTED	\N	\N	Système (Simulation)	2025-12-11 21:41:48.734+01
28c6bdf3-cec1-4740-b8ce-7a47f3e4cb00	d95b6c25-5263-490f-918d-c2daf5eb7b7c	1	Enregistrement	STEP_COMPLETED	SUBMITTED	IN_PROGRESS	\N	\N	Système (Simulation)	2025-12-13 21:41:48.734+01
f7d20273-2621-42d9-b6b8-8b250c123305	d95b6c25-5263-490f-918d-c2daf5eb7b7c	2	Inspection préalable	STEP_COMPLETED	IN_PROGRESS	IN_PROGRESS	\N	\N	Système (Simulation)	2025-12-14 21:41:48.734+01
b8b58f24-57fa-499b-9500-4e7e136bb7b7	d95b6c25-5263-490f-918d-c2daf5eb7b7c	3	Évaluation des capacités	STEP_COMPLETED	IN_PROGRESS	IN_PROGRESS	\N	\N	Système (Simulation)	2025-12-17 21:41:48.734+01
365cf9ee-fe84-480e-9e23-5d4a2cd5304b	6e48d91c-9063-4038-82fe-4de04fc6c5a7	1	Création	CREATED	\N	DRAFT	\N	\N	Système (Simulation)	2025-11-17 03:04:57.464+01
6001589a-6493-4192-97bd-8e40dc19015c	07e77d5e-49b0-48a7-9da2-b7e155e54052	1	Création	CREATED	\N	DRAFT	\N	\N	Système (Simulation)	2025-10-31 08:18:50.045+01
5893b53c-05cf-47d2-b644-2a2b2d01eff3	07e77d5e-49b0-48a7-9da2-b7e155e54052	1	Dépôt de dossier	SUBMITTED	DRAFT	SUBMITTED	\N	\N	Système (Simulation)	2025-11-05 08:18:50.045+01
1df3c5f4-9a74-4591-8cfc-4c62285b2b46	07e77d5e-49b0-48a7-9da2-b7e155e54052	1	Dépôt de dossier	STEP_COMPLETED	SUBMITTED	IN_PROGRESS	\N	\N	Système (Simulation)	2025-11-10 08:18:50.045+01
92ada55d-5607-4880-ad6d-322cef704df9	07e77d5e-49b0-48a7-9da2-b7e155e54052	2	Étude de conformité	STEP_COMPLETED	IN_PROGRESS	IN_PROGRESS	\N	\N	Système (Simulation)	2025-11-15 08:18:50.045+01
54ee3f27-db08-4265-9efe-11c0194c6be2	4158bd43-0254-4aa9-b86b-51689fa8bff6	1	Création	CREATED	\N	DRAFT	\N	\N	Système (Simulation)	2025-11-23 18:01:24.96+01
dc2e91bd-5f0d-493b-a014-112761baad54	4158bd43-0254-4aa9-b86b-51689fa8bff6	1	Dépôt de dossier	SUBMITTED	DRAFT	SUBMITTED	\N	\N	Système (Simulation)	2025-11-28 18:01:24.96+01
e39da5ad-f5b1-4f99-8e4e-e0dac68d8ff5	4158bd43-0254-4aa9-b86b-51689fa8bff6	1	Dépôt de dossier	STEP_COMPLETED	SUBMITTED	IN_PROGRESS	\N	\N	Système (Simulation)	2025-12-01 18:01:24.96+01
8d53fea0-46cb-4eb0-afe5-ec10a559689a	4158bd43-0254-4aa9-b86b-51689fa8bff6	2	Étude de conformité	STEP_COMPLETED	IN_PROGRESS	IN_PROGRESS	\N	\N	Système (Simulation)	2025-12-03 18:01:24.96+01
0ed2a754-4c04-4895-800c-2ffb154564b8	4158bd43-0254-4aa9-b86b-51689fa8bff6	3	Enquête de terrain	STEP_COMPLETED	IN_PROGRESS	IN_PROGRESS	\N	\N	Système (Simulation)	2025-12-08 18:01:24.96+01
484ee584-c5f1-4ed5-9f10-1c91cb94276f	4158bd43-0254-4aa9-b86b-51689fa8bff6	4	Avis technique	STEP_COMPLETED	IN_PROGRESS	IN_PROGRESS	\N	\N	Système (Simulation)	2025-12-13 18:01:24.96+01
3558b8ff-1052-494d-a1c8-d9c64f225a38	4158bd43-0254-4aa9-b86b-51689fa8bff6	5	Délivrance du permis	APPROVED	UNDER_REVIEW	APPROVED	Demande approuvée après vérification complète du dossier.	\N	Système (Simulation)	2025-12-14 18:01:24.96+01
e42f73c7-cc3c-41b9-9797-7f0894a831a4	d396e16d-8ace-42b8-aefd-1010c0ced6ab	1	Création	CREATED	\N	DRAFT	\N	\N	Système (Simulation)	2025-11-25 16:36:29.431+01
bb7a33d1-5e16-4c81-b644-b612840f557e	d396e16d-8ace-42b8-aefd-1010c0ced6ab	1	Réception de la demande	SUBMITTED	DRAFT	SUBMITTED	\N	\N	Système (Simulation)	2025-11-30 16:36:29.431+01
d1f7e1d5-34cc-4edb-a4fa-1a03e6adba34	d396e16d-8ace-42b8-aefd-1010c0ced6ab	1	Réception de la demande	STEP_COMPLETED	SUBMITTED	IN_PROGRESS	\N	\N	Système (Simulation)	2025-12-01 16:36:29.431+01
da9ff3f4-c434-4ffb-8675-4c0ef27d3a3b	d396e16d-8ace-42b8-aefd-1010c0ced6ab	2	Analyse technique	STEP_COMPLETED	IN_PROGRESS	IN_PROGRESS	\N	\N	Système (Simulation)	2025-12-04 16:36:29.431+01
6e8f9b53-a8a6-4e56-a2dd-215106f0bcc4	d396e16d-8ace-42b8-aefd-1010c0ced6ab	3	Vérification juridique	STEP_COMPLETED	IN_PROGRESS	IN_PROGRESS	\N	\N	Système (Simulation)	2025-12-07 16:36:29.431+01
833141ae-ee5e-46ef-b3d4-6e39246a2daa	d396e16d-8ace-42b8-aefd-1010c0ced6ab	4	Validation du chef de service	STEP_COMPLETED	IN_PROGRESS	IN_PROGRESS	\N	\N	Système (Simulation)	2025-12-08 16:36:29.431+01
53db8e46-278e-40b3-95b3-d19cbb3415bb	d396e16d-8ace-42b8-aefd-1010c0ced6ab	5	Décision finale	REJECTED	UNDER_REVIEW	REJECTED	Demande rejetée - critères non satisfaits.	\N	Système (Simulation)	2025-12-09 16:36:29.431+01
fac0e860-045e-43b8-a4ed-6a6a0db630eb	e1e2272a-5016-4cc8-9364-cee9d4987708	1	Création	CREATED	\N	DRAFT	\N	\N	Système (Simulation)	2025-11-02 19:29:09.737+01
8def5f4b-add3-4a53-98da-95a728c0c261	e1e2272a-5016-4cc8-9364-cee9d4987708	1	Réception de la demande	SUBMITTED	DRAFT	SUBMITTED	\N	\N	Système (Simulation)	2025-11-03 19:29:09.737+01
81732e20-123e-4dda-8a33-66ab514c627c	e1e2272a-5016-4cc8-9364-cee9d4987708	1	Réception de la demande	STEP_COMPLETED	SUBMITTED	IN_PROGRESS	\N	\N	Système (Simulation)	2025-11-05 19:29:09.737+01
30f23902-93e9-42a2-af57-17279f7dee63	e1e2272a-5016-4cc8-9364-cee9d4987708	2	Analyse technique	STEP_COMPLETED	IN_PROGRESS	IN_PROGRESS	\N	\N	Système (Simulation)	2025-11-10 19:29:09.737+01
2c5d2513-c5ec-40bb-9ce9-0434d10f6f31	e1e2272a-5016-4cc8-9364-cee9d4987708	3	Vérification juridique	STEP_COMPLETED	IN_PROGRESS	IN_PROGRESS	\N	\N	Système (Simulation)	2025-11-13 19:29:09.737+01
f4f2cb39-e90c-49bb-b629-35ad5e568735	aa59cea0-442c-4307-b2eb-c28802cf9d23	1	Création	CREATED	\N	DRAFT	\N	\N	Système (Simulation)	2025-11-26 23:21:13.499+01
b5b75ede-4472-463c-bed3-34bb7f873ef4	f7ef6c7f-f334-421f-ad96-d790d8628444	1	Création	CREATED	\N	DRAFT	\N	\N	Système (Simulation)	2025-10-11 04:48:21.697+01
8fd53a32-f896-4a41-a2d5-c3f7dde20a70	92e00eff-a619-4964-b698-7b35d153d736	1	Création	CREATED	\N	DRAFT	\N	\N	Système (Simulation)	2025-11-06 14:36:02.089+01
b91d2ee6-ce23-427c-8d1c-784785a6e267	92e00eff-a619-4964-b698-7b35d153d736	1	Réception de la demande	SUBMITTED	DRAFT	SUBMITTED	\N	\N	Système (Simulation)	2025-11-10 14:36:02.089+01
73c15855-73ad-48b2-8a3b-8eaa3eb652c3	92e00eff-a619-4964-b698-7b35d153d736	1	Réception de la demande	STEP_COMPLETED	SUBMITTED	IN_PROGRESS	\N	\N	Système (Simulation)	2025-11-15 14:36:02.089+01
298abb54-aae6-484d-a831-e3cbc2329f22	0cd1c471-7599-4b6c-b0fe-222e1b3910d3	1	Création	CREATED	\N	DRAFT	\N	\N	Système (Simulation)	2025-12-18 13:53:20.501+01
df21b547-cb1a-4fc5-9857-4a9eb2e4036b	0cd1c471-7599-4b6c-b0fe-222e1b3910d3	1	Réception de la demande	SUBMITTED	DRAFT	SUBMITTED	\N	\N	Système (Simulation)	2025-12-22 13:53:20.501+01
3975b710-4feb-46e7-973b-7ebb65a5c5be	0cd1c471-7599-4b6c-b0fe-222e1b3910d3	1	Réception de la demande	STEP_COMPLETED	SUBMITTED	IN_PROGRESS	\N	\N	Système (Simulation)	2025-12-23 13:53:20.501+01
601f7a0a-c43f-4eba-b3dc-43fcefa47cca	0cd1c471-7599-4b6c-b0fe-222e1b3910d3	2	Analyse technique	STEP_COMPLETED	IN_PROGRESS	IN_PROGRESS	\N	\N	Système (Simulation)	2025-12-28 13:53:20.501+01
45f7ad15-5088-4019-af45-5ea2f4e3bbb3	0cd1c471-7599-4b6c-b0fe-222e1b3910d3	3	Vérification juridique	STEP_COMPLETED	IN_PROGRESS	IN_PROGRESS	\N	\N	Système (Simulation)	2025-12-29 13:53:20.501+01
68285242-ac8e-4b2a-aae2-df3c0e5c18da	0cd1c471-7599-4b6c-b0fe-222e1b3910d3	4	Validation du chef de service	STEP_COMPLETED	IN_PROGRESS	IN_PROGRESS	\N	\N	Système (Simulation)	2026-01-01 13:53:20.501+01
fd79227c-980f-4da3-87a9-71afaa6ebaef	0cd1c471-7599-4b6c-b0fe-222e1b3910d3	5	Décision finale	APPROVED	UNDER_REVIEW	APPROVED	Demande approuvée après vérification complète du dossier.	\N	Système (Simulation)	2026-01-04 13:53:20.501+01
a502c4bd-aedb-4ed2-bd72-a61062d35806	7f71fd5c-4b7f-442d-989b-92b8ece39d91	1	Création	CREATED	\N	DRAFT	\N	\N	Système (Simulation)	2025-12-23 04:59:16.744+01
a4b38bfc-6cac-45a0-8786-f8e39114a115	7f71fd5c-4b7f-442d-989b-92b8ece39d91	1	Réception de la demande	SUBMITTED	DRAFT	SUBMITTED	\N	\N	Système (Simulation)	2025-12-27 04:59:16.744+01
edbb2f3b-afb3-487b-b81d-3ecfafadd124	7f71fd5c-4b7f-442d-989b-92b8ece39d91	1	Réception de la demande	STEP_COMPLETED	SUBMITTED	IN_PROGRESS	\N	\N	Système (Simulation)	2025-12-28 04:59:16.744+01
5e0f9c0f-51c5-4fda-8fed-2a65ed29b2bb	7f71fd5c-4b7f-442d-989b-92b8ece39d91	2	Analyse technique	STEP_COMPLETED	IN_PROGRESS	IN_PROGRESS	\N	\N	Système (Simulation)	2025-12-30 04:59:16.744+01
ddb79543-7d35-4072-b4a8-5cf0bc3529a7	7f71fd5c-4b7f-442d-989b-92b8ece39d91	3	Vérification juridique	STEP_COMPLETED	IN_PROGRESS	IN_PROGRESS	\N	\N	Système (Simulation)	2026-01-04 04:59:16.744+01
ad6ac07c-98bd-40d7-9017-dfca6c57eec3	cbdf29af-534b-439e-8b00-357f3916dba8	1	Création	CREATED	\N	DRAFT	\N	\N	Système (Simulation)	2025-10-06 01:43:36.785+01
555a9ae4-cb96-466b-8b14-dd3aed88041a	cbdf29af-534b-439e-8b00-357f3916dba8	1	Réception de la demande	SUBMITTED	DRAFT	SUBMITTED	\N	\N	Système (Simulation)	2025-10-11 01:43:36.785+01
d8b17fea-1006-4b8d-ab03-d54f3c1964d9	cbdf29af-534b-439e-8b00-357f3916dba8	1	Réception de la demande	STEP_COMPLETED	SUBMITTED	IN_PROGRESS	\N	\N	Système (Simulation)	2025-10-16 01:43:36.785+01
71170a6f-95fa-424a-bcd2-39146dc786b0	cbdf29af-534b-439e-8b00-357f3916dba8	2	Analyse technique	STEP_COMPLETED	IN_PROGRESS	IN_PROGRESS	\N	\N	Système (Simulation)	2025-10-19 01:43:36.785+01
28bbb680-f337-4612-ac29-30038dc08b40	cbdf29af-534b-439e-8b00-357f3916dba8	3	Vérification juridique	STEP_COMPLETED	IN_PROGRESS	IN_PROGRESS	\N	\N	Système (Simulation)	2025-10-23 01:43:36.785+01
9587929c-423b-43b3-8ecf-c6f9419f9b52	002e5681-2080-4042-a0b4-ddd842a9555d	1	Création	CREATED	\N	DRAFT	\N	\N	Système (Simulation)	2025-11-04 16:40:41.458+01
815961bb-591f-467d-8697-fd57a9050f0c	002e5681-2080-4042-a0b4-ddd842a9555d	1	Enregistrement	SUBMITTED	DRAFT	SUBMITTED	\N	\N	Système (Simulation)	2025-11-09 16:40:41.458+01
8320372a-e090-4b19-ac67-1414d07ad36d	002e5681-2080-4042-a0b4-ddd842a9555d	1	Enregistrement	STEP_COMPLETED	SUBMITTED	IN_PROGRESS	\N	\N	Système (Simulation)	2025-11-13 16:40:41.458+01
af537ff1-b404-41ad-a6db-62af040803cf	61ca34b3-b514-4df7-a659-6ba324e64d95	1	Création	CREATED	\N	DRAFT	\N	\N	Système (Simulation)	2025-11-27 19:27:56.343+01
a81e4d0d-af3a-4202-9888-44fb93ce88eb	61ca34b3-b514-4df7-a659-6ba324e64d95	1	Enregistrement	SUBMITTED	DRAFT	SUBMITTED	\N	\N	Système (Simulation)	2025-12-02 19:27:56.343+01
8dc05944-d209-469c-a814-7aacf77ec38c	f6ec0712-d7d9-4598-9f4a-66e82e5353ed	1	Création	CREATED	\N	DRAFT	\N	\N	Système (Simulation)	2025-12-12 04:05:42.428+01
ae55dd50-f447-44a9-b6f5-6a7fb5805475	53ea495b-79c2-45ea-b99f-78113848d6be	1	Création	CREATED	\N	DRAFT	\N	\N	Système (Simulation)	2025-10-21 12:58:39.014+01
56cec61a-f47c-4b5f-864e-92b6034ab0cc	53ea495b-79c2-45ea-b99f-78113848d6be	1	Enregistrement	SUBMITTED	DRAFT	SUBMITTED	\N	\N	Système (Simulation)	2025-10-24 12:58:39.014+01
38bc974f-31a8-4397-982a-3993af2c5f1b	53ea495b-79c2-45ea-b99f-78113848d6be	1	Enregistrement	STEP_COMPLETED	SUBMITTED	IN_PROGRESS	\N	\N	Système (Simulation)	2025-10-25 12:58:39.014+01
aa48c03b-529d-47f9-bcd2-cdbf2e7a0351	47b20e6d-c7e9-4c4a-9605-b7e2b399c095	1	Création	CREATED	\N	DRAFT	\N	\N	Système (Simulation)	2025-12-10 04:11:22.511+01
d31848e9-a5e9-4c90-9134-09398d81d626	47b20e6d-c7e9-4c4a-9605-b7e2b399c095	1	Enregistrement	SUBMITTED	DRAFT	SUBMITTED	\N	\N	Système (Simulation)	2025-12-13 04:11:22.511+01
26ba3310-e10e-4e7d-948c-e58e0cd92d37	47b20e6d-c7e9-4c4a-9605-b7e2b399c095	1	Enregistrement	STEP_COMPLETED	SUBMITTED	IN_PROGRESS	\N	\N	Système (Simulation)	2025-12-16 04:11:22.511+01
4d499f9a-268f-4f3d-8164-462012f0ea0a	deeb7db1-8d7c-4646-8e66-8cd2dd396eb0	1	Création	CREATED	\N	DRAFT	\N	\N	Système (Simulation)	2025-12-20 10:18:04.297+01
94b72615-c0ac-436d-b1cc-fb62f7a3f665	deeb7db1-8d7c-4646-8e66-8cd2dd396eb0	1	Enregistrement	SUBMITTED	DRAFT	SUBMITTED	\N	\N	Système (Simulation)	2025-12-21 10:18:04.297+01
0f0b9d5d-4c65-4a3c-969c-6c7dc11b33ab	deeb7db1-8d7c-4646-8e66-8cd2dd396eb0	1	Enregistrement	STEP_COMPLETED	SUBMITTED	IN_PROGRESS	\N	\N	Système (Simulation)	2025-12-26 10:18:04.297+01
68ac2fbf-e08e-4bf0-8ca9-b597783974a3	deeb7db1-8d7c-4646-8e66-8cd2dd396eb0	2	Inspection préalable	STEP_COMPLETED	IN_PROGRESS	IN_PROGRESS	\N	\N	Système (Simulation)	2025-12-29 10:18:04.297+01
59cd8669-4266-4779-9a0b-d1e774e7253e	deeb7db1-8d7c-4646-8e66-8cd2dd396eb0	3	Évaluation des capacités	STEP_COMPLETED	IN_PROGRESS	IN_PROGRESS	\N	\N	Système (Simulation)	2026-01-03 10:18:04.297+01
fbf51788-be5d-4381-b122-68eda5e736ee	deeb7db1-8d7c-4646-8e66-8cd2dd396eb0	4	Commission d'attribution	STEP_COMPLETED	IN_PROGRESS	IN_PROGRESS	\N	\N	Système (Simulation)	2026-01-06 10:18:04.297+01
9d8dca0c-8fa8-4869-a1b5-d3bff8f6153f	deeb7db1-8d7c-4646-8e66-8cd2dd396eb0	5	Émission de la licence	REJECTED	UNDER_REVIEW	REJECTED	Demande rejetée - critères non satisfaits.	\N	Système (Simulation)	2026-01-07 10:18:04.297+01
ab244b7c-9a40-4074-b64c-5d3389874935	71c232c5-e667-4fce-b725-24ea9194b974	1	Création	CREATED	\N	DRAFT	\N	\N	Système (Simulation)	2025-11-02 02:18:06.58+01
a94c3bd5-4b54-4914-8843-c7b83f063ca1	71c232c5-e667-4fce-b725-24ea9194b974	1	Enregistrement	SUBMITTED	DRAFT	SUBMITTED	\N	\N	Système (Simulation)	2025-11-07 02:18:06.58+01
56b7477d-0a1d-4e32-836c-9d3221ea436e	71c232c5-e667-4fce-b725-24ea9194b974	1	Enregistrement	STEP_COMPLETED	SUBMITTED	IN_PROGRESS	\N	\N	Système (Simulation)	2025-11-11 02:18:06.58+01
7073c5e6-5ca0-4094-b885-c24ab7788d65	71c232c5-e667-4fce-b725-24ea9194b974	2	Inspection préalable	STEP_COMPLETED	IN_PROGRESS	IN_PROGRESS	\N	\N	Système (Simulation)	2025-11-15 02:18:06.58+01
c5a9aa21-6c02-49f2-93c9-ddbc42645c4a	b128168b-b500-4090-bff8-ce9e55b92a78	1	Création	CREATED	\N	DRAFT	\N	\N	Système (Simulation)	2025-12-02 19:30:44.917+01
f9502054-8f8a-4fa8-bbbe-d49ff717576b	b128168b-b500-4090-bff8-ce9e55b92a78	1	Dépôt de dossier	SUBMITTED	DRAFT	SUBMITTED	\N	\N	Système (Simulation)	2025-12-06 19:30:44.917+01
a5669627-9751-498f-9cd9-312aeb6c66a0	b128168b-b500-4090-bff8-ce9e55b92a78	1	Dépôt de dossier	STEP_COMPLETED	SUBMITTED	IN_PROGRESS	\N	\N	Système (Simulation)	2025-12-11 19:30:44.917+01
4404b369-5cca-4376-bf0b-c0da332687a1	b128168b-b500-4090-bff8-ce9e55b92a78	2	Étude de conformité	STEP_COMPLETED	IN_PROGRESS	IN_PROGRESS	\N	\N	Système (Simulation)	2025-12-16 19:30:44.917+01
adcab4f7-d352-427d-b1a0-9464f02c111f	27f7148e-f429-45be-a422-22a971ec9788	1	Création	CREATED	\N	DRAFT	\N	\N	Système (Simulation)	2025-11-19 18:16:18.071+01
56d0baf7-0e11-40e4-9752-e1d348262c80	27f7148e-f429-45be-a422-22a971ec9788	1	Dépôt de dossier	SUBMITTED	DRAFT	SUBMITTED	\N	\N	Système (Simulation)	2025-11-20 18:16:18.071+01
99872a10-ea04-4b16-8366-8e153cf53a27	27f7148e-f429-45be-a422-22a971ec9788	1	Dépôt de dossier	STEP_COMPLETED	SUBMITTED	IN_PROGRESS	\N	\N	Système (Simulation)	2025-11-21 18:16:18.071+01
1b59c91a-9862-4e2b-8c86-345389ad9909	27f7148e-f429-45be-a422-22a971ec9788	2	Étude de conformité	DOCUMENTS_REQUESTED	IN_PROGRESS	PENDING_DOCUMENTS	\N	\N	Système (Simulation)	2025-11-23 18:16:18.071+01
43362421-143d-4c7e-8c87-7ed4ac6adb05	aeb20734-0c42-45d0-8187-92aa74299df5	1	Création	CREATED	\N	DRAFT	\N	\N	Système (Simulation)	2025-12-13 03:46:01.467+01
2c34c378-d055-49c6-80d1-f3d7b4f79aeb	aeb20734-0c42-45d0-8187-92aa74299df5	1	Dépôt de dossier	SUBMITTED	DRAFT	SUBMITTED	\N	\N	Système (Simulation)	2025-12-17 03:46:01.467+01
203d44ef-02fd-4cb2-b264-d14a12e3174e	aeb20734-0c42-45d0-8187-92aa74299df5	1	Dépôt de dossier	STEP_COMPLETED	SUBMITTED	IN_PROGRESS	\N	\N	Système (Simulation)	2025-12-18 03:46:01.467+01
a6a41c5f-0dca-4383-9f75-26c71e850d15	aeb20734-0c42-45d0-8187-92aa74299df5	2	Étude de conformité	STEP_COMPLETED	IN_PROGRESS	IN_PROGRESS	\N	\N	Système (Simulation)	2025-12-21 03:46:01.467+01
0472d4a4-747b-45f6-bd85-c3968ba82197	47b49033-16d5-4708-b051-35732e906181	1	Création	CREATED	\N	DRAFT	\N	\N	Système (Simulation)	2025-12-09 21:29:06.225+01
f2f25b69-5163-4e3e-bbf7-1706b8035fd7	47b49033-16d5-4708-b051-35732e906181	1	Dépôt de dossier	SUBMITTED	DRAFT	SUBMITTED	\N	\N	Système (Simulation)	2025-12-13 21:29:06.225+01
fbcb5f4b-b6ec-4d02-9a0a-432730c90b5b	47b49033-16d5-4708-b051-35732e906181	1	Dépôt de dossier	STEP_COMPLETED	SUBMITTED	IN_PROGRESS	\N	\N	Système (Simulation)	2025-12-17 21:29:06.225+01
0b359900-80b4-4b21-a07b-1d941da116a9	47b49033-16d5-4708-b051-35732e906181	2	Étude de conformité	STEP_COMPLETED	IN_PROGRESS	IN_PROGRESS	\N	\N	Système (Simulation)	2025-12-21 21:29:06.225+01
13635a99-75f5-4ac4-befe-ecac2718e75c	47b49033-16d5-4708-b051-35732e906181	3	Enquête de terrain	STEP_COMPLETED	IN_PROGRESS	IN_PROGRESS	\N	\N	Système (Simulation)	2025-12-25 21:29:06.225+01
80cab4df-2e40-495c-8657-b6c30dad7766	47b49033-16d5-4708-b051-35732e906181	4	Avis technique	STEP_COMPLETED	IN_PROGRESS	IN_PROGRESS	\N	\N	Système (Simulation)	2025-12-27 21:29:06.225+01
d3069c4a-6270-494d-b727-e074feffa570	47b49033-16d5-4708-b051-35732e906181	5	Délivrance du permis	APPROVED	UNDER_REVIEW	APPROVED	Demande approuvée après vérification complète du dossier.	\N	Système (Simulation)	2025-12-31 21:29:06.225+01
d5adeb58-41c0-493b-ae6c-4fc6317c15b9	43989d64-001b-497a-9585-dca4d6449ad8	1	Création	CREATED	\N	DRAFT	\N	\N	Système (Simulation)	2025-12-08 12:04:27.37+01
6591a8b2-d697-4acc-a31f-f30354116257	da99127a-c341-4c03-9087-a0229cb3471b	1	Création	CREATED	\N	DRAFT	\N	\N	Système (Simulation)	2025-12-15 08:25:48.531+01
4e1ca3fd-0cdc-46f9-ba9d-8c99d04545be	8076c693-8632-4eec-b589-178be6ea252b	1	Création	CREATED	\N	DRAFT	\N	\N	Système (Simulation)	2025-11-08 05:22:18.401+01
1497f567-aff1-461e-90a2-2cf6cfabc9f0	8076c693-8632-4eec-b589-178be6ea252b	1	Dépôt de dossier	SUBMITTED	DRAFT	SUBMITTED	\N	\N	Système (Simulation)	2025-11-09 05:22:18.401+01
097f2139-00b9-4cab-a6f2-7105fa083b72	7c19e771-feb5-473f-8dc8-c3f6d6f5d0fc	1	Création	CREATED	\N	DRAFT	\N	\N	Système (Simulation)	2025-10-10 11:42:49.759+01
9cb2234d-9459-4f9e-a585-653ada6e41a0	7c19e771-feb5-473f-8dc8-c3f6d6f5d0fc	1	Réception de la demande	SUBMITTED	DRAFT	SUBMITTED	\N	\N	Système (Simulation)	2025-10-13 11:42:49.759+01
dce1bb7d-8fbe-4a8a-9e0d-108dd8531f1d	7c19e771-feb5-473f-8dc8-c3f6d6f5d0fc	1	Réception de la demande	STEP_COMPLETED	SUBMITTED	IN_PROGRESS	\N	\N	Système (Simulation)	2025-10-14 11:42:49.759+01
52ff0b8d-0e75-4dbc-8bbe-2a5c8f7719a8	7c19e771-feb5-473f-8dc8-c3f6d6f5d0fc	2	Analyse technique	STEP_COMPLETED	IN_PROGRESS	IN_PROGRESS	\N	\N	Système (Simulation)	2025-10-18 11:42:49.759+01
2e26429b-1730-4634-bb82-14fc69bacf91	7c19e771-feb5-473f-8dc8-c3f6d6f5d0fc	3	Vérification juridique	STEP_COMPLETED	IN_PROGRESS	IN_PROGRESS	\N	\N	Système (Simulation)	2025-10-20 11:42:49.759+01
7ce6810a-0826-4125-912b-83e85c474584	7c19e771-feb5-473f-8dc8-c3f6d6f5d0fc	4	Validation du chef de service	STEP_COMPLETED	IN_PROGRESS	IN_PROGRESS	\N	\N	Système (Simulation)	2025-10-21 11:42:49.759+01
871577fc-332f-4ef1-be19-1dd2486eac6f	7c19e771-feb5-473f-8dc8-c3f6d6f5d0fc	5	Décision finale	APPROVED	UNDER_REVIEW	APPROVED	Demande approuvée après vérification complète du dossier.	\N	Système (Simulation)	2025-10-23 11:42:49.759+01
2266f487-fb31-497d-87ba-beba40845175	5611c155-4bf5-4faf-a294-d9c45cf9bd27	1	Création	CREATED	\N	DRAFT	\N	\N	Système (Simulation)	2025-12-19 15:52:12.251+01
a3c879fd-e014-4ee8-b20d-81ad86565c30	5611c155-4bf5-4faf-a294-d9c45cf9bd27	1	Réception de la demande	SUBMITTED	DRAFT	SUBMITTED	\N	\N	Système (Simulation)	2025-12-23 15:52:12.251+01
f1af6553-81cf-4d40-afa8-bc630086d6bb	11d2e8e4-de43-4f07-9098-d5bcaa216b37	1	Création	CREATED	\N	DRAFT	\N	\N	Système (Simulation)	2025-11-03 19:31:57.064+01
bf60cd21-499e-4e24-96d3-967aebb32756	be45f809-5a24-4e86-99a2-f2b1bc0e4a8a	1	Création	CREATED	\N	DRAFT	\N	\N	Système (Simulation)	2025-12-15 03:05:10.968+01
2f6479ac-0228-4ef8-b87c-d269f842ab20	be45f809-5a24-4e86-99a2-f2b1bc0e4a8a	1	Réception de la demande	SUBMITTED	DRAFT	SUBMITTED	\N	\N	Système (Simulation)	2025-12-16 03:05:10.968+01
02f9e57c-dee1-43e4-b730-fc85672adccc	be45f809-5a24-4e86-99a2-f2b1bc0e4a8a	1	Réception de la demande	STEP_COMPLETED	SUBMITTED	IN_PROGRESS	\N	\N	Système (Simulation)	2025-12-18 03:05:10.968+01
1f110526-028b-4648-a08e-656f585716bc	be45f809-5a24-4e86-99a2-f2b1bc0e4a8a	2	Analyse technique	STEP_COMPLETED	IN_PROGRESS	IN_PROGRESS	\N	\N	Système (Simulation)	2025-12-22 03:05:10.968+01
6085f139-746f-4854-bc70-359bf6627ac9	be45f809-5a24-4e86-99a2-f2b1bc0e4a8a	3	Vérification juridique	STEP_COMPLETED	IN_PROGRESS	IN_PROGRESS	\N	\N	Système (Simulation)	2025-12-26 03:05:10.968+01
105e159d-e954-4f72-90ea-76a9c656325c	be45f809-5a24-4e86-99a2-f2b1bc0e4a8a	4	Validation du chef de service	STEP_COMPLETED	IN_PROGRESS	IN_PROGRESS	\N	\N	Système (Simulation)	2025-12-28 03:05:10.968+01
9ea02e1f-cdc0-4092-9528-7f8ae051c91c	be45f809-5a24-4e86-99a2-f2b1bc0e4a8a	5	Décision finale	REJECTED	UNDER_REVIEW	REJECTED	Demande rejetée - critères non satisfaits.	\N	Système (Simulation)	2025-12-29 03:05:10.968+01
a1b5b593-14f0-4a29-8023-bd3592492554	b18f94b7-efad-4350-b504-368dcfe88737	1	Création	CREATED	\N	DRAFT	\N	\N	Système (Simulation)	2025-12-20 03:32:55.339+01
8c6e045b-ba9d-48f6-8980-a8b490a5f4b2	b18f94b7-efad-4350-b504-368dcfe88737	1	Réception de la demande	SUBMITTED	DRAFT	SUBMITTED	\N	\N	Système (Simulation)	2025-12-23 03:32:55.339+01
6a5aac80-afac-4806-ab17-f68a9329c88d	b18f94b7-efad-4350-b504-368dcfe88737	1	Réception de la demande	STEP_COMPLETED	SUBMITTED	IN_PROGRESS	\N	\N	Système (Simulation)	2025-12-26 03:32:55.339+01
4b9431f1-d8c7-49f1-a7d8-39c47891e78c	b18f94b7-efad-4350-b504-368dcfe88737	2	Analyse technique	STEP_COMPLETED	IN_PROGRESS	IN_PROGRESS	\N	\N	Système (Simulation)	2025-12-27 03:32:55.339+01
487f3dbe-3b7f-499c-ba42-e4b2580347ea	b18f94b7-efad-4350-b504-368dcfe88737	3	Vérification juridique	STEP_COMPLETED	IN_PROGRESS	IN_PROGRESS	\N	\N	Système (Simulation)	2025-12-28 03:32:55.339+01
de2118ba-2fdc-456d-8ee6-8899998901e6	b18f94b7-efad-4350-b504-368dcfe88737	4	Validation du chef de service	STEP_COMPLETED	IN_PROGRESS	IN_PROGRESS	\N	\N	Système (Simulation)	2026-01-02 03:32:55.339+01
1099eacc-3459-4f2a-a9f8-c2a5d9545b2e	b18f94b7-efad-4350-b504-368dcfe88737	5	Décision finale	REJECTED	UNDER_REVIEW	REJECTED	Demande rejetée - critères non satisfaits.	\N	Système (Simulation)	2026-01-06 03:32:55.339+01
d964169b-6eaa-4e78-bf20-f2424cd59b8c	9a81068e-50c2-4aeb-b078-9a510cd6ae0f	1	Création	CREATED	\N	DRAFT	\N	\N	Système (Simulation)	2025-11-02 09:10:58.842+01
53b0067a-dc33-428f-98fe-662b8b51129b	9a81068e-50c2-4aeb-b078-9a510cd6ae0f	1	Réception de la demande	SUBMITTED	DRAFT	SUBMITTED	\N	\N	Système (Simulation)	2025-11-04 09:10:58.842+01
931898e0-73ea-4812-9f04-66102b02d507	9a81068e-50c2-4aeb-b078-9a510cd6ae0f	1	Réception de la demande	STEP_COMPLETED	SUBMITTED	IN_PROGRESS	\N	\N	Système (Simulation)	2025-11-09 09:10:58.842+01
105b64c0-4539-4eed-9bb9-332d8fd3be7e	9a81068e-50c2-4aeb-b078-9a510cd6ae0f	2	Analyse technique	STEP_COMPLETED	IN_PROGRESS	IN_PROGRESS	\N	\N	Système (Simulation)	2025-11-12 09:10:58.842+01
697ccedb-6135-468c-8581-8213dc4ac1fd	9a81068e-50c2-4aeb-b078-9a510cd6ae0f	3	Vérification juridique	STEP_COMPLETED	IN_PROGRESS	IN_PROGRESS	\N	\N	Système (Simulation)	2025-11-16 09:10:58.842+01
befa6b8b-b602-4237-a1a9-39c75c4d187b	9a81068e-50c2-4aeb-b078-9a510cd6ae0f	4	Validation du chef de service	STEP_COMPLETED	IN_PROGRESS	IN_PROGRESS	\N	\N	Système (Simulation)	2025-11-19 09:10:58.842+01
afa15b54-000a-42dc-a733-1179f8193dcf	9a81068e-50c2-4aeb-b078-9a510cd6ae0f	5	Décision finale	APPROVED	UNDER_REVIEW	APPROVED	Demande approuvée après vérification complète du dossier.	\N	Système (Simulation)	2025-11-21 09:10:58.842+01
146793d2-a075-4184-86a3-782aeffbee94	bdf51b56-ca91-4371-99cf-c5d571da853f	1	Création	CREATED	\N	DRAFT	\N	\N	Système (Simulation)	2025-10-07 16:30:08.743+01
016cb0d9-ee11-410f-be1b-1692a2b02c92	bdf51b56-ca91-4371-99cf-c5d571da853f	1	Réception de la demande	SUBMITTED	DRAFT	SUBMITTED	\N	\N	Système (Simulation)	2025-10-08 16:30:08.743+01
1eaac051-2b0a-48be-9f01-aab0ea1cc554	bdf51b56-ca91-4371-99cf-c5d571da853f	1	Réception de la demande	STEP_COMPLETED	SUBMITTED	IN_PROGRESS	\N	\N	Système (Simulation)	2025-10-09 16:30:08.743+01
92f89414-92e5-483d-b64f-76c32a7bafe8	bdf51b56-ca91-4371-99cf-c5d571da853f	2	Analyse technique	STEP_COMPLETED	IN_PROGRESS	IN_PROGRESS	\N	\N	Système (Simulation)	2025-10-11 16:30:08.743+01
0946654f-9a03-462f-9b0b-5df218800557	bdf51b56-ca91-4371-99cf-c5d571da853f	3	Vérification juridique	STEP_COMPLETED	IN_PROGRESS	IN_PROGRESS	\N	\N	Système (Simulation)	2025-10-13 16:30:08.743+01
84ecfa80-cb02-468e-a28c-142ce822bc88	bdf51b56-ca91-4371-99cf-c5d571da853f	4	Validation du chef de service	STEP_COMPLETED	IN_PROGRESS	IN_PROGRESS	\N	\N	Système (Simulation)	2025-10-15 16:30:08.743+01
8e9eeecc-5531-4473-9ae4-5ff07ceae3fa	bdf51b56-ca91-4371-99cf-c5d571da853f	5	Décision finale	REJECTED	UNDER_REVIEW	REJECTED	Demande rejetée - critères non satisfaits.	\N	Système (Simulation)	2025-10-16 16:30:08.743+01
8d7b6827-d4a3-4f60-b5e3-8988d0a83bea	c6a65468-ca30-4a67-b9da-958bd35df104	1	Création	CREATED	\N	DRAFT	\N	\N	Système (Simulation)	2025-11-13 10:25:03.26+01
d1d80506-332f-428c-8d6f-bf323bf33c36	e4631647-256d-4c18-bb65-ec8f7471ec4b	1	Création	CREATED	\N	DRAFT	\N	\N	Système (Simulation)	2025-10-21 15:56:36.34+01
8a3b61a6-b5d9-4df2-bcf4-edb864bec6ea	e4631647-256d-4c18-bb65-ec8f7471ec4b	1	Enregistrement	SUBMITTED	DRAFT	SUBMITTED	\N	\N	Système (Simulation)	2025-10-25 15:56:36.34+01
f41673bd-54f5-4853-8d89-f597e1f35690	e4631647-256d-4c18-bb65-ec8f7471ec4b	1	Enregistrement	STEP_COMPLETED	SUBMITTED	IN_PROGRESS	\N	\N	Système (Simulation)	2025-10-27 15:56:36.34+01
aa11b3fa-5774-43a5-8032-73c3e1e103b3	e4631647-256d-4c18-bb65-ec8f7471ec4b	2	Inspection préalable	STEP_COMPLETED	IN_PROGRESS	IN_PROGRESS	\N	\N	Système (Simulation)	2025-10-29 15:56:36.34+01
92ee9021-05c9-47e2-9c40-966945f72a88	85618671-bdd1-42ea-9b9d-54f225fdad3c	1	Création	CREATED	\N	DRAFT	\N	\N	Système (Simulation)	2025-11-01 03:55:52.168+01
644eaf16-3435-4474-9c43-2042bb1df919	85618671-bdd1-42ea-9b9d-54f225fdad3c	1	Enregistrement	SUBMITTED	DRAFT	SUBMITTED	\N	\N	Système (Simulation)	2025-11-05 03:55:52.168+01
45049f95-3d18-4cf8-a901-f22db0b1df09	85618671-bdd1-42ea-9b9d-54f225fdad3c	1	Enregistrement	STEP_COMPLETED	SUBMITTED	IN_PROGRESS	\N	\N	Système (Simulation)	2025-11-09 03:55:52.168+01
c6410e6b-54cd-4c85-9f83-4001702e17bd	85618671-bdd1-42ea-9b9d-54f225fdad3c	2	Inspection préalable	STEP_COMPLETED	IN_PROGRESS	IN_PROGRESS	\N	\N	Système (Simulation)	2025-11-11 03:55:52.168+01
07174dbf-eb60-42e9-8395-9279db16f30d	7530c5dc-960e-4278-bd1d-3bf7ab0ea792	1	Création	CREATED	\N	DRAFT	\N	\N	Système (Simulation)	2025-10-28 01:05:37.145+01
3b9d6349-98b5-43a9-b57e-6447400a6da5	7530c5dc-960e-4278-bd1d-3bf7ab0ea792	1	Enregistrement	SUBMITTED	DRAFT	SUBMITTED	\N	\N	Système (Simulation)	2025-11-02 01:05:37.145+01
16036dec-0c2a-4c28-bd47-0af2178d8feb	7530c5dc-960e-4278-bd1d-3bf7ab0ea792	1	Enregistrement	STEP_COMPLETED	SUBMITTED	IN_PROGRESS	\N	\N	Système (Simulation)	2025-11-07 01:05:37.145+01
b7f40a54-672a-4a0d-ae9d-573bac1d4c93	7530c5dc-960e-4278-bd1d-3bf7ab0ea792	2	Inspection préalable	STEP_COMPLETED	IN_PROGRESS	IN_PROGRESS	\N	\N	Système (Simulation)	2025-11-12 01:05:37.145+01
ffd87b68-010b-43c1-83fa-c3d4601d2aee	7530c5dc-960e-4278-bd1d-3bf7ab0ea792	3	Évaluation des capacités	STEP_COMPLETED	IN_PROGRESS	IN_PROGRESS	\N	\N	Système (Simulation)	2025-11-15 01:05:37.145+01
7bbd38f7-d26d-4b4f-9a05-c74db56df0b4	44210d5b-23f6-42f9-8252-aa785b3202e5	1	Création	CREATED	\N	DRAFT	\N	\N	Système (Simulation)	2025-12-23 16:50:53.358+01
2dcc2355-0f9c-4e9d-88b0-400f631eaa06	44210d5b-23f6-42f9-8252-aa785b3202e5	1	Dépôt de dossier	SUBMITTED	DRAFT	SUBMITTED	\N	\N	Système (Simulation)	2025-12-26 16:50:53.358+01
2eba2bfb-170f-467d-874d-526325a7b6e4	44210d5b-23f6-42f9-8252-aa785b3202e5	1	Dépôt de dossier	DOCUMENTS_REQUESTED	IN_PROGRESS	PENDING_DOCUMENTS	\N	\N	Système (Simulation)	2025-12-27 16:50:53.358+01
98d5253a-bf8a-419c-8f75-32c262b2cf6a	d0412c98-63f1-49be-a0c9-694e81184c1b	1	Création	CREATED	\N	DRAFT	\N	\N	Système (Simulation)	2025-10-29 08:15:06.522+01
be99478f-e919-4125-9ca1-7c1c54fa60e7	d0412c98-63f1-49be-a0c9-694e81184c1b	1	Dépôt de dossier	SUBMITTED	DRAFT	SUBMITTED	\N	\N	Système (Simulation)	2025-10-31 08:15:06.522+01
56b4092a-30d8-41d6-a085-c2d018cdd623	d0412c98-63f1-49be-a0c9-694e81184c1b	1	Dépôt de dossier	STEP_COMPLETED	SUBMITTED	IN_PROGRESS	\N	\N	Système (Simulation)	2025-11-02 08:15:06.522+01
a76c8481-3749-4b18-8f09-d8ca2453718d	9d209545-962c-4ba7-9780-a2ed3961a11a	1	Création	CREATED	\N	DRAFT	\N	\N	Système (Simulation)	2025-12-15 14:40:29.195+01
a8f23b73-205c-4f1e-b4b3-e46e88385349	9d209545-962c-4ba7-9780-a2ed3961a11a	1	Dépôt de dossier	SUBMITTED	DRAFT	SUBMITTED	\N	\N	Système (Simulation)	2025-12-18 14:40:29.195+01
c1c5b043-38c9-4f5c-928a-a422e9e5ba1f	9d209545-962c-4ba7-9780-a2ed3961a11a	1	Dépôt de dossier	STEP_COMPLETED	SUBMITTED	IN_PROGRESS	\N	\N	Système (Simulation)	2025-12-19 14:40:29.195+01
9618b55e-74ca-4881-b636-3ee85c607f9a	9d209545-962c-4ba7-9780-a2ed3961a11a	2	Étude de conformité	STEP_COMPLETED	IN_PROGRESS	IN_PROGRESS	\N	\N	Système (Simulation)	2025-12-22 14:40:29.195+01
1488dcf9-9960-4a15-9ea6-003fc6752fb5	77951687-bc5d-47c3-a528-5ed0a9371547	1	Création	CREATED	\N	DRAFT	\N	\N	Système (Simulation)	2025-11-04 21:47:33.478+01
a8733d12-f801-4813-bdf5-c89f15dce45a	77951687-bc5d-47c3-a528-5ed0a9371547	1	Dépôt de dossier	SUBMITTED	DRAFT	SUBMITTED	\N	\N	Système (Simulation)	2025-11-07 21:47:33.478+01
8407dceb-f330-44c8-97f9-3cde909353cc	77951687-bc5d-47c3-a528-5ed0a9371547	1	Dépôt de dossier	STEP_COMPLETED	SUBMITTED	IN_PROGRESS	\N	\N	Système (Simulation)	2025-11-09 21:47:33.478+01
e43edf78-9d74-4ef0-a7d2-d8424a4ccec0	77951687-bc5d-47c3-a528-5ed0a9371547	2	Étude de conformité	STEP_COMPLETED	IN_PROGRESS	IN_PROGRESS	\N	\N	Système (Simulation)	2025-11-14 21:47:33.478+01
cdeb1b92-41c3-4d41-868e-a04ae6491546	bf635884-acb7-49dc-8fa5-2ad0978487db	1	Création	CREATED	\N	DRAFT	\N	\N	Système (Simulation)	2025-12-14 21:55:48.642+01
c0ff5447-c190-42c3-bf90-b85e674cb404	bf635884-acb7-49dc-8fa5-2ad0978487db	1	Dépôt de dossier	SUBMITTED	DRAFT	SUBMITTED	\N	\N	Système (Simulation)	2025-12-15 21:55:48.642+01
62e0552d-8dbb-468a-8cf2-025eb98554df	bf635884-acb7-49dc-8fa5-2ad0978487db	1	Dépôt de dossier	STEP_COMPLETED	SUBMITTED	IN_PROGRESS	\N	\N	Système (Simulation)	2025-12-20 21:55:48.642+01
c13dcbe6-4e14-4716-9bea-46eeb263e635	bf635884-acb7-49dc-8fa5-2ad0978487db	2	Étude de conformité	STEP_COMPLETED	IN_PROGRESS	IN_PROGRESS	\N	\N	Système (Simulation)	2025-12-24 21:55:48.642+01
4ed526b2-1322-40df-b3fb-df666d7087e5	b182dbd5-226d-4d68-8bbe-e01446b6f4f9	1	Création	CREATED	\N	DRAFT	\N	\N	Système (Simulation)	2025-10-04 02:51:44.676+01
344f927e-b4ff-4069-8bec-ccc09340f0f2	d9308556-ffe7-46ab-9154-474a7b3e8bd4	1	Création	CREATED	\N	DRAFT	\N	\N	Système (Simulation)	2025-12-21 02:40:24.772+01
c40e9747-5408-4e2f-9613-740bba160827	d9308556-ffe7-46ab-9154-474a7b3e8bd4	1	Dépôt de dossier	SUBMITTED	DRAFT	SUBMITTED	\N	\N	Système (Simulation)	2025-12-24 02:40:24.772+01
eb47c794-1044-42ba-aa2e-952ba611777e	d9308556-ffe7-46ab-9154-474a7b3e8bd4	1	Dépôt de dossier	STEP_COMPLETED	SUBMITTED	IN_PROGRESS	\N	\N	Système (Simulation)	2025-12-29 02:40:24.772+01
c969ce70-4c1c-4906-a435-aef965138d98	d9308556-ffe7-46ab-9154-474a7b3e8bd4	2	Étude de conformité	STEP_COMPLETED	IN_PROGRESS	IN_PROGRESS	\N	\N	Système (Simulation)	2025-12-30 02:40:24.772+01
6886e718-a214-4403-aaa4-a21d8d5dafc0	d9308556-ffe7-46ab-9154-474a7b3e8bd4	3	Enquête de terrain	STEP_COMPLETED	IN_PROGRESS	IN_PROGRESS	\N	\N	Système (Simulation)	2026-01-01 02:40:24.772+01
e9838798-0010-47a8-9291-40c34f329c46	d9308556-ffe7-46ab-9154-474a7b3e8bd4	4	Avis technique	STEP_COMPLETED	IN_PROGRESS	IN_PROGRESS	\N	\N	Système (Simulation)	2026-01-03 02:40:24.772+01
ce3d18a5-024f-454c-af89-75787836c420	d9308556-ffe7-46ab-9154-474a7b3e8bd4	5	Délivrance du permis	REJECTED	UNDER_REVIEW	REJECTED	Demande rejetée - critères non satisfaits.	\N	Système (Simulation)	2026-01-04 02:40:24.772+01
c10ab850-b10c-4f32-ad9a-a28621a02718	bfc0adee-2d8e-456e-b9c6-4aa148394121	1	Création	CREATED	\N	DRAFT	\N	\N	Système (Simulation)	2025-12-15 05:41:56.1+01
c171fcb7-9ae7-4c14-a9e1-4d2a3dea8ced	bfc0adee-2d8e-456e-b9c6-4aa148394121	1	Dépôt de dossier	SUBMITTED	DRAFT	SUBMITTED	\N	\N	Système (Simulation)	2025-12-19 05:41:56.1+01
973beee8-a222-4dfc-8f5f-d459669fcb2d	bfc0adee-2d8e-456e-b9c6-4aa148394121	1	Dépôt de dossier	STEP_COMPLETED	SUBMITTED	IN_PROGRESS	\N	\N	Système (Simulation)	2025-12-23 05:41:56.1+01
4c8932d9-6326-45e2-b39c-67a46ef0ac2b	bfc0adee-2d8e-456e-b9c6-4aa148394121	2	Étude de conformité	STEP_COMPLETED	IN_PROGRESS	IN_PROGRESS	\N	\N	Système (Simulation)	2025-12-25 05:41:56.1+01
e923ab43-b05e-4960-ba2a-54b75b3a7ea2	bfc0adee-2d8e-456e-b9c6-4aa148394121	3	Enquête de terrain	STEP_COMPLETED	IN_PROGRESS	IN_PROGRESS	\N	\N	Système (Simulation)	2025-12-30 05:41:56.1+01
15675705-998e-4915-b404-09274eeab28b	bfc0adee-2d8e-456e-b9c6-4aa148394121	4	Avis technique	STEP_COMPLETED	IN_PROGRESS	IN_PROGRESS	\N	\N	Système (Simulation)	2026-01-04 05:41:56.1+01
b3aeea8e-be72-4916-ae14-b8d97fa8094e	bfc0adee-2d8e-456e-b9c6-4aa148394121	5	Délivrance du permis	REJECTED	UNDER_REVIEW	REJECTED	Demande rejetée - critères non satisfaits.	\N	Système (Simulation)	2026-01-09 05:41:56.1+01
d0a9ab74-4c36-4701-af13-ea4edf36bc5b	683b74f5-f461-4e50-bf97-abcdf860f540	1	Création	CREATED	\N	DRAFT	\N	\N	Système (Simulation)	2025-10-07 01:51:45.799+01
1be317e1-bd17-4dad-8621-6834b525ba72	683b74f5-f461-4e50-bf97-abcdf860f540	1	Réception de la demande	SUBMITTED	DRAFT	SUBMITTED	\N	\N	Système (Simulation)	2025-10-10 01:51:45.799+01
08341a6a-a36a-48d7-943f-2660dcff4a11	683b74f5-f461-4e50-bf97-abcdf860f540	1	Réception de la demande	STEP_COMPLETED	SUBMITTED	IN_PROGRESS	\N	\N	Système (Simulation)	2025-10-14 01:51:45.799+01
dcd524ec-1c01-42f4-9091-e6c981fc71d2	cda74341-aa17-43db-b7e6-c4e1934b1172	1	Création	CREATED	\N	DRAFT	\N	\N	Système (Simulation)	2025-11-04 05:08:56.919+01
4edf9983-25cf-411d-b72d-57317be36cde	cda74341-aa17-43db-b7e6-c4e1934b1172	1	Réception de la demande	SUBMITTED	DRAFT	SUBMITTED	\N	\N	Système (Simulation)	2025-11-07 05:08:56.919+01
0de31f7c-4f68-4a4c-91bc-01cd1fb6122b	cda74341-aa17-43db-b7e6-c4e1934b1172	1	Réception de la demande	STEP_COMPLETED	SUBMITTED	IN_PROGRESS	\N	\N	Système (Simulation)	2025-11-10 05:08:56.919+01
e35647b0-5b68-4bdb-b4e6-7cc0f2041a91	cda74341-aa17-43db-b7e6-c4e1934b1172	2	Analyse technique	STEP_COMPLETED	IN_PROGRESS	IN_PROGRESS	\N	\N	Système (Simulation)	2025-11-14 05:08:56.919+01
61d70130-b497-4de9-9f19-178f8c489836	cda74341-aa17-43db-b7e6-c4e1934b1172	3	Vérification juridique	STEP_COMPLETED	IN_PROGRESS	IN_PROGRESS	\N	\N	Système (Simulation)	2025-11-17 05:08:56.919+01
293e5c0a-82b0-48e6-98bc-e93448a1a609	cda74341-aa17-43db-b7e6-c4e1934b1172	4	Validation du chef de service	STEP_COMPLETED	IN_PROGRESS	IN_PROGRESS	\N	\N	Système (Simulation)	2025-11-19 05:08:56.919+01
0badefca-ef8f-4a7c-a490-abf0f1dfc71a	cda74341-aa17-43db-b7e6-c4e1934b1172	5	Décision finale	REJECTED	UNDER_REVIEW	REJECTED	Demande rejetée - critères non satisfaits.	\N	Système (Simulation)	2025-11-24 05:08:56.919+01
9f8c8661-3625-4fdf-a3ff-ccd670fac1c7	74b10167-efe3-4cca-aabe-4dcca9e0a3a1	1	Création	CREATED	\N	DRAFT	\N	\N	Système (Simulation)	2025-11-24 11:21:25.668+01
a5214674-6eec-4e11-96ce-67a84f16e6c7	74b10167-efe3-4cca-aabe-4dcca9e0a3a1	1	Réception de la demande	SUBMITTED	DRAFT	SUBMITTED	\N	\N	Système (Simulation)	2025-11-25 11:21:25.668+01
490595c1-1ae6-4e92-ba3c-87a051b9f348	74b10167-efe3-4cca-aabe-4dcca9e0a3a1	1	Réception de la demande	STEP_COMPLETED	SUBMITTED	IN_PROGRESS	\N	\N	Système (Simulation)	2025-11-29 11:21:25.668+01
eccb3248-4b6c-4ec9-878a-dd26f23b8d06	74b10167-efe3-4cca-aabe-4dcca9e0a3a1	2	Analyse technique	STEP_COMPLETED	IN_PROGRESS	IN_PROGRESS	\N	\N	Système (Simulation)	2025-12-03 11:21:25.668+01
c2e46291-6305-4ddd-8f05-5eccc9afbe5c	74b10167-efe3-4cca-aabe-4dcca9e0a3a1	3	Vérification juridique	STEP_COMPLETED	IN_PROGRESS	IN_PROGRESS	\N	\N	Système (Simulation)	2025-12-04 11:21:25.668+01
d1a94828-b5ff-4147-9087-b3d08d9c58b5	341d818e-571e-4a03-9dd1-1a9aae176f35	1	Création	CREATED	\N	DRAFT	\N	\N	Système (Simulation)	2025-10-18 08:38:46.372+01
de3377c5-82dc-4a82-a201-3b75cc1d4b10	341d818e-571e-4a03-9dd1-1a9aae176f35	1	Réception de la demande	SUBMITTED	DRAFT	SUBMITTED	\N	\N	Système (Simulation)	2025-10-20 08:38:46.372+01
a10551ad-6d89-4f54-b12c-0852e2ac2edc	341d818e-571e-4a03-9dd1-1a9aae176f35	1	Réception de la demande	STEP_COMPLETED	SUBMITTED	IN_PROGRESS	\N	\N	Système (Simulation)	2025-10-21 08:38:46.372+01
5c419276-5587-42c7-aec9-b0ce261f1388	341d818e-571e-4a03-9dd1-1a9aae176f35	2	Analyse technique	STEP_COMPLETED	IN_PROGRESS	IN_PROGRESS	\N	\N	Système (Simulation)	2025-10-23 08:38:46.372+01
b0c716b7-1d15-4a9b-804c-5656513a4421	341d818e-571e-4a03-9dd1-1a9aae176f35	3	Vérification juridique	STEP_COMPLETED	IN_PROGRESS	IN_PROGRESS	\N	\N	Système (Simulation)	2025-10-28 08:38:46.372+01
e6cd17d8-cba9-41ad-9555-c84375794439	78430b73-71a5-4e59-bd6c-a01f6e51d68b	1	Création	CREATED	\N	DRAFT	\N	\N	Système (Simulation)	2025-12-23 05:20:46.789+01
4534f02d-f18e-4144-8d31-957433945266	78430b73-71a5-4e59-bd6c-a01f6e51d68b	1	Enregistrement	SUBMITTED	DRAFT	SUBMITTED	\N	\N	Système (Simulation)	2025-12-27 05:20:46.789+01
c76d1157-8244-4366-8b43-16bc9e8c10ee	78430b73-71a5-4e59-bd6c-a01f6e51d68b	1	Enregistrement	STEP_COMPLETED	SUBMITTED	IN_PROGRESS	\N	\N	Système (Simulation)	2026-01-01 05:20:46.789+01
9fe4176f-80ae-407a-b0d9-216bc47f7e7b	78430b73-71a5-4e59-bd6c-a01f6e51d68b	2	Inspection préalable	STEP_COMPLETED	IN_PROGRESS	IN_PROGRESS	\N	\N	Système (Simulation)	2026-01-06 05:20:46.789+01
cedc09d7-b126-402a-97ac-0b6cdcd1cbe2	78430b73-71a5-4e59-bd6c-a01f6e51d68b	3	Évaluation des capacités	STEP_COMPLETED	IN_PROGRESS	IN_PROGRESS	\N	\N	Système (Simulation)	2026-01-07 05:20:46.789+01
b8fc7dc2-ca8f-4510-955f-d122414a6f9e	65107432-1e5f-459f-814d-49b2b851a4a9	1	Création	CREATED	\N	DRAFT	\N	\N	Système (Simulation)	2025-10-19 11:35:00.744+01
1a31c275-fd97-4b62-8b0c-2442a293ef6c	65107432-1e5f-459f-814d-49b2b851a4a9	1	Enregistrement	SUBMITTED	DRAFT	SUBMITTED	\N	\N	Système (Simulation)	2025-10-22 11:35:00.744+01
231753eb-cff8-42a8-825f-2f39f2f4a6f2	65107432-1e5f-459f-814d-49b2b851a4a9	1	Enregistrement	STEP_COMPLETED	SUBMITTED	IN_PROGRESS	\N	\N	Système (Simulation)	2025-10-23 11:35:00.744+01
438f5864-41b1-496e-817f-88d6f013a8ea	65107432-1e5f-459f-814d-49b2b851a4a9	2	Inspection préalable	STEP_COMPLETED	IN_PROGRESS	IN_PROGRESS	\N	\N	Système (Simulation)	2025-10-25 11:35:00.744+01
1ece3656-9c32-4d7d-a79a-ee8ef3152ed3	65107432-1e5f-459f-814d-49b2b851a4a9	3	Évaluation des capacités	DOCUMENTS_REQUESTED	IN_PROGRESS	PENDING_DOCUMENTS	\N	\N	Système (Simulation)	2025-10-27 11:35:00.744+01
b2c6772b-4ef7-434f-a190-60de04f31def	bfa29bc3-5295-404f-a7dc-547b951d654a	1	Création	CREATED	\N	DRAFT	\N	\N	Système (Simulation)	2025-12-27 10:30:54.211+01
cc13335a-8409-4662-befa-7d25469ddbf4	bfa29bc3-5295-404f-a7dc-547b951d654a	1	Enregistrement	SUBMITTED	DRAFT	SUBMITTED	\N	\N	Système (Simulation)	2025-12-29 10:30:54.211+01
b2c4df76-53f2-402a-9876-99e5ce6af0a8	bfa29bc3-5295-404f-a7dc-547b951d654a	1	Enregistrement	DOCUMENTS_REQUESTED	IN_PROGRESS	PENDING_DOCUMENTS	\N	\N	Système (Simulation)	2025-12-30 10:30:54.211+01
2a5b0a95-2ebe-4ed4-b8da-fa325be86bd6	d98a4cd3-88a1-4136-90a4-65d6ea935087	1	Création	CREATED	\N	DRAFT	\N	\N	Système (Simulation)	2025-10-16 16:05:17.529+01
e658b8c7-5f1c-498f-bace-0f38aea23d68	d98a4cd3-88a1-4136-90a4-65d6ea935087	1	Dépôt de dossier	SUBMITTED	DRAFT	SUBMITTED	\N	\N	Système (Simulation)	2025-10-20 16:05:17.529+01
3fb88141-d343-45b3-a511-3813ae3ab691	d98a4cd3-88a1-4136-90a4-65d6ea935087	1	Dépôt de dossier	STEP_COMPLETED	SUBMITTED	IN_PROGRESS	\N	\N	Système (Simulation)	2025-10-21 16:05:17.529+01
c12c7d6d-1347-4957-ae6f-8c95e8069b0e	d98a4cd3-88a1-4136-90a4-65d6ea935087	2	Étude de conformité	DOCUMENTS_REQUESTED	IN_PROGRESS	PENDING_DOCUMENTS	\N	\N	Système (Simulation)	2025-10-24 16:05:17.529+01
420e3e65-9f6e-4b67-b3fc-51e3a7b055f1	806f988f-d8bf-4713-bd91-9bcf7ece3786	1	Création	CREATED	\N	DRAFT	\N	\N	Système (Simulation)	2025-12-29 12:11:13.86+01
2ae88982-4698-43e6-a6c1-3725ca20950b	91c40b06-49f3-43fc-9eb2-c2942050e872	1	Création	CREATED	\N	DRAFT	\N	\N	Système (Simulation)	2025-11-04 05:58:25.086+01
b0183e60-d9f1-4e92-b26a-2e8267cd172a	91c40b06-49f3-43fc-9eb2-c2942050e872	1	Dépôt de dossier	SUBMITTED	DRAFT	SUBMITTED	\N	\N	Système (Simulation)	2025-11-08 05:58:25.086+01
b113e5d1-28cc-4058-9c09-7279832fcaf6	91c40b06-49f3-43fc-9eb2-c2942050e872	1	Dépôt de dossier	STEP_COMPLETED	SUBMITTED	IN_PROGRESS	\N	\N	Système (Simulation)	2025-11-10 05:58:25.086+01
1aa2c303-c943-4592-b4e7-523bb3d7184d	fef831d9-1e69-43f8-b31e-ae3bb21902d1	1	Création	CREATED	\N	DRAFT	\N	\N	Système (Simulation)	2025-11-11 21:44:17.431+01
170406f9-ee39-4c8a-9fa6-d8999e486bb8	643a5a0e-42a8-45fd-b56f-5703fecf2906	1	Création	CREATED	\N	DRAFT	\N	\N	Système (Simulation)	2025-12-28 04:34:46.588+01
f15e0d23-fde1-4482-a105-e0b01b205bc6	643a5a0e-42a8-45fd-b56f-5703fecf2906	1	Dépôt de dossier	SUBMITTED	DRAFT	SUBMITTED	\N	\N	Système (Simulation)	2025-12-30 04:34:46.588+01
cbf9cf69-163b-46c6-bf50-9cc2337bd063	643a5a0e-42a8-45fd-b56f-5703fecf2906	1	Dépôt de dossier	STEP_COMPLETED	SUBMITTED	IN_PROGRESS	\N	\N	Système (Simulation)	2026-01-04 04:34:46.588+01
712d7533-e4a9-483c-96d6-4699730b7536	b3106396-5469-4bc8-88aa-a872b4789ad9	1	Création	CREATED	\N	DRAFT	\N	\N	Système (Simulation)	2025-10-28 16:41:22.777+01
3a2ab42c-eb7b-4e5c-bc29-56e6dd4f14ad	b3106396-5469-4bc8-88aa-a872b4789ad9	1	Dépôt de dossier	SUBMITTED	DRAFT	SUBMITTED	\N	\N	Système (Simulation)	2025-10-30 16:41:22.777+01
7620e815-28d0-479a-9776-273d0d9e53a1	b3106396-5469-4bc8-88aa-a872b4789ad9	1	Dépôt de dossier	STEP_COMPLETED	SUBMITTED	IN_PROGRESS	\N	\N	Système (Simulation)	2025-11-04 16:41:22.777+01
a0539d1e-7299-49b1-8807-fb6b19f953d3	b3106396-5469-4bc8-88aa-a872b4789ad9	2	Étude de conformité	STEP_COMPLETED	IN_PROGRESS	IN_PROGRESS	\N	\N	Système (Simulation)	2025-11-08 16:41:22.777+01
500ed0b5-aa37-416d-9a9c-dec4ffc7ac9a	b3106396-5469-4bc8-88aa-a872b4789ad9	3	Enquête de terrain	STEP_COMPLETED	IN_PROGRESS	IN_PROGRESS	\N	\N	Système (Simulation)	2025-11-10 16:41:22.777+01
208c5ace-103f-49bb-b8ea-233ce76a6268	b3106396-5469-4bc8-88aa-a872b4789ad9	4	Avis technique	STEP_COMPLETED	IN_PROGRESS	IN_PROGRESS	\N	\N	Système (Simulation)	2025-11-15 16:41:22.777+01
3216d64d-9b24-4705-9daf-d9e3f83e0b1d	b3106396-5469-4bc8-88aa-a872b4789ad9	5	Délivrance du permis	REJECTED	UNDER_REVIEW	REJECTED	Demande rejetée - critères non satisfaits.	\N	Système (Simulation)	2025-11-16 16:41:22.777+01
929cac96-b095-452f-9e75-53d9b12fca9e	c10e87d9-96f3-469b-946e-3f7f4d7e05f6	1	Création	CREATED	\N	DRAFT	\N	\N	Système (Simulation)	2025-10-26 04:25:20.866+01
f4969e81-ad67-466d-96ce-ed5db75dd3f8	c10e87d9-96f3-469b-946e-3f7f4d7e05f6	1	Dépôt de dossier	SUBMITTED	DRAFT	SUBMITTED	\N	\N	Système (Simulation)	2025-10-27 04:25:20.866+01
1db6ea10-ac74-44d7-969d-4ce4de15e027	c10e87d9-96f3-469b-946e-3f7f4d7e05f6	1	Dépôt de dossier	DOCUMENTS_REQUESTED	IN_PROGRESS	PENDING_DOCUMENTS	\N	\N	Système (Simulation)	2025-10-28 04:25:20.866+01
a62d18e4-f026-44e9-8114-22787aacfc6a	019a5241-5d22-4427-869c-a68b5785dd91	1	Création	CREATED	\N	DRAFT	\N	\N	Système (Simulation)	2025-12-31 02:13:13.256+01
2817e13d-78e8-4831-a493-3ee144f6bab8	019a5241-5d22-4427-869c-a68b5785dd91	1	Dépôt de dossier	SUBMITTED	DRAFT	SUBMITTED	\N	\N	Système (Simulation)	2026-01-05 02:13:13.256+01
c513d6c5-a201-43d9-a43d-35cbede656c0	019a5241-5d22-4427-869c-a68b5785dd91	1	Dépôt de dossier	DOCUMENTS_REQUESTED	IN_PROGRESS	PENDING_DOCUMENTS	\N	\N	Système (Simulation)	2026-01-10 02:13:13.256+01
6057065c-e34f-4555-9ff1-af0f3d0f01f0	b14dab4f-7a96-4b07-a565-1a79fa704ec4	1	Création	CREATED	\N	DRAFT	\N	\N	Système (Simulation)	2025-10-30 00:05:13.565+01
fa542bff-9a3d-4a34-b46e-8ec32986766e	b14dab4f-7a96-4b07-a565-1a79fa704ec4	1	Réception de la demande	SUBMITTED	DRAFT	SUBMITTED	\N	\N	Système (Simulation)	2025-11-02 00:05:13.565+01
15daeff0-9881-4a56-bddd-772e8ba2f8c2	b14dab4f-7a96-4b07-a565-1a79fa704ec4	1	Réception de la demande	STEP_COMPLETED	SUBMITTED	IN_PROGRESS	\N	\N	Système (Simulation)	2025-11-06 00:05:13.565+01
32360a44-2752-4b15-a945-cfe97b3b9936	a3408ded-81a7-43e4-af9f-9604d4b36528	1	Création	CREATED	\N	DRAFT	\N	\N	Système (Simulation)	2025-11-29 01:40:38.424+01
ee142745-2ff9-48db-bf31-ab1e801abe12	a3408ded-81a7-43e4-af9f-9604d4b36528	1	Réception de la demande	SUBMITTED	DRAFT	SUBMITTED	\N	\N	Système (Simulation)	2025-12-03 01:40:38.424+01
87474f74-e4ba-4e5e-bcf4-61d6ef460c4e	a3408ded-81a7-43e4-af9f-9604d4b36528	1	Réception de la demande	STEP_COMPLETED	SUBMITTED	IN_PROGRESS	\N	\N	Système (Simulation)	2025-12-04 01:40:38.424+01
8f5739a4-ad2b-4cf4-b0e3-e0d2f70379fc	a3408ded-81a7-43e4-af9f-9604d4b36528	2	Analyse technique	STEP_COMPLETED	IN_PROGRESS	IN_PROGRESS	\N	\N	Système (Simulation)	2025-12-05 01:40:38.424+01
38ff981f-51b5-4959-9690-41ae33e14606	a3408ded-81a7-43e4-af9f-9604d4b36528	3	Vérification juridique	STEP_COMPLETED	IN_PROGRESS	IN_PROGRESS	\N	\N	Système (Simulation)	2025-12-10 01:40:38.424+01
fcab1f30-dcd3-47d5-891c-3d2d58eb9c2f	a3408ded-81a7-43e4-af9f-9604d4b36528	4	Validation du chef de service	STEP_COMPLETED	IN_PROGRESS	IN_PROGRESS	\N	\N	Système (Simulation)	2025-12-13 01:40:38.424+01
3aed703f-7ead-4eb8-8a6d-23dbee55dc68	a3408ded-81a7-43e4-af9f-9604d4b36528	5	Décision finale	APPROVED	UNDER_REVIEW	APPROVED	Demande approuvée après vérification complète du dossier.	\N	Système (Simulation)	2025-12-18 01:40:38.424+01
a7d800af-83b8-4a4d-8e67-fdc79e8b839a	bec9cbfb-3c45-4b7a-a4db-e82ceb326c45	1	Création	CREATED	\N	DRAFT	\N	\N	Système (Simulation)	2025-10-18 04:57:47.48+01
5527f502-a9ac-4449-b26d-8605305364a5	bec9cbfb-3c45-4b7a-a4db-e82ceb326c45	1	Réception de la demande	SUBMITTED	DRAFT	SUBMITTED	\N	\N	Système (Simulation)	2025-10-21 04:57:47.48+01
d8904173-e3e0-485e-9740-fc0f5a6e0d3d	bec9cbfb-3c45-4b7a-a4db-e82ceb326c45	1	Réception de la demande	STEP_COMPLETED	SUBMITTED	IN_PROGRESS	\N	\N	Système (Simulation)	2025-10-23 04:57:47.48+01
8398a621-e1b5-4cc7-ba0b-39d32c371b91	bec9cbfb-3c45-4b7a-a4db-e82ceb326c45	2	Analyse technique	STEP_COMPLETED	IN_PROGRESS	IN_PROGRESS	\N	\N	Système (Simulation)	2025-10-26 04:57:47.48+01
66133080-de46-400d-97bd-42e1a47f43e3	bec9cbfb-3c45-4b7a-a4db-e82ceb326c45	3	Vérification juridique	STEP_COMPLETED	IN_PROGRESS	IN_PROGRESS	\N	\N	Système (Simulation)	2025-10-30 04:57:47.48+01
526b2e03-da3f-47fe-ad72-eae442b20089	bec9cbfb-3c45-4b7a-a4db-e82ceb326c45	4	Validation du chef de service	STEP_COMPLETED	IN_PROGRESS	IN_PROGRESS	\N	\N	Système (Simulation)	2025-11-03 04:57:47.48+01
899c10f5-4eff-4548-a081-ab5f08febfc7	bec9cbfb-3c45-4b7a-a4db-e82ceb326c45	5	Décision finale	REJECTED	UNDER_REVIEW	REJECTED	Demande rejetée - critères non satisfaits.	\N	Système (Simulation)	2025-11-06 04:57:47.48+01
13852c45-9a5e-44e4-a679-9d2bab6039ce	b76c139a-b25b-40df-aeaf-e1dbc7e1ff42	1	Création	CREATED	\N	DRAFT	\N	\N	Système (Simulation)	2025-10-31 16:00:46.752+01
96c2b9ed-a309-4d21-ad59-1202d1ded7b8	52d57ecf-2071-46b1-bba2-e786aa4fc193	1	Création	CREATED	\N	DRAFT	\N	\N	Système (Simulation)	2025-11-28 17:36:05.222+01
e8bb5aca-204b-401c-87fd-51024757b647	52d57ecf-2071-46b1-bba2-e786aa4fc193	1	Réception de la demande	SUBMITTED	DRAFT	SUBMITTED	\N	\N	Système (Simulation)	2025-11-30 17:36:05.222+01
a68161b2-1b50-4cfb-bec0-bd241d42a9c4	52d57ecf-2071-46b1-bba2-e786aa4fc193	1	Réception de la demande	STEP_COMPLETED	SUBMITTED	IN_PROGRESS	\N	\N	Système (Simulation)	2025-12-05 17:36:05.222+01
6ea96f34-cbfa-4a6a-b372-5b55198a05b7	52d57ecf-2071-46b1-bba2-e786aa4fc193	2	Analyse technique	STEP_COMPLETED	IN_PROGRESS	IN_PROGRESS	\N	\N	Système (Simulation)	2025-12-07 17:36:05.222+01
5c14327f-642c-453a-8927-079829790cc4	52d57ecf-2071-46b1-bba2-e786aa4fc193	3	Vérification juridique	STEP_COMPLETED	IN_PROGRESS	IN_PROGRESS	\N	\N	Système (Simulation)	2025-12-10 17:36:05.222+01
fe9a2dc1-0303-46ef-9280-f56a6e402552	ebad230a-af25-4ff7-8378-a659767a4880	1	Création	CREATED	\N	DRAFT	\N	\N	Système (Simulation)	2025-12-07 23:30:44.538+01
3fd4e62a-b373-4023-a7d3-43618692fbd3	ebad230a-af25-4ff7-8378-a659767a4880	1	Réception de la demande	SUBMITTED	DRAFT	SUBMITTED	\N	\N	Système (Simulation)	2025-12-10 23:30:44.538+01
c497e095-c376-4162-840b-5e01879c2156	85358758-b9a9-43b1-bb62-d56d0d9d63f5	1	Création	CREATED	\N	DRAFT	\N	\N	Système (Simulation)	2025-10-29 17:18:53.23+01
6008d015-c6d8-4eb5-a314-7551785757ac	85358758-b9a9-43b1-bb62-d56d0d9d63f5	1	Enregistrement	SUBMITTED	DRAFT	SUBMITTED	\N	\N	Système (Simulation)	2025-10-31 17:18:53.23+01
3312abca-c4cd-4ef2-af1b-e61e5a17dd71	85358758-b9a9-43b1-bb62-d56d0d9d63f5	1	Enregistrement	STEP_COMPLETED	SUBMITTED	IN_PROGRESS	\N	\N	Système (Simulation)	2025-11-03 17:18:53.23+01
590cd996-6e01-4a17-b615-70f6ff89a56e	85358758-b9a9-43b1-bb62-d56d0d9d63f5	2	Inspection préalable	STEP_COMPLETED	IN_PROGRESS	IN_PROGRESS	\N	\N	Système (Simulation)	2025-11-08 17:18:53.23+01
3b16eec5-acca-42e6-8d61-27ea519d293d	85358758-b9a9-43b1-bb62-d56d0d9d63f5	3	Évaluation des capacités	STEP_COMPLETED	IN_PROGRESS	IN_PROGRESS	\N	\N	Système (Simulation)	2025-11-10 17:18:53.23+01
9d595edb-829d-48a2-a8a8-63a47b4d8532	85358758-b9a9-43b1-bb62-d56d0d9d63f5	4	Commission d'attribution	STEP_COMPLETED	IN_PROGRESS	IN_PROGRESS	\N	\N	Système (Simulation)	2025-11-11 17:18:53.23+01
8007b11b-7169-4029-85b9-9559fa273d71	85358758-b9a9-43b1-bb62-d56d0d9d63f5	5	Émission de la licence	REJECTED	UNDER_REVIEW	REJECTED	Demande rejetée - critères non satisfaits.	\N	Système (Simulation)	2025-11-13 17:18:53.23+01
65d54711-a512-4f48-9449-b3547b4dd10b	5e4a4cf6-3837-4a03-b3fa-67f67291208f	1	Création	CREATED	\N	DRAFT	\N	\N	Système (Simulation)	2025-12-20 08:03:02.686+01
fa6005ef-1723-4a84-b97d-b640a474f1a0	80a10494-b680-47c1-bdcc-47576e9d77db	1	Création	CREATED	\N	DRAFT	\N	\N	Système (Simulation)	2025-10-15 02:12:25.937+01
864e2a19-09fd-4411-b501-da8343480054	80a10494-b680-47c1-bdcc-47576e9d77db	1	Enregistrement	SUBMITTED	DRAFT	SUBMITTED	\N	\N	Système (Simulation)	2025-10-16 02:12:25.937+01
e3557a5f-e41c-4f2c-a6a7-c582e579484c	fcf257be-c0b0-4eb8-be4c-af192504ccac	1	Création	CREATED	\N	DRAFT	\N	\N	Système (Simulation)	2025-12-21 06:49:25.026+01
ba07a9b9-6a08-41a1-9905-1bcdd5cecb5c	fcf257be-c0b0-4eb8-be4c-af192504ccac	1	Enregistrement	SUBMITTED	DRAFT	SUBMITTED	\N	\N	Système (Simulation)	2025-12-26 06:49:25.026+01
eaa7a403-adff-4b42-8208-f62a9a9119e2	fcf257be-c0b0-4eb8-be4c-af192504ccac	1	Enregistrement	STEP_COMPLETED	SUBMITTED	IN_PROGRESS	\N	\N	Système (Simulation)	2025-12-29 06:49:25.026+01
4536b037-316b-4efc-b05d-76b67d25edc6	fcf257be-c0b0-4eb8-be4c-af192504ccac	2	Inspection préalable	STEP_COMPLETED	IN_PROGRESS	IN_PROGRESS	\N	\N	Système (Simulation)	2026-01-02 06:49:25.026+01
e8aa6b0d-4935-4979-84e8-f5170aa768f9	fcf257be-c0b0-4eb8-be4c-af192504ccac	3	Évaluation des capacités	DOCUMENTS_REQUESTED	IN_PROGRESS	PENDING_DOCUMENTS	\N	\N	Système (Simulation)	2026-01-06 06:49:25.026+01
22f000ba-869f-45f5-9ebd-694cfcdc00ea	f3f9c2c3-9b14-42f8-a26f-37dc42a1b568	1	Création	CREATED	\N	DRAFT	\N	\N	Système (Simulation)	2025-11-03 10:28:56.203+01
346655ff-97fb-4c29-82ed-f3624f950f1f	f3f9c2c3-9b14-42f8-a26f-37dc42a1b568	1	Enregistrement	SUBMITTED	DRAFT	SUBMITTED	\N	\N	Système (Simulation)	2025-11-05 10:28:56.203+01
1e389400-f39f-4757-bd37-3f24c0617b1b	f3f9c2c3-9b14-42f8-a26f-37dc42a1b568	1	Enregistrement	STEP_COMPLETED	SUBMITTED	IN_PROGRESS	\N	\N	Système (Simulation)	2025-11-09 10:28:56.203+01
005ee866-fd64-4a66-8864-fb4426283d89	f3f9c2c3-9b14-42f8-a26f-37dc42a1b568	2	Inspection préalable	STEP_COMPLETED	IN_PROGRESS	IN_PROGRESS	\N	\N	Système (Simulation)	2025-11-14 10:28:56.203+01
ae50008e-0271-40b1-be70-294d4e37c168	f3f9c2c3-9b14-42f8-a26f-37dc42a1b568	3	Évaluation des capacités	STEP_COMPLETED	IN_PROGRESS	IN_PROGRESS	\N	\N	Système (Simulation)	2025-11-19 10:28:56.203+01
aef1c7d5-2280-40cf-8ef4-43728f45f920	f3f9c2c3-9b14-42f8-a26f-37dc42a1b568	4	Commission d'attribution	STEP_COMPLETED	IN_PROGRESS	IN_PROGRESS	\N	\N	Système (Simulation)	2025-11-24 10:28:56.203+01
4a393325-6e4e-4cbd-b3a6-df992c97a18b	f3f9c2c3-9b14-42f8-a26f-37dc42a1b568	5	Émission de la licence	REJECTED	UNDER_REVIEW	REJECTED	Demande rejetée - critères non satisfaits.	\N	Système (Simulation)	2025-11-29 10:28:56.203+01
f8814fba-9775-41cd-9932-fcbea380d79c	cca7f984-4937-4850-933c-2e80ee8428a0	1	Création	CREATED	\N	DRAFT	\N	\N	Système (Simulation)	2025-12-17 11:34:50.796+01
17a149b4-11eb-4f56-86f1-89b5a18679f1	cca7f984-4937-4850-933c-2e80ee8428a0	1	Dépôt de dossier	SUBMITTED	DRAFT	SUBMITTED	\N	\N	Système (Simulation)	2025-12-19 11:34:50.796+01
135d31bb-c241-4121-bfe1-1b3aea69e0dd	cca7f984-4937-4850-933c-2e80ee8428a0	1	Dépôt de dossier	STEP_COMPLETED	SUBMITTED	IN_PROGRESS	\N	\N	Système (Simulation)	2025-12-20 11:34:50.796+01
caef8cb9-acbf-4093-9b61-563000693dba	cca7f984-4937-4850-933c-2e80ee8428a0	2	Étude de conformité	STEP_COMPLETED	IN_PROGRESS	IN_PROGRESS	\N	\N	Système (Simulation)	2025-12-25 11:34:50.796+01
bd68bce0-af94-4e81-9893-df5469df7040	cca7f984-4937-4850-933c-2e80ee8428a0	3	Enquête de terrain	STEP_COMPLETED	IN_PROGRESS	IN_PROGRESS	\N	\N	Système (Simulation)	2025-12-29 11:34:50.796+01
3ae36ffb-ecfa-4edc-a36e-8d56f312af5b	c4990d27-09b1-4296-b75a-55486d07d614	1	Création	CREATED	\N	DRAFT	\N	\N	Système (Simulation)	2025-12-05 18:52:54.085+01
a545835b-9865-4a5a-a0ec-a800a59912df	c4990d27-09b1-4296-b75a-55486d07d614	1	Dépôt de dossier	SUBMITTED	DRAFT	SUBMITTED	\N	\N	Système (Simulation)	2025-12-07 18:52:54.085+01
e162ec62-dc60-4062-81fd-bb91bb189048	0d880f6b-bb4f-4879-b3e0-2932926ed13a	1	Création	CREATED	\N	DRAFT	\N	\N	Système (Simulation)	2025-12-02 22:41:24.055+01
a6b72d4f-e3c7-44f3-927d-08abf8fdc91f	0d880f6b-bb4f-4879-b3e0-2932926ed13a	1	Dépôt de dossier	SUBMITTED	DRAFT	SUBMITTED	\N	\N	Système (Simulation)	2025-12-03 22:41:24.055+01
8c0ae588-a632-473f-8f07-a6845da905d3	0d880f6b-bb4f-4879-b3e0-2932926ed13a	1	Dépôt de dossier	STEP_COMPLETED	SUBMITTED	IN_PROGRESS	\N	\N	Système (Simulation)	2025-12-04 22:41:24.055+01
b6a071fa-f389-44d4-a7bf-817d6cb8a2b3	0d880f6b-bb4f-4879-b3e0-2932926ed13a	2	Étude de conformité	DOCUMENTS_REQUESTED	IN_PROGRESS	PENDING_DOCUMENTS	\N	\N	Système (Simulation)	2025-12-07 22:41:24.055+01
944c3cdd-ddcb-41a6-a3ef-e7d6280378bd	f84c64e2-2693-49c8-8ea1-7bbb73b67923	1	Création	CREATED	\N	DRAFT	\N	\N	Système (Simulation)	2025-10-20 17:56:11.503+01
28964b6c-e7a8-47ce-b797-afc13c9759f9	f6428842-2944-4bd4-9e56-738858ecd6ea	1	Création	CREATED	\N	DRAFT	\N	\N	Système (Simulation)	2025-12-22 00:57:38.153+01
550874c4-bac0-4c66-97cc-e564464e238c	f6428842-2944-4bd4-9e56-738858ecd6ea	1	Réception de la demande	SUBMITTED	DRAFT	SUBMITTED	\N	\N	Système (Simulation)	2025-12-25 00:57:38.153+01
a63e3ac0-293a-4682-b320-955438a3688a	f6428842-2944-4bd4-9e56-738858ecd6ea	1	Réception de la demande	STEP_COMPLETED	SUBMITTED	IN_PROGRESS	\N	\N	Système (Simulation)	2025-12-30 00:57:38.153+01
a416185f-0048-402e-bb12-c3575da95f3c	f6428842-2944-4bd4-9e56-738858ecd6ea	2	Analyse technique	STEP_COMPLETED	IN_PROGRESS	IN_PROGRESS	\N	\N	Système (Simulation)	2026-01-04 00:57:38.153+01
805d8cdf-f5bf-4e89-8e46-1ff249a88508	f6428842-2944-4bd4-9e56-738858ecd6ea	3	Vérification juridique	STEP_COMPLETED	IN_PROGRESS	IN_PROGRESS	\N	\N	Système (Simulation)	2026-01-07 00:57:38.153+01
5a37eed1-840c-4127-958e-ed2ee17f741d	f6428842-2944-4bd4-9e56-738858ecd6ea	4	Validation du chef de service	STEP_COMPLETED	IN_PROGRESS	IN_PROGRESS	\N	\N	Système (Simulation)	2026-01-12 00:57:38.153+01
58d37d9d-f15a-49b6-ab7e-551cbb121f0f	f6428842-2944-4bd4-9e56-738858ecd6ea	5	Décision finale	REJECTED	UNDER_REVIEW	REJECTED	Demande rejetée - critères non satisfaits.	\N	Système (Simulation)	2026-01-14 00:57:38.153+01
d8a1ae2b-aef1-4bad-b560-1909bbb262dd	33e5a575-7de4-4917-afe6-2ae97bb24261	1	Création	CREATED	\N	DRAFT	\N	\N	Système (Simulation)	2025-10-24 08:48:44.872+01
f4e4e191-c64a-43c5-bd21-434aaa24079e	33e5a575-7de4-4917-afe6-2ae97bb24261	1	Réception de la demande	SUBMITTED	DRAFT	SUBMITTED	\N	\N	Système (Simulation)	2025-10-29 08:48:44.872+01
2cc653c6-797f-4fbb-81c9-3e67838feb31	33e5a575-7de4-4917-afe6-2ae97bb24261	1	Réception de la demande	STEP_COMPLETED	SUBMITTED	IN_PROGRESS	\N	\N	Système (Simulation)	2025-11-01 08:48:44.872+01
c951cfda-465e-4f6f-89e8-029817cbbf3f	33e5a575-7de4-4917-afe6-2ae97bb24261	2	Analyse technique	STEP_COMPLETED	IN_PROGRESS	IN_PROGRESS	\N	\N	Système (Simulation)	2025-11-04 08:48:44.872+01
6265a54f-b5d8-4bb0-be19-d9ae4e797dce	33e5a575-7de4-4917-afe6-2ae97bb24261	3	Vérification juridique	STEP_COMPLETED	IN_PROGRESS	IN_PROGRESS	\N	\N	Système (Simulation)	2025-11-07 08:48:44.872+01
941e2e9b-c5ec-43a2-8152-ee3c5b3e76df	33e5a575-7de4-4917-afe6-2ae97bb24261	4	Validation du chef de service	STEP_COMPLETED	IN_PROGRESS	IN_PROGRESS	\N	\N	Système (Simulation)	2025-11-11 08:48:44.872+01
7e7742a9-f747-43f9-b064-6b9bfdfdb2a4	33e5a575-7de4-4917-afe6-2ae97bb24261	5	Décision finale	APPROVED	UNDER_REVIEW	APPROVED	Demande approuvée après vérification complète du dossier.	\N	Système (Simulation)	2025-11-13 08:48:44.872+01
d7db41f9-03e2-4738-b650-54dd41a3f607	aaaea183-3c3d-4836-b10a-42a88f25e671	1	Création	CREATED	\N	DRAFT	\N	\N	Système (Simulation)	2025-12-12 23:01:47.158+01
4d24849d-0778-4d21-8ec8-e98181e3e1b8	aaaea183-3c3d-4836-b10a-42a88f25e671	1	Enregistrement	SUBMITTED	DRAFT	SUBMITTED	\N	\N	Système (Simulation)	2025-12-13 23:01:47.158+01
f28a8ffe-a0ed-4c04-b3a3-dae29eca1266	6a74bc38-493a-41ad-903b-2696d0d1d624	1	Création	CREATED	\N	DRAFT	\N	\N	Système (Simulation)	2025-12-21 00:20:41.367+01
47871c5b-5078-49ab-a2c0-3ce2a9bd634d	6a74bc38-493a-41ad-903b-2696d0d1d624	1	Enregistrement	SUBMITTED	DRAFT	SUBMITTED	\N	\N	Système (Simulation)	2025-12-26 00:20:41.367+01
bcd40cf9-0d30-499b-a1db-7b811a43c9cd	851c6720-bcbe-4159-889f-0c5c3ff95d8e	1	Création	CREATED	\N	DRAFT	\N	\N	Système (Simulation)	2025-12-05 23:15:17.675+01
46ec0eb7-e854-4ef8-865d-8012f195d01d	851c6720-bcbe-4159-889f-0c5c3ff95d8e	1	Enregistrement	SUBMITTED	DRAFT	SUBMITTED	\N	\N	Système (Simulation)	2025-12-09 23:15:17.675+01
9f43356d-fa4b-4005-a6c3-1b783f869042	851c6720-bcbe-4159-889f-0c5c3ff95d8e	1	Enregistrement	STEP_COMPLETED	SUBMITTED	IN_PROGRESS	\N	\N	Système (Simulation)	2025-12-10 23:15:17.675+01
332f7dd5-b860-471e-9127-faf71231f184	8fe3b2f9-89a6-452a-b6e4-44138f4b0ef5	1	Création	CREATED	\N	DRAFT	\N	\N	Système (Simulation)	2025-11-16 18:41:34.819+01
d533c8e2-1d47-4f83-b458-bd4d5f80c6a2	8fe3b2f9-89a6-452a-b6e4-44138f4b0ef5	1	Enregistrement	SUBMITTED	DRAFT	SUBMITTED	\N	\N	Système (Simulation)	2025-11-17 18:41:34.819+01
08f5a742-0f2d-46e6-9aca-345791eeff49	8fe3b2f9-89a6-452a-b6e4-44138f4b0ef5	1	Enregistrement	STEP_COMPLETED	SUBMITTED	IN_PROGRESS	\N	\N	Système (Simulation)	2025-11-21 18:41:34.819+01
cf88a0ff-64ef-405e-a130-be81362736ef	8fe3b2f9-89a6-452a-b6e4-44138f4b0ef5	2	Inspection préalable	STEP_COMPLETED	IN_PROGRESS	IN_PROGRESS	\N	\N	Système (Simulation)	2025-11-25 18:41:34.819+01
c06e2297-4f3e-4783-9133-f1cb696d1e15	8fe3b2f9-89a6-452a-b6e4-44138f4b0ef5	3	Évaluation des capacités	DOCUMENTS_REQUESTED	IN_PROGRESS	PENDING_DOCUMENTS	\N	\N	Système (Simulation)	2025-11-27 18:41:34.819+01
2aff1f0d-682e-49d2-acda-7659543b07bb	68706079-e96c-4947-9625-0aec3b1b4929	1	Création	CREATED	\N	DRAFT	\N	\N	Système (Simulation)	2025-10-16 18:19:05.323+01
ae898312-3a58-4ff1-8851-52391734de3d	68706079-e96c-4947-9625-0aec3b1b4929	1	Enregistrement	SUBMITTED	DRAFT	SUBMITTED	\N	\N	Système (Simulation)	2025-10-18 18:19:05.323+01
323dbe4a-f75a-4030-82f8-b84da9f7858c	68706079-e96c-4947-9625-0aec3b1b4929	1	Enregistrement	STEP_COMPLETED	SUBMITTED	IN_PROGRESS	\N	\N	Système (Simulation)	2025-10-23 18:19:05.323+01
6a06aaa2-3555-4ecf-b708-ab42685ad164	68706079-e96c-4947-9625-0aec3b1b4929	2	Inspection préalable	STEP_COMPLETED	IN_PROGRESS	IN_PROGRESS	\N	\N	Système (Simulation)	2025-10-26 18:19:05.323+01
8b4451ab-5467-4e4e-a56f-0967b9d686e5	68706079-e96c-4947-9625-0aec3b1b4929	3	Évaluation des capacités	STEP_COMPLETED	IN_PROGRESS	IN_PROGRESS	\N	\N	Système (Simulation)	2025-10-28 18:19:05.323+01
c84d10c8-e252-4642-9ce4-0313784732f0	3de20dfd-dd21-42ca-bcd6-a24122a5fad6	1	Création	CREATED	\N	DRAFT	\N	\N	Système (Simulation)	2025-11-03 09:43:10.976+01
f8d7791e-b2d9-4305-a762-a6bcf0263486	3de20dfd-dd21-42ca-bcd6-a24122a5fad6	1	Enregistrement	SUBMITTED	DRAFT	SUBMITTED	\N	\N	Système (Simulation)	2025-11-06 09:43:10.976+01
e8bcc1dd-6587-43be-9e17-37e67f081d0d	3de20dfd-dd21-42ca-bcd6-a24122a5fad6	1	Enregistrement	STEP_COMPLETED	SUBMITTED	IN_PROGRESS	\N	\N	Système (Simulation)	2025-11-10 09:43:10.976+01
4a7f0172-10fa-4428-96f4-eb2a7c8f87b4	3de20dfd-dd21-42ca-bcd6-a24122a5fad6	2	Inspection préalable	STEP_COMPLETED	IN_PROGRESS	IN_PROGRESS	\N	\N	Système (Simulation)	2025-11-12 09:43:10.976+01
46fa5f61-3c83-4b9b-8c33-78f93102eefd	c2aee567-5820-4cc6-98e0-c1b46c8b06bf	1	Création	CREATED	\N	DRAFT	\N	\N	Système (Simulation)	2025-12-31 07:25:08.014+01
066e69c0-19fe-4cde-bf32-82eea990a0d4	c2aee567-5820-4cc6-98e0-c1b46c8b06bf	1	Enregistrement	SUBMITTED	DRAFT	SUBMITTED	\N	\N	Système (Simulation)	2026-01-04 07:25:08.014+01
faac58ad-7d56-47d9-ae3d-ecab5fbaa64b	c2aee567-5820-4cc6-98e0-c1b46c8b06bf	1	Enregistrement	STEP_COMPLETED	SUBMITTED	IN_PROGRESS	\N	\N	Système (Simulation)	2026-01-08 07:25:08.014+01
2229ba0f-5110-4747-95f5-2d1a79a51583	c2aee567-5820-4cc6-98e0-c1b46c8b06bf	2	Inspection préalable	STEP_COMPLETED	IN_PROGRESS	IN_PROGRESS	\N	\N	Système (Simulation)	2026-01-09 07:25:08.014+01
fae91189-80e3-45e5-87d2-4fe9595391b5	c2aee567-5820-4cc6-98e0-c1b46c8b06bf	3	Évaluation des capacités	DOCUMENTS_REQUESTED	IN_PROGRESS	PENDING_DOCUMENTS	\N	\N	Système (Simulation)	2026-01-13 07:25:08.014+01
5b8a6630-1251-4d9f-b684-70094f8fd97b	250dffd3-03ce-4683-92bb-ad5af1a8a45b	1	Création	CREATED	\N	DRAFT	\N	\N	Système (Simulation)	2025-10-05 05:56:30.688+01
9006e969-a7f0-4d56-a697-85d8a99f8659	250dffd3-03ce-4683-92bb-ad5af1a8a45b	1	Dépôt de dossier	SUBMITTED	DRAFT	SUBMITTED	\N	\N	Système (Simulation)	2025-10-10 05:56:30.688+01
237506ce-8295-4274-a2ec-8cf338fac2bd	250dffd3-03ce-4683-92bb-ad5af1a8a45b	1	Dépôt de dossier	DOCUMENTS_REQUESTED	IN_PROGRESS	PENDING_DOCUMENTS	\N	\N	Système (Simulation)	2025-10-12 05:56:30.688+01
9c467cb3-b939-4656-8bc3-33f315d28edc	b51e139a-e63c-454c-8f24-90e97e8c5729	1	Création	CREATED	\N	DRAFT	\N	\N	Système (Simulation)	2025-11-17 18:58:45.373+01
d573b2c9-f0cc-4aa6-b7a9-65ccae65d8f5	b51e139a-e63c-454c-8f24-90e97e8c5729	1	Dépôt de dossier	SUBMITTED	DRAFT	SUBMITTED	\N	\N	Système (Simulation)	2025-11-21 18:58:45.373+01
55ee4d9b-2cef-4cfe-a051-71e10b47e2a3	b51e139a-e63c-454c-8f24-90e97e8c5729	1	Dépôt de dossier	STEP_COMPLETED	SUBMITTED	IN_PROGRESS	\N	\N	Système (Simulation)	2025-11-26 18:58:45.373+01
42804153-b9d5-4fca-acea-f4e7b33e6dbc	b51e139a-e63c-454c-8f24-90e97e8c5729	2	Étude de conformité	STEP_COMPLETED	IN_PROGRESS	IN_PROGRESS	\N	\N	Système (Simulation)	2025-11-27 18:58:45.373+01
39fe48de-9ebe-4e67-840f-2152fcb73dfd	120b5bfa-1f3f-4583-9aff-3c48a5605d30	1	Création	CREATED	\N	DRAFT	\N	\N	Système (Simulation)	2025-12-24 12:11:47.958+01
684b4399-5b52-4de2-91ab-37da267475b9	120b5bfa-1f3f-4583-9aff-3c48a5605d30	1	Dépôt de dossier	SUBMITTED	DRAFT	SUBMITTED	\N	\N	Système (Simulation)	2025-12-28 12:11:47.958+01
1777e317-95e9-4b71-bd23-add27d2a482d	120b5bfa-1f3f-4583-9aff-3c48a5605d30	1	Dépôt de dossier	STEP_COMPLETED	SUBMITTED	IN_PROGRESS	\N	\N	Système (Simulation)	2025-12-31 12:11:47.958+01
2864b973-0659-43b7-a595-67f37c52af6d	120b5bfa-1f3f-4583-9aff-3c48a5605d30	2	Étude de conformité	STEP_COMPLETED	IN_PROGRESS	IN_PROGRESS	\N	\N	Système (Simulation)	2026-01-03 12:11:47.958+01
10ea2096-4697-47ac-95d3-7dc84eaf5e25	120b5bfa-1f3f-4583-9aff-3c48a5605d30	3	Enquête de terrain	STEP_COMPLETED	IN_PROGRESS	IN_PROGRESS	\N	\N	Système (Simulation)	2026-01-06 12:11:47.958+01
1d5ce35f-b58d-4bdd-92a6-c4b6ef2b8e26	120b5bfa-1f3f-4583-9aff-3c48a5605d30	4	Avis technique	STEP_COMPLETED	IN_PROGRESS	IN_PROGRESS	\N	\N	Système (Simulation)	2026-01-09 12:11:47.958+01
0178e3be-ff5d-4d3a-a0ae-758cf6c1b424	120b5bfa-1f3f-4583-9aff-3c48a5605d30	5	Délivrance du permis	APPROVED	UNDER_REVIEW	APPROVED	Demande approuvée après vérification complète du dossier.	\N	Système (Simulation)	2026-01-12 12:11:47.958+01
cb066322-323b-4420-9ab2-ee25fcab735f	0693fd64-9c21-43ce-82d5-659ef0f29740	1	Création	CREATED	\N	DRAFT	\N	\N	Système (Simulation)	2025-11-02 04:58:07.332+01
7210adee-ce1f-4605-8aaf-be7cd034fc36	0693fd64-9c21-43ce-82d5-659ef0f29740	1	Réception de la demande	SUBMITTED	DRAFT	SUBMITTED	\N	\N	Système (Simulation)	2025-11-06 04:58:07.332+01
b1961558-f954-46d3-b2ed-4f42b714a131	0693fd64-9c21-43ce-82d5-659ef0f29740	1	Réception de la demande	STEP_COMPLETED	SUBMITTED	IN_PROGRESS	\N	\N	Système (Simulation)	2025-11-09 04:58:07.332+01
31c1ff63-279b-4802-8b8e-4cb2e25a2c62	9388ae9a-d4c4-4ad2-bfd6-acf2d7a18afa	1	Création	CREATED	\N	DRAFT	\N	\N	Système (Simulation)	2025-11-16 23:34:31.303+01
a68d09dd-9e5e-4343-abd3-5f3161918161	9388ae9a-d4c4-4ad2-bfd6-acf2d7a18afa	1	Réception de la demande	SUBMITTED	DRAFT	SUBMITTED	\N	\N	Système (Simulation)	2025-11-18 23:34:31.303+01
9e2c5e05-ecf5-48d2-9a18-b1b7797fba35	c8eed1db-5210-4e46-8d7f-b8148804bc44	1	Création	CREATED	\N	DRAFT	\N	\N	Système (Simulation)	2025-12-20 01:08:05.728+01
bf1a3de6-1742-4b27-b29a-73f6c9884753	c8eed1db-5210-4e46-8d7f-b8148804bc44	1	Réception de la demande	SUBMITTED	DRAFT	SUBMITTED	\N	\N	Système (Simulation)	2025-12-24 01:08:05.728+01
bd783bc2-25eb-4eef-9f90-bb4d2af5b653	c8eed1db-5210-4e46-8d7f-b8148804bc44	1	Réception de la demande	STEP_COMPLETED	SUBMITTED	IN_PROGRESS	\N	\N	Système (Simulation)	2025-12-29 01:08:05.728+01
06d9cfc4-742d-43ee-88fe-a0d6e72b725b	c8eed1db-5210-4e46-8d7f-b8148804bc44	2	Analyse technique	DOCUMENTS_REQUESTED	IN_PROGRESS	PENDING_DOCUMENTS	\N	\N	Système (Simulation)	2025-12-31 01:08:05.728+01
8c8410d0-7bfe-4f1c-ab94-2dc8e4d36d45	ad8fb43f-550e-4975-91e9-865ff250b135	1	Création	CREATED	\N	DRAFT	\N	\N	Système (Simulation)	2025-11-17 11:09:21.742+01
33916968-6dd1-410f-b427-03fa37a25762	ad8fb43f-550e-4975-91e9-865ff250b135	1	Réception de la demande	SUBMITTED	DRAFT	SUBMITTED	\N	\N	Système (Simulation)	2025-11-22 11:09:21.742+01
58f8a5fa-e894-44c5-a852-6a81cb3c1a9b	625ffed2-6dbc-402b-b29b-28422f437d14	1	Création	CREATED	\N	DRAFT	\N	\N	Système (Simulation)	2025-10-26 06:01:20.837+01
b19d18cf-c5e9-4e32-b358-5c111e4692cf	625ffed2-6dbc-402b-b29b-28422f437d14	1	Réception de la demande	SUBMITTED	DRAFT	SUBMITTED	\N	\N	Système (Simulation)	2025-10-30 06:01:20.837+01
523eecb5-1736-4d88-a9e5-c1a6e2f65acd	849742a7-bbbc-4098-b63b-e02f326b1c1c	1	Création	CREATED	\N	DRAFT	\N	\N	Système (Simulation)	2025-11-09 12:09:32.183+01
ed3c7fd6-cd6e-4d04-a1af-97c1bf279130	849742a7-bbbc-4098-b63b-e02f326b1c1c	1	Enregistrement	SUBMITTED	DRAFT	SUBMITTED	\N	\N	Système (Simulation)	2025-11-14 12:09:32.183+01
dd89c753-e237-4394-853b-34482c6e84f9	849742a7-bbbc-4098-b63b-e02f326b1c1c	1	Enregistrement	STEP_COMPLETED	SUBMITTED	IN_PROGRESS	\N	\N	Système (Simulation)	2025-11-19 12:09:32.183+01
fa39e798-0c6b-4461-a7d2-e18e3d17def9	849742a7-bbbc-4098-b63b-e02f326b1c1c	2	Inspection préalable	STEP_COMPLETED	IN_PROGRESS	IN_PROGRESS	\N	\N	Système (Simulation)	2025-11-20 12:09:32.183+01
4d2a24c1-9ed9-4268-a22f-852d0113663e	019cab5d-e03b-44bc-8efb-020270ac6ef8	1	Création	CREATED	\N	DRAFT	\N	\N	Système (Simulation)	2025-12-17 18:40:10.696+01
b4745937-a3a9-4f47-88c6-358995f06c93	019cab5d-e03b-44bc-8efb-020270ac6ef8	1	Enregistrement	SUBMITTED	DRAFT	SUBMITTED	\N	\N	Système (Simulation)	2025-12-20 18:40:10.696+01
afd14828-cc73-4de7-8552-9bbd7a0dd0c1	019cab5d-e03b-44bc-8efb-020270ac6ef8	1	Enregistrement	STEP_COMPLETED	SUBMITTED	IN_PROGRESS	\N	\N	Système (Simulation)	2025-12-21 18:40:10.696+01
48cf49b5-4984-4db9-8fb7-cb4bd35a787f	019cab5d-e03b-44bc-8efb-020270ac6ef8	2	Inspection préalable	STEP_COMPLETED	IN_PROGRESS	IN_PROGRESS	\N	\N	Système (Simulation)	2025-12-25 18:40:10.696+01
61eb3305-59f5-4026-945d-4a2ddba76809	019cab5d-e03b-44bc-8efb-020270ac6ef8	3	Évaluation des capacités	DOCUMENTS_REQUESTED	IN_PROGRESS	PENDING_DOCUMENTS	\N	\N	Système (Simulation)	2025-12-26 18:40:10.696+01
bcbce60b-a506-453b-9ccd-1a7c53914ebb	9385e405-232a-40d8-a59a-975aa0f36db7	1	Création	CREATED	\N	DRAFT	\N	\N	Système (Simulation)	2025-10-27 19:07:44.331+01
1829f9b7-a613-4129-9e9c-89749ed5a722	9385e405-232a-40d8-a59a-975aa0f36db7	1	Enregistrement	SUBMITTED	DRAFT	SUBMITTED	\N	\N	Système (Simulation)	2025-10-30 19:07:44.331+01
55d90deb-d82f-41ef-a59f-eccba826275b	9385e405-232a-40d8-a59a-975aa0f36db7	1	Enregistrement	STEP_COMPLETED	SUBMITTED	IN_PROGRESS	\N	\N	Système (Simulation)	2025-11-01 19:07:44.331+01
520eef47-62ea-4c9d-9841-b32c00878615	9385e405-232a-40d8-a59a-975aa0f36db7	2	Inspection préalable	STEP_COMPLETED	IN_PROGRESS	IN_PROGRESS	\N	\N	Système (Simulation)	2025-11-02 19:07:44.331+01
51d19a9a-c5e9-421d-8417-6e12d9086727	9385e405-232a-40d8-a59a-975aa0f36db7	3	Évaluation des capacités	STEP_COMPLETED	IN_PROGRESS	IN_PROGRESS	\N	\N	Système (Simulation)	2025-11-03 19:07:44.331+01
7a2dc183-6987-4255-9a85-893360ed6806	9385e405-232a-40d8-a59a-975aa0f36db7	4	Commission d'attribution	STEP_COMPLETED	IN_PROGRESS	IN_PROGRESS	\N	\N	Système (Simulation)	2025-11-04 19:07:44.331+01
bad62450-ca9f-49a2-b6fb-5de0e1c7a905	9385e405-232a-40d8-a59a-975aa0f36db7	5	Émission de la licence	REJECTED	UNDER_REVIEW	REJECTED	Demande rejetée - critères non satisfaits.	\N	Système (Simulation)	2025-11-06 19:07:44.331+01
932519ca-a2b1-4874-b9d6-2952ef076641	0189c77a-14e2-4a36-8995-9a9074f6a3b9	1	Création	CREATED	\N	DRAFT	\N	\N	Système (Simulation)	2025-12-08 19:08:30.493+01
6cd6f3bf-b427-489a-a363-e428ba2db9a8	0189c77a-14e2-4a36-8995-9a9074f6a3b9	1	Enregistrement	SUBMITTED	DRAFT	SUBMITTED	\N	\N	Système (Simulation)	2025-12-11 19:08:30.493+01
58ea8820-6169-4e07-9787-5ff980d4fbc2	0189c77a-14e2-4a36-8995-9a9074f6a3b9	1	Enregistrement	STEP_COMPLETED	SUBMITTED	IN_PROGRESS	\N	\N	Système (Simulation)	2025-12-16 19:08:30.493+01
6d361f95-ba86-4ca4-8d01-850a6893356b	0189c77a-14e2-4a36-8995-9a9074f6a3b9	2	Inspection préalable	STEP_COMPLETED	IN_PROGRESS	IN_PROGRESS	\N	\N	Système (Simulation)	2025-12-17 19:08:30.493+01
72409c76-8ac4-4496-b38b-a37a951d3961	0189c77a-14e2-4a36-8995-9a9074f6a3b9	3	Évaluation des capacités	STEP_COMPLETED	IN_PROGRESS	IN_PROGRESS	\N	\N	Système (Simulation)	2025-12-20 19:08:30.493+01
cb80f2f8-3ce7-4a14-bf9c-b55510763f81	0189c77a-14e2-4a36-8995-9a9074f6a3b9	4	Commission d'attribution	STEP_COMPLETED	IN_PROGRESS	IN_PROGRESS	\N	\N	Système (Simulation)	2025-12-22 19:08:30.493+01
07539a5b-26fd-4c94-86dc-1fd39eed94fa	0189c77a-14e2-4a36-8995-9a9074f6a3b9	5	Émission de la licence	REJECTED	UNDER_REVIEW	REJECTED	Demande rejetée - critères non satisfaits.	\N	Système (Simulation)	2025-12-25 19:08:30.493+01
a06b2727-9141-4268-af69-8ca8cdb0d9d4	8c681170-55d4-47ec-b04e-af8fe0d1e875	1	Création	CREATED	\N	DRAFT	\N	\N	Système (Simulation)	2025-10-12 00:33:17.068+01
9fefb637-134f-4091-9228-2a77ada8fa95	8c681170-55d4-47ec-b04e-af8fe0d1e875	1	Enregistrement	SUBMITTED	DRAFT	SUBMITTED	\N	\N	Système (Simulation)	2025-10-15 00:33:17.068+01
1532868a-ea16-4e1d-990c-9b7cad1715c9	8c681170-55d4-47ec-b04e-af8fe0d1e875	1	Enregistrement	STEP_COMPLETED	SUBMITTED	IN_PROGRESS	\N	\N	Système (Simulation)	2025-10-19 00:33:17.068+01
1e21d09a-81fe-4e3b-9099-ba2689c3cc9e	8c681170-55d4-47ec-b04e-af8fe0d1e875	2	Inspection préalable	STEP_COMPLETED	IN_PROGRESS	IN_PROGRESS	\N	\N	Système (Simulation)	2025-10-21 00:33:17.068+01
7dad4e2b-3df0-40af-a3ca-d21188daa61a	8c681170-55d4-47ec-b04e-af8fe0d1e875	3	Évaluation des capacités	STEP_COMPLETED	IN_PROGRESS	IN_PROGRESS	\N	\N	Système (Simulation)	2025-10-24 00:33:17.068+01
6d0052ad-dc31-4bf7-a0eb-80dedecfb191	8c681170-55d4-47ec-b04e-af8fe0d1e875	4	Commission d'attribution	STEP_COMPLETED	IN_PROGRESS	IN_PROGRESS	\N	\N	Système (Simulation)	2025-10-29 00:33:17.068+01
1960dda8-dadd-4ccd-949b-cc43a8fbbf06	8c681170-55d4-47ec-b04e-af8fe0d1e875	5	Émission de la licence	REJECTED	UNDER_REVIEW	REJECTED	Demande rejetée - critères non satisfaits.	\N	Système (Simulation)	2025-11-02 00:33:17.068+01
0e5eeb4c-e86f-47ff-8412-f5ae6add7bad	0f9a15f1-3e01-42c5-bf8f-87ba6b36a071	1	Création	CREATED	\N	DRAFT	\N	\N	Système (Simulation)	2025-11-20 02:54:54.302+01
2da213c5-2465-49a6-84a7-e5dd4c324f94	0f9a15f1-3e01-42c5-bf8f-87ba6b36a071	1	Enregistrement	SUBMITTED	DRAFT	SUBMITTED	\N	\N	Système (Simulation)	2025-11-24 02:54:54.302+01
43badb54-a202-47c0-9cf1-c2da1d7c108b	0f9a15f1-3e01-42c5-bf8f-87ba6b36a071	1	Enregistrement	STEP_COMPLETED	SUBMITTED	IN_PROGRESS	\N	\N	Système (Simulation)	2025-11-29 02:54:54.302+01
fcb10dd7-71be-4dcc-8f51-a85b3a726ea7	0f9a15f1-3e01-42c5-bf8f-87ba6b36a071	2	Inspection préalable	STEP_COMPLETED	IN_PROGRESS	IN_PROGRESS	\N	\N	Système (Simulation)	2025-12-01 02:54:54.302+01
8b41b014-db42-4dee-ad5e-4da2be048fb8	5b4bfe73-0e61-4857-a517-16e3da1d54c1	1	Création	CREATED	\N	DRAFT	\N	\N	Système (Simulation)	2025-12-05 06:45:31.223+01
9d5bc21b-a86a-480d-b58c-7db482835cf7	868510ab-7889-4664-ac51-062ea1f9cf04	1	Création	CREATED	\N	DRAFT	\N	\N	Système (Simulation)	2025-10-06 07:44:48.845+01
84c65bd3-942c-4734-a0ea-3735703e9302	868510ab-7889-4664-ac51-062ea1f9cf04	1	Enregistrement	SUBMITTED	DRAFT	SUBMITTED	\N	\N	Système (Simulation)	2025-10-07 07:44:48.845+01
7745fd7e-7acf-4eb4-8796-9c8d0c50bd00	119f3081-21e3-4b73-bc39-975e6b5c68d7	1	Création	CREATED	\N	DRAFT	\N	\N	Système (Simulation)	2025-11-03 13:34:35.198+01
df66171d-1fec-4528-bfa4-49dac38f8d98	54836d92-cf6e-45ec-9a46-1bffe5bccb00	1	Création	CREATED	\N	DRAFT	\N	\N	Système (Simulation)	2025-11-27 08:29:06.105+01
a02543ee-d08f-4c9c-baa5-8d97ab8af488	54836d92-cf6e-45ec-9a46-1bffe5bccb00	1	Dépôt de dossier	SUBMITTED	DRAFT	SUBMITTED	\N	\N	Système (Simulation)	2025-11-30 08:29:06.105+01
56060d5b-b6b8-4146-a465-9473e4b2dcbd	54836d92-cf6e-45ec-9a46-1bffe5bccb00	1	Dépôt de dossier	STEP_COMPLETED	SUBMITTED	IN_PROGRESS	\N	\N	Système (Simulation)	2025-12-05 08:29:06.105+01
04960652-039d-4df3-bbe8-d9d7afd3db81	54836d92-cf6e-45ec-9a46-1bffe5bccb00	2	Étude de conformité	STEP_COMPLETED	IN_PROGRESS	IN_PROGRESS	\N	\N	Système (Simulation)	2025-12-09 08:29:06.105+01
cf1306bd-e98d-4a4e-bcce-99d224692546	54836d92-cf6e-45ec-9a46-1bffe5bccb00	3	Enquête de terrain	STEP_COMPLETED	IN_PROGRESS	IN_PROGRESS	\N	\N	Système (Simulation)	2025-12-11 08:29:06.105+01
8f7b710c-6368-409b-b5e5-eac92bae876e	a00df11a-7a2d-44a2-9529-268dd1a8cdf9	1	Création	CREATED	\N	DRAFT	\N	\N	Système (Simulation)	2025-11-12 14:44:39.137+01
d4bfedaa-98a4-4889-8e21-03e32624a517	a00df11a-7a2d-44a2-9529-268dd1a8cdf9	1	Dépôt de dossier	SUBMITTED	DRAFT	SUBMITTED	\N	\N	Système (Simulation)	2025-11-14 14:44:39.137+01
fe44c593-7dff-4966-ad99-ab09082cb151	a00df11a-7a2d-44a2-9529-268dd1a8cdf9	1	Dépôt de dossier	STEP_COMPLETED	SUBMITTED	IN_PROGRESS	\N	\N	Système (Simulation)	2025-11-18 14:44:39.137+01
a42908e4-fc50-4fcd-8965-2c4e82131eb2	a00df11a-7a2d-44a2-9529-268dd1a8cdf9	2	Étude de conformité	STEP_COMPLETED	IN_PROGRESS	IN_PROGRESS	\N	\N	Système (Simulation)	2025-11-19 14:44:39.137+01
75e749ac-97d7-413c-a541-ecd0f1a18f30	376a58ff-177c-4493-8a35-9d2c560ceb95	1	Création	CREATED	\N	DRAFT	\N	\N	Système (Simulation)	2025-12-13 02:22:28.101+01
50e6a1de-3e75-4fbf-95ad-786e71a6719d	376a58ff-177c-4493-8a35-9d2c560ceb95	1	Dépôt de dossier	SUBMITTED	DRAFT	SUBMITTED	\N	\N	Système (Simulation)	2025-12-15 02:22:28.101+01
eadc39fa-bedd-4a17-bde0-9a74615e0c59	376a58ff-177c-4493-8a35-9d2c560ceb95	1	Dépôt de dossier	STEP_COMPLETED	SUBMITTED	IN_PROGRESS	\N	\N	Système (Simulation)	2025-12-18 02:22:28.101+01
8603c2bb-4e30-47f3-be8f-8172c6beb233	376a58ff-177c-4493-8a35-9d2c560ceb95	2	Étude de conformité	STEP_COMPLETED	IN_PROGRESS	IN_PROGRESS	\N	\N	Système (Simulation)	2025-12-22 02:22:28.101+01
2f58c3b7-20f9-4b3c-9a0a-6541baddb29e	376a58ff-177c-4493-8a35-9d2c560ceb95	3	Enquête de terrain	DOCUMENTS_REQUESTED	IN_PROGRESS	PENDING_DOCUMENTS	\N	\N	Système (Simulation)	2025-12-25 02:22:28.101+01
4dd5e312-8246-44ce-9976-1a26d9de73c3	0b3e7758-60c5-4385-a837-5286f830c34d	1	Création	CREATED	\N	DRAFT	\N	\N	Système (Simulation)	2025-12-24 07:48:25.033+01
4f7559cd-c5c1-4117-ab92-48c21cca00ad	0b3e7758-60c5-4385-a837-5286f830c34d	1	Dépôt de dossier	SUBMITTED	DRAFT	SUBMITTED	\N	\N	Système (Simulation)	2025-12-29 07:48:25.033+01
7188a8ef-8d2e-48d4-a5a3-63aa56fad38c	0b3e7758-60c5-4385-a837-5286f830c34d	1	Dépôt de dossier	STEP_COMPLETED	SUBMITTED	IN_PROGRESS	\N	\N	Système (Simulation)	2026-01-02 07:48:25.033+01
eb0649c0-6099-46dc-a2d7-7f2d94510417	0b3e7758-60c5-4385-a837-5286f830c34d	2	Étude de conformité	STEP_COMPLETED	IN_PROGRESS	IN_PROGRESS	\N	\N	Système (Simulation)	2026-01-05 07:48:25.033+01
20d5b31a-d786-486f-bbcc-a3392c18a0f0	0b3e7758-60c5-4385-a837-5286f830c34d	3	Enquête de terrain	DOCUMENTS_REQUESTED	IN_PROGRESS	PENDING_DOCUMENTS	\N	\N	Système (Simulation)	2026-01-08 07:48:25.033+01
a0a52f20-6be4-4b0d-8325-aca5343b41a9	81139b8b-82e5-4d50-9f85-6a06106d52b9	1	Création	CREATED	\N	DRAFT	\N	\N	Système (Simulation)	2025-12-07 03:29:59.049+01
cc810033-ab0c-4853-98f8-c92f02f4922d	81139b8b-82e5-4d50-9f85-6a06106d52b9	1	Réception de la demande	SUBMITTED	DRAFT	SUBMITTED	\N	\N	Système (Simulation)	2025-12-12 03:29:59.049+01
7506e5ea-766f-4515-855e-e4b16bf4c666	81139b8b-82e5-4d50-9f85-6a06106d52b9	1	Réception de la demande	STEP_COMPLETED	SUBMITTED	IN_PROGRESS	\N	\N	Système (Simulation)	2025-12-13 03:29:59.049+01
17a846af-30f5-4bd8-b20d-a1d8d7b980e3	81139b8b-82e5-4d50-9f85-6a06106d52b9	2	Analyse technique	STEP_COMPLETED	IN_PROGRESS	IN_PROGRESS	\N	\N	Système (Simulation)	2025-12-17 03:29:59.049+01
00eb4704-0b82-4419-94ba-4b1512921ffb	f0fcd01d-ef46-40b6-bd32-af634fa78967	1	Création	CREATED	\N	DRAFT	\N	\N	Système (Simulation)	2025-10-27 17:20:24.094+01
09419acb-500b-4d74-ab99-a5b39b1b2ee7	f0fcd01d-ef46-40b6-bd32-af634fa78967	1	Réception de la demande	SUBMITTED	DRAFT	SUBMITTED	\N	\N	Système (Simulation)	2025-10-30 17:20:24.094+01
1fa84d5f-b769-45b9-a1de-c9b5af30799b	f0fcd01d-ef46-40b6-bd32-af634fa78967	1	Réception de la demande	STEP_COMPLETED	SUBMITTED	IN_PROGRESS	\N	\N	Système (Simulation)	2025-11-02 17:20:24.094+01
ccee386c-88c8-480f-97d4-e5ccaafe6269	00a3d1f2-2f45-48cc-9001-bb9d6566d0df	1	Création	CREATED	\N	DRAFT	\N	\N	Système (Simulation)	2025-10-18 21:06:01.435+01
8114832b-247e-4f3f-89bd-935a05e8c3c6	00a3d1f2-2f45-48cc-9001-bb9d6566d0df	1	Réception de la demande	SUBMITTED	DRAFT	SUBMITTED	\N	\N	Système (Simulation)	2025-10-23 21:06:01.435+01
79b7e2b6-1b7c-4417-a69c-e392f1fe0db3	00a3d1f2-2f45-48cc-9001-bb9d6566d0df	1	Réception de la demande	STEP_COMPLETED	SUBMITTED	IN_PROGRESS	\N	\N	Système (Simulation)	2025-10-25 21:06:01.435+01
b1a93563-4e6e-44da-a4c4-c5dd2cd1ffe5	00a3d1f2-2f45-48cc-9001-bb9d6566d0df	2	Analyse technique	STEP_COMPLETED	IN_PROGRESS	IN_PROGRESS	\N	\N	Système (Simulation)	2025-10-29 21:06:01.435+01
3c800d4a-833d-4180-9e45-d444e8f2c04d	00a3d1f2-2f45-48cc-9001-bb9d6566d0df	3	Vérification juridique	STEP_COMPLETED	IN_PROGRESS	IN_PROGRESS	\N	\N	Système (Simulation)	2025-10-31 21:06:01.435+01
f70c2ec2-0902-4d94-a117-ee72e1cdbf4d	00a3d1f2-2f45-48cc-9001-bb9d6566d0df	4	Validation du chef de service	STEP_COMPLETED	IN_PROGRESS	IN_PROGRESS	\N	\N	Système (Simulation)	2025-11-04 21:06:01.435+01
d785a170-201f-4415-a63c-e9231f2dd471	00a3d1f2-2f45-48cc-9001-bb9d6566d0df	5	Décision finale	APPROVED	UNDER_REVIEW	APPROVED	Demande approuvée après vérification complète du dossier.	\N	Système (Simulation)	2025-11-05 21:06:01.435+01
10b98347-1f4c-4fa2-aac9-3e6629ca0670	b5e0b150-b023-419c-93f7-72ecd056785a	1	Création	CREATED	\N	DRAFT	\N	\N	Système (Simulation)	2025-12-18 19:58:42.703+01
06f724f7-135e-4559-8847-762b4b89357b	b5e0b150-b023-419c-93f7-72ecd056785a	1	Réception de la demande	SUBMITTED	DRAFT	SUBMITTED	\N	\N	Système (Simulation)	2025-12-23 19:58:42.703+01
1e8ae999-444a-4ab2-99ad-d8d21317d0e1	b5e0b150-b023-419c-93f7-72ecd056785a	1	Réception de la demande	STEP_COMPLETED	SUBMITTED	IN_PROGRESS	\N	\N	Système (Simulation)	2025-12-28 19:58:42.703+01
c346970e-0574-46d5-a083-6daaacd24aa5	b5e0b150-b023-419c-93f7-72ecd056785a	2	Analyse technique	STEP_COMPLETED	IN_PROGRESS	IN_PROGRESS	\N	\N	Système (Simulation)	2025-12-29 19:58:42.703+01
373cd064-4874-42bc-94d9-91352559beee	b5e0b150-b023-419c-93f7-72ecd056785a	3	Vérification juridique	STEP_COMPLETED	IN_PROGRESS	IN_PROGRESS	\N	\N	Système (Simulation)	2025-12-30 19:58:42.703+01
bfe37415-d04c-4d1d-abcb-c61d02c12b5a	b5e0b150-b023-419c-93f7-72ecd056785a	4	Validation du chef de service	STEP_COMPLETED	IN_PROGRESS	IN_PROGRESS	\N	\N	Système (Simulation)	2026-01-03 19:58:42.703+01
e04cbe35-8026-490d-9dc2-e0762f03a4f8	b5e0b150-b023-419c-93f7-72ecd056785a	5	Décision finale	REJECTED	UNDER_REVIEW	REJECTED	Demande rejetée - critères non satisfaits.	\N	Système (Simulation)	2026-01-07 19:58:42.703+01
11606dfa-ac1f-429b-bd88-5b31322a7f41	2c8c0b10-f324-429e-8aef-c73d92c09a7f	1	Création	CREATED	\N	DRAFT	\N	\N	Système (Simulation)	2025-11-07 19:39:37.858+01
f7760b9e-63e4-4bed-ba79-506041cd9c3d	2c8c0b10-f324-429e-8aef-c73d92c09a7f	1	Réception de la demande	SUBMITTED	DRAFT	SUBMITTED	\N	\N	Système (Simulation)	2025-11-10 19:39:37.858+01
b58f15a0-2d33-4efb-a8de-b9f144c10cd9	2c8c0b10-f324-429e-8aef-c73d92c09a7f	1	Réception de la demande	STEP_COMPLETED	SUBMITTED	IN_PROGRESS	\N	\N	Système (Simulation)	2025-11-13 19:39:37.858+01
f5820591-0f38-444a-98e2-84cf074cd010	2c8c0b10-f324-429e-8aef-c73d92c09a7f	2	Analyse technique	STEP_COMPLETED	IN_PROGRESS	IN_PROGRESS	\N	\N	Système (Simulation)	2025-11-16 19:39:37.858+01
090dce56-3eae-4349-a7cb-c1f79571db65	cc5a7574-a7b8-4f0f-902c-8be8172df025	1	Création	CREATED	\N	DRAFT	\N	\N	Système (Simulation)	2025-11-13 10:45:13.641+01
a0e51d58-f812-4592-bec2-378bc69f786b	6861f9f4-737d-489e-a0a1-3fd0064dcd7e	1	Création	CREATED	\N	DRAFT	\N	\N	Système (Simulation)	2025-11-21 12:56:51.504+01
a1f93676-81c1-4aa9-a75a-0b797a0036a7	6861f9f4-737d-489e-a0a1-3fd0064dcd7e	1	Réception de la demande	SUBMITTED	DRAFT	SUBMITTED	\N	\N	Système (Simulation)	2025-11-25 12:56:51.504+01
9a5cae21-440f-4283-8ea2-7a5cba9d0809	6861f9f4-737d-489e-a0a1-3fd0064dcd7e	1	Réception de la demande	STEP_COMPLETED	SUBMITTED	IN_PROGRESS	\N	\N	Système (Simulation)	2025-11-29 12:56:51.504+01
9ca4ea52-f0d6-4579-b5d1-e138bcf6704c	6861f9f4-737d-489e-a0a1-3fd0064dcd7e	2	Analyse technique	STEP_COMPLETED	IN_PROGRESS	IN_PROGRESS	\N	\N	Système (Simulation)	2025-12-04 12:56:51.504+01
5c0a69d2-44c8-4d9f-b26f-913979830199	6861f9f4-737d-489e-a0a1-3fd0064dcd7e	3	Vérification juridique	STEP_COMPLETED	IN_PROGRESS	IN_PROGRESS	\N	\N	Système (Simulation)	2025-12-08 12:56:51.504+01
96822156-0e7e-4852-90a9-7a18f9b95673	6861f9f4-737d-489e-a0a1-3fd0064dcd7e	4	Validation du chef de service	STEP_COMPLETED	IN_PROGRESS	IN_PROGRESS	\N	\N	Système (Simulation)	2025-12-09 12:56:51.504+01
1addf252-c59b-428d-9f02-b6f0e22168ad	6861f9f4-737d-489e-a0a1-3fd0064dcd7e	5	Décision finale	APPROVED	UNDER_REVIEW	APPROVED	Demande approuvée après vérification complète du dossier.	\N	Système (Simulation)	2025-12-14 12:56:51.504+01
caccd304-a844-4ca3-9b24-e6c6802183d7	fe86303b-1c89-4bee-9b1c-de387b8a5155	1	Création	CREATED	\N	DRAFT	\N	\N	Système (Simulation)	2025-10-25 14:40:34.257+01
a5ef5bc1-65d0-4955-8001-53b91b1e403d	fe86303b-1c89-4bee-9b1c-de387b8a5155	1	Réception de la demande	SUBMITTED	DRAFT	SUBMITTED	\N	\N	Système (Simulation)	2025-10-28 14:40:34.257+01
f805eb68-4e35-4de8-8728-c52bafb84897	fe86303b-1c89-4bee-9b1c-de387b8a5155	1	Réception de la demande	STEP_COMPLETED	SUBMITTED	IN_PROGRESS	\N	\N	Système (Simulation)	2025-10-31 14:40:34.257+01
b7939cd4-84ec-414e-a4b2-aafbd8074b79	fe86303b-1c89-4bee-9b1c-de387b8a5155	2	Analyse technique	STEP_COMPLETED	IN_PROGRESS	IN_PROGRESS	\N	\N	Système (Simulation)	2025-11-05 14:40:34.257+01
40512ee7-0742-4b23-afe1-6ac80cc91809	c539a075-12a2-4355-b119-d6e7fc63e334	1	Création	CREATED	\N	DRAFT	\N	\N	Système (Simulation)	2025-11-07 16:21:18.599+01
e7341df3-7168-4b79-a726-35371c6b9585	c539a075-12a2-4355-b119-d6e7fc63e334	1	Enregistrement	SUBMITTED	DRAFT	SUBMITTED	\N	\N	Système (Simulation)	2025-11-08 16:21:18.599+01
d50ea73c-a44d-42a2-b944-1ca9a0bd9e06	e7250280-fba6-4038-bfc1-e9290ca7c892	1	Création	CREATED	\N	DRAFT	\N	\N	Système (Simulation)	2025-11-30 14:28:10.355+01
05df68f8-9fec-4b6e-a5ad-4c7cf9cb62f4	e7250280-fba6-4038-bfc1-e9290ca7c892	1	Enregistrement	SUBMITTED	DRAFT	SUBMITTED	\N	\N	Système (Simulation)	2025-12-05 14:28:10.355+01
10aee57f-c4b8-4e73-beed-899bb906d342	e7250280-fba6-4038-bfc1-e9290ca7c892	1	Enregistrement	STEP_COMPLETED	SUBMITTED	IN_PROGRESS	\N	\N	Système (Simulation)	2025-12-06 14:28:10.355+01
9c8c6c02-abf0-4a79-83b4-6c2bb4d5ee9b	e7250280-fba6-4038-bfc1-e9290ca7c892	2	Inspection préalable	STEP_COMPLETED	IN_PROGRESS	IN_PROGRESS	\N	\N	Système (Simulation)	2025-12-09 14:28:10.355+01
5ad14696-ffa4-4894-8ea9-90f94e37e8d7	e902f7d6-0d93-45f3-8751-7ab7238a32f4	1	Création	CREATED	\N	DRAFT	\N	\N	Système (Simulation)	2025-11-06 19:27:12.635+01
70b6970a-3a0e-4ccc-8c41-d4e97c504307	0c284fe6-3a18-4896-88f5-3ee2f0f0eb42	1	Création	CREATED	\N	DRAFT	\N	\N	Système (Simulation)	2025-11-10 06:59:30.472+01
d58cdc05-419f-4cf3-9c9a-d2af32f19f1c	0c284fe6-3a18-4896-88f5-3ee2f0f0eb42	1	Enregistrement	SUBMITTED	DRAFT	SUBMITTED	\N	\N	Système (Simulation)	2025-11-12 06:59:30.472+01
23a6f6d5-8957-41ab-b2ff-01f05899c234	0c284fe6-3a18-4896-88f5-3ee2f0f0eb42	1	Enregistrement	STEP_COMPLETED	SUBMITTED	IN_PROGRESS	\N	\N	Système (Simulation)	2025-11-13 06:59:30.472+01
2de1ad3e-0611-46a1-aca7-7a160ecc4de5	0c284fe6-3a18-4896-88f5-3ee2f0f0eb42	2	Inspection préalable	STEP_COMPLETED	IN_PROGRESS	IN_PROGRESS	\N	\N	Système (Simulation)	2025-11-16 06:59:30.472+01
413fdf35-6a1a-415f-8677-f071b3de9a78	0c284fe6-3a18-4896-88f5-3ee2f0f0eb42	3	Évaluation des capacités	STEP_COMPLETED	IN_PROGRESS	IN_PROGRESS	\N	\N	Système (Simulation)	2025-11-18 06:59:30.472+01
31b79bd5-59bd-45ad-bb7d-33600c8850fe	0c284fe6-3a18-4896-88f5-3ee2f0f0eb42	4	Commission d'attribution	STEP_COMPLETED	IN_PROGRESS	IN_PROGRESS	\N	\N	Système (Simulation)	2025-11-21 06:59:30.472+01
59818457-e119-482c-ade9-b93a3480306b	0c284fe6-3a18-4896-88f5-3ee2f0f0eb42	5	Émission de la licence	APPROVED	UNDER_REVIEW	APPROVED	Demande approuvée après vérification complète du dossier.	\N	Système (Simulation)	2025-11-22 06:59:30.472+01
dc069ae6-4bf1-4b1e-895e-bf0ab57123fd	8267237e-a0b5-4f75-9c85-944b771ce7d9	1	Création	CREATED	\N	DRAFT	\N	\N	Système (Simulation)	2025-11-26 12:47:08.507+01
bb397d8c-9bc3-48ff-8833-4fc71c088a64	8267237e-a0b5-4f75-9c85-944b771ce7d9	1	Enregistrement	SUBMITTED	DRAFT	SUBMITTED	\N	\N	Système (Simulation)	2025-11-30 12:47:08.507+01
7486236f-3ef9-441a-9003-98a0da5f1997	8267237e-a0b5-4f75-9c85-944b771ce7d9	1	Enregistrement	STEP_COMPLETED	SUBMITTED	IN_PROGRESS	\N	\N	Système (Simulation)	2025-12-05 12:47:08.507+01
c21b85f2-4ede-4540-aab7-c14bff8e4a51	8267237e-a0b5-4f75-9c85-944b771ce7d9	2	Inspection préalable	STEP_COMPLETED	IN_PROGRESS	IN_PROGRESS	\N	\N	Système (Simulation)	2025-12-08 12:47:08.507+01
b7c9c726-e1f2-4973-8d05-5c2478e66ca1	8267237e-a0b5-4f75-9c85-944b771ce7d9	3	Évaluation des capacités	STEP_COMPLETED	IN_PROGRESS	IN_PROGRESS	\N	\N	Système (Simulation)	2025-12-09 12:47:08.507+01
1fc88fc5-8b43-4f65-bb5e-3764b985be5b	38824810-a58a-4710-b951-e3f2dc665d22	1	Création	CREATED	\N	DRAFT	\N	\N	Système (Simulation)	2025-11-11 11:36:17.703+01
b161b31d-e877-463d-bc8f-b336ee48fdc7	38824810-a58a-4710-b951-e3f2dc665d22	1	Dépôt de dossier	SUBMITTED	DRAFT	SUBMITTED	\N	\N	Système (Simulation)	2025-11-13 11:36:17.703+01
7ffd932a-5482-4371-91a8-3a6dd28ed673	38824810-a58a-4710-b951-e3f2dc665d22	1	Dépôt de dossier	DOCUMENTS_REQUESTED	IN_PROGRESS	PENDING_DOCUMENTS	\N	\N	Système (Simulation)	2025-11-17 11:36:17.703+01
1f96387d-85c4-40f7-af19-c2dfb332ca53	80bf7470-e35d-4389-b5e5-5f9cca02269e	1	Création	CREATED	\N	DRAFT	\N	\N	Système (Simulation)	2025-12-03 21:59:30.624+01
93d31ad4-8a40-4f44-ae26-1a322d113a87	80bf7470-e35d-4389-b5e5-5f9cca02269e	1	Dépôt de dossier	SUBMITTED	DRAFT	SUBMITTED	\N	\N	Système (Simulation)	2025-12-05 21:59:30.624+01
3db1561c-99fb-4a00-954c-c6dddaa3eef7	80bf7470-e35d-4389-b5e5-5f9cca02269e	1	Dépôt de dossier	STEP_COMPLETED	SUBMITTED	IN_PROGRESS	\N	\N	Système (Simulation)	2025-12-06 21:59:30.624+01
c5abeecc-dbae-48ac-9d46-7d9be2c03d0a	80bf7470-e35d-4389-b5e5-5f9cca02269e	2	Étude de conformité	STEP_COMPLETED	IN_PROGRESS	IN_PROGRESS	\N	\N	Système (Simulation)	2025-12-11 21:59:30.624+01
91c6460a-45eb-45d4-84a8-dfa1f72d123e	80bf7470-e35d-4389-b5e5-5f9cca02269e	3	Enquête de terrain	STEP_COMPLETED	IN_PROGRESS	IN_PROGRESS	\N	\N	Système (Simulation)	2025-12-16 21:59:30.624+01
64ef31c4-413e-4137-9fac-421ea54d73f3	80bf7470-e35d-4389-b5e5-5f9cca02269e	4	Avis technique	STEP_COMPLETED	IN_PROGRESS	IN_PROGRESS	\N	\N	Système (Simulation)	2025-12-19 21:59:30.624+01
2c224bef-afbf-4561-bf97-9270b348dc2c	80bf7470-e35d-4389-b5e5-5f9cca02269e	5	Délivrance du permis	REJECTED	UNDER_REVIEW	REJECTED	Demande rejetée - critères non satisfaits.	\N	Système (Simulation)	2025-12-20 21:59:30.624+01
59fb12d3-e1ab-40b7-9707-ea02251f3fe4	b754457f-9a79-4b9e-b5e7-902b6ef6f258	1	Création	CREATED	\N	DRAFT	\N	\N	Système (Simulation)	2025-11-08 01:35:29.853+01
09e4b6b0-3fa9-4029-be48-05e9e1238bae	b754457f-9a79-4b9e-b5e7-902b6ef6f258	1	Dépôt de dossier	SUBMITTED	DRAFT	SUBMITTED	\N	\N	Système (Simulation)	2025-11-09 01:35:29.853+01
38e0d0d8-210c-427c-bb9a-4b84fb26f5d6	b754457f-9a79-4b9e-b5e7-902b6ef6f258	1	Dépôt de dossier	STEP_COMPLETED	SUBMITTED	IN_PROGRESS	\N	\N	Système (Simulation)	2025-11-14 01:35:29.853+01
e6ed3ae7-65f5-4a69-bf19-d94b4dd97e02	3fc987e3-3cbe-425a-935d-a0edd96d3dab	1	Création	CREATED	\N	DRAFT	\N	\N	Système (Simulation)	2025-11-19 08:35:27.457+01
122d9bba-3896-458f-800a-c2a7fee2c448	108a9ac5-1c93-4f30-ad95-f3b62b654a11	1	Création	CREATED	\N	DRAFT	\N	\N	Système (Simulation)	2025-12-21 09:29:28.833+01
9deb0e0e-9478-4acf-9671-80e7a5117959	108a9ac5-1c93-4f30-ad95-f3b62b654a11	1	Dépôt de dossier	SUBMITTED	DRAFT	SUBMITTED	\N	\N	Système (Simulation)	2025-12-24 09:29:28.833+01
10c9ac85-a25f-488b-b1b5-7b6254279689	108a9ac5-1c93-4f30-ad95-f3b62b654a11	1	Dépôt de dossier	STEP_COMPLETED	SUBMITTED	IN_PROGRESS	\N	\N	Système (Simulation)	2025-12-26 09:29:28.833+01
efdfe136-a44b-4deb-81e1-9507ab3924bf	108a9ac5-1c93-4f30-ad95-f3b62b654a11	2	Étude de conformité	STEP_COMPLETED	IN_PROGRESS	IN_PROGRESS	\N	\N	Système (Simulation)	2025-12-29 09:29:28.833+01
097b39f5-df34-42bf-be33-c1e007cbcdc7	c5e8d54b-3984-469c-95a1-8adaf7d6e21e	1	Création	CREATED	\N	DRAFT	\N	\N	Système (Simulation)	2025-11-20 13:09:18.087+01
326b99a9-93c4-4760-90b6-b37b4b5bb78a	c5e8d54b-3984-469c-95a1-8adaf7d6e21e	1	Dépôt de dossier	SUBMITTED	DRAFT	SUBMITTED	\N	\N	Système (Simulation)	2025-11-22 13:09:18.087+01
0eb12d73-1a49-4c60-b9e9-8119895191d0	c5e8d54b-3984-469c-95a1-8adaf7d6e21e	1	Dépôt de dossier	STEP_COMPLETED	SUBMITTED	IN_PROGRESS	\N	\N	Système (Simulation)	2025-11-25 13:09:18.087+01
fd8b7120-e509-4c4d-85f4-fa125e1df73f	c5e8d54b-3984-469c-95a1-8adaf7d6e21e	2	Étude de conformité	STEP_COMPLETED	IN_PROGRESS	IN_PROGRESS	\N	\N	Système (Simulation)	2025-11-30 13:09:18.087+01
dfad9f8b-ede0-40a0-b1ba-ad19cb3c056b	c5e8d54b-3984-469c-95a1-8adaf7d6e21e	3	Enquête de terrain	STEP_COMPLETED	IN_PROGRESS	IN_PROGRESS	\N	\N	Système (Simulation)	2025-12-02 13:09:18.087+01
ffecace7-095b-4c13-b976-f0c4f53c7ac4	c5e8d54b-3984-469c-95a1-8adaf7d6e21e	4	Avis technique	STEP_COMPLETED	IN_PROGRESS	IN_PROGRESS	\N	\N	Système (Simulation)	2025-12-07 13:09:18.087+01
4bb12a9b-f26d-4ac2-82e8-a971e34dfb13	c5e8d54b-3984-469c-95a1-8adaf7d6e21e	5	Délivrance du permis	APPROVED	UNDER_REVIEW	APPROVED	Demande approuvée après vérification complète du dossier.	\N	Système (Simulation)	2025-12-12 13:09:18.087+01
1935959b-b470-4d0c-bacc-a8469444ea10	c2481a26-45d0-421b-9a69-14b4f3a65c22	1	Création	CREATED	\N	DRAFT	\N	\N	Système (Simulation)	2025-12-31 09:34:03.242+01
48a1c1e3-a85a-46ba-805a-0b37c6daabd1	c2481a26-45d0-421b-9a69-14b4f3a65c22	1	Dépôt de dossier	SUBMITTED	DRAFT	SUBMITTED	\N	\N	Système (Simulation)	2026-01-03 09:34:03.242+01
a93a162f-6e87-470a-a4f5-27b4a4b76f63	c2481a26-45d0-421b-9a69-14b4f3a65c22	1	Dépôt de dossier	DOCUMENTS_REQUESTED	IN_PROGRESS	PENDING_DOCUMENTS	\N	\N	Système (Simulation)	2026-01-05 09:34:03.242+01
106a9d12-2580-482b-8e2f-7edb6c1b1687	f02bcc5b-db63-4d08-91df-5f2cc7b47532	1	Création	CREATED	\N	DRAFT	\N	\N	Système (Simulation)	2025-12-21 01:25:48.338+01
1809c7a4-0e24-4194-8a1e-700359706f5a	f02bcc5b-db63-4d08-91df-5f2cc7b47532	1	Réception de la demande	SUBMITTED	DRAFT	SUBMITTED	\N	\N	Système (Simulation)	2025-12-23 01:25:48.338+01
347a0416-8a2c-4ebd-9ddd-8f796800fd8a	b9d0f070-5889-413f-8e5d-df2703652097	1	Création	CREATED	\N	DRAFT	\N	\N	Système (Simulation)	2025-11-18 14:26:11.325+01
cb3075a4-71d5-4f24-ae3d-17bd20119baf	b9d0f070-5889-413f-8e5d-df2703652097	1	Réception de la demande	SUBMITTED	DRAFT	SUBMITTED	\N	\N	Système (Simulation)	2025-11-23 14:26:11.325+01
e77ac736-803f-45f5-9de7-a4fcf80de33c	b9d0f070-5889-413f-8e5d-df2703652097	1	Réception de la demande	STEP_COMPLETED	SUBMITTED	IN_PROGRESS	\N	\N	Système (Simulation)	2025-11-27 14:26:11.325+01
04dc4c13-4ec4-4a4a-86f7-422ee43ff8b8	3ff483a8-95f0-43ec-85ad-b8abc0d9dc59	1	Création	CREATED	\N	DRAFT	\N	\N	Système (Simulation)	2025-10-20 23:27:01.439+01
abd2c980-166c-4c8f-9002-b1899b007255	0c08ef4c-283d-49af-bf64-e3d89ce0d58c	1	Création	CREATED	\N	DRAFT	\N	\N	Système (Simulation)	2025-11-26 22:00:02.1+01
3bdd46ba-03d4-4add-b5c2-439003d6f076	0c08ef4c-283d-49af-bf64-e3d89ce0d58c	1	Réception de la demande	SUBMITTED	DRAFT	SUBMITTED	\N	\N	Système (Simulation)	2025-11-27 22:00:02.1+01
dec881f0-d552-49b3-aa07-a088acd1599e	0c08ef4c-283d-49af-bf64-e3d89ce0d58c	1	Réception de la demande	STEP_COMPLETED	SUBMITTED	IN_PROGRESS	\N	\N	Système (Simulation)	2025-11-30 22:00:02.1+01
4b4b1be0-9ab2-47c0-a927-535b65056ef1	5bf2dca4-c866-4f69-854c-11bd9205401e	1	Création	CREATED	\N	DRAFT	\N	\N	Système (Simulation)	2025-10-28 14:50:15.668+01
0591583d-4569-4e38-bb41-7ab4f4b62e1b	5bf2dca4-c866-4f69-854c-11bd9205401e	1	Enregistrement	SUBMITTED	DRAFT	SUBMITTED	\N	\N	Système (Simulation)	2025-11-02 14:50:15.668+01
77100b42-a883-46f1-b6f5-74f5c30fb6f8	5bf2dca4-c866-4f69-854c-11bd9205401e	1	Enregistrement	STEP_COMPLETED	SUBMITTED	IN_PROGRESS	\N	\N	Système (Simulation)	2025-11-03 14:50:15.668+01
66bd5f72-80c1-411f-8bef-1b24398d522d	5bf2dca4-c866-4f69-854c-11bd9205401e	2	Inspection préalable	DOCUMENTS_REQUESTED	IN_PROGRESS	PENDING_DOCUMENTS	\N	\N	Système (Simulation)	2025-11-08 14:50:15.668+01
d941e1af-0290-4987-bc88-9824e45160b5	2775f504-4c69-4422-81d9-5a8157f45132	1	Création	CREATED	\N	DRAFT	\N	\N	Système (Simulation)	2025-10-07 16:09:50.723+01
44041497-18da-4e9e-8b63-7c0dfc1c9ccb	2775f504-4c69-4422-81d9-5a8157f45132	1	Enregistrement	SUBMITTED	DRAFT	SUBMITTED	\N	\N	Système (Simulation)	2025-10-08 16:09:50.723+01
65564ce3-ba74-4ade-9cea-7849de5a423f	2775f504-4c69-4422-81d9-5a8157f45132	1	Enregistrement	STEP_COMPLETED	SUBMITTED	IN_PROGRESS	\N	\N	Système (Simulation)	2025-10-13 16:09:50.723+01
b1487b01-33d8-4d2a-b557-93157fe44001	2775f504-4c69-4422-81d9-5a8157f45132	2	Inspection préalable	STEP_COMPLETED	IN_PROGRESS	IN_PROGRESS	\N	\N	Système (Simulation)	2025-10-17 16:09:50.723+01
a423e006-021f-443d-9772-fdf678f990cf	2775f504-4c69-4422-81d9-5a8157f45132	3	Évaluation des capacités	STEP_COMPLETED	IN_PROGRESS	IN_PROGRESS	\N	\N	Système (Simulation)	2025-10-21 16:09:50.723+01
ea380556-6a83-48dd-8b9a-f94ad303222c	2775f504-4c69-4422-81d9-5a8157f45132	4	Commission d'attribution	STEP_COMPLETED	IN_PROGRESS	IN_PROGRESS	\N	\N	Système (Simulation)	2025-10-25 16:09:50.723+01
c630511f-4dc7-4cb6-9252-2fd320e676e5	2775f504-4c69-4422-81d9-5a8157f45132	5	Émission de la licence	REJECTED	UNDER_REVIEW	REJECTED	Demande rejetée - critères non satisfaits.	\N	Système (Simulation)	2025-10-26 16:09:50.723+01
2e734562-cead-41ce-b020-8992828f1e3d	2cbdf9de-34bd-4001-a373-95e12cf37aa3	1	Création	CREATED	\N	DRAFT	\N	\N	Système (Simulation)	2025-10-08 05:29:15.198+01
34371bd9-f866-48b6-a999-2771f8b56967	2cbdf9de-34bd-4001-a373-95e12cf37aa3	1	Enregistrement	SUBMITTED	DRAFT	SUBMITTED	\N	\N	Système (Simulation)	2025-10-12 05:29:15.198+01
84d932e0-ba3b-4f53-b717-0e7ae06b0b88	cca96c0c-0530-4a68-951b-21b5dad671b2	1	Création	CREATED	\N	DRAFT	\N	\N	Système (Simulation)	2025-11-14 07:38:32.386+01
1696fa6d-d64b-4cba-a8a3-418c3d60c854	cca96c0c-0530-4a68-951b-21b5dad671b2	1	Enregistrement	SUBMITTED	DRAFT	SUBMITTED	\N	\N	Système (Simulation)	2025-11-15 07:38:32.386+01
4a1abd1d-28ba-4744-80b3-e492423a176f	cca96c0c-0530-4a68-951b-21b5dad671b2	1	Enregistrement	STEP_COMPLETED	SUBMITTED	IN_PROGRESS	\N	\N	Système (Simulation)	2025-11-20 07:38:32.386+01
3507ac87-5a89-49a2-a364-d608b85a204a	ccdace65-0e30-42cf-8874-fea1539b10ce	1	Création	CREATED	\N	DRAFT	\N	\N	Système (Simulation)	2025-10-26 02:44:10.745+01
1df70d5a-9ce2-4c1e-9948-73453c07a30a	ccdace65-0e30-42cf-8874-fea1539b10ce	1	Enregistrement	SUBMITTED	DRAFT	SUBMITTED	\N	\N	Système (Simulation)	2025-10-30 02:44:10.745+01
461abbbc-d3aa-49bc-8f4d-db082c3cc17e	ccdace65-0e30-42cf-8874-fea1539b10ce	1	Enregistrement	DOCUMENTS_REQUESTED	IN_PROGRESS	PENDING_DOCUMENTS	\N	\N	Système (Simulation)	2025-11-03 02:44:10.745+01
d1dcf522-db3b-431b-942a-63f1889693d6	13b28d75-40cb-43d4-b009-b86edcacb5ba	1	Création	CREATED	\N	DRAFT	\N	\N	Système (Simulation)	2025-10-10 17:50:28.163+01
b2b59fba-94c3-42fc-866b-e2a6a38665bd	13b28d75-40cb-43d4-b009-b86edcacb5ba	1	Enregistrement	SUBMITTED	DRAFT	SUBMITTED	\N	\N	Système (Simulation)	2025-10-13 17:50:28.163+01
7239e975-373d-44db-89ef-52cf4959c529	7fa57d6e-fe37-476d-8fe3-47bd695cc5d1	1	Création	CREATED	\N	DRAFT	\N	\N	Système (Simulation)	2025-12-20 22:56:08.009+01
e674445d-738d-4d3c-b952-aa09a5ac8638	7fa57d6e-fe37-476d-8fe3-47bd695cc5d1	1	Enregistrement	SUBMITTED	DRAFT	SUBMITTED	\N	\N	Système (Simulation)	2025-12-22 22:56:08.009+01
9b8e9eb0-bb57-4d2d-a3a6-590425498a16	7fa57d6e-fe37-476d-8fe3-47bd695cc5d1	1	Enregistrement	STEP_COMPLETED	SUBMITTED	IN_PROGRESS	\N	\N	Système (Simulation)	2025-12-25 22:56:08.009+01
32771f1c-3861-43b6-881e-64b3095a7ec3	7fa57d6e-fe37-476d-8fe3-47bd695cc5d1	2	Inspection préalable	STEP_COMPLETED	IN_PROGRESS	IN_PROGRESS	\N	\N	Système (Simulation)	2025-12-29 22:56:08.009+01
13d31abd-4be1-416e-a48b-24ff6bc1fba7	7fa57d6e-fe37-476d-8fe3-47bd695cc5d1	3	Évaluation des capacités	STEP_COMPLETED	IN_PROGRESS	IN_PROGRESS	\N	\N	Système (Simulation)	2026-01-03 22:56:08.009+01
e3bdaf4e-9f25-4284-828d-0d1fb5f92c00	b6646f80-496f-4b14-90b3-c8c330f2c0d7	1	Création	CREATED	\N	DRAFT	\N	\N	Système (Simulation)	2025-11-30 02:26:38.614+01
37594894-94e4-4f85-a72a-619d620a9748	b6646f80-496f-4b14-90b3-c8c330f2c0d7	1	Enregistrement	SUBMITTED	DRAFT	SUBMITTED	\N	\N	Système (Simulation)	2025-12-03 02:26:38.614+01
ad676569-b3ae-49b2-a3f5-68f53f2be4c8	b6646f80-496f-4b14-90b3-c8c330f2c0d7	1	Enregistrement	STEP_COMPLETED	SUBMITTED	IN_PROGRESS	\N	\N	Système (Simulation)	2025-12-08 02:26:38.614+01
8ee1cda6-8ba1-4e96-88ee-27052b70ef81	b6646f80-496f-4b14-90b3-c8c330f2c0d7	2	Inspection préalable	STEP_COMPLETED	IN_PROGRESS	IN_PROGRESS	\N	\N	Système (Simulation)	2025-12-09 02:26:38.614+01
febd5afa-4b58-4645-8a1e-bd86ac2e4b82	b6646f80-496f-4b14-90b3-c8c330f2c0d7	3	Évaluation des capacités	STEP_COMPLETED	IN_PROGRESS	IN_PROGRESS	\N	\N	Système (Simulation)	2025-12-14 02:26:38.614+01
be5b19b3-8a25-4ecc-bcbd-2ba7d5daaba0	b6646f80-496f-4b14-90b3-c8c330f2c0d7	4	Commission d'attribution	STEP_COMPLETED	IN_PROGRESS	IN_PROGRESS	\N	\N	Système (Simulation)	2025-12-15 02:26:38.614+01
6817886d-1e9c-4a96-a70b-908b34723b8b	b6646f80-496f-4b14-90b3-c8c330f2c0d7	5	Émission de la licence	REJECTED	UNDER_REVIEW	REJECTED	Demande rejetée - critères non satisfaits.	\N	Système (Simulation)	2025-12-18 02:26:38.614+01
97fe875e-14ee-4d8f-b2cd-7fb5958f6d44	f5d10a15-8205-4980-ba1b-8cb7cc910aea	1	Création	CREATED	\N	DRAFT	\N	\N	Système (Simulation)	2025-11-27 09:23:41.263+01
c8c9c35b-735e-4982-953a-b438a80650ef	f5d10a15-8205-4980-ba1b-8cb7cc910aea	1	Dépôt de dossier	SUBMITTED	DRAFT	SUBMITTED	\N	\N	Système (Simulation)	2025-11-28 09:23:41.263+01
9322cd5c-0b96-48e6-828f-81a3093749fa	f5d10a15-8205-4980-ba1b-8cb7cc910aea	1	Dépôt de dossier	STEP_COMPLETED	SUBMITTED	IN_PROGRESS	\N	\N	Système (Simulation)	2025-12-03 09:23:41.263+01
8cbeec66-3396-47a1-8588-430965434200	f5d10a15-8205-4980-ba1b-8cb7cc910aea	2	Étude de conformité	STEP_COMPLETED	IN_PROGRESS	IN_PROGRESS	\N	\N	Système (Simulation)	2025-12-06 09:23:41.263+01
48ee4d6e-1219-48dd-b796-4688bd9cbed5	f5d10a15-8205-4980-ba1b-8cb7cc910aea	3	Enquête de terrain	STEP_COMPLETED	IN_PROGRESS	IN_PROGRESS	\N	\N	Système (Simulation)	2025-12-10 09:23:41.263+01
a70b617d-df83-4aaf-86be-3bb5db64ae15	f5d10a15-8205-4980-ba1b-8cb7cc910aea	4	Avis technique	STEP_COMPLETED	IN_PROGRESS	IN_PROGRESS	\N	\N	Système (Simulation)	2025-12-12 09:23:41.263+01
1953d0ba-a2b8-4139-9b9c-f076984ae996	f5d10a15-8205-4980-ba1b-8cb7cc910aea	5	Délivrance du permis	REJECTED	UNDER_REVIEW	REJECTED	Demande rejetée - critères non satisfaits.	\N	Système (Simulation)	2025-12-16 09:23:41.263+01
ead30400-f4cb-49e8-ab8d-2a8cfb89fce5	a7a9b1e6-02eb-4327-94dd-c4bc25d6662a	1	Création	CREATED	\N	DRAFT	\N	\N	Système (Simulation)	2025-12-27 04:19:47.42+01
40f5a9bc-3f9a-450a-8cc2-b784dc74b389	a7a9b1e6-02eb-4327-94dd-c4bc25d6662a	1	Dépôt de dossier	SUBMITTED	DRAFT	SUBMITTED	\N	\N	Système (Simulation)	2025-12-31 04:19:47.42+01
02ec7d06-dcf5-4c3e-aff8-1a75c9e0549d	a7a9b1e6-02eb-4327-94dd-c4bc25d6662a	1	Dépôt de dossier	STEP_COMPLETED	SUBMITTED	IN_PROGRESS	\N	\N	Système (Simulation)	2026-01-04 04:19:47.42+01
022296e4-8297-4388-9434-58ee29a285df	a7a9b1e6-02eb-4327-94dd-c4bc25d6662a	2	Étude de conformité	STEP_COMPLETED	IN_PROGRESS	IN_PROGRESS	\N	\N	Système (Simulation)	2026-01-07 04:19:47.42+01
2caca2ca-5307-4fbe-b55c-7d6d5bbb38db	a7a9b1e6-02eb-4327-94dd-c4bc25d6662a	3	Enquête de terrain	STEP_COMPLETED	IN_PROGRESS	IN_PROGRESS	\N	\N	Système (Simulation)	2026-01-08 04:19:47.42+01
aec776e6-c7a2-434f-b3ac-c521cd488557	2d0baa78-aa76-417f-b302-57964c03b63f	1	Création	CREATED	\N	DRAFT	\N	\N	Système (Simulation)	2025-12-17 00:17:17.931+01
81b1fe8c-97e7-464d-bc8f-4b81087b32eb	98025983-6a4a-451b-b6ea-464b313cb2d5	1	Création	CREATED	\N	DRAFT	\N	\N	Système (Simulation)	2025-10-30 23:01:23.628+01
449c92d3-d22b-4885-bf12-1291528e323d	98025983-6a4a-451b-b6ea-464b313cb2d5	1	Dépôt de dossier	SUBMITTED	DRAFT	SUBMITTED	\N	\N	Système (Simulation)	2025-11-03 23:01:23.628+01
36f6f736-4391-4b18-9749-766851a4086e	98025983-6a4a-451b-b6ea-464b313cb2d5	1	Dépôt de dossier	STEP_COMPLETED	SUBMITTED	IN_PROGRESS	\N	\N	Système (Simulation)	2025-11-06 23:01:23.628+01
0bb7caf3-7873-423d-8905-7e298813b1db	98025983-6a4a-451b-b6ea-464b313cb2d5	2	Étude de conformité	STEP_COMPLETED	IN_PROGRESS	IN_PROGRESS	\N	\N	Système (Simulation)	2025-11-09 23:01:23.628+01
31bca42e-01f5-4c3c-a6c2-3b495e4d2d8e	98025983-6a4a-451b-b6ea-464b313cb2d5	3	Enquête de terrain	DOCUMENTS_REQUESTED	IN_PROGRESS	PENDING_DOCUMENTS	\N	\N	Système (Simulation)	2025-11-12 23:01:23.628+01
d07f0a1d-f69f-426b-b758-792df68e9a28	bc3198c3-ae13-44b7-97d5-feb9eb110d22	1	Création	CREATED	\N	DRAFT	\N	\N	Système (Simulation)	2025-12-07 11:55:29.327+01
088eb1c9-0fc7-4c9c-a3df-20dfc2047810	bc3198c3-ae13-44b7-97d5-feb9eb110d22	1	Dépôt de dossier	SUBMITTED	DRAFT	SUBMITTED	\N	\N	Système (Simulation)	2025-12-08 11:55:29.327+01
36849872-5f32-41cf-a7f6-f66537cb1bf5	bc3198c3-ae13-44b7-97d5-feb9eb110d22	1	Dépôt de dossier	STEP_COMPLETED	SUBMITTED	IN_PROGRESS	\N	\N	Système (Simulation)	2025-12-11 11:55:29.327+01
68b31513-57c5-40f8-b5a5-3b641364ce35	bc3198c3-ae13-44b7-97d5-feb9eb110d22	2	Étude de conformité	STEP_COMPLETED	IN_PROGRESS	IN_PROGRESS	\N	\N	Système (Simulation)	2025-12-14 11:55:29.327+01
b643304c-6cac-4809-a24b-9b4efb44826d	bc3198c3-ae13-44b7-97d5-feb9eb110d22	3	Enquête de terrain	STEP_COMPLETED	IN_PROGRESS	IN_PROGRESS	\N	\N	Système (Simulation)	2025-12-18 11:55:29.327+01
eb3b1516-fa0f-427e-9adb-91bfa75a60cc	bc3198c3-ae13-44b7-97d5-feb9eb110d22	4	Avis technique	STEP_COMPLETED	IN_PROGRESS	IN_PROGRESS	\N	\N	Système (Simulation)	2025-12-19 11:55:29.327+01
f2e59268-2651-46e4-85c9-8b2ed6116f93	bc3198c3-ae13-44b7-97d5-feb9eb110d22	5	Délivrance du permis	REJECTED	UNDER_REVIEW	REJECTED	Demande rejetée - critères non satisfaits.	\N	Système (Simulation)	2025-12-22 11:55:29.327+01
b25db18f-9c84-4409-8cb0-f6399a9d4faf	4ceaca4f-ad1e-4fb0-9001-e07e613bbbb7	1	Création	CREATED	\N	DRAFT	\N	\N	Système (Simulation)	2025-11-24 22:20:33.427+01
5ea879eb-c249-4e48-98f5-bb507216da37	4525a8b2-ddcd-46d7-b46b-36efea747713	1	Création	CREATED	\N	DRAFT	\N	\N	Système (Simulation)	2025-10-20 11:39:10.759+01
2de90a3e-05d3-4881-b228-285e932f8419	4525a8b2-ddcd-46d7-b46b-36efea747713	1	Réception de la demande	SUBMITTED	DRAFT	SUBMITTED	\N	\N	Système (Simulation)	2025-10-23 11:39:10.759+01
5941dede-3e19-4de7-9988-ba43019a25fd	4525a8b2-ddcd-46d7-b46b-36efea747713	1	Réception de la demande	STEP_COMPLETED	SUBMITTED	IN_PROGRESS	\N	\N	Système (Simulation)	2025-10-28 11:39:10.759+01
fe3cc027-aef0-43f1-8f81-df7a3e4792d8	4525a8b2-ddcd-46d7-b46b-36efea747713	2	Analyse technique	STEP_COMPLETED	IN_PROGRESS	IN_PROGRESS	\N	\N	Système (Simulation)	2025-10-31 11:39:10.759+01
f6182334-9b18-4a81-a8f7-25d770c41c59	4525a8b2-ddcd-46d7-b46b-36efea747713	3	Vérification juridique	STEP_COMPLETED	IN_PROGRESS	IN_PROGRESS	\N	\N	Système (Simulation)	2025-11-02 11:39:10.759+01
c3d87692-fcc4-43a1-b4ce-246bceea85ab	4525a8b2-ddcd-46d7-b46b-36efea747713	4	Validation du chef de service	STEP_COMPLETED	IN_PROGRESS	IN_PROGRESS	\N	\N	Système (Simulation)	2025-11-07 11:39:10.759+01
54d7b968-bea8-4cd6-9948-610e939380d5	4525a8b2-ddcd-46d7-b46b-36efea747713	5	Décision finale	APPROVED	UNDER_REVIEW	APPROVED	Demande approuvée après vérification complète du dossier.	\N	Système (Simulation)	2025-11-12 11:39:10.759+01
2da3a47f-f26e-4926-ba6f-eb011f4f2d3d	1609a724-7fda-4bf2-b145-11597a6dc7e3	1	Création	CREATED	\N	DRAFT	\N	\N	Système (Simulation)	2025-11-08 18:19:48.668+01
ce2727de-ec99-4af2-b581-3ecbc11be4b6	1609a724-7fda-4bf2-b145-11597a6dc7e3	1	Réception de la demande	SUBMITTED	DRAFT	SUBMITTED	\N	\N	Système (Simulation)	2025-11-09 18:19:48.668+01
0eec2c3f-f457-4665-81cb-306e29feac80	1609a724-7fda-4bf2-b145-11597a6dc7e3	1	Réception de la demande	STEP_COMPLETED	SUBMITTED	IN_PROGRESS	\N	\N	Système (Simulation)	2025-11-11 18:19:48.668+01
f3f110fd-1492-476a-888a-39102d2e4333	1609a724-7fda-4bf2-b145-11597a6dc7e3	2	Analyse technique	STEP_COMPLETED	IN_PROGRESS	IN_PROGRESS	\N	\N	Système (Simulation)	2025-11-16 18:19:48.668+01
91ee84f2-9c06-4471-96c0-6ef6fb630d1f	1609a724-7fda-4bf2-b145-11597a6dc7e3	3	Vérification juridique	STEP_COMPLETED	IN_PROGRESS	IN_PROGRESS	\N	\N	Système (Simulation)	2025-11-21 18:19:48.668+01
e46c64a3-64c1-4f95-b300-99a153a9df24	07b01ddf-5751-48a1-86e0-87d1f3d78333	1	Création	CREATED	\N	DRAFT	\N	\N	Système (Simulation)	2025-10-05 05:01:59.319+01
dfc4542e-7cbe-4b58-bf35-ba675b92f246	07b01ddf-5751-48a1-86e0-87d1f3d78333	1	Réception de la demande	SUBMITTED	DRAFT	SUBMITTED	\N	\N	Système (Simulation)	2025-10-09 05:01:59.319+01
917615c5-7b8a-4d8f-aee3-a053a5ad9e0b	07b01ddf-5751-48a1-86e0-87d1f3d78333	1	Réception de la demande	STEP_COMPLETED	SUBMITTED	IN_PROGRESS	\N	\N	Système (Simulation)	2025-10-10 05:01:59.319+01
ec974578-8f47-466e-97c2-a9de37100c83	07b01ddf-5751-48a1-86e0-87d1f3d78333	2	Analyse technique	STEP_COMPLETED	IN_PROGRESS	IN_PROGRESS	\N	\N	Système (Simulation)	2025-10-12 05:01:59.319+01
bca0e72b-5e78-414b-bbb6-8bc43325574f	07b01ddf-5751-48a1-86e0-87d1f3d78333	3	Vérification juridique	STEP_COMPLETED	IN_PROGRESS	IN_PROGRESS	\N	\N	Système (Simulation)	2025-10-16 05:01:59.319+01
3fd53852-fe8a-499d-afa6-28ab2fe6cf87	e331f5ef-bfc1-498e-b125-18ec9fc7387d	1	Création	CREATED	\N	DRAFT	\N	\N	Système (Simulation)	2025-11-13 21:05:55.866+01
665a7e3a-bde4-49df-9e1d-a0fdf4f753be	e331f5ef-bfc1-498e-b125-18ec9fc7387d	1	Enregistrement	SUBMITTED	DRAFT	SUBMITTED	\N	\N	Système (Simulation)	2025-11-14 21:05:55.866+01
2c9188ee-ffe6-4f84-a5a2-ef2ce41edcef	e331f5ef-bfc1-498e-b125-18ec9fc7387d	1	Enregistrement	STEP_COMPLETED	SUBMITTED	IN_PROGRESS	\N	\N	Système (Simulation)	2025-11-17 21:05:55.866+01
849a0fb9-b453-4d50-9013-7c8a8786bbb5	63dcce6b-4e9b-425e-a817-45ca44d10f5c	1	Création	CREATED	\N	DRAFT	\N	\N	Système (Simulation)	2025-10-16 06:40:31.294+01
786ffb27-a20a-43df-9ba9-d76bdea77176	63dcce6b-4e9b-425e-a817-45ca44d10f5c	1	Enregistrement	SUBMITTED	DRAFT	SUBMITTED	\N	\N	Système (Simulation)	2025-10-20 06:40:31.294+01
1910a06b-1fbf-4891-9869-303edac68bae	63dcce6b-4e9b-425e-a817-45ca44d10f5c	1	Enregistrement	STEP_COMPLETED	SUBMITTED	IN_PROGRESS	\N	\N	Système (Simulation)	2025-10-22 06:40:31.294+01
8f950ba2-0a05-41d4-bcd4-f824eb5a0323	63dcce6b-4e9b-425e-a817-45ca44d10f5c	2	Inspection préalable	STEP_COMPLETED	IN_PROGRESS	IN_PROGRESS	\N	\N	Système (Simulation)	2025-10-24 06:40:31.294+01
8a8e9e4f-94db-49a9-9c67-5966430def44	63dcce6b-4e9b-425e-a817-45ca44d10f5c	3	Évaluation des capacités	STEP_COMPLETED	IN_PROGRESS	IN_PROGRESS	\N	\N	Système (Simulation)	2025-10-27 06:40:31.294+01
f95a03e6-d933-44ec-ab56-4205053f4af9	25cce765-887e-4282-bd30-e5e17760d9fe	1	Création	CREATED	\N	DRAFT	\N	\N	Système (Simulation)	2025-11-04 07:34:50.45+01
c05f8a3d-650b-47f5-b7d1-b9408a4a376b	a8c6099f-4a0b-4c4c-84f0-837102d5b5c3	1	Création	CREATED	\N	DRAFT	\N	\N	Système (Simulation)	2025-12-27 02:21:28.651+01
c7f075df-5fc0-423e-8f0d-e4694ddbab69	a8c6099f-4a0b-4c4c-84f0-837102d5b5c3	1	Enregistrement	SUBMITTED	DRAFT	SUBMITTED	\N	\N	Système (Simulation)	2025-12-30 02:21:28.651+01
721dffd8-6f64-404c-93fe-fa60883b52e9	a8c6099f-4a0b-4c4c-84f0-837102d5b5c3	1	Enregistrement	STEP_COMPLETED	SUBMITTED	IN_PROGRESS	\N	\N	Système (Simulation)	2026-01-03 02:21:28.651+01
98e25188-72e8-464b-9861-c4fcdd07d9f6	e3765d6d-20c7-4146-95ae-770c69c03f5a	1	Création	CREATED	\N	DRAFT	\N	\N	Système (Simulation)	2025-11-04 05:09:40.679+01
05288435-9812-43b2-a17a-c070eb0487ca	e3765d6d-20c7-4146-95ae-770c69c03f5a	1	Enregistrement	SUBMITTED	DRAFT	SUBMITTED	\N	\N	Système (Simulation)	2025-11-09 05:09:40.679+01
115f22c3-8285-4dd8-a789-d475026d4dcb	e3765d6d-20c7-4146-95ae-770c69c03f5a	1	Enregistrement	STEP_COMPLETED	SUBMITTED	IN_PROGRESS	\N	\N	Système (Simulation)	2025-11-11 05:09:40.679+01
6f83faca-6832-4aa0-a04e-e1d72dc49216	e3765d6d-20c7-4146-95ae-770c69c03f5a	2	Inspection préalable	STEP_COMPLETED	IN_PROGRESS	IN_PROGRESS	\N	\N	Système (Simulation)	2025-11-13 05:09:40.679+01
71afa3c4-df73-4007-8c74-045297fa2d47	e3765d6d-20c7-4146-95ae-770c69c03f5a	3	Évaluation des capacités	STEP_COMPLETED	IN_PROGRESS	IN_PROGRESS	\N	\N	Système (Simulation)	2025-11-15 05:09:40.679+01
8d75c485-35c3-4bb8-9ee6-c3148012ed91	e3765d6d-20c7-4146-95ae-770c69c03f5a	4	Commission d'attribution	STEP_COMPLETED	IN_PROGRESS	IN_PROGRESS	\N	\N	Système (Simulation)	2025-11-16 05:09:40.679+01
17513e28-2202-4eb3-94bc-742feb260467	e3765d6d-20c7-4146-95ae-770c69c03f5a	5	Émission de la licence	REJECTED	UNDER_REVIEW	REJECTED	Demande rejetée - critères non satisfaits.	\N	Système (Simulation)	2025-11-21 05:09:40.679+01
bf121383-db95-4be1-8c14-ae1df2da527b	4621ff2d-654c-4a51-9556-46279227beb1	1	Création	CREATED	\N	DRAFT	\N	\N	Système (Simulation)	2025-11-21 12:13:00.238+01
be702308-0dae-4107-be93-806c2b61d223	4621ff2d-654c-4a51-9556-46279227beb1	1	Enregistrement	SUBMITTED	DRAFT	SUBMITTED	\N	\N	Système (Simulation)	2025-11-22 12:13:00.238+01
f7e9fc37-8b66-4dd0-8994-ef25c1f33b4e	4621ff2d-654c-4a51-9556-46279227beb1	1	Enregistrement	STEP_COMPLETED	SUBMITTED	IN_PROGRESS	\N	\N	Système (Simulation)	2025-11-23 12:13:00.238+01
10829215-9302-4a98-99a2-c1f85608b5e1	4621ff2d-654c-4a51-9556-46279227beb1	2	Inspection préalable	STEP_COMPLETED	IN_PROGRESS	IN_PROGRESS	\N	\N	Système (Simulation)	2025-11-28 12:13:00.238+01
b567a9b2-6871-423c-9612-3322aae2f125	4621ff2d-654c-4a51-9556-46279227beb1	3	Évaluation des capacités	STEP_COMPLETED	IN_PROGRESS	IN_PROGRESS	\N	\N	Système (Simulation)	2025-12-02 12:13:00.238+01
69c9ff93-8c53-4be3-ac58-054cca33605f	4621ff2d-654c-4a51-9556-46279227beb1	4	Commission d'attribution	STEP_COMPLETED	IN_PROGRESS	IN_PROGRESS	\N	\N	Système (Simulation)	2025-12-07 12:13:00.238+01
f6bfc894-ce68-421c-aaee-db05d56ee247	4621ff2d-654c-4a51-9556-46279227beb1	5	Émission de la licence	REJECTED	UNDER_REVIEW	REJECTED	Demande rejetée - critères non satisfaits.	\N	Système (Simulation)	2025-12-12 12:13:00.238+01
c246dd80-5865-4ce0-8fda-93bdb410fe86	5fd395da-1ff2-48cc-8926-8cbd6085ea6e	1	Création	CREATED	\N	DRAFT	\N	\N	Système (Simulation)	2025-10-22 09:33:27.833+01
bf096e32-f81e-4c9a-9f6f-2f3205d5262b	5fd395da-1ff2-48cc-8926-8cbd6085ea6e	1	Dépôt de dossier	SUBMITTED	DRAFT	SUBMITTED	\N	\N	Système (Simulation)	2025-10-23 09:33:27.833+01
42e5400a-1f44-40b4-8a6f-7c08862ce75f	5fd395da-1ff2-48cc-8926-8cbd6085ea6e	1	Dépôt de dossier	STEP_COMPLETED	SUBMITTED	IN_PROGRESS	\N	\N	Système (Simulation)	2025-10-25 09:33:27.833+01
ba49051a-b600-4d23-a8cb-e88c1bd98cbf	5fd395da-1ff2-48cc-8926-8cbd6085ea6e	2	Étude de conformité	STEP_COMPLETED	IN_PROGRESS	IN_PROGRESS	\N	\N	Système (Simulation)	2025-10-29 09:33:27.833+01
fe83a3c0-d319-4f02-b1c0-29b034c78702	5fd395da-1ff2-48cc-8926-8cbd6085ea6e	3	Enquête de terrain	DOCUMENTS_REQUESTED	IN_PROGRESS	PENDING_DOCUMENTS	\N	\N	Système (Simulation)	2025-10-30 09:33:27.833+01
f2bbf7f6-92d3-452a-8183-591f084ac7b7	98ada3eb-e1bc-4466-82ff-cb7d54d4a88e	1	Création	CREATED	\N	DRAFT	\N	\N	Système (Simulation)	2025-11-05 05:37:56.239+01
949fd873-3ee4-486f-916e-adbc3e266004	98ada3eb-e1bc-4466-82ff-cb7d54d4a88e	1	Dépôt de dossier	SUBMITTED	DRAFT	SUBMITTED	\N	\N	Système (Simulation)	2025-11-07 05:37:56.239+01
51367eac-168d-4828-a5b6-893f728b70e3	98ada3eb-e1bc-4466-82ff-cb7d54d4a88e	1	Dépôt de dossier	STEP_COMPLETED	SUBMITTED	IN_PROGRESS	\N	\N	Système (Simulation)	2025-11-12 05:37:56.239+01
6461e967-7b04-4d98-ba40-82104ca07e9c	98ada3eb-e1bc-4466-82ff-cb7d54d4a88e	2	Étude de conformité	STEP_COMPLETED	IN_PROGRESS	IN_PROGRESS	\N	\N	Système (Simulation)	2025-11-14 05:37:56.239+01
92f738fa-df90-41b0-aa4a-698884a1f89d	98ada3eb-e1bc-4466-82ff-cb7d54d4a88e	3	Enquête de terrain	DOCUMENTS_REQUESTED	IN_PROGRESS	PENDING_DOCUMENTS	\N	\N	Système (Simulation)	2025-11-17 05:37:56.239+01
c68b0b75-2946-49a3-bfa8-ec2fd96d21f3	1382903c-4d8e-46ef-af75-1259283a01dd	1	Création	CREATED	\N	DRAFT	\N	\N	Système (Simulation)	2025-10-24 03:00:51.871+01
48f7e63c-b1d0-4533-8f8f-87a72809d193	a4beb241-ac54-4959-a758-a5f7b2889315	1	Création	CREATED	\N	DRAFT	\N	\N	Système (Simulation)	2025-11-01 12:01:07.528+01
b0f0ed83-4bee-4f97-8c3b-79b7698f06d9	a4beb241-ac54-4959-a758-a5f7b2889315	1	Dépôt de dossier	SUBMITTED	DRAFT	SUBMITTED	\N	\N	Système (Simulation)	2025-11-04 12:01:07.528+01
a506fb75-0ef5-4120-9a15-eb39d75b2bd1	a4beb241-ac54-4959-a758-a5f7b2889315	1	Dépôt de dossier	STEP_COMPLETED	SUBMITTED	IN_PROGRESS	\N	\N	Système (Simulation)	2025-11-09 12:01:07.528+01
29708d2b-b6ab-402a-a389-2d5047d74afc	a4beb241-ac54-4959-a758-a5f7b2889315	2	Étude de conformité	STEP_COMPLETED	IN_PROGRESS	IN_PROGRESS	\N	\N	Système (Simulation)	2025-11-14 12:01:07.528+01
a946501b-0c1f-4036-ba2c-88ca08a00c19	107daed2-0922-4566-8b57-7943e54437fb	1	Création	CREATED	\N	DRAFT	\N	\N	Système (Simulation)	2025-10-09 07:18:21.288+01
fe16335f-de1e-4563-bc52-2a1b7eda8dca	bdb9f683-2418-4201-a800-894ae24c086c	1	Création	CREATED	\N	DRAFT	\N	\N	Système (Simulation)	2025-12-30 22:45:26.16+01
37d2aa14-0e06-481a-a7a2-0dda305cbd15	9be6508d-ad3f-437e-b259-6254b75c8380	1	Création	CREATED	\N	DRAFT	\N	\N	Système (Simulation)	2025-10-22 22:53:21.229+01
43d9e98e-23e1-4182-a1ee-32a52582041e	9be6508d-ad3f-437e-b259-6254b75c8380	1	Dépôt de dossier	SUBMITTED	DRAFT	SUBMITTED	\N	\N	Système (Simulation)	2025-10-26 22:53:21.229+01
ee2a6c8b-9f48-4fd7-8ed4-834e1e0069a8	9be6508d-ad3f-437e-b259-6254b75c8380	1	Dépôt de dossier	STEP_COMPLETED	SUBMITTED	IN_PROGRESS	\N	\N	Système (Simulation)	2025-10-29 22:53:21.229+01
a5b1305d-4969-40df-b613-88a74c1a53ad	7e07824a-30d2-4688-a021-12671fad9ab2	1	Création	CREATED	\N	DRAFT	\N	\N	Système (Simulation)	2025-10-31 23:50:32.904+01
4e550979-30de-4848-8d4b-605c7a0698b0	7e07824a-30d2-4688-a021-12671fad9ab2	1	Dépôt de dossier	SUBMITTED	DRAFT	SUBMITTED	\N	\N	Système (Simulation)	2025-11-05 23:50:32.904+01
5af3de9a-b83a-481e-9ae1-b64b10b462f5	7e07824a-30d2-4688-a021-12671fad9ab2	1	Dépôt de dossier	STEP_COMPLETED	SUBMITTED	IN_PROGRESS	\N	\N	Système (Simulation)	2025-11-08 23:50:32.904+01
e44632f9-307a-46db-bf82-238f8eea8427	7e07824a-30d2-4688-a021-12671fad9ab2	2	Étude de conformité	STEP_COMPLETED	IN_PROGRESS	IN_PROGRESS	\N	\N	Système (Simulation)	2025-11-10 23:50:32.904+01
80ddb719-87cc-42b4-8f2a-e006ae0b6437	7e07824a-30d2-4688-a021-12671fad9ab2	3	Enquête de terrain	STEP_COMPLETED	IN_PROGRESS	IN_PROGRESS	\N	\N	Système (Simulation)	2025-11-13 23:50:32.904+01
7e19cc76-8fe9-4520-bb54-1e5ede0a5061	7e07824a-30d2-4688-a021-12671fad9ab2	4	Avis technique	STEP_COMPLETED	IN_PROGRESS	IN_PROGRESS	\N	\N	Système (Simulation)	2025-11-16 23:50:32.904+01
efd84ff6-6753-4c3a-a46b-bd74b38a3844	7e07824a-30d2-4688-a021-12671fad9ab2	5	Délivrance du permis	REJECTED	UNDER_REVIEW	REJECTED	Demande rejetée - critères non satisfaits.	\N	Système (Simulation)	2025-11-18 23:50:32.904+01
65edcc06-1aa8-4441-bf63-799dfd8a647f	069a571b-c66c-40c4-b0d5-b8bf7c29e5f5	1	Création	CREATED	\N	DRAFT	\N	\N	Système (Simulation)	2025-12-14 23:37:28.503+01
b6c0f731-edfb-4d7c-96a0-618e5a3dab84	069a571b-c66c-40c4-b0d5-b8bf7c29e5f5	1	Réception de la demande	SUBMITTED	DRAFT	SUBMITTED	\N	\N	Système (Simulation)	2025-12-16 23:37:28.503+01
f1ffca49-6366-40ac-a275-c0a25088a9c7	2056bdaa-a81e-4249-ac69-94097b5a17a4	1	Création	CREATED	\N	DRAFT	\N	\N	Système (Simulation)	2025-12-25 12:23:49.394+01
c85bcfec-2ff0-40f0-82c3-e07b4ad09595	2056bdaa-a81e-4249-ac69-94097b5a17a4	1	Réception de la demande	SUBMITTED	DRAFT	SUBMITTED	\N	\N	Système (Simulation)	2025-12-27 12:23:49.394+01
9b810942-2fce-40e6-b158-14e4253ed9a9	2056bdaa-a81e-4249-ac69-94097b5a17a4	1	Réception de la demande	STEP_COMPLETED	SUBMITTED	IN_PROGRESS	\N	\N	Système (Simulation)	2025-12-31 12:23:49.394+01
a563e045-1e34-407a-bb53-a7862729b719	2056bdaa-a81e-4249-ac69-94097b5a17a4	2	Analyse technique	STEP_COMPLETED	IN_PROGRESS	IN_PROGRESS	\N	\N	Système (Simulation)	2026-01-05 12:23:49.394+01
1c83b37b-e35f-4404-bbc2-c4404205105f	2056bdaa-a81e-4249-ac69-94097b5a17a4	3	Vérification juridique	STEP_COMPLETED	IN_PROGRESS	IN_PROGRESS	\N	\N	Système (Simulation)	2026-01-07 12:23:49.394+01
1da847e7-9826-42cb-9877-d033be4e5866	2056bdaa-a81e-4249-ac69-94097b5a17a4	4	Validation du chef de service	STEP_COMPLETED	IN_PROGRESS	IN_PROGRESS	\N	\N	Système (Simulation)	2026-01-11 12:23:49.394+01
0b965a0c-2798-4f8b-b677-9f8090d1d1ec	2056bdaa-a81e-4249-ac69-94097b5a17a4	5	Décision finale	REJECTED	UNDER_REVIEW	REJECTED	Demande rejetée - critères non satisfaits.	\N	Système (Simulation)	2026-01-12 12:23:49.394+01
093bf6e2-5221-48ab-a861-25840270660a	49b97aa5-6a9d-40e3-a439-eec373ab2f1f	1	Création	CREATED	\N	DRAFT	\N	\N	Système (Simulation)	2025-11-15 05:59:36.503+01
31d8ccb4-cb83-460c-95d1-2005fb9ba336	49b97aa5-6a9d-40e3-a439-eec373ab2f1f	1	Réception de la demande	SUBMITTED	DRAFT	SUBMITTED	\N	\N	Système (Simulation)	2025-11-17 05:59:36.503+01
ec208299-e5e5-414d-88df-fbfb6b3b4400	49b97aa5-6a9d-40e3-a439-eec373ab2f1f	1	Réception de la demande	STEP_COMPLETED	SUBMITTED	IN_PROGRESS	\N	\N	Système (Simulation)	2025-11-22 05:59:36.503+01
1d08f41a-7fcc-417b-a732-1f9222d9b2d8	49b97aa5-6a9d-40e3-a439-eec373ab2f1f	2	Analyse technique	DOCUMENTS_REQUESTED	IN_PROGRESS	PENDING_DOCUMENTS	\N	\N	Système (Simulation)	2025-11-24 05:59:36.503+01
46717db2-301c-4897-8c0a-de8ff9f4857a	2399b507-2a7f-460a-a834-9ce346522fdc	1	Création	CREATED	\N	DRAFT	\N	\N	Système (Simulation)	2025-10-26 05:36:27.416+01
545b740b-65f9-454f-9794-542fc67ac664	2399b507-2a7f-460a-a834-9ce346522fdc	1	Réception de la demande	SUBMITTED	DRAFT	SUBMITTED	\N	\N	Système (Simulation)	2025-10-30 05:36:27.416+01
8989caa1-bcec-4459-a3f6-21cafcc7bdf3	2399b507-2a7f-460a-a834-9ce346522fdc	1	Réception de la demande	STEP_COMPLETED	SUBMITTED	IN_PROGRESS	\N	\N	Système (Simulation)	2025-11-04 05:36:27.416+01
91f09e81-a62c-4cc3-8071-ac69d80073ce	2399b507-2a7f-460a-a834-9ce346522fdc	2	Analyse technique	STEP_COMPLETED	IN_PROGRESS	IN_PROGRESS	\N	\N	Système (Simulation)	2025-11-06 05:36:27.416+01
3f75df27-31f4-4a25-8ad5-db7d1b2a3c14	2399b507-2a7f-460a-a834-9ce346522fdc	3	Vérification juridique	STEP_COMPLETED	IN_PROGRESS	IN_PROGRESS	\N	\N	Système (Simulation)	2025-11-07 05:36:27.416+01
7103e738-f6e1-4484-80e9-ca7d295b276b	2399b507-2a7f-460a-a834-9ce346522fdc	4	Validation du chef de service	STEP_COMPLETED	IN_PROGRESS	IN_PROGRESS	\N	\N	Système (Simulation)	2025-11-09 05:36:27.416+01
34e0ac8c-a2f9-453f-942d-5b57ab7880ac	2399b507-2a7f-460a-a834-9ce346522fdc	5	Décision finale	REJECTED	UNDER_REVIEW	REJECTED	Demande rejetée - critères non satisfaits.	\N	Système (Simulation)	2025-11-14 05:36:27.416+01
1b8d0a53-c220-461a-9d8a-d7b514aa84cd	f71e8bbd-06e9-40fe-b09d-1de951470e85	1	Création	CREATED	\N	DRAFT	\N	\N	Système (Simulation)	2025-11-20 15:25:35.388+01
7189c17e-88dd-4959-9448-9202af445556	c2342823-242f-4699-8b8f-03eb1123f1ae	1	Création	CREATED	\N	DRAFT	\N	\N	Système (Simulation)	2025-11-17 02:55:00.892+01
663c501b-1f00-48e9-a48d-b3b1b7887eb7	c2342823-242f-4699-8b8f-03eb1123f1ae	1	Enregistrement	SUBMITTED	DRAFT	SUBMITTED	\N	\N	Système (Simulation)	2025-11-18 02:55:00.892+01
5e2d19ad-a560-46f4-bd3f-aca6e8a3a55d	c2342823-242f-4699-8b8f-03eb1123f1ae	1	Enregistrement	STEP_COMPLETED	SUBMITTED	IN_PROGRESS	\N	\N	Système (Simulation)	2025-11-19 02:55:00.892+01
14bbb039-b651-4695-a00b-1942768e5dca	c2342823-242f-4699-8b8f-03eb1123f1ae	2	Inspection préalable	STEP_COMPLETED	IN_PROGRESS	IN_PROGRESS	\N	\N	Système (Simulation)	2025-11-22 02:55:00.892+01
17d40a29-2106-4bb3-b95f-6c6d4ad03922	c2342823-242f-4699-8b8f-03eb1123f1ae	3	Évaluation des capacités	STEP_COMPLETED	IN_PROGRESS	IN_PROGRESS	\N	\N	Système (Simulation)	2025-11-24 02:55:00.892+01
803cdc8c-9b7c-4b5c-97a3-5c19e230e7af	9db82d25-6892-4ce4-95f0-16054f7af9c3	1	Création	CREATED	\N	DRAFT	\N	\N	Système (Simulation)	2025-12-28 13:15:27.768+01
c5030b91-caa1-4f12-bc85-7819c8d0fc87	9db82d25-6892-4ce4-95f0-16054f7af9c3	1	Enregistrement	SUBMITTED	DRAFT	SUBMITTED	\N	\N	Système (Simulation)	2025-12-29 13:15:27.768+01
e0d35f0d-5975-407e-b6a3-3aafe0d9d3af	9db82d25-6892-4ce4-95f0-16054f7af9c3	1	Enregistrement	STEP_COMPLETED	SUBMITTED	IN_PROGRESS	\N	\N	Système (Simulation)	2026-01-03 13:15:27.768+01
9f2a77e5-364d-4a86-86ad-49f47e21a3b1	9db82d25-6892-4ce4-95f0-16054f7af9c3	2	Inspection préalable	STEP_COMPLETED	IN_PROGRESS	IN_PROGRESS	\N	\N	Système (Simulation)	2026-01-06 13:15:27.768+01
5e3cbc1e-9cb0-4fc8-a54b-fbb968420629	9db82d25-6892-4ce4-95f0-16054f7af9c3	3	Évaluation des capacités	STEP_COMPLETED	IN_PROGRESS	IN_PROGRESS	\N	\N	Système (Simulation)	2026-01-07 13:15:27.768+01
277ce107-fce1-441e-9d45-b5d6b155d99b	9db82d25-6892-4ce4-95f0-16054f7af9c3	4	Commission d'attribution	STEP_COMPLETED	IN_PROGRESS	IN_PROGRESS	\N	\N	Système (Simulation)	2026-01-12 13:15:27.768+01
8651c559-9156-4ede-8dc4-ea5bee546460	9db82d25-6892-4ce4-95f0-16054f7af9c3	5	Émission de la licence	REJECTED	UNDER_REVIEW	REJECTED	Demande rejetée - critères non satisfaits.	\N	Système (Simulation)	2026-01-13 13:15:27.768+01
b5ec025b-88e6-42db-9a63-42f721823934	4872d372-b478-4a26-8c97-f6a66e108c61	1	Création	CREATED	\N	DRAFT	\N	\N	Système (Simulation)	2025-12-31 06:46:40.249+01
2860966a-1263-418a-82f1-75e59db73b39	4872d372-b478-4a26-8c97-f6a66e108c61	1	Enregistrement	SUBMITTED	DRAFT	SUBMITTED	\N	\N	Système (Simulation)	2026-01-05 06:46:40.249+01
e20ca09f-4539-426e-bc97-0956d65bac9c	eb37a13b-8473-400b-ac27-d90acb514aac	1	Création	CREATED	\N	DRAFT	\N	\N	Système (Simulation)	2025-11-21 09:48:06.276+01
c2433276-60e4-43c1-851b-1c96c7b7e04e	8c362ef0-3680-4439-bc9e-05f02f67fb99	1	Création	CREATED	\N	DRAFT	\N	\N	Système (Simulation)	2025-11-11 12:53:58.098+01
c4fd6a35-bc36-41b4-a646-3d2ff46edd24	8c362ef0-3680-4439-bc9e-05f02f67fb99	1	Dépôt de dossier	SUBMITTED	DRAFT	SUBMITTED	\N	\N	Système (Simulation)	2025-11-16 12:53:58.098+01
c3f4d8bc-34ae-42e5-be9d-4e2f4bf590d2	8c362ef0-3680-4439-bc9e-05f02f67fb99	1	Dépôt de dossier	STEP_COMPLETED	SUBMITTED	IN_PROGRESS	\N	\N	Système (Simulation)	2025-11-19 12:53:58.098+01
8c41d751-a1cb-4d36-a2b1-727337b796de	8c362ef0-3680-4439-bc9e-05f02f67fb99	2	Étude de conformité	DOCUMENTS_REQUESTED	IN_PROGRESS	PENDING_DOCUMENTS	\N	\N	Système (Simulation)	2025-11-24 12:53:58.098+01
cd02058e-3b6a-417f-bc2d-505987bc02ee	a4d88772-4bde-42c0-a133-481171302fe6	1	Création	CREATED	\N	DRAFT	\N	\N	Système (Simulation)	2025-12-10 09:13:24.779+01
840203fd-c136-4072-bdd6-4e3bbc6c61e7	a4d88772-4bde-42c0-a133-481171302fe6	1	Dépôt de dossier	SUBMITTED	DRAFT	SUBMITTED	\N	\N	Système (Simulation)	2025-12-13 09:13:24.779+01
6aa93509-2234-47b4-9f6d-b89741cdce4b	a4d88772-4bde-42c0-a133-481171302fe6	1	Dépôt de dossier	STEP_COMPLETED	SUBMITTED	IN_PROGRESS	\N	\N	Système (Simulation)	2025-12-16 09:13:24.779+01
5fdd0596-0e5c-4454-8cb1-4f7eeb1e2b27	a4d88772-4bde-42c0-a133-481171302fe6	2	Étude de conformité	STEP_COMPLETED	IN_PROGRESS	IN_PROGRESS	\N	\N	Système (Simulation)	2025-12-20 09:13:24.779+01
2436fa96-8f68-473c-b210-7cc596829daf	a4d88772-4bde-42c0-a133-481171302fe6	3	Enquête de terrain	STEP_COMPLETED	IN_PROGRESS	IN_PROGRESS	\N	\N	Système (Simulation)	2025-12-21 09:13:24.779+01
46c068d7-36ed-456b-b251-1edbb5c3c3b1	a2a5dab7-3c5f-4782-baf9-944f887f5a6e	1	Création	CREATED	\N	DRAFT	\N	\N	Système (Simulation)	2025-11-23 07:37:31.56+01
f649b5e1-3d8f-4770-84d1-166eb9fb2ffa	42e65832-6b2e-4be5-81f0-0c3ccd1a0e65	1	Création	CREATED	\N	DRAFT	\N	\N	Système (Simulation)	2025-10-06 05:25:17.658+01
c4beedaf-d119-40bc-b3f0-7c2e88d5a2f7	42e65832-6b2e-4be5-81f0-0c3ccd1a0e65	1	Dépôt de dossier	SUBMITTED	DRAFT	SUBMITTED	\N	\N	Système (Simulation)	2025-10-11 05:25:17.658+01
ff6422e1-41f4-40d5-bea8-7f538ee04402	d4c50152-0284-4c2c-a051-3aa9d95e0f30	1	Création	CREATED	\N	DRAFT	\N	\N	Système (Simulation)	2025-11-22 05:56:44.687+01
1d8c03a6-6142-431b-af8a-c93e22657433	d4c50152-0284-4c2c-a051-3aa9d95e0f30	1	Dépôt de dossier	SUBMITTED	DRAFT	SUBMITTED	\N	\N	Système (Simulation)	2025-11-27 05:56:44.687+01
69c71c1e-e47b-49b9-8db4-e090969685b9	fdbe20d4-a550-42ac-a3a3-e25d8ce366a5	1	Création	CREATED	\N	DRAFT	\N	\N	Système (Simulation)	2025-10-18 08:19:33.283+01
f7fbfe17-69b7-4fcd-8033-2c558b7f5ba0	fdbe20d4-a550-42ac-a3a3-e25d8ce366a5	1	Dépôt de dossier	SUBMITTED	DRAFT	SUBMITTED	\N	\N	Système (Simulation)	2025-10-23 08:19:33.283+01
6e392fa4-df86-4615-b866-1efcbc31871d	fdbe20d4-a550-42ac-a3a3-e25d8ce366a5	1	Dépôt de dossier	STEP_COMPLETED	SUBMITTED	IN_PROGRESS	\N	\N	Système (Simulation)	2025-10-25 08:19:33.283+01
c2d3ebe7-52a9-44bb-942d-3f1c390eb0b8	fdbe20d4-a550-42ac-a3a3-e25d8ce366a5	2	Étude de conformité	STEP_COMPLETED	IN_PROGRESS	IN_PROGRESS	\N	\N	Système (Simulation)	2025-10-26 08:19:33.283+01
29813771-37f8-456e-9d55-341bb489a4bf	fdbe20d4-a550-42ac-a3a3-e25d8ce366a5	3	Enquête de terrain	STEP_COMPLETED	IN_PROGRESS	IN_PROGRESS	\N	\N	Système (Simulation)	2025-10-30 08:19:33.283+01
c0a88421-7bc2-4773-9a4b-5469bbc41128	fdbe20d4-a550-42ac-a3a3-e25d8ce366a5	4	Avis technique	STEP_COMPLETED	IN_PROGRESS	IN_PROGRESS	\N	\N	Système (Simulation)	2025-11-03 08:19:33.283+01
0ba59219-aa8e-46c4-a481-4ccfe81610ab	fdbe20d4-a550-42ac-a3a3-e25d8ce366a5	5	Délivrance du permis	APPROVED	UNDER_REVIEW	APPROVED	Demande approuvée après vérification complète du dossier.	\N	Système (Simulation)	2025-11-07 08:19:33.283+01
df79bde4-90d7-4a84-abd3-29f915de2daa	d5ae7137-d327-41f8-89b3-35d9551a8414	1	Création	CREATED	\N	DRAFT	\N	\N	Système (Simulation)	2025-10-14 20:50:25.117+01
d84363ce-4f2b-4053-bed8-f931665d8a50	d5ae7137-d327-41f8-89b3-35d9551a8414	1	Dépôt de dossier	SUBMITTED	DRAFT	SUBMITTED	\N	\N	Système (Simulation)	2025-10-16 20:50:25.117+01
451e88c0-1e23-404f-873d-2bfd8b0d78a5	d5ae7137-d327-41f8-89b3-35d9551a8414	1	Dépôt de dossier	STEP_COMPLETED	SUBMITTED	IN_PROGRESS	\N	\N	Système (Simulation)	2025-10-21 20:50:25.117+01
49476439-a98c-4d7f-a49a-74dcaadf171b	d5ae7137-d327-41f8-89b3-35d9551a8414	2	Étude de conformité	STEP_COMPLETED	IN_PROGRESS	IN_PROGRESS	\N	\N	Système (Simulation)	2025-10-22 20:50:25.117+01
aabab99b-9379-4779-b604-3a916ac641bc	77ce6321-57f8-452d-8e65-b296ad97cc28	1	Création	CREATED	\N	DRAFT	\N	\N	Système (Simulation)	2025-12-26 16:25:45.398+01
41acca57-8ab2-44eb-8635-2064b155b727	5fba80c7-1367-4b24-aa75-b21b9efcb502	1	Création	CREATED	\N	DRAFT	\N	\N	Système (Simulation)	2025-10-07 23:23:46.305+01
51a120f3-29d5-4029-b439-24cc6791f043	5fba80c7-1367-4b24-aa75-b21b9efcb502	1	Réception de la demande	SUBMITTED	DRAFT	SUBMITTED	\N	\N	Système (Simulation)	2025-10-09 23:23:46.305+01
bfc2c444-05ba-483e-a7b6-5fbbeebfd08d	644da85a-0744-4054-9101-e3fbd86a8282	1	Création	CREATED	\N	DRAFT	\N	\N	Système (Simulation)	2025-11-10 15:16:47.305+01
49d52ad2-3fc2-4c7f-bffa-1c9a9e287d95	644da85a-0744-4054-9101-e3fbd86a8282	1	Réception de la demande	SUBMITTED	DRAFT	SUBMITTED	\N	\N	Système (Simulation)	2025-11-12 15:16:47.305+01
32f57bef-656e-4337-a21d-b5a082ed2128	644da85a-0744-4054-9101-e3fbd86a8282	1	Réception de la demande	DOCUMENTS_REQUESTED	IN_PROGRESS	PENDING_DOCUMENTS	\N	\N	Système (Simulation)	2025-11-17 15:16:47.305+01
b228df4a-297a-441a-952a-b853600f00c0	0690600e-7b21-4228-9bae-371f5bc23486	1	Création	CREATED	\N	DRAFT	\N	\N	Système (Simulation)	2025-12-06 09:28:47.117+01
76ad1f9d-8a6b-4365-88e6-12fbed6051cf	0690600e-7b21-4228-9bae-371f5bc23486	1	Réception de la demande	SUBMITTED	DRAFT	SUBMITTED	\N	\N	Système (Simulation)	2025-12-07 09:28:47.117+01
230f1261-83ef-41ea-955e-42e5d0091f64	2e4a2bd4-dfc8-43da-a839-2d5aed781367	1	Création	CREATED	\N	DRAFT	\N	\N	Système (Simulation)	2025-12-28 15:04:45.561+01
af273f1b-fdb7-48cd-a967-8c762ac050de	2e4a2bd4-dfc8-43da-a839-2d5aed781367	1	Réception de la demande	SUBMITTED	DRAFT	SUBMITTED	\N	\N	Système (Simulation)	2025-12-31 15:04:45.561+01
00980245-0d28-4912-b816-3864b273aded	2e4a2bd4-dfc8-43da-a839-2d5aed781367	1	Réception de la demande	STEP_COMPLETED	SUBMITTED	IN_PROGRESS	\N	\N	Système (Simulation)	2026-01-03 15:04:45.561+01
34a6c19e-9dcd-474a-b376-556951e02a73	2e4a2bd4-dfc8-43da-a839-2d5aed781367	2	Analyse technique	STEP_COMPLETED	IN_PROGRESS	IN_PROGRESS	\N	\N	Système (Simulation)	2026-01-05 15:04:45.561+01
fe53e7cb-f527-42bd-b32a-d90d8997701c	2e4a2bd4-dfc8-43da-a839-2d5aed781367	3	Vérification juridique	STEP_COMPLETED	IN_PROGRESS	IN_PROGRESS	\N	\N	Système (Simulation)	2026-01-10 15:04:45.561+01
877d9048-fcdb-403a-b6f2-ff6393f3caa2	2e4a2bd4-dfc8-43da-a839-2d5aed781367	4	Validation du chef de service	STEP_COMPLETED	IN_PROGRESS	IN_PROGRESS	\N	\N	Système (Simulation)	2026-01-12 15:04:45.561+01
40c23e96-ffad-4b9c-bd7c-84b22a4cc124	2e4a2bd4-dfc8-43da-a839-2d5aed781367	5	Décision finale	REJECTED	UNDER_REVIEW	REJECTED	Demande rejetée - critères non satisfaits.	\N	Système (Simulation)	2026-01-13 15:04:45.561+01
59f388b8-4aa4-40cf-81af-65afeee20d6f	8fac5627-89af-402c-8376-404939f5df7b	1	Création	CREATED	\N	DRAFT	\N	\N	Système (Simulation)	2025-10-04 08:02:05.048+01
1f8fba9e-404e-4a98-903a-7f8d7784e20c	8fac5627-89af-402c-8376-404939f5df7b	1	Enregistrement	SUBMITTED	DRAFT	SUBMITTED	\N	\N	Système (Simulation)	2025-10-07 08:02:05.048+01
1062427c-185f-4890-aa32-6c0fcb3f1505	8fac5627-89af-402c-8376-404939f5df7b	1	Enregistrement	STEP_COMPLETED	SUBMITTED	IN_PROGRESS	\N	\N	Système (Simulation)	2025-10-09 08:02:05.048+01
c09d9e01-3ad0-4710-bf77-512dd69b421d	8fac5627-89af-402c-8376-404939f5df7b	2	Inspection préalable	STEP_COMPLETED	IN_PROGRESS	IN_PROGRESS	\N	\N	Système (Simulation)	2025-10-13 08:02:05.048+01
29f2438f-6535-412f-af72-d7a75907fc38	8fac5627-89af-402c-8376-404939f5df7b	3	Évaluation des capacités	STEP_COMPLETED	IN_PROGRESS	IN_PROGRESS	\N	\N	Système (Simulation)	2025-10-15 08:02:05.048+01
3bf6d174-2884-4694-8abe-6a8014b7daba	8fac5627-89af-402c-8376-404939f5df7b	4	Commission d'attribution	STEP_COMPLETED	IN_PROGRESS	IN_PROGRESS	\N	\N	Système (Simulation)	2025-10-16 08:02:05.048+01
873c3294-7354-4e1e-bf28-600bace71eb3	8fac5627-89af-402c-8376-404939f5df7b	5	Émission de la licence	APPROVED	UNDER_REVIEW	APPROVED	Demande approuvée après vérification complète du dossier.	\N	Système (Simulation)	2025-10-20 08:02:05.048+01
222cf08a-7969-4a4a-99f4-095ae767cbf2	0aedfbdf-4f7a-4d18-85e6-66ab5f2a1bcd	1	Création	CREATED	\N	DRAFT	\N	\N	Système (Simulation)	2025-11-15 17:34:33.952+01
32def3e1-68ae-4140-a563-ff281d982535	0aedfbdf-4f7a-4d18-85e6-66ab5f2a1bcd	1	Enregistrement	SUBMITTED	DRAFT	SUBMITTED	\N	\N	Système (Simulation)	2025-11-17 17:34:33.952+01
ecb9ee71-9e91-4403-a912-715608c38a95	0aedfbdf-4f7a-4d18-85e6-66ab5f2a1bcd	1	Enregistrement	STEP_COMPLETED	SUBMITTED	IN_PROGRESS	\N	\N	Système (Simulation)	2025-11-20 17:34:33.952+01
45254bbe-418a-4a43-b9dd-1ee17a528567	0aedfbdf-4f7a-4d18-85e6-66ab5f2a1bcd	2	Inspection préalable	STEP_COMPLETED	IN_PROGRESS	IN_PROGRESS	\N	\N	Système (Simulation)	2025-11-25 17:34:33.952+01
1e9e2232-04a8-4a56-aa90-810457fe74c1	0aedfbdf-4f7a-4d18-85e6-66ab5f2a1bcd	3	Évaluation des capacités	STEP_COMPLETED	IN_PROGRESS	IN_PROGRESS	\N	\N	Système (Simulation)	2025-11-30 17:34:33.952+01
1c0919bb-d9d2-4028-b46d-7bbb9161909b	0aedfbdf-4f7a-4d18-85e6-66ab5f2a1bcd	4	Commission d'attribution	STEP_COMPLETED	IN_PROGRESS	IN_PROGRESS	\N	\N	Système (Simulation)	2025-12-05 17:34:33.952+01
b8046de6-743e-4d6b-b04c-dacb8bfb56bf	0aedfbdf-4f7a-4d18-85e6-66ab5f2a1bcd	5	Émission de la licence	APPROVED	UNDER_REVIEW	APPROVED	Demande approuvée après vérification complète du dossier.	\N	Système (Simulation)	2025-12-09 17:34:33.952+01
70ebe93c-66ff-4413-912a-8d10293fbc18	438ccf84-1ba4-470b-985d-293a47240e1e	1	Création	CREATED	\N	DRAFT	\N	\N	Système (Simulation)	2025-10-13 03:21:13.788+01
e07887d9-7e2b-4175-9e63-d4582277b428	b6f516b4-791a-453e-8b19-37bf749632cc	1	Création	CREATED	\N	DRAFT	\N	\N	Système (Simulation)	2025-11-20 04:32:21.283+01
dc87778e-7373-4f80-8d72-3251cdc5e858	b6f516b4-791a-453e-8b19-37bf749632cc	1	Enregistrement	SUBMITTED	DRAFT	SUBMITTED	\N	\N	Système (Simulation)	2025-11-24 04:32:21.283+01
566108cd-febb-4525-a0ae-b1cff85f7b1c	b6f516b4-791a-453e-8b19-37bf749632cc	1	Enregistrement	STEP_COMPLETED	SUBMITTED	IN_PROGRESS	\N	\N	Système (Simulation)	2025-11-26 04:32:21.283+01
cee66f5b-cbcb-476c-87e1-3764777a56eb	b6f516b4-791a-453e-8b19-37bf749632cc	2	Inspection préalable	STEP_COMPLETED	IN_PROGRESS	IN_PROGRESS	\N	\N	Système (Simulation)	2025-11-27 04:32:21.283+01
367813c4-0d02-471c-b81d-ddb238a4703e	b6f516b4-791a-453e-8b19-37bf749632cc	3	Évaluation des capacités	DOCUMENTS_REQUESTED	IN_PROGRESS	PENDING_DOCUMENTS	\N	\N	Système (Simulation)	2025-12-02 04:32:21.283+01
bee139e4-85d7-450f-96c5-5d4ea164eeae	1f425a24-96e6-42ee-b8b5-c2e3a1f37510	1	Création	CREATED	\N	DRAFT	\N	\N	Système (Simulation)	2025-11-03 22:01:49.554+01
bb1a62aa-3c77-4c19-b324-dab5801bae11	1f425a24-96e6-42ee-b8b5-c2e3a1f37510	1	Enregistrement	SUBMITTED	DRAFT	SUBMITTED	\N	\N	Système (Simulation)	2025-11-04 22:01:49.554+01
7324c8f6-37f3-484d-bed2-d33986dc7d52	1f425a24-96e6-42ee-b8b5-c2e3a1f37510	1	Enregistrement	STEP_COMPLETED	SUBMITTED	IN_PROGRESS	\N	\N	Système (Simulation)	2025-11-09 22:01:49.554+01
a60dbc6e-bf5c-450e-90ae-9c8e3e3fa08f	1f425a24-96e6-42ee-b8b5-c2e3a1f37510	2	Inspection préalable	STEP_COMPLETED	IN_PROGRESS	IN_PROGRESS	\N	\N	Système (Simulation)	2025-11-13 22:01:49.554+01
68c5919e-4fa5-4a0f-ac0d-4541440c2b6d	1f425a24-96e6-42ee-b8b5-c2e3a1f37510	3	Évaluation des capacités	DOCUMENTS_REQUESTED	IN_PROGRESS	PENDING_DOCUMENTS	\N	\N	Système (Simulation)	2025-11-16 22:01:49.554+01
b81e2394-fffd-41ee-8be2-bca8c9e88889	71151517-4370-41c2-b957-ea97d48d1332	1	Création	CREATED	\N	DRAFT	\N	\N	Système (Simulation)	2025-12-18 13:50:08.159+01
4c2fae4b-bc04-42c7-8e8c-49660ddb8917	71151517-4370-41c2-b957-ea97d48d1332	1	Dépôt de dossier	SUBMITTED	DRAFT	SUBMITTED	\N	\N	Système (Simulation)	2025-12-19 13:50:08.159+01
a9042d81-b838-48b4-acf3-b91055c7b44b	71151517-4370-41c2-b957-ea97d48d1332	1	Dépôt de dossier	STEP_COMPLETED	SUBMITTED	IN_PROGRESS	\N	\N	Système (Simulation)	2025-12-24 13:50:08.159+01
15c2c880-91c8-41ec-9c27-b638edc58d5b	71151517-4370-41c2-b957-ea97d48d1332	2	Étude de conformité	STEP_COMPLETED	IN_PROGRESS	IN_PROGRESS	\N	\N	Système (Simulation)	2025-12-26 13:50:08.159+01
e43c423f-728d-43d8-8ae8-ee8c41ff7576	71151517-4370-41c2-b957-ea97d48d1332	3	Enquête de terrain	STEP_COMPLETED	IN_PROGRESS	IN_PROGRESS	\N	\N	Système (Simulation)	2025-12-27 13:50:08.159+01
fbb033c6-38fc-4fde-9548-bb12ebc58628	71151517-4370-41c2-b957-ea97d48d1332	4	Avis technique	STEP_COMPLETED	IN_PROGRESS	IN_PROGRESS	\N	\N	Système (Simulation)	2025-12-29 13:50:08.159+01
5067d2de-1333-4b17-8205-bdceca93df62	71151517-4370-41c2-b957-ea97d48d1332	5	Délivrance du permis	REJECTED	UNDER_REVIEW	REJECTED	Demande rejetée - critères non satisfaits.	\N	Système (Simulation)	2026-01-02 13:50:08.159+01
2e5e967b-0564-46bd-a3fe-5f09ae6ed355	48feb1bb-756b-4031-aef4-214d467afc0d	1	Création	CREATED	\N	DRAFT	\N	\N	Système (Simulation)	2025-11-14 07:34:53.113+01
10dc7797-25d4-4164-b431-f5ff904c8d0b	48feb1bb-756b-4031-aef4-214d467afc0d	1	Dépôt de dossier	SUBMITTED	DRAFT	SUBMITTED	\N	\N	Système (Simulation)	2025-11-18 07:34:53.113+01
ddbbf5d8-ca82-4e79-88d7-a0f962d5663e	48feb1bb-756b-4031-aef4-214d467afc0d	1	Dépôt de dossier	STEP_COMPLETED	SUBMITTED	IN_PROGRESS	\N	\N	Système (Simulation)	2025-11-19 07:34:53.113+01
5f9ae531-c34b-40bb-81f8-b984f962cdfb	48feb1bb-756b-4031-aef4-214d467afc0d	2	Étude de conformité	STEP_COMPLETED	IN_PROGRESS	IN_PROGRESS	\N	\N	Système (Simulation)	2025-11-21 07:34:53.113+01
5e5567ee-291d-45fe-a3b4-e833800f10d1	bffcaae9-402e-4cbe-913d-08115fa6df53	1	Création	CREATED	\N	DRAFT	\N	\N	Système (Simulation)	2025-10-28 10:24:58.926+01
9c3b4990-1696-4b08-94e2-d964f3accb19	bffcaae9-402e-4cbe-913d-08115fa6df53	1	Dépôt de dossier	SUBMITTED	DRAFT	SUBMITTED	\N	\N	Système (Simulation)	2025-10-31 10:24:58.926+01
1efd4562-3ee8-4113-8385-15857a39407c	bffcaae9-402e-4cbe-913d-08115fa6df53	1	Dépôt de dossier	STEP_COMPLETED	SUBMITTED	IN_PROGRESS	\N	\N	Système (Simulation)	2025-11-01 10:24:58.926+01
c6e7f0cd-8bdd-404b-8641-1747bfae13f7	b1452200-0553-4cf3-9687-fce69e088717	1	Création	CREATED	\N	DRAFT	\N	\N	Système (Simulation)	2025-10-31 21:47:50.72+01
954dc02f-4677-4245-a062-822b4ec4b4f6	b1452200-0553-4cf3-9687-fce69e088717	1	Dépôt de dossier	SUBMITTED	DRAFT	SUBMITTED	\N	\N	Système (Simulation)	2025-11-05 21:47:50.72+01
bc732071-b547-4f4d-96df-651a9611b6de	7a4cb8f4-b96a-4d62-9d18-3903dce42a81	1	Création	CREATED	\N	DRAFT	\N	\N	Système (Simulation)	2025-10-31 09:41:56.064+01
16c9734d-132f-4259-9038-d46f7aa02f10	662749c7-df4d-444d-95c3-637528d05b9e	1	Création	CREATED	\N	DRAFT	\N	\N	Système (Simulation)	2025-10-16 17:34:24.157+01
8c635f5c-74dd-49e3-8478-71a1bd8593c9	662749c7-df4d-444d-95c3-637528d05b9e	1	Dépôt de dossier	SUBMITTED	DRAFT	SUBMITTED	\N	\N	Système (Simulation)	2025-10-20 17:34:24.157+01
3267f579-9bea-4a0f-ab25-7e2915ada5d1	662749c7-df4d-444d-95c3-637528d05b9e	1	Dépôt de dossier	STEP_COMPLETED	SUBMITTED	IN_PROGRESS	\N	\N	Système (Simulation)	2025-10-21 17:34:24.157+01
670e0c30-c4ce-4176-a10e-a083f3b44357	662749c7-df4d-444d-95c3-637528d05b9e	2	Étude de conformité	STEP_COMPLETED	IN_PROGRESS	IN_PROGRESS	\N	\N	Système (Simulation)	2025-10-26 17:34:24.157+01
924f39c2-8ced-4457-a158-c8378aefe1f9	662749c7-df4d-444d-95c3-637528d05b9e	3	Enquête de terrain	STEP_COMPLETED	IN_PROGRESS	IN_PROGRESS	\N	\N	Système (Simulation)	2025-10-27 17:34:24.157+01
18316bc9-1914-4830-84e8-125bf2758a08	662749c7-df4d-444d-95c3-637528d05b9e	4	Avis technique	STEP_COMPLETED	IN_PROGRESS	IN_PROGRESS	\N	\N	Système (Simulation)	2025-10-30 17:34:24.157+01
4b155986-18db-44f5-91c8-f208db8d205a	662749c7-df4d-444d-95c3-637528d05b9e	5	Délivrance du permis	APPROVED	UNDER_REVIEW	APPROVED	Demande approuvée après vérification complète du dossier.	\N	Système (Simulation)	2025-11-04 17:34:24.157+01
9656fbdd-d11f-4f97-9453-812b6181b539	a6eb7f83-73ba-47e2-a62f-0b77482ee648	1	Création	CREATED	\N	DRAFT	\N	\N	Système (Simulation)	2025-10-10 15:12:58.14+01
59d683da-9014-47b9-b90b-cec6837b23ba	7f71fd5c-4b7f-442d-989b-92b8ece39d91	4	Validation du chef de service	DOCUMENTS_REQUESTED	IN_PROGRESS	PENDING_DOCUMENTS	Liste des employés	cmjopae590000zjq2jkhfrkre	Yves Mpunga	2026-01-01 21:50:26.305+01
\.


--
-- Data for Name: ministry_requests; Type: TABLE DATA; Schema: public; Owner: yvesmpunga
--

COPY public.ministry_requests (id, "requestNumber", "requestType", "ministryId", "applicantType", "applicantName", "applicantEmail", "applicantPhone", "applicantAddress", rccm, "idNat", nif, subject, description, sector, province, city, "investmentAmount", currency, status, "currentStep", "totalSteps", priority, "assignedToId", "assignedAt", "submittedAt", "lastStepAt", "dueDate", "decisionDate", "decisionNote", "rejectionReason", "dossierId", "investorId", "createdById", "createdAt", "updatedAt") FROM stdin;
62538e2f-42bc-4592-b967-6c76cee28003	AUT-2026-00001	AUTORISATION	366e67f9-b8ff-4944-bc1b-ae2352dd77ed	INDIVIDUAL	Pierre Mbuyi	pmbuyi@gmail.com	+243 992 555 666	Avenue de l'Investissement, N°15, Ituri	\N	H5555555E	\N	Autorisation d'installation de panneaux solaires	Demande de autorisation d'installation de panneaux solaires pour le compte de Pierre Mbuyi. Cette demande concerne les activités dans le secteur agriculture.	Agriculture	Nord-Kivu	Kisangani	\N	USD	APPROVED	5	5	URGENT	\N	\N	2025-10-20 16:45:44.127+01	2025-11-02 16:45:44.127+01	2025-11-19 16:45:44.127+01	2025-11-07 16:45:44.127+01	Dossier conforme aux exigences réglementaires.	\N	\N	\N	\N	2025-10-17 16:45:44.127+01	2026-01-01 21:20:17.92+01
b0c27f20-139e-4c00-8f20-52148bbc8239	AUT-2026-00002	AUTORISATION	366e67f9-b8ff-4944-bc1b-ae2352dd77ed	COMPANY	Entreprise Agricole du Kasai	agrikasai@yahoo.fr	+243 820 111 222	Avenue de l'Investissement, N°256, Équateur	CD/KAS/RCCM/23-A-11111	D1111111A	C111111111	Autorisation d'exercice d'activité commerciale	Demande de autorisation d'exercice d'activité commerciale pour le compte de Entreprise Agricole du Kasai. Cette demande concerne les activités dans le secteur commerce.	Commerce	Ituri	Lubumbashi	618014.00	USD	REJECTED	5	5	URGENT	\N	\N	2025-11-17 19:59:47.939+01	2025-11-25 19:59:47.939+01	2025-12-17 19:59:47.939+01	2025-11-25 19:59:47.939+01	\N	Dossier incomplet ou non conforme aux critères requis.	\N	\N	\N	2025-11-16 19:59:47.939+01	2026-01-01 21:20:17.93+01
06def3a4-e4d2-4eb5-96c0-13471426650e	AUT-2026-00003	AUTORISATION	366e67f9-b8ff-4944-bc1b-ae2352dd77ed	INDIVIDUAL	Marie Lukusa	mlukusa@outlook.com	+243 991 222 333	Avenue de l'Investissement, N°436, Kasaï	\N	E2222222B	\N	Autorisation de construction d'une usine	Demande de autorisation de construction d'une usine pour le compte de Marie Lukusa. Cette demande concerne les activités dans le secteur commerce.	Mines	Sud-Kivu	Mbuji-Mayi	\N	USD	SUBMITTED	1	5	NORMAL	\N	\N	2025-10-23 05:28:19.936+01	2025-11-03 05:28:19.936+01	2025-11-22 05:28:19.936+01	\N	\N	\N	\N	\N	\N	2025-10-21 05:28:19.936+01	2026-01-01 21:20:17.936+01
1d1f5971-f654-46a1-b72e-ea9a1fca24fe	AUT-2026-00004	AUTORISATION	366e67f9-b8ff-4944-bc1b-ae2352dd77ed	COMPANY	Entreprise Agricole du Kasai	agrikasai@yahoo.fr	+243 820 111 222	Avenue de l'Investissement, N°477, Ituri	CD/KAS/RCCM/23-A-11111	D1111111A	C111111111	Autorisation de construction d'une usine	Demande de autorisation de construction d'une usine pour le compte de Entreprise Agricole du Kasai. Cette demande concerne les activités dans le secteur industrie.	Mines	Kongo Central	Lubumbashi	2024249.00	USD	DRAFT	1	5	NORMAL	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-11-16 02:21:12.085+01	2026-01-01 21:20:17.938+01
88fab93c-2c91-4c33-a599-922ac1b5849f	LIC-2026-00001	LICENCE	366e67f9-b8ff-4944-bc1b-ae2352dd77ed	COMPANY	Cimenterie du Kongo Central	ciment@ckc.cd	+243 816 666 777	Avenue de l'Investissement, N°450, Haut-Katanga	CD/KOC/RCCM/23-E-55555	I6666666F	F555555555	Licence de transport public	Demande de licence de transport public pour le compte de Cimenterie du Kongo Central. Cette demande concerne les activités dans le secteur commerce.	Industrie	Kinshasa	Lubumbashi	4817303.00	USD	UNDER_REVIEW	2	5	LOW	\N	\N	2025-12-30 16:17:19.76+01	2026-01-03 16:17:19.76+01	2026-01-29 16:17:19.76+01	\N	\N	\N	\N	\N	\N	2025-12-29 16:17:19.76+01	2026-01-01 21:20:17.94+01
e5159a19-8d2e-4ad0-9340-862c883017d8	LIC-2026-00002	LICENCE	366e67f9-b8ff-4944-bc1b-ae2352dd77ed	COMPANY	Tech Solutions Kinshasa	contact@techsol.cd	+243 825 444 555	Avenue de l'Investissement, N°80, Kongo Central	CD/KIN/RCCM/24-D-44444	G4444444D	E444444444	Licence de production agroalimentaire	Demande de licence de production agroalimentaire pour le compte de Tech Solutions Kinshasa. Cette demande concerne les activités dans le secteur commerce.	Énergie	Sud-Kivu	Bukavu	363676.00	USD	DRAFT	1	5	LOW	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-11-03 21:00:05.267+01	2026-01-01 21:20:17.944+01
cc260406-115f-4b7c-abcc-bfab03a05418	LIC-2026-00003	LICENCE	366e67f9-b8ff-4944-bc1b-ae2352dd77ed	COMPANY	Tech Solutions Kinshasa	contact@techsol.cd	+243 825 444 555	Avenue de l'Investissement, N°73, Kongo Central	CD/KIN/RCCM/24-D-44444	G4444444D	E444444444	Licence de télécommunications	Demande de licence de télécommunications pour le compte de Tech Solutions Kinshasa. Cette demande concerne les activités dans le secteur industrie.	Énergie	Kinshasa	Bukavu	1507294.00	USD	REJECTED	5	5	LOW	\N	\N	2025-11-04 10:12:42.848+01	2025-11-10 10:12:42.848+01	2025-12-04 10:12:42.848+01	2025-11-14 10:12:42.848+01	\N	Dossier incomplet ou non conforme aux critères requis.	\N	\N	\N	2025-11-01 10:12:42.848+01	2026-01-01 21:20:17.946+01
3cfd304e-6946-447e-b279-9fcb23b4f85f	LIC-2026-00004	LICENCE	366e67f9-b8ff-4944-bc1b-ae2352dd77ed	COMPANY	Société Forestière du Congo	sfc@sfcongo.cd	+243 818 333 444	Avenue de l'Investissement, N°253, Équateur	CD/EQU/RCCM/24-C-33333	F3333333C	D333333333	Licence d'exploitation forestière	Demande de licence d'exploitation forestière pour le compte de Société Forestière du Congo. Cette demande concerne les activités dans le secteur énergie.	Commerce	Kinshasa	Kananga	4176440.00	USD	SUBMITTED	1	5	NORMAL	\N	\N	2025-10-23 10:11:24.217+01	2025-10-30 10:11:24.217+01	2025-11-22 10:11:24.217+01	\N	\N	\N	\N	\N	\N	2025-10-21 10:11:24.217+01	2026-01-01 21:20:17.951+01
24d86165-f7d9-4eb7-a366-dc5960126425	LIC-2026-00005	LICENCE	366e67f9-b8ff-4944-bc1b-ae2352dd77ed	COMPANY	Cimenterie du Kongo Central	ciment@ckc.cd	+243 816 666 777	Avenue de l'Investissement, N°231, Équateur	CD/KOC/RCCM/23-E-55555	I6666666F	F555555555	Licence de production pharmaceutique	Demande de licence de production pharmaceutique pour le compte de Cimenterie du Kongo Central. Cette demande concerne les activités dans le secteur agriculture.	Environnement	Ituri	Kananga	3272382.00	USD	DRAFT	1	5	URGENT	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-10-12 11:11:56.46+01	2026-01-01 21:20:17.953+01
22521d10-3e1b-4815-9620-1e8ae28b7941	LIC-2026-00006	LICENCE	366e67f9-b8ff-4944-bc1b-ae2352dd77ed	COMPANY	Entreprise Agricole du Kasai	agrikasai@yahoo.fr	+243 820 111 222	Avenue de l'Investissement, N°206, Nord-Kivu	CD/KAS/RCCM/23-A-11111	D1111111A	C111111111	Licence de production pharmaceutique	Demande de licence de production pharmaceutique pour le compte de Entreprise Agricole du Kasai. Cette demande concerne les activités dans le secteur agriculture.	Industrie	Sud-Kivu	Kisangani	2322704.00	USD	SUBMITTED	1	5	NORMAL	\N	\N	2025-11-18 05:13:27.649+01	2025-11-24 05:13:27.649+01	2025-12-18 05:13:27.649+01	\N	\N	\N	\N	\N	\N	2025-11-17 05:13:27.649+01	2026-01-01 21:20:17.955+01
d95b6c25-5263-490f-918d-c2daf5eb7b7c	LIC-2026-00007	LICENCE	366e67f9-b8ff-4944-bc1b-ae2352dd77ed	COMPANY	Tech Solutions Kinshasa	contact@techsol.cd	+243 825 444 555	Avenue de l'Investissement, N°10, Kinshasa	CD/KIN/RCCM/24-D-44444	G4444444D	E444444444	Licence de production agroalimentaire	Demande de licence de production agroalimentaire pour le compte de Tech Solutions Kinshasa. Cette demande concerne les activités dans le secteur transport.	Santé	Ituri	Lubumbashi	1348082.00	USD	UNDER_REVIEW	4	5	LOW	\N	\N	2025-12-12 21:41:48.734+01	2025-12-21 21:41:48.734+01	2026-01-11 21:41:48.734+01	\N	\N	\N	\N	\N	\N	2025-12-09 21:41:48.734+01	2026-01-01 21:20:17.956+01
6e48d91c-9063-4038-82fe-4de04fc6c5a7	PER-2026-00001	PERMIS	366e67f9-b8ff-4944-bc1b-ae2352dd77ed	INDIVIDUAL	Pierre Mbuyi	pmbuyi@gmail.com	+243 992 555 666	Avenue de l'Investissement, N°278, Kongo Central	\N	H5555555E	\N	Permis environnemental - Étude d'impact	Demande de permis environnemental - étude d'impact pour le compte de Pierre Mbuyi. Cette demande concerne les activités dans le secteur environnement.	Agriculture	Nord-Kivu	Mbuji-Mayi	\N	USD	DRAFT	1	5	LOW	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-11-17 03:04:57.464+01	2026-01-01 21:20:17.96+01
07e77d5e-49b0-48a7-9da2-b7e155e54052	PER-2026-00002	PERMIS	366e67f9-b8ff-4944-bc1b-ae2352dd77ed	COMPANY	SARL Mining Congo	contact@miningcongo.cd	+243 812 345 678	Avenue de l'Investissement, N°89, Kongo Central	CD/KIN/RCCM/24-A-12345	A1234567X	A123456789	Permis de recherche minière	Demande de permis de recherche minière pour le compte de SARL Mining Congo. Cette demande concerne les activités dans le secteur énergie.	Énergie	Nord-Kivu	Bukavu	2574593.00	USD	IN_PROGRESS	3	5	NORMAL	\N	\N	2025-11-02 08:18:50.045+01	2025-11-09 08:18:50.045+01	2025-12-02 08:18:50.045+01	\N	\N	\N	\N	\N	\N	2025-10-31 08:18:50.045+01	2026-01-01 21:20:17.961+01
4158bd43-0254-4aa9-b86b-51689fa8bff6	PER-2026-00003	PERMIS	366e67f9-b8ff-4944-bc1b-ae2352dd77ed	COMPANY	SARL Mining Congo	contact@miningcongo.cd	+243 812 345 678	Avenue de l'Investissement, N°415, Haut-Katanga	CD/KIN/RCCM/24-A-12345	A1234567X	A123456789	Permis sanitaire d'établissement	Demande de permis sanitaire d'établissement pour le compte de SARL Mining Congo. Cette demande concerne les activités dans le secteur agriculture.	Mines	Équateur	Kinshasa	4198026.00	USD	APPROVED	5	5	LOW	\N	\N	2025-11-24 18:01:24.96+01	2025-11-27 18:01:24.96+01	2025-12-24 18:01:24.96+01	2025-12-21 18:01:24.96+01	Dossier conforme aux exigences réglementaires.	\N	\N	\N	\N	2025-11-23 18:01:24.96+01	2026-01-01 21:20:17.964+01
d396e16d-8ace-42b8-aefd-1010c0ced6ab	AUT-2026-00005	AUTORISATION	a05085da-8a12-46d3-ba54-2c7f3c9ff5e3	INDIVIDUAL	Marie Lukusa	mlukusa@outlook.com	+243 991 222 333	Avenue de l'Investissement, N°229, Sud-Kivu	\N	E2222222B	\N	Autorisation de forage de puits	Demande de autorisation de forage de puits pour le compte de Marie Lukusa. Cette demande concerne les activités dans le secteur énergie.	Environnement	Kongo Central	Goma	\N	USD	REJECTED	5	5	URGENT	\N	\N	2025-11-28 16:36:29.431+01	2025-12-02 16:36:29.431+01	2025-12-28 16:36:29.431+01	2025-12-08 16:36:29.431+01	\N	Dossier incomplet ou non conforme aux critères requis.	\N	\N	\N	2025-11-25 16:36:29.431+01	2026-01-01 21:20:17.978+01
e1e2272a-5016-4cc8-9364-cee9d4987708	AUT-2026-00006	AUTORISATION	a05085da-8a12-46d3-ba54-2c7f3c9ff5e3	COMPANY	Tech Solutions Kinshasa	contact@techsol.cd	+243 825 444 555	Avenue de l'Investissement, N°147, Haut-Katanga	CD/KIN/RCCM/24-D-44444	G4444444D	E444444444	Autorisation d'installation de panneaux solaires	Demande de autorisation d'installation de panneaux solaires pour le compte de Tech Solutions Kinshasa. Cette demande concerne les activités dans le secteur agriculture.	Commerce	Haut-Katanga	Goma	1190171.00	USD	UNDER_REVIEW	4	5	LOW	\N	\N	2025-11-05 19:29:09.737+01	2025-11-18 19:29:09.737+01	2025-12-05 19:29:09.737+01	\N	\N	\N	\N	\N	\N	2025-11-02 19:29:09.737+01	2026-01-01 21:20:17.984+01
aa59cea0-442c-4307-b2eb-c28802cf9d23	AUT-2026-00007	AUTORISATION	a05085da-8a12-46d3-ba54-2c7f3c9ff5e3	COMPANY	Tech Solutions Kinshasa	contact@techsol.cd	+243 825 444 555	Avenue de l'Investissement, N°147, Kasaï	CD/KIN/RCCM/24-D-44444	G4444444D	E444444444	Autorisation de transport de marchandises dangereuses	Demande de autorisation de transport de marchandises dangereuses pour le compte de Tech Solutions Kinshasa. Cette demande concerne les activités dans le secteur commerce.	Transport	Sud-Kivu	Kisangani	4286855.00	USD	DRAFT	1	5	NORMAL	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-11-26 23:21:13.499+01	2026-01-01 21:20:17.989+01
f7ef6c7f-f334-421f-ad96-d790d8628444	AUT-2026-00008	AUTORISATION	a05085da-8a12-46d3-ba54-2c7f3c9ff5e3	COMPANY	Cimenterie du Kongo Central	ciment@ckc.cd	+243 816 666 777	Avenue de l'Investissement, N°283, Kongo Central	CD/KOC/RCCM/23-E-55555	I6666666F	F555555555	Autorisation de construction d'une usine	Demande de autorisation de construction d'une usine pour le compte de Cimenterie du Kongo Central. Cette demande concerne les activités dans le secteur énergie.	Transport	Sud-Kivu	Matadi	2078538.00	USD	DRAFT	1	5	URGENT	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-10-11 04:48:21.697+01	2026-01-01 21:20:17.991+01
92e00eff-a619-4964-b698-7b35d153d736	AUT-2026-00009	AUTORISATION	a05085da-8a12-46d3-ba54-2c7f3c9ff5e3	COMPANY	SARL Mining Congo	contact@miningcongo.cd	+243 812 345 678	Avenue de l'Investissement, N°428, Kinshasa	CD/KIN/RCCM/24-A-12345	A1234567X	A123456789	Autorisation de transport de marchandises dangereuses	Demande de autorisation de transport de marchandises dangereuses pour le compte de SARL Mining Congo. Cette demande concerne les activités dans le secteur énergie.	Agriculture	Kasaï	Kinshasa	1886660.00	USD	UNDER_REVIEW	2	5	LOW	\N	\N	2025-11-07 14:36:02.089+01	2025-11-11 14:36:02.089+01	2025-12-07 14:36:02.089+01	\N	\N	\N	\N	\N	\N	2025-11-06 14:36:02.089+01	2026-01-01 21:20:17.993+01
0cd1c471-7599-4b6c-b0fe-222e1b3910d3	AUT-2026-00010	AUTORISATION	a05085da-8a12-46d3-ba54-2c7f3c9ff5e3	COMPANY	Import Export Lubumbashi	ielub@business.cd	+243 827 777 888	Avenue de l'Investissement, N°143, Ituri	CD/LUB/RCCM/24-F-66666	J7777777G	G666666666	Autorisation d'importation de matériel industriel	Demande de autorisation d'importation de matériel industriel pour le compte de Import Export Lubumbashi. Cette demande concerne les activités dans le secteur santé.	Santé	Kasaï	Matadi	4328473.00	USD	APPROVED	5	5	HIGH	\N	\N	2025-12-20 13:53:20.501+01	2025-12-27 13:53:20.501+01	2026-01-19 13:53:20.501+01	2026-01-03 13:53:20.501+01	Dossier conforme aux exigences réglementaires.	\N	\N	\N	\N	2025-12-18 13:53:20.501+01	2026-01-01 21:20:17.996+01
cbdf29af-534b-439e-8b00-357f3916dba8	AUT-2026-00012	AUTORISATION	a05085da-8a12-46d3-ba54-2c7f3c9ff5e3	INDIVIDUAL	Pierre Mbuyi	pmbuyi@gmail.com	+243 992 555 666	Avenue de l'Investissement, N°240, Kinshasa	\N	H5555555E	\N	Autorisation d'importation de matériel industriel	Demande de autorisation d'importation de matériel industriel pour le compte de Pierre Mbuyi. Cette demande concerne les activités dans le secteur énergie.	Transport	Nord-Kivu	Mbuji-Mayi	\N	USD	UNDER_REVIEW	4	5	URGENT	\N	\N	2025-10-09 01:43:36.785+01	2025-10-14 01:43:36.785+01	2025-11-08 01:43:36.785+01	\N	\N	\N	\N	\N	\N	2025-10-06 01:43:36.785+01	2026-01-01 21:20:18.006+01
002e5681-2080-4042-a0b4-ddd842a9555d	LIC-2026-00008	LICENCE	a05085da-8a12-46d3-ba54-2c7f3c9ff5e3	COMPANY	Cimenterie du Kongo Central	ciment@ckc.cd	+243 816 666 777	Avenue de l'Investissement, N°152, Kasaï	CD/KOC/RCCM/23-E-55555	I6666666F	F555555555	Licence de production pharmaceutique	Demande de licence de production pharmaceutique pour le compte de Cimenterie du Kongo Central. Cette demande concerne les activités dans le secteur transport.	Santé	Kongo Central	Kisangani	3502204.00	USD	IN_PROGRESS	2	5	URGENT	\N	\N	2025-11-06 16:40:41.458+01	2025-11-13 16:40:41.458+01	2025-12-06 16:40:41.458+01	\N	\N	\N	\N	\N	\N	2025-11-04 16:40:41.458+01	2026-01-01 21:20:18.009+01
61ca34b3-b514-4df7-a659-6ba324e64d95	LIC-2026-00009	LICENCE	a05085da-8a12-46d3-ba54-2c7f3c9ff5e3	COMPANY	SARL Mining Congo	contact@miningcongo.cd	+243 812 345 678	Avenue de l'Investissement, N°452, Équateur	CD/KIN/RCCM/24-A-12345	A1234567X	A123456789	Licence de production agroalimentaire	Demande de licence de production agroalimentaire pour le compte de SARL Mining Congo. Cette demande concerne les activités dans le secteur énergie.	Énergie	Haut-Katanga	Lubumbashi	1958547.00	USD	SUBMITTED	1	5	HIGH	\N	\N	2025-11-28 19:27:56.343+01	2025-12-04 19:27:56.343+01	2025-12-28 19:27:56.343+01	\N	\N	\N	\N	\N	\N	2025-11-27 19:27:56.343+01	2026-01-01 21:20:18.011+01
f6ec0712-d7d9-4598-9f4a-66e82e5353ed	LIC-2026-00010	LICENCE	a05085da-8a12-46d3-ba54-2c7f3c9ff5e3	INDIVIDUAL	Marie Lukusa	mlukusa@outlook.com	+243 991 222 333	Avenue de l'Investissement, N°143, Kasaï	\N	E2222222B	\N	Licence de télécommunications	Demande de licence de télécommunications pour le compte de Marie Lukusa. Cette demande concerne les activités dans le secteur santé.	Environnement	Nord-Kivu	Mbuji-Mayi	\N	USD	DRAFT	1	5	URGENT	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-12-12 04:05:42.428+01	2026-01-01 21:20:18.013+01
53ea495b-79c2-45ea-b99f-78113848d6be	LIC-2026-00011	LICENCE	a05085da-8a12-46d3-ba54-2c7f3c9ff5e3	COMPANY	Entreprise Agricole du Kasai	agrikasai@yahoo.fr	+243 820 111 222	Avenue de l'Investissement, N°84, Sud-Kivu	CD/KAS/RCCM/23-A-11111	D1111111A	C111111111	Licence d'importation de produits pétroliers	Demande de licence d'importation de produits pétroliers pour le compte de Entreprise Agricole du Kasai. Cette demande concerne les activités dans le secteur commerce.	Commerce	Équateur	Matadi	2686059.00	USD	UNDER_REVIEW	2	5	NORMAL	\N	\N	2025-10-24 12:58:39.014+01	2025-11-06 12:58:39.014+01	2025-11-23 12:58:39.014+01	\N	\N	\N	\N	\N	\N	2025-10-21 12:58:39.014+01	2026-01-01 21:20:18.014+01
47b20e6d-c7e9-4c4a-9605-b7e2b399c095	LIC-2026-00012	LICENCE	a05085da-8a12-46d3-ba54-2c7f3c9ff5e3	COMPANY	Société Forestière du Congo	sfc@sfcongo.cd	+243 818 333 444	Avenue de l'Investissement, N°161, Nord-Kivu	CD/EQU/RCCM/24-C-33333	F3333333C	D333333333	Licence de transport public	Demande de licence de transport public pour le compte de Société Forestière du Congo. Cette demande concerne les activités dans le secteur santé.	Commerce	Kinshasa	Kinshasa	1539523.00	USD	IN_PROGRESS	2	5	HIGH	\N	\N	2025-12-12 04:11:22.511+01	2025-12-13 04:11:22.511+01	2026-01-11 04:11:22.511+01	\N	\N	\N	\N	\N	\N	2025-12-10 04:11:22.511+01	2026-01-01 21:20:18.016+01
deeb7db1-8d7c-4646-8e66-8cd2dd396eb0	LIC-2026-00013	LICENCE	a05085da-8a12-46d3-ba54-2c7f3c9ff5e3	INDIVIDUAL	Marie Lukusa	mlukusa@outlook.com	+243 991 222 333	Avenue de l'Investissement, N°133, Nord-Kivu	\N	E2222222B	\N	Licence de production agroalimentaire	Demande de licence de production agroalimentaire pour le compte de Marie Lukusa. Cette demande concerne les activités dans le secteur environnement.	Énergie	Nord-Kivu	Kananga	\N	USD	REJECTED	5	5	NORMAL	\N	\N	2025-12-23 10:18:04.297+01	2026-01-06 10:18:04.297+01	2026-01-22 10:18:04.297+01	2026-01-02 10:18:04.297+01	\N	Dossier incomplet ou non conforme aux critères requis.	\N	\N	\N	2025-12-20 10:18:04.297+01	2026-01-01 21:20:18.018+01
71c232c5-e667-4fce-b725-24ea9194b974	LIC-2026-00014	LICENCE	a05085da-8a12-46d3-ba54-2c7f3c9ff5e3	COMPANY	Cimenterie du Kongo Central	ciment@ckc.cd	+243 816 666 777	Avenue de l'Investissement, N°429, Équateur	CD/KOC/RCCM/23-E-55555	I6666666F	F555555555	Licence de production pharmaceutique	Demande de licence de production pharmaceutique pour le compte de Cimenterie du Kongo Central. Cette demande concerne les activités dans le secteur industrie.	Mines	Nord-Kivu	Lubumbashi	3425226.00	USD	IN_PROGRESS	3	5	URGENT	\N	\N	2025-11-05 02:18:06.58+01	2025-11-11 02:18:06.58+01	2025-12-05 02:18:06.58+01	\N	\N	\N	\N	\N	\N	2025-11-02 02:18:06.58+01	2026-01-01 21:20:18.023+01
b128168b-b500-4090-bff8-ce9e55b92a78	PER-2026-00004	PERMIS	a05085da-8a12-46d3-ba54-2c7f3c9ff5e3	INVESTOR	Global Invest RDC	info@globalinvest.cd	+243 815 555 999	Avenue de l'Investissement, N°178, Ituri	CD/KIN/RCCM/24-B-54321	C5432167Z	B987654321	Permis d'exploitation de débit de boissons	Demande de permis d'exploitation de débit de boissons pour le compte de Global Invest RDC. Cette demande concerne les activités dans le secteur mines.	Énergie	Kongo Central	Lubumbashi	3887001.00	USD	UNDER_REVIEW	3	5	LOW	\N	\N	2025-12-04 19:30:44.917+01	2025-12-14 19:30:44.917+01	2026-01-03 19:30:44.917+01	\N	\N	\N	\N	\N	\N	2025-12-02 19:30:44.917+01	2026-01-01 21:20:18.027+01
27f7148e-f429-45be-a422-22a971ec9788	PER-2026-00005	PERMIS	a05085da-8a12-46d3-ba54-2c7f3c9ff5e3	COMPANY	Entreprise Agricole du Kasai	agrikasai@yahoo.fr	+243 820 111 222	Avenue de l'Investissement, N°301, Kasaï	CD/KAS/RCCM/23-A-11111	D1111111A	C111111111	Permis de recherche minière	Demande de permis de recherche minière pour le compte de Entreprise Agricole du Kasai. Cette demande concerne les activités dans le secteur agriculture.	Environnement	Kinshasa	Matadi	2101816.00	USD	PENDING_DOCUMENTS	2	5	HIGH	\N	\N	2025-11-20 18:16:18.071+01	2025-11-29 18:16:18.071+01	2025-12-20 18:16:18.071+01	\N	\N	\N	\N	\N	\N	2025-11-19 18:16:18.071+01	2026-01-01 21:20:18.029+01
aeb20734-0c42-45d0-8187-92aa74299df5	PER-2026-00006	PERMIS	a05085da-8a12-46d3-ba54-2c7f3c9ff5e3	INDIVIDUAL	Jean-Pierre Kabongo	jpkabongo@gmail.com	+243 998 765 432	Avenue de l'Investissement, N°434, Kasaï	\N	B9876543Y	\N	Permis de recherche minière	Demande de permis de recherche minière pour le compte de Jean-Pierre Kabongo. Cette demande concerne les activités dans le secteur santé.	Industrie	Kinshasa	Lubumbashi	\N	USD	IN_PROGRESS	3	5	URGENT	\N	\N	2025-12-14 03:46:01.467+01	2025-12-18 03:46:01.467+01	2026-01-13 03:46:01.467+01	\N	\N	\N	\N	\N	\N	2025-12-13 03:46:01.467+01	2026-01-01 21:20:18.032+01
47b49033-16d5-4708-b051-35732e906181	PER-2026-00007	PERMIS	a05085da-8a12-46d3-ba54-2c7f3c9ff5e3	COMPANY	Entreprise Agricole du Kasai	agrikasai@yahoo.fr	+243 820 111 222	Avenue de l'Investissement, N°129, Équateur	CD/KAS/RCCM/23-A-11111	D1111111A	C111111111	Permis de construire - Bâtiment industriel	Demande de permis de construire - bâtiment industriel pour le compte de Entreprise Agricole du Kasai. Cette demande concerne les activités dans le secteur industrie.	Transport	Haut-Katanga	Lubumbashi	974541.00	USD	APPROVED	5	5	NORMAL	\N	\N	2025-12-12 21:29:06.225+01	2025-12-13 21:29:06.225+01	2026-01-11 21:29:06.225+01	2025-12-27 21:29:06.225+01	Dossier conforme aux exigences réglementaires.	\N	\N	\N	\N	2025-12-09 21:29:06.225+01	2026-01-01 21:20:18.034+01
43989d64-001b-497a-9585-dca4d6449ad8	PER-2026-00008	PERMIS	a05085da-8a12-46d3-ba54-2c7f3c9ff5e3	COMPANY	Cimenterie du Kongo Central	ciment@ckc.cd	+243 816 666 777	Avenue de l'Investissement, N°422, Nord-Kivu	CD/KOC/RCCM/23-E-55555	I6666666F	F555555555	Permis de construire - Bâtiment industriel	Demande de permis de construire - bâtiment industriel pour le compte de Cimenterie du Kongo Central. Cette demande concerne les activités dans le secteur énergie.	Environnement	Ituri	Bukavu	2312383.00	USD	DRAFT	1	5	HIGH	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-12-08 12:04:27.37+01	2026-01-01 21:20:18.038+01
da99127a-c341-4c03-9087-a0229cb3471b	PER-2026-00009	PERMIS	a05085da-8a12-46d3-ba54-2c7f3c9ff5e3	COMPANY	Entreprise Agricole du Kasai	agrikasai@yahoo.fr	+243 820 111 222	Avenue de l'Investissement, N°397, Haut-Katanga	CD/KAS/RCCM/23-A-11111	D1111111A	C111111111	Permis de circulation spéciale	Demande de permis de circulation spéciale pour le compte de Entreprise Agricole du Kasai. Cette demande concerne les activités dans le secteur industrie.	Énergie	Nord-Kivu	Mbuji-Mayi	2418087.00	USD	DRAFT	1	5	URGENT	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-12-15 08:25:48.531+01	2026-01-01 21:20:18.04+01
8076c693-8632-4eec-b589-178be6ea252b	PER-2026-00010	PERMIS	a05085da-8a12-46d3-ba54-2c7f3c9ff5e3	COMPANY	Entreprise Agricole du Kasai	agrikasai@yahoo.fr	+243 820 111 222	Avenue de l'Investissement, N°440, Kongo Central	CD/KAS/RCCM/23-A-11111	D1111111A	C111111111	Permis de recherche minière	Demande de permis de recherche minière pour le compte de Entreprise Agricole du Kasai. Cette demande concerne les activités dans le secteur commerce.	Agriculture	Kasaï	Goma	2145899.00	USD	SUBMITTED	1	5	URGENT	\N	\N	2025-11-09 05:22:18.401+01	2025-11-14 05:22:18.401+01	2025-12-09 05:22:18.401+01	\N	\N	\N	\N	\N	\N	2025-11-08 05:22:18.401+01	2026-01-01 21:20:18.041+01
7c19e771-feb5-473f-8dc8-c3f6d6f5d0fc	AUT-2026-00013	AUTORISATION	abe2ef02-9479-40ef-9b64-04b2d851df11	COMPANY	SARL Mining Congo	contact@miningcongo.cd	+243 812 345 678	Avenue de l'Investissement, N°262, Kasaï	CD/KIN/RCCM/24-A-12345	A1234567X	A123456789	Autorisation d'installation de panneaux solaires	Demande de autorisation d'installation de panneaux solaires pour le compte de SARL Mining Congo. Cette demande concerne les activités dans le secteur environnement.	Environnement	Kongo Central	Goma	3410625.00	USD	APPROVED	5	5	HIGH	\N	\N	2025-10-13 11:42:49.759+01	2025-10-16 11:42:49.759+01	2025-11-12 11:42:49.759+01	2025-11-04 11:42:49.759+01	Dossier conforme aux exigences réglementaires.	\N	\N	\N	\N	2025-10-10 11:42:49.759+01	2026-01-01 21:20:18.052+01
5611c155-4bf5-4faf-a294-d9c45cf9bd27	AUT-2026-00014	AUTORISATION	abe2ef02-9479-40ef-9b64-04b2d851df11	INDIVIDUAL	Pierre Mbuyi	pmbuyi@gmail.com	+243 992 555 666	Avenue de l'Investissement, N°220, Kasaï	\N	H5555555E	\N	Autorisation d'exploitation agricole	Demande de autorisation d'exploitation agricole pour le compte de Pierre Mbuyi. Cette demande concerne les activités dans le secteur transport.	Transport	Kinshasa	Kisangani	\N	USD	SUBMITTED	1	5	LOW	\N	\N	2025-12-20 15:52:12.251+01	2025-12-29 15:52:12.251+01	2026-01-19 15:52:12.251+01	\N	\N	\N	\N	\N	\N	2025-12-19 15:52:12.251+01	2026-01-01 21:20:18.057+01
11d2e8e4-de43-4f07-9098-d5bcaa216b37	AUT-2026-00015	AUTORISATION	abe2ef02-9479-40ef-9b64-04b2d851df11	COMPANY	SARL Mining Congo	contact@miningcongo.cd	+243 812 345 678	Avenue de l'Investissement, N°144, Haut-Katanga	CD/KIN/RCCM/24-A-12345	A1234567X	A123456789	Autorisation d'exploitation minière artisanale	Demande de autorisation d'exploitation minière artisanale pour le compte de SARL Mining Congo. Cette demande concerne les activités dans le secteur mines.	Commerce	Kongo Central	Matadi	4804422.00	USD	DRAFT	1	5	URGENT	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-11-03 19:31:57.064+01	2026-01-01 21:20:18.058+01
be45f809-5a24-4e86-99a2-f2b1bc0e4a8a	AUT-2026-00016	AUTORISATION	abe2ef02-9479-40ef-9b64-04b2d851df11	INDIVIDUAL	Pierre Mbuyi	pmbuyi@gmail.com	+243 992 555 666	Avenue de l'Investissement, N°479, Sud-Kivu	\N	H5555555E	\N	Autorisation d'exercice d'activité commerciale	Demande de autorisation d'exercice d'activité commerciale pour le compte de Pierre Mbuyi. Cette demande concerne les activités dans le secteur mines.	Transport	Kinshasa	Kananga	\N	USD	REJECTED	5	5	LOW	\N	\N	2025-12-18 03:05:10.968+01	2025-12-29 03:05:10.968+01	2026-01-17 03:05:10.968+01	2025-12-26 03:05:10.968+01	\N	Dossier incomplet ou non conforme aux critères requis.	\N	\N	\N	2025-12-15 03:05:10.968+01	2026-01-01 21:20:18.059+01
b18f94b7-efad-4350-b504-368dcfe88737	AUT-2026-00017	AUTORISATION	abe2ef02-9479-40ef-9b64-04b2d851df11	COMPANY	SARL Mining Congo	contact@miningcongo.cd	+243 812 345 678	Avenue de l'Investissement, N°39, Sud-Kivu	CD/KIN/RCCM/24-A-12345	A1234567X	A123456789	Autorisation d'installation de panneaux solaires	Demande de autorisation d'installation de panneaux solaires pour le compte de SARL Mining Congo. Cette demande concerne les activités dans le secteur environnement.	Industrie	Sud-Kivu	Bukavu	1565542.00	USD	REJECTED	5	5	NORMAL	\N	\N	2025-12-23 03:32:55.339+01	2026-01-05 03:32:55.339+01	2026-01-22 03:32:55.339+01	2026-01-20 03:32:55.339+01	\N	Dossier incomplet ou non conforme aux critères requis.	\N	\N	\N	2025-12-20 03:32:55.339+01	2026-01-01 21:20:18.063+01
9a81068e-50c2-4aeb-b078-9a510cd6ae0f	AUT-2026-00018	AUTORISATION	abe2ef02-9479-40ef-9b64-04b2d851df11	INDIVIDUAL	Pierre Mbuyi	pmbuyi@gmail.com	+243 992 555 666	Avenue de l'Investissement, N°144, Haut-Katanga	\N	H5555555E	\N	Autorisation de construction d'une usine	Demande de autorisation de construction d'une usine pour le compte de Pierre Mbuyi. Cette demande concerne les activités dans le secteur santé.	Mines	Kinshasa	Kinshasa	\N	USD	APPROVED	5	5	HIGH	\N	\N	2025-11-05 09:10:58.842+01	2025-11-08 09:10:58.842+01	2025-12-05 09:10:58.842+01	2025-11-21 09:10:58.842+01	Dossier conforme aux exigences réglementaires.	\N	\N	\N	\N	2025-11-02 09:10:58.842+01	2026-01-01 21:20:18.067+01
bdf51b56-ca91-4371-99cf-c5d571da853f	AUT-2026-00019	AUTORISATION	abe2ef02-9479-40ef-9b64-04b2d851df11	INDIVIDUAL	Marie Lukusa	mlukusa@outlook.com	+243 991 222 333	Avenue de l'Investissement, N°206, Kasaï	\N	E2222222B	\N	Autorisation de forage de puits	Demande de autorisation de forage de puits pour le compte de Marie Lukusa. Cette demande concerne les activités dans le secteur agriculture.	Commerce	Sud-Kivu	Mbuji-Mayi	\N	USD	REJECTED	5	5	URGENT	\N	\N	2025-10-10 16:30:08.743+01	2025-10-19 16:30:08.743+01	2025-11-09 16:30:08.743+01	2025-10-27 16:30:08.743+01	\N	Dossier incomplet ou non conforme aux critères requis.	\N	\N	\N	2025-10-07 16:30:08.743+01	2026-01-01 21:20:18.07+01
c6a65468-ca30-4a67-b9da-958bd35df104	AUT-2026-00020	AUTORISATION	abe2ef02-9479-40ef-9b64-04b2d851df11	INDIVIDUAL	Marie Lukusa	mlukusa@outlook.com	+243 991 222 333	Avenue de l'Investissement, N°21, Équateur	\N	E2222222B	\N	Autorisation d'exploitation agricole	Demande de autorisation d'exploitation agricole pour le compte de Marie Lukusa. Cette demande concerne les activités dans le secteur mines.	Agriculture	Nord-Kivu	Goma	\N	USD	DRAFT	1	5	HIGH	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-11-13 10:25:03.26+01	2026-01-01 21:20:18.074+01
e4631647-256d-4c18-bb65-ec8f7471ec4b	LIC-2026-00015	LICENCE	abe2ef02-9479-40ef-9b64-04b2d851df11	INVESTOR	Global Invest RDC	info@globalinvest.cd	+243 815 555 999	Avenue de l'Investissement, N°275, Ituri	CD/KIN/RCCM/24-B-54321	C5432167Z	B987654321	Licence de pêche industrielle	Demande de licence de pêche industrielle pour le compte de Global Invest RDC. Cette demande concerne les activités dans le secteur santé.	Transport	Sud-Kivu	Kananga	2019594.00	USD	UNDER_REVIEW	3	5	URGENT	\N	\N	2025-10-24 15:56:36.34+01	2025-11-03 15:56:36.34+01	2025-11-23 15:56:36.34+01	\N	\N	\N	\N	\N	\N	2025-10-21 15:56:36.34+01	2026-01-01 21:20:18.075+01
85618671-bdd1-42ea-9b9d-54f225fdad3c	LIC-2026-00016	LICENCE	abe2ef02-9479-40ef-9b64-04b2d851df11	INDIVIDUAL	Marie Lukusa	mlukusa@outlook.com	+243 991 222 333	Avenue de l'Investissement, N°375, Kinshasa	\N	E2222222B	\N	Licence de transport public	Demande de licence de transport public pour le compte de Marie Lukusa. Cette demande concerne les activités dans le secteur mines.	Santé	Équateur	Matadi	\N	USD	UNDER_REVIEW	3	5	NORMAL	\N	\N	2025-11-02 03:55:52.168+01	2025-11-03 03:55:52.168+01	2025-12-02 03:55:52.168+01	\N	\N	\N	\N	\N	\N	2025-11-01 03:55:52.168+01	2026-01-01 21:20:18.077+01
7530c5dc-960e-4278-bd1d-3bf7ab0ea792	LIC-2026-00017	LICENCE	abe2ef02-9479-40ef-9b64-04b2d851df11	COMPANY	Cimenterie du Kongo Central	ciment@ckc.cd	+243 816 666 777	Avenue de l'Investissement, N°431, Sud-Kivu	CD/KOC/RCCM/23-E-55555	I6666666F	F555555555	Licence d'exploitation forestière	Demande de licence d'exploitation forestière pour le compte de Cimenterie du Kongo Central. Cette demande concerne les activités dans le secteur industrie.	Commerce	Haut-Katanga	Kisangani	1714554.00	USD	UNDER_REVIEW	4	5	LOW	\N	\N	2025-10-31 01:05:37.145+01	2025-11-14 01:05:37.145+01	2025-11-30 01:05:37.145+01	\N	\N	\N	\N	\N	\N	2025-10-28 01:05:37.145+01	2026-01-01 21:20:18.08+01
44210d5b-23f6-42f9-8252-aa785b3202e5	PER-2026-00011	PERMIS	abe2ef02-9479-40ef-9b64-04b2d851df11	COMPANY	Tech Solutions Kinshasa	contact@techsol.cd	+243 825 444 555	Avenue de l'Investissement, N°146, Sud-Kivu	CD/KIN/RCCM/24-D-44444	G4444444D	E444444444	Permis de travail pour expatriés	Demande de permis de travail pour expatriés pour le compte de Tech Solutions Kinshasa. Cette demande concerne les activités dans le secteur mines.	Environnement	Haut-Katanga	Kisangani	3291552.00	USD	PENDING_DOCUMENTS	1	5	LOW	\N	\N	2025-12-26 16:50:53.358+01	2026-01-05 16:50:53.358+01	2026-01-25 16:50:53.358+01	\N	\N	\N	\N	\N	\N	2025-12-23 16:50:53.358+01	2026-01-01 21:20:18.082+01
d0412c98-63f1-49be-a0c9-694e81184c1b	PER-2026-00012	PERMIS	abe2ef02-9479-40ef-9b64-04b2d851df11	INDIVIDUAL	Pierre Mbuyi	pmbuyi@gmail.com	+243 992 555 666	Avenue de l'Investissement, N°446, Ituri	\N	H5555555E	\N	Permis environnemental - Étude d'impact	Demande de permis environnemental - étude d'impact pour le compte de Pierre Mbuyi. Cette demande concerne les activités dans le secteur transport.	Agriculture	Ituri	Bukavu	\N	USD	IN_PROGRESS	2	5	URGENT	\N	\N	2025-11-01 08:15:06.522+01	2025-11-06 08:15:06.522+01	2025-12-01 08:15:06.522+01	\N	\N	\N	\N	\N	\N	2025-10-29 08:15:06.522+01	2026-01-01 21:20:18.084+01
9d209545-962c-4ba7-9780-a2ed3961a11a	PER-2026-00013	PERMIS	abe2ef02-9479-40ef-9b64-04b2d851df11	COMPANY	Import Export Lubumbashi	ielub@business.cd	+243 827 777 888	Avenue de l'Investissement, N°203, Kasaï	CD/LUB/RCCM/24-F-66666	J7777777G	G666666666	Permis de travail pour expatriés	Demande de permis de travail pour expatriés pour le compte de Import Export Lubumbashi. Cette demande concerne les activités dans le secteur environnement.	Commerce	Nord-Kivu	Lubumbashi	1535881.00	USD	UNDER_REVIEW	3	5	HIGH	\N	\N	2025-12-18 14:40:29.195+01	2025-12-28 14:40:29.195+01	2026-01-17 14:40:29.195+01	\N	\N	\N	\N	\N	\N	2025-12-15 14:40:29.195+01	2026-01-01 21:20:18.086+01
77951687-bc5d-47c3-a528-5ed0a9371547	PER-2026-00014	PERMIS	abe2ef02-9479-40ef-9b64-04b2d851df11	INDIVIDUAL	Jean-Pierre Kabongo	jpkabongo@gmail.com	+243 998 765 432	Avenue de l'Investissement, N°20, Équateur	\N	B9876543Y	\N	Permis sanitaire d'établissement	Demande de permis sanitaire d'établissement pour le compte de Jean-Pierre Kabongo. Cette demande concerne les activités dans le secteur industrie.	Commerce	Kasaï	Kananga	\N	USD	UNDER_REVIEW	3	5	LOW	\N	\N	2025-11-06 21:47:33.478+01	2025-11-09 21:47:33.478+01	2025-12-06 21:47:33.478+01	\N	\N	\N	\N	\N	\N	2025-11-04 21:47:33.478+01	2026-01-01 21:20:18.088+01
bf635884-acb7-49dc-8fa5-2ad0978487db	PER-2026-00015	PERMIS	abe2ef02-9479-40ef-9b64-04b2d851df11	COMPANY	Import Export Lubumbashi	ielub@business.cd	+243 827 777 888	Avenue de l'Investissement, N°383, Nord-Kivu	CD/LUB/RCCM/24-F-66666	J7777777G	G666666666	Permis de séjour prolongé	Demande de permis de séjour prolongé pour le compte de Import Export Lubumbashi. Cette demande concerne les activités dans le secteur transport.	Commerce	Haut-Katanga	Bukavu	841648.00	USD	UNDER_REVIEW	3	5	HIGH	\N	\N	2025-12-16 21:55:48.642+01	2025-12-19 21:55:48.642+01	2026-01-15 21:55:48.642+01	\N	\N	\N	\N	\N	\N	2025-12-14 21:55:48.642+01	2026-01-01 21:20:18.09+01
b182dbd5-226d-4d68-8bbe-e01446b6f4f9	PER-2026-00016	PERMIS	abe2ef02-9479-40ef-9b64-04b2d851df11	COMPANY	SARL Mining Congo	contact@miningcongo.cd	+243 812 345 678	Avenue de l'Investissement, N°211, Kongo Central	CD/KIN/RCCM/24-A-12345	A1234567X	A123456789	Permis d'exploitation de débit de boissons	Demande de permis d'exploitation de débit de boissons pour le compte de SARL Mining Congo. Cette demande concerne les activités dans le secteur mines.	Industrie	Kinshasa	Mbuji-Mayi	943108.00	USD	DRAFT	1	5	LOW	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-10-04 02:51:44.676+01	2026-01-01 21:20:18.092+01
d9308556-ffe7-46ab-9154-474a7b3e8bd4	PER-2026-00017	PERMIS	abe2ef02-9479-40ef-9b64-04b2d851df11	INDIVIDUAL	Jean-Pierre Kabongo	jpkabongo@gmail.com	+243 998 765 432	Avenue de l'Investissement, N°316, Kasaï	\N	B9876543Y	\N	Permis de circulation spéciale	Demande de permis de circulation spéciale pour le compte de Jean-Pierre Kabongo. Cette demande concerne les activités dans le secteur agriculture.	Agriculture	Ituri	Goma	\N	USD	REJECTED	5	5	NORMAL	\N	\N	2025-12-22 02:40:24.772+01	2025-12-28 02:40:24.772+01	2026-01-21 02:40:24.772+01	2026-01-15 02:40:24.772+01	\N	Dossier incomplet ou non conforme aux critères requis.	\N	\N	\N	2025-12-21 02:40:24.772+01	2026-01-01 21:20:18.095+01
bfc0adee-2d8e-456e-b9c6-4aa148394121	PER-2026-00018	PERMIS	abe2ef02-9479-40ef-9b64-04b2d851df11	INDIVIDUAL	Jean-Pierre Kabongo	jpkabongo@gmail.com	+243 998 765 432	Avenue de l'Investissement, N°211, Ituri	\N	B9876543Y	\N	Permis de recherche minière	Demande de permis de recherche minière pour le compte de Jean-Pierre Kabongo. Cette demande concerne les activités dans le secteur transport.	Transport	Sud-Kivu	Kisangani	\N	USD	REJECTED	5	5	URGENT	\N	\N	2025-12-18 05:41:56.1+01	2025-12-24 05:41:56.1+01	2026-01-17 05:41:56.1+01	2026-01-11 05:41:56.1+01	\N	Dossier incomplet ou non conforme aux critères requis.	\N	\N	\N	2025-12-15 05:41:56.1+01	2026-01-01 21:20:18.099+01
683b74f5-f461-4e50-bf97-abcdf860f540	AUT-2026-00021	AUTORISATION	d31c0252-90de-4fae-8fb9-f001f0a6591e	COMPANY	Import Export Lubumbashi	ielub@business.cd	+243 827 777 888	Avenue de l'Investissement, N°84, Kasaï	CD/LUB/RCCM/24-F-66666	J7777777G	G666666666	Autorisation de construction d'une usine	Demande de autorisation de construction d'une usine pour le compte de Import Export Lubumbashi. Cette demande concerne les activités dans le secteur industrie.	Industrie	Haut-Katanga	Kinshasa	439644.00	USD	IN_PROGRESS	2	5	URGENT	\N	\N	2025-10-10 01:51:45.799+01	2025-10-17 01:51:45.799+01	2025-11-09 01:51:45.799+01	\N	\N	\N	\N	\N	\N	2025-10-07 01:51:45.799+01	2026-01-01 21:20:18.11+01
cda74341-aa17-43db-b7e6-c4e1934b1172	AUT-2026-00022	AUTORISATION	d31c0252-90de-4fae-8fb9-f001f0a6591e	COMPANY	Cimenterie du Kongo Central	ciment@ckc.cd	+243 816 666 777	Avenue de l'Investissement, N°275, Kinshasa	CD/KOC/RCCM/23-E-55555	I6666666F	F555555555	Autorisation de construction d'une usine	Demande de autorisation de construction d'une usine pour le compte de Cimenterie du Kongo Central. Cette demande concerne les activités dans le secteur agriculture.	Agriculture	Ituri	Mbuji-Mayi	1663226.00	USD	REJECTED	5	5	HIGH	\N	\N	2025-11-07 05:08:56.919+01	2025-11-15 05:08:56.919+01	2025-12-07 05:08:56.919+01	2025-11-20 05:08:56.919+01	\N	Dossier incomplet ou non conforme aux critères requis.	\N	\N	\N	2025-11-04 05:08:56.919+01	2026-01-01 21:20:18.112+01
74b10167-efe3-4cca-aabe-4dcca9e0a3a1	AUT-2026-00023	AUTORISATION	d31c0252-90de-4fae-8fb9-f001f0a6591e	COMPANY	SARL Mining Congo	contact@miningcongo.cd	+243 812 345 678	Avenue de l'Investissement, N°333, Nord-Kivu	CD/KIN/RCCM/24-A-12345	A1234567X	A123456789	Autorisation d'exploitation minière artisanale	Demande de autorisation d'exploitation minière artisanale pour le compte de SARL Mining Congo. Cette demande concerne les activités dans le secteur transport.	Commerce	Haut-Katanga	Kananga	1891431.00	USD	IN_PROGRESS	4	5	NORMAL	\N	\N	2025-11-25 11:21:25.668+01	2025-11-26 11:21:25.668+01	2025-12-25 11:21:25.668+01	\N	\N	\N	\N	\N	\N	2025-11-24 11:21:25.668+01	2026-01-01 21:20:18.116+01
341d818e-571e-4a03-9dd1-1a9aae176f35	AUT-2026-00024	AUTORISATION	d31c0252-90de-4fae-8fb9-f001f0a6591e	INDIVIDUAL	Jean-Pierre Kabongo	jpkabongo@gmail.com	+243 998 765 432	Avenue de l'Investissement, N°32, Kongo Central	\N	B9876543Y	\N	Autorisation de forage de puits	Demande de autorisation de forage de puits pour le compte de Jean-Pierre Kabongo. Cette demande concerne les activités dans le secteur industrie.	Environnement	Kongo Central	Kananga	\N	USD	UNDER_REVIEW	4	5	HIGH	\N	\N	2025-10-20 08:38:46.372+01	2025-10-23 08:38:46.372+01	2025-11-19 08:38:46.372+01	\N	\N	\N	\N	\N	\N	2025-10-18 08:38:46.372+01	2026-01-01 21:20:18.118+01
78430b73-71a5-4e59-bd6c-a01f6e51d68b	LIC-2026-00018	LICENCE	d31c0252-90de-4fae-8fb9-f001f0a6591e	COMPANY	Entreprise Agricole du Kasai	agrikasai@yahoo.fr	+243 820 111 222	Avenue de l'Investissement, N°214, Sud-Kivu	CD/KAS/RCCM/23-A-11111	D1111111A	C111111111	Licence de production pharmaceutique	Demande de licence de production pharmaceutique pour le compte de Entreprise Agricole du Kasai. Cette demande concerne les activités dans le secteur mines.	Santé	Kasaï	Kinshasa	26156.00	USD	IN_PROGRESS	4	5	LOW	\N	\N	2025-12-25 05:20:46.789+01	2025-12-29 05:20:46.789+01	2026-01-24 05:20:46.789+01	\N	\N	\N	\N	\N	\N	2025-12-23 05:20:46.789+01	2026-01-01 21:20:18.121+01
65107432-1e5f-459f-814d-49b2b851a4a9	LIC-2026-00019	LICENCE	d31c0252-90de-4fae-8fb9-f001f0a6591e	INDIVIDUAL	Marie Lukusa	mlukusa@outlook.com	+243 991 222 333	Avenue de l'Investissement, N°471, Nord-Kivu	\N	E2222222B	\N	Licence de production pharmaceutique	Demande de licence de production pharmaceutique pour le compte de Marie Lukusa. Cette demande concerne les activités dans le secteur énergie.	Agriculture	Kasaï	Bukavu	\N	USD	PENDING_DOCUMENTS	3	5	HIGH	\N	\N	2025-10-21 11:35:00.744+01	2025-10-25 11:35:00.744+01	2025-11-20 11:35:00.744+01	\N	\N	\N	\N	\N	\N	2025-10-19 11:35:00.744+01	2026-01-01 21:20:18.124+01
bfa29bc3-5295-404f-a7dc-547b951d654a	LIC-2026-00020	LICENCE	d31c0252-90de-4fae-8fb9-f001f0a6591e	COMPANY	SARL Mining Congo	contact@miningcongo.cd	+243 812 345 678	Avenue de l'Investissement, N°455, Nord-Kivu	CD/KIN/RCCM/24-A-12345	A1234567X	A123456789	Licence d'exploitation de carrière	Demande de licence d'exploitation de carrière pour le compte de SARL Mining Congo. Cette demande concerne les activités dans le secteur environnement.	Énergie	Sud-Kivu	Kinshasa	314385.00	USD	PENDING_DOCUMENTS	1	5	URGENT	\N	\N	2025-12-29 10:30:54.211+01	2026-01-01 10:30:54.211+01	2026-01-28 10:30:54.211+01	\N	\N	\N	\N	\N	\N	2025-12-27 10:30:54.211+01	2026-01-01 21:20:18.127+01
d98a4cd3-88a1-4136-90a4-65d6ea935087	PER-2026-00019	PERMIS	d31c0252-90de-4fae-8fb9-f001f0a6591e	COMPANY	Tech Solutions Kinshasa	contact@techsol.cd	+243 825 444 555	Avenue de l'Investissement, N°41, Kasaï	CD/KIN/RCCM/24-D-44444	G4444444D	E444444444	Permis de circulation spéciale	Demande de permis de circulation spéciale pour le compte de Tech Solutions Kinshasa. Cette demande concerne les activités dans le secteur mines.	Commerce	Ituri	Mbuji-Mayi	3569014.00	USD	PENDING_DOCUMENTS	2	5	LOW	\N	\N	2025-10-19 16:05:17.529+01	2025-10-29 16:05:17.529+01	2025-11-18 16:05:17.529+01	\N	\N	\N	\N	\N	\N	2025-10-16 16:05:17.529+01	2026-01-01 21:20:18.129+01
806f988f-d8bf-4713-bd91-9bcf7ece3786	PER-2026-00020	PERMIS	d31c0252-90de-4fae-8fb9-f001f0a6591e	INDIVIDUAL	Pierre Mbuyi	pmbuyi@gmail.com	+243 992 555 666	Avenue de l'Investissement, N°29, Équateur	\N	H5555555E	\N	Permis sanitaire d'établissement	Demande de permis sanitaire d'établissement pour le compte de Pierre Mbuyi. Cette demande concerne les activités dans le secteur santé.	Mines	Équateur	Lubumbashi	\N	USD	DRAFT	1	5	URGENT	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-12-29 12:11:13.86+01	2026-01-01 21:20:18.131+01
91c40b06-49f3-43fc-9eb2-c2942050e872	PER-2026-00021	PERMIS	d31c0252-90de-4fae-8fb9-f001f0a6591e	INVESTOR	Global Invest RDC	info@globalinvest.cd	+243 815 555 999	Avenue de l'Investissement, N°233, Kongo Central	CD/KIN/RCCM/24-B-54321	C5432167Z	B987654321	Permis de circulation spéciale	Demande de permis de circulation spéciale pour le compte de Global Invest RDC. Cette demande concerne les activités dans le secteur énergie.	Transport	Kongo Central	Kananga	3945399.00	USD	UNDER_REVIEW	2	5	LOW	\N	\N	2025-11-06 05:58:25.086+01	2025-11-10 05:58:25.086+01	2025-12-06 05:58:25.086+01	\N	\N	\N	\N	\N	\N	2025-11-04 05:58:25.086+01	2026-01-01 21:20:18.132+01
fef831d9-1e69-43f8-b31e-ae3bb21902d1	PER-2026-00022	PERMIS	d31c0252-90de-4fae-8fb9-f001f0a6591e	COMPANY	Société Forestière du Congo	sfc@sfcongo.cd	+243 818 333 444	Avenue de l'Investissement, N°69, Ituri	CD/EQU/RCCM/24-C-33333	F3333333C	D333333333	Permis de recherche minière	Demande de permis de recherche minière pour le compte de Société Forestière du Congo. Cette demande concerne les activités dans le secteur industrie.	Environnement	Ituri	Matadi	425424.00	USD	DRAFT	1	5	URGENT	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-11-11 21:44:17.431+01	2026-01-01 21:20:18.134+01
643a5a0e-42a8-45fd-b56f-5703fecf2906	PER-2026-00023	PERMIS	d31c0252-90de-4fae-8fb9-f001f0a6591e	COMPANY	Société Forestière du Congo	sfc@sfcongo.cd	+243 818 333 444	Avenue de l'Investissement, N°326, Nord-Kivu	CD/EQU/RCCM/24-C-33333	F3333333C	D333333333	Permis sanitaire d'établissement	Demande de permis sanitaire d'établissement pour le compte de Société Forestière du Congo. Cette demande concerne les activités dans le secteur santé.	Énergie	Kasaï	Mbuji-Mayi	2092834.00	USD	IN_PROGRESS	2	5	LOW	\N	\N	2025-12-30 04:34:46.588+01	2026-01-09 04:34:46.588+01	2026-01-29 04:34:46.588+01	\N	\N	\N	\N	\N	\N	2025-12-28 04:34:46.588+01	2026-01-01 21:20:18.135+01
b3106396-5469-4bc8-88aa-a872b4789ad9	PER-2026-00024	PERMIS	d31c0252-90de-4fae-8fb9-f001f0a6591e	COMPANY	Import Export Lubumbashi	ielub@business.cd	+243 827 777 888	Avenue de l'Investissement, N°261, Kongo Central	CD/LUB/RCCM/24-F-66666	J7777777G	G666666666	Permis d'exploitation de débit de boissons	Demande de permis d'exploitation de débit de boissons pour le compte de Import Export Lubumbashi. Cette demande concerne les activités dans le secteur environnement.	Mines	Haut-Katanga	Bukavu	2812893.00	USD	REJECTED	5	5	URGENT	\N	\N	2025-10-29 16:41:22.777+01	2025-11-08 16:41:22.777+01	2025-11-28 16:41:22.777+01	2025-11-24 16:41:22.777+01	\N	Dossier incomplet ou non conforme aux critères requis.	\N	\N	\N	2025-10-28 16:41:22.777+01	2026-01-01 21:20:18.136+01
c10e87d9-96f3-469b-946e-3f7f4d7e05f6	PER-2026-00025	PERMIS	d31c0252-90de-4fae-8fb9-f001f0a6591e	INVESTOR	Global Invest RDC	info@globalinvest.cd	+243 815 555 999	Avenue de l'Investissement, N°403, Haut-Katanga	CD/KIN/RCCM/24-B-54321	C5432167Z	B987654321	Permis de construire - Bâtiment industriel	Demande de permis de construire - bâtiment industriel pour le compte de Global Invest RDC. Cette demande concerne les activités dans le secteur agriculture.	Santé	Nord-Kivu	Mbuji-Mayi	4891432.00	USD	PENDING_DOCUMENTS	1	5	HIGH	\N	\N	2025-10-28 04:25:20.866+01	2025-11-04 04:25:20.866+01	2025-11-27 04:25:20.866+01	\N	\N	\N	\N	\N	\N	2025-10-26 04:25:20.866+01	2026-01-01 21:20:18.141+01
019a5241-5d22-4427-869c-a68b5785dd91	PER-2026-00026	PERMIS	d31c0252-90de-4fae-8fb9-f001f0a6591e	INDIVIDUAL	Jean-Pierre Kabongo	jpkabongo@gmail.com	+243 998 765 432	Avenue de l'Investissement, N°175, Ituri	\N	B9876543Y	\N	Permis de travail pour expatriés	Demande de permis de travail pour expatriés pour le compte de Jean-Pierre Kabongo. Cette demande concerne les activités dans le secteur agriculture.	Santé	Nord-Kivu	Kisangani	\N	USD	PENDING_DOCUMENTS	1	5	HIGH	\N	\N	2026-01-01 02:13:13.256+01	2026-01-14 02:13:13.256+01	2026-01-31 02:13:13.256+01	\N	\N	\N	\N	\N	\N	2025-12-31 02:13:13.256+01	2026-01-01 21:20:18.144+01
b14dab4f-7a96-4b07-a565-1a79fa704ec4	AUT-2026-00025	AUTORISATION	72b9abbd-b70e-46cc-bae4-eee5cb71325d	COMPANY	Tech Solutions Kinshasa	contact@techsol.cd	+243 825 444 555	Avenue de l'Investissement, N°246, Kongo Central	CD/KIN/RCCM/24-D-44444	G4444444D	E444444444	Autorisation d'installation de panneaux solaires	Demande de autorisation d'installation de panneaux solaires pour le compte de Tech Solutions Kinshasa. Cette demande concerne les activités dans le secteur industrie.	Agriculture	Nord-Kivu	Lubumbashi	2464772.00	USD	IN_PROGRESS	2	5	URGENT	\N	\N	2025-11-01 00:05:13.565+01	2025-11-08 00:05:13.565+01	2025-12-01 00:05:13.565+01	\N	\N	\N	\N	\N	\N	2025-10-30 00:05:13.565+01	2026-01-01 21:20:18.155+01
a3408ded-81a7-43e4-af9f-9604d4b36528	AUT-2026-00026	AUTORISATION	72b9abbd-b70e-46cc-bae4-eee5cb71325d	INDIVIDUAL	Jean-Pierre Kabongo	jpkabongo@gmail.com	+243 998 765 432	Avenue de l'Investissement, N°410, Sud-Kivu	\N	B9876543Y	\N	Autorisation d'exploitation minière artisanale	Demande de autorisation d'exploitation minière artisanale pour le compte de Jean-Pierre Kabongo. Cette demande concerne les activités dans le secteur industrie.	Mines	Nord-Kivu	Mbuji-Mayi	\N	USD	APPROVED	5	5	URGENT	\N	\N	2025-12-01 01:40:38.424+01	2025-12-02 01:40:38.424+01	2025-12-31 01:40:38.424+01	2025-12-18 01:40:38.424+01	Dossier conforme aux exigences réglementaires.	\N	\N	\N	\N	2025-11-29 01:40:38.424+01	2026-01-01 21:20:18.157+01
bec9cbfb-3c45-4b7a-a4db-e82ceb326c45	AUT-2026-00027	AUTORISATION	72b9abbd-b70e-46cc-bae4-eee5cb71325d	INVESTOR	Global Invest RDC	info@globalinvest.cd	+243 815 555 999	Avenue de l'Investissement, N°151, Kinshasa	CD/KIN/RCCM/24-B-54321	C5432167Z	B987654321	Autorisation de transport de marchandises dangereuses	Demande de autorisation de transport de marchandises dangereuses pour le compte de Global Invest RDC. Cette demande concerne les activités dans le secteur transport.	Commerce	Haut-Katanga	Kananga	4336321.00	USD	REJECTED	5	5	NORMAL	\N	\N	2025-10-21 04:57:47.48+01	2025-11-03 04:57:47.48+01	2025-11-20 04:57:47.48+01	2025-11-05 04:57:47.48+01	\N	Dossier incomplet ou non conforme aux critères requis.	\N	\N	\N	2025-10-18 04:57:47.48+01	2026-01-01 21:20:18.161+01
b76c139a-b25b-40df-aeaf-e1dbc7e1ff42	AUT-2026-00028	AUTORISATION	72b9abbd-b70e-46cc-bae4-eee5cb71325d	COMPANY	SARL Mining Congo	contact@miningcongo.cd	+243 812 345 678	Avenue de l'Investissement, N°231, Kasaï	CD/KIN/RCCM/24-A-12345	A1234567X	A123456789	Autorisation de forage de puits	Demande de autorisation de forage de puits pour le compte de SARL Mining Congo. Cette demande concerne les activités dans le secteur industrie.	Industrie	Nord-Kivu	Lubumbashi	938146.00	USD	DRAFT	1	5	URGENT	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-10-31 16:00:46.752+01	2026-01-01 21:20:18.164+01
52d57ecf-2071-46b1-bba2-e786aa4fc193	AUT-2026-00029	AUTORISATION	72b9abbd-b70e-46cc-bae4-eee5cb71325d	INVESTOR	Global Invest RDC	info@globalinvest.cd	+243 815 555 999	Avenue de l'Investissement, N°172, Nord-Kivu	CD/KIN/RCCM/24-B-54321	C5432167Z	B987654321	Autorisation de transport de marchandises dangereuses	Demande de autorisation de transport de marchandises dangereuses pour le compte de Global Invest RDC. Cette demande concerne les activités dans le secteur transport.	Énergie	Kasaï	Lubumbashi	2636631.00	USD	IN_PROGRESS	4	5	HIGH	\N	\N	2025-12-01 17:36:05.222+01	2025-12-11 17:36:05.222+01	2025-12-31 17:36:05.222+01	\N	\N	\N	\N	\N	\N	2025-11-28 17:36:05.222+01	2026-01-01 21:20:18.165+01
ebad230a-af25-4ff7-8378-a659767a4880	AUT-2026-00030	AUTORISATION	72b9abbd-b70e-46cc-bae4-eee5cb71325d	COMPANY	Cimenterie du Kongo Central	ciment@ckc.cd	+243 816 666 777	Avenue de l'Investissement, N°88, Kinshasa	CD/KOC/RCCM/23-E-55555	I6666666F	F555555555	Autorisation d'exploitation agricole	Demande de autorisation d'exploitation agricole pour le compte de Cimenterie du Kongo Central. Cette demande concerne les activités dans le secteur agriculture.	Santé	Kongo Central	Kinshasa	3348945.00	USD	SUBMITTED	1	5	NORMAL	\N	\N	2025-12-09 23:30:44.538+01	2025-12-18 23:30:44.538+01	2026-01-08 23:30:44.538+01	\N	\N	\N	\N	\N	\N	2025-12-07 23:30:44.538+01	2026-01-01 21:20:18.168+01
85358758-b9a9-43b1-bb62-d56d0d9d63f5	LIC-2026-00021	LICENCE	72b9abbd-b70e-46cc-bae4-eee5cb71325d	COMPANY	Entreprise Agricole du Kasai	agrikasai@yahoo.fr	+243 820 111 222	Avenue de l'Investissement, N°178, Sud-Kivu	CD/KAS/RCCM/23-A-11111	D1111111A	C111111111	Licence d'exploitation de carrière	Demande de licence d'exploitation de carrière pour le compte de Entreprise Agricole du Kasai. Cette demande concerne les activités dans le secteur agriculture.	Santé	Haut-Katanga	Kinshasa	3192291.00	USD	REJECTED	5	5	NORMAL	\N	\N	2025-11-01 17:18:53.23+01	2025-11-14 17:18:53.23+01	2025-12-01 17:18:53.23+01	2025-11-21 17:18:53.23+01	\N	Dossier incomplet ou non conforme aux critères requis.	\N	\N	\N	2025-10-29 17:18:53.23+01	2026-01-01 21:20:18.169+01
5e4a4cf6-3837-4a03-b3fa-67f67291208f	LIC-2026-00022	LICENCE	72b9abbd-b70e-46cc-bae4-eee5cb71325d	COMPANY	Société Forestière du Congo	sfc@sfcongo.cd	+243 818 333 444	Avenue de l'Investissement, N°1, Kongo Central	CD/EQU/RCCM/24-C-33333	F3333333C	D333333333	Licence de production pharmaceutique	Demande de licence de production pharmaceutique pour le compte de Société Forestière du Congo. Cette demande concerne les activités dans le secteur environnement.	Environnement	Équateur	Bukavu	3102543.00	USD	DRAFT	1	5	NORMAL	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-12-20 08:03:02.686+01	2026-01-01 21:20:18.173+01
80a10494-b680-47c1-bdcc-47576e9d77db	LIC-2026-00023	LICENCE	72b9abbd-b70e-46cc-bae4-eee5cb71325d	INDIVIDUAL	Jean-Pierre Kabongo	jpkabongo@gmail.com	+243 998 765 432	Avenue de l'Investissement, N°11, Haut-Katanga	\N	B9876543Y	\N	Licence de transport public	Demande de licence de transport public pour le compte de Jean-Pierre Kabongo. Cette demande concerne les activités dans le secteur commerce.	Industrie	Kasaï	Kananga	\N	USD	SUBMITTED	1	5	HIGH	\N	\N	2025-10-17 02:12:25.937+01	2025-10-21 02:12:25.937+01	2025-11-16 02:12:25.937+01	\N	\N	\N	\N	\N	\N	2025-10-15 02:12:25.937+01	2026-01-01 21:20:18.174+01
fcf257be-c0b0-4eb8-be4c-af192504ccac	LIC-2026-00024	LICENCE	72b9abbd-b70e-46cc-bae4-eee5cb71325d	INDIVIDUAL	Pierre Mbuyi	pmbuyi@gmail.com	+243 992 555 666	Avenue de l'Investissement, N°189, Équateur	\N	H5555555E	\N	Licence de production agroalimentaire	Demande de licence de production agroalimentaire pour le compte de Pierre Mbuyi. Cette demande concerne les activités dans le secteur industrie.	Transport	Kongo Central	Lubumbashi	\N	USD	PENDING_DOCUMENTS	3	5	URGENT	\N	\N	2025-12-23 06:49:25.026+01	2026-01-04 06:49:25.026+01	2026-01-22 06:49:25.026+01	\N	\N	\N	\N	\N	\N	2025-12-21 06:49:25.026+01	2026-01-01 21:20:18.176+01
f3f9c2c3-9b14-42f8-a26f-37dc42a1b568	LIC-2026-00025	LICENCE	72b9abbd-b70e-46cc-bae4-eee5cb71325d	COMPANY	Tech Solutions Kinshasa	contact@techsol.cd	+243 825 444 555	Avenue de l'Investissement, N°398, Ituri	CD/KIN/RCCM/24-D-44444	G4444444D	E444444444	Licence de production agroalimentaire	Demande de licence de production agroalimentaire pour le compte de Tech Solutions Kinshasa. Cette demande concerne les activités dans le secteur agriculture.	Commerce	Ituri	Kananga	2517010.00	USD	REJECTED	5	5	URGENT	\N	\N	2025-11-05 10:28:56.203+01	2025-11-18 10:28:56.203+01	2025-12-05 10:28:56.203+01	2025-11-18 10:28:56.203+01	\N	Dossier incomplet ou non conforme aux critères requis.	\N	\N	\N	2025-11-03 10:28:56.203+01	2026-01-01 21:20:18.178+01
cca7f984-4937-4850-933c-2e80ee8428a0	PER-2026-00027	PERMIS	72b9abbd-b70e-46cc-bae4-eee5cb71325d	INVESTOR	Global Invest RDC	info@globalinvest.cd	+243 815 555 999	Avenue de l'Investissement, N°49, Haut-Katanga	CD/KIN/RCCM/24-B-54321	C5432167Z	B987654321	Permis de recherche minière	Demande de permis de recherche minière pour le compte de Global Invest RDC. Cette demande concerne les activités dans le secteur industrie.	Industrie	Ituri	Lubumbashi	4321596.00	USD	IN_PROGRESS	4	5	NORMAL	\N	\N	2025-12-20 11:34:50.796+01	2025-12-21 11:34:50.796+01	2026-01-19 11:34:50.796+01	\N	\N	\N	\N	\N	\N	2025-12-17 11:34:50.796+01	2026-01-01 21:20:18.182+01
c4990d27-09b1-4296-b75a-55486d07d614	PER-2026-00028	PERMIS	72b9abbd-b70e-46cc-bae4-eee5cb71325d	INDIVIDUAL	Pierre Mbuyi	pmbuyi@gmail.com	+243 992 555 666	Avenue de l'Investissement, N°426, Sud-Kivu	\N	H5555555E	\N	Permis d'exploitation de débit de boissons	Demande de permis d'exploitation de débit de boissons pour le compte de Pierre Mbuyi. Cette demande concerne les activités dans le secteur environnement.	Santé	Kongo Central	Bukavu	\N	USD	SUBMITTED	1	5	HIGH	\N	\N	2025-12-06 18:52:54.085+01	2025-12-11 18:52:54.085+01	2026-01-05 18:52:54.085+01	\N	\N	\N	\N	\N	\N	2025-12-05 18:52:54.085+01	2026-01-01 21:20:18.185+01
0d880f6b-bb4f-4879-b3e0-2932926ed13a	PER-2026-00029	PERMIS	72b9abbd-b70e-46cc-bae4-eee5cb71325d	COMPANY	Tech Solutions Kinshasa	contact@techsol.cd	+243 825 444 555	Avenue de l'Investissement, N°133, Sud-Kivu	CD/KIN/RCCM/24-D-44444	G4444444D	E444444444	Permis de travail pour expatriés	Demande de permis de travail pour expatriés pour le compte de Tech Solutions Kinshasa. Cette demande concerne les activités dans le secteur commerce.	Mines	Kongo Central	Lubumbashi	3828544.00	USD	PENDING_DOCUMENTS	2	5	NORMAL	\N	\N	2025-12-04 22:41:24.055+01	2025-12-05 22:41:24.055+01	2026-01-03 22:41:24.055+01	\N	\N	\N	\N	\N	\N	2025-12-02 22:41:24.055+01	2026-01-01 21:20:18.186+01
f84c64e2-2693-49c8-8ea1-7bbb73b67923	AUT-2026-00031	AUTORISATION	d33f001c-23b0-457d-8d8f-538f97eacc16	COMPANY	Entreprise Agricole du Kasai	agrikasai@yahoo.fr	+243 820 111 222	Avenue de l'Investissement, N°259, Équateur	CD/KAS/RCCM/23-A-11111	D1111111A	C111111111	Autorisation d'exploitation agricole	Demande de autorisation d'exploitation agricole pour le compte de Entreprise Agricole du Kasai. Cette demande concerne les activités dans le secteur agriculture.	Environnement	Kinshasa	Kananga	3373398.00	USD	DRAFT	1	5	URGENT	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-10-20 17:56:11.503+01	2026-01-01 21:20:18.195+01
f6428842-2944-4bd4-9e56-738858ecd6ea	AUT-2026-00032	AUTORISATION	d33f001c-23b0-457d-8d8f-538f97eacc16	COMPANY	Tech Solutions Kinshasa	contact@techsol.cd	+243 825 444 555	Avenue de l'Investissement, N°17, Équateur	CD/KIN/RCCM/24-D-44444	G4444444D	E444444444	Autorisation de forage de puits	Demande de autorisation de forage de puits pour le compte de Tech Solutions Kinshasa. Cette demande concerne les activités dans le secteur santé.	Mines	Nord-Kivu	Mbuji-Mayi	769529.00	USD	REJECTED	5	5	LOW	\N	\N	2025-12-23 00:57:38.153+01	2026-01-03 00:57:38.153+01	2026-01-22 00:57:38.153+01	2026-01-17 00:57:38.153+01	\N	Dossier incomplet ou non conforme aux critères requis.	\N	\N	\N	2025-12-22 00:57:38.153+01	2026-01-01 21:20:18.196+01
33e5a575-7de4-4917-afe6-2ae97bb24261	AUT-2026-00033	AUTORISATION	d33f001c-23b0-457d-8d8f-538f97eacc16	COMPANY	SARL Mining Congo	contact@miningcongo.cd	+243 812 345 678	Avenue de l'Investissement, N°185, Nord-Kivu	CD/KIN/RCCM/24-A-12345	A1234567X	A123456789	Autorisation d'exploitation minière artisanale	Demande de autorisation d'exploitation minière artisanale pour le compte de SARL Mining Congo. Cette demande concerne les activités dans le secteur environnement.	Mines	Kasaï	Mbuji-Mayi	4999322.00	USD	APPROVED	5	5	LOW	\N	\N	2025-10-27 08:48:44.872+01	2025-10-31 08:48:44.872+01	2025-11-26 08:48:44.872+01	2025-11-11 08:48:44.872+01	Dossier conforme aux exigences réglementaires.	\N	\N	\N	\N	2025-10-24 08:48:44.872+01	2026-01-01 21:20:18.199+01
aaaea183-3c3d-4836-b10a-42a88f25e671	LIC-2026-00026	LICENCE	d33f001c-23b0-457d-8d8f-538f97eacc16	COMPANY	SARL Mining Congo	contact@miningcongo.cd	+243 812 345 678	Avenue de l'Investissement, N°248, Ituri	CD/KIN/RCCM/24-A-12345	A1234567X	A123456789	Licence de télécommunications	Demande de licence de télécommunications pour le compte de SARL Mining Congo. Cette demande concerne les activités dans le secteur transport.	Industrie	Ituri	Mbuji-Mayi	533369.00	USD	SUBMITTED	1	5	URGENT	\N	\N	2025-12-14 23:01:47.158+01	2025-12-21 23:01:47.158+01	2026-01-13 23:01:47.158+01	\N	\N	\N	\N	\N	\N	2025-12-12 23:01:47.158+01	2026-01-01 21:20:18.202+01
6a74bc38-493a-41ad-903b-2696d0d1d624	LIC-2026-00027	LICENCE	d33f001c-23b0-457d-8d8f-538f97eacc16	COMPANY	Import Export Lubumbashi	ielub@business.cd	+243 827 777 888	Avenue de l'Investissement, N°130, Haut-Katanga	CD/LUB/RCCM/24-F-66666	J7777777G	G666666666	Licence de production agroalimentaire	Demande de licence de production agroalimentaire pour le compte de Import Export Lubumbashi. Cette demande concerne les activités dans le secteur santé.	Industrie	Nord-Kivu	Kisangani	3908945.00	USD	SUBMITTED	1	5	LOW	\N	\N	2025-12-23 00:20:41.367+01	2025-12-24 00:20:41.367+01	2026-01-22 00:20:41.367+01	\N	\N	\N	\N	\N	\N	2025-12-21 00:20:41.367+01	2026-01-01 21:20:18.203+01
851c6720-bcbe-4159-889f-0c5c3ff95d8e	LIC-2026-00028	LICENCE	d33f001c-23b0-457d-8d8f-538f97eacc16	COMPANY	Cimenterie du Kongo Central	ciment@ckc.cd	+243 816 666 777	Avenue de l'Investissement, N°223, Nord-Kivu	CD/KOC/RCCM/23-E-55555	I6666666F	F555555555	Licence de transport public	Demande de licence de transport public pour le compte de Cimenterie du Kongo Central. Cette demande concerne les activités dans le secteur industrie.	Mines	Ituri	Mbuji-Mayi	1322393.00	USD	IN_PROGRESS	2	5	LOW	\N	\N	2025-12-08 23:15:17.675+01	2025-12-18 23:15:17.675+01	2026-01-07 23:15:17.675+01	\N	\N	\N	\N	\N	\N	2025-12-05 23:15:17.675+01	2026-01-01 21:20:18.205+01
8fe3b2f9-89a6-452a-b6e4-44138f4b0ef5	LIC-2026-00029	LICENCE	d33f001c-23b0-457d-8d8f-538f97eacc16	INDIVIDUAL	Marie Lukusa	mlukusa@outlook.com	+243 991 222 333	Avenue de l'Investissement, N°177, Kongo Central	\N	E2222222B	\N	Licence d'importation de produits pétroliers	Demande de licence d'importation de produits pétroliers pour le compte de Marie Lukusa. Cette demande concerne les activités dans le secteur transport.	Santé	Kinshasa	Mbuji-Mayi	\N	USD	PENDING_DOCUMENTS	3	5	HIGH	\N	\N	2025-11-19 18:41:34.819+01	2025-11-20 18:41:34.819+01	2025-12-19 18:41:34.819+01	\N	\N	\N	\N	\N	\N	2025-11-16 18:41:34.819+01	2026-01-01 21:20:18.207+01
68706079-e96c-4947-9625-0aec3b1b4929	LIC-2026-00030	LICENCE	d33f001c-23b0-457d-8d8f-538f97eacc16	COMPANY	Import Export Lubumbashi	ielub@business.cd	+243 827 777 888	Avenue de l'Investissement, N°263, Ituri	CD/LUB/RCCM/24-F-66666	J7777777G	G666666666	Licence de transport public	Demande de licence de transport public pour le compte de Import Export Lubumbashi. Cette demande concerne les activités dans le secteur transport.	Mines	Haut-Katanga	Lubumbashi	2972183.00	USD	UNDER_REVIEW	4	5	NORMAL	\N	\N	2025-10-18 18:19:05.323+01	2025-10-24 18:19:05.323+01	2025-11-17 18:19:05.323+01	\N	\N	\N	\N	\N	\N	2025-10-16 18:19:05.323+01	2026-01-01 21:20:18.21+01
3de20dfd-dd21-42ca-bcd6-a24122a5fad6	LIC-2026-00031	LICENCE	d33f001c-23b0-457d-8d8f-538f97eacc16	INDIVIDUAL	Jean-Pierre Kabongo	jpkabongo@gmail.com	+243 998 765 432	Avenue de l'Investissement, N°460, Kongo Central	\N	B9876543Y	\N	Licence de télécommunications	Demande de licence de télécommunications pour le compte de Jean-Pierre Kabongo. Cette demande concerne les activités dans le secteur santé.	Énergie	Kinshasa	Bukavu	\N	USD	UNDER_REVIEW	3	5	LOW	\N	\N	2025-11-05 09:43:10.976+01	2025-11-18 09:43:10.976+01	2025-12-05 09:43:10.976+01	\N	\N	\N	\N	\N	\N	2025-11-03 09:43:10.976+01	2026-01-01 21:20:18.212+01
c2aee567-5820-4cc6-98e0-c1b46c8b06bf	LIC-2026-00032	LICENCE	d33f001c-23b0-457d-8d8f-538f97eacc16	COMPANY	Import Export Lubumbashi	ielub@business.cd	+243 827 777 888	Avenue de l'Investissement, N°484, Kasaï	CD/LUB/RCCM/24-F-66666	J7777777G	G666666666	Licence de transport public	Demande de licence de transport public pour le compte de Import Export Lubumbashi. Cette demande concerne les activités dans le secteur santé.	Environnement	Kasaï	Kananga	1752180.00	USD	PENDING_DOCUMENTS	3	5	URGENT	\N	\N	2026-01-02 07:25:08.014+01	2026-01-13 07:25:08.014+01	2026-02-01 07:25:08.014+01	\N	\N	\N	\N	\N	\N	2025-12-31 07:25:08.014+01	2026-01-01 21:20:18.214+01
250dffd3-03ce-4683-92bb-ad5af1a8a45b	PER-2026-00030	PERMIS	d33f001c-23b0-457d-8d8f-538f97eacc16	INVESTOR	Global Invest RDC	info@globalinvest.cd	+243 815 555 999	Avenue de l'Investissement, N°456, Équateur	CD/KIN/RCCM/24-B-54321	C5432167Z	B987654321	Permis de recherche minière	Demande de permis de recherche minière pour le compte de Global Invest RDC. Cette demande concerne les activités dans le secteur énergie.	Transport	Kinshasa	Mbuji-Mayi	2070546.00	USD	PENDING_DOCUMENTS	1	5	LOW	\N	\N	2025-10-07 05:56:30.688+01	2025-10-21 05:56:30.688+01	2025-11-06 05:56:30.688+01	\N	\N	\N	\N	\N	\N	2025-10-05 05:56:30.688+01	2026-01-01 21:20:18.217+01
b51e139a-e63c-454c-8f24-90e97e8c5729	PER-2026-00031	PERMIS	d33f001c-23b0-457d-8d8f-538f97eacc16	COMPANY	Société Forestière du Congo	sfc@sfcongo.cd	+243 818 333 444	Avenue de l'Investissement, N°470, Kongo Central	CD/EQU/RCCM/24-C-33333	F3333333C	D333333333	Permis environnemental - Étude d'impact	Demande de permis environnemental - étude d'impact pour le compte de Société Forestière du Congo. Cette demande concerne les activités dans le secteur santé.	Mines	Kongo Central	Lubumbashi	2380849.00	USD	IN_PROGRESS	3	5	HIGH	\N	\N	2025-11-18 18:58:45.373+01	2025-11-26 18:58:45.373+01	2025-12-18 18:58:45.373+01	\N	\N	\N	\N	\N	\N	2025-11-17 18:58:45.373+01	2026-01-01 21:20:18.219+01
120b5bfa-1f3f-4583-9aff-3c48a5605d30	PER-2026-00032	PERMIS	d33f001c-23b0-457d-8d8f-538f97eacc16	COMPANY	SARL Mining Congo	contact@miningcongo.cd	+243 812 345 678	Avenue de l'Investissement, N°359, Ituri	CD/KIN/RCCM/24-A-12345	A1234567X	A123456789	Permis d'exploitation de débit de boissons	Demande de permis d'exploitation de débit de boissons pour le compte de SARL Mining Congo. Cette demande concerne les activités dans le secteur environnement.	Agriculture	Kinshasa	Goma	870860.00	USD	APPROVED	5	5	NORMAL	\N	\N	2025-12-26 12:11:47.958+01	2026-01-04 12:11:47.958+01	2026-01-25 12:11:47.958+01	2026-01-24 12:11:47.958+01	Dossier conforme aux exigences réglementaires.	\N	\N	\N	\N	2025-12-24 12:11:47.958+01	2026-01-01 21:20:18.221+01
0693fd64-9c21-43ce-82d5-659ef0f29740	AUT-2026-00034	AUTORISATION	4eb63f50-d06a-4288-86f8-789e3c2f7d4d	COMPANY	Entreprise Agricole du Kasai	agrikasai@yahoo.fr	+243 820 111 222	Avenue de l'Investissement, N°450, Sud-Kivu	CD/KAS/RCCM/23-A-11111	D1111111A	C111111111	Autorisation de transport de marchandises dangereuses	Demande de autorisation de transport de marchandises dangereuses pour le compte de Entreprise Agricole du Kasai. Cette demande concerne les activités dans le secteur santé.	Transport	Équateur	Kisangani	625013.00	USD	IN_PROGRESS	2	5	LOW	\N	\N	2025-11-05 04:58:07.332+01	2025-11-18 04:58:07.332+01	2025-12-05 04:58:07.332+01	\N	\N	\N	\N	\N	\N	2025-11-02 04:58:07.332+01	2026-01-01 21:20:18.23+01
9388ae9a-d4c4-4ad2-bfd6-acf2d7a18afa	AUT-2026-00035	AUTORISATION	4eb63f50-d06a-4288-86f8-789e3c2f7d4d	COMPANY	Entreprise Agricole du Kasai	agrikasai@yahoo.fr	+243 820 111 222	Avenue de l'Investissement, N°154, Kongo Central	CD/KAS/RCCM/23-A-11111	D1111111A	C111111111	Autorisation d'importation de matériel industriel	Demande de autorisation d'importation de matériel industriel pour le compte de Entreprise Agricole du Kasai. Cette demande concerne les activités dans le secteur mines.	Transport	Kongo Central	Lubumbashi	204127.00	USD	SUBMITTED	1	5	NORMAL	\N	\N	2025-11-18 23:34:31.303+01	2025-11-25 23:34:31.303+01	2025-12-18 23:34:31.303+01	\N	\N	\N	\N	\N	\N	2025-11-16 23:34:31.303+01	2026-01-01 21:20:18.231+01
c8eed1db-5210-4e46-8d7f-b8148804bc44	AUT-2026-00036	AUTORISATION	4eb63f50-d06a-4288-86f8-789e3c2f7d4d	COMPANY	Société Forestière du Congo	sfc@sfcongo.cd	+243 818 333 444	Avenue de l'Investissement, N°4, Ituri	CD/EQU/RCCM/24-C-33333	F3333333C	D333333333	Autorisation de forage de puits	Demande de autorisation de forage de puits pour le compte de Société Forestière du Congo. Cette demande concerne les activités dans le secteur énergie.	Environnement	Équateur	Kisangani	4589822.00	USD	PENDING_DOCUMENTS	2	5	HIGH	\N	\N	2025-12-23 01:08:05.728+01	2025-12-30 01:08:05.728+01	2026-01-22 01:08:05.728+01	\N	\N	\N	\N	\N	\N	2025-12-20 01:08:05.728+01	2026-01-01 21:20:18.233+01
ad8fb43f-550e-4975-91e9-865ff250b135	AUT-2026-00037	AUTORISATION	4eb63f50-d06a-4288-86f8-789e3c2f7d4d	COMPANY	Tech Solutions Kinshasa	contact@techsol.cd	+243 825 444 555	Avenue de l'Investissement, N°234, Nord-Kivu	CD/KIN/RCCM/24-D-44444	G4444444D	E444444444	Autorisation de construction d'une usine	Demande de autorisation de construction d'une usine pour le compte de Tech Solutions Kinshasa. Cette demande concerne les activités dans le secteur énergie.	Agriculture	Kasaï	Mbuji-Mayi	921673.00	USD	SUBMITTED	1	5	HIGH	\N	\N	2025-11-18 11:09:21.742+01	2025-11-26 11:09:21.742+01	2025-12-18 11:09:21.742+01	\N	\N	\N	\N	\N	\N	2025-11-17 11:09:21.742+01	2026-01-01 21:20:18.234+01
625ffed2-6dbc-402b-b29b-28422f437d14	AUT-2026-00038	AUTORISATION	4eb63f50-d06a-4288-86f8-789e3c2f7d4d	INDIVIDUAL	Pierre Mbuyi	pmbuyi@gmail.com	+243 992 555 666	Avenue de l'Investissement, N°87, Kongo Central	\N	H5555555E	\N	Autorisation d'importation de matériel industriel	Demande de autorisation d'importation de matériel industriel pour le compte de Pierre Mbuyi. Cette demande concerne les activités dans le secteur industrie.	Énergie	Kinshasa	Kinshasa	\N	USD	SUBMITTED	1	5	HIGH	\N	\N	2025-10-27 06:01:20.837+01	2025-11-08 06:01:20.837+01	2025-11-26 06:01:20.837+01	\N	\N	\N	\N	\N	\N	2025-10-26 06:01:20.837+01	2026-01-01 21:20:18.236+01
849742a7-bbbc-4098-b63b-e02f326b1c1c	LIC-2026-00033	LICENCE	4eb63f50-d06a-4288-86f8-789e3c2f7d4d	COMPANY	SARL Mining Congo	contact@miningcongo.cd	+243 812 345 678	Avenue de l'Investissement, N°366, Kongo Central	CD/KIN/RCCM/24-A-12345	A1234567X	A123456789	Licence d'exploitation de carrière	Demande de licence d'exploitation de carrière pour le compte de SARL Mining Congo. Cette demande concerne les activités dans le secteur commerce.	Agriculture	Kasaï	Kisangani	4479451.00	USD	IN_PROGRESS	3	5	URGENT	\N	\N	2025-11-11 12:09:32.183+01	2025-11-24 12:09:32.183+01	2025-12-11 12:09:32.183+01	\N	\N	\N	\N	\N	\N	2025-11-09 12:09:32.183+01	2026-01-01 21:20:18.237+01
019cab5d-e03b-44bc-8efb-020270ac6ef8	LIC-2026-00034	LICENCE	4eb63f50-d06a-4288-86f8-789e3c2f7d4d	COMPANY	Société Forestière du Congo	sfc@sfcongo.cd	+243 818 333 444	Avenue de l'Investissement, N°215, Kongo Central	CD/EQU/RCCM/24-C-33333	F3333333C	D333333333	Licence de transport public	Demande de licence de transport public pour le compte de Société Forestière du Congo. Cette demande concerne les activités dans le secteur environnement.	Agriculture	Kasaï	Goma	1595646.00	USD	PENDING_DOCUMENTS	3	5	NORMAL	\N	\N	2025-12-18 18:40:10.696+01	2025-12-22 18:40:10.696+01	2026-01-17 18:40:10.696+01	\N	\N	\N	\N	\N	\N	2025-12-17 18:40:10.696+01	2026-01-01 21:20:18.239+01
9385e405-232a-40d8-a59a-975aa0f36db7	LIC-2026-00035	LICENCE	4eb63f50-d06a-4288-86f8-789e3c2f7d4d	INDIVIDUAL	Pierre Mbuyi	pmbuyi@gmail.com	+243 992 555 666	Avenue de l'Investissement, N°348, Haut-Katanga	\N	H5555555E	\N	Licence de production agroalimentaire	Demande de licence de production agroalimentaire pour le compte de Pierre Mbuyi. Cette demande concerne les activités dans le secteur mines.	Transport	Kasaï	Kinshasa	\N	USD	REJECTED	5	5	NORMAL	\N	\N	2025-10-29 19:07:44.331+01	2025-10-31 19:07:44.331+01	2025-11-28 19:07:44.331+01	2025-11-17 19:07:44.331+01	\N	Dossier incomplet ou non conforme aux critères requis.	\N	\N	\N	2025-10-27 19:07:44.331+01	2026-01-01 21:20:18.241+01
0189c77a-14e2-4a36-8995-9a9074f6a3b9	LIC-2026-00036	LICENCE	4eb63f50-d06a-4288-86f8-789e3c2f7d4d	INDIVIDUAL	Pierre Mbuyi	pmbuyi@gmail.com	+243 992 555 666	Avenue de l'Investissement, N°474, Sud-Kivu	\N	H5555555E	\N	Licence d'importation de produits pétroliers	Demande de licence d'importation de produits pétroliers pour le compte de Pierre Mbuyi. Cette demande concerne les activités dans le secteur industrie.	Industrie	Ituri	Kinshasa	\N	USD	REJECTED	5	5	LOW	\N	\N	2025-12-09 19:08:30.493+01	2025-12-13 19:08:30.493+01	2026-01-08 19:08:30.493+01	2026-01-02 19:08:30.493+01	\N	Dossier incomplet ou non conforme aux critères requis.	\N	\N	\N	2025-12-08 19:08:30.493+01	2026-01-01 21:20:18.244+01
8c681170-55d4-47ec-b04e-af8fe0d1e875	LIC-2026-00037	LICENCE	4eb63f50-d06a-4288-86f8-789e3c2f7d4d	INVESTOR	Global Invest RDC	info@globalinvest.cd	+243 815 555 999	Avenue de l'Investissement, N°477, Kongo Central	CD/KIN/RCCM/24-B-54321	C5432167Z	B987654321	Licence d'exploitation forestière	Demande de licence d'exploitation forestière pour le compte de Global Invest RDC. Cette demande concerne les activités dans le secteur agriculture.	Agriculture	Kasaï	Goma	578949.00	USD	REJECTED	5	5	HIGH	\N	\N	2025-10-14 00:33:17.068+01	2025-10-25 00:33:17.068+01	2025-11-13 00:33:17.068+01	2025-10-24 00:33:17.068+01	\N	Dossier incomplet ou non conforme aux critères requis.	\N	\N	\N	2025-10-12 00:33:17.068+01	2026-01-01 21:20:18.246+01
0f9a15f1-3e01-42c5-bf8f-87ba6b36a071	LIC-2026-00038	LICENCE	4eb63f50-d06a-4288-86f8-789e3c2f7d4d	COMPANY	Société Forestière du Congo	sfc@sfcongo.cd	+243 818 333 444	Avenue de l'Investissement, N°275, Sud-Kivu	CD/EQU/RCCM/24-C-33333	F3333333C	D333333333	Licence d'exploitation forestière	Demande de licence d'exploitation forestière pour le compte de Société Forestière du Congo. Cette demande concerne les activités dans le secteur environnement.	Agriculture	Nord-Kivu	Kananga	225063.00	USD	UNDER_REVIEW	3	5	NORMAL	\N	\N	2025-11-21 02:54:54.302+01	2025-11-27 02:54:54.302+01	2025-12-21 02:54:54.302+01	\N	\N	\N	\N	\N	\N	2025-11-20 02:54:54.302+01	2026-01-01 21:20:18.249+01
5b4bfe73-0e61-4857-a517-16e3da1d54c1	LIC-2026-00039	LICENCE	4eb63f50-d06a-4288-86f8-789e3c2f7d4d	COMPANY	SARL Mining Congo	contact@miningcongo.cd	+243 812 345 678	Avenue de l'Investissement, N°163, Nord-Kivu	CD/KIN/RCCM/24-A-12345	A1234567X	A123456789	Licence d'exploitation de carrière	Demande de licence d'exploitation de carrière pour le compte de SARL Mining Congo. Cette demande concerne les activités dans le secteur commerce.	Commerce	Kongo Central	Kananga	2774317.00	USD	DRAFT	1	5	NORMAL	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-12-05 06:45:31.223+01	2026-01-01 21:20:18.251+01
868510ab-7889-4664-ac51-062ea1f9cf04	LIC-2026-00040	LICENCE	4eb63f50-d06a-4288-86f8-789e3c2f7d4d	COMPANY	Société Forestière du Congo	sfc@sfcongo.cd	+243 818 333 444	Avenue de l'Investissement, N°482, Ituri	CD/EQU/RCCM/24-C-33333	F3333333C	D333333333	Licence de pêche industrielle	Demande de licence de pêche industrielle pour le compte de Société Forestière du Congo. Cette demande concerne les activités dans le secteur industrie.	Industrie	Nord-Kivu	Goma	3167269.00	USD	SUBMITTED	1	5	NORMAL	\N	\N	2025-10-08 07:44:48.845+01	2025-10-15 07:44:48.845+01	2025-11-07 07:44:48.845+01	\N	\N	\N	\N	\N	\N	2025-10-06 07:44:48.845+01	2026-01-01 21:20:18.252+01
119f3081-21e3-4b73-bc39-975e6b5c68d7	PER-2026-00033	PERMIS	4eb63f50-d06a-4288-86f8-789e3c2f7d4d	COMPANY	Import Export Lubumbashi	ielub@business.cd	+243 827 777 888	Avenue de l'Investissement, N°71, Nord-Kivu	CD/LUB/RCCM/24-F-66666	J7777777G	G666666666	Permis d'exploitation de débit de boissons	Demande de permis d'exploitation de débit de boissons pour le compte de Import Export Lubumbashi. Cette demande concerne les activités dans le secteur santé.	Santé	Kasaï	Kinshasa	4720206.00	USD	DRAFT	1	5	HIGH	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-11-03 13:34:35.198+01	2026-01-01 21:20:18.253+01
54836d92-cf6e-45ec-9a46-1bffe5bccb00	PER-2026-00034	PERMIS	4eb63f50-d06a-4288-86f8-789e3c2f7d4d	INVESTOR	Global Invest RDC	info@globalinvest.cd	+243 815 555 999	Avenue de l'Investissement, N°230, Kinshasa	CD/KIN/RCCM/24-B-54321	C5432167Z	B987654321	Permis de séjour prolongé	Demande de permis de séjour prolongé pour le compte de Global Invest RDC. Cette demande concerne les activités dans le secteur transport.	Commerce	Nord-Kivu	Kananga	3304732.00	USD	IN_PROGRESS	4	5	NORMAL	\N	\N	2025-11-28 08:29:06.105+01	2025-12-08 08:29:06.105+01	2025-12-28 08:29:06.105+01	\N	\N	\N	\N	\N	\N	2025-11-27 08:29:06.105+01	2026-01-01 21:20:18.254+01
a00df11a-7a2d-44a2-9529-268dd1a8cdf9	PER-2026-00035	PERMIS	4eb63f50-d06a-4288-86f8-789e3c2f7d4d	COMPANY	Tech Solutions Kinshasa	contact@techsol.cd	+243 825 444 555	Avenue de l'Investissement, N°366, Équateur	CD/KIN/RCCM/24-D-44444	G4444444D	E444444444	Permis environnemental - Étude d'impact	Demande de permis environnemental - étude d'impact pour le compte de Tech Solutions Kinshasa. Cette demande concerne les activités dans le secteur environnement.	Transport	Haut-Katanga	Kananga	1105562.00	USD	IN_PROGRESS	3	5	LOW	\N	\N	2025-11-13 14:44:39.137+01	2025-11-21 14:44:39.137+01	2025-12-13 14:44:39.137+01	\N	\N	\N	\N	\N	\N	2025-11-12 14:44:39.137+01	2026-01-01 21:20:18.256+01
376a58ff-177c-4493-8a35-9d2c560ceb95	PER-2026-00036	PERMIS	4eb63f50-d06a-4288-86f8-789e3c2f7d4d	INDIVIDUAL	Pierre Mbuyi	pmbuyi@gmail.com	+243 992 555 666	Avenue de l'Investissement, N°169, Ituri	\N	H5555555E	\N	Permis de construire - Bâtiment industriel	Demande de permis de construire - bâtiment industriel pour le compte de Pierre Mbuyi. Cette demande concerne les activités dans le secteur environnement.	Transport	Haut-Katanga	Mbuji-Mayi	\N	USD	PENDING_DOCUMENTS	3	5	URGENT	\N	\N	2025-12-16 02:22:28.101+01	2025-12-26 02:22:28.101+01	2026-01-15 02:22:28.101+01	\N	\N	\N	\N	\N	\N	2025-12-13 02:22:28.101+01	2026-01-01 21:20:18.258+01
0b3e7758-60c5-4385-a837-5286f830c34d	PER-2026-00037	PERMIS	4eb63f50-d06a-4288-86f8-789e3c2f7d4d	COMPANY	Société Forestière du Congo	sfc@sfcongo.cd	+243 818 333 444	Avenue de l'Investissement, N°440, Nord-Kivu	CD/EQU/RCCM/24-C-33333	F3333333C	D333333333	Permis d'exploitation de débit de boissons	Demande de permis d'exploitation de débit de boissons pour le compte de Société Forestière du Congo. Cette demande concerne les activités dans le secteur transport.	Santé	Kasaï	Goma	2956832.00	USD	PENDING_DOCUMENTS	3	5	NORMAL	\N	\N	2025-12-26 07:48:25.033+01	2026-01-01 07:48:25.033+01	2026-01-25 07:48:25.033+01	\N	\N	\N	\N	\N	\N	2025-12-24 07:48:25.033+01	2026-01-01 21:20:18.26+01
81139b8b-82e5-4d50-9f85-6a06106d52b9	AUT-2026-00039	AUTORISATION	b4c4d208-ba0f-4e2f-87ae-0f263fa8a8c7	COMPANY	Entreprise Agricole du Kasai	agrikasai@yahoo.fr	+243 820 111 222	Avenue de l'Investissement, N°57, Sud-Kivu	CD/KAS/RCCM/23-A-11111	D1111111A	C111111111	Autorisation de transport de marchandises dangereuses	Demande de autorisation de transport de marchandises dangereuses pour le compte de Entreprise Agricole du Kasai. Cette demande concerne les activités dans le secteur commerce.	Commerce	Équateur	Matadi	4999042.00	USD	IN_PROGRESS	3	5	URGENT	\N	\N	2025-12-10 03:29:59.049+01	2025-12-12 03:29:59.049+01	2026-01-09 03:29:59.049+01	\N	\N	\N	\N	\N	\N	2025-12-07 03:29:59.049+01	2026-01-01 21:20:18.268+01
f0fcd01d-ef46-40b6-bd32-af634fa78967	AUT-2026-00040	AUTORISATION	b4c4d208-ba0f-4e2f-87ae-0f263fa8a8c7	COMPANY	Entreprise Agricole du Kasai	agrikasai@yahoo.fr	+243 820 111 222	Avenue de l'Investissement, N°106, Kongo Central	CD/KAS/RCCM/23-A-11111	D1111111A	C111111111	Autorisation de transport de marchandises dangereuses	Demande de autorisation de transport de marchandises dangereuses pour le compte de Entreprise Agricole du Kasai. Cette demande concerne les activités dans le secteur environnement.	Mines	Kasaï	Bukavu	4866044.00	USD	IN_PROGRESS	2	5	NORMAL	\N	\N	2025-10-28 17:20:24.094+01	2025-11-04 17:20:24.094+01	2025-11-27 17:20:24.094+01	\N	\N	\N	\N	\N	\N	2025-10-27 17:20:24.094+01	2026-01-01 21:20:18.27+01
00a3d1f2-2f45-48cc-9001-bb9d6566d0df	AUT-2026-00041	AUTORISATION	b4c4d208-ba0f-4e2f-87ae-0f263fa8a8c7	INDIVIDUAL	Jean-Pierre Kabongo	jpkabongo@gmail.com	+243 998 765 432	Avenue de l'Investissement, N°226, Sud-Kivu	\N	B9876543Y	\N	Autorisation d'exercice d'activité commerciale	Demande de autorisation d'exercice d'activité commerciale pour le compte de Jean-Pierre Kabongo. Cette demande concerne les activités dans le secteur environnement.	Santé	Kinshasa	Kananga	\N	USD	APPROVED	5	5	URGENT	\N	\N	2025-10-19 21:06:01.435+01	2025-10-23 21:06:01.435+01	2025-11-18 21:06:01.435+01	2025-11-08 21:06:01.435+01	Dossier conforme aux exigences réglementaires.	\N	\N	\N	\N	2025-10-18 21:06:01.435+01	2026-01-01 21:20:18.272+01
b5e0b150-b023-419c-93f7-72ecd056785a	AUT-2026-00042	AUTORISATION	b4c4d208-ba0f-4e2f-87ae-0f263fa8a8c7	INDIVIDUAL	Jean-Pierre Kabongo	jpkabongo@gmail.com	+243 998 765 432	Avenue de l'Investissement, N°481, Sud-Kivu	\N	B9876543Y	\N	Autorisation d'exploitation minière artisanale	Demande de autorisation d'exploitation minière artisanale pour le compte de Jean-Pierre Kabongo. Cette demande concerne les activités dans le secteur industrie.	Mines	Kongo Central	Lubumbashi	\N	USD	REJECTED	5	5	URGENT	\N	\N	2025-12-21 19:58:42.703+01	2025-12-24 19:58:42.703+01	2026-01-20 19:58:42.703+01	2026-01-16 19:58:42.703+01	\N	Dossier incomplet ou non conforme aux critères requis.	\N	\N	\N	2025-12-18 19:58:42.703+01	2026-01-01 21:20:18.275+01
2d0baa78-aa76-417f-b302-57964c03b63f	PER-2026-00047	PERMIS	222a177a-1027-4909-8da1-1c551c65ffe2	COMPANY	SARL Mining Congo	contact@miningcongo.cd	+243 812 345 678	Avenue de l'Investissement, N°234, Kinshasa	CD/KIN/RCCM/24-A-12345	A1234567X	A123456789	Permis de séjour prolongé	Demande de permis de séjour prolongé pour le compte de SARL Mining Congo. Cette demande concerne les activités dans le secteur transport.	Santé	Haut-Katanga	Bukavu	3917073.00	USD	DRAFT	1	5	URGENT	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-12-17 00:17:17.931+01	2026-01-01 21:20:18.339+01
2c8c0b10-f324-429e-8aef-c73d92c09a7f	AUT-2026-00043	AUTORISATION	b4c4d208-ba0f-4e2f-87ae-0f263fa8a8c7	COMPANY	SARL Mining Congo	contact@miningcongo.cd	+243 812 345 678	Avenue de l'Investissement, N°213, Ituri	CD/KIN/RCCM/24-A-12345	A1234567X	A123456789	Autorisation d'exploitation agricole	Demande de autorisation d'exploitation agricole pour le compte de SARL Mining Congo. Cette demande concerne les activités dans le secteur industrie.	Commerce	Kongo Central	Matadi	3051611.00	USD	UNDER_REVIEW	3	5	URGENT	\N	\N	2025-11-09 19:39:37.858+01	2025-11-17 19:39:37.858+01	2025-12-09 19:39:37.858+01	\N	\N	\N	\N	\N	\N	2025-11-07 19:39:37.858+01	2026-01-01 21:20:18.277+01
cc5a7574-a7b8-4f0f-902c-8be8172df025	AUT-2026-00044	AUTORISATION	b4c4d208-ba0f-4e2f-87ae-0f263fa8a8c7	COMPANY	Société Forestière du Congo	sfc@sfcongo.cd	+243 818 333 444	Avenue de l'Investissement, N°116, Haut-Katanga	CD/EQU/RCCM/24-C-33333	F3333333C	D333333333	Autorisation de transport de marchandises dangereuses	Demande de autorisation de transport de marchandises dangereuses pour le compte de Société Forestière du Congo. Cette demande concerne les activités dans le secteur santé.	Santé	Sud-Kivu	Goma	1233357.00	USD	DRAFT	1	5	HIGH	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-11-13 10:45:13.641+01	2026-01-01 21:20:18.279+01
6861f9f4-737d-489e-a0a1-3fd0064dcd7e	AUT-2026-00045	AUTORISATION	b4c4d208-ba0f-4e2f-87ae-0f263fa8a8c7	COMPANY	Société Forestière du Congo	sfc@sfcongo.cd	+243 818 333 444	Avenue de l'Investissement, N°346, Nord-Kivu	CD/EQU/RCCM/24-C-33333	F3333333C	D333333333	Autorisation d'exercice d'activité commerciale	Demande de autorisation d'exercice d'activité commerciale pour le compte de Société Forestière du Congo. Cette demande concerne les activités dans le secteur transport.	Énergie	Sud-Kivu	Kinshasa	3652552.00	USD	APPROVED	5	5	HIGH	\N	\N	2025-11-22 12:56:51.504+01	2025-11-26 12:56:51.504+01	2025-12-22 12:56:51.504+01	2025-12-14 12:56:51.504+01	Dossier conforme aux exigences réglementaires.	\N	\N	\N	\N	2025-11-21 12:56:51.504+01	2026-01-01 21:20:18.28+01
fe86303b-1c89-4bee-9b1c-de387b8a5155	AUT-2026-00046	AUTORISATION	b4c4d208-ba0f-4e2f-87ae-0f263fa8a8c7	COMPANY	Import Export Lubumbashi	ielub@business.cd	+243 827 777 888	Avenue de l'Investissement, N°400, Kongo Central	CD/LUB/RCCM/24-F-66666	J7777777G	G666666666	Autorisation de transport de marchandises dangereuses	Demande de autorisation de transport de marchandises dangereuses pour le compte de Import Export Lubumbashi. Cette demande concerne les activités dans le secteur transport.	Commerce	Nord-Kivu	Lubumbashi	968960.00	USD	IN_PROGRESS	3	5	NORMAL	\N	\N	2025-10-27 14:40:34.257+01	2025-11-04 14:40:34.257+01	2025-11-26 14:40:34.257+01	\N	\N	\N	\N	\N	\N	2025-10-25 14:40:34.257+01	2026-01-01 21:20:18.283+01
c539a075-12a2-4355-b119-d6e7fc63e334	LIC-2026-00041	LICENCE	b4c4d208-ba0f-4e2f-87ae-0f263fa8a8c7	INDIVIDUAL	Marie Lukusa	mlukusa@outlook.com	+243 991 222 333	Avenue de l'Investissement, N°341, Équateur	\N	E2222222B	\N	Licence de production agroalimentaire	Demande de licence de production agroalimentaire pour le compte de Marie Lukusa. Cette demande concerne les activités dans le secteur santé.	Agriculture	Haut-Katanga	Bukavu	\N	USD	SUBMITTED	1	5	HIGH	\N	\N	2025-11-09 16:21:18.599+01	2025-11-23 16:21:18.599+01	2025-12-09 16:21:18.599+01	\N	\N	\N	\N	\N	\N	2025-11-07 16:21:18.599+01	2026-01-01 21:20:18.285+01
e7250280-fba6-4038-bfc1-e9290ca7c892	LIC-2026-00042	LICENCE	b4c4d208-ba0f-4e2f-87ae-0f263fa8a8c7	INDIVIDUAL	Pierre Mbuyi	pmbuyi@gmail.com	+243 992 555 666	Avenue de l'Investissement, N°94, Haut-Katanga	\N	H5555555E	\N	Licence de production pharmaceutique	Demande de licence de production pharmaceutique pour le compte de Pierre Mbuyi. Cette demande concerne les activités dans le secteur énergie.	Énergie	Sud-Kivu	Kisangani	\N	USD	UNDER_REVIEW	3	5	HIGH	\N	\N	2025-12-02 14:28:10.355+01	2025-12-09 14:28:10.355+01	2026-01-01 14:28:10.355+01	\N	\N	\N	\N	\N	\N	2025-11-30 14:28:10.355+01	2026-01-01 21:20:18.286+01
e902f7d6-0d93-45f3-8751-7ab7238a32f4	LIC-2026-00043	LICENCE	b4c4d208-ba0f-4e2f-87ae-0f263fa8a8c7	INVESTOR	Global Invest RDC	info@globalinvest.cd	+243 815 555 999	Avenue de l'Investissement, N°383, Équateur	CD/KIN/RCCM/24-B-54321	C5432167Z	B987654321	Licence d'exploitation de carrière	Demande de licence d'exploitation de carrière pour le compte de Global Invest RDC. Cette demande concerne les activités dans le secteur environnement.	Transport	Haut-Katanga	Kisangani	2433383.00	USD	DRAFT	1	5	URGENT	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-11-06 19:27:12.635+01	2026-01-01 21:20:18.288+01
0c284fe6-3a18-4896-88f5-3ee2f0f0eb42	LIC-2026-00044	LICENCE	b4c4d208-ba0f-4e2f-87ae-0f263fa8a8c7	COMPANY	SARL Mining Congo	contact@miningcongo.cd	+243 812 345 678	Avenue de l'Investissement, N°285, Haut-Katanga	CD/KIN/RCCM/24-A-12345	A1234567X	A123456789	Licence de production agroalimentaire	Demande de licence de production agroalimentaire pour le compte de SARL Mining Congo. Cette demande concerne les activités dans le secteur environnement.	Énergie	Kongo Central	Kisangani	2653721.00	USD	APPROVED	5	5	URGENT	\N	\N	2025-11-12 06:59:30.472+01	2025-11-19 06:59:30.472+01	2025-12-12 06:59:30.472+01	2025-12-01 06:59:30.472+01	Dossier conforme aux exigences réglementaires.	\N	\N	\N	\N	2025-11-10 06:59:30.472+01	2026-01-01 21:20:18.289+01
8267237e-a0b5-4f75-9c85-944b771ce7d9	LIC-2026-00045	LICENCE	b4c4d208-ba0f-4e2f-87ae-0f263fa8a8c7	COMPANY	SARL Mining Congo	contact@miningcongo.cd	+243 812 345 678	Avenue de l'Investissement, N°359, Kinshasa	CD/KIN/RCCM/24-A-12345	A1234567X	A123456789	Licence de transport public	Demande de licence de transport public pour le compte de SARL Mining Congo. Cette demande concerne les activités dans le secteur transport.	Mines	Kongo Central	Kinshasa	1512442.00	USD	UNDER_REVIEW	4	5	URGENT	\N	\N	2025-11-29 12:47:08.507+01	2025-12-08 12:47:08.507+01	2025-12-29 12:47:08.507+01	\N	\N	\N	\N	\N	\N	2025-11-26 12:47:08.507+01	2026-01-01 21:20:18.292+01
38824810-a58a-4710-b951-e3f2dc665d22	PER-2026-00038	PERMIS	b4c4d208-ba0f-4e2f-87ae-0f263fa8a8c7	COMPANY	Cimenterie du Kongo Central	ciment@ckc.cd	+243 816 666 777	Avenue de l'Investissement, N°255, Équateur	CD/KOC/RCCM/23-E-55555	I6666666F	F555555555	Permis de séjour prolongé	Demande de permis de séjour prolongé pour le compte de Cimenterie du Kongo Central. Cette demande concerne les activités dans le secteur énergie.	Agriculture	Kongo Central	Kananga	1473667.00	USD	PENDING_DOCUMENTS	1	5	NORMAL	\N	\N	2025-11-12 11:36:17.703+01	2025-11-14 11:36:17.703+01	2025-12-12 11:36:17.703+01	\N	\N	\N	\N	\N	\N	2025-11-11 11:36:17.703+01	2026-01-01 21:20:18.294+01
80bf7470-e35d-4389-b5e5-5f9cca02269e	PER-2026-00039	PERMIS	b4c4d208-ba0f-4e2f-87ae-0f263fa8a8c7	COMPANY	SARL Mining Congo	contact@miningcongo.cd	+243 812 345 678	Avenue de l'Investissement, N°35, Haut-Katanga	CD/KIN/RCCM/24-A-12345	A1234567X	A123456789	Permis environnemental - Étude d'impact	Demande de permis environnemental - étude d'impact pour le compte de SARL Mining Congo. Cette demande concerne les activités dans le secteur environnement.	Industrie	Kinshasa	Lubumbashi	2826451.00	USD	REJECTED	5	5	LOW	\N	\N	2025-12-06 21:59:30.624+01	2025-12-12 21:59:30.624+01	2026-01-05 21:59:30.624+01	2026-01-05 21:59:30.624+01	\N	Dossier incomplet ou non conforme aux critères requis.	\N	\N	\N	2025-12-03 21:59:30.624+01	2026-01-01 21:20:18.296+01
b754457f-9a79-4b9e-b5e7-902b6ef6f258	PER-2026-00040	PERMIS	b4c4d208-ba0f-4e2f-87ae-0f263fa8a8c7	INDIVIDUAL	Jean-Pierre Kabongo	jpkabongo@gmail.com	+243 998 765 432	Avenue de l'Investissement, N°113, Ituri	\N	B9876543Y	\N	Permis d'exploitation de débit de boissons	Demande de permis d'exploitation de débit de boissons pour le compte de Jean-Pierre Kabongo. Cette demande concerne les activités dans le secteur transport.	Transport	Nord-Kivu	Matadi	\N	USD	IN_PROGRESS	2	5	HIGH	\N	\N	2025-11-09 01:35:29.853+01	2025-11-20 01:35:29.853+01	2025-12-09 01:35:29.853+01	\N	\N	\N	\N	\N	\N	2025-11-08 01:35:29.853+01	2026-01-01 21:20:18.299+01
3fc987e3-3cbe-425a-935d-a0edd96d3dab	PER-2026-00041	PERMIS	b4c4d208-ba0f-4e2f-87ae-0f263fa8a8c7	COMPANY	SARL Mining Congo	contact@miningcongo.cd	+243 812 345 678	Avenue de l'Investissement, N°329, Ituri	CD/KIN/RCCM/24-A-12345	A1234567X	A123456789	Permis de circulation spéciale	Demande de permis de circulation spéciale pour le compte de SARL Mining Congo. Cette demande concerne les activités dans le secteur transport.	Industrie	Équateur	Lubumbashi	1799331.00	USD	DRAFT	1	5	URGENT	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-11-19 08:35:27.457+01	2026-01-01 21:20:18.3+01
108a9ac5-1c93-4f30-ad95-f3b62b654a11	PER-2026-00042	PERMIS	b4c4d208-ba0f-4e2f-87ae-0f263fa8a8c7	INDIVIDUAL	Marie Lukusa	mlukusa@outlook.com	+243 991 222 333	Avenue de l'Investissement, N°234, Ituri	\N	E2222222B	\N	Permis de construire - Bâtiment industriel	Demande de permis de construire - bâtiment industriel pour le compte de Marie Lukusa. Cette demande concerne les activités dans le secteur mines.	Commerce	Nord-Kivu	Goma	\N	USD	IN_PROGRESS	3	5	NORMAL	\N	\N	2025-12-23 09:29:28.833+01	2026-01-02 09:29:28.833+01	2026-01-22 09:29:28.833+01	\N	\N	\N	\N	\N	\N	2025-12-21 09:29:28.833+01	2026-01-01 21:20:18.301+01
c5e8d54b-3984-469c-95a1-8adaf7d6e21e	PER-2026-00043	PERMIS	b4c4d208-ba0f-4e2f-87ae-0f263fa8a8c7	INVESTOR	Global Invest RDC	info@globalinvest.cd	+243 815 555 999	Avenue de l'Investissement, N°336, Équateur	CD/KIN/RCCM/24-B-54321	C5432167Z	B987654321	Permis de recherche minière	Demande de permis de recherche minière pour le compte de Global Invest RDC. Cette demande concerne les activités dans le secteur agriculture.	Santé	Nord-Kivu	Kinshasa	1167880.00	USD	APPROVED	5	5	HIGH	\N	\N	2025-11-21 13:09:18.087+01	2025-12-05 13:09:18.087+01	2025-12-21 13:09:18.087+01	2025-12-21 13:09:18.087+01	Dossier conforme aux exigences réglementaires.	\N	\N	\N	\N	2025-11-20 13:09:18.087+01	2026-01-01 21:20:18.303+01
c2481a26-45d0-421b-9a69-14b4f3a65c22	PER-2026-00044	PERMIS	b4c4d208-ba0f-4e2f-87ae-0f263fa8a8c7	COMPANY	Société Forestière du Congo	sfc@sfcongo.cd	+243 818 333 444	Avenue de l'Investissement, N°285, Nord-Kivu	CD/EQU/RCCM/24-C-33333	F3333333C	D333333333	Permis environnemental - Étude d'impact	Demande de permis environnemental - étude d'impact pour le compte de Société Forestière du Congo. Cette demande concerne les activités dans le secteur agriculture.	Santé	Ituri	Kisangani	3015455.00	USD	PENDING_DOCUMENTS	1	5	URGENT	\N	\N	2026-01-03 09:34:03.242+01	2026-01-16 09:34:03.242+01	2026-02-02 09:34:03.242+01	\N	\N	\N	\N	\N	\N	2025-12-31 09:34:03.242+01	2026-01-01 21:20:18.306+01
f02bcc5b-db63-4d08-91df-5f2cc7b47532	AUT-2026-00047	AUTORISATION	222a177a-1027-4909-8da1-1c551c65ffe2	COMPANY	Société Forestière du Congo	sfc@sfcongo.cd	+243 818 333 444	Avenue de l'Investissement, N°314, Kinshasa	CD/EQU/RCCM/24-C-33333	F3333333C	D333333333	Autorisation de construction d'une usine	Demande de autorisation de construction d'une usine pour le compte de Société Forestière du Congo. Cette demande concerne les activités dans le secteur commerce.	Agriculture	Équateur	Goma	4901149.00	USD	SUBMITTED	1	5	NORMAL	\N	\N	2025-12-23 01:25:48.338+01	2025-12-29 01:25:48.338+01	2026-01-22 01:25:48.338+01	\N	\N	\N	\N	\N	\N	2025-12-21 01:25:48.338+01	2026-01-01 21:20:18.314+01
b9d0f070-5889-413f-8e5d-df2703652097	AUT-2026-00048	AUTORISATION	222a177a-1027-4909-8da1-1c551c65ffe2	COMPANY	Import Export Lubumbashi	ielub@business.cd	+243 827 777 888	Avenue de l'Investissement, N°138, Kasaï	CD/LUB/RCCM/24-F-66666	J7777777G	G666666666	Autorisation d'installation de panneaux solaires	Demande de autorisation d'installation de panneaux solaires pour le compte de Import Export Lubumbashi. Cette demande concerne les activités dans le secteur transport.	Industrie	Équateur	Kananga	52275.00	USD	UNDER_REVIEW	2	5	HIGH	\N	\N	2025-11-20 14:26:11.325+01	2025-11-27 14:26:11.325+01	2025-12-20 14:26:11.325+01	\N	\N	\N	\N	\N	\N	2025-11-18 14:26:11.325+01	2026-01-01 21:20:18.315+01
3ff483a8-95f0-43ec-85ad-b8abc0d9dc59	AUT-2026-00049	AUTORISATION	222a177a-1027-4909-8da1-1c551c65ffe2	INDIVIDUAL	Jean-Pierre Kabongo	jpkabongo@gmail.com	+243 998 765 432	Avenue de l'Investissement, N°160, Équateur	\N	B9876543Y	\N	Autorisation de forage de puits	Demande de autorisation de forage de puits pour le compte de Jean-Pierre Kabongo. Cette demande concerne les activités dans le secteur transport.	Énergie	Sud-Kivu	Kisangani	\N	USD	DRAFT	1	5	NORMAL	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-10-20 23:27:01.439+01	2026-01-01 21:20:18.317+01
0c08ef4c-283d-49af-bf64-e3d89ce0d58c	AUT-2026-00050	AUTORISATION	222a177a-1027-4909-8da1-1c551c65ffe2	COMPANY	Tech Solutions Kinshasa	contact@techsol.cd	+243 825 444 555	Avenue de l'Investissement, N°412, Kongo Central	CD/KIN/RCCM/24-D-44444	G4444444D	E444444444	Autorisation d'importation de matériel industriel	Demande de autorisation d'importation de matériel industriel pour le compte de Tech Solutions Kinshasa. Cette demande concerne les activités dans le secteur mines.	Transport	Ituri	Mbuji-Mayi	2201296.00	USD	UNDER_REVIEW	2	5	URGENT	\N	\N	2025-11-29 22:00:02.1+01	2025-12-05 22:00:02.1+01	2025-12-29 22:00:02.1+01	\N	\N	\N	\N	\N	\N	2025-11-26 22:00:02.1+01	2026-01-01 21:20:18.318+01
5bf2dca4-c866-4f69-854c-11bd9205401e	LIC-2026-00046	LICENCE	222a177a-1027-4909-8da1-1c551c65ffe2	INDIVIDUAL	Pierre Mbuyi	pmbuyi@gmail.com	+243 992 555 666	Avenue de l'Investissement, N°171, Ituri	\N	H5555555E	\N	Licence de production pharmaceutique	Demande de licence de production pharmaceutique pour le compte de Pierre Mbuyi. Cette demande concerne les activités dans le secteur transport.	Agriculture	Équateur	Kinshasa	\N	USD	PENDING_DOCUMENTS	2	5	HIGH	\N	\N	2025-10-30 14:50:15.668+01	2025-11-08 14:50:15.668+01	2025-11-29 14:50:15.668+01	\N	\N	\N	\N	\N	\N	2025-10-28 14:50:15.668+01	2026-01-01 21:20:18.319+01
2775f504-4c69-4422-81d9-5a8157f45132	LIC-2026-00047	LICENCE	222a177a-1027-4909-8da1-1c551c65ffe2	COMPANY	Import Export Lubumbashi	ielub@business.cd	+243 827 777 888	Avenue de l'Investissement, N°87, Kasaï	CD/LUB/RCCM/24-F-66666	J7777777G	G666666666	Licence de production pharmaceutique	Demande de licence de production pharmaceutique pour le compte de Import Export Lubumbashi. Cette demande concerne les activités dans le secteur santé.	Transport	Kongo Central	Bukavu	1816367.00	USD	REJECTED	5	5	NORMAL	\N	\N	2025-10-08 16:09:50.723+01	2025-10-22 16:09:50.723+01	2025-11-07 16:09:50.723+01	2025-10-25 16:09:50.723+01	\N	Dossier incomplet ou non conforme aux critères requis.	\N	\N	\N	2025-10-07 16:09:50.723+01	2026-01-01 21:20:18.321+01
2cbdf9de-34bd-4001-a373-95e12cf37aa3	LIC-2026-00048	LICENCE	222a177a-1027-4909-8da1-1c551c65ffe2	COMPANY	Import Export Lubumbashi	ielub@business.cd	+243 827 777 888	Avenue de l'Investissement, N°430, Ituri	CD/LUB/RCCM/24-F-66666	J7777777G	G666666666	Licence de pêche industrielle	Demande de licence de pêche industrielle pour le compte de Import Export Lubumbashi. Cette demande concerne les activités dans le secteur commerce.	Industrie	Sud-Kivu	Kananga	3172761.00	USD	SUBMITTED	1	5	NORMAL	\N	\N	2025-10-09 05:29:15.198+01	2025-10-23 05:29:15.198+01	2025-11-08 05:29:15.198+01	\N	\N	\N	\N	\N	\N	2025-10-08 05:29:15.198+01	2026-01-01 21:20:18.324+01
cca96c0c-0530-4a68-951b-21b5dad671b2	LIC-2026-00049	LICENCE	222a177a-1027-4909-8da1-1c551c65ffe2	COMPANY	Entreprise Agricole du Kasai	agrikasai@yahoo.fr	+243 820 111 222	Avenue de l'Investissement, N°154, Sud-Kivu	CD/KAS/RCCM/23-A-11111	D1111111A	C111111111	Licence de pêche industrielle	Demande de licence de pêche industrielle pour le compte de Entreprise Agricole du Kasai. Cette demande concerne les activités dans le secteur énergie.	Santé	Kongo Central	Mbuji-Mayi	4646582.00	USD	IN_PROGRESS	2	5	NORMAL	\N	\N	2025-11-16 07:38:32.386+01	2025-11-27 07:38:32.386+01	2025-12-16 07:38:32.386+01	\N	\N	\N	\N	\N	\N	2025-11-14 07:38:32.386+01	2026-01-01 21:20:18.325+01
ccdace65-0e30-42cf-8874-fea1539b10ce	LIC-2026-00050	LICENCE	222a177a-1027-4909-8da1-1c551c65ffe2	COMPANY	SARL Mining Congo	contact@miningcongo.cd	+243 812 345 678	Avenue de l'Investissement, N°411, Équateur	CD/KIN/RCCM/24-A-12345	A1234567X	A123456789	Licence d'exploitation forestière	Demande de licence d'exploitation forestière pour le compte de SARL Mining Congo. Cette demande concerne les activités dans le secteur transport.	Santé	Nord-Kivu	Mbuji-Mayi	1460101.00	USD	PENDING_DOCUMENTS	1	5	LOW	\N	\N	2025-10-27 02:44:10.745+01	2025-10-29 02:44:10.745+01	2025-11-26 02:44:10.745+01	\N	\N	\N	\N	\N	\N	2025-10-26 02:44:10.745+01	2026-01-01 21:20:18.327+01
13b28d75-40cb-43d4-b009-b86edcacb5ba	LIC-2026-00051	LICENCE	222a177a-1027-4909-8da1-1c551c65ffe2	INVESTOR	Global Invest RDC	info@globalinvest.cd	+243 815 555 999	Avenue de l'Investissement, N°268, Nord-Kivu	CD/KIN/RCCM/24-B-54321	C5432167Z	B987654321	Licence de production agroalimentaire	Demande de licence de production agroalimentaire pour le compte de Global Invest RDC. Cette demande concerne les activités dans le secteur transport.	Énergie	Kasaï	Kananga	1291062.00	USD	SUBMITTED	1	5	LOW	\N	\N	2025-10-13 17:50:28.163+01	2025-10-20 17:50:28.163+01	2025-11-12 17:50:28.163+01	\N	\N	\N	\N	\N	\N	2025-10-10 17:50:28.163+01	2026-01-01 21:20:18.328+01
7fa57d6e-fe37-476d-8fe3-47bd695cc5d1	LIC-2026-00052	LICENCE	222a177a-1027-4909-8da1-1c551c65ffe2	INDIVIDUAL	Marie Lukusa	mlukusa@outlook.com	+243 991 222 333	Avenue de l'Investissement, N°112, Nord-Kivu	\N	E2222222B	\N	Licence de télécommunications	Demande de licence de télécommunications pour le compte de Marie Lukusa. Cette demande concerne les activités dans le secteur santé.	Environnement	Kinshasa	Bukavu	\N	USD	UNDER_REVIEW	4	5	LOW	\N	\N	2025-12-22 22:56:08.009+01	2026-01-05 22:56:08.009+01	2026-01-21 22:56:08.009+01	\N	\N	\N	\N	\N	\N	2025-12-20 22:56:08.009+01	2026-01-01 21:20:18.33+01
b6646f80-496f-4b14-90b3-c8c330f2c0d7	LIC-2026-00053	LICENCE	222a177a-1027-4909-8da1-1c551c65ffe2	COMPANY	SARL Mining Congo	contact@miningcongo.cd	+243 812 345 678	Avenue de l'Investissement, N°93, Haut-Katanga	CD/KIN/RCCM/24-A-12345	A1234567X	A123456789	Licence de transport public	Demande de licence de transport public pour le compte de SARL Mining Congo. Cette demande concerne les activités dans le secteur industrie.	Mines	Kinshasa	Bukavu	3159902.00	USD	REJECTED	5	5	LOW	\N	\N	2025-12-02 02:26:38.614+01	2025-12-12 02:26:38.614+01	2026-01-01 02:26:38.614+01	2025-12-15 02:26:38.614+01	\N	Dossier incomplet ou non conforme aux critères requis.	\N	\N	\N	2025-11-30 02:26:38.614+01	2026-01-01 21:20:18.332+01
f5d10a15-8205-4980-ba1b-8cb7cc910aea	PER-2026-00045	PERMIS	222a177a-1027-4909-8da1-1c551c65ffe2	COMPANY	Tech Solutions Kinshasa	contact@techsol.cd	+243 825 444 555	Avenue de l'Investissement, N°145, Kasaï	CD/KIN/RCCM/24-D-44444	G4444444D	E444444444	Permis de circulation spéciale	Demande de permis de circulation spéciale pour le compte de Tech Solutions Kinshasa. Cette demande concerne les activités dans le secteur énergie.	Commerce	Ituri	Bukavu	752625.00	USD	REJECTED	5	5	HIGH	\N	\N	2025-11-30 09:23:41.263+01	2025-12-02 09:23:41.263+01	2025-12-30 09:23:41.263+01	2025-12-12 09:23:41.263+01	\N	Dossier incomplet ou non conforme aux critères requis.	\N	\N	\N	2025-11-27 09:23:41.263+01	2026-01-01 21:20:18.335+01
a7a9b1e6-02eb-4327-94dd-c4bc25d6662a	PER-2026-00046	PERMIS	222a177a-1027-4909-8da1-1c551c65ffe2	INDIVIDUAL	Pierre Mbuyi	pmbuyi@gmail.com	+243 992 555 666	Avenue de l'Investissement, N°311, Ituri	\N	H5555555E	\N	Permis sanitaire d'établissement	Demande de permis sanitaire d'établissement pour le compte de Pierre Mbuyi. Cette demande concerne les activités dans le secteur santé.	Énergie	Haut-Katanga	Mbuji-Mayi	\N	USD	IN_PROGRESS	4	5	LOW	\N	\N	2025-12-28 04:19:47.42+01	2026-01-01 04:19:47.42+01	2026-01-27 04:19:47.42+01	\N	\N	\N	\N	\N	\N	2025-12-27 04:19:47.42+01	2026-01-01 21:20:18.337+01
98025983-6a4a-451b-b6ea-464b313cb2d5	PER-2026-00048	PERMIS	222a177a-1027-4909-8da1-1c551c65ffe2	COMPANY	Import Export Lubumbashi	ielub@business.cd	+243 827 777 888	Avenue de l'Investissement, N°411, Nord-Kivu	CD/LUB/RCCM/24-F-66666	J7777777G	G666666666	Permis de recherche minière	Demande de permis de recherche minière pour le compte de Import Export Lubumbashi. Cette demande concerne les activités dans le secteur transport.	Commerce	Kinshasa	Bukavu	4581316.00	USD	PENDING_DOCUMENTS	3	5	LOW	\N	\N	2025-11-02 23:01:23.628+01	2025-11-12 23:01:23.628+01	2025-12-02 23:01:23.628+01	\N	\N	\N	\N	\N	\N	2025-10-30 23:01:23.628+01	2026-01-01 21:20:18.34+01
bc3198c3-ae13-44b7-97d5-feb9eb110d22	PER-2026-00049	PERMIS	222a177a-1027-4909-8da1-1c551c65ffe2	COMPANY	SARL Mining Congo	contact@miningcongo.cd	+243 812 345 678	Avenue de l'Investissement, N°48, Équateur	CD/KIN/RCCM/24-A-12345	A1234567X	A123456789	Permis d'exploitation de débit de boissons	Demande de permis d'exploitation de débit de boissons pour le compte de SARL Mining Congo. Cette demande concerne les activités dans le secteur santé.	Commerce	Équateur	Kisangani	2214085.00	USD	REJECTED	5	5	LOW	\N	\N	2025-12-10 11:55:29.327+01	2025-12-17 11:55:29.327+01	2026-01-09 11:55:29.327+01	2025-12-24 11:55:29.327+01	\N	Dossier incomplet ou non conforme aux critères requis.	\N	\N	\N	2025-12-07 11:55:29.327+01	2026-01-01 21:20:18.343+01
4ceaca4f-ad1e-4fb0-9001-e07e613bbbb7	AUT-2026-00051	AUTORISATION	73c13713-92e7-4613-99f6-ef83b9a7fa4d	COMPANY	Tech Solutions Kinshasa	contact@techsol.cd	+243 825 444 555	Avenue de l'Investissement, N°443, Kasaï	CD/KIN/RCCM/24-D-44444	G4444444D	E444444444	Autorisation de transport de marchandises dangereuses	Demande de autorisation de transport de marchandises dangereuses pour le compte de Tech Solutions Kinshasa. Cette demande concerne les activités dans le secteur mines.	Transport	Kongo Central	Matadi	871443.00	USD	DRAFT	1	5	URGENT	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-11-24 22:20:33.427+01	2026-01-01 21:20:18.353+01
4525a8b2-ddcd-46d7-b46b-36efea747713	AUT-2026-00052	AUTORISATION	73c13713-92e7-4613-99f6-ef83b9a7fa4d	INDIVIDUAL	Pierre Mbuyi	pmbuyi@gmail.com	+243 992 555 666	Avenue de l'Investissement, N°364, Haut-Katanga	\N	H5555555E	\N	Autorisation de forage de puits	Demande de autorisation de forage de puits pour le compte de Pierre Mbuyi. Cette demande concerne les activités dans le secteur énergie.	Commerce	Haut-Katanga	Matadi	\N	USD	APPROVED	5	5	URGENT	\N	\N	2025-10-23 11:39:10.759+01	2025-11-05 11:39:10.759+01	2025-11-22 11:39:10.759+01	2025-11-03 11:39:10.759+01	Dossier conforme aux exigences réglementaires.	\N	\N	\N	\N	2025-10-20 11:39:10.759+01	2026-01-01 21:20:18.354+01
1609a724-7fda-4bf2-b145-11597a6dc7e3	AUT-2026-00053	AUTORISATION	73c13713-92e7-4613-99f6-ef83b9a7fa4d	INVESTOR	Global Invest RDC	info@globalinvest.cd	+243 815 555 999	Avenue de l'Investissement, N°424, Nord-Kivu	CD/KIN/RCCM/24-B-54321	C5432167Z	B987654321	Autorisation d'exploitation minière artisanale	Demande de autorisation d'exploitation minière artisanale pour le compte de Global Invest RDC. Cette demande concerne les activités dans le secteur industrie.	Transport	Ituri	Lubumbashi	3577830.00	USD	IN_PROGRESS	4	5	URGENT	\N	\N	2025-11-09 18:19:48.668+01	2025-11-15 18:19:48.668+01	2025-12-09 18:19:48.668+01	\N	\N	\N	\N	\N	\N	2025-11-08 18:19:48.668+01	2026-01-01 21:20:18.357+01
07b01ddf-5751-48a1-86e0-87d1f3d78333	AUT-2026-00054	AUTORISATION	73c13713-92e7-4613-99f6-ef83b9a7fa4d	COMPANY	Cimenterie du Kongo Central	ciment@ckc.cd	+243 816 666 777	Avenue de l'Investissement, N°328, Kasaï	CD/KOC/RCCM/23-E-55555	I6666666F	F555555555	Autorisation d'exploitation agricole	Demande de autorisation d'exploitation agricole pour le compte de Cimenterie du Kongo Central. Cette demande concerne les activités dans le secteur industrie.	Industrie	Haut-Katanga	Lubumbashi	166167.00	USD	IN_PROGRESS	4	5	URGENT	\N	\N	2025-10-07 05:01:59.319+01	2025-10-09 05:01:59.319+01	2025-11-06 05:01:59.319+01	\N	\N	\N	\N	\N	\N	2025-10-05 05:01:59.319+01	2026-01-01 21:20:18.359+01
e331f5ef-bfc1-498e-b125-18ec9fc7387d	LIC-2026-00054	LICENCE	73c13713-92e7-4613-99f6-ef83b9a7fa4d	COMPANY	Cimenterie du Kongo Central	ciment@ckc.cd	+243 816 666 777	Avenue de l'Investissement, N°476, Sud-Kivu	CD/KOC/RCCM/23-E-55555	I6666666F	F555555555	Licence d'importation de produits pétroliers	Demande de licence d'importation de produits pétroliers pour le compte de Cimenterie du Kongo Central. Cette demande concerne les activités dans le secteur commerce.	Transport	Nord-Kivu	Matadi	2018264.00	USD	IN_PROGRESS	2	5	URGENT	\N	\N	2025-11-15 21:05:55.866+01	2025-11-17 21:05:55.866+01	2025-12-15 21:05:55.866+01	\N	\N	\N	\N	\N	\N	2025-11-13 21:05:55.866+01	2026-01-01 21:20:18.362+01
63dcce6b-4e9b-425e-a817-45ca44d10f5c	LIC-2026-00055	LICENCE	73c13713-92e7-4613-99f6-ef83b9a7fa4d	COMPANY	Tech Solutions Kinshasa	contact@techsol.cd	+243 825 444 555	Avenue de l'Investissement, N°301, Kongo Central	CD/KIN/RCCM/24-D-44444	G4444444D	E444444444	Licence d'importation de produits pétroliers	Demande de licence d'importation de produits pétroliers pour le compte de Tech Solutions Kinshasa. Cette demande concerne les activités dans le secteur commerce.	Industrie	Haut-Katanga	Goma	4335774.00	USD	IN_PROGRESS	4	5	URGENT	\N	\N	2025-10-17 06:40:31.294+01	2025-10-26 06:40:31.294+01	2025-11-16 06:40:31.294+01	\N	\N	\N	\N	\N	\N	2025-10-16 06:40:31.294+01	2026-01-01 21:20:18.363+01
25cce765-887e-4282-bd30-e5e17760d9fe	LIC-2026-00056	LICENCE	73c13713-92e7-4613-99f6-ef83b9a7fa4d	INDIVIDUAL	Pierre Mbuyi	pmbuyi@gmail.com	+243 992 555 666	Avenue de l'Investissement, N°56, Ituri	\N	H5555555E	\N	Licence de transport public	Demande de licence de transport public pour le compte de Pierre Mbuyi. Cette demande concerne les activités dans le secteur industrie.	Environnement	Nord-Kivu	Matadi	\N	USD	DRAFT	1	5	LOW	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-11-04 07:34:50.45+01	2026-01-01 21:20:18.366+01
a8c6099f-4a0b-4c4c-84f0-837102d5b5c3	LIC-2026-00057	LICENCE	73c13713-92e7-4613-99f6-ef83b9a7fa4d	INDIVIDUAL	Jean-Pierre Kabongo	jpkabongo@gmail.com	+243 998 765 432	Avenue de l'Investissement, N°362, Haut-Katanga	\N	B9876543Y	\N	Licence de télécommunications	Demande de licence de télécommunications pour le compte de Jean-Pierre Kabongo. Cette demande concerne les activités dans le secteur énergie.	Agriculture	Kasaï	Kananga	\N	USD	UNDER_REVIEW	2	5	URGENT	\N	\N	2025-12-28 02:21:28.651+01	2026-01-06 02:21:28.651+01	2026-01-27 02:21:28.651+01	\N	\N	\N	\N	\N	\N	2025-12-27 02:21:28.651+01	2026-01-01 21:20:18.367+01
e3765d6d-20c7-4146-95ae-770c69c03f5a	LIC-2026-00058	LICENCE	73c13713-92e7-4613-99f6-ef83b9a7fa4d	COMPANY	Cimenterie du Kongo Central	ciment@ckc.cd	+243 816 666 777	Avenue de l'Investissement, N°110, Ituri	CD/KOC/RCCM/23-E-55555	I6666666F	F555555555	Licence de télécommunications	Demande de licence de télécommunications pour le compte de Cimenterie du Kongo Central. Cette demande concerne les activités dans le secteur santé.	Environnement	Équateur	Kananga	4816038.00	USD	REJECTED	5	5	NORMAL	\N	\N	2025-11-07 05:09:40.679+01	2025-11-17 05:09:40.679+01	2025-12-07 05:09:40.679+01	2025-11-20 05:09:40.679+01	\N	Dossier incomplet ou non conforme aux critères requis.	\N	\N	\N	2025-11-04 05:09:40.679+01	2026-01-01 21:20:18.369+01
4621ff2d-654c-4a51-9556-46279227beb1	LIC-2026-00059	LICENCE	73c13713-92e7-4613-99f6-ef83b9a7fa4d	COMPANY	Société Forestière du Congo	sfc@sfcongo.cd	+243 818 333 444	Avenue de l'Investissement, N°28, Kinshasa	CD/EQU/RCCM/24-C-33333	F3333333C	D333333333	Licence d'exploitation de carrière	Demande de licence d'exploitation de carrière pour le compte de Société Forestière du Congo. Cette demande concerne les activités dans le secteur santé.	Mines	Haut-Katanga	Kisangani	1881777.00	USD	REJECTED	5	5	HIGH	\N	\N	2025-11-23 12:13:00.238+01	2025-12-03 12:13:00.238+01	2025-12-23 12:13:00.238+01	2025-11-30 12:13:00.238+01	\N	Dossier incomplet ou non conforme aux critères requis.	\N	\N	\N	2025-11-21 12:13:00.238+01	2026-01-01 21:20:18.371+01
5fd395da-1ff2-48cc-8926-8cbd6085ea6e	PER-2026-00050	PERMIS	73c13713-92e7-4613-99f6-ef83b9a7fa4d	COMPANY	SARL Mining Congo	contact@miningcongo.cd	+243 812 345 678	Avenue de l'Investissement, N°375, Kongo Central	CD/KIN/RCCM/24-A-12345	A1234567X	A123456789	Permis d'exploitation de débit de boissons	Demande de permis d'exploitation de débit de boissons pour le compte de SARL Mining Congo. Cette demande concerne les activités dans le secteur mines.	Mines	Kinshasa	Kinshasa	3043416.00	USD	PENDING_DOCUMENTS	3	5	LOW	\N	\N	2025-10-23 09:33:27.833+01	2025-10-24 09:33:27.833+01	2025-11-22 09:33:27.833+01	\N	\N	\N	\N	\N	\N	2025-10-22 09:33:27.833+01	2026-01-01 21:20:18.374+01
98ada3eb-e1bc-4466-82ff-cb7d54d4a88e	PER-2026-00051	PERMIS	73c13713-92e7-4613-99f6-ef83b9a7fa4d	INDIVIDUAL	Jean-Pierre Kabongo	jpkabongo@gmail.com	+243 998 765 432	Avenue de l'Investissement, N°268, Kongo Central	\N	B9876543Y	\N	Permis environnemental - Étude d'impact	Demande de permis environnemental - étude d'impact pour le compte de Jean-Pierre Kabongo. Cette demande concerne les activités dans le secteur agriculture.	Industrie	Nord-Kivu	Kisangani	\N	USD	PENDING_DOCUMENTS	3	5	NORMAL	\N	\N	2025-11-08 05:37:56.239+01	2025-11-15 05:37:56.239+01	2025-12-08 05:37:56.239+01	\N	\N	\N	\N	\N	\N	2025-11-05 05:37:56.239+01	2026-01-01 21:20:18.376+01
1382903c-4d8e-46ef-af75-1259283a01dd	PER-2026-00052	PERMIS	73c13713-92e7-4613-99f6-ef83b9a7fa4d	INDIVIDUAL	Pierre Mbuyi	pmbuyi@gmail.com	+243 992 555 666	Avenue de l'Investissement, N°140, Kasaï	\N	H5555555E	\N	Permis de travail pour expatriés	Demande de permis de travail pour expatriés pour le compte de Pierre Mbuyi. Cette demande concerne les activités dans le secteur transport.	Environnement	Nord-Kivu	Kinshasa	\N	USD	DRAFT	1	5	LOW	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-10-24 03:00:51.871+01	2026-01-01 21:20:18.378+01
a4beb241-ac54-4959-a758-a5f7b2889315	PER-2026-00053	PERMIS	73c13713-92e7-4613-99f6-ef83b9a7fa4d	INVESTOR	Global Invest RDC	info@globalinvest.cd	+243 815 555 999	Avenue de l'Investissement, N°140, Nord-Kivu	CD/KIN/RCCM/24-B-54321	C5432167Z	B987654321	Permis de circulation spéciale	Demande de permis de circulation spéciale pour le compte de Global Invest RDC. Cette demande concerne les activités dans le secteur environnement.	Santé	Kasaï	Matadi	408988.00	USD	IN_PROGRESS	3	5	HIGH	\N	\N	2025-11-04 12:01:07.528+01	2025-11-14 12:01:07.528+01	2025-12-04 12:01:07.528+01	\N	\N	\N	\N	\N	\N	2025-11-01 12:01:07.528+01	2026-01-01 21:20:18.379+01
107daed2-0922-4566-8b57-7943e54437fb	PER-2026-00054	PERMIS	73c13713-92e7-4613-99f6-ef83b9a7fa4d	COMPANY	Cimenterie du Kongo Central	ciment@ckc.cd	+243 816 666 777	Avenue de l'Investissement, N°300, Équateur	CD/KOC/RCCM/23-E-55555	I6666666F	F555555555	Permis de circulation spéciale	Demande de permis de circulation spéciale pour le compte de Cimenterie du Kongo Central. Cette demande concerne les activités dans le secteur mines.	Santé	Équateur	Mbuji-Mayi	2358382.00	USD	DRAFT	1	5	LOW	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-10-09 07:18:21.288+01	2026-01-01 21:20:18.38+01
bdb9f683-2418-4201-a800-894ae24c086c	PER-2026-00055	PERMIS	73c13713-92e7-4613-99f6-ef83b9a7fa4d	COMPANY	Entreprise Agricole du Kasai	agrikasai@yahoo.fr	+243 820 111 222	Avenue de l'Investissement, N°276, Haut-Katanga	CD/KAS/RCCM/23-A-11111	D1111111A	C111111111	Permis d'exploitation de débit de boissons	Demande de permis d'exploitation de débit de boissons pour le compte de Entreprise Agricole du Kasai. Cette demande concerne les activités dans le secteur mines.	Environnement	Haut-Katanga	Kisangani	1710807.00	USD	DRAFT	1	5	HIGH	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-12-30 22:45:26.16+01	2026-01-01 21:20:18.381+01
9be6508d-ad3f-437e-b259-6254b75c8380	PER-2026-00056	PERMIS	73c13713-92e7-4613-99f6-ef83b9a7fa4d	INVESTOR	Global Invest RDC	info@globalinvest.cd	+243 815 555 999	Avenue de l'Investissement, N°16, Haut-Katanga	CD/KIN/RCCM/24-B-54321	C5432167Z	B987654321	Permis sanitaire d'établissement	Demande de permis sanitaire d'établissement pour le compte de Global Invest RDC. Cette demande concerne les activités dans le secteur agriculture.	Agriculture	Nord-Kivu	Matadi	4841235.00	USD	UNDER_REVIEW	2	5	URGENT	\N	\N	2025-10-25 22:53:21.229+01	2025-11-07 22:53:21.229+01	2025-11-24 22:53:21.229+01	\N	\N	\N	\N	\N	\N	2025-10-22 22:53:21.229+01	2026-01-01 21:20:18.382+01
7e07824a-30d2-4688-a021-12671fad9ab2	PER-2026-00057	PERMIS	73c13713-92e7-4613-99f6-ef83b9a7fa4d	COMPANY	Société Forestière du Congo	sfc@sfcongo.cd	+243 818 333 444	Avenue de l'Investissement, N°6, Kinshasa	CD/EQU/RCCM/24-C-33333	F3333333C	D333333333	Permis d'exploitation de débit de boissons	Demande de permis d'exploitation de débit de boissons pour le compte de Société Forestière du Congo. Cette demande concerne les activités dans le secteur mines.	Mines	Kasaï	Lubumbashi	1852404.00	USD	REJECTED	5	5	HIGH	\N	\N	2025-11-03 23:50:32.904+01	2025-11-12 23:50:32.904+01	2025-12-03 23:50:32.904+01	2025-11-14 23:50:32.904+01	\N	Dossier incomplet ou non conforme aux critères requis.	\N	\N	\N	2025-10-31 23:50:32.904+01	2026-01-01 21:20:18.383+01
069a571b-c66c-40c4-b0d5-b8bf7c29e5f5	AUT-2026-00055	AUTORISATION	d0fac2fe-221e-455a-a6c4-b79449054fbd	COMPANY	Import Export Lubumbashi	ielub@business.cd	+243 827 777 888	Avenue de l'Investissement, N°34, Nord-Kivu	CD/LUB/RCCM/24-F-66666	J7777777G	G666666666	Autorisation d'importation de matériel industriel	Demande de autorisation d'importation de matériel industriel pour le compte de Import Export Lubumbashi. Cette demande concerne les activités dans le secteur mines.	Industrie	Équateur	Bukavu	677844.00	USD	SUBMITTED	1	5	LOW	\N	\N	2025-12-16 23:37:28.503+01	2025-12-29 23:37:28.503+01	2026-01-15 23:37:28.503+01	\N	\N	\N	\N	\N	\N	2025-12-14 23:37:28.503+01	2026-01-01 21:20:18.392+01
2056bdaa-a81e-4249-ac69-94097b5a17a4	AUT-2026-00056	AUTORISATION	d0fac2fe-221e-455a-a6c4-b79449054fbd	COMPANY	Import Export Lubumbashi	ielub@business.cd	+243 827 777 888	Avenue de l'Investissement, N°315, Kasaï	CD/LUB/RCCM/24-F-66666	J7777777G	G666666666	Autorisation de forage de puits	Demande de autorisation de forage de puits pour le compte de Import Export Lubumbashi. Cette demande concerne les activités dans le secteur énergie.	Énergie	Équateur	Lubumbashi	4702027.00	USD	REJECTED	5	5	URGENT	\N	\N	2025-12-28 12:23:49.394+01	2026-01-05 12:23:49.394+01	2026-01-27 12:23:49.394+01	2026-01-17 12:23:49.394+01	\N	Dossier incomplet ou non conforme aux critères requis.	\N	\N	\N	2025-12-25 12:23:49.394+01	2026-01-01 21:20:18.393+01
49b97aa5-6a9d-40e3-a439-eec373ab2f1f	AUT-2026-00057	AUTORISATION	d0fac2fe-221e-455a-a6c4-b79449054fbd	COMPANY	Import Export Lubumbashi	ielub@business.cd	+243 827 777 888	Avenue de l'Investissement, N°107, Nord-Kivu	CD/LUB/RCCM/24-F-66666	J7777777G	G666666666	Autorisation de transport de marchandises dangereuses	Demande de autorisation de transport de marchandises dangereuses pour le compte de Import Export Lubumbashi. Cette demande concerne les activités dans le secteur mines.	Environnement	Nord-Kivu	Mbuji-Mayi	4427799.00	USD	PENDING_DOCUMENTS	2	5	URGENT	\N	\N	2025-11-18 05:59:36.503+01	2025-11-24 05:59:36.503+01	2025-12-18 05:59:36.503+01	\N	\N	\N	\N	\N	\N	2025-11-15 05:59:36.503+01	2026-01-01 21:20:18.396+01
2399b507-2a7f-460a-a834-9ce346522fdc	AUT-2026-00058	AUTORISATION	d0fac2fe-221e-455a-a6c4-b79449054fbd	COMPANY	SARL Mining Congo	contact@miningcongo.cd	+243 812 345 678	Avenue de l'Investissement, N°151, Sud-Kivu	CD/KIN/RCCM/24-A-12345	A1234567X	A123456789	Autorisation de forage de puits	Demande de autorisation de forage de puits pour le compte de SARL Mining Congo. Cette demande concerne les activités dans le secteur agriculture.	Santé	Sud-Kivu	Bukavu	2317653.00	USD	REJECTED	5	5	LOW	\N	\N	2025-10-28 05:36:27.416+01	2025-11-06 05:36:27.416+01	2025-11-27 05:36:27.416+01	2025-11-27 05:36:27.416+01	\N	Dossier incomplet ou non conforme aux critères requis.	\N	\N	\N	2025-10-26 05:36:27.416+01	2026-01-01 21:20:18.397+01
f71e8bbd-06e9-40fe-b09d-1de951470e85	LIC-2026-00060	LICENCE	d0fac2fe-221e-455a-a6c4-b79449054fbd	INVESTOR	Global Invest RDC	info@globalinvest.cd	+243 815 555 999	Avenue de l'Investissement, N°442, Kinshasa	CD/KIN/RCCM/24-B-54321	C5432167Z	B987654321	Licence de production pharmaceutique	Demande de licence de production pharmaceutique pour le compte de Global Invest RDC. Cette demande concerne les activités dans le secteur mines.	Mines	Équateur	Bukavu	4993530.00	USD	DRAFT	1	5	HIGH	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-11-20 15:25:35.388+01	2026-01-01 21:20:18.4+01
c2342823-242f-4699-8b8f-03eb1123f1ae	LIC-2026-00061	LICENCE	d0fac2fe-221e-455a-a6c4-b79449054fbd	INDIVIDUAL	Jean-Pierre Kabongo	jpkabongo@gmail.com	+243 998 765 432	Avenue de l'Investissement, N°132, Kongo Central	\N	B9876543Y	\N	Licence d'exploitation de carrière	Demande de licence d'exploitation de carrière pour le compte de Jean-Pierre Kabongo. Cette demande concerne les activités dans le secteur santé.	Commerce	Haut-Katanga	Matadi	\N	USD	IN_PROGRESS	4	5	HIGH	\N	\N	2025-11-19 02:55:00.892+01	2025-12-01 02:55:00.892+01	2025-12-19 02:55:00.892+01	\N	\N	\N	\N	\N	\N	2025-11-17 02:55:00.892+01	2026-01-01 21:20:18.401+01
9db82d25-6892-4ce4-95f0-16054f7af9c3	LIC-2026-00062	LICENCE	d0fac2fe-221e-455a-a6c4-b79449054fbd	COMPANY	Tech Solutions Kinshasa	contact@techsol.cd	+243 825 444 555	Avenue de l'Investissement, N°214, Nord-Kivu	CD/KIN/RCCM/24-D-44444	G4444444D	E444444444	Licence de pêche industrielle	Demande de licence de pêche industrielle pour le compte de Tech Solutions Kinshasa. Cette demande concerne les activités dans le secteur santé.	Industrie	Nord-Kivu	Matadi	4596175.00	USD	REJECTED	5	5	HIGH	\N	\N	2025-12-31 13:15:27.768+01	2026-01-04 13:15:27.768+01	2026-01-30 13:15:27.768+01	2026-01-25 13:15:27.768+01	\N	Dossier incomplet ou non conforme aux critères requis.	\N	\N	\N	2025-12-28 13:15:27.768+01	2026-01-01 21:20:18.403+01
4872d372-b478-4a26-8c97-f6a66e108c61	LIC-2026-00063	LICENCE	d0fac2fe-221e-455a-a6c4-b79449054fbd	COMPANY	SARL Mining Congo	contact@miningcongo.cd	+243 812 345 678	Avenue de l'Investissement, N°281, Haut-Katanga	CD/KIN/RCCM/24-A-12345	A1234567X	A123456789	Licence de production agroalimentaire	Demande de licence de production agroalimentaire pour le compte de SARL Mining Congo. Cette demande concerne les activités dans le secteur agriculture.	Environnement	Ituri	Goma	727092.00	USD	SUBMITTED	1	5	HIGH	\N	\N	2026-01-02 06:46:40.249+01	2026-01-05 06:46:40.249+01	2026-02-01 06:46:40.249+01	\N	\N	\N	\N	\N	\N	2025-12-31 06:46:40.249+01	2026-01-01 21:20:18.405+01
eb37a13b-8473-400b-ac27-d90acb514aac	LIC-2026-00064	LICENCE	d0fac2fe-221e-455a-a6c4-b79449054fbd	INDIVIDUAL	Jean-Pierre Kabongo	jpkabongo@gmail.com	+243 998 765 432	Avenue de l'Investissement, N°172, Haut-Katanga	\N	B9876543Y	\N	Licence de pêche industrielle	Demande de licence de pêche industrielle pour le compte de Jean-Pierre Kabongo. Cette demande concerne les activités dans le secteur industrie.	Commerce	Nord-Kivu	Kisangani	\N	USD	DRAFT	1	5	HIGH	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-11-21 09:48:06.276+01	2026-01-01 21:20:18.407+01
8c362ef0-3680-4439-bc9e-05f02f67fb99	PER-2026-00058	PERMIS	d0fac2fe-221e-455a-a6c4-b79449054fbd	COMPANY	SARL Mining Congo	contact@miningcongo.cd	+243 812 345 678	Avenue de l'Investissement, N°26, Haut-Katanga	CD/KIN/RCCM/24-A-12345	A1234567X	A123456789	Permis sanitaire d'établissement	Demande de permis sanitaire d'établissement pour le compte de SARL Mining Congo. Cette demande concerne les activités dans le secteur santé.	Environnement	Sud-Kivu	Kananga	4904769.00	USD	PENDING_DOCUMENTS	2	5	URGENT	\N	\N	2025-11-12 12:53:58.098+01	2025-11-13 12:53:58.098+01	2025-12-12 12:53:58.098+01	\N	\N	\N	\N	\N	\N	2025-11-11 12:53:58.098+01	2026-01-01 21:20:18.408+01
a4d88772-4bde-42c0-a133-481171302fe6	PER-2026-00059	PERMIS	d0fac2fe-221e-455a-a6c4-b79449054fbd	COMPANY	Entreprise Agricole du Kasai	agrikasai@yahoo.fr	+243 820 111 222	Avenue de l'Investissement, N°417, Haut-Katanga	CD/KAS/RCCM/23-A-11111	D1111111A	C111111111	Permis de travail pour expatriés	Demande de permis de travail pour expatriés pour le compte de Entreprise Agricole du Kasai. Cette demande concerne les activités dans le secteur santé.	Transport	Équateur	Lubumbashi	3069141.00	USD	UNDER_REVIEW	4	5	HIGH	\N	\N	2025-12-12 09:13:24.779+01	2025-12-18 09:13:24.779+01	2026-01-11 09:13:24.779+01	\N	\N	\N	\N	\N	\N	2025-12-10 09:13:24.779+01	2026-01-01 21:20:18.409+01
a2a5dab7-3c5f-4782-baf9-944f887f5a6e	PER-2026-00060	PERMIS	d0fac2fe-221e-455a-a6c4-b79449054fbd	COMPANY	Import Export Lubumbashi	ielub@business.cd	+243 827 777 888	Avenue de l'Investissement, N°380, Kasaï	CD/LUB/RCCM/24-F-66666	J7777777G	G666666666	Permis de recherche minière	Demande de permis de recherche minière pour le compte de Import Export Lubumbashi. Cette demande concerne les activités dans le secteur commerce.	Transport	Ituri	Mbuji-Mayi	3669977.00	USD	DRAFT	1	5	HIGH	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-11-23 07:37:31.56+01	2026-01-01 21:20:18.411+01
42e65832-6b2e-4be5-81f0-0c3ccd1a0e65	PER-2026-00061	PERMIS	d0fac2fe-221e-455a-a6c4-b79449054fbd	COMPANY	Import Export Lubumbashi	ielub@business.cd	+243 827 777 888	Avenue de l'Investissement, N°207, Kongo Central	CD/LUB/RCCM/24-F-66666	J7777777G	G666666666	Permis sanitaire d'établissement	Demande de permis sanitaire d'établissement pour le compte de Import Export Lubumbashi. Cette demande concerne les activités dans le secteur industrie.	Environnement	Kongo Central	Lubumbashi	2216114.00	USD	SUBMITTED	1	5	NORMAL	\N	\N	2025-10-07 05:25:17.658+01	2025-10-20 05:25:17.658+01	2025-11-06 05:25:17.658+01	\N	\N	\N	\N	\N	\N	2025-10-06 05:25:17.658+01	2026-01-01 21:20:18.412+01
d4c50152-0284-4c2c-a051-3aa9d95e0f30	PER-2026-00062	PERMIS	d0fac2fe-221e-455a-a6c4-b79449054fbd	INVESTOR	Global Invest RDC	info@globalinvest.cd	+243 815 555 999	Avenue de l'Investissement, N°383, Kinshasa	CD/KIN/RCCM/24-B-54321	C5432167Z	B987654321	Permis d'exploitation de débit de boissons	Demande de permis d'exploitation de débit de boissons pour le compte de Global Invest RDC. Cette demande concerne les activités dans le secteur santé.	Industrie	Ituri	Goma	3703876.00	USD	SUBMITTED	1	5	URGENT	\N	\N	2025-11-23 05:56:44.687+01	2025-12-02 05:56:44.687+01	2025-12-23 05:56:44.687+01	\N	\N	\N	\N	\N	\N	2025-11-22 05:56:44.687+01	2026-01-01 21:20:18.413+01
fdbe20d4-a550-42ac-a3a3-e25d8ce366a5	PER-2026-00063	PERMIS	d0fac2fe-221e-455a-a6c4-b79449054fbd	INDIVIDUAL	Jean-Pierre Kabongo	jpkabongo@gmail.com	+243 998 765 432	Avenue de l'Investissement, N°221, Nord-Kivu	\N	B9876543Y	\N	Permis d'exploitation de débit de boissons	Demande de permis d'exploitation de débit de boissons pour le compte de Jean-Pierre Kabongo. Cette demande concerne les activités dans le secteur mines.	Énergie	Équateur	Lubumbashi	\N	USD	APPROVED	5	5	HIGH	\N	\N	2025-10-19 08:19:33.283+01	2025-10-25 08:19:33.283+01	2025-11-18 08:19:33.283+01	2025-11-06 08:19:33.283+01	Dossier conforme aux exigences réglementaires.	\N	\N	\N	\N	2025-10-18 08:19:33.283+01	2026-01-01 21:20:18.414+01
d5ae7137-d327-41f8-89b3-35d9551a8414	PER-2026-00064	PERMIS	d0fac2fe-221e-455a-a6c4-b79449054fbd	INDIVIDUAL	Jean-Pierre Kabongo	jpkabongo@gmail.com	+243 998 765 432	Avenue de l'Investissement, N°241, Haut-Katanga	\N	B9876543Y	\N	Permis de travail pour expatriés	Demande de permis de travail pour expatriés pour le compte de Jean-Pierre Kabongo. Cette demande concerne les activités dans le secteur mines.	Industrie	Kongo Central	Kinshasa	\N	USD	UNDER_REVIEW	3	5	NORMAL	\N	\N	2025-10-15 20:50:25.117+01	2025-10-17 20:50:25.117+01	2025-11-14 20:50:25.117+01	\N	\N	\N	\N	\N	\N	2025-10-14 20:50:25.117+01	2026-01-01 21:20:18.417+01
77ce6321-57f8-452d-8e65-b296ad97cc28	AUT-2026-00059	AUTORISATION	488984b3-173c-4944-9bb6-ebe597b69d43	COMPANY	Société Forestière du Congo	sfc@sfcongo.cd	+243 818 333 444	Avenue de l'Investissement, N°228, Haut-Katanga	CD/EQU/RCCM/24-C-33333	F3333333C	D333333333	Autorisation d'importation de matériel industriel	Demande de autorisation d'importation de matériel industriel pour le compte de Société Forestière du Congo. Cette demande concerne les activités dans le secteur transport.	Mines	Haut-Katanga	Matadi	3347209.00	USD	DRAFT	1	5	HIGH	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-12-26 16:25:45.398+01	2026-01-01 21:20:18.424+01
5fba80c7-1367-4b24-aa75-b21b9efcb502	AUT-2026-00060	AUTORISATION	488984b3-173c-4944-9bb6-ebe597b69d43	COMPANY	Société Forestière du Congo	sfc@sfcongo.cd	+243 818 333 444	Avenue de l'Investissement, N°75, Kasaï	CD/EQU/RCCM/24-C-33333	F3333333C	D333333333	Autorisation d'exploitation minière artisanale	Demande de autorisation d'exploitation minière artisanale pour le compte de Société Forestière du Congo. Cette demande concerne les activités dans le secteur santé.	Énergie	Sud-Kivu	Kisangani	4145868.00	USD	SUBMITTED	1	5	NORMAL	\N	\N	2025-10-10 23:23:46.305+01	2025-10-20 23:23:46.305+01	2025-11-09 23:23:46.305+01	\N	\N	\N	\N	\N	\N	2025-10-07 23:23:46.305+01	2026-01-01 21:20:18.425+01
644da85a-0744-4054-9101-e3fbd86a8282	AUT-2026-00061	AUTORISATION	488984b3-173c-4944-9bb6-ebe597b69d43	INDIVIDUAL	Pierre Mbuyi	pmbuyi@gmail.com	+243 992 555 666	Avenue de l'Investissement, N°468, Kongo Central	\N	H5555555E	\N	Autorisation de construction d'une usine	Demande de autorisation de construction d'une usine pour le compte de Pierre Mbuyi. Cette demande concerne les activités dans le secteur commerce.	Agriculture	Ituri	Matadi	\N	USD	PENDING_DOCUMENTS	1	5	HIGH	\N	\N	2025-11-13 15:16:47.305+01	2025-11-14 15:16:47.305+01	2025-12-13 15:16:47.305+01	\N	\N	\N	\N	\N	\N	2025-11-10 15:16:47.305+01	2026-01-01 21:20:18.427+01
0690600e-7b21-4228-9bae-371f5bc23486	AUT-2026-00062	AUTORISATION	488984b3-173c-4944-9bb6-ebe597b69d43	COMPANY	SARL Mining Congo	contact@miningcongo.cd	+243 812 345 678	Avenue de l'Investissement, N°215, Sud-Kivu	CD/KIN/RCCM/24-A-12345	A1234567X	A123456789	Autorisation de forage de puits	Demande de autorisation de forage de puits pour le compte de SARL Mining Congo. Cette demande concerne les activités dans le secteur environnement.	Agriculture	Équateur	Kisangani	304196.00	USD	SUBMITTED	1	5	LOW	\N	\N	2025-12-09 09:28:47.117+01	2025-12-18 09:28:47.117+01	2026-01-08 09:28:47.117+01	\N	\N	\N	\N	\N	\N	2025-12-06 09:28:47.117+01	2026-01-01 21:20:18.428+01
2e4a2bd4-dfc8-43da-a839-2d5aed781367	AUT-2026-00063	AUTORISATION	488984b3-173c-4944-9bb6-ebe597b69d43	COMPANY	Cimenterie du Kongo Central	ciment@ckc.cd	+243 816 666 777	Avenue de l'Investissement, N°481, Équateur	CD/KOC/RCCM/23-E-55555	I6666666F	F555555555	Autorisation d'importation de matériel industriel	Demande de autorisation d'importation de matériel industriel pour le compte de Cimenterie du Kongo Central. Cette demande concerne les activités dans le secteur industrie.	Industrie	Nord-Kivu	Matadi	2696401.00	USD	REJECTED	5	5	LOW	\N	\N	2025-12-31 15:04:45.561+01	2026-01-12 15:04:45.561+01	2026-01-30 15:04:45.561+01	2026-01-24 15:04:45.561+01	\N	Dossier incomplet ou non conforme aux critères requis.	\N	\N	\N	2025-12-28 15:04:45.561+01	2026-01-01 21:20:18.43+01
8fac5627-89af-402c-8376-404939f5df7b	LIC-2026-00065	LICENCE	488984b3-173c-4944-9bb6-ebe597b69d43	COMPANY	Entreprise Agricole du Kasai	agrikasai@yahoo.fr	+243 820 111 222	Avenue de l'Investissement, N°275, Kinshasa	CD/KAS/RCCM/23-A-11111	D1111111A	C111111111	Licence de télécommunications	Demande de licence de télécommunications pour le compte de Entreprise Agricole du Kasai. Cette demande concerne les activités dans le secteur industrie.	Santé	Kongo Central	Mbuji-Mayi	4841892.00	USD	APPROVED	5	5	URGENT	\N	\N	2025-10-07 08:02:05.048+01	2025-10-17 08:02:05.048+01	2025-11-06 08:02:05.048+01	2025-10-25 08:02:05.048+01	Dossier conforme aux exigences réglementaires.	\N	\N	\N	\N	2025-10-04 08:02:05.048+01	2026-01-01 21:20:18.433+01
0aedfbdf-4f7a-4d18-85e6-66ab5f2a1bcd	LIC-2026-00066	LICENCE	488984b3-173c-4944-9bb6-ebe597b69d43	COMPANY	Import Export Lubumbashi	ielub@business.cd	+243 827 777 888	Avenue de l'Investissement, N°255, Haut-Katanga	CD/LUB/RCCM/24-F-66666	J7777777G	G666666666	Licence d'exploitation forestière	Demande de licence d'exploitation forestière pour le compte de Import Export Lubumbashi. Cette demande concerne les activités dans le secteur énergie.	Énergie	Ituri	Mbuji-Mayi	513027.00	USD	APPROVED	5	5	NORMAL	\N	\N	2025-11-17 17:34:33.952+01	2025-12-01 17:34:33.952+01	2025-12-17 17:34:33.952+01	2025-12-13 17:34:33.952+01	Dossier conforme aux exigences réglementaires.	\N	\N	\N	\N	2025-11-15 17:34:33.952+01	2026-01-01 21:20:18.435+01
438ccf84-1ba4-470b-985d-293a47240e1e	LIC-2026-00067	LICENCE	488984b3-173c-4944-9bb6-ebe597b69d43	INDIVIDUAL	Jean-Pierre Kabongo	jpkabongo@gmail.com	+243 998 765 432	Avenue de l'Investissement, N°405, Haut-Katanga	\N	B9876543Y	\N	Licence d'exploitation de carrière	Demande de licence d'exploitation de carrière pour le compte de Jean-Pierre Kabongo. Cette demande concerne les activités dans le secteur énergie.	Environnement	Kinshasa	Goma	\N	USD	DRAFT	1	5	URGENT	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-10-13 03:21:13.788+01	2026-01-01 21:20:18.438+01
b6f516b4-791a-453e-8b19-37bf749632cc	LIC-2026-00068	LICENCE	488984b3-173c-4944-9bb6-ebe597b69d43	COMPANY	Import Export Lubumbashi	ielub@business.cd	+243 827 777 888	Avenue de l'Investissement, N°124, Sud-Kivu	CD/LUB/RCCM/24-F-66666	J7777777G	G666666666	Licence d'importation de produits pétroliers	Demande de licence d'importation de produits pétroliers pour le compte de Import Export Lubumbashi. Cette demande concerne les activités dans le secteur agriculture.	Mines	Kinshasa	Mbuji-Mayi	1416403.00	USD	PENDING_DOCUMENTS	3	5	LOW	\N	\N	2025-11-21 04:32:21.283+01	2025-11-30 04:32:21.283+01	2025-12-21 04:32:21.283+01	\N	\N	\N	\N	\N	\N	2025-11-20 04:32:21.283+01	2026-01-01 21:20:18.439+01
1f425a24-96e6-42ee-b8b5-c2e3a1f37510	LIC-2026-00069	LICENCE	488984b3-173c-4944-9bb6-ebe597b69d43	INVESTOR	Global Invest RDC	info@globalinvest.cd	+243 815 555 999	Avenue de l'Investissement, N°263, Nord-Kivu	CD/KIN/RCCM/24-B-54321	C5432167Z	B987654321	Licence d'exploitation de carrière	Demande de licence d'exploitation de carrière pour le compte de Global Invest RDC. Cette demande concerne les activités dans le secteur environnement.	Commerce	Kinshasa	Matadi	1820319.00	USD	PENDING_DOCUMENTS	3	5	NORMAL	\N	\N	2025-11-06 22:01:49.554+01	2025-11-11 22:01:49.554+01	2025-12-06 22:01:49.554+01	\N	\N	\N	\N	\N	\N	2025-11-03 22:01:49.554+01	2026-01-01 21:20:18.441+01
71151517-4370-41c2-b957-ea97d48d1332	PER-2026-00065	PERMIS	488984b3-173c-4944-9bb6-ebe597b69d43	COMPANY	Entreprise Agricole du Kasai	agrikasai@yahoo.fr	+243 820 111 222	Avenue de l'Investissement, N°74, Nord-Kivu	CD/KAS/RCCM/23-A-11111	D1111111A	C111111111	Permis d'exploitation de débit de boissons	Demande de permis d'exploitation de débit de boissons pour le compte de Entreprise Agricole du Kasai. Cette demande concerne les activités dans le secteur transport.	Agriculture	Équateur	Matadi	3320546.00	USD	REJECTED	5	5	HIGH	\N	\N	2025-12-21 13:50:08.159+01	2025-12-27 13:50:08.159+01	2026-01-20 13:50:08.159+01	2026-01-08 13:50:08.159+01	\N	Dossier incomplet ou non conforme aux critères requis.	\N	\N	\N	2025-12-18 13:50:08.159+01	2026-01-01 21:20:18.443+01
48feb1bb-756b-4031-aef4-214d467afc0d	PER-2026-00066	PERMIS	488984b3-173c-4944-9bb6-ebe597b69d43	COMPANY	Société Forestière du Congo	sfc@sfcongo.cd	+243 818 333 444	Avenue de l'Investissement, N°21, Ituri	CD/EQU/RCCM/24-C-33333	F3333333C	D333333333	Permis de travail pour expatriés	Demande de permis de travail pour expatriés pour le compte de Société Forestière du Congo. Cette demande concerne les activités dans le secteur commerce.	Transport	Kinshasa	Kisangani	1283670.00	USD	IN_PROGRESS	3	5	HIGH	\N	\N	2025-11-16 07:34:53.113+01	2025-11-27 07:34:53.113+01	2025-12-16 07:34:53.113+01	\N	\N	\N	\N	\N	\N	2025-11-14 07:34:53.113+01	2026-01-01 21:20:18.446+01
bffcaae9-402e-4cbe-913d-08115fa6df53	PER-2026-00067	PERMIS	488984b3-173c-4944-9bb6-ebe597b69d43	INDIVIDUAL	Jean-Pierre Kabongo	jpkabongo@gmail.com	+243 998 765 432	Avenue de l'Investissement, N°208, Kongo Central	\N	B9876543Y	\N	Permis de séjour prolongé	Demande de permis de séjour prolongé pour le compte de Jean-Pierre Kabongo. Cette demande concerne les activités dans le secteur transport.	Industrie	Kasaï	Mbuji-Mayi	\N	USD	UNDER_REVIEW	2	5	HIGH	\N	\N	2025-10-31 10:24:58.926+01	2025-11-06 10:24:58.926+01	2025-11-30 10:24:58.926+01	\N	\N	\N	\N	\N	\N	2025-10-28 10:24:58.926+01	2026-01-01 21:20:18.448+01
b1452200-0553-4cf3-9687-fce69e088717	PER-2026-00068	PERMIS	488984b3-173c-4944-9bb6-ebe597b69d43	INDIVIDUAL	Jean-Pierre Kabongo	jpkabongo@gmail.com	+243 998 765 432	Avenue de l'Investissement, N°445, Équateur	\N	B9876543Y	\N	Permis de recherche minière	Demande de permis de recherche minière pour le compte de Jean-Pierre Kabongo. Cette demande concerne les activités dans le secteur industrie.	Industrie	Haut-Katanga	Kinshasa	\N	USD	SUBMITTED	1	5	URGENT	\N	\N	2025-11-02 21:47:50.72+01	2025-11-07 21:47:50.72+01	2025-12-02 21:47:50.72+01	\N	\N	\N	\N	\N	\N	2025-10-31 21:47:50.72+01	2026-01-01 21:20:18.449+01
7a4cb8f4-b96a-4d62-9d18-3903dce42a81	PER-2026-00069	PERMIS	488984b3-173c-4944-9bb6-ebe597b69d43	COMPANY	SARL Mining Congo	contact@miningcongo.cd	+243 812 345 678	Avenue de l'Investissement, N°275, Équateur	CD/KIN/RCCM/24-A-12345	A1234567X	A123456789	Permis de circulation spéciale	Demande de permis de circulation spéciale pour le compte de SARL Mining Congo. Cette demande concerne les activités dans le secteur santé.	Énergie	Équateur	Bukavu	4201621.00	USD	DRAFT	1	5	HIGH	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-10-31 09:41:56.064+01	2026-01-01 21:20:18.451+01
662749c7-df4d-444d-95c3-637528d05b9e	PER-2026-00070	PERMIS	488984b3-173c-4944-9bb6-ebe597b69d43	INDIVIDUAL	Pierre Mbuyi	pmbuyi@gmail.com	+243 992 555 666	Avenue de l'Investissement, N°28, Équateur	\N	H5555555E	\N	Permis de séjour prolongé	Demande de permis de séjour prolongé pour le compte de Pierre Mbuyi. Cette demande concerne les activités dans le secteur transport.	Santé	Équateur	Goma	\N	USD	APPROVED	5	5	NORMAL	\N	\N	2025-10-18 17:34:24.157+01	2025-11-01 17:34:24.157+01	2025-11-17 17:34:24.157+01	2025-10-26 17:34:24.157+01	Dossier conforme aux exigences réglementaires.	\N	\N	\N	\N	2025-10-16 17:34:24.157+01	2026-01-01 21:20:18.452+01
a6eb7f83-73ba-47e2-a62f-0b77482ee648	PER-2026-00071	PERMIS	488984b3-173c-4944-9bb6-ebe597b69d43	INDIVIDUAL	Pierre Mbuyi	pmbuyi@gmail.com	+243 992 555 666	Avenue de l'Investissement, N°163, Équateur	\N	H5555555E	\N	Permis de recherche minière	Demande de permis de recherche minière pour le compte de Pierre Mbuyi. Cette demande concerne les activités dans le secteur énergie.	Environnement	Nord-Kivu	Mbuji-Mayi	\N	USD	DRAFT	1	5	URGENT	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-10-10 15:12:58.14+01	2026-01-01 21:20:18.454+01
7f71fd5c-4b7f-442d-989b-92b8ece39d91	AUT-2026-00011	AUTORISATION	a05085da-8a12-46d3-ba54-2c7f3c9ff5e3	INDIVIDUAL	Jean-Pierre Kabongo	jpkabongo@gmail.com	+243 998 765 432	Avenue de l'Investissement, N°214, Équateur	\N	B9876543Y	\N	Autorisation de forage de puits	Demande de autorisation de forage de puits pour le compte de Jean-Pierre Kabongo. Cette demande concerne les activités dans le secteur industrie.	Transport	Kinshasa	Matadi	\N	USD	PENDING_DOCUMENTS	4	5	NORMAL	\N	\N	2025-12-24 04:59:16.744+01	2026-01-04 04:59:16.744+01	2026-01-23 04:59:16.744+01	\N	\N	\N	\N	\N	\N	2025-12-23 04:59:16.744+01	2026-01-01 21:50:26.298+01
\.


--
-- Data for Name: ministry_workflows; Type: TABLE DATA; Schema: public; Owner: yvesmpunga
--

COPY public.ministry_workflows (id, "ministryId", "requestType", "stepNumber", "stepName", "stepDescription", "responsibleRole", "estimatedDays", "requiredDocuments", "isActive", "createdAt", "updatedAt") FROM stdin;
d6306ff9-f688-4648-a15a-0672331ca3d4	366e67f9-b8ff-4944-bc1b-ae2352dd77ed	AUTORISATION	1	Réception de la demande	\N	Agent de réception	2	["Formulaire de demande", "Pièce d'identité"]	t	2026-01-01 21:20:17.901+01	2026-01-01 21:20:17.901+01
0115de2a-5c82-4374-bfc3-cd33d30df1da	366e67f9-b8ff-4944-bc1b-ae2352dd77ed	AUTORISATION	2	Analyse technique	\N	Analyste technique	5	["Plan d'affaires", "Étude de faisabilité"]	t	2026-01-01 21:20:17.906+01	2026-01-01 21:20:17.906+01
d534911f-7d5f-4b06-8e44-70c259f0529a	366e67f9-b8ff-4944-bc1b-ae2352dd77ed	AUTORISATION	3	Vérification juridique	\N	Juriste	3	["Statuts de l'entreprise", "RCCM"]	t	2026-01-01 21:20:17.907+01	2026-01-01 21:20:17.907+01
4524f962-14d9-4fb2-9b9b-189493597634	366e67f9-b8ff-4944-bc1b-ae2352dd77ed	AUTORISATION	4	Validation du chef de service	\N	Chef de service	2	[]	t	2026-01-01 21:20:17.908+01	2026-01-01 21:20:17.908+01
00a9667b-8e18-4309-8d94-4874d812d9c7	366e67f9-b8ff-4944-bc1b-ae2352dd77ed	AUTORISATION	5	Décision finale	\N	Directeur	3	[]	t	2026-01-01 21:20:17.909+01	2026-01-01 21:20:17.909+01
607db029-bf4d-4522-8247-9448e04efe03	366e67f9-b8ff-4944-bc1b-ae2352dd77ed	LICENCE	1	Enregistrement	\N	Agent d'accueil	1	["Formulaire de licence", "ID National"]	t	2026-01-01 21:20:17.911+01	2026-01-01 21:20:17.911+01
a850a4ec-d07e-4e07-a6ef-a0718f5af952	366e67f9-b8ff-4944-bc1b-ae2352dd77ed	LICENCE	2	Inspection préalable	\N	Inspecteur	7	["Certificat de conformité", "Plan de localisation"]	t	2026-01-01 21:20:17.912+01	2026-01-01 21:20:17.912+01
df4121e3-f53e-4e2c-8232-9263515c1cea	366e67f9-b8ff-4944-bc1b-ae2352dd77ed	LICENCE	3	Évaluation des capacités	\N	Expert technique	5	["CV des responsables", "Liste des équipements"]	t	2026-01-01 21:20:17.913+01	2026-01-01 21:20:17.913+01
1b6c8909-b192-4c6e-bf56-ca314873aa3c	366e67f9-b8ff-4944-bc1b-ae2352dd77ed	LICENCE	4	Commission d'attribution	\N	Commission	3	[]	t	2026-01-01 21:20:17.913+01	2026-01-01 21:20:17.913+01
d975abaf-d62c-4e8a-a1f5-a2deb94ada1e	366e67f9-b8ff-4944-bc1b-ae2352dd77ed	LICENCE	5	Émission de la licence	\N	Secrétariat	2	[]	t	2026-01-01 21:20:17.914+01	2026-01-01 21:20:17.914+01
2c49ef0d-6d0f-454d-aba4-9ce851fab317	366e67f9-b8ff-4944-bc1b-ae2352dd77ed	PERMIS	1	Dépôt de dossier	\N	Agent de guichet	1	["Demande de permis", "Pièce d'identité"]	t	2026-01-01 21:20:17.915+01	2026-01-01 21:20:17.915+01
d3724963-89d6-4584-b532-5ab2279466b7	366e67f9-b8ff-4944-bc1b-ae2352dd77ed	PERMIS	2	Étude de conformité	\N	Technicien	4	["Plans techniques", "Certificats"]	t	2026-01-01 21:20:17.916+01	2026-01-01 21:20:17.916+01
66a5e48b-dedc-4f68-998f-c77b5cb41e22	366e67f9-b8ff-4944-bc1b-ae2352dd77ed	PERMIS	3	Enquête de terrain	\N	Inspecteur terrain	5	["Rapport d'inspection précédent"]	t	2026-01-01 21:20:17.917+01	2026-01-01 21:20:17.917+01
40f9ff6c-5d6b-4132-b9cc-917a6f3685f4	366e67f9-b8ff-4944-bc1b-ae2352dd77ed	PERMIS	4	Avis technique	\N	Ingénieur	3	[]	t	2026-01-01 21:20:17.918+01	2026-01-01 21:20:17.918+01
4bbae41b-2d51-411d-b797-2b09a264ce91	366e67f9-b8ff-4944-bc1b-ae2352dd77ed	PERMIS	5	Délivrance du permis	\N	Autorité compétente	2	[]	t	2026-01-01 21:20:17.918+01	2026-01-01 21:20:17.918+01
602e571c-51e9-469f-b818-5093c3919f66	a05085da-8a12-46d3-ba54-2c7f3c9ff5e3	AUTORISATION	1	Réception de la demande	\N	Agent de réception	2	["Formulaire de demande", "Pièce d'identité"]	t	2026-01-01 21:20:17.969+01	2026-01-01 21:20:17.969+01
afd6b6fe-e2cb-4f27-876f-b0b189681a33	a05085da-8a12-46d3-ba54-2c7f3c9ff5e3	AUTORISATION	2	Analyse technique	\N	Analyste technique	5	["Plan d'affaires", "Étude de faisabilité"]	t	2026-01-01 21:20:17.969+01	2026-01-01 21:20:17.969+01
ff51edcb-8b93-4fb7-836b-3d90dfa0c8e9	a05085da-8a12-46d3-ba54-2c7f3c9ff5e3	AUTORISATION	3	Vérification juridique	\N	Juriste	3	["Statuts de l'entreprise", "RCCM"]	t	2026-01-01 21:20:17.97+01	2026-01-01 21:20:17.97+01
3fd6de6f-35df-483e-b886-1a13c01dbf17	a05085da-8a12-46d3-ba54-2c7f3c9ff5e3	AUTORISATION	4	Validation du chef de service	\N	Chef de service	2	[]	t	2026-01-01 21:20:17.97+01	2026-01-01 21:20:17.97+01
10a446f7-2236-4755-9b6c-852a5a757b3a	a05085da-8a12-46d3-ba54-2c7f3c9ff5e3	AUTORISATION	5	Décision finale	\N	Directeur	3	[]	t	2026-01-01 21:20:17.971+01	2026-01-01 21:20:17.971+01
1e8218c1-822b-4916-8dc7-d418df7788d0	a05085da-8a12-46d3-ba54-2c7f3c9ff5e3	LICENCE	1	Enregistrement	\N	Agent d'accueil	1	["Formulaire de licence", "ID National"]	t	2026-01-01 21:20:17.971+01	2026-01-01 21:20:17.971+01
45995448-3e2a-40f0-85e6-45f081b4f60a	a05085da-8a12-46d3-ba54-2c7f3c9ff5e3	LICENCE	2	Inspection préalable	\N	Inspecteur	7	["Certificat de conformité", "Plan de localisation"]	t	2026-01-01 21:20:17.972+01	2026-01-01 21:20:17.972+01
806ec6d9-fec5-4fcf-813a-b2815a00a07c	a05085da-8a12-46d3-ba54-2c7f3c9ff5e3	LICENCE	3	Évaluation des capacités	\N	Expert technique	5	["CV des responsables", "Liste des équipements"]	t	2026-01-01 21:20:17.972+01	2026-01-01 21:20:17.972+01
ec530110-a5c1-41d7-ba69-e6fb74010207	a05085da-8a12-46d3-ba54-2c7f3c9ff5e3	LICENCE	4	Commission d'attribution	\N	Commission	3	[]	t	2026-01-01 21:20:17.973+01	2026-01-01 21:20:17.973+01
39ab93f2-207f-4f12-86a0-4f9099c15124	a05085da-8a12-46d3-ba54-2c7f3c9ff5e3	LICENCE	5	Émission de la licence	\N	Secrétariat	2	[]	t	2026-01-01 21:20:17.973+01	2026-01-01 21:20:17.973+01
2a08a366-2167-4423-8e23-afe68a27dc2a	a05085da-8a12-46d3-ba54-2c7f3c9ff5e3	PERMIS	1	Dépôt de dossier	\N	Agent de guichet	1	["Demande de permis", "Pièce d'identité"]	t	2026-01-01 21:20:17.974+01	2026-01-01 21:20:17.974+01
f6319b63-f2ae-4320-9022-cc0dff37e6c6	a05085da-8a12-46d3-ba54-2c7f3c9ff5e3	PERMIS	2	Étude de conformité	\N	Technicien	4	["Plans techniques", "Certificats"]	t	2026-01-01 21:20:17.975+01	2026-01-01 21:20:17.975+01
9480315d-1e00-4f96-aa33-cb68073b3703	a05085da-8a12-46d3-ba54-2c7f3c9ff5e3	PERMIS	3	Enquête de terrain	\N	Inspecteur terrain	5	["Rapport d'inspection précédent"]	t	2026-01-01 21:20:17.976+01	2026-01-01 21:20:17.976+01
6919371b-f563-4399-bb96-a7607873a3cc	a05085da-8a12-46d3-ba54-2c7f3c9ff5e3	PERMIS	4	Avis technique	\N	Ingénieur	3	[]	t	2026-01-01 21:20:17.976+01	2026-01-01 21:20:17.976+01
16a097a3-5b8d-4ed5-b929-f4d7c1dd1490	a05085da-8a12-46d3-ba54-2c7f3c9ff5e3	PERMIS	5	Délivrance du permis	\N	Autorité compétente	2	[]	t	2026-01-01 21:20:17.977+01	2026-01-01 21:20:17.977+01
ae8c5d5e-30ae-4c16-a1a6-29112f662a2a	abe2ef02-9479-40ef-9b64-04b2d851df11	AUTORISATION	1	Réception de la demande	\N	Agent de réception	2	["Formulaire de demande", "Pièce d'identité"]	t	2026-01-01 21:20:18.043+01	2026-01-01 21:20:18.043+01
59a1fd6f-539b-4e2b-9dd7-acf18c8715e0	abe2ef02-9479-40ef-9b64-04b2d851df11	AUTORISATION	2	Analyse technique	\N	Analyste technique	5	["Plan d'affaires", "Étude de faisabilité"]	t	2026-01-01 21:20:18.044+01	2026-01-01 21:20:18.044+01
1fd924de-a70d-4a72-a0ba-8bbbd0255720	abe2ef02-9479-40ef-9b64-04b2d851df11	AUTORISATION	3	Vérification juridique	\N	Juriste	3	["Statuts de l'entreprise", "RCCM"]	t	2026-01-01 21:20:18.044+01	2026-01-01 21:20:18.044+01
d61d60da-728a-43ee-9d0b-4371cb418480	abe2ef02-9479-40ef-9b64-04b2d851df11	AUTORISATION	4	Validation du chef de service	\N	Chef de service	2	[]	t	2026-01-01 21:20:18.045+01	2026-01-01 21:20:18.045+01
f1d5d892-b5cd-4d64-96fe-4784703927a5	abe2ef02-9479-40ef-9b64-04b2d851df11	AUTORISATION	5	Décision finale	\N	Directeur	3	[]	t	2026-01-01 21:20:18.045+01	2026-01-01 21:20:18.045+01
d247d59e-271a-462e-b34f-87bdd8a5157d	abe2ef02-9479-40ef-9b64-04b2d851df11	LICENCE	1	Enregistrement	\N	Agent d'accueil	1	["Formulaire de licence", "ID National"]	t	2026-01-01 21:20:18.046+01	2026-01-01 21:20:18.046+01
299d1faf-bf61-4fa6-9f76-d32f5cd47bca	abe2ef02-9479-40ef-9b64-04b2d851df11	LICENCE	2	Inspection préalable	\N	Inspecteur	7	["Certificat de conformité", "Plan de localisation"]	t	2026-01-01 21:20:18.046+01	2026-01-01 21:20:18.046+01
4398f327-9fb0-4535-b3ef-c7792be5a4b5	abe2ef02-9479-40ef-9b64-04b2d851df11	LICENCE	3	Évaluation des capacités	\N	Expert technique	5	["CV des responsables", "Liste des équipements"]	t	2026-01-01 21:20:18.047+01	2026-01-01 21:20:18.047+01
6a8a51ce-95f9-486a-a06a-baa6f490e02f	abe2ef02-9479-40ef-9b64-04b2d851df11	LICENCE	4	Commission d'attribution	\N	Commission	3	[]	t	2026-01-01 21:20:18.047+01	2026-01-01 21:20:18.047+01
febfeb3e-db98-4e7c-8b57-4be59efa8ea8	abe2ef02-9479-40ef-9b64-04b2d851df11	LICENCE	5	Émission de la licence	\N	Secrétariat	2	[]	t	2026-01-01 21:20:18.048+01	2026-01-01 21:20:18.048+01
75a0de5b-dd59-4933-b843-c8b8949d62b3	abe2ef02-9479-40ef-9b64-04b2d851df11	PERMIS	1	Dépôt de dossier	\N	Agent de guichet	1	["Demande de permis", "Pièce d'identité"]	t	2026-01-01 21:20:18.049+01	2026-01-01 21:20:18.049+01
2574903c-38ce-4f70-9502-f5c071738f8b	abe2ef02-9479-40ef-9b64-04b2d851df11	PERMIS	2	Étude de conformité	\N	Technicien	4	["Plans techniques", "Certificats"]	t	2026-01-01 21:20:18.049+01	2026-01-01 21:20:18.049+01
fdcc5b4b-2e1b-4526-89cf-c075a8726f92	abe2ef02-9479-40ef-9b64-04b2d851df11	PERMIS	3	Enquête de terrain	\N	Inspecteur terrain	5	["Rapport d'inspection précédent"]	t	2026-01-01 21:20:18.05+01	2026-01-01 21:20:18.05+01
d211f484-dfd1-434d-a798-8af26d5b6ac4	abe2ef02-9479-40ef-9b64-04b2d851df11	PERMIS	4	Avis technique	\N	Ingénieur	3	[]	t	2026-01-01 21:20:18.05+01	2026-01-01 21:20:18.05+01
56f7fa6d-2838-41c0-a9df-0721974ffe10	abe2ef02-9479-40ef-9b64-04b2d851df11	PERMIS	5	Délivrance du permis	\N	Autorité compétente	2	[]	t	2026-01-01 21:20:18.051+01	2026-01-01 21:20:18.051+01
b7095360-e9a4-4d4d-9952-7fd63090da30	d31c0252-90de-4fae-8fb9-f001f0a6591e	AUTORISATION	1	Réception de la demande	\N	Agent de réception	2	["Formulaire de demande", "Pièce d'identité"]	t	2026-01-01 21:20:18.102+01	2026-01-01 21:20:18.102+01
b116a3e5-5506-41d4-a8e1-e8085cbfb5dc	d31c0252-90de-4fae-8fb9-f001f0a6591e	AUTORISATION	2	Analyse technique	\N	Analyste technique	5	["Plan d'affaires", "Étude de faisabilité"]	t	2026-01-01 21:20:18.103+01	2026-01-01 21:20:18.103+01
9bf2c5b6-725b-4a5d-b22a-942cb8e4a3f5	d31c0252-90de-4fae-8fb9-f001f0a6591e	AUTORISATION	3	Vérification juridique	\N	Juriste	3	["Statuts de l'entreprise", "RCCM"]	t	2026-01-01 21:20:18.103+01	2026-01-01 21:20:18.103+01
93e46188-2f8f-474f-90d4-5857d4743dfd	d31c0252-90de-4fae-8fb9-f001f0a6591e	AUTORISATION	4	Validation du chef de service	\N	Chef de service	2	[]	t	2026-01-01 21:20:18.104+01	2026-01-01 21:20:18.104+01
8aaf5e0f-2e34-4a4f-b374-081b03adddf7	d31c0252-90de-4fae-8fb9-f001f0a6591e	AUTORISATION	5	Décision finale	\N	Directeur	3	[]	t	2026-01-01 21:20:18.105+01	2026-01-01 21:20:18.105+01
b2e84918-f7c0-455e-b04d-cc45e5120eda	d31c0252-90de-4fae-8fb9-f001f0a6591e	LICENCE	1	Enregistrement	\N	Agent d'accueil	1	["Formulaire de licence", "ID National"]	t	2026-01-01 21:20:18.105+01	2026-01-01 21:20:18.105+01
0cab5970-36a8-474d-80f6-6d008a064c45	d31c0252-90de-4fae-8fb9-f001f0a6591e	LICENCE	2	Inspection préalable	\N	Inspecteur	7	["Certificat de conformité", "Plan de localisation"]	t	2026-01-01 21:20:18.106+01	2026-01-01 21:20:18.106+01
b815d91d-270e-4262-ab4a-db04caccbc53	d31c0252-90de-4fae-8fb9-f001f0a6591e	LICENCE	3	Évaluation des capacités	\N	Expert technique	5	["CV des responsables", "Liste des équipements"]	t	2026-01-01 21:20:18.106+01	2026-01-01 21:20:18.106+01
9f04e456-9e31-4823-8a04-cc955955bcd5	d31c0252-90de-4fae-8fb9-f001f0a6591e	LICENCE	4	Commission d'attribution	\N	Commission	3	[]	t	2026-01-01 21:20:18.107+01	2026-01-01 21:20:18.107+01
6f316eec-dedf-4d40-84fe-73e94594667a	d31c0252-90de-4fae-8fb9-f001f0a6591e	LICENCE	5	Émission de la licence	\N	Secrétariat	2	[]	t	2026-01-01 21:20:18.107+01	2026-01-01 21:20:18.107+01
88124c81-07f3-4490-af7b-e67bbe96b1cb	d31c0252-90de-4fae-8fb9-f001f0a6591e	PERMIS	1	Dépôt de dossier	\N	Agent de guichet	1	["Demande de permis", "Pièce d'identité"]	t	2026-01-01 21:20:18.108+01	2026-01-01 21:20:18.108+01
9324f016-eb5b-492c-b8d6-d7df9b685ca3	d31c0252-90de-4fae-8fb9-f001f0a6591e	PERMIS	2	Étude de conformité	\N	Technicien	4	["Plans techniques", "Certificats"]	t	2026-01-01 21:20:18.109+01	2026-01-01 21:20:18.109+01
d1ea78cf-d7d1-442b-9a1d-09adf0b8cc5e	d31c0252-90de-4fae-8fb9-f001f0a6591e	PERMIS	3	Enquête de terrain	\N	Inspecteur terrain	5	["Rapport d'inspection précédent"]	t	2026-01-01 21:20:18.109+01	2026-01-01 21:20:18.109+01
4e5e1bc4-ba0e-4b78-8a1a-0a1b481800a3	d31c0252-90de-4fae-8fb9-f001f0a6591e	PERMIS	4	Avis technique	\N	Ingénieur	3	[]	t	2026-01-01 21:20:18.109+01	2026-01-01 21:20:18.109+01
515503ea-282a-4403-8c01-20bc1df761b1	d31c0252-90de-4fae-8fb9-f001f0a6591e	PERMIS	5	Délivrance du permis	\N	Autorité compétente	2	[]	t	2026-01-01 21:20:18.11+01	2026-01-01 21:20:18.11+01
53c40959-c0c6-484a-9359-7eea18434771	72b9abbd-b70e-46cc-bae4-eee5cb71325d	AUTORISATION	1	Réception de la demande	\N	Agent de réception	2	["Formulaire de demande", "Pièce d'identité"]	t	2026-01-01 21:20:18.147+01	2026-01-01 21:20:18.147+01
d5b45f90-e4a1-4c66-9263-1ffb09f1ed16	72b9abbd-b70e-46cc-bae4-eee5cb71325d	AUTORISATION	2	Analyse technique	\N	Analyste technique	5	["Plan d'affaires", "Étude de faisabilité"]	t	2026-01-01 21:20:18.147+01	2026-01-01 21:20:18.147+01
cd6cac64-7d18-4e9c-ae25-83a653802145	72b9abbd-b70e-46cc-bae4-eee5cb71325d	AUTORISATION	3	Vérification juridique	\N	Juriste	3	["Statuts de l'entreprise", "RCCM"]	t	2026-01-01 21:20:18.148+01	2026-01-01 21:20:18.148+01
81ea1339-47b8-4f30-95e9-7ddd1ee6d9ef	72b9abbd-b70e-46cc-bae4-eee5cb71325d	AUTORISATION	4	Validation du chef de service	\N	Chef de service	2	[]	t	2026-01-01 21:20:18.149+01	2026-01-01 21:20:18.149+01
34a95ea1-81b4-435b-8e14-6c6f401bd667	72b9abbd-b70e-46cc-bae4-eee5cb71325d	AUTORISATION	5	Décision finale	\N	Directeur	3	[]	t	2026-01-01 21:20:18.149+01	2026-01-01 21:20:18.149+01
eca6a652-9c79-48d6-b857-f4bd07acc6f9	72b9abbd-b70e-46cc-bae4-eee5cb71325d	LICENCE	1	Enregistrement	\N	Agent d'accueil	1	["Formulaire de licence", "ID National"]	t	2026-01-01 21:20:18.15+01	2026-01-01 21:20:18.15+01
299b352d-38f4-495e-9de1-e3c32953ca56	72b9abbd-b70e-46cc-bae4-eee5cb71325d	LICENCE	2	Inspection préalable	\N	Inspecteur	7	["Certificat de conformité", "Plan de localisation"]	t	2026-01-01 21:20:18.15+01	2026-01-01 21:20:18.15+01
95a4fe10-5120-4ea1-ac42-77fac5792387	72b9abbd-b70e-46cc-bae4-eee5cb71325d	LICENCE	3	Évaluation des capacités	\N	Expert technique	5	["CV des responsables", "Liste des équipements"]	t	2026-01-01 21:20:18.151+01	2026-01-01 21:20:18.151+01
7912eeff-2def-4e11-8b41-fd85547ff7b0	72b9abbd-b70e-46cc-bae4-eee5cb71325d	LICENCE	4	Commission d'attribution	\N	Commission	3	[]	t	2026-01-01 21:20:18.151+01	2026-01-01 21:20:18.151+01
c27254bc-4a0a-461b-bb5b-16be1664f5d2	72b9abbd-b70e-46cc-bae4-eee5cb71325d	LICENCE	5	Émission de la licence	\N	Secrétariat	2	[]	t	2026-01-01 21:20:18.152+01	2026-01-01 21:20:18.152+01
87b38bce-ff4a-4bac-a01b-21f8a5bcf490	72b9abbd-b70e-46cc-bae4-eee5cb71325d	PERMIS	1	Dépôt de dossier	\N	Agent de guichet	1	["Demande de permis", "Pièce d'identité"]	t	2026-01-01 21:20:18.153+01	2026-01-01 21:20:18.153+01
323dc1d3-b54d-4d79-ba7e-e298577b1ed8	72b9abbd-b70e-46cc-bae4-eee5cb71325d	PERMIS	2	Étude de conformité	\N	Technicien	4	["Plans techniques", "Certificats"]	t	2026-01-01 21:20:18.153+01	2026-01-01 21:20:18.153+01
c7828150-e3cf-48e4-8f75-f7e67951e8f0	72b9abbd-b70e-46cc-bae4-eee5cb71325d	PERMIS	3	Enquête de terrain	\N	Inspecteur terrain	5	["Rapport d'inspection précédent"]	t	2026-01-01 21:20:18.153+01	2026-01-01 21:20:18.153+01
e3a78479-2129-4103-a96e-fd65dd332041	72b9abbd-b70e-46cc-bae4-eee5cb71325d	PERMIS	4	Avis technique	\N	Ingénieur	3	[]	t	2026-01-01 21:20:18.154+01	2026-01-01 21:20:18.154+01
bd9dd34b-812c-48fe-acca-1657ce08fbc5	72b9abbd-b70e-46cc-bae4-eee5cb71325d	PERMIS	5	Délivrance du permis	\N	Autorité compétente	2	[]	t	2026-01-01 21:20:18.154+01	2026-01-01 21:20:18.154+01
44f04c76-27dd-4780-9d81-1b95eca090cb	d33f001c-23b0-457d-8d8f-538f97eacc16	AUTORISATION	1	Réception de la demande	\N	Agent de réception	2	["Formulaire de demande", "Pièce d'identité"]	t	2026-01-01 21:20:18.189+01	2026-01-01 21:20:18.189+01
6a14230e-f61f-4a18-95f3-b6a37f755d43	d33f001c-23b0-457d-8d8f-538f97eacc16	AUTORISATION	2	Analyse technique	\N	Analyste technique	5	["Plan d'affaires", "Étude de faisabilité"]	t	2026-01-01 21:20:18.189+01	2026-01-01 21:20:18.189+01
15bfc792-3b71-49c6-b145-63d68cc15e41	d33f001c-23b0-457d-8d8f-538f97eacc16	AUTORISATION	3	Vérification juridique	\N	Juriste	3	["Statuts de l'entreprise", "RCCM"]	t	2026-01-01 21:20:18.189+01	2026-01-01 21:20:18.189+01
79cd12a8-4702-4417-b027-7ccce4285fe1	d33f001c-23b0-457d-8d8f-538f97eacc16	AUTORISATION	4	Validation du chef de service	\N	Chef de service	2	[]	t	2026-01-01 21:20:18.19+01	2026-01-01 21:20:18.19+01
fd771e9c-1ffc-4b3f-a017-343b5d403ccc	d33f001c-23b0-457d-8d8f-538f97eacc16	AUTORISATION	5	Décision finale	\N	Directeur	3	[]	t	2026-01-01 21:20:18.19+01	2026-01-01 21:20:18.19+01
c103b8e8-fd2f-4b3f-8ca7-b829e992161a	d33f001c-23b0-457d-8d8f-538f97eacc16	LICENCE	1	Enregistrement	\N	Agent d'accueil	1	["Formulaire de licence", "ID National"]	t	2026-01-01 21:20:18.191+01	2026-01-01 21:20:18.191+01
b6db7e27-b2fe-4f6e-a946-0df2bdc84b37	d33f001c-23b0-457d-8d8f-538f97eacc16	LICENCE	2	Inspection préalable	\N	Inspecteur	7	["Certificat de conformité", "Plan de localisation"]	t	2026-01-01 21:20:18.191+01	2026-01-01 21:20:18.191+01
0198fa2f-f5b1-4450-8f96-d7df8d0e1010	d33f001c-23b0-457d-8d8f-538f97eacc16	LICENCE	3	Évaluation des capacités	\N	Expert technique	5	["CV des responsables", "Liste des équipements"]	t	2026-01-01 21:20:18.191+01	2026-01-01 21:20:18.191+01
78338ded-16b7-4800-bd62-fb137b0a6ae7	d33f001c-23b0-457d-8d8f-538f97eacc16	LICENCE	4	Commission d'attribution	\N	Commission	3	[]	t	2026-01-01 21:20:18.192+01	2026-01-01 21:20:18.192+01
157d869a-c265-4df0-b7d7-8fbde02844c9	d33f001c-23b0-457d-8d8f-538f97eacc16	LICENCE	5	Émission de la licence	\N	Secrétariat	2	[]	t	2026-01-01 21:20:18.192+01	2026-01-01 21:20:18.192+01
68d959bc-60d7-4994-be85-e55adc0c672d	d33f001c-23b0-457d-8d8f-538f97eacc16	PERMIS	1	Dépôt de dossier	\N	Agent de guichet	1	["Demande de permis", "Pièce d'identité"]	t	2026-01-01 21:20:18.193+01	2026-01-01 21:20:18.193+01
f2110158-cf19-447c-89e6-ae31d1e979f2	d33f001c-23b0-457d-8d8f-538f97eacc16	PERMIS	2	Étude de conformité	\N	Technicien	4	["Plans techniques", "Certificats"]	t	2026-01-01 21:20:18.193+01	2026-01-01 21:20:18.193+01
cc707e89-f9e7-4633-b486-e6bbb09b230a	d33f001c-23b0-457d-8d8f-538f97eacc16	PERMIS	3	Enquête de terrain	\N	Inspecteur terrain	5	["Rapport d'inspection précédent"]	t	2026-01-01 21:20:18.194+01	2026-01-01 21:20:18.194+01
52e16e59-0a53-442a-816e-2c136bd8b343	d33f001c-23b0-457d-8d8f-538f97eacc16	PERMIS	4	Avis technique	\N	Ingénieur	3	[]	t	2026-01-01 21:20:18.194+01	2026-01-01 21:20:18.194+01
adad1e72-1d79-470b-8493-a526f7ae4c73	d33f001c-23b0-457d-8d8f-538f97eacc16	PERMIS	5	Délivrance du permis	\N	Autorité compétente	2	[]	t	2026-01-01 21:20:18.194+01	2026-01-01 21:20:18.194+01
490baa87-81f0-4419-b0b6-5fe9c45f1824	4eb63f50-d06a-4288-86f8-789e3c2f7d4d	AUTORISATION	1	Réception de la demande	\N	Agent de réception	2	["Formulaire de demande", "Pièce d'identité"]	t	2026-01-01 21:20:18.224+01	2026-01-01 21:20:18.224+01
2f5d1f8d-5a2a-4c63-9bca-6c77dd156f06	4eb63f50-d06a-4288-86f8-789e3c2f7d4d	AUTORISATION	2	Analyse technique	\N	Analyste technique	5	["Plan d'affaires", "Étude de faisabilité"]	t	2026-01-01 21:20:18.225+01	2026-01-01 21:20:18.225+01
ce97c13e-1c03-4ac5-a797-14624c104266	4eb63f50-d06a-4288-86f8-789e3c2f7d4d	AUTORISATION	3	Vérification juridique	\N	Juriste	3	["Statuts de l'entreprise", "RCCM"]	t	2026-01-01 21:20:18.225+01	2026-01-01 21:20:18.225+01
e1dc6871-7629-4dfe-9d2d-82987dcbd846	4eb63f50-d06a-4288-86f8-789e3c2f7d4d	AUTORISATION	4	Validation du chef de service	\N	Chef de service	2	[]	t	2026-01-01 21:20:18.225+01	2026-01-01 21:20:18.225+01
a523eeb5-bbe6-4058-b2af-28cc32a37c17	4eb63f50-d06a-4288-86f8-789e3c2f7d4d	AUTORISATION	5	Décision finale	\N	Directeur	3	[]	t	2026-01-01 21:20:18.226+01	2026-01-01 21:20:18.226+01
0e472b52-837f-416b-8120-151162c97f20	4eb63f50-d06a-4288-86f8-789e3c2f7d4d	LICENCE	1	Enregistrement	\N	Agent d'accueil	1	["Formulaire de licence", "ID National"]	t	2026-01-01 21:20:18.226+01	2026-01-01 21:20:18.226+01
bf9efef8-dcf6-4242-bbdd-f833df2ce7d7	4eb63f50-d06a-4288-86f8-789e3c2f7d4d	LICENCE	2	Inspection préalable	\N	Inspecteur	7	["Certificat de conformité", "Plan de localisation"]	t	2026-01-01 21:20:18.226+01	2026-01-01 21:20:18.226+01
21d0a9d7-9437-4688-bd98-3c17a0cacdbb	4eb63f50-d06a-4288-86f8-789e3c2f7d4d	LICENCE	3	Évaluation des capacités	\N	Expert technique	5	["CV des responsables", "Liste des équipements"]	t	2026-01-01 21:20:18.227+01	2026-01-01 21:20:18.227+01
ee75dd12-39de-403c-9ac1-2d84900ff11d	4eb63f50-d06a-4288-86f8-789e3c2f7d4d	LICENCE	4	Commission d'attribution	\N	Commission	3	[]	t	2026-01-01 21:20:18.227+01	2026-01-01 21:20:18.227+01
3ba83f67-126a-4ff5-b134-b64313d5162b	4eb63f50-d06a-4288-86f8-789e3c2f7d4d	LICENCE	5	Émission de la licence	\N	Secrétariat	2	[]	t	2026-01-01 21:20:18.228+01	2026-01-01 21:20:18.228+01
73a503d7-87e7-46fa-ba19-979ffd09c805	4eb63f50-d06a-4288-86f8-789e3c2f7d4d	PERMIS	1	Dépôt de dossier	\N	Agent de guichet	1	["Demande de permis", "Pièce d'identité"]	t	2026-01-01 21:20:18.228+01	2026-01-01 21:20:18.228+01
12d0f397-ad35-42df-8c2f-fe7acbf307c0	4eb63f50-d06a-4288-86f8-789e3c2f7d4d	PERMIS	2	Étude de conformité	\N	Technicien	4	["Plans techniques", "Certificats"]	t	2026-01-01 21:20:18.229+01	2026-01-01 21:20:18.229+01
37945296-d259-4888-a708-852cb6d56e37	4eb63f50-d06a-4288-86f8-789e3c2f7d4d	PERMIS	3	Enquête de terrain	\N	Inspecteur terrain	5	["Rapport d'inspection précédent"]	t	2026-01-01 21:20:18.229+01	2026-01-01 21:20:18.229+01
94ca0463-9de0-4011-b1f9-0e843b9f9438	4eb63f50-d06a-4288-86f8-789e3c2f7d4d	PERMIS	4	Avis technique	\N	Ingénieur	3	[]	t	2026-01-01 21:20:18.229+01	2026-01-01 21:20:18.229+01
177b36d9-0263-4672-b48d-2aa409b5b6ec	4eb63f50-d06a-4288-86f8-789e3c2f7d4d	PERMIS	5	Délivrance du permis	\N	Autorité compétente	2	[]	t	2026-01-01 21:20:18.23+01	2026-01-01 21:20:18.23+01
be85373c-3c10-4717-bf39-3f250442feac	b4c4d208-ba0f-4e2f-87ae-0f263fa8a8c7	AUTORISATION	1	Réception de la demande	\N	Agent de réception	2	["Formulaire de demande", "Pièce d'identité"]	t	2026-01-01 21:20:18.263+01	2026-01-01 21:20:18.263+01
7e1a5ba4-7361-49d1-8545-810ab1c77bca	b4c4d208-ba0f-4e2f-87ae-0f263fa8a8c7	AUTORISATION	2	Analyse technique	\N	Analyste technique	5	["Plan d'affaires", "Étude de faisabilité"]	t	2026-01-01 21:20:18.263+01	2026-01-01 21:20:18.263+01
8d6ee8d6-bd59-4978-a700-476282bc7dec	b4c4d208-ba0f-4e2f-87ae-0f263fa8a8c7	AUTORISATION	3	Vérification juridique	\N	Juriste	3	["Statuts de l'entreprise", "RCCM"]	t	2026-01-01 21:20:18.263+01	2026-01-01 21:20:18.263+01
13a53e2c-be01-4d39-9fc7-a033852c96b3	b4c4d208-ba0f-4e2f-87ae-0f263fa8a8c7	AUTORISATION	4	Validation du chef de service	\N	Chef de service	2	[]	t	2026-01-01 21:20:18.264+01	2026-01-01 21:20:18.264+01
79807d8f-61db-4e08-a2b7-10068879d88e	b4c4d208-ba0f-4e2f-87ae-0f263fa8a8c7	AUTORISATION	5	Décision finale	\N	Directeur	3	[]	t	2026-01-01 21:20:18.264+01	2026-01-01 21:20:18.264+01
175afe70-b1ab-4f97-9fe9-1b767986ffab	b4c4d208-ba0f-4e2f-87ae-0f263fa8a8c7	LICENCE	1	Enregistrement	\N	Agent d'accueil	1	["Formulaire de licence", "ID National"]	t	2026-01-01 21:20:18.265+01	2026-01-01 21:20:18.265+01
af0a1011-49a6-480d-ae19-fe2ffcd91571	b4c4d208-ba0f-4e2f-87ae-0f263fa8a8c7	LICENCE	2	Inspection préalable	\N	Inspecteur	7	["Certificat de conformité", "Plan de localisation"]	t	2026-01-01 21:20:18.265+01	2026-01-01 21:20:18.265+01
ede6897f-f03d-433a-8be2-057d3d0f5e35	b4c4d208-ba0f-4e2f-87ae-0f263fa8a8c7	LICENCE	3	Évaluation des capacités	\N	Expert technique	5	["CV des responsables", "Liste des équipements"]	t	2026-01-01 21:20:18.265+01	2026-01-01 21:20:18.265+01
f6169d37-7348-4f59-b5bd-55d1a518a890	b4c4d208-ba0f-4e2f-87ae-0f263fa8a8c7	LICENCE	4	Commission d'attribution	\N	Commission	3	[]	t	2026-01-01 21:20:18.266+01	2026-01-01 21:20:18.266+01
b934a470-35bf-4a52-88bd-77cd30a4481d	b4c4d208-ba0f-4e2f-87ae-0f263fa8a8c7	LICENCE	5	Émission de la licence	\N	Secrétariat	2	[]	t	2026-01-01 21:20:18.266+01	2026-01-01 21:20:18.266+01
9a75e0d1-0881-4baa-8145-a9407fe17324	b4c4d208-ba0f-4e2f-87ae-0f263fa8a8c7	PERMIS	1	Dépôt de dossier	\N	Agent de guichet	1	["Demande de permis", "Pièce d'identité"]	t	2026-01-01 21:20:18.266+01	2026-01-01 21:20:18.266+01
ba982760-24d9-40c7-a9e3-dd4244bd92cb	b4c4d208-ba0f-4e2f-87ae-0f263fa8a8c7	PERMIS	2	Étude de conformité	\N	Technicien	4	["Plans techniques", "Certificats"]	t	2026-01-01 21:20:18.267+01	2026-01-01 21:20:18.267+01
234a0109-0da0-4c5c-8c3a-cba79b16c4f4	b4c4d208-ba0f-4e2f-87ae-0f263fa8a8c7	PERMIS	3	Enquête de terrain	\N	Inspecteur terrain	5	["Rapport d'inspection précédent"]	t	2026-01-01 21:20:18.267+01	2026-01-01 21:20:18.267+01
02130930-2474-4789-b518-5bf7c74a5fa7	b4c4d208-ba0f-4e2f-87ae-0f263fa8a8c7	PERMIS	4	Avis technique	\N	Ingénieur	3	[]	t	2026-01-01 21:20:18.267+01	2026-01-01 21:20:18.267+01
9db9c5de-4a17-4273-9130-526a51ba23af	b4c4d208-ba0f-4e2f-87ae-0f263fa8a8c7	PERMIS	5	Délivrance du permis	\N	Autorité compétente	2	[]	t	2026-01-01 21:20:18.268+01	2026-01-01 21:20:18.268+01
a4e27fb4-80cd-4328-bba1-14cd69e50e79	222a177a-1027-4909-8da1-1c551c65ffe2	AUTORISATION	1	Réception de la demande	\N	Agent de réception	2	["Formulaire de demande", "Pièce d'identité"]	t	2026-01-01 21:20:18.308+01	2026-01-01 21:20:18.308+01
bb3b06f9-2812-4a60-acfb-6328112af1ba	222a177a-1027-4909-8da1-1c551c65ffe2	AUTORISATION	2	Analyse technique	\N	Analyste technique	5	["Plan d'affaires", "Étude de faisabilité"]	t	2026-01-01 21:20:18.308+01	2026-01-01 21:20:18.308+01
2e2b93f0-0c63-4e26-8540-04867347b0ce	222a177a-1027-4909-8da1-1c551c65ffe2	AUTORISATION	3	Vérification juridique	\N	Juriste	3	["Statuts de l'entreprise", "RCCM"]	t	2026-01-01 21:20:18.309+01	2026-01-01 21:20:18.309+01
8b241ff8-73b3-41c1-b80a-87f077029811	222a177a-1027-4909-8da1-1c551c65ffe2	AUTORISATION	4	Validation du chef de service	\N	Chef de service	2	[]	t	2026-01-01 21:20:18.309+01	2026-01-01 21:20:18.309+01
2a22f766-835f-4e45-8168-1d86d7b1be9d	222a177a-1027-4909-8da1-1c551c65ffe2	AUTORISATION	5	Décision finale	\N	Directeur	3	[]	t	2026-01-01 21:20:18.309+01	2026-01-01 21:20:18.309+01
c80cc64d-6bfc-4bfb-a5ca-3f2d419ca969	222a177a-1027-4909-8da1-1c551c65ffe2	LICENCE	1	Enregistrement	\N	Agent d'accueil	1	["Formulaire de licence", "ID National"]	t	2026-01-01 21:20:18.31+01	2026-01-01 21:20:18.31+01
1822bc41-a98c-4cde-8d66-7c9d003f5be8	222a177a-1027-4909-8da1-1c551c65ffe2	LICENCE	2	Inspection préalable	\N	Inspecteur	7	["Certificat de conformité", "Plan de localisation"]	t	2026-01-01 21:20:18.31+01	2026-01-01 21:20:18.31+01
18673f9b-21e8-491d-8cad-16ac02f420f1	222a177a-1027-4909-8da1-1c551c65ffe2	LICENCE	3	Évaluation des capacités	\N	Expert technique	5	["CV des responsables", "Liste des équipements"]	t	2026-01-01 21:20:18.311+01	2026-01-01 21:20:18.311+01
d49856b0-eac8-4316-8b24-3d217b827ada	222a177a-1027-4909-8da1-1c551c65ffe2	LICENCE	4	Commission d'attribution	\N	Commission	3	[]	t	2026-01-01 21:20:18.311+01	2026-01-01 21:20:18.311+01
01161ad8-6e63-411d-83b4-95ebaeb92832	222a177a-1027-4909-8da1-1c551c65ffe2	LICENCE	5	Émission de la licence	\N	Secrétariat	2	[]	t	2026-01-01 21:20:18.312+01	2026-01-01 21:20:18.312+01
24aeec79-2ed8-4f1e-b678-32365bc44888	222a177a-1027-4909-8da1-1c551c65ffe2	PERMIS	1	Dépôt de dossier	\N	Agent de guichet	1	["Demande de permis", "Pièce d'identité"]	t	2026-01-01 21:20:18.312+01	2026-01-01 21:20:18.312+01
0903c578-e5c7-4dd0-a61f-c83a583b77b3	222a177a-1027-4909-8da1-1c551c65ffe2	PERMIS	2	Étude de conformité	\N	Technicien	4	["Plans techniques", "Certificats"]	t	2026-01-01 21:20:18.312+01	2026-01-01 21:20:18.312+01
bd51d94b-5304-442b-b572-5382328b6153	222a177a-1027-4909-8da1-1c551c65ffe2	PERMIS	3	Enquête de terrain	\N	Inspecteur terrain	5	["Rapport d'inspection précédent"]	t	2026-01-01 21:20:18.313+01	2026-01-01 21:20:18.313+01
e53657b5-fbbb-42fe-a62d-de4226a4fce4	222a177a-1027-4909-8da1-1c551c65ffe2	PERMIS	4	Avis technique	\N	Ingénieur	3	[]	t	2026-01-01 21:20:18.313+01	2026-01-01 21:20:18.313+01
c84d950a-3447-46e6-b57e-6859b029dd77	222a177a-1027-4909-8da1-1c551c65ffe2	PERMIS	5	Délivrance du permis	\N	Autorité compétente	2	[]	t	2026-01-01 21:20:18.313+01	2026-01-01 21:20:18.313+01
93692b78-7c99-46ae-8c7b-52f4447a74f6	73c13713-92e7-4613-99f6-ef83b9a7fa4d	AUTORISATION	1	Réception de la demande	\N	Agent de réception	2	["Formulaire de demande", "Pièce d'identité"]	t	2026-01-01 21:20:18.347+01	2026-01-01 21:20:18.347+01
5ae196aa-228d-43d4-98df-3b9e8fd919f4	73c13713-92e7-4613-99f6-ef83b9a7fa4d	AUTORISATION	2	Analyse technique	\N	Analyste technique	5	["Plan d'affaires", "Étude de faisabilité"]	t	2026-01-01 21:20:18.347+01	2026-01-01 21:20:18.347+01
e7938bc8-2512-449c-8cf2-9e809890a7b4	73c13713-92e7-4613-99f6-ef83b9a7fa4d	AUTORISATION	3	Vérification juridique	\N	Juriste	3	["Statuts de l'entreprise", "RCCM"]	t	2026-01-01 21:20:18.347+01	2026-01-01 21:20:18.347+01
c21347da-4963-47b3-8e5b-519580176e4f	73c13713-92e7-4613-99f6-ef83b9a7fa4d	AUTORISATION	4	Validation du chef de service	\N	Chef de service	2	[]	t	2026-01-01 21:20:18.348+01	2026-01-01 21:20:18.348+01
f0cffcee-c7fd-4c01-921a-e9d4f76da48a	73c13713-92e7-4613-99f6-ef83b9a7fa4d	AUTORISATION	5	Décision finale	\N	Directeur	3	[]	t	2026-01-01 21:20:18.348+01	2026-01-01 21:20:18.348+01
600e2ec5-29e6-4a4d-ab6e-a44d6cf45f5b	73c13713-92e7-4613-99f6-ef83b9a7fa4d	LICENCE	1	Enregistrement	\N	Agent d'accueil	1	["Formulaire de licence", "ID National"]	t	2026-01-01 21:20:18.349+01	2026-01-01 21:20:18.349+01
a210f054-d8bf-4463-b1c8-3ca418534039	73c13713-92e7-4613-99f6-ef83b9a7fa4d	LICENCE	2	Inspection préalable	\N	Inspecteur	7	["Certificat de conformité", "Plan de localisation"]	t	2026-01-01 21:20:18.349+01	2026-01-01 21:20:18.349+01
b866834a-4946-49da-9615-ab0cb12aed6a	73c13713-92e7-4613-99f6-ef83b9a7fa4d	LICENCE	3	Évaluation des capacités	\N	Expert technique	5	["CV des responsables", "Liste des équipements"]	t	2026-01-01 21:20:18.349+01	2026-01-01 21:20:18.349+01
279cb5d5-f4fe-456e-9e57-3cb039176e41	73c13713-92e7-4613-99f6-ef83b9a7fa4d	LICENCE	4	Commission d'attribution	\N	Commission	3	[]	t	2026-01-01 21:20:18.35+01	2026-01-01 21:20:18.35+01
9b40072f-e07c-4f71-b08f-33bf7f82d315	73c13713-92e7-4613-99f6-ef83b9a7fa4d	LICENCE	5	Émission de la licence	\N	Secrétariat	2	[]	t	2026-01-01 21:20:18.351+01	2026-01-01 21:20:18.351+01
65a82d0b-459f-48dd-a20e-410a661e1619	73c13713-92e7-4613-99f6-ef83b9a7fa4d	PERMIS	1	Dépôt de dossier	\N	Agent de guichet	1	["Demande de permis", "Pièce d'identité"]	t	2026-01-01 21:20:18.351+01	2026-01-01 21:20:18.351+01
8bde99b1-2868-4627-a82a-19f65b48f30c	73c13713-92e7-4613-99f6-ef83b9a7fa4d	PERMIS	2	Étude de conformité	\N	Technicien	4	["Plans techniques", "Certificats"]	t	2026-01-01 21:20:18.352+01	2026-01-01 21:20:18.352+01
b3853903-2a65-4157-b8f2-abdf7de40afc	73c13713-92e7-4613-99f6-ef83b9a7fa4d	PERMIS	3	Enquête de terrain	\N	Inspecteur terrain	5	["Rapport d'inspection précédent"]	t	2026-01-01 21:20:18.352+01	2026-01-01 21:20:18.352+01
8d9953af-de5d-4724-bbbb-778e4bc1b0c3	73c13713-92e7-4613-99f6-ef83b9a7fa4d	PERMIS	4	Avis technique	\N	Ingénieur	3	[]	t	2026-01-01 21:20:18.352+01	2026-01-01 21:20:18.352+01
b92d918a-b7b6-411f-96d0-c8110a206aed	73c13713-92e7-4613-99f6-ef83b9a7fa4d	PERMIS	5	Délivrance du permis	\N	Autorité compétente	2	[]	t	2026-01-01 21:20:18.353+01	2026-01-01 21:20:18.353+01
51028b40-a5a0-4728-bad3-9a0b7209db10	d0fac2fe-221e-455a-a6c4-b79449054fbd	AUTORISATION	1	Réception de la demande	\N	Agent de réception	2	["Formulaire de demande", "Pièce d'identité"]	t	2026-01-01 21:20:18.387+01	2026-01-01 21:20:18.387+01
64168f56-b501-4677-9144-fff92bee8bed	d0fac2fe-221e-455a-a6c4-b79449054fbd	AUTORISATION	2	Analyse technique	\N	Analyste technique	5	["Plan d'affaires", "Étude de faisabilité"]	t	2026-01-01 21:20:18.387+01	2026-01-01 21:20:18.387+01
c4c380dc-5507-469e-bb39-eb6a967cf25c	d0fac2fe-221e-455a-a6c4-b79449054fbd	AUTORISATION	3	Vérification juridique	\N	Juriste	3	["Statuts de l'entreprise", "RCCM"]	t	2026-01-01 21:20:18.388+01	2026-01-01 21:20:18.388+01
6473ec39-1bad-4349-a9f5-a2e2b5b6f013	d0fac2fe-221e-455a-a6c4-b79449054fbd	AUTORISATION	4	Validation du chef de service	\N	Chef de service	2	[]	t	2026-01-01 21:20:18.388+01	2026-01-01 21:20:18.388+01
b65bc0ea-e4b9-409f-ad1f-119ca3d14c48	d0fac2fe-221e-455a-a6c4-b79449054fbd	AUTORISATION	5	Décision finale	\N	Directeur	3	[]	t	2026-01-01 21:20:18.388+01	2026-01-01 21:20:18.388+01
4c05ad3c-ddbe-446b-97bf-9f7c950b9b5c	d0fac2fe-221e-455a-a6c4-b79449054fbd	LICENCE	1	Enregistrement	\N	Agent d'accueil	1	["Formulaire de licence", "ID National"]	t	2026-01-01 21:20:18.389+01	2026-01-01 21:20:18.389+01
2c103b44-1695-4786-be28-7f25415351f0	d0fac2fe-221e-455a-a6c4-b79449054fbd	LICENCE	2	Inspection préalable	\N	Inspecteur	7	["Certificat de conformité", "Plan de localisation"]	t	2026-01-01 21:20:18.389+01	2026-01-01 21:20:18.389+01
239b2d61-5f29-46a1-990f-57bbc25b3689	d0fac2fe-221e-455a-a6c4-b79449054fbd	LICENCE	3	Évaluation des capacités	\N	Expert technique	5	["CV des responsables", "Liste des équipements"]	t	2026-01-01 21:20:18.389+01	2026-01-01 21:20:18.389+01
87b736fe-3de6-43ca-8cda-01a01ec1c6eb	d0fac2fe-221e-455a-a6c4-b79449054fbd	LICENCE	4	Commission d'attribution	\N	Commission	3	[]	t	2026-01-01 21:20:18.39+01	2026-01-01 21:20:18.39+01
df663e17-571d-4dee-9f17-25752f473f0c	d0fac2fe-221e-455a-a6c4-b79449054fbd	LICENCE	5	Émission de la licence	\N	Secrétariat	2	[]	t	2026-01-01 21:20:18.39+01	2026-01-01 21:20:18.39+01
0db4583e-1f2b-4ff4-8ffd-3a07db163685	d0fac2fe-221e-455a-a6c4-b79449054fbd	PERMIS	1	Dépôt de dossier	\N	Agent de guichet	1	["Demande de permis", "Pièce d'identité"]	t	2026-01-01 21:20:18.39+01	2026-01-01 21:20:18.39+01
4a6fb117-47d5-4d8c-baad-bfb7430f4dd6	d0fac2fe-221e-455a-a6c4-b79449054fbd	PERMIS	2	Étude de conformité	\N	Technicien	4	["Plans techniques", "Certificats"]	t	2026-01-01 21:20:18.391+01	2026-01-01 21:20:18.391+01
7e57054c-211b-4835-b6aa-8d8d357eeb19	d0fac2fe-221e-455a-a6c4-b79449054fbd	PERMIS	3	Enquête de terrain	\N	Inspecteur terrain	5	["Rapport d'inspection précédent"]	t	2026-01-01 21:20:18.391+01	2026-01-01 21:20:18.391+01
274e33d0-8b85-4cbe-9019-db202806bd58	d0fac2fe-221e-455a-a6c4-b79449054fbd	PERMIS	4	Avis technique	\N	Ingénieur	3	[]	t	2026-01-01 21:20:18.391+01	2026-01-01 21:20:18.391+01
277819d7-65e7-44c1-bb23-33f177c0d837	d0fac2fe-221e-455a-a6c4-b79449054fbd	PERMIS	5	Délivrance du permis	\N	Autorité compétente	2	[]	t	2026-01-01 21:20:18.392+01	2026-01-01 21:20:18.392+01
1e3cf281-db87-46b7-a930-29ddcc575d0a	488984b3-173c-4944-9bb6-ebe597b69d43	AUTORISATION	1	Réception de la demande	\N	Agent de réception	2	["Formulaire de demande", "Pièce d'identité"]	t	2026-01-01 21:20:18.419+01	2026-01-01 21:20:18.419+01
9ef9db5b-81f7-4e4b-b63b-c03c385cc8ba	488984b3-173c-4944-9bb6-ebe597b69d43	AUTORISATION	2	Analyse technique	\N	Analyste technique	5	["Plan d'affaires", "Étude de faisabilité"]	t	2026-01-01 21:20:18.419+01	2026-01-01 21:20:18.419+01
5d0d2531-b265-47bd-8dcc-bb483602cf65	488984b3-173c-4944-9bb6-ebe597b69d43	AUTORISATION	3	Vérification juridique	\N	Juriste	3	["Statuts de l'entreprise", "RCCM"]	t	2026-01-01 21:20:18.42+01	2026-01-01 21:20:18.42+01
3a927da7-1825-4681-a439-811e78c8f746	488984b3-173c-4944-9bb6-ebe597b69d43	AUTORISATION	4	Validation du chef de service	\N	Chef de service	2	[]	t	2026-01-01 21:20:18.42+01	2026-01-01 21:20:18.42+01
ef9488e2-54f0-4205-9240-c3ed8168ca37	488984b3-173c-4944-9bb6-ebe597b69d43	AUTORISATION	5	Décision finale	\N	Directeur	3	[]	t	2026-01-01 21:20:18.42+01	2026-01-01 21:20:18.42+01
371cc488-bf88-427d-a2d9-8ed0b0665389	488984b3-173c-4944-9bb6-ebe597b69d43	LICENCE	1	Enregistrement	\N	Agent d'accueil	1	["Formulaire de licence", "ID National"]	t	2026-01-01 21:20:18.421+01	2026-01-01 21:20:18.421+01
fdc43118-294e-4fdf-b1f1-125708dce022	488984b3-173c-4944-9bb6-ebe597b69d43	LICENCE	2	Inspection préalable	\N	Inspecteur	7	["Certificat de conformité", "Plan de localisation"]	t	2026-01-01 21:20:18.421+01	2026-01-01 21:20:18.421+01
8658dd80-6cd3-4e60-a0be-9d6f0f0f7106	488984b3-173c-4944-9bb6-ebe597b69d43	LICENCE	3	Évaluation des capacités	\N	Expert technique	5	["CV des responsables", "Liste des équipements"]	t	2026-01-01 21:20:18.421+01	2026-01-01 21:20:18.421+01
42a6725e-74ab-474d-903b-61bd4bbfbeb9	488984b3-173c-4944-9bb6-ebe597b69d43	LICENCE	4	Commission d'attribution	\N	Commission	3	[]	t	2026-01-01 21:20:18.422+01	2026-01-01 21:20:18.422+01
b9b5d194-1484-459e-8fcc-cae714543c28	488984b3-173c-4944-9bb6-ebe597b69d43	LICENCE	5	Émission de la licence	\N	Secrétariat	2	[]	t	2026-01-01 21:20:18.422+01	2026-01-01 21:20:18.422+01
16b039d8-c052-46fc-8f98-b123b0feed6e	488984b3-173c-4944-9bb6-ebe597b69d43	PERMIS	1	Dépôt de dossier	\N	Agent de guichet	1	["Demande de permis", "Pièce d'identité"]	t	2026-01-01 21:20:18.422+01	2026-01-01 21:20:18.422+01
8f57ddcc-4c38-45f7-98e8-c6b8c87be008	488984b3-173c-4944-9bb6-ebe597b69d43	PERMIS	2	Étude de conformité	\N	Technicien	4	["Plans techniques", "Certificats"]	t	2026-01-01 21:20:18.423+01	2026-01-01 21:20:18.423+01
d9e031ab-96a8-4e58-bf4d-33eb816c636f	488984b3-173c-4944-9bb6-ebe597b69d43	PERMIS	3	Enquête de terrain	\N	Inspecteur terrain	5	["Rapport d'inspection précédent"]	t	2026-01-01 21:20:18.423+01	2026-01-01 21:20:18.423+01
56ccaf48-1aee-4e09-ba45-fffd6455fc3b	488984b3-173c-4944-9bb6-ebe597b69d43	PERMIS	4	Avis technique	\N	Ingénieur	3	[]	t	2026-01-01 21:20:18.423+01	2026-01-01 21:20:18.423+01
cdc9f942-bedd-454d-8b07-778c63f0399a	488984b3-173c-4944-9bb6-ebe597b69d43	PERMIS	5	Délivrance du permis	\N	Autorité compétente	2	[]	t	2026-01-01 21:20:18.424+01	2026-01-01 21:20:18.424+01
\.


--
-- Data for Name: opportunity_applications; Type: TABLE DATA; Schema: public; Owner: yvesmpunga
--

COPY public.opportunity_applications (id, reference, "opportunityId", "investorId", "proposedAmount", "proposedJobs", motivation, experience, timeline, status, "submittedAt", "reviewedAt", "reviewedById", "reviewNotes", score, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: opportunity_documents; Type: TABLE DATA; Schema: public; Owner: yvesmpunga
--

COPY public.opportunity_documents (id, "opportunityId", name, description, "isRequired", category, "templateUrl", "maxFileSize", "allowedFormats", "sortOrder", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: overtimes; Type: TABLE DATA; Schema: public; Owner: yvesmpunga
--

COPY public.overtimes (id, employee_id, date, start_time, end_time, hours, type, rate, reason, project, request_date, is_pre_approved, status, compensation_type, compensation_amount, compensation_hours, currency, is_paid, paid_amount, paid_at, payslip_id, notes, rejection_reason, requested_by_id, approved_by_id, approved_at, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: permissions; Type: TABLE DATA; Schema: public; Owner: yvesmpunga
--

COPY public.permissions (id, code, name, name_fr, name_en, description, module, action, is_active, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: pieces_requises; Type: TABLE DATA; Schema: public; Owner: yvesmpunga
--

COPY public.pieces_requises (id, "acteId", name, description, category, "isRequired", "acceptedFormats", "maxSizeMB", "templateUrl", "templateName", "orderIndex", "validityMonths", instructions, "isActive", "createdAt", "updatedAt") FROM stdin;
cb70769a-f06a-4d18-96d1-a9b987a3bc7e	8066a734-fa8a-4878-847e-7e5bb5a4b617	Statuts notaries de l'entreprise	\N	JURIDIQUE	t	PDF,JPG,PNG	10	\N	\N	1	\N	\N	t	2025-12-29 06:44:47.382+01	2025-12-29 06:44:47.382+01
397a3fa1-52cc-427d-a166-752323b60539	8066a734-fa8a-4878-847e-7e5bb5a4b617	Registre de Commerce (RCCM)	\N	JURIDIQUE	t	PDF,JPG,PNG	10	\N	\N	2	\N	\N	t	2025-12-29 06:44:47.382+01	2025-12-29 06:44:47.382+01
328556e2-91be-487c-a346-fab027beec96	8066a734-fa8a-4878-847e-7e5bb5a4b617	Numero d'Identification Nationale (NIF)	\N	FISCAL	t	PDF,JPG,PNG	10	\N	\N	3	\N	\N	t	2025-12-29 06:44:47.382+01	2025-12-29 06:44:47.382+01
73f98099-6aec-43c3-8d19-3e6da0be38a5	8066a734-fa8a-4878-847e-7e5bb5a4b617	Numero d'Impot	\N	FISCAL	t	PDF,JPG,PNG	10	\N	\N	4	\N	\N	t	2025-12-29 06:44:47.382+01	2025-12-29 06:44:47.382+01
f9c93f15-7ee0-494f-80b8-5cc140586d77	8066a734-fa8a-4878-847e-7e5bb5a4b617	Business Plan detaille	\N	FINANCIER	t	PDF,JPG,PNG	10	\N	\N	5	\N	\N	t	2025-12-29 06:44:47.382+01	2025-12-29 06:44:47.382+01
a0986e72-8ed7-4558-8346-508e5b7e03db	8066a734-fa8a-4878-847e-7e5bb5a4b617	Etude de faisabilite	\N	TECHNIQUE	t	PDF,JPG,PNG	10	\N	\N	6	\N	\N	t	2025-12-29 06:44:47.382+01	2025-12-29 06:44:47.382+01
4d86431c-db87-42fe-86d6-a035a4e70639	8066a734-fa8a-4878-847e-7e5bb5a4b617	Preuve de financement	\N	FINANCIER	t	PDF,JPG,PNG	10	\N	\N	7	\N	\N	t	2025-12-29 06:44:47.382+01	2025-12-29 06:44:47.382+01
8069d871-f3c2-4aeb-a225-d9c601581915	8066a734-fa8a-4878-847e-7e5bb5a4b617	Attestation de domiciliation bancaire	\N	FINANCIER	t	PDF,JPG,PNG	10	\N	\N	8	\N	\N	t	2025-12-29 06:44:47.382+01	2025-12-29 06:44:47.382+01
c874a4cd-0009-44d7-9bfd-93418c21b6a6	8066a734-fa8a-4878-847e-7e5bb5a4b617	CV des dirigeants	\N	IDENTITE	f	PDF,JPG,PNG	10	\N	\N	9	\N	\N	t	2025-12-29 06:44:47.382+01	2025-12-29 06:44:47.382+01
b617bf23-0589-4e88-816e-aabf74027761	8066a734-fa8a-4878-847e-7e5bb5a4b617	Etude d'impact environnemental	\N	TECHNIQUE	f	PDF,JPG,PNG	10	\N	\N	10	\N	\N	t	2025-12-29 06:44:47.382+01	2025-12-29 06:44:47.382+01
3240d644-ed00-4976-a162-2f40c8c8aaf8	862f5733-01f2-493c-8d58-eebb411934b0	Demande ecrite	\N	AUTRE	t	PDF,JPG,PNG	10	\N	\N	1	\N	\N	t	2025-12-29 06:44:47.386+01	2025-12-29 06:44:47.386+01
0e848c98-d168-44e7-95b7-dc7d4b53da5b	862f5733-01f2-493c-8d58-eebb411934b0	RCCM	\N	JURIDIQUE	t	PDF,JPG,PNG	10	\N	\N	2	\N	\N	t	2025-12-29 06:44:47.386+01	2025-12-29 06:44:47.386+01
745aa2d3-a083-4777-b40a-0623e81e317b	862f5733-01f2-493c-8d58-eebb411934b0	NIF	\N	FISCAL	t	PDF,JPG,PNG	10	\N	\N	3	\N	\N	t	2025-12-29 06:44:47.386+01	2025-12-29 06:44:47.386+01
e9d235e3-11ea-4529-ac61-5fcb811ec4b2	862f5733-01f2-493c-8d58-eebb411934b0	Facture pro forma	\N	FINANCIER	t	PDF,JPG,PNG	10	\N	\N	4	\N	\N	t	2025-12-29 06:44:47.386+01	2025-12-29 06:44:47.386+01
18e1452d-2d6a-471c-82fd-e9efc478d6b6	862f5733-01f2-493c-8d58-eebb411934b0	Attestation de conformite	\N	TECHNIQUE	f	PDF,JPG,PNG	10	\N	\N	5	\N	\N	t	2025-12-29 06:44:47.386+01	2025-12-29 06:44:47.386+01
b5276d4b-1e57-475b-9424-96b156c3578c	3f39bcd2-740c-44e2-be00-b263acb7268f	Demande adressee au Ministre des Mines	\N	AUTRE	t	PDF,JPG,PNG	10	\N	\N	1	\N	\N	t	2025-12-29 06:44:47.387+01	2025-12-29 06:44:47.387+01
14019cc6-d9e7-4118-8113-fea0ca845769	3f39bcd2-740c-44e2-be00-b263acb7268f	Permis de recherche (PR)	\N	JURIDIQUE	t	PDF,JPG,PNG	10	\N	\N	2	\N	\N	t	2025-12-29 06:44:47.387+01	2025-12-29 06:44:47.387+01
a2ffdcbb-ab27-408d-aa75-d8b4efd8b703	3f39bcd2-740c-44e2-be00-b263acb7268f	Etude de faisabilite technique	\N	TECHNIQUE	t	PDF,JPG,PNG	10	\N	\N	3	\N	\N	t	2025-12-29 06:44:47.387+01	2025-12-29 06:44:47.387+01
83e33c66-5ac6-4344-9252-dd9f0d463948	3f39bcd2-740c-44e2-be00-b263acb7268f	Plan de developpement	\N	TECHNIQUE	t	PDF,JPG,PNG	10	\N	\N	4	\N	\N	t	2025-12-29 06:44:47.387+01	2025-12-29 06:44:47.387+01
6f94e5cc-a382-441a-b83f-2ed6245f7fe5	3f39bcd2-740c-44e2-be00-b263acb7268f	Etude d'impact environnemental et social (EIES)	\N	TECHNIQUE	t	PDF,JPG,PNG	10	\N	\N	5	\N	\N	t	2025-12-29 06:44:47.387+01	2025-12-29 06:44:47.387+01
b7e8f78e-50ce-40ec-abc0-e1c69ce040e2	3f39bcd2-740c-44e2-be00-b263acb7268f	Plan de gestion environnementale et sociale (PGES)	\N	TECHNIQUE	t	PDF,JPG,PNG	10	\N	\N	6	\N	\N	t	2025-12-29 06:44:47.387+01	2025-12-29 06:44:47.387+01
67ed19ac-9595-494e-8170-f3d87900cdef	3f39bcd2-740c-44e2-be00-b263acb7268f	Garantie financiere de rehabilitation	\N	FINANCIER	t	PDF,JPG,PNG	10	\N	\N	7	\N	\N	t	2025-12-29 06:44:47.387+01	2025-12-29 06:44:47.387+01
ec3ca700-cf3b-45e7-a8d4-8d99611f0cb4	3f39bcd2-740c-44e2-be00-b263acb7268f	Statuts de la societe	\N	JURIDIQUE	t	PDF,JPG,PNG	10	\N	\N	8	\N	\N	t	2025-12-29 06:44:47.387+01	2025-12-29 06:44:47.387+01
4c99f36d-1a22-405c-a030-786d7237edb6	67f382b3-3e04-4e4c-b722-341c322e9230	Demande ecrite	\N	AUTRE	t	PDF,JPG,PNG	10	\N	\N	1	\N	\N	t	2025-12-29 06:44:47.39+01	2025-12-29 06:44:47.39+01
8d9ca812-ab1e-4ebe-8ee7-0c87484b6202	67f382b3-3e04-4e4c-b722-341c322e9230	Statuts de l'entreprise	\N	JURIDIQUE	t	PDF,JPG,PNG	10	\N	\N	2	\N	\N	t	2025-12-29 06:44:47.39+01	2025-12-29 06:44:47.39+01
16f8df15-d046-45f0-bb3e-68c4072b9494	67f382b3-3e04-4e4c-b722-341c322e9230	RCCM	\N	JURIDIQUE	t	PDF,JPG,PNG	10	\N	\N	3	\N	\N	t	2025-12-29 06:44:47.39+01	2025-12-29 06:44:47.39+01
d54bb20b-4fdf-4720-8bb5-b3d48538f519	67f382b3-3e04-4e4c-b722-341c322e9230	NIF et Numero d'impot	\N	FISCAL	t	PDF,JPG,PNG	10	\N	\N	4	\N	\N	t	2025-12-29 06:44:47.39+01	2025-12-29 06:44:47.39+01
8c97e847-935f-4ff8-9804-f5fc23d88c15	67f382b3-3e04-4e4c-b722-341c322e9230	Plan de localisation	\N	TECHNIQUE	t	PDF,JPG,PNG	10	\N	\N	5	\N	\N	t	2025-12-29 06:44:47.39+01	2025-12-29 06:44:47.39+01
8ae107b7-a20e-4ee3-b08d-914d39f9025b	67f382b3-3e04-4e4c-b722-341c322e9230	Certificat d'urbanisme	\N	TECHNIQUE	t	PDF,JPG,PNG	10	\N	\N	6	\N	\N	t	2025-12-29 06:44:47.39+01	2025-12-29 06:44:47.39+01
48c83009-ca60-46da-b74c-a0b88614fe49	67f382b3-3e04-4e4c-b722-341c322e9230	Permis d'environnement	\N	TECHNIQUE	t	PDF,JPG,PNG	10	\N	\N	7	\N	\N	t	2025-12-29 06:44:47.39+01	2025-12-29 06:44:47.39+01
abdea5f2-7544-491c-98c6-033d59363b7d	781da678-84a7-4717-93bc-41beeaaa587d	Demande ecrite	\N	AUTRE	t	PDF,JPG,PNG	10	\N	\N	1	\N	\N	t	2025-12-29 06:44:47.392+01	2025-12-29 06:44:47.392+01
946b2738-29f4-45ef-bcf7-a09045bda05b	781da678-84a7-4717-93bc-41beeaaa587d	Facture commerciale	\N	FINANCIER	t	PDF,JPG,PNG	10	\N	\N	2	\N	\N	t	2025-12-29 06:44:47.392+01	2025-12-29 06:44:47.392+01
f4eb38a1-9d8f-4d75-a7a9-2a70c6ac38be	781da678-84a7-4717-93bc-41beeaaa587d	Liste de colisage	\N	AUTRE	t	PDF,JPG,PNG	10	\N	\N	3	\N	\N	t	2025-12-29 06:44:47.392+01	2025-12-29 06:44:47.392+01
16f4c469-9f35-442b-9513-a28597f9aabe	781da678-84a7-4717-93bc-41beeaaa587d	Declaration d'exportation	\N	AUTRE	t	PDF,JPG,PNG	10	\N	\N	4	\N	\N	t	2025-12-29 06:44:47.392+01	2025-12-29 06:44:47.392+01
d91e24ef-d604-4340-b482-46044fc1bb5a	9c5e4642-47ba-4e86-b663-5b6c0306eea5	Demande ecrite	\N	AUTRE	t	PDF,JPG,PNG	10	\N	\N	1	\N	\N	t	2025-12-29 06:44:47.394+01	2025-12-29 06:44:47.394+01
c0f4cc2e-55bd-47fa-9e25-6e1ab75d5c1a	9c5e4642-47ba-4e86-b663-5b6c0306eea5	EIES approuvee	\N	TECHNIQUE	t	PDF,JPG,PNG	10	\N	\N	2	\N	\N	t	2025-12-29 06:44:47.394+01	2025-12-29 06:44:47.394+01
50259661-9953-4c76-85f6-ff91850e1157	9c5e4642-47ba-4e86-b663-5b6c0306eea5	Rapport de mise en oeuvre du PGES	\N	TECHNIQUE	t	PDF,JPG,PNG	10	\N	\N	3	\N	\N	t	2025-12-29 06:44:47.394+01	2025-12-29 06:44:47.394+01
cb463257-5c93-4323-a283-3df766f07e9c	9c5e4642-47ba-4e86-b663-5b6c0306eea5	Permis environnemental	\N	TECHNIQUE	t	PDF,JPG,PNG	10	\N	\N	4	\N	\N	t	2025-12-29 06:44:47.394+01	2025-12-29 06:44:47.394+01
\.


--
-- Data for Name: procurement_bid_documents; Type: TABLE DATA; Schema: public; Owner: yvesmpunga
--

COPY public.procurement_bid_documents (id, bid_id, document_type_id, category, title, description, filename, original_name, filepath, filetype, filesize, is_compliant, compliance_notes, checked_by_id, checked_at, uploaded_by_id, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: procurement_bidder_documents; Type: TABLE DATA; Schema: public; Owner: yvesmpunga
--

COPY public.procurement_bidder_documents (id, bidder_id, document_type_id, title, description, filename, original_name, filepath, filetype, filesize, expiry_date, is_verified, verified_by_id, verified_at, uploaded_by_id, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: procurement_bidders; Type: TABLE DATA; Schema: public; Owner: yvesmpunga
--

COPY public.procurement_bidders (id, code, company_name, trade_name, legal_form, rccm, idnat, nif, niss, capital_social, currency, founding_date, country_id, province_id, city_id, address, postal_code, phone, phone2, fax, email, website, contact_person, contact_title, contact_phone, contact_email, bank_name, bank_account_number, bank_swift_code, main_activity, sectors, employee_count, annual_revenue, certifications, status, blacklist_reason, blacklist_start_date, blacklist_end_date, blacklisted_by_id, rating, total_contracts_won, total_contracts_value, logo, notes, created_by_id, verified_by_id, verified_at, created_at, updated_at) FROM stdin;
c3d986e7-3dee-40fc-b64d-d494382bbef9	ENT-00001	Agricongo	AgriCongo	SARL	33335	34545454	545454	\N	\N	USD	\N	1c00b01f-f9d1-4784-a2d6-db1b571694dc	cmjomofsn000bjhjmaomn4zl5	046a58fe-68e9-46d7-9c27-73a293341b50	cxxc	reerer	354545454	\N	\N	gdf@gmail.com		\N	\N	\N	\N	Rwa Banque	\N	\N	\N	\N	\N	\N	\N	ACTIVE	\N	\N	\N	\N	\N	0	0.00	\N	dfgdf	\N	\N	\N	2026-01-04 01:02:26.662	2026-01-04 01:02:26.662
\.


--
-- Data for Name: procurement_bids; Type: TABLE DATA; Schema: public; Owner: yvesmpunga
--

COPY public.procurement_bids (id, tender_id, bidder_id, lot_id, reference, submission_date, financial_offer, currency, technical_proposal, delivery_time, delivery_unit, validity_period, guarantee_provided, guarantee_amount, guarantee_reference, guarantee_expiry_date, status, administrative_score, administrative_status, administrative_notes, technical_score, technical_details, technical_notes, financial_score, financial_details, financial_notes, total_score, ranking, rejection_reason, disqualification_reason, evaluated_by_id, evaluation_date, received_by_id, notes, created_at, updated_at) FROM stdin;
74fb27ad-e953-4967-a468-cbc318ac86ba	14fa0ed4-bdc5-4730-a506-c7cb1ab4c1e9	c3d986e7-3dee-40fc-b64d-d494382bbef9	\N	SOUM-2026-00001	2026-01-04 00:00:00	6000.00	USD	lnkjn	700	DAYS	90	t	5000.00	565565	2026-01-19	RECEIVED	\N	PENDING	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	jhj	2026-01-04 02:42:28.917	2026-01-04 02:42:28.917
\.


--
-- Data for Name: procurement_contract_documents; Type: TABLE DATA; Schema: public; Owner: yvesmpunga
--

COPY public.procurement_contract_documents (id, contract_id, execution_id, document_type_id, category, title, description, filename, original_name, filepath, filetype, filesize, version, is_signed, signed_at, uploaded_by_id, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: procurement_contract_executions; Type: TABLE DATA; Schema: public; Owner: yvesmpunga
--

COPY public.procurement_contract_executions (id, contract_id, phase, description, type, planned_date, actual_date, status, progress_percent, quantity_planned, quantity_delivered, unit, amount_planned, amount_paid, currency, payment_date, payment_reference, invoice_number, invoice_date, penalty_amount, penalty_reason, delay_days, quality_score, quality_notes, inspection_report, inspected_by_id, inspection_date, approved_by_id, approval_date, created_by_id, notes, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: procurement_contracts; Type: TABLE DATA; Schema: public; Owner: yvesmpunga
--

COPY public.procurement_contracts (id, tender_id, bid_id, bidder_id, lot_id, contract_number, title, description, contract_value, currency, signature_date, effective_date, start_date, end_date, delivery_deadline, delivery_location, status, performance_guarantee, guarantee_reference, guarantee_expiry_date, advance_payment, advance_payment_date, retention_percentage, payment_terms, penalty_clause, penalty_percentage_per_day, max_penalty_percentage, total_penalty_applied, progress_percent, total_paid, remaining_amount, completion_date, reception_date, final_reception_date, termination_reason, termination_date, ministry_id, managed_by_id, signed_by_client_id, signed_by_contractor_name, signed_by_contractor_title, created_by_id, is_archived, archived_at, certificate_number, certificate_issued_at, certificate_issued_by_id, notes, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: procurement_document_types; Type: TABLE DATA; Schema: public; Owner: yvesmpunga
--

COPY public.procurement_document_types (id, code, name, description, category, is_required, is_active, sort_order, created_at, updated_at) FROM stdin;
974636a4-2bd8-477e-a720-6f5119ca3ee4	DAO	Dossier d'Appel d'Offres	\N	TENDER	t	t	1	2026-01-03 20:36:10.467+01	2026-01-03 20:36:10.467+01
dde7c308-786e-4c82-ae61-d2077b05e42a	CAHIER_CHARGES	Cahier des Charges	\N	TENDER	t	t	2	2026-01-03 20:36:10.475+01	2026-01-03 20:36:10.475+01
05de2f19-0cca-40bb-a65c-1e5956063f4f	SPECS_TECH	Specifications Techniques	\N	TENDER	f	t	3	2026-01-03 20:36:10.477+01	2026-01-03 20:36:10.477+01
b26cc245-4586-4415-a8a9-f546af2e3ba2	ADDITIF	Additif / Rectificatif	\N	TENDER	f	t	4	2026-01-03 20:36:10.479+01	2026-01-03 20:36:10.479+01
cdd3ef93-16cb-46d6-b103-49aa51fbc56a	PV_OUVERTURE	Proces-verbal d'ouverture des plis	\N	TENDER	f	t	5	2026-01-03 20:36:10.481+01	2026-01-03 20:36:10.481+01
4c3c8321-da7e-46a1-96b4-d332d61c8085	RAPPORT_EVAL	Rapport d'evaluation	\N	TENDER	f	t	6	2026-01-03 20:36:10.482+01	2026-01-03 20:36:10.482+01
9e818ac3-5998-4a98-b156-b1371c12485e	LETTRE_SOUMISSION	Lettre de Soumission	\N	BID	t	t	10	2026-01-03 20:36:10.484+01	2026-01-03 20:36:10.484+01
d786bfc2-a155-4233-8644-3d849a59f927	OFFRE_TECH	Offre Technique	\N	BID	t	t	11	2026-01-03 20:36:10.486+01	2026-01-03 20:36:10.486+01
eee4af0a-9a56-4a18-9e98-18f3232ed771	OFFRE_FIN	Offre Financiere	\N	BID	t	t	12	2026-01-03 20:36:10.488+01	2026-01-03 20:36:10.488+01
ad460cb8-37e6-4173-bd78-194f47797427	CAUTION_SOUMISSION	Caution de Soumission	\N	BID	f	t	13	2026-01-03 20:36:10.491+01	2026-01-03 20:36:10.491+01
4fb630ec-a586-4873-a1ef-1ce88e5e5d21	RCCM	Registre de Commerce (RCCM)	\N	BID	t	t	14	2026-01-03 20:36:10.492+01	2026-01-03 20:36:10.492+01
43700fc4-0a3a-4186-a147-3b61587f00c9	NIF	Numero d'Impot Fiscal (NIF)	\N	BID	t	t	15	2026-01-03 20:36:10.494+01	2026-01-03 20:36:10.494+01
f0c3a1c5-47e1-4f0c-8d18-3e2596c5845b	IDNAT	Identification Nationale (IDNAT)	\N	BID	t	t	16	2026-01-03 20:36:10.495+01	2026-01-03 20:36:10.495+01
879890e1-13f5-4b07-a1ab-d66a21073787	ATTESTATION_FISC	Attestation Fiscale	\N	BID	t	t	17	2026-01-03 20:36:10.497+01	2026-01-03 20:36:10.497+01
f15cfc43-4ef2-4cba-a0dc-d94b110e524a	ATTESTATION_CNSS	Attestation CNSS/INSS	\N	BID	f	t	18	2026-01-03 20:36:10.498+01	2026-01-03 20:36:10.498+01
fccd5e26-d9ef-4549-9021-0c498a4bea67	BILANS	Bilans Financiers	\N	BID	f	t	19	2026-01-03 20:36:10.5+01	2026-01-03 20:36:10.5+01
9bd7b7f7-9c6f-4870-80de-4326de60e452	REFERENCES	References / Attestations de bonne execution	\N	BID	f	t	20	2026-01-03 20:36:10.501+01	2026-01-03 20:36:10.501+01
ae118222-302e-4a4d-a619-9f0b4e3b2276	CONTRAT	Contrat Signe	\N	CONTRACT	t	t	30	2026-01-03 20:36:10.502+01	2026-01-03 20:36:10.502+01
127ed5d7-6106-4587-a536-26d8b78e4410	CAUTION_BONNE_EXEC	Caution de Bonne Execution	\N	CONTRACT	f	t	31	2026-01-03 20:36:10.504+01	2026-01-03 20:36:10.504+01
1290afe6-32da-48d1-955c-3ea0a8ab00ac	AVENANT	Avenant au Contrat	\N	CONTRACT	f	t	32	2026-01-03 20:36:10.505+01	2026-01-03 20:36:10.505+01
0c811b0e-5ef4-4ee3-9598-46bee500b7b5	ORDRE_SERVICE	Ordre de Service	\N	CONTRACT	f	t	33	2026-01-03 20:36:10.506+01	2026-01-03 20:36:10.506+01
da530750-6bb5-41e2-bfc2-8f122366549a	BON_LIVRAISON	Bon de Livraison	\N	EXECUTION	f	t	40	2026-01-03 20:36:10.507+01	2026-01-03 20:36:10.507+01
83f54d41-b3c8-4eca-8418-db893873ef95	PV_RECEPTION	Proces-verbal de Reception	\N	EXECUTION	f	t	41	2026-01-03 20:36:10.508+01	2026-01-03 20:36:10.508+01
5b5eaa42-3061-4794-ba7c-da6233794c0a	FACTURE	Facture	\N	EXECUTION	f	t	42	2026-01-03 20:36:10.509+01	2026-01-03 20:36:10.509+01
96ddd007-2b05-49d4-b692-bb6bb127b857	RAPPORT_SUIVI	Rapport de Suivi	\N	EXECUTION	f	t	43	2026-01-03 20:36:10.51+01	2026-01-03 20:36:10.51+01
b2561dea-3178-46eb-b9ff-d9c7b21d85f5	CERTIFICAT	Certificat de Passation de Marche	\N	EXECUTION	f	t	44	2026-01-03 20:36:10.511+01	2026-01-03 20:36:10.511+01
\.


--
-- Data for Name: procurement_evaluation_committees; Type: TABLE DATA; Schema: public; Owner: yvesmpunga
--

COPY public.procurement_evaluation_committees (id, tender_id, user_id, role, specialization, can_evaluate_technical, can_evaluate_financial, has_voting_right, nominated_by_id, nomination_date, status, recused_reason, notes, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: procurement_tender_documents; Type: TABLE DATA; Schema: public; Owner: yvesmpunga
--

COPY public.procurement_tender_documents (id, tender_id, document_type_id, title, description, filename, original_name, filepath, filetype, filesize, is_public, version, uploaded_by_id, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: procurement_tender_history; Type: TABLE DATA; Schema: public; Owner: yvesmpunga
--

COPY public.procurement_tender_history (id, tender_id, action, previous_status, new_status, description, metadata, performed_by_id, ip_address, created_at, updated_at) FROM stdin;
b0e115fe-2cb0-4b86-9d06-d528028f2a94	b8ebad94-6f93-43a9-a9bc-243d837a070a	CREATED	\N	DRAFT	Appel d'offres cree	\N	\N	\N	2026-01-03 22:55:43.764	2026-01-03 22:55:43.764
18b87c24-914a-428a-a723-211d47b375fc	14fa0ed4-bdc5-4730-a506-c7cb1ab4c1e9	CREATED	\N	DRAFT	Appel d'offres cree	\N	\N	\N	2026-01-03 23:01:41.838	2026-01-03 23:01:41.838
8d790a8c-7ccd-41a8-9bf7-1af5f0cb6199	14fa0ed4-bdc5-4730-a506-c7cb1ab4c1e9	UPDATED	\N	\N	Appel d'offres modifie	\N	\N	\N	2026-01-04 02:38:33.588	2026-01-04 02:38:33.588
daf6493d-df43-457c-a291-25864b1ff530	14fa0ed4-bdc5-4730-a506-c7cb1ab4c1e9	UPDATED	\N	\N	Appel d'offres modifie	\N	\N	\N	2026-01-04 02:41:07.596	2026-01-04 02:41:07.596
\.


--
-- Data for Name: procurement_tender_lots; Type: TABLE DATA; Schema: public; Owner: yvesmpunga
--

COPY public.procurement_tender_lots (id, tender_id, lot_number, title, description, specifications, quantity, unit, estimated_value, awarded_value, status, awarded_bidder_id, award_date, created_at, updated_at) FROM stdin;
a789b924-febd-498d-920e-96bc14427561	b8ebad94-6f93-43a9-a9bc-243d837a070a	1	Lot 4	Lot nuenro 1	\N	1.00	1	200.00	\N	OPEN	\N	\N	2026-01-03 22:55:43.76	2026-01-03 22:55:43.76
4fb4f5e6-c154-416e-b892-01d8244b3b74	b8ebad94-6f93-43a9-a9bc-243d837a070a	2	Lot 2	Lot 2	\N	1.00	2	120.00	\N	OPEN	\N	\N	2026-01-03 22:55:43.763	2026-01-03 22:55:43.763
cc4996f7-3cd7-4db0-8cee-9d4b58799c53	14fa0ed4-bdc5-4730-a506-c7cb1ab4c1e9	1	Lot 4	Lot nuenro 1	\N	1.00	1	200.00	\N	OPEN	\N	\N	2026-01-03 23:01:41.834	2026-01-04 02:41:07.598
00f31dbc-49a9-4f9a-a05e-f7b38d2c1d95	14fa0ed4-bdc5-4730-a506-c7cb1ab4c1e9	2	Lot 2	Lot 2	\N	1.00	2	120.00	\N	OPEN	\N	\N	2026-01-03 23:01:41.836	2026-01-04 02:41:07.6
\.


--
-- Data for Name: procurement_tenders; Type: TABLE DATA; Schema: public; Owner: yvesmpunga
--

COPY public.procurement_tenders (id, reference, title, description, objective, products_or_services, type, category, status, estimated_budget, currency, minimum_budget, maximum_budget, publish_date, submission_deadline, opening_date, evaluation_start_date, evaluation_end_date, award_date, contract_start_date, contract_end_date, delivery_deadline, delivery_unit, delivery_location, technical_criteria_weight, financial_criteria_weight, minimum_technical_score, eligibility_criteria, technical_criteria, financial_criteria, guarantee_required, guarantee_percentage, guarantee_type, ministry_id, department_id, created_by_id, approved_by_id, approval_date, approval_notes, cancellation_reason, cancelled_by_id, cancellation_date, is_archived, archived_at, archived_by_id, fiscal_year, budget_line, funding_source, contact_name, contact_email, contact_phone, created_at, updated_at) FROM stdin;
b8ebad94-6f93-43a9-a9bc-243d837a070a	AO-2026-0001	dswffds	sdfds	sdfds	\N	OPEN	SERVICES	DRAFT	340000.00	USD	\N	\N	2026-01-08 00:00:00	2026-01-10 22:42:00	2026-01-15 22:42:00	2026-01-07 00:00:00	2026-01-22 00:00:00	\N	\N	\N	\N	DAYS	\N	80.00	20.00	60.00	Autres informations	\N	\N	f	\N	\N	488984b3-173c-4944-9bb6-ebe597b69d43	95b561f2-ae22-4e1a-9c7b-7650f8f11a35	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	2026	\N	\N	\N	\N	\N	2026-01-03 22:55:43.757	2026-01-03 22:55:43.757
14fa0ed4-bdc5-4730-a506-c7cb1ab4c1e9	AO-2026-0002	Appel d'offre Achat  50 voitures toyota	sdfds	C'est des voitures à imoorter d'urgence	\N	OPEN	SERVICES	DRAFT	340000.00	USD	\N	\N	2026-01-08 00:00:00	2026-01-10 22:42:00	2026-01-15 22:42:00	2026-01-07 00:00:00	2026-01-22 00:00:00	\N	\N	\N	\N	DAYS	\N	80.00	20.00	60.00	Autres informations	\N	\N	f	\N	\N	488984b3-173c-4944-9bb6-ebe597b69d43	95b561f2-ae22-4e1a-9c7b-7650f8f11a35	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	2026	\N	\N	\N	\N	\N	2026-01-03 23:01:41.831	2026-01-04 02:41:07.589
\.


--
-- Data for Name: project_documents; Type: TABLE DATA; Schema: public; Owner: yvesmpunga
--

COPY public.project_documents (id, "projectId", name, "originalName", description, type, category, "mimeType", size, path, url, "uploadedById", "createdAt", "updatedAt") FROM stdin;
751134e1-78e1-49b4-a266-6a46824cf441	2073b8d8-abf6-467f-b6de-d049ed32cdd4	Document de test ANAPI	test-anapi.pdf	Fichier PDF de test pour verification	pdf	technical	application/pdf	329	/investisseur/dossiers/2073b8d8-abf6-467f-b6de-d049ed32cdd4/1766976209347_test_anapi.pdf	/investisseur/dossiers/2073b8d8-abf6-467f-b6de-d049ed32cdd4/1766976209347_test_anapi.pdf	\N	2025-12-29 03:43:29.348+01	2025-12-29 03:43:29.348+01
f2b2cd8c-a57c-4ca4-ab9d-8f64fabecb88	e9a739d4-b37d-4913-9d00-eb2727d21a46	Document 'initisal	marche_Lb_tables_2025-12-24 (1).pdf	Docuemnt xx1	pdf	technical	application/pdf	19265	/investisseur/dossiers/e9a739d4-b37d-4913-9d00-eb2727d21a46/1766976615965_marche_Lb_tables_2025_12_24__1_.pdf	/investisseur/dossiers/e9a739d4-b37d-4913-9d00-eb2727d21a46/1766976615965_marche_Lb_tables_2025_12_24__1_.pdf	\N	2025-12-29 03:50:15.966+01	2025-12-29 03:50:15.966+01
3fdbb308-6258-4fa6-9129-d9de7c4acc67	e9a739d4-b37d-4913-9d00-eb2727d21a46	rapport-enquete-PLT-20251225-0001-2025-12-26	rapport-enquete-PLT-20251225-0001-2025-12-26.pdf	tetse 4	pdf	administrative	application/pdf	55742	/investisseur/dossiers/e9a739d4-b37d-4913-9d00-eb2727d21a46/1766976656081_rapport_enquete_PLT_20251225_0001_2025_12_26.pdf	/investisseur/dossiers/e9a739d4-b37d-4913-9d00-eb2727d21a46/1766976656081_rapport_enquete_PLT_20251225_0001_2025_12_26.pdf	\N	2025-12-29 03:50:56.082+01	2025-12-29 03:50:56.082+01
\.


--
-- Data for Name: project_history; Type: TABLE DATA; Schema: public; Owner: yvesmpunga
--

COPY public.project_history (id, "projectId", action, "previousStatus", "newStatus", "fieldChanged", "previousValue", "newValue", description, metadata, "performedById", "performedByName", "ipAddress", "createdAt") FROM stdin;
\.


--
-- Data for Name: project_impacts; Type: TABLE DATA; Schema: public; Owner: yvesmpunga
--

COPY public.project_impacts (id, project_id, report_date, report_period, direct_jobs_planned, direct_jobs_created, indirect_jobs_planned, indirect_jobs_created, permanent_jobs, temporary_jobs, local_jobs, female_jobs, youth_jobs, projected_revenue, actual_revenue, taxes_paid, local_purchases, export_revenue, currency, trained_employees, training_hours, training_investment, community_investment, infrastructure_built, beneficiaries, carbon_footprint, renewable_energy_percent, waste_recycled_percent, water_usage, environmental_measures, technology_transfers, patents_registered, local_partnerships, achievements, challenges, next_steps, notes, status, verified_by_id, verified_at, created_by_id, created_at, updated_at) FROM stdin;
a0f2c782-7445-4e6d-9226-3b81004e4fd2	e9a739d4-b37d-4913-9d00-eb2727d21a46	2026-01-04 01:00:00+01	\N	200	0	500	0	0	0	0	0	0	0.00	0.00	0.00	400.00	0.00	USD	0	50	0.00	0.00	[]	0	\N	\N	\N	\N	[]	[]	0	0	\N	\N	\N	sds	DRAFT	\N	\N	cmjopae590000zjq2jkhfrkre	2026-01-04 05:33:20.3+01	2026-01-04 05:33:20.3+01
\.


--
-- Data for Name: project_milestones; Type: TABLE DATA; Schema: public; Owner: yvesmpunga
--

COPY public.project_milestones (id, project_id, name, description, category, planned_start_date, planned_end_date, actual_start_date, actual_end_date, status, progress, budget, actual_cost, currency, weight, deliverables, dependencies, responsible_name, responsible_contact, notes, "order", completed_by_id, completed_at, created_by_id, created_at, updated_at, priority) FROM stdin;
d7ea1b43-7e89-4541-828f-4bfeeaad33fe	e9a739d4-b37d-4913-9d00-eb2727d21a46	Jalon. 1	Jamoncc	OTHER	\N	2026-01-09 01:00:00+01	\N	\N	IN_PROGRESS	7	400.00	700.00	USD	0.00	["fx"]	[]	\N	\N	\N	1	\N	\N	cmjopae590000zjq2jkhfrkre	2026-01-04 05:32:01.003+01	2026-01-04 05:32:01.003+01	CRITICAL
\.


--
-- Data for Name: project_risks; Type: TABLE DATA; Schema: public; Owner: yvesmpunga
--

COPY public.project_risks (id, project_id, code, title, description, category, probability, impact, risk_score, risk_level, status, mitigation_strategy, mitigation_actions, contingency_plan, estimated_cost, mitigation_cost, currency, identified_date, review_date, next_review_date, resolved_date, owner_name, owner_contact, triggers, notes, created_by_id, updated_by_id, created_at, updated_at) FROM stdin;
a18b52ec-9200-4c3e-a6b6-7640288c9843	e9a739d4-b37d-4913-9d00-eb2727d21a46	R-PRJ-2024-00006-001	Risdque d efuite 	xcx	TECHNICAL	HIGH	HIGH	16	HIGH	IDENTIFIED	xx	[]	ddf	\N	\N	USD	2026-01-04 05:32:25.75+01	\N	\N	\N	\N	\N	[]	\N	cmjopae590000zjq2jkhfrkre	\N	2026-01-04 05:32:25.75+01	2026-01-04 05:32:25.75+01
\.


--
-- Data for Name: province_opportunities; Type: TABLE DATA; Schema: public; Owner: yvesmpunga
--

COPY public.province_opportunities (id, reference, title, description, "provinceId", "sectorId", "minInvestment", "maxInvestment", "expectedJobs", "projectDuration", location, advantages, requirements, "contactName", "contactEmail", "contactPhone", deadline, status, priority, "isFeatured", "viewsCount", "applicationsCount", "imageUrl", "publishedAt", "closedAt", "createdById", "createdAt", "updatedAt") FROM stdin;
de1d1c0f-d486-4b35-93b7-17552a3f44c5	OPP-958935-C8SD	Projet agricole - Kinshasa	Opportunité d'investissement dans la province de Kinshasa	cmjomofsn000bjhjmaomn4zl5	\N	476727.00	8572826.00	310	\N	\N	\N	\N	\N	\N	\N	\N	PUBLISHED	MEDIUM	t	0	0	\N	\N	\N	\N	2026-01-05 17:19:18.936614+01	2026-01-05 17:19:18.936614+01
17b7ef96-d00d-49b1-b7a5-7489d3322112	OPP-958939-2BD4	Exploitation minière - Kinshasa	Opportunité d'investissement dans la province de Kinshasa	cmjomofsn000bjhjmaomn4zl5	\N	241680.00	4296218.00	302	\N	\N	\N	\N	\N	\N	\N	\N	PUBLISHED	MEDIUM	f	0	0	\N	\N	\N	\N	2026-01-05 17:19:18.939962+01	2026-01-05 17:19:18.939962+01
17c46b53-5746-433d-b1ef-354cf6438bf6	OPP-958940-ZOH8	Usine de transformation - Kinshasa	Opportunité d'investissement dans la province de Kinshasa	cmjomofsn000bjhjmaomn4zl5	\N	598074.00	2334862.00	412	\N	\N	\N	\N	\N	\N	\N	\N	PUBLISHED	MEDIUM	f	0	0	\N	\N	\N	\N	2026-01-05 17:19:18.940636+01	2026-01-05 17:19:18.940636+01
4a4852a4-b56e-4318-b447-fc4c00ed74a0	OPP-958941-7N3I	Centrale électrique - Kinshasa	Opportunité d'investissement dans la province de Kinshasa	cmjomofsn000bjhjmaomn4zl5	\N	650591.00	7987136.00	106	\N	\N	\N	\N	\N	\N	\N	\N	PUBLISHED	MEDIUM	f	0	0	\N	\N	\N	\N	2026-01-05 17:19:18.941726+01	2026-01-05 17:19:18.941726+01
de85954d-ba19-453d-b6d9-ea51e5453f59	OPP-958942-RSAP	Parc touristique - Kinshasa	Opportunité d'investissement dans la province de Kinshasa	cmjomofsn000bjhjmaomn4zl5	\N	632393.00	6495781.00	384	\N	\N	\N	\N	\N	\N	\N	\N	PUBLISHED	MEDIUM	f	0	0	\N	\N	\N	\N	2026-01-05 17:19:18.94227+01	2026-01-05 17:19:18.94227+01
599230c2-9038-4461-b83e-ed4163b6d2fa	OPP-958942-K5QJ	Projet agricole - Haut-Katanga	Opportunité d'investissement dans la province de Haut-Katanga	cmjomofsp000cjhjmmfq29ufa	\N	930993.00	7360515.00	475	\N	\N	\N	\N	\N	\N	\N	\N	PUBLISHED	MEDIUM	t	0	0	\N	\N	\N	\N	2026-01-05 17:19:18.942861+01	2026-01-05 17:19:18.942861+01
27f2a583-9a7a-4c80-9d67-162789361eab	OPP-958943-YL3A	Exploitation minière - Haut-Katanga	Opportunité d'investissement dans la province de Haut-Katanga	cmjomofsp000cjhjmmfq29ufa	\N	430686.00	2385162.00	479	\N	\N	\N	\N	\N	\N	\N	\N	PUBLISHED	MEDIUM	f	0	0	\N	\N	\N	\N	2026-01-05 17:19:18.943883+01	2026-01-05 17:19:18.943883+01
d6b10aac-6426-4519-a120-a669c8beac45	OPP-958944-2Q9O	Usine de transformation - Haut-Katanga	Opportunité d'investissement dans la province de Haut-Katanga	cmjomofsp000cjhjmmfq29ufa	\N	796700.00	1699094.00	297	\N	\N	\N	\N	\N	\N	\N	\N	PUBLISHED	MEDIUM	f	0	0	\N	\N	\N	\N	2026-01-05 17:19:18.944868+01	2026-01-05 17:19:18.944868+01
229d1b1f-0b7c-43bf-9752-52aaea123903	OPP-958945-68ZV	Centrale électrique - Haut-Katanga	Opportunité d'investissement dans la province de Haut-Katanga	cmjomofsp000cjhjmmfq29ufa	\N	392778.00	8416863.00	340	\N	\N	\N	\N	\N	\N	\N	\N	PUBLISHED	MEDIUM	f	0	0	\N	\N	\N	\N	2026-01-05 17:19:18.945499+01	2026-01-05 17:19:18.945499+01
a66ad249-0d98-43ef-b68f-30d582e24b4d	OPP-958945-4YUK	Parc touristique - Haut-Katanga	Opportunité d'investissement dans la province de Haut-Katanga	cmjomofsp000cjhjmmfq29ufa	\N	926150.00	7500849.00	260	\N	\N	\N	\N	\N	\N	\N	\N	PUBLISHED	MEDIUM	f	0	0	\N	\N	\N	\N	2026-01-05 17:19:18.945978+01	2026-01-05 17:19:18.945978+01
ce0177ad-8a28-4ca9-841e-fc599e57e300	OPP-958946-CQXK	Zone industrielle - Haut-Katanga	Opportunité d'investissement dans la province de Haut-Katanga	cmjomofsp000cjhjmmfq29ufa	\N	217578.00	4405023.00	423	\N	\N	\N	\N	\N	\N	\N	\N	PUBLISHED	MEDIUM	f	0	0	\N	\N	\N	\N	2026-01-05 17:19:18.946377+01	2026-01-05 17:19:18.946377+01
b40acff6-1941-45ab-823b-e7db4b62c486	OPP-958946-KPY5	Infrastructure routière - Haut-Katanga	Opportunité d'investissement dans la province de Haut-Katanga	cmjomofsp000cjhjmmfq29ufa	\N	625014.00	9538344.00	253	\N	\N	\N	\N	\N	\N	\N	\N	PUBLISHED	MEDIUM	f	0	0	\N	\N	\N	\N	2026-01-05 17:19:18.946739+01	2026-01-05 17:19:18.946739+01
c6c26426-084c-46a4-8cad-77eb47d6dc98	OPP-958947-L89D	Port fluvial - Haut-Katanga	Opportunité d'investissement dans la province de Haut-Katanga	cmjomofsp000cjhjmmfq29ufa	\N	635589.00	2903381.00	397	\N	\N	\N	\N	\N	\N	\N	\N	PUBLISHED	MEDIUM	f	0	0	\N	\N	\N	\N	2026-01-05 17:19:18.947171+01	2026-01-05 17:19:18.947171+01
3766813b-5390-4ccb-b0af-e31e7d87efa5	OPP-958947-C45A	Projet agricole - Nord-Kivu	Opportunité d'investissement dans la province de Nord-Kivu	cmjomofsr000ejhjmz9x3fwrh	\N	688364.00	6259455.00	122	\N	\N	\N	\N	\N	\N	\N	\N	PUBLISHED	MEDIUM	t	0	0	\N	\N	\N	\N	2026-01-05 17:19:18.947695+01	2026-01-05 17:19:18.947695+01
10f5ef89-3038-49e9-9511-bb4c5312c402	OPP-958948-A34O	Exploitation minière - Nord-Kivu	Opportunité d'investissement dans la province de Nord-Kivu	cmjomofsr000ejhjmz9x3fwrh	\N	196656.00	9859311.00	389	\N	\N	\N	\N	\N	\N	\N	\N	PUBLISHED	MEDIUM	f	0	0	\N	\N	\N	\N	2026-01-05 17:19:18.948235+01	2026-01-05 17:19:18.948235+01
44efac17-e431-47b9-91df-6200ffd70e71	OPP-958948-Y5J4	Usine de transformation - Nord-Kivu	Opportunité d'investissement dans la province de Nord-Kivu	cmjomofsr000ejhjmz9x3fwrh	\N	229161.00	8854627.00	495	\N	\N	\N	\N	\N	\N	\N	\N	PUBLISHED	MEDIUM	f	0	0	\N	\N	\N	\N	2026-01-05 17:19:18.948584+01	2026-01-05 17:19:18.948584+01
d4bfc242-d6fe-4fdd-a0c4-b24afbc9728f	OPP-958948-1BRW	Projet agricole - Kongo-Central	Opportunité d'investissement dans la province de Kongo-Central	cmjomofss000gjhjmk11g62v2	\N	249692.00	7764541.00	223	\N	\N	\N	\N	\N	\N	\N	\N	PUBLISHED	MEDIUM	t	0	0	\N	\N	\N	\N	2026-01-05 17:19:18.94886+01	2026-01-05 17:19:18.94886+01
5dc30819-a279-46f4-abbc-99b03adbbead	OPP-958949-L8OO	Exploitation minière - Kongo-Central	Opportunité d'investissement dans la province de Kongo-Central	cmjomofss000gjhjmk11g62v2	\N	154292.00	2027097.00	363	\N	\N	\N	\N	\N	\N	\N	\N	PUBLISHED	MEDIUM	f	0	0	\N	\N	\N	\N	2026-01-05 17:19:18.949063+01	2026-01-05 17:19:18.949063+01
b6c5b4da-7017-498a-922f-f43210ff376a	OPP-958949-XRT1	Usine de transformation - Kongo-Central	Opportunité d'investissement dans la province de Kongo-Central	cmjomofss000gjhjmk11g62v2	\N	509298.00	7131111.00	209	\N	\N	\N	\N	\N	\N	\N	\N	PUBLISHED	MEDIUM	f	0	0	\N	\N	\N	\N	2026-01-05 17:19:18.949373+01	2026-01-05 17:19:18.949373+01
681ea402-4221-469f-9705-358e71bfbce1	OPP-958949-YE2C	Centrale électrique - Kongo-Central	Opportunité d'investissement dans la province de Kongo-Central	cmjomofss000gjhjmk11g62v2	\N	589387.00	9455935.00	51	\N	\N	\N	\N	\N	\N	\N	\N	PUBLISHED	MEDIUM	f	0	0	\N	\N	\N	\N	2026-01-05 17:19:18.949627+01	2026-01-05 17:19:18.949627+01
6997211f-6816-4ea0-8355-1556b107d38f	OPP-958949-CZAW	Parc touristique - Kongo-Central	Opportunité d'investissement dans la province de Kongo-Central	cmjomofss000gjhjmk11g62v2	\N	842797.00	9251025.00	418	\N	\N	\N	\N	\N	\N	\N	\N	PUBLISHED	MEDIUM	f	0	0	\N	\N	\N	\N	2026-01-05 17:19:18.949848+01	2026-01-05 17:19:18.949848+01
06f88698-21dc-4b4f-8ea4-6b8dd78acd4b	OPP-958950-UOF7	Zone industrielle - Kongo-Central	Opportunité d'investissement dans la province de Kongo-Central	cmjomofss000gjhjmk11g62v2	\N	986720.00	2621467.00	384	\N	\N	\N	\N	\N	\N	\N	\N	PUBLISHED	MEDIUM	f	0	0	\N	\N	\N	\N	2026-01-05 17:19:18.950136+01	2026-01-05 17:19:18.950136+01
e03e6b36-6e9b-4837-b51a-40917d00b9e1	OPP-958950-DAZ7	Infrastructure routière - Kongo-Central	Opportunité d'investissement dans la province de Kongo-Central	cmjomofss000gjhjmk11g62v2	\N	105940.00	8873423.00	392	\N	\N	\N	\N	\N	\N	\N	\N	PUBLISHED	MEDIUM	f	0	0	\N	\N	\N	\N	2026-01-05 17:19:18.950911+01	2026-01-05 17:19:18.950911+01
ca466b19-e35a-4939-a163-c2c9bb172030	OPP-958951-JX3A	Port fluvial - Kongo-Central	Opportunité d'investissement dans la province de Kongo-Central	cmjomofss000gjhjmk11g62v2	\N	230802.00	6830179.00	314	\N	\N	\N	\N	\N	\N	\N	\N	PUBLISHED	MEDIUM	f	0	0	\N	\N	\N	\N	2026-01-05 17:19:18.951356+01	2026-01-05 17:19:18.951356+01
ca11af55-823a-4053-b17b-23a4d2e0fd15	OPP-958951-OGYG	Agroforesterie - Kongo-Central	Opportunité d'investissement dans la province de Kongo-Central	cmjomofss000gjhjmk11g62v2	\N	147025.00	2177510.00	434	\N	\N	\N	\N	\N	\N	\N	\N	PUBLISHED	MEDIUM	f	0	0	\N	\N	\N	\N	2026-01-05 17:19:18.951719+01	2026-01-05 17:19:18.951719+01
52298fa0-74f2-4d26-960f-353358e9cc3e	OPP-958951-G6DA	Énergie solaire - Kongo-Central	Opportunité d'investissement dans la province de Kongo-Central	cmjomofss000gjhjmk11g62v2	\N	950940.00	2269099.00	100	\N	\N	\N	\N	\N	\N	\N	\N	PUBLISHED	MEDIUM	f	0	0	\N	\N	\N	\N	2026-01-05 17:19:18.952052+01	2026-01-05 17:19:18.952052+01
c0d870d5-c78b-4bca-9a0f-1b37e6ce512d	OPP-958952-YB2R	Projet agricole - Kongo-Central	Opportunité d'investissement dans la province de Kongo-Central	cmjomofss000gjhjmk11g62v2	\N	467617.00	3635917.00	106	\N	\N	\N	\N	\N	\N	\N	\N	PUBLISHED	MEDIUM	f	0	0	\N	\N	\N	\N	2026-01-05 17:19:18.953072+01	2026-01-05 17:19:18.953072+01
4999d016-37d4-402c-a51a-64c708809be3	OPP-958953-DH9D	Exploitation minière - Kongo-Central	Opportunité d'investissement dans la province de Kongo-Central	cmjomofss000gjhjmk11g62v2	\N	205905.00	8524210.00	53	\N	\N	\N	\N	\N	\N	\N	\N	PUBLISHED	MEDIUM	f	0	0	\N	\N	\N	\N	2026-01-05 17:19:18.953559+01	2026-01-05 17:19:18.953559+01
ede4716c-f1b9-48cd-aa44-3299fbe4a56a	OPP-958953-Y9CK	Projet agricole - Lualaba	Opportunité d'investissement dans la province de Lualaba	cmjomofsq000djhjmg1bgk6sw	\N	758492.00	3748244.00	95	\N	\N	\N	\N	\N	\N	\N	\N	PUBLISHED	MEDIUM	t	0	0	\N	\N	\N	\N	2026-01-05 17:19:18.954017+01	2026-01-05 17:19:18.954017+01
7e87d33e-e304-486d-b236-be57a091abbd	OPP-958954-QSEM	Exploitation minière - Lualaba	Opportunité d'investissement dans la province de Lualaba	cmjomofsq000djhjmg1bgk6sw	\N	314941.00	5966197.00	235	\N	\N	\N	\N	\N	\N	\N	\N	PUBLISHED	MEDIUM	f	0	0	\N	\N	\N	\N	2026-01-05 17:19:18.954668+01	2026-01-05 17:19:18.954668+01
f663e6b2-de82-47a0-898d-33efcf028c37	OPP-958955-NM1D	Usine de transformation - Lualaba	Opportunité d'investissement dans la province de Lualaba	cmjomofsq000djhjmg1bgk6sw	\N	323716.00	9783104.00	278	\N	\N	\N	\N	\N	\N	\N	\N	PUBLISHED	MEDIUM	f	0	0	\N	\N	\N	\N	2026-01-05 17:19:18.955197+01	2026-01-05 17:19:18.955197+01
46171db0-ca8d-4b9c-b9f0-b412681bc95e	OPP-958955-WZ7Q	Centrale électrique - Lualaba	Opportunité d'investissement dans la province de Lualaba	cmjomofsq000djhjmg1bgk6sw	\N	988140.00	2293955.00	406	\N	\N	\N	\N	\N	\N	\N	\N	PUBLISHED	MEDIUM	f	0	0	\N	\N	\N	\N	2026-01-05 17:19:18.955676+01	2026-01-05 17:19:18.955676+01
b8bb783f-83fe-4f5d-92bc-6bf46ec2e275	OPP-958956-0ZYJ	Parc touristique - Lualaba	Opportunité d'investissement dans la province de Lualaba	cmjomofsq000djhjmg1bgk6sw	\N	270699.00	9505917.00	288	\N	\N	\N	\N	\N	\N	\N	\N	PUBLISHED	MEDIUM	f	0	0	\N	\N	\N	\N	2026-01-05 17:19:18.956456+01	2026-01-05 17:19:18.956456+01
52008269-f49e-47c3-89c1-e0ec67dd1346	OPP-958957-WXQG	Zone industrielle - Lualaba	Opportunité d'investissement dans la province de Lualaba	cmjomofsq000djhjmg1bgk6sw	\N	320543.00	1752554.00	213	\N	\N	\N	\N	\N	\N	\N	\N	PUBLISHED	MEDIUM	f	0	0	\N	\N	\N	\N	2026-01-05 17:19:18.957978+01	2026-01-05 17:19:18.957978+01
b95aaf5f-4193-4f82-b12f-eb9fe48f7ba1	OPP-958958-VHTW	Projet agricole - Sud-Kivu	Opportunité d'investissement dans la province de Sud-Kivu	cmjomofsr000fjhjmgh3ewr5c	\N	728020.00	2345482.00	254	\N	\N	\N	\N	\N	\N	\N	\N	PUBLISHED	MEDIUM	t	0	0	\N	\N	\N	\N	2026-01-05 17:19:18.958432+01	2026-01-05 17:19:18.958432+01
cbb1499c-2ebf-4cd0-affd-d3633c5442ca	OPP-958958-565P	Exploitation minière - Sud-Kivu	Opportunité d'investissement dans la province de Sud-Kivu	cmjomofsr000fjhjmgh3ewr5c	\N	949512.00	6984719.00	104	\N	\N	\N	\N	\N	\N	\N	\N	PUBLISHED	MEDIUM	f	0	0	\N	\N	\N	\N	2026-01-05 17:19:18.958828+01	2026-01-05 17:19:18.958828+01
bb7ed70f-6b7a-4b76-9058-d3117b9a2147	OPP-958959-PPBH	Projet agricole - Ituri	Opportunité d'investissement dans la province de Ituri	cmjomofsv000kjhjmlzhjhg6l	\N	947008.00	3744904.00	308	\N	\N	\N	\N	\N	\N	\N	\N	PUBLISHED	MEDIUM	t	0	0	\N	\N	\N	\N	2026-01-05 17:19:18.959349+01	2026-01-05 17:19:18.959349+01
4e076e56-7a4e-458e-9271-335ada49f044	OPP-958959-MWOF	Exploitation minière - Ituri	Opportunité d'investissement dans la province de Ituri	cmjomofsv000kjhjmlzhjhg6l	\N	398688.00	5659013.00	310	\N	\N	\N	\N	\N	\N	\N	\N	PUBLISHED	MEDIUM	f	0	0	\N	\N	\N	\N	2026-01-05 17:19:18.959627+01	2026-01-05 17:19:18.959627+01
07963c45-aa6c-4245-bfee-100d32fe9bdf	OPP-958959-BYH5	Usine de transformation - Ituri	Opportunité d'investissement dans la province de Ituri	cmjomofsv000kjhjmlzhjhg6l	\N	699471.00	9891444.00	88	\N	\N	\N	\N	\N	\N	\N	\N	PUBLISHED	MEDIUM	f	0	0	\N	\N	\N	\N	2026-01-05 17:19:18.960066+01	2026-01-05 17:19:18.960066+01
916ff544-c578-4f13-a572-48d8299f5dbb	OPP-958960-JBA5	Centrale électrique - Ituri	Opportunité d'investissement dans la province de Ituri	cmjomofsv000kjhjmlzhjhg6l	\N	288370.00	5668555.00	87	\N	\N	\N	\N	\N	\N	\N	\N	PUBLISHED	MEDIUM	f	0	0	\N	\N	\N	\N	2026-01-05 17:19:18.960638+01	2026-01-05 17:19:18.960638+01
b258a24c-089b-4c2e-a608-41366a07ab9c	OPP-958961-JSDT	Projet agricole - Maniema	Opportunité d'investissement dans la province de Maniema	9bf56c6f-d560-4248-9246-3cc0ad95752d	\N	772942.00	6443704.00	292	\N	\N	\N	\N	\N	\N	\N	\N	PUBLISHED	MEDIUM	t	0	0	\N	\N	\N	\N	2026-01-05 17:19:18.961405+01	2026-01-05 17:19:18.961405+01
8b5b919d-b712-4843-9283-cb9724216d94	OPP-958961-TGFJ	Exploitation minière - Maniema	Opportunité d'investissement dans la province de Maniema	9bf56c6f-d560-4248-9246-3cc0ad95752d	\N	833673.00	3133527.00	336	\N	\N	\N	\N	\N	\N	\N	\N	PUBLISHED	MEDIUM	f	0	0	\N	\N	\N	\N	2026-01-05 17:19:18.96185+01	2026-01-05 17:19:18.96185+01
b466b67f-9a5f-44e1-b8a5-6ebbf1fe8cc8	OPP-958962-DX2F	Usine de transformation - Maniema	Opportunité d'investissement dans la province de Maniema	9bf56c6f-d560-4248-9246-3cc0ad95752d	\N	617271.00	5896432.00	472	\N	\N	\N	\N	\N	\N	\N	\N	PUBLISHED	MEDIUM	f	0	0	\N	\N	\N	\N	2026-01-05 17:19:18.962263+01	2026-01-05 17:19:18.962263+01
0d557837-f039-4431-a7ee-ada8229662ef	OPP-958962-FXF8	Centrale électrique - Maniema	Opportunité d'investissement dans la province de Maniema	9bf56c6f-d560-4248-9246-3cc0ad95752d	\N	313946.00	4061976.00	104	\N	\N	\N	\N	\N	\N	\N	\N	PUBLISHED	MEDIUM	f	0	0	\N	\N	\N	\N	2026-01-05 17:19:18.962638+01	2026-01-05 17:19:18.962638+01
184fc3d5-784a-4059-8d50-48110cf16452	OPP-958963-HO6O	Parc touristique - Maniema	Opportunité d'investissement dans la province de Maniema	9bf56c6f-d560-4248-9246-3cc0ad95752d	\N	946038.00	6594340.00	283	\N	\N	\N	\N	\N	\N	\N	\N	PUBLISHED	MEDIUM	f	0	0	\N	\N	\N	\N	2026-01-05 17:19:18.963295+01	2026-01-05 17:19:18.963295+01
af5b1d39-8dcf-433b-a1f2-73381c4e0054	OPP-958963-X8VO	Zone industrielle - Maniema	Opportunité d'investissement dans la province de Maniema	9bf56c6f-d560-4248-9246-3cc0ad95752d	\N	853950.00	9311025.00	241	\N	\N	\N	\N	\N	\N	\N	\N	PUBLISHED	MEDIUM	f	0	0	\N	\N	\N	\N	2026-01-05 17:19:18.963826+01	2026-01-05 17:19:18.963826+01
24e6db1b-2829-447d-8102-cc59e1bea162	OPP-958964-RVWA	Infrastructure routière - Maniema	Opportunité d'investissement dans la province de Maniema	9bf56c6f-d560-4248-9246-3cc0ad95752d	\N	269577.00	6878516.00	464	\N	\N	\N	\N	\N	\N	\N	\N	PUBLISHED	MEDIUM	f	0	0	\N	\N	\N	\N	2026-01-05 17:19:18.964288+01	2026-01-05 17:19:18.964288+01
1a77654c-d973-429c-ac02-d1b92223b795	OPP-958964-7UM5	Projet agricole - Tshopo	Opportunité d'investissement dans la province de Tshopo	82e038d5-14db-4501-9018-f310747c08e7	\N	225514.00	4794517.00	171	\N	\N	\N	\N	\N	\N	\N	\N	PUBLISHED	MEDIUM	t	0	0	\N	\N	\N	\N	2026-01-05 17:19:18.964728+01	2026-01-05 17:19:18.964728+01
d4af35ed-1e3e-4d59-a6be-34e8240ce510	OPP-958964-S7KS	Exploitation minière - Tshopo	Opportunité d'investissement dans la province de Tshopo	82e038d5-14db-4501-9018-f310747c08e7	\N	301616.00	4067296.00	80	\N	\N	\N	\N	\N	\N	\N	\N	PUBLISHED	MEDIUM	f	0	0	\N	\N	\N	\N	2026-01-05 17:19:18.965041+01	2026-01-05 17:19:18.965041+01
8183f37a-f42d-4471-80aa-29969b09d193	OPP-958965-T085	Usine de transformation - Tshopo	Opportunité d'investissement dans la province de Tshopo	82e038d5-14db-4501-9018-f310747c08e7	\N	714640.00	9670611.00	299	\N	\N	\N	\N	\N	\N	\N	\N	PUBLISHED	MEDIUM	f	0	0	\N	\N	\N	\N	2026-01-05 17:19:18.965399+01	2026-01-05 17:19:18.965399+01
4b20178a-4b97-453b-969d-040f583d2ad8	OPP-958965-DBWQ	Centrale électrique - Tshopo	Opportunité d'investissement dans la province de Tshopo	82e038d5-14db-4501-9018-f310747c08e7	\N	813138.00	7648386.00	115	\N	\N	\N	\N	\N	\N	\N	\N	PUBLISHED	MEDIUM	f	0	0	\N	\N	\N	\N	2026-01-05 17:19:18.96578+01	2026-01-05 17:19:18.96578+01
f4776749-bb53-4d5f-9e9f-5d78d5c22e13	OPP-958966-LD6E	Parc touristique - Tshopo	Opportunité d'investissement dans la province de Tshopo	82e038d5-14db-4501-9018-f310747c08e7	\N	440637.00	4138319.00	65	\N	\N	\N	\N	\N	\N	\N	\N	PUBLISHED	MEDIUM	f	0	0	\N	\N	\N	\N	2026-01-05 17:19:18.966158+01	2026-01-05 17:19:18.966158+01
11969e2c-96f8-4cf3-9a03-5c8831191a22	OPP-958966-K0IH	Zone industrielle - Tshopo	Opportunité d'investissement dans la province de Tshopo	82e038d5-14db-4501-9018-f310747c08e7	\N	786715.00	6134206.00	228	\N	\N	\N	\N	\N	\N	\N	\N	PUBLISHED	MEDIUM	f	0	0	\N	\N	\N	\N	2026-01-05 17:19:18.966605+01	2026-01-05 17:19:18.966605+01
946fad15-69f4-48c8-8826-07360444b5a8	OPP-958966-0ZNR	Infrastructure routière - Tshopo	Opportunité d'investissement dans la province de Tshopo	82e038d5-14db-4501-9018-f310747c08e7	\N	782259.00	4567762.00	342	\N	\N	\N	\N	\N	\N	\N	\N	PUBLISHED	MEDIUM	f	0	0	\N	\N	\N	\N	2026-01-05 17:19:18.967047+01	2026-01-05 17:19:18.967047+01
db0b6549-ae4b-4342-a4f9-6516f126c720	OPP-958967-K3QA	Port fluvial - Tshopo	Opportunité d'investissement dans la province de Tshopo	82e038d5-14db-4501-9018-f310747c08e7	\N	476418.00	9281120.00	411	\N	\N	\N	\N	\N	\N	\N	\N	PUBLISHED	MEDIUM	f	0	0	\N	\N	\N	\N	2026-01-05 17:19:18.967414+01	2026-01-05 17:19:18.967414+01
1c89cf4d-1033-4d08-a091-9b6983643b9a	OPP-958967-IL4Q	Agroforesterie - Tshopo	Opportunité d'investissement dans la province de Tshopo	82e038d5-14db-4501-9018-f310747c08e7	\N	209086.00	7322017.00	387	\N	\N	\N	\N	\N	\N	\N	\N	PUBLISHED	MEDIUM	f	0	0	\N	\N	\N	\N	2026-01-05 17:19:18.967948+01	2026-01-05 17:19:18.967948+01
\.


--
-- Data for Name: provinces; Type: TABLE DATA; Schema: public; Owner: yvesmpunga
--

COPY public.provinces (id, code, name, name_fr, name_en, name_pt, name_es, name_ar, capital, population, area, latitude, longitude, description, sort_order, is_active, created_at, updated_at) FROM stdin;
4620c296-ac40-4293-b345-64c979aefcae	CD-KN	Kinshasa	Kinshasa	Kinshasa	\N	\N	\N	\N	\N	\N	-4.32500000	15.32200000	\N	0	t	2026-01-05 17:12:58.605259+01	2026-01-05 17:12:58.605259+01
72053a99-c167-4cd1-ac26-d5914f451c2a	CD-BC	Kongo-Central	Kongo-Central	Kongo-Central	\N	\N	\N	\N	\N	\N	-5.50000000	14.50000000	\N	0	t	2026-01-05 17:12:58.609046+01	2026-01-05 17:12:58.609046+01
139f2ca2-fa72-4ae2-815c-a6234f2200dc	CD-KG	Kwango	Kwango	Kwango	\N	\N	\N	\N	\N	\N	-6.50000000	18.00000000	\N	0	t	2026-01-05 17:12:58.609653+01	2026-01-05 17:12:58.609653+01
c56aeaf1-4132-4c86-8697-adbe95cdacd1	CD-KL	Kwilu	Kwilu	Kwilu	\N	\N	\N	\N	\N	\N	-5.00000000	18.00000000	\N	0	t	2026-01-05 17:12:58.610305+01	2026-01-05 17:12:58.610305+01
f32f5c35-fa14-43fb-9299-b8bb2ae3e2b3	CD-MN	Mai-Ndombe	Mai-Ndombe	Mai-Ndombe	\N	\N	\N	\N	\N	\N	-2.50000000	18.00000000	\N	0	t	2026-01-05 17:12:58.610931+01	2026-01-05 17:12:58.610931+01
1d3fb3b3-4201-49d8-8493-f1cb6f1d7e90	CD-EQ	Équateur	Équateur	Équateur	\N	\N	\N	\N	\N	\N	0.00000000	18.50000000	\N	0	t	2026-01-05 17:12:58.611496+01	2026-01-05 17:12:58.611496+01
34fde519-5265-4c36-a48d-5f0809ebb3c2	CD-MO	Mongala	Mongala	Mongala	\N	\N	\N	\N	\N	\N	2.00000000	21.00000000	\N	0	t	2026-01-05 17:12:58.612398+01	2026-01-05 17:12:58.612398+01
0b4b73f2-389e-4ba9-82d4-31178a10531c	CD-NU	Nord-Ubangi	Nord-Ubangi	Nord-Ubangi	\N	\N	\N	\N	\N	\N	4.00000000	21.00000000	\N	0	t	2026-01-05 17:12:58.613215+01	2026-01-05 17:12:58.613215+01
f0804e40-4075-4ee3-ac04-126c712c53e6	CD-SU	Sud-Ubangi	Sud-Ubangi	Sud-Ubangi	\N	\N	\N	\N	\N	\N	3.50000000	19.00000000	\N	0	t	2026-01-05 17:12:58.613959+01	2026-01-05 17:12:58.613959+01
9c2d6d5e-1c6c-4ee4-8915-92affd6b55a8	CD-TU	Tshuapa	Tshuapa	Tshuapa	\N	\N	\N	\N	\N	\N	-0.50000000	22.00000000	\N	0	t	2026-01-05 17:12:58.614487+01	2026-01-05 17:12:58.614487+01
04c72456-9aad-4bea-8bcc-13796e781d4c	CD-TO	Tshopo	Tshopo	Tshopo	\N	\N	\N	\N	\N	\N	0.50000000	25.00000000	\N	0	t	2026-01-05 17:12:58.61499+01	2026-01-05 17:12:58.61499+01
0b8b985b-5e72-4262-862a-7f7b6b6a6359	CD-BU	Bas-Uele	Bas-Uele	Bas-Uele	\N	\N	\N	\N	\N	\N	3.50000000	25.00000000	\N	0	t	2026-01-05 17:12:58.615462+01	2026-01-05 17:12:58.615462+01
cd32f86d-f626-44de-aca9-d17fa37b40ba	CD-HU	Haut-Uele	Haut-Uele	Haut-Uele	\N	\N	\N	\N	\N	\N	4.00000000	28.00000000	\N	0	t	2026-01-05 17:12:58.615919+01	2026-01-05 17:12:58.615919+01
3a8724ad-baad-4055-9e7e-bbfcd3b88166	CD-IT	Ituri	Ituri	Ituri	\N	\N	\N	\N	\N	\N	2.00000000	29.00000000	\N	0	t	2026-01-05 17:12:58.616396+01	2026-01-05 17:12:58.616396+01
f8cdb672-4b91-438e-9b67-73f9cb9af1e2	CD-NK	Nord-Kivu	Nord-Kivu	Nord-Kivu	\N	\N	\N	\N	\N	\N	-1.00000000	29.00000000	\N	0	t	2026-01-05 17:12:58.616892+01	2026-01-05 17:12:58.616892+01
93d146ce-f5c6-4731-8d92-a97952b73b53	CD-SK	Sud-Kivu	Sud-Kivu	Sud-Kivu	\N	\N	\N	\N	\N	\N	-3.00000000	28.00000000	\N	0	t	2026-01-05 17:12:58.61737+01	2026-01-05 17:12:58.61737+01
38cacaba-bc8a-4546-a179-3b0b02beafed	CD-MA	Maniema	Maniema	Maniema	\N	\N	\N	\N	\N	\N	-3.00000000	26.00000000	\N	0	t	2026-01-05 17:12:58.617782+01	2026-01-05 17:12:58.617782+01
c761a6f4-7a0a-4812-83a7-4579dded29e5	CD-SA	Sankuru	Sankuru	Sankuru	\N	\N	\N	\N	\N	\N	-4.00000000	23.50000000	\N	0	t	2026-01-05 17:12:58.618194+01	2026-01-05 17:12:58.618194+01
703c9249-916a-4cbb-a6b2-01ca730a8b66	CD-KS	Kasaï	Kasaï	Kasaï	\N	\N	\N	\N	\N	\N	-5.00000000	21.00000000	\N	0	t	2026-01-05 17:12:58.618563+01	2026-01-05 17:12:58.618563+01
8d16d5b9-2ac6-49ca-9947-df0e1da0e644	CD-KC	Kasaï-Central	Kasaï-Central	Kasaï-Central	\N	\N	\N	\N	\N	\N	-6.00000000	22.00000000	\N	0	t	2026-01-05 17:12:58.619256+01	2026-01-05 17:12:58.619256+01
05b3719b-d212-427f-a4fe-2319700975cf	CD-KE	Kasaï-Oriental	Kasaï-Oriental	Kasaï-Oriental	\N	\N	\N	\N	\N	\N	-6.50000000	23.50000000	\N	0	t	2026-01-05 17:12:58.619663+01	2026-01-05 17:12:58.619663+01
e20e5d4d-761a-4f76-81a8-04c815a501f0	CD-LO	Lomami	Lomami	Lomami	\N	\N	\N	\N	\N	\N	-6.50000000	25.00000000	\N	0	t	2026-01-05 17:12:58.620074+01	2026-01-05 17:12:58.620074+01
e643465d-c15a-47ac-9cc0-6c248793e5f6	CD-HL	Haut-Lomami	Haut-Lomami	Haut-Lomami	\N	\N	\N	\N	\N	\N	-8.00000000	26.00000000	\N	0	t	2026-01-05 17:12:58.620508+01	2026-01-05 17:12:58.620508+01
3930f603-df6b-45fa-8ab6-ba0b489f7555	CD-TA	Tanganyika	Tanganyika	Tanganyika	\N	\N	\N	\N	\N	\N	-6.50000000	28.00000000	\N	0	t	2026-01-05 17:12:58.621099+01	2026-01-05 17:12:58.621099+01
9ce030f6-8984-4406-8180-707d87730602	CD-HK	Haut-Katanga	Haut-Katanga	Haut-Katanga	\N	\N	\N	\N	\N	\N	-11.00000000	27.50000000	\N	0	t	2026-01-05 17:12:58.622273+01	2026-01-05 17:12:58.622273+01
d20bdf19-0a08-4e55-a20a-070ac8be31b7	CD-LU	Lualaba	Lualaba	Lualaba	\N	\N	\N	\N	\N	\N	-10.00000000	24.00000000	\N	0	t	2026-01-05 17:12:58.623966+01	2026-01-05 17:12:58.623966+01
8f327b31-3513-468c-84f5-2fa9e1c20624	KIN	Kinshasa	Kinshasa	Kinshasa	\N	\N	\N	Kinshasa	17000000	9965.00	\N	\N	\N	0	t	2026-01-06 16:51:29.547+01	2026-01-06 16:51:29.547+01
5758d264-8642-4332-aa1e-ae191859b3b6	KOC	Kongo Central	Kongo Central	Kongo Central	\N	\N	\N	Matadi	5575000	53920.00	\N	\N	\N	0	t	2026-01-06 16:51:29.547+01	2026-01-06 16:51:29.547+01
bc17c018-ae30-4362-aefc-00c5099be42c	KWA	Kwango	Kwango	Kwango	\N	\N	\N	Kenge	2000000	89974.00	\N	\N	\N	0	t	2026-01-06 16:51:29.547+01	2026-01-06 16:51:29.547+01
1d4f67b2-4592-4570-8437-fec8fab71915	KWI	Kwilu	Kwilu	Kwilu	\N	\N	\N	Kikwit	5174000	78219.00	\N	\N	\N	0	t	2026-01-06 16:51:29.547+01	2026-01-06 16:51:29.547+01
190cc254-5f61-482d-bfd3-0995590fb2d3	MAI	Mai-Ndombe	Mai-Ndombe	Mai-Ndombe	\N	\N	\N	Inongo	1768000	127465.00	\N	\N	\N	0	t	2026-01-06 16:51:29.547+01	2026-01-06 16:51:29.547+01
6e4c88b4-cb57-4cad-bc88-5734771b4c6c	EQU	Equateur	Équateur	Equateur	\N	\N	\N	Mbandaka	1626000	103902.00	\N	\N	\N	0	t	2026-01-06 16:51:29.547+01	2026-01-06 16:51:29.547+01
b53653fb-7940-4623-adfb-41726c335f1b	SUD	Sud-Ubangi	Sud-Ubangi	South Ubangi	\N	\N	\N	Gemena	2744000	51648.00	\N	\N	\N	0	t	2026-01-06 16:51:29.547+01	2026-01-06 16:51:29.547+01
557cdb18-a5cf-48f8-a11b-78f48fd99196	NUB	Nord-Ubangi	Nord-Ubangi	North Ubangi	\N	\N	\N	Gbadolite	1482000	56644.00	\N	\N	\N	0	t	2026-01-06 16:51:29.547+01	2026-01-06 16:51:29.547+01
e0c33b0d-9e93-446a-96c0-1fffbb7fdd48	MON	Mongala	Mongala	Mongala	\N	\N	\N	Lisala	1793000	58141.00	\N	\N	\N	0	t	2026-01-06 16:51:29.547+01	2026-01-06 16:51:29.547+01
8dbe2542-008e-4c02-8df8-1ab7f041e1ea	TSH	Tshuapa	Tshuapa	Tshuapa	\N	\N	\N	Boende	1316000	132957.00	\N	\N	\N	0	t	2026-01-06 16:51:29.547+01	2026-01-06 16:51:29.547+01
ef4cdad5-6dc6-4da9-bfd3-dead71ac9a77	TSD	Tshopo	Tshopo	Tshopo	\N	\N	\N	Kisangani	2614000	199567.00	\N	\N	\N	0	t	2026-01-06 16:51:29.547+01	2026-01-06 16:51:29.547+01
2f220810-442c-4595-b086-1c8da871eadc	BUI	Bas-Uele	Bas-Uélé	Bas-Uele	\N	\N	\N	Buta	1093000	148331.00	\N	\N	\N	0	t	2026-01-06 16:51:29.547+01	2026-01-06 16:51:29.547+01
28010791-ecd0-4e01-b2ed-aef4f4bb6bf3	HUI	Haut-Uele	Haut-Uélé	Haut-Uele	\N	\N	\N	Isiro	1920000	89683.00	\N	\N	\N	0	t	2026-01-06 16:51:29.547+01	2026-01-06 16:51:29.547+01
db138c1b-9116-41ee-af61-433f0dac64ef	ITU	Ituri	Ituri	Ituri	\N	\N	\N	Bunia	4241000	65658.00	\N	\N	\N	0	t	2026-01-06 16:51:29.547+01	2026-01-06 16:51:29.547+01
6c488ac6-2e7d-4232-9fba-fea5ad2023a2	NKI	Nord-Kivu	Nord-Kivu	North Kivu	\N	\N	\N	Goma	6655000	59483.00	\N	\N	\N	0	t	2026-01-06 16:51:29.547+01	2026-01-06 16:51:29.547+01
a3f5a7a4-b083-4463-86a7-2745d072d686	SKI	Sud-Kivu	Sud-Kivu	South Kivu	\N	\N	\N	Bukavu	5772000	65070.00	\N	\N	\N	0	t	2026-01-06 16:51:29.547+01	2026-01-06 16:51:29.547+01
5bb9d3e1-453e-4c16-9261-bf8645c56c50	MAN	Maniema	Maniema	Maniema	\N	\N	\N	Kindu	2333000	132250.00	\N	\N	\N	0	t	2026-01-06 16:51:29.547+01	2026-01-06 16:51:29.547+01
a86be8cb-978b-453c-95e7-1bd9d7d1fae4	HKA	Haut-Katanga	Haut-Katanga	Upper Katanga	\N	\N	\N	Lubumbashi	3960000	132425.00	\N	\N	\N	0	t	2026-01-06 16:51:29.547+01	2026-01-06 16:51:29.547+01
352e2764-b0a8-403a-aa51-4fc5af70f77b	HLO	Haut-Lomami	Haut-Lomami	Upper Lomami	\N	\N	\N	Kamina	2540000	108204.00	\N	\N	\N	0	t	2026-01-06 16:51:29.547+01	2026-01-06 16:51:29.547+01
f52cb071-0d79-433b-9bb1-24a20fce651e	LUA	Lualaba	Lualaba	Lualaba	\N	\N	\N	Kolwezi	1677000	121308.00	\N	\N	\N	0	t	2026-01-06 16:51:29.547+01	2026-01-06 16:51:29.547+01
6ba21157-69a5-4ee1-89cf-e87e1322d726	TAN	Tanganyika	Tanganyika	Tanganyika	\N	\N	\N	Kalemie	2482000	134940.00	\N	\N	\N	0	t	2026-01-06 16:51:29.547+01	2026-01-06 16:51:29.547+01
15eb254b-8b55-4858-afd1-469bf0ee87fe	LKA	Lomami	Lomami	Lomami	\N	\N	\N	Kabinda	2048000	56426.00	\N	\N	\N	0	t	2026-01-06 16:51:29.547+01	2026-01-06 16:51:29.547+01
a4a7db84-c3ca-4e68-bac0-51949c12342b	KOR	Kasai-Oriental	Kasaï-Oriental	East Kasai	\N	\N	\N	Mbuji-Mayi	2702000	9545.00	\N	\N	\N	0	t	2026-01-06 16:51:29.547+01	2026-01-06 16:51:29.547+01
85c0e519-9b75-43f4-9656-f8d1e9a8ac8a	KAS	Kasai	Kasaï	Kasai	\N	\N	\N	Luebo	3199000	95631.00	\N	\N	\N	0	t	2026-01-06 16:51:29.547+01	2026-01-06 16:51:29.547+01
b77d3ffe-5cbb-4a2a-8cfd-2105f0d36cf4	KCE	Kasai-Central	Kasaï-Central	Central Kasai	\N	\N	\N	Kananga	2976000	60958.00	\N	\N	\N	0	t	2026-01-06 16:51:29.547+01	2026-01-06 16:51:29.547+01
3ce078c4-7237-422a-8e77-ffccb10f29e3	SAN	Sankuru	Sankuru	Sankuru	\N	\N	\N	Lusambo	1374000	104331.00	\N	\N	\N	0	t	2026-01-06 16:51:29.547+01	2026-01-06 16:51:29.547+01
\.


--
-- Data for Name: public_holidays; Type: TABLE DATA; Schema: public; Owner: yvesmpunga
--

COPY public.public_holidays (id, name, date, type, is_recurring, recurring_month, recurring_day, is_paid, overtime_rate, description, is_active, created_by_id, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: required_documents; Type: TABLE DATA; Schema: public; Owner: yvesmpunga
--

COPY public.required_documents (id, code, name, description, "dossierType", "isRequired", "acceptedFormats", "maxSizeMB", "order", "isActive", "createdAt", "updatedAt") FROM stdin;
0f27b048-cade-4bba-bb05-7b766df395b2	RCCM	Registre de commerce (RCCM)	\N	AGREMENT_REGIME	t	{pdf,jpg,jpeg,png}	10	1	t	2026-01-02 00:55:00.314+01	2026-01-02 00:55:00.314+01
30f1d634-6a7c-4da1-8a67-a93dcd7ef34f	ID_NAT	Identification nationale (ID NAT)	\N	AGREMENT_REGIME	t	{pdf,jpg,jpeg,png}	10	2	t	2026-01-02 00:55:00.314+01	2026-01-02 00:55:00.314+01
5a27c95e-cbf6-48cb-81ca-96447978a259	NIF	Numero d'Impot Fiscal (NIF)	\N	AGREMENT_REGIME	t	{pdf,jpg,jpeg,png}	10	3	t	2026-01-02 00:55:00.314+01	2026-01-02 00:55:00.314+01
59d27f31-0fce-475d-8892-b7f52cdc3d7e	STATUTS	Statuts de la societe	\N	AGREMENT_REGIME	t	{pdf,jpg,jpeg,png}	10	4	t	2026-01-02 00:55:00.314+01	2026-01-02 00:55:00.314+01
aef690f9-85f3-44dd-ba00-58573c2f88f3	BUSINESS_PLAN	Plan d'affaires	\N	AGREMENT_REGIME	t	{pdf,jpg,jpeg,png}	10	5	t	2026-01-02 00:55:00.314+01	2026-01-02 00:55:00.314+01
ad529f78-00bc-48ba-b9d0-1283b1ba03e7	PREUVE_FIN	Preuve de capacite financiere	\N	AGREMENT_REGIME	t	{pdf,jpg,jpeg,png}	10	6	t	2026-01-02 00:55:00.314+01	2026-01-02 00:55:00.314+01
0c4954e2-ab6a-4115-b0f5-7cca056ad975	RCCM	Registre de commerce (RCCM)	\N	LICENCE_EXPLOITATION	t	{pdf,jpg,jpeg,png}	10	1	t	2026-01-02 00:55:00.314+01	2026-01-02 00:55:00.314+01
d13f6521-4505-488c-aad7-120307887862	ID_NAT	Identification nationale (ID NAT)	\N	LICENCE_EXPLOITATION	t	{pdf,jpg,jpeg,png}	10	2	t	2026-01-02 00:55:00.314+01	2026-01-02 00:55:00.314+01
3eb91ddd-e918-4104-970b-11d3c1da30d1	NIF	Numero d'Impot Fiscal (NIF)	\N	LICENCE_EXPLOITATION	t	{pdf,jpg,jpeg,png}	10	3	t	2026-01-02 00:55:00.314+01	2026-01-02 00:55:00.314+01
7641afd5-d664-4e2c-b83d-3ed68af31d3f	BUSINESS_PLAN	Plan d'affaires	\N	LICENCE_EXPLOITATION	t	{pdf,jpg,jpeg,png}	10	4	t	2026-01-02 00:55:00.314+01	2026-01-02 00:55:00.314+01
a21648de-ebb7-41a4-8bae-58293e115b2c	PREUVE_FIN	Preuve de capacite financiere	\N	LICENCE_EXPLOITATION	t	{pdf,jpg,jpeg,png}	10	5	t	2026-01-02 00:55:00.314+01	2026-01-02 00:55:00.314+01
6410110e-5274-4b15-a2bf-e4e0daeff321	AUTOR_SECT	Autorisation sectorielle	\N	LICENCE_EXPLOITATION	f	{pdf,jpg,jpeg,png}	10	6	t	2026-01-02 00:55:00.314+01	2026-01-02 00:55:00.314+01
dcf5006c-0662-4865-8811-5a527b1a12d7	RCCM	Registre de commerce (RCCM)	\N	PERMIS_CONSTRUCTION	t	{pdf,jpg,jpeg,png}	10	1	t	2026-01-02 00:55:00.314+01	2026-01-02 00:55:00.314+01
80d17a69-9aa1-451f-ae30-1c9acbf9753a	ID_NAT	Identification nationale (ID NAT)	\N	PERMIS_CONSTRUCTION	t	{pdf,jpg,jpeg,png}	10	2	t	2026-01-02 00:55:00.314+01	2026-01-02 00:55:00.314+01
b3e2e8cc-c915-4a32-bb12-3fcd24551d11	TITRE_FONC	Titre foncier ou contrat de bail	\N	PERMIS_CONSTRUCTION	t	{pdf,jpg,jpeg,png}	10	3	t	2026-01-02 00:55:00.314+01	2026-01-02 00:55:00.314+01
3a30e86f-08e5-46ce-b30f-09b79d807c7b	PLANS_ARCH	Plans architecturaux	\N	PERMIS_CONSTRUCTION	t	{pdf,jpg,jpeg,png}	10	4	t	2026-01-02 00:55:00.314+01	2026-01-02 00:55:00.314+01
ffdad76e-9bfa-46e6-9e59-181f80b44478	ETUDE_IMPACT	Etude d'impact environnemental	\N	PERMIS_CONSTRUCTION	f	{pdf,jpg,jpeg,png}	10	5	t	2026-01-02 00:55:00.314+01	2026-01-02 00:55:00.314+01
09112c95-6e68-43bf-9d45-b4e7963b75e1	AUTOR_URB	Autorisation d'urbanisme	\N	PERMIS_CONSTRUCTION	f	{pdf,jpg,jpeg,png}	10	6	t	2026-01-02 00:55:00.314+01	2026-01-02 00:55:00.314+01
fadeadf2-327d-4757-b613-8642a7b20466	RCCM	Registre de commerce (RCCM)	\N	AUTORISATION_ACTIVITE	t	{pdf,jpg,jpeg,png}	10	1	t	2026-01-02 00:55:00.314+01	2026-01-02 00:55:00.314+01
d1de774a-86ec-4148-a3e5-9c0a101ae190	ID_NAT	Identification nationale (ID NAT)	\N	AUTORISATION_ACTIVITE	t	{pdf,jpg,jpeg,png}	10	2	t	2026-01-02 00:55:00.314+01	2026-01-02 00:55:00.314+01
b81fed81-2ab2-4831-968e-4027fcc2716f	BUSINESS_PLAN	Plan d'affaires	\N	AUTORISATION_ACTIVITE	t	{pdf,jpg,jpeg,png}	10	3	t	2026-01-02 00:55:00.314+01	2026-01-02 00:55:00.314+01
4f71b310-f12d-4077-9cb2-9301655eba5b	PREUVE_FIN	Preuve de capacite financiere	\N	AUTORISATION_ACTIVITE	t	{pdf,jpg,jpeg,png}	10	4	t	2026-01-02 00:55:00.314+01	2026-01-02 00:55:00.314+01
a0dcdb39-8d6c-40c7-9709-efe8750cf757	CERT_CONF	Certificat de conformite	\N	AUTORISATION_ACTIVITE	f	{pdf,jpg,jpeg,png}	10	5	t	2026-01-02 00:55:00.314+01	2026-01-02 00:55:00.314+01
eebc9b7b-90c6-46ca-9d6b-420b9c774e02	AUTOR_SPEC	Autorisation specifique au secteur	\N	AUTORISATION_ACTIVITE	f	{pdf,jpg,jpeg,png}	10	6	t	2026-01-02 00:55:00.314+01	2026-01-02 00:55:00.314+01
8b593729-dc89-47ec-9bce-2f3e9c81ca89	RCCM	Registre de commerce (RCCM)	\N	DECLARATION_INVESTISSEMENT	t	{pdf,jpg,jpeg,png}	10	1	t	2026-01-02 00:55:00.314+01	2026-01-02 00:55:00.314+01
730a9f01-3beb-48a3-af22-681a26fa3d35	ID_NAT	Identification nationale (ID NAT)	\N	DECLARATION_INVESTISSEMENT	t	{pdf,jpg,jpeg,png}	10	2	t	2026-01-02 00:55:00.314+01	2026-01-02 00:55:00.314+01
397353fe-5284-40e3-aba5-aee9d705cd97	BUSINESS_PLAN	Plan d'affaires	\N	DECLARATION_INVESTISSEMENT	t	{pdf,jpg,jpeg,png}	10	3	t	2026-01-02 00:55:00.314+01	2026-01-02 00:55:00.314+01
dd86e217-2696-4aab-8375-8263dea137cf	FORM_DECL	Formulaire de declaration	\N	DECLARATION_INVESTISSEMENT	t	{pdf,jpg,jpeg,png}	10	4	t	2026-01-02 00:55:00.314+01	2026-01-02 00:55:00.314+01
2a1d0e94-8b16-45b0-8030-50152dee63c9	RCCM	Registre de commerce (RCCM)	\N	DEMANDE_TERRAIN	t	{pdf,jpg,jpeg,png}	10	1	t	2026-01-02 00:55:00.314+01	2026-01-02 00:55:00.314+01
3be20666-d1fe-4455-a167-1d730a837231	ID_NAT	Identification nationale (ID NAT)	\N	DEMANDE_TERRAIN	t	{pdf,jpg,jpeg,png}	10	2	t	2026-01-02 00:55:00.314+01	2026-01-02 00:55:00.314+01
a3346491-b738-4fa3-bfb9-8e8caf30c509	BUSINESS_PLAN	Plan d'affaires	\N	DEMANDE_TERRAIN	t	{pdf,jpg,jpeg,png}	10	3	t	2026-01-02 00:55:00.314+01	2026-01-02 00:55:00.314+01
4a301e6a-7824-4f09-9dd1-f794c857f22e	PLAN_SITE	Plan du site demande	\N	DEMANDE_TERRAIN	f	{pdf,jpg,jpeg,png}	10	4	t	2026-01-02 00:55:00.314+01	2026-01-02 00:55:00.314+01
4e6a74b6-5010-4829-8dd5-a6e8ff74ac03	ETUDE_IMPACT	Etude d'impact environnemental	\N	DEMANDE_TERRAIN	f	{pdf,jpg,jpeg,png}	10	5	t	2026-01-02 00:55:00.314+01	2026-01-02 00:55:00.314+01
\.


--
-- Data for Name: role_permissions; Type: TABLE DATA; Schema: public; Owner: yvesmpunga
--

COPY public.role_permissions (created_at, updated_at, permission_id, role_id) FROM stdin;
\.


--
-- Data for Name: roles; Type: TABLE DATA; Schema: public; Owner: yvesmpunga
--

COPY public.roles (id, code, name, name_fr, name_en, description, level, permissions, is_system, is_active, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: sectors; Type: TABLE DATA; Schema: public; Owner: yvesmpunga
--

COPY public.sectors (id, code, name, description, "parentId", "isActive", "createdAt", "updatedAt", "ministryId", color) FROM stdin;
c1c50065-a923-4d2f-aec4-e2f9e93e396b	MINE	Mines et carrieres	Extraction miniere et exploitation de carrieres	\N	t	2025-12-29 06:44:47.372+01	2025-12-29 06:44:47.372+01	\N	blue
a4324488-6fcd-427e-afe6-b6d2a071f632	INDUS	Industries	Industries manufacturieres et transformation	\N	t	2025-12-29 06:44:47.372+01	2025-12-29 06:44:47.372+01	\N	blue
cd40a6fe-ae5d-4c3a-8486-b720a6e2a1c8	SERV	Services	Services aux entreprises et aux particuliers	\N	t	2025-12-29 06:44:47.372+01	2025-12-29 06:44:47.372+01	\N	blue
fe07f747-f7d9-4980-80b1-7aebc11f07f7	BTP	BTP	Batiment et travaux publics	\N	t	2025-12-29 06:44:47.372+01	2025-12-29 06:44:47.372+01	\N	blue
08b10fd9-9447-4db1-a767-f701c090851e	TRANS	Transport et logistique	Transport terrestre, aerien, maritime et logistique	\N	t	2025-12-29 06:44:47.372+01	2025-12-29 06:44:47.372+01	\N	blue
bb09ea1d-1413-48dd-8c51-23dc9997f67d	TELE	Telecommunications	Telecommunications et technologies de l'information	\N	t	2025-12-29 06:44:47.372+01	2025-12-29 06:44:47.372+01	\N	blue
1870c1af-9dfe-4ac5-8f0a-c1b774a9b663	TOUR	Tourisme et hotellerie	Tourisme, hotellerie et restauration	\N	t	2025-12-29 06:44:47.372+01	2025-12-29 06:44:47.372+01	\N	blue
2c24c481-b476-4032-a2c5-ac55c410a77d	SANTE	Sante	Sante et services medicaux	\N	t	2025-12-29 06:44:47.372+01	2025-12-29 06:44:47.372+01	\N	blue
22d95d0b-80f8-4910-8745-12cc8851ab72	EDUC	Education	Education et formation professionnelle	\N	t	2025-12-29 06:44:47.372+01	2025-12-29 06:44:47.372+01	\N	blue
b5dfac64-9b6c-4a76-8562-869ddf98603e	ENERG	Energie	Production et distribution d'energie	\N	t	2025-12-29 06:44:47.372+01	2025-12-29 06:44:47.372+01	\N	blue
0ead10da-d54e-423f-a77d-39d0cf505301	COMM	Commerce	Commerce de gros et de detail	\N	t	2025-12-29 06:44:47.372+01	2026-01-02 00:31:11.178+01	\N	orange
bf9a4bf6-265f-4f91-b832-d2b3b5e8db90	AGRI	Agriculture et elevage	Agriculture, elevage, peche et foresterie	\N	t	2025-12-29 06:44:47.372+01	2026-01-02 00:31:24.866+01	\N	purple
5bee6c8f-21c9-4e83-a5b3-8ba9ddcdc1e0	AGRICULTU	Agriculture		\N	t	2026-01-04 01:40:48.242+01	2026-01-04 01:40:48.242+01	\N	purple
\.


--
-- Data for Name: stakeholder_dialogues; Type: TABLE DATA; Schema: public; Owner: yvesmpunga
--

COPY public.stakeholder_dialogues (id, reference, title, description, "eventType", status, sector, "mainTopic", objectives, agenda, venue, "venueAddress", "isOnline", "onlineLink", "scheduledDate", "startTime", "endTime", "expectedParticipants", "actualParticipants", "invitedParticipants", minutes, decisions, "actionItems", recommendations, attachments, photos, budget, "actualCost", notes, "nextEventId", "organizerId", "createdById", "createdAt", "updatedAt") FROM stdin;
515dcc94-3cd2-49e2-9a40-8640af397992	DLG-2026-0001	Dialogue entre client 	sds	ROUNDTABLE	PLANNED	REGULATORY_REFORM	Dialogue entre client 	["sdsdsd", "ssfdf"]	[]	Anaoi	\N	f		2026-01-09 03:24:00+01	\N	\N	23	\N	[]	\N	[]	[]	[]	[]	[]	\N	\N		\N	cmjopae590000zjq2jkhfrkre	cmjopae590000zjq2jkhfrkre	2026-01-05 03:30:20.418+01	2026-01-05 03:36:57.636+01
\.


--
-- Data for Name: system_configs; Type: TABLE DATA; Schema: public; Owner: yvesmpunga
--

COPY public.system_configs (id, key, value, category, type, description, "isEncrypted", "isEditable", "updatedById", "createdAt", "updatedAt") FROM stdin;
16142415-7e79-4085-950d-f114a885baa0	email_enabled	true	email	boolean	Activer l'envoi d'emails	f	t	cmjopae590000zjq2jkhfrkre	2026-01-03 13:24:52.052427+01	2026-01-03 13:47:04.936+01
4960b794-9ec5-443d-a2be-c9a8eccecde1	smtp_host	mail.privateemail.com	email	string	Serveur SMTP (ex: smtp.gmail.com)	f	t	cmjopae590000zjq2jkhfrkre	2026-01-03 13:24:52.052427+01	2026-01-03 13:47:04.944+01
12d8fab0-8ace-47b4-90bb-94a960f8075c	smtp_port	587	email	number	Port SMTP (587 pour TLS, 465 pour SSL)	f	t	cmjopae590000zjq2jkhfrkre	2026-01-03 13:24:52.052427+01	2026-01-03 13:47:04.948+01
6ff65337-b86f-4dc8-869f-4bfcfa625095	smtp_user	merrykapula@futurissvision.com	email	string	Nom d'utilisateur SMTP	f	t	cmjopae590000zjq2jkhfrkre	2026-01-03 13:24:52.052427+01	2026-01-03 13:47:04.951+01
a8386a3d-9a8d-4dcd-8c1b-35606c4e4c9f	smtp_secure	false	email	boolean	Utiliser SSL/TLS (true pour port 465)	f	t	cmjopae590000zjq2jkhfrkre	2026-01-03 13:24:52.052427+01	2026-01-03 13:47:04.95+01
0bdbd8d9-6fc9-49c3-9a9f-7320510834a9	smtp_from	merrykapula@futurissvision.com	email	string	Adresse email d'envoi	f	t	cmjopae590000zjq2jkhfrkre	2026-01-03 13:24:52.052427+01	2026-01-03 13:47:04.942+01
0b3e74e3-ef09-4de0-a31e-d91f9996a130	smtp_from_name	ANAPI	email	string	Nom d'affichage de l'expediteur	f	t	cmjopae590000zjq2jkhfrkre	2026-01-03 13:24:52.052427+01	2026-01-03 13:47:04.943+01
99025d24-ba45-4612-93c8-0cbccf64f542	smtp_pass	db6c5eb101247c7c79788b87048a5ca3:2fb12fa9a1b1b5920b733c4d5bd44cd6	email	password	Mot de passe SMTP	t	t	cmjopae590000zjq2jkhfrkre	2026-01-03 13:24:52.052427+01	2026-01-03 13:47:04.945+01
0ed34edf-69eb-402b-a582-e9f6d8fcb6bf	imap_host		email	string	Serveur IMAP pour la reception d'emails	f	t	\N	2026-01-03 15:04:44.375+01	2026-01-03 15:04:44.375+01
cf382d7e-95ab-4e2c-a476-68ad28dc7773	imap_port	993	email	number	Port IMAP (993 pour SSL)	f	t	\N	2026-01-03 15:04:44.397+01	2026-01-03 15:04:44.397+01
b144fd06-d79d-4986-9820-3e947db3277e	imap_user		email	string	Utilisateur IMAP (laissez vide pour utiliser smtp_user)	f	t	\N	2026-01-03 15:04:44.4+01	2026-01-03 15:04:44.4+01
5ddffe07-e7a1-46e3-8002-d25af4ea93f4	imap_pass		email	password	Mot de passe IMAP (laissez vide pour utiliser smtp_pass)	f	t	\N	2026-01-03 15:04:44.403+01	2026-01-03 15:04:44.403+01
\.


--
-- Data for Name: territories; Type: TABLE DATA; Schema: public; Owner: yvesmpunga
--

COPY public.territories (id, code, name, name_fr, name_en, name_pt, name_es, name_ar, province_id, district_id, chief_town, population, area, latitude, longitude, description, sort_order, is_active, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: yvesmpunga
--

COPY public.users (id, email, password, first_name, last_name, phone, avatar, role, language, is_active, is_verified, last_login_at, province_id, created_at, updated_at, city_id, role_id, ministry_id, name, image, department, modules) FROM stdin;
ff291c29-5824-4e46-8fcf-d2808453fa92	admin@anapi.cd	$2b$10$TsQBtE0oUpB7M.hMebpC6uef7E.zJ5sVIcuSvTuHR3pC81x2r9rFi	Admin	ANAPI	\N	\N	admin	fr	t	f	\N	\N	2026-01-06 18:05:18.109914+01	2026-01-06 18:05:18.109914+01	\N	\N	\N	Admin ANAPI	\N	\N	\N
\.


--
-- Data for Name: work_schedules; Type: TABLE DATA; Schema: public; Owner: yvesmpunga
--

COPY public.work_schedules (id, name, description, is_default, monday_start, monday_end, monday_break_start, monday_break_end, monday_work_hours, tuesday_start, tuesday_end, tuesday_break_start, tuesday_break_end, tuesday_work_hours, wednesday_start, wednesday_end, wednesday_break_start, wednesday_break_end, wednesday_work_hours, thursday_start, thursday_end, thursday_break_start, thursday_break_end, thursday_work_hours, friday_start, friday_end, friday_break_start, friday_break_end, friday_work_hours, saturday_start, saturday_end, saturday_break_start, saturday_break_end, saturday_work_hours, sunday_start, sunday_end, sunday_break_start, sunday_break_end, sunday_work_hours, weekly_hours, working_days, late_tolerance_minutes, early_leave_tolerance_minutes, overtime_threshold, regular_overtime_rate, weekend_overtime_rate, holiday_overtime_rate, night_overtime_rate, night_start_time, night_end_time, is_active, created_by_id, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: workflow_steps; Type: TABLE DATA; Schema: public; Owner: yvesmpunga
--

COPY public.workflow_steps (id, "workflowType", "stepNumber", name, description, icon, color, "estimatedDays", "requiredDocuments", "availableActions", "responsibleRole", "isFinal", "isRequired", "isActive", "createdAt", "updatedAt") FROM stdin;
0d29603b-4052-4c40-9f47-d742bab849a0	AGREMENT	2	Verification documents	Controle de la conformite des documents fournis	CheckCircle2	#10B981	3	[]	["approve", "reject", "request_info"]	Agent de verification	f	t	t	2025-12-29 06:02:26.116+01	2025-12-29 06:02:26.116+01
2b69423c-1284-401b-91e7-76840cf793ed	AGREMENT	3	Examen fiscal	Analyse de la situation fiscale du demandeur	Shield	#F59E0B	5	[]	["approve", "reject", "request_info"]	Agent fiscal	f	t	t	2025-12-29 06:02:26.116+01	2025-12-29 06:02:26.116+01
401178ca-3f70-4ae3-8156-3c0bc316120d	AGREMENT	4	Decision finale	Prise de decision par le comite	CheckCircle2	#8B5CF6	7	[]	["approve", "reject", "request_info"]	Comite de decision	t	t	t	2025-12-29 06:02:26.116+01	2025-12-29 06:02:26.116+01
ccdaeae9-105c-4214-83c2-5379410259cd	AGREMENT	1	Reception 1	Reception et enregistrement de la demande	FileText	#3B82F6	1	[]	["approve", "reject", "request_info"]	Agent de reception	f	t	t	2025-12-29 06:02:26.116+01	2025-12-29 06:15:39.149+01
9eaf7656-71d8-45ed-bbd9-4ff9b409b1d9	AGREMENT_REGIME	1	Soumission	Reception et enregistrement de la demande	FileInput	#6366F1	1	[]	["approve", "reject", "request_info"]	Investisseur	f	t	t	2026-01-02 00:08:02.124+01	2026-01-02 00:08:02.124+01
df863713-61f3-44e1-ab1d-8d3297c4c4ec	AGREMENT_REGIME	2	Verification documentaire	Verification de la completude et conformite des documents soumis	FileSearch	#8B5CF6	3	[]	["approve", "reject", "request_info"]	Agent Guichet Unique	f	t	t	2026-01-02 00:08:02.129+01	2026-01-02 00:08:02.129+01
0f187b37-4ef4-4284-8da2-da66f12285d2	AGREMENT_REGIME	3	Analyse ANAPI	Examen technique et economique du dossier par les experts ANAPI	ClipboardCheck	#3B82F6	7	[]	["approve", "reject", "request_info"]	Analyste ANAPI	f	t	t	2026-01-02 00:08:02.13+01	2026-01-02 00:08:02.13+01
952bf808-7ccb-4815-8979-ed8a2873a408	AGREMENT_REGIME	4	Transmission Ministere	Envoi du dossier au ministere sectoriel competent pour avis	Send	#0EA5E9	2	[]	["approve", "reject", "request_info"]	Coordinateur ANAPI	f	t	t	2026-01-02 00:08:02.131+01	2026-01-02 00:08:02.131+01
2a19861a-eaa3-42e7-9036-a996bf551b8b	AGREMENT_REGIME	5	Examen Ministere	Evaluation du dossier par le ministere sectoriel	Building2	#14B8A6	14	[]	["approve", "reject", "request_info"]	Ministere sectoriel	f	t	t	2026-01-02 00:08:02.132+01	2026-01-02 00:08:02.132+01
dbaa7579-5873-4b42-8f86-2695a95df1f7	AGREMENT_REGIME	6	Commission Interministerielle	Examen en commission interministerielle pour decision finale	Users	#F59E0B	7	[]	["approve", "reject", "request_info"]	Commission Interministerielle	f	t	t	2026-01-02 00:08:02.134+01	2026-01-02 00:08:02.134+01
fd06846c-23be-4888-a0e0-57541c6cffef	AGREMENT_REGIME	7	Signature DG	Signature par le Directeur General de l'ANAPI	PenTool	#10B981	3	[]	["approve", "reject", "request_info"]	Directeur General ANAPI	f	t	t	2026-01-02 00:08:02.135+01	2026-01-02 00:08:02.135+01
9e9f2c53-8dab-4737-9ca6-a924c7fc3840	AGREMENT_REGIME	8	Delivrance Agrement	Emission et remise de l'agrement au regime	Award	#22C55E	2	[]	["approve", "reject", "request_info"]	Agent Guichet Unique	t	t	t	2026-01-02 00:08:02.137+01	2026-01-02 00:08:02.137+01
75be5f4d-b693-4626-bbfb-9a6d76074bcc	LICENCE_EXPLOITATION	1	Soumission	Reception et enregistrement de la demande	FileInput	#6366F1	1	[]	["approve", "reject", "request_info"]	Investisseur	f	t	t	2026-01-02 00:08:02.139+01	2026-01-02 00:08:02.139+01
e118f942-c45f-4579-a85e-2da8ba493b92	LICENCE_EXPLOITATION	2	Verification documentaire	Verification de la completude et conformite des documents soumis	FileSearch	#8B5CF6	3	[]	["approve", "reject", "request_info"]	Agent Guichet Unique	f	t	t	2026-01-02 00:08:02.14+01	2026-01-02 00:08:02.14+01
e37c8188-fcc6-4042-ae64-2a8de9aabb4a	LICENCE_EXPLOITATION	3	Analyse ANAPI	Examen technique et economique du dossier par les experts ANAPI	ClipboardCheck	#3B82F6	7	[]	["approve", "reject", "request_info"]	Analyste ANAPI	f	t	t	2026-01-02 00:08:02.142+01	2026-01-02 00:08:02.142+01
dc069a6e-6c2f-4497-a352-1c03a4032984	LICENCE_EXPLOITATION	4	Transmission Ministere	Envoi du dossier au ministere sectoriel competent pour avis	Send	#0EA5E9	2	[]	["approve", "reject", "request_info"]	Coordinateur ANAPI	f	t	t	2026-01-02 00:08:02.143+01	2026-01-02 00:08:02.143+01
bd77df91-8497-4e16-a65f-6332651e68f1	LICENCE_EXPLOITATION	5	Examen Ministere	Evaluation du dossier par le ministere sectoriel	Building2	#14B8A6	14	[]	["approve", "reject", "request_info"]	Ministere sectoriel	f	t	t	2026-01-02 00:08:02.144+01	2026-01-02 00:08:02.144+01
7364fde4-f5bd-48da-8fe9-386da22b7669	LICENCE_EXPLOITATION	6	Validation technique	Validation technique par le service competent	Settings	#8B5CF6	5	[]	["approve", "reject", "request_info"]	Service technique	f	t	t	2026-01-02 00:08:02.146+01	2026-01-02 00:08:02.146+01
7b9e453a-c5d7-48be-bf68-dbbe28b50650	LICENCE_EXPLOITATION	7	Approbation finale	Approbation finale et preparation de la licence	CheckCircle2	#10B981	3	[]	["approve", "reject", "request_info"]	Direction ANAPI	f	t	t	2026-01-02 00:08:02.147+01	2026-01-02 00:08:02.147+01
2c787f43-4765-4d69-9332-7666d69b065d	LICENCE_EXPLOITATION	8	Delivrance Licence	Emission et remise de la licence d'exploitation	FileBadge	#22C55E	2	[]	["approve", "reject", "request_info"]	Agent Guichet Unique	t	t	t	2026-01-02 00:08:02.148+01	2026-01-02 00:08:02.148+01
7df8b952-0c37-44b9-93f3-9ac75895b7ac	PERMIS_CONSTRUCTION	2	Verification documentaire	Verification de la completude et conformite des documents soumis	FileSearch	#8B5CF6	3	[]	["approve", "reject", "request_info"]	Agent Guichet Unique	f	t	t	2026-01-02 00:08:02.15+01	2026-01-02 00:08:02.15+01
39d77fb1-2964-4155-9caf-5100ab861870	PERMIS_CONSTRUCTION	3	Analyse ANAPI	Examen technique et economique du dossier par les experts ANAPI	ClipboardCheck	#3B82F6	7	[]	["approve", "reject", "request_info"]	Analyste ANAPI	f	t	t	2026-01-02 00:08:02.151+01	2026-01-02 00:08:02.151+01
7ab1f091-5c4e-4915-a1d4-4bff82ba59dc	PERMIS_CONSTRUCTION	4	Transmission Ministere	Envoi du dossier au ministere sectoriel competent pour avis	Send	#0EA5E9	2	[]	["approve", "reject", "request_info"]	Coordinateur ANAPI	f	t	t	2026-01-02 00:08:02.153+01	2026-01-02 00:08:02.153+01
242d06a4-d018-47f6-951e-e5d0c8d62de2	PERMIS_CONSTRUCTION	5	Examen Ministere	Evaluation du dossier par le ministere sectoriel	Building2	#14B8A6	14	[]	["approve", "reject", "request_info"]	Ministere sectoriel	f	t	t	2026-01-02 00:08:02.154+01	2026-01-02 00:08:02.154+01
b6984c8d-975d-4cee-a56b-fea1632ed0ca	PERMIS_CONSTRUCTION	6	Inspection terrain	Visite et inspection du site de construction	MapPin	#F59E0B	7	[]	["approve", "reject", "request_info"]	Inspecteur urbanisme	f	t	t	2026-01-02 00:08:02.155+01	2026-01-02 00:08:02.155+01
98b68189-0c9a-484d-9872-450d2992b5c8	PERMIS_CONSTRUCTION	7	Validation urbanisme	Validation par le service d'urbanisme	Building	#0EA5E9	5	[]	["approve", "reject", "request_info"]	Service urbanisme	f	t	t	2026-01-02 00:08:02.156+01	2026-01-02 00:08:02.156+01
5bf85d94-8888-4ac8-a476-5ddd57cc4b88	PERMIS_CONSTRUCTION	8	Delivrance Permis	Emission et remise du permis de construction	ScrollText	#22C55E	2	[]	["approve", "reject", "request_info"]	Agent Guichet Unique	t	t	t	2026-01-02 00:08:02.156+01	2026-01-02 00:08:02.156+01
fa8b2513-74e1-404d-a0ad-90543ac7cf03	AUTORISATION_ACTIVITE	2	Verification documentaire	Verification de la completude et conformite des documents soumis	FileSearch	#8B5CF6	3	[]	["approve", "reject", "request_info"]	Agent Guichet Unique	f	t	t	2026-01-02 00:08:02.159+01	2026-01-02 00:08:02.159+01
254f04d3-0386-4544-bbfc-7c51828e9c5b	AUTORISATION_ACTIVITE	3	Analyse ANAPI	Examen technique et economique du dossier par les experts ANAPI	ClipboardCheck	#3B82F6	7	[]	["approve", "reject", "request_info"]	Analyste ANAPI	f	t	t	2026-01-02 00:08:02.16+01	2026-01-02 00:08:02.16+01
5415fb81-13f3-4d19-8af0-394ab918f5e7	AUTORISATION_ACTIVITE	4	Transmission Ministere	Envoi du dossier au ministere sectoriel competent pour avis	Send	#0EA5E9	2	[]	["approve", "reject", "request_info"]	Coordinateur ANAPI	f	t	t	2026-01-02 00:08:02.162+01	2026-01-02 00:08:02.162+01
a1fe31c6-eac8-4392-a328-6f9582d76e40	AUTORISATION_ACTIVITE	5	Examen Ministere	Evaluation du dossier par le ministere sectoriel	Building2	#14B8A6	14	[]	["approve", "reject", "request_info"]	Ministere sectoriel	f	t	t	2026-01-02 00:08:02.163+01	2026-01-02 00:08:02.163+01
88782672-12c7-4210-922f-3e9db847133d	AUTORISATION_ACTIVITE	6	Verification conformite	Verification de la conformite aux normes sectorielles	Shield	#8B5CF6	5	[]	["approve", "reject", "request_info"]	Service conformite	f	t	t	2026-01-02 00:08:02.164+01	2026-01-02 00:08:02.164+01
9014c2ee-e6fe-4bbb-8173-ba816851cf83	AUTORISATION_ACTIVITE	7	Approbation autorite	Approbation par l'autorite competente	UserCheck	#10B981	3	[]	["approve", "reject", "request_info"]	Autorite sectorielle	f	t	t	2026-01-02 00:08:02.165+01	2026-01-02 00:08:02.165+01
907b19c7-0eb5-4dd8-a86b-7b7c3174cb7e	AUTORISATION_ACTIVITE	8	Delivrance Autorisation	Emission et remise de l'autorisation d'activite	FileCheck	#22C55E	2	[]	["approve", "reject", "request_info"]	Agent Guichet Unique	t	t	t	2026-01-02 00:08:02.166+01	2026-01-02 00:08:02.166+01
449a3449-2656-435c-b69d-2df74aa01a4d	AUTORISATION_ACTIVITE	1	Soumission 9	Reception et enregistrement de la demande	FileInput	#F59E0B	1	[]	["approve", "reject", "request_info"]	Investisseur	f	t	t	2026-01-02 00:08:02.158+01	2026-01-02 00:23:23.007+01
7c99d154-04a6-44e8-b0ba-92db0e474998	PERMIS_CONSTRUCTION	1	Soumission - 5	Reception et enregistrement de la demande	FileText	#6366F1	1	[]	["approve", "reject", "request_info"]	Investisseur	f	t	t	2026-01-02 00:08:02.149+01	2026-01-02 00:52:22.422+01
\.


--
-- Name: VerificationToken_id_seq; Type: SEQUENCE SET; Schema: public; Owner: yvesmpunga
--

SELECT pg_catalog.setval('public."VerificationToken_id_seq"', 1, false);


--
-- Name: Account Account_pkey; Type: CONSTRAINT; Schema: public; Owner: yvesmpunga
--

ALTER TABLE ONLY public."Account"
    ADD CONSTRAINT "Account_pkey" PRIMARY KEY (id);


--
-- Name: ApprovalRequest ApprovalRequest_pkey; Type: CONSTRAINT; Schema: public; Owner: yvesmpunga
--

ALTER TABLE ONLY public."ApprovalRequest"
    ADD CONSTRAINT "ApprovalRequest_pkey" PRIMARY KEY (id);


--
-- Name: ApprovalRequest ApprovalRequest_requestNumber_key1; Type: CONSTRAINT; Schema: public; Owner: yvesmpunga
--

ALTER TABLE ONLY public."ApprovalRequest"
    ADD CONSTRAINT "ApprovalRequest_requestNumber_key1" UNIQUE ("requestNumber");


--
-- Name: Attendance Attendance_pkey; Type: CONSTRAINT; Schema: public; Owner: yvesmpunga
--

ALTER TABLE ONLY public."Attendance"
    ADD CONSTRAINT "Attendance_pkey" PRIMARY KEY (id);


--
-- Name: CategoryDeduction CategoryDeduction_pkey; Type: CONSTRAINT; Schema: public; Owner: yvesmpunga
--

ALTER TABLE ONLY public."CategoryDeduction"
    ADD CONSTRAINT "CategoryDeduction_pkey" PRIMARY KEY (id);


--
-- Name: CategoryPrime CategoryPrime_pkey; Type: CONSTRAINT; Schema: public; Owner: yvesmpunga
--

ALTER TABLE ONLY public."CategoryPrime"
    ADD CONSTRAINT "CategoryPrime_pkey" PRIMARY KEY (id);


--
-- Name: City City_code_provinceId_key; Type: CONSTRAINT; Schema: public; Owner: yvesmpunga
--

ALTER TABLE ONLY public."City"
    ADD CONSTRAINT "City_code_provinceId_key" UNIQUE (code, "provinceId");


--
-- Name: City City_pkey; Type: CONSTRAINT; Schema: public; Owner: yvesmpunga
--

ALTER TABLE ONLY public."City"
    ADD CONSTRAINT "City_pkey" PRIMARY KEY (id);


--
-- Name: Commune Commune_code_cityId_key; Type: CONSTRAINT; Schema: public; Owner: yvesmpunga
--

ALTER TABLE ONLY public."Commune"
    ADD CONSTRAINT "Commune_code_cityId_key" UNIQUE (code, "cityId");


--
-- Name: Commune Commune_pkey; Type: CONSTRAINT; Schema: public; Owner: yvesmpunga
--

ALTER TABLE ONLY public."Commune"
    ADD CONSTRAINT "Commune_pkey" PRIMARY KEY (id);


--
-- Name: Contract Contract_pkey; Type: CONSTRAINT; Schema: public; Owner: yvesmpunga
--

ALTER TABLE ONLY public."Contract"
    ADD CONSTRAINT "Contract_pkey" PRIMARY KEY (id);


--
-- Name: Currency Currency_pkey; Type: CONSTRAINT; Schema: public; Owner: yvesmpunga
--

ALTER TABLE ONLY public."Currency"
    ADD CONSTRAINT "Currency_pkey" PRIMARY KEY (id);


--
-- Name: Document Document_pkey; Type: CONSTRAINT; Schema: public; Owner: yvesmpunga
--

ALTER TABLE ONLY public."Document"
    ADD CONSTRAINT "Document_pkey" PRIMARY KEY (id);


--
-- Name: EmployeeBankAccount EmployeeBankAccount_pkey; Type: CONSTRAINT; Schema: public; Owner: yvesmpunga
--

ALTER TABLE ONLY public."EmployeeBankAccount"
    ADD CONSTRAINT "EmployeeBankAccount_pkey" PRIMARY KEY (id);


--
-- Name: EmployeeChild EmployeeChild_pkey; Type: CONSTRAINT; Schema: public; Owner: yvesmpunga
--

ALTER TABLE ONLY public."EmployeeChild"
    ADD CONSTRAINT "EmployeeChild_pkey" PRIMARY KEY (id);


--
-- Name: EmployeeDocument EmployeeDocument_pkey; Type: CONSTRAINT; Schema: public; Owner: yvesmpunga
--

ALTER TABLE ONLY public."EmployeeDocument"
    ADD CONSTRAINT "EmployeeDocument_pkey" PRIMARY KEY (id);


--
-- Name: EmployeeEmergencyContact EmployeeEmergencyContact_pkey; Type: CONSTRAINT; Schema: public; Owner: yvesmpunga
--

ALTER TABLE ONLY public."EmployeeEmergencyContact"
    ADD CONSTRAINT "EmployeeEmergencyContact_pkey" PRIMARY KEY (id);


--
-- Name: EmployeeSpouse EmployeeSpouse_pkey; Type: CONSTRAINT; Schema: public; Owner: yvesmpunga
--

ALTER TABLE ONLY public."EmployeeSpouse"
    ADD CONSTRAINT "EmployeeSpouse_pkey" PRIMARY KEY (id);


--
-- Name: EmployeeTraining EmployeeTraining_pkey; Type: CONSTRAINT; Schema: public; Owner: yvesmpunga
--

ALTER TABLE ONLY public."EmployeeTraining"
    ADD CONSTRAINT "EmployeeTraining_pkey" PRIMARY KEY (id);


--
-- Name: Employee Employee_pkey; Type: CONSTRAINT; Schema: public; Owner: yvesmpunga
--

ALTER TABLE ONLY public."Employee"
    ADD CONSTRAINT "Employee_pkey" PRIMARY KEY (id);


--
-- Name: Evaluation Evaluation_pkey; Type: CONSTRAINT; Schema: public; Owner: yvesmpunga
--

ALTER TABLE ONLY public."Evaluation"
    ADD CONSTRAINT "Evaluation_pkey" PRIMARY KEY (id);


--
-- Name: HRDepartment HRDepartment_code_key1; Type: CONSTRAINT; Schema: public; Owner: yvesmpunga
--

ALTER TABLE ONLY public."HRDepartment"
    ADD CONSTRAINT "HRDepartment_code_key1" UNIQUE (code);


--
-- Name: HRDepartment HRDepartment_code_key2; Type: CONSTRAINT; Schema: public; Owner: yvesmpunga
--

ALTER TABLE ONLY public."HRDepartment"
    ADD CONSTRAINT "HRDepartment_code_key2" UNIQUE (code);


--
-- Name: HRDepartment HRDepartment_code_key3; Type: CONSTRAINT; Schema: public; Owner: yvesmpunga
--

ALTER TABLE ONLY public."HRDepartment"
    ADD CONSTRAINT "HRDepartment_code_key3" UNIQUE (code);


--
-- Name: HRDepartment HRDepartment_code_key4; Type: CONSTRAINT; Schema: public; Owner: yvesmpunga
--

ALTER TABLE ONLY public."HRDepartment"
    ADD CONSTRAINT "HRDepartment_code_key4" UNIQUE (code);


--
-- Name: HRDepartment HRDepartment_pkey; Type: CONSTRAINT; Schema: public; Owner: yvesmpunga
--

ALTER TABLE ONLY public."HRDepartment"
    ADD CONSTRAINT "HRDepartment_pkey" PRIMARY KEY (id);


--
-- Name: Holiday Holiday_pkey; Type: CONSTRAINT; Schema: public; Owner: yvesmpunga
--

ALTER TABLE ONLY public."Holiday"
    ADD CONSTRAINT "Holiday_pkey" PRIMARY KEY (id);


--
-- Name: Investment Investment_pkey; Type: CONSTRAINT; Schema: public; Owner: yvesmpunga
--

ALTER TABLE ONLY public."Investment"
    ADD CONSTRAINT "Investment_pkey" PRIMARY KEY (id);


--
-- Name: Investment Investment_projectCode_key1; Type: CONSTRAINT; Schema: public; Owner: yvesmpunga
--

ALTER TABLE ONLY public."Investment"
    ADD CONSTRAINT "Investment_projectCode_key1" UNIQUE ("projectCode");


--
-- Name: Investor Investor_pkey; Type: CONSTRAINT; Schema: public; Owner: yvesmpunga
--

ALTER TABLE ONLY public."Investor"
    ADD CONSTRAINT "Investor_pkey" PRIMARY KEY (id);


--
-- Name: LeaveBalance LeaveBalance_pkey; Type: CONSTRAINT; Schema: public; Owner: yvesmpunga
--

ALTER TABLE ONLY public."LeaveBalance"
    ADD CONSTRAINT "LeaveBalance_pkey" PRIMARY KEY (id);


--
-- Name: LeaveType LeaveType_pkey; Type: CONSTRAINT; Schema: public; Owner: yvesmpunga
--

ALTER TABLE ONLY public."LeaveType"
    ADD CONSTRAINT "LeaveType_pkey" PRIMARY KEY (id);


--
-- Name: Leave Leave_pkey; Type: CONSTRAINT; Schema: public; Owner: yvesmpunga
--

ALTER TABLE ONLY public."Leave"
    ADD CONSTRAINT "Leave_pkey" PRIMARY KEY (id);


--
-- Name: LegalDocument LegalDocument_pkey; Type: CONSTRAINT; Schema: public; Owner: yvesmpunga
--

ALTER TABLE ONLY public."LegalDocument"
    ADD CONSTRAINT "LegalDocument_pkey" PRIMARY KEY (id);


--
-- Name: Ministry Ministry_pkey; Type: CONSTRAINT; Schema: public; Owner: yvesmpunga
--

ALTER TABLE ONLY public."Ministry"
    ADD CONSTRAINT "Ministry_pkey" PRIMARY KEY (id);


--
-- Name: PayrollConfig PayrollConfig_pkey; Type: CONSTRAINT; Schema: public; Owner: yvesmpunga
--

ALTER TABLE ONLY public."PayrollConfig"
    ADD CONSTRAINT "PayrollConfig_pkey" PRIMARY KEY (id);


--
-- Name: Payslip Payslip_pkey; Type: CONSTRAINT; Schema: public; Owner: yvesmpunga
--

ALTER TABLE ONLY public."Payslip"
    ADD CONSTRAINT "Payslip_pkey" PRIMARY KEY (id);


--
-- Name: Position Position_pkey; Type: CONSTRAINT; Schema: public; Owner: yvesmpunga
--

ALTER TABLE ONLY public."Position"
    ADD CONSTRAINT "Position_pkey" PRIMARY KEY (id);


--
-- Name: Province Province_pkey; Type: CONSTRAINT; Schema: public; Owner: yvesmpunga
--

ALTER TABLE ONLY public."Province"
    ADD CONSTRAINT "Province_pkey" PRIMARY KEY (id);


--
-- Name: SalaryAdvance SalaryAdvance_pkey; Type: CONSTRAINT; Schema: public; Owner: yvesmpunga
--

ALTER TABLE ONLY public."SalaryAdvance"
    ADD CONSTRAINT "SalaryAdvance_pkey" PRIMARY KEY (id);


--
-- Name: SalaryGrade SalaryGrade_pkey; Type: CONSTRAINT; Schema: public; Owner: yvesmpunga
--

ALTER TABLE ONLY public."SalaryGrade"
    ADD CONSTRAINT "SalaryGrade_pkey" PRIMARY KEY (id);


--
-- Name: Sector Sector_pkey; Type: CONSTRAINT; Schema: public; Owner: yvesmpunga
--

ALTER TABLE ONLY public."Sector"
    ADD CONSTRAINT "Sector_pkey" PRIMARY KEY (id);


--
-- Name: Session Session_pkey; Type: CONSTRAINT; Schema: public; Owner: yvesmpunga
--

ALTER TABLE ONLY public."Session"
    ADD CONSTRAINT "Session_pkey" PRIMARY KEY (id);


--
-- Name: Session Session_sessionToken_key1; Type: CONSTRAINT; Schema: public; Owner: yvesmpunga
--

ALTER TABLE ONLY public."Session"
    ADD CONSTRAINT "Session_sessionToken_key1" UNIQUE ("sessionToken");


--
-- Name: Session Session_sessionToken_key2; Type: CONSTRAINT; Schema: public; Owner: yvesmpunga
--

ALTER TABLE ONLY public."Session"
    ADD CONSTRAINT "Session_sessionToken_key2" UNIQUE ("sessionToken");


--
-- Name: Session Session_sessionToken_key3; Type: CONSTRAINT; Schema: public; Owner: yvesmpunga
--

ALTER TABLE ONLY public."Session"
    ADD CONSTRAINT "Session_sessionToken_key3" UNIQUE ("sessionToken");


--
-- Name: Session Session_sessionToken_key4; Type: CONSTRAINT; Schema: public; Owner: yvesmpunga
--

ALTER TABLE ONLY public."Session"
    ADD CONSTRAINT "Session_sessionToken_key4" UNIQUE ("sessionToken");


--
-- Name: Training Training_pkey; Type: CONSTRAINT; Schema: public; Owner: yvesmpunga
--

ALTER TABLE ONLY public."Training"
    ADD CONSTRAINT "Training_pkey" PRIMARY KEY (id);


--
-- Name: User User_email_key1; Type: CONSTRAINT; Schema: public; Owner: yvesmpunga
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key1" UNIQUE (email);


--
-- Name: User User_email_key2; Type: CONSTRAINT; Schema: public; Owner: yvesmpunga
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key2" UNIQUE (email);


--
-- Name: User User_email_key3; Type: CONSTRAINT; Schema: public; Owner: yvesmpunga
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key3" UNIQUE (email);


--
-- Name: User User_email_key4; Type: CONSTRAINT; Schema: public; Owner: yvesmpunga
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key4" UNIQUE (email);


--
-- Name: User User_email_key5; Type: CONSTRAINT; Schema: public; Owner: yvesmpunga
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key5" UNIQUE (email);


--
-- Name: User User_email_key6; Type: CONSTRAINT; Schema: public; Owner: yvesmpunga
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key6" UNIQUE (email);


--
-- Name: User User_email_key7; Type: CONSTRAINT; Schema: public; Owner: yvesmpunga
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key7" UNIQUE (email);


--
-- Name: User User_email_key8; Type: CONSTRAINT; Schema: public; Owner: yvesmpunga
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key8" UNIQUE (email);


--
-- Name: User User_pkey; Type: CONSTRAINT; Schema: public; Owner: yvesmpunga
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_pkey" PRIMARY KEY (id);


--
-- Name: VerificationToken VerificationToken_token_key1; Type: CONSTRAINT; Schema: public; Owner: yvesmpunga
--

ALTER TABLE ONLY public."VerificationToken"
    ADD CONSTRAINT "VerificationToken_token_key1" UNIQUE (token);


--
-- Name: VerificationToken VerificationToken_token_key2; Type: CONSTRAINT; Schema: public; Owner: yvesmpunga
--

ALTER TABLE ONLY public."VerificationToken"
    ADD CONSTRAINT "VerificationToken_token_key2" UNIQUE (token);


--
-- Name: VerificationToken VerificationToken_token_key3; Type: CONSTRAINT; Schema: public; Owner: yvesmpunga
--

ALTER TABLE ONLY public."VerificationToken"
    ADD CONSTRAINT "VerificationToken_token_key3" UNIQUE (token);


--
-- Name: VerificationToken VerificationToken_token_key4; Type: CONSTRAINT; Schema: public; Owner: yvesmpunga
--

ALTER TABLE ONLY public."VerificationToken"
    ADD CONSTRAINT "VerificationToken_token_key4" UNIQUE (token);


--
-- Name: WorkerCategory WorkerCategory_pkey; Type: CONSTRAINT; Schema: public; Owner: yvesmpunga
--

ALTER TABLE ONLY public."WorkerCategory"
    ADD CONSTRAINT "WorkerCategory_pkey" PRIMARY KEY (id);


--
-- Name: actes_administratifs actes_administratifs_code_key; Type: CONSTRAINT; Schema: public; Owner: yvesmpunga
--

ALTER TABLE ONLY public.actes_administratifs
    ADD CONSTRAINT actes_administratifs_code_key UNIQUE (code);


--
-- Name: actes_administratifs actes_administratifs_pkey; Type: CONSTRAINT; Schema: public; Owner: yvesmpunga
--

ALTER TABLE ONLY public.actes_administratifs
    ADD CONSTRAINT actes_administratifs_pkey PRIMARY KEY (id);


--
-- Name: application_documents application_documents_pkey; Type: CONSTRAINT; Schema: public; Owner: yvesmpunga
--

ALTER TABLE ONLY public.application_documents
    ADD CONSTRAINT application_documents_pkey PRIMARY KEY (id);


--
-- Name: approvals approvals_pkey; Type: CONSTRAINT; Schema: public; Owner: yvesmpunga
--

ALTER TABLE ONLY public.approvals
    ADD CONSTRAINT approvals_pkey PRIMARY KEY (id);


--
-- Name: attendances attendances_employee_id_date_key; Type: CONSTRAINT; Schema: public; Owner: yvesmpunga
--

ALTER TABLE ONLY public.attendances
    ADD CONSTRAINT attendances_employee_id_date_key UNIQUE (employee_id, date);


--
-- Name: attendances attendances_pkey; Type: CONSTRAINT; Schema: public; Owner: yvesmpunga
--

ALTER TABLE ONLY public.attendances
    ADD CONSTRAINT attendances_pkey PRIMARY KEY (id);


--
-- Name: barrier_resolutions barrier_resolutions_pkey; Type: CONSTRAINT; Schema: public; Owner: yvesmpunga
--

ALTER TABLE ONLY public.barrier_resolutions
    ADD CONSTRAINT barrier_resolutions_pkey PRIMARY KEY (id);


--
-- Name: bidder_ratings bidder_ratings_pkey; Type: CONSTRAINT; Schema: public; Owner: yvesmpunga
--

ALTER TABLE ONLY public.bidder_ratings
    ADD CONSTRAINT bidder_ratings_pkey PRIMARY KEY (id);


--
-- Name: business_barriers business_barriers_pkey; Type: CONSTRAINT; Schema: public; Owner: yvesmpunga
--

ALTER TABLE ONLY public.business_barriers
    ADD CONSTRAINT business_barriers_pkey PRIMARY KEY (id);


--
-- Name: business_barriers business_barriers_reference_key; Type: CONSTRAINT; Schema: public; Owner: yvesmpunga
--

ALTER TABLE ONLY public.business_barriers
    ADD CONSTRAINT business_barriers_reference_key UNIQUE (reference);


--
-- Name: business_barriers business_barriers_reference_key1; Type: CONSTRAINT; Schema: public; Owner: yvesmpunga
--

ALTER TABLE ONLY public.business_barriers
    ADD CONSTRAINT business_barriers_reference_key1 UNIQUE (reference);


--
-- Name: cities cities_code_key; Type: CONSTRAINT; Schema: public; Owner: yvesmpunga
--

ALTER TABLE ONLY public.cities
    ADD CONSTRAINT cities_code_key UNIQUE (code);


--
-- Name: cities cities_code_key1; Type: CONSTRAINT; Schema: public; Owner: yvesmpunga
--

ALTER TABLE ONLY public.cities
    ADD CONSTRAINT cities_code_key1 UNIQUE (code);


--
-- Name: cities cities_code_key2; Type: CONSTRAINT; Schema: public; Owner: yvesmpunga
--

ALTER TABLE ONLY public.cities
    ADD CONSTRAINT cities_code_key2 UNIQUE (code);


--
-- Name: cities cities_code_key3; Type: CONSTRAINT; Schema: public; Owner: yvesmpunga
--

ALTER TABLE ONLY public.cities
    ADD CONSTRAINT cities_code_key3 UNIQUE (code);


--
-- Name: cities cities_pkey; Type: CONSTRAINT; Schema: public; Owner: yvesmpunga
--

ALTER TABLE ONLY public.cities
    ADD CONSTRAINT cities_pkey PRIMARY KEY (id);


--
-- Name: climate_indicator_values climate_indicator_values_pkey; Type: CONSTRAINT; Schema: public; Owner: yvesmpunga
--

ALTER TABLE ONLY public.climate_indicator_values
    ADD CONSTRAINT climate_indicator_values_pkey PRIMARY KEY (id);


--
-- Name: climate_indicators climate_indicators_code_key; Type: CONSTRAINT; Schema: public; Owner: yvesmpunga
--

ALTER TABLE ONLY public.climate_indicators
    ADD CONSTRAINT climate_indicators_code_key UNIQUE (code);


--
-- Name: climate_indicators climate_indicators_code_key1; Type: CONSTRAINT; Schema: public; Owner: yvesmpunga
--

ALTER TABLE ONLY public.climate_indicators
    ADD CONSTRAINT climate_indicators_code_key1 UNIQUE (code);


--
-- Name: climate_indicators climate_indicators_code_key2; Type: CONSTRAINT; Schema: public; Owner: yvesmpunga
--

ALTER TABLE ONLY public.climate_indicators
    ADD CONSTRAINT climate_indicators_code_key2 UNIQUE (code);


--
-- Name: climate_indicators climate_indicators_pkey; Type: CONSTRAINT; Schema: public; Owner: yvesmpunga
--

ALTER TABLE ONLY public.climate_indicators
    ADD CONSTRAINT climate_indicators_pkey PRIMARY KEY (id);


--
-- Name: contract_types contract_types_code_key; Type: CONSTRAINT; Schema: public; Owner: yvesmpunga
--

ALTER TABLE ONLY public.contract_types
    ADD CONSTRAINT contract_types_code_key UNIQUE (code);


--
-- Name: contract_types contract_types_pkey; Type: CONSTRAINT; Schema: public; Owner: yvesmpunga
--

ALTER TABLE ONLY public.contract_types
    ADD CONSTRAINT contract_types_pkey PRIMARY KEY (id);


--
-- Name: contracts contracts_contractNumber_key; Type: CONSTRAINT; Schema: public; Owner: yvesmpunga
--

ALTER TABLE ONLY public.contracts
    ADD CONSTRAINT "contracts_contractNumber_key" UNIQUE ("contractNumber");


--
-- Name: contracts contracts_pkey; Type: CONSTRAINT; Schema: public; Owner: yvesmpunga
--

ALTER TABLE ONLY public.contracts
    ADD CONSTRAINT contracts_pkey PRIMARY KEY (id);


--
-- Name: countries countries_code3_key; Type: CONSTRAINT; Schema: public; Owner: yvesmpunga
--

ALTER TABLE ONLY public.countries
    ADD CONSTRAINT countries_code3_key UNIQUE (code3);


--
-- Name: countries countries_code_key; Type: CONSTRAINT; Schema: public; Owner: yvesmpunga
--

ALTER TABLE ONLY public.countries
    ADD CONSTRAINT countries_code_key UNIQUE (code);


--
-- Name: countries countries_pkey; Type: CONSTRAINT; Schema: public; Owner: yvesmpunga
--

ALTER TABLE ONLY public.countries
    ADD CONSTRAINT countries_pkey PRIMARY KEY (id);


--
-- Name: currencies currencies_code_key; Type: CONSTRAINT; Schema: public; Owner: yvesmpunga
--

ALTER TABLE ONLY public.currencies
    ADD CONSTRAINT currencies_code_key UNIQUE (code);


--
-- Name: currencies currencies_pkey; Type: CONSTRAINT; Schema: public; Owner: yvesmpunga
--

ALTER TABLE ONLY public.currencies
    ADD CONSTRAINT currencies_pkey PRIMARY KEY (id);


--
-- Name: dialogue_participants dialogue_participants_pkey; Type: CONSTRAINT; Schema: public; Owner: yvesmpunga
--

ALTER TABLE ONLY public.dialogue_participants
    ADD CONSTRAINT dialogue_participants_pkey PRIMARY KEY (id);


--
-- Name: districts districts_code_key; Type: CONSTRAINT; Schema: public; Owner: yvesmpunga
--

ALTER TABLE ONLY public.districts
    ADD CONSTRAINT districts_code_key UNIQUE (code);


--
-- Name: districts districts_pkey; Type: CONSTRAINT; Schema: public; Owner: yvesmpunga
--

ALTER TABLE ONLY public.districts
    ADD CONSTRAINT districts_pkey PRIMARY KEY (id);


--
-- Name: dossier_documents dossier_documents_pkey; Type: CONSTRAINT; Schema: public; Owner: yvesmpunga
--

ALTER TABLE ONLY public.dossier_documents
    ADD CONSTRAINT dossier_documents_pkey PRIMARY KEY (id);


--
-- Name: dossier_sectors dossier_sectors_pkey; Type: CONSTRAINT; Schema: public; Owner: yvesmpunga
--

ALTER TABLE ONLY public.dossier_sectors
    ADD CONSTRAINT dossier_sectors_pkey PRIMARY KEY (id);


--
-- Name: dossier_step_validations dossier_step_validations_pkey; Type: CONSTRAINT; Schema: public; Owner: yvesmpunga
--

ALTER TABLE ONLY public.dossier_step_validations
    ADD CONSTRAINT dossier_step_validations_pkey PRIMARY KEY (id);


--
-- Name: dossiers dossiers_dossierNumber_key; Type: CONSTRAINT; Schema: public; Owner: yvesmpunga
--

ALTER TABLE ONLY public.dossiers
    ADD CONSTRAINT "dossiers_dossierNumber_key" UNIQUE ("dossierNumber");


--
-- Name: dossiers dossiers_pkey; Type: CONSTRAINT; Schema: public; Owner: yvesmpunga
--

ALTER TABLE ONLY public.dossiers
    ADD CONSTRAINT dossiers_pkey PRIMARY KEY (id);


--
-- Name: exchange_rate_history exchange_rate_history_pkey; Type: CONSTRAINT; Schema: public; Owner: yvesmpunga
--

ALTER TABLE ONLY public.exchange_rate_history
    ADD CONSTRAINT exchange_rate_history_pkey PRIMARY KEY (id);


--
-- Name: framework_agreement_suppliers framework_agreement_suppliers_pkey; Type: CONSTRAINT; Schema: public; Owner: yvesmpunga
--

ALTER TABLE ONLY public.framework_agreement_suppliers
    ADD CONSTRAINT framework_agreement_suppliers_pkey PRIMARY KEY (id);


--
-- Name: framework_agreements framework_agreements_agreement_number_key; Type: CONSTRAINT; Schema: public; Owner: yvesmpunga
--

ALTER TABLE ONLY public.framework_agreements
    ADD CONSTRAINT framework_agreements_agreement_number_key UNIQUE (agreement_number);


--
-- Name: framework_agreements framework_agreements_pkey; Type: CONSTRAINT; Schema: public; Owner: yvesmpunga
--

ALTER TABLE ONLY public.framework_agreements
    ADD CONSTRAINT framework_agreements_pkey PRIMARY KEY (id);


--
-- Name: framework_orders framework_orders_order_number_key; Type: CONSTRAINT; Schema: public; Owner: yvesmpunga
--

ALTER TABLE ONLY public.framework_orders
    ADD CONSTRAINT framework_orders_order_number_key UNIQUE (order_number);


--
-- Name: framework_orders framework_orders_pkey; Type: CONSTRAINT; Schema: public; Owner: yvesmpunga
--

ALTER TABLE ONLY public.framework_orders
    ADD CONSTRAINT framework_orders_pkey PRIMARY KEY (id);


--
-- Name: international_treaties international_treaties_pkey; Type: CONSTRAINT; Schema: public; Owner: yvesmpunga
--

ALTER TABLE ONLY public.international_treaties
    ADD CONSTRAINT international_treaties_pkey PRIMARY KEY (id);


--
-- Name: international_treaties international_treaties_reference_key; Type: CONSTRAINT; Schema: public; Owner: yvesmpunga
--

ALTER TABLE ONLY public.international_treaties
    ADD CONSTRAINT international_treaties_reference_key UNIQUE (reference);


--
-- Name: international_treaties international_treaties_reference_key1; Type: CONSTRAINT; Schema: public; Owner: yvesmpunga
--

ALTER TABLE ONLY public.international_treaties
    ADD CONSTRAINT international_treaties_reference_key1 UNIQUE (reference);


--
-- Name: international_treaties international_treaties_reference_key2; Type: CONSTRAINT; Schema: public; Owner: yvesmpunga
--

ALTER TABLE ONLY public.international_treaties
    ADD CONSTRAINT international_treaties_reference_key2 UNIQUE (reference);


--
-- Name: investments investments_pkey; Type: CONSTRAINT; Schema: public; Owner: yvesmpunga
--

ALTER TABLE ONLY public.investments
    ADD CONSTRAINT investments_pkey PRIMARY KEY (id);


--
-- Name: investments_projects investments_projects_pkey; Type: CONSTRAINT; Schema: public; Owner: yvesmpunga
--

ALTER TABLE ONLY public.investments_projects
    ADD CONSTRAINT investments_projects_pkey PRIMARY KEY (id);


--
-- Name: investments_projects investments_projects_projectCode_key; Type: CONSTRAINT; Schema: public; Owner: yvesmpunga
--

ALTER TABLE ONLY public.investments_projects
    ADD CONSTRAINT "investments_projects_projectCode_key" UNIQUE ("projectCode");


--
-- Name: investments investments_reference_number_key; Type: CONSTRAINT; Schema: public; Owner: yvesmpunga
--

ALTER TABLE ONLY public.investments
    ADD CONSTRAINT investments_reference_number_key UNIQUE (reference_number);


--
-- Name: investors investors_investorCode_key; Type: CONSTRAINT; Schema: public; Owner: yvesmpunga
--

ALTER TABLE ONLY public.investors
    ADD CONSTRAINT "investors_investorCode_key" UNIQUE ("investorCode");


--
-- Name: investors investors_investorCode_key1; Type: CONSTRAINT; Schema: public; Owner: yvesmpunga
--

ALTER TABLE ONLY public.investors
    ADD CONSTRAINT "investors_investorCode_key1" UNIQUE ("investorCode");


--
-- Name: investors investors_investorCode_key2; Type: CONSTRAINT; Schema: public; Owner: yvesmpunga
--

ALTER TABLE ONLY public.investors
    ADD CONSTRAINT "investors_investorCode_key2" UNIQUE ("investorCode");


--
-- Name: investors investors_investorCode_key3; Type: CONSTRAINT; Schema: public; Owner: yvesmpunga
--

ALTER TABLE ONLY public.investors
    ADD CONSTRAINT "investors_investorCode_key3" UNIQUE ("investorCode");


--
-- Name: investors investors_investorCode_key4; Type: CONSTRAINT; Schema: public; Owner: yvesmpunga
--

ALTER TABLE ONLY public.investors
    ADD CONSTRAINT "investors_investorCode_key4" UNIQUE ("investorCode");


--
-- Name: investors investors_pkey; Type: CONSTRAINT; Schema: public; Owner: yvesmpunga
--

ALTER TABLE ONLY public.investors
    ADD CONSTRAINT investors_pkey PRIMARY KEY (id);


--
-- Name: juridical_texts juridical_texts_documentNumber_key; Type: CONSTRAINT; Schema: public; Owner: yvesmpunga
--

ALTER TABLE ONLY public.juridical_texts
    ADD CONSTRAINT "juridical_texts_documentNumber_key" UNIQUE ("documentNumber");


--
-- Name: juridical_texts juridical_texts_pkey; Type: CONSTRAINT; Schema: public; Owner: yvesmpunga
--

ALTER TABLE ONLY public.juridical_texts
    ADD CONSTRAINT juridical_texts_pkey PRIMARY KEY (id);


--
-- Name: legal_alerts legal_alerts_alertNumber_key; Type: CONSTRAINT; Schema: public; Owner: yvesmpunga
--

ALTER TABLE ONLY public.legal_alerts
    ADD CONSTRAINT "legal_alerts_alertNumber_key" UNIQUE ("alertNumber");


--
-- Name: legal_alerts legal_alerts_pkey; Type: CONSTRAINT; Schema: public; Owner: yvesmpunga
--

ALTER TABLE ONLY public.legal_alerts
    ADD CONSTRAINT legal_alerts_pkey PRIMARY KEY (id);


--
-- Name: legal_document_types legal_document_types_code_key; Type: CONSTRAINT; Schema: public; Owner: yvesmpunga
--

ALTER TABLE ONLY public.legal_document_types
    ADD CONSTRAINT legal_document_types_code_key UNIQUE (code);


--
-- Name: legal_document_types legal_document_types_pkey; Type: CONSTRAINT; Schema: public; Owner: yvesmpunga
--

ALTER TABLE ONLY public.legal_document_types
    ADD CONSTRAINT legal_document_types_pkey PRIMARY KEY (id);


--
-- Name: legal_domains legal_domains_code_key; Type: CONSTRAINT; Schema: public; Owner: yvesmpunga
--

ALTER TABLE ONLY public.legal_domains
    ADD CONSTRAINT legal_domains_code_key UNIQUE (code);


--
-- Name: legal_domains legal_domains_pkey; Type: CONSTRAINT; Schema: public; Owner: yvesmpunga
--

ALTER TABLE ONLY public.legal_domains
    ADD CONSTRAINT legal_domains_pkey PRIMARY KEY (id);


--
-- Name: legal_proposals legal_proposals_pkey; Type: CONSTRAINT; Schema: public; Owner: yvesmpunga
--

ALTER TABLE ONLY public.legal_proposals
    ADD CONSTRAINT legal_proposals_pkey PRIMARY KEY (id);


--
-- Name: legal_proposals legal_proposals_reference_key; Type: CONSTRAINT; Schema: public; Owner: yvesmpunga
--

ALTER TABLE ONLY public.legal_proposals
    ADD CONSTRAINT legal_proposals_reference_key UNIQUE (reference);


--
-- Name: legal_proposals legal_proposals_reference_key1; Type: CONSTRAINT; Schema: public; Owner: yvesmpunga
--

ALTER TABLE ONLY public.legal_proposals
    ADD CONSTRAINT legal_proposals_reference_key1 UNIQUE (reference);


--
-- Name: mediation_cases mediation_cases_pkey; Type: CONSTRAINT; Schema: public; Owner: yvesmpunga
--

ALTER TABLE ONLY public.mediation_cases
    ADD CONSTRAINT mediation_cases_pkey PRIMARY KEY (id);


--
-- Name: mediation_cases mediation_cases_reference_key; Type: CONSTRAINT; Schema: public; Owner: yvesmpunga
--

ALTER TABLE ONLY public.mediation_cases
    ADD CONSTRAINT mediation_cases_reference_key UNIQUE (reference);


--
-- Name: message_attachments message_attachments_pkey; Type: CONSTRAINT; Schema: public; Owner: yvesmpunga
--

ALTER TABLE ONLY public.message_attachments
    ADD CONSTRAINT message_attachments_pkey PRIMARY KEY (id);


--
-- Name: message_recipients message_recipients_pkey; Type: CONSTRAINT; Schema: public; Owner: yvesmpunga
--

ALTER TABLE ONLY public.message_recipients
    ADD CONSTRAINT message_recipients_pkey PRIMARY KEY (id);


--
-- Name: messages messages_pkey; Type: CONSTRAINT; Schema: public; Owner: yvesmpunga
--

ALTER TABLE ONLY public.messages
    ADD CONSTRAINT messages_pkey PRIMARY KEY (id);


--
-- Name: ministries ministries_code_key; Type: CONSTRAINT; Schema: public; Owner: yvesmpunga
--

ALTER TABLE ONLY public.ministries
    ADD CONSTRAINT ministries_code_key UNIQUE (code);


--
-- Name: ministries ministries_pkey; Type: CONSTRAINT; Schema: public; Owner: yvesmpunga
--

ALTER TABLE ONLY public.ministries
    ADD CONSTRAINT ministries_pkey PRIMARY KEY (id);


--
-- Name: ministry_departments ministry_departments_pkey; Type: CONSTRAINT; Schema: public; Owner: yvesmpunga
--

ALTER TABLE ONLY public.ministry_departments
    ADD CONSTRAINT ministry_departments_pkey PRIMARY KEY (id);


--
-- Name: ministry_request_documents ministry_request_documents_pkey; Type: CONSTRAINT; Schema: public; Owner: yvesmpunga
--

ALTER TABLE ONLY public.ministry_request_documents
    ADD CONSTRAINT ministry_request_documents_pkey PRIMARY KEY (id);


--
-- Name: ministry_request_history ministry_request_history_pkey; Type: CONSTRAINT; Schema: public; Owner: yvesmpunga
--

ALTER TABLE ONLY public.ministry_request_history
    ADD CONSTRAINT ministry_request_history_pkey PRIMARY KEY (id);


--
-- Name: ministry_requests ministry_requests_pkey; Type: CONSTRAINT; Schema: public; Owner: yvesmpunga
--

ALTER TABLE ONLY public.ministry_requests
    ADD CONSTRAINT ministry_requests_pkey PRIMARY KEY (id);


--
-- Name: ministry_requests ministry_requests_requestNumber_key; Type: CONSTRAINT; Schema: public; Owner: yvesmpunga
--

ALTER TABLE ONLY public.ministry_requests
    ADD CONSTRAINT "ministry_requests_requestNumber_key" UNIQUE ("requestNumber");


--
-- Name: ministry_workflows ministry_workflows_pkey; Type: CONSTRAINT; Schema: public; Owner: yvesmpunga
--

ALTER TABLE ONLY public.ministry_workflows
    ADD CONSTRAINT ministry_workflows_pkey PRIMARY KEY (id);


--
-- Name: opportunity_applications opportunity_applications_pkey; Type: CONSTRAINT; Schema: public; Owner: yvesmpunga
--

ALTER TABLE ONLY public.opportunity_applications
    ADD CONSTRAINT opportunity_applications_pkey PRIMARY KEY (id);


--
-- Name: opportunity_applications opportunity_applications_reference_key; Type: CONSTRAINT; Schema: public; Owner: yvesmpunga
--

ALTER TABLE ONLY public.opportunity_applications
    ADD CONSTRAINT opportunity_applications_reference_key UNIQUE (reference);


--
-- Name: opportunity_documents opportunity_documents_pkey; Type: CONSTRAINT; Schema: public; Owner: yvesmpunga
--

ALTER TABLE ONLY public.opportunity_documents
    ADD CONSTRAINT opportunity_documents_pkey PRIMARY KEY (id);


--
-- Name: overtimes overtimes_pkey; Type: CONSTRAINT; Schema: public; Owner: yvesmpunga
--

ALTER TABLE ONLY public.overtimes
    ADD CONSTRAINT overtimes_pkey PRIMARY KEY (id);


--
-- Name: permissions permissions_code_key; Type: CONSTRAINT; Schema: public; Owner: yvesmpunga
--

ALTER TABLE ONLY public.permissions
    ADD CONSTRAINT permissions_code_key UNIQUE (code);


--
-- Name: permissions permissions_pkey; Type: CONSTRAINT; Schema: public; Owner: yvesmpunga
--

ALTER TABLE ONLY public.permissions
    ADD CONSTRAINT permissions_pkey PRIMARY KEY (id);


--
-- Name: pieces_requises pieces_requises_pkey; Type: CONSTRAINT; Schema: public; Owner: yvesmpunga
--

ALTER TABLE ONLY public.pieces_requises
    ADD CONSTRAINT pieces_requises_pkey PRIMARY KEY (id);


--
-- Name: procurement_bid_documents procurement_bid_documents_pkey; Type: CONSTRAINT; Schema: public; Owner: yvesmpunga
--

ALTER TABLE ONLY public.procurement_bid_documents
    ADD CONSTRAINT procurement_bid_documents_pkey PRIMARY KEY (id);


--
-- Name: procurement_bidder_documents procurement_bidder_documents_pkey; Type: CONSTRAINT; Schema: public; Owner: yvesmpunga
--

ALTER TABLE ONLY public.procurement_bidder_documents
    ADD CONSTRAINT procurement_bidder_documents_pkey PRIMARY KEY (id);


--
-- Name: procurement_bidders procurement_bidders_code_key; Type: CONSTRAINT; Schema: public; Owner: yvesmpunga
--

ALTER TABLE ONLY public.procurement_bidders
    ADD CONSTRAINT procurement_bidders_code_key UNIQUE (code);


--
-- Name: procurement_bidders procurement_bidders_pkey; Type: CONSTRAINT; Schema: public; Owner: yvesmpunga
--

ALTER TABLE ONLY public.procurement_bidders
    ADD CONSTRAINT procurement_bidders_pkey PRIMARY KEY (id);


--
-- Name: procurement_bids procurement_bids_pkey; Type: CONSTRAINT; Schema: public; Owner: yvesmpunga
--

ALTER TABLE ONLY public.procurement_bids
    ADD CONSTRAINT procurement_bids_pkey PRIMARY KEY (id);


--
-- Name: procurement_bids procurement_bids_reference_key; Type: CONSTRAINT; Schema: public; Owner: yvesmpunga
--

ALTER TABLE ONLY public.procurement_bids
    ADD CONSTRAINT procurement_bids_reference_key UNIQUE (reference);


--
-- Name: procurement_contract_documents procurement_contract_documents_pkey; Type: CONSTRAINT; Schema: public; Owner: yvesmpunga
--

ALTER TABLE ONLY public.procurement_contract_documents
    ADD CONSTRAINT procurement_contract_documents_pkey PRIMARY KEY (id);


--
-- Name: procurement_contract_executions procurement_contract_executions_pkey; Type: CONSTRAINT; Schema: public; Owner: yvesmpunga
--

ALTER TABLE ONLY public.procurement_contract_executions
    ADD CONSTRAINT procurement_contract_executions_pkey PRIMARY KEY (id);


--
-- Name: procurement_contracts procurement_contracts_certificate_number_key; Type: CONSTRAINT; Schema: public; Owner: yvesmpunga
--

ALTER TABLE ONLY public.procurement_contracts
    ADD CONSTRAINT procurement_contracts_certificate_number_key UNIQUE (certificate_number);


--
-- Name: procurement_contracts procurement_contracts_contract_number_key; Type: CONSTRAINT; Schema: public; Owner: yvesmpunga
--

ALTER TABLE ONLY public.procurement_contracts
    ADD CONSTRAINT procurement_contracts_contract_number_key UNIQUE (contract_number);


--
-- Name: procurement_contracts procurement_contracts_pkey; Type: CONSTRAINT; Schema: public; Owner: yvesmpunga
--

ALTER TABLE ONLY public.procurement_contracts
    ADD CONSTRAINT procurement_contracts_pkey PRIMARY KEY (id);


--
-- Name: procurement_document_types procurement_document_types_code_key; Type: CONSTRAINT; Schema: public; Owner: yvesmpunga
--

ALTER TABLE ONLY public.procurement_document_types
    ADD CONSTRAINT procurement_document_types_code_key UNIQUE (code);


--
-- Name: procurement_document_types procurement_document_types_code_key1; Type: CONSTRAINT; Schema: public; Owner: yvesmpunga
--

ALTER TABLE ONLY public.procurement_document_types
    ADD CONSTRAINT procurement_document_types_code_key1 UNIQUE (code);


--
-- Name: procurement_document_types procurement_document_types_pkey; Type: CONSTRAINT; Schema: public; Owner: yvesmpunga
--

ALTER TABLE ONLY public.procurement_document_types
    ADD CONSTRAINT procurement_document_types_pkey PRIMARY KEY (id);


--
-- Name: procurement_evaluation_committees procurement_evaluation_committees_pkey; Type: CONSTRAINT; Schema: public; Owner: yvesmpunga
--

ALTER TABLE ONLY public.procurement_evaluation_committees
    ADD CONSTRAINT procurement_evaluation_committees_pkey PRIMARY KEY (id);


--
-- Name: procurement_tender_documents procurement_tender_documents_pkey; Type: CONSTRAINT; Schema: public; Owner: yvesmpunga
--

ALTER TABLE ONLY public.procurement_tender_documents
    ADD CONSTRAINT procurement_tender_documents_pkey PRIMARY KEY (id);


--
-- Name: procurement_tender_history procurement_tender_history_pkey; Type: CONSTRAINT; Schema: public; Owner: yvesmpunga
--

ALTER TABLE ONLY public.procurement_tender_history
    ADD CONSTRAINT procurement_tender_history_pkey PRIMARY KEY (id);


--
-- Name: procurement_tender_lots procurement_tender_lots_pkey; Type: CONSTRAINT; Schema: public; Owner: yvesmpunga
--

ALTER TABLE ONLY public.procurement_tender_lots
    ADD CONSTRAINT procurement_tender_lots_pkey PRIMARY KEY (id);


--
-- Name: procurement_tenders procurement_tenders_pkey; Type: CONSTRAINT; Schema: public; Owner: yvesmpunga
--

ALTER TABLE ONLY public.procurement_tenders
    ADD CONSTRAINT procurement_tenders_pkey PRIMARY KEY (id);


--
-- Name: procurement_tenders procurement_tenders_reference_key; Type: CONSTRAINT; Schema: public; Owner: yvesmpunga
--

ALTER TABLE ONLY public.procurement_tenders
    ADD CONSTRAINT procurement_tenders_reference_key UNIQUE (reference);


--
-- Name: project_documents project_documents_pkey; Type: CONSTRAINT; Schema: public; Owner: yvesmpunga
--

ALTER TABLE ONLY public.project_documents
    ADD CONSTRAINT project_documents_pkey PRIMARY KEY (id);


--
-- Name: project_history project_history_pkey; Type: CONSTRAINT; Schema: public; Owner: yvesmpunga
--

ALTER TABLE ONLY public.project_history
    ADD CONSTRAINT project_history_pkey PRIMARY KEY (id);


--
-- Name: project_impacts project_impacts_pkey; Type: CONSTRAINT; Schema: public; Owner: yvesmpunga
--

ALTER TABLE ONLY public.project_impacts
    ADD CONSTRAINT project_impacts_pkey PRIMARY KEY (id);


--
-- Name: project_milestones project_milestones_pkey; Type: CONSTRAINT; Schema: public; Owner: yvesmpunga
--

ALTER TABLE ONLY public.project_milestones
    ADD CONSTRAINT project_milestones_pkey PRIMARY KEY (id);


--
-- Name: project_risks project_risks_pkey; Type: CONSTRAINT; Schema: public; Owner: yvesmpunga
--

ALTER TABLE ONLY public.project_risks
    ADD CONSTRAINT project_risks_pkey PRIMARY KEY (id);


--
-- Name: province_opportunities province_opportunities_pkey; Type: CONSTRAINT; Schema: public; Owner: yvesmpunga
--

ALTER TABLE ONLY public.province_opportunities
    ADD CONSTRAINT province_opportunities_pkey PRIMARY KEY (id);


--
-- Name: province_opportunities province_opportunities_reference_key; Type: CONSTRAINT; Schema: public; Owner: yvesmpunga
--

ALTER TABLE ONLY public.province_opportunities
    ADD CONSTRAINT province_opportunities_reference_key UNIQUE (reference);


--
-- Name: provinces provinces_code_key; Type: CONSTRAINT; Schema: public; Owner: yvesmpunga
--

ALTER TABLE ONLY public.provinces
    ADD CONSTRAINT provinces_code_key UNIQUE (code);


--
-- Name: provinces provinces_code_key1; Type: CONSTRAINT; Schema: public; Owner: yvesmpunga
--

ALTER TABLE ONLY public.provinces
    ADD CONSTRAINT provinces_code_key1 UNIQUE (code);


--
-- Name: provinces provinces_code_key2; Type: CONSTRAINT; Schema: public; Owner: yvesmpunga
--

ALTER TABLE ONLY public.provinces
    ADD CONSTRAINT provinces_code_key2 UNIQUE (code);


--
-- Name: provinces provinces_code_key3; Type: CONSTRAINT; Schema: public; Owner: yvesmpunga
--

ALTER TABLE ONLY public.provinces
    ADD CONSTRAINT provinces_code_key3 UNIQUE (code);


--
-- Name: provinces provinces_pkey; Type: CONSTRAINT; Schema: public; Owner: yvesmpunga
--

ALTER TABLE ONLY public.provinces
    ADD CONSTRAINT provinces_pkey PRIMARY KEY (id);


--
-- Name: public_holidays public_holidays_pkey; Type: CONSTRAINT; Schema: public; Owner: yvesmpunga
--

ALTER TABLE ONLY public.public_holidays
    ADD CONSTRAINT public_holidays_pkey PRIMARY KEY (id);


--
-- Name: required_documents required_documents_pkey; Type: CONSTRAINT; Schema: public; Owner: yvesmpunga
--

ALTER TABLE ONLY public.required_documents
    ADD CONSTRAINT required_documents_pkey PRIMARY KEY (id);


--
-- Name: role_permissions role_permissions_pkey; Type: CONSTRAINT; Schema: public; Owner: yvesmpunga
--

ALTER TABLE ONLY public.role_permissions
    ADD CONSTRAINT role_permissions_pkey PRIMARY KEY (permission_id, role_id);


--
-- Name: roles roles_code_key; Type: CONSTRAINT; Schema: public; Owner: yvesmpunga
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_code_key UNIQUE (code);


--
-- Name: roles roles_pkey; Type: CONSTRAINT; Schema: public; Owner: yvesmpunga
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_pkey PRIMARY KEY (id);


--
-- Name: sectors sectors_code_key; Type: CONSTRAINT; Schema: public; Owner: yvesmpunga
--

ALTER TABLE ONLY public.sectors
    ADD CONSTRAINT sectors_code_key UNIQUE (code);


--
-- Name: sectors sectors_code_key1; Type: CONSTRAINT; Schema: public; Owner: yvesmpunga
--

ALTER TABLE ONLY public.sectors
    ADD CONSTRAINT sectors_code_key1 UNIQUE (code);


--
-- Name: sectors sectors_code_key2; Type: CONSTRAINT; Schema: public; Owner: yvesmpunga
--

ALTER TABLE ONLY public.sectors
    ADD CONSTRAINT sectors_code_key2 UNIQUE (code);


--
-- Name: sectors sectors_code_key3; Type: CONSTRAINT; Schema: public; Owner: yvesmpunga
--

ALTER TABLE ONLY public.sectors
    ADD CONSTRAINT sectors_code_key3 UNIQUE (code);


--
-- Name: sectors sectors_code_key4; Type: CONSTRAINT; Schema: public; Owner: yvesmpunga
--

ALTER TABLE ONLY public.sectors
    ADD CONSTRAINT sectors_code_key4 UNIQUE (code);


--
-- Name: sectors sectors_code_key5; Type: CONSTRAINT; Schema: public; Owner: yvesmpunga
--

ALTER TABLE ONLY public.sectors
    ADD CONSTRAINT sectors_code_key5 UNIQUE (code);


--
-- Name: sectors sectors_pkey; Type: CONSTRAINT; Schema: public; Owner: yvesmpunga
--

ALTER TABLE ONLY public.sectors
    ADD CONSTRAINT sectors_pkey PRIMARY KEY (id);


--
-- Name: stakeholder_dialogues stakeholder_dialogues_pkey; Type: CONSTRAINT; Schema: public; Owner: yvesmpunga
--

ALTER TABLE ONLY public.stakeholder_dialogues
    ADD CONSTRAINT stakeholder_dialogues_pkey PRIMARY KEY (id);


--
-- Name: stakeholder_dialogues stakeholder_dialogues_reference_key; Type: CONSTRAINT; Schema: public; Owner: yvesmpunga
--

ALTER TABLE ONLY public.stakeholder_dialogues
    ADD CONSTRAINT stakeholder_dialogues_reference_key UNIQUE (reference);


--
-- Name: stakeholder_dialogues stakeholder_dialogues_reference_key1; Type: CONSTRAINT; Schema: public; Owner: yvesmpunga
--

ALTER TABLE ONLY public.stakeholder_dialogues
    ADD CONSTRAINT stakeholder_dialogues_reference_key1 UNIQUE (reference);


--
-- Name: system_configs system_configs_key_key; Type: CONSTRAINT; Schema: public; Owner: yvesmpunga
--

ALTER TABLE ONLY public.system_configs
    ADD CONSTRAINT system_configs_key_key UNIQUE (key);


--
-- Name: system_configs system_configs_pkey; Type: CONSTRAINT; Schema: public; Owner: yvesmpunga
--

ALTER TABLE ONLY public.system_configs
    ADD CONSTRAINT system_configs_pkey PRIMARY KEY (id);


--
-- Name: territories territories_code_key; Type: CONSTRAINT; Schema: public; Owner: yvesmpunga
--

ALTER TABLE ONLY public.territories
    ADD CONSTRAINT territories_code_key UNIQUE (code);


--
-- Name: territories territories_pkey; Type: CONSTRAINT; Schema: public; Owner: yvesmpunga
--

ALTER TABLE ONLY public.territories
    ADD CONSTRAINT territories_pkey PRIMARY KEY (id);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: yvesmpunga
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: yvesmpunga
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: work_schedules work_schedules_pkey; Type: CONSTRAINT; Schema: public; Owner: yvesmpunga
--

ALTER TABLE ONLY public.work_schedules
    ADD CONSTRAINT work_schedules_pkey PRIMARY KEY (id);


--
-- Name: workflow_steps workflow_steps_pkey; Type: CONSTRAINT; Schema: public; Owner: yvesmpunga
--

ALTER TABLE ONLY public.workflow_steps
    ADD CONSTRAINT workflow_steps_pkey PRIMARY KEY (id);


--
-- Name: Account_provider_providerAccountId_key; Type: INDEX; Schema: public; Owner: yvesmpunga
--

CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON public."Account" USING btree (provider, "providerAccountId");


--
-- Name: ApprovalRequest_requestNumber_key; Type: INDEX; Schema: public; Owner: yvesmpunga
--

CREATE UNIQUE INDEX "ApprovalRequest_requestNumber_key" ON public."ApprovalRequest" USING btree ("requestNumber");


--
-- Name: Attendance_employeeId_date_key; Type: INDEX; Schema: public; Owner: yvesmpunga
--

CREATE UNIQUE INDEX "Attendance_employeeId_date_key" ON public."Attendance" USING btree ("employeeId", date);


--
-- Name: CategoryDeduction_categoryId_code_key; Type: INDEX; Schema: public; Owner: yvesmpunga
--

CREATE UNIQUE INDEX "CategoryDeduction_categoryId_code_key" ON public."CategoryDeduction" USING btree ("categoryId", code);


--
-- Name: CategoryPrime_categoryId_code_key; Type: INDEX; Schema: public; Owner: yvesmpunga
--

CREATE UNIQUE INDEX "CategoryPrime_categoryId_code_key" ON public."CategoryPrime" USING btree ("categoryId", code);


--
-- Name: Contract_contractNumber_key; Type: INDEX; Schema: public; Owner: yvesmpunga
--

CREATE UNIQUE INDEX "Contract_contractNumber_key" ON public."Contract" USING btree ("contractNumber");


--
-- Name: Currency_code_key; Type: INDEX; Schema: public; Owner: yvesmpunga
--

CREATE UNIQUE INDEX "Currency_code_key" ON public."Currency" USING btree (code);


--
-- Name: EmployeeSpouse_employeeId_key; Type: INDEX; Schema: public; Owner: yvesmpunga
--

CREATE UNIQUE INDEX "EmployeeSpouse_employeeId_key" ON public."EmployeeSpouse" USING btree ("employeeId");


--
-- Name: EmployeeTraining_employeeId_trainingId_key; Type: INDEX; Schema: public; Owner: yvesmpunga
--

CREATE UNIQUE INDEX "EmployeeTraining_employeeId_trainingId_key" ON public."EmployeeTraining" USING btree ("employeeId", "trainingId");


--
-- Name: Employee_email_key; Type: INDEX; Schema: public; Owner: yvesmpunga
--

CREATE UNIQUE INDEX "Employee_email_key" ON public."Employee" USING btree (email);


--
-- Name: Employee_matricule_key; Type: INDEX; Schema: public; Owner: yvesmpunga
--

CREATE UNIQUE INDEX "Employee_matricule_key" ON public."Employee" USING btree (matricule);


--
-- Name: Employee_userId_key; Type: INDEX; Schema: public; Owner: yvesmpunga
--

CREATE UNIQUE INDEX "Employee_userId_key" ON public."Employee" USING btree ("userId");


--
-- Name: Evaluation_evaluationNumber_key; Type: INDEX; Schema: public; Owner: yvesmpunga
--

CREATE UNIQUE INDEX "Evaluation_evaluationNumber_key" ON public."Evaluation" USING btree ("evaluationNumber");


--
-- Name: HRDepartment_code_key; Type: INDEX; Schema: public; Owner: yvesmpunga
--

CREATE UNIQUE INDEX "HRDepartment_code_key" ON public."HRDepartment" USING btree (code);


--
-- Name: Holiday_date_year_key; Type: INDEX; Schema: public; Owner: yvesmpunga
--

CREATE UNIQUE INDEX "Holiday_date_year_key" ON public."Holiday" USING btree (date, year);


--
-- Name: Investment_projectCode_key; Type: INDEX; Schema: public; Owner: yvesmpunga
--

CREATE UNIQUE INDEX "Investment_projectCode_key" ON public."Investment" USING btree ("projectCode");


--
-- Name: Investor_investorCode_key; Type: INDEX; Schema: public; Owner: yvesmpunga
--

CREATE UNIQUE INDEX "Investor_investorCode_key" ON public."Investor" USING btree ("investorCode");


--
-- Name: LeaveBalance_employeeId_leaveTypeId_year_key; Type: INDEX; Schema: public; Owner: yvesmpunga
--

CREATE UNIQUE INDEX "LeaveBalance_employeeId_leaveTypeId_year_key" ON public."LeaveBalance" USING btree ("employeeId", "leaveTypeId", year);


--
-- Name: LeaveType_code_key; Type: INDEX; Schema: public; Owner: yvesmpunga
--

CREATE UNIQUE INDEX "LeaveType_code_key" ON public."LeaveType" USING btree (code);


--
-- Name: Leave_leaveNumber_key; Type: INDEX; Schema: public; Owner: yvesmpunga
--

CREATE UNIQUE INDEX "Leave_leaveNumber_key" ON public."Leave" USING btree ("leaveNumber");


--
-- Name: LegalDocument_documentNumber_key; Type: INDEX; Schema: public; Owner: yvesmpunga
--

CREATE UNIQUE INDEX "LegalDocument_documentNumber_key" ON public."LegalDocument" USING btree ("documentNumber");


--
-- Name: Ministry_code_key; Type: INDEX; Schema: public; Owner: yvesmpunga
--

CREATE UNIQUE INDEX "Ministry_code_key" ON public."Ministry" USING btree (code);


--
-- Name: PayrollConfig_code_key; Type: INDEX; Schema: public; Owner: yvesmpunga
--

CREATE UNIQUE INDEX "PayrollConfig_code_key" ON public."PayrollConfig" USING btree (code);


--
-- Name: Payslip_employeeId_month_year_key; Type: INDEX; Schema: public; Owner: yvesmpunga
--

CREATE UNIQUE INDEX "Payslip_employeeId_month_year_key" ON public."Payslip" USING btree ("employeeId", month, year);


--
-- Name: Payslip_payslipNumber_key; Type: INDEX; Schema: public; Owner: yvesmpunga
--

CREATE UNIQUE INDEX "Payslip_payslipNumber_key" ON public."Payslip" USING btree ("payslipNumber");


--
-- Name: Position_code_key; Type: INDEX; Schema: public; Owner: yvesmpunga
--

CREATE UNIQUE INDEX "Position_code_key" ON public."Position" USING btree (code);


--
-- Name: Province_code_key; Type: INDEX; Schema: public; Owner: yvesmpunga
--

CREATE UNIQUE INDEX "Province_code_key" ON public."Province" USING btree (code);


--
-- Name: SalaryAdvance_advanceNumber_key; Type: INDEX; Schema: public; Owner: yvesmpunga
--

CREATE UNIQUE INDEX "SalaryAdvance_advanceNumber_key" ON public."SalaryAdvance" USING btree ("advanceNumber");


--
-- Name: SalaryGrade_code_key; Type: INDEX; Schema: public; Owner: yvesmpunga
--

CREATE UNIQUE INDEX "SalaryGrade_code_key" ON public."SalaryGrade" USING btree (code);


--
-- Name: Sector_code_key; Type: INDEX; Schema: public; Owner: yvesmpunga
--

CREATE UNIQUE INDEX "Sector_code_key" ON public."Sector" USING btree (code);


--
-- Name: Session_sessionToken_key; Type: INDEX; Schema: public; Owner: yvesmpunga
--

CREATE UNIQUE INDEX "Session_sessionToken_key" ON public."Session" USING btree ("sessionToken");


--
-- Name: Training_code_key; Type: INDEX; Schema: public; Owner: yvesmpunga
--

CREATE UNIQUE INDEX "Training_code_key" ON public."Training" USING btree (code);


--
-- Name: User_email_key; Type: INDEX; Schema: public; Owner: yvesmpunga
--

CREATE UNIQUE INDEX "User_email_key" ON public."User" USING btree (email);


--
-- Name: VerificationToken_identifier_token_key; Type: INDEX; Schema: public; Owner: yvesmpunga
--

CREATE UNIQUE INDEX "VerificationToken_identifier_token_key" ON public."VerificationToken" USING btree (identifier, token);


--
-- Name: VerificationToken_token_key; Type: INDEX; Schema: public; Owner: yvesmpunga
--

CREATE UNIQUE INDEX "VerificationToken_token_key" ON public."VerificationToken" USING btree (token);


--
-- Name: WorkerCategory_code_key; Type: INDEX; Schema: public; Owner: yvesmpunga
--

CREATE UNIQUE INDEX "WorkerCategory_code_key" ON public."WorkerCategory" USING btree (code);


--
-- Name: actes_administratifs_category; Type: INDEX; Schema: public; Owner: yvesmpunga
--

CREATE INDEX actes_administratifs_category ON public.actes_administratifs USING btree (category);


--
-- Name: actes_administratifs_code; Type: INDEX; Schema: public; Owner: yvesmpunga
--

CREATE UNIQUE INDEX actes_administratifs_code ON public.actes_administratifs USING btree (code);


--
-- Name: actes_administratifs_is_active; Type: INDEX; Schema: public; Owner: yvesmpunga
--

CREATE INDEX actes_administratifs_is_active ON public.actes_administratifs USING btree ("isActive");


--
-- Name: actes_administratifs_ministry_id; Type: INDEX; Schema: public; Owner: yvesmpunga
--

CREATE INDEX actes_administratifs_ministry_id ON public.actes_administratifs USING btree ("ministryId");


--
-- Name: actes_administratifs_sector_id; Type: INDEX; Schema: public; Owner: yvesmpunga
--

CREATE INDEX actes_administratifs_sector_id ON public.actes_administratifs USING btree ("sectorId");


--
-- Name: application_documents_application_id; Type: INDEX; Schema: public; Owner: yvesmpunga
--

CREATE INDEX application_documents_application_id ON public.application_documents USING btree ("applicationId");


--
-- Name: application_documents_required_document_id; Type: INDEX; Schema: public; Owner: yvesmpunga
--

CREATE INDEX application_documents_required_document_id ON public.application_documents USING btree ("requiredDocumentId");


--
-- Name: application_documents_status; Type: INDEX; Schema: public; Owner: yvesmpunga
--

CREATE INDEX application_documents_status ON public.application_documents USING btree (status);


--
-- Name: barrier_resolutions_action_date; Type: INDEX; Schema: public; Owner: yvesmpunga
--

CREATE INDEX barrier_resolutions_action_date ON public.barrier_resolutions USING btree ("actionDate");


--
-- Name: barrier_resolutions_action_type; Type: INDEX; Schema: public; Owner: yvesmpunga
--

CREATE INDEX barrier_resolutions_action_type ON public.barrier_resolutions USING btree ("actionType");


--
-- Name: barrier_resolutions_barrier_id; Type: INDEX; Schema: public; Owner: yvesmpunga
--

CREATE INDEX barrier_resolutions_barrier_id ON public.barrier_resolutions USING btree ("barrierId");


--
-- Name: barrier_resolutions_follow_up_date; Type: INDEX; Schema: public; Owner: yvesmpunga
--

CREATE INDEX barrier_resolutions_follow_up_date ON public.barrier_resolutions USING btree ("followUpDate");


--
-- Name: business_barriers_category; Type: INDEX; Schema: public; Owner: yvesmpunga
--

CREATE INDEX business_barriers_category ON public.business_barriers USING btree (category);


--
-- Name: business_barriers_investor_id; Type: INDEX; Schema: public; Owner: yvesmpunga
--

CREATE INDEX business_barriers_investor_id ON public.business_barriers USING btree ("investorId");


--
-- Name: business_barriers_project_id; Type: INDEX; Schema: public; Owner: yvesmpunga
--

CREATE INDEX business_barriers_project_id ON public.business_barriers USING btree ("projectId");


--
-- Name: business_barriers_reference; Type: INDEX; Schema: public; Owner: yvesmpunga
--

CREATE INDEX business_barriers_reference ON public.business_barriers USING btree (reference);


--
-- Name: business_barriers_reported_at; Type: INDEX; Schema: public; Owner: yvesmpunga
--

CREATE INDEX business_barriers_reported_at ON public.business_barriers USING btree ("reportedAt");


--
-- Name: business_barriers_severity; Type: INDEX; Schema: public; Owner: yvesmpunga
--

CREATE INDEX business_barriers_severity ON public.business_barriers USING btree (severity);


--
-- Name: business_barriers_status; Type: INDEX; Schema: public; Owner: yvesmpunga
--

CREATE INDEX business_barriers_status ON public.business_barriers USING btree (status);


--
-- Name: climate_indicator_values_indicator_id; Type: INDEX; Schema: public; Owner: yvesmpunga
--

CREATE INDEX climate_indicator_values_indicator_id ON public.climate_indicator_values USING btree ("indicatorId");


--
-- Name: climate_indicator_values_indicator_id_year; Type: INDEX; Schema: public; Owner: yvesmpunga
--

CREATE INDEX climate_indicator_values_indicator_id_year ON public.climate_indicator_values USING btree ("indicatorId", year);


--
-- Name: climate_indicator_values_indicator_id_year_quarter; Type: INDEX; Schema: public; Owner: yvesmpunga
--

CREATE INDEX climate_indicator_values_indicator_id_year_quarter ON public.climate_indicator_values USING btree ("indicatorId", year, quarter);


--
-- Name: climate_indicator_values_year; Type: INDEX; Schema: public; Owner: yvesmpunga
--

CREATE INDEX climate_indicator_values_year ON public.climate_indicator_values USING btree (year);


--
-- Name: climate_indicators_category; Type: INDEX; Schema: public; Owner: yvesmpunga
--

CREATE INDEX climate_indicators_category ON public.climate_indicators USING btree (category);


--
-- Name: climate_indicators_code; Type: INDEX; Schema: public; Owner: yvesmpunga
--

CREATE INDEX climate_indicators_code ON public.climate_indicators USING btree (code);


--
-- Name: climate_indicators_is_active; Type: INDEX; Schema: public; Owner: yvesmpunga
--

CREATE INDEX climate_indicators_is_active ON public.climate_indicators USING btree ("isActive");


--
-- Name: dialogue_participants_dialogue_id; Type: INDEX; Schema: public; Owner: yvesmpunga
--

CREATE INDEX dialogue_participants_dialogue_id ON public.dialogue_participants USING btree ("dialogueId");


--
-- Name: dialogue_participants_investor_id; Type: INDEX; Schema: public; Owner: yvesmpunga
--

CREATE INDEX dialogue_participants_investor_id ON public.dialogue_participants USING btree ("investorId");


--
-- Name: dialogue_participants_invitation_status; Type: INDEX; Schema: public; Owner: yvesmpunga
--

CREATE INDEX dialogue_participants_invitation_status ON public.dialogue_participants USING btree ("invitationStatus");


--
-- Name: dialogue_participants_participant_type; Type: INDEX; Schema: public; Owner: yvesmpunga
--

CREATE INDEX dialogue_participants_participant_type ON public.dialogue_participants USING btree ("participantType");


--
-- Name: dossier_sectors_dossier_id; Type: INDEX; Schema: public; Owner: yvesmpunga
--

CREATE INDEX dossier_sectors_dossier_id ON public.dossier_sectors USING btree ("dossierId");


--
-- Name: dossier_sectors_is_primary; Type: INDEX; Schema: public; Owner: yvesmpunga
--

CREATE INDEX dossier_sectors_is_primary ON public.dossier_sectors USING btree ("isPrimary");


--
-- Name: dossier_sectors_sector_id; Type: INDEX; Schema: public; Owner: yvesmpunga
--

CREATE INDEX dossier_sectors_sector_id ON public.dossier_sectors USING btree ("sectorId");


--
-- Name: international_treaties_entry_into_force_date; Type: INDEX; Schema: public; Owner: yvesmpunga
--

CREATE INDEX international_treaties_entry_into_force_date ON public.international_treaties USING btree ("entryIntoForceDate");


--
-- Name: international_treaties_expiry_date; Type: INDEX; Schema: public; Owner: yvesmpunga
--

CREATE INDEX international_treaties_expiry_date ON public.international_treaties USING btree ("expiryDate");


--
-- Name: international_treaties_reference; Type: INDEX; Schema: public; Owner: yvesmpunga
--

CREATE INDEX international_treaties_reference ON public.international_treaties USING btree (reference);


--
-- Name: international_treaties_signed_date; Type: INDEX; Schema: public; Owner: yvesmpunga
--

CREATE INDEX international_treaties_signed_date ON public.international_treaties USING btree ("signedDate");


--
-- Name: international_treaties_status; Type: INDEX; Schema: public; Owner: yvesmpunga
--

CREATE INDEX international_treaties_status ON public.international_treaties USING btree (status);


--
-- Name: international_treaties_treaty_type; Type: INDEX; Schema: public; Owner: yvesmpunga
--

CREATE INDEX international_treaties_treaty_type ON public.international_treaties USING btree ("treatyType");


--
-- Name: legal_proposals_domain; Type: INDEX; Schema: public; Owner: yvesmpunga
--

CREATE INDEX legal_proposals_domain ON public.legal_proposals USING btree (domain);


--
-- Name: legal_proposals_priority; Type: INDEX; Schema: public; Owner: yvesmpunga
--

CREATE INDEX legal_proposals_priority ON public.legal_proposals USING btree (priority);


--
-- Name: legal_proposals_proposal_type; Type: INDEX; Schema: public; Owner: yvesmpunga
--

CREATE INDEX legal_proposals_proposal_type ON public.legal_proposals USING btree ("proposalType");


--
-- Name: legal_proposals_reference; Type: INDEX; Schema: public; Owner: yvesmpunga
--

CREATE INDEX legal_proposals_reference ON public.legal_proposals USING btree (reference);


--
-- Name: legal_proposals_status; Type: INDEX; Schema: public; Owner: yvesmpunga
--

CREATE INDEX legal_proposals_status ON public.legal_proposals USING btree (status);


--
-- Name: legal_proposals_submitted_at; Type: INDEX; Schema: public; Owner: yvesmpunga
--

CREATE INDEX legal_proposals_submitted_at ON public.legal_proposals USING btree ("submittedAt");


--
-- Name: mediation_cases_dispute_type; Type: INDEX; Schema: public; Owner: yvesmpunga
--

CREATE INDEX mediation_cases_dispute_type ON public.mediation_cases USING btree ("disputeType");


--
-- Name: mediation_cases_investor_id; Type: INDEX; Schema: public; Owner: yvesmpunga
--

CREATE INDEX mediation_cases_investor_id ON public.mediation_cases USING btree ("investorId");


--
-- Name: mediation_cases_priority; Type: INDEX; Schema: public; Owner: yvesmpunga
--

CREATE INDEX mediation_cases_priority ON public.mediation_cases USING btree (priority);


--
-- Name: mediation_cases_reference; Type: INDEX; Schema: public; Owner: yvesmpunga
--

CREATE INDEX mediation_cases_reference ON public.mediation_cases USING btree (reference);


--
-- Name: mediation_cases_status; Type: INDEX; Schema: public; Owner: yvesmpunga
--

CREATE INDEX mediation_cases_status ON public.mediation_cases USING btree (status);


--
-- Name: mediation_cases_submitted_at; Type: INDEX; Schema: public; Owner: yvesmpunga
--

CREATE INDEX mediation_cases_submitted_at ON public.mediation_cases USING btree ("submittedAt");


--
-- Name: ministries_code; Type: INDEX; Schema: public; Owner: yvesmpunga
--

CREATE UNIQUE INDEX ministries_code ON public.ministries USING btree (code);


--
-- Name: ministries_is_active; Type: INDEX; Schema: public; Owner: yvesmpunga
--

CREATE INDEX ministries_is_active ON public.ministries USING btree ("isActive");


--
-- Name: ministry_departments_code_ministry_id; Type: INDEX; Schema: public; Owner: yvesmpunga
--

CREATE UNIQUE INDEX ministry_departments_code_ministry_id ON public.ministry_departments USING btree (code, ministry_id);


--
-- Name: ministry_departments_is_active; Type: INDEX; Schema: public; Owner: yvesmpunga
--

CREATE INDEX ministry_departments_is_active ON public.ministry_departments USING btree (is_active);


--
-- Name: ministry_departments_ministry_id; Type: INDEX; Schema: public; Owner: yvesmpunga
--

CREATE INDEX ministry_departments_ministry_id ON public.ministry_departments USING btree (ministry_id);


--
-- Name: ministry_request_documents_request_idx; Type: INDEX; Schema: public; Owner: yvesmpunga
--

CREATE INDEX ministry_request_documents_request_idx ON public.ministry_request_documents USING btree ("requestId");


--
-- Name: ministry_request_documents_status_idx; Type: INDEX; Schema: public; Owner: yvesmpunga
--

CREATE INDEX ministry_request_documents_status_idx ON public.ministry_request_documents USING btree (status);


--
-- Name: ministry_workflow_unique_step; Type: INDEX; Schema: public; Owner: yvesmpunga
--

CREATE UNIQUE INDEX ministry_workflow_unique_step ON public.ministry_workflows USING btree ("ministryId", "requestType", "stepNumber");


--
-- Name: opportunity_applications_investor_id; Type: INDEX; Schema: public; Owner: yvesmpunga
--

CREATE INDEX opportunity_applications_investor_id ON public.opportunity_applications USING btree ("investorId");


--
-- Name: opportunity_applications_opportunity_id; Type: INDEX; Schema: public; Owner: yvesmpunga
--

CREATE INDEX opportunity_applications_opportunity_id ON public.opportunity_applications USING btree ("opportunityId");


--
-- Name: opportunity_applications_reference; Type: INDEX; Schema: public; Owner: yvesmpunga
--

CREATE UNIQUE INDEX opportunity_applications_reference ON public.opportunity_applications USING btree (reference);


--
-- Name: opportunity_applications_status; Type: INDEX; Schema: public; Owner: yvesmpunga
--

CREATE INDEX opportunity_applications_status ON public.opportunity_applications USING btree (status);


--
-- Name: opportunity_applications_submitted_at; Type: INDEX; Schema: public; Owner: yvesmpunga
--

CREATE INDEX opportunity_applications_submitted_at ON public.opportunity_applications USING btree ("submittedAt");


--
-- Name: opportunity_documents_category; Type: INDEX; Schema: public; Owner: yvesmpunga
--

CREATE INDEX opportunity_documents_category ON public.opportunity_documents USING btree (category);


--
-- Name: opportunity_documents_is_required; Type: INDEX; Schema: public; Owner: yvesmpunga
--

CREATE INDEX opportunity_documents_is_required ON public.opportunity_documents USING btree ("isRequired");


--
-- Name: opportunity_documents_opportunity_id; Type: INDEX; Schema: public; Owner: yvesmpunga
--

CREATE INDEX opportunity_documents_opportunity_id ON public.opportunity_documents USING btree ("opportunityId");


--
-- Name: opportunity_documents_sort_order; Type: INDEX; Schema: public; Owner: yvesmpunga
--

CREATE INDEX opportunity_documents_sort_order ON public.opportunity_documents USING btree ("sortOrder");


--
-- Name: pieces_requises_acte_id; Type: INDEX; Schema: public; Owner: yvesmpunga
--

CREATE INDEX pieces_requises_acte_id ON public.pieces_requises USING btree ("acteId");


--
-- Name: pieces_requises_category; Type: INDEX; Schema: public; Owner: yvesmpunga
--

CREATE INDEX pieces_requises_category ON public.pieces_requises USING btree (category);


--
-- Name: pieces_requises_is_active; Type: INDEX; Schema: public; Owner: yvesmpunga
--

CREATE INDEX pieces_requises_is_active ON public.pieces_requises USING btree ("isActive");


--
-- Name: pieces_requises_is_required; Type: INDEX; Schema: public; Owner: yvesmpunga
--

CREATE INDEX pieces_requises_is_required ON public.pieces_requises USING btree ("isRequired");


--
-- Name: pieces_requises_order_index; Type: INDEX; Schema: public; Owner: yvesmpunga
--

CREATE INDEX pieces_requises_order_index ON public.pieces_requises USING btree ("orderIndex");


--
-- Name: province_opportunities_created_at; Type: INDEX; Schema: public; Owner: yvesmpunga
--

CREATE INDEX province_opportunities_created_at ON public.province_opportunities USING btree ("createdAt");


--
-- Name: province_opportunities_deadline; Type: INDEX; Schema: public; Owner: yvesmpunga
--

CREATE INDEX province_opportunities_deadline ON public.province_opportunities USING btree (deadline);


--
-- Name: province_opportunities_is_featured; Type: INDEX; Schema: public; Owner: yvesmpunga
--

CREATE INDEX province_opportunities_is_featured ON public.province_opportunities USING btree ("isFeatured");


--
-- Name: province_opportunities_province_id; Type: INDEX; Schema: public; Owner: yvesmpunga
--

CREATE INDEX province_opportunities_province_id ON public.province_opportunities USING btree ("provinceId");


--
-- Name: province_opportunities_reference; Type: INDEX; Schema: public; Owner: yvesmpunga
--

CREATE UNIQUE INDEX province_opportunities_reference ON public.province_opportunities USING btree (reference);


--
-- Name: province_opportunities_sector_id; Type: INDEX; Schema: public; Owner: yvesmpunga
--

CREATE INDEX province_opportunities_sector_id ON public.province_opportunities USING btree ("sectorId");


--
-- Name: province_opportunities_status; Type: INDEX; Schema: public; Owner: yvesmpunga
--

CREATE INDEX province_opportunities_status ON public.province_opportunities USING btree (status);


--
-- Name: required_documents_code_dossier_type; Type: INDEX; Schema: public; Owner: yvesmpunga
--

CREATE UNIQUE INDEX required_documents_code_dossier_type ON public.required_documents USING btree (code, "dossierType");


--
-- Name: required_documents_dossier_type; Type: INDEX; Schema: public; Owner: yvesmpunga
--

CREATE INDEX required_documents_dossier_type ON public.required_documents USING btree ("dossierType");


--
-- Name: required_documents_is_active; Type: INDEX; Schema: public; Owner: yvesmpunga
--

CREATE INDEX required_documents_is_active ON public.required_documents USING btree ("isActive");


--
-- Name: required_documents_order; Type: INDEX; Schema: public; Owner: yvesmpunga
--

CREATE INDEX required_documents_order ON public.required_documents USING btree ("order");


--
-- Name: sectors_code; Type: INDEX; Schema: public; Owner: yvesmpunga
--

CREATE UNIQUE INDEX sectors_code ON public.sectors USING btree (code);


--
-- Name: sectors_is_active; Type: INDEX; Schema: public; Owner: yvesmpunga
--

CREATE INDEX sectors_is_active ON public.sectors USING btree ("isActive");


--
-- Name: sectors_parent_id; Type: INDEX; Schema: public; Owner: yvesmpunga
--

CREATE INDEX sectors_parent_id ON public.sectors USING btree ("parentId");


--
-- Name: stakeholder_dialogues_event_type; Type: INDEX; Schema: public; Owner: yvesmpunga
--

CREATE INDEX stakeholder_dialogues_event_type ON public.stakeholder_dialogues USING btree ("eventType");


--
-- Name: stakeholder_dialogues_reference; Type: INDEX; Schema: public; Owner: yvesmpunga
--

CREATE INDEX stakeholder_dialogues_reference ON public.stakeholder_dialogues USING btree (reference);


--
-- Name: stakeholder_dialogues_scheduled_date; Type: INDEX; Schema: public; Owner: yvesmpunga
--

CREATE INDEX stakeholder_dialogues_scheduled_date ON public.stakeholder_dialogues USING btree ("scheduledDate");


--
-- Name: stakeholder_dialogues_sector; Type: INDEX; Schema: public; Owner: yvesmpunga
--

CREATE INDEX stakeholder_dialogues_sector ON public.stakeholder_dialogues USING btree (sector);


--
-- Name: stakeholder_dialogues_status; Type: INDEX; Schema: public; Owner: yvesmpunga
--

CREATE INDEX stakeholder_dialogues_status ON public.stakeholder_dialogues USING btree (status);


--
-- Name: unique_dossier_sector; Type: INDEX; Schema: public; Owner: yvesmpunga
--

CREATE UNIQUE INDEX unique_dossier_sector ON public.dossier_sectors USING btree ("dossierId", "sectorId");


--
-- Name: workflow_steps_workflow_type_is_active; Type: INDEX; Schema: public; Owner: yvesmpunga
--

CREATE INDEX workflow_steps_workflow_type_is_active ON public.workflow_steps USING btree ("workflowType", "isActive");


--
-- Name: workflow_steps_workflow_type_step_number; Type: INDEX; Schema: public; Owner: yvesmpunga
--

CREATE UNIQUE INDEX workflow_steps_workflow_type_step_number ON public.workflow_steps USING btree ("workflowType", "stepNumber");


--
-- Name: Account Account_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: yvesmpunga
--

ALTER TABLE ONLY public."Account"
    ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: ApprovalRequest ApprovalRequest_assignedToId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: yvesmpunga
--

ALTER TABLE ONLY public."ApprovalRequest"
    ADD CONSTRAINT "ApprovalRequest_assignedToId_fkey" FOREIGN KEY ("assignedToId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: ApprovalRequest ApprovalRequest_investmentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: yvesmpunga
--

ALTER TABLE ONLY public."ApprovalRequest"
    ADD CONSTRAINT "ApprovalRequest_investmentId_fkey" FOREIGN KEY ("investmentId") REFERENCES public."Investment"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Attendance Attendance_employeeId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: yvesmpunga
--

ALTER TABLE ONLY public."Attendance"
    ADD CONSTRAINT "Attendance_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES public."Employee"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: CategoryDeduction CategoryDeduction_categoryId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: yvesmpunga
--

ALTER TABLE ONLY public."CategoryDeduction"
    ADD CONSTRAINT "CategoryDeduction_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES public."WorkerCategory"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: CategoryPrime CategoryPrime_categoryId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: yvesmpunga
--

ALTER TABLE ONLY public."CategoryPrime"
    ADD CONSTRAINT "CategoryPrime_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES public."WorkerCategory"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: City City_provinceId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: yvesmpunga
--

ALTER TABLE ONLY public."City"
    ADD CONSTRAINT "City_provinceId_fkey" FOREIGN KEY ("provinceId") REFERENCES public."Province"(id);


--
-- Name: Commune Commune_cityId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: yvesmpunga
--

ALTER TABLE ONLY public."Commune"
    ADD CONSTRAINT "Commune_cityId_fkey" FOREIGN KEY ("cityId") REFERENCES public."City"(id);


--
-- Name: Contract Contract_employeeId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: yvesmpunga
--

ALTER TABLE ONLY public."Contract"
    ADD CONSTRAINT "Contract_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES public."Employee"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Document Document_approvalRequestId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: yvesmpunga
--

ALTER TABLE ONLY public."Document"
    ADD CONSTRAINT "Document_approvalRequestId_fkey" FOREIGN KEY ("approvalRequestId") REFERENCES public."ApprovalRequest"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Document Document_investmentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: yvesmpunga
--

ALTER TABLE ONLY public."Document"
    ADD CONSTRAINT "Document_investmentId_fkey" FOREIGN KEY ("investmentId") REFERENCES public."Investment"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Document Document_investorId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: yvesmpunga
--

ALTER TABLE ONLY public."Document"
    ADD CONSTRAINT "Document_investorId_fkey" FOREIGN KEY ("investorId") REFERENCES public."Investor"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Document Document_legalDocumentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: yvesmpunga
--

ALTER TABLE ONLY public."Document"
    ADD CONSTRAINT "Document_legalDocumentId_fkey" FOREIGN KEY ("legalDocumentId") REFERENCES public."LegalDocument"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: EmployeeBankAccount EmployeeBankAccount_currencyId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: yvesmpunga
--

ALTER TABLE ONLY public."EmployeeBankAccount"
    ADD CONSTRAINT "EmployeeBankAccount_currencyId_fkey" FOREIGN KEY ("currencyId") REFERENCES public."Currency"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: EmployeeBankAccount EmployeeBankAccount_employeeId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: yvesmpunga
--

ALTER TABLE ONLY public."EmployeeBankAccount"
    ADD CONSTRAINT "EmployeeBankAccount_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES public."Employee"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: EmployeeChild EmployeeChild_employeeId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: yvesmpunga
--

ALTER TABLE ONLY public."EmployeeChild"
    ADD CONSTRAINT "EmployeeChild_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES public."Employee"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: EmployeeDocument EmployeeDocument_employeeId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: yvesmpunga
--

ALTER TABLE ONLY public."EmployeeDocument"
    ADD CONSTRAINT "EmployeeDocument_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES public."Employee"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: EmployeeEmergencyContact EmployeeEmergencyContact_employeeId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: yvesmpunga
--

ALTER TABLE ONLY public."EmployeeEmergencyContact"
    ADD CONSTRAINT "EmployeeEmergencyContact_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES public."Employee"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: EmployeeSpouse EmployeeSpouse_employeeId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: yvesmpunga
--

ALTER TABLE ONLY public."EmployeeSpouse"
    ADD CONSTRAINT "EmployeeSpouse_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES public."Employee"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: EmployeeTraining EmployeeTraining_employeeId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: yvesmpunga
--

ALTER TABLE ONLY public."EmployeeTraining"
    ADD CONSTRAINT "EmployeeTraining_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES public."Employee"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: EmployeeTraining EmployeeTraining_trainingId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: yvesmpunga
--

ALTER TABLE ONLY public."EmployeeTraining"
    ADD CONSTRAINT "EmployeeTraining_trainingId_fkey" FOREIGN KEY ("trainingId") REFERENCES public."Training"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Employee Employee_departmentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: yvesmpunga
--

ALTER TABLE ONLY public."Employee"
    ADD CONSTRAINT "Employee_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES public."HRDepartment"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Employee Employee_managerId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: yvesmpunga
--

ALTER TABLE ONLY public."Employee"
    ADD CONSTRAINT "Employee_managerId_fkey" FOREIGN KEY ("managerId") REFERENCES public."Employee"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Employee Employee_positionId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: yvesmpunga
--

ALTER TABLE ONLY public."Employee"
    ADD CONSTRAINT "Employee_positionId_fkey" FOREIGN KEY ("positionId") REFERENCES public."Position"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Employee Employee_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: yvesmpunga
--

ALTER TABLE ONLY public."Employee"
    ADD CONSTRAINT "Employee_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Employee Employee_workerCategoryId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: yvesmpunga
--

ALTER TABLE ONLY public."Employee"
    ADD CONSTRAINT "Employee_workerCategoryId_fkey" FOREIGN KEY ("workerCategoryId") REFERENCES public."WorkerCategory"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Evaluation Evaluation_employeeId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: yvesmpunga
--

ALTER TABLE ONLY public."Evaluation"
    ADD CONSTRAINT "Evaluation_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES public."Employee"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Evaluation Evaluation_evaluatorId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: yvesmpunga
--

ALTER TABLE ONLY public."Evaluation"
    ADD CONSTRAINT "Evaluation_evaluatorId_fkey" FOREIGN KEY ("evaluatorId") REFERENCES public."Employee"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: HRDepartment HRDepartment_managerId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: yvesmpunga
--

ALTER TABLE ONLY public."HRDepartment"
    ADD CONSTRAINT "HRDepartment_managerId_fkey" FOREIGN KEY ("managerId") REFERENCES public."Employee"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: HRDepartment HRDepartment_parentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: yvesmpunga
--

ALTER TABLE ONLY public."HRDepartment"
    ADD CONSTRAINT "HRDepartment_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES public."HRDepartment"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Investment Investment_createdById_fkey; Type: FK CONSTRAINT; Schema: public; Owner: yvesmpunga
--

ALTER TABLE ONLY public."Investment"
    ADD CONSTRAINT "Investment_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Investment Investment_investorId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: yvesmpunga
--

ALTER TABLE ONLY public."Investment"
    ADD CONSTRAINT "Investment_investorId_fkey" FOREIGN KEY ("investorId") REFERENCES public."Investor"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Investor Investor_createdById_fkey; Type: FK CONSTRAINT; Schema: public; Owner: yvesmpunga
--

ALTER TABLE ONLY public."Investor"
    ADD CONSTRAINT "Investor_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: LeaveBalance LeaveBalance_employeeId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: yvesmpunga
--

ALTER TABLE ONLY public."LeaveBalance"
    ADD CONSTRAINT "LeaveBalance_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES public."Employee"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: LeaveBalance LeaveBalance_leaveTypeId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: yvesmpunga
--

ALTER TABLE ONLY public."LeaveBalance"
    ADD CONSTRAINT "LeaveBalance_leaveTypeId_fkey" FOREIGN KEY ("leaveTypeId") REFERENCES public."LeaveType"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Leave Leave_approvedById_fkey; Type: FK CONSTRAINT; Schema: public; Owner: yvesmpunga
--

ALTER TABLE ONLY public."Leave"
    ADD CONSTRAINT "Leave_approvedById_fkey" FOREIGN KEY ("approvedById") REFERENCES public."Employee"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Leave Leave_employeeId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: yvesmpunga
--

ALTER TABLE ONLY public."Leave"
    ADD CONSTRAINT "Leave_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES public."Employee"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Leave Leave_leaveTypeId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: yvesmpunga
--

ALTER TABLE ONLY public."Leave"
    ADD CONSTRAINT "Leave_leaveTypeId_fkey" FOREIGN KEY ("leaveTypeId") REFERENCES public."LeaveType"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: LegalDocument LegalDocument_investmentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: yvesmpunga
--

ALTER TABLE ONLY public."LegalDocument"
    ADD CONSTRAINT "LegalDocument_investmentId_fkey" FOREIGN KEY ("investmentId") REFERENCES public."Investment"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Payslip Payslip_employeeId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: yvesmpunga
--

ALTER TABLE ONLY public."Payslip"
    ADD CONSTRAINT "Payslip_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES public."Employee"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Position Position_departmentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: yvesmpunga
--

ALTER TABLE ONLY public."Position"
    ADD CONSTRAINT "Position_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES public."HRDepartment"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Position Position_supervisorId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: yvesmpunga
--

ALTER TABLE ONLY public."Position"
    ADD CONSTRAINT "Position_supervisorId_fkey" FOREIGN KEY ("supervisorId") REFERENCES public."Employee"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: SalaryAdvance SalaryAdvance_employeeId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: yvesmpunga
--

ALTER TABLE ONLY public."SalaryAdvance"
    ADD CONSTRAINT "SalaryAdvance_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES public."Employee"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Session Session_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: yvesmpunga
--

ALTER TABLE ONLY public."Session"
    ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: User User_ministryId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: yvesmpunga
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_ministryId_fkey" FOREIGN KEY ("ministryId") REFERENCES public.ministries(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: WorkerCategory WorkerCategory_currencyId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: yvesmpunga
--

ALTER TABLE ONLY public."WorkerCategory"
    ADD CONSTRAINT "WorkerCategory_currencyId_fkey" FOREIGN KEY ("currencyId") REFERENCES public."Currency"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: actes_administratifs actes_administratifs_ministryId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: yvesmpunga
--

ALTER TABLE ONLY public.actes_administratifs
    ADD CONSTRAINT "actes_administratifs_ministryId_fkey" FOREIGN KEY ("ministryId") REFERENCES public.ministries(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: actes_administratifs actes_administratifs_sectorId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: yvesmpunga
--

ALTER TABLE ONLY public.actes_administratifs
    ADD CONSTRAINT "actes_administratifs_sectorId_fkey" FOREIGN KEY ("sectorId") REFERENCES public.sectors(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: application_documents application_documents_applicationId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: yvesmpunga
--

ALTER TABLE ONLY public.application_documents
    ADD CONSTRAINT "application_documents_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES public.opportunity_applications(id);


--
-- Name: application_documents application_documents_requiredDocumentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: yvesmpunga
--

ALTER TABLE ONLY public.application_documents
    ADD CONSTRAINT "application_documents_requiredDocumentId_fkey" FOREIGN KEY ("requiredDocumentId") REFERENCES public.opportunity_documents(id);


--
-- Name: application_documents application_documents_uploadedById_fkey; Type: FK CONSTRAINT; Schema: public; Owner: yvesmpunga
--

ALTER TABLE ONLY public.application_documents
    ADD CONSTRAINT "application_documents_uploadedById_fkey" FOREIGN KEY ("uploadedById") REFERENCES public.users(id);


--
-- Name: application_documents application_documents_verifiedById_fkey; Type: FK CONSTRAINT; Schema: public; Owner: yvesmpunga
--

ALTER TABLE ONLY public.application_documents
    ADD CONSTRAINT "application_documents_verifiedById_fkey" FOREIGN KEY ("verifiedById") REFERENCES public.users(id);


--
-- Name: approvals approvals_assigned_to_fkey; Type: FK CONSTRAINT; Schema: public; Owner: yvesmpunga
--

ALTER TABLE ONLY public.approvals
    ADD CONSTRAINT approvals_assigned_to_fkey FOREIGN KEY (assigned_to) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: approvals approvals_investment_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: yvesmpunga
--

ALTER TABLE ONLY public.approvals
    ADD CONSTRAINT approvals_investment_id_fkey FOREIGN KEY (investment_id) REFERENCES public.investments(id) ON UPDATE CASCADE;


--
-- Name: approvals approvals_reviewed_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: yvesmpunga
--

ALTER TABLE ONLY public.approvals
    ADD CONSTRAINT approvals_reviewed_by_fkey FOREIGN KEY (reviewed_by) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: barrier_resolutions barrier_resolutions_barrierId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: yvesmpunga
--

ALTER TABLE ONLY public.barrier_resolutions
    ADD CONSTRAINT "barrier_resolutions_barrierId_fkey" FOREIGN KEY ("barrierId") REFERENCES public.business_barriers(id) ON UPDATE CASCADE;


--
-- Name: bidder_ratings bidder_ratings_approved_by_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: yvesmpunga
--

ALTER TABLE ONLY public.bidder_ratings
    ADD CONSTRAINT bidder_ratings_approved_by_id_fkey FOREIGN KEY (approved_by_id) REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: bidder_ratings bidder_ratings_bidder_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: yvesmpunga
--

ALTER TABLE ONLY public.bidder_ratings
    ADD CONSTRAINT bidder_ratings_bidder_id_fkey FOREIGN KEY (bidder_id) REFERENCES public.procurement_bidders(id) ON UPDATE CASCADE;


--
-- Name: bidder_ratings bidder_ratings_contract_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: yvesmpunga
--

ALTER TABLE ONLY public.bidder_ratings
    ADD CONSTRAINT bidder_ratings_contract_id_fkey FOREIGN KEY (contract_id) REFERENCES public.procurement_contracts(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: bidder_ratings bidder_ratings_evaluated_by_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: yvesmpunga
--

ALTER TABLE ONLY public.bidder_ratings
    ADD CONSTRAINT bidder_ratings_evaluated_by_id_fkey FOREIGN KEY (evaluated_by_id) REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: bidder_ratings bidder_ratings_tender_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: yvesmpunga
--

ALTER TABLE ONLY public.bidder_ratings
    ADD CONSTRAINT bidder_ratings_tender_id_fkey FOREIGN KEY (tender_id) REFERENCES public.procurement_tenders(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: business_barriers business_barriers_investorId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: yvesmpunga
--

ALTER TABLE ONLY public.business_barriers
    ADD CONSTRAINT "business_barriers_investorId_fkey" FOREIGN KEY ("investorId") REFERENCES public.investors(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: business_barriers business_barriers_projectId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: yvesmpunga
--

ALTER TABLE ONLY public.business_barriers
    ADD CONSTRAINT "business_barriers_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES public.investments_projects(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: cities cities_province_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: yvesmpunga
--

ALTER TABLE ONLY public.cities
    ADD CONSTRAINT cities_province_id_fkey FOREIGN KEY (province_id) REFERENCES public.provinces(id) ON UPDATE CASCADE;


--
-- Name: climate_indicator_values climate_indicator_values_createdById_fkey; Type: FK CONSTRAINT; Schema: public; Owner: yvesmpunga
--

ALTER TABLE ONLY public.climate_indicator_values
    ADD CONSTRAINT "climate_indicator_values_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: climate_indicator_values climate_indicator_values_indicatorId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: yvesmpunga
--

ALTER TABLE ONLY public.climate_indicator_values
    ADD CONSTRAINT "climate_indicator_values_indicatorId_fkey" FOREIGN KEY ("indicatorId") REFERENCES public.climate_indicators(id) ON UPDATE CASCADE;


--
-- Name: climate_indicator_values climate_indicator_values_verifiedById_fkey; Type: FK CONSTRAINT; Schema: public; Owner: yvesmpunga
--

ALTER TABLE ONLY public.climate_indicator_values
    ADD CONSTRAINT "climate_indicator_values_verifiedById_fkey" FOREIGN KEY ("verifiedById") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: climate_indicators climate_indicators_createdById_fkey; Type: FK CONSTRAINT; Schema: public; Owner: yvesmpunga
--

ALTER TABLE ONLY public.climate_indicators
    ADD CONSTRAINT "climate_indicators_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: contracts contracts_domainId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: yvesmpunga
--

ALTER TABLE ONLY public.contracts
    ADD CONSTRAINT "contracts_domainId_fkey" FOREIGN KEY ("domainId") REFERENCES public.legal_domains(id);


--
-- Name: contracts contracts_previousContractId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: yvesmpunga
--

ALTER TABLE ONLY public.contracts
    ADD CONSTRAINT "contracts_previousContractId_fkey" FOREIGN KEY ("previousContractId") REFERENCES public.contracts(id);


--
-- Name: contracts contracts_typeId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: yvesmpunga
--

ALTER TABLE ONLY public.contracts
    ADD CONSTRAINT "contracts_typeId_fkey" FOREIGN KEY ("typeId") REFERENCES public.contract_types(id);


--
-- Name: dialogue_participants dialogue_participants_dialogueId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: yvesmpunga
--

ALTER TABLE ONLY public.dialogue_participants
    ADD CONSTRAINT "dialogue_participants_dialogueId_fkey" FOREIGN KEY ("dialogueId") REFERENCES public.stakeholder_dialogues(id) ON UPDATE CASCADE;


--
-- Name: dialogue_participants dialogue_participants_investorId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: yvesmpunga
--

ALTER TABLE ONLY public.dialogue_participants
    ADD CONSTRAINT "dialogue_participants_investorId_fkey" FOREIGN KEY ("investorId") REFERENCES public.investors(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: dialogue_participants dialogue_participants_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: yvesmpunga
--

ALTER TABLE ONLY public.dialogue_participants
    ADD CONSTRAINT "dialogue_participants_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: districts districts_province_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: yvesmpunga
--

ALTER TABLE ONLY public.districts
    ADD CONSTRAINT districts_province_id_fkey FOREIGN KEY (province_id) REFERENCES public.provinces(id) ON UPDATE CASCADE;


--
-- Name: dossier_sectors dossier_sectors_dossierId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: yvesmpunga
--

ALTER TABLE ONLY public.dossier_sectors
    ADD CONSTRAINT "dossier_sectors_dossierId_fkey" FOREIGN KEY ("dossierId") REFERENCES public.dossiers(id);


--
-- Name: dossier_sectors dossier_sectors_sectorId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: yvesmpunga
--

ALTER TABLE ONLY public.dossier_sectors
    ADD CONSTRAINT "dossier_sectors_sectorId_fkey" FOREIGN KEY ("sectorId") REFERENCES public.sectors(id);


--
-- Name: dossier_step_validations dossier_step_validations_dossier_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: yvesmpunga
--

ALTER TABLE ONLY public.dossier_step_validations
    ADD CONSTRAINT dossier_step_validations_dossier_id_fkey FOREIGN KEY (dossier_id) REFERENCES public.dossiers(id) ON DELETE CASCADE;


--
-- Name: dossiers dossiers_investorCityId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: yvesmpunga
--

ALTER TABLE ONLY public.dossiers
    ADD CONSTRAINT "dossiers_investorCityId_fkey" FOREIGN KEY ("investorCityId") REFERENCES public."City"(id);


--
-- Name: dossiers dossiers_investorCommuneId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: yvesmpunga
--

ALTER TABLE ONLY public.dossiers
    ADD CONSTRAINT "dossiers_investorCommuneId_fkey" FOREIGN KEY ("investorCommuneId") REFERENCES public."Commune"(id);


--
-- Name: dossiers dossiers_investorProvinceId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: yvesmpunga
--

ALTER TABLE ONLY public.dossiers
    ADD CONSTRAINT "dossiers_investorProvinceId_fkey" FOREIGN KEY ("investorProvinceId") REFERENCES public."Province"(id);


--
-- Name: dossiers dossiers_ministryId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: yvesmpunga
--

ALTER TABLE ONLY public.dossiers
    ADD CONSTRAINT "dossiers_ministryId_fkey" FOREIGN KEY ("ministryId") REFERENCES public.ministries(id);


--
-- Name: dossiers dossiers_projectCityId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: yvesmpunga
--

ALTER TABLE ONLY public.dossiers
    ADD CONSTRAINT "dossiers_projectCityId_fkey" FOREIGN KEY ("projectCityId") REFERENCES public."City"(id);


--
-- Name: dossiers dossiers_projectCommuneId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: yvesmpunga
--

ALTER TABLE ONLY public.dossiers
    ADD CONSTRAINT "dossiers_projectCommuneId_fkey" FOREIGN KEY ("projectCommuneId") REFERENCES public."Commune"(id);


--
-- Name: dossiers dossiers_projectProvinceId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: yvesmpunga
--

ALTER TABLE ONLY public.dossiers
    ADD CONSTRAINT "dossiers_projectProvinceId_fkey" FOREIGN KEY ("projectProvinceId") REFERENCES public."Province"(id);


--
-- Name: exchange_rate_history exchange_rate_history_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: yvesmpunga
--

ALTER TABLE ONLY public.exchange_rate_history
    ADD CONSTRAINT exchange_rate_history_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: exchange_rate_history exchange_rate_history_currency_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: yvesmpunga
--

ALTER TABLE ONLY public.exchange_rate_history
    ADD CONSTRAINT exchange_rate_history_currency_id_fkey FOREIGN KEY (currency_id) REFERENCES public.currencies(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: framework_agreement_suppliers framework_agreement_suppliers_added_by_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: yvesmpunga
--

ALTER TABLE ONLY public.framework_agreement_suppliers
    ADD CONSTRAINT framework_agreement_suppliers_added_by_id_fkey FOREIGN KEY (added_by_id) REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: framework_agreement_suppliers framework_agreement_suppliers_agreement_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: yvesmpunga
--

ALTER TABLE ONLY public.framework_agreement_suppliers
    ADD CONSTRAINT framework_agreement_suppliers_agreement_id_fkey FOREIGN KEY (agreement_id) REFERENCES public.framework_agreements(id) ON UPDATE CASCADE;


--
-- Name: framework_agreement_suppliers framework_agreement_suppliers_bidder_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: yvesmpunga
--

ALTER TABLE ONLY public.framework_agreement_suppliers
    ADD CONSTRAINT framework_agreement_suppliers_bidder_id_fkey FOREIGN KEY (bidder_id) REFERENCES public.procurement_bidders(id) ON UPDATE CASCADE;


--
-- Name: framework_agreements framework_agreements_approved_by_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: yvesmpunga
--

ALTER TABLE ONLY public.framework_agreements
    ADD CONSTRAINT framework_agreements_approved_by_id_fkey FOREIGN KEY (approved_by_id) REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: framework_agreements framework_agreements_created_by_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: yvesmpunga
--

ALTER TABLE ONLY public.framework_agreements
    ADD CONSTRAINT framework_agreements_created_by_id_fkey FOREIGN KEY (created_by_id) REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: framework_agreements framework_agreements_ministry_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: yvesmpunga
--

ALTER TABLE ONLY public.framework_agreements
    ADD CONSTRAINT framework_agreements_ministry_id_fkey FOREIGN KEY (ministry_id) REFERENCES public.ministries(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: framework_agreements framework_agreements_signed_by_client_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: yvesmpunga
--

ALTER TABLE ONLY public.framework_agreements
    ADD CONSTRAINT framework_agreements_signed_by_client_id_fkey FOREIGN KEY (signed_by_client_id) REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: framework_agreements framework_agreements_tender_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: yvesmpunga
--

ALTER TABLE ONLY public.framework_agreements
    ADD CONSTRAINT framework_agreements_tender_id_fkey FOREIGN KEY (tender_id) REFERENCES public.procurement_tenders(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: framework_orders framework_orders_agreement_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: yvesmpunga
--

ALTER TABLE ONLY public.framework_orders
    ADD CONSTRAINT framework_orders_agreement_id_fkey FOREIGN KEY (agreement_id) REFERENCES public.framework_agreements(id) ON UPDATE CASCADE;


--
-- Name: framework_orders framework_orders_approved_by_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: yvesmpunga
--

ALTER TABLE ONLY public.framework_orders
    ADD CONSTRAINT framework_orders_approved_by_id_fkey FOREIGN KEY (approved_by_id) REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: framework_orders framework_orders_bidder_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: yvesmpunga
--

ALTER TABLE ONLY public.framework_orders
    ADD CONSTRAINT framework_orders_bidder_id_fkey FOREIGN KEY (bidder_id) REFERENCES public.procurement_bidders(id) ON UPDATE CASCADE;


--
-- Name: framework_orders framework_orders_received_by_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: yvesmpunga
--

ALTER TABLE ONLY public.framework_orders
    ADD CONSTRAINT framework_orders_received_by_id_fkey FOREIGN KEY (received_by_id) REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: framework_orders framework_orders_requested_by_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: yvesmpunga
--

ALTER TABLE ONLY public.framework_orders
    ADD CONSTRAINT framework_orders_requested_by_id_fkey FOREIGN KEY (requested_by_id) REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: framework_orders framework_orders_supplier_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: yvesmpunga
--

ALTER TABLE ONLY public.framework_orders
    ADD CONSTRAINT framework_orders_supplier_id_fkey FOREIGN KEY (supplier_id) REFERENCES public.framework_agreement_suppliers(id) ON UPDATE CASCADE;


--
-- Name: international_treaties international_treaties_createdById_fkey; Type: FK CONSTRAINT; Schema: public; Owner: yvesmpunga
--

ALTER TABLE ONLY public.international_treaties
    ADD CONSTRAINT "international_treaties_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES public."User"(id) ON DELETE SET NULL;


--
-- Name: international_treaties international_treaties_responsibleId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: yvesmpunga
--

ALTER TABLE ONLY public.international_treaties
    ADD CONSTRAINT "international_treaties_responsibleId_fkey" FOREIGN KEY ("responsibleId") REFERENCES public."User"(id) ON DELETE SET NULL;


--
-- Name: investments investments_approved_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: yvesmpunga
--

ALTER TABLE ONLY public.investments
    ADD CONSTRAINT investments_approved_by_fkey FOREIGN KEY (approved_by) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: investments investments_city_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: yvesmpunga
--

ALTER TABLE ONLY public.investments
    ADD CONSTRAINT investments_city_id_fkey FOREIGN KEY (city_id) REFERENCES public.cities(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: investments investments_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: yvesmpunga
--

ALTER TABLE ONLY public.investments
    ADD CONSTRAINT investments_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.users(id) ON UPDATE CASCADE;


--
-- Name: investments investments_investor_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: yvesmpunga
--

ALTER TABLE ONLY public.investments
    ADD CONSTRAINT investments_investor_id_fkey FOREIGN KEY (investor_id) REFERENCES public.investors(id) ON UPDATE CASCADE;


--
-- Name: investments investments_province_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: yvesmpunga
--

ALTER TABLE ONLY public.investments
    ADD CONSTRAINT investments_province_id_fkey FOREIGN KEY (province_id) REFERENCES public.provinces(id) ON UPDATE CASCADE;


--
-- Name: investments investments_sector_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: yvesmpunga
--

ALTER TABLE ONLY public.investments
    ADD CONSTRAINT investments_sector_id_fkey FOREIGN KEY (sector_id) REFERENCES public.sectors(id) ON UPDATE CASCADE;


--
-- Name: juridical_texts juridical_texts_abrogatedById_fkey; Type: FK CONSTRAINT; Schema: public; Owner: yvesmpunga
--

ALTER TABLE ONLY public.juridical_texts
    ADD CONSTRAINT "juridical_texts_abrogatedById_fkey" FOREIGN KEY ("abrogatedById") REFERENCES public.juridical_texts(id);


--
-- Name: juridical_texts juridical_texts_domainId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: yvesmpunga
--

ALTER TABLE ONLY public.juridical_texts
    ADD CONSTRAINT "juridical_texts_domainId_fkey" FOREIGN KEY ("domainId") REFERENCES public.legal_domains(id);


--
-- Name: juridical_texts juridical_texts_modifiedById_fkey; Type: FK CONSTRAINT; Schema: public; Owner: yvesmpunga
--

ALTER TABLE ONLY public.juridical_texts
    ADD CONSTRAINT "juridical_texts_modifiedById_fkey" FOREIGN KEY ("modifiedById") REFERENCES public.juridical_texts(id);


--
-- Name: juridical_texts juridical_texts_previousVersionId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: yvesmpunga
--

ALTER TABLE ONLY public.juridical_texts
    ADD CONSTRAINT "juridical_texts_previousVersionId_fkey" FOREIGN KEY ("previousVersionId") REFERENCES public.juridical_texts(id);


--
-- Name: juridical_texts juridical_texts_typeId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: yvesmpunga
--

ALTER TABLE ONLY public.juridical_texts
    ADD CONSTRAINT "juridical_texts_typeId_fkey" FOREIGN KEY ("typeId") REFERENCES public.legal_document_types(id);


--
-- Name: legal_alerts legal_alerts_contractId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: yvesmpunga
--

ALTER TABLE ONLY public.legal_alerts
    ADD CONSTRAINT "legal_alerts_contractId_fkey" FOREIGN KEY ("contractId") REFERENCES public.contracts(id);


--
-- Name: legal_alerts legal_alerts_documentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: yvesmpunga
--

ALTER TABLE ONLY public.legal_alerts
    ADD CONSTRAINT "legal_alerts_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES public.juridical_texts(id);


--
-- Name: legal_domains legal_domains_parentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: yvesmpunga
--

ALTER TABLE ONLY public.legal_domains
    ADD CONSTRAINT "legal_domains_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES public.legal_domains(id);


--
-- Name: legal_proposals legal_proposals_relatedTextId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: yvesmpunga
--

ALTER TABLE ONLY public.legal_proposals
    ADD CONSTRAINT "legal_proposals_relatedTextId_fkey" FOREIGN KEY ("relatedTextId") REFERENCES public.juridical_texts(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: mediation_cases mediation_cases_barrierId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: yvesmpunga
--

ALTER TABLE ONLY public.mediation_cases
    ADD CONSTRAINT "mediation_cases_barrierId_fkey" FOREIGN KEY ("barrierId") REFERENCES public.business_barriers(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: mediation_cases mediation_cases_investorId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: yvesmpunga
--

ALTER TABLE ONLY public.mediation_cases
    ADD CONSTRAINT "mediation_cases_investorId_fkey" FOREIGN KEY ("investorId") REFERENCES public.investors(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: mediation_cases mediation_cases_projectId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: yvesmpunga
--

ALTER TABLE ONLY public.mediation_cases
    ADD CONSTRAINT "mediation_cases_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES public.investments_projects(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: message_attachments message_attachments_message_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: yvesmpunga
--

ALTER TABLE ONLY public.message_attachments
    ADD CONSTRAINT message_attachments_message_id_fkey FOREIGN KEY (message_id) REFERENCES public.messages(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: message_recipients message_recipients_message_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: yvesmpunga
--

ALTER TABLE ONLY public.message_recipients
    ADD CONSTRAINT message_recipients_message_id_fkey FOREIGN KEY (message_id) REFERENCES public.messages(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: message_recipients message_recipients_recipient_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: yvesmpunga
--

ALTER TABLE ONLY public.message_recipients
    ADD CONSTRAINT message_recipients_recipient_id_fkey FOREIGN KEY (recipient_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: messages messages_sender_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: yvesmpunga
--

ALTER TABLE ONLY public.messages
    ADD CONSTRAINT messages_sender_id_fkey FOREIGN KEY (sender_id) REFERENCES public."User"(id) ON UPDATE CASCADE;


--
-- Name: ministry_departments ministry_departments_ministry_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: yvesmpunga
--

ALTER TABLE ONLY public.ministry_departments
    ADD CONSTRAINT ministry_departments_ministry_id_fkey FOREIGN KEY (ministry_id) REFERENCES public.ministries(id) ON UPDATE CASCADE;


--
-- Name: ministry_request_history ministry_request_history_requestId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: yvesmpunga
--

ALTER TABLE ONLY public.ministry_request_history
    ADD CONSTRAINT "ministry_request_history_requestId_fkey" FOREIGN KEY ("requestId") REFERENCES public.ministry_requests(id) ON UPDATE CASCADE;


--
-- Name: ministry_requests ministry_requests_dossierId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: yvesmpunga
--

ALTER TABLE ONLY public.ministry_requests
    ADD CONSTRAINT "ministry_requests_dossierId_fkey" FOREIGN KEY ("dossierId") REFERENCES public.dossiers(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: ministry_requests ministry_requests_investorId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: yvesmpunga
--

ALTER TABLE ONLY public.ministry_requests
    ADD CONSTRAINT "ministry_requests_investorId_fkey" FOREIGN KEY ("investorId") REFERENCES public.investors(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: ministry_requests ministry_requests_ministryId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: yvesmpunga
--

ALTER TABLE ONLY public.ministry_requests
    ADD CONSTRAINT "ministry_requests_ministryId_fkey" FOREIGN KEY ("ministryId") REFERENCES public.ministries(id) ON UPDATE CASCADE;


--
-- Name: ministry_workflows ministry_workflows_ministryId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: yvesmpunga
--

ALTER TABLE ONLY public.ministry_workflows
    ADD CONSTRAINT "ministry_workflows_ministryId_fkey" FOREIGN KEY ("ministryId") REFERENCES public.ministries(id) ON UPDATE CASCADE;


--
-- Name: opportunity_applications opportunity_applications_investorId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: yvesmpunga
--

ALTER TABLE ONLY public.opportunity_applications
    ADD CONSTRAINT "opportunity_applications_investorId_fkey" FOREIGN KEY ("investorId") REFERENCES public.investors(id);


--
-- Name: opportunity_applications opportunity_applications_opportunityId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: yvesmpunga
--

ALTER TABLE ONLY public.opportunity_applications
    ADD CONSTRAINT "opportunity_applications_opportunityId_fkey" FOREIGN KEY ("opportunityId") REFERENCES public.province_opportunities(id);


--
-- Name: opportunity_applications opportunity_applications_reviewedById_fkey; Type: FK CONSTRAINT; Schema: public; Owner: yvesmpunga
--

ALTER TABLE ONLY public.opportunity_applications
    ADD CONSTRAINT "opportunity_applications_reviewedById_fkey" FOREIGN KEY ("reviewedById") REFERENCES public.users(id);


--
-- Name: opportunity_documents opportunity_documents_opportunityId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: yvesmpunga
--

ALTER TABLE ONLY public.opportunity_documents
    ADD CONSTRAINT "opportunity_documents_opportunityId_fkey" FOREIGN KEY ("opportunityId") REFERENCES public.province_opportunities(id);


--
-- Name: pieces_requises pieces_requises_acteId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: yvesmpunga
--

ALTER TABLE ONLY public.pieces_requises
    ADD CONSTRAINT "pieces_requises_acteId_fkey" FOREIGN KEY ("acteId") REFERENCES public.actes_administratifs(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: procurement_bid_documents procurement_bid_documents_bid_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: yvesmpunga
--

ALTER TABLE ONLY public.procurement_bid_documents
    ADD CONSTRAINT procurement_bid_documents_bid_id_fkey FOREIGN KEY (bid_id) REFERENCES public.procurement_bids(id) ON DELETE CASCADE;


--
-- Name: procurement_bid_documents procurement_bid_documents_document_type_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: yvesmpunga
--

ALTER TABLE ONLY public.procurement_bid_documents
    ADD CONSTRAINT procurement_bid_documents_document_type_id_fkey FOREIGN KEY (document_type_id) REFERENCES public.procurement_document_types(id);


--
-- Name: procurement_bidder_documents procurement_bidder_documents_bidder_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: yvesmpunga
--

ALTER TABLE ONLY public.procurement_bidder_documents
    ADD CONSTRAINT procurement_bidder_documents_bidder_id_fkey FOREIGN KEY (bidder_id) REFERENCES public.procurement_bidders(id) ON DELETE CASCADE;


--
-- Name: procurement_bidder_documents procurement_bidder_documents_document_type_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: yvesmpunga
--

ALTER TABLE ONLY public.procurement_bidder_documents
    ADD CONSTRAINT procurement_bidder_documents_document_type_id_fkey FOREIGN KEY (document_type_id) REFERENCES public.procurement_document_types(id);


--
-- Name: procurement_bids procurement_bids_bidder_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: yvesmpunga
--

ALTER TABLE ONLY public.procurement_bids
    ADD CONSTRAINT procurement_bids_bidder_id_fkey FOREIGN KEY (bidder_id) REFERENCES public.procurement_bidders(id);


--
-- Name: procurement_bids procurement_bids_lot_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: yvesmpunga
--

ALTER TABLE ONLY public.procurement_bids
    ADD CONSTRAINT procurement_bids_lot_id_fkey FOREIGN KEY (lot_id) REFERENCES public.procurement_tender_lots(id);


--
-- Name: procurement_bids procurement_bids_tender_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: yvesmpunga
--

ALTER TABLE ONLY public.procurement_bids
    ADD CONSTRAINT procurement_bids_tender_id_fkey FOREIGN KEY (tender_id) REFERENCES public.procurement_tenders(id) ON DELETE CASCADE;


--
-- Name: procurement_contract_documents procurement_contract_documents_contract_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: yvesmpunga
--

ALTER TABLE ONLY public.procurement_contract_documents
    ADD CONSTRAINT procurement_contract_documents_contract_id_fkey FOREIGN KEY (contract_id) REFERENCES public.procurement_contracts(id) ON DELETE CASCADE;


--
-- Name: procurement_contract_documents procurement_contract_documents_document_type_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: yvesmpunga
--

ALTER TABLE ONLY public.procurement_contract_documents
    ADD CONSTRAINT procurement_contract_documents_document_type_id_fkey FOREIGN KEY (document_type_id) REFERENCES public.procurement_document_types(id);


--
-- Name: procurement_contract_documents procurement_contract_documents_execution_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: yvesmpunga
--

ALTER TABLE ONLY public.procurement_contract_documents
    ADD CONSTRAINT procurement_contract_documents_execution_id_fkey FOREIGN KEY (execution_id) REFERENCES public.procurement_contract_executions(id);


--
-- Name: procurement_contract_executions procurement_contract_executions_contract_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: yvesmpunga
--

ALTER TABLE ONLY public.procurement_contract_executions
    ADD CONSTRAINT procurement_contract_executions_contract_id_fkey FOREIGN KEY (contract_id) REFERENCES public.procurement_contracts(id) ON DELETE CASCADE;


--
-- Name: procurement_contracts procurement_contracts_bid_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: yvesmpunga
--

ALTER TABLE ONLY public.procurement_contracts
    ADD CONSTRAINT procurement_contracts_bid_id_fkey FOREIGN KEY (bid_id) REFERENCES public.procurement_bids(id);


--
-- Name: procurement_contracts procurement_contracts_bidder_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: yvesmpunga
--

ALTER TABLE ONLY public.procurement_contracts
    ADD CONSTRAINT procurement_contracts_bidder_id_fkey FOREIGN KEY (bidder_id) REFERENCES public.procurement_bidders(id);


--
-- Name: procurement_contracts procurement_contracts_lot_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: yvesmpunga
--

ALTER TABLE ONLY public.procurement_contracts
    ADD CONSTRAINT procurement_contracts_lot_id_fkey FOREIGN KEY (lot_id) REFERENCES public.procurement_tender_lots(id);


--
-- Name: procurement_contracts procurement_contracts_tender_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: yvesmpunga
--

ALTER TABLE ONLY public.procurement_contracts
    ADD CONSTRAINT procurement_contracts_tender_id_fkey FOREIGN KEY (tender_id) REFERENCES public.procurement_tenders(id);


--
-- Name: procurement_evaluation_committees procurement_evaluation_committees_tender_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: yvesmpunga
--

ALTER TABLE ONLY public.procurement_evaluation_committees
    ADD CONSTRAINT procurement_evaluation_committees_tender_id_fkey FOREIGN KEY (tender_id) REFERENCES public.procurement_tenders(id) ON DELETE CASCADE;


--
-- Name: procurement_tender_documents procurement_tender_documents_document_type_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: yvesmpunga
--

ALTER TABLE ONLY public.procurement_tender_documents
    ADD CONSTRAINT procurement_tender_documents_document_type_id_fkey FOREIGN KEY (document_type_id) REFERENCES public.procurement_document_types(id);


--
-- Name: procurement_tender_documents procurement_tender_documents_tender_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: yvesmpunga
--

ALTER TABLE ONLY public.procurement_tender_documents
    ADD CONSTRAINT procurement_tender_documents_tender_id_fkey FOREIGN KEY (tender_id) REFERENCES public.procurement_tenders(id) ON DELETE CASCADE;


--
-- Name: procurement_tender_history procurement_tender_history_tender_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: yvesmpunga
--

ALTER TABLE ONLY public.procurement_tender_history
    ADD CONSTRAINT procurement_tender_history_tender_id_fkey FOREIGN KEY (tender_id) REFERENCES public.procurement_tenders(id) ON DELETE CASCADE;


--
-- Name: procurement_tender_lots procurement_tender_lots_awarded_bidder_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: yvesmpunga
--

ALTER TABLE ONLY public.procurement_tender_lots
    ADD CONSTRAINT procurement_tender_lots_awarded_bidder_id_fkey FOREIGN KEY (awarded_bidder_id) REFERENCES public.procurement_bidders(id);


--
-- Name: procurement_tender_lots procurement_tender_lots_tender_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: yvesmpunga
--

ALTER TABLE ONLY public.procurement_tender_lots
    ADD CONSTRAINT procurement_tender_lots_tender_id_fkey FOREIGN KEY (tender_id) REFERENCES public.procurement_tenders(id) ON DELETE CASCADE;


--
-- Name: project_documents project_documents_projectId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: yvesmpunga
--

ALTER TABLE ONLY public.project_documents
    ADD CONSTRAINT "project_documents_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES public.investments_projects(id);


--
-- Name: project_impacts project_impacts_created_by_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: yvesmpunga
--

ALTER TABLE ONLY public.project_impacts
    ADD CONSTRAINT project_impacts_created_by_id_fkey FOREIGN KEY (created_by_id) REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: project_impacts project_impacts_project_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: yvesmpunga
--

ALTER TABLE ONLY public.project_impacts
    ADD CONSTRAINT project_impacts_project_id_fkey FOREIGN KEY (project_id) REFERENCES public.investments_projects(id) ON UPDATE CASCADE;


--
-- Name: project_impacts project_impacts_verified_by_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: yvesmpunga
--

ALTER TABLE ONLY public.project_impacts
    ADD CONSTRAINT project_impacts_verified_by_id_fkey FOREIGN KEY (verified_by_id) REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: project_milestones project_milestones_completed_by_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: yvesmpunga
--

ALTER TABLE ONLY public.project_milestones
    ADD CONSTRAINT project_milestones_completed_by_id_fkey FOREIGN KEY (completed_by_id) REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: project_milestones project_milestones_created_by_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: yvesmpunga
--

ALTER TABLE ONLY public.project_milestones
    ADD CONSTRAINT project_milestones_created_by_id_fkey FOREIGN KEY (created_by_id) REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: project_milestones project_milestones_project_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: yvesmpunga
--

ALTER TABLE ONLY public.project_milestones
    ADD CONSTRAINT project_milestones_project_id_fkey FOREIGN KEY (project_id) REFERENCES public.investments_projects(id) ON UPDATE CASCADE;


--
-- Name: project_risks project_risks_created_by_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: yvesmpunga
--

ALTER TABLE ONLY public.project_risks
    ADD CONSTRAINT project_risks_created_by_id_fkey FOREIGN KEY (created_by_id) REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: project_risks project_risks_project_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: yvesmpunga
--

ALTER TABLE ONLY public.project_risks
    ADD CONSTRAINT project_risks_project_id_fkey FOREIGN KEY (project_id) REFERENCES public.investments_projects(id) ON UPDATE CASCADE;


--
-- Name: project_risks project_risks_updated_by_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: yvesmpunga
--

ALTER TABLE ONLY public.project_risks
    ADD CONSTRAINT project_risks_updated_by_id_fkey FOREIGN KEY (updated_by_id) REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: province_opportunities province_opportunities_createdById_fkey; Type: FK CONSTRAINT; Schema: public; Owner: yvesmpunga
--

ALTER TABLE ONLY public.province_opportunities
    ADD CONSTRAINT "province_opportunities_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES public.users(id);


--
-- Name: province_opportunities province_opportunities_provinceId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: yvesmpunga
--

ALTER TABLE ONLY public.province_opportunities
    ADD CONSTRAINT "province_opportunities_provinceId_fkey" FOREIGN KEY ("provinceId") REFERENCES public."Province"(id);


--
-- Name: province_opportunities province_opportunities_sectorId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: yvesmpunga
--

ALTER TABLE ONLY public.province_opportunities
    ADD CONSTRAINT "province_opportunities_sectorId_fkey" FOREIGN KEY ("sectorId") REFERENCES public.sectors(id);


--
-- Name: role_permissions role_permissions_permission_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: yvesmpunga
--

ALTER TABLE ONLY public.role_permissions
    ADD CONSTRAINT role_permissions_permission_id_fkey FOREIGN KEY (permission_id) REFERENCES public.permissions(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: role_permissions role_permissions_role_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: yvesmpunga
--

ALTER TABLE ONLY public.role_permissions
    ADD CONSTRAINT role_permissions_role_id_fkey FOREIGN KEY (role_id) REFERENCES public.roles(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: sectors sectors_ministryId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: yvesmpunga
--

ALTER TABLE ONLY public.sectors
    ADD CONSTRAINT "sectors_ministryId_fkey" FOREIGN KEY ("ministryId") REFERENCES public.ministries(id);


--
-- Name: sectors sectors_parentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: yvesmpunga
--

ALTER TABLE ONLY public.sectors
    ADD CONSTRAINT "sectors_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES public.sectors(id);


--
-- Name: stakeholder_dialogues stakeholder_dialogues_nextEventId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: yvesmpunga
--

ALTER TABLE ONLY public.stakeholder_dialogues
    ADD CONSTRAINT "stakeholder_dialogues_nextEventId_fkey" FOREIGN KEY ("nextEventId") REFERENCES public.stakeholder_dialogues(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: territories territories_district_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: yvesmpunga
--

ALTER TABLE ONLY public.territories
    ADD CONSTRAINT territories_district_id_fkey FOREIGN KEY (district_id) REFERENCES public.districts(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: territories territories_province_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: yvesmpunga
--

ALTER TABLE ONLY public.territories
    ADD CONSTRAINT territories_province_id_fkey FOREIGN KEY (province_id) REFERENCES public.provinces(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: users users_city_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: yvesmpunga
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_city_id_fkey FOREIGN KEY (city_id) REFERENCES public.cities(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: users users_ministry_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: yvesmpunga
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_ministry_id_fkey FOREIGN KEY (ministry_id) REFERENCES public.ministries(id) ON DELETE SET NULL;


--
-- Name: users users_province_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: yvesmpunga
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_province_id_fkey FOREIGN KEY (province_id) REFERENCES public.provinces(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: users users_role_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: yvesmpunga
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_role_id_fkey FOREIGN KEY (role_id) REFERENCES public.roles(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- PostgreSQL database dump complete
--

\unrestrict iHPxdQhw2CP1H2vK4KhmXfHz5yHUab3MX9U9P6t3QU17TaeZotKathzYKt9aRd5

