const assert = require('node:assert/strict');
const fs = require('node:fs');

global.window = {};
require('../data/cards.js');
const cards = window.KORNI_CARDS;

assert.equal(cards.length, 115);
assert.equal(new Set(cards.map(card => card.id)).size, cards.length);
assert.equal(new Set(cards.map(card => card.title)).size, cards.length);
assert.equal(cards.filter(card => !fs.existsSync(card.image)).length, 0);
assert.equal(cards.filter(card => card.needsReview).length, 0);
const expectedLetters = {
  prozhevat: 'Е', lenivyi: 'Е', blagoslovlyat: 'О',
  pristezhnoi: 'Е', pristyazhnaya: 'Я', navodnenie: 'О',
  navazhdenie: 'А', spartakiada: 'А', otoshchat: 'О',
  uvidal: 'И', uvyadal: 'Я', stochit: 'А', proslavlyat: 'А', sheptatsya: 'Е'
};
Object.entries(expectedLetters).forEach(([id, letter]) => {
  assert.equal(cards.find(card => card.id === id)?.correctLetter, letter, id);
});
assert.deepEqual(cards.filter(card => card.checkMode === 'dictionary').map(card => card.id), ['navazhdenie', 'vospalenie']);
assert.deepEqual(cards.filter(card => card.checkMode === 'stressed').map(card => card.id), []);
assert.deepEqual(cards.filter(card => card.checkMode === 'input').map(card => card.id), ['navodnenie', 'soglyadatai', 'obogashchenie-final', 'zakosnelyi', 'rassekat-volny']);
const smetennye = cards[69];
assert.equal(smetennye.id, 'smetennye-listya');
assert.equal(smetennye.title, 'см_тённые листья');
assert.equal(smetennye.image, 'assets/cards/sheet-12-card-02.png');
assert.equal(smetennye.correctLetter, 'Е');
assert.equal(smetennye.correctChecks[0], 'мёл');
assert.equal(smetennye.overlayCaption, undefined);
const spartakiada = cards.find(card => card.id === 'spartakiada');
assert.equal(spartakiada.correctChecks[0], 'Спа́рта');
assert.ok(spartakiada.checkOptions.includes('спо́рт'));
assert.equal(spartakiada.checkMode, undefined);
const sekator = cards.find(card => card.id === 'sekator');
assert.equal(sekator.correctChecks[0], 'сечь');
assert.equal(sekator.checkMode, undefined);
const neissyakaemyi = cards.find(card => card.id === 'neissyakaemyi');
assert.equal(neissyakaemyi.correctChecks[0], 'исся́кнет');
assert.ok(!neissyakaemyi.checkOptions.includes('Спа́рта'));
const expectedChecks = {
  uvidal: ['уви́деть', 'приве́дший'],
  uvyadal: ['увя́дший', 'уви́деть', 'приве́дший'],
  chastota: ['ча́стый', 'чи́стый'], pogodit: ['го́д', 'го́дный', 'отгадка'],
  pogadat: ['отга́дка', 'год', 'го́дный'],
  gromozdit: ['громо́здкий', 'грома́да'], stochit: ['ста́ченный', 'сто́ченный'],
  pristezhnoi: ['пристёгнут', 'пристя́жка'], pristyazhnaya: ['пристя́жка', 'пристёгнут'],
  sheptatsya: ['ше́пчет', 'шип'], neuvyadayushchii: ['увя́нет', 'уви́деть'],
  ocharovatelnyi: ['ча́ры', 'оче́й'], proslavlyat: ['сла́ва', 'сло́во']
};
Object.entries(expectedChecks).forEach(([id, options]) => {
  const card = cards.find(item => item.id === id);
  assert.deepEqual(new Set(card.checkOptions), new Set(options), id);
});
assert.equal(cards.find(card => card.id === 'chastota').image, 'assets/cards/sheet-11-card-01.png');
assert.deepEqual(cards.find(card => card.id === 'uvyadal').letterOptions, ['Е','Я','И']);
assert.equal(JSON.stringify(cards).includes('отгадывать'), false);
assert.deepEqual(cards.find(card => card.id === 'primeryat').checkOptions, ['ме́рить','ми́р','чередование мер–мир']);
assert.deepEqual(cards.find(card => card.id === 'primiryat').checkOptions, ['ми́р','ме́рить','чередование мер–мир']);
assert.equal(cards.find(card => card.id === 'razryadit').correctChecks[0], 'разря́д');
assert.equal(cards.find(card => card.id === 'pokorit').correctChecks[0], 'поко́рный');
assert.deepEqual(cards.find(card => card.id === 'neissyakaemyi').letterOptions, ['Е','И','Я']);
assert.deepEqual(cards.find(card => card.id === 'sekator').letterOptions, ['Е','И','Я']);
assert.deepEqual(cards[42].letterOptions, ['Е','И']);
assert.deepEqual(cards[108].letterOptions, ['Е','О','А']);
assert.deepEqual(cards[108].checkOptions, ['исто́чник','ста́чивать','течь']);
assert.deepEqual(cards[109].checkOptions, ['словарное','проверяемое','чередование']);
assert.deepEqual(cards[109].correctChecks, ['словарное']);
assert.deepEqual(cards.slice(-4).map(card => card.id), ['uteshat-malysha','utishat-emotsii','zakosnelyi','rassekat-volny']);
assert.deepEqual(cards[114].letterOptions, ['Е','И','Я']);
const replacements = {29:24,31:32,39:28,40:25,47:27,48:31,50:30,52:33,61:34,65:35,76:37,86:36};
Object.entries(replacements).forEach(([slide, file]) => assert.equal(cards[Number(slide)-1].image, `assets/cards/standalone-${file}.png`));

