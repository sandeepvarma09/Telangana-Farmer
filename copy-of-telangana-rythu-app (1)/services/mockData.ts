

import { WeatherInfo, MyCropAlertData, AiTipData, MandiRate, CropGuideItem, CropSeason, CivicIssue, IssueCategory, IssueStatus, CivicIssueComment, Language } from '../types';
import { SunIcon, RainIcon, PartlyCloudyIcon, TrendingUpIcon } from '../components/icons/CoreIcons';
import { PLACEHOLDER_IMAGE_URL_CROPS, PLACEHOLDER_IMAGE_URL_ISSUES } from '../constants';
import { v4 as uuidv4 } from 'uuid';
import { translations } from '../translations';

type Translator = (key: string, ...args: (string | number)[]) => string;

export const getMockWeather = (t: Translator): WeatherInfo => ({
  temperature: 32,
  condition: t('sunny'),
  icon: SunIcon,
  forecast: [
    { day: t('today'), temp: '32', icon: SunIcon },
    { day: t('tomorrow'), temp: '30', icon: PartlyCloudyIcon },
    { day: t('dayAfterTomorrow'), temp: '28', icon: RainIcon },
  ],
});

export const getMockMyCropAlert = (t: Translator): MyCropAlertData => ({
  cropName: t('cotton'), // This key will be translated
  price: '₹7,500', // Price can be language-neutral or formatted later
  mandi: t('nizamabadMarket'), // This key will be translated
  trend: 'up',
  trendIcon: TrendingUpIcon,
});

export const getMockAiTip = (t: Translator): AiTipData => ({
  id: 'tip1',
  title: t('tipCottonPinkBollwormTitle'), // Key for translation
  content: t('tipCottonPinkBollwormContent'), // Key for translation
});

// Helper to get number of days in a month
const getDaysInMonth = (year: number, month: number): number => {
  return new Date(year, month + 1, 0).getDate();
};

// Helper to generate a somewhat random price based on base, day, month, and year
const generateDynamicPrice = (basePrice: number, day: number, month: number, year: number, cropId: string): number => {
  let price = basePrice;
  // Fluctuate based on day
  price += Math.sin(day * Math.PI / 15) * (basePrice * 0.02); // Small daily fluctuation
  // Fluctuate based on month (e.g., some crops peak in certain seasons)
  price += Math.cos(month * Math.PI / 6) * (basePrice * 0.05 * (cropId === '1' ? 1.2 : 1)); // Seasonal trend, cotton ('1') more volatile
  // Slight year-on-year drift (e.g., inflation)
  price *= (1 + (year - new Date().getFullYear()) * 0.01);
  // Add some randomness
  price += (Math.random() - 0.5) * (basePrice * 0.01);
  return Math.max(500, Math.round(price / 10) * 10); // Ensure positive and round to nearest 10
};


export const getMockMandiRates = (t: Translator, year: number, month: number): MandiRate[] => {
  const cropBases = [
    { id: '1', basePrice: 7500, cropKey: 'cotton', telugu: 'పత్తి', hindi: 'कपास', marketKey: 'nizamabadMarket', teluguMarket: 'నిజామాబాద్ మార్కెట్', hindiMarket: 'निजामाबाद बाजार', category: 'other' as const, isUserCrop: true },
    { id: '2', basePrice: 2100, cropKey: 'paddy', telugu: 'వరి', hindi: 'धान', marketKey: 'karimnagarMarket', teluguMarket: 'కరీంనగర్ మార్కెట్', hindiMarket: 'करीमनगर बाजार', category: 'grains' as const, isUserCrop: true },
    { id: '3', basePrice: 8800, cropKey: 'turmeric', telugu: 'పసుపు', hindi: 'हल्दी', marketKey: 'nizamabadMarket', teluguMarket: 'నిజామాబాద్ మార్కెట్', hindiMarket: 'निजामाबाद बाजार', category: 'other' as const },
    { id: '4', basePrice: 1900, cropKey: 'maize', telugu: 'మొక్కజొన్న', hindi: 'मक्का', marketKey: 'warangalMarket', teluguMarket: 'వరంగల్ మార్కెట్', hindiMarket: 'వరంగల్ बाजार', category: 'grains' as const },
    { id: '5', basePrice: 6500, cropKey: 'redGram', telugu: 'కంది', hindi: 'अरहर', marketKey: 'adilabadMarket', teluguMarket: 'ఆదిలాబాద్ మార్కెట్', hindiMarket: 'आदिलाबाद बाजार', category: 'pulses' as const },
    { id: '6', basePrice: 1200, cropKey: 'tomato', telugu: 'టమాటా', hindi: 'टमाटर', marketKey: 'hyderabadMarket', teluguMarket: 'హైదరాబాద్ మార్కెట్', hindiMarket: 'हैदराबाद बाजार', category: 'vegetables' as const },
  ];

  const daysInSelectedMonth = getDaysInMonth(year, month);

  return cropBases.map(crop => {
    const trendData: { name: string; price: number }[] = [];
    for (let day = 1; day <= daysInSelectedMonth; day++) {
      trendData.push({
        name: String(day), // X-axis will show day number
        price: generateDynamicPrice(crop.basePrice, day, month, year, crop.id),
      });
    }
    const lastDayPrice = trendData.length > 0 ? trendData[trendData.length - 1].price : crop.basePrice;

    return {
      id: crop.id,
      cropName: t(crop.cropKey),
      teluguCropName: crop.telugu,
      hindiCropName: crop.hindi,
      price: `₹${lastDayPrice.toLocaleString('en-IN')}`, // Main price is last day's price
      marketName: t(crop.marketKey),
      teluguMarketName: crop.teluguMarket,
      hindiMarketName: crop.hindiMarket,
      category: crop.category,
      trendData: trendData,
      isUserCrop: crop.isUserCrop,
    };
  });
};


export const getMockCropGuideItems = (t: Translator): CropGuideItem[] => [
  {
    id: 'c1',
    name: t('cotton'), // English key
    teluguName: 'పత్తి',
    hindiName: 'कपास',
    image: 'https://th.bing.com/th/id/OIP.ZKN0o7iH-rNTnCJvigUKxQHaEO?w=305&h=180&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3',
    sowingPeriod: t('sowingJuneJuly'), // Key
    teluguSowingPeriod: 'జూన్ - జులై',
    hindiSowingPeriod: 'जून - जुलाई',
    duration: t('duration150days'), // Key
    teluguDuration: '150-180 రోజులు',
    hindiDuration: '150-180 दिन',
    aiRating: t('aiHighlySuitable'), // Key
    teluguAiRating: 'మీ నేలకు చాలా అనుకూలం',
    hindiAiRating: 'आपकी मिट्टी के लिए अत्यधिक उपयुक्त',
    season: CropSeason.Kharif,
  },
  {
    id: 'c2',
    name: t('paddy'),
    teluguName: 'వరి',
    hindiName: 'धान',
    image: 'https://th.bing.com/th/id/OIP.XtIahZ7KIEFRNN0d07ywtgHaE8?w=260&h=180&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3', // Original Kharif Paddy
    sowingPeriod: t('sowingJuneJuly'),
    teluguSowingPeriod: 'జూన్ - జులై',
    hindiSowingPeriod: 'जून - जुलाई',
    duration: t('duration120days'),
    teluguDuration: '120-130 రోజులు',
    hindiDuration: '120-130 दिन',
    aiRating: t('aiSuitable'),
    teluguAiRating: 'మీ నేలకు అనుకూలం',
    hindiAiRating: 'आपकी मिट्टी के लिए उपयुक्त',
    season: CropSeason.Kharif,
  },
  {
    id: 'c3',
    name: t('maize'),
    teluguName: 'మొక్కజొన్న',
    hindiName: 'मक्का',
    image: 'https://ts3.mm.bing.net/th?id=OIP.XA1qJgQ6ALmVZQ0xsLgveAHaFj&pid=15.1', // Original Kharif Maize
    sowingPeriod: t('sowingJuneJuly'),
    teluguSowingPeriod: 'జూన్ - జులై',
    hindiSowingPeriod: 'जून - जुलाई',
    duration: t('duration100days'),
    teluguDuration: '90-100 రోజులు',
    hindiDuration: '90-100 दिन',
    aiRating: t('aiSuitable'),
    teluguAiRating: 'మీ నేలకు అనుకూలం',
    hindiAiRating: 'आपकी मिट्टी के लिए उपयुक्त',
    season: CropSeason.Kharif,
  },
  {
    id: 'c4',
    name: t('redGram'),
    teluguName: 'కంది',
    hindiName: 'अरहर',
    image: 'https://th.bing.com/th/id/OIP.snbPz_1dJU72t4fP5VGnlQHaE8?w=224&h=180&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3',
    sowingPeriod: t('sowingJuneJuly'),
    teluguSowingPeriod: 'జూన్ - జులై',
    hindiSowingPeriod: 'जून - जुलाई',
    duration: t('duration150days'),
    teluguDuration: '150-180 రోజులు',
    hindiDuration: '150-180 दिन',
    aiRating: t('aiHighlySuitable'),
    teluguAiRating: 'మీ నేలకు చాలా అనుకూలం',
    hindiAiRating: 'आपकी मिट्टी के लिए अत्यधिक उपयुक्त',
    season: CropSeason.Kharif,
  },
  {
    id: 'c5',
    name: t('soybean'),
    teluguName: 'సోయాబీన్',
    hindiName: 'सोयाबीन',
    image: 'https://th.bing.com/th/id/OIP.18PRtPA-0rI-eKc0Bv8lCAHaE8?w=225&h=186&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3',
    sowingPeriod: t('sowingJuneJuly'),
    teluguSowingPeriod: 'జూన్ - జులై',
    hindiSowingPeriod: 'जून - जुलाई',
    duration: t('duration100days'),
    teluguDuration: '90-100 రోజులు',
    hindiDuration: '90-100 दिन',
    aiRating: t('aiSuitable'),
    teluguAiRating: 'మీ నేలకు అనుకూలం',
    hindiAiRating: 'आपकी मिट्टी के लिए उपयुक्त',
    season: CropSeason.Kharif,
  },
  {
    id: 'c6',
    name: t('paddy') + ' (Rabi)',
    teluguName: 'వరి (యాసంగి)',
    hindiName: 'धान (रबी)',
    image: 'https://th.bing.com/th/id/OIP.XtIahZ7KIEFRNN0d07ywtgHaE8?w=260&h=180&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3', // Updated for Paddy (Rabi)
    sowingPeriod: t('sowingOctNov'),
    teluguSowingPeriod: 'అక్టోబర్ - నవంబర్',
    hindiSowingPeriod: 'अक्टूबर - नवंबर',
    duration: t('duration120days'),
    teluguDuration: '120-130 రోజులు',
    hindiDuration: '120-130 दिन',
    aiRating: t('aiSuitable'),
    teluguAiRating: 'మీ నేలకు అనుకూలం',
    hindiAiRating: 'आपकी मिट्टी के लिए उपयुक्त',
    season: CropSeason.Rabi,
  },
  {
    id: 'c7',
    name: t('maize') + ' (Rabi)',
    teluguName: 'మొక్కజొన్న (యాసంగి)',
    hindiName: 'मक्का (रबी)',
    image: 'https://ts3.mm.bing.net/th?id=OIP.XA1qJgQ6ALmVZQ0xsLgveAHaFj&pid=15.1', // Updated for Maize (Rabi)
    sowingPeriod: t('sowingOctNov'),
    teluguSowingPeriod: 'అక్టోబర్ - నవంబర్',
    hindiSowingPeriod: 'अक्टूबर - नवंबर',
    duration: t('duration100days'),
    teluguDuration: '90-100 రోజులు',
    hindiDuration: '90-100 दिन',
    aiRating: t('aiSuitable'),
    teluguAiRating: 'మీ నేలకు అనుకూలం',
    hindiAiRating: 'आपकी मिट्टी के लिए उपयुक्त',
    season: CropSeason.Rabi,
  },
   {
    id: 'c8',
    name: t('chilli') + ' (Rabi)', // Changed name to Chilli (Rabi)
    teluguName: 'మిర్చి (యాసంగి)',
    hindiName: 'मिर्च (रबी)',
    image: 'https://www.agrifarming.in/wp-content/uploads/2020/04/Comp2.jpg', // Updated for Chilli (Rabi)
    sowingPeriod: t('sowingOctNov'),
    teluguSowingPeriod: 'అక్టోబర్ - నవంబర్',
    hindiSowingPeriod: 'अक्टूबर - नवंबर',
    duration: t('duration150days'),
    teluguDuration: '150-180 రోజులు',
    hindiDuration: '150-180 दिन',
    aiRating: t('aiHighlySuitable'),
    teluguAiRating: 'మీ నేలకు చాలా అనుకూలం',
    hindiAiRating: 'आपकी मिट्टी के लिए अत्यधिक उपयुक्त',
    season: CropSeason.Rabi,
  },
];

const generateMockComments = (count: number, t: Translator): CivicIssueComment[] => {
  const comments: CivicIssueComment[] = [];
  const users = ["Ramesh", "Sita", "Farmer123", "ConcernedCitizen", "मोहन", "प्रिया"];
  const sampleComments = [
    t('lovableCommentSample1'),
    t('lovableCommentSample2'),
    t('lovableCommentSample3'),
    t('lovableCommentSample4'),
  ];
  for (let i = 0; i < count; i++) {
    comments.push({
      id: uuidv4(),
      userName: users[i % users.length],
      text: sampleComments[i % sampleComments.length],
      timestamp: new Date(Date.now() - Math.random() * 1000 * 60 * 60 * 24 * 5),
    });
  }
  return comments;
};

export const getMockCivicIssues = (t: Translator): CivicIssue[] => [
  {
    id: uuidv4(),
    title: t('mockIssueTitle1'),
    description: t('mockIssueDesc1'),
    category: IssueCategory.Roads,
    status: IssueStatus.Open,
    location: { text: t('mockIssueLoc1') },
    imageUrl: 'https://superiorasphaltlc.com/wp-content/uploads/2021/03/asphalt-damage-road-cracking.jpg', // Updated Pothole image
    submittedBy: "Rajesh K.",
    submittedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3),
    upvotes: 15,
    comments: generateMockComments(2, t),
  },
  {
    id: uuidv4(),
    title: t('mockIssueTitle2'),
    description: t('mockIssueDesc2'),
    category: IssueCategory.ElectricalInfrastructure,
    status: IssueStatus.InProgress,
    location: { text: t('mockIssueLoc2') },
    submittedBy: "Priya S.",
    submittedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7),
    upvotes: 8,
    comments: generateMockComments(1, t),
  },
  {
    id: uuidv4(),
    title: t('mockIssueTitle3'),
    description: t('mockIssueDesc3'),
    category: IssueCategory.Garbage,
    status: IssueStatus.Resolved,
    location: { text: t('mockIssueLoc3') },
    imageUrl: 'https://towardfreedom.org/wp-content/uploads/2018/05/trash.2-1024x683.jpg', // Updated
    submittedBy: "Amit G.",
    submittedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10),
    upvotes: 22,
    comments: generateMockComments(3, t),
  },
  {
    id: uuidv4(),
    title: t('mockIssueTitle4'),
    description: t('mockIssueDesc4'),
    category: IssueCategory.Drainage,
    status: IssueStatus.Open,
    location: { text: t('mockIssueLoc4') },
    imageUrl: 'https://i.ytimg.com/vi/j2rUpSe6VrU/maxresdefault.jpg?sqp=-oaymwEmCIAKENAF8quKqQMa8AEB-AH-CYAC0AWKAgwIABABGHIgYig3MA8=&rs=AOn4CLD-0_dvKgXyQXWBcEHnxR3D9UmNyA', // Updated
    submittedBy: "Citizen Voice",
    submittedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1),
    upvotes: 5,
    comments: [],
  },
];
// Added dummy market keys for translation to avoid breaking the app
translations[Language.Telugu]['karimnagarMarket'] = 'కరీంనగర్ మార్కెట్';
translations[Language.English]['karimnagarMarket'] = 'Karimnagar Market';
translations[Language.Hindi]['karimnagarMarket'] = 'करीमनगर बाजार';

translations[Language.Telugu]['warangalMarket'] = 'వరంగల్ మార్కెట్';
translations[Language.English]['warangalMarket'] = 'Warangal Market';
translations[Language.Hindi]['warangalMarket'] = 'వరంగల్ बाजार';

translations[Language.Telugu]['adilabadMarket'] = 'ఆదిలాబాద్ మార్కెట్';
translations[Language.English]['adilabadMarket'] = 'Adilabad Market';
translations[Language.Hindi]['adilabadMarket'] = 'आदिलाबाद बाजार';

translations[Language.Telugu]['hyderabadMarket'] = 'హైదరాబాద్ మార్కెట్';
translations[Language.English]['hyderabadMarket'] = 'Hyderabad Market';
translations[Language.Hindi]['hyderabadMarket'] = 'हैदराबाद बाजार';

translations[Language.Telugu]['tomato'] = 'టమాటా';
translations[Language.English]['tomato'] = 'Tomato';
translations[Language.Hindi]['tomato'] = 'टमाटर';
