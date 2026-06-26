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
  document.getElementById("loginScreen").classList.add("hidden");
  document.getElementById("appShell").classList.remove("hidden");
  document.getElementById("resetDemo").classList.toggle("hidden", portal !== "admin");
  applyPortalAccess();
  updateUserBadge();
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
  await saveState();
  await signOutUser();
  document.getElementById("appShell").classList.add("hidden");
  document.getElementById("loginScreen").classList.remove("hidden");
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
  const request = activeRequest();
  document.getElementById("activeRequestLabel").textContent = request.id;
  document.getElementById("activeRequestMeta").textContent = `${request.model} - ${request.issue}`;
  document.getElementById("deviceTitle").textContent = request.model;
  document.getElementById("deviceIssue").textContent = `${request.issue}, pickup from ${request.address}`;
  const nameInput = document.getElementById("nameInput");
  if (nameInput && state.activeUser && state.activeUser.name && !nameInput.value) {
    nameInput.value = state.activeUser.name;
  }

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
    const hasActive = state.requests.some(r => r.customer === (state.activeUser ? state.activeUser.name : ""));
    panel.style.display = hasActive ? "block" : "none";
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

function renderCoordinator() {
  const requests = state.requests || [];
  const orders = state.marketOrders || [];
  const open = requests.filter((r) => r.statusIndex < statuses.length - 1).length;
  const closed = requests.filter((r) => r.statusIndex === statuses.length - 1).length;
  const revenue = requests.reduce((sum, r) => sum + r.quoteAmount, 0);
  const pendingDeliveries = orders.filter(o => o.statusIndex < 4).length;
  document.getElementById("openTickets").textContent = open;
  document.getElementById("revenueMetric").textContent = formatCurrency(revenue);
  document.getElementById("avgRepairTime").textContent = closed ? `${Math.round(closed * 2.5)}h` : "N/A";
  document.getElementById("customerRating").textContent = open + closed ? (4.5 + (closed / (open + closed || 1)) * 0.4).toFixed(1) : "4.8";
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
      document.getElementById("deliveryTech").value = order.assignedTech || "Ravi - Mumbai West";
      document.getElementById("deliveryAddress").value = order.address || "";
      document.getElementById("deliveryAddress").dataset.editOrder = row.dataset.order;
    });
  });
}

function syncAssignmentFields() {
  const request = activeRequest();
  document.getElementById("pickupTech").value = request.pickupTech;
  document.getElementById("repairPartner").value = request.repairPartner;
}

