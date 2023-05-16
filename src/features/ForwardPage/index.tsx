import { useState, useEffect, useRef } from "react";
import { Icon } from "../../components/Icon";
import css from "./index.module.css";
import { Button } from "../../components/Button";
import { Text } from "../../components/Text";
import classNames from "classnames";


export const ForwardingPage = ({
    folderName,
}: {
    folderName: string;
}) => {
    return(
        <div className={css.container}>
            <div className = {css.header}>
                <Text type="heading" bold noWrap className={css.heading}> {folderName} </Text>
            </div>
            <div className = {css.options}>
                <Text type="heading">Currently Implementing...</Text>
            </div>
        </div>
    );
}