import "./Today.css";

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

  const handleGroupChange = (e) => {
    const groupObj = JSON.parse(e.target.value);
    setSelectCurrentGroup(groupObj);
    localStorage.setItem("current_group", e.target.value);
  };

  return (
    <div className="today-container">
      <div>
        <button onClick={setNextDay}>NextDay</button>
        <button onClick={setToday}>TodayDay</button>
        <button onClick={setPrevDay}>PreviousDay</button>
        <select
          onChange={handleGroupChange}
          id=""
          value={JSON.stringify(selectCurrentGroup)}
        >
          {groups.map((group) => (
            <option value={JSON.stringify(group)}>{group?.short}</option>
          ))}
        </select>
      </div>
      <div className="timetable">
        <div className="camera-nosile"></div>
        <div className="lecture-container">
          <h1 className="title-info">
            Today, {date.format("ddd MMM DD YYYY")}
          </h1>
          <div className="lectures">
            {lectures?.map((lecture) => (
              <div
                key={lecture.periodno}
                className={
                  CheckLectureStatus(lecture) === "-" ? "no-lecture" : "lecture"
                }
                style={{ backgroundColor: lecture.colors }}
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
      </div>
    </div>
  );
};
export default Taday;
