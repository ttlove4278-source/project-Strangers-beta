const SCENES = {
  teibou: {
    id: 'teibou',
    name: '堤防',
    nameEn: 'Embankment',
    time: 'evening',
    desc: '混凝土堤防。海风带着盐味。脚下是四米深的海水。远处传来蝉鸣。',
    ground: '#3a3a32',
    elements: [
      {id:'railing', type:'object', name:'护栏', x:30, y:60, w:40, h:3, color:'#555550', interact:true, desc:'生锈的护栏。上面有人用硬币刻过字，但被海风磨得看不清了。'},
      {id:'radio', type:'object', name:'收音机', x:65, y:72, w:8, h:5, color:'#4a4a40', interact:true, desc:'旧款索尼收音机。调到NHK。正在播放一档文化节目。'},
      {id:'pocari', type:'item', name:'宝矿力', x:70, y:74, w:3, h:5, color:'#4A9BC7', interact:true, desc:'喝了一半的宝矿力。还是温的。'},
      {id:'vending', type:'vending', x:85, y:55, desc:'自动贩卖机。蓝白色的光在暮色里很显眼。'}
    ],
    connections: ['school_gate','convenience','shrine'],
    events: ['ch1_awakening']
  },
  library: {
    id: 'library',
    name: '图书馆',
    nameEn: 'Library',
    time: 'day',
    desc: '櫂町市立图书馆。空调声很大，但总比外面的热好。书架之间飘着纸和灰尘的气味。',
    ground: '#2a2a28',
    elements: [
      {id:'shelf_phil', type:'object', name:'哲学书架', x:20, y:40, w:15, h:50, color:'#3a3530', interact:true, desc:'从亚里士多德到齐泽克。书脊的烫金字大多褪了色。'},
      {id:'desk', type:'object', name:'阅览桌', x:50, y:65, w:25, h:8, color:'#4a4540', interact:true, desc:'木制阅览桌。有人在桌面上用圆珠笔写了"无聊"两个字。'},
      {id:'window', type:'object', name:'窗户', x:80, y:30, w:12, h:25, color:'#5a6a7a', interact:true, desc:'窗外是停车场。热浪让空气扭曲成波纹。'}
    ],
    connections: ['shopping_street','station_square'],
    events: ['ch1_hikaru_meet']
  },
  school_gate: {
    id: 'school_gate',
    name: '校门',
    nameEn: 'School Gate',
    time: 'day',
    desc: '櫂町高校正门。铁门上的校徽被太阳晒得发烫。暑假中的校园空荡荡的。',
    ground: '#3a3a35',
    elements: [
      {id:'gate', type:'object', name:'校门', x:50, y:40, w:30, h:40, color:'#4a4a45', interact:true, desc:'铁栅栏校门。锁着。告示栏上贴着暑假注意事项和千年虫对策通知。'},
      {id:'notice', type:'object', name:'告示栏', x:25, y:50, w:10, h:12, color:'#5a5a52', interact:true, desc:'「平成11年度 暑假注意事项」「关于2000年问题（千年虫）的对应」'},
      {id:'tree', type:'object', name:'梧桐树', x:75, y:30, w:15, h:45, color:'#3a4a3a', interact:false, desc:''}
    ],
    connections: ['teibou','shopping_street','cemetery'],
    events: []
  },
  convenience: {
    id: 'convenience',
    name: '便利店',
    nameEn: 'Convenience Store',
    time: 'any',
    desc: '7-11便利店。自动门开合时吹出冷风。店内日光灯嗡嗡作响。',
    ground: '#2a2a28',
    elements: [
      {id:'magazine', type:'object', name:'杂志架', x:15, y:50, w:10, h:35, color:'#4a4540', interact:true, desc:'「周刊少年Jump」「SPA!」「Newton·世纪末特辑」。一本《诺查丹玛斯大预言》摆在最显眼的位置。'},
      {id:'drink_shelf', type:'object', name:'饮料柜', x:75, y:40, w:15, h:45, color:'#2a3a5a', interact:true, desc:'宝矿力100日元。BOSS咖啡120日元。冰凉的玻璃门上结着水珠。'},
      {id:'counter', type:'object', name:'收银台', x:50, y:70, w:20, h:8, color:'#4a4540', interact:true, desc:'店员在看小型CRT电视。播的是《GTO》重播。'}
    ],
    connections: ['teibou','station_square'],
    events: []
  },
  station_square: {
    id: 'station_square',
    name: '站前广场',
    nameEn: 'Station Square',
    time: 'day',
    desc: '櫂町站前。出租车和公交车的尾气让空气更热了。有人在发免费报纸。',
    ground: '#3a3a35',
    elements: [
      {id:'bench', type:'object', name:'长椅', x:40, y:65, w:18, h:6, color:'#5a5a52', interact:true, desc:'木制长椅。扶手被磨得发亮。有个穿荧光背心的年轻人坐在旁边。'},
      {id:'newspaper', type:'object', name:'报纸架', x:60, y:60, w:5, h:8, color:'#6a6a5a', interact:true, desc:'免费报纸「櫂町日报」。头版是千年虫对策进度报告。'},
      {id:'clock', type:'object', name:'车站�的钟', x:50, y:25, w:8, h:8, color:'#5a5a55', interact:true, desc:'大钟指向下午三点十七分。但你觉得好像看了好几次都是这个时间。'}
    ],
    connections: ['library','convenience','old_port'],
    events: ['ch1_makoto_meet']
  },
  old_port: {
    id: 'old_port',
    name: '旧港',
    nameEn: 'Old Port',
    time: 'evening',
    desc: '废弃的港口区。仓库的铁皮墙在夕阳下变成橙红色。远处有高架桥。',
    ground: '#32322e',
    elements: [
      {id:'warehouse', type:'object', name:'仓库', x:30, y:40, w:25, h:35, color:'#4a4540', interact:true, desc:'废弃仓库。门上贴着「立入禁止」。但锁早就坏了。'},
      {id:'bridge', type:'object', name:'高架桥', x:70, y:20, w:25, h:8, color:'#555550', interact:true, desc:'旧港高架桥。桥下好像有人住。'}
    ],
    connections: ['station_square','bridge_under'],
    events: []
  },
  bridge_under: {
    id: 'bridge_under',
    name: '高架桥下',
    nameEn: 'Under the Bridge',
    time: 'any',
    desc: '高架桥的阴影下。折叠椅、一本书、一个人。海风从桥墩间穿过。',
    ground: '#252525',
    elements: [
      {id:'chair', type:'object', name:'折叠椅', x:40, y:60, w:8, h:10, color:'#5a5a52', interact:true, desc:'有人坐在这里。白发，灰色开衫。面朝桥墩，背对海。'},
      {id:'book', type:'object', name:'《思想录》', x:35, y:68, w:4, h:5, color:'#6a5a4a', interact:true, desc:'帕斯卡《思想录》。翻到同一页。书角卷了。'}
    ],
    connections: ['old_port'],
    events: ['ch1_akira_meet']
  },
  cemetery: {
    id: 'cemetery',
    name: '墓园',
    nameEn: 'Cemetery',
    time: 'evening',
    desc: '山坡上的墓园。石阶两侧长满了杂草。松树遮住了大半个天空。',
    ground: '#2a2e2a',
    elements: [
      {id:'miyuki_grave', type:'object', name:'墓碑', x:45, y:55, w:8, h:12, color:'#6a6a65', interact:true, desc:'「夏目深雪之墓」。花瓶里是枯萎的向日葵。旁边放着一瓶没开封的宝矿力。'},
      {id:'bench_cem', type:'object', name:'石凳', x:60, y:62, w:12, h:5, color:'#5a5a55', interact:true, desc:'苔藓覆盖的石凳。从这里能看到远处的海。'}
    ],
    connections: ['school_gate','shrine'],
    events: ['ch1_grave_visit']
  },
  shrine: {
    id: 'shrine',
    name: '神社',
    nameEn: 'Shrine',
    time: 'day',
    desc: '被遗忘的小神社。�的鸟居油漆脱落。赛钱箱前的绳子断了一半。',
    ground: '#2e2e28',
    elements: [
      {id:'torii', type:'object', name:'鸟居', x:50, y:30, w:20, h:25, color:'#8a3a2a', interact:true, desc:'褪色的朱红鸟居。有人在柱子上贴了「2000年初诣」的宣传单。'},
      {id:'ema', type:'object', name:'绘马', x:30, y:55, w:10, h:12, color:'#c4a060', interact:true, desc:'旧的绘马上写着各种愿望。「合格祈愿」「健康」「世界末日不要来」。'}
    ],
    connections: ['teibou','cemetery'],
    events: []
  }
};
