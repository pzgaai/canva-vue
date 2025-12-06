/**
 * History 存储配置
 * 用于控制历史记录的存储策略、压缩阈值等
 */

export interface HistoryConfig {
  /** 最大保存的历史记录数 */
  maxStackSize: number
  
  /** 触发压缩的阈值（记录数超过此值时自动压缩） */
  compressThreshold: number
  
  /** 压缩时保留的记录数百分比 */
  compressRetainRatio: number
  
  /** 快照点间隔（每隔多少条diff记录保存一个快照） */
  snapshotInterval: number
  
  /** 是否启用自动压缩 */
  enableAutoCompress: boolean
  
  /** 最大内存占用（MB，超过时强制压缩） */
  maxMemoryMB: number
  
  /** 批操作延迟（ms，用于合并频繁操作） */
  batchDelay: number
}

/** 默认配置 - 针对100+元素和100+条历史记录优化 */
export const DEFAULT_HISTORY_CONFIG: HistoryConfig = {
  // 保存最多200条记录
  maxStackSize: 200,
  
  // 当达到100条时触发压缩
  compressThreshold: 100,
  
  // 压缩时保留50%的容量（100条）
  compressRetainRatio: 0.5,
  
  // 每30条diff记录保存一个快照点（减少重建时间）
  snapshotInterval: 30,
  
  // 启用自动压缩
  enableAutoCompress: true,
  
  // 限制内存使用在50MB以内
  maxMemoryMB: 50,
  
  // 批操作延迟30ms
  batchDelay: 30,
}

/** 内存优化配置 - 用于特别大的场景 */
export const MEMORY_OPTIMIZED_CONFIG: HistoryConfig = {
  maxStackSize: 150,
  compressThreshold: 80,
  compressRetainRatio: 0.4,
  snapshotInterval: 25,
  enableAutoCompress: true,
  maxMemoryMB: 30,
  batchDelay: 50,
}

/** 性能优化配置 - 允许更多历史记录以获得更流畅体验 */
export const PERFORMANCE_OPTIMIZED_CONFIG: HistoryConfig = {
  maxStackSize: 250,
  compressThreshold: 150,
  compressRetainRatio: 0.6,
  snapshotInterval: 40,
  enableAutoCompress: true,
  maxMemoryMB: 80,
  batchDelay: 20,
}

let currentConfig = DEFAULT_HISTORY_CONFIG

export function getHistoryConfig(): HistoryConfig {
  return currentConfig
}

export function setHistoryConfig(config: Partial<HistoryConfig>) {
  currentConfig = { ...currentConfig, ...config }
}

export function useMemoryOptimizedConfig() {
  setHistoryConfig(MEMORY_OPTIMIZED_CONFIG)
}

export function usePerformanceOptimizedConfig() {
  setHistoryConfig(PERFORMANCE_OPTIMIZED_CONFIG)
}

export function resetHistoryConfig() {
  currentConfig = DEFAULT_HISTORY_CONFIG
}
