import { useEffect, useState } from "react";
import useFetch from "./useFetch";
import { payload_all, payload_current } from "./payloads";

const App = () => {
  const all_info = useFetch("http://localhost:3001/all", payload_all);
  const current = useFetch("http://localhost:3001/current", payload_current);

  const [teachers, setTeachers] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [classrooms, setClassRooms] = useState([]);
  const [groups, setGroups] = useState([]);

  const [todayLectures, setTodayLectures] = useState([]);

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
      setTodayLectures(current.r.ttitems);
    }
  }, [all_info, current]);

  const lectures_info = () => {
    const info = todayLectures.map((lec) => {
      const [subject] = subjects.filter(({ id }) => id === lec.subjectid);

      const [classroom] = classrooms.filter(
        ({ id }) => id === lec.classroomids[0]
      );

      const date = lec.date;
      const endtime = lec.endtime;
      const starttime = lec.starttime;
      const periodno = lec.uniperiod;

      const [teacher] = teachers.filter(({ id }) => id == lec.teacherids[0]);
      const [colors] = lec.colors;
      return {
        subject: subject.short,
        classroom: classroom.short,
        date,
        endtime,
        starttime,
        periodno,
        teacher: teacher.short,
        colors,
      };
    });
    return info;
  };
  const lectures = lectures_info();

  return (
    <div>
      <h1>Schedule</h1>
      {lectures?.map(
        (
          {
            subject,
            classroom,
            date,
            endtime,
            starttime,
            periodno,
            teacher,
            colors,
          },
          index
        ) => (
          <div key={index} style={{ backgroundColor: colors }}>
            <p>{subject}</p>
            <p>{teacher}</p>
            <p>{classroom}</p>
            <p>{date}</p>
            <p>{endtime}</p>
            <p>{starttime}</p>
            <p>{periodno}</p>
            <p>{colors}</p>
            <hr />
          </div>
        )
      )}
    </div>
  );
};
export default App;
