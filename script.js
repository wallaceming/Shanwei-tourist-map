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
    try {
        // 显示加载提示
        document.getElementById('loading').style.display = 'block';
        debug('initMap函数开始执行', 'info');
        
        // 检查locations是否正确加载
        if (typeof locations === 'undefined') {
            throw new Error('locations数组未定义，请检查locations.js是否正确加载');
        }
        debug(`locations数组加载成功，包含${locations.length}个地点`, 'success');
        
        // 等待高德地图API加载
        debug('正在加载高德地图API...', 'info');
        await loadAMapScript();
        debug('高德地图API加载成功', 'success');
        
        // 创建地图实例
        debug('正在创建地图实例...', 'info');
        map = new AMap.Map('map-container', {
            zoom: 11,
            center: [115.375557, 22.787204], // 汕尾市中心
            viewMode: '2D',
            resizeEnable: true
        });

        // 等待地图加载完成
        await new Promise((resolve, reject) => {
            map.on('complete', () => {
                debug('地图实例加载完成', 'success');
                resolve();
            });
            
            map.on('error', (error) => {
                debug('地图加载错误: ' + error.message, 'error');
                reject(error);
            });
            
            setTimeout(() => {
                reject(new Error('地图加载超时（10秒）'));
            }, 10000);
        });

        // 添加地图控件
        debug('正在添加地图控件...', 'info');
        map.addControl(new AMap.ToolBar({ position: 'RB' }));
        map.addControl(new AMap.Scale({ position: 'LB' }));

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
        debug('地图控件添加完成', 'success');

        // 初始化标记和列表
        debug('正在初始化标记和列表...', 'info');
        await initializeMarkersAndList();
        debug('标记和列表初始化完成', 'success');
        
        // 绑定搜索和筛选事件
        debug('正在绑定搜索和筛选事件...', 'info');
        bindSearchAndFilter();
        debug('搜索和筛选事件绑定完成', 'success');
        
        // 隐藏加载提示
        document.getElementById('loading').style.display = 'none';
        debug('地图初始化全部完成！', 'success');
        
    } catch (error) {
        console.error('地图初始化失败:', error);
        debug('地图初始化失败: ' + error.message, 'error');
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
    const debugContent = document.getElementById('debug-content');
    if (!debugContent) return;

    const timestamp = new Date().toLocaleTimeString();
    const messageDiv = document.createElement('div');
    messageDiv.className = `debug-message ${type}`;
    
    // 根据消息类型设置图标
    const icons = {
        'info': '🔵',
        'success': '✅',
        'error': '❌',
        'warning': '⚠️'
    };
    
    messageDiv.innerHTML = `
        <span class="debug-time">[${timestamp}]</span>
        <span class="debug-icon">${icons[type] || icons.info}</span>
        <span class="debug-text">${message}</span>
    `;
    
    debugContent.appendChild(messageDiv);
    debugContent.scrollTop = debugContent.scrollHeight;

    // 如果是错误消息，保持debug面板可见
    if (type === 'error') {
        const debugPanel = document.getElementById('debug-panel');
        if (debugPanel) {
            debugPanel.style.display = 'block';
            debugPanel.style.backgroundColor = 'rgba(255, 235, 235, 0.95)';
            setTimeout(() => {
                debugPanel.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
            }, 3000);
        }
    }
}

