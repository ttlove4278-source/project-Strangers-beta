const ENEMIES = {
  bentham: {
    id: 'bentham',
    name: '功利计算者',
    nameShort: '计算者',
    source: '杰里米·边沁',
    thesis: '最大多数的最大幸福。',
    signature: 'J.Bentham',
    color: '#8a8a5a',
    maxHp: 80,
    hp: 80,
    logos: 8,
    crystal: 60,
    stats: {resolve:5, empathy:1, logic:9, will:6},
    skills: [
      {id:'calc_pain', name:'计算·苦痛', power:10, cost:1, msg:'「苦痛的总量是可以被量化的。」'},
      {id:'calc_pleasure', name:'计算·快乐', power:15, cost:2, msg:'「一切行为的标准在于幸福的总量。」'},
      {id:'panopticon', name:'全景监狱', power:25, cost:5, msg:'「被观察者无法确认自己是否正在被观察。」'}
    ],
    talkOptions: [
      {text: '反驳：你算漏了一个人。', type:'counter', effect:'dmg', value:20, response:'「……什么？」'},
      {text: '倾听：为什么要去数？', type:'listen', effect:'reveal', response:'「因为……如果不数，就没有人在乎少数人的痛苦了。」'},
      {text: '共感：我理解想要拯救所有人的心情。', type:'empathy', effect:'crystal_up', value:3, response:'「你理解？……不，你不理解。我也不理解。」'},
      {text: '提问：那你幸福吗？', type:'question', effect:'stun', response:'（计算者沉默了很久。他的瞳孔里，签名开始模糊。）'},
      {text: '……', type:'silence', effect:'wait', response:'（蝉鸣。你什么都没有说。计算者低下了头。）'}
    ],
    defeatMsg: '理论结晶化为一枚不规则的八面体。内部的文字写着：「我只是想让世界公平一点。」',
    talkDefeatMsg: '他坐在了地上。没有结晶化。只是——累了。',
    intro: [
      '空气在发抖。',
      '一个穿着西装的男人站在那里，手指在空气中拨弄着看不见的算盘。',
      '他的瞳孔里浮现出模糊的字迹——J.Bentham。',
      '「你好。我来计算一下——你的命值多少。」'
    ]
  },
  crowd_a: {
    id: 'crowd_a',
    name: '排外者',
    nameShort: '排外者',
    source: '不明',
    thesis: '不正常的人应该被隔离。',
    signature: '?',
    color: '#6a5a5a',
    maxHp: 40,
    hp: 40,
    logos: 2,
    crystal: 0,
    stats: {resolve:3, empathy:1, logic:2, will:4},
    skills: [
      {id:'stone', name:'投石', power:5, cost:0, msg:'「滚出去！怪物！」'},
      {id:'shout', name:'叫嚣', power:3, cost:0, msg:'「哲学症是传染病！他们应该被关起来！」'}
    ],
    talkOptions: [
      {text: '你在害怕什么？', type:'question', effect:'stun', response:'「……我不知道。但我很害怕。」'},
      {text: '……', type:'silence', effect:'wait', response:'（人群渐渐安静了下来。）'}
    ],
    defeatMsg: '',
    talkDefeatMsg: '人群散去了。地上留下几颗石子和一张被踩脏的传单。',
    intro: ['聚集在校门前的人群。他们手里拿着写着标语的纸板。', '「把哲学症患者赶出学校！」']
  }
};
