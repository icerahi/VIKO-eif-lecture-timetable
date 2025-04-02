import "./Today.css";
import moment from "moment";
import { lightenHexToRgb } from "../utils/lightenColor";
import { ToastContainer, toast, Bounce } from "react-toastify";
import { useClipboard } from "@custom-react-hooks/use-clipboard";
import copyIcon from "../../assets/copytoclipboard.png";
const Taday = ({
  groups,
  setSelectCurrentGroup,
  selectCurrentGroup,
  changedLectures,
  date,
  lectures,
  setNextDay,
  setToday,
  setPrevDay,
}) => {
  const { copyToClipboard } = useClipboard();

  const CheckLectureStatus = (lecture) => {
    if (changedLectures.some((item) => item.paskaita === lecture.periodno)) {
      const lec = changedLectures.find((l) => l.paskaita === lecture.periodno);
      return { room: lec.auditorija, teacher: lec.destytojas };
    }
  };

  const handleGroupChange = (e) => {
    const groupObj = JSON.parse(e.target.value);
    setSelectCurrentGroup(groupObj);
    localStorage.setItem("current_group", e.target.value);
  };

  const checkDate = (date) => {
    if (moment(date).isSame(moment(), "day")) {
      return "Today, ";
    } else if (moment(date).isSame(moment().add(1, "day"), "day")) {
      return "Tomorrow, ";
    } else if (moment(date).isSame(moment().subtract(1, "day"), "day")) {
      return "Yesterday, ";
    } else {
      return;
    }
  };

  const handleShare = () => {
    copyToClipboard(window.location.href);
    toast.success(
      `Copied to your clip board! 
       ${window.location.href}`,
      {
        position: "top-left",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      }
    );
  };

  return (
    <div className="today-container">
      <div className="timetable">
        <div className="camera-nosile"></div>

        <div className="lecture-container">
          <div className="flex justify-between items-center">
            <h1 className="title-info text-2xl">
              {checkDate(date)}
              {date.format("ddd MMM DD YYYY")}
            </h1>
            {/* copy button  */}
            <button
              className="btn-primary border-0 hover:scale-125 transition-all duration-500"
              title={`Copy to clipboard`}
              onClick={handleShare}
            >
              <img width={30} src={copyIcon} />
            </button>
          </div>

          <div className="lectures">
            {lectures.length == 0 && (
              <p>No lectures information available for the selected day!</p>
            )}
            {lectures?.map((lecture) => (
              <div
                key={lecture.periodno}
                className={`${
                  CheckLectureStatus(lecture)?.room === "-"
                    ? "no-lecture"
                    : "lecture"
                } ${lecture.changed && "info"}`}
                style={{
                  "--changed-info": `Changed! Check out teacher for more details!`,
                  "--lecture-info": `"${CheckLectureStatus(lecture)?.teacher}"`,
                  backgroundColor: lightenHexToRgb(lecture?.colors, 0.4), // Lighten by 50%
                }}
              >
                {console.log(lecture)}
                <div>
                  <p>{lecture.periodno}</p>
                </div>
                <div>
                  <h3 className="font-bold">{lecture.subject}</h3>
                  <p>
                    {lecture.starttime} - {lecture.endtime}
                  </p>
                </div>
                <div>
                  <p>
                    Room-
                    {CheckLectureStatus(lecture)?.room === "-" ? (
                      `${lecture.classroom}`
                    ) : (
                      <>
                        {CheckLectureStatus(lecture)?.room ? (
                          <>
                            <del>{lecture.classroom} </del>
                            {CheckLectureStatus(lecture)?.room}
                          </>
                        ) : (
                          `${lecture.classroom}`
                        )}
                      </>
                    )}{" "}
                  </p>
                  <p>
                    <em>{lecture.teacher}</em>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-center items-center fixed bottom-0 left-1/2 translate-x-[-50%] w-[max-content]">
          <button
            className="btn-primary  hover:scale-105 transition-all duration-500"
            onClick={setPrevDay}
          >
            PreviousDay
          </button>
          <button
            className="btn-primary  hover:scale-105 transition-all duration-500"
            onClick={setToday}
          >
            TodayDay
          </button>
          <button
            className="btn-primary hover:scale-105 transition-all duration-500"
            onClick={setNextDay}
          >
            NextDay
          </button>
          <select
            className="btn-primary hover:scale-105 transition-all duration-500"
            onChange={handleGroupChange}
            id=""
            value={JSON.stringify(selectCurrentGroup)}
          >
            {groups.map((group, index) => (
              <option key={index} value={JSON.stringify(group)}>
                {group?.short}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="info-container"></div>
      <ToastContainer />
    </div>
  );
};
export default Taday;
