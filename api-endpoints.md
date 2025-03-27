# API Endpoints Documentation

This document provides a comprehensive list of all API endpoints available in the service platform backend.

## Table of Contents
- [User Endpoints](#user-endpoints)
- [Profile Endpoints](#profile-endpoints)
- [Job Endpoints](#job-endpoints)
- [Proposal Endpoints](#proposal-endpoints)
- [Contract Endpoints](#contract-endpoints)
- [Payment Endpoints](#payment-endpoints)
- [Review Endpoints](#review-endpoints)
- [Data Types](#data-types)

## User Endpoints

| Method | Endpoint | Description | Request Body | Response |
|--------|----------|-------------|--------------|----------|
| POST | `/users` | Create a new user | `{ email: string, password: string }` | User object |
| GET | `/users` | Get all users | - | Array of users |
| GET | `/users/:id` | Get a specific user | - | User object |
| PATCH | `/users/:id` | Update a user | `{ email?: string, password?: string }` | Updated user |
| DELETE | `/users/:id` | Delete a user | - | - |

## Profile Endpoints

| Method | Endpoint | Description | Request Body | Response |
|--------|----------|-------------|--------------|----------|
| POST | `/profiles` | Create a profile | `{ userId: string, bio?: string, mobileMoneyNumber?: string, bankAccountNumber?: string, nationalIdUrl?: string, location?: string }` | Profile object |
| GET | `/profiles` | Get all profiles | - | Array of profiles |
| GET | `/profiles/users/:id` | Get a specific profile by user ID | - | Profile object |
| PATCH | `/profiles/users/:id` | Update a profile by user ID | `{ bio?: string, mobileMoneyNumber?: string, bankAccountNumber?: string, nationalIdUrl?: string, location?: string }` | Updated profile |
| DELETE | `/profiles/users/:id` | Delete a profile by user ID | - | - |

## Job Endpoints

| Method | Endpoint | Description | Request Body | Response |
|--------|----------|-------------|--------------|----------|
| POST | `/jobs` | Create a new job | `{ title: string, description: string, budget: number, status?: JobStatus, numberOfSlots?: number, acceptedSlots?: number, clientId: string }` | Job object |
| GET | `/jobs` | Get all jobs | Optional query params: `category`, `status`, `clientId` | Array of jobs |
| GET | `/jobs/client/:clientId` | Get jobs by client | - | Array of jobs |
| GET | `/jobs/:id` | Get a specific job | - | Job object with client and proposals |
| PATCH | `/jobs/:id` | Update a job | Job fields to update | Updated job |
| DELETE | `/jobs/:id` | Delete a job | - | - |
| PATCH | `/jobs/:id/status` | Update job status | `{ status: string }` (open, in_progress, completed) | Updated job |
| PATCH | `/jobs/:id/accept-proposal` | Accept a proposal | - | Updated job with incremented slots |

## Proposal Endpoints

| Method | Endpoint | Description | Request Body | Response |
|--------|----------|-------------|--------------|----------|
| POST | `/proposals` | Create a new proposal | `{ freelancerId: string, jobId: string, coverLetter: string, bidAmount: number, status?: string }` | Proposal object |
| GET | `/proposals` | Get all proposals | - | Array of proposals |
| GET | `/proposals/:id` | Get a specific proposal | - | Proposal object |
| PATCH | `/proposals/:id` | Update a proposal | Proposal fields to update | Updated proposal |
| DELETE | `/proposals/:id` | Delete a proposal | - | - |

## Contract Endpoints

| Method | Endpoint | Description | Request Body | Response |
|--------|----------|-------------|--------------|----------|
| POST | `/contracts` | Create a new contract | `{ proposalId: string, escrowAmount: number, userId?: string, status?: ContractStatus }` | Contract object |
| GET | `/contracts` | Get all contracts | Optional query params: `userId`, `status` | Array of contracts |
| GET | `/contracts/:id` | Get a specific contract | - | Contract object with related data |
| GET | `/contracts/user/:userId` | Get contracts by user | - | Array of contracts |
| PATCH | `/contracts/:id` | Update a contract | Contract fields to update | Updated contract |
| PATCH | `/contracts/:id/status` | Update contract status | `{ status: string }` (active, completed, disputed) | Updated contract |
| DELETE | `/contracts/:id` | Delete a contract | - | - |

## Payment Endpoints

### Standard Payment Endpoints

| Method | Endpoint | Description | Request Body | Response |
|--------|----------|-------------|--------------|----------|
| POST | `/payments` | Create a new payment | `{ contractId: string, amount: number, paymentMethod: PaymentMethod, transactionId: string, status?: PaymentStatus }` | Payment object |
| GET | `/payments` | Get all payments | Optional query params: `contractId`, `status` | Array of payments |
| GET | `/payments/:id` | Get a specific payment | - | Payment object with related data |
| GET | `/payments/contract/:contractId` | Get payments by contract | - | Array of payments |
| PATCH | `/payments/:id` | Update a payment | `{ amount?: number, paymentMethod?: PaymentMethod, transactionId?: string, status?: PaymentStatus }` | Updated payment |
| PATCH | `/payments/:id/status` | Update payment status | `{ status: PaymentStatus }` (pending, completed, failed) | Updated payment |
| DELETE | `/payments/:id` | Delete a payment | - | - |
| PATCH | `/payments/:id/sync-status` | Sync payment status with Fapshi | - | Updated payment with synced status |

### Fapshi Payment Integration Endpoints

| Method | Endpoint | Description | Request Body | Response |
|--------|----------|-------------|--------------|----------|
| POST | `/payments/fapshi/payment-link` | Generate a Fapshi payment link | `{ amount: number, email?: string, redirectUrl?: string, userId?: string, externalId?: string, message?: string, cardOnly?: boolean }` | Payment link response with link and transId |
| POST | `/payments/fapshi/create-with-payment-link` | Create payment with Fapshi payment link | `{ payment: { contractId: string, amount: number, paymentMethod: PaymentMethod, transactionId: string }, paymentLink: { amount: number, email?: string, redirectUrl?: string, userId?: string, externalId?: string, message?: string, cardOnly?: boolean } }` | Payment object with Fapshi payment link |
| GET | `/payments/fapshi/payment-status/:transId` | Get Fapshi payment status | - | Payment status response |
| POST | `/payments/fapshi/expire-payment` | Expire a Fapshi payment | `{ transId: string }` | Payment status response |
| GET | `/payments/fapshi/user-transactions/:userId` | Get Fapshi transactions by user | - | Array of payment transactions |
| POST | `/payments/fapshi/direct-payment` | Initiate a direct Fapshi payment | `{ amount: number, phone: string, medium?: PaymentMedium, name?: string, email?: string, userId?: string, externalId?: string, message?: string }` | Direct payment response |
| POST | `/payments/fapshi/create-with-direct-payment` | Create payment with direct Fapshi payment | `{ payment: { contractId: string, amount: number, paymentMethod: PaymentMethod, transactionId: string }, directPayment: { amount: number, phone: string, medium?: PaymentMedium, name?: string, email?: string, userId?: string, externalId?: string, message?: string } }` | Payment object with Fapshi transaction ID |
| GET | `/payments/fapshi/search` | Search/filter Fapshi transactions | Query params: `status?: FapshiPaymentStatus, medium?: PaymentMedium, name?: string, start?: string, end?: string, amt?: number, limit?: number, sort?: 'asc' | 'desc'` | Array of payment transactions |
| GET | `/payments/fapshi/balance` | Get Fapshi service balance | - | Service balance response |

## Review Endpoints

| Method | Endpoint | Description | Request Body | Response |
|--------|----------|-------------|--------------|----------|
| POST | `/reviews` | Create a new review | `{ contractId: string, reviewerId: string, rating: number, comment?: string }` | Review object |
| GET | `/reviews` | Get all reviews | Optional query params: `contractId`, `reviewerId` | Array of reviews |
| GET | `/reviews/:id` | Get a specific review | - | Review object with related data |
| GET | `/reviews/contract/:contractId` | Get reviews by contract | - | Array of reviews |
| GET | `/reviews/reviewer/:reviewerId` | Get reviews by reviewer | - | Array of reviews |
| PATCH | `/reviews/:id` | Update a review | `{ comment?: string }` | Updated review |
| DELETE | `/reviews/:id` | Delete a review | - | - |

## Data Types

### Enums

#### UserRole
- `freelancer`
- `client`
- `admin`

#### VerificationStatus
- `pending`
- `verified`
- `rejected`

#### ProposalStatus
- `pending`
- `accepted`
- `rejected`

#### ContractStatus
- `active`
- `completed`
- `disputed`

#### PaymentStatus
- `pending`
- `completed`
- `failed`

#### PaymentMethod
- `mobile_money`
- `orange_money`
- `other`

#### JobStatus
- `open`
- `in_progress`
- `completed`

#### FapshiPaymentStatus
- `CREATED`
- `PENDING`
- `SUCCESSFUL`
- `FAILED`
- `EXPIRED`

#### PaymentMedium
- `mobile money`
- `orange money`