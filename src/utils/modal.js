import React from 'react';
import { Modal } from 'antd';

const { confirm } = Modal;

/**
 * @description 危险操作弹窗警告
 * @param {*} operateEntry 提示的消息
 * @param {*} operateFunc 执行危险操作的方法
 */
export function dangerOperateConfirm(operateEntry, operateFunc) {
    confirm({
        title: '提示 :',
        content: operateEntry,
        okText: '确定',
        okType: 'danger',
        cancelText: '取消',
        onOk: operateFunc,
        onCancel: () => {}
    });
}

/**
 * @description 错误信息弹窗提示
 * @param {*} errorMsg 提示的错误信息
 * @param {*} errorInfo 接口中返回的错误信息
 */
export function errorModal(errorMsg, errorInfo) {
    Modal.error({
        title: errorMsg,
        content: (
            <div>
                <p style={{ color: 'red', paddingTop: '10px' }}>错误信息：{errorInfo}</p>
                <p>请重新尝试或联系fastest小助手，提供错误信息，我们将尽快为您解决！</p>
            </div>
        ),
        okText: '确定',
        okType: 'danger',
    });
}