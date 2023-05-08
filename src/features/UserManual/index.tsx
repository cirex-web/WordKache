import { useState } from "react";
import { Icon } from "../../components/Icon";
import css from "./index.module.css";
import { Button } from "../../components/Button";
import { Text } from "../../components/Text";

export const UserManual = () => {
    
    const [boxOpen, setBoxOpen] = useState(false);

    return(
        <div style = {{display: "flex"}}>
            <div className={css.textBox} style={{ transform: boxOpen ? "scale(1.5,1.5)" : "scale(0,0)" }}>
                <Text type="paragraph">
                    <Text type="heading">Hotkeys</Text>
                    <br/>
                    <Text type="paragraph">&ensp; <b>Shift+Click</b>: Add Selection</Text> <br/>
                    <Text type="paragraph">&ensp; <b>A</b>: Select All</Text> <br/>
                    <Text type="paragraph">&ensp; <b>Q</b>: Cancel Selection</Text> 
                    <br/>
                    <Text type="heading">About Beta</Text>
                    <br/>
                    <Text type="paragraph"> &ensp; 50% of cards will be dropped in Beta</Text>
                </Text>
            </div>
            <span className={css.containerHelp}>
                <Button
                onMouseDown = {() => {setBoxOpen(!boxOpen)}}
                noBorder
                zoomOnHover
                style = {{
                    backgroundColor: "black"
                }}
                >
                    <Icon name = "Help"/>
                </Button>
            </span>
        </div>
    );
};
