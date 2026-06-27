// SPA mode — all views on one page, portal switching via state.activePortal
const IS_SPA = true;
const PAGE_ROLE = null;
const IS_LOGIN_PAGE = false;

const statuses = [
  "Request Submitted",
  "Under Review",
  "Quotation Sent",
  "Waiting Approval",
  "Pickup Scheduled",
  "Device Picked Up",
  "Under Diagnosis",
  "Repair In Progress",
  "Quality Check",
  "Invoice Sent",
  "Payment Initiated",
  "Ready for Delivery",
  "Delivered",
  "Payment Received",
  "Closed"
];

const orderStatuses = [
  "Pending Pickup",
  "Pickup Assigned",
  "Picked Up",
  "Out for Delivery",
  "Delivered"
];

const storageKey = "repairingmaster-state-v4";
const ownerCommissionRate = 0.10;

const portalAccess = {
  customer: ["customer", "marketplace"],
  marketplace: ["marketplace"],
  technician: ["technician"],
  repairmaster: ["repairmaster", "marketplace"],
  coordinator: ["coordinator", "customer", "technician"],
  admin: ["customer", "coordinator", "technician", "repairmaster", "admin", "marketplace"]
};

const portalLanding = {
  customer: "customer",
  marketplace: "marketplace",
  technician: "technician",
  repairmaster: "repairmaster",
  coordinator: "coordinator",
  admin: "admin"
};

const portalNames = {
  service: "Customer Access",
  marketplace: "Device on sell",
  technician: "Technician Portal",
  repairmaster: "RepairingMaster Portal",
  coordinator: "Coordinator Portal",
  admin: "Admin Portal"
};

const defaultDeviceIcon = "image/device-repair.png";

let state = {};

function displayPrice(basePrice) {
  return Math.round(Number(basePrice || 0) * (1 + ownerCommissionRate));
}

const initialMarketplace = [
  { model: "iPhone 13 Pro", grade: "A+", basePrice: 41817, warranty: "12 months", owner: "FixHub Andheri", sold: false, images: [defaultDeviceIcon], currentSlide: 0 },
  { model: "Galaxy S23 Ultra", grade: "A", basePrice: 38181, warranty: "9 months", owner: "TechCare Koramangala", sold: false, images: [defaultDeviceIcon], currentSlide: 0 },
  { model: "Pixel 8", grade: "B", basePrice: 26363, warranty: "6 months", owner: "Prime Mobile Lab Noida", sold: false, images: [defaultDeviceIcon], currentSlide: 0 },
  { model: "OnePlus 12", grade: "A", basePrice: 34545, warranty: "9 months", owner: "FixHub Andheri", sold: false, images: [defaultDeviceIcon], currentSlide: 0 },
  { model: "iPhone 12", grade: "C", basePrice: 20000, warranty: "3 months", owner: "TechCare Koramangala", sold: false, images: [defaultDeviceIcon], currentSlide: 0 },
  { model: "Galaxy Z Flip 5", grade: "B", basePrice: 36363, warranty: "6 months", owner: "Prime Mobile Lab Noida", sold: false, images: [defaultDeviceIcon], currentSlide: 0 },
  { model: "Xiaomi 14", grade: "A+", basePrice: 31817, warranty: "12 months", owner: "FixHub Andheri", sold: false, images: [defaultDeviceIcon], currentSlide: 0 },
  { model: "iPad Mini", grade: "A", basePrice: 30000, warranty: "9 months", owner: "TechCare Koramangala", sold: false, images: [defaultDeviceIcon], currentSlide: 0 },
  { model: "iPod Touch 7", grade: "A", basePrice: 13636, warranty: "6 months", owner: "Prime Mobile Lab Noida", sold: false, images: [defaultDeviceIcon], currentSlide: 0 },
  { model: "Fast Charger 45W", grade: "A+", basePrice: 1364, warranty: "12 months", owner: "FixHub Andheri", sold: false, images: [defaultDeviceIcon], currentSlide: 0 },
  { model: "Wireless Earphone", grade: "A", basePrice: 2273, warranty: "6 months", owner: "TechCare Koramangala", sold: false, images: [defaultDeviceIcon], currentSlide: 0 },
  { model: "Necklace Earphone", grade: "B", basePrice: 1818, warranty: "3 months", owner: "Prime Mobile Lab Noida", sold: false, images: [defaultDeviceIcon], currentSlide: 0 }
];

const defaultState = {
  activeView: "customer",
  activePortal: null,
  activeUser: null,
  activeRequestId: "RM-1024",
  coordDetailMode: false,
  techDetailMode: false,
  rmDetailMode: false,
  custDetailMode: false,
  adminDetailMode: false,
  applications: [
    { name: "Admin Team", email: "admin@repairingmaster.in", phone: "+91-9999999999", role: "Admin", location: "All India", details: { "Qualifications & reason": "Platform operations manager" }, status: "Approved" }
  ],
  minServiceFee: 150,
  taxPercent: 18,
  serviceChargePercent: 10,
  baseInspectionFee: 499,
  repairParts: [
    { name: "Screen Replacement", cost: 2000, stock: 10 },
    { name: "Technician Charge", cost: 250, stock: 999 },
    { name: "Battery Replacement", cost: 2299, stock: 8 },
    { name: "Charging Port", cost: 1799, stock: 12 },
    { name: "Motherboard / IC Repair", cost: 3999, stock: 5 },
    { name: "Glass Replacement", cost: 1799, stock: 7 },
    { name: "Back Cover", cost: 999, stock: 15 }
  ],
  marketplace: initialMarketplace,
  marketOrders: [],
  requests: [
    {
      id: "RM-1024",
      customer: "Priya Sharma",
      phone: "+91-98765-43210",
      deviceType: "Smartphone",
      brand: "Apple",
      model: "iPhone 14 Pro",
      issue: "Screen damage",
      address: "Bandra West, Mumbai, Maharashtra",
      statusIndex: 5,
      pickupTech: "Ravi - Mumbai West",
      repairPartner: "FixHub Andheri",
      quoteAmount: 3568,
      quoteApproved: true,
      paymentStatus: "Pending",
      paymentMethod: "",
      invoiceSent: false,
      otpVerified: true,
      checks: { accepted: true, otp: true, photos: false, handover: false, delivery: false },
      conditionImages: [],
      requirements: { backCover: "Matte Black", glassType: "Tempered Glass" },
    quoteItems: [
      { name: "Screen Replacement", cost: 2000 },
      { name: "Technician Charge", cost: 250 }
    ],
    taxPercent: 18,
    taxAmount: 544,
    serviceChargePercent: 10,
    serviceChargeAmount: 275
    },
    {
      id: "RM-1025",
      customer: "Aarav Mehta",
      phone: "+91-87654-32109",
      deviceType: "Smartphone",
      brand: "Samsung",
      model: "Galaxy S24",
      issue: "Battery issue",
      address: "Indiranagar, Bengaluru, Karnataka",
      statusIndex: 7,
      pickupTech: "Arjun - Bengaluru Central",
      repairPartner: "TechCare Koramangala",
      quoteAmount: 4299,
      quoteApproved: true,
      paymentStatus: "Pending",
      paymentMethod: "",
      invoiceSent: false,
      otpVerified: true,
      checks: { accepted: true, otp: true, photos: true, handover: true, delivery: false },
      conditionImages: [],
      requirements: { backCover: "Midnight Blue", glassType: "Standard Glass" },
    quoteItems: [
      { name: "Battery Replacement", cost: 2299 },
      { name: "Technician Charge", cost: 250 },
      { name: "Screen Replacement", cost: 2000 }
    ],
    taxPercent: 18,
    taxAmount: 0,
    serviceChargePercent: 10,
    serviceChargeAmount: 0
    },
    {
      id: "RM-1026",
      customer: "Neha Verma",
      phone: "+91-76543-21098",
      deviceType: "Smartphone",
      brand: "Google",
      model: "Pixel 9",
      issue: "Charging port fault",
      address: "Sector 62, Noida, Uttar Pradesh",
      statusIndex: 10,
      pickupTech: "Imran - Delhi NCR",
      repairPartner: "Prime Mobile Lab Noida",
      quoteAmount: 5999,
      quoteApproved: true,
      paymentStatus: "Pending",
      paymentMethod: "",
      invoiceSent: false,
      otpVerified: true,
      checks: { accepted: true, otp: true, photos: true, handover: true, delivery: false },
      conditionImages: [],
      requirements: { backCover: "Clear Transparent", glassType: "Tempered Glass" },
    quoteItems: [
      { name: "Display Replacement", cost: 6499 },
      { name: "Labor", cost: 1299 }
    ],
    taxPercent: 0,
    taxAmount: 0
    }
  ]
};

const inventory = [
  { part: "iPhone 14 Pro OLED", stock: 8, health: "Available" },
  { part: "Samsung S24 Battery", stock: 3, health: "Low stock" },
  { part: "USB-C Charging Flex", stock: 19, health: "Available" },
  { part: "Water Damage Kit", stock: 6, health: "Available" }
];

const vendors = [
  { name: "FixHub Andheri", score: "96%", jobs: 42 },
  { name: "TechCare Koramangala", score: "91%", jobs: 35 },
  { name: "Prime Mobile Lab Noida", score: "89%", jobs: 29 }
];

let marketFilter = "All";

async function loadState() {
  try {
    const { data } = await supabase.from('app_state').select('data').eq('id', 1).single();
    if (data && data.data && Object.keys(data.data).length > 1) {
      return normalizeState(data.data);
    }
  } catch (e) { /* fall through */ }
  return structuredClone(defaultState);
}

function normalizeState(source) {
  const marketplace = (source.marketplace || structuredClone(defaultState.marketplace)).map((item) => {
    if (item.price && !item.basePrice) {
      return { ...item, basePrice: Math.round(item.price / (1 + ownerCommissionRate)), price: undefined };
    }
    if (!item.images) {
      return { ...item, images: item.image ? [item.image] : [defaultDeviceIcon], currentSlide: 0 };
    }
    return { ...item, currentSlide: item.currentSlide || 0 };
  });
  const requests = (source.requests || structuredClone(defaultState.requests)).map((r) => ({
    ...r,
    conditionImages: r.conditionImages || [],
    requestImages: r.requestImages || [],
    phone: r.phone || '',
    deviceType: r.deviceType || 'Smartphone',
    invoiceSent: r.invoiceSent || false,
    paymentMethod: r.paymentMethod || "",
    requirements: r.requirements || { backCover: "", glassType: "" },
    quoteItems: r.quoteItems || [],
    taxPercent: r.taxPercent || 0,
    taxAmount: r.taxAmount || 0,
    serviceChargePercent: r.serviceChargePercent || 0,
    serviceChargeAmount: r.serviceChargeAmount || 0,
    crmNotes: r.crmNotes || []
  }));
  const defaultApps = structuredClone(defaultState.applications);
  const storedApps = source.applications || [];
  const mergedApps = [...defaultApps];
  storedApps.forEach((app) => {
    const exists = mergedApps.some((a) => a.name === app.name && a.role === app.role);
    if (!exists) mergedApps.push(app);
  });
  return {
    ...structuredClone(defaultState),
    ...source,
    applications: mergedApps,
    marketplace,
    requests,
    marketOrders: source.marketOrders || [],
    repairParts: source.repairParts || structuredClone(defaultState.repairParts),
    baseInspectionFee: source.baseInspectionFee !== undefined ? source.baseInspectionFee : 499,
    taxPercent: source.taxPercent !== undefined ? source.taxPercent : 18,
    serviceChargePercent: source.serviceChargePercent !== undefined ? source.serviceChargePercent : 10
  };
}

async function saveState() {
  try {
    const dataToSave = {
      requests: state.requests || [],
      marketplace: state.marketplace || [],
      applications: state.applications || [],
      marketOrders: state.marketOrders || [],
      repairParts: state.repairParts || [],
      serviceChargePercent: state.serviceChargePercent || 10,
      baseInspectionFee: state.baseInspectionFee || 499,
      taxPercent: state.taxPercent || 18
    };
    await supabase.from('app_state').upsert({ id: 1, data: dataToSave });
  } catch (e) {
    console.error('Supabase save failed:', e);
  }
}

function formatCurrency(amount) {
  return `INR ${Number(amount || 0).toLocaleString("en-IN")}`;
}

function commissionFor(price) {
  return Math.round(Number(price || 0) * ownerCommissionRate);
}

function activeRequest() {
  const matched = state.requests.find((request) => request.id === state.activeRequestId);
  if (matched) return matched;
  // Role-specific fallback: show first assigned request
  const user = state.activeUser;
  if (user && user.role === 'technician') {
    return state.requests.find(r => r.pickupTech === user.name && r.statusIndex < 14) || state.requests[0];
  }
  if (user && user.role === 'repairmaster') {
    return state.requests.find(r => r.repairPartner === user.name && r.statusIndex < 14) || state.requests[0];
  }
  if (user && user.role === 'customer') {
    return state.requests.find(r => r.customer === user.name) || state.requests[0];
  }
  return state.requests[0];
}

function showToast(message) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.classList.add("show");
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => toast.classList.remove("show"), 2600);
}

function allowedViews() {
  return portalAccess[state.activePortal] || [];
}

function switchView(view) {
  const allowed = allowedViews();
  const nextView = allowed.length && !allowed.includes(view) ? allowed[0] : view;
  state.activeView = nextView;

  document.querySelectorAll(".view").forEach((panel) => {
    panel.classList.toggle("active", panel.id === nextView);
  });

  const titles = {
    customer: "Customer App",
    coordinator: "Coordinator Dashboard",
    technician: "Technician App",
    repairmaster: "RepairingMaster Portal",
    admin: "Admin Console",
    marketplace: "Device on sell"
  };

  document.getElementById("operationSelect").value = nextView;
  document.getElementById("pageTitle").textContent = titles[nextView];
  document.getElementById("advanceStatus").classList.toggle("hidden", ["marketplace", "admin"].includes(nextView));
  document.querySelector(".status-strip").classList.toggle("hidden", ["marketplace", "admin"].includes(nextView));
  saveState();
}

// ─── Hash-based routing for per-request URLs ─────
const ROLE_DETAIL_MODES = {
  coordinator: 'coordDetailMode',
  technician: 'techDetailMode',
  repairmaster: 'rmDetailMode',
  customer: 'custDetailMode',
  admin: 'adminDetailMode'
};

function navigateTo(hash) {
  window.location.hash = hash;
}

function handleRoute() {
  const hash = window.location.hash.slice(1) || '';
  const parts = hash.split('/').filter(Boolean);
  if (!hash) {
    return;
  }
  // Support #request/ID and #role/request/ID
  if (parts[0] === 'request' && parts[1]) {
    const rid = parts[1];
    if (state.requests.find(r => r.id === rid)) {
      state.activeRequestId = rid;
      const modeKey = ROLE_DETAIL_MODES[state.activePortal];
      if (modeKey) {
        Object.values(ROLE_DETAIL_MODES).forEach(k => state[k] = false);
        state[modeKey] = true;
        renderAll();
      }
      return;
    }
  }
  // Cross-page format: #role/request/ID
  const role = parts[0];
  if (parts[1] === 'request' && parts[2]) {
    const modeKey = ROLE_DETAIL_MODES[role];
    if (modeKey && state.requests.find(r => r.id === parts[2])) {
      state.activeRequestId = parts[2];
      Object.values(ROLE_DETAIL_MODES).forEach(k => state[k] = false);
      state[modeKey] = true;
      renderAll();
      return;
    }
  }
}

window.addEventListener('hashchange', handleRoute);
// Handle initial hash on page load
handleRoute();

