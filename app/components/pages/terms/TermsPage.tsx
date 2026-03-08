'use client';

import React from 'react';
import { Shield, User, Scale, FileText, AlertTriangle, Gavel, Clock, Phone, Mail, Globe, Users, Lock } from 'lucide-react';

interface TermsConditionsProps {
  locale?: string;
}

const termsData = {
  tr: {
    footerTitle: "Önemli Hatırlatma",
    footerContent: "Bu şartlar ve koşullar, UNILAB Vision başvuru platformunu kullanarak kabul etmiş olduğunuz yasal yükümlülükleri içermektedir. Platformumuzu kullanmaya devam ederek, bu şart ve koşullara uyacağınızı taahhüt etmiş sayılırsınız. Herhangi bir sorunuz veya belirsizlik durumunda, lütfen bizimle iletişime geçmekten çekinmeyin.",
    sections: [
      {
        id: "introduction",
        title: "Giriş ve Kabullenme",
        icon: "shield",
        content: [
          "UNILAB Vision platformuna hoş geldiniz. Bu şartlar ve koşullar, platformumuzun kullanımına ilişkin kuralları, hakları ve yükümlülükleri belirler.",
          "Platformu kullanarak, bu şartları okuduğunuzu, anladığınızı ve kabul ettiğinizi beyan etmiş olursunuz. Şartları kabul etmiyorsanız, lütfen platformu kullanmayınız.",
          "Bu şartlar, Türkiye Cumhuriyeti yasalarına tabidir ve İstanbul mahkemeleri yetkilidir."
        ]
      },
      {
        id: "platform-usage",
        title: "Platform Kullanımı",
        icon: "user",
        content: [
          "UNILAB Vision, bilimsel etkinlikler, eğitimler ve akademik faaliyetler için tasarlanmış bir başvuru platformudur.",
          "Platformu yalnızca yasal amaçlar için kullanabilirsiniz. Aşağıdaki faaliyetler kesinlikle yasaktır:",
          "• Başkalarının haklarını ihlal edici içerikler göndermek",
          "• Sahte bilgiler veya belgeler ile başvuru yapmak",
          "• Spam veya zararlı içerik göndermek",
          "• Fikri mülkiyet haklarını ihlal edici eylemler",
          "• Platform güvenliğini tehdit edici davranışlar"
        ]
      },
      {
        id: "applications-submissions",
        title: "Başvuru ve Kayıtlar",
        icon: "users",
        content: [
          "Platform üzerinden etkinliklere başvuru yapabilir ve kayıt olabilirsiniz.",
          "Başvuru formlarında verdiğiniz bilgilerin doğru ve güncel olmasından sorumlusunuz.",
          "Yanlış veya eksik bilgi vermek başvurunuzun reddedilmesine neden olabilir.",
          "Başvuru süreçlerinde belirtilen şartları karşılamanız gerekmektedir.",
          "Başvuru sonuçları belirtilen süre içerisinde size bildirilir."
        ]
      },
      {
        id: "content-submissions",
        title: "İçerik ve Başvuru Materyalleri",
        icon: "filetext",
        content: [
          "Platform üzerindeki tüm içerik, tasarım, logo ve materyaller UNILAB Vision'ın fikri mülkiyetidir.",
          "Başvuru sırasında gönderdiğiniz belge ve materyallerin telif hakkına sahip olduğunuzu beyan edersiniz.",
          "Gönderilen başvuru materyalleri değerlendirme sürecinde UNILAB Vision tarafından incelenebilir.",
          "Üçüncü taraf içeriklerinin kullanımında ilgili telif hakkı sahiplerinin izni alınmalıdır.",
          "Başvuru materyalleriniz onaylandığında platform üzerinde yayınlanabilir."
        ]
      },
      {
        id: "services-availability",
        title: "Hizmet Kullanılabilirliği",
        icon: "clock",
        content: [
          "Platform hizmetlerini kesintisiz sunmaya çalışsak da, %100 kesintisiz hizmet garantisi veremeyiz.",
          "Teknik bakım, güncelleme veya beklenmeyen teknik sorunlar nedeniyle hizmet kesintileri yaşanabilir.",
          "Hizmet kesintileri öncesinde mümkün olduğunca kullanıcılar bilgilendirilir.",
          "Planlanmış bakım çalışmaları için önceden duyuru yapılır.",
          "Acil durum güncellemeleri anında uygulanabilir."
        ]
      },
      {
        id: "liability-disclaimer",
        title: "Sorumluluk Reddi",
        icon: "alerttriangle",
        content: [
          "UNILAB Vision, platform kullanımından doğabilecek dolaylı zararlardan sorumlu tutulamaz.",
          "Platform üzerindeki bilgilerin doğruluğu ve güncelliği için azami özen gösterilir ancak garanti verilmez.",
          "Üçüncü taraf bağlantıları ve içeriklerinden UNILAB Vision sorumlu değildir.",
          "Kullanıcıların platformu kendi risk ve sorumluluklarında kullandıkları kabul edilir.",
          "Veri kaybı, sistem arızaları veya güvenlik ihlalleri nedeniyle oluşabilecek zararlar için sorumluluk kabul edilmez."
        ]
      },
      {
        id: "event-participation",
        title: "Etkinlik Katılımı",
        icon: "scale",
        content: [
          "Etkinliklere katılım başvuru sürecinden geçer.",
          "Başvuru onaylandıktan sonra katılım bilgileri size iletilir.",
          "Etkinlik iptal edilirse katılımcılar önceden bilgilendirilir.",
          "Katılımcıların etkinlik kurallarına uyması beklenir.",
          "Katılım sertifikaları başarıyla tamamlanan etkinlikler için verilir."
        ]
      },
      {
        id: "privacy-data",
        title: "Gizlilik ve Veri Koruma",
        icon: "lock",
        content: [
          "Kişisel verilerinizin korunması konusunda KVKK'ya tam uyum sağlarız.",
          "Detaylı bilgi için Gizlilik Politikamızı incelemenizi rica ederiz.",
          "Verileriniz yalnızca belirtilen amaçlar doğrultusunda işlenir.",
          "Veri güvenliği için çok katmanlı güvenlik önlemleri alınmıştır.",
          "Veri sahibi haklarınızı istediğiniz zaman kullanabilirsiniz."
        ]
      },
      {
        id: "application-termination",
        title: "Başvuru İptali ve Yasaklama",
        icon: "gavel",
        content: [
          "Başvurunuzu istediğiniz zaman iptal edebilirsiniz.",
          "UNILAB Vision, şartları ihlal eden kullanıcıları platform kullanımından men edebilir.",
          "Başvuru iptali durumunda, kişisel verileriniz gizlilik politikası çerçevesinde işlenir.",
          "Onaylanmış başvuruların iptali için destek ekibiyle iletişime geçiniz.",
          "Yasaklama durumunda, platform kullanım hakları derhal sona erer."
        ]
      },
      {
        id: "changes-updates",
        title: "Değişiklikler ve Güncellemeler",
        icon: "globe",
        content: [
          "Bu şartlar ve koşullar, yasal gereklilikler veya hizmet güncellemeleri doğrultusunda değiştirilebilir.",
          "Önemli değişiklikler kullanıcılara e-posta veya platform bildirimleri ile duyurulur.",
          "Güncellemeler yayınlandığı tarihten itibaren geçerli olur.",
          "Değişiklikleri kabul etmiyorsanız, platformu kullanmayı bırakabilirsiniz.",
          "Platform kullanımına devam etmek, güncellenmiş şartları kabul ettiğiniz anlamına gelir."
        ]
      },
      {
        id: "contact-support",
        title: "İletişim ve Destek",
        icon: "mail",
        content: [
          "Şartlar ve koşullar hakkında sorularınız için bizimle iletişime geçebilirsiniz:",
          "• E-posta: info@unilabvision.com",
          "• Telefon: +90 541 944 46 34",
        ]
      }
    ]
  },
  en: {
    footerTitle: "Important Notice",
    footerContent: "These terms and conditions contain the legal obligations you have agreed to by using the UNILAB Vision application platform. By continuing to use our platform, you are deemed to have committed to comply with these terms and conditions. If you have any questions or uncertainties, please do not hesitate to contact us.",
    sections: [
      {
        id: "introduction",
        title: "Introduction and Acceptance",
        icon: "shield",
        content: [
          "Welcome to the UNILAB Vision platform. These terms and conditions set out the rules, rights and obligations regarding the use of our application platform.",
          "By using the platform, you declare that you have read, understood and accepted these terms. If you do not accept the terms, please do not use the platform.",
          "These terms are subject to the laws of the Republic of Turkey and Istanbul courts have jurisdiction."
        ]
      },
      {
        id: "platform-usage",
        title: "Platform Usage",
        icon: "user",
        content: [
          "UNILAB Vision is a application platform designed for scientific events, training and academic activities.",
          "You may only use the platform for legal purposes. The following activities are strictly prohibited:",
          "• Sending content that violates the rights of others",
          "• Applying with false information or documents",
          "• Sending spam or harmful content",
          "• Actions that violate intellectual property rights",
          "• Behaviors that threaten platform security"
        ]
      },
      {
        id: "applications-submissions",
        title: "Applications and Registrations",
        icon: "users",
        content: [
          "You can apply for events and register through the platform.",
          "You are responsible for ensuring that the information you provide in application forms is accurate and up to date.",
          "Providing incorrect or incomplete information may result in rejection of your application.",
          "You must meet the specified requirements in the application processes.",
          "Application results will be notified to you within the specified time."
        ]
      },
      {
        id: "content-submissions",
        title: "Content and Application Materials",
        icon: "filetext",
        content: [
          "All content, design, logos and materials on the platform are the intellectual property of UNILAB Vision.",
          "You declare that you own the copyright to the documents and materials you submit during application.",
          "Submitted application materials may be reviewed by UNILAB Vision during the evaluation process.",
          "Permission from the relevant copyright holders must be obtained when using third party content.",
          "Your application materials may be published on the platform when approved."
        ]
      },
      {
        id: "services-availability",
        title: "Service Availability",
        icon: "clock",
        content: [
          "Although we strive to provide platform services uninterrupted, we cannot guarantee 100% uninterrupted service.",
          "Service interruptions may occur due to technical maintenance, updates or unexpected technical problems.",
          "Users are informed as much as possible before service interruptions.",
          "Advance notice is given for planned maintenance work.",
          "Emergency updates can be applied immediately."
        ]
      },
      {
        id: "liability-disclaimer",
        title: "Liability Disclaimer",
        icon: "alerttriangle",
        content: [
          "UNILAB Vision cannot be held responsible for indirect damages that may arise from platform use.",
          "Maximum care is taken for the accuracy and timeliness of information on the platform, but no guarantee is given.",
          "UNILAB Vision is not responsible for third party links and content.",
          "It is accepted that users use the platform at their own risk and responsibility.",
          "No liability is accepted for damages that may occur due to data loss, system failures or security breaches."
        ]
      },
      {
        id: "event-participation",
        title: "Event Participation",
        icon: "scale",
        content: [
          "Participation in events goes through an application process.",
          "Participation information will be sent to you after application approval.",
          "Participants will be informed in advance if the event is cancelled.",
          "Participants are expected to comply with event rules.",
          "Participation certificates are given for successfully completed events."
        ]
      },
      {
        id: "privacy-data",
        title: "Privacy and Data Protection",
        icon: "lock",
        content: [
          "We fully comply with KVKK regarding the protection of your personal data.",
          "Please review our Privacy Policy for detailed information.",
          "Your data is processed only for the specified purposes.",
          "Multi-layered security measures have been taken for data security.",
          "You can exercise your data subject rights at any time."
        ]
      },
      {
        id: "application-termination",
        title: "Application Cancellation and Banning",
        icon: "gavel",
        content: [
          "You can cancel your application at any time.",
          "UNILAB Vision may ban users who violate the terms from using the platform.",
          "In case of application cancellation, your personal data is processed within the framework of the privacy policy.",
          "To cancel approved applications, please contact the support team.",
          "In case of banning, platform usage rights end immediately."
        ]
      },
      {
        id: "changes-updates",
        title: "Changes and Updates",
        icon: "globe",
        content: [
          "These terms and conditions may be changed in line with legal requirements or service updates.",
          "Important changes are announced to users via email or platform notifications.",
          "Updates are valid from the date they are published.",
          "If you do not accept the changes, you can stop using the platform.",
          "Continuing to use the platform means that you accept the updated terms."
        ]
      },
      {
        id: "contact-support",
        title: "Contact and Support",
        icon: "mail",
        content: [
          "You can contact us for questions about terms and conditions:",
          "• Email: info@unilabvision.com",
          "• Phone: +90 541 944 46 34",
        ]
      }
    ]
  }
};

