import { useState, useEffect, useRef } from "react";
import { Icon } from "../../components/Icon";
import css from "./index.module.css";
import { Button } from "../../components/Button";
import { Text } from "../../components/Text";

const HotKey = ({ children }: { children: string }) => {
  return <div className={css.hotKey}>{children}</div>;
};

export const UserManual = () => {
  const [boxOpen, setBoxOpen] = useState(false);
  const popupRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!boxOpen) return;
    const closeBox = (ev: MouseEvent) => {
      if (!popupRef.current?.contains(ev.target as HTMLElement)) {
        setBoxOpen(false);
      }
    };
    window.addEventListener("click", closeBox);
    return () => window.removeEventListener("click", closeBox);
  }, [boxOpen]);

  return (
    <Text type="xLargeHeading" className={css.container}>
      <Button
        noBorder
        zoomOnHover
        onClick={(ev) => {
          setBoxOpen(!boxOpen);
          ev.stopPropagation();
        }}
      >
        <Icon name="Help" />
      </Button>
      <div
        className={css.textBox}
        style={{ transform: boxOpen ? "scale(1)" : "scale(0)" }}
        ref={popupRef}
      >
        <Text type="heading" lineHeight={1.5} bold>
          You're using a Beta version!
        </Text>
        <Text type="paragraph">
          ~50% of cards will be hidden, but don't worry, you'll see them after
          beta testing is over!
        </Text>

        <Text
          type="heading"
          lineHeight={1.5}
          style={{ marginTop: "20px" }}
          bold
        >
          Hotkeys
        </Text>
        <Text type="paragraph" lineHeight={2.4}>
          <HotKey>Shift</HotKey> + <HotKey>Click</HotKey> Range Selection
        </Text>
        <Text type="paragraph" lineHeight={2.4}>
          <HotKey>^|⌘</HotKey> + <HotKey>Click</HotKey> Select Card
        </Text>
        <Text type="paragraph" lineHeight={2.4}>
          <HotKey>^|⌘</HotKey> + <HotKey>A</HotKey> Select All
        </Text>
        <Text type="paragraph" lineHeight={2.4}>
          <HotKey>^|⌘</HotKey> + <HotKey>C</HotKey> Copy Selected Cards
        </Text>
        <Text type="paragraph" lineHeight={2.4}>
          <HotKey>esc</HotKey> Cancel Selection
        </Text>
      </div>
    </Text>
  );
};
