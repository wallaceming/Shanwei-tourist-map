// 高德地图安全密钥配置
window._AMapSecurityConfig = {
    securityJsCode: 'edefba2564645a3b203c44d0a83bb450'
};

// 高德地图配置
window.AMAP_CONFIG = {
    key: '0d258e67e94c23ce74f563b252b56b89',
    version: '2.0',
    plugins: [
        'AMap.ToolBar',
        'AMap.Scale',
        'AMap.Geolocation',
        'AMap.Geocoder',
        'AMap.InfoWindow',
        'AMap.GeometryUtil',
        'AMap.Text'
    ]
};

// 加载高德地图API
function loadAMapScript() {
    return new Promise((resolve, reject) => {
        if (window.AMap) {
            resolve(window.AMap);
            return;
        }

        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.async = true;
        script.src = `https://webapi.amap.com/maps?v=${AMAP_CONFIG.version}&key=${AMAP_CONFIG.key}&plugin=${AMAP_CONFIG.plugins.join(',')}`;
        
        script.onload = () => {
            console.log('高德地图API加载成功');
            resolve(window.AMap);
        };
        
        script.onerror = () => {
            console.error('高德地图API加载失败');
            reject(new Error('高德地图API加载失败'));
        };

        document.head.appendChild(script);
    });
} 