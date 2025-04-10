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

    setIsAppleDevice(isIOS);

    //handle beforeinstallpropt event for Android & Desktop

    const handleBeforeInstallPrompt = (event) => {
      event.preventDefault();
      setDeferredPrompt(event);
    };
    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt
      );
    };
  }, []);

  const isInAppBrowser = () => {
    const ua = navigator.userAgent || navigator.vendor || window.opera;
    return /FBAN|FBAV|Instagram|Messenger/i.test(ua);
  };

  const handleInstall = async () => {
    // In-app browser detected
    if (isInAppBrowser()) {
      toast.info(
        "Please open in Chrome or your default browser to install the app.",
        {
          toastId: "inapp-browser",
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "dark",
          transition: Zoom,
        }
      );
      return;
    }

    // Apple devices
    if (isAppleDevice) {
      toast.info(
        "Come on dude! This option is for Android/Linux/Windows Users 😉",
        {
          toastId: "ios-block",
          position: "top-center",
          autoClose: 2000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "dark",
          transition: Zoom,
        }
      );
      return;
    }

    // No install prompt available
    if (!deferredPrompt) {
      toast.info("App is already installed, please checkout Applist!", {
        toastId: "no-prompt",
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "dark",
        transition: Zoom,
      });
      return;
    }

    try {
      deferredPrompt.prompt(); // Show install prompt
      const { outcome } = await deferredPrompt.userChoice;

      if (outcome === "accepted") {
        console.log("User accepted the install");
      } else {
        console.log("User dismissed the install");
      }
    } catch (error) {
      console.error("Install prompt failed:", error);
      toast.error("Something went wrong during install.");
    } finally {
      setDeferredPrompt(null);
    }
  };

  const handleInstallIOS = () => {
    toast.info(
      <div className="flex flex-col gap-2 items-center mt-1">
        <p className="text-[0.8rem] text-gray-500">
          Tap <strong>Share</strong> ⬆️ then{" "}
          <strong>Add to Home Screen / Add to Dock</strong>{" "}
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
        <span className="text-gray-400 text-[0.8rem] inline">
          Touch/Swipe to close!
        </span>
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
    <div className="flex lg:flex-col gap-1 justify-center items-center lg:scale-150 w-100">
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
    </div>
  );
};
export default InstallPWAButton;
