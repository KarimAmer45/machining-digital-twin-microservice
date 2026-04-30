const form = document.querySelector("#prediction-form");
const responseJson = document.querySelector("#response-json");
const wearValue = document.querySelector("#wear-value");
const riskValue = document.querySelector("#risk-value");
const confidenceValue = document.querySelector("#confidence-value");
const wearArc = document.querySelector("#wear-arc");

function parseVibrationFeatures(rawValue) {
  return rawValue
    .split(/[\s,]+/)
    .map((value) => value.trim())
    .filter(Boolean)
    .map(Number);
}

function updateDashboard(result) {
  wearValue.textContent = result.predicted_tool_wear.toFixed(3);
  confidenceValue.textContent = result.confidence.toFixed(2);
  riskValue.textContent = result.surface_quality_risk;
  riskValue.className = `risk ${result.surface_quality_risk}`;
  wearArc.style.strokeDashoffset = 188.5 * (1 - result.predicted_tool_wear);
  responseJson.textContent = JSON.stringify(result, null, 2);
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const formData = new FormData(form);
  const payload = {
    spindle_speed: Number(formData.get("spindle_speed")),
    feed_rate: Number(formData.get("feed_rate")),
    depth_of_cut: Number(formData.get("depth_of_cut")),
    vibration_features: parseVibrationFeatures(formData.get("vibration_features")),
  };

  const response = await fetch("/predict", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    responseJson.textContent = await response.text();
    return;
  }

  updateDashboard(await response.json());
});

form.requestSubmit();
