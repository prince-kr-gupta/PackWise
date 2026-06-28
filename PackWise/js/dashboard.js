// ── Trip Summary ──

function loadTripSummary() {
    const trip = JSON.parse(localStorage.getItem("trip")) || null;

    if (!trip || !trip.destination) {
        document.getElementById("tripCard").style.display = "none";
        document.getElementById("noTripMsg").style.display = "block";
        return 0;
    }

    document.getElementById("d-destination").textContent = trip.destination || "—";
    document.getElementById("d-days").textContent        = trip.days ? trip.days + " days" : "—";
    document.getElementById("d-weather").textContent     = trip.weather || "—";
    document.getElementById("d-tripType").textContent    = trip.tripType || "—";
    document.getElementById("d-travellers").textContent  = trip.travellers ? trip.travellers + " person(s)" : "—";
    document.getElementById("d-budget").textContent      = trip.budget ? "₹" + parseFloat(trip.budget).toLocaleString("en-IN") : "—";

    return parseFloat(trip.budget) || 0;
}

// ── Checklist Progress ──

function loadChecklistProgress() {
    const saved = localStorage.getItem("packwiseChecklist");
    if (!saved) return;

    try {
        const items   = JSON.parse(saved);
        const total   = items.length;
        const checked = items.filter(i => i.checked).length;
        const percent = total > 0 ? Math.round((checked / total) * 100) : 0;

        document.getElementById("checkedCount").textContent  = checked;
        document.getElementById("totalCount").textContent    = total;
        document.getElementById("progressPercent").textContent = percent + "%";
        document.getElementById("progressFill").style.width   = percent + "%";

        const note = document.getElementById("progressNote");
        if (total === 0) {
            note.textContent = "No checklist found. Go to the checklist page first.";
        } else if (percent === 100) {
            note.textContent = "🎉 All packed! You're ready to go!";
        } else if (percent >= 50) {
            note.textContent = "Good progress! Keep packing.";
        } else {
            note.textContent = "Just getting started — head to the checklist!";
        }

    } catch (e) {
        console.warn("Could not load checklist:", e);
    }
}

// ── Budget Overview ──

function loadBudgetOverview(totalBudget) {
    const expenses = JSON.parse(localStorage.getItem("packwiseBudget")) || [];
    const spent    = expenses.reduce((sum, e) => sum + e.amount, 0);
    const remaining = totalBudget - spent;
    const percent   = totalBudget > 0 ? Math.min(Math.round((spent / totalBudget) * 100), 100) : 0;

    document.getElementById("d-totalBudget").textContent = "₹" + totalBudget.toLocaleString("en-IN");
    document.getElementById("d-spent").textContent       = "₹" + spent.toLocaleString("en-IN");

    const remainingEl = document.getElementById("d-remaining");
    if (remaining < 0) {
        remainingEl.textContent = "-₹" + Math.abs(remaining).toLocaleString("en-IN");
        remainingEl.classList.remove("blue");
        remainingEl.classList.add("red");
    } else {
        remainingEl.textContent = "₹" + remaining.toLocaleString("en-IN");
    }

    const fill = document.getElementById("budgetFill");
    fill.style.width = percent + "%";
    if (remaining < 0) fill.classList.add("over");

    const note = document.getElementById("budgetNote");
    if (expenses.length === 0) {
        note.textContent = "No expenses tracked yet. Visit the Budget page to add some.";
    } else if (remaining < 0) {
        note.textContent = "⚠️ You've exceeded your budget!";
    } else {
        note.textContent = `${percent}% of your budget used — ₹${remaining.toLocaleString("en-IN")} remaining.`;
    }
}

// Export as PDF 

function setupExport() {
    document.getElementById("exportPdfBtn").addEventListener("click", () => {
        window.print();
    });
}


document.addEventListener("DOMContentLoaded", () => {
    const totalBudget = loadTripSummary();
    loadChecklistProgress();
    loadBudgetOverview(totalBudget);
    setupExport();
});
