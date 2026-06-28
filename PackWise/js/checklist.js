

const packingData = {
    base: [
        "National ID / Passport",
        "Phone & Charger",
        "Power Bank",
        "Earphones / Headphones",
        "Wallet & Cash",
        "Travel Pillow",
        "Reusable Water Bottle",
        "Snacks for Journey",
        "Notebook & Pen",
        "Face Mask & Sanitizer"
    ],

    weather: {
        Hot: ["Sunscreen SPF 50+", "Sunglasses", "Cap / Hat", "Light Cotton T-Shirts", "Shorts", "Flip Flops"],
        Cold: ["Heavy Jacket / Coat", "Thermal Innerwear", "Woollen Socks", "Gloves", "Muffler / Scarf", "Warm Cap / Beanie"],
        Rainy: ["Raincoat / Poncho", "Waterproof Shoes", "Umbrella", "Quick-dry Clothes", "Waterproof Bag Cover", "Extra Dry Bags"],
        Snowy: ["Snow Boots", "Ski Jacket", "Thermal Layers", "Snow Gloves", "Hand Warmers", "Balaclava / Face Cover"],
        Mixed: ["Light Jacket", "Layered Clothing", "Foldable Umbrella", "Comfortable Sneakers", "Versatile Outfits"]
    },

    tripType: {
        Vacation: ["Camera & Memory Card", "Travel Guidebook", "Swimwear", "Casual Outfits", "Souvenir Budget"],
        Trekking: ["Trekking Shoes", "Trekking Poles", "First Aid Kit", "Energy Bars", "Torch / Headlamp", "Insect Repellent", "Windproof Jacket"],
        Camping: ["Tent", "Sleeping Bag", "Camping Stove", "Matches / Lighter", "Multi-tool Knife", "Torch / Headlamp", "Bug Spray", "Tarp"],
        Business: ["Formal Clothes", "Laptop & Charger", "Business Cards", "Blazer / Suit", "Formal Shoes", "Portfolio / Notepad"],
        "Road Trip": ["Car Charger", "Snack Bag", "Road Atlas / Maps", "Blanket", "Jumper Cables", "Spare Tyre Check"],
        Beach: ["Swimwear", "Beach Towel", "Sunscreen SPF 50+", "Sunglasses", "Waterproof Sandals", "Beach Bag", "After-sun Lotion"]
    },

    medicines: [
        "Paracetamol / Pain Reliever",
        "Motion Sickness Tablets",
        "Band-aids & Antiseptic",
        "Prescribed Medications",
        "ORS Packets",
        "Antacids"
    ]
};



function loadTripData() {
     const trip = JSON.parse(localStorage.getItem("trip")) || {};
    const destination = trip.destination || "—";
    const days        = trip.days        || "—";
    const weather     = trip.weather     || "—";
    const tripType    = trip.tripType    || "—";
    const budget      = trip.budget      || "—";

    document.getElementById("destination").textContent = destination;
    document.getElementById("days").textContent        = days;
    document.getElementById("weather").textContent     = weather;
    document.getElementById("tripType").textContent    = tripType;
    document.getElementById("budget").textContent      = budget;

    return { destination, days, weather, tripType, budget };
}



function buildPackingList(weather, tripType) {
    const items = new Set();

    packingData.base.forEach(i => items.add(i));

    if (packingData.weather[weather]) {
        packingData.weather[weather].forEach(i => items.add(i));
    }

    if (packingData.tripType[tripType]) {
        packingData.tripType[tripType].forEach(i => items.add(i));
    }

    packingData.medicines.forEach(i => items.add(i));

    return [...items];
}



function renderItems(items) {
    const ul = document.getElementById("packingItems");
    ul.innerHTML = "";

    items.forEach((item, index) => {
        const li = document.createElement("li");
        li.dataset.index = index;

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.id   = `item-${index}`;

        const label = document.createElement("label");
        label.htmlFor   = `item-${index}`;
        label.textContent = item;
        label.style.cursor = "pointer";
        label.style.flex   = "1";

        checkbox.addEventListener("change", () => {
            li.classList.toggle("checked", checkbox.checked);
            saveChecklist();
        });

        li.appendChild(checkbox);
        li.appendChild(label);

        
        li.addEventListener("click", (e) => {
            if (e.target !== checkbox) {
                checkbox.checked = !checkbox.checked;
                li.classList.toggle("checked", checkbox.checked);
                saveChecklist();
            }
        });

        ul.appendChild(li);
    });
}

