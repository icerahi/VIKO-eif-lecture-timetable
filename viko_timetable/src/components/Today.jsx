import "./Today.css";
import moment from "moment";
import { lightenHexToRgb } from "../utils/lightenColor";
import { ToastContainer, toast, Bounce, Zoom } from "react-toastify";
import { useClipboard } from "@custom-react-hooks/use-clipboard";
import copyIcon from "../../assets/copytoclipboard.png";
import InstallPWAButton from "./InstallPWAButton";
import { useEffect, useState } from "react";
import { useContext } from "react";
import { AppContext } from "../context/AppContext";
import { Helmet } from "react-helmet";

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
  const [isInstalled, setIsInstalled] = useState(false);
  const { API_URL } = useContext(AppContext);

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

  useEffect(() => {
    let isInstalled =
      window.matchMedia("(display-mode:standalone").matches ||
      window.navigator.standalone === true; // check for android or ios
    setIsInstalled(isInstalled);

    const handleAppInstalled = () => {
      toast.success(
        "✅ App installed! Open it from your Home Screen or App Launcher.",
        {
          toastId: "app_installed",
          position: "top-center",
          autoClose: false,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: true,
          progress: undefined,
          theme: "dark",
          transition: Zoom,
        }
      );
      window.location.reload();
    };

    window.addEventListener("appinstalled", handleAppInstalled);
    return () => {
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  const handleShare = async () => {
    // Check if Web Share API is available (for mobile users)
    if (navigator.share) {
      try {
        await navigator.share({
          title: "VIKO EIF Timetable App",
          // url: `https://vikoeif.imranhasan.dev/preview/${date.format(
          //   "YYYY-MM-DD"
          // )}`,
          url: window.location.href,
        });
        console.log("Shared successfully!");
      } catch (error) {
        console.error("Error sharing:", error);
      }
    } else {
      // Fallback for desktop or unsupported mobile browsers: Copy the link to clipboard

      copyToClipboard(window.location.href);
      toast.success(
        // `Copied to your clip board! \nhttps://vikoeif.imranhasan.dev/preview/${date.format(
        //   "YYYY-MM-DD"
        `Copied to your clip board! \n${window.location.href}
        )}`,
        {
          style: { whiteSpace: "pre-line" },
          position: "top-left",
          autoClose: 2000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: true,
          progress: undefined,
          theme: "dark",
          transition: Zoom,
        }
      );
    }
  };
  return (
    <div
      id="screenshot"
      className="flex sm:flex-row-reverse flex-wrap justify-center items-center"
    >
      <div className="timetable w-1/1 sm:w-1/2">
        {/* <div className="camera-nosile"></div> */}
        <div className="lecture-container mt-3">
          <div className="flex justify-between items-center">
            <h1 className="title-info text-2xl text-gray-50">
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

          <div id="lectures" className="lectures">
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
      <div className="info-container">
        {!isInstalled && <InstallPWAButton />}
      </div>
    </div>
  );
};
export default Taday;
