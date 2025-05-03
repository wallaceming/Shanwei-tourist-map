// 景点数据
const locations = [
    {
        name: '市城区保利金町湾景区',
        position: [115.297311, 22.798892],
        type: '文化娱乐',
        description: '原野音乐会举办地',
        activities: {
            title: '2025年原野音乐会',
            time: '5月1日 - 5日，每天18时至23时',
            content: '以"音乐 + 自然"为主题，邀请省内外知名乐队、歌手参演，涵盖流行、摇滚、民谣、客家歌曲等风格。设全景舞台、草坪露营区、创意市集（手工艺品、特色美食），打造沉浸式音乐体验。'
        },
        suitability: {
            youth: '适合喜欢音乐、夜生活的年轻人，氛围热烈。',
            family: '适合亲子家庭，草坪露营和美食市集适合全家体验。',
            elderly: '适合喜欢安静散步的长者，夜间音乐较热闹需注意。'
        }
    },
    {
        name: '市城区屿仔岛水吧街',
        position: [115.380723, 22.764350],
        type: '文化演出',
        description: '传统民乐展演场地',
        activities: {
            title: '"山海和鸣迎盛会"——汕尾市传统民乐展演',
            time: '5月3日 - 4日，每天15时至18时',
            content: '围绕"喜迎十五运"主题，组织海陆丰传统民乐（吹打乐、八音古乐、戏曲伴奏乐等）进行展演，辅以戏曲名伶唱段同台演出，为市民游客提供"声、乐、戏"一体的视听体验。'
        },
        suitability: {
            youth: '适合对传统文化感兴趣的年轻人。',
            family: '适合全家一起欣赏民乐表演。',
            elderly: '非常适合喜欢戏曲、民乐的长者。'
        }
    },
    {
        name: '玄武山旅游区',
        position: [115.833611, 22.817893],
        type: '非遗文化',
        description: '非遗文化展示地',
        activities: {
            title: '玄武山非遗巡游活动',
            time: '5月1日 - 5日，每天10时30分至11时30分',
            content: '以"非遗 + 文旅"为主题，以五色狮、鲤鱼灯等表演为主，开展非遗展示和巡游表演。'
        }
    },
    {
        name: '陆河县赖少其艺术馆',
        position: [115.653804, 23.297232],
        type: '文化展览',
        description: '文物保护单位展览地',
        activities: {
            title: '"探寻历史足迹，传承文化瑰宝"2025年陆河县文物保护单位图片展',
            time: '5月1日9时至17时30分',
            content: '精选陆河县古村落、古建筑等文物保护单位，以高清图片 + 文字说明展示历史风貌、建筑特色，设"文物保护志愿讲解"，引导游客了解陆河历史文化，配套"最美文物打卡"拍照活动。'
        }
    },
    {
        name: '市区滨海西沙滩公园',
        position: [115.340372, 22.783278],
        type: '滨海活动',
        description: '沙滩音乐会举办地',
        activities: {
            title: '"沙滩 + 运动"落日音乐会',
            time: '5月1日 - 5日，每天15时至21时',
            content: '邀请知名乐队、歌手登台献艺，涵盖流行、摇滚、民谣、电子等多元音乐风格，搭配现场绚丽灯光与震撼音效，让市民游客在欣赏西沙滩海上运动的同时，享受沉浸式音乐盛宴。'
        }
    },
    {
        name: '海丰县天虹广场',
        position: [115.349837, 22.956809],
        type: '商业活动',
        description: '家电消费节举办地',
        activities: {
            title: '"焕新家·享好物"——汕尾市家电消费节暨汕尾领"鲜"节城市促消费系列节日品牌活动',
            time: '5月1日 - 2日',
            content: '汕尾市商务局联合京东家电平台，聚焦家电以旧换新与特色消费融合，结合以旧换新消费补贴发放与线上线下联动开展促销。'
        }
    },
    {
        name: '陆河县十大主题公园',
        position: [115.659978, 23.301557],
        type: '文化娱乐',
        description: '音乐会举办地',
        activities: {
            title: '2025大湾区（陆河）周末草坪音乐会',
            time: '5月 - 12月，每2周举办一场',
            content: '全龄化音乐展演，融合灯光艺术装置，打造"草坪音乐派对"，包括流行乐队演出、亲子音乐互动、客家民谣专场，配套儿童游乐区、美食摊位，促进家庭游客参与。'
        }
    },
    {
        name: '市城区灶物夜市',
        position: [115.352792, 22.776635],
        type: '美食文化',
        description: '夜市文化体验地',
        activities: {
            title: '"灶物夜市・烟火奇妙夜"海陆丰文化艺术嘉年华',
            time: '5月1日 - 5日，每天15时至22时',
            content: '提供多个沉浸式海陆丰非遗文化展示与体验街区，每天定时上演非遗剧目展演和巡游，设置海钓体验区，举办"夜钓挑战赛"，设立"汕农领鲜"主题展销区域。'
        }
    },
    {
        name: '汕尾市博物馆',
        position: [115.399408, 22.788204],
        type: '文化体验',
        description: '非遗体验活动地',
        activities: {
            title: '2025年五一假期非遗暨拓印体验活动',
            time: '5月1日 - 3日，每天10时至17时',
            content: '贝雕、麦秆画非遗传承人现场展演技艺，观众DIY体验制作简易贝雕画、麦秆贴画；开展拓印体验（古籍、碑刻拓印），了解传统印刷术，作品可带走作纪念。'
        }
    },
    {
        name: '陆丰市东海街道玉照公园',
        position: [115.651637, 22.949599],
        type: '文化演出',
        description: '文化体验嘉年华举办地',
        activities: {
            title: '"非遗赋能・乐活五一"陆丰文化体验嘉年华',
            time: '5月1日 - 2日，每天15时至17时、20时至21时30分',
            content: '市文化馆组织各基层文艺院团开展"五一"联欢文艺晚会，市舞飞扬教育培训中心组织钱鼓舞等开展民俗现代舞蹈表演，邀请皮影牛皮雕刻、正字戏脸谱等非遗传承人现场指导展示传统工艺制作。'
        }
    },
    {
        name: '陆河县河田镇',
        position: [115.658516, 23.298891],
        type: '全民健身',
        description: '全民健身徒步活动地',
        activities: {
            title: '"共迎十五运 健行活力陆河"2025年陆河县全民健身徒步活动',
            time: '5月1日7时至12时',
            content: '选择"百千万工程"新节点青年公园作为活动场地，以青年公园为起点和终点，途经陆河大道、朝阳路等12个路段与点位，串联县城中心繁华地带、布金村、圳口村等田园风光乡村旅游点，全程18.8公里。'
        }
    },
    {
        name: '汕尾市海珍城',
        position: [115.401001, 22.791240],
        type: '美食文化',
        description: '美食品鉴会举办地',
        activities: {
            title: '"最有家乡味道10道菜""游客最爱8道菜"发布暨美食品鉴会',
            time: '5月1日上午10时',
            content: '举行"最有家乡味道10道菜""游客最爱8道菜"发布仪式，并邀请汕尾本地厨师现场制作，邀请广大市民游客、旅行社代表免费试吃，同时举行名菜推荐活动。'
        }
    },
    {
        name: '汕尾市文化馆',
        position: [115.400338, 22.788538],
        type: '文化演出',
        description: '文艺汇演举办地',
        activities: {
            title: '"茶香乐舞·艺彩五一"2025汕尾市文化馆文艺汇演',
            time: '5月1日14时30分至16时30分',
            content: '组织文化志愿者带来传统戏曲（正字戏、西秦戏选段）、民族舞蹈、乐器演奏（如八音民乐），同时现场设"茶文化体验区"，免费品茗汕尾单丛茶，结合"艺术 + 公益"，邀请非遗传承人展示贝雕、麦秆画技艺。'
        }
    },
    {
        name: '善美书院（红宫红场旧址东侧）',
        position: [115.335628, 22.968087],
        type: '文化体验',
        description: '古建筑文化体验地',
        activities: {
            title: '岭南古建筑文化之斗拱体验活动',
            time: '5月10日10时至12时',
            content: '邀请专家结合海丰孔庙古建筑，讲解斗拱的历史、结构与文化价值，展示斗拱模型，观众分组组装斗拱构件，感受古代建筑智慧，配套展出岭南古建筑摄影图片。'
        }
    },
    {
        name: '市城区滨海西沙滩海域',
        position: [115.340372, 22.783278],
        type: '海上运动',
        description: '水上运动体验地',
        activities: {
            title: '"爱运动 来汕尾"海上运动体验',
            time: '5月1日 - 10日，每天9时至18时',
            content: '充分利用滨海西沙滩的沙滩、海域的优质资源，结合营造"喜迎十五运"氛围，在滨海西沙滩海域开展帆船帆板、动力冲浪板、皮划艇、浆板、摩托艇、水上飞人等水上运动项目，为市民游客提供精彩体验。'
        }
    },
    {
        name: '龟龄岛',
        position: [115.434345, 22.656701],
        type: '海岛游',
        description: '特色跳岛游活动地',
        activities: {
            title: '"海韵龟龄・趣享跳岛"——汕尾特色跳岛游活动',
            time: '5月1日 - 5日，每天10时至17时',
            content: '举办夜钓鱿鱼、沙滩篝火晚会、海上烟花秀、游艇派对等活动，并开展系列酬宾优惠活动，同时增加每日往返航班，持续丰富登岛航线体验，增强跳岛游的趣味性和体验感。'
        }
    },
    {
        name: '海丰县体育场',
        position: [115.322974, 22.967212],
        type: '体育赛事',
        description: '篮球赛事举办地',
        activities: {
            title: '"喜迎十五运"2025年海丰县"捷锐杯"男子篮球赛',
            time: '5月1日 - 5日，每天9时至17时',
            content: '组织12 - 16支队伍（汕尾籍运动员），举行五人制男子篮球比赛，比赛分为小组循环赛、半决淘汰赛和决赛。'
        }
    },
    {
        name: '陆河县汇丰商贸城',
        position: [115.659978, 23.301557],
        type: '美食文化',
        description: '美食推介活动地',
        activities: {
            title: '"陆河食尚 舌尖领航"2025年陆河县农特产品非遗美食推介活动',
            time: '5月1 - 2日（具体时间待定）',
            content: '精心打造特色展区，展示青梅制品、茶叶、蜂蜜、土鸡蛋等优质农产品。同时，结合陆河的特色菜品、粉面、小吃等"七个十"的美食，向游客全面展示"陆河味道"，让游客在"美食、农产品一条街"品美食、购好物。'
        }
    },
    {
        name: '海丰县文化馆',
        position: [115.322974, 22.967212],
        type: '文化展览',
        description: '青少年书画展览地',
        activities: {
            title: '百强文脉·少年中国—2025年海丰县青少年书画作品展',
            time: '5 - 6月（具体时间待定）',
            content: '以"中国文化百强县"为主题，征集青少年书画作品（含红色文化、民俗非遗元素），设专业评委评选奖项，优秀作品现场展出，同步举办"书画创作 workshop"，邀请艺术家指导青少年创作。'
        }
    },
    {
        name: '沈海高速长沙湾服务区',
        position: [115.275369, 22.821977],
        type: '文化消费',
        description: '文旅促消费活动地',
        activities: {
            title: '"邂逅长沙湾・文旅乐购集"文旅促消费活动',
            time: '5月1日 - 5日，每天10时至18时',
            content: '邀请汕尾渔歌队，身着传统渔家服饰，定时进行渔歌展演；邀请汕尾汉服社团入驻服务区，提供汉服租赁、妆造等服务；同时设置珠宝、农产品、美食展销区，满足游客的体验需求。'
        }
    },
    {
        name: '汕尾体育馆',
        position: [115.375557, 22.787204],
        type: '体育赛事',
        description: '击剑比赛举办地',
        activities: {
            title: '"汕尾首剑 锋向未来"2025年汕尾市击剑公开赛',
            time: '5月4日 - 5日，每天8时至16时',
            content: '结合"喜迎十五运会"，举办汕尾市首届击剑公开赛，在网上公开接受报名，约有500来自全国各地的选手参赛。赛事设有男子、女子花剑、重剑、佩剑个人赛及团体赛，属于中国击剑协会D级认证赛事。'
        }
    }
];