function switchPortal(role, requestId) {
  state.activePortal = role;
  state.activeView = portalLanding[role] || role;
  if (requestId) {
    state.activeRequestId = requestId;
    const modeKey = ROLE_DETAIL_MODES[role];
    if (modeKey) {
      Object.values(ROLE_DETAIL_MODES).forEach(k => state[k] = false);
      state[modeKey] = true;
    }
  }
  renderAll();
  showToast(`${portalNames[role]} opened`);
}

function closeRoleDetail(role) {
  const modeKey = ROLE_DETAIL_MODES[role];
  if (modeKey) state[modeKey] = false;
  window.location.hash = '#' + role;
  renderAll();
}

function applyPortalAccess() {
  const allowed = allowedViews();
  const select = document.getElementById("operationSelect");
  Array.from(select.options).forEach((option) => {
    option.hidden = allowed.length > 0 && !allowed.includes(option.value);
    option.disabled = option.hidden;
  });
  document.getElementById("portalEyebrow").textContent = `${portalNames[state.activePortal] || "Portal"} - India operations`;
}

function loginPortal(portal) {
  state.activePortal = portal;
  state.activeView = portalLanding[portal] || 'customer';
  document.getElementById('loginScreen').style.display = 'none';
  document.getElementById('appShell').style.display = '';
  renderAll();
  showToast(`${portalNames[portal]} opened`);
}

function updateUserBadge() {
  const user = state.activeUser || { name: "User", email: "", role: state.activePortal };
  document.getElementById("userName").textContent = user.name;
  document.getElementById("userRoleBadge").textContent = user.role || state.activePortal || "";
  document.getElementById("userAvatar").textContent = (user.name || "U").charAt(0).toUpperCase();
}

async function logoutPortal() {
  state.activePortal = null;
  state.activeUser = null;
  await saveState();
  await signOutUser();
  document.getElementById('loginScreen').style.display = '';
  document.getElementById('appShell').style.display = 'none';
  window.location.hash = '';
}

function renderProgress() {
  const request = activeRequest();
  document.getElementById("statusText").textContent = statuses[request.statusIndex];
  document.getElementById("progressTrack").innerHTML = statuses.map((status, index) => {
    const className = index < request.statusIndex ? "step done" : index === request.statusIndex ? "step current" : "step";
    return `<span class="${className}" data-label="${status}"></span>`;
  }).join("");
}

function renderCustomer() {
  // Detail mode
  if (state.custDetailMode) {
    document.getElementById("custDashboard").style.display = 'none';
    document.getElementById("custRequestView").style.display = '';
    renderCustDetail(activeRequest());
    return;
  }
  document.getElementById("custDashboard").style.display = '';
  document.getElementById("custRequestView").style.display = 'none';

  const request = activeRequest();
  document.getElementById("activeRequestLabel").textContent = request.id;
  document.getElementById("activeRequestMeta").textContent = `${request.model} - ${request.issue}`;
  document.getElementById("deviceTitle").textContent = request.model;
  document.getElementById("deviceIssue").textContent = `${request.issue}, pickup from ${request.address}`;
  const nameInput = document.getElementById("nameInput");
  if (nameInput && state.activeUser && state.activeUser.name && !nameInput.value) {
    nameInput.value = state.activeUser.name;
  }

  // Status guidance — role-specific message per status
  const guidance = document.getElementById("statusGuidance");
  if (guidance) {
    const customerMsgs = {
      0: "Your request has been submitted. A coordinator will review and accept it shortly.",
      1: "Your request is under review. Please provide your back cover and glass preferences below to help us prepare an accurate quotation.",
      2: "Your quotation is ready. Review the details and approve to proceed.",
      3: "Quotation approved! We'll schedule a pickup for your device.",
      4: "A technician has been assigned for pickup. Keep your device ready.",
      5: "Device picked up. Our repairmaster is inspecting it.",
      6: "Your device is under diagnosis.",
      7: "Repair in progress.",
      8: "Quality check in progress.",
      9: "Invoice ready — complete your payment to proceed.",
      10: "Payment received. We'll prepare your device for delivery.",
      11: "Your device is ready for delivery.",
      12: "Your device is out for delivery!",
      13: "Device delivered. Thank you for choosing RepairingMaster!",
      14: "Request closed. Thank you!"
    };
    guidance.textContent = customerMsgs[request.statusIndex] || '';
  }

  // Requirements section - show at status 1 (under review) before quote sent
  const reqSection = document.getElementById("requirementsSection");
  if (reqSection) {
    reqSection.style.display = request.statusIndex === 1 ? "block" : "none";
    if (request.requirements) {
      document.getElementById("backCoverInput").value = request.requirements.backCover || "";
      document.getElementById("glassInput").value = request.requirements.glassType || "";
    }
  }

  // Quote section
  const quoteBox = document.querySelector(".quote-box");
  if (quoteBox) {
    const showQuote = request.quoteAmount > 0 || request.statusIndex >= 2;
    quoteBox.style.display = showQuote ? "" : "none";
  }
  document.getElementById("quoteAmount").textContent = formatCurrency(request.quoteAmount);
  if (request.statusIndex >= 3) {
    document.getElementById("quoteStatus").textContent = "Quotation approved, repair can proceed";
  } else if (request.statusIndex >= 2) {
    document.getElementById("quoteStatus").textContent = "Waiting for customer approval";
  } else {
    document.getElementById("quoteStatus").textContent = "Waiting for quotation";
  }
  document.getElementById("approveQuote").disabled = request.quoteApproved || request.statusIndex < 2;
  document.getElementById("approveQuote").textContent = request.quoteApproved ? "Approved" : "Approve";

  const itemsContainer = document.getElementById("quoteItemsList");
  if (itemsContainer) {
    if (request.quoteItems && request.quoteItems.length) {
      const base = request.quoteItems.reduce((s, i) => s + i.cost, 0);
      const scAmt = request.serviceChargeAmount || 0;
      const taxAmt = request.taxAmount || 0;
      const subtotalAmt = request.quoteAmount - taxAmt - scAmt;
      itemsContainer.innerHTML = request.quoteItems.map((item) => `
        <div class="quote-item-row">
          <span>${item.name}</span>
          <span>${formatCurrency(item.cost)}</span>
        </div>
      `).join("") + `
        <div class="quote-item-row quote-item-base">
          <span>Base inspection fee</span>
          <span>${formatCurrency(state.baseInspectionFee || 499)}</span>
        </div>
        <div class="quote-item-row quote-item-subtotal">
          <span>Subtotal</span>
          <span>${formatCurrency(subtotalAmt)}</span>
        </div>
        ${scAmt ? `
        <div class="quote-item-row">
          <span>Service charge (${request.serviceChargePercent || 0}%)</span>
          <span>${formatCurrency(scAmt)}</span>
        </div>
        ` : ""}
        ${taxAmt ? `
        <div class="quote-item-row">
          <span>GST (${request.taxPercent || 0}%)</span>
          <span>${formatCurrency(taxAmt)}</span>
        </div>
        ` : ""}
        <div class="quote-item-row quote-item-total">
          <span>Total</span>
          <span>${formatCurrency(request.quoteAmount)}</span>
        </div>
      `;
    } else {
      itemsContainer.innerHTML = "";
    }
  }

  // Condition upload - show before pickup (status 3-4)
  const condSection = document.getElementById("conditionSection");
  if (condSection) {
    condSection.style.display = (request.statusIndex >= 3 && request.statusIndex <= 4) ? "" : "none";
  }

  const cv = document.getElementById("conditionPreviews");
  if (cv) {
    cv.innerHTML = request.conditionImages.map((img) => `<img src="${img}" alt="Device condition" loading="lazy">`).join("");
  }

  // Invoice & payment section - show from Invoice Sent through Payment Received
  const invSection = document.getElementById("invoiceSection");
  if (invSection) {
    const showInvoice = request.statusIndex >= 9 && request.statusIndex <= 13;
    invSection.style.display = showInvoice ? "block" : "none";
    document.getElementById("invoiceAmount").textContent = formatCurrency(request.quoteAmount);
    const payOnlineBtn = document.getElementById("payOnlineBtn");
    const payCodBtn = document.getElementById("payCodBtn");
    const confirmEl = document.getElementById("paymentConfirmation");
    if (request.paymentMethod === "Online") {
      if (request.statusIndex >= 13) {
        confirmEl.textContent = "Payment received. Thank you!";
      } else {
        confirmEl.textContent = "Payment received. Repair will begin shortly.";
      }
      confirmEl.style.display = "block";
      if (payOnlineBtn) payOnlineBtn.style.display = "none";
      if (payCodBtn) payCodBtn.style.display = "none";
    } else if (request.paymentMethod === "Cash on Delivery") {
      if (request.statusIndex >= 13) {
        confirmEl.textContent = "COD payment collected. Thank you!";
      } else {
        confirmEl.textContent = "Cash on Delivery selected. Pay when the device is delivered.";
      }
      confirmEl.style.display = "block";
      if (payOnlineBtn) payOnlineBtn.style.display = "none";
      if (payCodBtn) payCodBtn.style.display = "none";
    } else if (request.statusIndex === 9) {
      confirmEl.style.display = "none";
      if (payOnlineBtn) payOnlineBtn.style.display = "";
      if (payCodBtn) payCodBtn.style.display = "";
    } else {
      confirmEl.style.display = "none";
    }
  }

  // Show customer panel when there's an active request for this customer
  const panel = document.getElementById("customerPanel");
  if (panel) {
    const myName = state.activeUser ? state.activeUser.name : "";
    const myRequests = state.requests.filter(r => r.customer === myName);
    panel.style.display = myRequests.length ? "block" : "none";
  }

  // Customer request list (if multiple requests)
  const custName = state.activeUser?.name || '';
  const myReqs = state.requests.filter(r => r.customer === custName);
  const reqListEl = document.getElementById("custRequestsList");
  if (reqListEl) {
    if (myReqs.length <= 1) {
      reqListEl.style.display = 'none';
    } else {
      reqListEl.style.display = '';
      reqListEl.innerHTML = myReqs.map(r => `
        <button class="request-row" onclick="navigateTo('#customer/request/${r.id}')" style="text-align:left;width:100%">
          <div><h3>${r.id} — ${r.model}</h3><p>${r.issue}</p></div>
          <span class="status-pill">${statuses[r.statusIndex]}</span>
        </button>
      `).join('');
    }
  }

  renderLocalDeals();

  document.getElementById("customerTimeline").innerHTML = statuses.map((status, index) => {
    const stateClass = index < request.statusIndex ? "done" : index === request.statusIndex ? "current" : "";
    const note = index < request.statusIndex ? "Completed" : index === request.statusIndex ? "Current step" : "Upcoming";
    return `
      <div class="timeline-item ${stateClass}">
        <span class="timeline-dot"></span>
        <div><strong>${status}</strong><br><span>${note}</span></div>
      </div>
    `;
  }).join("");
}

function renderCustDetail(req) {
  if (!req) { document.getElementById("custRequestContent").innerHTML = '<div class="empty-state">Request not found</div>'; return; }
  document.getElementById("custDetailTitle").textContent = `${req.id} — ${req.model}`;
  document.getElementById("custDetailStatus").textContent = statuses[req.statusIndex];
  const content = document.getElementById("custRequestContent");
  const imgs = [...(req.requestImages || []), ...(req.conditionImages || [])].filter(Boolean);
  const customerMsgs = {
    0: "Your request has been submitted. A coordinator will review and accept it shortly.",
    1: "Your request is under review. Please provide your back cover and glass preferences below to help us prepare an accurate quotation.",
    2: "Your quotation is ready. Review the details and approve to proceed.",
    3: "Quotation approved! We'll schedule a pickup for your device.",
    4: "A technician has been assigned for pickup. Keep your device ready.",
    5: "Device picked up. Our repairmaster is inspecting it.",
    6: "Your device is under diagnosis.",
    7: "Repair in progress.",
    8: "Quality check in progress.",
    9: "Invoice ready — complete your payment to proceed.",
    10: "Payment received. We'll prepare your device for delivery.",
    11: "Your device is ready for delivery.",
    12: "Your device is out for delivery!",
    13: "Device delivered. Thank you for choosing RepairingMaster!",
    14: "Request closed. Thank you!"
  };
  const timeStr = req.createdAt ? new Date(req.createdAt).toLocaleDateString() : '—';
  content.innerHTML = `
    <div class="rd-action-card" style="border-left:4px solid var(--teal)">
      <div class="rd-action-header"><span class="rd-action-step">Status</span></div>
      <p class="rd-action-msg">${customerMsgs[req.statusIndex] || ''}</p>
    </div>
    <div class="rd-grid">
      <div class="rd-info-card">
        <p class="eyebrow">Request</p>
        <table class="coord-info-table">
          <tr><td>ID</td><td>${escHtml(req.id)}</td></tr>
          <tr><td>Created</td><td>${timeStr}</td></tr>
          <tr><td>Status</td><td>${statuses[req.statusIndex]}</td></tr>
        </table>
      </div>
      <div class="rd-info-card">
        <p class="eyebrow">Device</p>
        <table class="coord-info-table">
          <tr><td>Type</td><td>${escHtml(req.deviceType || 'Smartphone')}</td></tr>
          <tr><td>Brand</td><td>${req.brand || '—'}</td></tr>
          <tr><td>Model</td><td>${escHtml(req.model)}</td></tr>
          <tr><td>Issue</td><td>${escHtml(req.issue)}</td></tr>
        </table>
      </div>
      <div class="rd-info-card">
        <p class="eyebrow">Quotation</p>
        ${req.quoteAmount ? '<p style="font-size:24px;font-weight:700;color:var(--teal)">' + formatCurrency(req.quoteAmount) + '</p>' : '<p style="color:var(--muted)">Awaiting quotation</p>'}
        ${req.quoteItems && req.quoteItems.length ? '<div style="font-size:12px">' + req.quoteItems.map(i => '<div style="display:flex;justify-content:space-between;padding:2px 0"><span>' + escHtml(i.name) + '</span><span>' + formatCurrency(i.cost) + '</span></div>').join('') + '</div>' : ''}
      </div>
    </div>
    <div class="rd-info-card" style="margin-top:14px">
      <p class="eyebrow">Notes from team</p>
      <div id="custCrmNotesList">${(req.crmNotes || []).length ? (req.crmNotes || []).map(n => '<div style="font-size:12px;padding:6px 0;border-bottom:1px solid var(--line)"><strong>' + escHtml(n.author || '—') + '</strong> <span style="color:var(--muted)">' + (n.date || '') + '</span><br>' + escHtml(n.text) + '</div>').join('') : '<span style="color:var(--muted);font-size:12px">No notes from the team yet</span>'}</div>
    </div>
    ${imgs.length ? '<div class="rd-info-card" style="margin-top:14px"><p class="eyebrow">Photos</p><div class="rd-photos">' + imgs.map(u => '<img src="' + u + '" loading="lazy">').join('') + '</div></div>' : ''}
    <div class="timeline" style="margin-top:16px" id="custDetailTimeline"></div>
  `;
  const tl = document.getElementById("custDetailTimeline");
  if (tl) {
    tl.innerHTML = statuses.map((status, index) => {
      const stateClass = index < req.statusIndex ? "done" : index === req.statusIndex ? "current" : "";
      const note = index < req.statusIndex ? "Completed" : index === req.statusIndex ? "Current step" : "Upcoming";
      return '<div class="timeline-item ' + stateClass + '"><span class="timeline-dot"></span><div><strong>' + status + '</strong><br><span>' + note + '</span></div></div>';
    }).join('');
  }
}

document.getElementById("custDetailBackBtn")?.addEventListener("click", () => closeRoleDetail('customer'));

