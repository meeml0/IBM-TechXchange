'use client';

import React from 'react';
import { Shield, Eye, Lock, Database, Mail, Calendar, Globe, Users, FileText, AlertCircle } from 'lucide-react';

interface PrivacyPolicyProps {
  locale?: string;
}

const privacyData = {
  tr: {
    footerTitle: "Önemli Hatırlatma",
    footerContent: "Bu gizlilik politikası, UNILAB Vision platformunu kullanarak kabul etmiş olduğunuz şartları içermektedir. Platformumuzu kullanmaya devam ederek, kişisel verilerinizin bu politika kapsamında işlenmesini kabul etmiş sayılırsınız. Herhangi bir sorunuz veya endişeniz varsa, lütfen bizimle iletişime geçmekten çekinmeyin.",
    sections: [
      {
        id: "introduction",
        title: "Giriş",
        icon: "shield",
        content: [
          "UNILAB Vision olarak, kişisel verilerinizin gizliliği ve güvenliği konusunda en yüksek standartları benimseriz. Bu gizlilik politikası, platformumuzda toplanan, işlenen ve korunan kişisel verilerin nasıl yönetildiğini açıklar.",
          "6698 sayılı Kişisel Verilerin Korunması Kanunu (KVKK) ve ilgili mevzuat hükümlerine tam uyum sağlayarak, veri sahiplerinin haklarını koruma konusunda azami özen gösteririz."
        ]
      },
      {
        id: "data-collection",
        title: "Toplanan Veriler",
        icon: "database",
        content: [
          "Platformumuz aracılığıyla toplanan kişisel veriler şunları içerebilir:",
          "• Ad, soyad ve iletişim bilgileri (e-posta adresi, telefon numarası)",
          "• Demografik bilgiler (yaş, cinsiyet, eğitim durumu)",
          "• Profesyonel bilgiler (çalışma alanı, deneyim, ilgi alanları)",
          "• Etkinlik katılım bilgileri ve tercihler",
          "• Platform kullanım verileri ve etkileşim geçmişi",
          "• IP adresi, tarayıcı bilgileri ve teknik veriler"
        ]
      },
      {
        id: "data-usage",
        title: "Verilerin Kullanım Amaçları",
        icon: "eye",
        content: [
          "Toplanan kişisel veriler aşağıdaki amaçlarla işlenir:",
          "• Platform hizmetlerinin sunulması ve geliştirilmesi",
          "• Kullanıcı deneyiminin kişiselleştirilmesi",
          "• Etkinlik organizasyonu ve katılımcı yönetimi",
          "• Bilimsel içerik ve projelerle ilgili bilgilendirme",
          "• İstatistiksel analiz ve araştırma faaliyetleri",
          "• Yasal yükümlülüklerin yerine getirilmesi",
          "• Güvenlik önlemlerinin alınması ve sürdürülmesi"
        ]
      },
      {
        id: "data-sharing",
        title: "Veri Paylaşımı",
        icon: "users",
        content: [
          "Kişisel verileriniz, aşağıdaki durumlarda ve sınırlı şartlar altında üçüncü taraflarla paylaşılabilir:",
          "• Yasal zorunluluklar ve mahkeme kararları",
          "• Etkinlik ortakları ve sponsorlar (sadece gerekli bilgiler)",
          "• Teknik hizmet sağlayıcıları (veri işleme sözleşmesi kapsamında)",
          "• Akademik işbirlikleri (anonim ve toplu veriler)",
        ]
      },
      {
        id: "data-security",
        title: "Veri Güvenliği",
        icon: "lock",
        content: [
          "Kişisel verilerinizin güvenliği için çok katmanlı güvenlik önlemleri alınmıştır:",
          "• SSL şifreleme teknolojisi ile veri iletimi",
          "• Güvenli sunucu altyapısı ve düzenli güvenlik güncellemeleri",
          "• Erişim kontrolü ve yetkilendirme sistemleri",
          "• Düzenli güvenlik denetimleri ve izleme",
          "• Personel eğitimleri ve gizlilik taahhütleri",
          "• Yedekleme ve felaket kurtarma planları"
        ]
      },
      {
        id: "user-rights",
        title: "Veri Sahibi Hakları",
        icon: "filetext",
        content: [
          "KVKK kapsamında sahip olduğunuz haklar:",
          "• Kişisel verilerinizin işlenip işlenmediğini öğrenme",
          "• İşlenen verileriniz hakkında bilgi talep etme",
          "• İşleme amacını ve bunların amacına uygun kullanılıp kullanılmadığını öğrenme",
          "• Yurt içinde veya yurt dışında verilerin aktarıldığı üçüncü kişileri bilme",
          "• Verilerin eksik veya yanlış işlenmiş olması halinde düzeltilmesini isteme",
        ]
      },
      {
        id: "cookies",
        title: "Çerez Politikası",
        icon: "globe",
        content: [
          "Platformumuzda kullanıcı deneyimini geliştirmek için çerezler kullanılmaktadır:",
          "• Zorunlu çerezler: Platform işlevselliği için gerekli",
          "• Performans çerezleri: Site kullanımını analiz etmek için",
          "• İşlevsellik çerezleri: Kişiselleştirilmiş deneyim sunmak için",
          "• Hedefleme çerezleri: İlgili içerik gösteriminde kullanılır",
          "Çerez tercihlerinizi tarayıcı ayarlarınızdan yönetebilirsiniz."
        ]
      },
      {
        id: "contact",
        title: "İletişim",
        icon: "mail",
        content: [
          "Gizlilik politikamız hakkında sorularınız veya veri sahibi haklarınızı kullanmak istiyorsanız bizimle iletişime geçebilirsiniz:",
          "• E-posta: info@unilabvision.com",
          "• Telefon: +90 541 944 46 34",
        ]
      },
      {
        id: "changes",
        title: "Politika Güncellemeleri",
        icon: "calendar",
        content: [
          "Bu gizlilik politikası, yasal değişiklikler, teknolojik gelişmeler veya platform güncellemeleri doğrultusunda güncellenebilir.",
          "Önemli değişiklikler öncesinde kullanıcılarımız e-posta veya platform bildirimleri yoluyla bilgilendirilir.",
          "Güncel politika her zaman web sitemizde yayınlanır ve son güncelleme tarihi belirtilir."
        ]
      }
    ]
  },
  en: {
    title: "Privacy Policy",
    subtitle: "Our approach and commitments regarding the protection and processing of your personal data.",
    lastUpdated: "Last updated: June 8, 2025",
    footerTitle: "Important Notice",
    footerContent: "This privacy policy contains the terms you have agreed to by using the UNILAB Vision platform. By continuing to use our platform, you are deemed to have accepted the processing of your personal data within the scope of this policy. If you have any questions or concerns, please do not hesitate to contact us.",
    sections: [
      {
        id: "introduction",
        title: "Introduction",
        icon: "shield",
        content: [
          "As UNILAB Vision, we adopt the highest standards regarding the privacy and security of your personal data. This privacy policy explains how personal data collected, processed and protected on our platform is managed.",
          "We take utmost care to protect the rights of data subjects by fully complying with the Personal Data Protection Law No. 6698 (KVKK) and related legislation provisions."
        ]
      },
      {
        id: "data-collection",
        title: "Data Collected",
        icon: "database",
        content: [
          "Personal data collected through our platform may include:",
          "• Name, surname and contact information (email address, phone number)",
          "• Demographic information (age, gender, education status)",
          "• Professional information (field of work, experience, interests)",
          "• Event participation information and preferences",
          "• Platform usage data and interaction history",
          "• IP address, browser information and technical data"
        ]
      },
      {
        id: "data-usage",
        title: "Data Usage Purposes",
        icon: "eye",
        content: [
          "Collected personal data is processed for the following purposes:",
          "• Providing and improving platform services",
          "• Personalizing user experience",
          "• Event organization and participant management",
          "• Information about scientific content and projects",
          "• Statistical analysis and research activities",
          "• Fulfilling legal obligations",
          "• Taking and maintaining security measures"
        ]
      },
      {
        id: "data-sharing",
        title: "Data Sharing",
        icon: "users",
        content: [
          "Your personal data may be shared with third parties in the following cases and under limited conditions:",
          "• Legal obligations and court decisions",
          "• Event partners and sponsors (only necessary information)",
          "• Technical service providers (under data processing agreement)",
          "• Academic collaborations (anonymous and aggregate data)",
        ]
      },
      {
        id: "data-security",
        title: "Data Security",
        icon: "lock",
        content: [
          "Multi-layered security measures have been taken for the security of your personal data:",
          "• Data transmission with SSL encryption technology",
          "• Secure server infrastructure and regular security updates",
          "• Access control and authorization systems",
          "• Regular security audits and monitoring",
          "• Staff training and confidentiality commitments",
          "• Backup and disaster recovery plans"
        ]
      },
      {
        id: "user-rights",
        title: "Data Subject Rights",
        icon: "filetext",
        content: [
          "Your rights under KVKK:",
          "• Learning whether your personal data is processed",
          "• Requesting information about your processed data",
          "• Learning the purpose of processing and whether they are used in accordance with their purpose",
          "• Knowing the third parties to whom data is transferred domestically or abroad",
          "• Requesting correction if data is processed incompletely or incorrectly",
        ]
      },
      {
        id: "cookies",
        title: "Cookie Policy",
        icon: "globe",
        content: [
          "Cookies are used on our platform to improve user experience:",
          "• Essential cookies: Required for platform functionality",
          "• Performance cookies: To analyze site usage",
          "• Functionality cookies: To provide personalized experience",
          "• Targeting cookies: Used for relevant content display",
          "You can manage your cookie preferences from your browser settings."
        ]
      },
      {
        id: "contact",
        title: "Contact",
        icon: "mail",
        content: [
          "If you have questions about our privacy policy or want to exercise your data subject rights, you can contact us:",
          "• Email: info@unilabvision.com",
          "• Phone: +90 541 944 46 34",
        ]
      },
      {
        id: "changes",
        title: "Policy Updates",
        icon: "calendar",
        content: [
          "This privacy policy may be updated in line with legal changes, technological developments or platform updates.",
          "Users are informed via email or platform notifications before important changes.",
          "The current policy is always published on our website and the last update date is specified."
        ]
      }
    ]
  }
};

