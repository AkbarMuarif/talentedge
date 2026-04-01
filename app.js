document.getElementById("bookingForm").addEventListener("submit", function(e){
    e.preventDefault();

    let booking = {
        name: document.getElementById("name").value,
        trainer: document.getElementById("trainer").value,
        package: document.getElementById("package").value,
        date: document.getElementById("date").value,
        time: document.getElementById("time").value
    };

    let bookings = JSON.parse(localStorage.getItem("bookings")) || [];
    bookings.push(booking);

    localStorage.setItem("bookings", JSON.stringify(bookings));

    alert("Booking saved!");
});