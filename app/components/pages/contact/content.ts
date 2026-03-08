// app/components/pages/contact/content.ts

export interface ContactContent {
  title: string;
  description: string;
  officeTitle: string;
  address: string;
  contactInfoTitle: string;
  phoneTitle: string;
  phoneNumber: string;
  emailTitle: string;
  emailAddress: string;
  formTitle: string;
  nameLabel: string;
  namePlaceholder: string;
  surnameLabel: string;
  surnamePlaceholder: string;
  emailLabel: string;
  emailPlaceholder: string;
  phoneLabel: string;
  phonePlaceholder: string;
  messageLabel: string;
  messagePlaceholder: string;
  submitButton: string;
  successMessage: string;
  errorMessage: string;
  requiredFieldError: string;
  invalidEmailError: string;
  invalidPhoneError: string;
  spamProtectionText: string;
  communityTitle: string;
  communityText: string;
  socialMediaTitle: string;
  followUs: string;
  socialLinks: {
    twitter: string;
    instagram: string;
    linkedin: string;
  };
}

const content = {
tr: {
  title: "İletişim",
  description: "Teknoloji geliştirme, inovasyon projeleri ve UNILAB Vision platformu hakkında bilgi almak için bizimle iletişime geçebilirsiniz.",
  officeTitle: "Merkez Ofisimiz",
  address: "Gebze Teknik Üniversitesi, Bilgisayar Mühendisliği Bölümü, Gebze/Kocaeli, Türkiye",
  contactInfoTitle: "İletişim Bilgileri",
  phoneTitle: "Telefon",
  phoneNumber: "+90 (541) 944 46 34",
  emailTitle: "E-posta",
  emailAddress: "info@unilabvision.com",
  formTitle: "İletişim Formu",
  nameLabel: "Adınız",
  namePlaceholder: "Adınızı giriniz",
  surnameLabel: "Soyadınız",
  surnamePlaceholder: "Soyadınızı giriniz",
  emailLabel: "E-posta Adresiniz",
  emailPlaceholder: "E-posta adresinizi giriniz",
  phoneLabel: "Telefon Numaranız",
  phonePlaceholder: "Telefon numaranızı giriniz",
  messageLabel: "Mesajınız",
  messagePlaceholder: "Teknoloji projeleriniz, iş birliği önerileriniz veya merak ettiklerinizi buraya yazabilirsiniz...",
  submitButton: "Gönder",
  successMessage: "Mesajınız başarıyla gönderildi. UNILAB Vision ekibimiz en kısa sürede sizinle iletişime geçecektir.",
  errorMessage: "Mesajınız gönderilirken bir hata oluştu. Lütfen daha sonra tekrar deneyiniz.",
  requiredFieldError: "Bu alan zorunludur",
  invalidEmailError: "Geçerli bir e-posta adresi giriniz",
  invalidPhoneError: "Geçerli bir telefon numarası giriniz",
  spamProtectionText: "Bu formda spam koruması bulunmaktadır. Lütfen gerçek bilgilerinizi giriniz.",
  communityTitle: "UNILAB Vision Hakkında",
  communityText: "UNILAB Vision, çığır açan yeniliklerle geleceği şekillendirmeye adanmış öncü bir girişimdir. Daha iyi bir yarın için dönüştürücü ürünler geliştirmek üzere disiplinler arası işbirliğinin ve en son teknolojinin gücünden yararlanıyoruz.",
  socialMediaTitle: "Sosyal Medya",
  followUs: "Teknolojik gelişmelerimizi takip edin",
  socialLinks: {
    twitter: "https://twitter.com/unilabvisiontr",
    instagram: "https://instagram.com/unilabvisiontr",
    linkedin: "https://linkedin.com/company/unilabvisiontr"
  }
},
en: {
  title: "Contact",
  description: "Get in touch with us for technology development, innovation projects, and UNILAB Vision platform activities.",
  officeTitle: "Our Headquarters",
  address: "Gebze Technical University, Department of Computer Engineering, Gebze/Kocaeli, Turkey",
  contactInfoTitle: "Contact Information",
  phoneTitle: "Phone",
  phoneNumber: "+90 (541) 944 46 34",
  emailTitle: "Email",
  emailAddress: "info@unilabvision.com",
  formTitle: "Contact Form",
  nameLabel: "First Name",
  namePlaceholder: "Enter your first name",
  surnameLabel: "Last Name",
  surnamePlaceholder: "Enter your last name",
  emailLabel: "Email Address",
  emailPlaceholder: "Enter your email address",
  phoneLabel: "Phone Number",
  phonePlaceholder: "Enter your phone number",
  messageLabel: "Message",
  messagePlaceholder: "Share your technology projects, collaboration ideas, or questions here...",
  submitButton: "Submit",
  successMessage: "Your message has been sent successfully. Our UNILAB Vision team will contact you as soon as possible.",
  errorMessage: "An error occurred while sending your message. Please try again later.",
  requiredFieldError: "This field is required",
  invalidEmailError: "Please enter a valid email address",
  invalidPhoneError: "Please enter a valid phone number",
  spamProtectionText: "This form has spam protection. Please enter your real information.",
  communityTitle: "About UNILAB Vision",
  communityText: "UNILAB Vision is a pioneering initiative dedicated to shaping the future through breakthrough innovation. We harness the power of interdisciplinary collaboration and cutting-edge technology to develop transformative products for a better tomorrow.",
  socialMediaTitle: "Social Media",
  followUs: "Follow our technological developments",
  socialLinks: {
    twitter: "https://twitter.com/unilabvision",
    instagram: "https://instagram.com/unilabvision",
    linkedin: "https://linkedin.com/company/unilabvision"
  }
}
};

export default content;