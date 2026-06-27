const statuses = [
  "Request Submitted",
  "Requirements Provided",
  "Quotation Sent",
  "Waiting Approval",
  "Pickup Scheduled",
  "Device Picked Up",
  "Under Diagnosis",
  "Repair In Progress",
  "Quality Check",
  "Invoice Sent",
  "Invoice Paid",
  "Ready for Delivery",
  "Delivered",
  "Closed"
];

const orderStatuses = [
  "Pending Pickup",
  "Pickup Assigned",
  "Picked Up",
  "Out for Delivery",
  "Delivered"
];

const storageKey = "repairingmaster-state-v5";
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
  repairmaster: "RepairMaster Portal",
  coordinator: "Coordinator Portal",
  admin: "Admin Portal"
};

const roleDisplayNames = {
  customer: "Customer", marketplace: "Marketplace Buyer",
  technician: "Technician", repairmaster: "RepairMaster",
  coordinator: "Coordinator", admin: "Admin"
};

const defaultDeviceIcon = "image/device-repair.png";

function firstApproved(role) {
  const found = state.applications.find(a => a.role === role && a.status === "Approved");
  return found ? found.name + (found.location ? " — " + found.location : "") : role === "Technician" ? "Testing Technician — Test Lab" : "Testing RepairMaster — Test Lab";
}

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
  applications: [
    { name: "Testing Technician", role: "Technician", location: "Test Lab", status: "Approved" },
    { name: "Testing RepairMaster", role: "RepairMaster", location: "Test Lab", status: "Approved" },
    { name: "Ravi Kumar", role: "Technician", location: "Mumbai West", status: "Approved" },
    { name: "FixHub Andheri", role: "RepairMaster", location: "Mumbai West", status: "Approved" },
    { name: "Ananya Rao", role: "Coordinator", location: "Mumbai West", status: "Approved" },
    { name: "Admin Team", role: "Admin", location: "All India", status: "Approved" }
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
      brand: "Apple",
      model: "iPhone 14 Pro",
      issue: "Screen damage",
      address: "Bandra West, Mumbai, Maharashtra",
      statusIndex: 5,
      pickupTech: "Testing Technician — Test Lab",
      repairPartner: "Testing RepairMaster — Test Lab",
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
      brand: "Samsung",
      model: "Galaxy S24",
      issue: "Battery issue",
      address: "Indiranagar, Bengaluru, Karnataka",
      statusIndex: 7,
      pickupTech: "Testing Technician — Test Lab",
      repairPartner: "Testing RepairMaster — Test Lab",
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
      brand: "Google",
      model: "Pixel 9",
      issue: "Charging port fault",
      address: "Sector 62, Noida, Uttar Pradesh",
      statusIndex: 10,
      pickupTech: "Testing Technician — Test Lab",
      repairPartner: "Testing RepairMaster — Test Lab",
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

let state = loadState();
let marketFilter = "All";

function loadState() {
  const stored = localStorage.getItem(storageKey);
  if (!stored) return structuredClone(defaultState);

  try {
    return normalizeState(JSON.parse(stored));
  } catch {
    return structuredClone(defaultState);
  }
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
    invoiceSent: r.invoiceSent || false,
    paymentMethod: r.paymentMethod || "",
    requirements: r.requirements || { backCover: "", glassType: "" },
    quoteItems: r.quoteItems || [],
    taxPercent: r.taxPercent || 0,
    taxAmount: r.taxAmount || 0,
    serviceChargePercent: r.serviceChargePercent || 0,
    serviceChargeAmount: r.serviceChargeAmount || 0
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

function saveState() {
  localStorage.setItem(storageKey, JSON.stringify(state));
}

function formatCurrency(amount) {
  return `INR ${Number(amount || 0).toLocaleString("en-IN")}`;
}

function commissionFor(price) {
  return Math.round(Number(price || 0) * ownerCommissionRate);
}

function activeRequest() {
  return state.requests.find((request) => request.id === state.activeRequestId) || state.requests[0];
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
    repairmaster: "RepairMaster Portal",
    admin: "Admin Console",
    marketplace: "Device on sell"
  };

  document.getElementById("operationSelect").value = nextView;
  const req = activeRequest();
  document.getElementById("pageTitle").textContent = titles[nextView] + (req ? ` — ${req.id}` : "");
  document.getElementById("advanceStatus").classList.toggle("hidden", ["marketplace", "admin", "coordinator"].includes(nextView));
  document.querySelector(".status-strip").classList.toggle("hidden", ["marketplace", "admin"].includes(nextView));
  updateUserTopInfo();
  saveState();
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
  state.activeView = portalLanding[portal];

  // Auto-select the request assigned to the current user
  const user = state.activeUser;
  if (user) {
    if (portal === "technician") {
      const mine = state.requests.find(r =>
        r.pickupTech && (r.pickupTech.includes(user.name) || user.name.includes(r.pickupTech.split(" —")[0].split(" -")[0]))
      );
      if (mine) state.activeRequestId = mine.id;
    } else if (portal === "repairmaster") {
      const mine = state.requests.find(r =>
        r.repairPartner && (r.repairPartner.includes(user.name) || user.name.includes(r.repairPartner.split(" —")[0].split(" -")[0]))
      );
      if (mine) state.activeRequestId = mine.id;
    }
  }

  document.getElementById("loginScreen").classList.add("hidden");
  document.getElementById("appShell").classList.remove("hidden");
  applyPortalAccess();
  updateUserBadge();
  updateTopbarUser();
  renderAll();
  showToast(`${portalNames[portal]} opened`);
}

function updateUserBadge() {
  const user = state.activeUser || { name: "User", email: "", role: state.activePortal };
  document.getElementById("userName").textContent = user.name;
  document.getElementById("userRoleBadge").textContent = user.role || state.activePortal || "";
  document.getElementById("userAvatar").textContent = (user.name || "U").charAt(0).toUpperCase();
}

function updateTopbarUser() {
  const user = state.activeUser || { name: "User", role: state.activePortal };
  const initial = (user.name || "U").charAt(0).toUpperCase();
  document.getElementById("topbarAvatar").textContent = initial;
  updateUserTopInfo();
}

function updateUserTopInfo() {
  const user = state.activeUser;
  const el = document.getElementById("userTopInfo");
  if (!el) return;
  if (!user) { el.innerHTML = ""; return; }
  const roleDisplay = roleDisplayNames[user.role] || user.role || "";
  const isTesting = user.name.toLowerCase().includes("testing") || (user.email && user.email.includes("test.com"));
  let html = `<span class="user-name-tag">${user.name}</span><span class="user-role-tag">${roleDisplay}</span>`;
  if (isTesting) html += `<span class="testing-badge">Testing</span>`;
  const req = activeRequest();
  if (req) html += `<span class="ticket-tag">| ${req.id}</span>`;
  el.innerHTML = html;
}

function openAccountOverlay() {
  const user = state.activeUser || { name: "User", email: "", role: state.activePortal };
  const initial = (user.name || "U").charAt(0).toUpperCase();
  document.getElementById("overlayAvatar").textContent = initial;
  document.getElementById("overlayName").textContent = user.name;
  document.getElementById("overlayEmail").textContent = user.email || "No email";
  const displayRole = roleDisplayNames[user.role] || user.role || "N/A";
  document.getElementById("overlayRole").textContent = displayRole;
  document.getElementById("accountOverlay").classList.add("open");
}

function closeAccountOverlay() {
  document.getElementById("accountOverlay").classList.remove("open");
}

function logoutPortal() {
  state.activePortal = null;
  document.getElementById("userTopInfo").innerHTML = "";
  saveState();
  document.getElementById("appShell").classList.add("hidden");
  document.getElementById("loginScreen").classList.remove("hidden");
}

function renderProgress() {
  const request = activeRequest();
  document.getElementById("statusText").textContent = statuses[request.statusIndex];
  document.getElementById("progressTrack").innerHTML = statuses.map((status, index) => {
    const className = index < request.statusIndex ? "step done" : index === request.statusIndex ? "step current" : "step";
    return `<span class="${className} ${index < request.statusIndex ? 'clickable' : ''}" data-index="${index}" data-label="${status}"></span>`;
  }).join("");
  document.querySelectorAll("#progressTrack .step.clickable").forEach((el) => {
    el.addEventListener("click", () => {
      const idx = parseInt(el.dataset.index);
      if (idx < request.statusIndex) {
        request.statusIndex = idx;
        saveState();
        renderAll();
        showToast(`Moved back to ${statuses[idx]}`);
      }
    });
  });
}

function renderCustomer() {
  const request = activeRequest();
  document.getElementById("activeRequestLabel").textContent = request.id;
  document.getElementById("activeRequestMeta").textContent = `${request.model} - ${request.issue}`;
  document.getElementById("deviceTitle").textContent = request.model;
  document.getElementById("deviceIssue").textContent = `${request.issue}, pickup from ${request.address}`;

  // Requirements section - show only at status 0 (before quote)
  const reqSection = document.getElementById("requirementsSection");
  if (reqSection) {
    reqSection.style.display = request.statusIndex === 0 ? "block" : "none";
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
    cv.innerHTML = request.conditionImages.map((img) => `<img src="${img}" alt="Device condition">`).join("");
  }

  // Invoice section - show at status 7 (Invoice Sent)
  const invSection = document.getElementById("invoiceSection");
  if (invSection) {
    invSection.style.display = request.statusIndex === 9 ? "block" : "none";
    document.getElementById("invoiceAmount").textContent = formatCurrency(request.quoteAmount);
    document.getElementById("payOnlineBtn").style.display = "";
    document.getElementById("payCodBtn").style.display = "";
    const confirmEl = document.getElementById("paymentConfirmation");
    if (request.paymentMethod === "Online") {
      confirmEl.textContent = "Payment received. Repair will begin shortly.";
      confirmEl.style.display = "block";
      document.getElementById("payOnlineBtn").style.display = "none";
      document.getElementById("payCodBtn").style.display = "none";
    } else if (request.paymentMethod === "Cash on Delivery") {
      confirmEl.textContent = "Cash on Delivery selected. You will pay when the device is delivered.";
      confirmEl.style.display = "block";
      document.getElementById("payOnlineBtn").style.display = "none";
      document.getElementById("payCodBtn").style.display = "none";
    } else {
      confirmEl.style.display = "none";
    }
  }

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

function renderCoordinator() {
  const open = state.requests.filter((r) => r.statusIndex < statuses.length - 1).length;
  const revenue = state.requests.reduce((sum, r) => sum + r.quoteAmount, 0);
  document.getElementById("openTickets").textContent = open;
  document.getElementById("revenueMetric").textContent = formatCurrency(revenue);
  document.getElementById("avgRepairTime").textContent = open ? "31h" : "N/A";
  document.getElementById("customerRating").textContent = "4.8";
  if (!state.requests.length) {
    document.getElementById("requestList").innerHTML = `<div class="empty-state">No service requests yet. Create one from the Customer portal.</div>`;
  } else {
    document.getElementById("requestList").innerHTML = state.requests.map((request) => `
    <button class="request-row" data-request="${request.id}">
      <div>
        <h3>${request.id} - ${request.model}</h3>
        <p>${request.customer} | ${request.issue} | ${request.repairPartner}</p>
      </div>
      <span class="status-pill">${statuses[request.statusIndex]}</span>
    </button>
  `).join("");

    document.querySelectorAll(".request-row").forEach((row) => {
      row.addEventListener("click", () => {
        state.activeRequestId = row.dataset.request;
        syncAssignmentFields();
        renderAll();
        showToast(`${state.activeRequestId} selected`);
      });
    });
  }

  syncAssignmentFields();

  const orderList = document.getElementById("orderList");
  if (!orderList) return;
  const pendingOrders = state.marketOrders.filter((o) => o.statusIndex < orderStatuses.length - 1);
  if (!pendingOrders.length) {
    orderList.innerHTML = `<div class="empty-state">No marketplace orders pending.</div>`;
    document.getElementById("orderAssignPanel").style.display = "none";
    return;
  }
  document.getElementById("orderAssignPanel").style.display = "grid";
  orderList.innerHTML = pendingOrders.map((order, i) => `
    <button class="request-row order-row" data-order="${i}">
      <div>
        <h3>${order.id} - ${order.itemModel}</h3>
        <p>${order.repairMaster} | ${orderStatuses[order.statusIndex]}</p>
      </div>
      <span class="status-pill">${orderStatuses[order.statusIndex]}</span>
    </button>
  `).join("");

  document.querySelectorAll(".order-row").forEach((row) => {
    row.addEventListener("click", () => {
      const order = state.marketOrders[Number(row.dataset.order)];
      document.getElementById("deliveryTech").value = order.assignedTech || firstApproved("Technician");
      document.getElementById("deliveryAddress").value = order.address || "";
      document.getElementById("deliveryAddress").dataset.editOrder = row.dataset.order;
    });
  });
}

function syncAssignmentFields() {
  populateRoleDropdowns();
  const request = activeRequest();
  const pt = document.getElementById("pickupTech");
  if (pt) pt.value = request.pickupTech;
  const rp = document.getElementById("repairPartner");
  if (rp) rp.value = request.repairPartner;
}

function populateRoleDropdowns() {
  // Ensure test entries are always present
  const testTech = { name: "Testing Technician", role: "Technician", location: "Test Lab", status: "Approved" };
  const testRM = { name: "Testing RepairMaster", role: "RepairMaster", location: "Test Lab", status: "Approved" };
  if (!state.applications.some(a => a.name === "Testing Technician")) state.applications.push(testTech);
  if (!state.applications.some(a => a.name === "Testing RepairMaster")) state.applications.push(testRM);
  saveState();

  const approvedTechs = state.applications
    .filter(a => a.role === "Technician" && a.status === "Approved");
  const approvedRMs = state.applications
    .filter(a => a.role === "RepairMaster" && a.status === "Approved");

  const techOpts = approvedTechs.map(a =>
    `<option value="${a.name}${a.location ? " — " + a.location : ""}">Technician — ${a.name}${a.location ? " — " + a.location : ""}</option>`
  ).join("");
  const rmOpts = approvedRMs.map(a =>
    `<option value="${a.name}${a.location ? " — " + a.location : ""}">RepairMaster — ${a.name}${a.location ? " — " + a.location : ""}</option>`
  ).join("");

  const pt = document.getElementById("pickupTech");
  const dt = document.getElementById("deliveryTech");
  const rp = document.getElementById("repairPartner");

  if (pt) { pt.innerHTML = techOpts || '<option value="">No approved technicians</option>'; }
  if (dt) { dt.innerHTML = techOpts || '<option value="">No approved technicians</option>'; }
  if (rp) { rp.innerHTML = rmOpts || '<option value="">No approved repair partners</option>'; }
}

function renderRoleSummary() {
  const request = activeRequest();
  const portal = state.activePortal;
  const si = request.statusIndex;

  // Technician summary
  const techPending = {
    0: "Awaiting assignment", 1: "Awaiting assignment", 2: "Awaiting assignment", 3: "Awaiting assignment",
    4: "Device pickup from customer",
    5: "Handover to RepairMaster",
    6: "Repair in progress at lab",
    7: "Repair in progress at lab",
    8: "Quality check at lab",
    9: "Invoice pending",
    10: "Ready for delivery",
    11: "Delivery to customer",
    12: "Delivery confirmation",
    13: "Completed"
  };
  const techNext = {
    0: "—", 1: "—", 2: "—", 3: "—",
    4: "Collect device & verify OTP",
    5: "Complete handover checklist",
    6: "Wait for repair completion",
    7: "Wait for repair completion",
    8: "Wait for QC completion",
    9: "Wait for payment",
    10: "Wait for delivery assignment",
    11: "Deliver device to customer",
    12: "Confirm delivery with customer",
    13: "All done"
  };
  const rmPending = {
    0: "Awaiting device from technician", 1: "Awaiting device from technician",
    2: "Awaiting device from technician", 3: "Awaiting device from technician",
    4: "Device pickup scheduled",
    5: "Device received — needs diagnosis",
    6: "Diagnosis in progress",
    7: "Repair in progress",
    8: "Quality check in progress",
    9: "Waiting for customer payment",
    10: "Ready for delivery",
    11: "Delivery in progress",
    12: "Completed",
    13: "Completed"
  };
  const rmNext = {
    0: "—", 1: "—", 2: "—", 3: "—",
    4: "Receive device from technician",
    5: "Run diagnosis on device",
    6: "Complete diagnosis & send quotation",
    7: "Complete repair & run QC",
    8: "Pass QC & send invoice",
    9: "Wait for payment confirmation",
    10: "Assign delivery technician",
    11: "Track delivery",
    12: "All done", 13: "All done"
  };

  // Count marketplace deliveries pending for current technician
  const techName = state.activeUser ? state.activeUser.name : "";
  const pendingDeliveries = state.marketOrders.filter(o =>
    o.assignedTech && o.assignedTech.includes(techName) && o.statusIndex < 4
  ).length;

  // Update notification badge on bell icon
  const badge = document.getElementById("mbNotifBadge");
  if (badge) {
    const totalPending = pendingDeliveries + (si < 13 ? 1 : 0);
    if (totalPending > 0) {
      badge.textContent = totalPending;
      badge.style.display = "grid";
    } else {
      badge.style.display = "none";
    }
  }

  // Update technician summary
  const tJob = document.getElementById("techSummaryJob");
  if (tJob) {
    tJob.textContent = request.id + " · " + request.model;
    document.getElementById("techSummaryStatus").textContent = statuses[si] || "Active";
    document.getElementById("techSummaryPending").textContent = techPending[si] || "—";
    document.getElementById("techSummaryNext").textContent = techNext[si] || "—";
    if (pendingDeliveries > 0) {
      document.getElementById("techSummaryPending").textContent += ` + ${pendingDeliveries} delivery(ies)`;
    }
  }

  // Update repairmaster summary
  const rJob = document.getElementById("rmSummaryJob");
  if (rJob) {
    rJob.textContent = request.id + " · " + request.model;
    document.getElementById("rmSummaryStatus").textContent = statuses[si] || "Active";
    document.getElementById("rmSummaryPending").textContent = rmPending[si] || "—";
    document.getElementById("rmSummaryNext").textContent = rmNext[si] || "—";
    // Count sold items awaiting pickup
    const partnerName = request.repairPartner || "";
    const pendingSold = state.marketOrders.filter(o =>
      o.repairMaster === partnerName && o.statusIndex < 4
    ).length;
    if (pendingSold > 0) {
      document.getElementById("rmSummaryPending").textContent += ` + ${pendingSold} sale(s) awaiting pickup`;
    }
  }
}

function renderTechnician() {
  const request = activeRequest();
  const isDelivery = request.statusIndex >= 11;
  const techName = state.activeUser ? state.activeUser.name : request.pickupTech || "Technician";
  document.getElementById("techJobTitle").textContent = `${isDelivery ? "Delivery" : "Pickup"} ${request.id}`;
  document.getElementById("techJobMeta").textContent = `${techName} → ${request.customer} | ${request.address} | ${request.model}`;
  const techPreviews = document.getElementById("techConditionPreviews");
  if (techPreviews) {
    if (request.conditionImages.length) {
      techPreviews.innerHTML = `<span style="font-size:12px;font-weight:800;color:var(--muted);width:100%">Device condition photos:</span>` +
        request.conditionImages.map((img) => `<img src="${img}" alt="Device condition">`).join("");
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
    ["handover", "Device handed to RepairMaster"],
    ["delivery", "Delivery confirmation"]
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
      saveState();
      renderAll();
      showToast("Technician checklist updated");
    });
  });

  const deliveryList = document.getElementById("techDeliveryList");
  if (deliveryList) {
    const myDeliveries = state.marketOrders.filter((o) => o.assignedTech && o.statusIndex < 4);
    if (!myDeliveries.length) {
      deliveryList.innerHTML = `<div class="empty-state">No delivery tasks assigned.</div>`;
    } else {
      deliveryList.innerHTML = myDeliveries.map((o, i) => `
        <div class="tech-delivery-card">
          <div>
            <h4>${o.id} - ${o.itemModel}</h4>
            <p>Pickup from ${o.repairMaster} &rarr; Deliver to ${o.address}</p>
          </div>
          <span class="status-pill">${orderStatuses[o.statusIndex]}</span>
          ${o.statusIndex < 4 ? `<button class="adv-order" data-oi="${i}">Advance</button>` : ""}
        </div>
      `).join("");

      document.querySelectorAll(".adv-order").forEach((btn) => {
        btn.addEventListener("click", () => {
          const o = state.marketOrders[Number(btn.dataset.oi)];
          o.statusIndex = Math.min(o.statusIndex + 1, orderStatuses.length - 1);
          saveState();
          renderAll();
          showToast(`${o.id} moved to ${orderStatuses[o.statusIndex]}`);
        });
      });
    }
  }
}

