// استيراد خوارزمية K-Means من مكتبة ml-kmeans
import { kmeans } from "ml-kmeans";

// استيراد بيانات العملاء من data.js
import { customers } from "./data.js";

// استيراد دالة التوحيد (Norjjjmalization) من normalize.js
import { normalize } from "./normalize.js";


// ================= البيانات =================
// تحويل بيانات العملاء إلى مصفوفة رقمية
// كل عميل يصبح صف يحتوي على [age, income, score]
const X = customers.map(c => [c.age, c.income, c.score]);

// تطبيق التوحيد (Normalization) على البيانات
const Xnorm = normalize(X);


// ================= دالة المسافة =================
// دالة لحساب المسافة الإقليدية (Euclidean distance)
function distance(a, b) {
  let sum = 0;
  for (let i = 0; i < a.length; i++) {
    sum += (a[i] - b[i]) ** 2;
  }
  return Math.sqrt(sum);
}


// ================= Inertia =================
// دالة لحساب قيمة Inertia (مجموع المسافات التربيعية داخل كل مجموعة)
function computeInertia(data, clusters, centroids) {
  let inertia = 0;

  for (let i = 0; i < data.length; i++) {
    // الحصول على رقم المجموعة للعميل i
    const clusterIndex = clusters[i];

    // دعم كل أشكال centroids (قد تكون في شكل {centroid: [...]})
    const centroid =
      centroids[clusterIndex].centroid ??
      centroids[clusterIndex];

    // جمع مسافة كل نقطة إلى مركز مجموعتها
    inertia += distance(data[i], centroid) ** 2;
  }

  return inertia;
}


// ================= Elbow Method =================
console.log("Elbow Method:");

// نجرب k من 1 إلى 6
for (let k = 1; k <= 6; k++) {
  // تطبيق K-Means على البيانات الموحدة
  const model = kmeans(Xnorm, k);

  // حساب Inertia
  const inertia = computeInertia(
    Xnorm,
    model.clusters,
    model.centroids
  );

  // طباعة النتائج
  console.log(`k = ${k} → Inertia = ${inertia.toFixed(2)}`);
}


// ================= K-Means النهائي =================
const k = 4;  // هنا اخترنا k=4 لأنه الأفضل من Elbow Method
const finalModel = kmeans(Xnorm, k);

console.log("\nCluster لكل عميل:");

// طباعة Cluster لكل عميل
finalModel.clusters.forEach((c, i) => {
  console.log(`Client ${i + 1} → Cluster ${c}`);
});

// ================= جدول بيانات العملاء =================
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