// Icon mapping
const iconMap: { [key: string]: React.ReactNode } = {
  shield: <Shield className="w-6 h-6 text-[#990000] dark:text-white" strokeWidth={1.5} />,
  user: <User className="w-6 h-6 text-[#990000] dark:text-white" strokeWidth={1.5} />,
  users: <Users className="w-6 h-6 text-[#990000] dark:text-white" strokeWidth={1.5} />,
  filetext: <FileText className="w-6 h-6 text-[#990000] dark:text-white" strokeWidth={1.5} />,
  clock: <Clock className="w-6 h-6 text-[#990000] dark:text-white" strokeWidth={1.5} />,
  alerttriangle: <AlertTriangle className="w-6 h-6 text-[#990000] dark:text-white" strokeWidth={1.5} />,
  scale: <Scale className="w-6 h-6 text-[#990000] dark:text-white" strokeWidth={1.5} />,
  lock: <Lock className="w-6 h-6 text-[#990000] dark:text-white" strokeWidth={1.5} />,
  gavel: <Gavel className="w-6 h-6 text-[#990000] dark:text-white" strokeWidth={1.5} />,
  globe: <Globe className="w-6 h-6 text-[#990000] dark:text-white" strokeWidth={1.5} />,
  mail: <Mail className="w-6 h-6 text-[#990000] dark:text-white" strokeWidth={1.5} />,
  phone: <Phone className="w-6 h-6 text-[#990000] dark:text-white" strokeWidth={1.5} />
};