// Coordinator action needed per status
const COORD_ACTIONS = {
  0:  { urgency: 'critical', label: 'Accept & review',   msg: 'New request — accept and review customer requirements' },
  1:  { urgency: 'high',     label: 'Prepare quotation', msg: 'Under review — evaluate device issue & send quotation' },
  2:  { urgency: 'waiting',  label: 'Wait for approval', msg: 'Quotation sent — customer is reviewing' },
  3:  { urgency: 'critical', label: 'Assign team',       msg: 'Customer approved — assign technician & repairmaster' },
  4:  { urgency: 'info',     label: 'Monitor pickup',    msg: 'Technician assigned — pickup in progress' },
  5:  { urgency: 'info',     label: 'Monitor diagnosis', msg: 'Device picked up — repairmaster is diagnosing' },
  6:  { urgency: 'info',     label: 'Monitor repair',    msg: 'Device under diagnosis' },
  7:  { urgency: 'info',     label: 'Monitor QC',        msg: 'Repair in progress' },
  8:  { urgency: 'high',     label: 'Send invoice',      msg: 'Quality check done — generate & send invoice' },
  9:  { urgency: 'waiting',  label: 'Wait for payment',  msg: 'Invoice sent — waiting for customer payment' },
  10: { urgency: 'critical', label: 'Verify payment',    msg: 'Payment initiated — verify and confirm' },
  11: { urgency: 'high',     label: 'Assign delivery',   msg: 'Payment confirmed — assign technician for delivery' },
  12: { urgency: 'info',     label: 'Delivery in progress', msg: 'Device out for delivery' },
  13: { urgency: 'high',     label: 'Close request',     msg: 'Device delivered & payment received — close ticket' },
  14: { urgency: 'done',     label: 'Completed',         msg: 'Request closed' }
};

function getCoordActionsForRequest(r) {
  const action = COORD_ACTIONS[r.statusIndex] || { urgency: 'info', label: 'Review', msg: '' };
  return action;
}

