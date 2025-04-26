import { useEffect, useState } from "react";
import useFetch from "./useFetch";
import { getPayload } from "./payloads";
import moment from "moment";
import "./App.css";
import { Route, Routes, useSearchParams } from "react-router-dom";
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
import { useContext } from "react";
import { AppContext } from "./context/AppContext";
import { ToastContainer } from "react-toastify";

// 🔹 Declare debounce function globally (outside the component)
const debounce = (func, delay) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), delay);
  };
};

const App = () => {
  //search params
  const [searchParams, setSearchParams] = useSearchParams();

  //firebise
  const [latestPost, setLatestPost] = useState(null);
  console.log("latest postss:", latestPost);
  const [allPosts, setAllPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [date, setDate] = useState(() => {
    const date = searchParams.get("date") || moment();

    return moment(date).format("YYYY-MM-DD");
  });

  const startDate = moment().startOf("isoWeek").format("YYYY-MM-DD"); // Monday
  const endDate = moment().endOf("week").add(1, "day").format("YYYY-MM-DD"); // Next Monday

  // const API_URL = "http://localhost:3000";
  // const API_URL = "https://viko-eif-lecture-timetable.onrender.com";
  const { API_URL } = useContext(AppContext);
  // const API_URL = "https://overseas-vyky-icerahi-d9f7baf3.koyeb.app";
  const all_info = useFetch(
    `${API_URL}/all`,
    getPayload(startDate, endDate, true),
    date
  );

  const [teachers, setTeachers] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [classrooms, setClassRooms] = useState([]);
  const [groups, setGroups] = useState(() => {
    const groups = localStorage.getItem("groups");
    return groups ? JSON.parse(groups) : [];
  });

  const [currentDayLectureInfo, setCurrentDayLectureInfo] = useState([]);

  const [selectCurrentGroup, setSelectCurrentGroup] = useState(() => {
    const savedGroup = localStorage.getItem("current_group");
    return savedGroup
      ? JSON.parse(savedGroup)
      : { id: "-910", name: "PI24E", short: "PI24E" };
  });

  const current = useFetch(
    `${API_URL}/current`,
    getPayload(date, date, false, selectCurrentGroup.id),
    date,
    selectCurrentGroup.id
  );
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
      localStorage.setItem("groups", JSON.stringify(allGroups));
    }
    if (current) {
      const extractCurrentDayLecturesInfo = () => {
        if (!current?.r?.ttitems) return [];
        //conver arrays to map for O(1) lookup for better performance
        const subjectMap = new Map(subjects.map((s) => [s.id, s]));
        const classroomMap = new Map(classrooms.map((c) => [c.id, c]));
        const teacherMap = new Map(teachers.map((t) => [t.id, t]));
        console.log("test", current.r.ttitems);
        const info = current.r.ttitems.map((lec) => ({
          subject: subjectMap.get(lec.subjectid)?.short || "Unknown",
          // const subject = subjects.find(({ id }) => id === lec.subjectid);
          classroom:
            classroomMap.get(lec.classroomids?.[0])?.short || "Unknown",

          // const classroom = classrooms.find(
          //   ({ id }) => id === lec.classroomids?.[0]
          // );
          teacher: teacherMap.get(lec.teacherids?.[0])?.short || "Unknown",
          date: lec.date,
          endtime: lec.endtime,
          starttime: lec.starttime,
          periodno: lec.uniperiod,

          // const teacher = teachers.find(({ id }) => id == lec.teacherids[0]);
          colors: lec.colors?.[0] || "gray",
          changed: lec.changed || false,
        }));

        setCurrentDayLectureInfo(info);
      };

      //applying debounce(300ms delay) so users multiple reload can't effect
      // const debouncedLectureInfo = debounce(extractCurrentDayLecturesInfo, 300);
      // debouncedLectureInfo();

      extractCurrentDayLecturesInfo();
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

    //capture screenshot and send to backend
  }, [all_info, current, subjects, teachers, selectCurrentGroup, date]);

  useEffect(() => {
    const targetDate = moment(date, "YYYY-MM-DD").format("ddd MMM DD YYYY");

    //filter posts by date

    const filtered = allPosts.filter((post) =>
      moment(post.date, "ddd MMM DD YYYY").isSame(targetDate, "day")
    );
    const currentDayFilter = filtered.filter(
      (post) =>
        post.grupe.replace(/<[^>]*>/g, "").includes(selectCurrentGroup.short)
      //have to fix here
    );
    console.log("currentday filter", filtered);
    setFilteredPosts(currentDayFilter);

    // set current date for home url
    searchParams.get("date") || setSearchParams({ date: date });
  }, [allPosts, selectCurrentGroup]); //allPosts

  const setToday = () => {
    const date = moment().format("YYYY-MM-DD");
    setSearchParams({ date });
    setDate(date);
  };
  const setNextDay = () => {
    const date = searchParams.get("date") || moment();
    const nextDate = moment(date).add(1, "days").format("YYYY-MM-DD");
    setSearchParams({ date: nextDate });

    setDate(nextDate);
  };
  const setPrevDay = () => {
    const date = searchParams.get("date") || moment();
    const prevDate = moment(date).subtract(1, "days").format("YYYY-MM-DD");
    setSearchParams({ date: prevDate });
    setDate(prevDate);
  };

  return (
    <>
      <main>
        <Routes>
          <Route
            path="/"
            element={
              <Today
                groups={groups}
                setSelectCurrentGroup={setSelectCurrentGroup}
                selectCurrentGroup={selectCurrentGroup}
                changedLectures={filteredPosts}
                setNextDay={setNextDay}
                setToday={setToday}
                setPrevDay={setPrevDay}
                date={moment(date, "YYYY-MM-DD")}
                lectures={currentDayLectureInfo}
              />
            }
          />
        </Routes>
        <ToastContainer
          toastClassName="text-white rounded-lg shadow-lg "
          limit={1}
          bodyClassName="text-sm"
          hideProgressBar
          closeOnClick
          draggable={true}
        />
        <footer className="text-center text-sm fixed bottom-0 w-1/1 p-1 bg-gray-500 text-white">
          <em className="opacity-50">
            Made with ❤️ by{" "}
            <a
              className="underline"
              target="_blank"
              href="https://github.com/icerahi"
            >
              Imran
            </a>{" "}
            |
            <a
              href="https://github.com/icerahi/VIKO-eif-lecture-timetable"
              className="underline"
              target="_blank"
            >
              {" "}
              Source Code
            </a>{" "}
            | Feel free to contribute!
          </em>
        </footer>
      </main>
    </>
  );
};
export default App;
