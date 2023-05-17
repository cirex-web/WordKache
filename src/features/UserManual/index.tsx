import { useState, useEffect, useRef } from "react";
import { Icon } from "../../components/Icon";
import css from "./index.module.css";
import { Button } from "../../components/Button";
import { Text } from "../../components/Text";
import classNames from "classnames";

const HotKey = ({ children }: { children: string }) => {
  return <div className={css.hotKeyContainer}>{children}</div>;
};

export const UserManual = ({ numCardsHidden }: { numCardsHidden: number }) => {
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
  const HIDDEN_CARD_THRESHOLD_NUMBER = 30;
  return (
    <Text type="subheading" className={css.container}>
      <Button
        noBorder
        onClick={(ev) => {
          setBoxOpen(!boxOpen);
          ev.stopPropagation();
        }}
        style={{ padding: "10px", width: "100%" }}
      >
        <Icon name="info" />
        {numCardsHidden > 0 && ` ${numCardsHidden} Cards Hidden`}
      </Button>
      <div
        className={classNames(css.textBox, boxOpen ? css.open : css.closed)}
        ref={popupRef}
      >
        <Text type="heading" lineHeight={2} bold>
          You're using a Beta version!
        </Text>
        <Text type="paragraph">
          For statistical analysis, around 50% of your collected cards will be
          temporarily hidden. However, once you've accumulated 30 hidden cards,
          you'll be able to see all subsequent translations. (
          {numCardsHidden >= HIDDEN_CARD_THRESHOLD_NUMBER ? (
            <>You've reached it!"</>
          ) : (
            <>
              You're currently{" "}
              <b>
                {Math.round(
                  (numCardsHidden / HIDDEN_CARD_THRESHOLD_NUMBER) * 100
                )}
                %
              </b>{" "}
              of the way there.
            </>
          )}
          )
        </Text>

        <Text type="heading" lineHeight={2} style={{ marginTop: "15px" }} bold>
          Why aren't my translations being saved?
        </Text>
        <Text type="paragraph">
          We currently only support Google Translate and DeepL. Make sure that
          if you're using Google Translate, you're using the
          translate.google.com site and not the embedded Google Search one.
        </Text>
        <Text type="heading" lineHeight={2} style={{ marginTop: "15px" }} bold>
          I have feedback/questions!
        </Text>
        <Text type="paragraph">
          We're actively monitoring all responses on{" "}
          <a href="https://forms.gle/bkos6SGzr6Jeo33n6">this form</a>.
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
