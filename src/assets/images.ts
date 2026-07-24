import type { StaticImageData } from "next/image";
import wyzeMicroSDCard from "./products/accessories/Wyze MicroSD Card.png";
import wyzeBatteryCamPro from "./products/cameras/Wyze Battery Cam Pro.png";
import wyzeBatteryCamProBlack from "./products/cameras/Wyze Battery Cam Pro black.png";
import wyzeBatteryCamProWhite from "./products/cameras/Wyze Battery Cam Pro white.png";
import wyzeCamFloodlightV2 from "./products/cameras/Wyze Cam Floodlight v2.png";
import wyzeCamFloodlightV2Black from "./products/cameras/Wyze Cam Floodlight v2 black.png";
import wyzeCamFloodlightV2White from "./products/cameras/Wyze Cam Floodlight v2 white.png";
import wyzeCamPanV3 from "./products/cameras/Wyze Cam Pan v3.png";
import wyzeCamPanV3Black from "./products/cameras/Wyze Cam Pan v3 black.png";
import wyzeCamPanV3White from "./products/cameras/Wyze Cam Pan v3 white.png";
import wyzeCamV4 from "./products/cameras/Wyze Cam v4.png";
import wyzeCamV4Black from "./products/cameras/Wyze Cam v4 black.png";
import wyzeCamV4Grey from "./products/cameras/Wyze Cam v4 grey.png";
import wyzeCamV4White from "./products/cameras/Wyze Cam v4 white.png";
import wyzeDuoCamDoorbell from "./products/cameras/Wyze Duo Cam Doorbell.png";
import wyzeSenseHub from "./products/sensors/Wyze Sense Hub.png";
import wyzeSenseMotionSensor from "./products/sensors/Wyze Sense Motion Sensor.png";

/** Maps asset-relative paths (as used in bundle-data.json) to Next.js StaticImageData imports. */
export const imageByPath: Record<string, StaticImageData> = {
  "products/cameras/Wyze Cam v4.png": wyzeCamV4,
  "products/cameras/Wyze Cam Pan v3.png": wyzeCamPanV3,
  "products/cameras/Wyze Cam Floodlight v2.png": wyzeCamFloodlightV2,
  "products/cameras/Wyze Duo Cam Doorbell.png": wyzeDuoCamDoorbell,
  "products/cameras/Wyze Battery Cam Pro.png": wyzeBatteryCamPro,
  "products/sensors/Wyze Sense Motion Sensor.png": wyzeSenseMotionSensor,
  "products/sensors/Wyze Sense Hub.png": wyzeSenseHub,
  "products/accessories/Wyze MicroSD Card.png": wyzeMicroSDCard,
  "products/cameras/Wyze Cam v4 white.png": wyzeCamV4White,
  "products/cameras/Wyze Cam v4 grey.png": wyzeCamV4Grey,
  "products/cameras/Wyze Cam v4 black.png": wyzeCamV4Black,
  "products/cameras/Wyze Cam Pan v3 white.png": wyzeCamPanV3White,
  "products/cameras/Wyze Cam Pan v3 black.png": wyzeCamPanV3Black,
  "products/cameras/Wyze Cam Floodlight v2 white.png": wyzeCamFloodlightV2White,
  "products/cameras/Wyze Cam Floodlight v2 black.png": wyzeCamFloodlightV2Black,
  "products/cameras/Wyze Battery Cam Pro white.png": wyzeBatteryCamProWhite,
  "products/cameras/Wyze Battery Cam Pro black.png": wyzeBatteryCamProBlack,
};
