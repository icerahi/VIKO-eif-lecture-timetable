import { useEffect, useState } from "react";
import { toast, ToastContainer, Zoom } from "react-toastify";
import iphoneGuide from "../../assets/install_iphone.png";
const InstallPWAButton = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstallButton, setShowInstallButton] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    //Detect IOS safari
    const userAgent = window.navigator.userAgent.toLowerCase();

    //check if device is an IOS device(iphone,ipad,ipod)
    const isIOS =
      userAgent.includes("iphone") ||
      userAgent.includes("ipad") ||
      userAgent.includes("ipod");

    // check if browser is safari (but not the chrome or other browser)
    const isSafari =
      userAgent.includes("safari") &&
      !userAgent.includes("chrome") &&
      !userAgent.includes("firebox");

    if (isIOS && isSafari) {
      setIsIOS(true);
    }

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
    if (!deferredPrompt) return;
    deferredPrompt.prompt(); // show the install prompt

    const { outcome } = await deferredPrompt.userChoice;
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
          Tap <strong>Share</strong> ⬆️ then <strong>Add to Home Screen</strong>
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
        position: "top-center",
        autoClose: false,
        hideProgressBar: true,
        closeOnClick: false,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: "dark",
        transition: Zoom,
        limit: 1,
      }
    );
  };

  return (
    <div className="flex lg:flex-col gap-2 justify-center mt-2 items-center lg:scale-150 w-100">
      {/* show install button for android and desktop */}
      <h1 className="text-xl italic px-2 bg-amber-700 text-gray-50">
        Install {"in/>"}{" "}
      </h1>

      <button
        onClick={handleInstall}
        className="  bg-indigo-400 text-gray-50 font-bold p-2 rounded"
      >
        🤖 Android
      </button>
      <button
        onClick={handleInstallIOS}
        className="  bg-indigo-400 text-gray-50 font-bold p-2 rounded"
      >
         IOS Safari
      </button>

      <ToastContainer
        toastClassName="text-white rounded-lg shadow-lg"
        bodyClassName="text-sm"
        hideProgressBar
        closeOnClick
        pauseOnFocusLoss
        draggable={false}
      />
    </div>
  );
};
export default InstallPWAButton;
