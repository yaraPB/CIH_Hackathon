import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      // Navigation
      "nav.dashboard": "Dashboard",
      "nav.analytics": "Analytics",
      "nav.logout": "Logout",

      // Dashboard
      "dashboard.welcome": "Welcome back",
      "dashboard.personalBalance": "Personal Balance",
      "dashboard.totalGroupFunds": "Total Group Funds",
      "dashboard.activeGroups": "Active Groups",
      "dashboard.yourGroups": "Your Groups",
      "dashboard.newGroup": "New Group",
      "dashboard.recentActivity": "Recent Activity",
      "dashboard.manageGroups": "Manage your group wallets and track shared expenses",

      // Group Actions - UPDATED NAMES
      "group.contribute": "Contribute",
      "group.payment": "Payment",
      "group.proposePayment": "Propose Payment",
      "group.members": "Members",
      "group.balance": "Group Balance",
      "group.transactions": "Total Transactions",
      "group.scanQR": "Scan QR Code",
      "group.backToDashboard": "Back to Dashboard",
      "group.backToGroup": "Back to Group",

      // Payment Form
      "payment.amount": "Amount (MAD)",
      "payment.description": "Description",
      "payment.beneficiary": "Beneficiary (optional)",
      "payment.rib": "RIB Beneficiary (optional)",
      "payment.submit": "Submit Proposal",
      "payment.submitContribution": "Contribute Now",
      "payment.cancel": "Cancel",
      "payment.transactionType": "Transaction Type",
      "payment.currentBalance": "Current group balance",
      "payment.fees": "Fees",
      "payment.total": "Total",
      "payment.details": "Transaction Details",

      // Approval
      "approval.pending": "Pending Approval",
      "approval.approved": "Approved",
      "approval.rejected": "Rejected",
      "approval.approve": "Approve",
      "approval.reject": "Reject",
      "approval.waiting": "Waiting for all members to approve",
      "approval.allApproved": "All members approved. Payment will proceed.",
      "approval.oneRejected": "Payment rejected by a member.",
      "approval.approvals": "Approvals",
      "approval.required": "All members must approve",

      // New Group
      "newGroup.title": "Create New Group",
      "newGroup.name": "Group Name",
      "newGroup.description": "Description",
      "newGroup.create": "Create Group",
      "newGroup.creating": "Creating...",

      // QR Scanner
      "qr.title": "Scan QR Code",
      "qr.scanning": "Position QR code in camera view",
      "qr.manualEntry": "Or enter code manually",
      "qr.enterCode": "Enter QR code",
      "qr.submit": "Submit",
      "qr.close": "Close",
      "qr.error": "Unable to access camera",
      "qr.success": "QR Code scanned successfully",

      // Status
      "status.completed": "Completed",
      "status.pending": "Pending",
      "status.processing": "Processing",
      "status.rejected": "Rejected",

      // Common
      "common.loading": "Loading...",
      "common.error": "Error",
      "common.success": "Success",
      "common.back": "Back",
      "common.close": "Close",
      "common.save": "Save",
      "common.delete": "Delete",
      "common.edit": "Edit"
    }
  },
  fr: {
    translation: {
      // Navigation
      "nav.dashboard": "Tableau de bord",
      "nav.analytics": "Analytique",
      "nav.logout": "Déconnexion",

      // Dashboard
      "dashboard.welcome": "Bienvenue",
      "dashboard.personalBalance": "Solde Personnel",
      "dashboard.totalGroupFunds": "Fonds de Groupe Total",
      "dashboard.activeGroups": "Groupes Actifs",
      "dashboard.yourGroups": "Vos Groupes",
      "dashboard.newGroup": "Nouveau Groupe",
      "dashboard.recentActivity": "Activité Récente",
      "dashboard.manageGroups": "Gérez vos portefeuilles de groupe et suivez les dépenses partagées",

      // Group Actions
      "group.contribute": "Contribuer",
      "group.payment": "Paiement",
      "group.proposePayment": "Proposer un Paiement",
      "group.members": "Membres",
      "group.balance": "Solde du Groupe",
      "group.transactions": "Transactions Totales",
      "group.scanQR": "Scanner QR Code",
      "group.backToDashboard": "Retour au Tableau de bord",
      "group.backToGroup": "Retour au Groupe",

      // Payment Form
      "payment.amount": "Montant (MAD)",
      "payment.description": "Description",
      "payment.beneficiary": "Bénéficiaire (optionnel)",
      "payment.rib": "RIB Bénéficiaire (optionnel)",
      "payment.submit": "Soumettre la Proposition",
      "payment.submitContribution": "Contribuer Maintenant",
      "payment.cancel": "Annuler",
      "payment.transactionType": "Type de Transaction",
      "payment.currentBalance": "Solde actuel du groupe",
      "payment.fees": "Frais",
      "payment.total": "Total",
      "payment.details": "Détails de la Transaction",

      // Approval
      "approval.pending": "En Attente d'Approbation",
      "approval.approved": "Approuvé",
      "approval.rejected": "Rejeté",
      "approval.approve": "Approuver",
      "approval.reject": "Rejeter",
      "approval.waiting": "En attente de l'approbation de tous les membres",
      "approval.allApproved": "Tous les membres ont approuvé. Le paiement sera effectué.",
      "approval.oneRejected": "Paiement rejeté par un membre.",
      "approval.approvals": "Approbations",
      "approval.required": "Tous les membres doivent approuver",

      // New Group
      "newGroup.title": "Créer un Nouveau Groupe",
      "newGroup.name": "Nom du Groupe",
      "newGroup.description": "Description",
      "newGroup.create": "Créer le Groupe",
      "newGroup.creating": "Création...",

      // QR Scanner
      "qr.title": "Scanner le Code QR",
      "qr.scanning": "Positionnez le code QR dans la vue de la caméra",
      "qr.manualEntry": "Ou entrez le code manuellement",
      "qr.enterCode": "Entrez le code QR",
      "qr.submit": "Soumettre",
      "qr.close": "Fermer",
      "qr.error": "Impossible d'accéder à la caméra",
      "qr.success": "Code QR scanné avec succès",

      // Status
      "status.completed": "Terminé",
      "status.pending": "En Attente",
      "status.processing": "En Cours",
      "status.rejected": "Rejeté",

      // Common
      "common.loading": "Chargement...",
      "common.error": "Erreur",
      "common.success": "Succès",
      "common.back": "Retour",
      "common.close": "Fermer",
      "common.save": "Enregistrer",
      "common.delete": "Supprimer",
      "common.edit": "Modifier"
    }
  },
  ar: {
    translation: {
      // Navigation
      "nav.dashboard": "لوحة القيادة",
      "nav.analytics": "التحليلات",
      "nav.logout": "تسجيل الخروج",

      // Dashboard
      "dashboard.welcome": "مرحبا بعودتك",
      "dashboard.personalBalance": "الرصيد الشخصي",
      "dashboard.totalGroupFunds": "إجمالي أموال المجموعة",
      "dashboard.activeGroups": "المجموعات النشطة",
      "dashboard.yourGroups": "مجموعاتك",
      "dashboard.newGroup": "مجموعة جديدة",
      "dashboard.recentActivity": "النشاط الأخير",
      "dashboard.manageGroups": "إدارة محافظ المجموعة وتتبع النفقات المشتركة",

      // Group Actions
      "group.contribute": "المساهمة",
      "group.payment": "الدفع",
      "group.proposePayment": "اقتراح دفعة",
      "group.members": "الأعضاء",
      "group.balance": "رصيد المجموعة",
      "group.transactions": "إجمالي المعاملات",
      "group.scanQR": "مسح رمز الاستجابة السريعة",
      "group.backToDashboard": "العودة إلى لوحة القيادة",
      "group.backToGroup": "العودة إلى المجموعة",

      // Payment Form
      "payment.amount": "المبلغ (درهم)",
      "payment.description": "الوصف",
      "payment.beneficiary": "المستفيد (اختياري)",
      "payment.rib": "RIB المستفيد (اختياري)",
      "payment.submit": "تقديم الاقتراح",
      "payment.submitContribution": "المساهمة الآن",
      "payment.cancel": "إلغاء",
      "payment.transactionType": "نوع المعاملة",
      "payment.currentBalance": "الرصيد الحالي للمجموعة",
      "payment.fees": "الرسوم",
      "payment.total": "المجموع",
      "payment.details": "تفاصيل المعاملة",

      // Approval
      "approval.pending": "في انتظار الموافقة",
      "approval.approved": "موافق عليه",
      "approval.rejected": "مرفوض",
      "approval.approve": "الموافقة",
      "approval.reject": "رفض",
      "approval.waiting": "في انتظار موافقة جميع الأعضاء",
      "approval.allApproved": "وافق جميع الأعضاء. سيتم الدفع.",
      "approval.oneRejected": "رفض أحد الأعضاء الدفع.",
      "approval.approvals": "الموافقات",
      "approval.required": "يجب أن يوافق جميع الأعضاء",

      // New Group
      "newGroup.title": "إنشاء مجموعة جديدة",
      "newGroup.name": "اسم المجموعة",
      "newGroup.description": "الوصف",
      "newGroup.create": "إنشاء المجموعة",
      "newGroup.creating": "جاري الإنشاء...",

      // QR Scanner
      "qr.title": "مسح رمز الاستجابة السريعة",
      "qr.scanning": "ضع رمز الاستجابة السريعة في عرض الكاميرا",
      "qr.manualEntry": "أو أدخل الرمز يدويًا",
      "qr.enterCode": "أدخل رمز الاستجابة السريعة",
      "qr.submit": "إرسال",
      "qr.close": "إغلاق",
      "qr.error": "تعذر الوصول إلى الكاميرا",
      "qr.success": "تم مسح رمز الاستجابة السريعة بنجاح",

      // Status
      "status.completed": "مكتمل",
      "status.pending": "قيد الانتظار",
      "status.processing": "جاري المعالجة",
      "status.rejected": "مرفوض",

      // Common
      "common.loading": "جاري التحميل...",
      "common.error": "خطأ",
      "common.success": "نجاح",
      "common.back": "رجوع",
      "common.close": "إغلاق",
      "common.save": "حفظ",
      "common.delete": "حذف",
      "common.edit": "تعديل"
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