// 全局变量
let map;
let markers = [];
let currentFilter = 'all';
let searchText = '';

// 只显示规划建议的打点，并绘制路线
let plannedMarkers = [];
let plannedPolylines = [];
let plannedRouteObjs = [];
function showPlannedMarkersAndRoutes(plan, stayPoint, dayIndex = 0) {
    // 清除所有原有景点标记
    if (markers.length) markers.forEach(m => m.setMap(null));
    markers = [];

    // 清除旧的marker和路线
    if (plannedMarkers.length) plannedMarkers.forEach(m => m.setMap(null));
    plannedMarkers = [];
    if (plannedPolylines.length) plannedPolylines.forEach(l => l.setMap(null));
    plannedPolylines = [];
    if (plannedRouteObjs.length) plannedRouteObjs.forEach(r => r.clear && r.clear());
    plannedRouteObjs = [];

    // 统一处理多日/单日
    let allPoints = [];
    if (Array.isArray(plan)) {
        // 多日：只显示 dayIndex 对应那一天
        const day = plan[dayIndex] || plan[0];
        day.routes.forEach(route => {
            route.activities.forEach(act => allPoints.push(act));
        });
    } else {
        plan.routes.forEach(route => {
            route.activities.forEach(act => allPoints.push(act));
        });
    }

    // 住宿地marker
    const stayMarker = new AMap.Marker({
        position: stayPoint,
        map: map,
        title: '住宿地',
        icon: new AMap.Icon({
            size: new AMap.Size(16, 16), // 原32x32缩小一半
            image: 'https://webapi.amap.com/theme/v1.3/markers/n/mark_bs.png', // 官方可用酒店图标
            imageSize: new AMap.Size(16, 16)
        })
    });
    plannedMarkers.push(stayMarker);

    // 推荐景点marker
    allPoints.forEach((loc, idx) => {
        const marker = new AMap.Marker({
            position: loc.position,
            map: map,
            title: loc.name,
            icon: new AMap.Icon({
                size: new AMap.Size(16, 16), // 原32x32缩小一半
                image: `https://webapi.amap.com/theme/v1.3/markers/n/mark_b${(idx%10)+1}.png`,
                imageSize: new AMap.Size(16, 16)
            })
        });
        plannedMarkers.push(marker);
    });

    // 地图视野自动适应所有点
    map.setFitView(plannedMarkers);

    // 绘制路线（住宿地->景点1->景点2...）
    let lastPoint = stayPoint;
    allPoints.forEach((loc, idx) => {
        // 用驾车路线（如需步行/骑行可切换）
        AMap.plugin('AMap.Driving', function() {
            const driving = new AMap.Driving({
                map: map,
                showTraffic: false,
                hideMarkers: true
            });
            driving.search(lastPoint, loc.position, function(status, result) {
                if (status === 'complete') {
                    plannedRouteObjs.push(driving);
                }
            });
        });
        lastPoint = loc.position;
    });

    // 显示"恢复全部景点"按钮
    const restoreBtn = document.getElementById('restore-all-markers');
    if (restoreBtn) restoreBtn.style.display = 'block';
}

