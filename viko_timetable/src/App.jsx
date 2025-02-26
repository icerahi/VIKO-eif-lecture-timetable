import { useEffect, useState } from "react";
import useFetch from "./useFetch";
import { getPayload } from "./payloads";
import moment from "moment";
import "./App.css";

//firbase config
import {
  db,
  ref,
  onValue,
  query,
  orderByChild,
  limitToLast,
} from "./firebaseConfig";
import Today from "./components/Today";

const App = () => {
  //firebise
  const [latestPost, setLatestPost] = useState(null);
  const [allPosts, setAllPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [date, setDate] = useState(moment().format("YYYY-MM-DD"));

  const startDate = moment().startOf("isoWeek").format("YYYY-MM-DD"); // Monday
  const endDate = moment().endOf("week").add(1, "day").format("YYYY-MM-DD"); // Next Monday

  const all_info = useFetch(
    "http://localhost:3001/all",
    getPayload(startDate, endDate, true),
    date
  );

  const current = useFetch(
    "http://localhost:3001/current",
    getPayload(date, date),
    date
  );

  const [teachers, setTeachers] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [classrooms, setClassRooms] = useState([]);
  const [groups, setGroups] = useState([]);

  const [currentDayLectureInfo, setCurrentDayLectureInfo] = useState([]);

  useEffect(() => {
    if (all_info) {
      const allTeachers = all_info?.r.tables[0]?.data_rows;
      const allSubjects = all_info?.r.tables[1]?.data_rows;
      const allClassrooms = all_info?.r.tables[2]?.data_rows;
      const allGroups = all_info?.r.tables[3]?.data_rows;

      setTeachers(allTeachers);
      setSubjects(allSubjects);
      setClassRooms(allClassrooms);
      setGroups(allGroups);
    }
    if (current) {
      const extractCurrentDayLecturesInfo = () => {
        const info = current?.r?.ttitems?.map((lec) => {
          const [subject] = subjects.filter(({ id }) => id === lec.subjectid);

          const [classroom] = classrooms.filter(
            ({ id }) => id === lec.classroomids[0]
          );

          const date = lec.date;
          const endtime = lec.endtime;
          const starttime = lec.starttime;
          const periodno = lec.uniperiod;

          const [teacher] = teachers.filter(
            ({ id }) => id == lec.teacherids[0]
          );
          const [colors] = lec.colors;

          return {
            subject: subject?.short,
            classroom: classroom?.short,
            date,
            endtime,
            starttime,
            periodno,
            teacher: teacher?.short,
            colors,
          };
        });
        return info;
      };

      setCurrentDayLectureInfo(extractCurrentDayLecturesInfo());
    }

    //referece th "user-posts" in firebase
    const fetchFirebaseData = () => {
      const dbRefObject = ref(db, "user-posts/");

      // Get the latest post
      const latestPostQuery = query(dbRefObject, limitToLast(1));
      onValue(latestPostQuery, (snapshot) => {
        if (snapshot.exists()) {
          snapshot.forEach((childSnapshot) => {
            setLatestPost(childSnapshot.val());
          });
        }
      });

      // Get all posts ordered by "paskaita"
      const orderedQuery = query(dbRefObject, orderByChild("paskaita"));
      onValue(orderedQuery, (snapshot) => {
        let dataArray = [];
        snapshot.forEach((childSnapshot) => {
          dataArray.push(childSnapshot.val());
        });
        setAllPosts(dataArray);
      });
    };
    fetchFirebaseData();
  }, [all_info, current]);

  useEffect(() => {
    const targetDate = moment().format("ddd MMM DD YYYY");

    //filter posts by date

    const filtered = allPosts.filter((post) =>
      moment(post.date, "ddd MMM DD YYYY").isSame(targetDate, "day")
    );

    setFilteredPosts(filtered);
  }, [allPosts]);

  const setToday = () => {
    setDate(moment().format("YYYY-MM-DD"));
  };
  const setNextDay = () => {
    setDate(moment(date).add(1, "day").format("YYYY-MM-DD"));
  };
  const setPrevDay = () => {
    setDate(moment(date).subtract(1, "day").format("YYYY-MM-DD"));
  };

  return (
    <>
      <main>
        <Today
          setNextDay={setNextDay}
          setToday={setToday}
          setPrevDay={setPrevDay}
          date={moment(date, "YYYY-MM-DD")}
          lectures={currentDayLectureInfo}
        />
      </main>
    </>
  );
};
export default App;
