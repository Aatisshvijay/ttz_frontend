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
  },
  {
    "topic": "Chapter 1 - Arjuna’s Dilemma",
    "sanskrit": "एतान्न हन्तुमिच्छामि घ्नतोऽपि मधुसूदन।\nअपि त्रैलोक्यराज्यस्य हेतोः किं नु महीकृते॥",
    "transliteration": "Etān na hantum icchāmi ghnato’pi Madhusūdana.\nApi trailokya-rājyasya hetoḥ kiṁ nu mahī-kṛite.",
    "meaning": "I do not wish to kill them, O Krishna, even if they attack me, not even for the sovereignty of all three worlds—how then for this earth?"
  },
  {
    "topic": "Chapter 2 - Sankhya Yoga",
    "sanskrit": "वासांसि जीर्णानि यथा विहाय नवानि गृह्णाति नरोऽपराणि।\nतथा शरीराणि विहाय जीर्णान्यन्यानि संयाति नवानि देही॥",
    "transliteration": "Vāsāṁsi jīrṇāni yathā vihāya navāni gṛiḥṇāti naro’parāṇi.\nTathā śarīrāṇi vihāya jīrṇāny anyāni saṁyāti navāni dehī.",
    "meaning": "As a person changes worn-out garments for new ones, so the soul leaves old bodies and accepts new ones."
  },
  {
    "topic": "Chapter 3 - Karma Yoga",
    "sanskrit": "लोकसंग्रहमेवापि संपश्यन्कर्तुमर्हसि।\nयदि ह्यहं न वर्तेयं जातु कर्मण्यतन्द्रितः॥",
    "transliteration": "Lokasaṅgraham evāpi saṁpaśyan kartum arhasi.\nYadi hyahaṁ na varteyaṁ jātu karmaṇy atandritaḥ.",
    "meaning": "You should act for the welfare of the world. If I (Krishna) ceased to act, others would follow my example and the world would perish."
  },
  {
    "topic": "Chapter 4 - Jnana Karma Sanyasa Yoga",
    "sanskrit": "तदेिद्ध प्रणिपातेन परिप्रश्नेन सेवया।\nउपदेक्ष्यन्ति ते ज्ञानं ज्ञानिनस्तत्त्वदर्शिनः॥",
    "transliteration": "Tad viddhi praṇipātena paripraśnena sevayā.\nUpadekṣhyanti te jñānaṁ jñāninas tattva-darśinaḥ.",
    "meaning": "Approach the wise with humility, sincere inquiry, and service. Those who know the truth will teach you."
  },
  {
    "topic": "Chapter 5 - Karma Sanyasa Yoga",
    "sanskrit": "न प्रहृष्येत्प्रियं प्राप्य नोद्विजेत्प्राप्य चाप्रियम्।\nस्थिरबुद्धिरसंमूढो ब्रह्मविद् ब्रह्मणि स्थितः॥",
    "transliteration": "Na prahṛiṣhyet priyaṁ prāpya nodvijet prāpya cāpriyam.\nSthira-buddhir asaṁmūḍho brahma-vid brahmaṇi sthitaḥ.",
    "meaning": "One who is wise neither rejoices on gaining something pleasant nor grieves on experiencing the unpleasant; such a person is firmly established in divine consciousness."
  },
  {
    "topic": "Chapter 6 - Dhyana Yoga",
    "sanskrit": "यत्नाद्यत्करमाणोऽपि योगी संशुद्धकिल्बिषः।\nअनेन ब्रह्मसंस्पर्शमत्यन्तं सुखमश्नुते॥",
    "transliteration": "Yatnād yatkaramāṇo’pi yogī saṁśuddha-kilbiṣaḥ.\nAnena brahma-saṁsparśam atyantaṁ sukham aśnute.",
    "meaning": "Through disciplined effort, the yogi becomes purified of all impurities and attains limitless bliss through union with the Divine."
  },
  {
    "topic": "Chapter 7 - Jnana Vijnana Yoga",
    "sanskrit": "मूढोऽयमाभिजानाति लोकः मां अजमव्ययम्।\nन हं प्रकटः सर्वस्य योगमायासमावृतः॥",
    "transliteration": "Mūḍho’yam nābhijānāti loko māṁ ajam avyayam.\nNa haṁ prakāśaḥ sarvasya yoga-māyā-samāvṛitaḥ.",
    "meaning": "Deluded by My divine power (Yogamaya), people do not recognize Me as the unborn and imperishable Supreme."
  },
  {
    "topic": "Chapter 8 - Akshara Brahma Yoga",
    "sanskrit": "यत्र काले त्वनावृत्तिमावृत्तिं चैव योगिनः।\nप्रयाता यान्ति तं कालं वक्ष्यामि भरतर्षभ॥",
    "transliteration": "Yatra kāle tvanāvṛittim āvṛittiṁ chaiva yoginaḥ.\nPrayātā yānti taṁ kālaṁ vakṣhyāmi Bharatarṣhabha.",
    "meaning": "I shall explain the time at which departing yogis never return, and the time at which they return again."
  },
  {
    "topic": "Chapter 9 - Raja Vidya Raja Guhya Yoga",
    "sanskrit": "सर्वभूतानि कौन्तेय प्रकृतिं यान्ति मामिकाम्।\nकल्पक्षये पुनस्तानि कल्पादौ विसृजाम्यहम्॥",
    "transliteration": "Sarva-bhūtāni Kaunteya prakṛitiṁ yānti māmikām.\nKalpa-kṣhaye punas tāni kalpādau visṛijāmyaham.",
    "meaning": "All beings merge into My nature at the end of a cosmic cycle. At the beginning of the next creation, I send them forth again."
  },
  {
    "topic": "Chapter 10 - Vibhuti Yoga",
    "sanskrit": "तेजोधृत्युद्भवश्चैव सत्त्वं तेजश्च भारत।\nमत्सम्भवं च ते विद्धि सर्वं संसिद्धिमिच्छताम्॥",
    "transliteration": "Tejo-dhṛity-udbhavaś chaiva sattvaṁ tejaś cha Bhārata.\nMat-sambhavam cha te viddhi sarvaṁ saṁsiddhim icchatām.",
    "meaning": "Strength, brilliance, firmness, and excellence—know them all to arise from Me, O Arjuna."
  },
  {
    "topic": "Chapter 11 - Vishwaroopa Darshana Yoga",
    "sanskrit": "कालेनाहं महतां प्रपुष्टो लोकान्समाहर्तुमिह प्रवृत्तः।\nऋतेऽपि त्वां न भविष्यन्ति सर्वे येऽवस्थिताः प्रत्यनीकेषु योधाः॥",
    "transliteration": "Kālenāhaṁ mahatāṁ prapuṣhṭo lokān samāhartum iha pravṛittaḥ.\nRite’pi tvāṁ na bhaviṣhyanti sarve ye’vasthitāḥ pratyanīkeṣu yodhāḥ.",
    "meaning": "Time I am, destroyer of worlds. All the warriors in these opposing armies will cease to exist, even without your participation."
  },
  {
    "topic": "Chapter 12 - Bhakti Yoga",
    "sanskrit": "अद्वेष्टा सर्वभूतानां मैत्रः करुण एव च।\nनिर्ममो निरहंकारः समदुःखसुखः क्षमी॥",
    "transliteration": "Adveṣhṭā sarva-bhūtānāṁ maitraḥ karuṇa eva cha.\nNirmamo nirahaṅkāraḥ sama-duḥkha-sukhaḥ kṣhamī.",
    "meaning": "One who hates none, is friendly and compassionate, free from ego and possessiveness, and remains steady in joy and sorrow—such a devotee is dear to Me."
  },
  {
    "topic": "Chapter 13 - Kshetra Kshetragya Vibhaga Yoga",
    "sanskrit": "ज्ञानं ज्ञेयं ज्ञानगम्यं हृदि सर्वस्य विष्ठितम्।\nसर्वभूतस्थमात्मानं सर्वभूतानि चात्मनि॥",
    "transliteration": "Jñānaṁ jñeyaṁ jñāna-gamyaṁ hṛidi sarvasya viṣhṭhitam.\nSarva-bhūta-stham ātmānaṁ sarva-bhūtāni chātmani.",
    "meaning": "The Supreme is knowledge, the object of knowledge, and the goal of knowledge—residing in the hearts of all beings."
  },
  {
    "topic": "Chapter 14 - Gunatraya Vibhaga Yoga",
    "sanskrit": "नान्यं गुणेभ्यः कर्तारं यदा द्रष्टानुपश्यति।\nगुणेभ्यश्च परं वेत्ति मद्भावं सोऽधिगच्छति॥",
    "transliteration": "Nānyaṁ guṇebhyaḥ kartāraṁ yadā draṣhṭānupaśhyati.\nGuṇebhyaś cha paraṁ vetti mad-bhāvaṁ so’dhigachchhati.",
    "meaning": "When the wise see no doer other than the gunas (modes), and know the Supreme beyond these modes, they attain My nature."
  },
  {
    "topic": "Chapter 15 - Purushottama Yoga",
    "sanskrit": "यस्मात्क्षरमतीतोऽहमक्षरादपि चोत्तमः।\nअतोऽस्मि लोके वेदे च प्रथितः पुरुषोत्तमः॥",
    "transliteration": "Yasmāt kṣharam atīto’ham akṣharād api chottamaḥ.\nAto’smi loke vede cha prathitaḥ Puruṣhottamaḥ.",
    "meaning": "Because I am beyond both the destructible and the imperishable, I am known in the world and in the Vedas as the Supreme Person."
  },
  {
    "topic": "Chapter 16 - Daivasura Sampad Vibhaga Yoga",
    "sanskrit": "अभयं सत्त्वसंशुद्धिर्ज्ञानयोगव्यवस्थितिः।\nदानं दमश्च यज्ञश्च स्वाध्यायस्तप आर्जवम्॥",
    "transliteration": "Abhayaṁ sattva-saṁśuddhir jñāna-yoga-vyavasthitiḥ.\nDānaṁ damaś cha yajñaś cha svādhyāyas tapa ārjavam.",
    "meaning": "Fearlessness, purity of mind, dedication to knowledge and yoga, charity, self-control, sacrifice, study of scriptures, and honesty—these are divine qualities."
  },
  {
    "topic": "Chapter 17 - Shraddhatraya Vibhaga Yoga",
    "sanskrit": "अन्नं ब्रह्मैव नाडीभ्यः प्राणा ब्रह्मैव सर्वतः।\nयज्ञः कर्म च ब्रह्मैव ब्रह्मैव तु सदा स्मर॥",
    "transliteration": "Annaṁ brahmaiva nāḍībhyaḥ prāṇā brahmaiva sarvataḥ.\nYajñaḥ karma cha brahmaiva brahmaiva tu sadā smara.",
    "meaning": "Food is Brahman, life-energy is Brahman, every action is truly Brahman—remember the Divine in all actions."
  },
  {
    "topic": "Chapter 18 - Moksha Sanyasa Yoga",
    "sanskrit": "नियतस्य तु संन्यासः कर्मणो नोपपद्यते।\nमोहात्तस्य परित्यागस्तामसः परिकीर्तितः॥",
    "transliteration": "Niyatasya tu saṁnyāsaḥ karmaṇo nopapadyate.\nMohāt tasya parityāgas tāmasaḥ parikīrtitaḥ.",
    "meaning": "Renouncing prescribed duties is improper. Abandoning action out of confusion or ignorance is considered dark (tamasic)."
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
      
      <div className="mb-12">
        <h2 className={`text-3xl font-bold text-center mb-8 ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}> Shloka of the Day
          <span className='mt-2 text-3xl italic'>  (From Bhagavad Gita)</span> 🧘
        </h2>
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