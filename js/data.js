/* All editable content lives here: leaders, members, research themes, publications, lectures,
 * books, news. Every text with three languages is written L(english, russian, uzbek).
 * Uzbek is written in the 1995 spelling (sh, ch, o', g') and converted automatically.
 */
(function () {
  'use strict';
  var L = window.L;

  /* ---------- Research themes ---------- */
  var THEMES = [
    {
      id: 'lensing',
      title: L('Gravitational lensing', 'Гравитационное линзирование', 'Gravitatsion linzalanish'),
      short: L(
        'How mass bends light: deflection angles in weak and strong fields, in vacuum and in plasma.',
        'Как масса искривляет свет: углы отклонения в слабом и сильном полях, в вакууме и в плазме.',
        "Massa yorug'likni qanday egadi: kuchsiz va kuchli maydonlarda, vakuumda va plazmada og'ish burchaklari."),
      body: [
        L('Light passing near a compact object follows a curved path. We compute deflection angles, image positions and magnification for black holes, wormholes and objects in modified gravity, using analytic methods and numerical integration of null geodesics.',
          'Свет, проходящий вблизи компактного объекта, движется по искривлённой траектории. Мы вычисляем углы отклонения, положения изображений и усиление для чёрных дыр, кротовых нор и объектов в модифицированной гравитации аналитическими методами и численным интегрированием нулевых геодезических.',
          "Kompakt obyekt yaqinidan o'tgan yorug'lik egri yo'l bo'ylab harakatlanadi. Qora tuynuklar, chuvalchang tuynuklar va modifikatsiyalangan gravitatsiyadagi obyektlar uchun og'ish burchaklari, tasvirlar o'rni va kuchayishni analitik usullar hamda nol geodezik chiziqlarni sonli integrallash orqali hisoblaymiz."),
        L('A recurring theme is the surrounding medium. A plasma changes the refractive index, so the deflection depends on the frequency of the light, and the lensing and shadow signatures shift with it.',
          'Постоянная тема — окружающая среда. Плазма меняет показатель преломления, поэтому отклонение зависит от частоты света, а вместе с ним меняются признаки линзирования и тени.',
          "Doimiy mavzu: atrofdagi muhit. Plazma sindirish ko'rsatkichini o'zgartiradi, shuning uchun og'ish yorug'lik chastotasiga bog'liq bo'ladi, linzalanish va soya belgilari ham shunga qarab siljiydi.")
      ],
      eq: [
        '<math display="block"><mover><mi>α</mi><mo>^</mo></mover><mo>≃</mo><mfrac><mrow><mn>4</mn><mi>G</mi><mi>M</mi></mrow><mrow><msup><mi>c</mi><mn>2</mn></msup><mi>b</mi></mrow></mfrac></math>'
      ],
      eqNote: L('Weak-field deflection angle of light with impact parameter b passing a mass M in vacuum.',
                'Угол отклонения света в слабом поле при прицельном параметре b вблизи массы M в вакууме.',
                "Vakuumda M massa yaqinidan b nishon parametri bilan o'tgan yorug'likning kuchsiz maydondagi og'ish burchagi."),
      kw: L('weak and strong lensing; Einstein rings; magnification; plasma; wormholes; retrolensing',
            'слабое и сильное линзирование; кольца Эйнштейна; усиление; плазма; кротовые норы; ретролинзирование',
            "kuchsiz va kuchli linzalanish; Eynshteyn halqalari; kuchayish; plazma; chuvalchang tuynuklar; retrolinzalanish")
    },
    {
      id: 'shadow',
      title: L('Black hole shadows', 'Тени чёрных дыр', 'Qora tuynuk soyalari'),
      short: L(
        'The dark silhouette of a black hole against its glow, and what its size and shape say about gravity.',
        'Тёмный силуэт чёрной дыры на фоне свечения и то, что его размер и форма говорят о гравитации.',
        "Qora tuynukning yorug' fondagi qora siluet va uning o'lchami hamda shakli gravitatsiya haqida nimani aytishi."),
      body: [
        L('The shadow is the image of the region from which light cannot escape. Its edge follows from the null geodesics that only just avoid capture. We compute shadows of Kerr and non-Kerr black holes, regular black holes and black holes in alternative theories of gravity.',
          'Тень — это изображение области, из которой свет не может уйти. Её край определяется нулевыми геодезическими, которые едва избегают захвата. Мы вычисляем тени чёрных дыр Керра и не-Керра, регулярных чёрных дыр и чёрных дыр в альтернативных теориях гравитации.',
          "Soya — yorug'lik chiqib keta olmaydigan sohaning tasviri. Uning chegarasi tutilishdan arang qutulgan nol geodezik chiziqlardan aniqlanadi. Kerr va Kerrdan farqli qora tuynuklar, regulyar qora tuynuklar hamda muqobil gravitatsiya nazariyalaridagi qora tuynuklar soyasini hisoblaymiz."),
        L('We then compare size and shape with Event Horizon Telescope images of M87* and Sgr A*, and compute intensity profiles for infalling gas, to see which theories the images allow.',
          'Затем мы сравниваем размер и форму с изображениями M87* и Sgr A*, полученными телескопом Event Horizon, и считаем профили интенсивности для падающего газа, чтобы понять, какие теории допускают эти изображения.',
          "So'ngra o'lcham va shaklni Event Horizon teleskopining M87* va Sgr A* tasvirlari bilan solishtiramiz hamda tushayotgan gaz uchun intensivlik profillarini hisoblab, qaysi nazariyalar bu tasvirlarga mos kelishini aniqlaymiz.")
      ],
      eq: [
        '<math display="block"><msub><mi>R</mi><mi>sh</mi></msub><mo>=</mo><mn>3</mn><msqrt><mn>3</mn></msqrt><mfrac><mrow><mi>G</mi><mi>M</mi></mrow><msup><mi>c</mi><mn>2</mn></msup></mfrac></math>',
        '<math display="block"><mi>α</mi><mo>=</mo><mo>−</mo><mfrac><mi>ξ</mi><mrow><mi>sin</mi><msub><mi>θ</mi><mn>0</mn></msub></mrow></mfrac><mo>,</mo><mspace width="1em"></mspace><mi>β</mi><mo>=</mo><mo>±</mo><msqrt><mrow><mi>η</mi><mo>+</mo><msup><mi>a</mi><mn>2</mn></msup><msup><mi>cos</mi><mn>2</mn></msup><msub><mi>θ</mi><mn>0</mn></msub><mo>−</mo><msup><mi>ξ</mi><mn>2</mn></msup><msup><mi>cot</mi><mn>2</mn></msup><msub><mi>θ</mi><mn>0</mn></msub></mrow></msqrt></math>'
      ],
      eqNote: L('Shadow radius of a Schwarzschild black hole, and the celestial coordinates of the Kerr shadow edge seen at inclination θ₀.',
                'Радиус тени чёрной дыры Шварцшильда и небесные координаты края тени чёрной дыры Керра при наклоне θ₀.',
                "Shvartsshild qora tuynugi soyasining radiusi va θ₀ qiyalikda ko'rinadigan Kerr soyasi chegarasining osmon koordinatalari."),
      kw: L('photon sphere; critical impact parameter; EHT constraints; accretion images; modified gravity; regular black holes',
            'фотонная сфера; критический прицельный параметр; ограничения EHT; изображения аккреции; модифицированная гравитация; регулярные чёрные дыры',
            "foton sfera; kritik nishon parametri; EHT cheklovlari; akkretsiya tasvirlari; modifikatsiyalangan gravitatsiya; regulyar qora tuynuklar")
    },
    {
      id: 'motion',
      title: L('Particle motion', 'Движение частиц', 'Zarralar harakati'),
      short: L(
        'Geodesics, circular orbits and charged particles near black holes in magnetic fields and plasma.',
        'Геодезические, круговые орбиты и заряженные частицы вблизи чёрных дыр в магнитных полях и плазме.',
        "Geodezik chiziqlar, doiraviy orbitalar va magnit maydon hamda plazmadagi qora tuynuklar yaqinidagi zaryadlangan zarralar."),
      body: [
        L('We study timelike and null geodesics, circular orbits and the innermost stable circular orbit (ISCO) through the effective potential, and how a particle’s energy and angular momentum decide whether it is captured, scattered or bound.',
          'Мы изучаем времениподобные и нулевые геодезические, круговые орбиты и наименьшую устойчивую круговую орбиту (ISCO) через эффективный потенциал, а также то, как энергия и момент импульса частицы определяют, будет ли она захвачена, рассеяна или связана.',
          "Vaqtsimon va nol geodezik chiziqlar, doiraviy orbitalar hamda eng ichki turg'un doiraviy orbita (ISCO)ni samarali potensial orqali, shuningdek zarra energiyasi va impuls momenti uning tutilishi, sochilishi yoki bog'lanishini qanday belgilashini o'rganamiz."),
        L('Charged particles in magnetised black hole environments, energy extraction by the Penrose process and quasi-periodic oscillations connect these orbits to what telescopes can observe.',
          'Заряженные частицы в намагниченном окружении чёрных дыр, извлечение энергии в процессе Пенроуза и квазипериодические колебания связывают эти орбиты с тем, что наблюдают телескопы.',
          "Magnitlangan qora tuynuk muhitidagi zaryadlangan zarralar, Penrouz jarayoni bilan energiya olish va kvazidavriy tebranishlar bu orbitalarni teleskoplar kuzatadigan hodisalar bilan bog'laydi.")
      ],
      eq: [
        '<math display="block"><msup><mrow><mo>(</mo><mfrac><mrow><mi>d</mi><mi>r</mi></mrow><mrow><mi>d</mi><mi>τ</mi></mrow></mfrac><mo>)</mo></mrow><mn>2</mn></msup><mo>=</mo><msup><mi>E</mi><mn>2</mn></msup><mo>−</mo><mrow><mo>(</mo><mn>1</mn><mo>−</mo><mfrac><mrow><mn>2</mn><mi>M</mi></mrow><mi>r</mi></mfrac><mo>)</mo></mrow><mrow><mo>(</mo><mn>1</mn><mo>+</mo><mfrac><msup><mi>L</mi><mn>2</mn></msup><msup><mi>r</mi><mn>2</mn></msup></mfrac><mo>)</mo></mrow></math>'
      ],
      eqNote: L('Radial equation for a massive particle in the Schwarzschild metric, with energy E and angular momentum L per unit mass (G = c = 1).',
                'Радиальное уравнение для массивной частицы в метрике Шварцшильда с энергией E и моментом импульса L на единицу массы (G = c = 1).',
                "Shvartsshild metrikasidagi massali zarra uchun radial tenglama; E va L — massa birligiga to'g'ri keladigan energiya va impuls momenti (G = c = 1)."),
      kw: L('geodesics; ISCO; effective potential; magnetised black holes; Penrose process; quasi-periodic oscillations',
            'геодезические; ISCO; эффективный потенциал; намагниченные чёрные дыры; процесс Пенроуза; квазипериодические колебания',
            "geodezik chiziqlar; ISCO; samarali potensial; magnitlangan qora tuynuklar; Penrouz jarayoni; kvazidavriy tebranishlar")
    },
    {
      id: 'spinning',
      title: L('Spinning particles', 'Частицы со спином', 'Spinli zarralar'),
      short: L(
        'Particles with intrinsic spin do not follow geodesics. We study the extra force and its effect on orbits.',
        'Частицы с собственным спином не следуют геодезическим. Мы изучаем дополнительную силу и её влияние на орбиты.',
        "O'z spiniga ega zarralar geodezik chiziq bo'ylab harakatlanmaydi. Qo'shimcha kuch va uning orbitalarga ta'sirini o'rganamiz."),
      body: [
        L('A spinning test body couples to spacetime curvature, so its path departs from a geodesic. The Mathisson–Papapetrou–Dixon equations describe this spin–curvature force, and a spin supplementary condition fixes which point counts as the body’s centre.',
          'Вращающееся пробное тело взаимодействует с кривизной пространства-времени, поэтому его траектория отклоняется от геодезической. Уравнения Матисона–Папапетру–Диксона описывают эту силу взаимодействия спина с кривизной, а дополнительное условие на спин определяет, какую точку считать центром тела.',
          "Aylanuvchi sinov jismi fazo-vaqt egriligi bilan ta'sirlashadi, shuning uchun uning yo'li geodezik chiziqdan chetga chiqadi. Matisson–Papapetru–Diksson tenglamalari bu spin va egrilik orasidagi kuchni tasvirlaydi, spinga qo'yilgan qo'shimcha shart esa jismning markazi sifatida qaysi nuqtani olishni belgilaydi."),
        L('We study how spin shifts circular orbits, the ISCO and the energy of a particle, and how gyroscopes and extreme-mass-ratio systems respond near rotating black holes.',
          'Мы изучаем, как спин смещает круговые орбиты, ISCO и энергию частицы, а также как гироскопы и системы с экстремальным отношением масс ведут себя вблизи вращающихся чёрных дыр.',
          "Spin doiraviy orbitalar, ISCO va zarra energiyasini qanday siljitishini hamda giroskoplar va o'ta katta massa nisbatli sistemalar aylanuvchi qora tuynuklar yaqinida o'zini qanday tutishini o'rganamiz.")
      ],
      eq: [
        '<math display="block"><mfrac><mrow><mi>D</mi><msup><mi>p</mi><mi>μ</mi></msup></mrow><mrow><mi>d</mi><mi>τ</mi></mrow></mfrac><mo>=</mo><mo>−</mo><mfrac><mn>1</mn><mn>2</mn></mfrac><msubsup><mi>R</mi><mrow><mi>ν</mi><mi>ρ</mi><mi>σ</mi></mrow><mi>μ</mi></msubsup><msup><mi>u</mi><mi>ν</mi></msup><msup><mi>S</mi><mrow><mi>ρ</mi><mi>σ</mi></mrow></msup><mo>,</mo><mspace width="1em"></mspace><mfrac><mrow><mi>D</mi><msup><mi>S</mi><mrow><mi>μ</mi><mi>ν</mi></mrow></msup></mrow><mrow><mi>d</mi><mi>τ</mi></mrow></mfrac><mo>=</mo><msup><mi>p</mi><mi>μ</mi></msup><msup><mi>u</mi><mi>ν</mi></msup><mo>−</mo><msup><mi>p</mi><mi>ν</mi></msup><msup><mi>u</mi><mi>μ</mi></msup></math>'
      ],
      eqNote: L('Mathisson–Papapetrou–Dixon equations for momentum p, four-velocity u and spin tensor S.',
                'Уравнения Матисона–Папапетру–Диксона для импульса p, четырёхскорости u и тензора спина S.',
                "Impuls p, to'rt tezlik u va spin tenzori S uchun Matisson–Papapetru–Diksson tenglamalari."),
      kw: L('MPD equations; spin supplementary condition; spin–curvature force; gyroscopes; extreme-mass-ratio inspirals',
            'уравнения МПД; дополнительное условие на спин; сила спин–кривизна; гироскопы; спирали с экстремальным отношением масс',
            "MPD tenglamalari; spinga qo'shimcha shart; spin–egrilik kuchi; giroskoplar; o'ta katta massa nisbatli yaqinlashishlar")
    },
    {
      id: 'perturbations',
      title: L('Perturbations', 'Возмущения', "G'alayonlar"),
      short: L(
        'Small disturbances ring a black hole at complex frequencies. We study these quasinormal modes.',
        'Малые возмущения заставляют чёрную дыру «звенеть» на комплексных частотах. Мы изучаем эти квазинормальные моды.',
        "Kichik g'alayonlar qora tuynukni kompleks chastotalarda «jaranglatadi». Biz shu kvazinormal modalarni o'rganamiz."),
      body: [
        L('A disturbed black hole settles down by ringing at complex frequencies, the quasinormal modes. We study scalar, electromagnetic and gravitational perturbations, the effective potentials that govern them, and their stability.',
          'Возмущённая чёрная дыра успокаивается, «звеня» на комплексных частотах — квазинормальных модах. Мы изучаем скалярные, электромагнитные и гравитационные возмущения, управляющие ими эффективные потенциалы и их устойчивость.',
          "G'alayonlangan qora tuynuk kompleks chastotalarda jaranglab, ya'ni kvazinormal modalarda tinchlanadi. Skalyar, elektromagnit va gravitatsion g'alayonlarni, ularni boshqaruvchi samarali potensiallarni hamda turg'unlikni o'rganamiz."),
        L('The ringdown carries information about the underlying theory, and for large angular momentum it is tied to the photon sphere and the shadow, which links this theme back to the others.',
          'Затухающие колебания несут информацию о лежащей в основе теории, а при большом угловом моменте связаны с фотонной сферой и тенью, что возвращает нас к другим направлениям.',
          "So'nuvchi tebranishlar asosiy nazariya haqida ma'lumot beradi, katta burchak momentida esa foton sfera va soya bilan bog'langan, bu esa mazkur yo'nalishni boshqalar bilan bog'laydi.")
      ],
      eq: [
        '<math display="block"><mfrac><mrow><msup><mi>d</mi><mn>2</mn></msup><mi>ψ</mi></mrow><mrow><mi>d</mi><msubsup><mi>r</mi><mo>*</mo><mn>2</mn></msubsup></mrow></mfrac><mo>+</mo><mrow><mo>(</mo><msup><mi>ω</mi><mn>2</mn></msup><mo>−</mo><mi>V</mi><mo>)</mo></mrow><mi>ψ</mi><mo>=</mo><mn>0</mn><mo>,</mo><mspace width="1em"></mspace><mi>V</mi><mo>=</mo><mrow><mo>(</mo><mn>1</mn><mo>−</mo><mfrac><mrow><mn>2</mn><mi>M</mi></mrow><mi>r</mi></mfrac><mo>)</mo></mrow><mrow><mo>[</mo><mfrac><mrow><mi>ℓ</mi><mo>(</mo><mi>ℓ</mi><mo>+</mo><mn>1</mn><mo>)</mo></mrow><msup><mi>r</mi><mn>2</mn></msup></mfrac><mo>−</mo><mfrac><mrow><mn>6</mn><mi>M</mi></mrow><msup><mi>r</mi><mn>3</mn></msup></mfrac><mo>]</mo></mrow></math>'
      ],
      eqNote: L('Regge–Wheeler equation for axial gravitational perturbations of a Schwarzschild black hole (G = c = 1).',
                'Уравнение Редже–Уилера для аксиальных гравитационных возмущений чёрной дыры Шварцшильда (G = c = 1).',
                "Shvartsshild qora tuynugining o'qli gravitatsion g'alayonlari uchun Redje–Uiler tenglamasi (G = c = 1)."),
      kw: L('quasinormal modes; ringdown; Regge–Wheeler; Teukolsky; stability; gravitational waves',
            'квазинормальные моды; затухающие колебания; Редже–Уилер; Теукольский; устойчивость; гравитационные волны',
            "kvazinormal modalar; so'nuvchi tebranishlar; Redje–Uiler; Teukolskiy; turg'unlik; gravitatsion to'lqinlar")
    }
  ];

  /* ---------- Group leaders ---------- */
  var LEADERS = [
    {
      id: 'abdujabbarov',
      name: L('Ahmadjon A. Abdujabbarov', 'Ахмаджон А. Абдужаббаров', 'Ahmadjon A. Abdujabbarov'),
      role: 'lead',
      photo: 'img/abdujabbarov.jpg',
      affil: [
        'Institute of Fundamental and Applied Research, TIIAME National Research University',
        'School of Physics, Harbin Institute of Technology, China'
      ],
      interests: L(
        'Black hole shadows and gravitational lensing; motion of particles around compact objects; plasma and magnetic-field effects; testing gravity theories with black hole images.',
        'Тени чёрных дыр и гравитационное линзирование; движение частиц вблизи компактных объектов; влияние плазмы и магнитных полей; проверка теорий гравитации по изображениям чёрных дыр.',
        "Qora tuynuk soyasi va gravitatsion linzalanish; kompakt obyektlar atrofida zarralar harakati; plazma va magnit maydon ta'siri; qora tuynuk tasvirlari yordamida gravitatsiya nazariyalarini sinash."),
      links: [
        { label: 'ORCID', url: 'https://orcid.org/0000-0002-6686-3787' },
        { label: 'INSPIRE-HEP', url: 'https://inspirehep.net/literature?q=a%20Abdujabbarov' },
        { label: 'Google Scholar', url: 'https://scholar.google.com/scholar?q=author%3A%22A+Abdujabbarov%22' }
      ],
      email: 'ahmadjon@astrin.uz'
    },
    {
      id: 'atamurotov',
      name: L('Farruh Atamurotov', 'Фаррух Атамуротов', 'Farruh Atamurotov'),
      alt: 'Atamuratov',
      role: 'co',
      photo: 'img/atamurotov.jpg',
      affil: [
        'Inha University in Tashkent'
      ],
      interests: L(
        'Black hole shadows and weak and strong lensing in plasma; quantum-corrected and modified-gravity black holes; photon motion and deflection angles.',
        'Тени чёрных дыр и слабое и сильное линзирование в плазме; чёрные дыры с квантовыми поправками и в модифицированной гравитации; движение фотонов и углы отклонения.',
        "Plazmada qora tuynuk soyasi hamda kuchsiz va kuchli linzalanish; kvant tuzatmali va modifikatsiyalangan gravitatsiyadagi qora tuynuklar; fotonlar harakati va og'ish burchaklari."),
      links: [
        { label: 'INSPIRE-HEP', url: 'https://inspirehep.net/literature?q=a%20Atamurotov' },
        { label: 'Google Scholar', url: 'https://scholar.google.com/scholar?q=author%3A%22F+Atamurotov%22' }
      ]
    }
  ];

  /* ---------- Members ----------
   * Fields: name (L), level ('postdoc' = PhD (Post-Doc) | 'doc' = PhD | 'phd' = PhD student |
   * 'msc' = Master student | 'bsc' = Bachelor student), photo ('img/name.jpg', optional),
   * links [{label, url}] and key: the name exactly as it appears in the PUBLICATIONS author
   * strings ('K. Karshiboev'), used to count each member's papers. Cards show name, level, paper
   * count and links only: no research-area text.
   * A card with placeholder: true is a template; remove those once real members exist.
   */
  var MEMBERS = [
    { key: 'A. Nosirov', level: 'phd',
      name: L('Abdurahmon Nosirov', 'Абдурахмон Носиров', 'Abdurahmon Nosirov'),
      links: [{ label: 'Scopus', url: 'https://www.scopus.com/authid/detail.uri?authorId=58481664100' }] },
    { key: 'O. Yunusov', level: 'phd',
      name: L('Odil Yunusov', 'Одил Юнусов', 'Odil Yunusov'),
      links: [{ label: 'Scopus', url: 'https://www.scopus.com/authid/detail.uri?authorId=60763679400' }] },
    { key: 'A. Davlataliev', level: 'postdoc',
      name: L('Akbar Davlataliyev', 'Акбар Давлаталиев', 'Akbar Davlataliyev'),
      links: [{ label: 'Scopus', url: 'https://www.scopus.com/authid/detail.uri?authorId=58635557800' }] },
    { key: 'Z. Turakhonov', level: 'phd',
      name: L('Ziyodulla Turakhonov', 'Зиёдулла Турахонов', 'Ziyodulla Turakhonov'),
      links: [{ label: 'Scopus', url: 'https://www.scopus.com/authid/detail.uri?authorId=59296226700' }] },
    { key: 'H. Alibekov', level: 'phd',
      name: L('Khusan Alibekov', 'Хусан Алибеков', 'Khusan Alibekov'),
      links: [{ label: 'Scopus', url: 'https://www.scopus.com/authid/detail.uri?authorId=60764417100' }] },
    { key: 'H. Hoshimov', level: 'doc',
      name: L('Husanjon Hoshimov', 'Хусанжон Хошимов', 'Husanjon Hoshimov'),
      links: [{ label: 'Scopus', url: 'https://www.scopus.com/authid/detail.uri?authorId=58752225500' }] },
    { key: 'S. Orzuev', level: 'phd',
      name: L('Shahzod Orzuyev', 'Шахзод Орзуев', 'Shahzod Orzuyev'),
      links: [{ label: 'Scopus', url: 'https://www.scopus.com/authid/detail.uri?authorId=58513958900' }] },
    { key: 'P. Yovkochev', level: 'doc',
      name: L('Pakhlavon Yovkochev', 'Пахлавон Ёвкочев', 'Pahlavon Yovqochev'),
      links: [{ label: 'Scopus', url: 'https://www.scopus.com/authid/detail.uri?authorId=60584177200' }] },
    { key: 'D. Umarov', level: 'msc',
      name: L('Dilmurod Umarov', 'Дилмурод Умаров', 'Dilmurod Umarov'),
      links: [{ label: 'Scopus', url: 'https://www.scopus.com/authid/detail.uri?authorId=59699138900' }] },
    { key: 'U. Tillayev', level: 'msc',
      name: L('Umidjon Tillayev', 'Умиджон Тиллаев', 'Umidjon Tillayev'),
      links: [{ label: 'Scopus', url: 'https://www.scopus.com/authid/detail.uri?authorId=60683796400' }] },
    { key: 'B. Shodikulov', level: 'bsc',
      name: L('Bakhodir Shodikulov', 'Баходир Шодикулов', 'Bakhodir Shodikulov'),
      links: [{ label: 'Scopus', url: 'https://www.scopus.com/authid/detail.uri?authorId=59988591100' }] },
    { key: 'A. Bakhodirov', level: 'msc',
      name: L('Abduqodir Bakhodirov', 'Абдукодир Баходиров', 'Abduqodir Bakhodirov'),
      links: [{ label: 'Scopus', url: 'https://www.scopus.com/authid/detail.uri?authorId=59988206000' }] },
    { key: 'M. Mirov', level: 'phd',
      name: L('Mirjavohir Mirov', 'Миржавохир Миров', 'Mirjavohir Mirov'),
      links: [{ label: 'Scopus', url: 'https://www.scopus.com/authid/detail.uri?authorId=60110718600' }] },
    { key: 'T. Ibrokhimov', level: 'phd',
      name: L('Tolibjon Ibrokhimov', 'Толибжон Иброхимов', 'Tolibjon Ibrokhimov'),
      links: [{ label: 'Scopus', url: 'https://www.scopus.com/authid/detail.uri?authorId=59493972200' }] },
    { key: 'A. Gulomov', level: 'phd',
      name: L('Abdujalil Gulomov', 'Абдужалил Гуломов', 'Abdujalil Gulomov'),
      links: [{ label: 'Scopus', url: 'https://www.scopus.com/authid/detail.uri?authorId=60619180200' }] },
    { key: 'K. Karshiboev', level: 'phd',
      name: L('Khurshid Karshiboev', 'Хуршид Каршибоев', 'Khurshid Karshiboev'),
      links: [{ label: 'Scopus', url: 'https://www.scopus.com/authid/detail.uri?authorId=58861373000' }] },
    { key: 'S. Mannobova', level: 'msc',
      name: L('Sojida Mannobova', 'Сожида Маннобова', 'Sojida Mannobova'),
      links: [{ label: 'Scopus', url: 'https://www.scopus.com/authid/detail.uri?authorId=59917571200' }] },
    { key: 'G. Abdukayumova', level: 'msc',
      name: L('Gulnisa Abdukayumova', 'Гулниса Абдукаюмова', 'Gulnisa Abdukayumova'),
      links: [{ label: 'Scopus', url: 'https://www.scopus.com/authid/detail.uri?authorId=60107695200' }] }
  ];

  /* ---------- Publications ---------- */
  var PUBLICATIONS = [
    { year: 2026, authors: 'P. Yovkochev, F. Atamurotov, A. Abdujabbarov, K. Yerzhanov, G. Bauyrzhan, C. Yuan',
      title: 'Strong gravitational lensing and shadow signatures of anisotropic black holes in plasma',
      venue: 'Chinese Physics C 50, 095102', doi: '10.1088/1674-1137/ae7706', themes: ['lensing', 'shadow'] },
    { year: 2026, co: ['A. Abdujabbarov'],
      title: 'Shadows and intensities of Simpson–Visser black holes in Verlinde’s emergent gravity',
      venue: 'Communications in Theoretical Physics', themes: ['shadow'] },
    { year: 2025, co: ['A. Abdujabbarov'],
      title: 'Shadow and intensities of charged dilatonic black hole in dilaton-massive gravity',
      venue: 'Nuclear Physics B', themes: ['shadow'] },
    { year: 2025, co: ['A. Abdujabbarov'],
      title: 'Impact of extended gravity theories on accretion dynamics and observables in black hole',
      venue: 'Annals of Physics', themes: ['shadow'] },
    { year: 2025, co: ['A. Abdujabbarov'],
      title: 'Gravitational lensing of neutrinos in parametrized black hole spacetimes',
      venue: 'Journal of Cosmology and Astroparticle Physics', themes: ['lensing', 'motion'] },
    { year: 2025, co: ['A. Abdujabbarov'],
      title: 'Deflection angle around generic traversable wormhole solutions and energy conditions in extended teleparallel theory of gravity',
      venue: 'Nuclear Physics B', themes: ['lensing'] },
    { year: 2025, authors: 'H. Hoshimov, S. Orzuev, F. Atamurotov, A. Abdujabbarov',
      title: 'Gravitational weak lensing and shadow radius of black holes in Horndeski gravity: Effects of plasma and scalar modifications',
      venue: 'Annals of Physics 482, 170209', doi: '10.1016/j.aop.2025.170209', themes: ['lensing', 'shadow'] },
    { year: 2025, authors: 'B. Turimov, O. Rahimov, A. Davlataliev, P. Tadjimuratov, M. Norkobilov, S. Rahimova',
      title: 'Analysing geodesic motion in Bocharova–Bronnikov–Melnikov–Bekenstein spacetime',
      venue: 'Physics of the Dark Universe 48, 101855', arxiv: '2502.11210', themes: ['motion'] },
    { year: 2024, authors: 'K. Karshiboev, F. Atamurotov, A. Abdujabbarov, A. Övgün, A. Reyimberganov',
      title: 'Exploring the shadow of a rotating charged ModMax black hole',
      venue: 'Communications in Theoretical Physics 76, 025401', themes: ['shadow'] },
    { year: 2024, authors: 'K. Karshiboev, F. Atamurotov, A. Övgün, A. Abdujabbarov, E. Karimbaev',
      title: 'Particle dynamics and thermodynamical analysis of the rotating ModMax black holes',
      venue: 'New Astronomy 109, 102200', doi: '10.1016/j.newast.2024.102200', themes: ['motion'] },
    { year: 2024, authors: 'Z. Turakhonov, F. Atamurotov, A. Övgün, A. Abdujabbarov, S. Urinov',
      title: 'Weak gravitational lensing around dyonic ModMax black hole in plasma',
      venue: 'Communications in Theoretical Physics 76, 115401',
      url: 'https://ctp.itp.ac.cn/EN/abstract/article/0253-6102/18583', themes: ['lensing'] },
    { year: 2024, authors: 'A. Davlataliev, F. Atamurotov, A. Abdujabbarov, N. Juraeva, V. Khamidov',
      title: 'Constraints on Schwarzschild-like black hole from QPOs data',
      venue: 'Physics of the Dark Universe 46, 101603', doi: '10.1016/j.dark.2024.101603', themes: ['motion'] },
    { year: 2024, authors: 'B. Turimov, A. Davlataliev, Y. Usmanov, S. Karshiboev, P. Tadjimuratov',
      title: 'Investigating new aspects of Bocharova–Bronnikov–Melnikov–Bekenstein spacetime: ionized thin accretion disk model',
      venue: 'European Physical Journal C 84, no. 10', doi: '10.1140/epjc/s10052-024-13426-w', themes: ['motion'] },
    { year: 2024, authors: 'F. Atamurotov, O. Yunusov, A. Abdujabbarov, G. Mustafa',
      title: 'Gravitational weak lensing of hairy black hole in presence of plasma',
      venue: 'New Astronomy 105, 102098', doi: '10.1016/j.newast.2023.102098', themes: ['lensing'] },
    { year: 2024, authors: 'H. Hoshimov, O. Yunusov, F. Atamurotov, et al.',
      title: 'Weak gravitational lensing and shadow of a GUP-modified Schwarzschild black hole in the presence of plasma',
      venue: 'Physics of the Dark Universe 43, 101392', arxiv: '2312.10678', themes: ['lensing', 'shadow'] },
    { year: 2024, authors: 'A. Nosirov, F. Atamurotov, G. Rakhimova, et al.',
      title: 'Particle acceleration near a rotating charged black hole in 4D Einstein–Gauss–Bonnet gravity',
      venue: 'Nuclear Physics B 1005, 116583', doi: '10.1016/j.nuclphysb.2024.116583', themes: ['motion'] },
    { year: 2023, authors: 'F. Atamurotov, H. Alibekov, A. Abdujabbarov, G. Mustafa, M. M. Aripov',
      title: 'Weak gravitational lensing around Bardeen black hole with a string cloud in the presence of plasma',
      venue: 'Symmetry 15, 848', doi: '10.3390/sym15040848', themes: ['lensing'] },
    { year: 2023, authors: 'B. Turimov, H. Alibekov, P. Tadjimuratov, A. Abdujabbarov',
      title: 'Gravitational synchrotron radiation and Penrose process in STVG theory',
      venue: 'Physics Letters B 843, 138040', doi: '10.1016/j.physletb.2023.138040', arxiv: '2306.16704', themes: ['motion'] },
    { year: 2024, authors: 'M. Alloqulov, F. Atamurotov, A. Abdujabbarov, B. Ahmedov',
      title: 'Shadow and gravitational weak lensing for quantum improved charged black hole in plasma',
      venue: '', themes: ['lensing', 'shadow'] },
    { year: 2023, authors: 'F. Sarikulov, F. Atamurotov, A. Abdujabbarov, V. Khamidov',
      title: 'Photon motion and weak gravitational lensing in black-bounce spacetime',
      venue: 'Chinese Physics C', doi: '10.1088/1674-1137/acedf2', themes: ['motion', 'lensing', 'shadow'] },
    { year: 2023, authors: 'F. Atamurotov, M. Jamil, K. Jusufi',
      title: 'Quantum effects on the black hole shadow and deflection angle in presence of plasma',
      venue: 'Chinese Physics C', doi: '10.1088/1674-1137/acaef7', themes: ['shadow', 'lensing'] },
    { year: 2023, co: ['A. Abdujabbarov'],
      title: 'Thermodynamical analysis of charged rotating black hole surrounded by perfect fluid dark matter',
      venue: '', themes: [] },
    { year: 2023, co: ['A. Abdujabbarov'],
      title: 'Quasiperiodic oscillations, weak field lensing and shadow cast around black holes in symmergent gravity',
      venue: '', themes: ['motion', 'lensing', 'shadow'] },
    { year: 2022, co: ['A. Abdujabbarov'],
      title: 'Geometric optics in conformal Weyl gravity',
      venue: '', themes: ['lensing'] },
    { year: 2021, authors: 'F. Atamurotov, K. Jusufi, M. Jamil, A. Abdujabbarov, M. Azreg-Aïnou',
      title: 'Axion-plasmon or magnetized plasma effect on an observable shadow and gravitational lensing of a Schwarzschild black hole',
      venue: 'Physical Review D', arxiv: '2109.08150', themes: ['shadow', 'lensing'] },
    { year: 2017, co: ['A. Abdujabbarov'],
      title: 'Optical properties of a braneworld black hole: Gravitational lensing and retrolensing',
      venue: 'Physical Review D 96', themes: ['lensing'] },
    { year: 2016, authors: 'A. Abdujabbarov, M. Amir, B. Ahmedov, S. G. Ghosh',
      title: 'Shadow of rotating regular black holes',
      venue: 'Physical Review D 93, 104004', doi: '10.1103/PhysRevD.93.104004', themes: ['shadow'] },
    { year: 2016, co: ['A. Abdujabbarov'],
      title: 'Shadow of rotating wormhole in plasma environment',
      venue: 'Astrophysics and Space Science 361', themes: ['shadow'] },
    { year: 2015, authors: 'F. Atamurotov, B. Ahmedov, A. Abdujabbarov',
      title: 'Optical properties of black hole in the presence of plasma: shadow',
      venue: 'Physical Review D 92, 084005', doi: '10.1103/PhysRevD.92.084005', arxiv: '1507.08131', themes: ['shadow'] },
    { year: 2008, co: ['A. Abdujabbarov'],
      title: 'Particle motion and electromagnetic fields of rotating compact gravitating objects with gravitomagnetic charge',
      venue: 'General Relativity and Gravitation 40, 2515', themes: ['motion'] },
    { year: null, preprint: true, co: ['F. Atamurotov', 'A. Abdujabbarov'],
      title: 'Effect of magnetized plasma on shadow and gravitational lensing of a Reissner–Nordström black hole',
      venue: 'arXiv', themes: ['shadow', 'lensing'] },
    { year: null, preprint: true, authors: 'H. Hoshimov, O. Yunusov, F. Atamurotov, et al.',
      title: 'Particle dynamics and quasi-periodic oscillations in the GUP-modified Schwarzschild spacetime: Constraint using micro-quasars data',
      venue: 'arXiv', arxiv: '2410.18587', themes: ['motion'] },
    { year: null, preprint: true, co: ['F. Atamurotov', 'A. Abdujabbarov'],
      title: 'Probing Geometric Proca in Metric-Palatini Gravity with Black Hole Shadow and Photon Motion',
      venue: 'arXiv', themes: ['shadow', 'motion'] }
  ];

  /* ---------- Video lectures (channel: Nazariy astrofizika) ---------- */
  var COURSES = [
    {
      id: 'mech', title: 'lect.mech', text: 'lect.mechText',
      lectures: [
        { id: 'k0jBnoogwVA', n: 'I', min: 96,
          title: L('Equations of motion', 'Уравнения движения', 'Harakat tenglamalari'),
          topics: L('Generalised coordinates, the principle of least action, Galileo’s principle of relativity, Lagrangians of a free particle and of systems of particles.',
                    'Обобщённые координаты, принцип наименьшего действия, принцип относительности Галилея, функции Лагранжа свободной частицы и систем частиц.',
                    "Umumlashgan koordinata, eng kichik ta'sir prinsipi, Galiley nisbiylik prinsipi, erkin zarra va moddiy nuqtalar sistemasi uchun Lagranj funksiyasi.") },
        { id: 'u7YCbhQatLQ', n: 'II', min: 90,
          title: L('Conservation laws', 'Законы сохранения', 'Saqlanish qonunlari') },
        { id: 'oFywUorKxrg', n: 'III', min: 109,
          title: L('Integration of the equations of motion', 'Интегрирование уравнений движения', 'Harakat tenglamalarini integrallash') },
        { id: 'rydVJ1rRlRM', n: 'IV', min: 113,
          title: L('Collisions of particles', 'Столкновения частиц', "Zarrachalar to'qnashuvi") },
        { id: 'LUREzrh0vc4', n: 'V', min: 124,
          title: L('Small oscillations', 'Малые колебания', 'Kichik tebranishlar') },
        { id: 'sbw_mObsJcE', n: 'VI·A', min: 99,
          title: L('Motion of a rigid body, part A', 'Движение твёрдого тела, часть A', 'Qattiq jism harakati, A qism') },
        { id: 'y9ukvBGAWeo', n: 'VI·B', min: 109,
          title: L('Motion of a rigid body, part B', 'Движение твёрдого тела, часть B', 'Qattiq jism harakati, B qism') },
        { id: 'eif0SB0BsPw', n: 'VII', min: 91,
          title: L('Canonical equations', 'Канонические уравнения', 'Kanonik tenglamalar') },
        { id: 'DFTsaALZqTg', n: 'VII·2', min: 97,
          title: L('Canonical equations, second video', 'Канонические уравнения, второе видео', 'Kanonik tenglamalar, ikkinchi video') }
      ]
    },
    {
      id: 'em', title: 'lect.em', text: 'lect.emText',
      lectures: [
        { id: 'YBbCa60uQ5w', n: 'I', min: 121,
          title: L('Foundations of special relativity and tensors', 'Основы специальной теории относительности и тензоров', 'Maxsus nisbiylik va tenzorlar asoslari') },
        { id: 'di1kdUYetIg', n: 'II', min: 104,
          title: L('Foundations of relativistic mechanics', 'Основы релятивистской механики', 'Relyativistik mexanika asoslari') },
        { id: 'aNRMbIpJ5ro', n: '+', min: 70,
          title: L('Electrodynamics lecture', 'Лекция по электродинамике', "Elektrodinamika ma'ruzasi") }
      ]
    },
    {
      id: 'math', title: 'lect.math', text: 'lect.mathText',
      lectures: [
        { id: '8jbBpsZxit0', n: '1', min: 31,
          title: L('Introduction', 'Введение', 'Kirish') },
        { id: 'ySqRPltd4zw', n: '2', min: 36,
          title: L('Variables and functions: local and global definitions', 'Переменные и функции: локальные и глобальные определения', "O'zgaruvchilar va funksiyalarni lokal va global ta'riflash") },
        { id: 'GzoIyKn9sQI', n: '3', min: 24,
          title: L('Derivatives, integrals and series expansion', 'Производные, интегралы и разложение в ряд', 'Hosila, integral va qatorga yoyish') },
        { id: 'VFRHuenmiGI', n: '4', min: 27,
          title: L('Lists, vectors and matrices', 'Списки, векторы и матрицы', 'List, vektor va matritsalar') }
      ]
    }
  ];

  /* ---------- Books ---------- */
  /* Subjects in the order the Books page shows them. */
  var BOOK_TABS = ['vt', 'mech', 'em', 'gr', 'qm', 'math', 'bh'];
  var BOOKS = [
    /* Vectors and tensors */
    { id: 'dullemond', cat: 'vt', level: 'intro', free: true, year: 2023, title: 'Introduction to Tensor Calculus', authors: 'Kees Dullemond, Kasper Peeters',
      pdf: 'https://www-ita.zah.uni-heidelberg.de/~dullemond/lectures/tensor/tensor.pdf',
      note: L('A short booklet on index notation, co- and contravariant vectors and the metric tensor, aimed at special and general relativity. Free from the authors.', 'Краткое пособие по индексной записи, ко- и контравариантным векторам и метрическому тензору, ориентированное на специальную и общую теорию относительности. Бесплатно от авторов.', "Indeks yozuvi, ko- va kontravariant vektorlar hamda metrik tenzor haqida qisqa qo'llanma; maxsus va umumiy nisbiylikka mo'ljallangan. Mualliflardan bepul.") },
    { id: 'sochi', cat: 'vt', level: 'core', free: true, year: 2016, title: 'Introduction to Tensor Calculus', authors: 'Taha Sochi', pdf: 'https://arxiv.org/pdf/1603.01660',
      note: L('General notes on tensor algebra and calculus with many worked identities. Free on arXiv.', 'Общие конспекты по тензорной алгебре и анализу с множеством разобранных тождеств. Бесплатно на arXiv.', "Tenzor algebra va tahlili bo'yicha ko'plab yechilgan ayniyatlar bilan umumiy konspekt. arXivda bepul.") },
    { id: 'corral', cat: 'vt', level: 'intro', free: true, title: 'Vector Calculus', authors: 'Michael Corral', publisher: 'Schoolcraft College', url: 'http://www.mecmath.net/',
      note: L('A free text on calculus in two and three variables: line and surface integrals and the theorems of Green, Stokes and Gauss. The PDF is on the author’s page, under the GNU Free Documentation License.', 'Бесплатный учебник по анализу функций двух и трёх переменных: криволинейные и поверхностные интегралы, теоремы Грина, Стокса и Гаусса. PDF на странице автора, лицензия GNU FDL.', "Ikki va uch o'zgaruvchili funksiyalar tahlili bo'yicha bepul darslik: egri chiziqli va sirt integrallari, Grin, Stoks va Gauss teoremalari. PDF muallif sahifasida, GNU FDL litsenziyasi ostida.") },
    { id: 'schey', cat: 'vt', isbn: '9780393925166', level: 'intro', year: 2005, title: 'Div, Grad, Curl, and All That: An Informal Text on Vector Calculus (4th ed.)', authors: 'H. M. Schey', publisher: 'W. W. Norton',
      note: L('A short, friendly text on gradient, divergence and curl, built around electromagnetism.', 'Краткий доступный текст о градиенте, дивергенции и роторе на примерах электромагнетизма.', "Elektromagnetizm misollarida gradient, divergensiya va rotor haqida qisqa va tushunarli matn.") },
    /* General relativity */
    { id: 'bambi', cat: 'gr', start: true, level: 'intro', year: 2018,
      title: 'Introduction to General Relativity: A Course for Undergraduate Students of Physics',
      authors: 'Cosimo Bambi', publisher: 'Springer', url: 'https://doi.org/10.1007/978-981-13-1090-4',
      note: L('Our entry point to GR. It builds relativity from the Lagrangian formalism, assumes little mathematics and works through the steps of most calculations, with hints for the problems.',
              'Наш вход в ОТО. Книга строит теорию относительности на лагранжевом формализме, требует немного математики и разбирает шаги большинства вычислений, с подсказками к задачам.',
              "Umumiy nisbiylikka kirish kitobimiz. Nisbiylik nazariyasini Lagranj formalizmi asosida quradi, kam matematika talab qiladi, ko'pchilik hisoblarning qadamlarini ko'rsatadi va masalalar uchun ko'rsatmalar beradi."),
      chapters: ['Introduction', 'Special Relativity', 'Relativistic Mechanics', 'Electromagnetism', 'Riemannian Geometry', 'General Relativity', 'Einstein’s Gravity', 'Schwarzschild Spacetime', 'Classical Tests of General Relativity', 'Black Holes', 'Cosmological Models', 'Gravitational Waves', 'Beyond Einstein’s Gravity'] },
    { id: 'carroll', cat: 'gr', isbn: '9780805387322', level: 'core', year: 2004, title: 'Spacetime and Geometry: An Introduction to General Relativity', authors: 'Sean M. Carroll',
      note: L('A clear, modern graduate text with a good treatment of differential geometry.', 'Ясный современный учебник для магистратуры с хорошим изложением дифференциальной геометрии.', "Differensial geometriyani yaxshi yoritadigan aniq va zamonaviy magistratura darsligi.") },
    { id: 'schutz-gr', cat: 'gr', isbn: '9780521887052', level: 'intro', year: 2009, title: 'A First Course in General Relativity (2nd ed.)', authors: 'Bernard F. Schutz',
      note: L('A gentle second look at the subject, with many worked examples.', 'Мягкий второй взгляд на предмет с большим числом разобранных примеров.', "Mavzuga yumshoq ikkinchi nazar, ko'plab yechilgan misollar bilan.") },
    { id: 'hartle', cat: 'gr', isbn: '9780805386622', level: 'intro', year: 2003, title: 'Gravity: An Introduction to Einstein’s General Relativity', authors: 'James B. Hartle',
      note: L('Physics first, mathematics second: good for building intuition about orbits and black holes.', 'Сначала физика, затем математика: хорошо развивает интуицию об орбитах и чёрных дырах.', "Avval fizika, keyin matematika: orbitalar va qora tuynuklar haqida tasavvurni rivojlantiradi.") },
    { id: 'wald', cat: 'gr', isbn: '9780226870335', level: 'adv', year: 1984, title: 'General Relativity', authors: 'Robert M. Wald',
      note: L('The rigorous reference for the geometric structure of the theory.', 'Строгий справочник по геометрической структуре теории.', "Nazariyaning geometrik tuzilishi bo'yicha qat'iy ma'lumotnoma.") },
    { id: 'mtw', cat: 'gr', isbn: '9780716703440', level: 'adv', year: 1973, title: 'Gravitation', authors: 'Charles W. Misner, Kip S. Thorne, John A. Wheeler',
      note: L('The encyclopedic classic. Keep it on the shelf and dip in for explanations.', 'Энциклопедическая классика. Держите под рукой и обращайтесь за объяснениями.', "Ensiklopedik klassika. Tushuntirishlar uchun qo'l ostida tuting.") },
    { id: 'weinberg', cat: 'gr', isbn: '9780471925675', level: 'adv', year: 1972, title: 'Gravitation and Cosmology', authors: 'Steven Weinberg' },
    { id: 'carroll-notes', cat: 'gr', level: 'core', free: true, year: 1997, title: 'Lecture Notes on General Relativity', authors: 'Sean M. Carroll', pdf: 'https://arxiv.org/pdf/gr-qc/9712019',
      note: L('The free lecture notes that grew into his textbook.', 'Свободные конспекты лекций, из которых вырос его учебник.', "Darslikka aylangan ochiq ma'ruza matnlari.") },
    { id: 'tong-gr', cat: 'gr', level: 'core', free: true, title: 'General Relativity (lecture notes)', authors: 'David Tong', pdf: 'https://davidtong.org/pdfs/teaching/general-relativity/gr.pdf',
      note: L('Cambridge Part III course, from geodesics to black holes and gravitational waves.', 'Курс Part III в Кембридже: от геодезических до чёрных дыр и гравитационных волн.', "Kembrij Part III kursi: geodezik chiziqlardan qora tuynuklar va gravitatsion to'lqinlargacha.") },
    { id: 'blau-gr', cat: 'gr', level: 'core', free: true, title: 'Lecture Notes on General Relativity', authors: 'Matthias Blau', publisher: 'University of Bern', pdf: 'http://blau.itp.unibe.ch/newlecturesGR.pdf',
      note: L('A very long, readable course that explores each idea from several sides, up to black holes and gravitational waves.', 'Очень подробный и понятный курс, где каждая идея рассматривается с нескольких сторон, вплоть до чёрных дыр и гравитационных волн.', "Har bir g'oyani bir necha tomondan yoritadigan, qora tuynuklar va gravitatsion to'lqinlargacha boradigan juda keng va tushunarli kurs.") },
    /* Classical mechanics */
    { id: 'll1', cat: 'mech', isbn: '9780750628969', level: 'core', year: 1976, title: 'Mechanics (Course of Theoretical Physics, Vol. 1, 3rd ed.)', authors: 'L. D. Landau, E. M. Lifshitz',
      note: L('The model for our video course on theoretical mechanics: short, exact and enough for the rest of the field.', 'Основа нашего видеокурса по теоретической механике: коротко, точно и достаточно для всей остальной области.', "Nazariy mexanika video kursimizning asosi: qisqa, aniq va qolgan barcha sohalar uchun yetarli.") },
    { id: 'goldstein', cat: 'mech', isbn: '9780201657029', level: 'core', year: 2002, title: 'Classical Mechanics (3rd ed.)', authors: 'Herbert Goldstein, Charles Poole, John Safko',
      note: L('The standard graduate reference, strong on canonical transformations and Hamilton–Jacobi theory.', 'Стандартный справочник для магистратуры, сильный в канонических преобразованиях и теории Гамильтона–Якоби.', "Kanonik almashtirishlar va Hamilton–Yakobi nazariyasida kuchli, magistratura uchun standart ma'lumotnoma.") },
    { id: 'taylor', cat: 'mech', isbn: '9781891389221', level: 'intro', year: 2005, title: 'Classical Mechanics', authors: 'John R. Taylor',
      note: L('A clear first course with many worked problems.', 'Ясный первый курс с большим числом разобранных задач.', "Ko'plab yechilgan masalalarga ega aniq birinchi kurs.") },
    { id: 'arnold', cat: 'mech', isbn: '9780387968902', level: 'adv', year: 1989, title: 'Mathematical Methods of Classical Mechanics (2nd ed.)', authors: 'V. I. Arnold',
      note: L('The geometric view: symplectic structure and Hamiltonian flows.', 'Геометрический взгляд: симплектическая структура и гамильтоновы потоки.', "Geometrik nuqtai nazar: simplektik tuzilma va Hamilton oqimlari.") },
    { id: 'kibble', cat: 'mech', level: 'intro', year: 2004, title: 'Classical Mechanics (5th ed.)', authors: 'T. W. B. Kibble, F. H. Berkshire' },
    { id: 'tong-dyn', cat: 'mech', level: 'core', free: true, title: 'Classical Dynamics (lecture notes)', authors: 'David Tong', pdf: 'https://davidtong.org/pdfs/teaching/classical-dynamics/clas.pdf',
      note: L('Free notes on Lagrangian and Hamiltonian dynamics and rigid bodies.', 'Свободные конспекты по лагранжевой и гамильтоновой динамике и твёрдому телу.', "Lagranj va Hamilton dinamikasi hamda qattiq jism bo'yicha ochiq matnlar.") },
    /* Electrodynamics */
    { id: 'll2', cat: 'em', isbn: '9780750627689', level: 'core', year: 1975, title: 'The Classical Theory of Fields (Course of Theoretical Physics, Vol. 2, 4th ed.)', authors: 'L. D. Landau, E. M. Lifshitz',
      note: L('Special relativity, electrodynamics and general relativity in one volume. A main reference for our work.', 'Специальная теория относительности, электродинамика и ОТО в одном томе. Один из главных источников нашей работы.', "Maxsus nisbiylik, elektrodinamika va umumiy nisbiylik bitta jildda. Ishimizning asosiy manbalaridan biri.") },
    { id: 'jackson', cat: 'em', isbn: '9780471309321', level: 'core', year: 1999, title: 'Classical Electrodynamics (3rd ed.)', authors: 'John David Jackson',
      note: L('The graduate standard for radiation, waves in media and relativistic electrodynamics.', 'Стандарт магистратуры по излучению, волнам в средах и релятивистской электродинамике.', "Nurlanish, muhitdagi to'lqinlar va relyativistik elektrodinamika bo'yicha magistratura standarti.") },
    { id: 'griffiths-em', cat: 'em', isbn: '9781108420419', level: 'intro', year: 2017, title: 'Introduction to Electrodynamics (4th ed.)', authors: 'David J. Griffiths',
      note: L('A friendly first course that builds up from electrostatics to radiation.', 'Дружелюбный первый курс от электростатики до излучения.', "Elektrostatikadan nurlanishgacha bosqichma-bosqich olib boradigan qulay birinchi kurs.") },
    { id: 'zangwill', cat: 'em', isbn: '9780521896979', level: 'core', year: 2013, title: 'Modern Electrodynamics', authors: 'Andrew Zangwill' },
    { id: 'chen', cat: 'em', level: 'intro', year: 2016, title: 'Introduction to Plasma Physics and Controlled Fusion (3rd ed.)', authors: 'Francis F. Chen',
      note: L('Background on plasma, which matters for lensing and shadows in a plasma medium.', 'Основы физики плазмы, важные для линзирования и теней в плазменной среде.', "Plazma muhitidagi linzalanish va soyalar uchun muhim bo'lgan plazma fizikasi asoslari.") },
    { id: 'tong-em', cat: 'em', level: 'core', free: true, title: 'Electromagnetism (lecture notes)', authors: 'David Tong', pdf: 'https://davidtong.org/pdfs/teaching/electromagnetism/electro.pdf',
      note: L('Free notes from Maxwell’s equations to radiation and the relativistic form.', 'Свободные конспекты: от уравнений Максвелла до излучения и релятивистской формы.', "Maksvell tenglamalaridan nurlanish va relyativistik shaklgacha ochiq matnlar.") },
    /* Quantum mechanics */
    { id: 'll3', cat: 'qm', isbn: '9780750635394', level: 'core', year: 1977, title: 'Quantum Mechanics: Non-Relativistic Theory (Course of Theoretical Physics, Vol. 3, 3rd ed.)', authors: 'L. D. Landau, E. M. Lifshitz' },
    { id: 'sakurai', cat: 'qm', isbn: '9781108422413', level: 'core', year: 2020, title: 'Modern Quantum Mechanics (3rd ed.)', authors: 'J. J. Sakurai, Jim Napolitano',
      note: L('The usual graduate text, strong on angular momentum and symmetries.', 'Обычный учебник для магистратуры, сильный в моменте импульса и симметриях.', "Burchak momenti va simmetriyalarda kuchli, odatiy magistratura darsligi.") },
    { id: 'griffiths-qm', cat: 'qm', isbn: '9781107179868', level: 'intro', year: 2018, title: 'Introduction to Quantum Mechanics (3rd ed.)', authors: 'David J. Griffiths, Darrell F. Schroeter',
      note: L('Start here if quantum mechanics is new to you.', 'Начните с этой книги, если квантовая механика для вас нова.', "Kvant mexanikasi siz uchun yangi bo'lsa, shundan boshlang.") },
    { id: 'shankar', cat: 'qm', isbn: '9780306447907', level: 'core', year: 1994, title: 'Principles of Quantum Mechanics (2nd ed.)', authors: 'R. Shankar' },
    { id: 'dirac', cat: 'qm', isbn: '9780198520115', level: 'adv', year: 1958, title: 'The Principles of Quantum Mechanics (4th ed.)', authors: 'P. A. M. Dirac' },
    { id: 'tong-qm', cat: 'qm', level: 'intro', free: true, title: 'Quantum Mechanics (lecture notes)', authors: 'David Tong', pdf: 'https://www.damtp.cam.ac.uk/user/tong/qm/qm.pdf',
      note: L('Cambridge Part IB course: wave mechanics, the harmonic oscillator, angular momentum and the hydrogen atom.', 'Курс Part IB в Кембридже: волновая механика, гармонический осциллятор, момент импульса и атом водорода.', "Kembrij Part IB kursi: to'lqin mexanikasi, garmonik ostsillyator, burchak momenti va vodorod atomi.") },
    /* Black holes and lensing */
    { id: 'chandra', cat: 'bh', isbn: '9780198503705', level: 'adv', year: 1983, title: 'The Mathematical Theory of Black Holes', authors: 'S. Chandrasekhar',
      note: L('Geodesics, perturbations and quasinormal modes of Schwarzschild, Reissner–Nordström and Kerr black holes.', 'Геодезические, возмущения и квазинормальные моды чёрных дыр Шварцшильда, Рейсснера–Нордстрёма и Керра.', "Shvartsshild, Reysner–Nordstrem va Kerr qora tuynuklarining geodezik chiziqlari, g'alayonlari va kvazinormal modalari.") },
    { id: 'frolov', cat: 'bh', level: 'adv', year: 1998, title: 'Black Hole Physics: Basic Concepts and New Developments', authors: 'Valeri P. Frolov, Igor D. Novikov' },
    { id: 'poisson', cat: 'bh', isbn: '9780521830911', level: 'core', year: 2004, title: 'A Relativist’s Toolkit: The Mathematics of Black-Hole Mechanics', authors: 'Eric Poisson',
      note: L('Practical tools: geodesics, Killing vectors and the mechanics of black holes.', 'Практические инструменты: геодезические, векторы Киллинга и механика чёрных дыр.', "Amaliy vositalar: geodezik chiziqlar, Killing vektorlari va qora tuynuklar mexanikasi.") },
    { id: 'sef', cat: 'bh', level: 'core', year: 1992, title: 'Gravitational Lenses', authors: 'P. Schneider, J. Ehlers, E. E. Falco' },
    { id: 'frank', cat: 'bh', isbn: '9780521620536', level: 'core', year: 2002, title: 'Accretion Power in Astrophysics (3rd ed.)', authors: 'Juhan Frank, Andrew King, Derek Raine',
      note: L('Accretion discs, which supply the glow behind a black hole shadow.', 'Аккреционные диски, которые создают свечение за тенью чёрной дыры.', "Qora tuynuk soyasi ortidagi nurni hosil qiluvchi akkretsiya disklari.") },
    { id: 'perlick-lensing', cat: 'bh', level: 'review', free: true, year: 2004, title: 'Gravitational Lensing from a Spacetime Perspective', authors: 'Volker Perlick', publisher: 'Living Reviews in Relativity 7, 9', pdf: 'https://arxiv.org/pdf/1010.3416' },
    { id: 'perlick-shadow', cat: 'bh', level: 'review', free: true, year: 2022, title: 'Calculating Black Hole Shadows: Review of Analytical Studies', authors: 'Volker Perlick, Oleg Yu. Tsupko', publisher: 'Physics Reports 947, 1', pdf: 'https://arxiv.org/pdf/2105.07101' },
    { id: 'bozza-review', cat: 'bh', level: 'review', free: true, year: 2010, title: 'Gravitational Lensing by Black Holes', authors: 'Valerio Bozza', publisher: 'General Relativity and Gravitation 42, 2269', pdf: 'https://arxiv.org/pdf/0911.2187',
      note: L('Strong-field lensing by spherical and spinning black holes, with the higher-order images and caustics.', 'Сильное линзирование сферическими и вращающимися чёрными дырами: изображения высших порядков и каустики.', "Sferik va aylanuvchi qora tuynuklarning kuchli linzalanishi: yuqori tartibli tasvirlar va kaustiklar.") },
    { id: 'cunha-review', cat: 'bh', level: 'review', free: true, year: 2018, title: 'Shadows and Strong Gravitational Lensing: A Brief Review', authors: 'Pedro V. P. Cunha, Carlos A. R. Herdeiro', publisher: 'General Relativity and Gravitation 50, 42', pdf: 'https://arxiv.org/pdf/1801.00860',
      note: L('Light rings and fundamental photon orbits as the key to shadows of compact objects.', 'Световые кольца и фундаментальные фотонные орбиты как ключ к теням компактных объектов.', "Yorug'lik halqalari va fundamental foton orbitalari: kompakt obyektlar soyalarining kaliti.") },
    { id: 'kokkotas', cat: 'bh', level: 'review', free: true, year: 1999, title: 'Quasi-Normal Modes of Stars and Black Holes', authors: 'Kostas D. Kokkotas, Bernd G. Schmidt', publisher: 'Living Reviews in Relativity 2, 2', pdf: 'https://arxiv.org/pdf/gr-qc/9909058' },
    /* Mathematical methods */
    { id: 'arfken', cat: 'math', isbn: '9780123846549', level: 'core', year: 2013, title: 'Mathematical Methods for Physicists (7th ed.)', authors: 'George B. Arfken, Hans J. Weber, Frank E. Harris',
      note: L('The all-purpose reference: special functions, complex analysis, differential equations.', 'Универсальный справочник: специальные функции, комплексный анализ, дифференциальные уравнения.', "Universal ma'lumotnoma: maxsus funksiyalar, kompleks tahlil, differensial tenglamalar.") },
    { id: 'boas', cat: 'math', isbn: '9780471198260', level: 'intro', year: 2005, title: 'Mathematical Methods in the Physical Sciences (3rd ed.)', authors: 'Mary L. Boas' },
    { id: 'rhb', cat: 'math', isbn: '9780521679718', level: 'core', year: 2006, title: 'Mathematical Methods for Physics and Engineering (3rd ed.)', authors: 'K. F. Riley, M. P. Hobson, S. J. Bence' },
    { id: 'schutz-geom', cat: 'math', isbn: '9780521298872', level: 'core', year: 1980, title: 'Geometrical Methods of Mathematical Physics', authors: 'Bernard F. Schutz',
      note: L('Manifolds, tensors and differential forms, written for physicists.', 'Многообразия, тензоры и дифференциальные формы для физиков.', "Fiziklar uchun yozilgan ko'pxilliklar, tenzorlar va differensial formalar.") },
    { id: 'nakahara', cat: 'math', isbn: '9780750306065', level: 'adv', year: 2003, title: 'Geometry, Topology and Physics (2nd ed.)', authors: 'Mikio Nakahara' },
    { id: 'frankel', cat: 'math', isbn: '9781107602601', level: 'adv', year: 2011, title: 'The Geometry of Physics: An Introduction (3rd ed.)', authors: 'Theodore Frankel' },
    { id: 'courant', cat: 'math', isbn: '9780471504474', level: 'adv', year: 1953, title: 'Methods of Mathematical Physics, Vol. 1', authors: 'R. Courant, D. Hilbert' },
    { id: 'nearing', cat: 'math', level: 'intro', free: true, year: 2010, title: 'Mathematical Tools for Physics', authors: 'James Nearing', publisher: 'University of Miami', url: 'http://www.physics.miami.edu/~nearing/mathmethods/',
      note: L('A free, friendly book on the mathematics a physics student uses: series, vector spaces, Fourier methods, tensors and the calculus of variations. The full text is a PDF on the author’s page.', 'Бесплатная доступная книга по математике для физиков: ряды, векторные пространства, методы Фурье, тензоры и вариационное исчисление. Полный текст в PDF на странице автора.', "Fiziklar uchun matematika bo'yicha bepul va tushunarli kitob: qatorlar, vektor fazolar, Fure usullari, tenzorlar va variatsion hisob. To'liq matn muallif sahifasida PDF shaklida.") },
    { id: 'nr', cat: 'math', isbn: '9780521880688', level: 'core', year: 2007, title: 'Numerical Recipes: The Art of Scientific Computing (3rd ed.)', authors: 'W. H. Press, S. A. Teukolsky, W. T. Vetterling, B. P. Flannery',
      note: L('Numerical integration, root finding and ODE solvers, the basis of geodesic and shadow codes.', 'Численное интегрирование, поиск корней и решатели ОДУ — основа кодов для геодезических и теней.', "Sonli integrallash, ildiz topish va ODT yechuvchilar: geodezik chiziqlar va soyalar dasturlarining asosi.") }
  ];

  /* ---------- Roadmap for new students ---------- */
  var STEPS = [
    { id: 'vt', title: L('Vectors and tensors', 'Векторы и тензоры', 'Vektor va tenzorlar'),
      text: L('Start with vector calculus: gradient, divergence, curl, line and surface integrals. Then move to index notation, the metric and tensors. Every later subject, from electrodynamics to curved spacetime, is written in this language.',
              'Начните с векторного анализа: градиент, дивергенция, ротор, линейные и поверхностные интегралы. Затем перейдите к индексным обозначениям, метрике и тензорам. На этом языке записаны все дальнейшие предметы, от электродинамики до искривлённого пространства-времени.',
              "Vektor analizidan boshlang: gradient, divergensiya, rotor, chiziqli va sirt integrallari. So'ng indekslar bilan yozuv, metrika va tenzorlarga o'ting. Elektrodinamikadan tortib egri fazo-vaqtgacha keyingi barcha fanlar shu tilda yoziladi."),
      books: ['corral', 'schey', 'dullemond'], booksTab: 'vt' },
    { id: 'mech', title: L('Classical mechanics', 'Классическая механика', 'Klassik mexanika'),
      text: L('Learn the Lagrangian and Hamiltonian formalism. The principle of least action and Noether’s theorem are the backbone of everything that follows, including geodesic motion.',
              'Освойте лагранжев и гамильтонов формализм. Принцип наименьшего действия и теорема Нётер — основа всего дальнейшего, включая движение по геодезическим.',
              "Lagranj va Hamilton formalizmini o'zlashtiring. Eng kichik ta'sir prinsipi va Nyoter teoremasi keyingi barcha mavzularning, jumladan geodezik harakatning asosidir."),
      books: ['ll1', 'goldstein', 'tong-dyn'], course: 'mech' },
    { id: 'em', title: L('Special relativity and electrodynamics', 'Специальная теория относительности и электродинамика', 'Maxsus nisbiylik va elektrodinamika'),
      text: L('Maxwell’s equations in covariant form, tensors and relativistic mechanics. You need this vocabulary before you meet curved spacetime.',
              'Уравнения Максвелла в ковариантной форме, тензоры и релятивистская механика. Этот язык нужен до знакомства с искривлённым пространством-временем.',
              "Kovariant shakldagi Maksvell tenglamalari, tenzorlar va relyativistik mexanika. Egri fazo-vaqt bilan tanishishdan oldin shu tilni bilish kerak."),
      books: ['ll2', 'jackson', 'griffiths-em'], course: 'em' },
    { id: 'math', title: L('Mathematical methods', 'Математические методы', 'Matematik usullar'),
      text: L('Calculus of variations, differential equations, special functions and linear algebra, then tensors and differential geometry. Practise symbolic work in Mathematica as you go.',
              'Вариационное исчисление, дифференциальные уравнения, специальные функции и линейная алгебра, затем тензоры и дифференциальная геометрия. По ходу практикуйте символьные вычисления в Mathematica.',
              "Variatsion hisob, differensial tenglamalar, maxsus funksiyalar va chiziqli algebra, so'ngra tenzorlar va differensial geometriya. Shu bilan birga Mathematica'da simvolli hisoblarni mashq qiling."),
      books: ['arfken', 'boas', 'schutz-geom'], course: 'math' },
    { id: 'qm', title: L('Quantum mechanics', 'Квантовая механика', 'Kvant mexanikasi'),
      text: L('A first course is enough to begin: states, operators, the harmonic oscillator and spin. It supports later work on quantum-corrected black holes.',
              'Для начала достаточно первого курса: состояния, операторы, гармонический осциллятор и спин. Это поддержит последующую работу над чёрными дырами с квантовыми поправками.',
              "Boshlash uchun birinchi kurs yetarli: holatlar, operatorlar, garmonik ostsillyator va spin. Bu keyinchalik kvant tuzatmali qora tuynuklar ustida ishlashga yordam beradi."),
      books: ['griffiths-qm', 'll3', 'sakurai'] },
    { id: 'gr', title: L('General relativity', 'Общая теория относительности', 'Umumiy nisbiylik nazariyasi'),
      text: L('Read the first nine chapters of Bambi’s book in order and solve the problems. Then read the chapters on black holes and gravitational waves, and take Carroll or Schutz as a second view.',
              'Прочитайте первые девять глав книги Бамби по порядку и решите задачи. Затем прочитайте главы о чёрных дырах и гравитационных волнах, а Кэрролла или Шутца возьмите как второй взгляд.',
              "Bambi kitobining dastlabki to'qqiz bobini tartib bilan o'qing va masalalarni yeching. So'ng qora tuynuklar va gravitatsion to'lqinlar boblarini o'qing, ikkinchi nuqtai nazar uchun Kerroll yoki Shuts kitobini oling."),
      books: ['bambi', 'carroll', 'schutz-gr'] },
    { id: 'research', title: L('Choose a research theme', 'Выберите направление исследований', "Tadqiqot yo'nalishini tanlang"),
      text: L('Pick one of the five themes, read its classic papers, reproduce a published result with Mathematica or Python, and present it to the group.',
              'Выберите одно из пяти направлений, прочитайте классические статьи по нему, воспроизведите опубликованный результат в Mathematica или Python и представьте его группе.',
              "Besh yo'nalishdan birini tanlang, uning klassik maqolalarini o'qing, e'lon qilingan natijani Mathematica yoki Python'da qayta hosil qiling va guruhga taqdim eting."),
      books: ['poisson', 'chandra', 'perlick-lensing'], research: true }
  ];

  /* ---------- Classic papers by theme ---------- */
  var CLASSICS = [
    { theme: 'lensing', authors: 'A. Einstein', title: 'Lens-like action of a star by the deviation of light in the gravitational field', venue: 'Science 84, 506 (1936)' },
    { theme: 'lensing', authors: 'K. S. Virbhadra, G. F. R. Ellis', title: 'Schwarzschild black hole lensing', venue: 'Phys. Rev. D 62, 084003 (2000)' },
    { theme: 'lensing', authors: 'V. Bozza', title: 'Gravitational lensing in the strong field limit', venue: 'Phys. Rev. D 66, 103001 (2002)' },
    { theme: 'lensing', authors: 'G. S. Bisnovatyi-Kogan, O. Yu. Tsupko', title: 'Gravitational lensing in a non-uniform plasma', venue: 'Mon. Not. R. Astron. Soc. 404, 1790 (2010)' },
    { theme: 'lensing', authors: 'V. Perlick', title: 'Gravitational lensing from a spacetime perspective', venue: 'Living Rev. Relativ. 7, 9 (2004)' },
    { theme: 'shadow', authors: 'J. L. Synge', title: 'The escape of photons from gravitationally intense stars', venue: 'Mon. Not. R. Astron. Soc. 131, 463 (1966)' },
    { theme: 'shadow', authors: 'J. M. Bardeen', title: 'Timelike and null geodesics in the Kerr metric', venue: 'in Black Holes (Les Houches 1972), 215 (1973)' },
    { theme: 'shadow', authors: 'J.-P. Luminet', title: 'Image of a spherical black hole with thin accretion disk', venue: 'Astron. Astrophys. 75, 228 (1979)' },
    { theme: 'shadow', authors: 'Event Horizon Telescope Collaboration', title: 'First M87 Event Horizon Telescope results. I. The shadow of the supermassive black hole', venue: 'Astrophys. J. Lett. 875, L1 (2019)' },
    { theme: 'shadow', authors: 'Event Horizon Telescope Collaboration', title: 'First Sagittarius A* Event Horizon Telescope results. I.', venue: 'Astrophys. J. Lett. 930, L12 (2022)' },
    { theme: 'shadow', authors: 'V. Perlick, O. Yu. Tsupko', title: 'Calculating black hole shadows: Review of analytical studies', venue: 'Phys. Rep. 947, 1 (2022)' },
    { theme: 'motion', authors: 'B. Carter', title: 'Global structure of the Kerr family of gravitational fields', venue: 'Phys. Rev. 174, 1559 (1968)' },
    { theme: 'motion', authors: 'R. Penrose', title: 'Gravitational collapse: the role of general relativity', venue: 'Riv. Nuovo Cimento 1, 252 (1969)' },
    { theme: 'motion', authors: 'J. M. Bardeen, W. H. Press, S. A. Teukolsky', title: 'Rotating black holes: locally nonrotating frames, energy extraction, and scalar synchrotron radiation', venue: 'Astrophys. J. 178, 347 (1972)' },
    { theme: 'motion', authors: 'R. M. Wald', title: 'Black hole in a uniform magnetic field', venue: 'Phys. Rev. D 10, 1680 (1974)' },
    { theme: 'spinning', authors: 'M. Mathisson', title: 'Neue Mechanik materieller Systeme', venue: 'Acta Phys. Polon. 6, 163 (1937)' },
    { theme: 'spinning', authors: 'A. Papapetrou', title: 'Spinning test-particles in general relativity. I', venue: 'Proc. R. Soc. Lond. A 209, 248 (1951)' },
    { theme: 'spinning', authors: 'W. Tulczyjew', title: 'Motion of multipole particles in general relativity theory', venue: 'Acta Phys. Polon. 18, 393 (1959)' },
    { theme: 'spinning', authors: 'W. G. Dixon', title: 'Dynamics of extended bodies in general relativity. I. Momentum and angular momentum', venue: 'Proc. R. Soc. Lond. A 314, 499 (1970)' },
    { theme: 'perturbations', authors: 'T. Regge, J. A. Wheeler', title: 'Stability of a Schwarzschild singularity', venue: 'Phys. Rev. 108, 1063 (1957)' },
    { theme: 'perturbations', authors: 'F. J. Zerilli', title: 'Effective potential for even-parity Regge–Wheeler gravitational perturbation equations', venue: 'Phys. Rev. Lett. 24, 737 (1970)' },
    { theme: 'perturbations', authors: 'S. A. Teukolsky', title: 'Perturbations of a rotating black hole. I. Fundamental equations for gravitational, electromagnetic, and neutrino-field perturbations', venue: 'Astrophys. J. 185, 635 (1973)' },
    { theme: 'perturbations', authors: 'K. D. Kokkotas, B. G. Schmidt', title: 'Quasi-normal modes of stars and black holes', venue: 'Living Rev. Relativ. 2, 2 (1999)' },
    { theme: 'perturbations', authors: 'E. Berti, V. Cardoso, A. O. Starinets', title: 'Quasinormal modes of black holes and black branes', venue: 'Class. Quantum Grav. 26, 163001 (2009)' },
    { theme: 'perturbations', authors: 'B. P. Abbott et al. (LIGO Scientific and Virgo)', title: 'Observation of gravitational waves from a binary black hole merger', venue: 'Phys. Rev. Lett. 116, 061102 (2016)' }
  ];

  /* ---------- Tools ---------- */
  var TOOLS = [
    { name: 'Wolfram Mathematica', url: 'https://www.wolfram.com/mathematica/',
      note: L('Symbolic algebra for metrics, Christoffel symbols and curvature. See the video lessons.', 'Символьная алгебра для метрик, символов Кристоффеля и кривизны. Смотрите видеоуроки.', "Metrikalar, Kristoffel simvollari va egrilik uchun simvolli algebra. Video darslarni ko'ring.") },
    { name: 'xAct', url: 'https://xact.es',
      note: L('Tensor algebra and perturbation theory packages for Mathematica.', 'Пакеты тензорной алгебры и теории возмущений для Mathematica.', "Mathematica uchun tenzor algebra va g'alayonlar nazariyasi paketlari.") },
    { name: 'SageManifolds', url: 'https://sagemanifolds.obspm.fr',
      note: L('Free differential geometry and tensor calculus in SageMath.', 'Свободная дифференциальная геометрия и тензорное исчисление в SageMath.', "SageMath'da ochiq differensial geometriya va tenzor hisobi.") },
    { name: 'EinsteinPy', url: 'https://einsteinpy.org',
      note: L('Python library for general relativity: metrics, geodesics and plots.', 'Библиотека Python для общей теории относительности: метрики, геодезические и графики.', "Umumiy nisbiylik uchun Python kutubxonasi: metrikalar, geodezik chiziqlar va grafiklar.") },
    { name: 'SymPy', url: 'https://www.sympy.org',
      note: L('Free symbolic algebra in Python.', 'Свободная символьная алгебра на Python.', "Python'da ochiq simvolli algebra.") },
    { name: 'SciPy', url: 'https://scipy.org',
      note: L('Numerical integration of geodesics and root finding for photon orbits.', 'Численное интегрирование геодезических и поиск корней для фотонных орбит.', "Geodezik chiziqlarni sonli integrallash va foton orbitalari uchun ildiz topish.") },
    { name: 'Overleaf', url: 'https://www.overleaf.com',
      note: L('Online LaTeX editor for papers and theses.', 'Онлайн-редактор LaTeX для статей и диссертаций.', "Maqola va dissertatsiyalar uchun onlayn LaTeX muharriri.") },
    { name: 'arXiv', url: 'https://arxiv.org/list/gr-qc/new',
      note: L('Read the new gr-qc preprints every day.', 'Читайте новые препринты gr-qc каждый день.', "Har kuni gr-qc bo'limidagi yangi preprintlarni o'qing.") },
    { name: 'INSPIRE-HEP', url: 'https://inspirehep.net',
      note: L('Citations and author profiles for high-energy physics and gravity.', 'Цитирования и профили авторов по физике высоких энергий и гравитации.', "Yuqori energiyalar fizikasi va gravitatsiya bo'yicha iqtiboslar va muallif profillari.") },
    { name: 'NASA ADS', url: 'https://ui.adsabs.harvard.edu',
      note: L('Literature search for astrophysics.', 'Поиск литературы по астрофизике.', "Astrofizika bo'yicha adabiyotlarni qidirish.") },
    { name: 'Zotero', url: 'https://www.zotero.org',
      note: L('Free reference manager.', 'Свободный менеджер библиографии.', "Bepul bibliografiya menejeri.") }
  ];

  /* ---------- News (newest first is applied automatically) ---------- */
  var NEWS = [
    { date: '2026-11-15',
      title: L('Group website goes live', 'Сайт группы запущен', "Guruh veb-sayti ishga tushdi"),
      text: L('People, publications, video lectures and a reading list for new students are now in one place, in three languages.',
              'Участники, публикации, видеолекции и список литературы для новичков теперь собраны в одном месте, на трёх языках.',
              "A'zolar, nashrlar, video ma'ruzalar va yangi talabalar uchun adabiyotlar ro'yxati endi bir joyda, uch tilda.") },
    { date: '2026-06-04',
      title: L('New paper in Chinese Physics C', 'Новая статья в Chinese Physics C', "⟦Chinese Physics C⟧'da yangi maqola"),
      text: L('“Strong gravitational lensing and shadow signatures of anisotropic black holes in plasma”, with students and collaborators, accepted on 3 June 2026.',
              '«Strong gravitational lensing and shadow signatures of anisotropic black holes in plasma» — работа со студентами и соавторами, принята 3 июня 2026 года.',
              "«⟦Strong gravitational lensing and shadow signatures of anisotropic black holes in plasma⟧» — talabalar va hamkorlar bilan maqola, 2026-yil 3-iyunda qabul qilingan."),
      link: 'https://doi.org/10.1088/1674-1137/ae7706' },
    { date: '2025-10-09', when: L('9–11 Oct 2025', '9–11 октября 2025', '2025-yil 9–11-oktabr'),
      title: L('Talk at the Hradec Králové Physics Days', 'Доклад на Hradec Králové Physics Days', 'Hradec Králové fizika kunlarida ma\'ruza'),
      text: L('Prof. Abdujabbarov gave a review, “Black hole shadow as useful tool for testing the gravity theories”, at the 4th Hradec Králové International Physics Days.',
              'Профессор Абдужаббаров представил обзор «Black hole shadow as useful tool for testing the gravity theories» на 4-х Международных днях физики в Градец-Кралове.',
              "Professor Abdujabbarov Hradec Králové'dagi 4-xalqaro fizika kunlarida «⟦Black hole shadow as useful tool for testing the gravity theories⟧» sharhi bilan chiqish qildi.") }
  ];

  window.SITE_DATA = {
    THEMES: THEMES, LEADERS: LEADERS, MEMBERS: MEMBERS, PUBLICATIONS: PUBLICATIONS,
    COURSES: COURSES, BOOKS: BOOKS, BOOK_TABS: BOOK_TABS, STEPS: STEPS, CLASSICS: CLASSICS,
    TOOLS: TOOLS, NEWS: NEWS
  };
})();
