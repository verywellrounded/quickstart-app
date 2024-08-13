import Button from "@mui/material/Button";
import React, { useEffect, useState } from "react";

type Props = {};

const InstallPromptBanner = (props: Props) => {
  const [isAppInstalled, setIsAppInstalled] = useState(true);
  const [deferredPrompt, setDeferredPrompt] = useState<any>();
  useEffect(() => {
    // This variable will save the event for later use.

    window.addEventListener("beforeinstallprompt", (e) => {
      // Prevents the default mini-infobar or install dialog from appearing on mobile
      setIsAppInstalled(false);
      console.log("caught the before prompt event", e);
      e.preventDefault();
      // Save the event because you'll need to trigger it later.
      setDeferredPrompt(e);
      // Show your customized install prompt for your PWA
      // Your own UI doesn't have to be a single element, you
      // can have buttons in different locations, or wait to prompt
      // as part of a critical journey.
      // showInAppInstallPromotion();
    });
    window.addEventListener("appinstalled", () => {
      // If visible, hide the install promotion
      setIsAppInstalled(true);
      // Log install to analytics
      console.log("INSTALL: Success");
    });
  }, []);

  const installBanner = (
    <div className="banner">
      <Button
        onClick={async () => {
          console.log("button clicked");
          // deferredPrompt is a global variable we've been using in the sample to capture the `beforeinstallevent`
          if (deferredPrompt) {
            deferredPrompt.prompt();
            // Find out whether the user confirmed the installation or not
            const { outcome } = await deferredPrompt.userChoice;
            // The deferredPrompt can only be used once.
            setDeferredPrompt(undefined);
            // Act on the user's choice
            if (outcome === "accepted") {
              console.log("User accepted the install prompt.");
              setIsAppInstalled(true);
            } else if (outcome === "dismissed") {
              console.log("User dismissed the install prompt");
            }
          }
        }}
      >
        Install Nutritionist
      </Button>
    </div>
  );
  return <>{isAppInstalled ? <></> : installBanner}</>;
};

export default InstallPromptBanner;