function renderTechnician() {
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

function renderRepairingMaster() {
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

  const feeInput = document.getElementById("minServiceFeeInput");
  if (feeInput) feeInput.value = state.minServiceFee || 150;
  const taxInput = document.getElementById("taxPercentInput");
  if (taxInput) taxInput.value = state.taxPercent || 0;
  const scInput = document.getElementById("serviceChargeInput");
  if (scInput) scInput.value = state.serviceChargePercent || 0;
  updateListingCommission();
}

function renderAdmin() {
  const requests = state.requests || [];
  const marketplace = state.marketplace || [];
  const applications = state.applications || [];

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
      if (app.user_id) await createNotification({ user_id: app.user_id, message: `Your ${app.role} application has been approved. You can now sign in.`, type: 'success' });
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
  renderHotDeals();
  applyPortalAccess();
  renderProgress();
  renderCustomer();
  renderCoordinator();
  renderTechnician();
  renderRepairingMaster();
  renderAdmin();
  renderMarketplace();
  renderLocalDeals();
  switchView(state.activeView);
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
  return ["technician", "repairmaster", "coordinator", "admin"].includes(role);
}

function verifyEmployeeAccess(role) {
  const roleLabel = role === "repairmaster" ? "RepairingMaster" : role.charAt(0).toUpperCase() + role.slice(1);
  return state.applications.some((a) => a.role === roleLabel && a.status === "Approved");
}

document.getElementById("operationSelect").addEventListener("change", (event) => switchView(event.target.value));

document.getElementById("unifiedLoginForm").addEventListener("submit", async (event) => {
  event.preventDefault();
  const role = document.getElementById("loginRole").value;
  const email = document.getElementById("loginEmail").value.trim();
  const name = document.getElementById("loginName").value.trim();
  const city = document.getElementById("loginCity").value.trim();
  const password = document.getElementById("loginPassword").value.trim();
  const isEmployeeTab = document.querySelector(".login-tab.active").dataset.tab === "employee";
  if (!email) {
    showToast("Please enter your email address");
    return;
  }
  if (!email.includes("@") || !email.includes(".")) {
    showToast("Enter a valid email address (e.g. yourname@gmail.com)");
    return;
  }
  if (!isEmployeeTab && !name) {
    showToast("Please enter your name");
    return;
  }
  if (isEmployeeTab && !isEmployeeRole(role)) {
    showToast("Select an employee role (Technician, RepairingMaster, Coordinator, or Admin)");
    return;
  }
  if (isEmployeeRole(role) && !password) {
    showToast("Please create a password for your account");
    return;
  }
  try {
    if (isEmployeeRole(role)) {
      // Employee — sign in (must already have an account)
      const { user } = await signInWithEmail(email, password);
      const profile = await fetchProfile(user.id);
      if (!profile) {
        await supabase.from('profiles').upsert({ id: user.id, email, name, role, city: city || '' });
      }
      state.activeUser = profile || { name, email, role, city: city || '' };
      // Verify approved application
      if (!await checkEmployeeAccess(user.id, role)) {
        showToast("Access denied. No approved application found. Apply first.");
        await signOutUser();
        return;
      }
    } else {
      // Customer — sign up (creates account)
      const { user } = await signUpWithEmail(email, password, { name, email, role: 'customer', city: city || '' });
      state.activeUser = { name, email, role: 'customer', city: city || '' };
    }
    loginPortal(isEmployeeRole(role) ? role : 'customer');
  } catch (err) {
    if (err.message && err.message.includes('already registered')) {
      // User exists — try signing in
      try {
        const { user } = await signInWithEmail(email, password);
        const profile = await fetchProfile(user.id);
        state.activeUser = profile || { name, email, role, city: city || '' };
        if (isEmployeeRole(role) && !await checkEmployeeAccess(user.id, role)) {
          showToast("Access denied. No approved application found.");
          await signOutUser();
          return;
        }
        loginPortal(isEmployeeRole(role) ? role : (profile?.role || 'customer'));
      } catch (e2) {
        showToast(e2.message || "Login failed. Check your password.");
      }
    } else {
      showToast(err.message || "Authentication failed");
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
document.getElementById("applicationForm").addEventListener("submit", async (event) => {
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
async function renderNotifications() {
  const userId = (await getCurrentSession())?.user?.id;
  if (!userId) return;
  const notifs = await fetchNotifications(userId);
  const unread = notifs.filter(n => !n.read).length;
  document.getElementById("notifBadge").textContent = unread || "";
  document.getElementById("notifBadge").style.display = unread ? "flex" : "none";
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

document.getElementById("notifBell").addEventListener("click", (e) => {
  e.stopPropagation();
  document.getElementById("notifPanel").classList.toggle("open");
  renderNotifications();
});

document.getElementById("markAllReadBtn").addEventListener("click", async () => {
  const userId = (await getCurrentSession())?.user?.id;
  if (!userId) return;
  await markAllNotificationsRead(userId);
  renderNotifications();
});

document.addEventListener("click", (e) => {
  const panel = document.getElementById("notifPanel");
  if (panel.classList.contains("open") && !panel.contains(e.target) && e.target.id !== "notifBell") {
    panel.classList.remove("open");
  }
});

// Init dynamic fields on page load
renderDynamicFields("technician");

document.getElementById("logoutButton").addEventListener("click", logoutPortal);
document.getElementById("sidebarLogoutBtn").addEventListener("click", logoutPortal);

document.getElementById("advanceStatus").addEventListener("click", async () => {
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
  request.statusIndex = Math.min(request.statusIndex + 1, statuses.length - 1);
  if (request.statusIndex === 9) request.invoiceSent = true;
  if (request.statusIndex === 13 && request.paymentMethod === "Online") {
    request.paymentStatus = "Paid";
    createNotification({ user_id: session?.user?.id || null, message: `Payment received for ${request.id}`, type: 'success' });
  }
  saveState();
  renderAll();
  // Notify customer about status change
  const session = await getCurrentSession();
  if (session?.user?.id) {
    await createNotification({ user_id: session.user.id, message: `Your request ${request.id} is now: ${statuses[request.statusIndex]}`, type: 'info' });
  }
  renderNotifications();
  showToast(`${request.id} moved to ${statuses[request.statusIndex]}`);
});

document.getElementById("resetDemo").addEventListener("click", async () => {
  if (!confirm("Reset all demo data? This will clear all requests, applications, and marketplace changes.")) return;
  state = structuredClone(defaultState);
  document.getElementById("loginScreen").classList.remove("hidden");
  document.getElementById("appShell").classList.add("hidden");
  await saveState();
  await resetAllData();
  showToast("Demo data reset");
});

document.getElementById("serviceForm").addEventListener("submit", async (event) => {
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
    requirements: { backCover: "", glassType: "" },
    quoteItems: [],
    taxPercent: 0,
    taxAmount: 0
  };
  state.requests.unshift(request);
  state.activeRequestId = id;
  saveState();
  renderAll();
  // Notify all employees about the new request
  const { data: employees } = await supabase.from('profiles').select('id').in('role', ['admin', 'coordinator', 'technician', 'repairmaster']);
  for (const emp of (employees || [])) {
    await createNotification({ user_id: emp.id, message: `New repair request ${id} from ${name} — ${model}: ${issue}`, type: 'info', link: 'coordinator' });
  }
  renderNotifications();
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

document.getElementById("uploadConditionBtn").addEventListener("click", async () => {
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

document.getElementById("marketUploadForm").addEventListener("submit", async (event) => {
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

document.querySelectorAll(".login-tab").forEach((tab) => {
  tab.addEventListener("click", () => {
    document.querySelectorAll(".login-tab").forEach(t => t.classList.remove("active"));
    tab.classList.add("active");
    const isEmployee = tab.dataset.tab === "employee";
    document.getElementById("roleField").style.display = isEmployee ? "" : "none";
    document.getElementById("applyLinks").style.display = isEmployee ? "" : "none";
    document.getElementById("loginCity").closest("label").style.display = isEmployee ? "none" : "";
    document.getElementById("unifiedLoginForm").querySelector("button").textContent = isEmployee ? "Sign In" : "Sign Up & Continue";
    document.getElementById("loginHelper").textContent = isEmployee
      ? "Already have an approved application? Sign in to your portal."
      : "Sign up to book a repair or browse deals from nearby RepairingMasters";
    // Restrict role dropdown: employee tab shows only employee roles
    const roleSelect = document.getElementById("loginRole");
    Array.from(roleSelect.options).forEach(opt => {
      opt.hidden = isEmployee ? !["technician","repairmaster","coordinator","admin"].includes(opt.value) : false;
    });
    if (!isEmployee) {
      roleSelect.value = "customer";
    } else {
      roleSelect.value = "technician";
    }
  });
});

// Testing login buttons — auto-create accounts on first use
const TEST_CREDENTIALS = {
  admin:        { email: 'admin@test.repairmaster',  password: 'test123', role: 'admin',        name: 'Admin User' },
  coordinator:  { email: 'coord@test.repairmaster',  password: 'test123', role: 'coordinator',  name: 'Coord User' },
  technician:   { email: 'tech@test.repairmaster',   password: 'test123', role: 'technician',   name: 'Tech User' },
  repairmaster: { email: 'rm@test.repairmaster',     password: 'test123', role: 'repairmaster',  name: 'RM User' }
};

// Testing login — simple global function called from HTML onclick
const TEST_CREDS = {
  admin:        { email: 'admin@test.repairmaster',  password: 'test123', role: 'admin' },
  coordinator:  { email: 'coord@test.repairmaster',  password: 'test123', role: 'coordinator' },
  technician:   { email: 'tech@test.repairmaster',   password: 'test123', role: 'technician' },
  repairmaster: { email: 'rm@test.repairmaster',     password: 'test123', role: 'repairmaster' }
};

async function handleTestLogin(roleKey) {
  const c = TEST_CREDS[roleKey];
  if (!c) return;
  try {
    const result = await signInWithEmail(c.email, c.password);
    state.activeUser = { name: c.email.split('@')[0], email: c.email, role: c.role };
    const profile = await fetchProfile(result.user.id);
    if (profile) state.activeUser = profile;
    loginPortal(c.role);
  } catch {
    // First time — create account then sign in
    try {
      const result = await signUpWithEmail(c.email, c.password, { name: c.email.split('@')[0], email: c.email, role: c.role });
      const uid = result.user.id;
      await createApplication({ user_id: uid, name: c.email.split('@')[0], email: c.email, phone: '9999999999',
        role: roleKey === 'repairmaster' ? 'RepairingMaster' : roleKey.charAt(0).toUpperCase() + roleKey.slice(1),
        location: 'Test City', details: {}, status: 'Approved' });
      state.activeUser = { name: c.email.split('@')[0], email: c.email, role: c.role };
      loginPortal(c.role);
    } catch (e) {
      showToast('Test login failed: ' + (e.message || e), 'error');
    }
  }
}

document.getElementById("roleField").style.display = "none";
document.getElementById("applyLinks").style.display = "none";
// On load, only show customer/marketplace in the hidden role field
Array.from(document.getElementById("loginRole").options).forEach(opt => {
  opt.hidden = !["customer","marketplace"].includes(opt.value);
});

// ─── App Initialization ──────────────────────────────
(async function initApp() {
  // Load data from Supabase (falls back to defaults)
  Object.assign(state, await loadState());

  // Check for existing auth session
  const session = await getCurrentSession();
  if (session) {
    const profile = await fetchProfile(session.user.id);
    if (profile && profile.role) {
      state.activeUser = profile;
      state.activePortal = profile.role;
      state.activeView = portalLanding[profile.role] || 'customer';
      document.getElementById("loginScreen").classList.add("hidden");
      document.getElementById("appShell").classList.remove("hidden");
      applyPortalAccess();
      updateUserBadge();
      renderAll();
      showToast(`Welcome back, ${profile.name || profile.email}`);
      return;
    }
  }

  // No session — show login
  document.getElementById("loginScreen").classList.remove("hidden");
  document.getElementById("appShell").classList.add("hidden");
  renderAll();
})();
