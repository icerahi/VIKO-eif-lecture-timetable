import { toast, ToastContainer, Zoom } from "react-toastify";

const ExamNotificationBtn = () => {
  const handleClick = () => {
    toast.info("This features is coming soon!", {
      toastId: "inapp-browser",
      position: "top-center",
      autoClose: 3000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      theme: "colored",
      transition: Zoom,
    });
  };
  return (
    <div className="m-1 flex justify-between items-center gap-1">
      <button
        onClick={handleClick}
        className=" text-sm bg-black skew-4 text-gray-50 font-bold p-1 rounded"
      >
        Exam
      </button>
      <button
        onClick={handleClick}
        className=" text-sm skew-4 bg-black text-gray-50 font-bold p-1 rounded"
      >
        Notification
      </button>{" "}
    </div>
  );
};
export default ExamNotificationBtn;
