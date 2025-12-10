import moment from "moment";
import { useEffect, useState } from "react";
import { Route, Routes, useSearchParams } from "react-router-dom";
import "./App.css";
import { getPayload } from "./payloads";
import useFetch from "./useFetch";
//firbase config
import { useContext } from "react";
import { ToastContainer } from "react-toastify";
import Today from "./components/Today";
import { AppContext } from "./context/AppContext";
import {
  db,
  limitToLast,
  onValue,
  orderByChild,
  query,
  ref,
} from "./firebaseConfig";

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

  const [allPosts, setAllPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  console.log("filtered post", filteredPosts);
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
    return (
      localStorage.getItem("current_group") ||
      JSON.stringify({
        id: "-910",
        name: "PI24E",
        short: "PI24E",
      })
    );
  });

  const current = useFetch(
    `${API_URL}/current`,
    getPayload(date, date, false, JSON.parse(selectCurrentGroup)?.id),
    date,
    JSON.parse(selectCurrentGroup)?.id
  );
  useEffect(() => {
    if (groups.length === 0) {
      fetch(`${API_URL}/data/groups.json`)
        .then((response) => response.json())
        .then((data) => {
          setGroups(data);
          localStorage.setItem("groups", JSON.stringify(data)); // Cache in localStorage
        })
        .catch((error) => {
          console.error("Error fetching groups:", error);
        });
    }

    if (all_info) {
      const allTeachers = all_info?.r.tables[0]?.data_rows;
      const allSubjects = all_info?.r.tables[1]?.data_rows;
      const allClassrooms = all_info?.r.tables[2]?.data_rows;
      const allGroups = all_info?.r.tables[3]?.data_rows;

      setTeachers(allTeachers);
      setSubjects(allSubjects);
      setClassRooms(allClassrooms);
      // setGroups(allGroups);
      // localStorage.setItem("groups", JSON.stringify(allGroups));
    }
    if (current) {
      const extractCurrentDayLecturesInfo = () => {
        if (!current?.r?.ttitems) return [];
        //conver arrays to map for O(1) lookup for better performance
        const subjectMap = new Map(subjects.map((s) => [s.id, s]));
        const classroomMap = new Map(classrooms.map((c) => [c.id, c]));
        const teacherMap = new Map(teachers.map((t) => [t.id, t]));

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
          subgroup: lec.groupnames[0] || null,
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
    if (groups && groups.length > 0) {
      const paramGroup = searchParams.get("group") || "PI24E";

      const group = groups?.find((g) => g.short === paramGroup.toUpperCase());
      if (group) {
        localStorage.setItem("current_group", JSON.stringify(group));
        setSelectCurrentGroup(JSON.stringify(group));
      }
      // console.log("grouppppp:", group);
      // setSelectCurrentGroup(
      //   group
      //     ? JSON.stringify(group)
      //     : localStorage.getItem("current_group") ||
      //         JSON.stringify({
      //           id: "-910",
      //           name: "PI24E",
      //           short: "PI24E",
      //         })
      // );
    }
    const targetDate = moment(date, "YYYY-MM-DD").format("ddd MMM DD YYYY");

    //filter posts by date

    const filtered = allPosts.filter((post) =>
      moment(post.date, "ddd MMM DD YYYY").isSame(targetDate, "day")
    );
    const currentDayFilter = filtered.filter(
      (post) =>
        post.grupe
          .replace(/<[^>]*>/g, "")
          .includes(JSON.parse(selectCurrentGroup).short)
      //have to fix here
    );

    setFilteredPosts(currentDayFilter);

    // set current date for home url
    (searchParams.get("date") && searchParams.get("group")) ||
      setSearchParams({
        date: date,
        group: JSON.parse(selectCurrentGroup).short,
      });
  }, [allPosts, selectCurrentGroup]); //allPosts

  const setToday = () => {
    const date = moment().format("YYYY-MM-DD");
    setSearchParams({ date, group: JSON.parse(selectCurrentGroup).short });
    setDate(date);
  };
  const setNextDay = () => {
    const date = searchParams.get("date") || moment();
    const nextDate = moment(date).add(1, "days").format("YYYY-MM-DD");
    setSearchParams({
      date: nextDate,
      group: JSON.parse(selectCurrentGroup).short,
    });

    setDate(nextDate);
  };
  const setPrevDay = () => {
    const date = searchParams.get("date") || moment();
    const prevDate = moment(date).subtract(1, "days").format("YYYY-MM-DD");
    setSearchParams({
      date: prevDate,
      group: JSON.parse(selectCurrentGroup).short,
    });
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

        <footer className="text-center text-sm w-1/1 p-1 bg-gray-500 text-white">
          <em className="opacity-50">
            <a
              href="https://github.com/icerahi/VIKO-eif-lecture-timetable"
              className="underline"
              target="_blank"
            >
              {" "}
              Source Code
            </a>{" "}
            | All schedule data are coming from:{" "}
            <a
              className="underline"
              href="https://vikoeif.edupage.org/timetable/"
            >
              vikoeif.edupage.org/timetable/
            </a>
          </em>
        </footer>
      </main>
    </>
  );
};
export default App;
