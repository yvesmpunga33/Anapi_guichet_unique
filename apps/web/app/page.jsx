"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import {
  Globe,
  TrendingUp,
  Shield,
  Users,
  Building,
  Leaf,
  Zap,
  Factory,
  MapPin,
  Award,
  ArrowRight,
  CheckCircle,
  Phone,
  Mail,
  ChevronDown,
  Menu,
  X,
  Play,
  Star,
  Clock,
  FileCheck,
  DollarSign,
  Briefcase,
  FileText,
  Scale,
  HeartHandshake,
  BarChart3,
  ChevronRight,
  Sparkles,
  Target,
  Rocket,
  BadgeCheck,
  Landmark,
  ScrollText,
  ClipboardCheck,
  Building2,
  Handshake,
  GraduationCap,
  LineChart,
  ShieldCheck,
  Globe2,
  Cpu,
  TreePine,
  Gem,
  Sun,
  Palmtree,
  HardHat,
  Smartphone,
  Map,
  Check,
  FileSignature,
  KeyRound,
  Stamp,
  FileBadge,
  CircleCheck,
  Timer,
  Layers,
  Workflow,
} from "lucide-react";

// Dynamic import for the map component
const DRCMapPublic = dynamic(
  () => import("../components/maps/DRCMapPublic"),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center h-[500px] bg-[#0A1628] rounded-2xl">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-t-transparent border-[#D4A853] rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-400">Chargement de la carte...</p>
        </div>
      </div>
    )
  }
);

// Langues disponibles avec drapeaux
const LANGUAGES = [
  { code: "fr", name: "Français", flag: "/images/flags/fr.svg" },
  { code: "en", name: "English", flag: "/images/flags/gb.svg" },
  { code: "pt", name: "Português", flag: "/images/flags/pt.svg" },
  { code: "es", name: "Español", flag: "/images/flags/es.svg" },
  { code: "zh", name: "中文", flag: "/images/flags/cn.svg" },
  { code: "ar", name: "العربية", flag: "/images/flags/sa.svg" },
];

