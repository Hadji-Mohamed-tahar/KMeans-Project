// normalize.js

// دالة normalize تقوم بتحويل البيانات إلى قيم موحدة (Z-score normalization)
export function normalize(data) {
  // عدد الأعمدة في البيانات (عدد المتغيرات)
  const cols = data[0].length;

  // إنشاء مصفوفتين لتخزين المتوسط والانحراف المعياري لكل عمود
  const means = Array(cols).fill(0);
  const stds = Array(cols).fill(0);

  // 1) حساب المتوسط لكل عمود
  data.forEach(row =>
    row.forEach((val, i) => means[i] += val)
  );
  means.forEach((_, i) => means[i] /= data.length);

  // 2) حساب الانحراف المعياري لكل عمود
  data.forEach(row =>
    row.forEach((val, i) => stds[i] += (val - means[i]) ** 2)
  );
  stds.forEach((_, i) => stds[i] = Math.sqrt(stds[i] / data.length));

  // 3) تطبيق normalization على كل قيمة في البيانات
  //    (val - mean) / std
  return data.map(row =>
    row.map((val, i) => (val - means[i]) / stds[i])
  );
}
