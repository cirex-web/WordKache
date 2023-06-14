import css from "./index.module.css";
import { Text } from "../../components/Text";
import { Header } from "../../components/Header";
import { useStorage } from "../../utils/storage/storage";

const HotKey = ({ children }: { children: string }) => {
  return <div className={css.hotKeyContainer}>{children}</div>;
};

// interface IFormStatus {
//   url: string;
//   done: boolean;
// }
// const useFormData = () => {
//   const [formStatus, setFormStatus] = useState<IFormStatus>();
//   const userId = useStorage("userId", undefined);
//   useEffect(() => {
//     if (userId) {
//       fetchData("forms", userId).then((formData) => {
//         if (formData) {
//           setFormStatus(formData as IFormStatus);
//         }
//       });
//     }
//   }, [userId]);
//   return { formStatus };
// };

export const UserManual = () => {
  const introPopupOpen = useStorage("introPopupOpen", false);
  // const [boxOpen, setBoxOpen] = useState(false);
  // const { formStatus } = useFormData();
  // const popupRef = useRef<HTMLDivElement>(null);
  // useEffect(() => {
  //   if (!boxOpen) return;
  //   const closeBox = (ev: MouseEvent) => {
  //     if (!popupRef.current?.contains(ev.target as HTMLElement)) {
  //       setBoxOpen(false);
  //     }
  //   };
  //   window.addEventListener("click", closeBox);
  //   return () => window.removeEventListener("click", closeBox);
  // }, [boxOpen]);

  // const HIDDEN_CARD_THRESHOLD_NUMBER = 30;

  return (
    <div className={css.container}>
      {/* {formStatus && (
        <Text type="paragraph" style={{ padding: "10px" }}>
          {formStatus.done ? (
            "Thanks for completing the form! You'll be able to see your hidden cards soon."
          ) : (
            <>
              You have{" "}
              <a
                href={formStatus.url}
                target="_blank"
                rel="noreferrer"
                style={{ color: "lightblue" }}
              >
                a form
              </a>{" "}
              available! It should only take 5 minutes to complete, and you'll
              get to see your hidden cards afterwards!
            </>
          )}
        </Text>
      )} */}
      <Header headingText="Welcome to WordKache!" />
      {/* <Text type="subheading" className={css.container}>
        <Button
          onClick={(ev) => {
            setBoxOpen(!boxOpen);
            ev.stopPropagation();
          }}
          style={{ padding: "10px", width: "100%" }}
        >
          <Icon name="help" />{" "}
          {numCardsHidden > 0
            ? `${numCardsHidden} Card${numCardsHidden !== 1 ? "s" : ""} Hidden`
            : "Info"}
        </Button>
        
      </Text> */}
      <div className={css.textContainer}>
        <Text type="subheading">
          To use WordKache, simply go to either Google Translate or DeepL,
          translate some words, and check the <b>Just Collected</b> folder for
          your translations! To view this page again, simply unselect the active
          folder.
        </Text>
        <Text type="heading" lineHeight={2} style={{ marginTop: "15px" }} bold>
          Saving your cards
        </Text>
        <Text type="paragraph">
          To save your words into a specific folder, just shift click on the
          folder(s) you wish to add it to and press Move! To add/remove folders,
          use the +/- buttons on the top left. To rename a folder, double click
          on the folder name in the left panel. As of now, in order to add a
          folder to the top level, you'll need to unselect the current folder
          (like how it is right now) before clicking '+'.
        </Text>

        <Text type="heading" lineHeight={2} style={{ marginTop: "15px" }} bold>
          Why aren't my translations being saved?
        </Text>
        <Text type="paragraph">
          We currently only support Google Translate and DeepL. Make sure that
          if you're using Google Translate, you're on translate.google.com and
          not the embedded Google Search one. If it's still not working, leave a
          comment in our feedback form.
        </Text>
        <Text type="heading" lineHeight={2} style={{ marginTop: "15px" }} bold>
          I have feedback/questions!
        </Text>
        <Text type="paragraph">
          We're actively monitoring all responses on{" "}
          <a
            href="https://forms.gle/bkos6SGzr6Jeo33n6"
            target="_blank"
            rel="noreferrer"
          >
            this form
          </a>
          .
        </Text>
        <Text type="heading" style={{ marginTop: "15px" }} bold>
          I've completed the beta testing form! Where are my hidden cards?
        </Text>
        <Text
          type="paragraph"
          style={{ marginTop: "10px" }}
          //TODO: The jank is real
        >
          You'll see them very soon, we promise.
        </Text>
        <Text type="heading" lineHeight={2} style={{ marginTop: "15px" }} bold>
          Hotkeys
        </Text>
        <Text type="paragraph">
          <div className={css.shortcutTable}>
            <div>
              <HotKey>Shift</HotKey> + <HotKey>Click</HotKey>
            </div>
            <div>Range Select Cards/Folders</div>
            <div>
              <HotKey>^|⌘</HotKey> + <HotKey>Click</HotKey>
            </div>
            <div>Select/Deselect Card/Folder</div>
            <div>
              <HotKey>^|⌘</HotKey> + <HotKey>A</HotKey>
            </div>
            <div>Select All Cards</div>
            <div>
              <HotKey>^|⌘</HotKey> + <HotKey>C</HotKey>
            </div>
            <div>Copy Selected Cards</div>
            <div>
              <HotKey>esc</HotKey>
            </div>
            <div>Cancel Card Selection</div>
          </div>
        </Text>
        <div
          style={{
            marginTop: "20px",
            display: "flex",
            alignItems: "center",
            gap: "5px",
          }}
        >
          <input type="checkbox" id="doNotShowAgain" />
          <Text type="paragraph">
            <label htmlFor="doNotShowAgain">Do not show this page again</label>
          </Text>
        </div>
      </div>
    </div>
  );
};
