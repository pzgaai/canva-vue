/**
 * 核心层-画布类型定义
 * 功能：定义画布配置的类型规范
 * 服务对象：为整个项目的画布配置提供统一的类型支持
 */
export interface CanvasOptions {
  width: number
  height: number
  backgroundColor: string
}

/**
 * 坐标点
 */
export interface Point {
  x: number
  y: number
}

/**
 * 矩形区域
 */
export interface Rectangle {
  x: number
  y: number
  width: number
  height: number
}

/**
 * 视口状态
 * 描述无限画布中的相机视图
 */
export interface ViewportState {
  /** 相机在世界坐标中的位置（中心点） */
  x: number
  y: number
  /** 缩放级别 (0.1 ~ 10) */
  zoom: number
  /** 旋转角度（弧度） */
  rotation: number
}

/**
 * 视口配置
 */
export interface ViewportConfig {
  /** 最小缩放 */
  minZoom: number
  /** 最大缩放 */
  maxZoom: number
  /** 默认缩放 */
  defaultZoom: number
  /** 缩放步长 */
  zoomStep: number
  /** 是否启用边界限制 */
  enableBounds: boolean
  /** 世界边界（如果启用） */
  worldBounds?: Rectangle
  /** 是否启用惯性滚动 */
  enableInertia: boolean
  /** 惯性阻尼系数 */
  inertiaDamping: number
}

/**
 * 相机系统
 * 管理视口在无限画布中的移动和缩放
 */
export interface Camera {
  /** 视口状态 */
  viewport: ViewportState
  /** 视口配置 */
  config: ViewportConfig
  /** 视口宽度（屏幕像素） */
  viewportWidth: number
  /** 视口高度（屏幕像素） */
  viewportHeight: number
}

/**
 * 坐标转换结果
 */
export interface TransformResult {
  /** 转换后的x坐标 */
  x: number
  /** 转换后的y坐标 */
  y: number
}

/**
 * 可见区域（世界坐标）
 */
export interface VisibleBounds extends Rectangle {
  /** 左边界 */
  left: number
  /** 右边界 */
  right: number
  /** 上边界 */
  top: number
  /** 下边界 */
  bottom: number
}
