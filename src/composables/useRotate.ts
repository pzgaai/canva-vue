import { useElementsStore } from '@/stores/elements'
import type { CanvasService } from '@/services/canvas/CanvasService'
import type { GroupElement } from '@/cores/types/element'

export function useRotate(canvasService: CanvasService | null | undefined) {
  const elementsStore = useElementsStore()

  const updateElementRotation = (selectedIds: string[], rotationAngle: number) => {
    selectedIds.forEach(id => {
      const el = elementsStore.getElementById(id)
      if (!el) return

      const newRotation = (el.rotation || 0) + rotationAngle

      if (el.type === 'image') {
        const imgEl = document.querySelector(`[data-element-id="${id}"]`) as HTMLElement
        if (imgEl) {
          imgEl.style.transformOrigin = '50% 50%'
          imgEl.style.transform = `translate3d(${el.x}px, ${el.y}px, 0) rotate(${newRotation}rad)`
          imgEl.style.width = `${el.width}px`
          imgEl.style.height = `${el.height}px`
        }
      } else if (el.type === 'text') {
        const textEl = document.querySelector(`[data-element-id="${id}"]`) as HTMLElement
        if (textEl) {
          textEl.style.transformOrigin = '50% 50%'
          textEl.style.transform = `translate3d(${el.x}px, ${el.y}px, 0) rotate(${newRotation}rad)`
          textEl.style.width = `${el.width}px`
          textEl.style.height = `${el.height}px`
        }
      } else if (el.type === 'group') {
        updateGroupRotation(el, rotationAngle)
      } else {
        const graphic = canvasService?.getRenderService().getGraphic(id)
        if (graphic) {
          graphic.pivot.set(el.width / 2, el.height / 2)
          graphic.x = el.x + el.width / 2
          graphic.y = el.y + el.height / 2
          graphic.rotation = newRotation
        }
      }
    })
  }

  const updateGroupRotation = (groupEl: GroupElement, rotationAngle: number) => {
    const groupCenterX = groupEl.x + groupEl.width / 2
    const groupCenterY = groupEl.y + groupEl.height / 2
    
    groupEl.children?.forEach((childId: string) => {
      const childEl = elementsStore.getElementById(childId)
      if (!childEl) return
      
      const childCenterX = childEl.x + childEl.width / 2
      const childCenterY = childEl.y + childEl.height / 2
      const relX = childCenterX - groupCenterX
      const relY = childCenterY - groupCenterY
      
      const cos = Math.cos(rotationAngle)
      const sin = Math.sin(rotationAngle)
      const newRelX = relX * cos - relY * sin
      const newRelY = relX * sin + relY * cos
      
      const newChildCenterX = groupCenterX + newRelX
      const newChildCenterY = groupCenterY + newRelY
      const newChildX = newChildCenterX - childEl.width / 2
      const newChildY = newChildCenterY - childEl.height / 2
      
      if (childEl.type === 'image') {
        const imgEl = document.querySelector(`[data-element-id="${childId}"]`) as HTMLElement
        if (imgEl) {
          imgEl.style.transformOrigin = '50% 50%'
          imgEl.style.transform = `translate3d(${newChildX}px, ${newChildY}px, 0) rotate(${(childEl.rotation || 0) + rotationAngle}rad)`
        }
      } else if (childEl.type === 'text') {
        const textEl = document.querySelector(`[data-element-id="${childId}"]`) as HTMLElement
        if (textEl) {
          textEl.style.transformOrigin = '50% 50%'
          textEl.style.transform = `translate3d(${newChildX}px, ${newChildY}px, 0) rotate(${(childEl.rotation || 0) + rotationAngle}rad)`
        }
      } else {
        const graphic = canvasService?.getRenderService().getGraphic(childId)
        if (graphic) {
          graphic.pivot.set(childEl.width / 2, childEl.height / 2)
          graphic.x = newChildCenterX
          graphic.y = newChildCenterY
          graphic.rotation = (childEl.rotation || 0) + rotationAngle
        }
      }
    })
  }

  const applyRotationToStore = (selectedIds: string[], rotationAngle: number) => {
    elementsStore.updateElements(selectedIds, (el) => {
      if (el.type === 'group') {
        const groupEl = el as GroupElement
        const groupCenterX = el.x + el.width / 2
        const groupCenterY = el.y + el.height / 2
        
        groupEl.children?.forEach((childId: string) => {
          const childEl = elementsStore.getElementById(childId)
          if (!childEl) return
          
          const childCenterX = childEl.x + childEl.width / 2
          const childCenterY = childEl.y + childEl.height / 2
          const relX = childCenterX - groupCenterX
          const relY = childCenterY - groupCenterY
          
          const cos = Math.cos(rotationAngle)
          const sin = Math.sin(rotationAngle)
          const newRelX = relX * cos - relY * sin
          const newRelY = relX * sin + relY * cos
          
          const newChildCenterX = groupCenterX + newRelX
          const newChildCenterY = groupCenterY + newRelY
          childEl.x = newChildCenterX - childEl.width / 2
          childEl.y = newChildCenterY - childEl.height / 2
          childEl.rotation = (childEl.rotation || 0) + rotationAngle
        })
        
        el.rotation = (el.rotation || 0) + rotationAngle
      } else {
        el.rotation = (el.rotation || 0) + rotationAngle
      }
    })
  }

  const resetElementsToFinalRotation = (selectedIds: string[]) => {
    selectedIds.forEach(id => {
      const el = elementsStore.getElementById(id)
      if (!el) return

      if (el.type === 'image') {
        const imgEl = document.querySelector(`[data-element-id="${id}"]`) as HTMLElement
        if (imgEl) {
          imgEl.style.transformOrigin = '50% 50%'
          imgEl.style.transform = `translate3d(${el.x}px, ${el.y}px, 0) rotate(${el.rotation || 0}rad)`
          imgEl.style.width = `${el.width}px`
          imgEl.style.height = `${el.height}px`
        }
      } else if (el.type === 'text') {
        const textEl = document.querySelector(`[data-element-id="${id}"]`) as HTMLElement
        if (textEl) {
          textEl.style.transformOrigin = '50% 50%'
          textEl.style.transform = `translate3d(${el.x}px, ${el.y}px, 0) rotate(${el.rotation || 0}rad)`
          textEl.style.width = `${el.width}px`
          textEl.style.height = `${el.height}px`
        }
      } else if (el.type === 'group') {
        const groupEl = el as GroupElement
        groupEl.children?.forEach((childId: string) => {
          const childEl = elementsStore.getElementById(childId)
          if (!childEl) return
          
          if (childEl.type === 'image') {
            const imgEl = document.querySelector(`[data-element-id="${childId}"]`) as HTMLElement
            if (imgEl) {
              imgEl.style.transformOrigin = '50% 50%'
              imgEl.style.transform = `translate3d(${childEl.x}px, ${childEl.y}px, 0) rotate(${childEl.rotation || 0}rad)`
            }
          } else if (childEl.type === 'text') {
            const textEl = document.querySelector(`[data-element-id="${childId}"]`) as HTMLElement
            if (textEl) {
              textEl.style.transformOrigin = '50% 50%'
              textEl.style.transform = `translate3d(${childEl.x}px, ${childEl.y}px, 0) rotate(${childEl.rotation || 0}rad)`
            }
          } else {
            const graphic = canvasService?.getRenderService().getGraphic(childId)
            if (graphic) {
              graphic.rotation = childEl.rotation || 0
            }
          }
        })
      } else {
        const graphic = canvasService?.getRenderService().getGraphic(id)
        if (graphic) {
          graphic.rotation = el.rotation || 0
        }
      }
    })
  }

  return {
    updateElementRotation,
    applyRotationToStore,
    resetElementsToFinalRotation
  }
}