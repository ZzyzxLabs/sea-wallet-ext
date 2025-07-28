import InitView from "~popView/initView"
import BottomNav from "~components/bottomNav"
import { usePopupStore } from "~statusManager/statusHolder"

export default function Main() {
  const state = usePopupStore((s) => s.state)

  const renderContent = () => {
    switch (state) {
      case "init":
        return <InitView />
      default:
        return null
    }
  }

  return (
    <div className="plasmo-w-[320px] plasmo-h-[480px] plasmo-flex plasmo-flex-col">
      <div className="plasmo-flex-1 plasmo-overflow-auto">{renderContent()}</div>
      <BottomNav />
    </div>
  )
}