// Traductions
const translations = {
  fr: {
    nav: {
      guichetUnique: "Guichet Unique",
      services: "Services",
      sectors: "Secteurs",
      map: "Carte",
      advantages: "Avantages",
      process: "Processus",
      faq: "FAQ",
      login: "Se connecter",
      appointment: "Rendez-vous",
    },
    hero: {
      badge: "Plateforme Officielle d'Investissement en RDC",
      title1: "Guichet Unique des",
      titleHighlight: "Autorisations, Licences et Permis",
      title2: "La révolution numérique",
      subtitle: "Une seule plateforme pour toutes vos démarches administratives. Obtenez vos autorisations, licences et permis en ligne, rapidement et en toute transparence.",
      cta1: "Démarrer ma demande",
      cta2: "En savoir plus",
      stats1: "Demandes traitées",
      stats2: "Jours en moyenne",
      stats3: "Taux de satisfaction",
    },
    guichet: {
      badge: "Guichet Unique Digital",
      title: "Toutes vos démarches administratives en un seul endroit",
      subtitle: "Le Guichet Unique des Autorisations, Licences et Permis révolutionne vos interactions avec l'administration congolaise.",
      feature1: "Autorisations",
      feature1Desc: "Obtenez toutes les autorisations nécessaires pour votre activité commerciale",
      feature2: "Licences",
      feature2Desc: "Demandez et renouvelez vos licences professionnelles en ligne",
      feature3: "Permis",
      feature3Desc: "Soumettez vos demandes de permis de construction, environnementaux, etc.",
      feature4: "Certificats",
      feature4Desc: "Téléchargez vos certificats d'agrément et attestations officielles",
      advantage1: "Disponible 24h/24, 7j/7",
      advantage2: "Suivi en temps réel",
      advantage3: "Zéro déplacement",
      advantage4: "Délais garantis",
      advantage5: "Support multilingue",
      advantage6: "100% sécurisé",
    },
    process: {
      badge: "Opportunité d'Investissement",
      title: "Investissez en RDC, l'ANAPI vous ouvre les portes",
      subtitle: "Une plateforme multilingue disponible en 6 langues pour accueillir les investisseurs du monde entier. Créez votre compte et un expert en investissement vous accompagnera dans tous vos projets.",
      step1: "Agriculture",
      step1Desc: "80 millions d'hectares de terres arables fertiles",
      step2: "Mines & Énergie",
      step2Desc: "1er producteur mondial de cobalt, cuivre, coltan",
      step3: "Infrastructure",
      step3Desc: "Routes, ponts, ports, aéroports, télécoms",
      step4: "Industries",
      step4Desc: "Santé, éducation, construction, technologie",
      expert: "Un expert dédié vous accompagne",
      expertDesc: "Dès la création de votre compte, un expert en investissement ANAPI vous est assigné pour vous guider dans toutes vos démarches.",
      languages: "6 langues disponibles",
      languagesDesc: "Français, English, Português, Español, 中文, العربية",
    },
    stats: {
      investments: "Investissements facilités",
      companies: "Entreprises accompagnées",
      jobs: "Emplois créés",
      consumers: "Consommateurs",
    },
    services: {
      badge: "Nos Services",
      title: "Une Plateforme Complète pour vos Investissements",
      subtitle: "De la création de compte à l'obtention de votre agrément, nous vous accompagnons à chaque étape.",
    },
    sectors: {
      badge: "Opportunités",
      title: "Secteurs Stratégiques d'Investissement",
      subtitle: "La RDC offre des opportunités exceptionnelles dans des secteurs clés.",
      explore: "Explorer toutes les opportunités",
    },
    advantages: {
      badge: "Code des Investissements",
      title: "Des Avantages Exceptionnels pour vos Investissements",
      subtitle: "La RDC offre l'un des régimes fiscaux les plus attractifs d'Afrique.",
    },
    cta: {
      title: "Prêt à Investir en RDC ?",
      subtitle: "Rejoignez les centaines d'entreprises qui ont fait confiance à l'ANAPI.",
      button: "Créer mon compte gratuitement",
      contact: "Nous contacter",
    },
    footer: {
      description: "L'Agence Nationale pour la Promotion des Investissements est votre partenaire de confiance pour réussir votre investissement en RDC.",
      services: "Services",
      resources: "Ressources",
      legal: "Légal",
    },
  },
  en: {
    nav: {
      guichetUnique: "One-Stop Shop",
      services: "Services",
      sectors: "Sectors",
      map: "Map",
      advantages: "Advantages",
      process: "Process",
      faq: "FAQ",
      login: "Sign in",
      appointment: "Appointment",
    },
    hero: {
      badge: "Official Investment Platform in DRC",
      title1: "One-Stop Shop for",
      titleHighlight: "Authorizations, Licenses & Permits",
      title2: "The Digital Revolution",
      subtitle: "A single platform for all your administrative procedures. Get your authorizations, licenses and permits online, quickly and transparently.",
      cta1: "Start my application",
      cta2: "Learn more",
      stats1: "Applications processed",
      stats2: "Days on average",
      stats3: "Satisfaction rate",
    },
    guichet: {
      badge: "Digital One-Stop Shop",
      title: "All your administrative procedures in one place",
      subtitle: "The One-Stop Shop for Authorizations, Licenses and Permits revolutionizes your interactions with the Congolese administration.",
      feature1: "Authorizations",
      feature1Desc: "Obtain all necessary authorizations for your business activity",
      feature2: "Licenses",
      feature2Desc: "Apply for and renew your professional licenses online",
      feature3: "Permits",
      feature3Desc: "Submit your applications for construction, environmental permits, etc.",
      feature4: "Certificates",
      feature4Desc: "Download your approval certificates and official attestations",
      advantage1: "Available 24/7",
      advantage2: "Real-time tracking",
      advantage3: "Zero travel",
      advantage4: "Guaranteed deadlines",
      advantage5: "Multilingual support",
      advantage6: "100% secure",
    },
    process: {
      badge: "Investment Opportunity",
      title: "Invest in DRC, ANAPI opens the doors for you",
      subtitle: "A multilingual platform available in 6 languages to welcome investors from around the world. Create your account and an investment expert will guide you through all your projects.",
      step1: "Agriculture",
      step1Desc: "80 million hectares of fertile arable land",
      step2: "Mining & Energy",
      step2Desc: "World's #1 producer of cobalt, copper, coltan",
      step3: "Infrastructure",
      step3Desc: "Roads, bridges, ports, airports, telecoms",
      step4: "Industries",
      step4Desc: "Healthcare, education, construction, technology",
      expert: "A dedicated expert supports you",
      expertDesc: "From the moment you create your account, an ANAPI investment expert is assigned to guide you through all your procedures.",
      languages: "6 languages available",
      languagesDesc: "Français, English, Português, Español, 中文, العربية",
    },
    stats: {
      investments: "Investments facilitated",
      companies: "Companies supported",
      jobs: "Jobs created",
      consumers: "Consumers",
    },
    services: {
      badge: "Our Services",
      title: "A Complete Platform for Your Investments",
      subtitle: "From account creation to obtaining your approval, we support you every step of the way.",
    },
    sectors: {
      badge: "Opportunities",
      title: "Strategic Investment Sectors",
      subtitle: "DRC offers exceptional opportunities in key sectors.",
      explore: "Explore all opportunities",
    },
    advantages: {
      badge: "Investment Code",
      title: "Exceptional Benefits for Your Investments",
      subtitle: "DRC offers one of the most attractive tax regimes in Africa.",
    },
    cta: {
      title: "Ready to Invest in DRC?",
      subtitle: "Join hundreds of companies that have trusted ANAPI.",
      button: "Create my free account",
      contact: "Contact us",
    },
    footer: {
      description: "The National Agency for Investment Promotion is your trusted partner for successful investment in DRC.",
      services: "Services",
      resources: "Resources",
      legal: "Legal",
    },
  },
  pt: {
    nav: {
      guichetUnique: "Balcão Único",
      services: "Serviços",
      sectors: "Setores",
      map: "Mapa",
      advantages: "Vantagens",
      process: "Processo",
      faq: "FAQ",
      login: "Entrar",
      appointment: "Agendamento",
    },
    hero: {
      badge: "Plataforma Oficial de Investimento na RDC",
      title1: "Balcão Único de",
      titleHighlight: "Autorizações, Licenças e Permissões",
      title2: "A Revolução Digital",
      subtitle: "Uma única plataforma para todos os seus procedimentos administrativos. Obtenha suas autorizações, licenças e permissões online, de forma rápida e transparente.",
      cta1: "Iniciar meu pedido",
      cta2: "Saiba mais",
      stats1: "Pedidos processados",
      stats2: "Dias em média",
      stats3: "Taxa de satisfação",
    },
    guichet: {
      badge: "Balcão Único Digital",
      title: "Todos os seus procedimentos administrativos em um só lugar",
      subtitle: "O Balcão Único de Autorizações, Licenças e Permissões revoluciona suas interações com a administração congolesa.",
      feature1: "Autorizações",
      feature1Desc: "Obtenha todas as autorizações necessárias para sua atividade comercial",
      feature2: "Licenças",
      feature2Desc: "Solicite e renove suas licenças profissionais online",
      feature3: "Permissões",
      feature3Desc: "Submeta seus pedidos de permissões de construção, ambientais, etc.",
      feature4: "Certificados",
      feature4Desc: "Baixe seus certificados de aprovação e atestados oficiais",
      advantage1: "Disponível 24/7",
      advantage2: "Rastreamento em tempo real",
      advantage3: "Zero deslocamento",
      advantage4: "Prazos garantidos",
      advantage5: "Suporte multilíngue",
      advantage6: "100% seguro",
    },
    process: {
      badge: "Oportunidade de Investimento",
      title: "Invista na RDC, a ANAPI abre as portas para você",
      subtitle: "Uma plataforma multilíngue disponível em 6 idiomas para receber investidores de todo o mundo. Crie sua conta e um especialista em investimentos irá guiá-lo em todos os seus projetos.",
      step1: "Agricultura",
      step1Desc: "80 milhões de hectares de terras aráveis férteis",
      step2: "Mineração e Energia",
      step2Desc: "1º produtor mundial de cobalto, cobre, coltan",
      step3: "Infraestrutura",
      step3Desc: "Estradas, pontes, portos, aeroportos, telecomunicações",
      step4: "Indústrias",
      step4Desc: "Saúde, educação, construção, tecnologia",
      expert: "Um especialista dedicado acompanha você",
      expertDesc: "Desde o momento em que você cria sua conta, um especialista em investimentos da ANAPI é designado para guiá-lo em todos os seus procedimentos.",
      languages: "6 idiomas disponíveis",
      languagesDesc: "Français, English, Português, Español, 中文, العربية",
    },
    stats: {
      investments: "Investimentos facilitados",
      companies: "Empresas apoiadas",
      jobs: "Empregos criados",
      consumers: "Consumidores",
    },
    services: {
      badge: "Nossos Serviços",
      title: "Uma Plataforma Completa para Seus Investimentos",
      subtitle: "Da criação da conta até a obtenção da aprovação, apoiamos você em cada etapa.",
    },
    sectors: {
      badge: "Oportunidades",
      title: "Setores Estratégicos de Investimento",
      subtitle: "A RDC oferece oportunidades excepcionais em setores-chave.",
      explore: "Explorar todas as oportunidades",
    },
    advantages: {
      badge: "Código de Investimento",
      title: "Benefícios Excepcionais para Seus Investimentos",
      subtitle: "A RDC oferece um dos regimes fiscais mais atrativos da África.",
    },
    cta: {
      title: "Pronto para Investir na RDC?",
      subtitle: "Junte-se às centenas de empresas que confiaram na ANAPI.",
      button: "Criar minha conta grátis",
      contact: "Contate-nos",
    },
    footer: {
      description: "A Agência Nacional de Promoção de Investimentos é seu parceiro de confiança para investir com sucesso na RDC.",
      services: "Serviços",
      resources: "Recursos",
      legal: "Legal",
    },
  },
  es: {
    nav: {
      guichetUnique: "Ventanilla Única",
      services: "Servicios",
      sectors: "Sectores",
      map: "Mapa",
      advantages: "Ventajas",
      process: "Proceso",
      faq: "FAQ",
      login: "Iniciar sesión",
      appointment: "Cita",
    },
    hero: {
      badge: "Plataforma Oficial de Inversión en RDC",
      title1: "Ventanilla Única de",
      titleHighlight: "Autorizaciones, Licencias y Permisos",
      title2: "La Revolución Digital",
      subtitle: "Una sola plataforma para todos sus trámites administrativos. Obtenga sus autorizaciones, licencias y permisos en línea, de forma rápida y transparente.",
      cta1: "Iniciar mi solicitud",
      cta2: "Más información",
      stats1: "Solicitudes procesadas",
      stats2: "Días promedio",
      stats3: "Tasa de satisfacción",
    },
    guichet: {
      badge: "Ventanilla Única Digital",
      title: "Todos sus trámites administrativos en un solo lugar",
      subtitle: "La Ventanilla Única de Autorizaciones, Licencias y Permisos revoluciona sus interacciones con la administración congoleña.",
      feature1: "Autorizaciones",
      feature1Desc: "Obtenga todas las autorizaciones necesarias para su actividad comercial",
      feature2: "Licencias",
      feature2Desc: "Solicite y renueve sus licencias profesionales en línea",
      feature3: "Permisos",
      feature3Desc: "Presente sus solicitudes de permisos de construcción, ambientales, etc.",
      feature4: "Certificados",
      feature4Desc: "Descargue sus certificados de aprobación y certificaciones oficiales",
      advantage1: "Disponible 24/7",
      advantage2: "Seguimiento en tiempo real",
      advantage3: "Cero desplazamientos",
      advantage4: "Plazos garantizados",
      advantage5: "Soporte multilingüe",
      advantage6: "100% seguro",
    },
    process: {
      badge: "Oportunidad de Inversión",
      title: "Invierta en RDC, ANAPI le abre las puertas",
      subtitle: "Una plataforma multilingüe disponible en 6 idiomas para recibir inversores de todo el mundo. Cree su cuenta y un experto en inversiones lo guiará en todos sus proyectos.",
      step1: "Agricultura",
      step1Desc: "80 millones de hectáreas de tierras fértiles cultivables",
      step2: "Minería y Energía",
      step2Desc: "1er productor mundial de cobalto, cobre, coltán",
      step3: "Infraestructura",
      step3Desc: "Carreteras, puentes, puertos, aeropuertos, telecomunicaciones",
      step4: "Industrias",
      step4Desc: "Salud, educación, construcción, tecnología",
      expert: "Un experto dedicado lo acompaña",
      expertDesc: "Desde el momento en que crea su cuenta, un experto en inversiones de ANAPI es asignado para guiarlo en todos sus trámites.",
      languages: "6 idiomas disponibles",
      languagesDesc: "Français, English, Português, Español, 中文, العربية",
    },
    stats: {
      investments: "Inversiones facilitadas",
      companies: "Empresas apoyadas",
      jobs: "Empleos creados",
      consumers: "Consumidores",
    },
    services: {
      badge: "Nuestros Servicios",
      title: "Una Plataforma Completa para Sus Inversiones",
      subtitle: "Desde la creación de cuenta hasta la obtención de su aprobación, lo apoyamos en cada paso.",
    },
    sectors: {
      badge: "Oportunidades",
      title: "Sectores Estratégicos de Inversión",
      subtitle: "La RDC ofrece oportunidades excepcionales en sectores clave.",
      explore: "Explorar todas las oportunidades",
    },
    advantages: {
      badge: "Código de Inversión",
      title: "Beneficios Excepcionales para Sus Inversiones",
      subtitle: "La RDC ofrece uno de los regímenes fiscales más atractivos de África.",
    },
    cta: {
      title: "¿Listo para Invertir en RDC?",
      subtitle: "Únase a cientos de empresas que han confiado en ANAPI.",
      button: "Crear mi cuenta gratis",
      contact: "Contáctenos",
    },
    footer: {
      description: "La Agencia Nacional de Promoción de Inversiones es su socio de confianza para invertir con éxito en la RDC.",
      services: "Servicios",
      resources: "Recursos",
      legal: "Legal",
    },
  },
  zh: {
    nav: {
      guichetUnique: "一站式服务",
      services: "服务",
      sectors: "行业",
      map: "地图",
      advantages: "优势",
      process: "流程",
      faq: "常见问题",
      login: "登录",
      appointment: "预约",
    },
    hero: {
      badge: "刚果民主共和国官方投资平台",
      title1: "授权、许可证和",
      titleHighlight: "许可证一站式服务",
      title2: "数字革命",
      subtitle: "一个平台满足所有行政程序。在线快速透明地获取您的授权、许可证和许可。",
      cta1: "开始我的申请",
      cta2: "了解更多",
      stats1: "已处理申请",
      stats2: "平均天数",
      stats3: "满意度",
    },
    guichet: {
      badge: "数字一站式服务",
      title: "所有行政程序集中一处",
      subtitle: "授权、许可证和许可一站式服务彻底改变您与刚果行政部门的互动方式。",
      feature1: "授权",
      feature1Desc: "获取您商业活动所需的所有授权",
      feature2: "许可证",
      feature2Desc: "在线申请和续签您的专业许可证",
      feature3: "许可",
      feature3Desc: "提交建筑、环境等许可申请",
      feature4: "证书",
      feature4Desc: "下载您的批准证书和官方证明",
      advantage1: "全天候服务",
      advantage2: "实时跟踪",
      advantage3: "无需出行",
      advantage4: "期限保证",
      advantage5: "多语言支持",
      advantage6: "100%安全",
    },
    process: {
      badge: "投资机会",
      title: "投资刚果民主共和国，ANAPI为您敞开大门",
      subtitle: "多语言平台提供6种语言服务，欢迎来自世界各地的投资者。创建您的账户，投资专家将全程指导您的所有项目。",
      step1: "农业",
      step1Desc: "8000万公顷肥沃耕地",
      step2: "矿业与能源",
      step2Desc: "全球最大的钴、铜、钶钽铁矿生产国",
      step3: "基础设施",
      step3Desc: "公路、桥梁、港口、机场、电信",
      step4: "工业",
      step4Desc: "医疗、教育、建筑、科技",
      expert: "专属专家为您服务",
      expertDesc: "从您创建账户的那一刻起，ANAPI投资专家将被指派全程指导您的所有手续。",
      languages: "6种语言可选",
      languagesDesc: "Français, English, Português, Español, 中文, العربية",
    },
    stats: {
      investments: "促成投资",
      companies: "服务企业",
      jobs: "创造就业",
      consumers: "消费者",
    },
    services: {
      badge: "我们的服务",
      title: "完整的投资平台",
      subtitle: "从创建账户到获得批准，我们全程支持您。",
    },
    sectors: {
      badge: "机会",
      title: "战略投资领域",
      subtitle: "刚果民主共和国在关键领域提供卓越机会。",
      explore: "探索所有机会",
    },
    advantages: {
      badge: "投资法典",
      title: "投资的卓越优势",
      subtitle: "刚果民主共和国提供非洲最具吸引力的税收制度之一。",
    },
    cta: {
      title: "准备好投资刚果民主共和国了吗？",
      subtitle: "加入数百家信任ANAPI的企业。",
      button: "免费创建账户",
      contact: "联系我们",
    },
    footer: {
      description: "国家投资促进局是您在刚果民主共和国成功投资的可信赖伙伴。",
      services: "服务",
      resources: "资源",
      legal: "法律",
    },
  },
  ar: {
    nav: {
      guichetUnique: "الشباك الوحيد",
      services: "الخدمات",
      sectors: "القطاعات",
      map: "الخريطة",
      advantages: "المزايا",
      process: "العملية",
      faq: "الأسئلة الشائعة",
      login: "تسجيل الدخول",
      appointment: "موعد",
    },
    hero: {
      badge: "المنصة الرسمية للاستثمار في جمهورية الكونغو الديمقراطية",
      title1: "الشباك الوحيد لـ",
      titleHighlight: "التراخيص والتصاريح والأذونات",
      title2: "الثورة الرقمية",
      subtitle: "منصة واحدة لجميع إجراءاتك الإدارية. احصل على تراخيصك وتصاريحك عبر الإنترنت بسرعة وشفافية.",
      cta1: "بدء طلبي",
      cta2: "معرفة المزيد",
      stats1: "طلبات معالجة",
      stats2: "أيام في المتوسط",
      stats3: "معدل الرضا",
    },
    guichet: {
      badge: "الشباك الوحيد الرقمي",
      title: "جميع إجراءاتك الإدارية في مكان واحد",
      subtitle: "الشباك الوحيد للتراخيص والتصاريح يحدث ثورة في تعاملاتك مع الإدارة الكونغولية.",
      feature1: "الأذونات",
      feature1Desc: "احصل على جميع الأذونات اللازمة لنشاطك التجاري",
      feature2: "التراخيص",
      feature2Desc: "قدم وجدد تراخيصك المهنية عبر الإنترنت",
      feature3: "التصاريح",
      feature3Desc: "قدم طلبات تصاريح البناء والتصاريح البيئية وغيرها",
      feature4: "الشهادات",
      feature4Desc: "قم بتنزيل شهادات الموافقة والشهادات الرسمية",
      advantage1: "متاح على مدار الساعة",
      advantage2: "تتبع فوري",
      advantage3: "بدون تنقل",
      advantage4: "مواعيد مضمونة",
      advantage5: "دعم متعدد اللغات",
      advantage6: "آمن 100%",
    },
    process: {
      badge: "فرصة استثمارية",
      title: "استثمر في الكونغو الديمقراطية، ANAPI تفتح لك الأبواب",
      subtitle: "منصة متعددة اللغات متاحة بـ 6 لغات لاستقبال المستثمرين من جميع أنحاء العالم. أنشئ حسابك وسيرافقك خبير استثمار في جميع مشاريعك.",
      step1: "الزراعة",
      step1Desc: "80 مليون هكتار من الأراضي الزراعية الخصبة",
      step2: "التعدين والطاقة",
      step2Desc: "أول منتج عالمي للكوبالت والنحاس والكولتان",
      step3: "البنية التحتية",
      step3Desc: "طرق، جسور، موانئ، مطارات، اتصالات",
      step4: "الصناعات",
      step4Desc: "الصحة، التعليم، البناء، التكنولوجيا",
      expert: "خبير مخصص يرافقك",
      expertDesc: "من لحظة إنشاء حسابك، يتم تعيين خبير استثمار من ANAPI لإرشادك في جميع إجراءاتك.",
      languages: "6 لغات متاحة",
      languagesDesc: "Français, English, Português, Español, 中文, العربية",
    },
    stats: {
      investments: "استثمارات ميسرة",
      companies: "شركات مدعومة",
      jobs: "وظائف مُنشأة",
      consumers: "مستهلكون",
    },
    services: {
      badge: "خدماتنا",
      title: "منصة متكاملة لاستثماراتك",
      subtitle: "من إنشاء الحساب إلى الحصول على الموافقة، نحن ندعمك في كل خطوة.",
    },
    sectors: {
      badge: "الفرص",
      title: "قطاعات الاستثمار الاستراتيجية",
      subtitle: "توفر جمهورية الكونغو الديمقراطية فرصاً استثنائية في القطاعات الرئيسية.",
      explore: "استكشف جميع الفرص",
    },
    advantages: {
      badge: "قانون الاستثمار",
      title: "مزايا استثنائية لاستثماراتك",
      subtitle: "توفر جمهورية الكونغو الديمقراطية أحد أكثر الأنظمة الضريبية جاذبية في أفريقيا.",
    },
    cta: {
      title: "مستعد للاستثمار في جمهورية الكونغو الديمقراطية؟",
      subtitle: "انضم إلى مئات الشركات التي وثقت في ANAPI.",
      button: "أنشئ حسابي المجاني",
      contact: "اتصل بنا",
    },
    footer: {
      description: "الوكالة الوطنية لترويج الاستثمارات هي شريكك الموثوق للاستثمار الناجح في جمهورية الكونغو الديمقراطية.",
      services: "الخدمات",
      resources: "الموارد",
      legal: "قانوني",
    },
  },
};

