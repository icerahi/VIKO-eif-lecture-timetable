import "./Today.css";
import moment from "moment";
import viko_eif from "../viko_eif.jpg";
import { lightenHexToRgb } from "../utils/lightenColor";
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
  const CheckLectureStatus = (lecture) => {
    if (changedLectures.some((item) => item.paskaita === lecture.periodno)) {
      const lec = changedLectures.find((l) => l.paskaita === lecture.periodno);
      console.log(lec.auditorija);
      return lec.auditorija;
    }
  };
  console.log("lectures:", lectures);
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

  return (
    <div className="today-container">
      <div className="timetable">
        <div className="camera-nosile"></div>
        <div className="lecture-container">
          <h1 className="title-info">
            {checkDate(date)}
            {date.format("ddd MMM DD YYYY")}
          </h1>
          <div className="lectures">
            {lectures.length == 0 && (
              <p>No lectures information available for the selected day!</p>
            )}
            {lectures?.map((lecture) => (
              <div
                key={lecture.periodno}
                className={
                  CheckLectureStatus(lecture) === "-" ? "no-lecture" : "lecture"
                }
                style={{
                  backgroundColor: lightenHexToRgb(lecture?.colors, 0.4), // Lighten by 50%
                }}
              >
                <div>
                  <p>{lecture.periodno}</p>
                </div>
                <div>
                  <h3>{lecture.subject}</h3>
                  <p>
                    {lecture.starttime} - {lecture.endtime}
                  </p>
                </div>
                <div>
                  <p>
                    Room-
                    {CheckLectureStatus(lecture) === "-" ? (
                      `${lecture.classroom}`
                    ) : (
                      <>
                        {CheckLectureStatus(lecture) ? (
                          <>
                            <del>{lecture.classroom} </del>
                            {CheckLectureStatus(lecture)}
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

        <div className="btn-container">
          <button onClick={setPrevDay}>PreviousDay</button>
          <button onClick={setToday}>TodayDay</button>
          <button onClick={setNextDay}>NextDay</button>
          <select
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
    </div>
  );
};
export default Taday;
