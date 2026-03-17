import { Composition } from "remotion";
import { Banner } from "./Banner";

export const RemotionRoot = () => {
  return (
    <Composition
      id="Banner"
      component={Banner}
      durationInFrames={190}
      fps={30}
      width={840}
      height={200}
    />
  );
};