function escHtml(s) { return String(s || '').replace(/[&<>"']/g, function(c){ return ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[c]; }); }

function renderCoordinator() {
  // ── Detail mode: show full request wizard ──
  if (state.coordDetailMode) {
    document.getElementById("coordinatorDashboard").style.display = 'none';
    document.getElementById("coordinatorRequestView").style.display = '';
    const req = activeRequest();
    renderCoordinatorRequestDetail(req);
    return;
  }

  // ── Dashboard mode ──
  document.getElementById("coordinatorDashboard").style.display = '';
  document.getElementById("coordinatorRequestView").style.display = 'none';

  const requests = state.requests || [];
  const open = requests.filter((r) => r.statusIndex < statuses.length - 1).length;
  const closed = requests.filter((r) => r.statusIndex === statuses.length - 1).length;
  const revenue = requests.reduce((sum, r) => sum + r.quoteAmount, 0);
  document.getElementById("openTickets").textContent = open;
  document.getElementById("revenueMetric").textContent = formatCurrency(revenue);
  document.getElementById("avgRepairTime").textContent = closed ? `${Math.round(closed * 2.5)}h` : "—";

  const critical = []; const high = []; const info = [];
  requests.forEach(r => {
    if (r.statusIndex >= statuses.length - 1) return;
    const a = getCoordActionsForRequest(r);
    if (a.urgency === 'critical') critical.push(r);
    else if (a.urgency === 'high') high.push(r);
    else if (a.urgency === 'info' || a.urgency === 'waiting') info.push(r);
  });

  const pendingCount = critical.length + high.length;
  document.getElementById("pendingActionCount").textContent = pendingCount;
  document.getElementById("pendingCountBadge").textContent = pendingCount;

  if (critical.length && state._lastCriticalCount !== critical.length) {
    showToast(`${critical.length} urgent action${critical.length > 1 ? 's' : ''} need${critical.length > 1 ? '' : ''}s your attention`);
    state._lastCriticalCount = critical.length;
  } else if (!critical.length) { state._lastCriticalCount = 0; }

  const pendingEl = document.getElementById("pendingActionsList");
  const allPending = [...critical, ...high, ...info];
  if (!allPending.length) {
    pendingEl.innerHTML = '<div class="empty-state" style="padding:12px">All caught up — no pending actions</div>';
  } else {
    pendingEl.innerHTML = allPending.map(r => {
      const a = getCoordActionsForRequest(r);
      return `<div class="pending-action-item ${a.urgency === 'critical' ? 'urgent-critical' : a.urgency === 'high' ? 'urgent-high' : ''}" data-rid="${r.id}" onclick="navigateTo('#coordinator/request/${r.id}')">
        <span class="pending-action-icon">${a.urgency === 'critical' ? '🔴' : a.urgency === 'high' ? '🟠' : '🔵'}</span>
        <div class="pending-action-body">
          <strong>${r.id} — ${r.model}</strong>
          <span>${a.label}: ${a.msg}</span>
          <span class="pending-action-meta">${r.customer}</span>
        </div>
      </div>`;
    }).join("");
  }

  const badge = document.getElementById("notifBadge");
  if (badge && state.portal === 'coordinator') {
    const bc = pendingActionCount();
    badge.textContent = bc || '';
    badge.style.display = bc ? 'flex' : 'none';
    badge.style.background = critical.length ? '#e74c3c' : '#f39c12';
  }

  if (!requests.length) {
    document.getElementById("requestList").innerHTML = '<div class="empty-state">No service requests yet.</div>';
  } else {
    document.getElementById("requestList").innerHTML = requests.map((r) => {
      const a = getCoordActionsForRequest(r);
      const rowClass = a.urgency === 'critical' ? 'request-row row-critical' : a.urgency === 'high' ? 'request-row row-high' : 'request-row';
      return `<button class="${rowClass}" data-request="${r.id}">
        <div>
          <h3>${r.id} - ${r.model}</h3>
          <p>${r.customer} | ${r.issue}${a.urgency !== 'done' && a.urgency !== 'waiting' ? ` — ${a.label}` : ''}</p>
        </div>
        <span class="status-pill ${a.urgency === 'critical' ? 'pill-critical' : a.urgency === 'high' ? 'pill-high' : ''}">${statuses[r.statusIndex]}</span>
      </button>`;
    }).join("");
    document.querySelectorAll(".request-row").forEach(row => {
      row.addEventListener("click", () => {
        navigateTo(`#coordinator/request/${row.dataset.request}`);
      });
    });
  }

  // Side panel: compact preview
  const req = activeRequest();
  const detailEl = document.getElementById("coordinatorDetailContent");
  document.getElementById("detailPanelTitle").textContent = req ? `${req.id}` : 'Control desk';
  if (!req) {
    detailEl.innerHTML = '<div class="empty-state" style="padding:20px">Select a request from the list</div>';
  } else {
    const a = getCoordActionsForRequest(req);
    const imgs = [...(req.requestImages || []), ...(req.conditionImages || [])].filter(Boolean);
    detailEl.innerHTML = `
      <div class="coord-detail-grid">
        <div class="coord-detail-section">
          <p class="eyebrow">${statuses[req.statusIndex]}</p>
          <div style="background:${a.urgency === 'critical' ? '#fef5f5' : a.urgency === 'high' ? '#fefaf0' : '#f8fafb'};border-left:3px solid ${a.urgency === 'critical' ? '#e74c3c' : a.urgency === 'high' ? '#f39c12' : 'var(--line)'};padding:8px 12px;border-radius:4px;font-size:13px">
            <strong>${a.label}</strong>: ${a.msg}
          </div>
        </div>
        <table class="coord-info-table">
          <tr><td>Customer</td><td>${escHtml(req.customer)}</td></tr>
          <tr><td>Phone</td><td>${escHtml(req.phone || '—')}</td></tr>
          <tr><td>Device</td><td>${req.brand || ''} ${escHtml(req.model)}</td></tr>
          <tr><td>Issue</td><td>${escHtml(req.issue)}</td></tr>
        </table>
        <button class="primary-action full" onclick="navigateTo('#coordinator/request/${req.id}')" style="margin-top:8px">Open full detail →</button>
      </div>`;
  }
}

// ─── Full request detail wizard (step-by-step) ─────
function renderCoordinatorRequestDetail(req) {
  if (!req) { document.getElementById("coordinatorRequestContent").innerHTML = '<div class="empty-state">Request not found</div>'; return; }

  const a = getCoordActionsForRequest(req);
  const imgs = [...(req.requestImages || []), ...(req.conditionImages || [])].filter(Boolean);
  const isClosed = req.statusIndex >= statuses.length - 1;

  // Step progress
  const steps = statuses.map((s, i) => {
    const cls = i < req.statusIndex ? 'step-done' : i === req.statusIndex ? 'step-current' : 'step-upcoming';
    return `<span class="step-dot ${cls}" title="${s}"></span>`;
  }).join('');

  document.getElementById("detailViewTitle").textContent = `${req.id} — ${req.model}`;
  document.getElementById("detailViewStatus").textContent = statuses[req.statusIndex];
  document.getElementById("detailViewStatus").className = `status-pill ${a.urgency === 'critical' ? 'pill-critical' : a.urgency === 'high' ? 'pill-high' : ''}`;

  const content = document.getElementById("coordinatorRequestContent");
  content.innerHTML = `
    <div class="rd-steps">${steps}</div>
    <div class="rd-labels">${statuses.map((s, i) => `<span class="step-label ${i <= req.statusIndex ? 'done' : ''}">${s}</span>`).join('')}</div>

    ${!isClosed ? `
    <div class="rd-action-card" style="border-left:4px solid ${a.urgency === 'critical' ? '#e74c3c' : a.urgency === 'high' ? '#f39c12' : '#0b7f7a'}">
      <div class="rd-action-header">
        <span class="rd-action-step">Step ${req.statusIndex + 1}:</span>
        <span class="rd-action-label" style="font-weight:700;font-size:18px">${a.label}</span>
      </div>
      <p class="rd-action-msg">${a.msg}</p>
      <div class="rd-action-buttons">${renderDetailActions(req)}</div>
    </div>` : '<div class="rd-action-card" style="background:#e8f4f3;text-align:center;padding:30px"><strong>✓ Request completed</strong></div>'}

    <div class="rd-grid">
      <div class="rd-info-card">
        <p class="eyebrow">Customer details</p>
        <table class="coord-info-table">
          <tr><td>Name</td><td>${escHtml(req.customer)}</td></tr>
          <tr><td>Phone</td><td>${escHtml(req.phone || '—')}</td></tr>
          <tr><td>Address</td><td>${escHtml(req.address)}</td></tr>
        </table>
      </div>
      <div class="rd-info-card">
        <p class="eyebrow">Device details</p>
        <table class="coord-info-table">
          <tr><td>Type</td><td>${req.deviceType || 'Smartphone'}</td></tr>
          <tr><td>Brand</td><td>${req.brand || '—'}</td></tr>
          <tr><td>Model</td><td>${escHtml(req.model)}</td></tr>
          <tr><td>Issue</td><td>${escHtml(req.issue)}</td></tr>
        </table>
      </div>
      ${req.requirements && req.requirements.backCover ? `
      <div class="rd-info-card">
        <p class="eyebrow">Customer requirements</p>
        <table class="coord-info-table">
          <tr><td>Back cover</td><td>${escHtml(req.requirements.backCover)}</td></tr>
          <tr><td>Glass type</td><td>${escHtml(req.requirements.glassType)}</td></tr>
        </table>
      </div>` : ''}
      ${req.quoteAmount > 0 ? `
      <div class="rd-info-card">
        <p class="eyebrow">Quotation</p>
        <div style="font-size:24px;font-weight:700;color:var(--green)">${formatCurrency(req.quoteAmount)}</div>
        ${req.quoteItems?.length ? req.quoteItems.map(i => `<div class="quote-item-row"><span>${escHtml(i.name)}</span><span>${formatCurrency(i.cost)}</span></div>`).join('') : ''}
      </div>` : ''}
    </div>

    ${imgs.length ? `
    <div class="rd-info-card" style="margin-top:14px">
      <p class="eyebrow">Device photos</p>
      <div class="rd-photos">${imgs.map(url => `<img src="${url}" alt="Device photo" loading="lazy">`).join('')}</div>
    </div>` : ''}
    <div class="rd-info-card" style="margin-top:14px">
      <p class="eyebrow">CRM Notes</p>
      <div style="display:flex;gap:6px;margin-bottom:8px">
        <input id="crmNoteInput" placeholder="Add a note..." style="flex:1;padding:8px;border:1px solid var(--border);border-radius:6px;font-size:13px">
        <button id="crmNoteAddBtn" class="primary-action" style="white-space:nowrap">Add Note</button>
      </div>
      <div id="crmNotesList">${(req.crmNotes || []).map(n => '<div style="font-size:12px;padding:6px 0;border-bottom:1px solid var(--line)"><strong>' + escHtml(n.author || '—') + '</strong> <span style="color:var(--muted)">' + (n.date || '') + '</span><br>' + escHtml(n.text) + '</div>').join('') || '<span style="color:var(--muted);font-size:12px">No notes yet</span>'}</div>
    </div>
  `;
  document.getElementById("crmNoteAddBtn")?.addEventListener("click", () => {
    const input = document.getElementById("crmNoteInput");
    if (!input || !input.value.trim()) return;
    const req2 = activeRequest();
    if (!req2) return;
    if (!req2.crmNotes) req2.crmNotes = [];
    req2.crmNotes.push({ text: input.value.trim(), author: state.activeUser?.name || 'Unknown', date: new Date().toLocaleString() });
    input.value = '';
    saveState();
    renderCoordinatorRequestDetail(req2);
    showToast('Note added');
  });
}


function renderDetailActions(req) {
  const si = req.statusIndex;
  const rid = req.id;
  let html = '';

  if (si === 0) {
    html += `<button class="primary-action rd-btn rd-btn-accept" data-rid="${rid}">✓ Accept Request</button>
             <button class="secondary-action rd-btn rd-btn-reject" data-rid="${rid}" style="color:#e74c3c">✗ Reject</button>`;
  } else if (si === 1) {
    html += `<p style="font-size:13px;color:var(--muted);margin:0 0 6px">Customer will provide requirements (back cover, glass type). Then prepare and send quotation from the <strong>RepairingMaster</strong> portal.</p>
              <button onclick="switchPortal('repairmaster','${rid}')" class="primary-action rd-btn rd-btn-view-rm" style="display:inline-block">Go to RepairingMaster →</button>`;
  } else if (si === 3) {
    html += `<p style="font-size:13px;color:var(--muted);margin:0 0 6px">Customer approved! Assign technician and repair partner:</p>
             <select class="rd-pickup-tech" data-rid="${rid}"><option>Ravi - Mumbai West</option><option>Arjun - Bengaluru Central</option><option>Imran - Delhi NCR</option></select>
             <select class="rd-repair-partner" data-rid="${rid}" style="margin-top:4px"><option>FixHub Andheri</option><option>TechCare Koramangala</option><option>Prime Mobile Lab Noida</option></select>
             <button class="primary-action rd-btn rd-btn-assign" data-rid="${rid}" style="margin-top:8px">✓ Assign & Schedule Pickup</button>`;
  } else if (si === 10) {
    html += `<p style="font-size:13px;color:var(--muted);margin:0 0 6px">Payment has been initiated. Verify and confirm:</p>
             <button class="primary-action rd-btn rd-btn-verify-payment" data-rid="${rid}" style="background:#27ae60">✓ Confirm Payment Received</button>`;
  } else if (si >= 4 && si < 14 && si !== 10) {
    html += `<p style="font-size:13px;color:var(--muted);margin:0 0 6px">Current step: monitoring. Progress updates will appear here.</p>`;
    if (si >= 4 && si !== 10) {
      html += `<button class="secondary-action rd-btn rd-btn-assign" data-rid="${rid}">Update technician assignment</button>`;
    }
  }

  return html;
}

// ─── Coordinator action handlers (delegated) ─────
function setupCoordinatorHandlers() {
  const container = document.getElementById("coordinatorRequestContent") || document.body;
  container.addEventListener("click", async (e) => {
    const btn = e.target.closest('button.rd-btn');
    if (!btn) return;
    const rid = btn.dataset.rid;
    const request = state.requests.find(r => r.id === rid) || activeRequest();
    if (!request) return;

    if (btn.classList.contains('rd-btn-accept')) {
      request.statusIndex = 1; saveState(); renderAll();
      await notifyRoles(['coordinator'], `${request.id}: Accepted — prepare quotation now`, 'success', 'coordinator');
      if (request.customer_id) await createNotification({ user_id: request.customer_id, message: `Your request ${request.id} has been accepted and is under review.`, type: 'info' });
      showToast('Request accepted');
    }
    if (btn.classList.contains('rd-btn-reject')) {
      request.statusIndex = 14; saveState(); renderAll();
      if (request.customer_id) await createNotification({ user_id: request.customer_id, message: `Your request ${request.id} could not be accepted at this time.`, type: 'warning' });
      showToast('Request rejected');
    }
    if (btn.classList.contains('rd-btn-assign')) {
      const techEl = container.querySelector(`.rd-pickup-tech[data-rid="${rid}"]`);
      const partnerEl = container.querySelector(`.rd-repair-partner[data-rid="${rid}"]`);
      if (techEl) request.pickupTech = techEl.value;
      if (partnerEl) request.repairPartner = partnerEl.value;
      request.statusIndex = Math.max(request.statusIndex, 4);
      saveState(); renderAll();
      await notifyRoles(['technician'], `Pickup scheduled for ${request.id}`, 'info', 'technician');
      await notifyRoles(['coordinator'], `${request.id}: Technician & repair partner assigned`, 'info', 'coordinator');
      showToast('Technician & repair partner assigned');
    }
    if (btn.classList.contains('rd-btn-verify-payment')) {
      request.paymentStatus = "Paid";
      request.statusIndex = Math.max(request.statusIndex, 11);
      saveState(); renderAll();
      await notifyRoles(['coordinator'], `Payment verified for ${request.id}`, 'success', 'coordinator');
      showToast('Payment confirmed');
    }
  });
}
setupCoordinatorHandlers();

document.getElementById("detailBackBtn")?.addEventListener("click", () => closeRoleDetail('coordinator'));

function renderTechnician() {
  // Detail mode
  if (state.techDetailMode) {
    document.getElementById("techDashboard").style.display = 'none';
    document.getElementById("techRequestView").style.display = '';
    renderTechDetail(activeRequest());
    return;
  }
  document.getElementById("techDashboard").style.display = '';
  document.getElementById("techRequestView").style.display = 'none';

  const techName2 = state.activeUser?.name || '';
  const myJobs = state.requests.filter(r => r.pickupTech === techName2);
  const myActive = myJobs.filter(r => r.statusIndex >= 1 && r.statusIndex < 11).length;
  const myDone = myJobs.filter(r => r.statusIndex >= 11 && r.statusIndex < 14).length;
  document.getElementById("techAssignedCount").textContent = myJobs.length;
  document.getElementById("techCompletedCount").textContent = myDone;
  document.getElementById("techActiveCount").textContent = myActive;

  const request = activeRequest();
  document.getElementById("techJobTitle").textContent = request ? `Pickup ${request.id}` : "No active job";
  document.getElementById("techJobDesc").textContent = request ? `${request.model} - ${request.issue}` : "No requests yet.";
  document.getElementById("techJobMeta").textContent = request ? `${request.customer} | ${request.address}` : "";
  const otpInput = document.getElementById("otpInput");
  if (otpInput && request) otpInput.value = request.pickupOtp || "4821";
  const isDelivery = request ? request.statusIndex >= 11 : false;
  document.getElementById("techJobTitle").textContent = `${isDelivery ? "Delivery" : "Pickup"} ${request.id}`;
  document.getElementById("techJobMeta").textContent = `${request.customer} | ${request.address} | ${request.model}`;
  const techPreviews = document.getElementById("techConditionPreviews");
  if (techPreviews) {
    if (request.conditionImages.length) {
      techPreviews.innerHTML = `<span style="font-size:12px;font-weight:800;color:var(--muted);width:100%">Device condition photos:</span>` +
        request.conditionImages.map((img) => `<img src="${img}" alt="Device condition" loading="lazy">`).join("");
    } else {
      techPreviews.innerHTML = "";
    }
  }

  document.getElementById("techJobDesc").textContent = isDelivery
    ? "Deliver the repaired device to the customer address above."
    : "Customer OTP required before device collection.";
  const checks = [
    ["accepted", "Technician accepted job"],
    ["otp", "Customer OTP verified"],
    ["photos", "Device photos captured"],
    ["handover", "Device handed to RepairingMaster"],
    ["delivery", "Delivery confirmation"],
    ["payment_collected", "Payment collected from customer"]
  ];

  document.getElementById("techChecklist").innerHTML = checks.map(([key, label]) => `
    <div class="check-item">
      <span>${label}</span>
      <button data-check="${key}">${request.checks[key] ? "Done" : "Mark"}</button>
    </div>
  `).join("");

  document.querySelectorAll("[data-check]").forEach((button) => {
    button.addEventListener("click", () => {
      request.checks[button.dataset.check] = true;
      if (button.dataset.check === "otp") request.otpVerified = true;
      if (button.dataset.check === "payment_collected" && request.paymentMethod === "Cash on Delivery") {
        request.paymentStatus = "Paid";
      }
      saveState();
      renderAll();
      showToast("Technician checklist updated");
    });
  });

  // Assigned requests list
  const techName = state.activeUser?.name || '';
  const assigned = state.requests.filter(r => r.pickupTech === techName && r.statusIndex < 14);
  const listEl = document.getElementById("techRequestsList");
  if (!assigned.length) {
    listEl.innerHTML = '<div class="empty-state">No assigned jobs</div>';
  } else {
    listEl.innerHTML = assigned.map(r => `
      <button class="request-row" onclick="navigateTo('#technician/request/${r.id}')">
        <div><h3>${r.id} — ${r.model}</h3><p>${r.customer} | ${r.issue}</p></div>
        <span class="status-pill">${statuses[r.statusIndex]}</span>
      </button>
    `).join('');
  }

  // Market deliveries
  const deliveryList = document.getElementById("techDeliveryList");
  if (deliveryList) {
    const myDeliveries = state.marketOrders.filter((o) => o.assignedTech && o.statusIndex < 4);
    if (!myDeliveries.length) {
      deliveryList.innerHTML = '<div class="empty-state">No delivery tasks assigned.</div>';
    } else {
      deliveryList.innerHTML = myDeliveries.map((o, i) => `
        <div class="tech-delivery-card">
          <div>
            <h4>${o.id} - ${o.itemModel}</h4>
            <p>Pickup from ${o.repairMaster} &rarr; Deliver to ${o.address}</p>
          </div>
          <span class="status-pill">${orderStatuses[o.statusIndex]}</span>
          ${o.statusIndex < 4 ? '<button class="adv-order" data-oi="' + i + '">Advance</button>' : ''}
        </div>
      `).join('');
      document.querySelectorAll(".adv-order").forEach((btn) => {
        btn.addEventListener("click", () => {
          const o = state.marketOrders[Number(btn.dataset.oi)];
          o.statusIndex = Math.min(o.statusIndex + 1, orderStatuses.length - 1);
          saveState(); renderAll();
          showToast(`${o.id} moved to ${orderStatuses[o.statusIndex]}`);
        });
      });
    }
  }
}

function renderTechDetail(req) {
  if (!req) { document.getElementById("techRequestContent").innerHTML = '<div class="empty-state">Request not found</div>'; return; }
  document.getElementById("techDetailTitle").textContent = `${req.id} — ${req.model}`;
  document.getElementById("techDetailStatus").textContent = statuses[req.statusIndex];
  const isDelivery = req.statusIndex >= 11;
  const content = document.getElementById("techRequestContent");
  const imgs = [...(req.requestImages || []), ...(req.conditionImages || [])].filter(Boolean);
  content.innerHTML = `
    <div class="rd-action-card" style="border-left:4px solid var(--teal)">
      <div class="rd-action-header"><span class="rd-action-step">${isDelivery ? 'Delivery' : 'Pickup'} task</span></div>
      <p class="rd-action-msg">${req.customer} | ${req.address} | ${req.model}<br>${isDelivery ? 'Deliver the repaired device' : 'Customer OTP required before device collection'}</p>
      <div style="display:flex;gap:10px;flex-wrap:wrap;align-items:center">
        ${!isDelivery ? '<input id="techOtpInput" maxlength="4" value="' + (req.pickupOtp || '4821') + '" style="width:70px;text-align:center;font-size:18px;font-weight:700">' : ''}
        ${!isDelivery ? '<button class="primary-action rd-btn" id="techVerifyOtpBtn">Verify OTP</button>' : ''}
        <button class="primary-action rd-btn" id="techMarkCheckBtn" style="background:#27ae60">✓ Mark Complete</button>
      </div>
    </div>
    <div class="rd-grid">
      <div class="rd-info-card">
        <p class="eyebrow">Customer</p>
        <table class="coord-info-table">
          <tr><td>Name</td><td>${escHtml(req.customer)}</td></tr>
          <tr><td>Phone</td><td>${escHtml(req.phone || '—')}</td></tr>
          <tr><td>Address</td><td>${escHtml(req.address)}</td></tr>
        </table>
      </div>
      <div class="rd-info-card">
        <p class="eyebrow">Device</p>
        <table class="coord-info-table">
          <tr><td>Brand</td><td>${req.brand || '—'}</td></tr>
          <tr><td>Model</td><td>${escHtml(req.model)}</td></tr>
          <tr><td>Issue</td><td>${escHtml(req.issue)}</td></tr>
        </table>
      </div>
      <div class="rd-info-card">
        <p class="eyebrow">Status</p>
        <div style="font-size:13px;display:grid;gap:4px">
          ${[["accepted", "Technician accepted"], ["otp", "OTP verified"], ["photos", "Photos captured"], ["handover", "Handed to RM"], ["delivery", "Delivery done"], ["payment_collected", "Payment collected"]].map(([k, l]) => `
            <label style="display:flex;align-items:center;gap:6px;cursor:pointer">
              <input type="checkbox" ${req.checks[k] ? 'checked' : ''} data-tech-check="${k}" style="cursor:pointer">
              <span style="${req.checks[k] ? 'text-decoration:line-through;color:var(--muted)' : ''}">${l}</span>
            </label>
          `).join('')}
        </div>
      </div>
    </div>
    ${imgs.length ? '<div class="rd-info-card" style="margin-top:14px"><p class="eyebrow">Photos</p><div class="rd-photos">' + imgs.map(u => '<img src="' + u + '" loading="lazy">').join('') + '</div></div>' : ''}
  `;
  // Bind tech detail actions
  content.querySelectorAll('[data-tech-check]').forEach(cb => {
    cb.addEventListener('change', () => {
      const req2 = activeRequest(); if (!req2) return;
      req2.checks[cb.dataset.techCheck] = cb.checked;
      if (cb.dataset.techCheck === 'otp') req2.otpVerified = cb.checked;
      if (cb.dataset.techCheck === 'payment_collected' && req2.paymentMethod === 'Cash on Delivery' && cb.checked) req2.paymentStatus = 'Paid';
      saveState(); renderAll();
    });
  });
  content.querySelector('#techVerifyOtpBtn')?.addEventListener('click', () => {
    const req2 = activeRequest(); if (!req2) return;
    req2.checks.otp = true; req2.otpVerified = true;
    saveState(); renderAll(); showToast('OTP verified');
  });
  content.querySelector('#techMarkCheckBtn')?.addEventListener('click', () => {
    const req2 = activeRequest(); if (!req2) return;
    req2.statusIndex = Math.min(req2.statusIndex + 1, statuses.length - 1);
    saveState(); renderAll(); showToast('Task progressed');
  });
}

document.getElementById("techDetailBackBtn")?.addEventListener("click", () => closeRoleDetail('technician'));

function renderRepairingMaster() {
  // Detail mode
  if (state.rmDetailMode) {
    document.getElementById("rmDashboard").style.display = 'none';
    document.getElementById("rmRequestView").style.display = '';
    renderRmDetail(activeRequest());
    return;
  }
  document.getElementById("rmDashboard").style.display = '';
  document.getElementById("rmRequestView").style.display = 'none';

  const rmName2 = state.activeUser?.name || '';
  const myRms = state.requests.filter(r => r.repairPartner === rmName2);
  const myRmActive = myRms.filter(r => r.statusIndex >= 6 && r.statusIndex < 11).length;
  const myRmDone = myRms.filter(r => r.statusIndex >= 13).length;
  document.getElementById("rmAssignedCount").textContent = myRms.length;
  document.getElementById("rmCompletedCount").textContent = myRmDone;
  document.getElementById("rmInProgressCount").textContent = myRmActive;

  const request = activeRequest();
  // Show active request on bench
  const benchTitle = document.querySelector("#repairmaster .diagnosis-card h2");
  if (benchTitle) benchTitle.textContent = request ? `Repair bench - ${request.id}` : "Repair bench";
  const diagnosisEl = document.getElementById("diagnosisText");
  if (diagnosisEl && request) diagnosisEl.placeholder = `${request.model}: ${request.issue}`;
  // Render dynamic parts grid
  const grid = document.getElementById("partsGrid");
  if (grid) {
    const parts = state.repairParts || [];
    grid.innerHTML = parts.map((part, i) => `
      <div class="part-row" data-pi="${i}">
        <label class="part-check-label">
          <input type="checkbox" ${part.stock > 0 ? "" : "disabled"} data-pi="${i}">
          <span class="part-name">${part.name}</span>
        </label>
        <div class="part-fields">
          <input class="part-cost-input" type="number" min="0" value="${part.cost}" data-pi="${i}">
          <button class="part-remove-btn" data-pi="${i}" title="Remove part">&times;</button>
        </div>
      </div>
    `).join("");
  }

  // Base fee input
  const baseFeeEl = document.getElementById("baseFeeInput");
  if (baseFeeEl) baseFeeEl.value = state.baseInspectionFee || 499;

  // Inventory display (warehouse stock)
  if (!inventory.length) {
    document.getElementById("inventoryList").innerHTML = `<div class="empty-state">No parts in inventory.</div>`;
  } else {
    document.getElementById("inventoryList").innerHTML = inventory.map((item) => `
    <div class="inventory-row">
      <div><strong>${item.part}</strong><br><small>${item.stock} units in stock</small></div>
      <span class="status-pill">${item.health}</span>
    </div>
  `).join("");
  }

  const soldNotif = document.getElementById("soldNotification");
  if (soldNotif) {
    const partnerName = activeRequest().repairPartner || "";
    const soldItems = state.marketOrders.filter((o) => o.repairMaster === partnerName && o.statusIndex < 4);
    if (!soldItems.length) {
      soldNotif.innerHTML = `<p style="color:var(--muted)">No recent sales notifications.</p>`;
    } else {
      soldNotif.innerHTML = soldItems.map((o) => `
        <div class="inventory-row">
          <div>
            <strong>${o.itemModel}</strong><br>
            <small>Order ${o.id} | ${o.assignedTech ? o.assignedTech + " assigned" : "Awaiting pickup"}</small>
          </div>
          <span class="status-pill">${orderStatuses[o.statusIndex]}</span>
        </div>
      `).join("");
    }
  }

  // Assigned requests list
  const rmName = state.activeUser?.name || '';
  const assigned = state.requests.filter(r => r.repairPartner === rmName && r.statusIndex < 14);
  const listEl = document.getElementById("rmRequestsList");
  if (!assigned.length) {
    listEl.innerHTML = '<div class="empty-state">No assigned repair jobs</div>';
  } else {
    listEl.innerHTML = assigned.map(r => `
      <button class="request-row" onclick="navigateTo('#rm/request/${r.id}')">
        <div><h3>${r.id} — ${r.model}</h3><p>${r.customer} | ${r.issue}</p></div>
        <span class="status-pill">${statuses[r.statusIndex]}</span>
      </button>
    `).join('');
  }

  const feeInput = document.getElementById("minServiceFeeInput");
  if (feeInput) feeInput.value = state.minServiceFee || 150;
  const taxInput = document.getElementById("taxPercentInput");
  if (taxInput) taxInput.value = state.taxPercent || 0;
  const scInput = document.getElementById("serviceChargeInput");
  if (scInput) scInput.value = state.serviceChargePercent || 0;
  updateListingCommission();
}

function renderRmDetail(req) {
  if (!req) { document.getElementById("rmRequestContent").innerHTML = '<div class="empty-state">Request not found</div>'; return; }
  document.getElementById("rmDetailTitle").textContent = `${req.id} — ${req.model}`;
  document.getElementById("rmDetailStatus").textContent = statuses[req.statusIndex];
  const content = document.getElementById("rmRequestContent");
  const imgs = [...(req.requestImages || []), ...(req.conditionImages || [])].filter(Boolean);
  content.innerHTML = `
    <div class="rd-action-card" style="border-left:4px solid #8e44ad">
      <div class="rd-action-header"><span class="rd-action-step">Repair job</span></div>
      <p class="rd-action-msg">${req.customer} | ${req.model} | ${req.issue}</p>
      <div style="display:flex;gap:10px;flex-wrap:wrap">
        <button class="primary-action rd-btn" id="rmAdvStatusBtn" style="background:#8e44ad">Advance Status</button>
      </div>
    </div>
    <div class="rd-grid">
      <div class="rd-info-card">
        <p class="eyebrow">Customer</p>
        <table class="coord-info-table">
          <tr><td>Name</td><td>${escHtml(req.customer)}</td></tr>
          <tr><td>Phone</td><td>${escHtml(req.phone || '—')}</td></tr>
        </table>
      </div>
      <div class="rd-info-card">
        <p class="eyebrow">Device</p>
        <table class="coord-info-table">
          <tr><td>Brand</td><td>${req.brand || '—'}</td></tr>
          <tr><td>Model</td><td>${escHtml(req.model)}</td></tr>
          <tr><td>Issue</td><td>${escHtml(req.issue)}</td></tr>
        </table>
      </div>
      <div class="rd-info-card">
        <p class="eyebrow">Diagnosis</p>
        <textarea placeholder="Enter diagnosis notes..." style="width:100%;min-height:80px;border:1px solid var(--border);border-radius:6px;padding:8px;font-size:13px">${escHtml(req.diagnosis || '')}</textarea>
      </div>
    </div>
    ${imgs.length ? '<div class="rd-info-card" style="margin-top:14px"><p class="eyebrow">Photos</p><div class="rd-photos">' + imgs.map(u => '<img src="' + u + '" loading="lazy">').join('') + '</div></div>' : ''}
  `;
  content.querySelector('#rmAdvStatusBtn')?.addEventListener('click', () => {
    const req2 = activeRequest(); if (!req2) return;
    const diag = content.querySelector('textarea')?.value;
    if (diag) req2.diagnosis = diag;
    req2.statusIndex = Math.min(req2.statusIndex + 1, statuses.length - 1);
    if (req2.statusIndex >= 8) { /* repair in progress or later */ }
    saveState(); renderAll(); showToast('Job status advanced');
  });
}

document.getElementById("rmDetailBackBtn")?.addEventListener("click", () => closeRoleDetail('rm'));

function renderAdmin() {
  // Detail mode
  if (state.adminDetailMode) {
    document.getElementById("adminDashboard").style.display = 'none';
    document.getElementById("adminRequestView").style.display = '';
    renderAdminDetail(activeRequest());
    return;
  }
  document.getElementById("adminDashboard").style.display = '';
  document.getElementById("adminRequestView").style.display = 'none';

  const requests = state.requests || [];
  const marketplace = state.marketplace || [];
  const applications = state.applications || [];

  // Admin request list
  const adminReqList = document.getElementById("adminRequestsList");
  if (adminReqList) {
    adminReqList.innerHTML = requests.filter(r => r.statusIndex < 14).map(r => `
      <button class="request-row" onclick="navigateTo('#admin/request/${r.id}')" style="text-align:left;width:100%">
        <div><h3>${r.id} — ${r.model}</h3><p>${r.customer} | ${r.issue}</p></div>
        <span class="status-pill">${statuses[r.statusIndex]}</span>
      </button>
    `).join('') + (requests.filter(r => r.statusIndex >= 14).length ? '<div style="font-size:11px;color:var(--muted);padding:8px 12px">' + requests.filter(r => r.statusIndex >= 14).length + ' closed requests</div>' : '<div class="empty-state">No open requests</div>');
  }

  // Real metrics
  const totalCommission = requests.reduce((s, r) => s + commissionFor(r.quoteAmount), 0) + marketplace.filter((m) => m.sold).reduce((s, m) => s + commissionFor(displayPrice(m.basePrice)), 0);
  document.getElementById("platformCommission").textContent = formatCurrency(totalCommission);
  document.getElementById("escalations").textContent = requests.filter((r) => r.statusIndex > 0 && r.statusIndex < 6).length;
  document.getElementById("totalRequests").textContent = requests.length;
  document.getElementById("pendingApps").textContent = applications.filter(a => a.status === "Pending").length;

  // Status breakdown
  const stageLabels = ["Submitted", "In Progress", "Ready", "Closed"];
  const stageCounts = [0, 0, 0, 0];
  requests.forEach(r => {
    if (r.statusIndex === 0) stageCounts[0]++;
    else if (r.statusIndex <= 8) stageCounts[1]++;
    else if (r.statusIndex <= 12) stageCounts[2]++;
    else stageCounts[3]++;
  });
  const maxCount = Math.max(...stageCounts, 1);
  document.getElementById("statusBreakdown").innerHTML = stageLabels.map((l, i) => `
    <div class="status-bar-row">
      <span class="status-bar-label">${l}</span>
      <div class="status-bar-track"><div class="status-bar-fill" style="width:${(stageCounts[i] / maxCount) * 100}%"></div></div>
      <span class="status-bar-count">${stageCounts[i]}</span>
    </div>
  `).join("");

  const days = [["Sat", 24], ["Sun", 31], ["Mon", 28], ["Tue", 42], ["Wed", 38], ["Thu", 45], ["Fri", 21]];
  document.getElementById("barChart").innerHTML = days.map(([day, value]) => `
    <div class="bar" style="height:${value * 5}px" title="${value} repairs"><span>${day}</span></div>
  `).join("");

  document.getElementById("vendorList").innerHTML = vendors.map((vendor) => `
    <div class="vendor-row">
      <div><strong>${vendor.name}</strong><br><small>${vendor.jobs} completed jobs</small></div>
      <span class="status-pill">${vendor.score}</span>
    </div>
  `).join("");

  // Application filter - use event delegation on parent
  document.getElementById("appFilterBar").onclick = (e) => {
    const btn = e.target.closest("[data-appfilter]");
    if (!btn) return;
    document.querySelectorAll("[data-appfilter]").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    renderAdmin();
  };
  const activeFilter = document.querySelector("#appFilterBar .active")?.dataset?.appfilter || "All";
  const filteredApps = activeFilter === "All" ? state.applications : state.applications.filter(a => a.status === activeFilter);
  document.getElementById("applicationList").innerHTML = filteredApps.map((app, i) => {
    const detailsHtml = app.details ? Object.entries(app.details).filter(([_, v]) => v).map(([k, v]) => `<span class="app-detail">${k}: ${v}</span>`).join("") : "";
    return `
    <div class="app-card">
      <div class="app-card-header">
        <div>
          <strong>${app.name}</strong>
          <span class="app-role-tag">${app.role}</span>
        </div>
        <span class="status-pill ${app.status === "Approved" ? "pill-approved" : app.status === "Rejected" ? "pill-rejected" : "pill-pending"}">${app.status}</span>
      </div>
      <div class="app-card-body">
        <span class="app-detail">Email: ${app.email || "—"}</span>
        <span class="app-detail">Phone: ${app.phone || "—"}</span>
        <span class="app-detail">Location: ${app.location}</span>
        ${detailsHtml}
      </div>
      <div class="app-card-actions">
        ${app.status === "Pending" ? `<button class="appr-btn" data-appr="${i}">✅ Verify &amp; Approve</button>` : ""}
        ${app.status === "Approved" ? `<button class="rej-btn" data-rej="${i}">⛔ Revoke Access</button>` : ""}
        ${app.status === "Pending" ? `<button class="rej-btn" data-rej-app="${i}">✖ Reject</button>` : ""}
      </div>
    </div>
  `}).join("");

  document.querySelectorAll(".appr-btn").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const i = Number(btn.dataset.appr);
      const app = state.applications[i];
      app.status = "Approved";
      const dbId = app.id;
      if (dbId) await updateApplication(dbId, { status: "Approved" }).catch(() => {});
      if (app.user_id) {
        const roleMap = { 'Technician':'technician','RepairingMaster':'repairmaster','Coordinator':'coordinator' };
        const profileRole = roleMap[app.role] || app.role?.toLowerCase();
        await supabase.from('profiles').update({ role: profileRole }).eq('id', app.user_id).catch(() => {});
        await createNotification({ user_id: app.user_id, message: `Your ${app.role} application has been approved. You can now sign in.`, type: 'success' });
      }
      saveState();
      renderAll();
      renderNotifications();
      showToast("Application approved — employee can now sign in");
    });
  });
  document.querySelectorAll(".rej-btn[data-rej]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const i = Number(btn.dataset.rej);
      const app = state.applications[i];
      app.status = "Pending";
      const dbId = app.id;
      if (dbId) await updateApplication(dbId, { status: "Pending" }).catch(() => {});
      if (app.user_id) await createNotification({ user_id: app.user_id, message: `Your ${app.role} application access has been revoked. Contact admin.`, type: 'warning' });
      saveState();
      renderAll();
      renderNotifications();
      showToast("Application access revoked");
    });
  });
  document.querySelectorAll(".rej-btn[data-rej-app]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const i = Number(btn.dataset.rejApp);
      const app = state.applications[i];
      app.status = "Rejected";
      const dbId = app.id;
      if (dbId) await updateApplication(dbId, { status: "Rejected" }).catch(() => {});
      if (app.user_id) await createNotification({ user_id: app.user_id, message: `Your ${app.role} application has been rejected.`, type: 'error' });
      saveState();
      renderAll();
      renderNotifications();
      showToast("Application rejected");
    });
  });

  // Technician performance
  const techNames = state.applications
    .filter((a) => a.role === "Technician" && a.status === "Approved")
    .map((a) => a.name);
  if (!techNames.length) {
    document.getElementById("techPerformanceList").innerHTML = `<div class="empty-state">No approved technicians yet.</div>`;
    return;
  }
  document.getElementById("techPerformanceList").innerHTML = techNames.map((name) => {
    const assigned = state.requests.filter((r) => r.pickupTech === name);
    const total = assigned.length;
    const completed = assigned.filter((r) => r.statusIndex >= 11).length;
    const active = assigned.filter((r) => r.statusIndex >= 1 && r.statusIndex < 11).length;
    const rate = total > 0 ? Math.round((completed / total) * 100) : 0;
    return `
      <div class="vendor-row">
        <div><strong>${name}</strong><br><small>${completed} done · ${active} active · ${total} total</small></div>
        <span class="status-pill">${rate}%</span>
      </div>
    `;
  }).join("");

  // Job postings
  renderJobPostings();
  const jobForm = document.getElementById("jobPostingForm");
  if (jobForm) {
    jobForm.onsubmit = async (e) => {
      e.preventDefault();
      const title = document.getElementById("jobTitle").value.trim();
      const role = document.getElementById("jobRole").value;
      const location = document.getElementById("jobLocation").value.trim();
      const description = document.getElementById("jobDescription").value.trim();
      if (!title) return;
      try {
        const job = { title, role, location, description, status: "Open" };
        const result = await supabase.from("job_postings").insert(job).select();
        if (result.error) throw result.error;
        document.getElementById("jobPostingForm").reset();
        state.jobPostings = await fetchJobPostings();
        renderJobPostings();
      } catch (err) {
        showToast("Failed to create job posting", "error");
      }
    };
  }
}

