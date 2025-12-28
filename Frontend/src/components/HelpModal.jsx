import { useState } from "react"
import Button from "./Button"

// Just the modal dialog - can be used anywhere
function HelpModal() {
  const emergencyNumbers = [
    'India: 112',
    'US: 911',
    'UK: 999',
    'EU: 112',
    'Australia: 000',
    'Canada: 911'
  ]

  const [selectedNumber, setSelectedNumber] = useState(emergencyNumbers[0].split(' ')[2])

  const handleCall = () => {
    window.location.href = `tel:${selectedNumber}`
  }

  return (
    <dialog id="my_modal_5" className="modal modal-bottom sm:modal-middle">
      <div className="modal-box flex gap-3 flex-col items-center">
        <h3 className="font-bold text-darkGreen text-xl">Urgent Help</h3>
        <p className="py-3 text-lg border-b w-full text-center border-gray-400/70 ">Need immediate support? These numbers can help.</p>
        <div className="flex mt-5 gap-3 w-10/12 justify-between">
          <select 
            className="border border-gray-300 shadow-sm shadow-black/20  rounded-lg focus:outline-0 min-w-60 px-3" 
            value={selectedNumber}
            onChange={(e) => setSelectedNumber(e.target.value)}
          >
            {emergencyNumbers.map((item, index) => (
              <option key={index} value={item.split(' ')[1]}>
                {item}
              </option>
            ))}
          </select>
          <Button 
            class="w-full border py-2 px-3 rounded-md text-white font-semibold border-white hover:bg-red-700 bg-emergencyButton " 
            text="Call" 
            click={handleCall}
          />
        </div>
        <p className="text-darkGreen font-semibold mt-4" >"Take a breath — help is one tap away."</p>
        <div className="modal-action">
          <form method="dialog">
            <button className="btn mt-2">Close</button>
          </form>
        </div>
      </div>
    </dialog>
  )
}

// Banner with button - only for Home page
export function HelpBanner() {
  return (
    <div className="bg-rose-100 flex gap-3 py-1 justify-center items-center">
      <p className="text-[12px] ml-2 md:ml-0 md:text-sm text-rose-800 font-semibold">If you are in immediate danger, call your local emergency number now.</p>
      <Button text="Get Help Now" class="btn btn-error mr-2 md:mr-0 bg-emergencyButton border-none hover:bg-red-700 text-white" click={() => document.getElementById('my_modal_5').showModal()} />
    </div>
  )
}

export default HelpModal