function renderRepairMaster() {
  // Show current repair partner on the bench card
  const rmTitle = document.querySelector("#repairmaster .diagnosis-card h2");
  if (rmTitle) {
    const partnerName = state.activeUser ? state.activeUser.name : (activeRequest().repairPartner || "RepairMaster");
    rmTitle.textContent = `Repair bench — ${partnerName}`;
  }

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

  const feeInput = document.getElementById("minServiceFeeInput");
  if (feeInput) feeInput.value = state.minServiceFee || 150;
  const taxInput = document.getElementById("taxPercentInput");
  if (taxInput) taxInput.value = state.taxPercent || 0;
  const scInput = document.getElementById("serviceChargeInput");
  if (scInput) scInput.value = state.serviceChargePercent || 0;
  updateListingCommission();
}

function renderAdmin() {
  const totalCommission = state.requests.reduce((s, r) => s + commissionFor(r.quoteAmount), 0) + state.marketplace.filter((m) => m.sold).reduce((s, m) => s + commissionFor(displayPrice(m.basePrice)), 0);
  document.getElementById("platformCommission").textContent = formatCurrency(totalCommission);
  document.getElementById("escalations").textContent = state.requests.filter((r) => r.statusIndex < 6 && r.statusIndex > 0).length || "0";

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

  document.getElementById("applicationList").innerHTML = state.applications.map((app, i) => `
    <div class="vendor-row">
      <div><strong>${app.name}</strong><br><small>${app.role} | ${app.location}</small></div>
      <div style="display:flex;gap:6px;align-items:center">
        <span class="status-pill">${app.status}</span>
        ${app.status === "Pending" ? `<button class="appr-btn" data-appr="${i}">Approve</button>` : ""}
        ${app.status === "Approved" ? `<button class="rej-btn" data-rej="${i}">Revoke</button>` : ""}
      </div>
    </div>
  `).join("");

  document.querySelectorAll(".appr-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      state.applications[Number(btn.dataset.appr)].status = "Approved";
      saveState();
      renderAll();
      showToast("Application approved");
    });
  });
  document.querySelectorAll(".rej-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      state.applications[Number(btn.dataset.rej)].status = "Pending";
      saveState();
      renderAll();
      showToast("Application access revoked");
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
    const assigned = state.requests.filter((r) => (r.pickupTech || '').startsWith(name + ' \u2014') || (r.pickupTech || '').startsWith(name + ' -') || r.pickupTech === name);
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
            <img class="market-card-image" src="${currentImg}" alt="${item.model}" style="filter:grayscale(1)">
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
          <img class="market-card-image" src="${currentImg}" alt="${item.model}">
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
        const buyerName = state.activeUser ? state.activeUser.name : "Marketplace Buyer";
        const buyerId = state.activeUser ? state.activeUser.email : "";
        const orderId = `MO-${1001 + state.marketOrders.length}`;
        state.marketOrders.unshift({
          id: orderId,
          itemModel: item.model,
          grade: item.grade,
          basePrice: item.basePrice,
          customer: buyerName,
          customerEmail: buyerId,
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
      <img class="hot-deal-img" src="${imgs[0]}" alt="${item.model}">
      <h4>${item.model}</h4>
      <p>Grade ${item.grade} &middot; ${item.warranty}</p>
      <strong>${formatCurrency(displayPrice(item.basePrice))}</strong>
    </div>
  `}).join("");
}

function renderAll() {
  renderHotDeals();
  applyPortalAccess();
  updateTopbarUser();
  renderProgress();
  renderCustomer();
  renderCoordinator();
  renderRoleSummary();
  renderTechnician();
  renderRepairMaster();
  renderAdmin();
  renderMarketplace();
  switchView(state.activeView);
}

function isEmployeeRole(role) {
  return ["technician", "repairmaster", "coordinator", "admin"].includes(role);
}

function verifyEmployeeAccess(role) {
  const roleLabel = role === "repairmaster" ? "RepairMaster" : role.charAt(0).toUpperCase() + role.slice(1);
  return state.applications.some((a) => a.role === roleLabel && a.status === "Approved");
}

document.getElementById("operationSelect").addEventListener("change", (event) => switchView(event.target.value));

document.getElementById("unifiedLoginForm").addEventListener("submit", (event) => {
  event.preventDefault();
  const role = document.getElementById("loginRole").value;
  const email = document.getElementById("loginEmail").value.trim();
  const name = document.getElementById("loginName").value.trim();
  if (!email) {
    showToast("Please enter your email address");
    return;
  }
  if (!name) {
    showToast("Please enter your name");
    return;
  }
  state.activeUser = { name, email, role };
  if (isEmployeeRole(role) && !verifyEmployeeAccess(role)) {
    showToast("Access denied. No approved application found for this role. Apply first.");
    return;
  }
  loginPortal(role);
});

document.querySelectorAll("[data-employee-role]").forEach((form) => {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const portal = form.dataset.employeeRole;
    const roleLabel = portal === "repairmaster" ? "RepairMaster" : portal.charAt(0).toUpperCase() + portal.slice(1);
    const [nameInput, locationSelect] = form.querySelectorAll("input, select");
    const name = nameInput.value.trim();
    if (!name) {
      showToast("Please enter your full name");
      return;
    }
    let app = state.applications.find(a => a.name === name && a.role === roleLabel);
    if (!app) {
      state.applications.unshift({ name, role: roleLabel, location: locationSelect.value, status: "Approved" });
    } else {
      app.status = "Approved";
    }
    saveState();
    state.activeUser = { name, email: name.toLowerCase().replace(/\s+/g, ".") + "@test.com", role: portal };
    loginPortal(portal);
  });
});

document.getElementById("userAvatarBtn").addEventListener("click", openAccountOverlay);
document.getElementById("accountCloseBtn").addEventListener("click", closeAccountOverlay);
document.getElementById("accountOverlayScrim").addEventListener("click", closeAccountOverlay);
document.getElementById("accountLogoutBtn").addEventListener("click", () => { closeAccountOverlay(); logoutPortal(); });
document.getElementById("backBtn").addEventListener("click", () => switchView(allowedViews()[0] || "customer"));
document.getElementById("mbHomeBtn").addEventListener("click", () => switchView(allowedViews()[0] || "customer"));
document.getElementById("mbNotifBtn").addEventListener("click", () => {
  const r = activeRequest();
  const si = r.statusIndex;
  const techName = state.activeUser ? state.activeUser.name : "";
  const pendingDeliveries = state.marketOrders.filter(o =>
    o.assignedTech && o.assignedTech.includes(techName) && o.statusIndex < 4
  ).length;
  const msg = pendingDeliveries > 0
    ? `${r.id}: ${statuses[si]} · ${pendingDeliveries} delivery(ies) pending`
    : `${r.id}: ${statuses[si]} — next: ${statuses[Math.min(si + 1, statuses.length - 1)]}`;
  showToast(msg);
});
document.getElementById("mbAccountBtn").addEventListener("click", openAccountOverlay);

document.getElementById("advanceStatus").addEventListener("click", () => {
  const request = activeRequest();
  const current = request.statusIndex;
  if (current >= statuses.length - 1) {
    showToast("Repair lifecycle is already complete");
    return;
  }
  const next = current + 1;
  const nextStatus = statuses[next];
  if (next === 4 && !request.pickupTech) {
    showToast("Assign a pickup technician before scheduling pickup");
    return;
  }
  if (next === 5 && !request.otpVerified) {
    showToast("OTP must be verified before marking device picked up");
    return;
  }
  if (next === 7 && !request.repairPartner) {
    showToast("Assign a RepairMaster before starting repair");
    return;
  }
  if (next === 10 && !request.paymentMethod) {
    showToast("Customer must select a payment method first");
    return;
  }
  if (next === 11 && request.paymentStatus !== "Paid") {
    showToast("Payment must be completed before ready for delivery");
    return;
  }
  request.statusIndex = next;
  if (next === 9) request.invoiceSent = true;
  saveState();
  renderAll();
  showToast(`${request.id} → ${nextStatus}`);
});

document.getElementById("resetDemo").addEventListener("click", () => {
  if (!confirm("Reset all demo data? This will clear all requests, applications, and marketplace changes.")) return;
  state = structuredClone(defaultState);
  document.getElementById("loginScreen").classList.remove("hidden");
  document.getElementById("appShell").classList.add("hidden");
  saveState();
  showToast("Demo data reset");
});

document.getElementById("serviceForm").addEventListener("submit", (event) => {
  event.preventDefault();
  const name = document.getElementById("nameInput").value.trim();
  const brand = document.getElementById("brandInput").value;
  const model = document.getElementById("modelInput").value.trim();
  const issue = document.getElementById("issueInput").value;
  const address = document.getElementById("addressInput").value.trim();
  if (!name || !model || !address) {
    showToast("Please fill in your name, device model, and pickup address");
    return;
  }
  const id = `RM-${1024 + state.requests.length}`;
  const request = {
    id,
    customer: name,
    brand,
    model,
    issue,
    address,
    statusIndex: 0,
    pickupTech: firstApproved("Technician"),
    repairPartner: firstApproved("RepairMaster"),
    quoteAmount: 0,
    quoteApproved: false,
    paymentStatus: "Pending",
    paymentMethod: "",
    invoiceSent: false,
    otpVerified: false,
    checks: { accepted: false, otp: false, photos: false, handover: false, delivery: false },
    conditionImages: [],
    requirements: { backCover: "", glassType: "" },
    quoteItems: [],
    taxPercent: 0,
    taxAmount: 0
  };
  state.requests.unshift(request);
  state.activeRequestId = id;
  saveState();
  renderAll();
  showToast(`${id} created for ${name} and sent to coordinator`);
});

document.getElementById("approveQuote").addEventListener("click", () => {
  const request = activeRequest();
  request.quoteApproved = true;
  request.statusIndex = Math.max(request.statusIndex, 3);
  saveState();
  renderAll();
  showToast("Quotation approved");
});

document.getElementById("uploadConditionBtn").addEventListener("click", () => {
  const input = document.getElementById("conditionInput");
  const request = activeRequest();
  if (!input.files || !input.files.length) {
    showToast("Select device condition photos to upload");
    return;
  }
  let loaded = 0;
  const total = input.files.length;
  Array.from(input.files).forEach((file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      request.conditionImages.push(e.target.result);
      loaded++;
      if (loaded === total) {
        saveState();
        renderAll();
        showToast(`${total} condition photo(s) uploaded`);
        input.value = "";
      }
    };
    reader.readAsDataURL(file);
  });
});

document.getElementById("saveRequirements").addEventListener("click", () => {
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

document.getElementById("payOnlineBtn").addEventListener("click", () => {
  const request = activeRequest();
  request.paymentMethod = "Online";
  request.paymentStatus = "Paid";
  request.statusIndex = Math.max(request.statusIndex, 10);
  saveState();
  renderAll();
  showToast("Online payment received");
});

document.getElementById("payCodBtn").addEventListener("click", () => {
  const request = activeRequest();
  request.paymentMethod = "Cash on Delivery";
  request.paymentStatus = "Pending (COD)";
  request.statusIndex = Math.max(request.statusIndex, 10);
  saveState();
  renderAll();
  showToast("Cash on Delivery selected");
});

document.getElementById("assignDelivery").addEventListener("click", () => {
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

document.getElementById("saveAssignments").addEventListener("click", () => {
  const request = activeRequest();
  request.pickupTech = document.getElementById("pickupTech").value;
  request.repairPartner = document.getElementById("repairPartner").value;
  request.statusIndex = Math.max(request.statusIndex, 4);
  saveState();
  renderAll();
  showToast("Pickup scheduled and assignments saved");
});

document.getElementById("verifyOtp").addEventListener("click", () => {
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

document.getElementById("sendQuote").addEventListener("click", () => {
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

document.getElementById("listingPrice").addEventListener("input", updateListingCommission);

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

document.getElementById("addPartBtn").addEventListener("click", () => {
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

document.getElementById("marketUploadForm").addEventListener("submit", (event) => {
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
    owner: activeRequest().repairPartner || "RepairMaster Partner",
    sold: false,
    images: [],
    currentSlide: 0
  };
  if (fileInput.files && fileInput.files.length) {
    let loaded = 0;
    const total = fileInput.files.length;
    Array.from(fileInput.files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        item.images.push(e.target.result);
        loaded++;
        if (loaded === total) {
          state.marketplace.unshift(item);
          saveState();
          renderAll();
          showToast(`${item.model} listed at ${formatCurrency(finalPrice)}`);
        }
      };
      reader.readAsDataURL(file);
    });
  } else {
    item.images = [defaultDeviceIcon];
    state.marketplace.unshift(item);
    saveState();
    renderAll();
    showToast(`${item.model} listed at ${formatCurrency(finalPrice)}`);
  }
});

document.getElementById("backCoverForm").addEventListener("submit", (event) => {
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

if (state.activePortal) {
  document.getElementById("loginScreen").classList.add("hidden");
  document.getElementById("appShell").classList.remove("hidden");
}

renderAll();

// Clear any stale URL hash (no hash routing in this app)
if (window.location.hash) {
  history.replaceState(null, '', window.location.pathname + window.location.search);
}
