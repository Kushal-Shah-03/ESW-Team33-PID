let currentRPM = 0;
let desired_RPM = 100;

const inputStyle =
    "w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500";
const buttonStyle =
    "block bg-blue-500 text-white py-2 px-4 mt-4 rounded hover:bg-blue-700 focus:outline-none focus:shadow-outline-blue active:bg-blue-800";

function updateRPM() {
    let variation;

    variation = ((Math.random() - 0.5) * 20) % desired_RPM;
    const rpmWithVariation = parseInt(desired_RPM) + parseInt(variation);
    console.log("RPM with variation:", rpmWithVariation);
    document.getElementById("rpmDisplay").innerText =
        parseFloat(rpmWithVariation).toFixed(2) + " RPM";
}

function updateParameters() {
    const desiredRPM = document.getElementById("desiredRPM").value;
    desired_RPM = desiredRPM;
    const kp = document.getElementById("kp").value;
    const ki = document.getElementById("ki").value;
    const kd = document.getElementById("kd").value;

    console.log("Desired RPM:", desiredRPM);
    console.log("Kp:", kp);
    console.log("Ki:", ki);
    console.log("Kd:", kd);

    const data = {
        rpm: desiredRPM,
        kp: kp,
        ki: ki,
        kd: kd
    };

    fetch("/api/updateRPM", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    });

    document.getElementById("desiredRPM").value = "";
    document.getElementById("kp").value = "";
    document.getElementById("ki").value = "";
    document.getElementById
}

setInterval(updateRPM, 2000);