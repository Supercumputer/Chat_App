import { NavLink } from "react-router-dom"
const ButtonIconComponent = ({to, icon, onclick}) => {
    return (
        <NavLink
            to={`/${to}`}
            className={({ isActive }) => `w-8 h-8 flex mt-2 rounded-md ${isActive ? "bg-[#0156BD] text-[#fff]" : "bg-transparent text-[#353434] hover:bg-[#0156BD] hover:text-[#fff]"}`
            }
            onClick={onclick}
        >
           <i className={`${icon} m-auto`}></i>
        </NavLink>
       
    )
}

export default ButtonIconComponent