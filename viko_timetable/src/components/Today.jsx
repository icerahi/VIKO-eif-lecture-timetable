import "./Today.css";

const Taday = ({
  changedLectures,
  date,
  lectures,
  setNextDay,
  setToday,
  setPrevDay,
}) => {
  console.log(changedLectures);

  const CheckLectureStatus = (lecture) => {
    if (changedLectures.some((item) => item.paskaita === lecture.period)) {
      console.log(item.auditorija);
      return item.auditorija;
      //have to fix this
    }
  };
  return (
    <div className="today-container">
      <div>
        <button onClick={setNextDay}>NextDay</button>
        <button onClick={setToday}>TodayDay</button>
        <button onClick={setPrevDay}>PreviousDay</button>
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
                    {CheckLectureStatus(lecture) !== "-" ? (
                      `${lecture.classroom}`
                    ) : (
                      <>
                        <del>{lecture.class}</del>
                        {CheckLectureStatus(lecture)}{" "}
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