function renderAdminDetail(req) {
  if (!req) { document.getElementById("adminRequestContent").innerHTML = '<div class="empty-state">Request not found</div>'; return; }
  document.getElementById("adminDetailTitle").textContent = `${req.id} — ${req.model}`;
  document.getElementById("adminDetailStatus").textContent = statuses[req.statusIndex];
  const content = document.getElementById("adminRequestContent");
  const imgs = [...(req.requestImages || []), ...(req.conditionImages || [])].filter(Boolean);
  const timeStr = req.createdAt ? new Date(req.createdAt).toLocaleDateString() : '—';
  content.innerHTML = `
    <div class="rd-grid">
      <div class="rd-info-card">
        <p class="eyebrow">Customer</p>
        <table class="coord-info-table">
          <tr><td>Name</td><td>${escHtml(req.customer)}</td></tr>
          <tr><td>Phone</td><td>${escHtml(req.phone || '—')}</td></tr>
          <tr><td>Address</td><td>${escHtml(req.address)}</td></tr>
        </table>
      </div>
      <div class="rd-info-card">
        <p class="eyebrow">Device</p>
        <table class="coord-info-table">
          <tr><td>ID</td><td>${escHtml(req.id)}</td></tr>
          <tr><td>Created</td><td>${timeStr}</td></tr>
          <tr><td>Type</td><td>${escHtml(req.deviceType || 'Smartphone')}</td></tr>
          <tr><td>Brand</td><td>${req.brand || '—'}</td></tr>
          <tr><td>Model</td><td>${escHtml(req.model)}</td></tr>
          <tr><td>Issue</td><td>${escHtml(req.issue)}</td></tr>
          <tr><td>Status</td><td>${statuses[req.statusIndex]}</td></tr>
        </table>
      </div>
      <div class="rd-info-card">
        <p class="eyebrow">Assignment</p>
        <table class="coord-info-table">
          <tr><td>Pickup Tech</td><td>${escHtml(req.pickupTech || '—')}</td></tr>
          <tr><td>Repair Partner</td><td>${escHtml(req.repairPartner || '—')}</td></tr>
        </table>
      </div>
      <div class="rd-info-card">
        <p class="eyebrow">Financials</p>
        ${req.quoteAmount ? '<p style="font-size:24px;font-weight:700;color:var(--teal)">' + formatCurrency(req.quoteAmount) + '</p>' : '<p style="color:var(--muted)">No quote yet</p>'}
        <table class="coord-info-table">
          <tr><td>Payment</td><td>${req.paymentStatus || '—'}</td></tr>
          <tr><td>Method</td><td>${req.paymentMethod || '—'}</td></tr>
        </table>
      </div>
    </div>
    ${imgs.length ? '<div class="rd-info-card" style="margin-top:14px"><p class="eyebrow">Photos</p><div class="rd-photos">' + imgs.map(u => '<img src="' + u + '" loading="lazy">').join('') + '</div></div>' : ''}
    <div class="rd-info-card" style="margin-top:14px">
      <p class="eyebrow">CRM Notes</p>
      <div style="display:flex;gap:6px;margin-bottom:8px">
        <input id="adminCrmNoteInput" placeholder="Add a note..." style="flex:1;padding:8px;border:1px solid var(--border);border-radius:6px;font-size:13px">
        <button id="adminCrmNoteAddBtn" class="primary-action" style="white-space:nowrap">Add Note</button>
      </div>
      <div id="adminCrmNotesList">${(req.crmNotes || []).map(n => '<div style="font-size:12px;padding:6px 0;border-bottom:1px solid var(--line)"><strong>' + escHtml(n.author || '—') + '</strong> <span style="color:var(--muted)">' + (n.date || '') + '</span><br>' + escHtml(n.text) + '</div>').join('') || '<span style="color:var(--muted);font-size:12px">No notes yet</span>'}</div>
    </div>
    <div class="timeline" style="margin-top:16px">${statuses.map((s, i) => {
      const sc = i < req.statusIndex ? "done" : i === req.statusIndex ? "current" : "";
      const note = i < req.statusIndex ? "Completed" : i === req.statusIndex ? "Current step" : "Upcoming";
      return '<div class="timeline-item ' + sc + '"><span class="timeline-dot"></span><div><strong>' + s + '</strong><br><span>' + note + '</span></div></div>';
    }).join('')}</div>
  `;
  document.getElementById("adminCrmNoteAddBtn")?.addEventListener("click", () => {
    const input = document.getElementById("adminCrmNoteInput");
    if (!input || !input.value.trim()) return;
    const req2 = activeRequest();
    if (!req2) return;
    if (!req2.crmNotes) req2.crmNotes = [];
    req2.crmNotes.push({ text: input.value.trim(), author: state.activeUser?.name || 'Admin', date: new Date().toLocaleString() });
    input.value = '';
    saveState();
    renderAdminDetail(req2);
    showToast('Note added');
  });
}

