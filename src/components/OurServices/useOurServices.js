import React, { useState } from "react";
import { 
    ScissorsIcon, 
    BrushIcon, 
    HairIcon, 
    WomanHairIcon,
    BeardIcon,
    KidsIcon,
} from "components/Elements/Icons/Index";

const useOurServices = () => {
    const [services, setServices] = useState([
        {
            title: "Стрижка",
            icon: <ScissorsIcon
                height={30}
                width={30}
                color="#fff"
            />,
        },
        {
            title: "Окрашивание",
            icon: <BrushIcon
                height={30}
                width={30}
                color="#fff"
            />,
        },
        {
            title: "Укладка и причёска",
            icon: <HairIcon
                height={30}
                width={30}
                color="#fff"
            />,
        },
        {
            title: "Наращивание волос",
            icon: <WomanHairIcon
                height={30}
                width={30}
                color="#fff"
            />,
        },
        {
            title: "Моделирование бороды",
            icon: <BeardIcon
                height={30}
                width={30}
                color="#fff"
            />,
        },
        {
            title: "Детские стрижки",
            icon: <KidsIcon
                height={30}
                width={30}
                color="#fff"
            />,
        },
    ])

    return {
        services
    }
}

export default useOurServices