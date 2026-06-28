const categoryIcons = {
    Transport:  "🚗",
    Food:       "🍔",
    Stay:       "🏨",
    Shopping:   "🛍️",
    Activities: "🎢",
    Medical:    "💊",
    Other:      "📦"
};

// ── Load budget from planner's localStorage ──

function loadBudget() {
    const trip = JSON.parse(localStorage.getItem("trip")) || {};
    const budget = parseFloat(trip.budget) || 0;
    document.getElementById("totalBudget").textContent = "₹" + budget.toLocaleString("en-IN");
    return budget;
}

// ── Load saved expenses ──

function getExpenses() {
    try {
        return JSON.parse(localStorage.getItem("packwiseBudget")) || [];
    } catch {
        return [];
    }
}

function saveExpenses(expenses) {
    localStorage.setItem("packwiseBudget", JSON.stringify(expenses));
}

// ── Update overview totals ──

function updateOverview() {
    const budget    = loadBudget();
    const expenses  = getExpenses();
    const spent     = expenses.reduce((sum, e) => sum + e.amount, 0);
    const remaining = budget - spent;

    document.getElementById("totalSpent").textContent     = "₹" + spent.toLocaleString("en-IN");
    document.getElementById("totalRemaining").textContent = "₹" + Math.abs(remaining).toLocaleString("en-IN");

    const remainingCard = document.getElementById("totalRemaining").parentElement;
    if (remaining < 0) {
        remainingCard.classList.add("over-budget");
        document.getElementById("totalRemaining").textContent = "-₹" + Math.abs(remaining).toLocaleString("en-IN");
    } else {
        remainingCard.classList.remove("over-budget");
    }
}

// ── Render expense list ──

function renderExpenses(filter = "All") {
    const expenses = getExpenses();
    const ul = document.getElementById("expenseList");
    ul.innerHTML = "";

    const filtered = filter === "All" ? expenses : expenses.filter(e => e.category === filter);

    if (filtered.length === 0) {
        const li = document.createElement("li");
        li.className = "empty-state";
        li.textContent = filter === "All"
            ? "No expenses added yet. Start adding above!"
            : `No expenses in "${filter}" yet.`;
        ul.appendChild(li);
        return;
    }

    filtered.forEach((expense) => {
        const li = document.createElement("li");

        const icon = document.createElement("span");
        icon.className = "expense-icon";
        icon.textContent = categoryIcons[expense.category] || "📦";

        const info = document.createElement("div");
        info.className = "expense-info";

        const desc = document.createElement("span");
        desc.className = "expense-desc";
        desc.textContent = expense.desc || "—";

        const cat = document.createElement("span");
        cat.className = "expense-cat";
        cat.textContent = expense.category;

        info.appendChild(desc);
        info.appendChild(cat);

        const amount = document.createElement("span");
        amount.className = "expense-amount";
        amount.textContent = "₹" + expense.amount.toLocaleString("en-IN");

        const deleteBtn = document.createElement("button");
        deleteBtn.className = "expense-delete";
        deleteBtn.textContent = "✕";
        deleteBtn.title = "Remove";
        deleteBtn.addEventListener("click", () => {
            const all = getExpenses();
            const idx = all.findIndex(e => e.id === expense.id);
            if (idx !== -1) {
                all.splice(idx, 1);
                saveExpenses(all);
                renderExpenses(document.getElementById("filterCategory").value);
                updateOverview();
                showToast("Expense removed.");
            }
        });

        li.appendChild(icon);
        li.appendChild(info);
        li.appendChild(amount);
        li.appendChild(deleteBtn);
        ul.appendChild(li);
    });
}

// ── Add expense ──

function setupAddExpense() {
    const btn = document.getElementById("addExpenseBtn");

    btn.addEventListener("click", () => {
        const category = document.getElementById("expenseCategory").value;
        const desc     = document.getElementById("expenseDesc").value.trim();
        const amount   = parseFloat(document.getElementById("expenseAmount").value);

        if (!category) {
            showToast("Please select a category.");
            return;
        }
        if (!desc) {
            showToast("Please enter a description.");
            return;
        }
        if (!amount || amount <= 0) {
            showToast("Please enter a valid amount.");
            return;
        }

        const expense = {
            id: Date.now(),
            category,
            desc,
            amount
        };

        const expenses = getExpenses();
        expenses.push(expense);
        saveExpenses(expenses);

        // reset fields
        document.getElementById("expenseCategory").value = "";
        document.getElementById("expenseDesc").value = "";
        document.getElementById("expenseAmount").value = "";

        renderExpenses(document.getElementById("filterCategory").value);
        updateOverview();
        showToast("Expense added! ✓");
    });
}

// ── Filter ──

function setupFilter() {
    document.getElementById("filterCategory").addEventListener("change", function () {
        renderExpenses(this.value);
    });
}

// ── Action buttons ──

function setupActions() {
    document.getElementById("clearBtn").addEventListener("click", () => {
        if (!confirm("Clear all expenses? This cannot be undone.")) return;
        saveExpenses([]);
        renderExpenses();
        updateOverview();
        showToast("All expenses cleared.");
    });

    document.getElementById("backBtn").addEventListener("click", () => {
        window.location.href = "checklist.html";
    });
}

// ── Toast ──

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

// ── Init ──

document.addEventListener("DOMContentLoaded", () => {
    loadBudget();
    updateOverview();
    renderExpenses();
    setupAddExpense();
    setupFilter();
    setupActions();
});
