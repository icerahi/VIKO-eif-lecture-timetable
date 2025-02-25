import { useEffect, useState } from "react";

const useFetch = (URL, payload) => {
  const [data, setData] = useState(null);

  useEffect(() => {
    let isMount = true;
    fetch(URL, {
      // Replace with actual API URL
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
  }, [URL]);

  return data;
};

export default useFetch;
