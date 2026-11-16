/* Translation helpers and interface strings (English, Russian, Uzbek).
 *
 * Uzbek source text is written in the 1995 Latin spelling (sh, ch, o', g') and converted when shown:
 *   new alphabet  ->  Ş Ç Ö Ğ   (law signed 21 Oct 2026, in force from 22 Apr 2027)
 *   legacy        ->  sh ch oʻ gʻ
 * Wrap anything that must stay untouched (names, quotes) in ⟦ ⟧.
 */
(function () {
  'use strict';

  var L = function (en, ru, uz) { return { en: en, ru: ru, uz: uz }; };

  var state = { lang: 'en', alpha: 'new' };
  var cache = {};

  function uzConvert(s, mode) {
    if (!s) return s;
    var key = mode + '|' + s;
    if (cache[key] !== undefined) return cache[key];
    var out = s.split(/(⟦[^⟧]*⟧|<[^>]*>)/).map(function (seg) {
      if (seg.charAt(0) === '⟦') return seg.slice(1, -1);
      if (seg.charAt(0) === '<') return seg;
      var x = seg;
      if (mode === 'new') {
        x = x.replace(/([oO])['‘’ʻʼ`]/g, function (m, c) { return c === 'o' ? 'ö' : 'Ö'; })
             .replace(/([gG])['‘’ʻʼ`]/g, function (m, c) { return c === 'g' ? 'ğ' : 'Ğ'; })
             .replace(/sh/g, 'ş').replace(/Sh/g, 'Ş').replace(/SH/g, 'Ş')
             .replace(/ch/g, 'ç').replace(/Ch/g, 'Ç').replace(/CH/g, 'Ç');
      } else {
        x = x.replace(/([oO])['‘’ʻʼ`]/g, '$1ʻ').replace(/([gG])['‘’ʻʼ`]/g, '$1ʻ');
      }
      return x.replace(/['‘’`]/g, 'ʼ');
    }).join('');
    cache[key] = out;
    return out;
  }

  /* t(obj): pick the current language from {en, ru, uz}. Plain strings pass through. */
  function t(obj) {
    if (obj == null) return '';
    if (typeof obj === 'string') return obj;
    var v = obj[state.lang];
    if (v == null) v = obj.en;
    return state.lang === 'uz' ? uzConvert(v, state.alpha) : v;
  }

  var UI = {
    'skip': L('Skip to content', 'Перейти к содержимому', "Mazmunga o'tish"),
    'menu': L('Menu', 'Меню', 'Menyu'),
    'theme': L('Switch light or dark theme', 'Переключить светлую или тёмную тему', "Yorug' yoki qorong'i mavzuni almashtirish"),
    'langLabel': L('Language', 'Язык', 'Til'),
    'external': L('(opens in a new tab)', '(откроется в новой вкладке)', '(yangi oynada ochiladi)'),

    'nav.brand': L('Research Group Theoretical Physics', 'Исследовательская группа по теоретической физике', 'Nazariy fizika tadqiqot guruhi'),
    'nav.brandShort': L('Research Group Theoretical Physics', 'Теоретическая физика', 'Nazariy fizika'),
    'nav.sub': L('Black holes & gravity', 'Чёрные дыры и гравитация', 'Qora tuynuklar va gravitatsiya'),
    'nav.home': L('Home', 'Главная', 'Bosh sahifa'),
    'nav.people': L('People', 'Участники', "A'zolar"),
    'nav.research': L('Research', 'Исследования', 'Tadqiqotlar'),
    'nav.publications': L('Publications', 'Публикации', 'Nashrlar'),
    'nav.lectures': L('Lectures', 'Лекции', "Ma'ruzalar"),
    'nav.books': L('Books', 'Книги', 'Kitoblar'),
    'nav.start': L('Start here', 'Новичкам', 'Yangilar uchun'),
    'nav.join': L('Join us', 'Вступить', "Qo'shilish"),

    'hero.eyebrow': L('Theoretical physics research group', 'Исследовательская группа по теоретической физике', 'Nazariy fizika tadqiqot guruhi'),
    'hero.title': L('Black holes, light and spacetime', 'Чёрные дыры, свет и пространство-время', "Qora tuynuklar, yorug'lik va fazo-vaqt"),
    'hero.lead': L(
      'More than fifty students and researchers work on general relativity: gravitational lensing, black hole shadows, the motion of particles and spinning particles, and perturbations of compact objects.',
      'Более пятидесяти студентов и исследователей работают над общей теорией относительности: гравитационным линзированием, тенями чёрных дыр, движением частиц и частиц со спином, возмущениями компактных объектов.',
      "Ellikdan ortiq talaba va tadqiqotchi umumiy nisbiylik nazariyasi bilan shug'ullanadi: gravitatsion linzalanish, qora tuynuk soyasi, zarralar va spinli zarralar harakati hamda kompakt obyektlardagi g'alayonlar."),
    'hero.cta1': L('Start here', 'С чего начать', 'Boshlash'),
    'hero.cta2': L('Meet the group', 'Познакомиться с группой', 'Guruh bilan tanishish'),
    'hero.caption': L(
      'A Schwarzschild black hole, ray-traced live in your browser. The photon sphere lies at r = 3GM/c², and the shadow radius is 3√3\u00A0GM/c² ≈ 5.2\u00A0GM/c².',
      'Чёрная дыра Шварцшильда, рассчитанная трассировкой лучей прямо в браузере. Фотонная сфера находится на r = 3GM/c², радиус тени равен 3√3\u00A0GM/c² ≈ 5,2\u00A0GM/c².',
      "Shvartsshild qora tuynugi brauzeringizda nurlar izi usulida real vaqtda hisoblanmoqda. Foton sfera r = 3GM/c² da joylashgan, soya radiusi 3√3\u00A0GM/c² ≈ 5,2\u00A0GM/c²."),
    'hero.incl': L('Inclination', 'Наклон', 'Qiyalik burchagi'),
    'hero.fig': L('Interactive black hole simulation', 'Интерактивная модель чёрной дыры', "Qora tuynukning interaktiv modeli"),

    'stats.members': L('Group members', 'Участников группы', "Guruh a'zolari"),
    'stats.themes': L('Research themes', 'Направлений исследований', "Tadqiqot yo'nalishlari"),
    'stats.lectures': L('Video lectures', 'Видеолекций', "Video ma'ruzalar"),
    'stats.books': L('Books and reviews', 'Книг и обзоров', 'Kitob va sharhlar'),

    'home.leaders': L('Group leaders', 'Руководители группы', 'Guruh rahbarlari'),
    'home.themes': L('Research themes', 'Направления исследований', "Tadqiqot yo'nalishlari"),
    'home.themesSub': L(
      'Five lines of work, all built around black holes and how light and matter move near them.',
      'Пять линий работы, объединённых чёрными дырами и движением света и вещества вблизи них.',
      "Besh yo'nalish: barchasi qora tuynuklar va ularning yaqinida yorug'lik hamda moddaning harakatiga bag'ishlangan."),
    'home.more': L('Details', 'Подробнее', 'Batafsil'),
    'home.startTitle': L('New to the group?', 'Впервые в группе?', 'Guruhga yangi kelganmisiz?'),
    'home.startText': L(
      'Follow the suggested path: mechanics, electrodynamics, mathematical methods, quantum mechanics, then general relativity with Bambi’s textbook.',
      'Следуйте рекомендованному порядку: механика, электродинамика, математические методы, квантовая механика, затем общая теория относительности по учебнику Бамби.',
      "Tavsiya etilgan tartibda o'qing: mexanika, elektrodinamika, matematik usullar, kvant mexanikasi, so'ngra Bambi darsligi bo'yicha umumiy nisbiylik nazariyasi."),
    'home.startCta': L('Open the roadmap', 'Открыть маршрут', "Yo'l xaritasini ochish"),
    'home.news': L('News', 'Новости', 'Yangiliklar'),
    'home.lectTitle': L('Video lectures', 'Видеолекции', "Video ma'ruzalar"),
    'home.lectText': L(
      'Prof. Abdujabbarov teaches theoretical mechanics, electrodynamics and Wolfram Mathematica on YouTube, in Uzbek.',
      'Профессор Абдужаббаров читает курсы теоретической механики, электродинамики и Wolfram Mathematica на YouTube, на узбекском языке.',
      "Professor Abdujabbarov nazariy mexanika, elektrodinamika va Wolfram Mathematica bo'yicha ma'ruzalarni YouTube'da o'zbek tilida o'qiydi."),
    'home.lectCta': L('All lectures', 'Все лекции', "Barcha ma'ruzalar"),

    'people.title': L('People', 'Участники', "A'zolar"),
    'people.intro': L(
      'The group brings together bachelor’s, master’s and PhD students around two leading researchers.',
      'Группа объединяет бакалавров, магистрантов и докторантов вокруг двух ведущих исследователей.',
      "Guruh bakalavr, magistr va doktorantlarni ikki yetakchi tadqiqotchi atrofida birlashtiradi."),
    'people.leaders': L('Group leaders', 'Руководители группы', 'Guruh rahbarlari'),
    'people.roleLead': L('Group leader', 'Руководитель группы', 'Guruh rahbari'),
    'people.roleCo': L('Co-leader', 'Соруководитель', 'Hamrahbar'),
    'people.affil': L('Affiliations', 'Места работы', 'Ish joylari'),
    'people.affilNote': L('As listed in recent publications.', 'По данным недавних публикаций.', "So'nggi nashrlarda ko'rsatilganidek."),
    'people.interests': L('Research interests', 'Научные интересы', 'Ilmiy qiziqishlar'),
    'people.alt': L('Also spelled', 'Другое написание', 'Boshqa yozilishi'),
    'people.members': L('Students and researchers', 'Студенты и исследователи', 'Talabalar va tadqiqotchilar'),
    'people.total': L(
      'The group has more than 50 members. The cards below show those with a profile on this page.',
      'В группе более 50 участников. Ниже показаны те, у кого есть профиль на этой странице.',
      "Guruhda 50 dan ortiq a'zo bor. Quyida shu sahifada profili bor a'zolar ko'rsatilgan."),
    'people.level': L('Level', 'Уровень', 'Daraja'),
    'people.all': L('All', 'Все', 'Hammasi'),
    'lvl.phd': L("PhD students", "Докторанты (PhD)", "Doktorantlar (PhD)"),
    'lvl.msc': L("Master’s students", "Магистранты", "Magistrantlar"),
    'lvl.bsc': L("Bachelor’s students", "Студенты бакалавриата", "Bakalavr talabalari"),
    'lvl.doc': L("PhD", "PhD", "PhD"),
    'lvl.postdoc': L("PhD (Post-Doc)", "PhD (постдок)", "PhD (Post-Doc)"),
    'role.phd': L('PhD student', 'Докторант (PhD)', 'Doktorant (PhD)'),
    'role.msc': L('Master’s student', 'Магистрант', 'Magistrant'),
    'role.bsc': L('Bachelor’s student', 'Студент бакалавриата', 'Bakalavr talabasi'),
    'role.doc': L("PhD", "PhD", "PhD"),
    'role.postdoc': L("PhD (Post-Doc)", "PhD (постдок)", "PhD (Post-Doc)"),
    'role.member': L('Group member', 'Участник группы', "Guruh a'zosi"),
    'people.paper1': L('{n} paper', '{n} статья', '{n} ta maqola'),
    'people.papers': L('{n} papers', 'Статей: {n}', '{n} ta maqola'),
    'people.profileNote': L("Papers are compiled from public records (journal pages, arXiv and citation databases) and matched by author name. Scopus links open each member’s author profile. If a paper is missing or wrongly attributed, tell the group and it will be corrected.", "Статьи собраны из открытых источников (страницы журналов, arXiv, наукометрические базы) и сопоставлены по имени автора. Ссылки Scopus ведут на профиль автора. Если статья пропущена или указана ошибочно, сообщите группе, и это будет исправлено.", "Maqolalar ochiq manbalardan (jurnal sahifalari, arXiv va ilmiy bazalar) yig'ilgan va muallif ismi bo'yicha moslashtirilgan. Scopus havolalari muallif profilini ochadi. Maqola yetishmasa yoki noto'g'ri ko'rsatilgan bo'lsa, guruhga xabar bering, tuzatiladi."),
    'people.template': L(
      'These are template cards. Replace them with real members in js/data.js.',
      'Это шаблонные карточки. Замените их данными участников в js/data.js.',
      "Bu namunaviy kartochkalar. Ularni js/data.js faylida haqiqiy a'zolar bilan almashtiring."),
    'people.phName': L('Member name', 'Имя участника', "A'zo ismi"),
    'people.noMatch': L('No members match these filters.', 'Нет участников по выбранным фильтрам.', "Tanlangan filtrlarga mos a'zo yo'q."),
    'people.joinTitle': L('Want to work with us?', 'Хотите работать с нами?', 'Biz bilan ishlashni xohlaysizmi?'),
    'people.joinText': L('Read the roadmap, then write to the group leaders.', 'Изучите маршрут, затем напишите руководителям группы.', "Yo'l xaritasini o'qing, so'ng guruh rahbarlariga yozing."),
    'people.joinCta': L('How to join', 'Как присоединиться', "Qanday qo'shilish mumkin"),

    'research.title': L('Research', 'Исследования', 'Tadqiqotlar'),
    'research.intro': L(
      'Our work is in classical general relativity and its tests: what black holes and other compact objects do to light and matter, and how observations can tell Einstein’s theory from its alternatives.',
      'Мы работаем в области классической общей теории относительности и её проверок: как чёрные дыры и другие компактные объекты влияют на свет и вещество и как наблюдения позволяют отличить теорию Эйнштейна от альтернатив.',
      "Biz klassik umumiy nisbiylik nazariyasi va uning sinovlari bilan shug'ullanamiz: qora tuynuklar va boshqa kompakt obyektlar yorug'lik va moddaga qanday ta'sir qiladi hamda kuzatuvlar Eynshteyn nazariyasini muqobillaridan qanday farqlashga imkon beradi."),
    'research.eq': L('Key equation', 'Ключевое уравнение', 'Asosiy tenglama'),
    'research.kw': L('Keywords', 'Ключевые слова', "Kalit so'zlar"),
    'research.read': L('Read first', 'Сначала прочитать', "Avval o'qing"),
    'research.papers': L('Papers from the group', 'Статьи группы', 'Guruh maqolalari'),
    'research.beyondTitle': L('Beyond Einstein', 'За пределами Эйнштейна', 'Eynshteyndan tashqari'),
    'research.beyondText': L(
      'Across all five themes we compare Einstein’s black holes with alternatives: regular and quantum-corrected black holes, Horndeski and other modified gravity, wormholes, dark-matter halos and plasma environments.',
      'Во всех пяти направлениях мы сравниваем чёрные дыры Эйнштейна с альтернативами: регулярными и квантово-скорректированными чёрными дырами, гравитацией Хорндески и другими модифицированными теориями, кротовыми норами, гало тёмной материи и плазменным окружением.',
      "Barcha besh yo'nalishda Eynshteyn qora tuynuklarini muqobillari bilan solishtiramiz: regulyar va kvant tuzatmali qora tuynuklar, ⟦Horndeski⟧ va boshqa modifikatsiyalangan gravitatsiya, chuvalchang tuynuklar, qorong'i materiya galolari va plazma muhiti."),

    'pubs.title': L('Publications', 'Публикации', 'Nashrlar'),
    'pubs.intro': L(
      'Selected papers by the group leaders with their students and collaborators. The complete lists are on ORCID, INSPIRE-HEP and Google Scholar.',
      'Избранные статьи руководителей группы, их студентов и соавторов. Полные списки — на ORCID, INSPIRE-HEP и Google Scholar.',
      "Guruh rahbarlarining o'quvchilari va hamkorlari bilan birgalikdagi tanlangan maqolalari. To'liq ro'yxatlar ORCID, INSPIRE-HEP va Google Scholar'da."),
    'pubs.theme': L('Theme', 'Направление', "Yo'nalish"),
    'pubs.all': L('All themes', 'Все направления', "Barcha yo'nalishlar"),
    'pubs.search': L('Search title or author', 'Поиск по названию или автору', "Sarlavha yoki muallif bo'yicha qidirish"),
    'pubs.shown': L('Showing {a} of {b}', 'Показано {a} из {b}', "{b} tadan {a} tasi ko'rsatilmoqda"),
    'pubs.none': L('No papers match this search.', 'Ничего не найдено.', 'Hech narsa topilmadi.'),
    'pubs.preprint': L('Preprint', 'Препринт', 'Preprint'),
    'pubs.page': L('Journal page', 'Страница статьи', 'Jurnal sahifasi'),
    'pubs.coauth': L('Co-authors include {name}', 'Среди соавторов: {name}', 'Hammualliflar orasida: {name}'),
    'pubs.profiles': L('Complete publication lists', 'Полные списки публикаций', "To'liq nashrlar ro'yxati"),
    'pubs.orcid': L('ORCID profile', 'Профиль ORCID', 'ORCID profili'),
    'pubs.inspire': L('INSPIRE-HEP search', 'Поиск в INSPIRE-HEP', "INSPIRE-HEP'da qidirish"),
    'pubs.scholarProfile': L('Google Scholar profile', 'Профиль Google Scholar', "Google Scholar profili"),
    'pubs.scholar': L('Google Scholar search', 'Поиск в Google Scholar', "Google Scholar'da qidirish"),

    'lect.title': L('Lectures', 'Лекции', "Ma'ruzalar"),
    'lect.intro': L(
      'Video courses recorded by Prof. Abdujabbarov for the group, in Uzbek. The mechanics course follows the chapter order of Landau and Lifshitz, Volume 1.',
      'Видеокурсы профессора Абдужаббарова для группы, на узбекском языке. Курс механики следует порядку глав первого тома Ландау и Лифшица.',
      "Professor Abdujabbarov guruh uchun yozib olgan video kurslar, o'zbek tilida. Mexanika kursi Landau va Lifshitsning 1-tomi boblari tartibiga amal qiladi."),
    'lect.channel': L('YouTube channel: Nazariy astrofizika', 'Канал на YouTube: Nazariy astrofizika', "YouTube kanali: Nazariy astrofizika"),
    'lect.resume': L('Continue from {t}', 'Продолжить с {t}', 'Davom ettirish: {t}'),
    'lect.auto': L('Play the next lecture automatically', 'Автоматически включать следующую лекцию', "Keyingi ma'ruzani avtomatik yoqish"),
    'lect.err': L("This video can't be played on this page.", 'Это видео нельзя воспроизвести на этой странице.', "Bu videoni shu sahifada ijro etib bo'lmadi."),
    'lect.fileHint': L('Open the site through a web server (see the README), not as a local file.', 'Откройте сайт через веб-сервер (см. README), а не как локальный файл.', "Saytni lokal fayl sifatida emas, veb-server orqali oching (README'ga qarang)."),
    'lect.done': L('Watched', 'Просмотрено', "Ko'rilgan"),
    "m.signin": L("Sign in", "Войти", "Kirish"),
    "m.register": L("Create account", "Создать аккаунт", "Ro'yxatdan o'tish"),
    "m.signout": L("Sign out", "Выйти", "Chiqish"),
    "m.account": L("Account", "Аккаунт", "Hisob"),
    "m.signedAs": L("Signed in as {name}", "Вы вошли как {name}", "Siz {name} sifatida kirdingiz"),
    "m.first": L("First name", "Имя", "Ism"),
    "m.last": L("Last name", "Фамилия", "Familiya"),
    "m.pass": L("Password", "Пароль", "Parol"),
    "m.passNew": L("New password (6+ characters)", "Новый пароль (от 6 символов)", "Yangi parol (kamida 6 belgi)"),
    "m.passOld": L("Current password", "Текущий пароль", "Joriy parol"),
    "m.passHint": L("At least 6 characters", "Не менее 6 символов", "Kamida 6 belgi"),
    "m.code": L("Group access code", "Код доступа группы", "Guruh kirish kodi"),
    "m.codeHint": L("Ask your supervisor or a group administrator for the code.", "Спросите код у руководителя или администратора группы.", "Kodni rahbaringizdan yoki guruh administratoridan so'rang."),
    "m.errCode": L("Enter the group access code.", "Введите код доступа группы.", "Guruh kirish kodini kiriting."),
    "m.change": L("Change password", "Сменить пароль", "Parolni o'zgartirish"),
    "m.saved": L("Saved", "Сохранено", "Saqlandi"),
    "m.show": L("Show password", "Показать пароль", "Parolni ko'rsatish"),
    "m.hide": L("Hide password", "Скрыть пароль", "Parolni yashirish"),
    "m.close": L("Close", "Закрыть", "Yopish"),
    "m.wait": L("Please wait…", "Подождите…", "Kuting…"),
    "m.noAcct": L("No account yet?", "Нет аккаунта?", "Hisobingiz yo'qmi?"),
    "m.haveAcct": L("Already have an account?", "Уже есть аккаунт?", "Hisobingiz bormi?"),
    "m.lockTitle": L("Members only", "Только для участников", "Faqat a'zolar uchun"),
    "m.lock.lectures": L("Sign in to watch the video lectures.", "Войдите, чтобы смотреть видеолекции.", "Video ma'ruzalarni ko'rish uchun tizimga kiring."),
    "m.lock.books": L("Sign in to open the reading list and the library.", "Войдите, чтобы открыть список литературы и библиотеку.", "Adabiyotlar ro'yxati va kutubxonani ochish uchun tizimga kiring."),
    "m.lock.generic": L("Sign in to see this page.", "Войдите, чтобы увидеть эту страницу.", "Bu sahifani ko'rish uchun tizimga kiring."),
    "m.lockNote": L("New here? Create an account with your first and last name.", "Впервые здесь? Создайте аккаунт, указав имя и фамилию.", "Birinchi marta kelganmisiz? Ism va familiyangiz bilan hisob yarating."),
    "m.network": L("Could not reach the server. Check your connection and try again.", "Не удалось связаться с сервером. Проверьте соединение и повторите.", "Serverga ulanib bo'lmadi. Internetni tekshirib, qayta urinib ko'ring."),
    "m.timeout": L("The server did not answer in time. Try again.", "Сервер не ответил вовремя. Повторите попытку.", "Server o'z vaqtida javob bermadi. Qayta urinib ko'ring."),
    "m.errCreds": L("Wrong name or password.", "Неверное имя или пароль.", "Ism yoki parol noto'g'ri."),
    "m.errTries": L("Too many attempts. Try again in 10 minutes.", "Слишком много попыток. Повторите через 10 минут.", "Juda ko'p urinish. 10 daqiqadan so'ng qayta urining."),
    "m.errExists": L("An account with this name already exists.", "Аккаунт с таким именем уже существует.", "Bunday ismli hisob allaqachon bor."),
    "m.errPass": L("The password must have at least 6 characters.", "Пароль должен содержать не менее 6 символов.", "Parol kamida 6 belgidan iborat bo'lishi kerak."),
    "m.errName": L("Enter your first and last name.", "Введите имя и фамилию.", "Ism va familiyangizni kiriting."),
    "m.errReg": L("Too many sign-ups right now. Try again later.", "Сейчас слишком много регистраций. Повторите позже.", "Hozir ro'yxatdan o'tish juda ko'p. Keyinroq urinib ko'ring."),
    "m.errAuth": L("Your session has ended. Please sign in again.", "Сеанс завершён. Войдите снова.", "Seans tugadi. Qayta kiring."),
    "m.errPerm": L("You do not have permission for this.", "Нет прав на это действие.", "Buning uchun ruxsat yo'q."),
    "m.demo": L("Preview mode: accounts are simulated and kept only in this browser. To try the admin tools, sign in as Demo Admin with the password demo1234.", "Режим предпросмотра: аккаунты имитируются и хранятся только в этом браузере. Чтобы попробовать админ-функции, войдите как Demo Admin с паролем demo1234.", "Ko'rib chiqish rejimi: hisoblar faqat shu brauzerda saqlanadi. Admin imkoniyatlarini sinash uchun Demo Admin sifatida demo1234 paroli bilan kiring."),
    "m.members": L("Members", "Участники", "A'zolar"),
    "m.admin": L("admin", "админ", "admin"),
    "m.makeAdmin": L("Make admin", "Сделать админом", "Admin qilish"),
    "m.removeAdmin": L("Remove admin", "Снять админа", "Adminlikdan olish"),
    "m.delete": L("Delete", "Удалить", "O'chirish"),
    "m.sure": L("Click again to confirm", "Нажмите ещё раз для подтверждения", "Tasdiqlash uchun yana bosing"),
    "m.lib.title": L("Members' library", "Библиотека участников", "A'zolar kutubxonasi"),
    'm.lib.intro': L("Books and notes shared by group members for this subject. Anyone signed in can add files, in any subject.", "Книги и конспекты участников группы по этому предмету. Любой вошедший участник может добавить файл по любому предмету.", "A'zolar bu fan bo'yicha bo'lishgan kitoblar va konspektlar. Tizimga kirgan har bir a'zo istalgan fan bo'yicha fayl qo'sha oladi."),
    "m.lib.search": L("Search the library…", "Поиск по библиотеке…", "Kutubxonadan qidirish…"),
    "m.lib.upload": L("Upload a book", "Загрузить книгу", "Kitob yuklash"),
    "m.lib.open": L("Open", "Открыть", "Ochish"),
    "m.lib.download": L("Download", "Скачать", "Yuklab olish"),
    "m.lib.empty": L("Nothing here yet.", "Пока ничего нет.", "Hozircha hech narsa yo'q."),
    "m.lib.cat3": L("Other", "Другое", "Boshqa"),
    'm.lib.emptySub': L("No files for this subject yet. Use “Upload a book” to add the first one.", "Файлов по этому предмету пока нет. Нажмите «Загрузить книгу», чтобы добавить первый.", "Bu fan bo'yicha hozircha fayl yo'q. Birinchisini qo'shish uchun «Kitob yuklash» tugmasini bosing."),
    "m.lib.fTitle": L("Title", "Название", "Nomi"),
    "m.lib.fAuthor": L("Author", "Автор", "Muallif"),
    'm.lib.fCat': L("Subject", "Предмет", "Fan"),
    "m.lib.fFiles": L("Files", "Файлы", "Fayllar"),
    "m.lib.go": L("Upload", "Загрузить", "Yuklash"),
    "m.lib.pick": L("Choose at least one file.", "Выберите хотя бы один файл.", "Kamida bitta fayl tanlang."),
    "m.lib.addedBy": L("Added by {name}", "Добавил(а): {name}", "Qo'shgan: {name}"),
    "m.lib.loading": L("Loading…", "Загрузка…", "Yuklanmoqda…"),
    "m.lib.retry": L("Try again", "Повторить", "Qayta urinish"),
    "m.pl.title": L("Playlists from members", "Плейлисты участников", "A'zolar pleylistlari"),
    "m.pl.intro": L("Videos and playlists added by group members. A playlist is split into its topics, like the courses above; every topic plays on this page and remembers where you stopped.", "Видео и плейлисты, добавленные участниками. Плейлист разбит на темы, как курсы выше; каждая тема воспроизводится на этой странице и помнит, где вы остановились.", "A'zolar qo'shgan video va pleylistlar. Pleylist yuqoridagi kurslar kabi mavzularga ajratib ko'rsatiladi; har bir mavzu shu sahifada ijro etiladi va qayerda to'xtaganingizni eslab qoladi."),
    "m.pl.add": L("Add a video or playlist", "Добавить видео или плейлист", "Video yoki pleylist qo'shish"),
    "m.pl.url": L("YouTube link (video or playlist)", "Ссылка YouTube (видео или плейлист)", "YouTube havolasi (video yoki pleylist)"),
    "m.pl.name": L("Title (optional, found automatically)", "Название (необязательно, определится само)", "Nomi (ixtiyoriy, o'zi aniqlanadi)"),
    "m.pl.save": L("Save", "Сохранить", "Saqlash"),
    "m.pl.bad": L("Link not recognised.", "Ссылка не распознана.", "Havola tushunarsiz."),
    "m.pl.play": L("Play", "Смотреть", "Ko'rish"),
    "m.pl.kindList": L("Playlist", "Плейлист", "Pleylist"),
    "m.pl.kindVideo": L("Video", "Видео", "Video"),
    "m.up.run": L("Uploading {n} of {t}", "Загрузка: {n} из {t}", "Yuklanmoqda: {n} / {t}"),
    "m.up.done": L("Upload complete", "Загрузка завершена", "Yuklash tugadi"),
    "m.up.err": L("Some files were not uploaded", "Не все файлы загружены", "Ba'zi fayllar yuklanmadi"),
    "m.up.details": L("Details", "Подробнее", "Batafsil"),
    "m.pl.count": L("{n} topics", "тем: {n}", "{n} ta mavzu"),
    "m.pl.loading": L("Loading the topics of this playlist…", "Загружаем темы этого плейлиста…", "Pleylist mavzulari yuklanmoqda…"),
    "m.pl.noTopics": L("The list of topics could not be loaded, so the playlist plays as one item.", "Не удалось загрузить список тем, поэтому плейлист воспроизводится целиком.", "Mavzular ro'yxatini yuklab bo'lmadi, shuning uchun pleylist butunligicha ijro etiladi."),
    "m.pl.videos": L("Single videos", "Отдельные видео", "Alohida videolar"),
    "m.pl.empty": L("No playlists yet.", "Плейлистов пока нет.", "Pleylistlar hozircha yo'q."),
    'm.web.title': L("Links from members", "Ссылки участников", "A'zolar havolalari"),
    'm.web.intro': L("Useful sites, notes and papers that members found for this subject.", "Полезные сайты, конспекты и статьи, которые участники нашли по этому предмету.", "A'zolar bu fan bo'yicha topgan foydali saytlar, konspektlar va maqolalar."),
    'm.web.add': L("Add a link", "Добавить ссылку", "Havola qo'shish"),
    'm.web.url': L("Link (web address)", "Ссылка (адрес страницы)", "Havola (veb manzil)"),
    'm.web.name': L("Title (optional, the site name is used if empty)", "Название (необязательно, иначе возьмётся имя сайта)", "Nomi (ixtiyoriy, bo'sh bo'lsa sayt nomi olinadi)"),
    'm.web.bad': L("Enter a web address that starts with http:// or https:// (for example https://arxiv.org/…).", "Введите адрес, начинающийся с http:// или https:// (например, https://arxiv.org/…).", "http:// yoki https:// bilan boshlanadigan manzil kiriting (masalan, https://arxiv.org/…)."),
    'm.web.empty': L("No links for this subject yet.", "Ссылок по этому предмету пока нет.", "Bu fan bo'yicha havolalar hozircha yo'q."),
    "books.cover.notes": L("Notes", "Конспект", "Konspekt"),
    "books.cover.review": L("Review", "Обзор", "Sharh"),
    'lect.watch': L('Watch on YouTube', 'Смотреть на YouTube', "YouTube'da ko'rish"),
    'lect.play': L('Play here', 'Смотреть здесь', "Shu yerda ko'rish"),
    'lect.lang': L('Language: Uzbek', 'Язык: узбекский', "Til: o'zbek"),
    'lect.mech': L('Theoretical mechanics', 'Теоретическая механика', 'Nazariy mexanika'),
    'lect.mechText': L(
      'Lagrangian and Hamiltonian mechanics in seven chapters: equations of motion, conservation laws, integration, collisions, small oscillations, rigid bodies and canonical equations.',
      'Лагранжева и гамильтонова механика в семи главах: уравнения движения, законы сохранения, интегрирование, столкновения, малые колебания, твёрдое тело и канонические уравнения.',
      "Lagranj va Hamilton mexanikasi yetti bobda: harakat tenglamalari, saqlanish qonunlari, integrallash, to'qnashuvlar, kichik tebranishlar, qattiq jism va kanonik tenglamalar."),
    'lect.em': L('Electrodynamics', 'Электродинамика', 'Elektrodinamika'),
    'lect.emText': L(
      'Special relativity, tensors and relativistic mechanics: the base for electrodynamics and for the geometry of spacetime.',
      'Специальная теория относительности, тензоры и релятивистская механика: основа для электродинамики и геометрии пространства-времени.',
      "Maxsus nisbiylik, tenzorlar va relyativistik mexanika: elektrodinamika va fazo-vaqt geometriyasi uchun asos."),
    'lect.math': L('Wolfram Mathematica', 'Wolfram Mathematica', 'Wolfram Mathematica'),
    'lect.mathText': L(
      'Four short lessons from the first notebook to derivatives, integrals, series, lists, vectors and matrices: the tools you will use for geodesics and tensors.',
      'Четыре коротких урока: от первого блокнота до производных, интегралов, рядов, списков, векторов и матриц. Эти инструменты понадобятся для геодезических и тензоров.',
      "To'rt qisqa dars: birinchi daftardan hosila, integral, qator, list, vektor va matritsalargacha. Bu vositalar geodezik chiziqlar va tenzorlar bilan ishlashda kerak bo'ladi."),
    'lect.h': L('h', 'ч', 'soat'),
    'lect.min': L('min', 'мин', 'daq.'),
    'lect.notes': L('Free lecture notes and courses', 'Свободные конспекты и курсы', "Ochiq ma'ruza matnlari va kurslar"),
    'lect.notesText': L('Written notes that pair well with the videos.', 'Письменные конспекты, которые хорошо дополняют видео.', "Videolarni yaxshi to'ldiruvchi yozma matnlar."),
    'lect.pick': L('Choose a lecture to play it here.', 'Выберите лекцию, чтобы смотреть её здесь.', "Bu yerda ko'rish uchun ma'ruzani tanlang."),

    'books.title': L('Books', 'Книги', 'Kitoblar'),
    'books.intro': L("Choose a subject, then open the group’s own resources or the internet resources for it. Any signed-in member can add a file or a link.", "Выберите предмет, затем откройте ресурсы группы или интернет-ресурсы по нему. Любой вошедший участник может добавить файл или ссылку.", "Fanni tanlang, so'ng u bo'yicha guruh resurslarini yoki internet resurslarini oching. Tizimga kirgan har bir a'zo fayl yoki havola qo'sha oladi."),
    'books.tab.mech': L('Classical mechanics', 'Классическая механика', 'Klassik mexanika'),
    'books.tab.em': L('Electrodynamics', 'Электродинамика', 'Elektrodinamika'),
    'books.tab.qm': L('Quantum mechanics', 'Квантовая механика', 'Kvant mexanikasi'),
    'books.tab.gr': L('General relativity', 'Общая теория относительности', 'Umumiy nisbiylik nazariyasi'),
    'books.tab.vt': L("Vectors and tensors", "Векторы и тензоры", "Vektor va tenzorlar"),
    'books.subjects': L("Subject", "Предмет", "Fan"),
    'books.tab.bh': L('Black holes and lensing', 'Чёрные дыры и линзирование', 'Qora tuynuklar va linzalanish'),
    'books.tab.math': L('Mathematical methods', 'Математические методы', 'Matematik usullar'),
    'books.lvl.intro': L('Introductory', 'Вводный', "Boshlang'ich"),
    'books.lvl.core': L('Core', 'Основной', 'Asosiy'),
    'books.lvl.adv': L('Advanced', 'Продвинутый', "Ilg'or"),
    'books.lvl.review': L('Review article', 'Обзорная статья', 'Sharh maqolasi'),
    'books.free': L('Free', 'Бесплатно', 'Bepul'),
    'books.mode.group': L("Group resources", "Ресурсы группы", "Guruh resurslari"),
    'books.mode.web': L("Internet resources", "Интернет-ресурсы", "Internet resurslari"),
    'books.startHere': L('Start here', 'Начните с этого', 'Shundan boshlang'),
    'books.open': L('Open', 'Открыть', 'Ochish'),
    'books.pdf': L('Open PDF', 'Открыть PDF', 'PDFni ochish'),
    'books.page': L('Open free text', 'Открыть бесплатный текст', 'Bepul matnni ochish'),
    'books.find': L("Find in Group resources", "Найти в ресурсах группы", "Guruh resurslaridan topish"),
    'books.getBook': L("Get the book (Group resources)", "Получить книгу (ресурсы группы)", "Kitobni olish (guruh resurslari)"),
    'books.publisher': L('Publisher page', 'Страница издателя', 'Nashriyot sahifasi'),
    'books.listNote': L("These books are under copyright, so we can only list them. Find a copy in your university library or on Open Library, or look in Group resources.", "Эти книги защищены авторским правом, поэтому мы можем только перечислить их. Найдите экземпляр в университетской библиотеке или на Open Library, либо посмотрите в «Ресурсах группы».", "Bu kitoblar mualliflik huquqi bilan himoyalangan, shuning uchun biz ularni faqat ro'yxatga kiritamiz. Nusxasini universitet kutubxonasidan yoki Open Library'dan toping, yoki «Guruh resurslari»dan qidiring."),
    'books.webNote': L("Links for this subject: free texts that open in one click, books to find a copy of, and links added by members.", "Ссылки по этому предмету: бесплатные тексты, которые открываются одним щелчком, книги, экземпляр которых нужно найти, и ссылки участников.", "Bu fan bo'yicha havolalar: bir bosishda ochiladigan bepul matnlar, nusxasini topish kerak bo'lgan kitoblar va a'zolar qo'shgan havolalar."),
    'books.sec.free': L("Free to read online", "Бесплатно читать онлайн", "Internetda bepul o'qish"),
    'books.sec.copy': L("Textbooks: find a copy", "Учебники: найти экземпляр", "Darsliklar: nusxasini topish"),
    'books.groupOff': L("Group resources need the members area, which is not set up on this copy of the site.", "Ресурсы группы требуют раздела для участников, который не настроен на этой копии сайта.", "Guruh resurslari a'zolar bo'limini talab qiladi, u saytning bu nusxasida sozlanmagan."),
    'books.copy': L('Find a copy', 'Найти экземпляр', 'Nusxasini topish'),
    'books.chapters': L('Chapters', 'Главы', 'Boblar'),
    'books.mathTitle': L('Practise with Mathematica', 'Практика в Mathematica', 'Mathematica bilan mashq qiling'),
    'books.mathText': L(
      'Four short video lessons cover the tools you need for symbolic calculus, vectors and matrices.',
      'Четыре коротких видеоурока охватывают инструменты для символьного анализа, векторов и матриц.',
      "To'rt qisqa video dars simvolli hisob, vektor va matritsalar uchun kerakli vositalarni o'z ichiga oladi."),
    'books.mathCta': L('Open the lessons', 'Открыть уроки', 'Darslarni ochish'),

    'start.title': L('Start here', 'Новичкам', 'Yangilar uchun'),
    'start.intro': L(
      'A suggested path from first principles to your first research project. Move faster through the topics you already know.',
      'Рекомендуемый путь от основ до первого исследовательского проекта. Темы, которые вы уже знаете, можно проходить быстрее.',
      "Asoslardan birinchi ilmiy loyihagacha tavsiya etilgan yo'l. Allaqachon bilgan mavzularingizni tezroq o'tishingiz mumkin."),
    'start.step': L('Step', 'Шаг', 'Qadam'),
    'start.books': L('Books', 'Книги', 'Kitoblar'),
    'start.videos': L('Video course', 'Видеокурс', 'Video kurs'),
    'start.watch': L('Open the course', 'Открыть курс', 'Kursni ochish'),
    'start.classics': L('Classic papers by theme', 'Классические статьи по направлениям', "Yo'nalishlar bo'yicha klassik maqolalar"),
    'start.classicsText': L(
      'Read these before your first project. Each link searches Google Scholar.',
      'Прочитайте их перед первым проектом. Каждая ссылка ведёт на поиск в Google Scholar.',
      "Birinchi loyihadan oldin shularni o'qing. Har bir havola Google Scholar'da qidiradi."),
    'start.find': L('Find', 'Найти', 'Topish'),
    'start.tools': L('Tools of the trade', 'Рабочие инструменты', 'Ish vositalari'),
    'start.toolsText': L(
      'Software and databases the group uses or recommends.',
      'Программы и базы данных, которые группа использует или рекомендует.',
      "Guruh foydalanadigan yoki tavsiya qiladigan dasturlar va ma'lumotlar bazalari."),

    'join.title': L('Join us', 'Вступить', "Qo'shilish"),
    'join.intro': L(
      'The group welcomes bachelor’s, master’s and PhD students who want to work on gravity and black holes.',
      'Группа приглашает бакалавров, магистрантов и докторантов, которые хотят заниматься гравитацией и чёрными дырами.',
      "Guruh gravitatsiya va qora tuynuklar bilan shug'ullanishni istagan bakalavr, magistr va doktorantlarni kutib oladi."),
    'join.how': L('How to start', 'Как начать', 'Qanday boshlash mumkin'),
    'join.s1t': L('Read the roadmap', 'Изучите маршрут', "Yo'l xaritasini o'qing"),
    'join.s1d': L(
      'Work through the Start here page and the first chapters of Bambi’s book.',
      'Пройдите страницу «Новичкам» и первые главы книги Бамби.',
      "«Yangilar uchun» sahifasini va Bambi kitobining dastlabki boblarini o'rganing."),
    'join.s2t': L('Write to us', 'Напишите нам', 'Bizga yozing'),
    'join.s2d': L(
      'Send a short note to a group leader: your level, what you have studied and what interests you.',
      'Отправьте короткое письмо руководителю группы: ваш уровень, что вы изучали и что вас интересует.',
      "Guruh rahbariga qisqa xat yuboring: darajangiz, nimalarni o'rganganingiz va nimaga qiziqishingiz."),
    'join.s3t': L('Agree a first project', 'Договоритесь о первом проекте', 'Birinchi loyihani kelishing'),
    'join.s3d': L(
      'Together with a supervisor, choose a small problem in one of the five themes and set a first goal.',
      'Вместе с руководителем выберите небольшую задачу в одном из пяти направлений и поставьте первую цель.',
      "Rahbar bilan birga besh yo'nalishdan birida kichik masala tanlang va birinchi maqsadni belgilang."),
    'join.contact': L('Contact', 'Контакты', 'Aloqa'),
    'join.email': L('Email', 'Эл. почта', 'Elektron pochta'),
    'join.copy': L('Copy', 'Копировать', 'Nusxalash'),
    'join.copied': L('Copied', 'Скопировано', 'Nusxalandi'),

    'footer.text': L(
      'Theoretical physics research group. Content last updated {date}.',
      'Исследовательская группа по теоретической физике. Содержимое обновлено {date}.',
      "Nazariy fizika tadqiqot guruhi. Mazmun {date} da yangilangan."),
    'footer.law': L(
      'Uzbek text follows the Latin alphabet revised by the law signed on 21 October 2026, in force from 22 April 2027.',
      'Узбекский текст набран латиницей в редакции закона, подписанного 21 октября 2026 года (вступает в силу 22 апреля 2027 года).',
      "Matn 2026-yil 21-oktabrda imzolangan qonun bilan yangilangan lotin alifbosida yozilgan (2027-yil 22-aprelda kuchga kiradi)."),
    'footer.toLegacy': L('', '', "⟦Sh Ch Oʻ Gʻ⟧ shaklida ko'rsatish"),
    'footer.toNew': L('', '', "Yangi alifboda (Ş Ç Ö Ğ) ko'rsatish")
  };

  function ui(key, vars) {
    var entry = UI[key];
    if (!entry) { if (window.console) console.warn('Missing UI key', key); return key; }
    var s = t(entry);
    if (vars) {
      Object.keys(vars).forEach(function (k) { s = s.split('{' + k + '}').join(vars[k]); });
    }
    return s;
  }

  window.L = L;
  window.SITE_I18N = {
    L: L, t: t, ui: ui, UI: UI, uzConvert: uzConvert,
    get lang() { return state.lang; },
    set lang(v) { state.lang = v; },
    get alpha() { return state.alpha; },
    set alpha(v) { state.alpha = v; }
  };
})();
