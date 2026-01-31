import { customers } from "./data.js";
import { kmeans } from "https://cdn.jsdelivr.net/npm/ml-kmeans@6.0.0/+esm";

/* =======================
   1) تجهيز البيانات
======================= */
const data = customers.map(c => [c.income, c.score]);

/* =======================
   2) تطبيق K-Means
======================= */
const k = 4;
const seed = 42; // تثبيت العشوائية

const model = kmeans(data, k, { seed });

/* =======================
   3) Scatter Plot
======================= */
const colors = ["#e74c3c", "#3498db", "#2ecc71", "#f39c12"];

const scatterDatasets = model.clusters.map((cluster, i) => ({
  label: `Cluster ${cluster}`,
  data: [{ x: data[i][0], y: data[i][1] }],
  backgroundColor: colors[cluster]
}));

new Chart(document.getElementById("chartScatter"), {
  type: "scatter",
  data: { datasets: scatterDatasets },
  options: {
    plugins: {
      legend: { display: false }
    },
    scales: {
      x: {
        title: { display: true, text: "Annual Income" }
      },
      y: {
        title: { display: true, text: "Spending Score" }
      }
    }
  }
});

/* =======================
   4) Elbow Method
======================= */
function distance(a, b) {
  let sum = 0;
  for (let i = 0; i < a.length; i++) {
    sum += (a[i] - b[i]) ** 2;
  }
  return Math.sqrt(sum);
}

function computeInertia(data, clusters, centroids) {
  let inertia = 0;
  for (let i = 0; i < data.length; i++) {
    const centroid =
      centroids[clusters[i]].centroid ?? centroids[clusters[i]];
    inertia += distance(data[i], centroid) ** 2;
  }
  return inertia;
}

const ks = [1, 2, 3, 4, 5, 6];
const inertias = [];

for (let i = 0; i < ks.length; i++) {
  const m = kmeans(data, ks[i], { seed });
  inertias.push(
    computeInertia(data, m.clusters, m.centroids)
  );
}

new Chart(document.getElementById("chartElbow"), {
  type: "line",
  data: {
    labels: ks,
    datasets: [{
      label: "Inertia",
      data: inertias,
      tension: 0.35
    }]
  },
  options: {
    scales: {
      x: {
        title: { display: true, text: "Number of Clusters (k)" }
      },
      y: {
        title: { display: true, text: "Inertia" }
      }
    }
  }
});

/* =======================
   5) عرض النتائج النهائية
======================= */
const resultsDiv = document.getElementById("results");

resultsDiv.innerHTML = `
  <p>📌 <b>العدد الأمثل للمجموعات (k)</b>: <b>${k}</b></p>
  <p>📌 <b>قيمة Inertia عند k = ${k}</b>: 
     <b>${inertias[k - 1].toFixed(2)}</b></p>
  <p>📌 <b>تفسير المجموعات</b>:</p>
  <ul>
    <li><b>Cluster 0:</b> دخل مرتفع + إنفاق مرتفع</li>
    <li><b>Cluster 1:</b> دخل متوسط + إنفاق ضعيف</li>
    <li><b>Cluster 2:</b> دخل متوسط + إنفاق متوسط</li>
    <li><b>Cluster 3:</b> دخل منخفض + إنفاق منخفض</li>
  </ul>
`;

/* =======================
   6) جدول بيانات العملاء
======================= */
const tableBody = document.querySelector("#customersTable tbody");

customers.forEach((customer, index) => {
  const cluster = model.clusters[index];

  const row = document.createElement("tr");
  row.innerHTML = `
    <td>${index + 1}</td>
    <td>${customer.income}</td>
    <td>${customer.score}</td>
    <td class="cluster c${cluster}">Cluster ${cluster}</td>
  `;

  tableBody.appendChild(row);
});
