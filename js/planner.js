

const form = document.querySelector(".planner-form");

form.addEventListener("submit", function (e) {

    e.preventDefault();

    const destination = document.getElementById("destination").value.trim();
    const days = document.getElementById("days").value;
    const weather = document.getElementById("weather").value;
    const tripType = document.getElementById("tripType").value;
    const budget = document.getElementById("budget").value;
    const travellers = document.getElementById("travellers").value;
    const notes = document.querySelector("textarea").value.trim();

    if (
        destination === "" ||
        days === "" ||
        weather === "Select Weather" ||
        tripType === "Select Trip" ||
        budget === "" ||
        travellers === ""
    ) {
        alert("Please fill in all the required fields.");
        return;
    }

   
    const trip = {
        destination,
        days,
        weather,
        tripType,
        budget,
        travellers,
        notes
    };

    
    localStorage.setItem("trip", JSON.stringify(trip));

   
    alert("Trip planned successfully! 🎉");

   
    window.location.href = "checklist.html";

});