document.getElementById("adminDetailBackBtn")?.addEventListener("click", () => closeRoleDetail('admin'));

function renderJobPostings() {
  const list = document.getElementById("jobPostingList");
  if (!list) return;
  const jobs = state.jobPostings || [];
  if (!jobs.length) {
    list.innerHTML = `<div class="empty-state">No job postings yet.</div>`;
    return;
  }
  list.innerHTML = jobs.map((j) => `
    <div class="vendor-row">
      <div>
        <strong>${j.title}</strong><br>
        <small>${j.role} · ${j.location || "Anywhere"}</small>
      </div>
      <div style="display:flex;align-items:center;gap:8px">
        <span class="status-pill" style="background:${j.status === 'Open' ? '#d4ede4' : '#f0f0f0'}">${j.status}</span>
        <button class="secondary-action" data-id="${j.id}" style="padding:4px 8px;font-size:11px">${j.status === 'Open' ? 'Close' : 'Reopen'}</button>
        <button class="secondary-action" data-id="${j.id}" data-delete style="padding:4px 8px;font-size:11px;color:var(--red)">Delete</button>
      </div>
    </div>
  `).join("");
  // Event delegation for toggle and delete
  list.querySelectorAll("button[data-id]").forEach((btn) => {
    btn.onclick = async () => {
      const id = parseInt(btn.dataset.id);
      if (btn.hasAttribute("data-delete")) {
        await supabase.from("job_postings").delete().eq("id", id);
        state.jobPostings = await fetchJobPostings();
        renderJobPostings();
      } else {
        const job = jobs.find((j) => j.id === id);
        const newStatus = job.status === "Open" ? "Closed" : "Open";
        await supabase.from("job_postings").update({ status: newStatus }).eq("id", id);
        state.jobPostings = await fetchJobPostings();
        renderJobPostings();
      }
    };
  });
}

function renderMarketplace() {
  const available = state.marketplace.filter((item) => !item.sold);
  const filtered = marketFilter === "All" ? available : available.filter((item) => item.grade === marketFilter);
  if (!filtered.length) {
    document.getElementById("marketGrid").innerHTML = `<div class="empty-state" style="grid-column:1/-1">No devices match this grade filter.</div>`;
    return;
  }
  document.getElementById("marketGrid").innerHTML = filtered.map((item, index) => {
    const finalPrice = displayPrice(item.basePrice);
    const imgs = item.images && item.images.length ? item.images : [defaultDeviceIcon];
    const slide = item.currentSlide || 0;
    const currentImg = imgs[slide] || imgs[0];
    const showNav = imgs.length > 1;
    const prevIdx = (slide - 1 + imgs.length) % imgs.length;
    const nextIdx = (slide + 1) % imgs.length;
    if (item.sold) {
      return `
        <article class="market-card" style="opacity:0.5">
          <div class="market-card-image-wrap">
            <img class="market-card-image" src="${currentImg}" alt="${item.model}" loading="lazy" style="filter:grayscale(1)">
          </div>
          <div class="market-body">
            <span class="grade-pill">Grade ${item.grade}</span>
            <span class="status-pill" style="background:#fde8e8;color:var(--red);margin-left:6px">Sold</span>
            <h3>${item.model}</h3>
            <p>Sold from ${item.owner}</p>
            <div class="market-footer">
              <strong>${formatCurrency(finalPrice)}</strong>
              <button disabled style="opacity:0.5">Sold</button>
            </div>
          </div>
        </article>
      `;
    }
    return `
      <article class="market-card">
        <div class="market-card-image-wrap">
          <img class="market-card-image" src="${currentImg}" alt="${item.model}" loading="lazy">
          ${showNav ? `
          <button class="slide-btn slide-prev" data-slide="${index}" data-dir="-1">&#8249;</button>
          <button class="slide-btn slide-next" data-slide="${index}" data-dir="1">&#8250;</button>
          <div class="slide-dots">${imgs.map((_, i) => `<span class="slide-dot${i === slide ? ' active' : ''}"></span>`).join('')}</div>
          ` : ""}
        </div>
        <div class="market-body">
          <span class="grade-pill">Grade ${item.grade}</span>
          <h3>${item.model}</h3>
          <p>${item.owner} | ${item.warranty} warranty</p>
          <div class="market-footer">
            <strong>${formatCurrency(finalPrice)}</strong>
            <button class="buy-btn" data-index="${index}">Buy</button>
          </div>
        </div>
      </article>
    `;
  }).join("");

  document.querySelectorAll(".slide-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const idx = Number(btn.dataset.slide);
      const item = state.marketplace[idx];
      if (item) {
        const imgs = item.images && item.images.length ? item.images : [defaultDeviceIcon];
        item.currentSlide = (item.currentSlide || 0) + Number(btn.dataset.dir);
        if (item.currentSlide < 0) item.currentSlide = imgs.length - 1;
        if (item.currentSlide >= imgs.length) item.currentSlide = 0;
        saveState();
        renderMarketplace();
      }
    });
  });

  document.querySelectorAll(".buy-btn").forEach((button) => {
    button.addEventListener("click", () => {
      const index = Number(button.dataset.index);
      const item = state.marketplace[index];
      if (item && !item.sold) {
        item.sold = true;
        const orderId = `MO-${1001 + state.marketOrders.length}`;
        state.marketOrders.unshift({
          id: orderId,
          itemModel: item.model,
          grade: item.grade,
          basePrice: item.basePrice,
          customer: "Marketplace Buyer",
          repairMaster: item.owner,
          statusIndex: 0,
          assignedTech: "",
          address: "Customer address pending"
        });
        saveState();
        renderAll();
        showToast(`${item.model} purchased. Order ${orderId} created for coordinator dispatch.`);
      }
    });
  });
}

function updateListingCommission() {
  const basePrice = Number(document.getElementById("listingPrice").value || 0);
  const finalPrice = displayPrice(basePrice);
  document.getElementById("listingCommission").textContent = `${formatCurrency(finalPrice)}`;
}

function renderHotDeals() {
  const deals = state.marketplace.filter((item) => !item.sold).slice(0, 3);
  const grid = document.getElementById("hotDealsGrid");
  if (!grid) return;
  if (!deals.length) {
    grid.innerHTML = `<p style="color:var(--muted);grid-column:1/-1;text-align:center">Check back for new deals.</p>`;
    return;
  }
  grid.innerHTML = deals.map((item) => {
    const imgs = item.images && item.images.length ? item.images : [defaultDeviceIcon];
    return `
    <div class="hot-deal-card">
      <span class="hot-badge">Hot Deal</span>
      <img class="hot-deal-img" src="${imgs[0]}" alt="${item.model}" loading="lazy">
      <h4>${item.model}</h4>
      <p>Grade ${item.grade} &middot; ${item.warranty}</p>
      <strong>${formatCurrency(displayPrice(item.basePrice))}</strong>
    </div>
  `}).join("");
}

function renderAll() {
  if (!state.activePortal || state.activePortal === 'login') {
    renderHotDeals();
    return;
  }
  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
  const activeView = document.getElementById(state.activePortal);
  if (activeView) activeView.classList.add('active');
  switch (state.activePortal) {
    case 'customer': renderCustomer(); break;
    case 'coordinator': renderCoordinator(); break;
    case 'technician': renderTechnician(); break;
    case 'repairmaster': renderRepairingMaster(); break;
    case 'admin': renderAdmin(); break;
    case 'marketplace': renderMarketplace(); break;
  }
  renderNotifications();
}

function detectCity(text) {
  if (!text) return "";
  const lower = text.toLowerCase();
  const cities = [
    ["mumbai", "Mumbai"], ["bengaluru", "Bengaluru"], ["bangalore", "Bengaluru"],
    ["delhi", "Delhi"], ["noida", "Delhi"], ["gurgaon", "Delhi"],
    ["pune", "Pune"], ["hyderabad", "Hyderabad"], ["chennai", "Chennai"],
    ["kolkata", "Kolkata"], ["ahmedabad", "Ahmedabad"], ["jaipur", "Jaipur"],
    ["lucknow", "Lucknow"], ["surat", "Surat"]
  ];
  for (const [keyword, city] of cities) {
    if (lower.includes(keyword)) return city;
  }
  return "";
}

function matchesCity(itemCity, customerCity) {
  if (!customerCity) return true;
  const map = {
    "Mumbai": ["Mumbai West", "Mumbai Region", "FixHub Andheri"],
    "Bengaluru": ["Bengaluru Central", "TechCare Koramangala"],
    "Delhi": ["Delhi NCR", "Prime Mobile Lab Noida"],
    "Pune": ["Pune"],
    "Hyderabad": ["Hyderabad"],
    "Chennai": ["Chennai"],
    "Kolkata": ["Kolkata"]
  };
  const keywords = map[customerCity] || [customerCity];
  return keywords.some(k => itemCity.toLowerCase().includes(k.toLowerCase()) || itemCity.toLowerCase().includes(customerCity.toLowerCase()));
}

function renderLocalDeals() {
  const grid = document.getElementById("localDealsGrid");
  const label = document.getElementById("dealsLocationLabel");
  if (!grid) return;
  const customerCity = (state.activeUser && state.activeUser.city) || detectCity(state.requests.find(r => r.customer === (state.activeUser ? state.activeUser.name : ""))?.address || "");
  label.textContent = customerCity ? `Hot deals in ${customerCity}` : "Hot deals near you";
  const deals = state.marketplace.filter(item => !item.sold && matchesCity(item.owner, customerCity)).slice(0, 4);
  if (!deals.length) {
    grid.innerHTML = `<p style="color:var(--muted);grid-column:1/-1;text-align:center">No deals in your city yet. Check back soon.</p>`;
    return;
  }
  grid.innerHTML = deals.map(item => {
    const imgs = item.images && item.images.length ? item.images : [defaultDeviceIcon];
    return `
    <div class="local-deal-card">
      <span class="local-badge">Near you</span>
      <img class="local-deal-img" src="${imgs[0]}" alt="${item.model}" loading="lazy">
      <h4>${item.model}</h4>
      <p>${item.owner} &middot; ${item.warranty}</p>
      <strong>${formatCurrency(displayPrice(item.basePrice))}</strong>
    </div>
  `}).join("");
}

function isEmployeeRole(role) {
  return ["technician", "repairmaster", "coordinator"].includes(role);
}

function verifyEmployeeAccess(role) {
  const roleLabel = role === "repairmaster" ? "RepairingMaster" : role.charAt(0).toUpperCase() + role.slice(1);
  return state.applications.some((a) => a.role === roleLabel && a.status === "Approved");
}

document.getElementById("operationSelect")?.addEventListener("change", (event) => switchView(event.target.value));

document.getElementById("unifiedLoginForm")?.addEventListener("submit", async (event) => {
  event.preventDefault();
  const mode = document.querySelector(".login-tab.active")?.dataset.tab || "signup";
  const email = document.getElementById("loginEmail").value.trim();
  const password = document.getElementById("loginPassword").value.trim();
  const name = document.getElementById("loginName").value.trim();
  const city = document.getElementById("loginCity").value.trim();

  if (!email || !password) { showToast("Email and password are required"); return; }
  if (!email.includes("@") || !email.includes(".")) { showToast("Enter a valid email address"); return; }
  if (mode === "signup" && !name) { showToast("Please enter your name"); return; }

  try {
    if (mode === "signup") {
      const { user } = await signUpWithEmail(email, password, { name, email, role: 'customer', city: city || '' });
      state.activeUser = { name, email, role: 'customer', city: city || '' };
      loginPortal('customer');
    } else {
      // Sign In or Employee Sign In
      const { user } = await signInWithEmail(email, password);
      const profile = await fetchProfile(user.id);
      state.activeUser = profile || { name: email.split('@')[0], email, role: 'customer', city: '' };
      const userRole = profile?.role || 'customer';

      if (mode === "employee") {
        if (!isEmployeeRole(userRole)) {
          showToast("No employee role found for this account. Apply for a position first.");
          await signOutUser();
          return;
        }
        if (!await checkEmployeeAccess(user.id, userRole)) {
          showToast("Access denied. No approved application found for your role.");
          await signOutUser();
          return;
        }
      }
      loginPortal(userRole);
    }
  } catch (err) {
    const msg = err.message || '';
    if (msg.includes('already registered') || msg.includes('Email not confirmed')) {
      try {
        const { user } = await signInWithEmail(email, password);
        const profile = await fetchProfile(user.id);
        state.activeUser = profile || { name: email.split('@')[0], email, role: 'customer', city: '' };
        const userRole = profile?.role || 'customer';
        if (mode === "employee") {
          if (!isEmployeeRole(userRole) || !await checkEmployeeAccess(user.id, userRole)) {
            showToast("No approved application found.");
            await signOutUser();
            return;
          }
        }
        loginPortal(userRole);
      } catch { showToast("Login failed. Check your password."); }
    } else if (msg.includes('Invalid login credentials')) {
      if (mode === "signin" || mode === "employee") showToast("Wrong email or password.");
      else showToast("Account not found. Try the Sign Up tab to create one.");
    } else {
      showToast(msg || "Authentication failed");
    }
  }
});

