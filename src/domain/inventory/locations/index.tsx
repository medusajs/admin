import Fade from "../../../components/atoms/fade-wrapper"
import Button from "../../../components/fundamentals/button"
import PlusIcon from "../../../components/fundamentals/icons/plus-icon"
import BodyCard from "../../../components/organisms/body-card"
import useToggleState from "../../../hooks/use-toggle-state"
import InventoryPageTableHeader from "../header"
import NewLocation from "./new"

const Locations = () => {
  const {
    state: createLocationState,
    close: closeLocationCreate,
    open: openLocationCreate,
  } = useToggleState()

  const Actions = (
    <Button variant="secondary" size="small" onClick={openLocationCreate}>
      <PlusIcon size={20} />
      Add location
    </Button>
  )

  return (
    <>
      <div className="flex flex-col h-full grow">
        <div className="flex flex-col w-full grow">
          <BodyCard
            customHeader={<InventoryPageTableHeader activeView="locations" />}
            className="h-fit"
            customActionable={Actions}
          ></BodyCard>
        </div>
      </div>
      <Fade isVisible={createLocationState} isFullScreen={true}>
        <NewLocation onClose={closeLocationCreate} />
      </Fade>
    </>
  )
}

export default Locations
