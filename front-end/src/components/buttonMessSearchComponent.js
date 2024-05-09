import { NavLink} from "react-router-dom";

const ButtonMessSearchComponent = ({ to, avatar, name, online, onclick}) => {

    return (
        <NavLink
        to={`/${to}`}
        className={({ isActive }) =>
            `flex gap-2 items-center m-2 rounded-md p-1 ${
            isActive
                ? "bg-blue-500 text-[#fff]"
                : "text-[#353434] hover:bg-blue-500 hover:text-[#fff]"
            }`
        }
        onClick={onclick}
        >
        <div className={`relative ${online ? "before:content-[''] before:block before:p-1 before:bg-[#31A24C] before:absolute before:bottom-0 before:right-1 before:border-2 before:rounded-full" : ""}`}>
            <img
            src={avatar}
            alt=""
            className="w-10 h-10 border-2 object-cover rounded-full"
            />
        </div>
        <div className="flex flex-col">
            <h2 className="font-semibold">{name}</h2>
            <span className="text-xs">{online ? 'Online' : 'Offline'}</span>
        </div>
        </NavLink>
    );
};

export default ButtonMessSearchComponent;
