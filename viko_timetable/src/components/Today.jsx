import "./Today.css";

const Taday = ({ date, lectures, setNextDay, setToday, setPrevDay }) => {
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
            {lectures?.map(
              ({
                subject,
                classroom,
                starttime,
                endtime,
                periodno,
                teacher,
                colors,
              }) => (
                <div
                  key={periodno}
                  className="lecture"
                  style={{ backgroundColor: colors }}
                >
                  <div>
                    <p>{periodno}</p>
                  </div>
                  <div>
                    <h3>{subject}</h3>
                    <p>
                      {starttime} - {endtime}
                    </p>
                  </div>
                  <div>
                    <p>Room-{classroom}</p>
                    <p>
                      <em>{teacher}</em>
                    </p>
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
export default Taday;
