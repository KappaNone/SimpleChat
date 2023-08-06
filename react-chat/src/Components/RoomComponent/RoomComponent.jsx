import './styles/RoomComponent.css'
import PropTypes from 'prop-types'
import { createdRoomKeyAtom } from '../../Atoms';
import { useLocation } from 'wouter';
import { useAtom } from 'jotai';
function RoomComponent({roomId, amountOfUsers, visibility }) {
  
  const [, setRoomId] = useAtom(createdRoomKeyAtom);
  const [, setLocation] = useLocation()
  function joinRoom() {
    setRoomId(roomId)
    setLocation('/joinChat');
  }


  return (
    <>
      { visibility &&

        <div className='room' onClick={joinRoom}>
          <div className="contentContainer">

            <div className='roomId'>{roomId}</div>
            <div className='amountOfUsers'>{amountOfUsers}</div>
          </div>
        </div>
      }
    </>

  )
}

RoomComponent.propTypes = {
  roomId: PropTypes.string,
  amountOfUsers: PropTypes.number,
  visibility: PropTypes.bool
}

export default RoomComponent