import { ref, onBeforeMount,onBeforeUnmount } from 'vue';

export default function () {
    let mobile = ref(null);
    // 判断是否为手机屏幕
    function checkScreenSize() {
        if (window.innerWidth <= 768) {
            mobile.value = true;
        } else {
            mobile.value = false;
        }
    }
    onBeforeMount(() => {
        // 检测尺寸
        checkScreenSize();
        // 监听变化
        window.addEventListener("resize", checkScreenSize);
    });
    onBeforeUnmount(() => {
        // 当组件被卸载前，移除事件监听
        window.removeEventListener("resize", checkScreenSize);
    });
    return mobile;
}