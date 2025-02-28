import { useEffect, useState } from "react";

const useFetch = (URL, payload, date, selectCurrentGroup) => {
  const [data, setData] = useState(null);

  useEffect(() => {
    let isMount = true;
    fetch(URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })
      .then((response) => response.json())
      .then((data) => {
        setData(data);
      })
      .catch((error) => console.error("Error:", error));

    () => {
      return (isMount = false);
    };
  }, [URL, date, selectCurrentGroup]);

  return data;
};

export default useFetch;
