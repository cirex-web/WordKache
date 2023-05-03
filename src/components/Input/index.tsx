import css from "./index.module.css"
interface IInputProps extends React.HTMLProps<HTMLInputElement>{}
export const Input = ({...rest}: IInputProps) =>{
    return <input {...rest} className={css.input}>
    </input>
}