const roleFields = {
  technician: [
    { id: "appExp", label: "Years of experience", type: "number", placeholder: "e.g. 3" },
    { id: "appSpec", label: "Specialization", type: "select", options: ["Mobile Phones", "Laptops", "TV & Monitors", "All Devices"] },
    { id: "appCert", label: "Certifications", type: "text", placeholder: "e.g. Mobile Repair Certified, Apple ACMT" },
    { id: "appWorkType", label: "Work type", type: "select", options: ["On-site only", "Shop-based", "Both"] }
  ],
  repairmaster: [
    { id: "appStore", label: "Store / workshop name", type: "text", placeholder: "e.g. FixHub Andheri" },
    { id: "appOwner", label: "Owner name", type: "text", placeholder: "Full name" },
    { id: "appYearsBiz", label: "Years in business", type: "number", placeholder: "e.g. 5" },
    { id: "appTechs", label: "Number of technicians", type: "number", placeholder: "e.g. 3" },
    { id: "appGst", label: "GST number (optional)", type: "text", placeholder: "e.g. 27AABCU9603R1ZX" },
    { id: "appPincodes", label: "Service pincodes", type: "text", placeholder: "e.g. 400001, 400002, 400003" },
    { id: "appHours", label: "Business hours", type: "text", placeholder: "e.g. Mon-Sat 10AM-8PM" }
  ],
  coordinator: [
    { id: "appCoordExp", label: "Previous experience", type: "textarea", placeholder: "Describe your relevant experience in logistics / coordination" },
    { id: "appLanguages", label: "Languages spoken", type: "text", placeholder: "e.g. Hindi, English, Marathi" },
    { id: "appArea", label: "Area of operation", type: "text", placeholder: "e.g. Mumbai Western Suburbs" },
    { id: "appTransport", label: "Transport options", type: "select", options: ["Two-wheeler", "Car/Van", "Public transport", "All of the above"] }
  ],
  admin: [
    { id: "appAdminReason", label: "Qualifications & reason", type: "textarea", placeholder: "Why do you want to be an admin? Describe your qualifications." },
    { id: "appMgmtExp", label: "Previous management experience", type: "textarea", placeholder: "Describe any team management or operations experience" },
    { id: "appRef", label: "Reference (existing employee)", type: "text", placeholder: "Name of current RepairingMaster or coordinator" }
  ]
};

function renderDynamicFields(role) {
  const container = document.getElementById("appDynamicFields");
  if (!container) return;
  const fields = roleFields[role] || [];
  container.innerHTML = fields.map(f => {
    if (f.type === "select") {
      return `<label>${f.label} <select id="${f.id}">${f.options.map(o => `<option>${o}</option>`).join("")}</select></label>`;
    }
    if (f.type === "textarea") {
      return `<label>${f.label} <textarea id="${f.id}" placeholder="${f.placeholder}"></textarea></label>`;
    }
    return `<label>${f.label} <input id="${f.id}" type="${f.type}" placeholder="${f.placeholder || ""}"></label>`;
  }).join("");
}

// Role pill switching
document.querySelectorAll(".role-pill").forEach(pill => {
  pill.addEventListener("click", () => {
    document.querySelectorAll(".role-pill").forEach(p => p.classList.remove("active"));
    pill.classList.add("active");
    renderDynamicFields(pill.dataset.role);
  });
});

// Application form submit
document.getElementById("applicationForm")?.addEventListener("submit", async (event) => {
  event.preventDefault();
  const activePill = document.querySelector(".role-pill.active");
  const roleKey = activePill.dataset.role;
  const roleLabel = roleKey === "repairmaster" ? "RepairingMaster" : roleKey.charAt(0).toUpperCase() + roleKey.slice(1);
  const name = document.getElementById("appName").value.trim();
  const email = document.getElementById("appEmail").value.trim();
  const phone = document.getElementById("appPhone").value.trim();
  const location = document.getElementById("appLocation").value;
  if (!name || !email || !phone) {
    showToast("Please fill in name, email, and phone");
    return;
  }
  const details = {};
  (roleFields[roleKey] || []).forEach(f => {
    const el = document.getElementById(f.id);
    if (el) details[f.label] = el.value;
  });
  // Save to Supabase
  try {
    // Sign up the applicant as a Supabase Auth user first
    const password = document.getElementById("loginPassword").value.trim();
    if (!password) {
      showToast("Enter a password in the field above to create your account");
      return;
    }
    let userId = null;
    try {
      const { user } = await signUpWithEmail(email, password, { name, email, role: roleLabel });
      userId = user.id;
    } catch (signUpErr) {
      // User may already exist — try signing in to get their ID
      try {
        const { user } = await signInWithEmail(email, password);
        userId = user.id;
      } catch (signInErr) {
        showToast("Could not create account. Check your email/password.");
        return;
      }
    }
    const app = await createApplication({
      user_id: userId,
      name, email, phone,
      role: roleLabel,
      location,
      details,
      status: "Pending"
    });
    state.applications.unshift({ ...app, id: undefined });
    // Notify admin about new application
    const { data: admins } = await supabase.from('profiles').select('id').eq('role', 'admin');
    for (const admin of (admins || [])) {
      await createNotification({ user_id: admin.id, message: `New ${roleLabel} application from ${name}`, type: 'info', link: 'admin' });
    }
  } catch (e) {
    state.applications.unshift({ name, email, phone, role: roleLabel, location, details, status: "Pending" });
  }
  saveState();
  renderHotDeals();
  document.getElementById("applicationForm").reset();
  showToast(`${roleLabel} application submitted for ${location}`);
  renderNotifications();
});

// ─── Notifications ─────────────────────────────
function pendingActionCount() {
  return (state.requests || []).filter(r => {
    if (r.statusIndex >= statuses.length - 1) return false;
    const a = COORD_ACTIONS[r.statusIndex];
    return a && (a.urgency === 'critical' || a.urgency === 'high');
  }).length;
}

async function renderNotifications() {
  const userId = (await getCurrentSession())?.user?.id;
  if (!userId) return;
  const notifs = await fetchNotifications(userId);
  const unread = notifs.filter(n => !n.read).length;
  // For coordinator view, show pending action count as badge
  const isCoord = state.portal === 'coordinator';
  const pac = isCoord ? pendingActionCount() : 0;
  const badgeCount = isCoord && pac > 0 ? pac : unread;
  document.getElementById("notifBadge").textContent = badgeCount || "";
  document.getElementById("notifBadge").style.display = badgeCount ? "flex" : "none";
  const list = document.getElementById("notifList");
  if (!notifs.length) {
    list.innerHTML = '<div class="notif-empty">No notifications yet</div>';
    return;
  }
  list.innerHTML = notifs.map(n => `
    <div class="notif-item ${n.read ? "" : "unread"}" data-nid="${n.id}">
      <span class="notif-msg">${n.message}</span>
      <span class="notif-time">${new Date(n.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}</span>
    </div>
  `).join("");
  list.querySelectorAll(".notif-item").forEach(el => {
    el.addEventListener("click", async () => {
      const nid = Number(el.dataset.nid);
      await markNotificationRead(nid);
      renderNotifications();
      const notif = notifs.find(n => n.id === nid);
      if (notif && notif.link) switchView(notif.link);
    });
  });
}

document.getElementById("notifBell")?.addEventListener("click", (e) => {
  e.stopPropagation();
  document.getElementById("notifPanel")?.classList.toggle("open");
  renderNotifications();
});

document.getElementById("markAllReadBtn")?.addEventListener("click", async () => {
  const userId = (await getCurrentSession())?.user?.id;
  if (!userId) return;
  await markAllNotificationsRead(userId);
  renderNotifications();
});

document.addEventListener("click", (e) => {
  const panel = document.getElementById("notifPanel");
  if (panel?.classList.contains("open") && !panel.contains(e.target) && e.target.id !== "notifBell") {
    panel.classList.remove("open");
  }
});

// Init dynamic fields on page load
renderDynamicFields("technician");

document.getElementById("switchPortalBtn")?.addEventListener("click", logoutPortal);
document.getElementById("sidebarLogoutBtn")?.addEventListener("click", logoutPortal);

async function notifyRoles(roles, message, type = 'info', link = '') {
  const { data: users } = await supabase.from('profiles').select('id').in('role', roles);
  for (const u of (users || [])) {
    await createNotification({ user_id: u.id, message, type, link });
  }
}

document.getElementById("advanceStatus")?.addEventListener("click", async () => {
  const request = activeRequest();
  if (request.statusIndex >= statuses.length - 1) {
    showToast("Repair lifecycle is already complete");
    return;
  }
  if (request.statusIndex === 9 && !request.paymentMethod) {
    showToast("Customer must select a payment method first");
    return;
  }
  if (request.statusIndex === 12 && request.paymentMethod === "Cash on Delivery" && request.paymentStatus !== "Paid") {
    showToast("COD payment must be collected before confirming received");
    return;
  }
  const prevIndex = request.statusIndex;
  request.statusIndex = Math.min(request.statusIndex + 1, statuses.length - 1);
  if (request.statusIndex === 9) request.invoiceSent = true;
  const session = await getCurrentSession();
  if (request.statusIndex === 13 && request.paymentMethod === "Online") {
    request.paymentStatus = "Paid";
  }
  saveState();
  renderAll();
  const statusName = statuses[request.statusIndex];
  const msg = `Request ${request.id} is now: ${statusName}`;
  // Notify customer at key touchpoints only
  if (request.customer_id) {
    const customerMsgs = {
      2: `Your quotation for ${request.id} is ready — review & approve`,
      9: `Invoice for ${request.id} is ready — complete your payment`,
      11: `${request.id} is out for delivery`,
      14: `${request.id} is complete. Thank you!`
    };
    const msg = customerMsgs[request.statusIndex];
    if (msg) await createNotification({ user_id: request.customer_id, message: msg, type: 'info' });
  }
  // Role-based notifications per status — coordinator is central hub
  switch (request.statusIndex) {
    case 1: // Under Review → coordinator evaluates
      await notifyRoles(['coordinator'], `${request.id}: Under review — prepare quotation`, 'info', 'coordinator');
      if (request.customer_id) {
        await createNotification({ user_id: request.customer_id, message: `Your request ${request.id} has been accepted and is under review.`, type: 'info' });
      }
      break;
    case 2: // Quotation Sent → customer reviews
      break;
    case 3: // Waiting Approval → customer approved → coordinator assigns team
      await notifyRoles(['coordinator'], `${request.id}: Customer approved quotation — assign technician & repairmaster`, 'info', 'coordinator');
      break;
    case 4: // Pickup Scheduled → notify assigned technician
      if (request.technician_id) {
        await createNotification({ user_id: request.technician_id, message: `Pickup scheduled for ${request.id}`, type: 'info', link: 'technician' });
      }
      await notifyRoles(['coordinator'], `${request.id}: Pickup scheduled with technician`, 'info', 'coordinator');
      break;
    case 5: // Device Picked Up → notify RepairingMaster device incoming
      await notifyRoles(['repairmaster'], `Device ${request.id} picked up — inspect & diagnose`, 'info', 'repairmaster');
      await notifyRoles(['coordinator'], `${request.id}: Device picked up, sent to repairmaster`, 'info', 'coordinator');
      break;
    case 6: // Under Diagnosis → coordinator informed
      await notifyRoles(['coordinator'], `${request.id}: Under diagnosis by repairmaster`, 'info', 'coordinator');
      break;
    case 7: // Repair In Progress → coordinator
      await notifyRoles(['coordinator'], `${request.id}: Repair in progress`, 'info', 'coordinator');
      break;
    case 8: // Quality Check → coordinator
      await notifyRoles(['coordinator'], `${request.id}: Quality check done`, 'info', 'coordinator');
      break;
    case 9: // Invoice Sent → customer
      break;
    case 10: // Payment Initiated → coordinator verifies
      await notifyRoles(['coordinator'], `Payment initiated for ${request.id} — verify`, 'info', 'coordinator');
      break;
    case 11: // Ready for Delivery → notify assigned technician
      if (request.technician_id) {
        await createNotification({ user_id: request.technician_id, message: `${request.id} ready for delivery`, type: 'info', link: 'technician' });
      }
      await notifyRoles(['coordinator'], `${request.id}: Ready for delivery`, 'info', 'coordinator');
      break;
    case 12: // Delivered → coordinator + customer
      await notifyRoles(['coordinator'], `${request.id}: Delivered to customer`, 'info', 'coordinator');
      break;
    case 13: // Payment Received → coordinator
      await notifyRoles(['coordinator'], `Payment received for ${request.id}`, 'success', 'coordinator');
      break;
    case 14: // Closed → customer
      break;
  }
  renderNotifications();
  showToast(`${request.id} moved to ${statusName}`);
});

document.getElementById("resetDemo")?.addEventListener("click", async () => {
  if (!confirm("Reset all demo data? This will clear all requests, applications, and marketplace changes.")) return;
  state = structuredClone(defaultState);
  document.getElementById("loginScreen")?.classList.remove("hidden");
  document.getElementById("appShell").classList.add("hidden");
  await saveState();
  await resetAllData();
  showToast("Demo data reset");
});

document.getElementById("requestImageInput")?.addEventListener("change", () => {
  const previews = document.getElementById("requestImagePreviews");
  previews.innerHTML = "";
  for (const file of Array.from(document.getElementById("requestImageInput").files)) {
    const reader = new FileReader();
    reader.onload = e => { const img = document.createElement("img"); img.src = e.target.result; img.style.cssText = "width:60px;height:60px;object-fit:cover;border-radius:6px;border:1px solid var(--line)"; previews.appendChild(img); };
    reader.readAsDataURL(file);
  }
});

document.getElementById("serviceForm")?.addEventListener("submit", async (event) => {
  event.preventDefault();
  const name = document.getElementById("nameInput").value.trim();
  const phone = document.getElementById("phoneInput").value.trim();
  const deviceType = document.getElementById("deviceType").value;
  const brand = document.getElementById("brandInput").value;
  const model = document.getElementById("modelInput").value.trim();
  const issue = document.getElementById("issueInput").value;
  const address = document.getElementById("addressInput").value.trim();
  if (!name || !phone || !model || !address) {
    showToast("Please fill in your name, phone, device model, and pickup address");
    return;
  }
  const id = `RM-${1024 + state.requests.length}`;
  const session = await getCurrentSession();
  const request = {
    id,
    customer: name,
    phone,
    deviceType,
    customer_id: session?.user?.id || null,
    brand,
    model,
    issue,
    address,
    statusIndex: 0,
    pickupTech: "Ravi - Mumbai West",
    repairPartner: "FixHub Andheri",
    quoteAmount: 0,
    quoteApproved: false,
    paymentStatus: "Pending",
    paymentMethod: "",
    invoiceSent: false,
    otpVerified: false,
    checks: { accepted: false, otp: false, photos: false, handover: false, delivery: false },
    conditionImages: [],
    requestImages: [],
    requirements: { backCover: "", glassType: "" },
    quoteItems: [],
    taxPercent: 0,
    taxAmount: 0
  };
  // Upload device photos from the form
  const imgInput = document.getElementById("requestImageInput");
  if (imgInput && imgInput.files && imgInput.files.length) {
    for (const file of Array.from(imgInput.files)) {
      try {
        const url = await uploadImage(file);
        request.requestImages.push(url);
      } catch {
        const reader = new FileReader();
        const url = await new Promise(r => { reader.onload = e => r(e.target.result); reader.readAsDataURL(file); });
        request.requestImages.push(url);
      }
    }
  }
  state.requests.unshift(request);
  state.activeRequestId = id;
  saveState();
  renderAll();
  // Notify customer their request was submitted
  if (session?.user?.id) {
    await createNotification({ user_id: session.user.id, message: `Your request ${id} has been submitted. A coordinator will review it shortly.`, type: 'info' });
  }
  // Notify coordinator about new request
  await notifyRoles(['coordinator'], `New request ${id} from ${name} — ${model}: ${issue}. Accept to begin review`, 'info', 'coordinator');
  renderNotifications();
  showToast(`${id} created for ${name} and sent to coordinator`);
});