// 等待 DOM 和地图 API 加载完成
async function initMap() {
    debug('initMap函数开始执行', 'info');
    console.log('开始初始化地图...');
    try {
        // 等待高德地图API加载
        await loadAMapScript();
        
        console.log('API加载成功，创建地图实例...');
        
        // 创建地图实例
        map = new AMap.Map('map-container', {
            zoom: 11,
            center: [115.375557, 22.787204], // 汕尾市中心
            viewMode: '2D',  // 使用2D模式提高兼容性
            resizeEnable: true
        });

        // 等待地图加载完成
        await new Promise((resolve, reject) => {
            map.on('complete', () => {
                console.log('地图加载完成');
                resolve();
            });
            
            map.on('error', (error) => {
                console.error('地图加载错误:', error);
                reject(error);
            });
            
            // 设置超时
            setTimeout(() => {
                reject(new Error('地图加载超时'));
            }, 10000);
        });

        console.log('添加地图控件...');
        
        // 添加地图控件
        map.addControl(new AMap.ToolBar({
            position: 'RB'
        }));
        
        map.addControl(new AMap.Scale({
            position: 'LB'
        }));

        // 添加定位控件
        const geolocation = new AMap.Geolocation({
            enableHighAccuracy: true,
            timeout: 10000,
            buttonPosition: 'RB',
            buttonOffset: new AMap.Pixel(10, 20),
            zoomToAccuracy: true,
            GeoLocationFirst: true,
        });
        map.addControl(geolocation);

        console.log('初始化标记和列表...');
        
        // 初始化标记和列表
        initializeMarkersAndList();
        
        // 绑定搜索和筛选事件
        bindSearchAndFilter();
        
        // 隐藏加载提示
        document.getElementById('loading').style.display = 'none';
        
        console.log('地图初始化完成！');
        
    } catch (error) {
        console.error('地图初始化失败:', error);
        showError('地图初始化失败', error);
        document.getElementById('loading').style.display = 'none';
        document.getElementById('error').style.display = 'block';
        document.getElementById('error').innerText = `地图初始化失败: ${error.message}`;
    }
}

// 页面加载完成后初始化地图
window.onload = function() {
    debug('页面onload事件触发，调试功能正常', 'info');
    console.log('页面加载完成');
    
    // 插入"恢复全部景点"按钮（如不存在）
    if (!document.getElementById('restore-all-markers')) {
        const restoreBtn = document.createElement('button');
        restoreBtn.id = 'restore-all-markers';
        restoreBtn.className = 'restore-btn';
        restoreBtn.textContent = '回到主页面';
        restoreBtn.style.display = 'none';
        // 推荐放在侧边栏顶部
        const panel = document.querySelector('.panel-content') || document.body;
        panel.insertBefore(restoreBtn, panel.firstChild);
    }
    // 绑定按钮事件
    document.getElementById('restore-all-markers').addEventListener('click', () => {
        window.location.reload();
    });

    // 立即绑定按钮事件，不等待地图加载
    const planButton = document.getElementById('plan-route');
    if (planButton) {
        console.log('找到规划按钮');
        planButton.addEventListener('click', () => {
            console.log('规划按钮被点击');
            planRoute();
        });
    } else {
        console.error('未找到规划按钮');
    }

    // 绑定路线方案标签页切换事件
    const tabButtons = document.querySelectorAll('.tab-btn');
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            // 移除所有标签页的active类
            tabButtons.forEach(btn => btn.classList.remove('active'));
            // 给当前点击的标签页添加active类
            button.classList.add('active');
            
            // 获取对应的方案内容
            const days = button.getAttribute('data-days');
            const plans = document.querySelectorAll('.route-plan');
            plans.forEach(plan => {
                plan.classList.remove('active');
                if (plan.id === `${days === '1' ? 'one' : 'two'}-day-plan`) {
                    plan.classList.add('active');
                }
            });
        });
    });

    // 初始化地图
    initMap().catch(error => {
        console.error('地图初始化过程出错:', error);
        showError('地图初始化过程出错', error);
    });
};