// Icon mapping
const iconMap: { [key: string]: React.ReactNode } = {
  shield: <Shield className="w-6 h-6 text-[#990000] dark:text-white" strokeWidth={1.5} />,
  database: <Database className="w-6 h-6 text-[#990000] dark:text-white" strokeWidth={1.5} />,
  eye: <Eye className="w-6 h-6 text-[#990000] dark:text-white" strokeWidth={1.5} />,
  users: <Users className="w-6 h-6 text-[#990000] dark:text-white" strokeWidth={1.5} />,
  lock: <Lock className="w-6 h-6 text-[#990000] dark:text-white" strokeWidth={1.5} />,
  filetext: <FileText className="w-6 h-6 text-[#990000] dark:text-white" strokeWidth={1.5} />,
  globe: <Globe className="w-6 h-6 text-[#990000] dark:text-white" strokeWidth={1.5} />,
  mail: <Mail className="w-6 h-6 text-[#990000] dark:text-white" strokeWidth={1.5} />,
  calendar: <Calendar className="w-6 h-6 text-[#990000] dark:text-white" strokeWidth={1.5} />
};

export default function PrivacyPolicy({ locale = 'tr' }: PrivacyPolicyProps) {
  const content = privacyData[locale as keyof typeof privacyData] || privacyData.tr;

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
                <AlertCircle className="w-6 h-6 text-blue-600 dark:text-blue-400" strokeWidth={1.5} />
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