document.getElementById("approveQuote")?.addEventListener("click", async () => {
  const request = activeRequest();
  request.quoteApproved = true;
  request.statusIndex = Math.max(request.statusIndex, 3);
  saveState();
  renderAll();
  await notifyRoles(['coordinator'], `${request.id}: Customer approved quotation — assign technician & repairmaster`, 'info', 'coordinator');
  renderNotifications();
  showToast("Quotation approved — coordinator notified to assign team");
});

document.getElementById("uploadConditionBtn")?.addEventListener("click", async () => {
  const input = document.getElementById("conditionInput");
  const request = activeRequest();
  if (!input.files || !input.files.length) {
    showToast("Select device condition photos to upload");
    return;
  }
  let loaded = 0;
  const total = input.files.length;
  for (const file of Array.from(input.files)) {
    try {
      const url = await uploadImage(file);
      request.conditionImages.push(url);
    } catch {
      // fallback to data URL
      const reader = new FileReader();
      const url = await new Promise(r => { reader.onload = e => r(e.target.result); reader.readAsDataURL(file); });
      request.conditionImages.push(url);
    }
    loaded++;
  }
  saveState();
  renderAll();
  showToast(`${total} condition photo(s) uploaded`);
  input.value = "";
});

document.getElementById("saveRequirements")?.addEventListener("click", () => {
  const request = activeRequest();
  const backCover = document.getElementById("backCoverInput").value;
  const glassType = document.getElementById("glassInput").value;
  if (!backCover || !glassType) {
    showToast("Please select both back cover and glass preferences");
    return;
  }
  request.requirements = { backCover, glassType };
  request.statusIndex = Math.max(request.statusIndex, 1);
  saveState();
  renderAll();
  showToast("Requirements saved");
});

document.getElementById("payOnlineBtn")?.addEventListener("click", () => {
  const request = activeRequest();
  request.paymentMethod = "Online";
  request.paymentStatus = "Paid";
  request.statusIndex = Math.max(request.statusIndex, 10);
  saveState();
  renderAll();
  showToast("Online payment received");
});

document.getElementById("payCodBtn")?.addEventListener("click", () => {
  const request = activeRequest();
  request.paymentMethod = "Cash on Delivery";
  request.paymentStatus = "Pending (COD)";
  request.statusIndex = Math.max(request.statusIndex, 10);
  saveState();
  renderAll();
  showToast("Cash on Delivery selected");
});

const assignDeliveryBtn = document.getElementById("assignDelivery");
if (assignDeliveryBtn) {
  assignDeliveryBtn.addEventListener("click", () => {
    const tech = document.getElementById("deliveryTech").value;
    const address = document.getElementById("deliveryAddress").value.trim();
    const editIdx = document.getElementById("deliveryAddress").dataset.editOrder;
    const order = editIdx ? state.marketOrders[Number(editIdx)] : state.marketOrders.find((o) => o.statusIndex === 0);
    if (!order) { showToast("Select an order first"); return; }
    if (!address) { showToast("Enter a delivery address"); return; }
    order.assignedTech = tech;
    order.address = address;
    order.statusIndex = Math.max(order.statusIndex, 1);
    saveState();
    renderAll();
    showToast(`${order.id} assigned to ${tech}`);
  });
}

const saveAssignBtn = document.getElementById("saveAssignments");
if (saveAssignBtn) {
  saveAssignBtn.addEventListener("click", () => {
    const request = activeRequest();
    request.pickupTech = document.getElementById("pickupTech").value;
    request.repairPartner = document.getElementById("repairPartner").value;
    request.statusIndex = Math.max(request.statusIndex, 4);
    saveState();
    renderAll();
    showToast("Pickup scheduled and assignments saved");
  });
}

const acceptBtn = document.getElementById("acceptRequestBtn");
if (acceptBtn) {
  acceptBtn.addEventListener("click", async () => {
    const request = activeRequest();
    if (!request || request.statusIndex !== 0) return;
    request.statusIndex = 1;
    saveState();
    renderAll();
    await notifyRoles(['coordinator'], `${request.id}: Accepted — prepare quotation now`, 'success', 'coordinator');
    if (request.customer_id) {
      await createNotification({ user_id: request.customer_id, message: `Your request ${request.id} has been accepted and is under review.`, type: 'info' });
    }
    showToast(`${request.id} accepted — now prepare quotation`);
  });
}

document.getElementById("verifyOtp")?.addEventListener("click", () => {
  const request = activeRequest();
  if (document.getElementById("otpInput").value.length !== 4) {
    showToast("Enter the 4-digit customer OTP");
    return;
  }
  request.otpVerified = true;
  request.checks.otp = true;
  request.statusIndex = Math.max(request.statusIndex, 5);
  saveState();
  renderAll();
  showToast("OTP verified and pickup confirmed");
});

document.getElementById("sendQuote")?.addEventListener("click", () => {
  const request = activeRequest();
  const selectedCheckboxes = Array.from(document.querySelectorAll(".parts-grid input:checked"));
  if (!selectedCheckboxes.length) {
    showToast("Select at least one repair part before sending quotation");
    return;
  }
  const baseFee = state.baseInspectionFee || 499;
  const minFee = state.minServiceFee || 150;
  const parts = state.repairParts || [];
  const selectedItems = [];
  let partsTotal = 0;
  selectedCheckboxes.forEach((cb) => {
    const pi = Number(cb.dataset.pi);
    const part = parts[pi];
    if (part && part.stock > 0) {
      selectedItems.push({ name: part.name, cost: part.cost });
      partsTotal += part.cost;
      part.stock = Math.max(0, part.stock - 1);
    }
  });
  if (!selectedItems.length) {
    showToast("Selected parts are out of stock");
    return;
  }
  const subtotal = Math.max(partsTotal + baseFee, minFee);
  const scPct = state.serviceChargePercent || 0;
  const serviceCharge = Math.round(subtotal * scPct / 100);
  const taxPct = state.taxPercent || 0;
  const taxableAmount = subtotal + serviceCharge;
  const taxAmount = Math.round(taxableAmount * taxPct / 100);
  const amount = taxableAmount + taxAmount;
  request.quoteAmount = amount;
  request.taxPercent = taxPct;
  request.taxAmount = taxAmount;
  request.serviceChargePercent = scPct;
  request.serviceChargeAmount = serviceCharge;
  request.quoteItems = selectedItems;
  request.statusIndex = Math.max(request.statusIndex, 2);
  saveState();
  renderAll();
  showToast(`Quotation sent for ${formatCurrency(amount)}`);
});

document.getElementById("listingPrice")?.addEventListener("input", updateListingCommission);

const minFeeInput = document.getElementById("minServiceFeeInput");
if (minFeeInput) {
  minFeeInput.addEventListener("change", () => {
    state.minServiceFee = Math.max(0, Number(minFeeInput.value) || 0);
    saveState();
    showToast(`Minimum service fee set to INR ${state.minServiceFee}`);
  });
}

const baseFeeInput = document.getElementById("baseFeeInput");
if (baseFeeInput) {
  baseFeeInput.addEventListener("change", () => {
    state.baseInspectionFee = Math.max(0, Number(baseFeeInput.value) || 0);
    saveState();
    showToast(`Base inspection fee set to INR ${state.baseInspectionFee}`);
  });
}

const taxInput = document.getElementById("taxPercentInput");
if (taxInput) {
  taxInput.addEventListener("change", () => {
    state.taxPercent = Math.max(0, Math.min(100, Number(taxInput.value) || 0));
    saveState();
    showToast(`Tax rate set to ${state.taxPercent}%`);
  });
}

const scInput = document.getElementById("serviceChargeInput");
if (scInput) {
  scInput.addEventListener("change", () => {
    state.serviceChargePercent = Math.max(0, Math.min(100, Number(scInput.value) || 0));
    saveState();
    showToast(`Service charge set to ${state.serviceChargePercent}%`);
  });
}

document.getElementById("addPartBtn")?.addEventListener("click", () => {
  const name = document.getElementById("newPartName").value.trim();
  const cost = Number(document.getElementById("newPartCost").value || 0);
  const stock = Number(document.getElementById("newPartStock").value || 0);
  if (!name || cost <= 0) {
    showToast("Enter a part name and valid price");
    return;
  }
  state.repairParts.push({ name, cost, stock });
  document.getElementById("newPartName").value = "";
  document.getElementById("newPartCost").value = "";
  document.getElementById("newPartStock").value = "";
  saveState();
  renderAll();
  showToast(`${name} added to parts`);
});

document.addEventListener("input", (e) => {
  const pi = e.target.dataset.pi;
  if (e.target.classList.contains("part-cost-input") && pi !== undefined) {
    const part = state.repairParts[Number(pi)];
    if (part) {
      part.cost = Math.max(0, Number(e.target.value) || 0);
      saveState();
    }
  }
});

document.addEventListener("click", (e) => {
  if (e.target.classList.contains("part-remove-btn")) {
    const pi = Number(e.target.dataset.pi);
    const part = state.repairParts[pi];
    if (part && confirm(`Remove "${part.name}" from parts list?`)) {
      state.repairParts.splice(pi, 1);
      saveState();
      renderAll();
      showToast(`${part.name} removed`);
    }
  }
});

document.getElementById("marketUploadForm")?.addEventListener("submit", async (event) => {
  event.preventDefault();
  const model = document.getElementById("listingModel").value.trim();
  const basePrice = Number(document.getElementById("listingPrice").value || 0);
  if (!model || basePrice <= 0) {
    showToast("Please enter a device model and a valid price");
    return;
  }
  const finalPrice = displayPrice(basePrice);
  const fileInput = document.getElementById("listingImage");
  const item = {
    model,
    grade: document.getElementById("listingGrade").value,
    basePrice,
    warranty: document.getElementById("listingWarranty").value,
    owner: activeRequest().repairPartner || "RepairingMaster Partner",
    sold: false,
    images: [],
    currentSlide: 0
  };
  if (fileInput.files && fileInput.files.length) {
    for (const file of Array.from(fileInput.files)) {
      try {
        const url = await uploadImage(file);
        item.images.push(url);
      } catch {
        const reader = new FileReader();
        const url = await new Promise(r => { reader.onload = e => r(e.target.result); reader.readAsDataURL(file); });
        item.images.push(url);
      }
    }
  }
  if (!item.images.length) item.images = [defaultDeviceIcon];
  state.marketplace.unshift(item);
  saveState();
  renderAll();
  showToast(`${item.model} listed at ${formatCurrency(finalPrice)}`);
  document.getElementById("marketUploadForm").reset();
});

document.getElementById("backCoverForm")?.addEventListener("submit", (event) => {
  event.preventDefault();
  const model = document.getElementById("bcModel").value.trim();
  const design = document.getElementById("bcDesign").value;
  const customer = document.getElementById("bcCustomer").value.trim();
  if (!model || !customer) {
    showToast("Enter device model and customer name");
    return;
  }
  showToast(`Back cover order created for ${customer}: ${model} in ${design}`);
});

document.querySelectorAll(".segmented button").forEach((button) => {
  button.addEventListener("click", () => {
    marketFilter = button.dataset.grade;
    document.querySelectorAll(".segmented button").forEach((item) => item.classList.toggle("active", item === button));
    renderMarketplace();
  });
});

// Login UI initialization
function initLoginUI() {
  const loginTabs = document.querySelectorAll(".login-tab");
  if (!loginTabs.length) return;

  function applyTab(tab) {
    const mode = tab.dataset.tab;
    const nameField = document.getElementById("nameField");
    const cityField = document.getElementById("cityField");
    const applyLinks = document.getElementById("applyLinks");
    const submitBtn = document.getElementById("unifiedLoginForm")?.querySelector("button");
    const loginHelper = document.getElementById("loginHelper");
    const testingLogin = document.getElementById("testingLogin");
    if (nameField) nameField.style.display = mode === "signup" ? "" : "none";
    if (cityField) cityField.style.display = mode === "signup" ? "" : "none";
    if (applyLinks) applyLinks.style.display = mode === "employee" ? "" : "none";
    if (testingLogin) testingLogin.style.display = mode === "employee" ? "" : "none";
    if (submitBtn) submitBtn.textContent = mode === "signup" ? "Create Account" : "Sign In";
    if (loginHelper) {
      if (mode === "signin") loginHelper.textContent = "Sign in to your account";
      else if (mode === "signup") loginHelper.textContent = "Create an account to get started";
      else loginHelper.textContent = "Already have an approved application? Sign in.";
    }
  }

  loginTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      loginTabs.forEach(t => t.classList.remove("active"));
      tab.classList.add("active");
      applyTab(tab);
    });
  });

  // Initial state — Sign Up tab active
  applyTab(document.querySelector(".login-tab.active"));
}

// Testing login — global function called from HTML onclick
window.handleGoogleLogin = async function handleGoogleLogin() {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo: window.location.origin + '/' }
  });
  if (error) showToast(error.message);
};

const TEST_CREDS = {
  coordinator:  { email: 'coord@test.repairmaster',  password: 'test123', role: 'coordinator' },
  technician:   { email: 'tech@test.repairmaster',   password: 'test123', role: 'technician' },
  repairmaster: { email: 'rm@test.repairmaster',     password: 'test123', role: 'repairmaster' }
};

window.handleTestLogin = async function handleTestLogin(roleKey) {
  const c = TEST_CREDS[roleKey];
  if (!c) return;
  try {
    let result;
    try {
      result = await signInWithEmail(c.email, c.password);
    } catch {
      await signUpWithEmail(c.email, c.password, { name: c.email.split('@')[0], email: c.email, phone: '', role: c.role, city: '' });
      result = await signInWithEmail(c.email, c.password);
    }
    if (result.user) {
      let profile = await fetchProfile(result.user.id);
      if (!profile) {
        await supabase.from('profiles').insert({
          id: result.user.id,
          email: c.email,
          name: c.email.split('@')[0],
          phone: '',
          role: c.role,
          city: ''
        });
      } else if (!profile.role) {
        await supabase.from('profiles').update({ role: c.role }).eq('id', result.user.id);
      }
    }
    state.activeUser = { name: c.email.split('@')[0], email: c.email, role: c.role };
    state.activePortal = c.role;
    state.activeView = portalLanding[c.role] || 'customer';
    loginPortal(c.role);
  } catch (err) {
    showToast(err.message || "Test login failed");
  }
};

// Initialize login UI when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initLoginUI);
} else {
  initLoginUI();
}
(async function initApp() {
  Object.assign(state, await loadState());
  const session = await getCurrentSession();

  if (session) {
    let profile = await fetchProfile(session.user.id);
    if (!profile) {
      const meta = session.user.user_metadata || {};
      const newProfile = {
        id: session.user.id,
        email: session.user.email || meta.email || '',
        name: meta.full_name || meta.name || session.user.email?.split('@')[0] || 'User',
        phone: '',
        role: 'customer',
        city: ''
      };
      await supabase.from('profiles').upsert(newProfile);
      profile = newProfile;
    }
    if (profile && profile.role) {
      state.activeUser = profile;
      state.activePortal = profile.role;
      state.activeView = portalLanding[profile.role] || 'customer';
      document.getElementById('loginScreen').style.display = 'none';
      document.getElementById('appShell').style.display = '';
      renderAll();
      showToast(`Welcome back, ${profile.name || profile.email}`);
      return;
    }
  }

  // No session — show login screen
  document.getElementById('loginScreen').style.display = '';
  document.getElementById('appShell').style.display = 'none';
  renderHotDeals();
})();
