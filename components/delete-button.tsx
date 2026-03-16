import { DeleteContext } from "@/context/deleteContext";
import { IP_ADDRESS } from "@/src/api";
import { AntDesign } from "@expo/vector-icons";
import { useContext } from "react";
import { Alert, Pressable } from "react-native";

type DeleteButtonProps = {
    id: string;
}

export function DeleteButton({ id }: DeleteButtonProps) {
    const { wasDeleted, setWasDeleted, idDeletedPlaylist, setIdDeletedPlaylist } = useContext(DeleteContext);
    const deletePlaylist = async (id: string) => {
        console.log("ëntro aca alguna vezl loko")
        if (!IP_ADDRESS) {
            throw new Error(`Dirección IP no configurada`)
        }
        try {
            console.log("ëntro aca alguna112321321321ko")
            const response = await fetch(
                `http://${IP_ADDRESS}/api/playlist/${id}`,
                {
                    method: 'DELETE'
                }
            );
            console.log("22222222222222222")
            if (!response.ok) {
                if (response.status === 404) {
                    return
                }
                throw new Error(`HTTP Error: ${response.status}`)
            }
        } catch (error) {
            console.error("Error al cargar playlist:", error)
        }
    };

    const handleDelete = (id: string) => {
        try {
            console.log("gdfosakg " + id)
            deletePlaylist(id)
            setIdDeletedPlaylist(parseInt(id))
            setWasDeleted(true)
        } catch (error) {
            Alert.alert('Ha ocurrido un error');
        }
    }

    return (
        <Pressable style={styles.button} onPress={() => handleDelete(id)}>
            <AntDesign color='#ff0000ff' name="delete" size={20}></AntDesign>
        </Pressable>
    );
}

const styles = {
    button: {
        marginRight: 20, 
    },
};