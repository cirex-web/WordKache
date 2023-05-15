import { useState, useEffect, useRef } from "react";
import { Icon } from "../../components/Icon";
import css from "./index.module.css";
import { Button } from "../../components/Button";
import { Text } from "../../components/Text";
import classNames from "classnames";

const HotKey = ({ children }: { children: string }) => {
  return <div className={css.hotKeyContainer}>{children}</div>;
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
    <Text type="heading" className={css.container}>
      <Button
        noBorder
        zoomOnHover
        onClick={(ev) => {
          setBoxOpen(!boxOpen);
          ev.stopPropagation();
        }}
      >
        <Icon name="info" />
      </Button>
      <div
        className={classNames(css.textBox, boxOpen ? css.open : css.closed)}
        ref={popupRef}
      >
        <Text type="heading" lineHeight={1.5} bold>
          You're using a Beta version!
        </Text>
        <Text type="paragraph">
          ~50% of cards will be hidden, but don't worry, you'll see them after
          beta testing is over!
        </Text>

        <Text type="heading" lineHeight={2} style={{ marginTop: "15px" }} bold>
          Hotkeys
        </Text>
        <Text type="paragraph">
          <div className={css.shortcutTable}>
            <div>
              <HotKey>Shift</HotKey> + <HotKey>Click</HotKey>
            </div>
            <div>Range Selection</div>
            <div>
              <HotKey>^|⌘</HotKey> + <HotKey>Click</HotKey>
            </div>
            <div>Select Card</div>
            <div>
              <HotKey>^|⌘</HotKey> + <HotKey>A</HotKey>
            </div>
            <div>Select All</div>
            <div>
              <HotKey>^|⌘</HotKey> + <HotKey>C</HotKey>
            </div>
            <div>Copy Selected Cards</div>
            <div>
              <HotKey>esc</HotKey>
            </div>
            <div>Cancel Selection</div>
          </div>
        </Text>
      </div>
    </Text>
  );
};
