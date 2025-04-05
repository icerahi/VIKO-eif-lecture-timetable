import { useEffect, useState } from "react";
import { toast, ToastContainer, Zoom } from "react-toastify";
import iphoneGuide from "../../assets/install_iphone.png";
import { useContext } from "react";
import { AppContext } from "../context/AppContext";
const InstallPWAButton = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isAppleDevice, setIsAppleDevice] = useState(false);

  useEffect(() => {
    //Detect IOS safari
    const userAgent = window.navigator.userAgent.toLowerCase();
    //check if device is an IOS device(iphone,ipad,ipod)
    const isIOS =
      userAgent.includes("iphone") ||
      userAgent.includes("ipad") ||
      userAgent.includes("ipod") ||
      console.log(userAgent);

    console.log(isIOS);

    setIsAppleDevice(isIOS);

    //handle beforeinstallpropt event for Android & Desktop

    const handleBeforeInstallPrompt = (event) => {
      event.preventDefault();
      setDeferredPrompt(event);
      setShowInstallButton(true);
    };
    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt
      );
    };
  }, []);

  const handleInstall = async () => {
    const message = isAppleDevice
      ? "Come on dude! This option is for Android/Linux/Windows Users 😉"
      : "App already installed in your device. Please check your Applist!";

    if (!deferredPrompt) {
      console.log(isAppleDevice);

      toast.info(message, {
        toastId: "android",
        position: "top-center",
        autoClose: 1000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        transition: Zoom,
      });
      return;
    }
    deferredPrompt.prompt(); // show the install prompt

    const { outcome } = await deferredPrompt.userChoice;
    console.log(outcome);
    if (outcome === "accepted") {
      console.log("User accepted the install");
    } else {
      console.log("user dismissed the install");
    }

    setDeferredPrompt(null);
    setShowInstallButton(false);
  };

  const handleInstallIOS = () => {
    toast.info(
      <div className="flex flex-col gap-2 items-center ">
        <p className="text-sm">
          Tap <strong>Share</strong> ⬆️ then{" "}
          <strong>Add to Home Screen or Add to Dock</strong>{" "}
        </p>
        <img
          src={iphoneGuide}
          alt="iOS Install Guide"
          className="mt-2 rounded-lg w-full "
        />

        <button
          onClick={() => toast.dismiss()}
          className="bg-blue-400 text-lg px-3 ml-auto text-gray-50 font-bold rounded"
        >
          Ok
        </button>
      </div>,
      {
        toastId: "ios",
        position: "bottom-center",
        autoClose: false,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Zoom,
      }
    );
  };

  return (
    <div className="flex lg:flex-col gap-1 justify-center mt-2 items-center lg:scale-150 w-100">
      {/* show install button for android and desktop */}
      <h1 className=" text-sm italic px-2 bg-amber-700 text-gray-50">
        Install {"in/>"}{" "}
      </h1>

      <button
        onClick={handleInstall}
        className=" text-sm bg-indigo-400 text-gray-50 font-bold p-1 rounded"
      >
        🤖 Android / Desktop
      </button>
      <button
        onClick={handleInstallIOS}
        className=" text-sm bg-indigo-400 text-gray-50 font-bold p-1 rounded"
      >
        🍎 IOS / MAC
      </button>

      <ToastContainer
        toastClassName="text-white rounded-lg shadow-lg "
        limit={1}
        bodyClassName="text-sm"
        hideProgressBar
        closeOnClick
        draggable={false}
      />
    </div>
  );
};
export default InstallPWAButton;
