import { useState, useEffect, useRef } from "react";
import { Icon } from "../../components/Icon";
import css from "./index.module.css";
import { Button } from "../../components/Button";
import { Text } from "../../components/Text";
import { Folder } from "../../storageTypes";
import classNames from "classnames";
import ISO6391 from 'iso-639-1';


export const ForwardingPage = ({
    curFolder,
    folders
}: {
    curFolder: string;
    folders: Folder[];
}) => {
    const folderName = curFolder === 'root'? "Just Collected" : folders.filter((folder) => folder.id === curFolder)[0].name; //Better implementation?
    const [destination, setDestination] = useState<string>("");
    const [frontLang, setFrontLang] = useState<string>("");
    const [backLang, setBackLang] = useState<string>("");
    const [words, setWords] = useState<string>("");
    const [size, setSize] = useState<string>("");

    const createFilter = (): string => {
        const validLang = new RegExp("[a-zA-Z]{2}");
        const validWord = new RegExp("/w+");
        const validNumber = new RegExp("[0-9]+");
        
        const getLanguage = (lang: string) : string[] | undefined => {
            return(
            (lang === null || validLang.exec(lang) === null) ? 
            undefined : 
            validLang.exec(lang)?.some((match) => ISO6391.validate(match))? 
            validLang.exec(lang)?.filter((match) => ISO6391.validate(match))
            : undefined
            )}; //10/10 readable code

        const verifiedFront = getLanguage(frontLang);
        const verifiedBack = getLanguage(backLang);
        const verifiedWords = !words.length || validWord.exec(words) === null ? undefined : validWord.exec(words);
        const verifiedSize = !size || validNumber.exec(size) === null ? undefined : validNumber.exec(size)?.map((match) => parseInt(match));
        const verifiedDestination = destination === "" ? undefined : destination;

        if(verifiedDestination === undefined)
            return "Destination is Required";
        if((verifiedFront === undefined && verifiedBack === undefined && verifiedWords === undefined && verifiedSize === undefined))//10/10 readable code v2
            return "At least one filter is required";
        
        

        return "Added Filter";
            

    }
    console.log();
    
    
    return(
        <div className={css.container}>
            <div className = {css.header}>
                <Text type="heading" bold noWrap className={css.heading}> {folderName} </Text>
            </div>
            <div className = {css.content}>
                <Text type="heading" lineHeight={0.5} bold>Filters</Text>
                <Text type="paragraph">
                    <div className = {css.smallGrid}>
                        <span className = {css.required}>*</span>
                        <span>Destination</span>
                        <select className = {css.filterInput} onChange={(ev) => setDestination(ev.target.value)}>
                        <option value = ''>Select An Option</option>
                        {folders.filter((folder) => folder.id !== curFolder).map((folder) => (
                            <option value = {folder.id}>{folder.name}</option>
                        ))}
                        </select>
                        <span/>Front Language <input className = {css.filterInput} placeholder="ISO6391 2 digit standard" onChange={(ev) => setFrontLang(ev.target.value)}/> {/*been a while since I did regex*/}
                        <span/>Back Language <input className = {css.filterInput} placeholder="ISO6391 2 digit standard" onChange={(ev) => setBackLang(ev.target.value)}/>
                        <span/>Has The Words <input className = {css.filterInput} placeholder="Seperate With Spaces" onChange={(ev) => setWords(" " + ev.target.value)}/>{/*So the first word has a space */}
                    </div>
                    <div className = {css.bigGrid}>
                        Size 
                        <select className = {css.filterInput}>
                            <option>greater than</option>
                            <option>less than</option>
                        </select>
                        <input className = {css.filterInput} placeholder="Number of Characters" onChange={(ev) => setSize(ev.target.value)}/>
                    </div>
                </Text> 
                <div className={css.submit}>
                    <Button noBorder zoomOnHover>
                        <Text type="heading" style = {{color:"gray"}}>Create Filter</Text>
                    </Button>
                </div>
                <Text type="heading" lineHeight={0.5} bold>Active Filters</Text>
            </div>
        </div>
    );
}