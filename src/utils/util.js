/** 
 * @description 随机打乱数组元素的顺序
 * @param arr 待打乱的数组
 */
 function shuffle(arr) {
    let len = arr.length;

        for (let i = 0; i < len - 1; i++) {
            let index = parseInt(Math.random() * (len - i));
            let temp = arr[index];
            arr[index] = arr[len - i - 1];
            arr[len - i - 1] = temp;
        }

        return arr;
 }