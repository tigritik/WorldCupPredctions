import {useSortable} from "@dnd-kit/sortable";

import { CSS } from "@dnd-kit/utilities";
import {type Team} from "@shared/types.ts";
import {getFlagUrl} from "@shared/utils.ts";
import {useState} from "react";

type TeamRow = {
    team: Team;
    index: number;
};

export default function SortableTeamRow({ team, index }: TeamRow) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: team.id });

    const [isHovered, setIsHovered] = useState(false);

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        background: isDragging ? "#e9ecef" : (isHovered ? "#f5f5f5" : "white"),
        boxShadow: isDragging ? "0 10px 8px rgba(0,0,0,0.50)" : "none",
    };

    return (
        <tr ref={setNodeRef} style={style} {...attributes}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)} >

            <td {...listeners}
                style={{
                    cursor: "grab",
                    marginRight: 8,
                    fontSize: 18,
                    userSelect: "none",
                    width: 50,
                    textAlign: "center",
                    touchAction: "none"
                }}>
                {isHovered ? "☰" : index+1}
            </td>

            <td style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <img
                    src={getFlagUrl(team.code)}
                    alt={team.name}
                    width={35}
                    height={23}
                />
                {team.name}
            </td>
        </tr>
    );
}