function clearDebug() {
    const debugContent = document.getElementById('debug-content');
    if (debugContent) {
        debugContent.innerHTML = '';
    }
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

// 旅游轮盘相关变量
let rouletteCanvas;
let rouletteCtx;
let currentRotation = 0;
let isSpinning = false;
let filteredLocations = [];
let rouletteHistory = []; // 新增：抽选历史

// 初始化旅游轮盘
function initRoulette() {
    debug('初始化旅游轮盘...', 'info');
    // 获取轮盘元素
    rouletteCanvas = document.getElementById('roulette-canvas');
    rouletteCtx = rouletteCanvas.getContext('2d');
    // 设置canvas尺寸
    const size = Math.min(rouletteCanvas.parentElement.clientWidth, rouletteCanvas.parentElement.clientHeight);
    rouletteCanvas.width = size;
    rouletteCanvas.height = size;
    // 初始化事件监听
    initRoulettePanelEvents();
    initSpinButtonEvent(); // 只保留抽选按钮事件
    // 绘制初始轮盘
    updateRouletteWheel();
    debug('旅游轮盘初始化完成', 'success');
}

// 初始化轮盘面板事件
function initRoulettePanelEvents() {
    const roulettePanel = document.querySelector('.roulette-panel');
    const toggleButton = document.querySelector('.toggle-roulette');
    toggleButton.addEventListener('click', () => {
        roulettePanel.classList.toggle('expanded');
        // 保存状态到localStorage
        localStorage.setItem('roulettePanelExpanded', roulettePanel.classList.contains('expanded'));
    });
    // 恢复上次的展开状态
    const wasExpanded = localStorage.getItem('roulettePanelExpanded') === 'true';
    if (wasExpanded) {
        roulettePanel.classList.add('expanded');
    }
}

// 初始化开始抽选按钮事件
function initSpinButtonEvent() {
    const spinButton = document.getElementById('spin-button');
    spinButton.addEventListener('click', () => {
        if (!isSpinning) {
            spinRoulette();
        }
    });
}

// 更新轮盘显示（始终用全部景点）
function updateRouletteWheel() {
    filteredLocations = locations; // 不再筛选类型，直接用全部景点
    if (filteredLocations.length === 0) {
        showError('没有找到可用的景点');
        return;
    }
    // 清空画布
    rouletteCtx.clearRect(0, 0, rouletteCanvas.width, rouletteCanvas.height);
    
    const centerX = rouletteCanvas.width / 2;
    const centerY = rouletteCanvas.height / 2;
    const radius = Math.min(centerX, centerY) - 10;
    
    // 计算每个扇区的角度
    const sectorAngle = (2 * Math.PI) / filteredLocations.length;
    
    // 定义配色方案
    const colors = [
        ['#007AFF', '#E3F2FD'], // 蓝色系
        ['#34C759', '#E8F5E9'], // 绿色系
        ['#FF9500', '#FFF3E0'], // 橙色系
        ['#AF52DE', '#F3E5F5'], // 紫色系
        ['#FF2D55', '#FFEBEE']  // 红色系
    ];
    
    // 绘制扇区
    filteredLocations.forEach((location, index) => {
        const startAngle = index * sectorAngle + currentRotation;
        const endAngle = (index + 1) * sectorAngle + currentRotation;
        
        // 选择颜色
        const colorPair = colors[index % colors.length];
        
        // 绘制扇区
        rouletteCtx.beginPath();
        rouletteCtx.moveTo(centerX, centerY);
        rouletteCtx.arc(centerX, centerY, radius, startAngle, endAngle);
        rouletteCtx.closePath();
        
        // 使用渐变填充
        const gradient = rouletteCtx.createRadialGradient(
            centerX, centerY, radius * 0.5,
            centerX, centerY, radius
        );
        gradient.addColorStop(0, colorPair[1]);
        gradient.addColorStop(1, colorPair[0]);
        rouletteCtx.fillStyle = gradient;
        rouletteCtx.fill();
        
        // 绘制分隔线
        rouletteCtx.beginPath();
        rouletteCtx.moveTo(centerX, centerY);
        rouletteCtx.lineTo(
            centerX + Math.cos(endAngle) * radius,
            centerY + Math.sin(endAngle) * radius
        );
        rouletteCtx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
        rouletteCtx.lineWidth = 1;
        rouletteCtx.stroke();
        
        // 绘制文字
        rouletteCtx.save();
        rouletteCtx.translate(centerX, centerY);
        rouletteCtx.rotate(startAngle + sectorAngle / 2);
        rouletteCtx.textAlign = 'right';
        rouletteCtx.fillStyle = '#1d1d1f';
        rouletteCtx.font = '10px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
        // 将文字位置调整到离圆心更远的位置
        rouletteCtx.fillText(location.name.slice(0, 8), radius - 30, 0);
        rouletteCtx.restore();
    });
    
    // 绘制内圆和中心装饰
    const innerRadius = 25;
    
    // 绘制内圆渐变背景
    const innerGradient = rouletteCtx.createRadialGradient(
        centerX, centerY, 0,
        centerX, centerY, innerRadius
    );
    innerGradient.addColorStop(0, '#0071e3');
    innerGradient.addColorStop(1, '#0077ed');
    
    rouletteCtx.beginPath();
    rouletteCtx.arc(centerX, centerY, innerRadius, 0, 2 * Math.PI);
    rouletteCtx.fillStyle = innerGradient;
    rouletteCtx.fill();
    
    // 添加内圆白色边框
    rouletteCtx.beginPath();
    rouletteCtx.arc(centerX, centerY, innerRadius, 0, 2 * Math.PI);
    rouletteCtx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
    rouletteCtx.lineWidth = 2;
    rouletteCtx.stroke();
    
    // 绘制指针（黄色，大小为原来一半）
    const pointerLength = innerRadius; // 原为innerRadius
    const pointerWidth = 10; // 原为20
    rouletteCtx.beginPath();
    rouletteCtx.moveTo(centerX + pointerLength / 2, centerY);
    rouletteCtx.lineTo(centerX - pointerLength / 2, centerY - pointerWidth / 2);
    rouletteCtx.lineTo(centerX - pointerLength / 2, centerY + pointerWidth / 2);
    rouletteCtx.closePath();
    rouletteCtx.fillStyle = '#FFD600'; // 黄色
    rouletteCtx.fill();
    rouletteCtx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
    rouletteCtx.lineWidth = 1;
    rouletteCtx.stroke();
}

// 旋转轮盘
function spinRoulette() {
    if (filteredLocations.length === 0) return;
    
    isSpinning = true;
    const spinButton = document.getElementById('spin-button');
    spinButton.classList.add('spinning');
    spinButton.textContent = '抽选中...';
    
    // 生成随机旋转角度（至少3圈）
    const targetRotation = currentRotation - (Math.random() * Math.PI * 4 + Math.PI * 6);
    const duration = 5000; // 5秒
    const startTime = Date.now();
    const startRotation = currentRotation;
    
    function animate() {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // 使用缓动函数使动画更自然
        const easeOut = 1 - Math.pow(1 - progress, 3);
        currentRotation = startRotation + (targetRotation - startRotation) * easeOut;
        
        updateRouletteWheel();
        
        if (progress < 1) {
            requestAnimationFrame(animate);
        } else {
            finishSpin(targetRotation);
        }
    }
    
    animate();
}

// 完成旋转
function finishSpin(targetRotation) {
    isSpinning = false;
    currentRotation = targetRotation;
    // 计算结果
    const sectorAngle = (2 * Math.PI) / filteredLocations.length;
    const normalizedRotation = -currentRotation % (2 * Math.PI);
    const selectedIndex = Math.floor(normalizedRotation / sectorAngle) % filteredLocations.length;
    const selectedLocation = filteredLocations[selectedIndex];
    // 更新UI
    const spinButton = document.getElementById('spin-button');
    spinButton.classList.remove('spinning');
    spinButton.textContent = '开始抽选';
    // 显示地点名称在抽选结果标题同行
    const selectedNameDiv = document.getElementById('roulette-selected-name');
    if (selectedNameDiv) {
        selectedNameDiv.textContent = selectedLocation.name;
        selectedNameDiv.style.display = 'block';
    }
    // 显示详细活动信息
    const resultContent = document.getElementById('result-content');
    let suitabilityHtml = '';
    if (selectedLocation.suitability) {
        suitabilityHtml = `<div style='margin-top:8px;'>`
            + Object.entries(selectedLocation.suitability).map(([k, v]) => `<div><b>${k === 'youth' ? '青年' : k === 'family' ? '家庭' : k === 'elderly' ? '长者' : k}：</b>${v}</div>`).join('')
            + `</div>`;
    }
    resultContent.innerHTML = `
        <div class="result-item">
            <h4>${selectedLocation.name}</h4>
            <div style="margin-bottom:8px;color:#888;">${selectedLocation.description || '暂无描述'}</div>
            <div style="margin-bottom:8px;"><span class="type-tag">${selectedLocation.type}</span></div>
            <div style="margin-bottom:8px;"><b>活动：</b>${selectedLocation.activities?.title || '无'}</div>
            <div style="margin-bottom:8px;"><b>时间：</b>${selectedLocation.activities?.time || '无'}</div>
            <div style="margin-bottom:8px;"><b>内容：</b>${selectedLocation.activities?.content || '无'}</div>
            ${suitabilityHtml}
        </div>
    `;
    // 记录历史
    const now = new Date();
    rouletteHistory.unshift({
        name: selectedLocation.name,
        time: now.toLocaleTimeString(),
        type: selectedLocation.type
    });
    if (rouletteHistory.length > 10) rouletteHistory.length = 10; // 最多保留10条
    renderRouletteHistory();
    // 在地图上标记选中的位置（用position字段）
    if (selectedLocation.position && selectedLocation.position.length === 2) {
        map.setZoomAndCenter(15, selectedLocation.position);
        // marker动画（假设markers和location一一对应，按name匹配）
        if (typeof markers !== 'undefined') {
            markers.forEach(marker => {
                if (marker.getTitle && marker.getTitle() === selectedLocation.name) {
                    marker.setAnimation('AMAP_ANIMATION_BOUNCE');
                    setTimeout(() => marker.setAnimation(null), 2000);
                }
            });
        }
    }
    // 显示清空历史按钮
    const clearBtn = document.getElementById('clear-roulette-history');
    if (clearBtn) clearBtn.style.display = rouletteHistory.length > 0 ? 'inline-block' : 'none';
}

// 新增：渲染抽选历史，支持点击跳转地图定位
function renderRouletteHistory() {
    const historyDiv = document.getElementById('roulette-history');
    if (!historyDiv) return;
    if (rouletteHistory.length === 0) {
        historyDiv.innerHTML = '';
        const clearBtn = document.getElementById('clear-roulette-history');
        if (clearBtn) clearBtn.style.display = 'none';
        return;
    }
    historyDiv.innerHTML = '<div style="font-weight: bold; color: #888; margin-bottom: 4px;">抽选历史</div>' +
        '<ul id="roulette-history-list" style="padding-left: 18px; margin: 0;">' +
        rouletteHistory.map((item, idx) => `<li data-index="${idx}" style="margin-bottom:2px;font-size:13px;cursor:pointer;"><span style='color:#0071e3;text-decoration:underline;'>${item.name}</span> <span style='color:#aaa;font-size:12px;'>${item.time}</span> <span style='background:#f5f5f7;color:#515154;border-radius:8px;padding:2px 8px;margin-left:4px;font-size:11px;'>${item.type}</span></li>`).join('') +
        '</ul>';
    // 绑定点击事件：点击历史项跳转地图定位
    const ul = document.getElementById('roulette-history-list');
    if (ul) {
        Array.from(ul.children).forEach(li => {
            li.onclick = function() {
                const idx = parseInt(this.getAttribute('data-index'));
                const item = rouletteHistory[idx];
                if (!item) return;
                // 查找景点
                const loc = locations.find(l => l.name === item.name);
                if (loc && loc.position && loc.position.length === 2) {
                    map.setZoomAndCenter(15, loc.position);
                    if (typeof markers !== 'undefined') {
                        markers.forEach(marker => {
                            if (marker.getTitle && marker.getTitle() === loc.name) {
                                marker.setAnimation('AMAP_ANIMATION_BOUNCE');
                                setTimeout(() => marker.setAnimation(null), 2000);
                            }
                        });
                    }
                }
            };
        });
    }
    // 显示清空历史按钮
    const clearBtn = document.getElementById('clear-roulette-history');
    if (clearBtn) clearBtn.style.display = 'inline-block';
}

// 新增：清空历史按钮事件
window.addEventListener('DOMContentLoaded', () => {
    const clearBtn = document.getElementById('clear-roulette-history');
    if (clearBtn) {
        clearBtn.onclick = function() {
            rouletteHistory = [];
            renderRouletteHistory();
            // 同步隐藏地点名
            const selectedNameDiv = document.getElementById('roulette-selected-name');
            if (selectedNameDiv) selectedNameDiv.style.display = 'none';
            // 清空结果内容
            const resultContent = document.getElementById('result-content');
            if (resultContent) resultContent.innerHTML = '<p class="result-placeholder">点击"开始抽选"开始您的幸运之旅</p>';
        };
    }
});

// 在初始化地图后调用初始化轮盘
document.addEventListener('DOMContentLoaded', () => {
    // 等待地图加载完成后初始化轮盘
    const checkMapInterval = setInterval(() => {
        if (map) {
            clearInterval(checkMapInterval);
            initRoulette();
        }
    }, 100);
}); 