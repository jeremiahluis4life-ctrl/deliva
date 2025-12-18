let today = new Date();
let currentDay = new Date();
let currentWeek = new Date();
let currentMonth = new Date();

function showAnalysis(type) {
    $(".analysis").hide().removeClass("slide-in");
    $(`#${type}-analysis`).fadeIn().addClass("slide-in");

    if (type === "daily") updateDaily();
    else if (type === "weekly") updateWeekly();
    else if (type === "monthly") updateMonthly();
}

function getRandomRevenue(orders) {
    let revenue = orders * (Math.random() * (5000 - 1500) + 1500); // Revenue per order between ₦1500-₦5000
    return Math.max(revenue, 5000).toFixed(2); // Ensure at least ₦5000 per day
}

function updateDaily() {
    let orders = getRandomOrders();
    let revenue = getRandomRevenue(orders);

    $("#daily-date").text(currentDay.toDateString());
    $("#daily-orders").text(orders);
    $("#daily-revenue").text(`₦${parseFloat(revenue).toLocaleString()}`);
    $("#next-day").prop("disabled", currentDay >= today);
}

function changeDay(direction) {
    currentDay.setDate(currentDay.getDate() + direction);
    updateDaily();
}

function updateWeekly() {
    let start = new Date(currentWeek);
    start.setDate(start.getDate() - start.getDay() + 1);
    let end = new Date(start);
    end.setDate(end.getDate() + 6);

    $("#week-range").text(`${start.toDateString()} - ${end.toDateString()}`);

    let totalRevenue = 0, weekData = "";
    for (let i = 0; i < 7; i++) {
        let day = new Date(start);
        day.setDate(day.getDate() + i);
        let orders = getRandomOrders();
        let revenue = getRandomRevenue(orders);
        totalRevenue += parseFloat(revenue);
        weekData += `<p>${day.toDateString()}: Orders ${orders}, Revenue: ₦${parseFloat(revenue).toLocaleString()}</p>`;
    }

    totalRevenue = Math.max(totalRevenue, 50000); // Weekly revenue must be at least ₦50,000
    $("#weekly-data").html(weekData);
    $("#weekly-revenue").text(`₦${totalRevenue.toLocaleString()}`);
    $("#next-week").prop("disabled", start >= today);
}

function changeWeek(direction) {
    currentWeek.setDate(currentWeek.getDate() + direction * 7);
    updateWeekly();
}

function updateMonthly() {
    let year = currentMonth.getFullYear();
    let month = currentMonth.getMonth();
    let daysInMonth = new Date(year, month + 1, 0).getDate();

    $("#monthly-title").text(`${currentMonth.toLocaleString('default', { month: 'long' })} ${year}`);

    let totalRevenue = 0, monthData = "";
    for (let i = 1; i <= daysInMonth; i++) {
        let orders = getRandomOrders();
        let revenue = getRandomRevenue(orders);
        totalRevenue += parseFloat(revenue);
        monthData += `<p>Day ${i}: Orders ${orders}, Revenue: ₦${parseFloat(revenue).toLocaleString()}</p>`;
    }

    totalRevenue = Math.max(totalRevenue, 200000); // Monthly revenue must be at least ₦200,000
    $("#monthly-data").html(monthData);
    $("#monthly-revenue").text(`₦${totalRevenue.toLocaleString()}`);
    $("#next-month").prop("disabled", month === today.getMonth() && year === today.getFullYear());
}

function changeMonth(direction) {
    currentMonth.setMonth(currentMonth.getMonth() + direction);
    updateMonthly();
}

// Helper function for random orders (realistic range)
function getRandomOrders() {
    return Math.floor(Math.random() * 97) + 3; // 3-100 orders per day
}

showAnalysis('daily');