export default function TermsConditions({ locale = 'tr' }: TermsConditionsProps) {
  const content = termsData[locale as keyof typeof termsData] || termsData.tr;

  return (
    <div className="bg-white dark:bg-neutral-900 min-h-screen">
      {/* Content Sections */}
      <section className="py-12 bg-white dark:bg-neutral-900">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="space-y-12">
            {content.sections.map((section, index) => (
              <div key={section.id} className="text-left">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 flex items-center justify-center rounded-lg bg-[#990000]/5 dark:bg-[#990000]/10">
                    {iconMap[section.icon]}
                  </div>
                  <div>
                    <h2 className="text-2xl font-light text-neutral-900 dark:text-neutral-100">
                      {section.title}
                    </h2>
                    <div className="w-12 h-px bg-[#990000] mt-2"></div>
                  </div>
                </div>

                <div className="space-y-4">
                  {section.content.map((paragraph, pIndex) => (
                    <p 
                      key={pIndex} 
                      className="text-neutral-600 dark:text-neutral-400 leading-relaxed text-left"
                    >
                      {paragraph}
                    </p>
                  ))}
                </div>

                {index < content.sections.length - 1 && (
                  <div className="mt-12 w-full h-px bg-neutral-200 dark:bg-neutral-700"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer Notice */}
      <section className="py-12 bg-neutral-50 dark:bg-neutral-800/30">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="bg-white dark:bg-neutral-800 rounded-lg p-8 border border-neutral-200 dark:border-neutral-700 text-left">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 flex items-center justify-center rounded-lg bg-blue-50 dark:bg-blue-900/20 flex-shrink-0">
                <AlertTriangle className="w-6 h-6 text-blue-600 dark:text-blue-400" strokeWidth={1.5} />
              </div>
              <div>
                <h3 className="text-lg font-medium text-neutral-900 dark:text-neutral-100 mb-3">
                  {content.footerTitle}
                </h3>
                <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
                  {content.footerContent}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}