import { toast, ToastContainer, Zoom } from "react-toastify";

import { createClient } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import moment from "moment";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

const ExamNotificationBtn = () => {
  const [notifications, setNotification] = useState([]);
  const [exam, setExam] = useState("");
  const [active, setActive] = useState("");

  useEffect(() => {
    async function fetchData() {
      const { data, error } = await supabase
        .from("notification") // Replace with your table name
        .select("*")
        .order("created_at", { ascending: false });

      if (!error) setNotification(data);
    }
    fetchData();

    async function fetchExam() {
      const exam = (
        await supabase
          .from("exam")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(1)
      ).data?.[0];
      setExam(exam);
    }

    fetchExam();
  }, []);

  const handleClick = (active) => {
    toast.info(
      <div
        style={{
          overflowY: "scroll",
          height: `${active === "notification" && "50vh"}`,
        }}
        className="p-4 "
      >
        {active === "exam" ? (
          <div className="">
            <img
              src={exam.image}
              alt="Exam Schedule not uploaded to VIKO EIF webpages yet!"
              className=" w-full max-w-md"
            />
            <hr />
          </div>
        ) : (
          notifications.map((note) => (
            <div key={note.id} className="p-1  border-b my-1">
              <small>{moment(note.created_at).fromNow()}</small>_
              <p className="text-l italic font-sans">{note.message} </p>
            </div>
          ))
        )}

        <small className="text-xs">
          Note: The exam schedule shown here is collected from the official{" "}
          <a
            className="underline"
            href="https://en.eif.viko.lt/studies/timetables/"
          >
            VIKO EIF webpage
          </a>
          . Notifications displayed in this app are typically received via email
          or shared by professors during lectures. Please be aware that all
          notifications are added manually and are not updated in real time. We
          strongly recommend that you also check your email for the most
          accurate update and{" "}
          <a
            className="underline"
            href="https://en.eif.viko.lt/studies/timetables/"
          >
            VIKO EIF webpage
          </a>{" "}
          for up-to-date exam information.
        </small>
        <small className="text-xs"></small>
      </div>,
      {
        toastId: "inapp-browser",
        position: "bottom-center",
        autoClose: false,
        hideProgressBar: true,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        theme: "colored",
        transition: Zoom,
      }
    );
  };
  return (
    <div className="m-1 flex justify-between items-center gap-1">
      <button
        onClick={() => handleClick("exam")}
        className=" text-sm bg-black skew-4 text-gray-50 font-bold p-1 rounded"
      >
        Exam
      </button>
      <button
        onClick={() => handleClick("notification")}
        className=" text-sm skew-4 bg-black text-gray-50 font-bold p-1 rounded"
      >
        Notification
      </button>{" "}
    </div>
  );
};
export default ExamNotificationBtn;
