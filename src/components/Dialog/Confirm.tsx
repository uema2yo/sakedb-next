type ConfirmType = "OK_CANCEL" | "YES_NO";

interface ConfirmProps {
  type: ConfirmType;
  func: () => Promise<void>;
  onClose: () => void;
}

const Confirm: React.FC<ConfirmProps> = ({ type, func, onClose }) => {
  const buttonName = {
    OK_CANCEL: ["OK", "キャンセル"],
    YES_NO: ["はい", "いいえ"]
  }
  
  const handleOk = () => {
    func();
  }
  return (
    <>
      <button onClick={handleOk}>{buttonName[type][0]}</button>
      <button onClick={onClose}>{buttonName[type][1]}</button>
    </>
  )
}

export default Confirm;