// 初始化标记和列表
function initializeMarkersAndList() {
    // 清除推荐路线的线条和高亮点
    if (plannedMarkers.length) plannedMarkers.forEach(m => m.setMap && m.setMap(null));
    plannedMarkers = [];
    if (plannedPolylines.length) plannedPolylines.forEach(l => l.setMap && l.setMap(null));
    plannedPolylines = [];
    if (plannedRouteObjs.length) plannedRouteObjs.forEach(r => r.clear && r.clear());
    plannedRouteObjs = [];

    // 绑定面板切换事件
    const togglePanelBtn = document.querySelector('.toggle-panel');
    const locationsPanel = document.querySelector('.locations-panel');
    const toggleRouteBtn = document.querySelector('.toggle-route');
    const routePanel = document.querySelector('.route-panel');
    
    // 景点列表面板切换
    togglePanelBtn.addEventListener('click', () => {
        locationsPanel.classList.toggle('collapsed');
        // 保存状态到localStorage
        localStorage.setItem('locationsPanelCollapsed', locationsPanel.classList.contains('collapsed'));
    });
    
    // 路线规划面板切换
    toggleRouteBtn.addEventListener('click', () => {
        routePanel.classList.toggle('expanded');
        // 保存状态到localStorage
        localStorage.setItem('routePanelExpanded', routePanel.classList.contains('expanded'));
    });
    
    // 恢复上次的状态
    const locationsWasCollapsed = localStorage.getItem('locationsPanelCollapsed') === 'true';
    const routeWasExpanded = localStorage.getItem('routePanelExpanded') === 'true';
    
    if (locationsWasCollapsed) {
        locationsPanel.classList.add('collapsed');
    }
    
    if (routeWasExpanded) {
        routePanel.classList.add('expanded');
    }

    // 清除现有标记
    markers.forEach(marker => marker.setMap(null));
    markers = [];

    // 根据筛选条件过滤位置
    const filteredLocations = locations.filter(location => {
        const matchesFilter = currentFilter === 'all' || location.type === currentFilter;
        const matchesSearch = location.name.toLowerCase().includes(searchText.toLowerCase()) ||
                            location.description.toLowerCase().includes(searchText.toLowerCase()) ||
                            location.activities.title.toLowerCase().includes(searchText.toLowerCase()) ||
                            location.activities.content.toLowerCase().includes(searchText.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    // 更新列表
    const locationsList = document.getElementById('locations-list');
    locationsList.innerHTML = '';

    filteredLocations.forEach((location, index) => {
        // 创建列表项
        const locationItem = document.createElement('div');
        locationItem.className = 'location-item';
        locationItem.innerHTML = `
            <h3>${location.name}</h3>
            <p>${location.description}</p>
        `;

        // 点击列表项时定位到对应位置
        locationItem.addEventListener('click', () => {
            map.setCenter(location.position);
            map.setZoom(14);
        });

        locationsList.appendChild(locationItem);

        // 创建标记
        const marker = createMarker(location);
        markers.push(marker);
    });

    // 隐藏"恢复全部景点"按钮
    const restoreBtn = document.getElementById('restore-all-markers');
    if (restoreBtn) restoreBtn.style.display = 'none';

    // 自动收起路线规划面板，避免无法缩回
    if (routePanel && routePanel.classList.contains('expanded')) {
        // 只有在展开时才模拟点击收起
        if (toggleRouteBtn) toggleRouteBtn.click();
    }
}

// 创建标记
function createMarker(location) {
    // 根据类型设置不同的图标样式
    const icon = new AMap.Icon({
        size: new AMap.Size(12, 17), // 原25x34缩小一半
        image: 'https://webapi.amap.com/theme/v1.3/markers/n/mark_b.png',
        imageSize: new AMap.Size(12, 17)
    });

    const marker = new AMap.Marker({
        position: location.position,
        title: location.name,
        icon: icon,
        animation: 'AMAP_ANIMATION_DROP',
        map: map
    });

    // 添加文本标签
    const text = new AMap.Text({
        text: location.name,
        anchor: 'center', // 设置文本标注锚点
        draggable: false,
        cursor: 'pointer',
        angle: 0,
        style: {
            'padding': '5px 10px',
            'margin-bottom': '36px', // 和图标的距离
            'border-radius': '5px',
            'background-color': 'rgba(255,255,255,0.9)',
            'border-width': '0',
            'box-shadow': '0 2px 6px rgba(0,0,0,0.1)',
            'color': '#1d1d1f',
            'font-size': '12px',
            'font-family': '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            'font-weight': '500',
            'text-align': 'center',
            'min-width': '60px'
        },
        position: location.position
    });

    text.setMap(map);

    // 创建信息窗体
    let content = `
        <div class="info-window">
            <h3>${location.name}</h3>
    `;

    if (location.activities) {
        content += `
            <div class="event-title">${location.activities.title}</div>
            <div class="event-time">${location.activities.time}</div>
            <div class="event-content">${location.activities.content}</div>
            <div class="divider"></div>
        `;
    }

    content += `
            <p>${location.description}</p>
            <span class="type">${location.type}</span>
        </div>
    `;

    const infoWindow = new AMap.InfoWindow({
        content: content,
        offset: new AMap.Pixel(20, 0),  // 修改偏移量，向右偏移20像素，垂直方向不偏移
        anchor: 'left-center',  // 将信息窗口的锚点设置为左中位置
        closeWhenClickMap: true  // 点击地图其他区域时关闭信息窗口
    });

    // 绑定鼠标悬停事件
    marker.on('mouseover', () => {
        infoWindow.open(map, marker.getPosition());
        // 悬停时改变文本样式
        text.setStyle({
            'background-color': 'rgba(0,113,227,0.9)',
            'color': '#ffffff'
        });
    });

    marker.on('mouseout', () => {
        infoWindow.close();
        // 恢复文本样式
        text.setStyle({
            'background-color': 'rgba(255,255,255,0.9)',
            'color': '#1d1d1f'
        });
    });

    // 文本标签的鼠标事件
    text.on('mouseover', () => {
        infoWindow.open(map, marker.getPosition());
        text.setStyle({
            'background-color': 'rgba(0,113,227,0.9)',
            'color': '#ffffff'
        });
    });

    text.on('mouseout', () => {
        infoWindow.close();
        text.setStyle({
            'background-color': 'rgba(255,255,255,0.9)',
            'color': '#1d1d1f'
        });
    });

    // 点击事件（同时处理标记和文本的点击）
    const handleClick = () => {
        // 直接将地图中心设置为景点位置
        map.setCenter(location.position);
        
        // 如果当前缩放级别小于目标级别，先放大再打开信息窗口
        const currentZoom = map.getZoom();
        const targetZoom = 14;
        
        if (currentZoom < targetZoom) {
            map.setZoom(targetZoom, {
                duration: 500,
                easing: 'easeOutCubic'
            });
        }
        
        // 延迟打开信息窗口，确保地图动画完成
        setTimeout(() => {
            infoWindow.open(map, marker.getPosition());
        }, 600);
    };

    marker.on('click', handleClick);
    text.on('click', handleClick);

    return marker;
}

// 绑定搜索和筛选事件
function bindSearchAndFilter() {
    // 搜索功能
    const searchInput = document.getElementById('search-input');
    searchInput.addEventListener('input', (e) => {
        searchText = e.target.value;
        initializeMarkersAndList();
    });

    // 筛选功能
    const filterChips = document.querySelectorAll('.chip');
    filterChips.forEach(chip => {
        chip.addEventListener('click', () => {
            // 更新选中状态
            filterChips.forEach(c => c.classList.remove('active'));
            chip.classList.add('active');

            // 更新筛选条件
            currentFilter = chip.dataset.type;
            initializeMarkersAndList();
        });
    });
}

// 显示错误信息
function showError(title, error) {
    debug(`错误: ${title} - ${error && error.message ? error.message : error}`, 'error');
    console.error(title, error);
    const errorModal = document.getElementById('error-modal');
    const errorDetails = document.getElementById('error-details');
    let message = '';
    let stack = '';
    if (typeof error === 'string') {
        message = error;
        stack = '';
    } else if (error && error.message) {
        message = error.message;
        stack = error.stack || '';
    } else {
        message = error ? error.toString() : '';
        stack = '';
    }
    errorDetails.textContent = `错误类型: ${title}\n具体信息: ${message}\n堆栈信息: ${stack || '无堆栈信息'}`;
    errorModal.style.display = 'block';
}

// 添加调试功能
function debug(message, type = 'info') {
    let debugContent = document.getElementById('debug-content');
    if (!debugContent) {
        // 自动创建调试面板
        let debugPanel = document.getElementById('debug-panel');
        if (!debugPanel) {
            debugPanel = document.createElement('div');
            debugPanel.id = 'debug-panel';
            debugPanel.className = 'debug-panel';
            debugPanel.style.display = 'none'; // 初始隐藏调试面板
            document.body.insertBefore(debugPanel, document.body.firstChild);
        }
        debugContent = document.createElement('div');
        debugContent.id = 'debug-content';
        debugContent.className = 'debug-content';
        debugPanel.appendChild(debugContent);
    }
    const timestamp = new Date().toLocaleTimeString();
    const formattedMessage = `[${timestamp}] ${message}\n`;
    const span = document.createElement('span');
    span.className = type;
    span.textContent = formattedMessage;
    debugContent.appendChild(span);
    debugContent.scrollTop = debugContent.scrollHeight;
}

function clearDebug() {
    document.getElementById('debug-content').innerHTML = '';
}

// 检查活动时间是否在用户选择的日期范围内
function isActivityInDateRange(activity, startDate, endDate) {
    // 解析活动时间
    const timeStr = activity.time;
    
    // 处理日期范围
    let activityStart, activityEnd;
    
    // 匹配几种可能的日期格式
    // 1. "5月1日 - 3日" 格式
    const dateRange1 = timeStr.match(/(\d+)月(\d+)日\s*-\s*(\d+)日/);
    // 2. "5月1日 - 5月3日" 格式
    const dateRange2 = timeStr.match(/(\d+)月(\d+)日\s*-\s*(\d+)月(\d+)日/);
    // 3. "5月1日" 单日格式
    const singleDate = timeStr.match(/(\d+)月(\d+)日/);
    
    try {
        if (dateRange1) {
            // 处理 "5月1日 - 3日" 格式
            const month = parseInt(dateRange1[1]);
            const startDay = parseInt(dateRange1[2]);
            const endDay = parseInt(dateRange1[3]);
            activityStart = new Date(2025, month - 1, startDay);
            activityEnd = new Date(2025, month - 1, endDay);
        } else if (dateRange2) {
            // 处理 "5月1日 - 5月3日" 格式
            const startMonth = parseInt(dateRange2[1]);
            const startDay = parseInt(dateRange2[2]);
            const endMonth = parseInt(dateRange2[3]);
            const endDay = parseInt(dateRange2[4]);
            activityStart = new Date(2025, startMonth - 1, startDay);
            activityEnd = new Date(2025, endMonth - 1, endDay);
        } else if (singleDate) {
            // 处理单日活动
            const month = parseInt(singleDate[1]);
            const day = parseInt(singleDate[2]);
            activityStart = new Date(2025, month - 1, day);
            activityEnd = activityStart;
        } else {
            return {
                isAvailable: false,
                reason: '活动时间格式无法解析: ' + timeStr
            };
        }

        // 解析每天的活动时间
        const dailyTime = timeStr.match(/每天(\d+)时至(\d+)时/);
        let dailyStartHour = 0, dailyEndHour = 23;
        if (dailyTime) {
            dailyStartHour = parseInt(dailyTime[1]);
            dailyEndHour = parseInt(dailyTime[2]);
        }

        // 设置具体的时间
        activityStart.setHours(dailyStartHour, 0, 0, 0);
        activityEnd.setHours(dailyEndHour, 59, 59, 999);

        // 检查日期是否重叠
        const isAvailable = activityStart <= endDate && activityEnd >= startDate;
        
        let reason = '';
        if (!isAvailable) {
            if (activityEnd < startDate) {
                reason = `活动在${formatDateTime(activityEnd)}结束，早于入住日期${formatDateTime(startDate)}`;
            } else if (activityStart > endDate) {
                reason = `活动在${formatDateTime(activityStart)}开始，晚于离店日期${formatDateTime(endDate)}`;
            }
        }

        return {
            isAvailable,
            reason,
            activityStart,
            activityEnd,
            dailyStartHour,
            dailyEndHour,
            timeDescription: `${formatDateTime(activityStart)} - ${formatDateTime(activityEnd)}, 每天${dailyStartHour}时至${dailyEndHour}时`
        };
    } catch (error) {
        return {
            isAvailable: false,
            reason: '时间解析出错: ' + error.message
        };
    }
}

// 格式化日期时间
function formatDateTime(date) {
    return `${date.getMonth() + 1}月${date.getDate()}日 ${date.getHours()}:00`;
}

// 规划路线
async function planRoute() {
    debug('planRoute函数开始执行', 'info');
    try {
        debug('开始规划路线...', 'info');
        
        // 获取住宿地点
        const stayPointInput = document.getElementById('stayPoint').value;
        if (!stayPointInput) {
            showError('请输入住宿地点');
            return;
        }

        // 获取规划天数
        const days = parseInt(document.getElementById('planDays').value) || 1;
        if (days < 1 || days > 5) {
            showError('请选择1-5天的行程');
            return;
        }

        // 获取起始日期
        const startDateStr = document.getElementById('startDate').value;
        if (!startDateStr) {
            showError('请选择开始日期');
            return;
        }
        const startDate = new Date(startDateStr);

        // 地理编码住宿地点
        const stayPoint = await geocodeAddress(stayPointInput);
        window.lastStayPoint = stayPoint; // 缓存
        
        // 确保路线规划结果容器存在
        let routePlanResult = document.getElementById('route-plan-result');
        if (!routePlanResult) {
            routePlanResult = document.createElement('div');
            routePlanResult.id = 'route-plan-result';
            routePlanResult.className = 'route-plan-result';
            document.querySelector('.panel-content').appendChild(routePlanResult);
        }

        // 生成路线规划
        const plan = days === 1
            ? await generateOneDayPlan(locations, stayPoint, startDate)
            : await generateMultiDayPlan(locations, stayPoint, days, startDate);

        // 缓存多日plan
        if (Array.isArray(plan)) {
            window.lastMultiPlan = plan;
        } else {
            window.lastMultiPlan = null;
        }

        // 显示下拉菜单（多日时）
        let daySelector = document.getElementById('day-selector');
        let dayDesc = document.getElementById('day-selector-desc');
        let dayWrap = document.getElementById('day-selector-wrap');
        if (Array.isArray(plan)) {
            // 创建包裹容器
            if (!dayWrap) {
                dayWrap = document.createElement('div');
                dayWrap.id = 'day-selector-wrap';
                dayWrap.style.display = 'flex';
                dayWrap.style.flexDirection = 'column';
                dayWrap.style.alignItems = 'flex-start';
                dayWrap.style.margin = '0 0 12px 0';
                routePlanResult.parentNode.insertBefore(dayWrap, routePlanResult);
            }
            // 插入描述文本
            if (!dayDesc) {
                dayDesc = document.createElement('span');
                dayDesc.id = 'day-selector-desc';
                dayDesc.textContent = '下拉选择切换当天路线';
                dayDesc.style.fontSize = '16px';
                dayDesc.style.color = '#1d1d1f';
                dayDesc.style.fontFamily = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
                dayDesc.style.fontWeight = '500';
                dayDesc.style.marginBottom = '4px';
                dayWrap.appendChild(dayDesc);
            }
            dayDesc.style.display = 'block';
            // 插入下拉框
            if (!daySelector) {
                daySelector = document.createElement('select');
                daySelector.id = 'day-selector';
                daySelector.className = 'day-selector';
                dayWrap.appendChild(daySelector);
            }
            daySelector.innerHTML = '';
            for (let i = 0; i < plan.length; i++) {
                const opt = document.createElement('option');
                opt.value = i;
                opt.textContent = `第${i+1}天`;
                daySelector.appendChild(opt);
            }
            daySelector.style.display = 'block';
            // 缩小下拉框尺寸
            daySelector.style.fontSize = '14px';
            daySelector.style.padding = '6px 28px 6px 10px';
            daySelector.style.minWidth = '80px';
            daySelector.style.borderRadius = '8px';
            // 切换天数时刷新地图
            daySelector.onchange = function() {
                showPlannedMarkersAndRoutes(plan, stayPoint, parseInt(this.value));
            };
        } else {
            if (daySelector) daySelector.style.display = 'none';
            if (dayDesc) dayDesc.style.display = 'none';
            if (dayWrap) dayWrap.style.display = 'none';
        }

        // 显示规划结果
        displayRoutePlan('route-plan-result', plan);
        debug('路线规划完成', 'success');
        // 新增：只显示推荐点和路线（多日时只显示第一天）
        if (Array.isArray(plan)) {
            showPlannedMarkersAndRoutes(plan, stayPoint, 0);
        } else {
            showPlannedMarkersAndRoutes(plan, stayPoint);
        }
    } catch (error) {
        debug('路线规划失败: ' + error.message, 'error');
        showError('路线规划失败', error);
    }
}

function generateOneDayPlan(locations, stayPoint, targetDate) {
    debug('生成单日行程计划...', 'info');
    
    const timeSlots = ['morning', 'afternoon', 'evening'];
    const plan = {
        date: targetDate,
        routes: timeSlots.map(slot => ({
            timeSlot: slot,
            activities: []
        }))
    };

    // 为每个时间段选择最合适的景点
    timeSlots.forEach(slot => {
        const route = plan.routes.find(r => r.timeSlot === slot);
        const availableLocations = locations.filter(loc => {
            // 检查是否已被其他时间段选择
            const isSelected = plan.routes.some(r => 
                r.activities.some(a => a.name === loc.name)
            );
            if (isSelected) return false;

            // 解析活动时间
            const timeInfo = parseActivityTime(loc.activities.time);
            
            // 检查日期是否可用
            return isActivityAvailable(timeInfo, targetDate);
        });

        // 按分数排序（距离40%，时间匹配度60%）
        const sortedLocations = availableLocations.map(loc => {
            const timeInfo = parseActivityTime(loc.activities.time);
            const distance = calculateDistance(stayPoint, loc.position);
            const distanceScore = 1 - Math.min(distance / 50, 1); // 50公里内线性计分
            const timeScore = getTimeScore(timeInfo, slot);
            const totalScore = distanceScore * 0.4 + timeScore * 0.6;

            return {
                location: loc,
                score: totalScore,
                timeInfo: timeInfo
            };
        }).sort((a, b) => b.score - a.score);

        // 选择前2个最佳景点 -> 只选1个最佳景点
        const selectedLocations = sortedLocations.slice(0, 1); // 每个时段只推荐1个景点
        route.activities = selectedLocations.map(item => ({
            ...item.location,
            duration: getActivityDuration(item.timeInfo)
        }));

        debug(`${slot}时段已选择${route.activities.length}个景点`, 'info');
    });

    return plan;
}

function generateMultiDayPlan(locations, stayPoint, days, startDate) {
    debug(`生成${days}天行程计划...`, 'info');
    
    const plans = [];
    const usedLocations = new Set();

    // 为每天生成行程
    for (let i = 0; i < days; i++) {
        const currentDate = new Date(startDate);
        currentDate.setDate(startDate.getDate() + i);
        
        const availableLocations = locations.filter(loc => {
            if (usedLocations.has(loc.name)) return false;
            
            const timeInfo = parseActivityTime(loc.activities.time);
            return isActivityAvailable(timeInfo, currentDate);
        });

        const dayPlan = {
            date: currentDate,
            routes: [
                { timeSlot: 'morning', activities: [] },
                { timeSlot: 'afternoon', activities: [] },
                { timeSlot: 'evening', activities: [] }
            ]
        };

        // 为每个时间段选择景点
        dayPlan.routes.forEach(route => {
            const slot = route.timeSlot;
            
            // 按分数排序
            const sortedLocations = availableLocations
                .filter(loc => !usedLocations.has(loc.name))
                .map(loc => {
                    const timeInfo = parseActivityTime(loc.activities.time);
                    const distance = calculateDistance(stayPoint, loc.position);
                    const distanceScore = 1 - Math.min(distance / 50, 1);
                    const timeScore = getTimeScore(timeInfo, slot);
                    const totalScore = distanceScore * 0.4 + timeScore * 0.6;

                    return {
                        location: loc,
                        score: totalScore,
                        timeInfo: timeInfo
                    };
                })
                .sort((a, b) => b.score - a.score);

            // 选择最佳景点（只选1个）
            const selectedLocations = sortedLocations.slice(0, 1); // 每个时段只推荐1个景点
            route.activities = selectedLocations.map(item => {
                usedLocations.add(item.location.name);
                return {
                    ...item.location,
                    duration: getActivityDuration(item.timeInfo)
                };
            });

            debug(`第${i + 1}天${slot}时段已选择${route.activities.length}个景点`, 'info');
        });

        plans.push(dayPlan);
    }

    return plans;
}

// 用高德JS SDK实现多种方式路径规划，兼容浏览器端，先加载插件
function getBestTransportByAmap(origin, destination) {
    debug(`开始查询交通方式: 起点[${origin}] 终点[${destination}]`, 'info');
    return new Promise((resolve) => {
        let results = [];
        AMap.plugin(['AMap.Walking', 'AMap.Riding', 'AMap.Driving'], function() {
            // 步行
            debug('正在查询步行路线...', 'info');
            const walking = new AMap.Walking();
            walking.search(origin, destination, (status, result) => {
                debug('步行路线查询结果:', 'info');
                debug(JSON.stringify(result), 'info');
                if (status === 'complete' && result.routes && result.routes[0]) {
                    const path = result.routes[0];
                    results.push({mode: '步行', time: Math.round(path.time/60), distance: (path.distance/1000).toFixed(1)});
                    debug(`步行可行: ${results[results.length-1].time}分钟, ${results[results.length-1].distance}km`, 'success');
                } else {
                    debug('步行路线无效', 'warning');
                }
                // 骑行
                debug('正在查询骑行路线...', 'info');
                const riding = new AMap.Riding();
                riding.search(origin, destination, (status2, result2) => {
                    debug('骑行路线查询结果:', 'info');
                    debug(JSON.stringify(result2), 'info');
                    if (status2 === 'complete' && result2.routes && result2.routes[0]) {
                        const path2 = result2.routes[0];
                        results.push({mode: '骑行', time: Math.round(path2.time/60), distance: (path2.distance/1000).toFixed(1)});
                        debug(`骑行可行: ${results[results.length-1].time}分钟, ${results[results.length-1].distance}km`, 'success');
                    } else {
                        debug('骑行路线无效', 'warning');
                    }
                    // 驾车
                    debug('正在查询驾车路线...', 'info');
                    const driving = new AMap.Driving();
                    driving.search(origin, destination, (status3, result3) => {
                        debug('驾车路线查询结果:', 'info');
                        debug(JSON.stringify(result3), 'info');
                        if (status3 === 'complete' && result3.routes && result3.routes[0]) {
                            const path3 = result3.routes[0];
                            results.push({mode: '驾车', time: Math.round(path3.time/60), distance: (path3.distance/1000).toFixed(1)});
                            debug(`驾车可行: ${results[results.length-1].time}分钟, ${results[results.length-1].distance}km`, 'success');
                        } else {
                            debug('驾车路线无效', 'warning');
                        }
                        // 选最快
                        debug(`共找到${results.length}种可行方案`, 'info');
                        if (results.length > 0) {
                            const best = results.reduce((a, b) => a.time <= b.time ? a : b);
                            debug(`最优方案: ${best.mode}, ${best.time}分钟, ${best.distance}km`, 'success');
                            resolve(best);
                        } else {
                            debug('未找到可行方案', 'warning');
                            resolve({mode: '--', time: '--', distance: '--'});
                        }
                    });
                });
            });
        });
    });
}

// 修改 displayRoutePlan，展示真实交通方式
function displayRoutePlan(elementId, plan) {
    debug('开始渲染路线规划结果', 'info');
    
    const container = document.getElementById(elementId);
    if (!container) {
        debug(`未找到容器元素: ${elementId}`, 'error');
        return;
    }
    container.innerHTML = '';

    const timeSlotNames = {
        morning: '上午',
        afternoon: '下午',
        evening: '晚上'
    };

    let stayPoint = null;
    if (window.lastStayPoint) {
        stayPoint = window.lastStayPoint;
        debug(`获取到住宿地点坐标: [${stayPoint.join(',')}]`, 'info');
    } else {
        debug('未找到住宿地点坐标', 'warning');
    }

    // 异步渲染每个景点的交通方式
    async function renderActivity(activity, parent) {
        debug(`开始渲染景点: ${activity.name}`, 'info');
        
        let transportInfo = {mode: '--', time: '--', distance: '--'};
        if (stayPoint) {
            debug(`查询去往 ${activity.name} 的交通方式`, 'info');
            transportInfo = await getBestTransportByAmap(stayPoint, activity.position);
        }
        
        const suit = activity.suitability || { 
            youth: '适合所有人群', 
            family: '适合所有人群', 
            elderly: '适合所有人群' 
        };
        
        const html = `
            <div class="activity">
                <h5>${activity.name}</h5>
                <p>${activity.activities.title}</p>
                <p>时间：${activity.activities.time}</p>
                <p class="description">${activity.activities.content}</p>
                <ul class="activity-extra">
                    <li>推荐交通工具：${transportInfo.mode}</li>
                    <li>距离：${transportInfo.distance} km</li>
                    <li>预计路程时间：${transportInfo.time} 分钟</li>
                </ul>
                <ul class="activity-suitability">
                    <li>年轻人：${suit.youth}</li>
                    <li>一家老小：${suit.family}</li>
                    <li>老年人：${suit.elderly}</li>
                </ul>
            </div>
        `;
        parent.insertAdjacentHTML('beforeend', html);
        debug(`景点 ${activity.name} 渲染完成`, 'success');
    }

    // 多日/单日异步渲染
    (async () => {
        try {
            debug('开始异步渲染行程', 'info');
            if (Array.isArray(plan)) {
                debug(`渲染${plan.length}天行程`, 'info');
                for (const [index, dayPlan] of plan.entries()) {
                    debug(`渲染第${index + 1}天行程`, 'info');
                    const dayElement = document.createElement('div');
                    dayElement.className = 'day-plan';
                    dayElement.innerHTML = `<h3>第${index + 1}天 (${formatDateTime(dayPlan.date)})</h3>`;
                    for (const route of dayPlan.routes) {
                        const slotDiv = document.createElement('div');
                        slotDiv.className = 'time-slot';
                        slotDiv.innerHTML = `<h4>${timeSlotNames[route.timeSlot]}</h4>`;
                        for (const activity of route.activities) {
                            await renderActivity(activity, slotDiv);
                        }
                        dayElement.appendChild(slotDiv);
                    }
                    container.appendChild(dayElement);
                    debug(`第${index + 1}天行程渲染完成`, 'success');
                }
            } else {
                debug('渲染单日行程', 'info');
                const dayElement = document.createElement('div');
                dayElement.className = 'day-plan';
                dayElement.innerHTML = `<h3>${formatDateTime(plan.date)}</h3>`;
                for (const route of plan.routes) {
                    const slotDiv = document.createElement('div');
                    slotDiv.className = 'time-slot';
                    slotDiv.innerHTML = `<h4>${timeSlotNames[route.timeSlot]}</h4>`;
                    for (const activity of route.activities) {
                        await renderActivity(activity, slotDiv);
                    }
                    dayElement.appendChild(slotDiv);
                }
                container.appendChild(dayElement);
                debug('单日行程渲染完成', 'success');
            }
            debug('所有行程渲染完成', 'success');
        } catch (error) {
            debug(`渲染过程出错: ${error.message}`, 'error');
        }
    })();
}

// 时间解析和计算工具函数
function parseActivityTime(timeStr) {
    const result = {
        startDate: null,
        endDate: null,
        dailyStartTime: null,
        dailyEndTime: null,
        isMultiDay: false,
        isDailyEvent: false
    };

    // 处理"每天"格式
    if (timeStr.includes('每天')) {
        result.isDailyEvent = true;
        const timeMatch = timeStr.match(/每天(\d{1,2})时至(\d{1,2})时/);
        if (timeMatch) {
            result.dailyStartTime = parseInt(timeMatch[1]);
            result.dailyEndTime = parseInt(timeMatch[2]);
        }
        return result;
    }

    // 处理日期范围
    const dateRangeMatch = timeStr.match(/(\d+)月(\d+)日(?:\s*-\s*(?:(\d+)月)?(\d+)日)?/);
    if (dateRangeMatch) {
        const startMonth = parseInt(dateRangeMatch[1]);
        const startDay = parseInt(dateRangeMatch[2]);
        const endMonth = dateRangeMatch[3] ? parseInt(dateRangeMatch[3]) : startMonth;
        const endDay = dateRangeMatch[4] ? parseInt(dateRangeMatch[4]) : startDay;

        const currentYear = new Date().getFullYear();
        result.startDate = new Date(currentYear, startMonth - 1, startDay);
        result.endDate = new Date(currentYear, endMonth - 1, endDay);
        result.isMultiDay = startDay !== endDay || startMonth !== endMonth;
    }

    // 处理具体时间
    const timeMatch = timeStr.match(/(\d{1,2})时(?:(\d{1,2})分)?至(\d{1,2})时(?:(\d{1,2})分)?/);
    if (timeMatch) {
        result.dailyStartTime = parseInt(timeMatch[1]);
        result.dailyEndTime = parseInt(timeMatch[3]);
    }

    return result;
}

function getActivityDuration(timeInfo) {
    if (!timeInfo.dailyStartTime || !timeInfo.dailyEndTime) {
        return 2; // 默认2小时
    }
    return timeInfo.dailyEndTime - timeInfo.dailyStartTime;
}

function isActivityAvailable(timeInfo, targetDate) {
    if (!timeInfo.startDate || !timeInfo.endDate) {
        return true;
    }

    if (timeInfo.isDailyEvent) {
        return true;
    }

    return targetDate >= timeInfo.startDate && targetDate <= timeInfo.endDate;
}

function getTimeSlot(timeInfo) {
    if (!timeInfo.dailyStartTime) {
        return 'any';
    }

    const startHour = timeInfo.dailyStartTime;
    if (startHour < 12) {
        return 'morning';
    } else if (startHour < 17) {
        return 'afternoon';
    } else {
        return 'evening';
    }
}

function getTimeScore(timeInfo, currentTimeSlot) {
    if (!timeInfo.dailyStartTime || currentTimeSlot === 'any') {
        return 0.5;
    }

    const activitySlot = getTimeSlot(timeInfo);
    if (activitySlot === currentTimeSlot) {
        return 1;
    } else if (
        (currentTimeSlot === 'morning' && activitySlot === 'afternoon') ||
        (currentTimeSlot === 'afternoon' && (activitySlot === 'morning' || activitySlot === 'evening')) ||
        (currentTimeSlot === 'evening' && activitySlot === 'afternoon')
    ) {
        return 0.5;
    }
    return 0;
}

// 地址转换为经纬度
async function geocodeAddress(address) {
    try {
        debug('开始地址解析: ' + address, 'info');
        const result = await new Promise((resolve, reject) => {
            AMap.plugin('AMap.Geocoder', () => {
                const geocoder = new AMap.Geocoder({
                    city: "汕尾",
                    radius: 1000
                });
                
                geocoder.getLocation(address, (status, result) => {
                    if (status === 'complete' && result.geocodes.length) {
                        const location = result.geocodes[0].location;
                        resolve([location.lng, location.lat]);
                    } else {
                        reject(new Error('地址解析失败: ' + status));
                    }
                });
            });
        });
        
        debug('地址解析成功: ' + result.join(','), 'success');
        return result;
    } catch (error) {
        debug('地址解析失败: ' + error.message, 'error');
        throw error;
    }
}

// 计算两点之间的距离（公里）
function calculateDistance(point1, point2) {
    const [lng1, lat1] = point1;
    const [lng2, lat2] = point2;
    const radLat1 = lat1 * Math.PI / 180.0;
    const radLat2 = lat2 * Math.PI / 180.0;
    const a = radLat1 - radLat2;
    const b = lng1 * Math.PI / 180.0 - lng2 * Math.PI / 180.0;
    let s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a/2),2) + 
        Math.cos(radLat1)*Math.cos(radLat2)*Math.pow(Math.sin(b/2),2)));
    s = s * 6378.137; // 地球半径
    return s;
}

// 工具函数：根据距离推荐交通工具和估算路程时间
function getTransportInfo(distanceKm) {
    let transport = '步行';
    let speed = 4; // km/h
    if (distanceKm > 1 && distanceKm <= 5) {
        transport = '骑行';
        speed = 15;
    } else if (distanceKm > 5 && distanceKm <= 20) {
        transport = '驾车/打车';
        speed = 40;
    } else if (distanceKm > 20) {
        transport = '驾车/公交';
        speed = 30;
    }
    const timeMin = Math.round((distanceKm / speed) * 60);
    return { transport, timeMin };
} 