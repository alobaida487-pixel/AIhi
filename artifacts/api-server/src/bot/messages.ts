export const MESSAGES = {
  Programming: `
مواصافات المشروع:
نوع المشروع: (بوت - موقع - تطبيق - غيره)
لغة البرمجة:
تفاصيل اضافية (اذا وجدت):
`,
  Designs: `
اسم السيرفر:
شعار السيرفر:
لون السيرفر:
اختصار السيرفر:
نوع التصميم المطلوب: (لوجو - بنر - فلاير - غيره)
تفاصيل اضافية (اذا وجدت):
`,
  Lethargy: `
اذا تم الخمول ( عدم الرد ) بالتذكرة خلال 30 دقيقة سيتم إغلاق التذكرة تلقائياً
`,
  evaluation: `
ان معك البائع  يرجي تقييمنا لانه مهم عندنا
`,
  transformation: `
يرجي تحويل المبلغ المطلوب هنا <#> ، ما نتحمل مسئولية تحويل روم اخري او شخص اخر
`,
};

// ─── Edit these values to match your server ───────────────────────────────────

// Category ID for ticket channels (right-click category → Copy ID)
export const Category = "";

// Role IDs that appear as mentions on offer posts (array of role ID strings)
export const OffersRoles: string[] = [];

// Role IDs for sellers — only members with these roles can use auto-reply keywords
export const Sellers: string[] = [];
