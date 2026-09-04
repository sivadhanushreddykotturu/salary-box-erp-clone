import { PrismaClient, Role, CompanyStatus, EmployeeStatus, ClaimStatus } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting Database Seeding on Neon PostgreSQL...");

  // 1. Create SaaS Plan
  const plan = await prisma.plan.upsert({
    where: { code: "SCALE" },
    update: {},
    create: {
      name: "Scale Plan (Unlimited)",
      code: "SCALE",
      description: "Full ERP HRMS Suite with Attendance, Payroll, Leaves, CRM, and S3 Reports",
      priceMonthly: 1999,
      priceYearly: 19999,
      maxEmployees: 1000,
      maxBranches: 50,
      availableModules: ["ATTENDANCE", "PAYROLL", "LEAVES", "EXPENSES", "CRM", "REPORTS"],
    },
  });
  console.log(`✅ Plan created/verified: ${plan.name}`);

  // 2. Create Company
  const company = await prisma.company.upsert({
    where: { companyCode: "IDGWDA" },
    update: {},
    create: {
      companyCode: "IDGWDA",
      name: "RSS LOGISTICS",
      businessEmail: "admin@rsslogistics.in",
      phone: "9542843456",
      planId: plan.id,
      status: CompanyStatus.ACTIVE,
      subscriptionExpiresAt: new Date("2028-12-31"),
      address: "Auto Nagar, Vijayawada, Andhra Pradesh",
      city: "Vijayawada",
      state: "Andhra Pradesh",
      pincode: "520007",
    },
  });
  console.log(`✅ Company created/verified: ${company.name} (${company.companyCode})`);

  // 3. Create Admin User (Phone: 9542843456, PIN: 7788)
  const hashedPin = await bcrypt.hash("7788", 10);
  const adminUser = await prisma.user.upsert({
    where: { phone: "9542843456" },
    update: { pinHash: hashedPin },
    create: {
      companyId: company.id,
      phone: "9542843456",
      email: "admin@rsslogistics.in",
      pinHash: hashedPin,
      role: Role.COMPANY_OWNER,
    },
  });
  console.log(`✅ Admin User created: ${adminUser.phone} (PIN: 7788)`);

  // 4. Create Branches
  const hqBranch = await prisma.branch.upsert({
    where: { id: "branch-hq-01" },
    update: {},
    create: {
      id: "branch-hq-01",
      companyId: company.id,
      name: "HQ Bangalore",
      code: "HQ-BLR",
      latitude: 12.9716,
      longitude: 77.5946,
      radiusMeters: 100,
      address: "MG Road, Central Business District, Bangalore 560001",
    },
  });

  const vjaBranch = await prisma.branch.upsert({
    where: { id: "branch-vja-01" },
    update: {},
    create: {
      id: "branch-vja-01",
      companyId: company.id,
      name: "VIJAYAWADA",
      code: "BR-VJA",
      latitude: 16.5062,
      longitude: 80.6480,
      radiusMeters: 150,
      address: "GM2F+G66, P48, Auto Nagar, Vijayawada, Andhra Pradesh 520007, India",
    },
  });

  const addankiBranch = await prisma.branch.upsert({
    where: { id: "branch-addanki-01" },
    update: {},
    create: {
      id: "branch-addanki-01",
      companyId: company.id,
      name: "Addanki",
      code: "BR-ADK",
      latitude: 15.8122,
      longitude: 79.9723,
      radiusMeters: 100,
      address: "Main Road, Opp Bus Stand, Addanki 523201",
    },
  });
  console.log("✅ Branches created: HQ Bangalore, VIJAYAWADA, Addanki");

  // 5. Create Shift
  const generalShift = await prisma.shift.upsert({
    where: { id: "shift-gen-01" },
    update: {},
    create: {
      id: "shift-gen-01",
      companyId: company.id,
      name: "General Day Shift (9 AM - 6 PM)",
      startTime: "09:00",
      endTime: "18:00",
      graceTimeMinutes: 15,
      halfDayMinutes: 240,
      fullDayMinutes: 480,
    },
  });
  console.log("✅ Shift created: General Day Shift");

  // 6. Create Employees matching SalaryBox
  const employeesData = [
    { code: "EMP001", name: "Anil", phone: "9989110795", jobTitle: "Field Executive", branchId: addankiBranch.id, salary: 18000 },
    { code: "EMP002", name: "Bobba Prasad", phone: "9052306037", jobTitle: "Technician", branchId: vjaBranch.id, salary: 28000 },
    { code: "EMP003", name: "DARA DEEKSHITH", phone: "8977273619", jobTitle: "Operations Lead", branchId: vjaBranch.id, salary: 32000 },
    { code: "EMP004", name: "Durga Prasad Cargo CUG", phone: "9247900633", jobTitle: "Cargo Supervisor", branchId: vjaBranch.id, salary: 40000 },
    { code: "EMP005", name: "Medipalli Nanibabu", phone: "7671831009", jobTitle: "Trainee Technician", branchId: vjaBranch.id, salary: 22000 },
    { code: "EMP006", name: "Priyanka EDP RSS VJA", phone: "8121920952", jobTitle: "EDP Incharge", branchId: vjaBranch.id, salary: 30000 },
    { code: "EMP007", name: "Rajesh Service Manager CUG OSM VJA", phone: "9247900637", jobTitle: "Service Manager", branchId: vjaBranch.id, salary: 55000 },
    { code: "EMP008", name: "Saleem", phone: "7396079141", jobTitle: "Field Staff", branchId: vjaBranch.id, salary: 25000 },
    { code: "EMP009", name: "Shaaru", phone: "8179334404", jobTitle: "Technician", branchId: vjaBranch.id, salary: 27000 },
  ];

  for (const emp of employeesData) {
    // 1. Create User
    const empUser = await prisma.user.upsert({
      where: { phone: emp.phone },
      update: {},
      create: {
        companyId: company.id,
        phone: emp.phone,
        pinHash: hashedPin,
        role: Role.EMPLOYEE,
      },
    });

    // 2. Create Salary Structure
    const salStruct = await prisma.salaryStructure.upsert({
      where: { id: `sal-${emp.code}` },
      update: {},
      create: {
        id: `sal-${emp.code}`,
        companyId: company.id,
        title: `${emp.name} Standard Structure`,
        monthlyCtc: emp.salary,
        basicSalary: Math.round(emp.salary * 0.5),
        hra: Math.round(emp.salary * 0.25),
        specialAllowance: Math.round(emp.salary * 0.25),
        providentFundEmployee: Math.round(emp.salary * 0.5 * 0.12),
        esiEmployee: emp.salary <= 21000 ? Math.round(emp.salary * 0.0075) : 0,
        professionalTax: 200,
      },
    });

    // 3. Create Employee
    await prisma.employee.upsert({
      where: { userId: empUser.id },
      update: {},
      create: {
        companyId: company.id,
        userId: empUser.id,
        employeeCode: emp.code,
        firstName: emp.name.split(" ")[0],
        lastName: emp.name.split(" ").slice(1).join(" ") || "",
        branchId: emp.branchId,
        shiftId: generalShift.id,
        salaryStructureId: salStruct.id,
        status: EmployeeStatus.ACTIVE,
        dateOfJoining: new Date("2026-06-01"),
      },
    });
  }
  console.log(`✅ Seeded ${employeesData.length} employees with salary structures on Neon!`);

  // 7. Seed Reimbursement Requests
  const priyankaEmp = await prisma.employee.findFirst({ where: { employeeCode: "EMP006" } });
  const anilEmp = await prisma.employee.findFirst({ where: { employeeCode: "EMP001" } });

  if (priyankaEmp && anilEmp) {
    await prisma.reimbursementClaim.createMany({
      data: [
        {
          companyId: company.id,
          employeeId: priyankaEmp.id,
          description: "fast testing",
          amount: 200,
          category: "TRAVEL",
          status: ClaimStatus.PENDING,
          expenseDate: new Date("2026-09-02"),
        },
        {
          companyId: company.id,
          employeeId: anilEmp.id,
          description: "Travel allowance to client office",
          amount: 250,
          category: "TRAVEL",
          status: ClaimStatus.PENDING,
          expenseDate: new Date("2026-08-14"),
        },
        {
          companyId: company.id,
          employeeId: anilEmp.id,
          description: "Food & refreshments during audit",
          amount: 220,
          category: "FOOD",
          status: ClaimStatus.PENDING,
          expenseDate: new Date("2026-08-12"),
        },
      ],
    });
    console.log("✅ Seeded reimbursement requests");
  }

  // 8. Seed CRM Leads
  await prisma.cRMLead.createMany({
    data: [
      {
        companyId: company.id,
        name: "Kiran Kumar",
        companyName: "Apex Warehousing Pvt Ltd",
        phone: "9848012345",
        email: "kiran@apexwarehousing.in",
        status: "NEW",
        leadValue: 120000,
      },
      {
        companyId: company.id,
        name: "Venkatesh Rao",
        companyName: "Delta Express Cargo",
        phone: "9848023456",
        email: "v.rao@deltaexpress.com",
        status: "CONTACTED",
        leadValue: 85000,
      },
      {
        companyId: company.id,
        name: "Srinivas Rao",
        companyName: "Sri Sai Supermarket Chain",
        phone: "9848056789",
        email: "srinivas@srisaigroup.in",
        status: "WON",
        leadValue: 350000,
      },
    ],
  });
  console.log("✅ Seeded CRM leads on MongoDB!");

  console.log("🎉 All live data successfully seeded on MongoDB!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });