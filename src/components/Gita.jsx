import React from 'react';

// Daily Shlokas from Bhagavad Gita
const allShlokas = [
  {
    "topic": "Chapter 1 - Arjuna’s Dilemma",
    "sanskrit": "दृष्ट्वेमं स्वजनं कृष्ण युयुत्सुं समुपस्थितम्।\nसीदन्ति मम गात्राणि मुखं च परिशुष्यति॥",
    "transliteration": "Drishtvemaṁ sva-janam krishna yuyutsum samupasthitam.\nSīdanti mama gātrāṇi mukhaṁ cha pariśhuṣyati.",
    "meaning": "Seeing my own kinsmen ready to fight, my limbs give way and my mind reels; my mouth is drying up."
  },
  {
    "topic": "Chapter 2 - Sankhya Yoga",
    "sanskrit": "कर्मण्येवाधिकारस्ते मा फलेषु कदाचन।\nमा कर्मफलहेतुर्भूर्मा ते सङ्गोऽस्त्वकर्मणि॥",
    "transliteration": "Karmanye vadhikaraste ma phaleshu kadachana.\nMa karma-phala-hetur bhur ma te sango 'stv akarmani.",
    "meaning": "You have the right to perform your duty, but not to the fruits of your actions. Never consider yourself the cause of the results of your activities, and never be attached to not performing your duty."
  },
  {
    "topic": "Chapter 3 - Karma Yoga",
    "sanskrit": "नियतं कुरु कर्म त्वं कर्म ज्यायो ह्यकर्मणः।\nशरीरयात्रापि च ते न प्रसिद्ध्येदकर्मणः॥",
    "transliteration": "Niyatam kuru karma tvam karma jyayo hyakarmanah.\nŚharīra-yātrāpi cha te na prasidhyed akarmaṇah.",
    "meaning": "Perform your prescribed duty, for action is better than inaction. Even the maintenance of your body would not be possible without work."
  },
  {
    "topic": "Chapter 4 - Jnana Karma Sanyasa Yoga",
    "sanskrit": "यदा यदा हि धर्मस्य ग्लानिर्भवति भारत।\nअभ्युत्थानमधर्मस्य तदात्मानं सृजाम्यहम्॥",
    "transliteration": "Yada yada hi dharmasya glanir bhavati bharata.\nAbhyutthānam adharmasya tadātmānaṁ sṛijāmyaham.",
    "meaning": "Whenever righteousness declines and unrighteousness rises, O descendant of Bharata (Arjuna), at that time I manifest Myself (take birth)."
  },
  {
    "topic": "Chapter 5 - Karma Sanyasa Yoga",
    "sanskrit": "योगयुक्तो विशुद्धात्मा विजितात्मा जितेन्द्रियः।\nसर्वभूतात्मभूतात्मा कुर्वन्नपि न लिप्यते॥",
    "transliteration": "Yoga-yukto vishuddhatma vijitatma jitendriyah.\nSarva-bhūtātma-bhūtātmā kurvannapi na lipyate.",
    "meaning": "One who is disciplined in yoga, pure in mind, and master of the senses, whose self is the Self of all beings (sees the Self in all), is not tainted even while performing actions."
  },
  {
    "topic": "Chapter 6 - Dhyana Yoga",
    "sanskrit": "उद्धरेदात्मनात्मानं नात्मानमवसादयेत्।\nआत्मैव ह्यात्मनो बन्धुरात्मैव रिपुरात्मनः॥",
    "transliteration": "Uddhared atmanatmanam natmanam avasadayet.\nĀtmaiva hyātmano bandhur ātmaiva ripurātmanaḥ.",
    "meaning": "Let a person lift themselves by their own mind; let them not degrade themselves. For the mind alone is the friend of the soul, and the mind alone is its enemy."
  },
  {
    "topic": "Chapter 7 - Jnana Vijnana Yoga",
    "sanskrit": "बहूनां जन्मनामन्ते ज्ञानवान्मां प्रपद्यते।\nवासुदेवः सर्वमिति स महात्मा सुदुर्लभः॥",
    "transliteration": "Bahūnām janmanām ante jñānavān māṁ prapadyate.\nVāsudevaḥ sarvam iti sa mahātmā sudurlabhaḥ.",
    "meaning": "After many births, the wise surrender to Me, knowing that I (Vasudeva) am the cause of all. Such a great soul is very rare."
  },
  {
    "topic": "Chapter 8 - Akshara Brahma Yoga",
    "sanskrit": "अन्तकाले च मामेव स्मरन्मुक्त्वा कलेवरम्।\nयः प्रयाति स मद्भावं याति नास्त्यत्र संशयः॥",
    "transliteration": "Anta-kāle ca māmeva smaran muktvā kalevaram.\nYaḥ prayāti sa mad-bhāvaṁ yāti nāstyatra saṁśayaḥ.",
    "meaning": "Whoever at the time of death remembers Me alone and leaves the body, he attains My state, of this there is no doubt."
  },
  {
    "topic": "Chapter 9 - Raja Vidya Raja Guhya Yoga",
    "sanskrit": "अनन्याश्चिन्तयन्तो मां ये जनाः पर्युपासते।\nतेषां नित्याभियुक्तानां योगक्षेमं वहाम्यहम्॥",
    "transliteration": "Ananyāś cintayanto māṁ ye janāḥ paryupāsate.\nTeṣhāṁ nityābhiyuktānāṁ yoga-kṣhemaṁ vahāmyaham.",
    "meaning": "Those who worship Me with exclusive devotion, meditating on My transcendental form—to them, who are constantly devoted to Me, I personally provide what they need and preserve what they have."
  },
  {
    "topic": "Chapter 10 - Vibhuti Yoga",
    "sanskrit": "अहमात्मा गुडाकेश सर्वभूताशयस्थितः।\nअहमादिश्च मध्यं च भूतानामन्त एव च॥",
    "transliteration": "Aham ātmā guḍākeśa sarvabhūtāśayasthitaḥ.\nAham ādiśh cha madhyaṁ cha bhūtānām anta eva cha.",
    "meaning": "I am the Self seated in the hearts of all beings, O Gudākeśa (Arjuna). I am the beginning, the middle, and also the end of all beings."
  },
  {
    "topic": "Chapter 11 - Vishwaroopa Darshana Yoga",
    "sanskrit": "दिवि सूर्यसहस्रस्य भवेद्युगपदुत्थिता।\nयदि भाः सदृशी सा स्याद्भासस्तस्य महात्मनः॥",
    "transliteration": "Divi sūrya-sahasrasya bhaved yugapad utthitā.\nYadi bhāḥ sadṛiśhī sā syād bhāsas tasya mahātmanaḥ.",
    "meaning": "If a thousand suns were to rise at once in the sky, their radiance would resemble that of the splendor of that Supreme Soul (My Universal Form)."
  },
  {
    "topic": "Chapter 12 - Bhakti Yoga",
    "sanskrit": "मन्मना भव मद्भक्तो मद्याजी मां नमस्कुरु।\nमामेवैष्यसि सत्यं ते प्रतिजाने प्रियोऽसि मे॥",
    "transliteration": "Man-manā bhava mad-bhakto madyājī māṁ namaskuru.\nMām evaiśhyasi satyaṁ te pratijāne priyo 'si me.",
    "meaning": "Fix your mind on Me, be devoted to Me, sacrifice to Me, and bow down to Me. You will certainly come to Me; this is My promise to you because you are dear to Me."
  },
  {
    "topic": "Chapter 13 - Kshetra Kshetragya Vibhaga Yoga",
    "sanskrit": "समं सर्वेषु भूतेषु तिष्ठन्तं परमेश्वरम्।\nविनश्यत्स्वविनश्यन्तं यः पश्यति स पश्यति॥",
    "transliteration": "Samaṁ sarveṣu bhūteṣu tiṣṭhantaṁ parameśvaram.\nVinaśhyatsvavinaśhyantaṁ yaḥ paśhyati sa paśhyati.",
    "meaning": "The Supreme Lord is equally present in all beings, whether noble or humble, and is the imperishable soul within the perishable body. One who sees this truly sees."
  },
  {
    "topic": "Chapter 14 - Gunatraya Vibhaga Yoga",
    "sanskrit": "उदासीनवदासीनो गुणैर्यो न विचाल्यते।\nगुणा वर्तन्त इत्येव योऽवतिष्ठति नेङ्गते॥",
    "transliteration": "Udāsīnavad āsīno guṇair yo na vicālyate.\nGuṇā vartanta ityeva yo 'vatiṣhṭhati neṅgate.",
    "meaning": "One who remains neutral and undisturbed by the modes of nature (goodness, passion, and ignorance), knowing that 'the modes alone are acting,' and stands firm without wavering, is established in transcendence."
  },
  {
    "topic": "Chapter 15 - Purushottama Yoga",
    "sanskrit": "ममैवांशो जीवलोके जीवभूतः सनातनः।\nमनःषष्ठानीन्द्रियाणि प्रकृतिस्थानि कर्षति॥",
    "transliteration": "Mamaivāmśo jīvaloke jīvabhūtaḥ sanātanaḥ.\nManaḥ-ṣhaṣhṭhānīndriyāṇi prakṛiti-sthāni karṣhati.",
    "meaning": "The living beings in this world are My eternal fragmental parts. Due to conditioned life, they are struggling with the six senses (mind and five sense organs), which are part of the material energy (Prakriti)."
  },
  {
    "topic": "Chapter 16 - Daivasura Sampad Vibhaga Yoga",
    "sanskrit": "दमो दमः तपः शौचं क्षान्तिरार्जवमेव च।\nअहिंसा सत्यमक्रोधस्त्यागः शान्तिरपैशुनम्॥",
    "transliteration": "Damo damaḥ tapaḥ śaucaṁ kṣāntir ārjavameva cha.\nAhiṁsā satyam akrodhas tyāgaḥ śhāntir apaiśhunam.",
    "meaning": "Self-control, austerity, purity, forgiveness, and honesty, as well as non-violence, truthfulness, absence of anger, renunciation, tranquility, and aversion to fault-finding—these are divine qualities."
  },
  {
    "topic": "Chapter 17 - Shraddhatraya Vibhaga Yoga",
    "sanskrit": "श्रद्धामयोऽयं पुरुषो यो यच्छ्रद्धः स एव सः।\nत्रिविधा भवति श्रद्धा देहिनां सा स्वभावजा॥",
    "transliteration": "Śraddhāmayo’yaṁ puruṣo yo yacchraddhaḥ sa eva saḥ.\nTri-vidhā bhavati śhraddhā dehināṁ sā svabhāva-jā.",
    "meaning": "A person is made of their faith; whatever one’s faith is, that they become. The faith of the embodied soul is of three kinds, born of one's own nature."
  },
  {
    "topic": "Chapter 18 - Moksha Sanyasa Yoga",
    "sanskrit": "सर्वधर्मान्परित्यज्य मामेकं शरणं व्रज।\nअहं त्वां सर्वपापेभ्यो मोक्षयिष्यामि मा शुचः॥",
    "transliteration": "Sarva-dharmān parityajya mām ekaṁ śaraṇaṁ vraja.\nAhaṁ tvāṁ sarva-pāpebhyo mokṣayiṣhyāmi mā śuchaḥ.",
    "meaning": "Abandon all duties and simply surrender unto Me alone. I shall liberate you from all sinful reactions; do not fear (do not worry)."
  }
];


