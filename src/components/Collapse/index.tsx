import React, { useLayoutEffect, useRef } from "react";
import { usePrev } from "../../utils";
import css from "./index.module.css";
const animateHeight = async (
  open: boolean,
  containerRef: React.RefObject<HTMLElement>
) => {
  if (!containerRef.current) return;

  const animation = containerRef.current.animate(
    [
      { height: 0, visibility: "hidden" },
      {
        height: containerRef.current.scrollHeight + "px",
        visibility: "visible",
      },
    ],
    {
      duration: 200,
      easing: "ease-in-out",
      direction: open ? "normal" : "reverse",
      fill: "forwards",
    }
  );
  await animation.finished;
  animation.commitStyles();
  if (open) {
    containerRef.current.style.height = "auto"; //we set it to auto so the height can adjust to children height changes
  }
  animation.cancel();
};

export const Collapse = ({
  children,
  open,
}: {
  children: React.ReactNode;
  open: boolean;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const prevOpen = usePrev(open);
  useLayoutEffect(() => {
    if (!containerRef.current) return;
    if (prevOpen !== open) {
      animateHeight(open, containerRef);
    } else {
      //set some defaults - this is the first render
      containerRef.current.style.height = open ? "auto" : "0";
      containerRef.current.style.visibility = open ? "initial" : "hidden";
    }
  }, [open, prevOpen]); //these two should change at the same time
  return (
    <div ref={containerRef} className={css.container}>
      {children}
    </div>
  );
};