// ── Add custom item ──

function setupCustomItem() {
    const input   = document.getElementById("customItem");
    const addBtn  = document.getElementById("addItem");

    function addItem() {
        const value = input.value.trim();
        if (!value) return;

        const ul    = document.getElementById("packingItems");
        const index = ul.children.length;

        const li = document.createElement("li");
        li.dataset.index = index;
        li.dataset.custom = "true";

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.id   = `item-${index}`;

        const label = document.createElement("label");
        label.htmlFor     = `item-${index}`;
        label.textContent = value;
        label.style.cursor = "pointer";
        label.style.flex   = "1";

        const removeBtn = document.createElement("span");
        removeBtn.textContent = "✕";
        removeBtn.title = "Remove";
        removeBtn.style.cssText = "margin-left:auto; color:#9ca3af; cursor:pointer; font-size:13px; padding-left:8px;";
        removeBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            li.remove();
            saveChecklist();
        });

        checkbox.addEventListener("change", () => {
            li.classList.toggle("checked", checkbox.checked);
            saveChecklist();
        });

        li.addEventListener("click", (e) => {
            if (e.target !== checkbox && e.target !== removeBtn) {
                checkbox.checked = !checkbox.checked;
                li.classList.toggle("checked", checkbox.checked);
                saveChecklist();
            }
        });

        li.appendChild(checkbox);
        li.appendChild(label);
        li.appendChild(removeBtn);
        ul.appendChild(li);

        input.value = "";
        input.focus();
        saveChecklist();
    }

    addBtn.addEventListener("click", addItem);
    input.addEventListener("keydown", (e) => {
        if (e.key === "Enter") addItem();
    });
}



function saveChecklist() {
    const ul    = document.getElementById("packingItems");
    const items = [];

    ul.querySelectorAll("li").forEach(li => {
        const checkbox = li.querySelector("input[type='checkbox']");
        const label    = li.querySelector("label");
        items.push({
            text:    label ? label.textContent : "",
            checked: checkbox ? checkbox.checked : false,
            custom:  li.dataset.custom === "true"
        });
    });

    localStorage.setItem("packwiseChecklist", JSON.stringify(items));
    showToast("Checklist saved! ✓");
}



function restoreChecklist() {
    const saved = localStorage.getItem("packwiseChecklist");
    if (!saved) return;

    try {
        const items = JSON.parse(saved);
        const ul    = document.getElementById("packingItems");
        const lis   = ul.querySelectorAll("li");

        lis.forEach((li, i) => {
            if (items[i]) {
                const checkbox = li.querySelector("input[type='checkbox']");
                if (checkbox && items[i].checked) {
                    checkbox.checked = true;
                    li.classList.add("checked");
                }
            }
        });
    } catch (e) {
        console.warn("Could not restore checklist:", e);
    }
}


function showToast(message) {
    let toast = document.getElementById("pw-toast");
    if (!toast) {
        toast = document.createElement("div");
        toast.id = "pw-toast";
        toast.style.cssText = `
            position: fixed;
            bottom: 30px;
            left: 50%;
            transform: translateX(-50%) translateY(20px);
            background: #2E8B57;
            color: white;
            padding: 14px 28px;
            border-radius: 40px;
            font-size: 15px;
            font-weight: 600;
            font-family: 'Poppins', sans-serif;
            box-shadow: 0 8px 24px rgba(46,139,87,0.35);
            opacity: 0;
            transition: all 0.3s ease;
            z-index: 9999;
        `;
        document.body.appendChild(toast);
    }

    toast.textContent = message;
    toast.style.opacity = "1";
    toast.style.transform = "translateX(-50%) translateY(0)";

    clearTimeout(toast._timeout);
    toast._timeout = setTimeout(() => {
        toast.style.opacity = "0";
        toast.style.transform = "translateX(-50%) translateY(20px)";
    }, 2500);
}



function setupActions() {
    document.getElementById("saveBtn").addEventListener("click", () => {
        saveChecklist();
    });
    document.getElementById("budgetBtn").addEventListener("click", () => {
        window.location.href = "budget.html";
    })

    document.getElementById("dashboardBtn").addEventListener("click", () => {
        window.location.href = "dashboard.html";
    });
}

// ── Init ──

document.addEventListener("DOMContentLoaded", () => {
    const { weather, tripType } = loadTripData();
    const items = buildPackingList(weather, tripType);
    renderItems(items);
    restoreChecklist();
    setupCustomItem();
    setupActions();
});