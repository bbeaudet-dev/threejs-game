import Crosshairs from './Crosshairs'
import DebugHUD from './DebugHUD'
import InteractionTooltip from './InteractionTooltip'
import MessageDisplay from './MessageDisplay'
import Compass from './Compass'
import Inventory from './Inventory'
import { useInteraction } from '../../systems/InteractionSystem'

export default function HUD() {
  const { hoveredObject } = useInteraction()

  return (
    <>
      <Crosshairs isHovering={hoveredObject !== null} />
      <Compass />
      <InteractionTooltip />
      <MessageDisplay />
      <DebugHUD />
      <Inventory />
    </>
  )
}

