// backend/src/scripts/adapters/claimmdAdapter.js

export const transformClaimMDPayer = (raw, companyRef, employeeRef) => {
  const altNames = raw.payer_alt_names?.split(',').map(a => a.trim()).filter(a => !!a) || [];

  return {
    companyRef,
    payerInfo: {
      payerName: raw.payer_name?.trim(),
      payerType: mapClaimMDType(raw.payer_type),
      payerCategory: raw.secondary_support === "yes" ? "Secondary" : "Primary",
      doingBusinessAs: altNames
    },
    identifiers: {
      payerIdNumber: raw.payerid,
      clearinghouseIds: [{
        clearinghouseName: "ClaimMD",
        payerId: raw.payerid,
        isActive: true
      }]
    },
    coverageInfo: {
      linesOfBusiness: extractLOB(raw),
      serviceAreas: raw.payer_state ? [{
        state: raw.payer_state,
        counties: [],
        zipCodes: [],
        isStatewide: true
      }] : []
    },
    claimsProcessing: {
      electronicSubmission: {
        isSupported: raw.services?.includes("ERA") || false,
        clearinghouses: raw.services?.includes("ERA") ? ["ClaimMD"] : []
      }
    },
    paymentInfo: {
      eraSupported: raw.eras === "enrollment",
      eobDelivery: raw.eras === "enrollment" ? "Electronic" : "Paper"
    },
    systemConfig: {
      isActive: true,
      isPreferred: false,
      riskLevel: "Medium",
      dataSource: "API Sync"
    },
    auditInfo: {
      createdBy: employeeRef,
      lastModifiedBy: employeeRef
    }
  };
};

// 🔁 Helper to map type
const mapClaimMDType = (type) => {
  switch (type?.toLowerCase()) {
    case "commercial": return "Commercial Insurance";
    case "workerscomp": return "Workers Compensation";
    case "medicare": return "Medicare";
    case "medicaid": return "Medicaid";
    case "selfpay": return "Self Pay";
    default: return "Other";
  }
};

// 🔁 Helper to extract line of business
const extractLOB = (raw) => {
  const lob = [];

  if (raw["1500claims"] === "yes") lob.push("Individual Health");
  if (raw["ub92claims"] === "yes") lob.push("Group Health");
  if (raw["dentalclaims"] === "yes") lob.push("Dental");
  if (raw["workerscomp"] === "yes") lob.push("Workers Compensation");

  return [...new Set(lob)];
};
