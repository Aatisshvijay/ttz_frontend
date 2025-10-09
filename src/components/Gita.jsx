import React from 'react';

// Daily Shlokas from Bhagavad Gita
const allShlokas = [
  {
    topic: "Chapter 1 - Arjuna’s Dilemma",
    sanskrit: "दृष्ट्वेमं स्वजनं कृष्ण युयुत्सुं समुपस्थितम्।",
    transliteration: "Drishtvemaṁ sva-janam krishna yuyutsum samupasthitam.",
    meaning: "Seeing my own kinsmen ready to fight, my limbs give way and my mind reels."
  },
  {
    topic: "Chapter 2 - Sankhya Yoga",
    sanskrit: "कर्मण्येवाधिकारस्ते मा फलेषु कदाचन।",
    transliteration: "Karmanye vadhikaraste ma phaleshu kadachana.",
    meaning: "You have the right to perform your duty, but not to the fruits of your actions."
  },
  {
    topic: "Chapter 3 - Karma Yoga",
    sanskrit: "नियतं कुरु कर्म त्वं कर्म ज्यायो ह्यकर्मणः।",
    transliteration: "Niyatam kuru karma tvam karma jyayo hyakarmanah.",
    meaning: "Perform your prescribed duty, for action is better than inaction."
  },
  {
    topic: "Chapter 4 - Jnana Karma Sanyasa Yoga",
    sanskrit: "यदा यदा हि धर्मस्य ग्लानिर्भवति भारत।",
    transliteration: "Yada yada hi dharmasya glanir bhavati bharata.",
    meaning: "Whenever righteousness declines and unrighteousness rises, I manifest Myself."
  },
  {
    topic: "Chapter 5 - Karma Sanyasa Yoga",
    sanskrit: "योगयुक्तो विशुद्धात्मा विजितात्मा जितेन्द्रियः।",
    transliteration: "Yoga-yukto vishuddhatma vijitatma jitendriyah.",
    meaning: "One who is disciplined in yoga, pure in mind, and master of the senses attains liberation."
  },
  {
    topic: "Chapter 6 - Dhyana Yoga",
    sanskrit: "उद्धरेदात्मनात्मानं नात्मानमवसादयेत्।",
    transliteration: "Uddhared atmanatmanam natmanam avasadayet.",
    meaning: "Let a person lift themselves by their own mind; let them not degrade themselves."
  },
  {
    topic: "Chapter 7 - Jnana Vijnana Yoga",
    sanskrit: "बहूनां जन्मनामन्ते ज्ञानवान्मां प्रपद्यते।",
    transliteration: "Bahūnām janmanām ante jñānavān māṁ prapadyate.",
    meaning: "After many births, the wise surrender to Me, knowing that I am the cause of all."
  },
  {
    topic: "Chapter 8 - Akshara Brahma Yoga",
    sanskrit: "अन्तकाले च मामेव स्मरन्मुक्त्वा कलेवरम्।",
    transliteration: "Anta-kāle ca māmeva smaran muktvā kalevaram.",
    meaning: "Whoever at the time of death remembers Me alone attains My state."
  },
  {
    topic: "Chapter 9 - Raja Vidya Raja Guhya Yoga",
    sanskrit: "अनन्याश्चिन्तयन्तो मां ये जनाः पर्युपासते।",
    transliteration: "Ananyāś cintayanto māṁ ye janāḥ paryupāsate.",
    meaning: "Those who worship Me with exclusive devotion, I provide what they need and protect what they have."
  },
  {
    topic: "Chapter 10 - Vibhuti Yoga",
    sanskrit: "अहमात्मा गुडाकेश सर्वभूताशयस्थितः।",
    transliteration: "Aham ātmā guḍākeśa sarvabhūtāśayasthitaḥ.",
    meaning: "I am the Self seated in the hearts of all beings."
  },
  {
    topic: "Chapter 11 - Vishwaroopa Darshana Yoga",
    sanskrit: "दिवि सूर्यसहस्रस्य भवेद्युगपदुत्थिता।",
    transliteration: "Divi sūrya-sahasrasya bhaved yugapad utthitā.",
    meaning: "If a thousand suns were to rise at once in the sky, their radiance would resemble that of My splendor."
  },
  {
    topic: "Chapter 12 - Bhakti Yoga",
    sanskrit: "मन्मना भव मद्भक्तो मद्याजी मां नमस्कुरु।",
    transliteration: "Man-manā bhava mad-bhakto madyājī māṁ namaskuru.",
    meaning: "Fix your mind on Me, be devoted to Me, sacrifice to Me, and bow down to Me."
  },
  {
    topic: "Chapter 13 - Kshetra Kshetragya Vibhaga Yoga",
    sanskrit: "समं सर्वेषु भूतेषु तिष्ठन्तं परमेश्वरम्।",
    transliteration: "Samaṁ sarveṣu bhūteṣu tiṣṭhantaṁ parameśvaram.",
    meaning: "The Supreme Lord is equally present in all beings, whether noble or humble."
  },
  {
    topic: "Chapter 14 - Gunatraya Vibhaga Yoga",
    sanskrit: "उदासीनवदासीनो गुणैर्यो न विचाल्यते।",
    transliteration: "Udāsīnavad āsīno guṇair yo na vicālyate.",
    meaning: "One who remains neutral and undisturbed by the modes of nature is established in transcendence."
  },
  {
    topic: "Chapter 15 - Purushottama Yoga",
    sanskrit: "ममैवांशो जीवलोके जीवभूतः सनातनः।",
    transliteration: "Mamaivāmśo jīvaloke jīvabhūtaḥ sanātanaḥ.",
    meaning: "The living beings in this world are My eternal fragmental parts."
  },
  {
    topic: "Chapter 16 - Daivasura Sampad Vibhaga Yoga",
    sanskrit: "दमो दमः तपः शौचं क्षान्तिरार्जवमेव च।",
    transliteration: "Damo damaḥ tapaḥ śaucaṁ kṣāntir ārjavameva ca.",
    meaning: "Self-control, austerity, purity, forgiveness, and honesty are divine qualities."
  },
  {
    topic: "Chapter 17 - Shraddhatraya Vibhaga Yoga",
    sanskrit: "श्रद्धामयोऽयं पुरुषो यो यच्छ्रद्धः स एव सः।",
    transliteration: "Śraddhāmayo’yaṁ puruṣo yo yacchraddhaḥ sa eva saḥ.",
    meaning: "A person is made of their faith; whatever one’s faith is, that they become."
  },
  {
    topic: "Chapter 18 - Moksha Sanyasa Yoga",
    sanskrit: "सर्वधर्मान्परित्यज्य मामेकं शरणं व्रज।",
    transliteration: "Sarva-dharmān parityajya mām ekaṁ śaraṇaṁ vraja.",
    meaning: "Abandon all duties and simply surrender unto Me alone."
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