const Gita = ({ isDarkMode }) => {

  // Calculate the current day's index to select a new shloka daily
  const today = new Date();
  const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / 1000 / 60 / 60 / 24);
  const selectedShlokaIndex = dayOfYear % allShlokas.length;

  const dailyShloka = allShlokas[selectedShlokaIndex];

  const shlokaContainer = `flex flex-col items-center justify-center p-6 text-center rounded-xl shadow-lg border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`;
  const shlokaText = `mt-2 text-xl italic font-serif ${isDarkMode ? 'text-gray-200' : 'text-gray-600'}`;
  // Updated shlokaMeaning to be bigger and bold
  const shlokaMeaning = `mt-4 text-xl font-bold ${isDarkMode ? 'text-white' : 'text-black'}`;
  
  return (
    <div className={`${isDarkMode ? 'bg-gray-900' : 'bg-gray-100'} py-8`}>
      {/* Words of Wisdom - Shlokas from Bhagavad Gita */}
      <div className="mb-12">
        <h2 className={`text-3xl font-bold text-center mb-6 ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>Shloka of the Day (From Bhagvad Gita)</h2>
        <div className="flex justify-center ">
          <div className={shlokaContainer} >
            <p className="text-lg font-semibold text-orange-600">{dailyShloka.topic}</p>
            <p className="mt-2 text-2xl">{dailyShloka.sanskrit}</p>
            <p className={shlokaText}>{dailyShloka.transliteration}</p>
            <p className={shlokaMeaning}>{dailyShloka.meaning}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Gita;