class FakeElement {
  constructor() {
    this.children = [];
    this.className = '';
    this.textContent = '';
    this.disabled = false;
    this.style = { setProperty() {} };
    this.dataset = {};
    this.parentElement = { style: { setProperty() {} } };
    this.handlers = {};
  }
  appendChild(child) { this.children.push(child); return child; }
  append(...children) { this.children.push(...children); }
  addEventListener(type, handler) { this.handlers[type] = handler; }
  setAttribute() {}
  click() {
    if (this.disabled) return;
    if (this.handlers.click) this.handlers.click();
    else if (this.onclick) this.onclick();
  }
  set innerHTML(_) { this.children = []; }
  get innerHTML() { return ''; }
}

const elements = new Map();
global.document = {
  getElementById(id) {
    if (!elements.has(id)) elements.set(id, new FakeElement());
    return elements.get(id);
  },
  createElement() { return new FakeElement(); },
  addEventListener() {}
};
global.localStorage = {
  value: null,
  getItem() { return this.value; },
  setItem(_, value) { this.value = value; }
};
global.confirm = () => true;
global.matchMedia = () => ({ matches: false });

require('../script.js');
const byText = (id, text) => document.getElementById(id).children.find(item => item.textContent === text);

assert.match(document.getElementById('exercise').className, /horizontal/);
assert.equal(window.KORNI_SETTINGS.shuffleTasks, false);
const firstOrders = JSON.stringify(JSON.parse(localStorage.value).orders);

byText('letterOptions', 'Е').click();
byText('checkOptions', 'све́т').click();
document.getElementById('checkButton').click();
assert.match(document.getElementById('letterFeedback').className, /good/);
assert.match(document.getElementById('checkFeedback').className, /good/);

assert.equal(document.getElementById('letterOptions').children.every(button => button.disabled), true);

document.getElementById('nextButton').click();
byText('letterOptions', 'Е').click();
byText('checkOptions', 'све́т').click();
document.getElementById('checkButton').click();
assert.equal(document.getElementById('journal').children.length, 2);

const dictionaryIndex = cards.findIndex(card => card.id === 'navazhdenie');
while (Number(document.getElementById('slideNumber').textContent.split(' ')[0]) - 1 < dictionaryIndex) {
  document.getElementById('nextButton').click();
}
assert.equal(document.getElementById('checkPrompt').textContent, 'Определите способ написания');
assert.ok(byText('checkOptions', 'словарное'));

while (Number(document.getElementById('slideNumber').textContent.split(' ')[0]) > 7) {
  document.getElementById('previousButton').click();
}
document.getElementById('jumpForward').click();
assert.match(document.getElementById('slideNumber').textContent, /^8 \/ 115$/);
document.getElementById('jumpForward').click();
assert.match(document.getElementById('slideNumber').textContent, /^15 \/ 115$/);
document.getElementById('jumpBack').click();
assert.match(document.getElementById('slideNumber').textContent, /^8 \/ 115$/);

while (Number(document.getElementById('slideNumber').textContent.split(' ')[0]) < 69) {
  document.getElementById('nextButton').click();
}
assert.match(document.getElementById('exercise').className, /vertical/);
document.getElementById('nextButton').click();
assert.equal(document.getElementById('imageCaption').textContent, '');
assert.equal(document.getElementById('imageCaption').hidden, true);

const inputIndex = cards.findIndex(card => card.id === 'navodnenie');
while (Number(document.getElementById('slideNumber').textContent.split(' ')[0]) - 1 < inputIndex) {
  document.getElementById('nextButton').click();
}
assert.equal(document.getElementById('checkPrompt').textContent, 'Введите проверочное слово');
const input = document.getElementById('checkOptions').children[0];
input.handlers.input({target:{value:'ВОДЫ'}});
byText('letterOptions', 'О').click();
document.getElementById('checkButton').click();
assert.match(document.getElementById('checkFeedback').className, /good/);

while (Number(document.getElementById('slideNumber').textContent.split(' ')[0]) < 115) {
  document.getElementById('nextButton').click();
}
assert.deepEqual(document.getElementById('letterOptions').children.map(button => button.textContent).sort(), ['Е','И','Я']);
const lastInput = document.getElementById('checkOptions').children[0];
lastInput.handlers.input({target:{value:'РАССЁК'}});
byText('letterOptions', 'Е').click();
document.getElementById('checkButton').click();
assert.match(document.getElementById('checkFeedback').className, /good/);

const savedState = JSON.parse(localStorage.value);
assert.equal(savedState.progress[0].letterLocked, true);
assert.equal(savedState.progress[0].checksLocked, true);
elements.clear();
delete require.cache[require.resolve('../script.js')];
require('../script.js');
assert.equal(document.getElementById('doneCount').textContent, 3);
assert.match(document.getElementById('progressText').textContent, /^3 из 115$/);
assert.equal(JSON.stringify(JSON.parse(localStorage.value).orders), firstOrders);

const css = fs.readFileSync('styles.css', 'utf8');
['1050px', '760px', '430px'].forEach(width => assert.match(css, new RegExp(`@media\\(max-width:${width}\\)`)));
assert.match(css, /\.stressed-vowel/);
assert.match(css, /\.check-input/);

console.log('Smoke test passed:', cards.length, 'cards');
