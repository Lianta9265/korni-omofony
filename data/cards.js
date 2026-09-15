(function () {
  const A = 'assets/cards/';
  const cards = [];
  const img = (sheet, card) => `${A}sheet-${String(sheet).padStart(2, '0')}-card-${String(card).padStart(2, '0')}.png`;
  const standalone = number => `${A}standalone-${number}.png`;

  function add(sheet, card, id, title, letters, correctLetter, correctCheck, distractors, note = '', needsReview = false) {
    cards.push({
      id, title, image: img(sheet, card), letterOptions: letters,
      correctLetter, checkOptions: [correctCheck, ...distractors],
      correctChecks: [correctCheck], explanation: `Проверяем ударением: ${correctCheck}.`,
      source: `Лист ${sheet}, карточка ${card}`, note, needsReview
    });
  }

  function pair(sheet, firstCard, spec) {
    const [a, b] = spec;
    const [aId, aTitle, aLetters, aLetter, aCheck, aExtra = [], aNote = '', aReview = false] = a;
    const [bId, bTitle, bLetters, bLetter, bCheck, bExtra = [], bNote = '', bReview = false] = b;
    add(sheet, firstCard, aId, aTitle, aLetters, aLetter, aCheck, [bCheck, ...aExtra], aNote, aReview);
    add(sheet, firstCard + 1, bId, bTitle, bLetters, bLetter, bCheck, [aCheck, ...bExtra], bNote, bReview);
  }

  function addStandalone(number, id, title, letters, correctLetter, correctCheck, distractors, note = '', needsReview = false) {
    add(number, 1, id, title, letters, correctLetter, correctCheck, distractors, note, needsReview);
    const card = cards[cards.length - 1];
    card.image = standalone(number);
    card.source = `Файл ${number}.png`;
  }

  pair(1, 1, [
    ['osvetit-fonarikom','осв_тить фонариком',['Е','Я'],'Е','све́т'],
    ['osvyatit-hram','осв_тить храм',['Е','Я'],'Я','свя́тость']
  ]);
  pair(1, 3, [
    ['poloskat-belyo','пол_скать бельё',['О','А'],'О','поло́щет',[], 'Форма «поло́щет» ставит вторую гласную корня под ударение.'],
    ['polaskat-kotyonka','пол_скать котёнка',['О','А'],'А','ла́ска']
  ]);
  pair(1, 5, [
    ['posedet','пос_деть от старости',['Е','И'],'Е','се́д'],
    ['posidet','пос_деть на диване',['Е','И'],'И','си́дя']
  ]);
  add(1,7,'primeryat','прим_рять платье',['Е','И'],'Е','ме́рить',['ми́р','чередование мер–мир']);
  add(1,8,'primiryat','прим_рять друзей',['Е','И'],'И','ми́р',['ме́рить','чередование мер–мир']);

  pair(2, 1, [
    ['zapivat','зап_вать водой',['И','Е'],'И','пи́ть'],
    ['zapevat','зап_вать песню',['И','Е'],'Е','пе́ть']
  ]);
  pair(2, 3, [
    ['razvevat','разв_вать флаг',['Е','И'],'Е','ве́ять'],
    ['razvivat','разв_вать память',['Е','И'],'И','разви́ть']
  ]);
  pair(2, 5, [
    ['razredit','разр_дить грядки',['Е','Я'],'Е','ре́дкий'],
    ['razryadit','разр_дить ружьё',['Е','Я'],'Я','разря́д']
  ]);
  pair(2, 7, [
    ['otvarit-kartofel','отв_рить картофель',['А','О'],'А','ва́рит'],
    ['otvorit-dver','отв_рить дверь',['А','О'],'О','затво́р']
  ]);

  pair(3, 1, [
    ['starozhil','ст_рожил нашего дома',['А','О'],'А','ста́рый'],
    ['storozhil','ст_рожил склад',['А','О'],'О','сто́рож']
  ]);
  pair(3, 3, [
    ['umolyat','ум_лять о помощи',['О','А'],'О','мо́лит'],
    ['umalyat','ум_лять заслуги друга',['О','А'],'А','ма́лый']
  ]);
  pair(3, 5, [
    ['vytisnit','выт_снить узор на коже',['И','Е'],'И','сти́снуть',[], 'Редкое значение: сделать тиснёный узор.'],
    ['vytesnit','выт_снить из автобуса',['И','Е'],'Е','те́сный']
  ]);
  pair(3, 7, [
    ['okotilas','кошка ок_тилась',['О','А'],'О','ко́т'],
    ['okatitsya','ок_титься водой',['О','А'],'А','ка́тит']
  ]);

  pair(4, 1, [
    ['nashchipat-zeleni','нащ_пать зелени',['И','Е'],'И','щи́плет'],
    ['nashchepat-luchiny','нащ_пать лучины',['И','Е'],'Е','ще́пка']
  ]);
  pair(4, 3, [
    ['prosveshchenie','просв_щение народа',['Е','Я'],'Е','све́т'],
    ['posvyashchenie','посв_щение в рыцари',['Е','Я'],'Я','свя́тость']
  ]);
  pair(4, 5, [
    ['chestolyubivyi','ч_столюбивый спортсмен',['Е','И'],'Е','че́сть'],
    ['chistoplotnyi','ч_стоплотный енот',['Е','И'],'И','чи́стый']
  ]);
  pair(4, 7, [
    ['prilepit','прил_пить марку',['Е','И'],'Е','ле́пит'],
    ['prilipat','прил_пать к стеклу',['Е','И'],'И','ли́пнет']
  ]);

  pair(5, 3, [
    ['pokorit','пок_рить вершину',['О','А'],'О','поко́рный'],
    ['pokarat','пок_рать злодея',['О','А'],'А','ка́ра']
  ]);
  pair(5, 5, [
    ['obizhat','об_жать друга',['И','Е'],'И','оби́да'],
    ['obezhat','об_жать стадион',['И','Е'],'Е','бе́г']
  ]);
  pair(5, 7, [
    ['ozim-vzoshla','оз_мь взошла',['И','Е'],'И','ози́мый',[], 'Термин «озимь» связан с озимыми посевами.'],
    ['udaritsya-ozem','удариться оз_мь',['И','Е'],'Е','зе́мли']
  ]);

  pair(6, 5, [
    ['sokrashchat','сокр_щать путь',['А','О'],'А','кра́ткий',['коро́ткий']],
    ['ukroshchat','укр_щать тигра',['А','О'],'О','кро́ткий']
  ]);
  pair(6, 7, [
    ['hvastlivyi','хв_стливый мальчик',['А','О'],'А','хва́стать'],
    ['hvostatyi','хв_статый лисёнок',['А','О'],'О','хво́ст']
  ]);

  pair(7, 1, [
    ['prozhivat','прож_вать в деревне',['Е','И'],'И','жи́ть'],
    ['prozhevat','прож_вать морковку',['И','Е'],'Е','жёваный']
  ]);
  add(7,3,'uvidal','ув_дал корабль',['И','Е'],'И','уви́деть',['приве́дший']);
  add(7,4,'uvyadal','ув_дал цветок',['Е','Я','И'],'Я','увя́дший',['уви́деть','приве́дший']);
  pair(7, 5, [
    ['speshite','сп_шите домой',['Е','И'],'Е','спе́шка'],
    ['spishite','сп_шите предложение',['Е','И'],'И','пи́шет']
  ]);
  pair(7, 7, [
    ['prividenie','прив_дение в замке',['И','Е'],'И','ви́деть'],
    ['privedenie','прив_дение к порядку',['И','Е'],'Е','привёл']
  ]);

  pair(8, 3, [
    ['nakalit','нак_лить сковороду',['А','О'],'А','нака́л'],
    ['nakolot','нак_лоть дров',['А','О'],'О','ко́лет']
  ]);
  pair(8, 7, [
    ['raportovat','р_портовать командиру',['А','О'],'А','ра́порт'],
    ['roptat','р_птать на судьбу',['А','О'],'О','ро́пот']
  ]);

  pair(10, 1, [
    ['skrepit','скр_пить листы',['Е','И'],'Е','скре́пка'],
    ['skripit','дверь скр_пит',['Е','И'],'И','скри́п']
  ]);
  pair(10, 3, [
    ['posvyatit-stihi','посв_тить стихи',['Я','Е'],'Я','свя́тость'],
    ['posvetit-fonarem','посв_тить фонарём',['Я','Е'],'Е','све́т']
  ]);
  add(10,5,'chistota','ч_стота в комнате',['И','А'],'И','чи́стый',['ча́стый']);
  add(10,6,'chastota','ч_стота пульса',['А','И'],'А','ча́стый',['чи́стый']);
  pair(10, 7, [
    ['obveval','ветер обв_вал дерево',['Е','И'],'Е','ве́ять'],
    ['obvival','вьюнок обв_вал забор',['Е','И'],'И','ви́ться']
  ]);

  add(11,2,'izdaleka','изд_лека виден маяк',['А','О'],'А','да́ль',['до́л']);
  add(11,4,'lenivyi','л_нивый мальчик',['Е','И'],'Е','ле́нь',['ли́нька']);
  add(11,5,'linyayushchii','л_нящий пёс',['И','Е'],'И','ли́нька',['ле́нь']);
  add(11,6,'pogodit','пог_дить минутку',['О','А'],'О','го́д',['го́дный','отгадка']);
  add(11,7,'pogadat','пог_дать на картах',['О','А'],'А','отга́дка',['год','го́дный']);
  add(11,8,'gromozdit','гром_здить коробки',['О','А'],'О','громо́здкий',['грома́да']);

  // Лист 16 заменяет ранний лист 12, кроме чистой исходной карточки «см_тённые листья».
  add(16,1,'smyatenie','см_тение в душе',['Я','Е'],'Я','смя́тый',['мёл']);
  add(16,2,'smetennye-listya','см_тённые листья',['Е','Я'],'Е','мёл',['смя́тый']);
  pair(16, 3, [
    ['tryasina','тр_сина болота',['Я','Е'],'Я','тря́ска'],
    ['treskuchii','тр_скучий мороз',['Я','Е'],'Е','тре́ск']
  ]);
  add(16,5,'stochit','ст_чить напильником',['О','А'],'О','сто́ченный',['ста́чанный']);
  add(16,6,'stachat','ст_чать шов',['О','А'],'А','ста́чанный',['то́чит']);
  pair(16, 7, [
    ['pristezhnoi','прист_жной воротник',['Е','Я'],'Е','пристёгнут'],
    ['pristyazhnaya','прист_жная лошадь',['Е','Я'],'Я','пристя́жка']
  ]);

  pair(13, 3, [
    ['pokayanie','пок_яние',['А','О'],'А','ка́яться'],
    ['uspokoenie','успок_ение',['А','О'],'О','поко́й']
  ]);
  pair(13, 5, [
    ['otdalennyi','отд_лённый дом',['А','О'],'А','да́ль'],
    ['gornaya-dolina','горная д_лина',['А','О'],'О','до́л']
  ]);
  pair(13, 7, [
    ['splochennyi','спл_чённый класс',['О','А'],'О','пло́тный'],
    ['vyplachennyi','выпл_ченный долг',['О','А'],'А','пла́та']
  ]);

  add(14,1,'shipovnik','ш_повник',['И','Е'],'И','ши́п',['ше́пот']);
  add(14,2,'sheptatsya','ш_птаться',['Е','И'],'Е','ше́пчет',['шип']);
  add(14,3,'neuvyadayushchii','неув_дающий цветок',['Я','И'],'Я','увя́нет',['уви́деть']);
  add(14,4,'vedomyi','многое пов_давший',['Е','И'],'И','ви́деть',['ве́дать']);
  add(14,5,'potryasenie','потр_сение',['Я','Е'],'Я','тря́ска',['тре́ск']);
  add(14,6,'blagoslovlyat','благосл_влять',['О','А'],'О','сло́во',['сла́ва']);
  add(14,7,'proslavlyat','просл_влять',['А','О'],'А','сла́ва',['сло́во']);
  // Лист 17 — поздняя копия листа 15; используем только его.
  pair(17, 1, [
    ['polinyat','пол_нять на солнце',['И','Е'],'И','ли́нька'],
    ['polenitsya','пол_ниться помощью',['И','Е'],'Е','ле́нь']
  ]);
  add(17,3,'ocharovatelnyi','оч_ровательный щенок',['А','О'],'А','ча́ры',['оче́й']);
  add(17,4,'plenitelnyi','пл_нительный голос',['А','Е'],'Е','пле́н',['ча́ры']);
  add(17,5,'upoitelnyi','уп_ительный аромат',['О','А'],'О','по́ит',['пой','пай']);
  add(17,6,'utomitelnyi','ут_мительный поход',['О','А'],'О','то́мный',['там']);

  pair(18, 1, [
    ['navodnenie','нав_днение',['О','А'],'О','во́дный'],
    ['navazhdenie','нав_ждение',['О','А'],'А','нава́ждение',[], 'Значение: видение, галлюцинация. Словарная форма.', true]
  ]);
  pair(18, 3, [
    ['voploshchenie','вопл_щение мечты',['О','А'],'О','пло́ть'],
    ['soglyadatai','тайный согл_датай',['О','Я'],'Я','взгля́д']
  ]);
  pair(18, 5, [
    ['pogloshchenie','погл_щение',['О','А'],'О','гло́тка'],
    ['oglashenie','огл_шение',['О','А'],'А','гла́с']
  ]);
  pair(18, 7, [
    ['osnashchenie','осн_щение',['А','О'],'А','осна́стка'],
    ['obosnovanie','обосн_вание',['А','О'],'О','осно́ва']
  ]);

  pair(19, 1, [
    ['otoshchat','от_щать',['О','А'],'О','то́щий'],
    ['ottashchit','отт_щить',['О','А'],'А','та́щит']
  ]);
  add(19,3,'spartakiada','Сп_ртакиада',['А','О'],'А','Спа́рта',['спо́рт']);
  add(19,4,'neissyakaemyi','неисс_каемый',['Е','И','Я'],'Я','исся́кнет',['сечь','си́то']);
  add(19,5,'sekator','с_катор',['Е','И','Я'],'Е','сечь',['исся́кнет','си́то']);
  add(19,6,'istochať','ист_чать запах',['Е','О','А'],'О','исто́чник',['ста́чивать','течь']);
  pair(19, 7, [
    ['vospalenie','восп_ление',['А','О'],'А','па́лит'],
    ['obogashchenie-final','обог_щение',['А','О'],'А','бога́тый']
  ]);

  const dictionaryCards = {
    navazhdenie: 'В школьной логике современного проверочного слова нет.',
    vospalenie: 'В этой карточке требуется классифицировать слово как словарное.'
  };
  cards.forEach(card => {
    if (!dictionaryCards[card.id]) return;
    card.checkMode = 'dictionary';
    card.checkOptions = ['словарное', 'проверяемое', 'чередование'];
    card.correctChecks = ['словарное'];
    card.explanation = dictionaryCards[card.id];
    card.note = dictionaryCards[card.id];
    card.needsReview = false;
  });
  const smetennye = cards.find(card => card.id === 'smetennye-listya');
  smetennye.image = img(12, 2);
  const chastota = cards.find(card => card.id === 'chastota');
  chastota.image = img(11, 1);
  const imageReplacements = {
    chestolyubivyi: 24, prilepit: 32, sokrashchat: 28, ukroshchat: 25,
    speshite: 27, spishite: 31, privedenie: 30, nakolot: 33,
    obveval: 34, linyayushchii: 35, pristyazhnaya: 37, vedomyi: 36
  };
  Object.entries(imageReplacements).forEach(([id, number]) => {
    const card = cards.find(item => item.id === id);
    card.image = standalone(number);
    card.source = `Файл ${number}.png`;
  });
  Object.assign(cards.find(card => card.id === 'prilepit'), {title:'прил_пить к стене'});
  Object.assign(cards.find(card => card.id === 'speshite'), {title:'сп_шите на урок'});
  Object.assign(cards.find(card => card.id === 'privedenie'), {title:'прив_дение к общему знаменателю'});
  Object.assign(cards.find(card => card.id === 'obveval'), {title:'обв_вать ветром'});
  Object.assign(cards.find(card => card.id === 'linyayushchii'), {title:'л_нючий пёс'});

  const plenitelnyi = cards.find(card => card.id === 'plenitelnyi');
  plenitelnyi.checkOptions = ['пле́н', 'спли́н'];
  plenitelnyi.correctChecks = ['пле́н'];
  const voploshchenie = cards.find(card => card.id === 'voploshchenie');
  voploshchenie.checkOptions = ['пло́ть', 'пла́та'];
  voploshchenie.correctChecks = ['пло́ть'];

  const inputCards = {
    navodnenie: ['подводный', 'водный', 'воды', 'водник'],
    soglyadatai: ['взгляд', 'глядя'],
    'obogashchenie-final': ['богатый', 'богатство']
  };
  cards.forEach(card => {
    if (!inputCards[card.id]) return;
    card.checkMode = 'input';
    card.inputAnswers = inputCards[card.id];
    card.correctChecks = inputCards[card.id];
    card.checkOptions = [];
    card.explanation = `Допустимый ответ: ${inputCards[card.id][0]}.`;
  });

  addStandalone(20,'uteshat-malysha','ут_шать малыша',['Е','И'],'Е','уте́шит',['ти́ше']);
  addStandalone(21,'utishat-emotsii','ут_шать эмоции',['Е','И'],'И','ти́ше',['уте́шит']);
  addStandalone(22,'zakosnelyi','зак_снелый в предрассудках',['А','О'],'О','ко́сность',[]);
  addStandalone(23,'rassekat-volny','расс_кать волны',['Е','И','Я'],'Е','рассе́чь',[]);

  const appendedInputCards = {
    zakosnelyi: ['косность'],
    'rassekat-volny': ['рассечь', 'сечь', 'рассёк']
  };
  cards.forEach(card => {
    if (!appendedInputCards[card.id]) return;
    card.checkMode = 'input';
    card.inputAnswers = appendedInputCards[card.id];
    card.correctChecks = appendedInputCards[card.id];
    card.checkOptions = [];
    card.explanation = `Допустимый ответ: ${appendedInputCards[card.id][0]}.`;
  });

  window.KORNI_CARDS = cards;
})();
