const SKILLS = {
  quote_absurd: {
    id: 'quote_absurd',
    name: '引用·荒诞',
    sub: 'Quote: Absurd',
    type: 'quote',
    cost: 0.5,
    power: 8,
    desc: '「真正严肃的哲学问题只有一个——自杀。」',
    effect: 'damage'
  },
  quote_sisyphus: {
    id: 'quote_sisyphus',
    name: '引用·巨石',
    sub: 'Quote: Boulder',
    type: 'quote',
    cost: 0.8,
    power: 12,
    desc: '「登上顶峰的斗争本身足以充实人心。」',
    effect: 'damage'
  },
  thesis_sisyphus: {
    id: 'thesis_sisyphus',
    name: '命题·西西弗的愉悦',
    sub: 'Thesis: Joy of Sisyphus',
    type: 'thesis',
    cost: 5,
    power: 30,
    desc: '「我们必须想象西西弗是幸福的。」',
    effect: 'damage_heavy',
    declaration: '我们必须想象西西弗是幸福的。'
  },
  quote_shadow: {
    id: 'quote_shadow',
    name: '引用·影子',
    sub: 'Quote: Shadow',
    type: 'quote',
    cost: 0.6,
    power: 6,
    desc: '「他们把影子当成了真实。」',
    effect: 'reveal'
  },
  quote_cave: {
    id: 'quote_cave',
    name: '引用·洞穴',
    sub: 'Quote: Cave',
    type: 'quote',
    cost: 1,
    power: 10,
    desc: '「走出洞穴的人不会再回来。」',
    effect: 'damage'
  },
  thesis_cave: {
    id: 'thesis_cave',
    name: '命题·世界是投影',
    sub: 'Thesis: The World is Projection',
    type: 'thesis',
    cost: 6,
    power: 25,
    desc: '「世界是投影。」',
    effect: 'reveal_all',
    declaration: '世界是投影。'
  },
  quote_abyss: {
    id: 'quote_abyss',
    name: '引用·深渊',
    sub: 'Quote: Abyss',
    type: 'quote',
    cost: 1,
    power: 15,
    desc: '「凝视深渊时，深渊也在凝视你。」',
    effect: 'damage'
  },
  quote_ubermensch: {
    id: 'quote_ubermensch',
    name: '引用·超人',
    sub: 'Quote: Übermensch',
    type: 'quote',
    cost: 1.5,
    power: 18,
    desc: '「人是应当被超越的东西。」',
    effect: 'buff_atk'
  },
  thesis_arena: {
    id: 'thesis_arena',
    name: '命题·超人·角斗场',
    sub: 'Thesis: Arena of the Übermensch',
    type: 'thesis',
    cost: 30,
    power: 60,
    desc: '「上帝已死。」',
    effect: 'domain',
    declaration: '上帝已死。'
  },
  quote_imperative: {
    id: 'quote_imperative',
    name: '引用·绝对命令',
    sub: 'Quote: Categorical Imperative',
    type: 'quote',
    cost: 1,
    power: 10,
    desc: '「你应当只按照你同时也能愿意它成为普遍法则的那个准则去行动。」',
    effect: 'nullify'
  },
  quote_critique: {
    id: 'quote_critique',
    name: '引用·批判',
    sub: 'Quote: Critique',
    type: 'quote',
    cost: 0.8,
    power: 8,
    desc: '「我不得不悬置知识，以便为信仰留出地盘。」',
    effect: 'analyze'
  },
  thesis_critique: {
    id: 'thesis_critique',
    name: '命题·纯粹理性批判',
    sub: 'Thesis: Critique of Pure Reason',
    type: 'thesis',
    cost: 15,
    power: 35,
    desc: '「人为自然立法。」',
    effect: 'rule_set',
    declaration: '人为自然立法。'
  },
  talk: {
    id: 'talk',
    name: '对话',
    sub: 'Talk',
    type: 'talk',
    cost: 0,
    power: 0,
    desc: '试着说些什么。或者——听。'
  },
  silence: {
    id: 'silence',
    name: '沉默',
    sub: 'Silence',
    type: 'silence',
    cost: 0,
    power: 0,
    desc: '什么都不说。回复1赫逻各斯。',
    effect: 'recover',
    recover: 1
  },
  rewind: {
    id: 'rewind',
    name: '倒带',
    sub: 'Rewind',
    type: 'rewind',
    cost: 0,
    power: 0,
    desc: '死亡时自动触发。回到三秒前。记忆不会消失。',
    effect: 'rewind'
  }
};
