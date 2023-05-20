import { useState } from "react";
import css from "./index.module.css";
import { Button } from "../../components/Button";
import { Text } from "../../components/Text";
import { Folder, Filter } from "../../storageTypes";
import { Icon } from "../../components/Icon";
import { FilterTable } from "./FilterTable";
import { UseForwardingContext } from "../App";
import { nanoid } from "nanoid";
import ISO6391 from 'iso-639-1';


export const ForwardingPage = ({
    curFolder,
    folders,
    filters,
    addFilter,
    deleteFilter
}: {
    curFolder: string;
    folders: Folder[];
    filters: Filter[] | undefined;
    addFilter: (filter: Filter, folderId: string) => void;
    deleteFilter: (filterId: string[], folderId: string) => void;
}) => {
    const folderName = curFolder === 'root'? "Just Collected" : folders.filter((folder) => folder.id === curFolder)[0].name; //Better implementation?
    const [destination, setDestination] = useState<string>("");
    const [frontLang, setFrontLang] = useState<string>("");
    const [backLang, setBackLang] = useState<string>("");
    const [words, setWords] = useState<string>("");
    const [comparison, setComparison] = useState<string>("");
    const [expand, setExpand] = useState<boolean>(true);  
    const [size, setSize] = useState<string>("");
    const {selectedFilter, setSelectedFilter} = UseForwardingContext();

    const verified:boolean = !!(destination.length && (frontLang.length || backLang.length || words.length || size.length));

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
        const verifiedWords = !words.length || validWord.exec(words) === null ? undefined : validWord.exec(words) as string[];
        const verifiedSize = !size || validNumber.exec(size) === null ? undefined : comparison === '>' ? parseInt(validNumber.exec(size)![0]) : parseInt(validNumber.exec(size)![0])*(-1); //validNumber.exec(size)! cannot be null
        const verifiedDestination = destination === "" ? undefined : destination;

        if(verifiedDestination === undefined)
            return "Destination is not Valid";
        if((verifiedFront === undefined && verifiedBack === undefined && verifiedWords === undefined && verifiedSize === undefined))//10/10 readable code v2
            return "Failed to verify specifiers";
        
        const newFilter: Filter = {
            destination: verifiedDestination,
            frontLang: verifiedFront,
            backLang: verifiedBack,
            words: verifiedWords,
            size: verifiedSize,
            id: nanoid()
        }

        addFilter(newFilter, curFolder);
        return "Added Filter";
    }
    
    const handleBackspace = (ev: React.KeyboardEvent<HTMLDivElement>) => {
        if(ev.key === "Backspace"){
            deleteFilter(selectedFilter.map((filter) => filter.id), curFolder);
            setSelectedFilter([]);
        }
    }
    
    return(
        <div className={css.container} tabIndex={0} onKeyDown = {handleBackspace}>
            <div className = {css.header}>
                <Text type="heading" bold noWrap className={css.heading}> {folderName} </Text>
            </div>
            <div className = {css.content}>
                <Text type="heading" lineHeight={0.5} bold> Create Filter
                <Icon
                    name="expand_more"
                    style={{
                    transform: `rotate(${expand ? 0 : -90}deg)`,
                    transition: ".2s transform",
                    verticalAlign: "middle"
                    }}
                    onMouseDown={() => setExpand(!expand)}
                />
                </Text>
                <div style ={{height: expand? "100%" : 0}} className = {css.addFilter}>
                <Text type="paragraph">
                    <div className = {css.smallGrid}>
                        <span className = {css.required}>*</span>
                        <span>Destination</span>
                        <select className = {css.filterInput} onChange={(ev) => setDestination(ev.target.value)}>
                        <option value = ''>Select An Option</option>
                        {folders.filter((folder) => folder.id !== curFolder).map((folder) => (
                            <option key = {folder.id} value = {folder.id}>{folder.name}</option>
                        ))}
                        </select>
                        <span/>Front Language <input className = {css.filterInput} placeholder="ISO6391 2 digit standard" onChange={(ev) => setFrontLang(ev.target.value)}/> {/*been a while since I did regex*/}
                        <span/>Back Language <input className = {css.filterInput} placeholder="ISO6391 2 digit standard" onChange={(ev) => setBackLang(ev.target.value)}/>
                        <span/>Has The Words <input className = {css.filterInput} placeholder="Seperate With Spaces" onChange={(ev) => setWords(" " + ev.target.value)}/>{/*So the first word has a space */}
                    </div>
                    <div className = {css.bigGrid}>
                        Size 
                        <select className = {css.filterInput} onChange={(ev) => setComparison(ev.target.value)}>
                            <option value='>'>greater than</option>
                            <option value='<'>less than</option>
                        </select>
                        <input className = {css.filterInput} placeholder="Number of Characters" onChange={(ev) => setSize(ev.target.value)}/>
                    </div>
                </Text> 

                <div className={css.submit}>
                    <Button noBorder zoomOnHover disabled = {!verified} onMouseDown={() => alert(createFilter())}>
                        <Text type="heading" style = {{color: verified? "white" : "gray"}}>Create Filter</Text>
                    </Button>
                </div>

                </div>
                <FilterTable filters={filters === undefined ? []: filters} folders={folders}/>
            </div>
        </div>
    );
}