// Get API base URL
const getApiBaseUrl = () => {
  if (typeof window !== 'undefined') {
    return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3502';
  }
  return 'http://localhost:3502';
};

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeFaq, setActiveFaq] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const [activeService, setActiveService] = useState(0);
  const [currentLang, setCurrentLang] = useState("fr");
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [mobileLangMenuOpen, setMobileLangMenuOpen] = useState(false);
  const langMenuRef = useRef(null);
  const mobileLangMenuRef = useRef(null);

  // Dynamic data from API
  const [apiStats, setApiStats] = useState(null);
  const [apiSectors, setApiSectors] = useState([]);
  const [loadingApiData, setLoadingApiData] = useState(true);

  const t = translations[currentLang] || translations.fr;

  // Load dynamic data from API
  useEffect(() => {
    const loadApiData = async () => {
      const apiBaseUrl = getApiBaseUrl();
      try {
        // Load dashboard stats and sectors in parallel
        const [statsRes, sectorsRes] = await Promise.all([
          fetch(`${apiBaseUrl}/api/v1/dashboard/public/stats`).catch(() => null),
          fetch(`${apiBaseUrl}/api/v1/referentiels/sectors?isActive=true`).catch(() => null),
        ]);

        if (statsRes?.ok) {
          const statsData = await statsRes.json();
          setApiStats(statsData.data || statsData);
        }

        if (sectorsRes?.ok) {
          const sectorsData = await sectorsRes.json();
          const sectors = sectorsData.data?.sectors || sectorsData.sectors || sectorsData.data || [];
          setApiSectors(Array.isArray(sectors) ? sectors : []);
        }
      } catch (error) {
        console.warn("Could not load API data for landing page:", error.message);
      } finally {
        setLoadingApiData(false);
      }
    };

    loadApiData();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    // Load saved language
    const saved = localStorage.getItem("anapi-landing-lang");
    if (saved && translations[saved]) {
      setCurrentLang(saved);
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (langMenuRef.current && !langMenuRef.current.contains(e.target)) {
        setLangMenuOpen(false);
      }
      if (mobileLangMenuRef.current && !mobileLangMenuRef.current.contains(e.target)) {
        setMobileLangMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const changeLanguage = (code) => {
    setCurrentLang(code);
    localStorage.setItem("anapi-landing-lang", code);
    setLangMenuOpen(false);
    setMobileLangMenuOpen(false);
  };

  // Statistiques clés - use API data if available, otherwise fallback to default values
  const stats = apiStats ? [
    {
      value: apiStats.totalInvestments >= 1000000000
        ? (apiStats.totalInvestments / 1000000000).toFixed(1)
        : apiStats.totalInvestments >= 1000000
          ? (apiStats.totalInvestments / 1000000).toFixed(0) + "M"
          : "2.5",
      suffix: apiStats.totalInvestments >= 1000000000 ? "Mrd $" : apiStats.totalInvestments >= 1000000 ? " $" : "Mrd $",
      label: t.stats.investments,
      icon: TrendingUp
    },
    { value: apiStats.totalInvestors?.toString() || "500", suffix: "+", label: t.stats.companies, icon: Building },
    {
      value: apiStats.totalJobs >= 1000
        ? (apiStats.totalJobs / 1000).toFixed(0)
        : apiStats.totalJobs?.toString() || "50",
      suffix: apiStats.totalJobs >= 1000 ? "K+" : "+",
      label: t.stats.jobs,
      icon: Users
    },
    { value: "100", suffix: "M", label: t.stats.consumers, icon: Globe },
  ] : [
    { value: "2.5", suffix: "Mrd $", label: t.stats.investments, icon: TrendingUp },
    { value: "500", suffix: "+", label: t.stats.companies, icon: Building },
    { value: "50", suffix: "K+", label: t.stats.jobs, icon: Users },
    { value: "100", suffix: "M", label: t.stats.consumers, icon: Globe },
  ];

  // Secteurs
  const sectors = [
    { name: "Agriculture", icon: TreePine, potential: "80M ha", color: "bg-green-500" },
    { name: "Mines", icon: Gem, potential: "#1 Cobalt", color: "bg-yellow-500" },
    { name: "Energie", icon: Sun, potential: "100 000 MW", color: "bg-blue-500" },
    { name: "Tourisme", icon: Palmtree, potential: "5 sites UNESCO", color: "bg-purple-500" },
    { name: "Infrastructure", icon: HardHat, potential: "$50Mrd", color: "bg-orange-500" },
    { name: "Tech & Digital", icon: Smartphone, potential: "100M users", color: "bg-cyan-500" },
  ];

  // Témoignages / Citations
  const testimonials = {
    president: {
      fr: {
        quote: "À l'ère du numérique, les investissements en RDC sont primordiaux pour un avenir meilleur. Avec l'ANAPI et le Guichet Unique, le Congo va se développer et devenir une destination de référence pour les investisseurs du monde entier. La révolution numérique est en marche !",
        name: "S.E. Félix-Antoine TSHISEKEDI TSHILOMBO",
        role: "Président de la République Démocratique du Congo",
      },
      en: {
        quote: "In the digital age, investments in DRC are essential for a better future. With ANAPI and the One-Stop Shop, Congo will develop and become a reference destination for investors worldwide. The digital revolution is underway!",
        name: "H.E. Félix-Antoine TSHISEKEDI TSHILOMBO",
        role: "President of the Democratic Republic of Congo",
      },
      pt: {
        quote: "Na era digital, os investimentos na RDC são fundamentais para um futuro melhor. Com a ANAPI e o Balcão Único, o Congo se desenvolverá e se tornará um destino de referência para investidores do mundo todo. A revolução digital está em andamento!",
        name: "S.E. Félix-Antoine TSHISEKEDI TSHILOMBO",
        role: "Presidente da República Democrática do Congo",
      },
      es: {
        quote: "En la era digital, las inversiones en RDC son primordiales para un futuro mejor. Con ANAPI y la Ventanilla Única, el Congo se desarrollará y se convertirá en un destino de referencia para inversores de todo el mundo. ¡La revolución digital está en marcha!",
        name: "S.E. Félix-Antoine TSHISEKEDI TSHILOMBO",
        role: "Presidente de la República Democrática del Congo",
      },
      zh: {
        quote: "在数字时代，对刚果民主共和国的投资对于美好未来至关重要。通过ANAPI和一站式服务，刚果将发展成为全球投资者的首选目的地。数字革命正在进行！",
        name: "费利克斯-安托万·齐塞克迪·奇隆博阁下",
        role: "刚果民主共和国总统",
      },
      ar: {
        quote: "في عصر الرقمنة، تعد الاستثمارات في جمهورية الكونغو الديمقراطية ضرورية لمستقبل أفضل. مع ANAPI والشباك الوحيد، ستتطور الكونغو وتصبح وجهة مرجعية للمستثمرين من جميع أنحاء العالم. الثورة الرقمية قد بدأت!",
        name: "فخامة فيليكس أنطوان تشيسكيدي تشيلومبو",
        role: "رئيس جمهورية الكونغو الديمقراطية",
      },
    },
    dg: {
      fr: {
        quote: "Notre vision est claire : faire de la RDC une destination incontournable pour les investisseurs du monde entier. Le Guichet Unique des Autorisations, Licences et Permis incarne cette ambition en offrant une expérience digitale sans précédent. Transparence, efficacité et excellence sont les piliers de notre transformation numérique. Ensemble, construisons l'avenir économique du Congo.",
        name: "Rachel PUNGU LUAMBA",
        role: "Chief Executive Officer - ANAPI",
      },
      en: {
        quote: "Our vision is clear: to make DRC an essential destination for investors worldwide. The One-Stop Shop for Authorizations, Licenses and Permits embodies this ambition by offering an unprecedented digital experience. Transparency, efficiency and excellence are the pillars of our digital transformation. Together, let's build Congo's economic future.",
        name: "Rachel PUNGU LUAMBA",
        role: "Chief Executive Officer - ANAPI",
      },
      pt: {
        quote: "Nossa visão é clara: tornar a RDC um destino essencial para investidores de todo o mundo. O Balcão Único de Autorizações, Licenças e Permissões incorpora essa ambição oferecendo uma experiência digital sem precedentes. Transparência, eficiência e excelência são os pilares da nossa transformação digital. Juntos, vamos construir o futuro econômico do Congo.",
        name: "Rachel PUNGU LUAMBA",
        role: "Chief Executive Officer - ANAPI",
      },
      es: {
        quote: "Nuestra visión es clara: hacer de la RDC un destino esencial para inversores de todo el mundo. La Ventanilla Única de Autorizaciones, Licencias y Permisos encarna esta ambición ofreciendo una experiencia digital sin precedentes. Transparencia, eficiencia y excelencia son los pilares de nuestra transformación digital. Juntos, construyamos el futuro económico del Congo.",
        name: "Rachel PUNGU LUAMBA",
        role: "Chief Executive Officer - ANAPI",
      },
      zh: {
        quote: "我们的愿景很明确：让刚果民主共和国成为全球投资者的必选目的地。授权、许可证和许可一站式服务体现了这一雄心，提供前所未有的数字体验。透明、效率和卓越是我们数字化转型的支柱。让我们共同建设刚果的经济未来。",
        name: "Rachel PUNGU LUAMBA",
        role: "Chief Executive Officer - ANAPI",
      },
      ar: {
        quote: "رؤيتنا واضحة: جعل جمهورية الكونغو الديمقراطية وجهة أساسية للمستثمرين من جميع أنحاء العالم. يجسد الشباك الوحيد للتراخيص والتصاريح والأذونات هذا الطموح من خلال تقديم تجربة رقمية غير مسبوقة. الشفافية والكفاءة والتميز هي ركائز تحولنا الرقمي. معاً، لنبني مستقبل الكونغو الاقتصادي.",
        name: "راشيل بونغو لوامبا",
        role: "Chief Executive Officer - ANAPI",
      },
    },
  };

  // FAQ
  const faqs = [
    {
      question: currentLang === "fr" ? "Qui peut bénéficier du Guichet Unique ?" : "Who can benefit from the One-Stop Shop?",
      answer: currentLang === "fr"
        ? "Tout investisseur, national ou étranger, souhaitant obtenir des autorisations, licences ou permis en RDC peut utiliser notre plateforme."
        : "Any investor, national or foreign, wishing to obtain authorizations, licenses or permits in DRC can use our platform.",
    },
    {
      question: currentLang === "fr" ? "Quels sont les délais de traitement ?" : "What are the processing times?",
      answer: currentLang === "fr"
        ? "Le délai moyen est de 7 à 30 jours selon le type de demande. Vous pouvez suivre l'avancement en temps réel via votre espace personnel."
        : "The average time is 7 to 30 days depending on the type of request. You can track progress in real-time via your personal space.",
    },
    {
      question: currentLang === "fr" ? "Quels documents puis-je obtenir en ligne ?" : "What documents can I obtain online?",
      answer: currentLang === "fr"
        ? "Autorisations commerciales, licences professionnelles, permis de construction, certificats environnementaux, agréments d'investissement et bien plus."
        : "Commercial authorizations, professional licenses, construction permits, environmental certificates, investment approvals and much more.",
    },
    {
      question: currentLang === "fr" ? "Le service est-il payant ?" : "Is the service paid?",
      answer: currentLang === "fr"
        ? "L'inscription et la soumission sont gratuites. Les frais dépendent du type d'autorisation demandée et sont clairement indiqués avant validation."
        : "Registration and submission are free. Fees depend on the type of authorization requested and are clearly indicated before validation.",
    },
  ];

  const currentLanguageData = LANGUAGES.find(l => l.code === currentLang) || LANGUAGES[0];

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "bg-white/95 backdrop-blur-md shadow-sm" : "bg-transparent"}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="w-12 h-12 bg-gradient-to-br from-[#1E3A5F] to-[#0A1628] rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-[#D4A853]/30 transition-shadow border border-[#D4A853]/20">
                <Globe className="w-7 h-7 text-[#D4A853]" />
              </div>
              <div>
                <span className={`text-xl font-bold ${scrolled ? "text-[#0A1628]" : "text-white"}`}>ANAPI</span>
                <p className={`text-xs ${scrolled ? "text-gray-500" : "text-[#D4A853]"}`}>
                  Agence Nationale pour la Promotion des Investissements
                </p>
              </div>
            </Link>

            {/* Desktop Menu */}
            <div className="hidden xl:flex items-center space-x-5">
              <a href="#guichet-unique" className={`font-semibold text-sm transition-colors whitespace-nowrap px-3 py-1.5 rounded-lg ${scrolled ? "text-[#D4A853] bg-[#D4A853]/10 hover:bg-[#D4A853]/20" : "text-[#D4A853] bg-white/10 hover:bg-white/20"}`}>
                {t.nav.guichetUnique}
              </a>
              {[
                { href: "#services", label: t.nav.services },
                { href: "#secteurs", label: t.nav.sectors },
                { href: "#carte", label: t.nav.map },
                { href: "#processus", label: t.nav.process },
                { href: "#faq", label: t.nav.faq },
              ].map((item) => (
                <a key={item.href} href={item.href} className={`font-medium text-sm transition-colors whitespace-nowrap ${scrolled ? "text-gray-600 hover:text-[#D4A853]" : "text-white/90 hover:text-[#D4A853]"}`}>
                  {item.label}
                </a>
              ))}
            </div>

            {/* Right side: Language + CTA */}
            <div className="hidden xl:flex items-center space-x-4">
              {/* Language Selector */}
              <div className="relative" ref={langMenuRef}>
                <button
                  onClick={() => setLangMenuOpen(!langMenuOpen)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${scrolled ? "hover:bg-gray-100 text-gray-700" : "hover:bg-white/10 text-white"}`}
                >
                  <img src={currentLanguageData.flag} alt="" className="w-5 h-4 rounded-sm object-cover" onError={(e) => e.target.style.display = 'none'} />
                  <span className="text-sm font-medium uppercase">{currentLang}</span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${langMenuOpen ? "rotate-180" : ""}`} />
                </button>

                {langMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50">
                    {LANGUAGES.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => changeLanguage(lang.code)}
                        className={`w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-100 transition-colors ${currentLang === lang.code ? "bg-blue-50 text-blue-600" : "text-gray-700"}`}
                      >
                        <img src={lang.flag} alt="" className="w-6 h-4 rounded-sm object-cover" onError={(e) => e.target.style.display = 'none'} />
                        <span className="flex-1 text-left font-medium">{lang.name}</span>
                        {currentLang === lang.code && <Check className="w-4 h-4" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <Link href="/login" className={`font-medium text-sm transition-colors whitespace-nowrap ${scrolled ? "text-[#0A1628] hover:text-[#D4A853]" : "text-white hover:text-[#D4A853]"}`}>
                {t.nav.login}
              </Link>
              <Link href="/login" className="px-5 py-2.5 bg-[#D4A853] text-[#0A1628] font-semibold rounded-xl hover:bg-[#E5B964] transition-all shadow-lg shadow-[#D4A853]/30 hover:shadow-xl hover:shadow-[#D4A853]/40 hover:-translate-y-0.5 whitespace-nowrap">
                {t.nav.appointment}
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <div className="xl:hidden flex items-center gap-2">
              {/* Mobile Language */}
              <div className="relative" ref={mobileLangMenuRef}>
                <button
                  onClick={() => setMobileLangMenuOpen(!mobileLangMenuOpen)}
                  className={`flex items-center gap-1.5 px-2 py-1.5 rounded-lg ${scrolled ? "hover:bg-gray-100" : "hover:bg-white/10"}`}
                >
                  <img src={currentLanguageData.flag} alt="" className="w-5 h-4 rounded-sm" onError={(e) => e.target.style.display = 'none'} />
                  <ChevronDown className={`w-3 h-3 ${scrolled ? "text-gray-600" : "text-white"}`} />
                </button>
                {mobileLangMenuOpen && (
                  <div className="absolute right-0 mt-2 w-40 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50">
                    {LANGUAGES.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => changeLanguage(lang.code)}
                        className={`w-full flex items-center gap-2 px-3 py-2 hover:bg-gray-100 ${currentLang === lang.code ? "bg-blue-50 text-blue-600" : "text-gray-700"}`}
                      >
                        <img src={lang.flag} alt="" className="w-5 h-4 rounded-sm" onError={(e) => e.target.style.display = 'none'} />
                        <span className="text-sm">{lang.name}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className={`p-2 rounded-lg ${scrolled ? "hover:bg-gray-100" : "hover:bg-white/10"}`}>
                {mobileMenuOpen ? <X className={`w-6 h-6 ${scrolled ? "text-[#0A1628]" : "text-white"}`} /> : <Menu className={`w-6 h-6 ${scrolled ? "text-[#0A1628]" : "text-white"}`} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="xl:hidden bg-[#0A1628] border-t border-[#1E3A5F] py-4 px-4 space-y-4 shadow-lg">
            <a href="#guichet-unique" onClick={() => setMobileMenuOpen(false)} className="block text-[#D4A853] font-semibold py-2 px-3 bg-[#D4A853]/10 rounded-lg">
              {t.nav.guichetUnique}
            </a>
            {[
              { href: "#services", label: t.nav.services },
              { href: "#secteurs", label: t.nav.sectors },
              { href: "#processus", label: t.nav.process },
              { href: "#faq", label: t.nav.faq },
            ].map((item) => (
              <a key={item.href} href={item.href} onClick={() => setMobileMenuOpen(false)} className="block text-white hover:text-[#D4A853] font-medium py-2">
                {item.label}
              </a>
            ))}
            <div className="pt-4 border-t border-[#1E3A5F] space-y-3">
              <Link href="/login" className="block text-center py-3 text-white font-medium border border-[#1E3A5F] rounded-lg hover:bg-[#1E3A5F]">
                {t.nav.login}
              </Link>
              <Link href="/login" className="block text-center py-3 bg-[#D4A853] text-[#0A1628] font-semibold rounded-lg hover:bg-[#E5B964]">
                {t.nav.appointment}
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section - Guichet Unique Focus */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0A1628] via-[#1E3A5F] to-[#0A1628]" />
        <div className="absolute inset-0 opacity-30">
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-gradient-to-br from-[#1E3A5F]/50 to-transparent blur-sm" />
        </div>
        <div className="absolute top-1/4 left-10 w-64 h-64 bg-[#D4A853]/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-[#1E3A5F]/30 rounded-full blur-3xl animate-pulse delay-1000" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center px-4 py-2 bg-[#1E3A5F]/50 backdrop-blur-sm border border-[#D4A853]/30 rounded-full text-sm font-medium text-white mb-8">
                <Sparkles className="w-4 h-4 mr-2 text-[#D4A853]" />
                {t.hero.badge}
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight">
                {t.hero.title1}
                <span className="block mt-2 bg-gradient-to-r from-[#D4A853] via-[#E5B964] to-[#D4A853] bg-clip-text text-transparent">
                  {t.hero.titleHighlight}
                </span>
                <span className="block mt-4 text-2xl sm:text-3xl lg:text-4xl text-white/80 font-normal">
                  {t.hero.title2}
                </span>
              </h1>

              <p className="mt-6 text-lg sm:text-xl text-gray-300 max-w-xl mx-auto lg:mx-0">
                {t.hero.subtitle}
              </p>

              <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link href="/login" className="inline-flex items-center justify-center px-8 py-4 bg-[#D4A853] text-[#0A1628] font-semibold rounded-xl hover:bg-[#E5B964] transition-all shadow-lg shadow-[#D4A853]/30 hover:shadow-xl group">
                  <FileSignature className="w-5 h-5 mr-2" />
                  {t.hero.cta1}
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
                <a href="#guichet-unique" className="inline-flex items-center justify-center px-8 py-4 bg-transparent border-2 border-white/30 text-white font-semibold rounded-xl hover:bg-white/10 transition-all group">
                  {t.hero.cta2}
                  <ChevronDown className="w-5 h-5 ml-2 group-hover:translate-y-1 transition-transform" />
                </a>
              </div>

              {/* Hero Stats */}
              <div className="mt-12 grid grid-cols-3 gap-6 max-w-md mx-auto lg:mx-0">
                <div className="text-center lg:text-left">
                  <p className="text-3xl lg:text-4xl font-bold text-[#D4A853]">10K+</p>
                  <p className="text-sm text-gray-400">{t.hero.stats1}</p>
                </div>
                <div className="text-center lg:text-left">
                  <p className="text-3xl lg:text-4xl font-bold text-[#D4A853]">7-30</p>
                  <p className="text-sm text-gray-400">{t.hero.stats2}</p>
                </div>
                <div className="text-center lg:text-left">
                  <p className="text-3xl lg:text-4xl font-bold text-[#D4A853]">98%</p>
                  <p className="text-sm text-gray-400">{t.hero.stats3}</p>
                </div>
              </div>
            </div>

            {/* Hero Visual - Document Types */}
            <div className="hidden lg:block relative">
              <div className="relative">
                <div className="bg-[#1E3A5F]/50 backdrop-blur-md border border-[#D4A853]/20 rounded-2xl p-8 shadow-2xl">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-gradient-to-br from-[#D4A853] to-[#B8924A] rounded-xl flex items-center justify-center">
                      <Layers className="w-6 h-6 text-[#0A1628]" />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold">{t.guichet.badge}</h3>
                      <p className="text-gray-400 text-sm">ANAPI - RDC</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { icon: FileSignature, label: t.guichet.feature1, color: "from-green-500 to-emerald-600" },
                      { icon: FileBadge, label: t.guichet.feature2, color: "from-blue-500 to-indigo-600" },
                      { icon: Stamp, label: t.guichet.feature3, color: "from-purple-500 to-violet-600" },
                      { icon: Award, label: t.guichet.feature4, color: "from-amber-500 to-orange-600" },
                    ].map((item, i) => (
                      <div key={i} className="bg-[#0A1628]/50 rounded-xl p-4 border border-[#1E3A5F] hover:border-[#D4A853]/30 transition-colors group cursor-pointer">
                        <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${item.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                          <item.icon className="w-5 h-5 text-white" />
                        </div>
                        <p className="text-white font-medium text-sm">{item.label}</p>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 pt-6 border-t border-[#1E3A5F]">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                        <span className="text-green-400 text-sm font-medium">{t.guichet.advantage1}</span>
                      </div>
                      <span className="text-[#D4A853] text-sm font-semibold">100% Online</span>
                    </div>
                  </div>
                </div>

                {/* Floating badges */}
                <div className="absolute -top-6 -right-6 bg-white rounded-xl p-4 shadow-2xl animate-bounce-slow">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <CircleCheck className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-[#0A1628] text-sm">{t.guichet.advantage4}</p>
                      <p className="text-gray-500 text-xs">7-30 {currentLang === "fr" ? "jours" : "days"}</p>
                    </div>
                  </div>
                </div>

                <div className="absolute -bottom-4 -left-6 bg-gradient-to-r from-[#D4A853] to-[#E5B964] rounded-xl p-4 shadow-xl">
                  <div className="flex items-center gap-2">
                    <Timer className="w-5 h-5 text-[#0A1628]" />
                    <p className="font-bold text-[#0A1628]">{t.guichet.advantage2}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <a href="#guichet-unique" className="flex flex-col items-center text-gray-400 hover:text-[#D4A853] transition-colors">
            <span className="text-sm mb-2">{currentLang === "fr" ? "Découvrir" : "Discover"}</span>
            <ChevronDown className="w-6 h-6" />
          </a>
        </div>
      </section>

      {/* Guichet Unique Section */}
      <section id="guichet-unique" className="py-24 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-[#D4A853]/20 text-[#0A1628] rounded-full text-sm font-medium mb-4">
              <Building2 className="w-4 h-4 mr-2 text-[#D4A853]" />
              {t.guichet.badge}
            </div>
            <h2 className="text-3xl lg:text-5xl font-bold text-[#0A1628] leading-tight">
              {t.guichet.title}
            </h2>
            <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
              {t.guichet.subtitle}
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {[
              { icon: FileSignature, title: t.guichet.feature1, desc: t.guichet.feature1Desc, color: "from-green-500 to-emerald-600" },
              { icon: FileBadge, title: t.guichet.feature2, desc: t.guichet.feature2Desc, color: "from-blue-500 to-indigo-600" },
              { icon: Stamp, title: t.guichet.feature3, desc: t.guichet.feature3Desc, color: "from-purple-500 to-violet-600" },
              { icon: Award, title: t.guichet.feature4, desc: t.guichet.feature4Desc, color: "from-amber-500 to-orange-600" },
            ].map((item, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl hover:border-[#D4A853]/30 transition-all group">
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg`}>
                  <item.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="font-bold text-[#0A1628] text-lg mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>

          {/* Advantages */}
          <div className="bg-gradient-to-br from-[#0A1628] to-[#1E3A5F] rounded-3xl p-8 lg:p-12">
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { icon: Clock, text: t.guichet.advantage1 },
                { icon: BarChart3, text: t.guichet.advantage2 },
                { icon: MapPin, text: t.guichet.advantage3 },
                { icon: Timer, text: t.guichet.advantage4 },
                { icon: Globe2, text: t.guichet.advantage5 },
                { icon: ShieldCheck, text: t.guichet.advantage6 },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-4 bg-[#1E3A5F]/50 rounded-xl p-4 border border-[#D4A853]/10">
                  <div className="w-10 h-10 bg-[#D4A853]/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <item.icon className="w-5 h-5 text-[#D4A853]" />
                  </div>
                  <span className="text-white font-medium">{item.text}</span>
                </div>
              ))}
            </div>

            <div className="mt-8 text-center">
              <Link href="/login" className="inline-flex items-center justify-center px-8 py-4 bg-[#D4A853] text-[#0A1628] font-semibold rounded-xl hover:bg-[#E5B964] transition-all shadow-xl hover:shadow-2xl group">
                {t.hero.cta1}
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Investment Opportunity Section */}
      <section id="processus" className="py-24 bg-gradient-to-br from-[#0A1628] via-[#1E3A5F] to-[#0A1628] relative overflow-hidden">
        {/* Background decorations */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#D4A853] rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#1E3A5F] rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left side - Content */}
            <div>
              <div className="inline-flex items-center px-4 py-2 bg-[#D4A853]/20 text-[#D4A853] rounded-full text-sm font-medium mb-6">
                <Globe2 className="w-4 h-4 mr-2" />
                {t.process.badge}
              </div>
              <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">{t.process.title}</h2>
              <p className="text-lg text-gray-300 mb-8">{t.process.subtitle}</p>

              {/* Investment sectors grid */}
              <div className="grid grid-cols-2 gap-4 mb-8">
                {[
                  { icon: TreePine, title: t.process.step1, desc: t.process.step1Desc, color: "from-green-500 to-green-600" },
                  { icon: Gem, title: t.process.step2, desc: t.process.step2Desc, color: "from-yellow-500 to-amber-600" },
                  { icon: HardHat, title: t.process.step3, desc: t.process.step3Desc, color: "from-orange-500 to-orange-600" },
                  { icon: Building2, title: t.process.step4, desc: t.process.step4Desc, color: "from-blue-500 to-blue-600" },
                ].map((item, i) => (
                  <div key={i} className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 hover:border-[#D4A853]/50 transition-all group">
                    <div className={`w-12 h-12 bg-gradient-to-br ${item.color} rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                      <item.icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-white font-semibold mb-1">{item.title}</h3>
                    <p className="text-gray-400 text-sm">{item.desc}</p>
                  </div>
                ))}
              </div>

              {/* Expert support highlight */}
              <div className="bg-gradient-to-r from-[#D4A853]/20 to-transparent rounded-xl p-5 border border-[#D4A853]/30 mb-6">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 bg-[#D4A853] rounded-xl flex items-center justify-center flex-shrink-0">
                    <Users className="w-7 h-7 text-[#0A1628]" />
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-lg mb-1">{t.process.expert}</h3>
                    <p className="text-gray-300 text-sm">{t.process.expertDesc}</p>
                  </div>
                </div>
              </div>

              {/* Languages available */}
              <div className="flex items-center gap-4 mb-8">
                <div className="flex -space-x-2">
                  {LANGUAGES.map((lang, i) => (
                    <img
                      key={lang.code}
                      src={lang.flag}
                      alt={lang.name}
                      className="w-8 h-6 rounded border-2 border-[#0A1628] object-cover"
                      style={{ zIndex: LANGUAGES.length - i }}
                      onError={(e) => e.target.style.display = 'none'}
                    />
                  ))}
                </div>
                <div>
                  <p className="text-[#D4A853] font-semibold">{t.process.languages}</p>
                  <p className="text-gray-400 text-xs">{t.process.languagesDesc}</p>
                </div>
              </div>

              {/* CTA Button */}
              <Link href="/register" className="inline-flex items-center px-8 py-4 bg-[#D4A853] text-[#0A1628] font-bold rounded-xl hover:bg-[#E5B964] transition-all shadow-xl hover:shadow-2xl group">
                {t.cta.button}
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {/* Right side - Image */}
            <div className="relative hidden lg:block">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                <img
                  src="/images/investment-drc.jpg"
                  alt="Investment in DRC"
                  className="w-full h-[600px] object-cover"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.parentElement.classList.add('bg-gradient-to-br', 'from-[#1E3A5F]', 'to-[#0A1628]');
                    e.target.parentElement.innerHTML = `
                      <div class="w-full h-[600px] flex items-center justify-center">
                        <div class="text-center p-8">
                          <div class="w-24 h-24 bg-[#D4A853]/20 rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg class="w-12 h-12 text-[#D4A853]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                          </div>
                          <h3 class="text-2xl font-bold text-white mb-2">République Démocratique du Congo</h3>
                          <p class="text-gray-400">Le coeur économique de l'Afrique</p>
                        </div>
                      </div>
                    `;
                  }}
                />
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A1628]/80 via-transparent to-transparent" />

                {/* Stats overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center">
                      <p className="text-3xl font-bold text-[#D4A853]">2.5M</p>
                      <p className="text-white text-sm">km² de territoire</p>
                    </div>
                    <div className="text-center">
                      <p className="text-3xl font-bold text-[#D4A853]">100M+</p>
                      <p className="text-white text-sm">consommateurs</p>
                    </div>
                    <div className="text-center">
                      <p className="text-3xl font-bold text-[#D4A853]">$24T</p>
                      <p className="text-white text-sm">ressources naturelles</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating badges */}
              <div className="absolute -top-4 -right-4 bg-[#D4A853] text-[#0A1628] px-4 py-2 rounded-full font-bold shadow-xl">
                #1 Cobalt mondial
              </div>
              <div className="absolute -bottom-4 -left-4 bg-white text-[#0A1628] px-4 py-2 rounded-full font-bold shadow-xl flex items-center gap-2">
                <Globe className="w-4 h-4" />
                6 langues
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mobile Investment Image - Only visible on mobile */}
      <section className="lg:hidden py-12 bg-[#0A1628]">
        <div className="max-w-md mx-auto px-4">
          <div className="relative rounded-2xl overflow-hidden shadow-xl">
            <img
              src="/images/investment-drc.jpg"
              alt="Investment in DRC"
              className="w-full h-64 object-cover"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 200'%3E%3Crect fill='%231E3A5F' width='400' height='200'/%3E%3Ctext x='200' y='100' text-anchor='middle' fill='%23D4A853' font-size='16'%3ERDC - Coeur de l'Afrique%3C/text%3E%3C/svg%3E";
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0A1628] via-transparent to-transparent" />
            <div className="absolute bottom-4 left-4 right-4 text-center">
              <p className="text-[#D4A853] font-bold">#1 Producteur mondial de Cobalt</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar - Keep existing */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center group cursor-default">
                  <div className="w-14 h-14 mx-auto mb-4 bg-gradient-to-br from-[#0A1628]/5 to-[#1E3A5F]/10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <stat.icon className="w-7 h-7 text-[#1E3A5F]" />
                  </div>
                  <p className="text-3xl lg:text-4xl font-bold text-[#0A1628]">
                    {stat.value}<span className="text-[#D4A853]">{stat.suffix}</span>
                  </p>
                  <p className="mt-1 text-gray-500">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section - President & DG */}
      <section className="py-24 bg-gradient-to-b from-white to-gray-50 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-0 w-96 h-96 bg-[#D4A853] rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#1E3A5F] rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-[#D4A853]/20 text-[#0A1628] rounded-full text-sm font-medium mb-4">
              <Star className="w-4 h-4 mr-2 text-[#D4A853]" />
              {currentLang === "fr" ? "Vision & Leadership" : currentLang === "en" ? "Vision & Leadership" : currentLang === "pt" ? "Visão e Liderança" : currentLang === "es" ? "Visión y Liderazgo" : currentLang === "zh" ? "愿景与领导" : "الرؤية والقيادة"}
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold text-[#0A1628]">
              {currentLang === "fr" ? "L'ANAPI à l'ère du Numérique" : currentLang === "en" ? "ANAPI in the Digital Era" : currentLang === "pt" ? "ANAPI na Era Digital" : currentLang === "es" ? "ANAPI en la Era Digital" : currentLang === "zh" ? "数字时代的ANAPI" : "ANAPI في العصر الرقمي"}
            </h2>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* President Quote */}
            <div className="bg-gradient-to-br from-[#0A1628] to-[#1E3A5F] rounded-3xl p-8 lg:p-10 relative overflow-hidden group hover:shadow-2xl transition-shadow">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#D4A853]/10 rounded-full blur-2xl" />
              <div className="absolute bottom-0 left-0 w-40 h-40 bg-[#D4A853]/5 rounded-full blur-3xl" />

              <div className="relative">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#D4A853] to-[#B8924A] flex items-center justify-center shadow-xl overflow-hidden">
                    <img
                      src="/images/president-tshisekedi.jpg"
                      alt="Président Tshisekedi"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.parentElement.innerHTML = '<span class="text-3xl font-bold text-[#0A1628]">FT</span>';
                      }}
                    />
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-lg">{testimonials.president[currentLang]?.name || testimonials.president.fr.name}</h3>
                    <p className="text-[#D4A853] text-sm">{testimonials.president[currentLang]?.role || testimonials.president.fr.role}</p>
                  </div>
                </div>

                <div className="relative">
                  <svg className="absolute -top-4 -left-2 w-12 h-12 text-[#D4A853]/20" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/>
                  </svg>
                  <p className="text-white/90 text-lg leading-relaxed italic pl-8">
                    "{testimonials.president[currentLang]?.quote || testimonials.president.fr.quote}"
                  </p>
                </div>

                <div className="mt-6 pt-6 border-t border-white/10 flex items-center gap-3">
                  <div className="flex -space-x-2">
                    <div className="w-8 h-8 rounded-full bg-[#D4A853] flex items-center justify-center">
                      <Sparkles className="w-4 h-4 text-[#0A1628]" />
                    </div>
                    <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
                      <Rocket className="w-4 h-4 text-white" />
                    </div>
                    <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
                      <Cpu className="w-4 h-4 text-white" />
                    </div>
                  </div>
                  <span className="text-white/60 text-sm">
                    {currentLang === "fr" ? "La révolution numérique" : "Digital Revolution"}
                  </span>
                </div>
              </div>
            </div>

            {/* DG ANAPI Quote */}
            <div className="bg-white rounded-3xl p-8 lg:p-10 border border-gray-100 shadow-lg relative overflow-hidden group hover:shadow-2xl hover:border-[#D4A853]/30 transition-all">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#D4A853]/5 rounded-full blur-2xl" />

              <div className="relative">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-[#1E3A5F] to-[#0A1628] flex items-center justify-center shadow-xl overflow-hidden flex-shrink-0">
                    <img
                      src="/images/dg-rachel-pungu.jpg"
                      alt="DG Rachel PUNGU LUAMBA"
                      className="w-full h-full object-cover object-top"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.parentElement.innerHTML = '<span class="text-2xl font-bold text-[#D4A853]">RP</span>';
                      }}
                    />
                  </div>
                  <div>
                    <h3 className="text-[#0A1628] font-bold text-lg">{testimonials.dg[currentLang]?.name || testimonials.dg.fr.name}</h3>
                    <p className="text-[#D4A853] text-sm font-medium">{testimonials.dg[currentLang]?.role || testimonials.dg.fr.role}</p>
                  </div>
                </div>

                <div className="relative">
                  <svg className="absolute -top-4 -left-2 w-12 h-12 text-[#D4A853]/20" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/>
                  </svg>
                  <p className="text-gray-700 text-lg leading-relaxed italic pl-8">
                    "{testimonials.dg[currentLang]?.quote || testimonials.dg.fr.quote}"
                  </p>
                </div>

                <div className="mt-6 pt-6 border-t border-gray-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 bg-gradient-to-br from-[#D4A853] to-[#B8924A] rounded-xl flex items-center justify-center">
                      <Globe className="w-5 h-5 text-[#0A1628]" />
                    </div>
                    <span className="text-gray-500 text-sm font-medium">ANAPI</span>
                  </div>
                  <div className="flex items-center gap-1">
                    {[1,2,3,4,5].map((star) => (
                      <Star key={star} className="w-4 h-4 text-[#D4A853] fill-[#D4A853]" />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Vision Banner */}
          <div className="mt-12 bg-gradient-to-r from-[#D4A853] to-[#E5B964] rounded-2xl p-8 text-center">
            <h3 className="text-2xl lg:text-3xl font-bold text-[#0A1628] mb-3">
              {currentLang === "fr" ? "Guichet Unique des Autorisations, Licences et Permis" : "One-Stop Shop for Authorizations, Licenses & Permits"}
            </h3>
            <p className="text-[#0A1628]/80 text-lg max-w-3xl mx-auto mb-6">
              {currentLang === "fr"
                ? "La révolution numérique au service de l'investissement en République Démocratique du Congo"
                : "The digital revolution serving investment in the Democratic Republic of Congo"}
            </p>
            <Link href="/login" className="inline-flex items-center px-8 py-4 bg-[#0A1628] text-white font-semibold rounded-xl hover:bg-[#1E3A5F] transition-all shadow-lg hover:shadow-xl group">
              {t.hero.cta1}
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* Sectors Section */}
      <section id="secteurs" className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-[#0A1628]/10 text-[#0A1628] rounded-full text-sm font-medium mb-4">
              <Globe2 className="w-4 h-4 mr-2" />
              {t.sectors.badge}
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold text-[#0A1628]">{t.sectors.title}</h2>
            <p className="mt-4 text-lg text-gray-600">{t.sectors.subtitle}</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {sectors.map((sector, index) => (
              <Link key={index} href="/investir" className="group bg-white rounded-xl p-6 text-center shadow-sm border border-gray-100 hover:shadow-xl hover:border-[#D4A853]/50 hover:-translate-y-2 transition-all duration-300">
                <div className="w-16 h-16 bg-gradient-to-br from-[#1E3A5F] to-[#0A1628] rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <sector.icon className="w-8 h-8 text-[#D4A853]" />
                </div>
                <h3 className="font-semibold text-[#0A1628] mb-1">{sector.name}</h3>
                <p className="text-sm text-[#D4A853] font-medium">{sector.potential}</p>
              </Link>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/investir" className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-[#0A1628] to-[#1E3A5F] text-white font-semibold rounded-xl hover:from-[#1E3A5F] hover:to-[#0A1628] transition-all shadow-lg hover:shadow-xl group">
              {t.sectors.explore}
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section id="carte" className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-flex items-center px-4 py-2 bg-[#0A1628]/10 text-[#0A1628] rounded-full text-sm font-medium mb-4">
              <Map className="w-4 h-4 mr-2" />
              {currentLang === "fr" ? "Carte Interactive" : "Interactive Map"}
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold text-[#0A1628]">
              {currentLang === "fr" ? "Explorez les Opportunités par Province" : "Explore Opportunities by Province"}
            </h2>
          </div>
          <DRCMapPublic />
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-[#0A1628]/10 text-[#0A1628] rounded-full text-sm font-medium mb-4">
              <GraduationCap className="w-4 h-4 mr-2" />
              FAQ
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold text-[#0A1628]">
              {currentLang === "fr" ? "Questions Fréquentes" : "Frequently Asked Questions"}
            </h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:border-[#D4A853]/50 transition-colors">
                <button onClick={() => setActiveFaq(activeFaq === index ? null : index)} className="w-full flex items-center justify-between p-6 text-left">
                  <span className="font-semibold text-[#0A1628] pr-8">{faq.question}</span>
                  <ChevronDown className={`w-5 h-5 text-[#D4A853] flex-shrink-0 transition-transform ${activeFaq === index ? "rotate-180" : ""}`} />
                </button>
                {activeFaq === index && (
                  <div className="px-6 pb-6">
                    <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-[#0A1628] to-[#1E3A5F] relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRoLTJ2LTRoMnYyaDR2Mmgtdi00aC0ydjRoLTJ2LTJoLTR2NGgydjJoNHYtMmgyem0wLTMwdi0yaC0ydjJoLTR2Mmg0djRoMnYtNGgydi0yaC0yem0tMjQgMjhoMnYtNGgydi0ySDEydjJoLTJ2NGgydi0yaDJ6bTItMjRoMnYtMmgydi0yaC0ydi0yaC0ydjJoLTJ2Mmgydjh6Ii8+PC9nPjwvZz48L3N2Zz4=')]" />
        </div>

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-5xl font-bold text-white mb-6">{t.cta.title}</h2>
          <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">{t.cta.subtitle}</p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/login" className="inline-flex items-center justify-center px-8 py-4 bg-[#D4A853] text-[#0A1628] font-semibold rounded-xl hover:bg-[#E5B964] transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1 group">
              {t.cta.button}
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
            <a href="#contact" className="inline-flex items-center justify-center px-8 py-4 bg-transparent backdrop-blur-sm text-white font-semibold rounded-xl border-2 border-white/30 hover:bg-white/10 transition-all">
              <Phone className="w-5 h-5 mr-2" />
              {t.cta.contact}
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0A1628] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
            <div className="lg:col-span-2">
              <Link href="/" className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-[#1E3A5F] to-[#0A1628] rounded-xl flex items-center justify-center border border-[#D4A853]/30">
                  <Globe className="w-7 h-7 text-[#D4A853]" />
                </div>
                <div>
                  <span className="text-xl font-bold">ANAPI</span>
                  <p className="text-xs text-[#D4A853]">Agence Nationale pour la Promotion des Investissements</p>
                </div>
              </Link>
              <p className="text-gray-400 mb-6 max-w-sm">{t.footer.description}</p>
            </div>

            <div>
              <h4 className="font-semibold mb-4 text-[#D4A853]">{t.footer.services}</h4>
              <ul className="space-y-3 text-gray-400">
                <li><a href="#" className="hover:text-[#D4A853] transition-colors">{t.nav.guichetUnique}</a></li>
                <li><a href="#" className="hover:text-[#D4A853] transition-colors">{currentLang === "fr" ? "Agréments" : "Approvals"}</a></li>
                <li><a href="#" className="hover:text-[#D4A853] transition-colors">{currentLang === "fr" ? "Climat des Affaires" : "Business Climate"}</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4 text-[#D4A853]">Contact</h4>
              <ul className="space-y-3 text-gray-400">
                <li className="flex items-center gap-2"><Phone className="w-4 h-4" /> +243 999 925 026</li>
                <li className="flex items-center gap-2"><Mail className="w-4 h-4" /> contact@anapi.cd</li>
                <li className="flex items-center gap-2"><MapPin className="w-4 h-4" /> Kinshasa, Gombe - RDC</li>
              </ul>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-[#1E3A5F]">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-gray-400 text-sm text-center md:text-left">
                &copy; {new Date().getFullYear()} ANAPI - Agence Nationale pour la Promotion des Investissements
              </p>
              <p className="text-[#D4A853] text-sm">République Démocratique du Congo</p>
            </div>
          </div>
        </div>
      </footer>

      <style jsx>{`
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .animate-bounce-slow {
          animation: bounce-slow 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
